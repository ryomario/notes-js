import PopupContext from "@/contexts/PopupContext";
import dom from "@/utils/dom";
import func from "@/utils/func";
import "./popup.css";

/**
 * only accessable inside this module
 * @param {Popup} $this
 */
function _init($this) {
    const elems = {
        popupwrap: dom.createNode('div',$this.settings.prefix + 'popup_wrap'),
        popupinner: dom.createNode('div',$this.settings.prefix + 'popup_inner'),
    };
    elems.popupwrap.appendChild(elems.popupinner);

    function MainClickHandler(e) {
        e.preventDefault();
        if(!e.isTrusted)return;
        let node = e.target;
        while(node && node !== elems.popupwrap)node = node?.parentNode;
        if(node === elems.popupwrap)return;

        // onclick outside
        $this.Destroy();
    }

    const UpdatePosition = _UpdatePosition.bind($this);

    UpdatePosition(elems.popupwrap);

    $this.ctx.options.callbacks.onClose = function() {
        $this.Destroy();
    }

    $this.ctx.options.callbacks.onDestroy = function() {
        $this.parentelem.removeChild(elems.popupwrap);
        $this.parentelem.style.position = '';
        elems.popupwrap.removeChild(elems.popupinner);

        document.removeEventListener('click',MainClickHandler,true);
    }

    $this.ctx.options.callbacks.onOpen = function() {
        document.addEventListener('click',MainClickHandler,true);

        $this.parentelem.style.position = 'relative';
        $this.parentelem.appendChild(elems.popupwrap);
    }
}
/**
 * only accessable inside this module
 * @this {Popup}
 * @param {HTMLElement} popupwrap
 */
function _UpdatePosition(popupwrap) {
    popupwrap.style.left = '-9999px';

    this.ctx.triggerEvent('change.position', popupwrap);
}

class Popup {
    parentelem;
    settings;
    ctx;
    constructor(parentel, settings) {
        this.parentelem = parentel;
        this.settings = func.extendsObject(Popup.defaultSettings,settings);
        this.ctx = new PopupContext(this,{
            callbacks: {
                /**
                 * @this {Popup}
                 */
                onInit: function() {
                    _init(this);
                },
                onChangePosition: function(popupwrap) {
                    if(this.settings.onposition)this.settings.onposition(popupwrap);
                },
            },
        });

        this.ctx.initialize();
    }
    Open() {
        this.ctx.triggerEvent('open');
    }

    Close() {
        this.ctx.triggerEvent('close');
        if(this.settings.onclose)this.settings.onclose();
    }

    Destroy() {
        this.ctx.triggerEvent('destroy');
        if(this.settings.ondestroy)this.settings.ondestroy();
    }
}
Popup.defaultSettings = {
    prefix: '',
    onposition: null,
    onclose: null,

    ondestroy: null
};

export default Popup;