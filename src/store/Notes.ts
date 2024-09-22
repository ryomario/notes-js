import DB, { OnUpgradeDB } from "./DB";
import { NoteRaw, isNoteMatchByAttr } from "../models/Note";
import { copyObject } from "../utils/func";

type GetAllNotesProps = {
    callback?: (data: NoteRaw)=>void,
    onfinished?:(datas: Map<any,NoteRaw>,totalDatas?:number) => void,
}
type GetAllNotesWithFilterProps = GetAllNotesProps & {
    filterAttr: Partial<NoteRaw>,
}
type GetAllNotesWithFilterAndOrderProps = GetAllNotesWithFilterProps & {
    orderBy?: NoteSortableColumns,
    isAsc?: boolean,
}
type GetAllNotesWithFilterAndOrderAndPaginationProps = GetAllNotesWithFilterAndOrderProps & {
    start: number,
    length: number,
}

export const TABLE = 'notes'
export const TABLE_VERSION = 1

export const upgradeTable: OnUpgradeDB = function(this: IDBOpenDBRequest ,_event: IDBVersionChangeEvent) {
    const db = this.result;
    let store;
    if(!db.objectStoreNames.contains(TABLE))store = db.createObjectStore(TABLE,{ keyPath: 'id' });
    else store = this.transaction?.objectStore(TABLE);

    store?.createIndex(NoteIndexNames.KEY,'id',{unique: true});
    store?.createIndex(NoteIndexNames.TITLE,'title');
    store?.createIndex(NoteIndexNames.CREATED_AT,'created_at');
    store?.createIndex(NoteIndexNames.UPDATED_AT,'updated_at');
}

export default class NotesStore {
    static getAllWithPagination({ start, length, filterAttr, callback, onfinished, orderBy = NoteSortableColumns.TITLE, isAsc = true }: GetAllNotesWithFilterAndOrderAndPaginationProps) {
        (async function(){
            let counter = 0
            let totalData = 0
            const allData: Map<any,NoteRaw> = new Map()
            let advanced = false
            const store = await DB.store(TABLE,{readonly: true})
            const request = store.index(getIndexNameFromSortableCol(orderBy)).openCursor(null,isAsc?'next':'prev')
            request.onerror = () => {
                onfinished?.(allData, totalData);
            }
            request.onsuccess = () => {
                let pass = true
                const cursor = request.result;
                if(cursor){
                    const note = cursor.value as NoteRaw;
                    if(filterAttr) {
                        pass = isNoteMatchByAttr(note,filterAttr);
                    }
                    if(!advanced && start <= counter){
                        advanced = true; // just status
                    }
                    if(allData.size < length) {
                        if(pass && advanced){
                            allData.set(note.id,note);
                        }
                    }
                    cursor.continue();
                    callback?.(note);
                    if(pass){
                        allData.set(note.id,note);
                        counter++;
                    }
                }else{
                    totalData = allData.size;
                    onfinished?.(allData, totalData);
                }
            }
        })()
    }
    static getAllWithFilter({ filterAttr, callback, onfinished, orderBy = NoteSortableColumns.TITLE, isAsc = true }: GetAllNotesWithFilterAndOrderProps) {
        (async function(){
            let counter = 0
            let totalData = 0
            const allData: Map<any,NoteRaw> = new Map()
            const store = await DB.store(TABLE,{readonly: true})
            const request = store.index(getIndexNameFromSortableCol(orderBy)).openCursor(null,isAsc?'next':'prev')
            request.onerror = () => {
                onfinished?.(allData, totalData);
            }
            request.onsuccess = () => {
                let pass = true
                const cursor = request.result;
                if(cursor){
                    const note = cursor.value as NoteRaw;
                    if(filterAttr) {
                        pass = isNoteMatchByAttr(note,filterAttr);
                    }
                    cursor.continue();
                    callback?.(note);
                    if(pass){
                        allData.set(note.id,note);
                        counter++;
                    }
                }else{
                    totalData = allData.size;
                    onfinished?.(allData, totalData);
                }
            }
        })()
    }
    static getAll({ callback, onfinished }: GetAllNotesProps) {
        DB.table(TABLE).then(({ getAll }) => {
            getAll<NoteRaw>(callback).then(onfinished);
        });
    }
    static get(id: string, callback: (data: NoteRaw)=>void) {
        DB.table(TABLE).then(({ get }) => {
            get<NoteRaw>(id).then(callback);
        });
    }
    static set(id: string, note: NoteRaw, callback: ()=>void) {
        DB.table(TABLE,{readonly: false}).then(({ set }) => {
            set(id,note).then(callback);
        });
    }
    static delete(id: string, callback: (deleted: boolean)=>void) {
        DB.table(TABLE,{readonly: false}).then(({ remove }) => {
            remove(id).then(callback);
        });
    }
    static async saveNotesIfNotExist(notes: Array<NoteRaw>, callback: (notSavedNotes: Array<NoteRaw>)=>void) {
        const notesObj = copyObject(notes);
        const notSavedNotes: Array<NoteRaw> = [];
        function SaveNoteObject() {
            if(notesObj.length > 0) {
                const note = notesObj.shift();
        
                if(note){
                    DB.table(TABLE,{readonly: false}).then(({ addIfNotExist }) => {
                        addIfNotExist(note.id,note).then((result) => {
                            if(!result){
                                notSavedNotes.push(note);
                            }
        
                            SaveNoteObject();
                        });
                    });
                }
            }else{
                callback(notSavedNotes);
            }
        }
        
        SaveNoteObject();
    }
}

export enum NoteSortableColumns {
    KEY = 'id',
    TITLE = 'title',
    CREATED_AT = 'created_at',
    UPDATED_AT = 'updated_at',
}

enum NoteIndexNames {
    KEY = 'idx-key',
    TITLE = 'idx-title',
    CREATED_AT = 'idx-created_at',
    UPDATED_AT = 'idx-updated_at',
}

function getIndexNameFromSortableCol(col: NoteSortableColumns) {
    switch(col) {
        case NoteSortableColumns.KEY: return NoteIndexNames.KEY;
        case NoteSortableColumns.TITLE: return NoteIndexNames.TITLE;
        case NoteSortableColumns.CREATED_AT: return NoteIndexNames.CREATED_AT;
        case NoteSortableColumns.UPDATED_AT: return NoteIndexNames.UPDATED_AT;
    }
}