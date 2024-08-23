import Modal from "./";
import AppContext from "@/contexts/AppContext";
import ModalContext from "@/contexts/ModalContext";
import dom from "@/utils/dom";
import func from "@/utils/func";

/**
 * 
 * @param {ModalContext} ctx 
 */
function _init(ctx) {
    const app = ctx.getObject();
    const elems = {
        config_devmode_label: dom.createNode('label'),
        config_devmode_input: dom.createNode('input','',{type:'checkbox',name:'config-devmode'}),
    };
    elems.config_devmode_label.appendChild(elems.config_devmode_input);
    elems.config_devmode_label.append('Development Mode');

    // TODO, input to change config

    ctx.triggerEvent('append.elements',elems.config_devmode_label);

    function HandleChangeConfigDevmode(e) {
        if(!e.isTrusted)return;
        if(elems.config_devmode_input.checked !== app._olddata['devmode']){
            app._changed = true;
        } else {
            app._changed = false;
        }
        app._newdata['devmode'] = elems.config_devmode_input.checked;
    }
    elems.config_devmode_input.addEventListener('change',HandleChangeConfigDevmode);

    ctx.options.callbacks.onClickOk = function() {
        ctx.triggerEvent('change.configs',app._newdata);
    };

    ctx.addEventListener('open',function() {
        _updateValues(ctx, elems);
    });
}

function _updateValues(ctx, elems) {
    const app = ctx.getObject();
    app._reset();
    elems.config_devmode_input.checked = app._olddata['devmode'];
}

class ModalConfig extends Modal {
    /**
     * @readonly
     */
    _olddata;
    _newdata;
    _changed;
    constructor(dataConfig, settings) {
        super(settings);

        const $this = this;
        this._olddata = func.copyObject(dataConfig);
        this._reset();

        this.settings.onbeforeclose = function(params) {
            // false if click from outside box
            // return !params?.fromOutside;
            // false (not closed) if _changed == true
            if($this._changed){
                return window.confirm($this.translate('modalconfig.confirm.discardchange'));
            }
            return true;
        }

        this.ctx.options.callbacks.onChangeConfig = this.settings.onconfigchange;
        this.ctx.options.callbacks.onChangeConfigs = this.settings.onconfigschange;

        _init(this.ctx);
    }
    _reset() {
        this._newdata = func.copyObject(this._olddata);
        this._changed = false;
    }


    /**
     * @type {ModalConfig|undefined}
     */
    static _instance;

    /**
     * 
     * @param {AppContext} ctx 
     * @returns {ModalConfig}
     */
    static getInstance(ctx) {
        if(!this._instance){
            const app = ctx.getObject();
            this._instance = new ModalConfig(ctx.getConfig(),{
                title: app.translate('modalconfig.title'),
                size: 'md',
                btnOK: app.translate('modalconfig.okbtn'),
                // align: 'top|left',
                onconfigchange: function(cfgName, value) {
                    ctx.triggerEvent('config.change',cfgName,value);
                },
                onconfigschange: function(value) {
                    ctx.triggerEvent('configs.change',value);
                },
            });
            this._instance.translate = function() {
                return app.translate(...arguments);
            };
            this._instance.ctx.addEventListener('open',function(){
                ctx.modal = ModalConfig._instance;
            });
            this._instance.ctx.addEventListener('close',function(){
                ctx.modal = null;
            });

            ctx.addEventListener('destroy', function() {
                ModalConfig.destroyIfExist();
            });
        }

        return this._instance;
    }
    static destroyIfExist() {
        if(this._instance)this._instance.Destroy();
        this._instance = null;
    }
}

export default ModalConfig;