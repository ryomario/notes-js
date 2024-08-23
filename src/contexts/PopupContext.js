import BaseContext from "./BaseContext";
import Popup from "@/components/popup";

export default class PopupContext extends BaseContext {
    _contextName = 'NoteBookPopup';
    /**
     * 
     * @param {Popup} $obj 
     * @param {Object} options 
     */
    constructor($obj, options) {
        super($obj,options,false);
    }
}