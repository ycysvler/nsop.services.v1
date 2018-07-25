const path = require('path');

module.exports = function(router){
    router.get('/hello', async(ctx)=>{
        ctx.body = {"name":"hello123123"};
    });

    router.post('/world', async(ctx)=>{
        console.log(ctx.request.body, typeof ctx.request.body);
    });
};