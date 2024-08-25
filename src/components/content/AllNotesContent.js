import AppContext from "@/contexts/AppContext";
import NotesContent from "./NotesContent";
import dom from "@/utils/dom";
import Notes from "../notes";

class AllNotesContent extends NotesContent {
    /**
     * 
     * @param {AppContext} ctx 
     */
    constructor(ctx) {
        super({
            // 'sort.pinnedOnTop':true,
            'gridView': true,
        });
        this.title = ctx.getObject().translate('__content.allnotes.title__');
        this.message = ctx.getObject().translate('__content.allnotes.message__');
        this.notes = Notes.all(ctx,()=>true,this.settings);
        this.content = this.notes.getContainer();
    }
}

export default AllNotesContent;