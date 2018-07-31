/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const request = require('request');
const MongoClient = require('mongodb').MongoClient;
const OrganizationLogic = require('../../db/mongo/dao/organization');
const config = require('../../config/config');
const mongoose = require('mongoose');

//module.exports =
module.exports = class DataSyncLogic {
    getLocalMongodb() {
        return config.mongodb.uri;
    }
    /*
    * 获取指定表的最后更新时间
    * @query  {string} docname 文档名称
    * @result {date}           最后更新时间
    * */
    getBaseDocLastDate(docname) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .find({}, {updatetime: 1})
                        .sort({"updatetime": -1})
                        .limit(1).toArray(async (err, items) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            let result = new Date(2000, 1, 1);
                            if (items.length > 0) {
                                result = items[0]['updatetime'];
                            }
                            resolve(result);
                        }
                        db.close();
                    });
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    /*
    * 获取指定表某时间之后的N条数据
    * @query  {string} docname 文档名称
    * @query  {date}   date    时间
    * @query  {int}    count   条数
    * @result {array}          查询到的数据
    * */
    getBaseDocNewData(docname, date,count) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .find({"updatetime": {$gt: date}})
                        .limit(count)
                        .toArray(async (err, items) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(items);
                        }
                        db.close();
                    });
                });
            } catch (err) {
                reject(err)
            }
        });
    };

    removeBaseDocData(docname, datas){
        let ids = [];
        for(let data of datas){
            ids.push(data['_id']);
        }

        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .remove({"_id": {$in: ids}},async (err, items) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(items);
                            }
                            db.close();
                        });
                });
            } catch (err) {
                reject(err)
            }
        });
    }
    /*
    * 向指定文档添加多条数据
    * @query  {string} docname 文档名称
    * @query  {object} datas   多条数据
    * */
    async addBaseDocNewData(docname, datas){
        for(let data of datas){
            data['_id'] = mongoose.Types.ObjectId(data['_id']);
        }

        // 删除掉已经存在的旧数据
        await this.removeBaseDocData(docname, datas);

        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .insertMany(datas,async (err, items) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(items);
                            }
                            db.close();
                        });
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    /*
    * 获取某文档的多条数据
    * @query  {string} docname 文档名称
    * @query  {object} ids     数据ID
    * */
    async getBaseDocDatas(docname, ids){
        // 日了，非要转一次ObjectID,不然_id:{$in:ids}找不到
        let oids=[];
        for(let id of ids){
            oids.push( mongoose.Types.ObjectId(id));
        }

        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .find({"_id": {$in: oids}})
                        .toArray(async (err, items) => {
                            if (err) {
                                reject(err);
                            }
                            else {
                                resolve(items);
                            }
                            db.close();
                        });
                });
            } catch (err) {
                reject(err)
            }
        });
    }

    /*
    * 向指定收费站下发数据
    * @query  {string} docname 文档名称
    * @query  {object} ids     数据ID
    * */
    async sendBaseDocDatas(orgid, docname, ids){
        let orgLogic = new OrganizationLogic();
        let orgItem = await orgLogic.single(orgid);
        let datas = await this.getBaseDocDatas(docname, ids);

        let body = {"docname":docname, datas:datas};

        let options = {
            method: 'post',
            url: `http://${orgItem.host}` + ':4998/nsop/datasync/api/async',
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body:body
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
