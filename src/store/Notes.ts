import DB from "./DB";
import Note, { NoteRaw, isNoteMatchByAttr } from "../models/Note";

const TABLE = 'notes'

export default class NotesStore {
    static getAllWithPagination(start: number,length: number,onfinished:(allData: Map<any,NoteRaw>,start:number,count:number,totalPage:number) => void,filterAttr?: Partial<NoteRaw>) {
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
            onfinished(allData, start, allData.size, totalPage)
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
    static async importNotes(notes: Array<NoteRaw>, onsave: (note: NoteRaw)=>void, t = (_:string,data?: any) => _) {
        // check structure
        if(!Array.isArray(notes)){
            window.alert(t('Import data type not Array!'));
            return;
        }
        if(notes.length == 0){
            window.alert(t('Import data empty!'));
            return;
        }
        let invalidcount = 0;
        let count = notes.length;
        
        const notesObj: Array<NoteRaw> = [];
        for (const item of notes) {
            // check structure
            let isValid = Note.isValidObject(item);
            // check is existing
            // if(isValid && exists)isValid = false;

            if(!isValid)invalidcount++;
            else notesObj.push(item);
        }

        const proceed = window.confirm(t('Import data, {{1}} items invalid from total {{2}} items!',{1:invalidcount,2:count}));

        if(!proceed)return;

        function SaveNoteObject() {
            if(notesObj.length > 0) {
                const note = notesObj.shift();
        
                if(note){
                    DB.table(TABLE).addIfNotExist(note.id,note).then((result) => {
                        if(!result)return;
                        onsave(note);
    
                        SaveNoteObject();
                    });
                }
            }
        }
        
        SaveNoteObject();
    }
}