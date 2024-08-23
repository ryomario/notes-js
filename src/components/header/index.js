import dom from "@/utils/dom";
import "./header.css";
import iconElement from "@/assets/icons";
import { createListener } from "@/utils/listeners";
import AppContext from "@/contexts/AppContext";
import func from "@/utils/func";

const defaultOptions = {
    appname: 'NotebookJS',
    tools: {
        iconButtonSearch: 'search',
        onTriggerSearch: null,

        iconButtonSetting: 'cog',
        labelButtonSetting: '__settings__',
        onClickSetting: null,

        iconButtonPlus: 'plus',
        labelButtonPlus: '__plus__',
        onClickPlus: null,
    },
}

/**
 * @param {AppContext} ctx
 */
function createHeader(ctx,options) {
    options = func.extendsObject(defaultOptions,options);
    const app = ctx.getObject();
    const {
        // listener: onDestroyListener,
        trigger: triggerDestroy,
        addListener: addOnDestroyListener,
        // removeListener: removeOnDestroyListener,
        // hasListener: hasOnDestroyListener,
    } = createListener();
    ctx.addEventListener('destroy',function(){
        triggerDestroy(app);
    });
    
    const header = dom.createNode('header');
    const header_innerContainer = dom.createNode('div','header-container');
    const header_appIcon = dom.createNode('span','app-icon');
    const header_appName = dom.createNode('span','app-name mobile-hidden');
    
    header.appendChild(header_innerContainer);
    header_innerContainer.append(header_appIcon);
    header_innerContainer.append(header_appName);
    header_innerContainer.append(dom.createNode('div','space'));

    header_innerContainer.append(createSearchField());
    header_innerContainer.append(createSettingButton());
    header_innerContainer.append(createPlusButton());
    
    
    header_appIcon.append(iconElement('logo'));
    header_appName.textContent = options.appname;
    
    addOnDestroyListener(() => {
        header.remove();
    });

    function createSearchField() {
        const searchField = dom.createNode('label','search-field');
        const searchIcon = dom.createNode('span','search-icon');
        const searchLabel = dom.createNode('div','search-label');
        const searchLabelShortcut = dom.createNode('div','search-label-shortcut');
        searchIcon.append(iconElement('search'));
        searchField.appendChild(searchIcon);
        searchField.appendChild(searchLabel);
        searchField.appendChild(searchLabelShortcut);
    
        searchLabel.textContent = app.translate('search.note');
        searchLabelShortcut.textContent = 'CTRL+K';
    
        function HandleTriggerSearch(e){
            if(!e.isTrusted)return;
            if(e.type == 'keydown' && !(e.ctrlKey && e.key == 'k'))return;
            e.preventDefault(); // prevent called 2 times
            ctx.triggerEvent('open.search.modal');
        }
    
        searchField.addEventListener('click',HandleTriggerSearch);
        window.addEventListener('keydown',HandleTriggerSearch);
        addOnDestroyListener(() => {
            searchField.removeEventListener('click',HandleTriggerSearch);
            window.removeEventListener('keydown',HandleTriggerSearch);
        });
    
        return searchField;
    }
    
    function createSettingButton() {
    
        const btn = dom.createNode('button');
        btn.append(iconElement('cog'));
        btn.setAttribute('label',app.translate('topbar.label.setting'));
    
        function HandleClickBtn(e) {
            if(!e.isTrusted)return;

            ctx.triggerEvent('open.settings.modal');
        }

        btn.addEventListener('click',HandleClickBtn);

        addOnDestroyListener(() => {
            btn.removeEventListener('click',HandleClickBtn);
        });

        return btn;
    }

    function createPlusButton() {
    
        const btn = dom.createNode('button');
        btn.append(iconElement('plus'));
        btn.setAttribute('label',app.translate('topbar.label.plus'));
    
        function HandleClickBtn(e) {
            if(!e.isTrusted)return;

            ctx.triggerEvent('open.add.note.modal');
        }

        btn.addEventListener('click',HandleClickBtn);

        addOnDestroyListener(() => {
            btn.removeEventListener('click',HandleClickBtn);
        });

        return btn;
    }

    return {
        header,
    };
}



export {
    createHeader,
};