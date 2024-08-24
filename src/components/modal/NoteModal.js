import AppContext from "@/contexts/AppContext";
import Note from "../notes/Note";
import Modal from "./";
import Notebook from "@/notebook";
import "./note-modal.css";
import ModalContext from "@/contexts/ModalContext";
import dom from "@/utils/dom";
import { InputField, InputLabels, InputText, InputToggle } from "../forms/inputs";

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

    const {container: field_title, input: input_title} = InputText({
        label: Notebook.l10n('notemodal.title.inputlabel'),
        value: note.title,
        inputname: 'input-title',
        hint: readonly?'':Notebook.l10n('notemodal.title.inputhint'),
        readonly,
    });
    const {container: field_labels, input: input_labels} = InputLabels({
        label: Notebook.l10n('notemodal.labels.inputlabel'),
        value: note.labels.join(','),
        inputname: 'input-labels',
        hint: readonly?'':Notebook.l10n('notemodal.labels.inputhint'),
        readonly,
    });
    const {container: field_pinned, input: input_pinned} = InputToggle({
        label: Notebook.l10n('notemodal.pinned.inputlabel'),
        value: note.pinned,
        inputname: 'input-pinned',
        readonly,
    });
    const elems = {
        field_title,
        input_title,
        field_labels,
        input_labels,
        field_pinned,
        input_pinned,
    };


    _initListeners(elems,ctx);

    elems.field_title.setAttribute('label',Notebook.l10n('notemodal.title.inputlabel'));
    elems.input_title.setAttribute('placeholder',Notebook.l10n('notemodal.title.inputlabel'));

    elems.input_title.value = note.title;

    ctx.triggerEvent('append.elements',elems.field_title);
    if((readonly && note.labels.length > 0) || !readonly)ctx.triggerEvent('append.elements',elems.field_labels);
    ctx.triggerEvent('append.elements',elems.field_pinned);

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
    function handleChangeTitle(e){
        if(!e.isTrusted)return;
        const val = elems.input_title.value.trim();
        if(val){
            note.title = val;
        }
    }
    function handleChangeLabels(e){
        // if(!e.isTrusted)return; // TODO, cannot triggered programmatically
        const val = elems.input_labels.value.trim();
        if(val){
            note.labels = val;
        }
    }
    function handleChangePinned(e){
        if(!e.isTrusted)return;
        const val = elems.input_pinned.checked;
        note.pinned = val;
    }
    elems.input_title.addEventListener('input',handleChangeTitle);
    elems.input_labels.addEventListener('input',handleChangeLabels);
    elems.input_pinned.addEventListener('input',handleChangePinned);
    
    ctx.addEventListener('destroy',function(){
        elems.input_title.removeEventListener('input',handleChangeTitle);
        elems.input_labels.removeEventListener('input',handleChangeLabels);
        elems.input_pinned.removeEventListener('input',handleChangePinned);
    })
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