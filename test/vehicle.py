#!/usr/bin/python
# -*- coding: UTF-8 -*-

import requests
import json

# 上传图片计算特征值
url = 'http://192.168.1.101:4000/vehicle/api/upload'
files = {'image': ('01.jpg', open('./01.jpg', 'rb'), 'image/jpeg')}
r = requests.post(url, files=files)
# 打印结果
print(r.json())

ve = {
"platenumber":"京A98093",
"platecolor":"black",
"vehiclebrand":"本田",
"vehiclemodel":"管道",
"vehicleyear":"2018",
"vehiclemaker":"广汽本田",
"vehiclecolor":"blue",
"vehicletype":"1class",
"vehiclescore":0.87
}

vehicle = json.loads(r.text)['data']

print(vehicle)
r = requests.post('http://localhost:4997/nsop/basedata/api/vehicle', data = vehicle)

print(r.json())