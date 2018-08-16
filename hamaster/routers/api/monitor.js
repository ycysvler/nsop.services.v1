/**
 * 心跳
 *
 * Created by VLER on 2018/7/18.
 */
const moment = require('moment');
const MonitorLogic = require('../../../db/mongo/dao/monitor');

module.exports = function (router) {

    router.get('/monitor', async(ctx)=>{
        let logic = new MonitorLogic();
        let items = await logic.list();
        ctx.body = {code: 200, data: items};
    });
};