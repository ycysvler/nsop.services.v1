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
    getParentHost() {
        return '127.0.0.1';
    }

    getLocalMongodb() {
        return config.mongodb.uri;
    }

    getBaseDocLastData(docname) {
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

    getBaseDocNewData(docname, date) {
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .find({"updatetime": {$lt: date}})
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

    addBaseDocNewData(docname, datas){

        for(let data of datas){
            data['_id'] = mongoose.Types.ObjectId(data['_id']);
        }

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

    async getBaseDocDatas(docname, ids){
        let self = this;
        return new Promise(async (resolve, reject) => {
            try {
                let url = self.getLocalMongodb();
                MongoClient.connect(url, function (err, db) {
                    if (err) throw err;
                    let dbo = db.db("nsop_base");
                    dbo.collection(docname)
                        .find({"_id": {$in: ids}})
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

    async sendBaseDocDatas(orgid, docname, ids){
        let orgLogic = new OrganizationLogic();
        let orgItem = await orgLogic.single(orgid);
        let datas = await this.getBaseDocDatas(docname, ids);

        let body = {"docname":docname, datas:datas};

        let options = {
            method: 'post',
            url: `http://${orgItem.host}` + '/nsop/datasync/api/async',
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

async function tt() {
    let logic = new DataSyncLogic();
    // let data = await logic.getBaseDocLastDate("organizations");
    // console.log(data);
    // console.log(typeof data);
    // let result = await logic.getBaseDocNewDate("organizations", '2018-07-18T07:57:21.387Z');
    let result = await logic.addBaseDocNewDate("organizations",[{
        "_id" : "5b4ef22a86d3924074b18f75",
            "orgid" : "043",
            "code" : "0",
            "type" : -1,
            "name" : "吉林",
            "parentid" : "0",
            "host" : "127.0.0.1",
            "updatetime" : new Date(),
            "__v" : 0
    }]);



    console.log(result);
}
