/**
 * 心跳
 *
 * Created by VLER on 2018/7/18.
 */
const moment = require('moment');
const MonitorLogic = require('../../../db/mongo/dao/monitor');

module.exports = function (router) {
    router.get('/heartbeat', async (ctx) => {
        ctx.body = {code: 200, date: new moment()};
    });

    router.post('/heartbeat', async(ctx)=>{
        let logic = new MonitorLogic();
        let body = ctx.request.body;

        let item = await logic.single(body.orgid, body.type);

        if(item){
            logic.update(body.orgid, body.type, body);
        }else{
            logic.create(body);
        }
    });
};