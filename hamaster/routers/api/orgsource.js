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
const OrgSourceLogic = require('../../../db/mongo/dao/orgsource');
const HaMasterLogic = require('../../logic/hamasterlogic');
const sourceLogic = new SourceLogic();
const haLogic = new HaMasterLogic();

module.exports = function(router){
    router.get('/orgsource', async(ctx)=>{
        let orgsourceLogic = new OrgSourceLogic();
        let ok = true;
        if (ok) {
            let item = await orgsourceLogic.list();
            ctx.body = {code: 200, data: item};
        }
    });
};
