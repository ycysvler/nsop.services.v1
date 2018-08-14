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
const OrganizationLogic = require('../../../db/mongo/dao/organization');
const OrgSourceLogic = require('../../../db/mongo/dao/orgsource');
const HaMasterLogic = require('../../logic/hamasterlogic');
const sourceLogic = new SourceLogic();
const haLogic = new HaMasterLogic();

module.exports = function(router){
    router.get('/orgsource', async(ctx)=>{
        let sourceLogic = new SourceLogic();
        let orgsourceLogic = new OrgSourceLogic();
        let organizationLogic = new OrganizationLogic();

        let sources = await sourceLogic.list();
        let orgsources = await orgsourceLogic.list();
        let orgs = await organizationLogic.list();

        let orgsourceKeys = {};
        for(let item of orgsources){
            orgsourceKeys[item.orgid + '.' + item.type + '.' + item.cversion] = true;
        }

        console.log('orgsourceKeys',orgsourceKeys);

        let ok = true;
        if (ok) {
            let result = [];

            for(let org of orgs){
                let orgItem = {'org':org, 'sources':[]};
                result.push(orgItem);

                for(let item of sources){
                    let key = `${org.orgid}.${item.type}.${item.version}`;

                    if(key in orgsourceKeys){
                        // 目前就是这个版本
                        orgItem.sources.push({source:{_id:item._id}, cversion:true});
                    }else{
                        // 目前不是这个版本
                        orgItem.sources.push({source:{_id:item._id}, cversion:false});
                    }
                }

            }

            ctx.body = {code: 200, data: {sources:sources, orgsources:result}};
        }
    });
};
