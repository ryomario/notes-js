import dom from "@/utils/dom";
import "./content.css";
import AppContext from "@/contexts/AppContext";

const elems = {
    container: dom.createNode('div','content'),
    header: dom.createNode('div','content-header'),
    head: dom.createNode('div','content-head'),
    tools: dom.createNode('div','content-tools'),
    title: dom.createNode('div','content-title'),
    subtitle: dom.createNode('div','content-subtitle'),
    content: dom.createNode('div'),
};

function fetchElements() {
    elems.container.appendChild(elems.header);
    elems.header.appendChild(elems.head);
    elems.header.appendChild(elems.tools);
    elems.head.appendChild(elems.title);
    elems.head.appendChild(elems.subtitle);
    elems.container.appendChild(elems.content);
}
function _setTools(nodes) {
    while(elems.tools.firstChild)elems.tools.lastChild.remove();
    if(nodes && Array.isArray(nodes) && nodes.length > 0){
        elems.tools.append(...nodes);
        elems.tools.style.display = '';
    }else {
        elems.tools.style.display = 'none';
    }
}
function _setTitle(title) {
    elems.title.textContent = title;
}
/**
 * 
 * @param {string|boolean|undefined} subtitle 
 */
function _setSubtitle(subtitle) {
    if(!subtitle || !subtitle.trim()){
        elems.subtitle.style.display = 'none';
    } else {
        elems.subtitle.style.display = '';
        elems.subtitle.textContent = subtitle;
    }
}

function _setContentNode(node) {
    while(elems.content.firstChild)elems.content.lastChild.remove();
    elems.content.append(node);
}

fetchElements();

class Content {
    title;
    message;
    tools;
    content;
    settings;
    constructor(title='',message='') {
        this.title = title;
        this.message = message;
        this.tools = [];
        this.content = '';
        this.settings = {};
    }
    show() {
        Content.setTitle(this.title);
        Content.setMessage(this.message);
        Content.setContent(this.content);
        Content.setTools(this.tools);
    }
    setSetting(name, value) {
        this.settings[name] = value;
    }
    getSetting(name) {
        return this.settings[name];
    }

    static getContainer() {
        return elems.container;
    }
    static setTitle(title) {
        _setTitle(title);
    }
    static setMessage(message) {
        _setSubtitle(message);
    }
    static setTools(toolNodes) {
        _setTools(toolNodes);
    }
    /**
     * 
     * @param {Node} node 
     */
    static setContent(node) {
        _setContentNode(node);
    }
    static DestroyIfExist() {
        if(this._container)this._container.remove();
        this._container = null;
    }

    /**
     * for singleton, don't access directly
     */
    static _content;
    /**
     * 
     * @param {AppContext} ctx 
     * @returns 
     */
    static getInstance(ctx) {
        if(!this._content)this._content = new this(ctx);
        return this._content;
    }
    /**
     * 
     * @param {AppContext} ctx 
     */
    static show(ctx) {
        this.getInstance(ctx).show();
    }
}
export default Content;