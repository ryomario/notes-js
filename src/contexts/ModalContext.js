import BaseContext from "./BaseContext";
import Modal from "@/components/modal";

export default class ModalContext extends BaseContext {
    _contextName = 'NoteBookModal';
    /**
     * 
     * @param {Modal} $obj 
     * @param {Object} options 
     */
    constructor($obj, options) {
        super($obj,options,false);
    }
}