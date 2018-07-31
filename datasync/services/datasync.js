const moment = require('moment');
const request = require('request');
const VehicleLogic = require('../../db/mongo/dao/vehicle');
const DataSyncLogic = require('../logic/datasynclogic');
const CurrentLogic = require('../../db/mongo/dao/current');

let vLogic = new VehicleLogic();

async function run() {
    for(let i=0;i<1000;i++){
        let data = {
            platenumber:`京${i}`,
            platecolor:'red',
            vehiclebrand:'bmw',
            vehiclemodel:'crv',
            vehicleyear:'2015',
            vehiclemaker:'bmw',
            vehiclecolor:'black',
            vehicletype:'suv',
            vehiclescore:1
        };
        await vLogic.create(data);
    }
}

//run();

async function ttt(){
    let dslogic = new DataSyncLogic();
    let clogic = new CurrentLogic();
    // 找中央节点
    let cNode =await clogic.single();
    if(cNode){
        // 找本地最新时间
        let date = await dslogic.getBaseDocLastDate('vehicles'); 
        // 拉取100条
        let result = await requestNewDatas(cNode.parentip, 'vehicles', moment(date).valueOf(), 10); 
        // 写本地库
        let result1 = await dslogic.addBaseDocNewData('vehicles', result.data);
        //console.log(result1);
    }
}

async function requestNewDatas(ip,docname, date, count){
    let options = {
        method: 'get',
        url: `http://${ip}:4998/nsop/datasync/api/newdatas?docname=${docname}&date=${date}&count=${count}`,
        json: true,
        headers: {
            "content-type": "application/json",
        }
    };

    console.log('url', options.url);

    return new Promise((resolve, reject) => {
        try {
            request(options, function (err, res, body) {
                if (err) {
                    reject(err);
                }else {
                    resolve(body);
                }
            });
        } catch (err) {
            reject(err)
        }
    });
}

ttt();
