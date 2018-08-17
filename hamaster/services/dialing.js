const moment = require('moment');
const request = require('request');
const config = require('../../config/config');
const HeartBeat = require('../../utils/heartbeat');
const DialingLogic = require('../../db/mongo/dao/dialing');
const OrganizationLogic = require('../../db/mongo/dao/organization');
const HaMasterLogic = require('../logic/hamasterlogic');

// let heartBeat = new HeartBeat(60000, 'dialing');
// heartBeat.run();

let orgMap = {};

async function initOrgMap(){
    let logic = new OrganizationLogic();
    let items = await logic.list();
    for(let item of items){
        orgMap['orgid.'+item.orgid] = item;
    }
}

async function dialing(host, port, path){
    let options = {
        method: 'get',
        url: `http://${host}:${port}${path}`,
        json: true,
        headers: {
            "content-type": "application/json",
        }
    };

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
            reject(err);
        }
    });
}

async function run(){
    let dlogic = new DialingLogic();
    let hlogic = new HaMasterLogic();
    let items = await dlogic.list();

    for(let item of items){
        let org = orgMap['orgid.' + item.orgid];
        if(org){
            let host = org.host;
            let port = item.port;
            let type = item.type;
            let path = item.path;

            let result = await dialing(host, port, path);

            if(result !== 'Not Found'){
                hlogic.heartbeat(item.orgid, type, {
                    type:type,orgid:item.orgid, updatetime: moment()
                });
            }else{
                hlogic.heartbeat(item.orgid, type, {
                    type:type,orgid:item.orgid, updatetime:moment("2000-01-01","YYYY-MM-DD")
                });
            }
            console.log(type, host, port, result.code, result.date);
        }
    }

    setTimeout(run, 60000);
}

initOrgMap();
run();
