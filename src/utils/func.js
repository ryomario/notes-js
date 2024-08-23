import Notebook from "@/notebook";

/**
 * @class utils.func
 *
 * func utils (for high-order func's arg)
 *
 * @singleton
 * @alternateClassName func
 */
function eq(itemA) {
    return function(itemB) {
      return itemA === itemB;
    };
}

/**
 * @param {String} namespace
 * @param {String} [prefix]
 * @return {String}
 */
function namespaceToCamel(namespace, prefix) {
    prefix = prefix || '';
    return prefix + namespace.split('.').map(function(name) {
        return name.substring(0, 1).toUpperCase() + name.substring(1);
    }).join('');
}

/**
 * 
 * @param {String} cName Context name
 * @param {String} [prefix] 
 * @returns 
 */
function uniqueId(cName,prefix) {
    const key = hash(cName+'_counter');
    if(!window.localStorage[key])window.localStorage[key] = 0;
    const id = ++window.localStorage[key] + '';
    return prefix ? prefix + id : id;
}

function getAllCounter() {
    const idCounter = {};
    for (const key in window.localStorage) {
        if (key.includes('_counter')) {
            idCounter[key] = window.localStorage[key];
        }
    }
    return idCounter;
}

function copyObject(obj,deep=1) {
    if(!obj)return;
    if(typeof deep === 'boolean')deep = deep?1:0;
    if(deep >= 10)return obj;
    if(obj instanceof HTMLElement)return obj;
    const newObj = Array.isArray(obj)?[]:{};
    for (const key in obj) {
        let copiedValue = obj[key];
        if (typeof copiedValue === 'object' && deep != 0) {
            copiedValue = copyObject(copiedValue,deep+1);
        }
        newObj[key] = copiedValue;
    }
    return newObj;
}

function extendsObject(objParent, objChild) {
    objParent = copyObject(objParent);
    objChild = copyObject(objChild);
    for (const key in objChild) {
        let newValue = objChild[key];
        if(objParent[key] && typeof objParent[key] === 'object' && typeof objChild[key] === 'object'){
            newValue = extendsObject(objParent[key],objChild[key]);
        }
        objParent[key] = newValue;
    }
    return objParent;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 
 * @param {string} string 
 * @returns 
 */
function hash(string) {
    if(!string)return '';
    let hash = 0
    for (let i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash + string.charCodeAt(i)) | 0;
    }
    return (hash >>> 0).toString(36);
}

function equalsHash(string, hashStr) {
    return hash(string) === hashStr;
}

/**
 * Parse some variable into a string with given format
 * @example 
 * formatString('Hello, {1}!','World') // 'Hello, World!'
 * formatString('Hello, {2}! My name is {1}','Mario','World') // 'Hello, World! My name is Mario'
 * 
 * @param {string} format example: 'Hello, {1}!'
 * @returns 
 */
function formatString(format) {
    const args = Array.prototype.slice.call(arguments, 0);

    return format.replace(/{(\d+)}/g, function(match, number) {
        return (typeof args[number] != 'undefined' ? args[number] : match);
    });
}

function getElapsed(startDateTime,endDateTime) {
    if(!endDateTime)endDateTime = Date.now();
    let diffDate;
    if(endDateTime > startDateTime)diffDate = new Date(endDateTime - startDateTime);
    else diffDate = new Date(startDateTime - endDateTime);

    const baseDate = new Date(0);
    
    const minutes = Math.abs(diffDate.getMinutes() - baseDate.getMinutes());
    const hours = Math.abs(diffDate.getHours() - baseDate.getHours());
    const days = Math.abs(diffDate.getDate() - baseDate.getDate());
    const months = Math.abs(diffDate.getMonth() - baseDate.getMonth());
    const years = Math.abs(diffDate.getFullYear() - baseDate.getFullYear());

    return {
        minutes,
        hours,
        days,
        months,
        years,
    };
}

/**
 * 
 * @param {number} startDateTime 
 * @param {number|undefined} endDateTime 
 * @returns 
 */
function getElapsedTime(startDateTime,endDateTime) {
    const {minutes,hours,days,months,years} = getElapsed(startDateTime,endDateTime);

    if(months >= 3 || years > 0) {
        const options = {
            month: 'short',
            day: 'numeric',
        }
        if(years > 0){
            options.year = 'numeric';
        }
        return formatString(Notebook.l10n('_on_{1}'),new Date(startDateTime).toLocaleDateString(Notebook.lang(),options));
    }

    if(months > 0) {
        return (months == 1) ? Notebook.l10n('last_month') : formatString(Notebook.l10n('{1}_months_ago'),months);
    }
    if(days > 0) {
        let weeks = Math.floor(days / 7);
        if(weeks > 0){
            return (weeks == 1) ? Notebook.l10n('last_week') : formatString(Notebook.l10n('{1}_weeks_ago'),weeks);
        }
        return (days == 1) ? Notebook.l10n('yesterday') : formatString(Notebook.l10n('{1}_days_ago'),days);
    }
    if(hours > 0){
        return (hours == 1) ? Notebook.l10n('an_hour_ago') : formatString(Notebook.l10n('{1}_hours_ago'),hours);
    }
    if(minutes > 0){
        return (minutes == 1) ? Notebook.l10n('one_minute_ago') : formatString(Notebook.l10n('{1}_minutes_ago'),minutes);
    }
    return Notebook.l10n('a_moment_ago');
}

/**
 * 
 * @param {{r:number,g:number,b:number}} rgb 
 * @returns 
 */
function getRelativeLuminance(rgb) {
    return (
        0.2126 * rgb['r']
        + 0.7152 * rgb['g']
        + 0.0722 * rgb['b']
    );
}
/**
 * 
 * @param {{r:number,g:number,b:number}} rgb 
 * @returns 
 */
const getCSSColorRGB = (rgb) => `rgb(${rgb['r']},${rgb['g']},${rgb['b']})`;
/**
 * 
 * @param {{r:number,g:number,b:number}} c 
 * @param {number} h degree, min:0, max:360. if over index will be modullo
 * @returns 
 */
function transformHue(c,h) {
    if(h<0 || h>360){
        h = h%360;
        if(h<0)h = -h;
    }
    const u = Math.cos(h*Math.PI/180);
    const w = Math.sin(h*Math.PI/180);

    const resColor = {};
    resColor.r = (.299 + .701*u + .168*w)*c.r
            +    (.587 - .587*u + .330*w)*c.g
            +    (.114 - .114*u - .497*w)*c.b;
    resColor.g = (.299 - .299*u - .328*w)*c.r
            +    (.587 + .413*u + .035*w)*c.g
            +    (.114 - .114*u + .292*w)*c.b;
    resColor.b = (.299 - .300*u + 1.25*w)*c.r
            +    (.587 - .588*u - 1.05*w)*c.g
            +    (.114 + .886*u - .203*w)*c.b;
    if(resColor.r < 0)resColor.r = -resColor.r;
    if(resColor.g < 0)resColor.g = -resColor.g;
    if(resColor.b < 0)resColor.b = -resColor.b;
    return resColor;
}
/**
 * 
 * @param {{r:number,g:number,b:number}} bgRGB 
 * @returns 
 */
function getTextColorFromBG(bgRGB) {
    if(getRelativeLuminance(bgRGB) > (255 / 2))return {r:0,g:0,b:0};
    else return {r:255,g:255,b:255};
}
function getHueDegFromStr(str) {
    str = hash(str);
    let min = Number.MAX_VALUE;let max = Number.MIN_VALUE;
    let num = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let code = str.charCodeAt(i);
        if(min > code)min = code;
        if(max < code)max = code;
        num += code;
    }
    if(max == min){
        min = 0;
        max = 360;
    }

    max = max - min;
    min = 0;
    
    if(num > max)num = num % max;
    if(num < min)num = min - num;
    
    return (num / (max - min)) * 360;
}

export default {
    eq,
    namespaceToCamel,
    uniqueId,
    getAllCounter,
    copyObject,
    extendsObject,
    randomInt,
    hash,
    equalsHash,
    getElapsedTime,
    formatString,

    getRelativeLuminance,
    getCSSColorRGB,
    transformHue,
    getTextColorFromBG,
    getHueDegFromStr,
}