import NoteContext from "@/contexts/NoteContext";
import func from "@/utils/func";

class Note {
    _id;
    get id() {return this.getAttribute('id')}
    set id(id) {this.setAttribute('id',id)}

    _title;
    /**
     * @returns {string}
     */
    get title() {return this.getAttribute('title')}
    set title(title) {this.setAttribute('title',title)}
    _pinned;
    /**
     * @returns {boolean}
     */
    get pinned() {return this.getAttribute('pinned')}
    set pinned(pinned) {this.setAttribute('pinned',pinned)}
    _content;
    /**
     * @returns {string}
     */
    get content() {return this.getAttribute('content')}
    set content(content) {this.setAttribute('content',content)}
    _created_at;
    /**
     * @returns {Date}
     */
    get created_at() {return this.getAttribute('created_at')}
    set created_at(created_at) {this.setAttribute('created_at',created_at)}
    _updated_at;
    /**
     * @returns {Date}
     */
    get updated_at() {return this.getAttribute('updated_at')}
    set updated_at(updated_at) {this.setAttribute('updated_at',updated_at)}
    _labels;
    /**
     * @returns {Array<string>}
     */
    get labels() {return this.getAttribute('labels')}
    set labels(labels) {this.setAttribute('labels',labels)}
    
    _changed;
    /**
     * @returns {boolean}
     */
    get changed() {return this.getAttribute('changed')}
    set changed(changed) {this.setAttribute('changed',changed)}

    /**
     * @type {NoteContext}
     */
    _ctx;
    constructor(title, pinned = false) {
        this._title = title; this._pinned = pinned;
        this._content = '';
        this._labels = '';
        this._created_at = Date.now();
        this._updated_at = this._created_at;
        this._id = this._created_at.toString();
        this._changed = false;

        this._ctx = new NoteContext(this);

        this._ctx.initialize();
    }

    setAttribute(name,value) {
        switch(name){
            case 'title':case 'pinned':case 'content':
                if(this['_'+name] != value){
                    this['_'+name] = value;
                    this._changed = true;
                }
                break;
            case 'labels':
                if(Array.isArray(value))value = value.join(',');
                if(this._labels != value){
                    this._labels = value;
                    this._changed = true;
                }
                break;
            default:
                throw new Error('Can\'t changes READONLY attribute!');
        }
    }
    getAttribute(name) {
        switch(name){
            case 'id':case 'title':case 'pinned':case 'content':case 'changed':
                return this['_'+name];
            case 'labels':
                return this._labels?.split(',').map(label => label.trim()).filter(label => label) ?? [];
            case 'created_at':case 'updated_at':
                return new Date(this['_'+name]);
            default:
                throw new Error('Attribute not found!');
        }
    }

    /**
     * 
     * @returns {boolean}
     */
    hasLabels() {
        return (typeof this._labels === 'string' && this._labels !== '');
    }
    containsLabel(label) {
        return this.hasLabels() && (this.labels.findIndex(t => t.toLowerCase() == label.toLowerCase()) != -1);
    }
    /**
     * true, if contains all
     * @param {Array} labels
     * @returns 
     */
    containsLabels(labels) {
        if(!labels || labels.length == 0)return true;
        if(!this.hasLabels())return false;
        for (const label of labels) {
            if(!this.containsLabel(label))return false;
        }
        return true;
    }
    /**
     * true, if contains one or more
     * @param {Array} labels 
     * @returns 
     */
    includesLabels(labels) {
        if(!labels || labels.length == 0)return true;
        if(!this.hasLabels())return false;
        for (const label of labels) {
            if(this.containsLabel(label))return true;
        }
        return false;
    }
    addLabel(label) {
        if(!label?.trim())return;
        const labels = this.labels;
        label = label.split(',').map(l => l.trim());
        for (const l of label) {
            // add if not exist
            if(labels.indexOf(l) == -1){
                labels.push(l);
            }
        }

        this.labels = labels.join(',');
    }
    
    /**
     * 
     * @param {string} str 
     * @returns {boolean}
     */
    containsString(str) {
        return (this.title.toLowerCase().includes(str.toLowerCase())) ||
               (this.content.toLowerCase().includes(str.toLowerCase())) ||
               (this.tags?.toLowerCase().includes(str.toLowerCase()));
    }

    getLastUpdated() {
        return func.getElapsedTime(this._updated_at,Date.now());
    }


    toObject() {
        const $this = this;
        return {
            id: $this._id,
            title: $this._title,
            pinned: $this._pinned,
            content: $this._content,
            created_at: $this._created_at,
            updated_at: $this._updated_at,
            labels: $this._labels,
        }
    }

    Destroy() {
        this._ctx.triggerEvent('destroy');
    }
    /**
     * Create new model instance from an object
     * @param {{id,title,content,pinned,created_at,updated_at,labels}} obj 
     */
    assignFromObject(obj) {
        this._id = obj.id;
        this._title = obj.title;
        this._pinned = obj.pinned;
        this._content = obj.content;
        this._created_at = obj.created_at;
        this._updated_at = obj.updated_at;
        this._labels = obj.labels;
        return this;
    }
    /**
     * 
     * @param {Note} note 
     */
    static copy(note) {
        return Note.createFromObject(note.toObject());
    }
    /**
     * Create new model instance from an object
     * @param {{id,title,content,pinned,created_at,updated_at,labels}} obj 
     */
    static createFromObject(obj) {
        const note = new Note(obj.title, obj.pinned);
        note._id = obj.id;
        note._content = obj.content;
        note._created_at = obj.created_at;
        note._updated_at = obj.updated_at;
        note._labels = obj.labels;
        
        if(!obj.labels && obj.tags)note._labels = obj.tags;
        return note;
    }
    /**
     * Create new model instance from an object
     * @param {{id?,title,content,pinned?,created_at?,updated_at?,labels?}} obj 
     */
    static createNewFromObject(obj) {
        const note = new Note(obj.title, obj.pinned??false);
        if(obj.id)note._id = obj.id;
        note._content = obj.content;
        if(obj.created_at)note._created_at = obj.created_at;
        if(obj.updated_at)note._updated_at = obj.updated_at;
        if(obj.labels)note._labels = obj.labels;
        
        if(!obj.labels && obj.tags)note._labels = obj.tags;
        return note;
    }
    /**
     * Check validity from an object
     * @param {{id,title,content,pinned,created_at,updated_at,labels}} obj 
     */
    static isValidObject(obj) {
        return (obj.id) &&
               (obj.title) &&
               ('content' in obj) &&
               ('created_at' in obj) &&
               ('updated_at' in obj) &&
               (typeof obj.content === 'string') &&
               !Number.isNaN(obj.created_at) &&
               !Number.isNaN(obj.updated_at) &&
               !(obj.labels && typeof obj.labels !== 'string');
    }
    
    static compare(attr1, attr2, isAsc = true) {
        if(attr1 != attr2){
            if(typeof attr1 === 'string')return isAsc ? attr1.localeCompare(attr2):attr2.localeCompare(attr1);
            if(typeof attr1 === 'number')return isAsc ? attr1 - attr2:attr2 - attr1;
        }
        return 0;
    }

    /**
     * @param {boolean} pinnedOnTop
     * @param {Object} columns
     * @param {string} order asc | desc
     */
    static getSorterBy(pinnedOnTop = false,columns=null){
        if(!columns || Object.keys(columns).length == 0)columns = {'updated_at':'asc'};

        /**
         * @param {Note} note1
         * @param {Note} note2
         */
        function sort(note1, note2){
            if(pinnedOnTop){
                if(note1.pinned != note2.pinned){
                    if(note1.pinned)return -1;
                    if(note2.pinned)return 1;
                }
            }
            for (const col in columns) {
                let res = Note.compare(note1.getAttribute(col),note2.getAttribute(col),columns[col] != 'desc');
                if(res != 0)return res;
            }

            return 0;
        }

        return sort;
    }
    static SORTABLE_COLUMNS = ['title','content','created_at','updated_at'];
}

export default Note;