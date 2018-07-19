/**
 * Created by VLER on 2018/7/1.
 */
const moment = require('moment');

module.exports = class HaMasterLogic {
    /**
     * 创建
     * @param  {object} data     信息
     * @return {object}          ？？
     */
    update(data) {
        return new Promise(async(resolve, reject) => {
            try {
                let Doc = getMongoPool().Source;
                let item = new Doc(data);
                item.updatetime = new moment();

                item.save(async(err, item) => {
                    if (!err) {
                        resolve(item);
                    } else {
                        reject(err);
                    }
                });
            } catch (err) {
                reject(err)
            }
        });
    }

};