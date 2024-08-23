import func from "./func";

/**
 * 
 * @param {string} tagname 
 * @param {string|Array<string>} classname 
 * @param {NamedNodeMap} attributes 
 * @param {CSSPropertyRule} styles 
 * @returns
 */
function createNode(tagname, classname, attributes, styles) {
    if(!tagname)tagname = 'div';
    const el = document.createElement(tagname);
    if(classname){
        if(Array.isArray(classname))classname = classname.join(' ');
        el.className = classname;
    }
    if(typeof attributes === 'object')Object.assign(el, attributes);
    if(typeof styles === 'object')Object.assign(el.style,styles);

    return el;
}

const elementsStillAnimating = [];

/**
 * 
 * @param {HTMLElement} element 
 * @param {number} [magnitude=16]
 * @param {()=>void} [callback=null] 
 */
function animateShake(element, magnitude = 5, callback = null) {
    let tiltAngle = 1;
    let counter = 1;
    let numberOfShake = 5;
    let startAngle = 0;
    let magnitudeUnit = magnitude / numberOfShake;

    if(elementsStillAnimating.indexOf(element) === -1){
        elementsStillAnimating.push(element);
        shake();
    }

    function shake() {
        if(counter < numberOfShake) {
            element.style.transform = `rotate(${startAngle}deg)`;
            magnitude -= magnitudeUnit;
            let angle = Number(magnitude * tiltAngle).toFixed(2);
            element.style.transform = `rotate(${angle}deg)`;
            counter += 1;
            tiltAngle *= -1;
            window.requestAnimationFrame(shake);
        } else {
            // ended
            element.style.transform = `rotate(${startAngle}deg)`;
            elementsStillAnimating.splice(elementsStillAnimating.indexOf(element),1);
            if(callback)callback();
        }
    }
}

function createNoteLabel(label) {
    let el = createNode('span','note-label');
    el.textContent = label;
    const baseColor = {r: 150, g: 100, b: 150};
    const bgColor = func.transformHue(baseColor,func.getHueDegFromStr(label));
    const textColor = func.getTextColorFromBG(bgColor);
    el.style.backgroundColor = func.getCSSColorRGB(bgColor);
    el.style.color = func.getCSSColorRGB(textColor);

    return el;
}

export default {
    createNode,
    animateShake,
    createNoteLabel,
};