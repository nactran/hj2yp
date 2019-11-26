#coding:utf-8

import os
import re
import json


path = 'data'

def dict2Json(dict:dict,outputPath:str = 'output',fileName:str = 'output.json'):
    if not os.path.exists(outputPath):
        os.mkdir(outputPath)
    with open(outputPath+ '/' +fileName, 'w',encoding='utf-8') as fw:
        json.dump(dict,fw,ensure_ascii=False,)

def readTXTFile(fileName:str) ->dict:
    countDict = {}
    with open(path + '/' +fileName, 'r') as filein:
        for line in filein:
            lineList = line.strip('\n').split()
            c = lineList[0]
            p = lineList[-1]
            rmk = re.search(r'\[3:?(.*?)\]',p)
            p = re.sub(r'\[.*?\]','',p)
            if rmk and rmk.groups()[0]:
                p = '[' + rmk.groups()[0] + ']' + p
            if c not in countDict:
                countDict[c] = [p]
            else:
                countDict[c].append(p)
    return countDict

if __name__ == '__main__':

    d = readTXTFile('同音字字典.txt')
    dict2Json(d)

