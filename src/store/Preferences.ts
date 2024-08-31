import DB from "./DB";

const TABLE = 'preferences'

export default class Preferences {
    static get(name: string, callback: (data: any)=>void) {
        DB.table(TABLE).get<any>(name).then(callback)
    }
    static set(name: string, value: any, callback: ()=>void) {
        DB.table(TABLE).set(name,value).then(callback)
    }
}