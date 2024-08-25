import Notes from "@/components/notes";
import BaseContext from "./BaseContext";
import NotesDB from "@/db/notesDB";
import Note from "@/components/notes/Note";
import func from "@/utils/func";

export default class NotesContext extends BaseContext {
    _contextName = 'NoteBookNotes';
    /**
     * 
     * @param {Notes} $obj 
     * @param {Object} options 
     */
    constructor($obj, options) {
        super($obj,func.extendsObject({
            'sort.pinnedOnTop': true,
            'sort.columns': {
                'updated_at': 'desc',
            },
        },options),false);

        const ctx = this;

        ctx.addEventListener('notesdb.connect.error',function(error){
            console.error(error.message);
        });
        ctx.addEventListener('notesdb.connect.success',function(){
            ctx.triggerEvent('load.notes');
        });

        ctx.addEventListener('load.notes',function(){
            ctx.triggerEvent('before.load.notes');
            NotesDB.getAllNotes(note => {
                ctx.triggerEvent('notesdb.loaded.note',note);
            }).then(allNotes => {
                ctx.triggerEvent('notesdb.loaded.allnotes',allNotes);
            });
        });
        ctx.addEventListener('notesdb.loaded.note',function(data){
            const note = Note.createFromObject(data);
            ctx.triggerEvent('loaded.note',note);
        }); 
        ctx.addEventListener('notesdb.loaded.allnotes',function(notes){
            console.log('loaded all notes',Object.keys(notes).length);
        });
    }
    getSorter() {
        return Note.getSorterBy(this.getOption('sort.pinnedOnTop'),this.getOption('sort.columns'));
    }
}