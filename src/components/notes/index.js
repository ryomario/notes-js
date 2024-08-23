import AppContext from "@/contexts/AppContext";
import NotesContext from "@/contexts/NotesContext";
import dom from "@/utils/dom";
import Note from "./Note";
import "./notes.css";
import NoteGridView from "./NoteGridView";
import func from "@/utils/func";
import NoteListView from "./NoteListView";


/**
 * 
 * @param {NotesContext} ctx 
 */
function _init(ctx) {
    const container = dom.createNode('div','notes-container');
    /**
     * @type {Array<Note>}
     */
    const cacheNotes = [];

    ctx.getContainer = function() {
        return container;
    }

    ctx.setEventListener('toggle.grid',function(isGrid) {
        ctx.setOption('gridView',isGrid);
        ctx.triggerEvent('destroy.view.notes');
        ctx.triggerEvent('fetch.notes.container');
        ctx.triggerEvent('fetch.cached.notes');
    });
    ctx.addEventListener('before.load.notes',function() {
        ctx.triggerEvent('destroy.notes');
        ctx.triggerEvent('fetch.notes.container');
    });
    ctx.addEventListener('fetch.notes.container',function() {
        if(ctx.getOption('gridView')){
            container.classList.add('grid-view');
            container.classList.remove('list-view');
            container.classList.remove('card');
        }else {
            container.classList.add('list-view');
            container.classList.add('card');
            container.classList.remove('grid-view');
        }
    });

    ctx.setEventListener('loaded.note',function(note){
        ctx.triggerEvent('filter',note,function(isPass){
            if(isPass){
                cacheNotes.push(note);
                ctx.triggerEvent('fetch.note',note);
            }
        });
    });
    ctx.setEventListener('fetch.cached.notes',function(){
        for (const note of cacheNotes) {
            ctx.triggerEvent('fetch.note',note);
        }
    });
    ctx.setEventListener('fetch.note',function(note){
        const noteContainer = ctx.getOption('gridView') ? NoteGridView.create(note):NoteListView.create(note);
        container.appendChild(noteContainer);
        ctx.triggerEvent('sort.notes');
    });

    ctx.setEventListener('sort.notes',function() {
        let sortedNotes = Object.values(cacheNotes).sort(ctx.getSorter());
        for (let idx = 0; idx < sortedNotes.length; idx++) {
            sortedNotes[idx]._ctx.triggerEvent('sort.note',idx); // idx = order
        }
    });

    ctx.addEventListener('destroy.cached.notes',function() {
        cacheNotes.splice(0,cacheNotes.length).forEach(note => note.Destroy());
    });
    ctx.addEventListener('destroy.view.notes',function() {
        while(container.firstChild)container.lastChild.remove();
        cacheNotes.forEach(note => note._ctx.triggerEvent('destroy.view'));
    });
    ctx.addEventListener('destroy.notes',function() {
        ctx.triggerEvent('destroy.cached.notes');
        ctx.triggerEvent('destroy.view.notes');
    });
}

class Notes {
    ctx;
    constructor(appContext, callbacks, options) {
        const defaultOptions = {
            gridView: true,
        };
        options = func.extendsObject(defaultOptions, options);
        this.ctx = new NotesContext(this,func.extendsObject(options,{
            callbacks,
        }));
        this.ctx.translate = function(...args) {
            return appContext.getObject().translate(...args);
        }

        this.ctx.setEventListener('open.note',function(note){
            appContext.triggerEvent('open.note',note);
        });

        this.ctx.options.callbacks.onInit = function() {
            _init(this.ctx);
        };

        this.ctx.initialize();
    }
    toggleGrid(isGrid) {
        this.ctx.triggerEvent('toggle.grid',isGrid);
    }
    getContainer() {
        return this.ctx.getContainer();
    }
    /**
     * 
     * @param {AppContext} ctx 
     * @param {(note: any) => boolean} [filter=(note)=>true] 
     * @param {Object} [options] 
     * @returns {Notes}
     */
    static all(ctx,filter=(note)=>true,options={}) {
        const notes = new this(ctx,{
            onFilter: function(note,callback){
                callback(filter(note));
            },
        },options);

        return notes;
    }
}

export default Notes;