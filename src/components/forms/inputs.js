import dom from "@/utils/dom";
import "./inputs.css";
import iconElement from "@/assets/icons";

export function InputField(options) {
    const label = dom.createNode('label','input-field');
    const input = dom.createNode('input','');
    const hint = dom.createNode('span','input-hint');

    label.setAttribute('for',options.inputname);
    input.setAttribute('id',options.inputname);

    input.setAttribute('name',options.inputname);
    input.setAttribute('type',options.inputtype);
    input.setAttribute('placeholder',options.label);
    label.setAttribute('label',options.label);
    hint.textContent = options.hint;
    hint.setAttribute('title', options.hint);

    if(options.readonly)label.classList.add('readonly');

    input.value = options.value;

    label.appendChild(input);
    if(options.hint){
        label.classList.add('with-hint');
        label.appendChild(hint);
    }

    return {
        container: label,
        input,
    };
}
export function InputText(options) {
    const {container,input} = InputField({...options,
        inputtype: 'text',
    });
    const inputRO = dom.createNode('span','input-readonly');
    const calcWithHelper = dom.createNode('span','input-with-helper');

    calcWithHelper.textContent = options.value;
    inputRO.textContent = options.value;

    if(options.readonly){
        container.appendChild(inputRO);
        input.remove();
    }else{
        container.appendChild(calcWithHelper);
    }

    input.addEventListener('input',function(e){
        if(!e.isTrusted)return;
        calcWithHelper.textContent = input.value;
    });

    return {container, input};
}
export function InputLabels(options) {
    const {container,input} = InputField({...options,
        inputtype: 'text',
    });
    const inputHelper = dom.createNode('input','',{type:'text',name:options.name+'_helper'});
    const labelsPreview = dom.createNode('div','note-labels');
    /**
     * @type {Array}
     */
    const labels = options.value?options.value.split(','):[];

    input.classList.add('inline');
    input.value = '';

    container.appendChild(labelsPreview);
    labelsPreview.appendChild(input);

    if(options.readonly){
        input.remove();
    }


    function addLabel(label) {
        if(!label)return;
        const idx = labels.indexOf(label);
        if(idx != -1){
            labels.splice(idx,1);
        }
        labels.push(label);

        attachLabels(true);
    }
    function removeLabel(label){
        const idx = labels.indexOf(label);
        if(idx != -1){
            labels.splice(idx,1);
        }

        attachLabels(true);
    }
    function attachLabels(focus=false) {
        while(labelsPreview.firstChild)labelsPreview.lastChild.remove();
        if(labels.length > 0)container.classList.add('focus');
        else container.classList.remove('focus');
        for (const label of labels) {
            const el = dom.createNoteLabel(label);
            if(!options.readonly){
                let btn = dom.createNode('button','btn');
                btn.append(iconElement('x-alt'));
                btn.addEventListener('click',(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // stop triggering click parent
                    removeLabel(label);
                });
                el.append(btn);
            }
            labelsPreview.appendChild(el);
        }
        if(!options.readonly){
            labelsPreview.appendChild(input);
            inputHelper.value = labels.join(',');
            inputHelper.dispatchEvent(new Event('input'));
        }
        if(focus)input.focus();
    }

    input.addEventListener('keydown', function(e){
        if(!e.isTrusted)return;
        if(e.key == ','){
            const label = input.value;
            input.value = '';
            addLabel(label);
            // stop keyup
            e.preventDefault();
        }
    });
    input.addEventListener('blur',function(e){
        if(!e.isTrusted)return;
        input.value = '';
    })

    attachLabels();

    return {container, input:inputHelper};
}

export function InputToggle(options) {
    const {container,input} = InputField({...options,
        inputtype: 'checkbox',
    });
    const preview = dom.createNode('div','toggle-preview');

    container.classList.add('input-toggle');

    if(options.readonly){
        input.remove();
        if(options.value)container.classList.add('checked');
    }
    container.appendChild(preview);

    input.checked = options.value;

    return {container, input};
}