/**
 * 源码管理操作
 *
 * Created by VLER on 2018/7/18.
 */
const path = require('path');
const fs = require('fs');
const tools = require('../../../utils/tools');
const VehicleLogic = require('../../../db/mongo/dao/vehicle');

module.exports = function(router){
    /*
    * any > 中心，获取源码详情
    * @query  {string} id      数据ID
    * @return {object}         单条数据
    * */
    router.get('/vehicle', async(ctx)=>{
        let logic = new VehicleLogic();
        let ok = true;
        if (ok) {
            let platenumber = ctx.request.query['platenumber'];
            let pageSize = parseInt(ctx.request.query.pagesize ? ctx.request.query.pagesize : 10);
            let pageIndex = parseInt(ctx.request.query.pageindex ? ctx.request.query.pageindex : 1);


            let item = await logic.list(platenumber, pageSize, pageIndex);
            ctx.body = {code: 200, data: item};
        }
    });



};
