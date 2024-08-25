import "./notebook.css";
import defaultSetting from "./settings";
import AppContext from "./contexts/AppContext";
import func from "@/utils/func";
import { createHeader } from "@/components/header";
import ModalConfig from "./components/modal/ModalConfig";
import { createAside } from "./components/aside";
import dom from "./utils/dom";
import Content from "./components/content/Content";
import NoteModal from "./components/modal/NoteModal";
import NotesDB from "./db/notesDB";
import Notes from "./components/notes";

// for singleton object
/**
 * @type {AppContext|undefined}
 */
let ctx;

/**
 * On ctx initialize
 */
function _init() {
    const app = ctx.getObject();
    const {
        header: headerElement,
    } = createHeader(ctx, {
        appname: Notebook.appname,
    });
    const {
        aside: asideElement,
    } = createAside(ctx, {
        // options
    });
    const elems = {
        header: headerElement,

        main: dom.createNode('main'),
        aside: asideElement,
    }

    _attachElements(elems);

    ctx.setEventListener('open.search.modal',function(){
        console.log('open search modal');
    });
    ctx.setEventListener('open.settings.modal',function(){
        if(ctx.modal)ctx.modal.Close();
        ModalConfig.getInstance(ctx).Open();
    });
    ctx.setEventListener('open.add.note.modal',function(){
        NoteModal.open(null, true, ctx);
    });
    ctx.setEventListener('open.note',function(note){
        NoteModal.open(note, false, ctx);
    });
    ctx.setEventListener('edit.note',function(note){
        NoteModal.open(note, true, ctx);
    });
    ctx.setEventListener('save.note',function(note,callback){
        NotesDB.saveNote(note.toObject()).then((result) => {
            callback(true);
            Notes.triggerEvent('changed.note',note);
            console.log('saved note');
        }).catch(error => {
            callback(false);
        });
    });
    ctx.setEventListener('add.note',function(note,callback){
        console.log('add note',note);
        NotesDB.saveNote(note.toObject()).then((result) => {
            callback(true);
            Notes.triggerEvent('loaded.note',note);
            console.log('added note');
        }).catch(error => {
            callback(false);
        });
    });
}

function _attachElements(elems) {
    const app = ctx.getObject();    

    app._parentelem.classList.add('app');
    
    app._parentelem.appendChild(elems.header);
    app._parentelem.appendChild(elems.main);
    elems.main.appendChild(elems.aside);
    elems.main.appendChild(Content.getContainer());

    ctx.addEventListener('destroy', function() {
        this._parentelem.removeChild(elems.main);
    });
}

const defaultOptions = defaultSetting.options;

/**
 * Singleton, get object by `Notebook.instance(element,settings)`
 */
class Notebook {
    _parentelem;
    _settings;

    Destroy() {
        ctx.triggerEvent('destroy');
        console.log('Destroy Notebook');
    }

    translate(name) {
        const lang = this._settings.lang;
        const langInfo = this._settings.langInfo;
        // check user defined first, then check available lang from app, then check if user re define it with null, then return its name if nott exist
        return langInfo[name] ?? Notebook.lang[lang]?.[name] ?? defaultOptions.langInfo[name] ?? name;
    }

    /**
     * 
     * @param {HTMLElement} parentel 
     * @param {defaultOptions} settings
     * @returns {Notebook}
     */
    static initialize(parentel, settings) {
        let instance = new Notebook();
        if(!ctx) {
            instance._parentelem = parentel;
            instance._settings = func.extendsObject(defaultOptions, {
                langInfo: defaultSetting.lang[settings.lang],
            });
            instance._settings = func.extendsObject(instance._settings, settings);

            ctx = new AppContext(instance,{
                callbacks: {
                    onInit: function() {
                        _init();
                    },
                },
            });
            ctx.initialize();
        }else {
            instance = ctx.getObject();
            if(parentel !== instance._parentelem)throw new Error('Cannot initialize multiple Apps!');
        }

        return instance;
    }
    static lang(def = 'en') {
        return !ctx ? def : ctx.getObject()._settings.lang;
    }
    static l10n(name, givenlang) {
        let lang = !ctx ? defaultOptions.lang : ctx.getObject()._settings.lang;
        if(givenlang?.trim())lang = givenlang;
        const langInfo = !ctx ? defaultOptions.langInfo : ctx.getObject()._settings.langInfo;
        // check user defined first, then check available lang from app, then check if user re define it with null, then return its name if nott exist
        return langInfo[name] ?? Notebook.lang[lang]?.[name] ?? defaultOptions.langInfo[name] ?? name;
    }
}
for (const key in defaultSetting) {
    if (key !== 'options') {
        Notebook[key] = defaultSetting[key];
    }
}

export default Notebook;