#!/usr/bin/python
# -*- coding: UTF-8 -*-

import requests

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
r = requests.post('http://localhost:4997/nsop/basedata/api/vehicle', data = ve)

print(r.json())