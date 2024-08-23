import Note from "@/components/notes/Note";
import BaseContext from "./BaseContext";

export default class NoteContext extends BaseContext {
    _contextName = 'NoteBookNote';
    /**
     * 
     * @param {Note} $obj
     * @param {Object} options 
     */
    constructor($obj, options) {
        super($obj,options,false);
    }
}