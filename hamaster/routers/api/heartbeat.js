/**
 * 心跳
 *
 * Created by VLER on 2018/7/18.
 */
const moment = require('moment');
const HaMasterLogic = require('../../logic/hamasterlogic');

module.exports = function (router) {
    router.get('/heartbeat', async (ctx) => {
        ctx.body = {code: 200, date: new moment()};
    });

    router.post('/heartbeat', async(ctx)=>{
        let logic = new HaMasterLogic();
        let body = ctx.request.body;
        body.updatetime = moment();

        let item = await logic.heartbeat(body.orgid, body.type, body);

        ctx.body = {code:200, data:item};
    });
};