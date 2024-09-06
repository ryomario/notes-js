import { copyObject, getElapsedTime } from "../utils/func";

export type NoteRaw = {
    id: string,
    title: string,
    pinned: boolean,
    content: string,
    created_at: number,
    updated_at: number,
    labels?: string,
}
export default class Note {
    private _id: string;
    get id(): string {return this.getAttribute('id')}
    set id(id: string) {this.setAttribute('id',id)}

    private _title: string;
    get title(): string {return this.getAttribute('title')}
    set title(title: string) {this.setAttribute('title',title)}

    private _pinned: boolean;
    get pinned(): boolean {return this.getAttribute('pinned')}
    set pinned(pinned: boolean) {this.setAttribute('pinned',pinned)}

    private _content: string;
    get content(): string {return this.getAttribute('content')}
    set content(content: string) {this.setAttribute('content',content)}

    private _created_at: number;
    get created_at(): Date {return this.getAttribute('created_at')}
    set created_at(created_at: Date) {this.setAttribute('created_at',created_at)}

    private _updated_at: number;
    get updated_at(): Date {return this.getAttribute('updated_at')}
    set updated_at(updated_at: Date) {this.setAttribute('updated_at',updated_at)}

    private _labels?: string;
    get labels(): Array<string> {return this.getAttribute('labels')}
    set labels(labels: string|Array<string>) {this.setAttribute('labels',labels)}
    
    private _changed: boolean;
    get changed(): boolean {return this.getAttribute('changed')}
    set changed(changed: boolean) {this.setAttribute('changed',changed)}

    constructor(title: string, pinned = false) {
        this._title = title; this._pinned = pinned;
        this._content = '';
        this._labels = '';
        this._created_at = Date.now();
        this._updated_at = this._created_at;
        this._id = this._created_at.toString();
        this._changed = false;
    }

    setAttribute(name: string,value: any) {
        value = copyObject(value);
        switch(name){
            case 'content':
                if(typeof value === 'object'){
                    value = JSON.stringify(value);
                }
            case 'title':case 'pinned':case 'content':
                if((this as any)['_'+name] != value){
                    (this as any)['_'+name] = value;
                    this._changed = true;
                    this._updated_at = Date.now();
                }
                break;
            case 'labels':
                if(Array.isArray(value))value = value.join(',');
                if(this._labels != value){
                    this._labels = value;
                    this._changed = true;
                    this._updated_at = Date.now();
                }
                break;
            default:
                throw new Error('Can\'t changes READONLY attribute!');
        }
    }
    getAttribute(name: string) {
        switch(name){
            case 'content':
                try {
                    const value = JSON.parse((this as any)['_'+name]);
                    return value;
                }catch(error){}
            case 'id':case 'title':case 'pinned':case 'content':case 'changed':
                return (this as any)['_'+name];
            case 'labels':
                return this._labels?.split(',').map(label => label.trim()).filter(label => label) ?? [];
            case 'created_at':case 'updated_at':
                // return this['_'+name];
                return new Date((this as any)['_'+name]);
            default:
                throw new Error('Attribute not found!');
        }
    }

    hasLabels(): boolean {
        return (typeof this._labels === 'string' && this._labels !== '');
    }
    containsLabel(label: string): boolean {
        return this.hasLabels() && (this.labels.findIndex(t => t.toLowerCase() == label.toLowerCase()) != -1);
    }
    containsLabels(labels: Array<string>): boolean {
        if(!labels || labels.length == 0)return true;
        if(!this.hasLabels())return false;
        for (const label of labels) {
            if(!this.containsLabel(label))return false;
        }
        return true;
    }
    includesLabels(labels: Array<string>): boolean {
        if(!labels || labels.length == 0)return true;
        if(!this.hasLabels())return false;
        for (const label of labels) {
            if(this.containsLabel(label))return true;
        }
        return false;
    }
    addLabel(label: string) {
        if(!label?.trim())return;
        const labels = this.labels;
        const _labels = label.split(',').map(l => l.trim());
        for (const l of _labels) {
            // add if not exist
            if(labels.indexOf(l) == -1){
                labels.push(l);
            }
        }

        this.labels = labels.join(',');
    }
    containsString(str: string): boolean {
        return (this.title.toLowerCase().includes(str.toLowerCase())) ||
               (this.content.toLowerCase().includes(str.toLowerCase())) ||
               (this.containsLabel(str));
    }
    getLastUpdated() {
        return getElapsedTime(this._updated_at,Date.now());
    }
    toObject(): NoteRaw {
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

    assign(note: Note): this {
        this.assignFromObject(note.toObject());
        return this;
    }
    assignFromObject(obj: NoteRaw) {
        this._id = obj.id;
        this._title = obj.title;
        this._pinned = obj.pinned;
        this._content = obj.content;
        this._created_at = obj.created_at;
        this._updated_at = obj.updated_at;
        this._labels = obj.labels;
        return this;
    }
    static copy(note: Note): Note {
        const clonedNote = Note.createFromObject(note.toObject());
        return clonedNote;
    }
    static createFromObject(obj: NoteRaw): Note {
        const note = new Note(obj.title, obj.pinned);
        note._id = obj.id;
        note._content = obj.content;
        note._created_at = obj.created_at;
        note._updated_at = obj.updated_at;
        note._labels = obj.labels;
        
        if(!obj.labels && (obj as any).tags)note._labels = (obj as any).tags; // handle previous structure
        return note;
    }
    static createNewFromObject(obj: NoteRaw) {
        const note = new Note(obj.title, obj.pinned??false);
        if(obj.id)note._id = obj.id;
        note._content = obj.content;
        if(obj.created_at)note._created_at = obj.created_at;
        if(obj.updated_at)note._updated_at = obj.updated_at;
        if(obj.labels)note._labels = obj.labels;
        
        if(!obj.labels && (obj as any).tags)note._labels = (obj as any).tags; // handle previous structure
        return note;
    }
    static isValidObject(obj: any) {
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
    
    static isChanged(note1: Note,note2: Note) {
        const isSame = 
               (note1._id == note2._id) &&
               (note1._title == note2._title) &&
               (note1._content == note2._content) &&
               (note1._pinned == note2._pinned) &&
               (note1._labels == note2._labels);

        return !isSame;
    }
    static compare(attr1: string|number, attr2: string|number, isAsc = true) {
        if(attr1 != attr2){
            if(typeof attr1 === 'string'||typeof attr2 === 'string')return isAsc ? attr1.toString().localeCompare(attr2.toString()):attr2.toString().localeCompare(attr1.toString());
            if(typeof attr1 === 'number'&&typeof attr2 === 'number')return isAsc ? attr1 - attr2:attr2 - attr1;
        }
        return 0;
    }

    static getSorterBy(pinnedOnTop = false,columns?:SortableColumnsType){
        if(!columns || Object.keys(columns).length == 0)columns = {'updated_at':'desc'};

        function sort(note1: Note, note2: Note){
            if(pinnedOnTop){
                if(note1.pinned != note2.pinned){
                    if(note1.pinned)return -1;
                    if(note2.pinned)return 1;
                }
            }
            for (const col in columns) {
                let res = Note.compare(note1.getAttribute(col),note2.getAttribute(col),(columns as any)[col] != 'desc');
                if(res != 0)return res;
            }

            return 0;
        }

        return sort;
    }
}
type SortableColumnsType = {
    title?: 'desc'|'asc',
    content?: 'desc'|'asc',
    created_at?: 'desc'|'asc',
    updated_at?: 'desc'|'asc'
}