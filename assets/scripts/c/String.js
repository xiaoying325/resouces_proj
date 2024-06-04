String.prototype._split = function (separate, func) {
    let arrs = [];
    let arr = this.split(separate);
    for (let i in arr) {
        let v = arr[i];
        if (func) {
            v = func(v);
        }
        arrs[i] = v;
    }
    return arrs;
}

String.prototype.splits = function (separate, delimeter, func) {
    let arrs = [];
    let arr = this.split(separate);
    for (let i in arr) {
        let v = arr[i];
        v = v.split(delimeter);
        if (func) {
            for (let m in v) {
                v[m] = func(v[m]);
            }
        }
        arrs[i] = v;
    }
    return arrs;
}


String.prototype.line_splits = function (separate, delimeter, func) {
    let arrs = [];
    let arr = this.split(separate);
    for (let i in arr) {
        let v = arr[i];
        v = v.split(delimeter);
        if (func) {
            v = func(v);
        }
        arrs[i] = v;
    }
    return arrs;
}

String.prototype.format = function (...args) {
    if (arguments.length == 0)
        return null;

    let str = arguments[0];

    let mpos = 0;
    let index = 0;
    do {
        mpos = str.indexOf('%', mpos)
        if (mpos > -1) {
            mpos = mpos + 1
            let c = str.charAt(mpos);
            if ('s' == c) {
                str = str.replace('%s', '{' + index + '}')
                index = index + 1;
            } else if ('d' == c) {
                str = str.replace('%d', '{' + index + '}')
                index = index + 1;
            } else {
                // throw new Error("string format error.")
            }
        }
    } while (mpos > -1);

    for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

String.prototype.format_color = function (...args) {
    if (arguments.length == 0)
        return null;

    let str = arguments[0];

    let mpos = 0;
    let index = 0;
    do {
        mpos = str.indexOf('u', mpos)
        if (mpos > -1) {
            mpos = mpos + 8
            let c = str.charAt(mpos);
            if ('e' == c) {
                str = str.replace('user_name', '{' + index + '}')
                index = index + 1;
            }
        }
    } while (mpos > -1);

    for (let i = 1; i < arguments.length; i++) {
        let re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
}

String.prototype.replaceAll = function (reallyDo, replaceWith, ignoreCase) {
    if (!RegExp.prototype.isPrototypeOf(reallyDo)) {
        return this.replace(new RegExp(reallyDo, (ignoreCase ? "gi" : "g")), replaceWith);
    } else {
        return this.replace(reallyDo, replaceWith);
    }
}

if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (prefix) {
        return this.slice(0, prefix.length) === prefix;
    };
}

if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

String.prototype.trim = function () {
    //去除首尾空格
    return this.replace(/(^\s*)|(\s*$)/g, "");

    // //去除左边空格
    // osfipin.replace(/(^\s*)/g, "");

    // //去除右边空格
    // osfipin.replace(/(\s*$)/g, "");
}

String.prototype.fnstring = function () {
    let str = this;
    let num = parseInt(str);
    if (num >= Math.pow(10, 3) && num < Math.pow(10, 6)) {
        num = num / Math.pow(10, 3);
        if (num != parseInt(num)) {
            num = num.toFixed(2)
        }
        return num + "k"
    }

    if (num >= Math.pow(10, 6) && num < Math.pow(10, 9)) {
        num = num / Math.pow(10, 6);
        if (num != parseInt(num)) {
            num = num.toFixed(2)
        }
        return num + "M"
    }

    if (num >= Math.pow(10, 9) && num < Math.pow(10, 12)) {
        num = num / Math.pow(10, 9);
        if (num != parseInt(num)) {
            num = num.toFixed(2)
        }
        return num + "G"
    }

    if (num >= Math.pow(10, 12) && num < Math.pow(10, 15)) {
        num = num / Math.pow(10, 12);
        if (num != parseInt(num)) {
            num = num.toFixed(2)
        }
        return num + "T"
    }

    if (num >= Math.pow(10, 15) && num < Math.pow(10, 18)) {
        num = num / Math.pow(10, 15);
        if (num != parseInt(num)) {
            num = num.toFixed(2)
        }
        return num + "P"
    }
    return str;
}