import AppContext from "@/contexts/AppContext";
import Note from "../notes/Note";
import Modal from "./";
import Notebook from "@/notebook";
import "./note-modal.css";
import ModalContext from "@/contexts/ModalContext";
import dom from "@/utils/dom";
import { InputLabels, InputNoteEditor, InputText, InputToggle } from "../forms/inputs";

/**
 * 
 * @param {ModalContext} ctx 
 */
function _init(ctx) {
    /**
     * @type {Note}
     */
    const note = ctx.getObject().note;

    const readonly = !ctx.getObject().settings.editable;

    const {container: field_title, setOnChange: setOnChangeTitle} = InputText({
        label: Notebook.l10n('notemodal.title.inputlabel'),
        value: note.title,
        inputname: 'input-title',
        hint: readonly?'':Notebook.l10n('notemodal.title.inputhint'),
        readonly,
    });
    const {container: field_labels, setOnChange: setOnChangeLabels} = InputLabels({
        label: Notebook.l10n('notemodal.labels.inputlabel'),
        value: note.labels.join(','),
        inputname: 'input-labels',
        hint: readonly?'':Notebook.l10n('notemodal.labels.inputhint'),
        readonly,
    });
    const {container: field_pinned, setOnChange: setOnChangePinned} = InputToggle({
        label: Notebook.l10n('notemodal.pinned.inputlabel'),
        value: note.pinned,
        inputname: 'input-pinned',
        readonly,
    });
    const {container: field_content, setOnChange: setOnChangeContent} = InputNoteEditor({
        label: Notebook.l10n('notemodal.content.inputlabel'),
        value: note.content,
        inputname: 'input-content',
        readonly,
    });
    const elems = {
        field_title,
        field_labels,
        field_pinned,
        field_content,
    };

    /**
     * Attach elements
     */
    ctx.triggerEvent('append.elements',elems.field_title);
    if((readonly && note.labels.length > 0) || !readonly)ctx.triggerEvent('append.elements',elems.field_labels);
    ctx.triggerEvent('append.elements',elems.field_pinned);
    ctx.triggerEvent('append.elements',elems.field_content);

    /**
     * Set listeners
     */
    setOnChangeTitle(function(e,input){
        if(!e.isTrusted)return;
        const val = input.value.trim();
        if(val){
            note.title = val;
        }
    });
    setOnChangeLabels(function(e,input){
        if(!e.isTrusted)return; // TODO, cannot triggered programmatically
        const val = input.value.trim();
        if(val){
            note.labels = val;
        }
    });
    setOnChangePinned(function(e,input){
        if(!e.isTrusted)return;
        const val = input.checked;
        note.pinned = val;
    });
    setOnChangeContent(function(content){
        note.content = content;
    });
    
    ctx.addEventListener('destroy',function(){
        setOnChangeTitle(null);
        setOnChangeLabels(null);
        setOnChangePinned(null);
    });
}

/**
 * 
 * @param {Object} elems 
 * @param {ModalContext} ctx 
 */
function _initListeners(elems,ctx) {
    /**
     * @type {Note}
     */
    const note = ctx.getObject().note;

}

class NoteModal extends Modal {
    oldnote;
    existnote;
    /**
     * @type {Note}
     */
    note;
    constructor(note,settings) {
        super(settings);
        const $this = this;

        if(note){
            this.existnote = note;
        }else{
            note = Note.createNewFromObject({
                title: Notebook.l10n('new_note_title'),
                content: Notebook.l10n('new_note_content'),
            });
        }
        this.oldnote = note;
        this.note = Note.copy(note);

        this.settings.onbeforeclose = function(params) {
            // false if click from outside box
            // return !params?.fromOutside;
            // false (not closed) if _changed == true
            if(Note.isChanged($this.note,$this.oldnote)){
                return window.confirm(Notebook.l10n('notemodal.confirm.discardchange'));
            }
            return true;
        }

        _init(this.ctx);
    }

    /**
     * 
     * @param {Note} note 
     * @param {boolean} editable 
     * @param {AppContext} appContext 
     */
    static open(note, editable, appContext) {
        if(appContext.modal)appContext.modal.Close();
        const input_title = note?'notemodal.title.edit':'notemodal.title.new';
        const modal = new NoteModal(note,{
            title: appContext.translate(editable?input_title:'notemodal.title.view'),
            size: 'lg',
            btnOK: editable?appContext.translate('notemodal.btntext.save'):null,
            editable,
            showToggleFullscreen: true,
        });

        modal.ctx.addEventListener('close',function(){
            modal.Destroy();
            appContext.modal = null;
        });

        modal.ctx.options.callbacks.onClickOk = function(){
            function callback(saved) {
                if(saved)modal.Close({forceclose:true});
                else modal.ctx.triggerEvent('animate.shake');
            }
            if(modal.existnote){
                appContext.triggerEvent('save.note',modal.note,callback);
            }else{
                appContext.triggerEvent('add.note',modal.note,callback);
            }
        };
        appContext.modal = modal;

        modal.Open();
    }
}

export default NoteModal;