import AppContext from "@/contexts/AppContext";
import Content from "./Content";
import dom from "@/utils/dom";
import func from "@/utils/func";
import iconElement from "@/assets/icons";
import Notebook from "@/notebook";
import Notes from "../notes";

/**
 * 
 * @param {NotesContent} content 
 */
function initTools(content) {
    const elems = {
        toogle_layout: dom.createNode('button','btn-icon'),
        toogle_sort: dom.createNode('button','btn-icon'),
    }

    content.updateTools = function() {
        setToolsContents(elems,content);
    }

    elems.toogle_layout.addEventListener('click',function(e) {
        if(!e.isTrusted)return;
        const isGrid = !content.getSetting('gridView'); // toggle
        content.notes.toggleGrid(isGrid);
        content.setSetting('gridView',isGrid);
        content.updateTools();
    });

    content.tools.push(
        elems.toogle_layout,
        elems.toogle_sort
    );
    content.updateTools();
}
function setToolsContents(elems,content) {
    elems.toogle_layout.innerHTML = '';
    elems.toogle_sort.innerHTML = '';
    elems.toogle_layout.append(iconElement(content.getSetting('gridView')?'layout-list':'layout-grid'));
    elems.toogle_sort.append(iconElement('sort'));

    elems.toogle_layout.setAttribute('title',Notebook.l10n(content.getSetting('gridView')?'list_view':'grid_view'));
    elems.toogle_sort.setAttribute('label',Notebook.l10n('sort_by'));
}

class NotesContent extends Content {
    /**
     * @type {Notes}
     */
    notes;
    constructor(settings) {
        super('','');
        this.settings = func.extendsObject({
            'sort.pinnedOnTop':true,
            'gridView': true,
        },settings);

        initTools(this);
    }
    updateTools() {
        console.log('handle updateTools!');
    }

    show() {
        super.show();
        this.updateTools();
    }
}

export default NotesContent;