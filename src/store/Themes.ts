import DB, { OnUpgradeDB } from "./DB";

export const TABLE = 'themes'
export const TABLE_VERSION = 1

export const upgradeTable: OnUpgradeDB = function(this: IDBOpenDBRequest ,_event: IDBVersionChangeEvent) {
    const db = this.result;
    let store;
    if(!db.objectStoreNames.contains(TABLE))store = db.createObjectStore(TABLE,{ keyPath: 'id' });
    else store = this.transaction?.objectStore(TABLE);
}

export default class ThemesStore {
    static async get(id: string, callback?: (data: any)=>void) {
        const { get } = await DB.table(TABLE);
        const data = await get<any>(id);
        callback?.(data);
        return data;
    }
    static async set(id: string, theme: any, callback?: ()=>void) {
        const { set } = await DB.table(TABLE,{readonly: false});
        const data = await set(id,theme);
        callback?.();
        return data;
    }
    static getAllKeys(): Promise<Array<string>> {
        return new Promise((resolve, reject) => {
            DB.store(TABLE,{readonly: true}).then(store => {
                const request = store.getAllKeys();
                request.onerror = () => {
                    reject(request.error)
                }
                request.onsuccess = function() {
                    const data = request.result;
                    if(data){
                        resolve(data as Array<string>)
                    }else{
                        reject(new Error('Empty data!'))
                    }
                }
            })
        })
    }
}