/**
 * 心跳
 *
 * Created by VLER on 2018/7/18.
 */
const moment = require('moment');
const MonitorLogic = require('../../../db/mongo/dao/monitor');
const OrganizationLogic = require('../../../db/mongo/dao/organization');

module.exports = function (router) {

    router.get('/monitor', async(ctx)=>{
        let orgMap = {};
        let ologic = new OrganizationLogic();
        let oitems = await ologic.list();
        for(let item of oitems){
            orgMap['orgid.'+item.orgid] = item;
        }

        let logic = new MonitorLogic();
        let items = await logic.list();

        let result = [];
        for(let item of items){
            let org = orgMap['orgid.' + item.orgid];
            if(org)
                result.push({_id:item._id, orgid: org.orgid, name:org.name, host:org.host, type:item.type, updatetime:item.updatetime});
        }

        ctx.body = {code: 200, data: result};
    });
};