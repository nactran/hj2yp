// server.js
// where your node app starts

// init project
const express = require("express");
const app = express();
const http = require("http");
const Telegraf = require("telegraf");

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  app.get("/", (request, response) => {
    console.log(Date.now() + " Ping Received");
    response.sendStatus(200);
  });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + process.env.PORT);
});
setInterval(() => {
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
}, 280000);

//Initialize data base.
const _ = require("lodash/object");
var fs = require("fs");
const crc32 = require("./rdm.js").crc32;
//Load dictioanry
var dict = JSON.parse(fs.readFileSync("dict.json"));
//console.log(dict["絕"]);

//Initialize bot
const bot = new Telegraf(process.env.BOT_TOKEN);

//Debug info - for initialization
/*
bot.telegram.getMe().then((bot_informations) => {
    bot.options.username = bot_informations.username;
    console.log("Server has initialized: "+bot_informations.username);
});
*/

//Debug info - for messages
bot.use((ctx, next) => {
  const start = new Date();
  return next(ctx).then(() => {
    const ms = new Date() - start;
    console.log("Response time %sms", ms);
    console.log(
      "update type: " +
        ctx.updateType +
        "\n" +
        "update subtype: " +
        ctx.updateSubTypes
    );
    //console.log("chat info:" + ctx.chat.id);//the same as sender id
    console.log("sender username:" + ctx.from.username);
    console.log("sender id:" + ctx.from.id);
  });
});

//Handling commands
bot.start(ctx => ctx.reply("向我發送一個漢字，我會告訴你它所有可能的粤語讀音（僅支持繁體中文）"));
bot.help(ctx => ctx.reply("請向我發送要查詢的漢字（僅支持繁體中文）"));
//bot.command('start', (ctx) => ctx.reply('Bot started.')) //bot.start is pirior to this

function handleQuery(text) {
  if (text.length > 0) {
    const maxlen = text.length < 64 ? text.length : 64;
    var tmp = "";
    for (var i = 0; i < maxlen; i++) {
      tmp = tmp + text.charAt(i) + ": ";
      var res = dict[text.charAt(i)];
      if (res != undefined) {
        res.forEach(item => (tmp = tmp + item + ";"));
      }
      tmp += "\n";
    }
    return tmp;
  } else return "查詢字串為空\n";
}

//on: Registers middleware for provided update type.
bot.on("sticker", ctx => ctx.reply("請向我發送要查詢的漢字（僅支持繁體中文）"));

bot.on("text", ctx => {
  console.log(ctx.message.text);
  ctx.replyWithHTML(handleQuery(ctx.message.text)); //repeat what user sent
});

bot.on("inline_query", ctx => {
  const q = ctx.inlineQuery.query;
  console.log(q);
  var results = [];

  results = [
    {
      type: "article",
      id: crc32(q),
      title: "查詢結果",
      description: q,
      input_message_content: {
        message_text: q
      },
      thumb_url:
        "https://cdn.glitch.com/9d1f90c8-b5d9-484a-92fc-fb3f53f38a08%2Favatar.png?v=1574873618584"
    }
  ];
  console.log(JSON.stringify(results));
  ctx.answerInlineQuery(results);
});
//error handling
bot.catch((err, ctx) => {
  console.log(`Ooops, ecountered an error `, err);
});

//bot.hears: Registers middleware for handling text messages
//bot.hears('hi', (ctx) => ctx.reply('Hey there'))

bot.launch();
