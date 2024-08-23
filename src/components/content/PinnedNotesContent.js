import AppContext from "@/contexts/AppContext";
import NotesContent from "./NotesContent";
import Notes from "../notes";

class PinnedNotesContent extends NotesContent {
    /**
     * 
     * @param {AppContext} ctx 
     */
    constructor(ctx) {
        super();
        this.title = ctx.getObject().translate('__content.pinnednotes.title__');
        this.message = ctx.getObject().translate('__content.pinnednotes.message__');
        this.notes = Notes.all(ctx,(note)=>note.pinned);
        this.content = this.notes.getContainer();
    }
}

export default PinnedNotesContent;