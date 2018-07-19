/**
 * 源码管理操作
 *
 * Created by VLER on 2018/7/18.
 */
const path = require('path');
const fs = require('fs');
const DataSyncLogic = require('../../logic/datasynclogic.js');
const tools = require('../../../utils/tools');

module.exports = function(router){
    /*
    * any > 中心，获取源码详情
    * @query  {string} id      数据ID
    * @return {object}         单条数据
    * */
    router.get('/organization', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);
        if (ok) {
            let id = ctx.request.query['id'];
            let item = await orgLogic.single(id);
            ctx.body = {code: 200, data: item};
        }
    });


    /*
   * any > 中心，获取源码详情
   * @query  {string} id      数据ID
   * @return {object}         单条数据
   * */
    router.post('/async', async(ctx)=>{
        let dsLogic = new DataSyncLogic();
        let ok = tools.required(ctx, ['docname']);
        if (ok) {
            let docname = ctx.request.body['docname'];
            let datas = ctx.request.body['datas'];
            let item = await dsLogic.addBaseDocNewDate(docname, datas);
            ctx.body = {code: 200, data: item};
        }
    });
};