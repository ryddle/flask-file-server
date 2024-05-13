class XverticalSliderEventTarget extends EventTarget {
    constructor() {
        super()
    }

    trigger(event, data) {
        this.dispatchEvent(new CustomEvent(event, { detail: data }));
    }
}

export default class XverticalSlider extends XverticalSliderEventTarget {
    /**
     * Initializes a new instance of the class with the provided configuration.
     *
     * @param {Object} config - The configuration object.
     * @param {HTMLElement} config.container - The container element for the slider.
     * @param {number} config.value - The initial value of the slider.
     * @param {number} config.min - The minimum value of the slider.
     * @param {number} config.max - The maximum value of the slider.
     * @param {number} config.step - The step value of the slider.
     * @param {number} config.width - The width of the slider.
     * @param {number} config.height - The height of the slider.
     * @param {boolean} config.invert - Whether to invert the slider.
     * @param {Object} config.color - The color configuration of the slider.
     * @param {string} config.color.trackColor1 - The first color of the track.
     * @param {string} config.color.trackColor2 - The second color of the track.
     * @param {function} config.callback - The callback function for the slider.
     */
    constructor(config) {
        super();
        if (config == null) { config = {}; Object.assign(config, this.#config_default); }
        this.container = config.container;
        this.value = config.value || this.#config_default.value;
        this.min = config.min || this.#config_default.min;
        this.max = config.max || this.#config_default.max;
        this.step = config.step || this.#config_default.step;
        this.width = config.width || this.#config_default.width;
        this.height = config.height || this.#config_default.height;
        if (this.width > this.height) {
            this.width, this.height = this.height, this.width;
        }
        this.width = Math.max(this.width, 10);
        this.invert = config.invert || this.#config_default.invert;
        this.range = this.max - this.min;
        this.showLabel = config.showLabel || this.#config_default.showLabel;

        this.list = config.list;
        this.dual_ticks = config.dual_ticks || false;

        this.tick_mark_thumb = config.tick_mark_thumb || false;

        this.margin = this.#config_default.margin;

        this.colorConfig = this.#config_default.color;
        Object.assign(this.colorConfig, config.color);

        this.callback = config.callback;

        this.#createxVerticalSlider();

        if (this.container == null) {
            return this._sliderContainer;
        } else {
            this.container.appendChild(this._sliderContainer);
        }
    }

    #config_default = {
        container: null,
        value: 0,
        min: 0,
        max: 100,
        step: 1,
        width: 10,
        height: 100,
        invert: false,
        showLabel: true,
        callback: null,
        color: {
            trackColorBack: '#ffffff',
            trackColorOver: 'hsl(212,100%,50%)',
            trackBorderColor: '#111111',
            thumbColor: 'hsl(212,100%,50%)',
            thumbBorderColor: 'hsl(212,100%,25%)',
            labelColor: '#333333',
            ticksColor: '#333333',
        },
        margin: 8
    }

    #map = function (value, x1, y1, x2, y2) {
        const nv = Math.round((value - x1) * (y2 - x2) / (y1 - x1) + x2);
        return (x2 > y2) ? Math.min(Math.max(nv, y2), x2) : Math.max(Math.min(nv, y2), x2);
    }

    #invokeCallback = function () {
        if (this.callback) {
            this._sliderContainer["value"] = this.value;
            this.callback(this._sliderContainer);
        }
    }

    #getPosForValue = function (value) {
        return this.#map(value, this.min, this.max, this.height - (this.width + 3), 0);
    }

    #getPosByValue = function () {
        return this.#map(this.value, this.min, this.max, this.height - (this.width + 3), 0);
    }

    #getValueByPos = function (pos) {
        return this.#map(pos, this.height - (this.width + 3), 0, this.min, this.max);
    }

    #getValuePercent = function () {
        return ((this.value - this.min) / this.range) * 100;
    }

    #createxVerticalSlider() {
        let _self = this;
        let _slider = this.#createSlider();
        this._sliderTrack = _slider.sliderTack;
        this._sliderContainer = _slider.sliderCont;
        this._sliderContainer.self = this;
        this._thumb = this.#createThumb(0, this.#getPosByValue());
        this._sliderContainer.appendChild(this._sliderTrack);
        this._sliderContainer.appendChild(this._thumb);

        this._sliderTrack.onclick = function (e) {
            let newtop = e.layerY - 13;
            _self._thumb.style.top = newtop + "px";
            _self.value = _self.#getValueByPos(newtop);
            _self._sliderTrack.style.background = 'linear-gradient(180deg, ' + _self.colorConfig.trackColorBack + ' ' + (100 - _self.#getValuePercent()) + '%, ' + _self.colorConfig.trackColorBack + ' 0%, ' + _self.colorConfig.trackColorOver + ' 0%)';
            _self.trigger('change');
            _self.#invokeCallback();
        }

        this._thumb.onmousedown = function (e) {
            this.isDragging = true;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
            this.initDragPosition = { x: e.clientX, y: e.clientY };

            if (_self.showLabel == true) {
                _self._label.style.top = parseInt(this.style.top) + "px";
                _self._label.style.left = this.clientWidth + 10 + "px";
                _self._label.style.visibility = 'visible';
                _self._label.innerHTML = _self.value;
            }
        };
        this._thumb.onmousemove = function (e) {
            if (this.isDragging) {
                let newtop = (e.clientY > this.initDragPosition.y) ? this.initialPosition.y + (e.clientY - this.initDragPosition.y) : this.initialPosition.y - (this.initDragPosition.y - e.clientY);
                newtop = Math.max((_self.tick_mark_thumb ? 2 : 0), Math.min(_self.height - (this.clientHeight / 2) - ((parseInt(this.style.height)) / 4) + (_self.tick_mark_thumb ? 2 : 0), newtop));
                this.style.top = newtop + "px";

                _self.value = _self.#getValueByPos(newtop);
                _self._sliderTrack.style.background = 'linear-gradient(180deg, ' + _self.colorConfig.trackColorBack + ' ' + (100 - _self.#getValuePercent()) + '%, ' + _self.colorConfig.trackColorBack + ' 0%, ' + _self.colorConfig.trackColorOver + ' 0%)';
                if (_self.showLabel == true) {
                    _self._label.style.top = newtop + "px";
                    _self._label.style.left = this.clientWidth + 10 + "px";
                    _self._label.innerHTML = _self.value;
                }

                _self.trigger('change');
            }
        }
        this._thumb.onmouseup = function (e) {
            this.isDragging = false;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
            _self._sliderTrack.style.background = 'linear-gradient(180deg, ' + _self.colorConfig.trackColorBack + ' ' + (100 - _self.#getValuePercent()) + '%, ' + _self.colorConfig.trackColorBack + ' 0%, ' + _self.colorConfig.trackColorOver + ' 0%)';
            _self._label.style.visibility = 'hidden';
            _self.#invokeCallback();
        };

        if (this.showLabel) {
            this._label = this.#createLabel();
            this._sliderContainer.appendChild(this._label);
        }

        if (this.list != null) {
            let datalist = document.getElementById(this.list);
            if (datalist != null) {
                this._sliderContainer.appendChild(this.#createTicks(datalist));
            }
        }

    }

    #createSlider() {
        let sliderCont = document.createElement("div");
        sliderCont.className = "xsliderContainer";
        Object.assign(sliderCont.style, {
            position: "relative",
            width: this.width + this.margin + "px",
            height: this.height + this.margin + "px",
            overflow: "visible",
            display: "block",
            margin: '2px'
        });

        let sliderTack = document.createElement("div");
        sliderTack.className = "xsliderTrack";
        Object.assign(sliderTack.style, {
            position: "absolute",
            top: (this.margin / 2) + "px",
            left: (this.margin / 2) + "px",
            width: this.width + "px",
            height: this.height + "px",
            border: '1px solid ' + this.colorConfig.trackBorderColor,
            borderBottomLeftRadius: this.width + 'px',
            borderBottomRightRadius: this.width + 'px',
            borderTopLeftRadius: this.width + 'px',
            borderTopRightRadius: this.width + 'px',
            boxSizing: "border-box",
            background: this.colorConfig.trackColorBack,
            background: 'linear-gradient(180deg, ' + this.colorConfig.trackColorBack + ' ' + (100 - this.#getValuePercent()) + '%, ' + this.colorConfig.trackColorBack + ' 0%, ' + this.colorConfig.trackColorOver + ' 0%)'
        })

        return { sliderCont: sliderCont, sliderTack: sliderTack };
    }

    #createThumb(left, top) {
        let _thumb = document.createElement("div");
        Object.assign(_thumb.style, {
            top: top + (this.tick_mark_thumb ? 2 : 0) + 'px',
            left: left + (this.tick_mark_thumb ? 0 : 0) + 'px',
            width: this.width + (this.tick_mark_thumb ? 8 : 3) + 'px',
            height: this.width + (this.tick_mark_thumb ? 8 : 3) + 'px',
            position: 'absolute',
            overflow: 'visible',
            zIndex: '100',
            cursor: "pointer",
            backgroundColor: this.colorConfig.thumbColor,
            border: (this.tick_mark_thumb ? 0 : 2) + 'px solid ' + this.colorConfig.thumbBorderColor,
            borderRadius: (this.tick_mark_thumb ? '0px' : '50%'),
            willChange: 'transform',
            boxSizing: 'unset'
        });

        if (this.tick_mark_thumb) {
            let _thumbMark = document.createElement("div");
            Object.assign(_thumbMark.style, {
                position: 'absolute',
                top: (this.width + 8) / 2 - 2  + 'px',
                left: '1px',
                width: this.width + (this.tick_mark_thumb ? 1 : 4) + 'px',
                height: '2px',
                backgroundColor: this.colorConfig.thumbBorderColor,
                marginLeft: (this.tick_mark_thumb ? 2 : 0) + 'px'
            });

            _thumb.appendChild(_thumbMark);
        }

        return _thumb;
    }

    #createLabel() {
        let _label = document.createElement("div");
        Object.assign(_label.style, {
            top: '0px',
            left: '0px',
            width: '40px',
            height: '20px',
            position: 'absolute',
            overflow: 'visible',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            color: this.colorConfig.labelColor || '#333333',
            visibility: 'hidden',
            border: '1px solid ' + this.colorConfig.labelBorderColor || '#333333',
            borderRadius: '10px',
        });

        return _label;
    }

    #createTicks(datalist) {
        let ticks = document.createElement("div");
        ticks.style.position = 'absolute';
        ticks.style.top = '0px';
        ticks.style.left = ((this.dual_ticks) ? this.width - 1 : this.width) + 'px';
        ticks.style.zIndex = '-10';
        for (let i = 0; i < datalist.options.length; i++) {
            let option = datalist.options[i];
            let tick = document.createElement("div");
            Object.assign(tick.style, {
                position: 'absolute',
                top: this.#getPosForValue(option.value) + (this.margin) + 2 + 'px',
                left: ((this.dual_ticks) ? this.width * 3 * -1 : 0) + 'px',
                width: (((option.label != "") ? 10 : 5) + ((this.dual_ticks) ? this.width * 3 : 0)) + 'px',
                height: '2px',
                overflow: 'visible',
                display: 'block',
                borderTop: ((option.label != "") ? 2 : 1) + 'px solid ' + this.colorConfig.ticksColor,
                borderRadius: '10px',
                marginLeft: ((option.label != "") ? ((this.dual_ticks) ? this.width * 3/2 : this.width) / 2 +2: (((this.dual_ticks) ? this.width * 3/2 : this.width) + 5) / 2) + 'px',
                marginRight: ((option.label != "") ? ((this.dual_ticks) ? this.width * 3/2 : this.width) / 2 +2 : (((this.dual_ticks) ? this.width * 3/2 : this.width)  + 5) / 2) + 'px',
            });
            ticks.appendChild(tick);
        }

        return ticks;
    }

    getValue() {
        return this.value;
    }

    setValue(value) {
        if (value < this.min) {
            value = this.min;
        } else if (value > this.max) {
            value = this.max;
        }
        if (value != this.value) {
            this.value = value;
            if(this._thumb!==undefined){
                this._thumb.style.top = this.#getPosForValue(value) + "px";
                this._sliderTrack.style.background= 'linear-gradient(180deg, ' + this.colorConfig.trackColorBack + ' ' + (100-this.#getValuePercent()) + '%, ' + this.colorConfig.trackColorBack + ' 0%, ' + this.colorConfig.trackColorOver + ' 0%)';
                this.trigger('change');
                this.#invokeCallback();
            }
        }
    }

    setAttribute(name, value) {
        this._sliderContainer.setAttribute(name, value);
    }
}
