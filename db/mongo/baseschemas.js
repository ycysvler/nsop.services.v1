const config = require('../../config/config');
const mongoose = require('mongoose');

module.exports = class Schemas{
    constructor(){
        let uri = config.mongodb.uri + 'nsop_base';
        let conn = mongoose.createConnection(uri, config.mongodb.options);

        conn.then(function(db) {
            console.log("nsop.base mongodb connected!");
        });

        // 收费站表
        this.organizationSchema = new mongoose.Schema({
            orgid: {type: String, index: {unique: true, dropDups: true}},   // 收费站ID：[区号][code]
            code: {type: String, index: {unique: true, dropDups: true}},    // 编号
            type: {type: Number},                                           // 0 中心， 1 收费站
            name: String,                                                   // 收费站名称
            parentid:{type: String},                                        // 上级ID
            host:{type: String},                                            // IP地址
            updatetime: {type: Date,index: true}                            // 更新时间
        });
        this.Organization = conn.model('Organization', this.organizationSchema);


        // 源码表
        this.sourceSchema = new mongoose.Schema({
            type: {type: String},                   // 类型
            version: {type: String},                // 版本
            describe: String,                       // 描述
            sourcepath:{type: String},              // 源码压缩包位置
            targetpath:{type: String},              // 覆盖目标位置
            updatetime: {type: Date,index: true}    // 更新时间
        });
        this.Source = conn.model('Source', this.sourceSchema);
    }
};

