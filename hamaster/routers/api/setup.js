/**
 * 源码管理操作
 *
 * Created by VLER on 2018/7/18.
 */
const path = require('path');
const os = require('os');
const fs = require('fs');
const tools = require('../../../utils/tools');
const SetupLogic = require('../../logic/setup');

module.exports = function(router){
    router.get('/setup', async(ctx)=>{
       let logic = new SetupLogic();

       let ips = logic.getIps();

        console.log('----------local host: '+ips);

        // 修改配置文件parent地址
        // 记录本机IP
        // 记录本机code、name
        // 上报IP、code

        await ctx.render('index',{title:'ttt', localip:ips[0]});
    });
};