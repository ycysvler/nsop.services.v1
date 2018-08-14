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
const uzip = require('../../utils/uzip');
const SourceLogic = require('../../db/mongo/dao/source');
const OrgSourceLogic = require('../../db/mongo/dao/orgsource');
const CurrentLogic = require('../../db/mongo/dao/current');
const DataSyncLogic = require('../../datasync/logic/datasynclogic');

module.exports = class HaMasterLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    async update(id){
        let sourceLogic = new SourceLogic();
        let orgsLogic = new OrgSourceLogic();

        // 查找版本信息
        await sourceLogic.remove(id);

        let source = null;

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
        let zippath = await this.downloadZip(source);

        console.log('zippath', zippath);

        if(fs.existsSync(zippath)){
            // 停 pm2
            for(let cmd of source.services){
                console.log('stop', cmd);
                await tools.pm2(cmd.stop);
            }
            // unzip
            await uzip(zippath, source.targetpath);
            // 起 pm2
            for(let cmd of source.services){
                console.log('start', cmd);
                await tools.pm2(cmd.start);
            }
            // update complete
            state = 1;

        }else{
            state = -1;     // 下载失败
        }

        // 更新 orgsource
        let newdata = {state:state};
        if(state === 1){
            newdata.cversion = source.version;
        }
        await orgsLogic.update(orgsource._id, newdata);
        // 同步 orgsource 到 中心
        let current = await new CurrentLogic().single();
        let dSyncLogic = new DataSyncLogic();
        let result = await dSyncLogic.sendBaseDocDatas(current.orgid,'orgsources', [orgsource._id]);

        return result;

    }

    async downloadZip(source){
        let zipurl = `http://${config.parent.host}:${config.server.hamaster.port}${source.sourcepath}`;
        // 压缩包文件名
        let filename = path.basename(source.sourcepath);
        // 临时存放目录
        let temppath = path.join(__dirname, `../public/sources/${source.type}/${source.version}/`);

        await tools.mkdir(temppath);
        // 全路径
        let fullpath = `${temppath}${filename}`;
        // 下载
        await download(zipurl, fullpath);

        return fullpath;//source.targetpath + filename;

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
