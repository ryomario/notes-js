import RandExp, { randexp } from "randexp";

export function copyObject(obj:any,deep=1) {
    if(!obj)return;
    if(typeof deep === 'boolean')deep = deep?1:0;
    if(deep >= 10)return obj;
    if(typeof obj !== 'object' || obj instanceof HTMLElement)return obj;
    const newObj = Array.isArray(obj)?[]:<any>{};
    for (const key in obj) {
        let copiedValue = obj[key];
        if (typeof copiedValue === 'object' && deep != 0) {
            copiedValue = copyObject(copiedValue,deep+1);
        }
        newObj[key] = copiedValue;
    }
    return newObj;
}
export function hash(string:string) {
    if(!string)return '';
    let hash = 0
    for (let i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash + string.charCodeAt(i)) | 0;
    }
    return (hash >>> 0).toString(36);
}
export function generateNextId(existIds: Array<string>, prefix: string = 'ID-', postfix: string = '') {
    let maxId = 0;
    for (const existId of existIds) {
        const foundId = new RegExp(prefix + '(?<num>\\d{1,})' + postfix).exec(existId)?.groups?.['num']
        const num = Number(foundId)
        if(foundId && !isNaN(num) && num > maxId)maxId = num
    }
    const nextId = maxId + 1;
    return prefix + nextId + postfix;
}