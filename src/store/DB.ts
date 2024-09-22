import { hash } from "../utils/func";
import { upgradeTable as upgradeTableNotes } from "./Notes";
import { upgradeTable as upgradeTableThemes } from "./Themes";

export type OnUpgradeDB = (this: IDBOpenDBRequest ,event: IDBVersionChangeEvent) => void;
type StoreOptions = {
    readonly?:boolean,
    onUpgrade?:OnUpgradeDB,
    version?:number
}

const TABLE_SETTINGS = hash('notes-js-settings');

const upgradeTableSettings: OnUpgradeDB = function(this: IDBOpenDBRequest ,_event: IDBVersionChangeEvent) {
    const db = this.result;
    let store;
    if(!db.objectStoreNames.contains(TABLE_SETTINGS))store = db.createObjectStore(TABLE_SETTINGS,{ keyPath: 'name' });
    else store = this.transaction?.objectStore(TABLE_SETTINGS);

    console.assert(store?.name == TABLE_SETTINGS);
}

export function getSetting<V>(name: string): Promise<V|null> {
    return new Promise((resolve, reject) => {
        (async function() {
            DB.table(TABLE_SETTINGS).then(({ get }) => {
                get<{name: string,value: any}>(name).then(data => {
                    if(!data)resolve(null);
                    resolve(data.value);
                }).catch(reject);
            })
        })()
    });
}
export function setSetting(name: string, value: any): Promise<any> {
    return new Promise((resolve, reject) => {
        (async function() {
            DB.table(TABLE_SETTINGS,{readonly: false}).then(({ set }) => {
                set(name, {name, value}).then(data => {
                    resolve(data);
                }).catch(reject);
            })
        })()
    });
}

export default class DB {
    readonly dbname = hash('notes-js');
    readonly dbversion = 1;

    private _idb?: IDBDatabase;
    private _upgrading = false;
    private constructor() {
        DB.checkSupport();

        this.openDB(function(event) {
            upgradeTableSettings.bind(this)(event);
            upgradeTableNotes.bind(this)(event);
            upgradeTableThemes.bind(this)(event);
        }).then((db) => {
            this._idb = db;
        })
    }
    openDB(upgrade:null|OnUpgradeDB = null): Promise<IDBDatabase> {
        const $this = this;
        if(upgrade){
            this._upgrading = true;
        }else {
            return new Promise((resolve) => {
                let _idInterval: number|undefined;
                function check() {
                    if(!$this._upgrading && $this._idb){
                        window.clearInterval(_idInterval);
                        resolve($this._idb);
                    }
                }
                check();
                _idInterval = window.setInterval(check,100);
            })
        }
        return new Promise((resolve, reject) => {
            if($this._idb){
                resolve($this._idb);
                return;
            }
            const request = window.indexedDB.open($this.dbname,$this.dbversion);

            request.onupgradeneeded = upgrade;
            request.onerror = () => {
                reject(request.error!);
            }
            request.onsuccess = () => {
                const db = request.result;
                $this._upgrading = false;
                $this._idb = db;
                resolve(db);
            }
        });
    }

    static checkSupport() {
        if(!window.indexedDB){
            throw new Error('indexedDB not supported!');
        }

        return true;
    }

    static readonly instance:DB = new DB();
    static async table(tablename:string, options?: StoreOptions) {
        const store = await this.store(tablename, options ?? {});
        return DB.storeCRUD(store);
    }

    static upgrade(onUpgrade: OnUpgradeDB) {
        return this.instance.openDB(onUpgrade);
    }
    static async store(tablename:string,{readonly=true}:StoreOptions): Promise<IDBObjectStore> {
        let db = await this.instance.openDB();

        const transaction = db.transaction(tablename,readonly?'readonly':'readwrite');
        transaction.onerror = () => {
            throw transaction.error;
        }
        const store = transaction.objectStore(tablename);
        return store;
    }
    static storeCRUD(store: IDBObjectStore) {
        async function get<Item>(id:any): Promise<Item> {
            return new Promise((resolve,reject) => {
                const request = store.get(id);
                request.onerror = () => {
                    reject(request.error);
                }
                request.onsuccess = () => {
                    resolve(request.result as Item);
                }
            });
        }
        async function set(id:any,data:any) {
            return new Promise((resolve,reject) => {
                const request = store.get(id);
                request.onerror = () => {
                    reject(request.error);
                }
                request.onsuccess = () => {
                    const dataExist = request.result;
                    let setRequest: IDBRequest<any>;
                    if(!dataExist){
                        setRequest = store.add(data);
                    } else {
                        setRequest = store.put(data);
                    }
                    setRequest.onerror = function() {
                        reject(setRequest.error);
                    }
                    setRequest.onsuccess = function() {
                        resolve(setRequest.result);
                    }
                }
            });
        }
        async function remove(id: any): Promise<boolean> {
            return new Promise((resolve,reject) => {
                const request = store.delete(id);
                request.onerror = () => {
                    reject(false);
                }
                request.onsuccess = () => {
                    resolve(true);
                }
            });
        }
        async function addIfNotExist(id:any,data:any) {
            return new Promise((resolve,reject) => {
                const request = store.get(id);
                request.onerror = () => {
                    reject(request.error);
                }
                request.onsuccess = () => {
                    const dataExist = request.result;
                    if(!dataExist){
                        let setRequest = store.add(data);

                        setRequest.onerror = function() {
                            reject(setRequest.error);
                        }
                        setRequest.onsuccess = function() {
                            resolve(setRequest.result);
                        }
                    }else{
                        resolve(false);
                    }
                }
            });
        }
        async function getAll<Item>(onloadeditem?:(item:Item)=>void): Promise<Map<any,Item>> {
            return new Promise((resolve,reject) => {
                const request = store.openCursor();
                request.onerror = () => {
                    reject(request.error);
                }
                const allData: Map<any,Item> = new Map();
                request.onsuccess = function() {
                    const cursor = request.result;
                    if(cursor){
                        const data = cursor.value;
                        allData.set(<any>cursor.key,data);
                        onloadeditem?.(data);
                        cursor.continue();
                    }else{
                        resolve(allData);
                    }
                }
            });
        }

        return {
            get,
            set,
            remove,
            addIfNotExist,
            getAll,
        }
    }
}