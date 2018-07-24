/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const SourceLogic = require('../../db/mongo/dao/source');
const config = require('../../config/config');

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
        // 查找版本信息
        let source = await sourceLogic.single(id);

        console.log(source);
        if(!source){
            // 如果不存在，去服务器端获取
            source = await getSourceById(id);
        }

        // 查找 orgsource
        let orgsource = "";

        if(!orgsource){
            // 创建orgsource
        }

        // 更新 orgsource tversion, state , updatetime

        // 下载 zip

        // 停 pm2

        // unzip

        // 起 pm2

        // 更新 orgsource

        // 同步 orgsource 到 中心

        return "hello";

    }

    async getSourceById(id){
        let options = {
            method: 'get',
            url: `http://${config.parent.host}:${config.server.hamaster.port}/nsop/hamaster/api/source`,
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body:body
        };
    }
};