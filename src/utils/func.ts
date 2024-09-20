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
export function getElapsed(startDateTime: number,endDateTime?: number): {minutes:number,hours:number,days:number,months:number,years:number} {
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
export function getElapsedTime(startDateTime: number,endDateTime?: number, t = (tmpl: string, data?: any)=>tmpl,lang?: string): string {
    const {minutes,hours,days,months,years} = getElapsed(startDateTime,endDateTime);

    if(months >= 3 || years > 0) {
        const options: Intl.DateTimeFormatOptions = {
            month: 'short',
            day: 'numeric',
        }
        if(years > 0){
            options.year = 'numeric';
        }
        return t('on_{{datetime}}',{datetime: new Date(startDateTime).toLocaleDateString(lang,options)});
    }

    if(months > 0) {
        return (months == 1) ? t('last_month') : t('{{months}}_months_ago',{months});
    }
    if(days > 0) {
        let weeks = Math.floor(days / 7);
        if(weeks > 0){
            return (weeks == 1) ? t('last_week') : t('{{weeks}}_weeks_ago',{weeks});
        }
        return (days == 1) ? t('yesterday') : t('{{days}}_days_ago',{days});
    }
    if(hours > 0){
        return (hours == 1) ? t('an_hour_ago') : t('{{hours}}_hours_ago',{hours});
    }
    if(minutes > 0){
        return (minutes == 1) ? t('one_minute_ago') : t('{{minutes}}_minutes_ago',{minutes});
    }
    return t('a_moment_ago');
}

type ImportOptions = {
    onimported:(file:File)=>void,
    onfailed:(error:Error)=>void
}
export function importFile(filetype: string,options: ImportOptions) {
    const inputfile = document.createElement('input');
    inputfile.setAttribute('type', 'file');
    inputfile.setAttribute('accept', filetype);

    inputfile.onchange = (e: Event) => {
        try {
            const file = (e.target as any)?.files[0];
            if(!file){
                throw new Error('File not selected!');
            };

            if(options.onimported)options.onimported(file);
        } catch (error: any) {
            if(options.onfailed)options.onfailed(error);
        }
    }

    inputfile.click();
}

type JSONParseOptions = {
    onsuccess:(data:any)=>void,
    onfailed:(error:Error)=>void
}
export function FileJSONParse(file: File, options: JSONParseOptions) {
    if(!window.FileReader){
        if(options.onfailed)options.onfailed(new Error('Browser not supported "FileReader" object.'));
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const data = JSON.parse((reader.result as string) ?? '[]');
            if(options.onsuccess)options.onsuccess(data);
        } catch (error: any) {
            if(options.onfailed)options.onfailed(error);
        } finally {
            reader.onload = null;
        }
    }
    reader.readAsText(file);
}

/**
 * 
 * @param {any} data data to be converted to JSON and will be downloaded as JSON File
 * @param {string} filename filename of JSON File that will be downloaded
 * @param {boolean} [pretty=false] if true, the JSON string will be pretty
 */
export function downloadAsJSON(data: any,filename: string,callback?: () => void,pretty=false) {
    if(!filename)filename = 'data.json';
    if(!filename.endsWith('.json'))filename += '.json';

    let stringifyspace = pretty ? 2 : undefined;

    try {
        if(!window.Blob)throw new Error('Browser not supported "Blob" object.');

        const fileblob = new Blob([JSON.stringify(data,undefined,stringifyspace)],{
            type: 'application/json'
        });

        const fileurl = URL.createObjectURL(fileblob);

        const anchor = document.createElement('a');
        anchor.href = fileurl;
        anchor.download = filename;

        anchor.click();
    } catch (error: any) {
        if(error instanceof Error){
            window.alert(error.name + ' : ' + error.message)
        }
    } finally {
        callback?.()
    }
}