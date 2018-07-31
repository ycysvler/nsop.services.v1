const VehicleLogic = require('../../db/mongo/dao/vehicle');
const moment = require('moment');
const request = require('request');
const DataSyncLogic = require('../logic/datasynclogic');

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
    let date = await dslogic.getBaseDocLastDate('vehicles');

    console.log(date);
}


ttt();