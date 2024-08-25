import Notebook from "@/notebook";
import BaseContext from "./BaseContext";
import func from "@/utils/func";
import NotFoundContent from "@/components/content/NotFoundContent";
import AllNotesContent from "@/components/content/AllNotesContent";
import PinnedNotesContent from "@/components/content/PinnedNotesContent";

const CONFIG_NAMES = {
    CURRENT_MENU: func.hash('current-menu'),
};

class AppContext extends BaseContext {
    _contextName = 'NoteBookApp';

    currentMenu;
    setCurrentMenu(menuId) {
        this.currentMenu = func.hash(menuId);
        this.getConfig().open_last_openned_menu && this.setConfigName(CONFIG_NAMES.CURRENT_MENU, this.currentMenu);
    }
    /**
     * 
     * @param {Notebook} $obj 
     * @param {Object} options 
     */
    constructor($obj, options) {
        options = func.extendsObject(AppContext.defaultOptions,options);
        super($obj,options,false);
        const $this = this;

        this.currentMenu = this.getConfig().open_last_openned_menu ? this.getConfigName(CONFIG_NAMES.CURRENT_MENU,this.options.defaultMenu) : this.options.defaultMenu;

        this.options.callbacks.onConfigsChange = function(newValue) {
            console.log('config change',newValue);
        }
        this.options.callbacks.onOpenMainMenu = function() {
            $this.onOpenMainMenu(...arguments);
        }
    }
    translate(str) {
        return this.$obj.translate(str);
    }

    getConfig() {
        return {
            devmode: true,
            open_last_openned_menu: false,
        };
    }
    getConfigName(name,defaultValue = '') {
        return window.localStorage[name] ?? defaultValue;
    }
    setConfigName(name,value) {
        window.localStorage[name] = value;
    }

    /**
     * 
     * @param {(mainMenu)=>void} callback 
     */
    getMainMenu(callback) {
        callback([
            {
                id: 'all',
                icon: 'hamburger',
                label: this.$obj.translate('__all-notes__'),
            },{
                id: 'pinned-notes',
                icon: 'pinned',
                label: this.$obj.translate('__pinned-notes__'),
            },
        ]);
    }
    onOpenMainMenu(menu,callback){
        // avoid open same content, but this function not triggerred on initialization
        // if(func.equalsHash(menu.id,this.currentMenu))return;
        let opened = false;
        switch (menu.id) {
            case 'all':
                AllNotesContent.show(this);
                opened = true;
                break;
            case 'pinned-notes':
                PinnedNotesContent.show(this);
                opened = true;
                break;
        
            default:
                NotFoundContent.show(this);
                callback(true);
                return;
        }
        if(opened){
            this.setCurrentMenu(menu.id);
        }
        callback(opened);
    }
}
AppContext.defaultOptions = {
    defaultMenu: func.hash('all'),
}

export default AppContext;