/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const getMongoPool = require('../pool.js');

module.exports = class OrganizationLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    create(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Organization;
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

    /**
     * 获取单条数据
     * @return {array}  收费站信息
     */
    single(id) {
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.findOne({orgid: id},  function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
    /**
     * 获取单条数据
     * @return {array}  收费站信息
     */
    singleByIp(host){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Organization;
            doc.findOne({host: host},  function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }

    removeByCode(code){
        return new Promise((resolve, reject) => {
            let doc = getMongoPool().Source;
            doc.remove({code: code}, function (err, Item) {
                if (err) {
                    reject(err);
                } else {
                    resolve(Item);
                }
            });
        });
    }
};