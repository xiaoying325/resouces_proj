function __random(min, max) {
    if (max < min) {
        throw new Error("min > max");
    }

    return Math.floor(Math.random() * (max - min + 1) + min);
}

function __randomf(min, max) {
    if (max < min) {
        throw new Error("min > max");
    }

    return (Math.random() * (max - min) + min);
}

function __search(arr, key, value) {
    if (arr) {
        for (let obj of arr) {
            let v = obj[key];
            if (v && v === value) {
                return obj;
            }
        }
    }
    return null;
}
//function __search(arr, key, value) {
//    if (arr) {
//        for (let obj of arr) {
//            let v = obj[key];
//            if (v && v === value) {
//                return obj;
//            }
//        }
//    }
//    return null;
//}

function __clone(src, dest) {
    if (dest === undefined || dest === null) {
        let result = Object.prototype.toString.call(src);
        // cc.log(typeof src);
        // cc.log(src instanceof Object);
        // cc.log(src instanceof Array);
        if (result === "[object Array]") {
            dest = [];
        } else if (typeof src == 'object') {
            dest = {};
        } else {
            dest = src;
            return dest;
        }
    }
    for (let key in src) {
        let value = src[key];
        if (value) {
            if (typeof value == 'object') {
                value = __clone(value);
            }
        }
        dest[key] = value;
    }
    return dest;
}

function __copy(obj, arr) {
    arr = arr || [];
    for (let key in obj) {
        let value = obj[key];
        if (value != null || value != undefined) {
            arr.push(value);
        }
    }
    return arr;
}

function __merge(obj, arr) {
    arr = arr || [];
    for (let key in obj) {
        let value = obj[key];
        arr[key] = value;
    }
    return arr;
}

function __concat(arr, separate) {
    let r = '';
    let a = false;
    for (let key in arr) {
        if (a) {
            r = r + separate;
        } else {
            a = true;
        }
        r = r + arr[key];
    }
    return r;
}

function __concats(arr, separate, delimeter) {
    let r = '';
    let a = false;
    for (let key in arr) {
        let t = arr[key];
        let rt = __concat(t, delimeter);
        if (rt) {
            if (a) {
                r = r + separate;
            } else {
                a = true;
            }
            r = r + rt;
        }
    }
    return r;
}

function __contain(arr, value, key) {
    for (let ikey in arr) {
        if (!key || ikey === key) {
            let ivalue = arr[ikey];
            if (ivalue === value) {
                return true;
            }
        }
    }
    return false;
}

function __serialize(arr, key) {
    let r = [];
    for (let k in arr) {
        let t = arr[k];
        if (t) {
            if (key) {
                let tk = t[key];
                if (tk !== undefined && tk !== null) {
                    r[tk] = t;
                }
            } else {
                r[t] = t;
            }
        }
    }
    return r;
}

function __group(arr, gkey, ekey) {
    let r = [];
    for (let k in arr) {
        let t = arr[k];
        if (t) {
            let tk = t[gkey];
            if (tk) {
                let g = r[tk];
                if (!g) {
                    g = [];
                    r[tk] = g;
                }
                let tek = null;
                if (ekey) {
                    tek = t[ekey];
                }
                if (tek !== undefined && tek !== null) {
                    g[tek] = t;
                } else {
                    g.push(t);
                }
            }
        }
    }
    return r;
}

function __remove(arr, obj) {
    for (let k in arr) {
        if (arr[k] === obj) {
            arr.splice(k, 1);
            break;
        }
    }
    return obj;
}

function __clear(arr) {
    if (arr) {
        if (Array.isArray(arr)) {
            // arr.splice(0, arr.length);
            arr.length = 0;
            // arr = [];
        } else {
            for (let key in arr) {
                delete arr[key];
            }
        }
    }
    return arr;
}

function __count(obj) {
    let count = 0;
    if (obj) {
        if (Array.isArray(obj)) {
            count = obj.length;
        } else {
            for (let key in obj) {
                count++;
            }
        }
    }
    return count;
}

function __prefix(num, length) {
    // return (num / Math.pow(10, length)).toFixed(length).substr(2);
    // return ("0000000000000000" + num).substr(-length);
    return (Array(length).join('0') + num).slice(-length);
}

function Uint8ArrayToString(fileData) {
    var dataString = "";
    for (var i = 0; i < fileData.length; i++) {
        // dataString += String.fromCharCode(fileData[i] & 0xff);
        dataString += String.fromCharCode(fileData[i]);
    }

    return dataString;
}

function stringToUint8Array(str) {
    var arr = [];
    for (var i = 0, j = str.length; i < j; ++i) {
        arr.push(str.charCodeAt(i));
        // arr.push(str.charCodeAt(i) & 0xff);
    }

    var tmpUint8Array = new Uint8Array(arr);
    return tmpUint8Array;
}

var Utf8ArrayToStr = function (array) { // 数据流转化为字符串, 兼容汉字
    var out = "",
        i = 0,
        len = array.length,
        char1, char2, char3, char4;
    while (i < len) {
        char1 = array[i++];
        // 当单个字节时, 最大值 '01111111', 最小值 '00000000' 右移四位 07, 00
        // 当两个字节时, 最大值 '11011111', 最小值 '11000000' 右移四位 13, 12
        // 当三个字节时, 最大值 '11101111', 最小值 '11100000' 右移四位 14, 14
        if (char1 >> 4 <= 7) {
            out += String.fromCharCode(char1);
        } else if (char1 >> 4 == 12 || char1 >> 4 == 13) {
            char2 = array[i++];
            out += String.fromCharCode(((char1 & 0x1F) << 6) | (char2 & 0x3F));
        } else if (char1 >> 4 == 14) {
            char2 = array[i++];
            char3 = array[i++];
            char4 = ((char1 & 0x0F) << 12) | ((char2 & 0x3F) << 6);
            out += String.fromCharCode(char4 | ((char3 & 0x3F) << 0));
        }
    }
    return out;
};


function __getEngineVer() {
    var ver = cc.ENGINE_VERSION;
    var verNum = Number(ver.replace(/\./g, ""));
    return verNum;
}


function __getAngleWithYAxis(point1, point2) {
    // 计算两点之间的向量
    var dx = point2.x - point1.x;
    var dy = point2.y - point1.y;
    // 计算夹角（弧度）
    var radian = Math.atan2(dy, dx);
    // 转换为角度并调整为[0, 360)范围
    var angle = (radian * 180 / Math.PI + 360) % 360;
    // 返回夹角
    return angle;
}


function __refreshList(node, data, callback, target) {
    var template;
    template = node.children[0];
    var len = 0;
    var dataLen = 0;
    var arr = [];

    len = data.length > node.childrenCount ? data.length : node.childrenCount;
    arr = data;
    dataLen = data.length;


    for (let i = 0; i < len; i++) {
        var _item = node.children[i] ? node.children[i] : cc.instantiate(node.children[0]);
        _item.parent != node && (_item.parent = node);
        _item.active = i < dataLen;
        callback && _item.active && callback.call(target, _item, arr[i], i);
    }
}

function __get_agent() {
    if (window.navigator && window.navigator.userAgent) {
        return window.navigator.userAgent;
    }
    return ''
}


module.exports = {
    random: __random,
    randomf: __randomf,
    search: __search,
    clone: __clone,
    copy: __copy,
    merge: __merge,
    concat: __concat,
    concats: __concats,
    contain: __contain,
    serialize: __serialize,
    group: __group,
    remove: __remove,
    clear: __clear,
    count: __count,
    prefix: __prefix,
    u8ts: Uint8ArrayToString,
    stu8: stringToUint8Array,
    u8tus: Utf8ArrayToStr,
    getEngineVer: __getEngineVer,
    getAngleWithYAxis: __getAngleWithYAxis,
    refreshList: __refreshList,
    get_agent: __get_agent,
};