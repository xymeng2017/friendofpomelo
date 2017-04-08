/* *******************************************
 * Copyright (c) 2016-2017
 * Heisenberg Co.,Ltd. All rights reserved.
 * Project      : treasures
 * File         : ObjectUtil.js
 * Created      : 2017-04-03
 * Author       : lee
 * *******************************************/

module.exports = class ObjectUtil {

    static clone(obj) {
        let o;
        if (typeof obj === 'object') {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (let element of obj) {
                        o.push(ObjectUtil.clone(element));
                    }
                } else {
                    o = {};
                    for (let j in obj) {
                        o[j] = ObjectUtil.clone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    }
};