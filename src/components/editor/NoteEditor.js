import func from "@/utils/func";
import EditorJS from "@editorjs/editorjs";
import SimpleDiv from "./blocks/SimpleDiv";
import dom from "@/utils/dom";

export default class NoteEditor {
    editor;
    constructor(parentelem,options) {
        let data;
        if(typeof options.value === 'string'){
            data = {
                blocks: [
                    {
                        type: "div",
                        data: {
                            text: options.value,
                        },
                        readOnly: options.readonly,
                    }
                ],
            };
        }else{
            data = func.copyObject(options.value);
        }

        while(parentelem.firstChild)parentelem.lastChild.remove();

        const elem = dom.createNode('div');
        parentelem.appendChild(elem);
        
        this.editor = new EditorJS({
            holder: elem,
            placeholder: options.placeholder,
            data,
            tools: {
                div: SimpleDiv,
            },
            readOnly: options.readonly,
            onChange: function(api, event) {
                api.saver.save().then(output => {
                    if(options.onChange && typeof options.onChange === 'function')options.onChange(output);
                })
            },
        });
    }
}