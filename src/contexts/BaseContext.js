import func from "@/utils/func";
import arrays from "@/utils/arrays";

export default class BaseContext {
    _contextName = 'base';
    _listeners;
    /**
     * 
     * @param {any} $obj
     * @param {Object} options 
     * @param {boolean} [mustInit=true] 
     */
    constructor($obj, options, mustInit = true) {
        this.$obj = $obj;

        this.options = func.extendsObject({
            callbacks: {},
        },options);

        this._listeners = {};

        if(mustInit)this.initialize();
    }
    setOption(name,value) {
        this.options[name] = value;
    }
    getOption(name) {
        return this.options[name] ?? false;
    }
    getObject() {
        return this.$obj;
    }
    getContextName() {
        return this._contextName ? this._contextName : this.constructor.name;
    }

    initialize() {
        this._initialize();
        this.triggerEvent('init');
        return this;
    }

    _initialize() {
        this.options.id = func.uniqueId(this.getContextName());
        this.options.container = this.options.container || this.$obj;
    }

    triggerEvent() {
        const namespace = arrays.first(arguments);
        const args = arrays.tail(arrays.from(arguments));
    
        const callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
        if (callback) {
            callback.apply(this.$obj, args);
        }
        if(this._listeners[namespace] && this._listeners[namespace].length > 0) {
            for (const listener of this._listeners[namespace]) {
                listener.apply(this.$obj, args);
            }
        }
    }
    hasEventListener() {
        const namespace = arrays.first(arguments);

        const callback = this.options.callbacks[func.namespaceToCamel(namespace, 'on')];
        if(callback) return true;
        return (this._listeners[namespace] && this._listeners[namespace].length > 0);
    }
    addEventListener() {
        const namespace = arrays.first(arguments);

        const listeners = arrays.tail(arrays.from(arguments));

        if(!this._listeners[namespace])this._listeners[namespace] = [];
        for (const listener of listeners) {
            if(!this._listeners[namespace].includes(item => item === listener)){
                this._listeners[namespace].push(listener);
            }
        }
    }
    /**
     * Remove existing listeners and replace it with given listeners
     */
    setEventListener() {
        const namespace = arrays.first(arguments);

        const listeners = arrays.tail(arrays.from(arguments));

        this._listeners[namespace] = [];
        for (const listener of listeners) {
            if(!this._listeners[namespace].includes(item => item === listener)){
                this._listeners[namespace].push(listener);
            }
        }
    }
    removeEventListener() {
        const namespace = arrays.first(arguments);

        const listeners = arrays.tail(arrays.from(arguments));

        if(!this._listeners[namespace])return;

        for (const listener of listeners) {
            const idx = this._listeners[namespace].findIndex(item => item === listener);
            if(idx != -1){
                this._listeners[namespace].splice(idx,1);
            }
        }
    }
    translate(str) {
        return str;
    }
}