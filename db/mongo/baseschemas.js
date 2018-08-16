const config = require('../../config/config');
const mongoose = require('mongoose');

module.exports = class Schemas {
    constructor() {
        let uri = config.mongodb.uri + 'nsop_base';
        let conn = mongoose.createConnection(uri, config.mongodb.options);

        conn.then(function (db) {
            console.log("nsop.base mongodb connected!");
        });

        // 收费站表
        this.organizationSchema = new mongoose.Schema({
            orgid: {type: String, index: {unique: true, dropDups: true}},   // 收费站ID：[区号][code]
            code: {type: String, index: {unique: true, dropDups: true}},    // 编号
            type: {type: Number},                                           // 0 中心， 1 收费站
            name: String,                                                   // 收费站名称
            parentid: {type: String},                                        // 上级ID
            host: {type: String},                                            // IP地址
            updatetime: {type: Date, index: true}                            // 更新时间
        });
        this.Organization = conn.model('Organization', this.organizationSchema);


        // 源码表
        this.sourceSchema = new mongoose.Schema({
            type: {type: String},                   // 类型
            version: {type: String},                // 版本
            describe: String,                       // 描述
            services: Array,                         // 对应的服务列表
            sourcepath: {type: String},              // 源码压缩包位置
            targetpath: {type: String},              // 覆盖目标位置
            updatetime: {type: Date, index: true}    // 更新时间
        });
        this.Source = conn.model('Source', this.sourceSchema);

        // 源码表
        this.orgsourceSchema = new mongoose.Schema({
            orgid: {type: String, index: true},
            type: {type: String},                           // 类型
            cversion: {type: String},                       // 当前版本
            tversion: {type: String},                       // 目标版本
            state: {type: Number},                          // 0 等待更新、1 更新成功、 -1 更新失败
            updatetime: {type: Date, index: true}            // 更新时间
        });
        this.OrgSource = conn.model('OrgSource', this.orgsourceSchema);

        // 当前收费站
        this.currentSchema = new mongoose.Schema({
            orgid: {type: String, index: {unique: true, dropDups: true}},   // 收费站ID：[区号][code]
            code: {type: String, index: {unique: true, dropDups: true}},    // 编号
            type: {type: Number},                                           // 0 中心， 1 收费站
            name: String,                                                   // 收费站名称
            parentid: {type: String},                                        // 上级ID
            parentip:{type:String},                                          // 上级IP
            host: {type: String},                                            // IP地址
            updatetime: {type: Date, index: true}                            // 更新时间
        });
        this.Current = conn.model('Current', this.currentSchema);


        // 源码表
        this.vehicleSchema = new mongoose.Schema({
            platenumber: {type: String, index: {unique: true, dropDups: true}},     // 车牌号码
            platecolor: {type: String},                         // 车牌颜色
            vehiclebrand: {type: String},                       // 品牌
            vehiclemodel: {type: String},                       // 型号
            vehicleyear: {type: String},                        // 年款
            vehiclemaker: {type: String},                       // 厂家
            vehiclecolor: {type: String},                       // 车辆颜色
            vehicletype: {type: String},                        // 车辆分类
            vehiclescore: {type: Number},                       // 车型置信度
            updatetime: {type: Date, index: true}               // 更新时间
        });
        this.Vehicle = conn.model('Vehicle', this.vehicleSchema);

        // 源码表
        this.monitorSchema = new mongoose.Schema({
            orgid: {type: String},                              // 节点ID
            type: {type: String},                               // 服务类型
            updatetime: {type: Date}                            // 更新时间
        });
        this.Monitor = conn.model('Monitor', this.monitorSchema);

        this.dialingSchema = new mongoose.Schema({
            orgid: {type: String},                              // 节点ID
            type: {type: String},                               // 服务类型
            port:{type:Number}                                  // 端口号
        });
        this.Dialing = conn.model('Dialing', this.dialingSchema);

    }
};

