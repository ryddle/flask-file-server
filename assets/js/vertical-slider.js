
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { FASTElement, html, attr, css, customElement } from "./fast-element.js";
const normalize = `
  :host {
    position: relative;
    box-sizing: border-box;
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  [hidden] {
    display: none !important;
  }
  button {
    cursor: pointer;
  }
`;
const thumbStyles = `
  cursor: pointer;
  height: var(--thumb-size);
  width: var(--thumb-size);
  border-radius: 50%;
  border: 2px solid var(--thumb-border);
  margin-top: calc((var(--thumb-size) / -2 + var(--track-width) / 2) - 1px);
  background-color: var(--thumb-color);
`;
const trackStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--track-color);
  border: 1px solid var(--track-border-color);
  outline: none;
  border-radius: var(--track-radius);
  cursor: pointer;
`;
const progressStyles = `
  width: var(--track-height);
  height: var(--track-width);
  background-color: var(--progress-color);
  border: 1px solid var(--progress-border-color);
  border-radius: var(--track-radius);
`;
const styles = css `
${normalize}

:host {
  --width: 16px;
  --height: 100px;

  --thumb-border: chocolate;
  --thumb-color: chocolate;
  --thumb-size: 16px;

  --track-height: 100%;
  --track-width: 9px;
  --track-radius: 9px;
  --track-color: rgb(225, 225, 225);
  --track-border-color: #111;

  --progress-color: chocolate;
  --progress-border-color: chocolate;

  display: inline-block;
  position: relative;
  margin-right: calc(var(--width) / 2);
}

.wrapper {
  width: var(--width);
  height: var(--height);
  position: relative;

  /* center the slider */
  margin: 0 auto;
}

.slider {
  background-color: transparent;
  -webkit-appearance: none;
  width: var(--height);
  height: var(--width);
  left: 0;
  bottom: -0.75em;
  transform: rotate(-90deg) translateY(calc(var(--width) / 2));
  transform-origin: left;
  position: absolute;
}

/* https://css-tricks.com/styling-cross-browser-compatible-range-inputs-css/ */
/* Special styling for WebKit/Blink */
.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  ${thumbStyles}
}

/* All the same stuff for Firefox */
.slider::-moz-range-thumb {
  ${thumbStyles}
}

.slider::-webkit-slider-runnable-track {
  ${trackStyles}
  background: linear-gradient(to right, var(--progress-color) 0%, var(--progress-color) var(--progress-percent), var(--track-color) var(--progress-percent), var(--track-color) 100%);
}

.slider::-moz-range-track {
  ${trackStyles}
}

.slider::-moz-range-progress {
  ${progressStyles}
}
`;
const template = html `
  <div class="wrapper" part="wrapper">
    <input type="range" class="slider" part="slider"
           min="${x => x.min}"
           max="${x => x.max}"
           step="${x => x.step}"
           @input="${(x, c) => x.handleInput(c.event)}"
           >
  </div>
`;
let VerticalSlider = class VerticalSlider extends FASTElement {
    constructor() {
        super(...arguments);
        this.min = 0;
        this.value = 50;
        this.max = 100;
        this.step = 1;
    }
    connectedCallback() {
        super.connectedCallback();
        const progressPercent = `${(this.value / this.max) * 100}`;
        this.updateProgress(progressPercent);
    }
    handleInput(event) {
        const input = event.currentTarget;
        this.value = Number(input.value);
    }
    valueChanged(_oldValue, newValue) {
        const progressPercent = `${(newValue / this.max) * 100}`;
        this.updateProgress(progressPercent);
    }
    updateProgress(value) {
        this.style.setProperty('--progress-percent', value + '%');
    }
};
__decorate([
    attr,
    __metadata("design:type", Number)
], VerticalSlider.prototype, "min", void 0);
__decorate([
    attr,
    __metadata("design:type", Number)
], VerticalSlider.prototype, "value", void 0);
__decorate([
    attr,
    __metadata("design:type", Number)
], VerticalSlider.prototype, "max", void 0);
__decorate([
    attr,
    __metadata("design:type", Number)
], VerticalSlider.prototype, "step", void 0);
VerticalSlider = __decorate([
    customElement({
        name: 'vertical-slider',
        template,
        styles
    })
], VerticalSlider);
export { VerticalSlider };
//# sourceURL=pen.js
    