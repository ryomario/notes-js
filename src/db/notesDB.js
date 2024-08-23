import BaseContext from "@/contexts/BaseContext";
import func from "@/utils/func";

const DB_NAME = 'notesjs-native'??func.hash('notes-db');
const DB_VERSION = 1;
const TABLE_NAME = 'notes'??func.hash('notes-db.table-notes');
export default class NotesDB {
    _db;
    /**
     * 
     * @param {BaseContext} ctx
     */
    constructor(ctx) {
        const $this = this;
        let openReq = window.indexedDB.open(DB_NAME, DB_VERSION);
        openReq.onupgradeneeded = function(event) {
            // if upgraded schema
            console.log('DB Upgrade');
            let db = openReq.result;

            if(!db.objectStoreNames.contains(TABLE_NAME)){
                db.createObjectStore(TABLE_NAME, {keyPath: 'id'});
            }
        };
        openReq.onerror = function(event) {
            ctx.triggerEvent('notesdb.connect.error',openReq.error);
        };
        openReq.onsuccess = function(event) {
            $this._db = openReq.result;
            $this._db.onversionchange = function() {
                $this._db.close();
                alert(ctx.translate("__notesdb.version.change__"));
            }
            ctx.triggerEvent('notesdb.connect.success');
        };
        openReq.onblocked = function(event) {
            console.warn('DB blocked');
            ctx.triggerEvent('notesdb.connect.blocked');
        }
    }
    /**
     * 
     * @param {BaseContext} ctx 
     */
    getAllData(ctx) {
        if(!this._db){
            ctx.triggerEvent('notesdb.connect.error',new Error('DB Connecting...'));
            return;
        }
        let transaction = this._db.transaction(TABLE_NAME);
        let request = transaction.objectStore(TABLE_NAME).openCursor();

        const alldata = {};
        request.onsuccess = function() {
            let cursor = request.result;
            if(cursor) {
                let id = cursor.key;
                let data = cursor.value;
                alldata[id] = data;
                function next() {
                    cursor.continue();
                }
                ctx.triggerEvent('notesdb.loaded.note',data,next);
            }else{
                ctx.triggerEvent('notesdb.loaded.allnotes',alldata);
            }
        }
    }
}