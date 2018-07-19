/**
 * 源码管理操作
 *
 * Created by VLER on 2018/7/18.
 */
const path = require('path');
const fs = require('fs');
const tools = require('../../../utils/tools');
const uploadFile = require('../../../utils/upload');
const OrganizationLogic = require('../../../db/mongo/dao/organization');
const orgLogic = new OrganizationLogic();

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
    * 管理系统 > 中心, 新增源码版本数据
    * @query  {object} body    源码数据
    * @return {object}         操作结果
    * */
    router.post('/organization', async(ctx)=>{
        let ok = tools.required(ctx, ['orgid','code','name','parentid','host']);
        if (ok) {
            let body = ctx.request.body;
            let item = await orgLogic.create(body);
            ctx.body = {code: 200, data: item};
        }
    });


};