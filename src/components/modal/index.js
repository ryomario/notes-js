import ModalContext from "@/contexts/ModalContext";
import dom from "@/utils/dom";
import func from "@/utils/func";
import "./modal.css";
import iconElement from "@/assets/icons";
import Notebook from "@/notebook";

/**
 * @param {ModalContext} ctx
 */
function _init(ctx) {
    const app = ctx.getObject();
    const elems = {
        container: dom.createNode('div','modal-container'),
        box: dom.createNode('div','modal-box'),

        header: dom.createNode('div','modal-header'),
        title: dom.createNode('div','modal-title'),
        fullscreenBtn: dom.createNode('div','fullscreen-btn'),
        closeBtn: dom.createNode('div','close-btn'),

        content: dom.createNode('div','modal-content'),

        footer: dom.createNode('div','modal-footer'),
        btnOK: dom.createNode('button','modal-btn-ok'),
    };
    if(app.settings.btnOK instanceof HTMLElement)elems.btnOK = app.settings.btnOK;
    
    ctx.addEventListener('animate.shake',function() {
        const magnitude = {'lg':1,'md':2,'sm': 5};
        dom.animateShake(elems.box,magnitude[app.settings.size]??2);
    });
    ctx.addEventListener('append.elements',function(...nodes) {
        elems.content.append(...nodes);
    });
    function handleOnChangeFullscreen(e) {
        if(document.fullscreenElement){
            // entering fullscreen
        }else{
            ctx.triggerEvent('exit.fullscreen');
        }
    }
    ctx.addEventListener('beforeenter.fullscreen',function() {
        elems.container.classList.add('fullscreen');
        elems.fullscreenBtn.innerHTML = '';
        elems.fullscreenBtn.append(iconElement('minimize'));

        document.addEventListener('fullscreenchange',handleOnChangeFullscreen);
    });
    ctx.addEventListener('exit.fullscreen',function() {
        elems.container.classList.remove('fullscreen');
        elems.fullscreenBtn.innerHTML = '';
        elems.fullscreenBtn.append(iconElement('maximize'));

        document.removeEventListener('fullscreenchange',handleOnChangeFullscreen);
    });
    ctx.setEventListener('toggle.fullscreen',function(){
        if(document.fullscreenEnabled) {

            if(document.fullscreenElement){
                // will exit fullscreen
                document.exitFullscreen();
            }else{
                // will enter fullscreen
                ctx.triggerEvent('beforeenter.fullscreen');

                if (elems.container.requestFullscreen) {
                    elems.container.requestFullscreen();
                } else if (elems.container.webkitRequestFullscreen) { /* Safari */
                    elems.container.webkitRequestFullscreen();
                } else if (elems.container.msRequestFullscreen) { /* IE11 */
                    elems.container.msRequestFullscreen();
                }
            }
        } else {
            alert(Notebook.l10n('fullscreen.not.supported'));
        }
    });

    _attachElements(ctx, elems);

    ctx.options.callbacks.onClickOk = function() {
        console.log("OK clicked");
        app.Close();
    }

    ctx.options.callbacks.onClose = function() {
        elems.container.remove();
    }

    ctx.options.callbacks.onOpen = function() {
        document.body.appendChild(elems.container);
    }

    ctx.addEventListener('destroy', function() {
        elems.container.remove();
    });

}
/**
 * @param {ModalContext} ctx
 */
function _attachElements(ctx,elems) {
    const app = ctx.getObject();
    elems.container.appendChild(elems.box);
    if(!app.settings.onlyBox){
        elems.box.appendChild(elems.header);
        elems.header.appendChild(elems.title);
        if(app.settings.showToggleFullscreen){
            elems.header.appendChild(elems.fullscreenBtn);
            elems.fullscreenBtn.append(iconElement('maximize'));
            elems.fullscreenBtn.setAttribute('title',Notebook.l10n('toggle_fullscreen'));
        }
        elems.header.appendChild(elems.closeBtn);
        elems.closeBtn.append(iconElement('x'));
    }
    elems.box.appendChild(elems.content);
    if(!app.settings.onlyBox){
        elems.box.appendChild(elems.footer);
        if(app.settings.btnOK)elems.footer.appendChild(elems.btnOK);
    }
    const modal_size = app.settings.size ?? 'lg';
    elems.box.classList.add('modal-'+modal_size);
    if(app.settings.align){
        const align_classes = (app.settings.align ?? '').split('|').map(align => 'align-' + align);
        elems.container.classList.add(...align_classes);
    }

    elems.title.textContent = app.settings.title;
    if(typeof app.settings.btnOK === 'string')elems.btnOK.textContent = app.settings.btnOK;

    function HandleMainClick(e) {
        if(!e.isTrusted)return;
        if(e.target === elems.container){
            // click outside modal box
            app.Close({fromOutside: true, container: elems.container});
        }
    }
    function HandleClickClose(e) {
        if(!e.isTrusted)return;
        app.Close({fromOutside: false, container: elems.container});
    }
    function HandleClickOK(e) {
        if(!e.isTrusted)return;
        ctx.triggerEvent('click.ok');
    }
    function HandleClickFullscreen(e) {
        if(!e.isTrusted)return;
        ctx.triggerEvent('toggle.fullscreen');
    }
    elems.container.addEventListener('click', HandleMainClick);
    if(!app.settings.onlyBox){
        elems.closeBtn.addEventListener('click', HandleClickClose);
        elems.btnOK.addEventListener('click', HandleClickOK);
        elems.fullscreenBtn.addEventListener('click', HandleClickFullscreen);
    }
    
    ctx.addEventListener('destroy', function() {
        elems.container.removeEventListener('click', HandleMainClick);
        if(!app.settings.onlyBox){
            elems.closeBtn.removeEventListener('click', HandleClickClose);
            elems.btnOK.removeEventListener('click', HandleClickOK);
            elems.fullscreenBtn.removeEventListener('click', HandleClickFullscreen);
        }
    });
}


class Modal {
    settings;
    ctx;
    constructor(settings) {
        this.settings = func.extendsObject(Modal.defaultSettings,settings);
        this.ctx = new ModalContext(this,{
            callbacks: {
                onInit: function() {
                    _init(this.ctx);
                },
            },
        });
        this.ctx.initialize();
    }
    Close(params) {
        if(!params?.forceclose && this.settings.onbeforeclose && !this.settings.onbeforeclose(params)){
            this.ctx.triggerEvent('animate.shake');
            return;
        }
        this.ctx.triggerEvent('close');
        if(this.settings.onclose)this.settings.onclose();
    }
    Open() {
        this.ctx.triggerEvent('open');
        if(this.settings.onopen)this.settings.onopen();
    }
    Destroy() {
        this.ctx.triggerEvent('destroy');
        if(this.settings.ondestroy)this.settings.ondestroy();
    }
}
Modal.defaultSettings = {
    title: 'Modal',
    size: 'lg',
    align: '',
    onlyBox: false,
    btnOK: 'OK',
    showToggleFullscreen: false,
}

export default Modal;