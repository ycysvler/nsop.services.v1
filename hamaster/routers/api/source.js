/**
 * 源码管理操作
 *
 * Created by VLER on 2018/7/18.
 */
const path = require('path');
const fs = require('fs');
const tools = require('../../../utils/tools');
const uploadFile = require('../../../utils/upload');
const SourceLogic = require('../../../db/mongo/dao/source');
const HaMasterLogic = require('../../logic/hamasterlogic');
const sourceLogic = new SourceLogic();
const haLogic = new HaMasterLogic();

module.exports = function(router){
    router.get('/hello', async(ctx)=>{
        ctx.body = {"name":"hello"};
    });

    router.get('/views', async(ctx)=>{
        await ctx.render('index',{title:'ttt'});

    });

    /*
    * any > 中心，获取源码详情
    * @query  {string} id      数据ID
    * @return {object}         单条数据
    * */
    router.get('/source', async(ctx)=>{
        let ok = true;
        if (ok) {
            let item = await sourceLogic.list();
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * any > 中心，获取源码详情
    * @query  {string} id      数据ID
    * @return {object}         单条数据
    * */
    router.get('/source/:id', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);
        if (ok) {
            let id = ctx.params.id;
            let item = await sourceLogic.single(id);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * 管理系统 > 中心, 新增源码版本数据
    * @query  {object} body    源码数据
    * @return {object}         操作结果
    * */
    router.post('/source', async(ctx)=>{
        let ok = tools.required(ctx, ['type','version']);
        if (ok) {
            let body = ctx.request.body;
            let item = await sourceLogic.create(body);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * 管理系统 > 中心, 新增源码版本数据
    * @query  {object} body    源码数据
    * @return {object}         操作结果
    * */
    router.post('/source/:id/services', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);
        if (ok) {
            let id = ctx.params.id;
            let body = ctx.request.body;
            let item = await sourceLogic.updateservices(id,body);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * 管理系统 > 中心, 上传压缩包
    * @query  {object} body    源码数据
    * @return {object}         操作结果
    * */
    router.post('/source/file', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);

        if(ok){
            let id = ctx.request.query['id'];
            let item = await sourceLogic.single(id);

            let serverFilePath = path.join(__dirname, '../../public/sources/' + item.type);

            // 上传文件事件
            let f = await uploadFile(ctx, {
                fileType: item.version,          // 上传之后的目录
                path: serverFilePath
            });

            let filename = path.basename(f.path);

            let result = await sourceLogic.updatesourcepath(id,
                '/sources/' +  item.type + '/' + item.version + '/' + filename);
            ctx.body = {code: 200, data: result};

        }
    });

    /*
    * 中心 > 收费站，更新指定服务，指定版本
    * @query  {object} body    源码数据
    * @return {null}
    * */
    router.post('/update', async(ctx)=>{
        let ok = tools.required(ctx, ['type','version','sourcepath']);

        // 检查本地是否包含此版本
        //
        if (ok) {
            let body = ctx.request.body;
            let item = await sourceLogic.create(body);
            ctx.body = {code: 200, data: item};
        }
    });

    /*
    * 中心 > 收费站，更新指定服务，指定版本
    * @query  {object} body    源码数据
    * @return {null}
    * */
    router.get('/update1/:id', async(ctx)=>{
        let ok = tools.required(ctx, ['id']);
        //
        if (ok) {
            let id = ctx.params.id;
            let item = await haLogic.update1(id);
            ctx.body = {code: 200, data: item};
        }
    });
};