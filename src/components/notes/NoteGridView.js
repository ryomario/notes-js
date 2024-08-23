import NoteContext from "@/contexts/NoteContext";
import Note from "./Note";
import dom from "@/utils/dom";
import Notebook from "@/notebook";
import iconElement from "@/assets/icons";
import "./note-grid.css";
import func from "@/utils/func";

function _attachElements(elems) {
    elems.container.appendChild(elems.header);
    elems.container.appendChild(elems.content_container);
    elems.container.appendChild(elems.footer);

    elems.header.appendChild(elems.label_pinned);
    elems.header.appendChild(elems.title);
    elems.header.appendChild(elems.tools);
    elems.tools.appendChild(elems.btn_options)

    elems.content_container.appendChild(elems.content_labels);
    elems.content_container.appendChild(elems.content);

    elems.footer.appendChild(elems.btn_view);
    elems.footer.appendChild(elems.info);
}

/**
 * 
 * @param {Object} elems 
 * @param {Note} note 
 */
function _attachContents(elems, note) {
    elems.container.dataset.noteid = note.id;
    elems.btn_view.textContent = Notebook.l10n('view_note');
    elems.btn_options.title = Notebook.l10n('note_options');
    elems.btn_options.appendChild(iconElement('option'));
    elems.label_pinned.appendChild(iconElement('pinned'));
    
    elems.label_pinned.style.display = note.pinned ? '' : 'none';
    elems.title.textContent = note.title;
    elems.title.title = note.title;
    if(note.ishtml)elems.content.innerHTML = note.content;
    else elems.content.innerText = note.content;
    elems.info.textContent = func.formatString(Notebook.l10n('updated_{1}'),note.getLastUpdated());
    while(elems.content_labels.firstChild)elems.content_labels.removeChild(elems.content_labels.lastChild);
    let labels = note.labels;
    labels.forEach(label => {
        let el = dom.createNoteLabel(label);
        elems.content_labels.appendChild(el);
    });
    if(labels.length > 0)elems.content_labels.style.display = '';
    else elems.content_labels.style.display = 'none';
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
    elems.btn_view.addEventListener('click',handleOpenNote);
    
    note._ctx.addEventListener('destroy.view',function(){
        elems.btn_view.removeEventListener('click',handleOpenNote);

    });
}

class NoteGridView {
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
            container: dom.createNode('div','note card'),
            header: dom.createNode('div','note-header'),
            title: dom.createNode('div','note-title'),
            tools: dom.createNode('div','note-tools'),
            label_pinned: dom.createNode('button','btn-icon icon-pinned disabled'),
            btn_options: dom.createNode('button','btn-icon note-btn-delete'),
            content_container: dom.createNode('div','note-content'),
            content_labels: dom.createNode('div','note-labels'),
            content: dom.createNode('div'),
            footer: dom.createNode('div','footer'),
            btn_view: dom.createNode('button','btn-text note-btn-view'),
            info: dom.createNode('span','note-info'),
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

export default NoteGridView;