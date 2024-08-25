import BaseContext from "@/contexts/BaseContext";
import func from "@/utils/func";
import StorageJS from "./Storage";
import Note from "@/components/notes/Note";

const DB_NAME = 'notesjs-native'??func.hash('notes-db');
const DB_VERSION = 1;
const TABLE_NAME = 'notes'??func.hash('notes-db.table-notes');
export default class NotesDB {
    static _storage;
    /**
     * @returns {StorageJS}
     */
    static get storage() {
        if(!this._storage)this._storage = new StorageJS(DB_NAME,DB_VERSION);
        return this._storage;
    }
    /**
     * 
     * @param {(note)=>void} onloadeddata 
     */
    static getAllNotes(onloadeddata) {
        return this.storage.table(TABLE_NAME).getAllInTurn(onloadeddata,);
    }
    /**
     * 
     * @param {Note.structure} noteObj 
     */
    static saveNote(noteObj) {
        return this.storage.table(TABLE_NAME).setData(noteObj.id,noteObj);
    }
}