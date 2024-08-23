import NoteContext from "@/contexts/NoteContext";
import Note from "./Note";
import dom from "@/utils/dom";
import Notebook from "@/notebook";
import iconElement from "@/assets/icons";
import "./note-list.css";
import func from "@/utils/func";

function _attachElements(elems) {
    elems.container.appendChild(elems.main);
    elems.container.appendChild(elems.tools);

    elems.main.appendChild(elems.header);
    elems.main.appendChild(elems.labels);

    elems.header.appendChild(elems.label_pinned);
    elems.header.appendChild(elems.title);

    elems.tools.appendChild(elems.tool_info);
    elems.tools.appendChild(elems.tool_btn_options);
}

/**
 * 
 * @param {Object} elems 
 * @param {Note} note 
 */
function _attachContents(elems, note) {
    elems.container.dataset.noteid = note.id;
    elems.tool_btn_options.title = Notebook.l10n('note_options');
    elems.tool_btn_options.appendChild(iconElement('option'));
    elems.label_pinned.appendChild(iconElement('pinned'));

    elems.label_pinned.style.display = note.pinned ? '' : 'none';
    elems.title.textContent = note.title;
    elems.title.title = note.title;
    
    elems.tool_info.textContent = func.formatString(Notebook.l10n('updated_{1}'),note.getLastUpdated());
    while(elems.labels.firstChild)elems.labels.lastChild.remove();
    let labels = note.labels;
    labels.forEach(label => {
        let el = dom.createNoteLabel(label);
        elems.labels.appendChild(el);
    });
    if(labels.length > 0)elems.labels.style.display = '';
    else elems.labels.style.display = 'none';
    note._ctx.triggerEvent('sort.notes');
}

/**
 * 
 * @param {Object} elems 
 * @param {Note} note 
 */
function _attachListeners(elems, note) {
    function handleOpenNote(e) {
        if(!e.isTrusted)return;
        note._ctx.triggerEvent('open.note');
    }
    elems.container.addEventListener('click',handleOpenNote);
    elems.tool_btn_options.addEventListener('click',function(e){
        e.preventDefault();
        e.stopPropagation();
        console.log('click options');
        // TODO
    });

    note._ctx.addEventListener('destroy.view',function(){
        elems.container.removeEventListener('click',handleOpenNote);

    });
}

class NoteListView {
    /**
     * 
     * @param {Note} note
     */
    static create(note){
        /**
         * @type {NoteContext}
         */
        const ctx = note._ctx;

        const elems = {
            container: dom.createNode('div','note'),

            main: dom.createNode('div','note-main'),

            header: dom.createNode('div','note-header'),
            title: dom.createNode('div','note-title'),
            label_pinned: dom.createNode('button','btn-icon icon-pinned disabled'),
            labels: dom.createNode('div','note-labels'),

            tools: dom.createNode('div','note-tools'),
            tool_info: dom.createNode('span','note-info'),
            tool_btn_options: dom.createNode('button','btn-icon note-btn-options'),
        };
        
        _attachElements(elems);
        _attachListeners(elems,note);
        _attachContents(elems, note);

        ctx.addEventListener('change.note', function() {
            _attachContents(elems, note);
        });
        ctx.addEventListener('sort.note', function(order) {
            elems.container.style.order = order;
        });

        ctx.addEventListener('destroy', function() {
            while(elems.container.firstChild)elems.container.lastChild.remove();
            elems.container.remove();
        });

        return elems.container;
    }
}

export default NoteListView;