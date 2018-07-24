/**
 * Created by VLER on 2018/7/1.
 */
const fs = require("fs");
const path = require('path');
const moment = require('moment');
const request = require('request');
const tools = require('../../utils/tools');
const config = require('../../config/config');
const download = require('../../utils/download');
const SourceLogic = require('../../db/mongo/dao/source');
const OrgSourceLogic = require('../../db/mongo/dao/orgsource');


module.exports = class HaMasterLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    update(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Source;
                let item = new Doc(data);
                item.updatetime = new moment();

                item.save(async(err, item) => {
                    if (!err) {
                        resolve(item);
                    } else {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    async update1(id){
        let sourceLogic = new SourceLogic();
        let orgsLogic = new OrgSourceLogic();

        // 查找版本信息
        let source = await sourceLogic.single(id);

        if(!source){
            // 如果不存在，去服务器端获取
            source = await this.getSourceById(id);
            // 写入本地版本库
            source = await sourceLogic.create(source.data);
        }

        let orgid = tools.getCurrentOrgID();
        // 查找 orgsource
        let orgsource = await orgsLogic.single(orgid, source.type);

        if(!orgsource){
            // 创建orgsource
            orgsource = {orgid:orgid, type:source.type, tversion:source.version, state:0};
            orgsource = await orgsLogic.create(orgsource);
        }else{
            // 更新 tversion, state , updatetime
            orgsource = await orgsLogic.updateTarget(orgsource._id, source.version, 0);
        }

        let state = 0;      // 准备更新

        // 下载 zip
        let downd = await this.downloadZip(source);

        if(downd){

        }else{
            state = -1;     // 下载失败
        }

        // 停 pm2

        // unzip

        // 起 pm2

        // 更新 orgsource
        let newdata = {state:state};
        if(state === 1){
            newdata.cversion = source.version;
        }
        await orgsLogic.update(orgsource._id, newdata);
        // 同步 orgsource 到 中心
        return "hello";

    }

    async downloadZip(source){
        let zipurl = `http://${config.parent.host}:${config.server.hamaster.port}${source.sourcepath}`;

        await tools.mkdir(source.targetpath);

        let filename = path.basename(source.sourcepath);
        await download(zipurl, source.targetpath + filename);

        return fs.existsSync(source.targetpath + filename);
    }

    /**
     * 从服务器获取版本信息
     * @param  {string} id     数据ID
     * @return {object}        source数据
     */
    async getSourceById(id){
        let options = {
            method: 'get',
            url: `http://${config.parent.host}:${config.server.hamaster.port}/nsop/hamaster/api/source/${id}`,
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
                reject(err)
            }
        });
    }
};