import { MD5 } from "crypto-js";

export type Color = {
    r: number, 
    g: number, 
    b: number,
}

export function getRelativeLuminance(rgb: Color) {
    return (
        0.2126 * rgb.r
        + 0.7152 * rgb.g
        + 0.0722 * rgb.b
    );
}
export const getCSSColorRGB = (rgb: Color) => `rgb(${rgb.r},${rgb.g},${rgb.b})`;
/**
 * 
 * @param {Color} c 
 * @param {number} h degree, min:0, max:360. if over index will be modullo
 * @returns 
 */
export function transformHue(c: Color,h: number) {
    if(h<0 || h>360){
        h = h%360;
        if(h<0)h = -h;
    }
    const u = Math.cos(h*Math.PI/180);
    const w = Math.sin(h*Math.PI/180);

    const resColor: Color = {r:0,g:0,b:0};
    resColor.r = (.299 + .701*u + .168*w)*c.r
            +    (.587 - .587*u + .330*w)*c.g
            +    (.114 - .114*u - .497*w)*c.b;
    resColor.g = (.299 - .299*u - .328*w)*c.r
            +    (.587 + .413*u + .035*w)*c.g
            +    (.114 - .114*u + .292*w)*c.b;
    resColor.b = (.299 - .300*u + 1.25*w)*c.r
            +    (.587 - .588*u - 1.05*w)*c.g
            +    (.114 + .886*u - .203*w)*c.b;
    if(resColor.r < 0)resColor.r = -resColor.r;
    if(resColor.g < 0)resColor.g = -resColor.g;
    if(resColor.b < 0)resColor.b = -resColor.b;
    return resColor;
}
/**
 * 
 * @param {Color} bgRGB 
 * @returns 
 */
export function getTextColorFromBG(bgRGB: Color): Color {
    if(getRelativeLuminance(bgRGB) > (255 / 2))return {r:0,g:0,b:0};
    else return {r:255,g:255,b:255};
}
export function getHueDegFromStr(str: string) {
    str = MD5(str).toString();
    let min = Number.MAX_VALUE;let max = Number.MIN_VALUE;
    let num = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let code = str.charCodeAt(i);
        if(min > code)min = code;
        if(max < code)max = code;
        num += code;
    }
    if(max == min){
        min = 0;
        max = 360;
    }

    max = max - min;
    min = 0;
    
    if(num > max)num = num % max;
    if(num < min)num = min - num;
    
    return (num / (max - min)) * 360;
}