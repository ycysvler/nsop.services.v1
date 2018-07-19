let baseSchemas = require('./baseschemas');
// let entSchemas = require('./entschemas');
// let haSchemas = require('./haschemas');
const pool = new Map();

let getMongoPool = (date)=>{
    date = date === undefined ? "nsop.base":date;

    if(!pool.has(date)){
        if(date === 'nsop.base'){
           let schemas = new baseSchemas();
           pool.set(date, schemas);
       }else{
           // let schemas = new entSchemas(date);
           // pool.set(date, schemas);
       }
    }
    let db = pool.get(date);

    return db;
}

module.exports = getMongoPool;