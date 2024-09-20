import DB from "./DB";
import Note, { NoteRaw, isNoteMatchByAttr } from "../models/Note";
import { copyObject } from "../utils/func";

const TABLE = 'notes'

export default class NotesStore {
    static getAllWithPagination(start: number,length: number,onfinished:(allData: Map<any,NoteRaw>,start:number,count:number,totalPage:number,totalItems?:number) => void,filterAttr?: Partial<NoteRaw>) {
        (async function(){
            let counter = 0
            let totalData = 0
            const allData: Map<any,NoteRaw> = new Map()
            let advanced = false
            await DB.table(TABLE).getAllWithCursor<NoteRaw>((note, cursor): boolean => {
                let pass = true
                if(filterAttr) {
                    pass = isNoteMatchByAttr(note,filterAttr)
                }
                if(!advanced && start <= counter){
                    advanced = true; // just status
                }
                if(allData.size < length) {
                    if(pass && advanced){
                        allData.set(note.id,note)
                    }
                }else{
                    // console.log('done',start,length)
                }
                cursor.continue()
                if(pass)counter++
                return pass
            }).then(_allData => {
                totalData = _allData.size
            })

            const totalPage = Math.ceil(totalData / length) // round up
            // console.log('loaded',allData.size,'from total',totalData)
            onfinished(allData, start, allData.size, totalPage, totalData)
        })()
    }
    static getAllWithFilter(filterAttr: Partial<NoteRaw>,onfinished:(allFilteredData: Map<any,NoteRaw>,totalData: number) => void) {
        (async function(){
            let counter = 0
            let totalData = 0
            const allData: Map<any,NoteRaw> = new Map()
            await DB.table(TABLE).getAllWithCursor<NoteRaw>((note, cursor): boolean => {
                let pass = true
                if(filterAttr) {
                    pass = isNoteMatchByAttr(note,filterAttr)
                }
                if(pass){
                    allData.set(note.id,note)
                }
                cursor.continue()
                if(pass)counter++
                return pass
            }).then(_allData => {
                totalData = _allData.size
            })

            onfinished(allData, totalData)
        })()
    }
    static getAll(callback: (data: NoteRaw)=>void,onfinished:(allData: Map<any,NoteRaw>) => void) {
        DB.table(TABLE).getAll<NoteRaw>(callback).then(onfinished)
    }
    static get(id: string, callback: (data: NoteRaw)=>void) {
        DB.table(TABLE).get<NoteRaw>(id).then(callback)
    }
    static set(id: string, note: NoteRaw, callback: ()=>void) {
        DB.table(TABLE).set(id,note).then(callback)
    }
    static delete(id: string, callback: (deleted: boolean)=>void) {
        DB.table(TABLE).remove(id).then(callback)
    }
    static async saveNotesIfNotExist(notes: Array<NoteRaw>, callback: (notSavedNotes: Array<NoteRaw>)=>void) {
        const notesObj = copyObject(notes);
        const notSavedNotes: Array<NoteRaw> = [];
        function SaveNoteObject() {
            if(notesObj.length > 0) {
                const note = notesObj.shift();
        
                if(note){
                    DB.table(TABLE).addIfNotExist(note.id,note).then((result) => {
                        if(!result){
                            notSavedNotes.push(note);
                        }
    
                        SaveNoteObject();
                    });
                }
            }else{
                callback(notSavedNotes);
            }
        }
        
        SaveNoteObject();
    }
}