import { copyObject, hash } from "../utils/func";

type SimpleDataType = {
    id: any,
    value: any
}
function createObject(data:any) {
    if(typeof data === 'undefined' || data == null)return null;
    if(typeof data === 'object')return copyObject(data);

    return <SimpleDataType>{
        id: data,
        value: data,
    }
}
function getObjectValue(data:any) {
    if(typeof data !== 'object')return data;
    if('id' in data && 'value' in data && Object.keys(data).length == 2)return data.value;
    return copyObject(data);
}
export default class DB {
    dbname;
    dbversion;
    constructor(dbname: string) {
        DB.checkSupport();

        if(!dbname)dbname = this.constructor.name + '_default';
        this.dbname = dbname;
        this.dbversion = 1;
    }

    async open(tablename:string,forceUpgrade=false): Promise<IDBDatabase> {
        // find existing db version
        const dbs = await window.indexedDB.databases();
        const foundId = dbs.findIndex(db => db.name == this.dbname);
        if(foundId != -1){
            this.dbversion = dbs[foundId].version!;
        }

        if(forceUpgrade)this.dbversion += 1;
        
        return new Promise((resolve, reject) => {
            const request = window.indexedDB.open(this.dbname,this.dbversion);

            request.onupgradeneeded = () => {
                const db = request.result;
                if(!db.objectStoreNames.contains(tablename)){
                    db.createObjectStore(tablename,{keyPath: 'id'});
                }
            }
            request.onerror = () => {
                reject(request.error!);
            }
            request.onsuccess = () => {
                const db = request.result;
                if(!db.objectStoreNames.contains(tablename)){
                    db.close();
                    this.open(tablename,true).then(resolve).catch(reject);
                    return;
                }
                resolve(db);
            }
        });
    }

    async transaction(tablename:string,readonly=true) {
        const db = await this.open(tablename);
        const transaction = db.transaction(tablename,readonly?'readonly':'readwrite');
        transaction.onerror = () => {
            throw transaction.error;
        }
        const store = transaction.objectStore(tablename);
        return store;
    }

    table(tablename: string) {
        const $this = this;
        async function get<Item>(id:any): Promise<Item> {
            return new Promise((resolve,reject) => {
                $this.transaction(tablename, true)
                    .then(store => {
                        const request = store.get(id);
                        request.onerror = () => {
                            throw request.error;
                        }
                        request.onsuccess = () => {
                            resolve(<Item>getObjectValue(request.result));
                        }
                    }).catch(reject);
            });
        }
        async function set(id:any,data:any) {
            data = createObject(data);
            data.id = id;
            return new Promise((resolve,reject) => {
                $this.transaction(tablename, false)
                    .then(store => {
                        const request = store.get(id);
                        request.onerror = () => {
                            throw request.error;
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
                                throw setRequest.error;
                            }
                            setRequest.onsuccess = function() {
                                resolve(setRequest.result);
                            }
                        }
                    }).catch(reject);
            });
        }
        async function addIfNotExist(id:any,data:any) {
            data = createObject(data);
            data.id = id;
            return new Promise((resolve,reject) => {
                $this.transaction(tablename, false)
                    .then(store => {
                        const request = store.get(id);
                        request.onerror = () => {
                            throw request.error;
                        }
                        request.onsuccess = () => {
                            const dataExist = request.result;
                            if(!dataExist){
                                let setRequest = store.add(data);

                                setRequest.onerror = function() {
                                    throw setRequest.error;
                                }
                                setRequest.onsuccess = function() {
                                    resolve(setRequest.result);
                                }
                            }
                        }
                    }).catch(reject);
            });
        }
        async function getAll<Item>(onloadeditem?:(item:Item)=>void): Promise<Map<any,Item>> {
            return new Promise((resolve,reject) => {
                $this.transaction(tablename, true)
                    .then(store => {
                        const request = store.openCursor();
                        request.onerror = () => {
                            throw request.error;
                        }
                        const allData: Map<any,Item> = new Map();
                        request.onsuccess = function() {
                            const cursor = request.result;
                            if(cursor){
                                const data = getObjectValue(cursor.value);
                                allData.set(<any>cursor.key,data);
                                onloadeditem?.(data);
                                cursor.continue();
                            }else{
                                resolve(allData);
                            }
                        }
                    }).catch(reject);
            });
        }
        async function getAllKeys<Item>(): Promise<Array<Item>> {
            return new Promise((resolve,reject) => {
                $this.transaction(tablename, true)
                    .then(store => {
                        const request = store.getAllKeys();
                        request.onerror = () => {
                            throw request.error;
                        }
                        request.onsuccess = function() {
                            const data = request.result;
                            if(data){
                                resolve(data as Array<Item>)
                            }else{
                                throw new Error('Empty data!')
                            }
                        }
                    }).catch(reject);
            });
        }

        return {
            get,
            set,
            addIfNotExist,
            getAll,
            getAllKeys,
        };
    }

    static checkSupport() {
        if(!window.indexedDB){
            throw new Error('indexedDB not supported!');
        }

        return true;
    }

    static readonly instance:DB = new DB(hash('notes-js'));
    static table(tablename:string) {
        return this.instance.table(tablename);
    }
}