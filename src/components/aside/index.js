import dom from "@/utils/dom";
import "./aside.css";
import iconElement from "@/assets/icons";
import { createListener } from "@/utils/listeners";
import AppContext from "@/contexts/AppContext";
import func from "@/utils/func";

const defaultOptions = {
    activeMenu: 'allNotes',
    mainMenu: {},
    onopenmenu: function(menu,callback) {
        console.log('open menu',menu);
        callback(true);
    },
}

/**
 * @param {AppContext} ctx
 */
function createAside(ctx,options) {
    options = func.extendsObject(defaultOptions,options);

    fetchConfig(ctx,options);

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
    
    const aside = dom.createNode('aside');
    const aside_innerContainer = dom.createNode('div','aside-container');
    const aside_main_card = dom.createNode('div','card');

    aside.appendChild(aside_innerContainer);
    aside_innerContainer.appendChild(aside_main_card);
    
    addOnDestroyListener(() => {
        aside.remove();
    });

    function HandleOpenMenu(menuOptions, callback) {
        options.onopenmenu(menuOptions,function(opened){
            if(opened){
                aside_main_card.querySelectorAll('.aside-menu').forEach(el => el.classList.remove('active'));
                Object.values(options.mainMenu).forEach(m => m.isactive = false);
                menuOptions.isactive = true;
            }
            callback(opened);
        });
    }

    for (const key in options.mainMenu) {
        const menuOptions = func.copyObject(options.mainMenu[key]);
        if(!menuOptions.id)menuOptions.id = key;
        menuOptions.isactive = func.equalsHash(key, options.activeMenu);

        aside_main_card.appendChild(createMenu(menuOptions));
    }

    function createMenu(menu_options) {
        const menu_container = dom.createNode('div','aside-menu');
        const menu_icon = dom.createNode('div','aside-menu-icon');
        const menu_label = dom.createNode('div','aside-menu-label');

        menu_container.appendChild(menu_icon);
        menu_container.appendChild(menu_label);

        if(menu_options.isactive){
            menu_container.classList.add('active');
            // trigger on attach
            HandleClickMenu({isTrusted:true});
        }

        menu_icon.append(iconElement(menu_options.icon));
        menu_label.textContent = menu_options.label;
    
        function HandleClickMenu(e){
            if(!e.isTrusted)return;
            
            HandleOpenMenu(menu_options, function(isopen) {
                if(isopen)menu_container.classList.add('active');
            });
        }
    
        menu_container.addEventListener('click',HandleClickMenu);
        addOnDestroyListener(() => {
            menu_container.removeEventListener('click',HandleClickMenu);
        });
    
        return menu_container;
    }

    return {
        aside,
    };
}

/**
 * 
 * @param {AppContext} ctx 
 * @param {defaultOptions} options 
 */
function fetchConfig(ctx,options) {
    options.activeMenu = ctx.currentMenu;
    options.mainMenu = {};
    ctx.getMainMenu(mainMenu => {
        for (const menu of mainMenu) {
            options.mainMenu[menu.id] = menu;
        }
    });
    options.onopenmenu = function(menu,callback) {
        ctx.triggerEvent('open.main.menu',menu,callback);
    };
}

export {
    createAside,
};