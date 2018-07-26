/**
 * Created by VLER on 2018/7/1.
 */
const fs = require("fs");
const os = require('os');
const path = require('path');
const moment = require('moment');
const request = require('request');
const tools = require('../../utils/tools');
const config = require('../../config/config');


module.exports = class SetupLogic {

    getIps(){
        let IPv4s = [];
        for(let item of os.networkInterfaces().en0){
            if(item.family === 'IPv4')
                IPv4s.push(item.address);
        }

        return IPv4s;
    }

    async init(id){
        let sourceLogic = new SourceLogic();
        let orgsLogic = new OrgSourceLogic();

        // 查找版本信息
        await sourceLogic.remove(id);


        // 更新 orgsource
        let newdata = {state:state};
        if(state === 1){
            newdata.cversion = source.version;
        }
        await orgsLogic.update(orgsource._id, newdata);
        // 同步 orgsource 到 中心
        return "hello";

    }


};