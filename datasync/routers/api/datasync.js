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

    router.get('/newdatas', async(ctx)=>{
        let dsLogic = new DataSyncLogic();
        let ok = tools.required(ctx, ['docname','date','count']);
        if (ok) {
            let docname = ctx.request.query['docname'];
            let date = ctx.request.query['date'];
            let count = parseInt(ctx.request.query['count']);

            date = new Date();
            date.setDate(3);
            let item = await dsLogic.getBaseDocNewData(docname,date,count);
            ctx.body = {code: 200, data: item};
        }
    });


    /*
    * 远端 > 本地，同步数据
    * @query  {string} docname 文档名称
    * @query  {object} datas   多条数据
    * */
    router.post('/async', async(ctx)=>{
        let dsLogic = new DataSyncLogic();
        let ok = tools.required(ctx, ['docname']);
        if (ok) {
            let docname = ctx.request.body['docname'];
            let datas = ctx.request.body['datas'];
            let item = await dsLogic.addBaseDocNewData(docname, datas);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * 本地 > 远端，发送同步数据
    * @query  {string} orgid   远端节点ID
    * @query  {string} docname 文档名称
    * @return {object} ids     数据ID
    * */
    router.post('/send', async(ctx)=>{

        let dsLogic = new DataSyncLogic();
        let ok = tools.required(ctx, ['docname']);
        if (ok) {
            let orgid = ctx.request.body['orgid'];
            let docname = ctx.request.body['docname'];
            let ids = ctx.request.body['ids'];

            let item = await dsLogic.sendBaseDocDatas(orgid, docname, ids);
            ctx.body = {code: 200, data: item};
        }
    });
};