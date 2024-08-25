import dom from "@/utils/dom";

export default class SimpleDiv {
    constructor({data,config,api,readOnly}){
        this.data = data;
        this.readOnly = readOnly;
    }

    render() {
        const div = dom.createNode('div');
        div.style.overflow = 'auto';
        div.innerHTML = this.data.text;

        div.contentEditable = this.readOnly?'false':'true';
        return div;
    }

    save(toolsContent) {
        return {
            text: toolsContent.innerHTML,
        };
    }

    static get isReadOnlySupported() {
      return true;
    }
}