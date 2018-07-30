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
    * any > 中心，获取源码详情
    * @query  {string} id      数据ID
    * @return {object}         单条数据
    * */
    router.get('/organizations', async(ctx)=>{
            let items = await orgLogic.list();
            ctx.body = {code: 200, data: items};

    });

    /*
    * 中心 > 中心，删除
    * @query  {string} ids     多条数据ID
    * @return {object}         单条数据
    * */
    router.delete('/organizations', async(ctx)=>{
        console.log('organizations',ctx.request.body);
        let items = await orgLogic.removeByIds(ctx.request.body);
        ctx.body = {code: 200, data: items};

    });

    /*
    * 管理系统 > 中心, 新增源码版本数据
    * @query  {object} body    源码数据
    * @return {object}         操作结果
    * */
    router.post('/organizations', async(ctx)=>{
        let ok = tools.required(ctx, ['orgid','code','name','parentid','host']);
        if (ok) {
            let body = ctx.request.body;
            let item = await orgLogic.create(body);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
        * 收费站 > 中心, 注册新机构
        * @query  {object} body    源码数据
        * @return {object}         操作结果
        * */
    router.post('/org/report', async(ctx)=>{
        let ok = tools.required(ctx, ['code','name','host']);
        if (ok) {
            let body = ctx.request.body;
            console.log(body.centerip);
            let parent = await orgLogic.singleByIp(body.centerip);

            if(parent){
                await orgLogic.removeByCode(body.code);

                let data = {
                    orgid:`${parent.orgid}.${body.code}`,
                    code:body.code,
                    type:1,
                    name:body.name,
                    parentid:parent.orgid,
                    host:body.host
                };
                let item = await orgLogic.create(data);
                ctx.body = {code: 200, data: item};

            }else{
                ctx.body = {code: 404, data: '无法查找到中心数据！'};
            }
        }
    });
};