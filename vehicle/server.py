#coding=utf-8
import sys
import os
import time
import json
import urllib
import heartbeat

from flask import Flask,request ,Response

# 下面是Http处理部分
app = Flask(__name__)

@app.route('/hreartbeat')
def heartbeat():
    return Response(json.dumps({"code":200,"data":time.strftime('%Y-%m-%d %H:%M:%S', time.localtime(time.time()))}),mimetype='application/json')

@app.route('/caculator')
def caculator():
    # 声明特征返回值
    result = None
    return Response(json.dumps({"code":200}),mimetype='application/json')


if __name__ == '__main__':
    app.run(debug=False,host='0.0.0.0', port=7777)