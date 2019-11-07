import sys
sys.path.insert(0, './OCR')
import cv2
import sqlite3
from sqlite3 import Error
import json
import math
import os
from recognizer import *

REGISTERED_IMAGE = './react-app/public/temp/finalimage.png'
UPLOAD_FOLDER = './react-app/public/temp/blocks'
DATABASE = './user.db'

def create_connection(filename):
    try:
        conn = sqlite3.connect(filename)
        return conn
    except Error as e:
        print(e)
    return none
    

def get_data(tid,model,mapping):
    conn = create_connection(DATABASE)
    cur = conn.cursor()
    cur.execute("SELECT * FROM field WHERE templateid is "+tid)

    im = cv2.imread(REGISTERED_IMAGE)
    x = im.shape[1]
    y = im.shape[0]
    
    columns =   []
    columndata = []
    rows = cur.fetchall()
    for row in rows:
        print(row)

        id = row[0]
        name = row[1]
        box_count = row[4]

        columns.append(name)

        left  = row[9]
        right  = row[10]
        top  = row[11]
        bottom  = row[12]

        x1 = math.ceil((left/100)*x)
        x2 = math.ceil((right/100)*x)
        y1 = math.ceil((top/100)*y)
        y2 = math.ceil((bottom/100)*y)

        block = im[y1:y2,x1:x2]
        cv2.imwrite(os.path.join(UPLOAD_FOLDER,"{}.png".format(id)),block)

        block_height = block.shape[0]
        block_width = block.shape[1]
        box_width = block_width/ box_count

        data = ""
        for i in range(box_count):
            s = round(i*box_width)
            e = round((i+1)*box_width)

            box = block[0:block_height, s:e]
            cv2.imwrite(os.path.join(UPLOAD_FOLDER,"{}.png".format(str(id)+" "+str(i))), box)
            data+=predict(box,model,mapping)
        
        columndata.append(data)

    sql = 'INSERT INTO "'+str(tid)+'"("'+'","'.join(columns)+'") values('+",".join(["?"]*len(columns))+')'
    print(sql)
    cur.execute(sql,tuple(columndata))
    conn.commit()
    return cur.lastrowid