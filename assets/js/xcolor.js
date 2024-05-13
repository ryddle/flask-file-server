/* const map = function(value, x1, y1, x2, y2) { 
    const nv = Math.round((value - x1) * (y2 - x2) / (y1 - x1) + x2);
    return (x2 > y2) ? Math.min(Math.max(nv, y2), x2) : Math.max(Math.min(nv, y2), x2);
} */

import map from './xutils.js';
import xhtmlColors from './xhtmlColors.js';

/*
 * xcolor.js is a simple class to manipulate colors in JavaScript
 * It provides methods to parse color codes, convert color spaces and generate color codes.
 * Supported color formats: hex, hexa, rgb, rgba, hsl, hsla
 * Supported color spaces: RGB, HSB (HSV), HSL
 * - Generating random colors
 * - Converting between color formats
 * - Performing color manipulations, such as:
 *   - Interpolating between colors
 *   - Darkening and lightening colors
 *   - Creating color palettes
 * 
*/
export default class xcolor {
    static #rgbRegex = /^rgb\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3})\)$/;
    static #rgbaRegex = /^rgba\((\d{1,3}),\s?(\d{1,3}),\s?(\d{1,3}),\s?(0?(\.\d+)?|1(\.0)?)\)$/;
    static #hexRegex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/;
    static #hexaRegex = /^#?([a-fA-F0-9]{8}|[a-fA-F0-9]{4})$/;
    static #hslRegex = /^hsl\((\d{1,3}),\s?(0?\d?\d|100)%,\s?(0?\d?\d|100)%\)$/;
    static #hslaRegex = /^hsla\((\d{1,3}),\s?(0?\d?\d|100)%,\s?(0?\d?\d|100)%,\s?(0?(\.\d+)?|1(\.0)?)\)$/;
    static #hsbRegex = /^hsb\((\d{1,3}),\s?(0?\d?\d|100)%,\s?(0?\d?\d|100)%\)$/;
    static #hsbaRegex = /^hsba\((\d{1,3}),\s?(0?\d?\d|100)%,\s?(0?\d?\d|100)%,\s?(0?(\.\d+)?|1(\.0)?)\)$/;
    static #htmlColorRegex = new RegExp('^(' + Object.keys(xhtmlColors).join('|') + ')$', 'i');

    static colorSpaces = ['RGB', 'HSB', 'HSL'];

    //private mutable fields
    #rgb={r:0, g:0, b:0, a:1};
    #hex={r:0, g:0, b:0, a:1};
    #hsl={h:0, s:0, l:0, a:1};
    #hsb={h:0, s:0, b:0, a:1};

    //readonly fields
    rgb={r:0, g:0, b:0, a:1};
    hex={r:0, g:0, b:0, a:1};
    hsl={h:0, s:0, l:0, a:1};
    hsb={h:0, s:0, b:0, a:1};
    
    /**
     * Initializes a new instance of the Color class with the specified color code.
     * By default, the alpha channel is set to 1.
     * @constructor
     * @param {string} colorCode - The color code to initialize the Color instance with.
     *                             The color code can be in any of the following formats:
     *                             - RGB: "rgb(R, G, B)"
     *                             - RGBA: "rgba(R, G, B, A)"
     *                             - Hex: "#RGB" or "#RRGGBB"
     *                             - Hexa: "#RRGGBBAA" or "#RRGGBB"
     *                             - HSL: "hsl(H, S%, L%)"
     *                             - HSLA: "hsla(H, S%, L%, A)"
     *                             - HSB: "hsb(H, S%, B%)"
     *                             - HSBA: "hsba(H, S%, B%, A)"
     *                             Where R, G, B, A, H, S, L, and B represent numeric values.
     * @return {void}
     */
    constructor(colorCode, alphaMode) {
        let regexp = new RegExp(xcolor.#rgbRegex.source + '|' + xcolor.#rgbaRegex.source + '|' + xcolor.#hexRegex.source + '|' + xcolor.#hexaRegex.source + '|' + xcolor.#hslRegex.source + '|' + xcolor.#hslaRegex.source + '|' + xcolor.#hsbRegex.source + '|' + xcolor.#hsbaRegex.source + '|' + xcolor.#htmlColorRegex.source, 'i');
        if (!colorCode.match(regexp)) {
            console.error('The string ' + colorCode + ' is an invalid color format. Valid formats are: rgb, rgba, hex, hexa, hsl, hsla, hsb, hsba');
            throw new Error('The string ' + colorCode + ' is an invalid color format. Valid formats are: rgb, rgba, hex, hexa, hsl, hsla, hsb, hsba');
        } else {
            this.colorCode = colorCode;
            this.alphaMode = alphaMode;
        }

        let matches;
        if (matches = colorCode.match(xcolor.#htmlColorRegex)) {
            this.#parseHex(xhtmlColors[matches[0]]);
            this.#parseRgb(xcolor.hex2rgb(xhtmlColors[matches[0]]));
            this.#parseHsb(xcolor.hex2hsb(xhtmlColors[matches[0]]));
            this.#parseHsl(xcolor.hex2hsl(xhtmlColors[matches[0]]));
        }else if (matches = colorCode.match(xcolor.#rgbRegex)) {
            this.#parseRgb(colorCode);
            this.#parseHex(xcolor.rgb2hex(colorCode));
            this.#parseHsb(xcolor.rgb2hsb(colorCode));
            this.#parseHsl(xcolor.rgb2hsl(colorCode));
        } else if (matches = colorCode.match(xcolor.#rgbaRegex)) {
            this.#parseRgba(colorCode);
            this.#parseHexa(xcolor.rgba2hexa(colorCode));
            this.#parseHsba(xcolor.rgba2hsba(colorCode));
            this.#parseHsla(xcolor.rgba2hsla(colorCode));
        } else if (matches = colorCode.match(xcolor.#hexRegex)) {
            this.#parseHex(colorCode);
            this.#parseRgb(xcolor.hex2rgb(colorCode));
            this.#parseHsb(xcolor.hex2hsb(colorCode));
            this.#parseHsl(xcolor.hex2hsl(colorCode));
        } else if (matches = colorCode.match(xcolor.#hexaRegex)) {
            this.#parseHexa(colorCode);
            this.#parseRgba(xcolor.hexa2rgba(colorCode));
            this.#parseHsba(xcolor.hexa2hsba(colorCode));
            this.#parseHsla(xcolor.hexa2hsla(colorCode));
        } else if (matches = colorCode.match(xcolor.#hslRegex)) {
            this.#parseHsl(colorCode);
            this.#parseRgb(xcolor.hsl2rgb(colorCode));
            this.#parseHsb(xcolor.hsl2hsb(colorCode));
            this.#parseHex(xcolor.hsl2hex(colorCode));
        } else if (matches = colorCode.match(xcolor.#hslaRegex)) {
            this.#parseHsla(colorCode);
            this.#parseRgba(xcolor.hsla2rgba(colorCode));
            this.#parseHsba(xcolor.hsla2hsba(colorCode));
            this.#parseHexa(xcolor.hsla2hexa(colorCode));
        } else if (matches = colorCode.match(xcolor.#hsbRegex)) {
            this.#parseHsb(colorCode);
            this.#parseRgb(xcolor.hsb2rgb(colorCode));
            this.#parseHsl(xcolor.hsb2hsl(colorCode));
            this.#parseHex(xcolor.hsb2hex(colorCode));
        } else if (matches = colorCode.match(xcolor.#hsbaRegex)) {
            this.#parseHsba(colorCode);
            this.#parseRgba(xcolor.hsba2rgba(colorCode));
            this.#parseHsla(xcolor.hsba2hsla(colorCode));
            this.#parseHexa(xcolor.hsba2hexa(colorCode));
        }
    }

    /**
     * @description Returns the RGBA value of the color object.
     * @name getRgba
     * @method
     * @private
     * @memberof xcolor
     * @param {string} color - The color code to be parsed.
     * @return {string} The RGBA value of the color object in the format "rgba(r, g, b, a)".
     * @example
     *  //return exception
     * var color = new xcolor('red');
     * @example
     *  //return 'rgba(255,0,0,0.5)'
     * var color = new xcolor('#ff0000');
     * color.getRgba();
     * @throws {Error} If the color code is invalid.
     */
    getRgbaString() {
        return `rgba(${this.#rgb.r},${this.#rgb.g},${this.#rgb.b},${this.#rgb.a})`;
    }
    /**
     * Returns the RGB value of the color in the format "rgb(r,g,b)".
     *
     * @return {string} The RGB value of the color.
     */
    getRgbString() {
        return `rgb(${this.#rgb.r},${this.#rgb.g},${this.#rgb.b})`;
    }
    /**
     * A description of the entire function.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    getHexaString() {
        return `#${this.#hex.r}${this.#hex.g}${this.#hex.b}${this.#hex.a}`.toUpperCase();
    }
    /**
     * Returns the hexadecimal representation of the color.
     *
     * @return {string} The hexadecimal color value.
     */
    getHexString() {
        return `#${this.#hex.r}${this.#hex.g}${this.#hex.b}`.toUpperCase();
    }
    /**
     * Returns a string representation of the HSBA color value in the format "hsba(H,S%,B%,A)".
     *
     * @return {string} The HSBA color value as a string.
     */
    getHsbaString() {
        return `hsba(${this.#hsb.h},${this.#hsb.s}%,${this.#hsb.b}%,${this.#hsb.a})`;
    }
    /**
     * A method to get the HSB color format.
     *
     * @return {string} The HSB color in string format
     */
    getHsbString() {
        return `hsb(${this.#hsb.h},${this.#hsb.s}%,${this.#hsb.b}%)`;
    }
    /**
     * Get the HSLA color value.
     *
     * @return {string} HSLA color string
     */
    getHslaString() {
        return `hsla(${this.#hsl.h},${this.#hsl.s}%,${this.#hsl.l}%,${this.#hsl.a})`;
    }
    /**
     * Return the HSL color string.
     *
     * @return {string} The HSL color string
     */
    getHslString() {
        return `hsl(${this.#hsl.h},${this.#hsl.s}%,${this.#hsl.l}%)`;
    }

    /**
     * A function to parse an RGB color code.
     *
     * @param {string} colorCode - The RGB color code to parse.
     * @return {void} This function does not return anything.
     * @throws {Error} Throws an error if the color code is not in the correct format.
     */
    #parseRgb(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#rgbRegex))) {
            this.#rgb.r = parseInt(matches[1]);
            this.#rgb.g = parseInt(matches[2]);
            this.#rgb.b = parseInt(matches[3]);
            this.#rgb.a = 1;
            Object.assign(this.rgb,this.#rgb);
        } else {
            throw new Error(`${colorCode} has not a valid rgb format`);
        }
    }
    /**
     * Parses an RGBA color code and sets the red, green, blue, and alpha values of the current object.
     *
     * @param {string} colorCode - The RGBA color code to parse.
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code is not in a valid RGBA format.
     */
    #parseRgba(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#rgbaRegex))) {
            this.#rgb.r = parseInt(matches[1]);
            this.#rgb.g = parseInt(matches[2]);
            this.#rgb.b = parseInt(matches[3]);
            this.#rgb.a = parseFloat(matches[4]);
            Object.assign(this.rgb,this.#rgb);
        } else {
            throw new Error(`${colorCode} has not a valid rgba format`);
        }
    }
    /**
     * Parse a color code in hex format and set the RGBA values accordingly.
     *
     * @param {string} colorCode - The color code in hex format to parse.
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code is not in a valid hex format.
     */
    #parseHex(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hexRegex))) {
            let hex = matches[1];
            if (hex.length === 3) {
                hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
            }
            this.#hex.r = hex.substring(0, 2);
            this.#hex.g = hex.substring(2, 4);
            this.#hex.b = hex.substring(4, 6);
            this.#hex.a = 1;
            Object.assign(this.hex,this.#hex);
        } else {
            throw new Error(`${colorCode} has not a valid hex format`);
        }
    }
    /**
     * Parses a hexadecimal color code and sets the corresponding RGB and alpha values.
     *
     * @param {string} colorCode - The hexadecimal color code to parse.
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code is not in a valid hexadecimal format.
     */
    #parseHexa(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hexaRegex))) {
            let hexa = matches[1];
            if (hexa.length === 3) {
                hexa = hexa[0] + hexa[0] + hexa[1] + hexa[1] + hexa[2] + hexa[2];
            }
            this.#hex.r = hexa.substring(0, 2);
            this.#hex.g = hexa.substring(2, 4);
            this.#hex.b = hexa.substring(4, 6);
            this.#hex.a = hexa.substring(6, 8);
            Object.assign(this.hex,this.#hex);
        } else {
            throw new Error(`${colorCode} has not a valid hexa format`);
        }
    }
    /**
     * Parses the given color code in hsla format and updates the hsla properties of the object.
     *
     * @param {string} colorCode - The color code to be parsed in hsla format.
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code does not have a valid hsla format.
     */
    #parseHsla(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hslaRegex))) {
            let [h, s, l, a] = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseFloat(matches[4])];
            this.#hsl.h = h;
            this.#hsl.s = s;
            this.#hsl.l = l;
            this.#hsl.a = a;
            Object.assign(this.hsl,this.#hsl);
        } else {
            throw new Error(`${colorCode} has not a valid hsla format`);
        }
    }
    /**
     * Parses a HSL color code and sets the corresponding HSL values.
     *
     * @param {string} colorCode - The HSL color code to parse.
     * @return {void} This function does not return anything.
     * @throws {Error} If the colorCode does not have a valid HSL format.
     */
    #parseHsl(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hslRegex))) {
            let [h, s, l] = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3])];
            this.#hsl.h = h;
            this.#hsl.s = s;
            this.#hsl.l = l;
            this.#hsl.a = 1;
            Object.assign(this.hsl,this.#hsl);
        } else {
            throw new Error(`${colorCode} has not a valid hsl format`);
        }
    }
    /**
     * Parses a color code in HSB format and sets the corresponding HSB values for this object.
     *
     * @param {string} colorCode - The color code to parse in HSB format.
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code does not have a valid HSB format.
     */
    #parseHsb(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hsbRegex))) {
            let [h, s, b] = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3])];
            this.#hsb.h = h;
            this.#hsb.s = s;
            this.#hsb.b = b;
            this.#hsb.a = 1;
            Object.assign(this.hsb,this.#hsb);
        } else {
            throw new Error(`${colorCode} has not a valid hsb format`);
        }
    }
    /**
     * Parse the given color code into HSBA values.
     *
     * @param {string} colorCode - the color code to be parsed
     * @return {void} This function does not return anything.
     * @throws {Error} If the color code does not have a valid HSBA format.
     */
    #parseHsba(colorCode) {
        let matches;
        if ((matches = colorCode.match(xcolor.#hsbaRegex))) {
            let [h, s, b, a] = [parseInt(matches[1]), parseInt(matches[2]), parseInt(matches[3]), parseFloat(matches[4])];
            this.#hsb.h = h;
            this.#hsb.s = s;
            this.#hsb.b = b;
            this.#hsb.a = a;
            Object.assign(this.hsb,this.#hsb);
        } else {
            throw new Error(`${colorCode} has not a valid hsba format`);
        }
    }

    // Static instance methods

    /**
     * Get xcolor instance from the provided color code.
     *
     * @param {string} colorCode - The color code to create xcolor instance from
     * @return {xcolor} xcolor - The xcolor instance created from the color code
     */
    static getXcolor(colorCode) {
        return new xcolor(colorCode);
    }

    /**
     * Gets the RGB color from an array or a list of RGB values.
     * @param {Array} [r,g,b] - red, green and blue values
     * or
     * @param {Number} r - red value
     * @param {Number} g - green value
     * @param {Number} b - blue value
     * @return {xcolor} new xcolor object representing the RGB color
     */
    static getRgb() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 3) {
            values = arguments;
        }
        return new xcolor(`rgb(${Math.round(values[0])},${Math.round(values[1])},${Math.round(values[2])})`);
    }

    /**
     * Gets the RGBA color from an array or a list of RGBA values.
     * @param {Array} [r,g,b,a] - red, green, blue and alpha values
     * or
     * @param {Number} r - red value
     * @param {Number} g - green value
     * @param {Number} b - blue value
     * @param {Number} a - alpha value
     * @return {xcolor} new xcolor object representing the RGB color
     */
    static getRgba() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 4) {
            values = arguments;
        }
        return new xcolor(`rgba(${Math.round(values[0])},${Math.round(values[1])},${Math.round(values[2])},${Math.round(values[3])})`);
    }

    /**
     * Creates a new xcolor object from an array or a list of HSL values.
     *
     * @param {Array} [h,s,l] - hue, saturation and lightness values
     * or
     * @param {Number} h - hue value
     * @param {Number} s - saturation value
     * @param {Number} l - lightness value
     * @return {xcolor} - A new xcolor object representing the color in HSL format.
     */
    static getHsl() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 3) {
            values = arguments;
        }
        return new xcolor(`hsl(${Math.round(values[0])},${Math.round(values[1])}%,${Math.round(values[2])}%)`);
    }

    /**
     * Creates a new xcolor object from an array or a list of HSL values.
     *
     * @param {Array} [h,s,l,a] - hue, saturation, lightness and alpha values
     * or
     * @param {Number} h - hue value
     * @param {Number} s - saturation value
     * @param {Number} l - lightness value
     * @param {Number} a - alpha value
     * @return {xcolor} - A new xcolor object representing the color in HSL format.
     */
    static getHsla() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 4) {
            values = arguments;
        }
        return new xcolor(`hsla(${Math.round(values[0])},${Math.round(values[1])}%,${Math.round(values[2])}%,${Math.round(values[3])})`);
    }

    /**
     * Creates a new xcolor object from an array or a list of HSL values.
     *
     * @param {Array} [h,s,b] - hue, saturation and brightness values
     * or
     * @param {Number} h - hue value
     * @param {Number} s - saturation value
     * @param {Number} b - brightness value
     * @return {xcolor} - A new xcolor object representing the color in HSL format.
     */
    static getHsb() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 3) {
            values = arguments;
        }
        return new xcolor(`hsb(${Math.round(values[0])},${Math.round(values[1])}%,${Math.round(values[2])}%)`);
    }

    /**
     * Creates a new xcolor object from an array or a list of HSL values.
     *
     * @param {Array} [h,s,b,a] - hue, saturation, brightness and alpha values
     * or
     * @param {Number} h - hue value
     * @param {Number} s - saturation value
     * @param {Number} b - brightness value
     * @param {Number} a - alpha value
     * @return {xcolor} - A new xcolor object representing the color in HSL format.
     */
    static getHsba() {
        let values = [];
        if (arguments.length === 1) {
            values = arguments[0];
        } else if (arguments.length === 4) {
            values = arguments;
        }
        return new xcolor(`hsba(${Math.round(values[0])},${Math.round(values[1])}%,${Math.round(values[2])}%,${Math.round(values[3])})`);
    }

    // Conversions

    /**
     * Converts an RGB color to RGBA format.
     *
     * @param {string} color - the RGB color to convert
     * @return {string} the color in RGBA format
     */
    static rgb2rgba(color) {
        let [r, g, b] = color.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0));
        return `rgba(${r},${g},${b}, 1)`;
    }
    /**
     * Converts rgba color to rgb color.
     *
     * @param {string} color - The rgba color to be converted
     * @return {string} The converted rgb color
     */
    static rgba2rgb(color) {
        let [r, g, b, a] = color.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0));
        return `rgb(${r},${g},${b})`;
    }
    /**
     * Converts an RGB color value to a hexadecimal color code.
     *
     * @param {string} color - The RGB color value to convert.
     * @return {string} The hexadecimal color code.
     */
    static rgb2hex(color) {
        return '#' + color.match(/[\d\.]+/g).map((x, i) => Math.round((+x) * (i < 3 ? 1 : 255)).toString(16).padStart(2, 0)).join``;
    }
    /**
     * Converts an RGBA color value to a hexadecimal color code.
     *
     * @param {string} color - The RGBA color value to be converted.
     * @return {string} The hexadecimal color code.
     */
    static rgba2hex(color) {
        let [r, g, b, a] = color.match(/\d+/g).map(x => (+x).toString(16).padStart(2, 0));
        return `#${r}${g}${b}`;
    }
    /**
     * Converts an RGBA color value to a hexadecimal color code.
     *
     * @param {string} color - The RGBA color value to convert.
     * @return {string} The hexadecimal color code.
     */
    static rgba2hexa(color) {
        return '#' + color.match(/[\d\.]+/g).map((x, i) => Math.round((+x) * (i < 3 ? 1 : 255)).toString(16).padStart(2, 0)).join``;
    }
    /**
     * Converts a hexadecimal color code to an RGBA color code.
     *
     * @param {string} color - The hexadecimal color code to convert.
     * @return {string} The RGBA color code.
     */
    static hex2rgba(color) {
        let [r, g, b, a] = color.match(/\w\w/g).map(x => +`0x${x}`);
        return `rgba(${r},${g},${b},${a})`;
    }
    /**
     * Converts a hexadecimal color code to an RGB color code.
     *
     * @param {string} color - The hexadecimal color code to convert.
     * @return {string} The RGB color code equivalent to the input hexadecimal color code.
     */
    static hex2rgb(color) {
        let [r, g, b] = color.match(/\w\w/g).map(x => +`0x${x}`);
        return `rgb(${r},${g},${b})`;
    }
    /**
     * Converts a hexadecimal color code to rgba format.
     *
     * @param {string} color - the hexadecimal color code to convert
     * @return {string} the rgba formatted color
     */
    static hexa2rgba(color) {
        let [r, g, b, a] = color.match(/\w\w/g).map(x => +`0x${x}`);
        return `rgba(${r},${g},${b},${Math.round((a / 255) * 10) / 10})`;
    }
    /**
     * Converts a hexadecimal color code to an RGB color code.
     *
     * @param {string} color - The hexadecimal color code to convert.
     * @return {string} The RGB color code equivalent to the input hexadecimal color code.
     */
    static hex2rgb(color) {
        let [r, g, b] = color.match(/\w\w/g).map(x => +`0x${x}`);
        return `rgb(${r},${g},${b})`;
    }
    /**
     * Converts a hexadecimal color code to its corresponding hue, saturation, and brightness values.
     *
     * @param {string} color - The hexadecimal color code to be converted.
     * @return {object} An object containing the hue, saturation, and brightness values of the color.
     */
    static hex2hsb(color) {
        return xcolor.rgb2hsb(xcolor.hex2rgb(color));
    }
    /**
     * Convert a hexadecimal color to HSBA representation.
     *
     * @param {string} color - The hexadecimal color to be converted
     * @return {object} - The HSBA representation of the input color
     */
    static hexa2hsba(color) {
        return xcolor.rgba2hsba(xcolor.hexa2rgba(color));
    }
    /**
     * Convert a hex color to an HSL color.
     *
     * @param {string} color - The hex color to convert
     * @return {array} The HSL color array
     */
    static hex2hsl(color) {
        return xcolor.rgb2hsl(xcolor.hex2rgb(color));
    }
    /**
     * Convert a hexa color to an HSLA color.
     *
     * @param {type} color - description of the hexa color
     * @return {type} description of the resulting HSLA color
     */
    static hexa2hsla(color) {
        return xcolor.rgba2hsla(xcolor.hexa2rgba(color));
    }

    /**
    * @func hsl2hsb
    * @desc Return an HSB color from an HSL color
    * @param {string} colorCode - string containing HSL color
    * @return {StringHSB}
    * @example
    * // returns hsba(150, 100%, 100%)
    * hsl2hsb('hsl(150, 100%, 50%)')
    * @link https://gist.github.com/defims/0ca2ef8832833186ed396a2f8a204117
    */
    static hsl2hsb(colorCode) {
        let [_, hslH, hslS, hslL] = colorCode.match(xcolor.#hslRegex).map(Number);
        const hsb1 = hslS * (hslL < 50 ? hslL : 100 - hslL) / 100;
        const hsbS = hsb1 === 0 ? 0 : 2 * hsb1 / (hslL + hsb1) * 100;
        const hsbB = hslL + hsb1;
        return `hsb(${Math.round(hslH)}, ${Math.round(hsbS)}%, ${Math.round(hsbB)}%)`;
    }
    /**
    * @func hsla2hsba
    * @desc Return an HSBA color from an HSLA color
    * @param {string} colorCode - string containing HSLA color
    * @return {StringHSBA}
    * @example
    * // returns hsba(150, 100%, 100%, 0.5)
    * hsla2hsba('hsla(150, 100%, 50%, 0.5)')
    * @link https://gist.github.com/defims/0ca2ef8832833186ed396a2f8a204117
    */
    static hsla2hsba(colorCode) {
        let [_, hslH, hslS, hslL, hslA] = colorCode.match(xcolor.#hslaRegex).map(Number);
        const hsb1 = hslS * (hslL < 50 ? hslL : 100 - hslL) / 100;
        const hsbS = hsb1 === 0 ? 0 : 2 * hsb1 / (hslL + hsb1) * 100;
        const hsbB = hslL + hsb1;
        return `hsba(${Math.round(hslH)}, ${Math.round(hsbS)}%, ${Math.round(hsbB)}%, ${Math.round(hslA)})`;
    }
    /**
    * @func hsb2hsl
    * @desc Return an HSL color from an HSB color
    * @param {string} colorCode - string containing HSB color
    * @return {StringHSL}
    * @example
    * // returns hsl(150, 100%, 25%)
    * hsb2hsl('hsb(150, 100%, 50%)')
    * @link https://gist.github.com/defims/0ca2ef8832833186ed396a2f8a204117
    */
    static hsb2hsl(colorCode) {
        let [_, hsbH, hsbS, hsbB] = colorCode.match(xcolor.#hsbRegex).map(Number);
        const hslL = (200 - hsbS) * hsbB / 100;
        const [hslS, hslB] = [
            hslL === 0 || hslL === 200 ? 0 : hsbS * hsbB / 100 / (hslL <= 100 ? hslL : 200 - hslL) * 100,
            hslL * 5 / 10
        ];
        return `hsl(${Math.round(hsbH)}, ${Math.round(hslS)}%, ${Math.round(hslB)}%)`;
    }
    /**
    * @func hsba2hsla
    * @desc Return an HSLA color from an HSBA color
    * @param {string} colorCode - string containing HSBA color
    * @return {StringHSLA}
    * @example
    * // returns hsla(150, 100%, 25%, 0.5)
    * hsba2hsla('hsba(150, 100%, 50%, 0.5)')
    * @link https://gist.github.com/defims/0ca2ef8832833186ed396a2f8a204117
    */
    static hsba2hsla(colorCode) {
        let [_, hsbH, hsbS, hsbB, hsbA] = colorCode.match(xcolor.#hsbaRegex).map(Number);
        const hslL = (200 - hsbS) * hsbB / 100;
        const [hslS, hslB] = [
            hslL === 0 || hslL === 200 ? 0 : hsbS * hsbB / 100 / (hslL <= 100 ? hslL : 200 - hslL) * 100,
            hslL * 5 / 10
        ];
        return `hsla(${Math.round(hsbH)}, ${Math.round(hslS)}%, ${Math.round(hslB)}%, ${Math.round(hsbA)})`;
    }
    /**
     * Converts an HSL color code to an RGB color code.
     *
     * @param {string} colorCode - the HSL color code to convert
     * @return {string} the RGB color code
     * @example
     * // returns rgb(0, 255, 128)
     * hsl2rgb('hsl(150, 100%, 50%)')
     */
    static hsl2rgb(colorCode) {
        let [h, s, l] = colorCode.match(/\d+/g).map(Number);
        let a = s * Math.min(l, 100 - l) / 100;
        let f = n => {
            let k = (n + h / 30) % 12;
            let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        }
        let red = Math.round(f(0) / 100);
        let green = Math.round(f(8) / 100);
        let blue = Math.round(f(4) / 100);
        return `rgb(${red},${green},${blue})`;
    }
    /**
     * Converts an HSLA color code to an RGBA color code.
     *
     * @param {string} colorCode - the HSLA color code to convert
     * @return {string} the RGBA color code
     * @example
     * // returns rgb(0, 255, 128, 0.5)
     * hsla2rgba('hsl(150, 100%, 50%, 0.5)')
     */
    static hsla2rgba(colorCode) {
        let [_, h, s, l, a] = colorCode.match(/\((\d+),\s?(\d+)%,\s?(\d+)%,\s?(\d*\.\d+)\)/).map(Number);
        let rgbA = (s * Math.min(l, 100 - l) / 100) / 100;
        let f = n => {
            let k = (n + h / 30) % 12;
            let color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color);
        }
        let red = Math.round(f(0) / 100);
        let green = Math.round(f(8) / 100);
        let blue = Math.round(f(4) / 100);
        return `rgba(${red},${green},${blue},${rgbA})`;
    }
    /**
     * Convert RGB color code to HSL format.
     *
     * @param {string} colorCode - the RGB color code to be converted
     * @return {string} the corresponding HSL color code
     * @example
     * // returns hsl(150, 100%, 50%)
     * rgb2hsl('rgb(0, 255, 128)')
     */
    static rgb2hsl(colorCode) {
        let [r, g, b] = colorCode.match(/\d+/g).map(Number);
        r /= 255, g /= 255, b /= 255;
        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;
        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
    /**
     * Converts an RGBA color code to HSLA format.
     *
     * @param {string} colorCode - The RGBA color code to be converted
     * @return {string} The color in HSLA format
     * @example
     * // returns hsla(150, 100%, 50%, 0.5)
     * rgba2hsla('rgba(0, 255, 128, 0.5)')
     */
    static rgba2hsla(colorCode) {
        let [_, r, g, b, a] = colorCode.match(/\((\d+),\s?(\d+),\s?(\d+),\s?(\d*\.\d+)\)/).map(Number);
        let [h, s, l] = this.rgb2hsl(`rgb(${r},${g},${b})`).match(/\d+/g).map(Number);
        return `hsla(${h}, ${s}%, ${l}%, ${a})`;
    }
    /**
     * Convert a color in HSB format to RGB format.
     *
     * @param {string} colorCode - the color code in the HSB format
     * @return {string} the color code in the RGB format
     * @example
     * // returns rgb(0, 255, 128)
     * hsb2rgb('hsb(150, 100%, 100%)')
     */
    static hsb2rgb(colorCode) {
        let [_h, _s, _b] = colorCode.match(/\d+/g).map(Number);
        let h = _h, s = _s / 100, b = _b / 100;
        let f = (n, k = (n + h / 60) % 6) => b - b * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return `rgb(${map(f(5), 0, 1, 0, 255)},${map(f(3), 0, 1, 0, 255)},${map(f(1), 0, 1, 0, 255)})`;
    }
    /**
     * Converts a color code in HSBA format to RGBA format.
     *
     * @param {string} colorCode - The color code in HSBA format, enclosed in parentheses and separated by commas.
     * @return {string} The color code in RGBA format, enclosed in quotes and separated by commas.
     * @example
     * // returns rgba(0, 255, 128, 0.5)
     * hsba2rgba('hsba(150, 100%, 100%, 0.5)')
     */
    static hsba2rgba(colorCode) {
        let [_, h, s, b, a] = colorCode.match(/\((\d+),\s?(\d+)%,\s?(\d+)%,\s?(\d*\.\d+)\)/).map(Number);
        s = s / 100;
        b = b / 100;
        let f = (n, k = (n + h / 60) % 6) => b - b * s * Math.max(Math.min(k, 4 - k, 1), 0);
        return `rgba(${map(f(5), 0, 1, 0, 255)},${map(f(3), 0, 1, 0, 255)},${map(f(1), 0, 1, 0, 255)},${a})`;
    }
    /**
     * Converts an RGB color code to an HSB color code.
     *
     * @param {string} colorCode - the RGB color code to convert
     * @return {string} the HSB color code
     * @example
     * // returns hsb(150, 100%, 100%)
     * rgb2hsb('rgb(0, 255, 128)')
     */
    static rgb2hsb(colorCode) {
        let [r, g, b] = colorCode.match(/\d+/g).map(Number);
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            d = max - min,
            s = max == 0 ? 0 : d / max,
            h = s == 0 ? 0 : d == min ? 0
                : max == r ? (g - b) / d + (g < b ? 6 : 0)
                    : max == g ? (b - r) / d + 2
                        : (r - g) / d + 4;
        return `hsb(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(((max / 255) * 100))}%)`;
    }
    /**
     * Converts an RGBA color code to HSBA format.
     *
     * @param {string} colorCode - The RGBA color code to convert.
     * @return {string} The color in HSBA format.
     * @example
     * // returns hsba(150, 100%, 100%, 0.5)
     * rgba2hsba('rgba(0, 255, 128, 0.5)')
     */
    static rgba2hsba(colorCode) {
        let [_, r, g, b, a] = colorCode.match(/\((\d+),\s?(\d+),\s?(\d+),\s?(\d*\.\d+)\)/).map(Number);
        let max = Math.max(r, g, b),
            min = Math.min(r, g, b),
            d = max - min,
            s = max == 0 ? 0 : d / max,
            h = s == 0 ? 0 : d == min ? 0
                : max == r ? (g - b) / d + (g < b ? 6 : 0)
                    : max == g ? (b - r) / d + 2
                        : (r - g) / d + 4;
        return `hsba(${Math.round(h * 60)}, ${Math.round(s * 100)}%, ${Math.round(((max / 255) * 100))}%, ${a})`;
    }

    /**
     * Converts an HSL color code to its corresponding hexadecimal representation.
     *
     * @param {Array} colorCode - An array containing the HSL color code in the format [hue, saturation, lightness].
     * @return {string} The hexadecimal representation of the given HSL color code.
     * @example
     * // returns #ff0000
     * hsl2hex('hsl(0, 100%, 50%)')
     */
    static hsl2hex(colorCode) {
        return xcolor.rgb2hex(xcolor.hsl2rgb(colorCode));
    }
    /**
     * Converts a color in HSLA format to hexadecimal format.
     *
     * @param {string} colorCode - the color code in HSLA format
     * @return {string} the color code in hexadecimal format
     * @example
     * // returns #ff000080
     * hsla2hexa('hsla(0, 100%, 50%, 0.5)')
     */
    static hsla2hexa(colorCode) {
        return xcolor.rgba2hexa(xcolor.hsla2rgba(colorCode));
    }
    /**
     * Converts a color code from HSB (Hue, Saturation, Brightness) to Hexadecimal.
     *
     * @param {Array} colorCode - An array containing the HSB color code.
     * @return {string} The hexadecimal representation of the color code.
     * @example
     * // returns #ff0000
     * hsb2hex('hsb(0, 100%, 100%)')
     */
    static hsb2hex(colorCode) {
        return xcolor.rgb2hex(xcolor.hsb2rgb(colorCode));
    }
    /**
     * Converts a color code in HSBA format to hexadecimal format.
     *
     * @param {string} colorCode - The color code in HSBA format.
     * @return {string} The color code in hexadecimal format.
     * @example
     * // returns #ff000080
     * hsba2hexa('hsba(0, 100%, 100%, 0.5)')
     */
    static hsba2hexa(colorCode) {
        return xcolor.rgba2hexa(xcolor.hsba2rgba(colorCode));
    }


    /**
     * Generate a random color in the specified format ('hex', 'rgb', 'rgba', 'hsb', 'hsba', 'hsl', 'hsla').
     *
     * @param {string} format - The format of the color to generate (default: 'hex')
     * @return {string} The randomly generated color in the specified format
     * @example
     * // returns #ff0000
     * randomColor('hex')
     * @example
     * // returns rgb(255, 0, 0)
     * randomColor('rgb')
     * @example
     * // returns rgba(255, 0, 0, 0.5)
     * randomColor('rgba')
     * @example
     * // returns hsb(0, 100%, 100%)
     * randomColor('hsb')
     * @example
     * // returns hsba(0, 100%, 100%, 0.5)
     * randomColor('hsba')
     * @example
     * // returns hsl(0, 100%, 50%)
     * randomColor('hsl')
     * @example
     * // returns hsla(0, 100%, 50%, 0.5)
     * randomColor('hsla')
     */
    static randomColor(format = 'hex') {
        let methods = ['hex', 'rgb', 'rgba', 'hsb', 'hsba', 'hsl', 'hsla'];
        let method = methods.includes(format) ? format : methods[Math.floor(Math.random() * methods.length)];
        switch (method) {
            case 'hex':
                return `#${((Math.random() * 0xfffff * 1000000).toString(16)).slice(0, 6)}`;
            case 'rgb':
                return `rgb(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)})`;
            case 'rgba':
                return `rgba(${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.floor(Math.random() * 256)},${Math.random()})`;
            case 'hsb':
                return `hsb(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 100)}%,${Math.floor(Math.random() * 100)}%)`;
            case 'hsba':
                return `hsba(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 100)}%,${Math.floor(Math.random() * 100)}%,${Math.random()})`;
            case 'hsl':
                return `hsl(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 100)}%,${Math.floor(Math.random() * 100)}%)`;
            case 'hsla':
                return `hsla(${Math.floor(Math.random() * 360)},${Math.floor(Math.random() * 100)}%,${Math.floor(Math.random() * 100)}%,${Math.random()})`;
        }
    }

    /**
     * Generate a random color in the specified format ('hex', 'rgb', 'rgba', 'hsb', 'hsba', 'hsl', 'hsla').
     *
     * @param {string} format - The format of the color to generate (default: 'hex')
     * @return {xcolor} The randomly generated color in the specified format
     * @example
     * // returns xcolor
     * randomColor('hex')
     */
    static randomXcolor(format = 'hex') {
        let methods = ['hex', 'rgb', 'rgba', 'hsb', 'hsba', 'hsl', 'hsla'];
        let method = methods.includes(format) ? format : methods[Math.floor(Math.random() * methods.length)];
        switch (method) {
            case 'hex':
                return new xcolor(`#${((Math.random() * 0xfffff * 1000000).toString(16)).slice(0, 6)}`);
            case 'rgb':
                return xcolor.getRgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
            case 'rgba':
                return xcolor.getRgba(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.random());
            case 'hsb':
                return xcolor.getHsb(Math.floor(Math.random() * 360), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
            case 'hsba':
                return xcolor.getHsba(Math.floor(Math.random() * 360), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.random());
            case 'hsl':
                return xcolor.getHsl(Math.floor(Math.random() * 360), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100));
            case 'hsla':
                return xcolor.getHsla(Math.floor(Math.random() * 360), Math.floor(Math.random() * 100), Math.floor(Math.random() * 100), Math.random());
        }
    }

    /**
     * Performs linear interpolation between two colors.
     *
     * @param {xcolor} xcolorA - The first xcolor object
     * @param {xcolor} xcolorB - The second xcolor object
     * @param {number} intval - The interpolation value between 0 and 1
     * @return {xcolor} A new xcolor object resulting from the linear interpolation
     */
    static lerpColor(xcolorA, xcolorB, intval) {
        const rgbA = [xcolorA.r, xcolorA.g, xcolorA.b, xcolorA.a],
            rgbB = [xcolorB.r, xcolorB.g, xcolorB.b, xcolorB.a];
        const colorVal = (prop) =>
            Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);
        return new xcolor(`rgba( ${colorVal('r')}, ${colorVal('g')}, ${colorVal('b')}, ${colorVal('a')})`);
    }

    /**
     * Static method to darken a color by a specified amount.
     *
     * @param {xcolor} xcolor - the xcolor to darken
     * @param {number} amount - the amount by which to darken the color between 0 and 1
     * @return {xcolor} - the darkened xcolor
     */
    static darken(xcolor, amount) {
        const rgb = [xcolor.r, xcolor.g, xcolor.b, xcolor.a];
        const colorVal = (prop) =>
            Math.round(rgb[prop] * (1 - amount));
        return new xcolor(`rgba( ${colorVal('r')}, ${colorVal('g')}, ${colorVal('b')}, ${colorVal('a')})`);
    }

    /**
     * Lightens the given xcolor by the specified amount.
     *
     * @param {xcolor} xcolor - The xcolor object to be lightened.
     * @param {number} amount - The amount by which to lighten the xcolor.
     * @return {xcolor} - The lightened xcolor object.
     */
    static ligthten(xcolor, amount) {
        const rgb = [xcolor.r, xcolor.g, xcolor.b, xcolor.a];
        const colorVal = (prop) =>
            Math.round(rgb[prop] * (1 + amount));
        return new xcolor(`rgba( ${colorVal('r')}, ${colorVal('g')}, ${colorVal('b')}, ${colorVal('a')})`);
    }

    /**
     * Generate an analogous color palette based on the given base color.
     *
     * @param {xcolor} baseColor - the base color to generate the palette from
     * @return {xcolor[]} an array containing three analogous colors
     */
    static analogousPalette(baseColor) {
        let analogous1 = xcolor.getHsb((baseColor.hsb.h + 330) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let analogous3 = xcolor.getHsb((baseColor.hsb.h + 30) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [analogous1, baseColor, analogous3];
    }

    /**
     * Generates a complementary palette based on a given base color.
     *
     * @param {xcolor} baseColor - The base color to generate the complementary palette from.
     * @return {xcolor[]} An array containing the base color and its complementary color.
     */
    static complementaryPalette(baseColor) {
        let complementary1 = xcolor.getHsb((baseColor.hsb.h + 180) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [baseColor, complementary1];
    }

    /**
     * Generates a split complementary palette based on the provided base color.
     *
     * @param {xcolor} baseColor - The base color from which the palette is generated.
     * @return {xcolor[]} An array containing the base color and its two split complementary colors.
     */
    static splitComplementaryPalette(baseColor) {
        let splitComplementary1 = xcolor.getHsb((baseColor.hsb.h + 150) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let splitComplementary2 = xcolor.getHsb((baseColor.hsb.h + 210) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [baseColor, splitComplementary1, splitComplementary2];
    }

    /**
     * Generates a triadic color palette based on a given base color.
     *
     * @param {xcolor} baseColor - The base color to generate the palette from.
     * @return {xcolor[]} An array containing the base color and two triadic colors.
     */
    static triadicPalette(baseColor) {
        let triadic1 = xcolor.getHsb((baseColor.hsb.h + 120) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let triadic2 = xcolor.getHsb((baseColor.hsb.h + 240) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [baseColor, triadic1, triadic2];
    }

    /**
     * Generate a tetradic color palette based on the input base color.
     *
     * @param {xcolor} baseColor - the base color used to generate the palette
     * @return {xcolor[]} an array containing the base color and three additional colors forming a tetradic palette
     */
    static tetradicPalette(baseColor) {
        let tetradic1 = xcolor.getHsb((baseColor.hsb.h + 60) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let tetradic2 = xcolor.getHsb((baseColor.hsb.h + 180) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let tetradic3 = xcolor.getHsb((baseColor.hsb.h + 240) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [baseColor, tetradic1, tetradic2, tetradic3];
    }

    /**
     * Generate a square color palette based on the provided base color.
     *
     * @param {xcolor} baseColor - the base color to generate the palette from
     * @return {xcolor[]} an array containing the base color and three additional square colors
     */
    static squarePalette(baseColor) {
        let square1 = xcolor.getHsb((baseColor.hsb.h + 90) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let square2 = xcolor.getHsb((baseColor.hsb.h + 180) % 360, baseColor.hsb.s, baseColor.hsb.b);
        let square3 = xcolor.getHsb((baseColor.hsb.h + 270) % 360, baseColor.hsb.s, baseColor.hsb.b);
        return [baseColor, square1, square2, square3];
    }

    /**
     * Generate a monochromatic palette based on the base color.
     *
     * @param {xcolor} baseColor - the base color to generate the palette from
     * @return {xcolor[]} an array containing the monochromatic colors
     */
    static monochromaticPalette(baseColor) {
        let monochromaticPalette = [];
        let n = 15, s = 0, b = 0;
        for (var i = 0; i < n; i++) {
            s = 100;/* Vary the brightness regardless of value number */
            b = map(i, 0, n - 1, 100, 0);/* Increase saturation only in the first half */
            if (i < n / 2)
                s = map(i, 0, n / 2 - 1, 0, 100);
            monochromaticPalette.push(xcolor.getHsb(baseColor.hsb.h, s, b));
        }
        return monochromaticPalette;
    }

    /**
     * Generates a greyscale palette based on the provided base color.
     *
     * @param {Object} baseColor - The base color to generate the palette from.
     * @return {xcolor[]} An array of xcolor objects representing the greyscale palette.
     */
    static greysPalette(baseColor) {
        let greysPalette = [];
        let n = 15;
        let s = 0;
        for (var i = 0; i < n; i++) {
            /* Vary the brightness regardless of value number */
            let b = map(i, 0, n - 1, 100, 0);
            greysPalette.push(xcolor.getHsb(baseColor.hsb.h, s, Math.round(b)));
        }
        return greysPalette;
    }

    /**
     * Generates an array of shades based on the base color.
     *
     * @param {xcolor} baseColor - The base color to generate shades from.
     * @return {xcolor[]} An array of xcolor objects representing the shades.
     */
    static shades(baseColor) {
        let shades = [];
        for (let i = 0; i < 15; i++) {
            shades.push(xcolor.getHsb(baseColor.hsb.h, baseColor.hsb.s, map(i, 0, 14, baseColor.hsb.b, 0)));
        }
        return shades;
    }

    /**
     * Generate an array of tints based on the baseColor provided.
     *
     * @param {xcolor} baseColor - the base color used to generate tints
     * @return {xcolor[]} an array of tints
     */
    static tints(baseColor) {
        let tints = [];
        for (let i = 0; i < 15; i++) {
            tints.push(xcolor.getHsb(baseColor.hsb.h, map(i, 0, 14, baseColor.hsb.s, 0), map(i, 0, 14, baseColor.hsb.b, 100)));
        }
        return tints;
    }

    /**
     * Generates a set of tones based on a base color.
     *
     * @param {xcolor} baseColor - The base color to generate tones from.
     * @return {xcolor[]} An array of xcolor objects representing the generated tones.
     */
    static tones(baseColor) {
        let tones = [];
        for (let i = 0; i < 15; i++) {
            tones.push(xcolor.getHsb(baseColor.hsb.h, map(i, 0, 14, baseColor.hsb.s, 0), baseColor.hsb.b));
        }
        return tones;
    }

}

window.xcolor = xcolor;

if (typeof module !== 'undefined' && module.exports) {
    module.exports = xcolor;
}