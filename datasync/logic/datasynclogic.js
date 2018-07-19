/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');
const MongoClient = require('mongodb').MongoClient;
const config = require('../../config/config');

//module.exports =
class DataSyncLogic {
    getParentHost() {
        return '127.0.0.1';
    }

    getLocalMongodb() {
        return config.mongodb.uri;
    }

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

    getBaseDocNewDate(docname, date) {
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
}

async function tt() {
    // MongoClient.connect('mongodb://nsop.mongodb/',  function (err, db) {
    //     if (err) throw err;
    //
    //     var dbo = db.db("nsop_base");
    //
    //     //console.log(dbo);
    //
    //     dbo.collection('organizations')
    //         .find({} ).toArray( async (err, item) => {
    //             if (err) {
    //                 console.log(err);
    //
    //             }
    //             else {
    //                 console.log(item);
    //
    //             }
    //             db.close();
    //         });
    // });

    let logic = new DataSyncLogic();
    let data = await logic.getBaseDocLastDate("organizations");
    console.log(data);
    console.log(typeof data);
    let result = await logic.getBaseDocNewDate("organizations", '2018-07-18T07:57:21.387Z');

    console.log(result);
}

tt();