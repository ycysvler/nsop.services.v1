/**
 * 心跳
 *
 * Created by VLER on 2018/7/18.
 */
const moment = require('moment');
const DialingLogic = require('../../../db/mongo/dao/dialing');

module.exports = function (router) {

    router.get('/dialing', async(ctx)=>{
        let logic = new DialingLogic();
        let items = await logic.list();
        ctx.body = {code: 200, data: items};
    });

    router.post('/dialing', async(ctx)=>{
        let logic = new DialingLogic();
        let body = ctx.request.body;
        let item = await logic.create(body);
        ctx.body = {code: 200, data: item};
    });

    router.delete('/dialing', async(ctx)=>{
        let logic = new DialingLogic();
        let body = ctx.request.body;
        let item = await logic.removeByIds(body);
        ctx.body = {code: 200, data: item};
    });
};