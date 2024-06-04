interface String {
    displayBigNumber();
    toWordList();
    toLetterList();
}

String.prototype.displayBigNumber = function () {
    let str = this;
    let num = parseInt(str);
    //大于1万 小于100万，单位k
    if (num >= 10000 && num < 1000000) {
        num = num.valueOf() / 1000;
        // return num.toFixed(2) + 'K'
        return Math.round(num * 10) / 10 + 'K';
    }
    // if (num >= 1000000 && num < 100000000) {
    //     num = num.valueOf() / 1000000;
    //     // return num.toFixed(2) + 'M'
    //     return Math.round(num * 100) / 100 + 'M';
    // }
    if (num >= 1000000) {
        num = num.valueOf() / 1000000;
        // return num.toFixed(2) + 'B'
        return Math.round(num * 10) / 10 + 'M';
    }
    return str;
}

interface Number {
    displayBigNumber();
    toDecimal(decimalPlaces?: number, percent?: number);
}

Number.prototype.displayBigNumber = function () {
    // let str = this;
    let num = this;
    if (num >= 10000 && num < 1000000) {
        num = num.valueOf() / 1000;
        // return num.toFixed(2) + 'K'
        return Math.round(num * 10) / 10 + 'K';
    }
    // if (num >= 1000000 && num < 100000000) {
    //     num = num.valueOf() / 1000000;
    //     // return num.toFixed(2) + 'M'
    //     return Math.round(num * 100) / 100 + 'M';
    // }
    if (num >= 1000000) {
        num = num.valueOf() / 1000000;
        // return num.toFixed(2) + 'B'
        return Math.round(num * 10) / 10 + 'M';
    }
    return '' + this;
}

Number.prototype.toDecimal = function (decimalPlaces: number = 2, percent: number = 100) {
    let f = this;
    if (isNaN(f)) {
        return 0;
    }
    // f = Math.round(this * 10000) / 100;
    // f = ~~(this * 10000) / 100;

    let converter = Math.pow(10, decimalPlaces);
    f = ~~(this * converter * percent) / converter;
    return f;
}