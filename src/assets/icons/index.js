import dom from "@/utils/dom";
import logo from "./logo";
import hamburger from "./hamburger";
import search from "./search";
import xAlt from "./x-alt";
import cog from "./cog";
import x from "./x";
import plus from "./plus";
import pinned from "./pinned";
import pin from "./pin";
import trash from "./trash";
import edit from "./edit";
import option from "./option";
import point from "./point";
import layoutGrid from "./layout-grid";
import layoutList from "./layout-list";
import sort from "./sort";
import maximize from "./maximize";
import minimize from "./minimize";

/**
 * 
 * @param {string} name 
 * @returns 
 */
export default function iconElement(name) {
    const container = dom.createNode('div');
    switch (name) {
        case 'logo':
            container.innerHTML = logo;
            break;
        case 'hamburger':
            container.innerHTML = hamburger;
            break;
        case 'search':
            container.innerHTML = search;
            break;
        case 'x-alt':
            container.innerHTML = xAlt;
            break;
        case 'x':
            container.innerHTML = x;
            break;
        case 'cog':
            container.innerHTML = cog;
            break;
        case 'plus':
            container.innerHTML = plus;
            break;
        case 'pin':
            container.innerHTML = pin;
            break;
        case 'pinned':
            container.innerHTML = pinned;
            break;
        case 'trash':
            container.innerHTML = trash;
            break;
        case 'edit':
            container.innerHTML = edit;
            break;
        case 'option':
            container.innerHTML = option;
            break;
        case 'layout-grid':
            container.innerHTML = layoutGrid;
            break;
        case 'layout-list':
            container.innerHTML = layoutList;
            break;
        case 'sort':
            container.innerHTML = sort;
            break;
        case 'maximize':
            container.innerHTML = maximize;
            break;
        case 'minimize':
            container.innerHTML = minimize;
            break;
        default:
            container.innerHTML = point;
            break;
    }
    let iconel = null
    if(container.hasChildNodes)iconel = container.childNodes[0];
    iconel.style.width = '100%';
    iconel.style.height = '100%';
    return iconel;
}