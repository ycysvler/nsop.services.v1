let OrganizationLogic = require('./db/mongo/dao/organization');
let orgLogic = new OrganizationLogic();
console.log('init organization ------------------------');
orgLogic.init();    // 初始化出来组织的根节点