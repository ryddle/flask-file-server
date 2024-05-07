//export { xcolorcpicker };

//import { xcolor } from "./xcolor.js";
class xcolorcpicker {
    #closeIcon = '<svg style="enable-background:new 0 0 24 24;" version="1.1" viewBox="0 0 24 24" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><g id="info"/><g id="icons"><path d="M14.8,12l3.6-3.6c0.8-0.8,0.8-2,0-2.8c-0.8-0.8-2-0.8-2.8,0L12,9.2L8.4,5.6c-0.8-0.8-2-0.8-2.8,0   c-0.8,0.8-0.8,2,0,2.8L9.2,12l-3.6,3.6c-0.8,0.8-0.8,2,0,2.8C6,18.8,6.5,19,7,19s1-0.2,1.4-0.6l3.6-3.6l3.6,3.6   C16,18.8,16.5,19,17,19s1-0.2,1.4-0.6c0.8-0.8,0.8-2,0-2.8L14.8,12z" id="exit" fill="#ffffff"/></g></svg>';
    #dropIcon = '%3Csvg%20fill%3D%22%23ffffff%22%20version%3D%221.1%22%20id%3D%22Capa_1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%20viewBox%3D%22-48.99%20-48.99%20587.86%20587.86%22%20xml%3Aspace%3D%22preserve%22%20width%3D%2218px%22%20height%3D%2218px%22%20transform%3D%22rotate(90)%22%20stroke%3D%22%23ffffff%22%20stroke-width%3D%220.00489876%22%3E%3Cg%20id%3D%22SVGRepo_bgCarrier%22%20stroke-width%3D%220%22%3E%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_tracerCarrier%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke%3D%22%23000000%22%20stroke-width%3D%2260.744624%22%3E%20%3Cg%3E%20%3Cg%3E%20%3Cg%3E%20%3Crect%20x%3D%22184.203%22%20y%3D%22151.98%22%20transform%3D%22matrix(0.7071%200.7071%20-0.7071%200.7071%20221.6865%20-157.7399)%22%20width%3D%22234.098%22%20height%3D%2273.499%22%3E%3C%2Frect%3E%20%3Cpath%20d%3D%22M228.951%2C196.59l-164.1%2C164.1c-14.4%2C14.4-26.1%2C30.7-35.4%2C49l-28.4%2C56.8c-1.9%2C3.9-1.2%2C8.6%2C1.9%2C11.7l8.6%2C8.6%20c3.1%2C3.1%2C7.8%2C3.9%2C11.7%2C1.9l56.8-28.4c18.3-8.9%2C34.6-21%2C49-35.4l164.5-164.5L228.951%2C196.59z%22%3E%3C%2Fpath%3E%20%3Cpath%20d%3D%22M467.751%2C21.99c-29.2-29.2-77-29.2-106.2%2C0l-73.9%2C73.9l106.2%2C106.2l73.9-73.9C497.251%2C98.59%2C497.251%2C51.09%2C467.751%2C21.99%20z%22%3E%3C%2Fpath%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%3Cg%20id%3D%22SVGRepo_iconCarrier%22%3E%20%3Cg%3E%20%3Cg%3E%20%3Cg%3E%20%3Crect%20x%3D%22184.203%22%20y%3D%22151.98%22%20transform%3D%22matrix(0.7071%200.7071%20-0.7071%200.7071%20221.6865%20-157.7399)%22%20width%3D%22234.098%22%20height%3D%2273.499%22%3E%3C%2Frect%3E%20%3Cpath%20d%3D%22M228.951%2C196.59l-164.1%2C164.1c-14.4%2C14.4-26.1%2C30.7-35.4%2C49l-28.4%2C56.8c-1.9%2C3.9-1.2%2C8.6%2C1.9%2C11.7l8.6%2C8.6%20c3.1%2C3.1%2C7.8%2C3.9%2C11.7%2C1.9l56.8-28.4c18.3-8.9%2C34.6-21%2C49-35.4l164.5-164.5L228.951%2C196.59z%22%3E%3C%2Fpath%3E%20%3Cpath%20d%3D%22M467.751%2C21.99c-29.2-29.2-77-29.2-106.2%2C0l-73.9%2C73.9l106.2%2C106.2l73.9-73.9C497.251%2C98.59%2C497.251%2C51.09%2C467.751%2C21.99%20z%22%3E%3C%2Fpath%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%20%3C%2Fg%3E%3C%2Fsvg%3E';
    #copyIcon = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z" fill="#ffffff"></path> </g></svg>';
    #color_formats = ['hex', 'rgb', 'hsl'];
    constructor() {
        this.color = xcolor.getXcolor("#ff0000");
        this.#createColorPicker();

        //return this.colorPickerDialog;
    }

    show(x, y, f, cf) {
        Object.assign(this.colorPickerDialog.style, {
            top: y + "px",
            left: x + "px",
            visibility: "visible"
        });
        this.f = f;
        this.colorFormat = (cf!==undefined && this.#color_formats.includes(cf)) ? cf : 'hex';
        this.colorPickerDialog.show();
    }

    #calculateWheelColor(event) {
        var cx = 90;
        var cy = 90;
        var radius = 90;

        var x = event.layerX - cx;
        var y = event.layerY - cy;
        var theta = Math.atan2(y, x);

        var angle = Math.round((theta * 180 / Math.PI + 360) % 360);
        var distance = Math.sqrt(x * x + y * y);

        return { angle: angle, distance: distance };
    }

    #updateForm() {
        this.rgbRgbInput.value = this.color.getRgbString();
        this.hexHexInput.value = this.color.getHexString();
        this.hsbHsbInput.value = this.color.getHsbString();
        this.hslHslInput.value = this.color.getHslString();
    }

    #updatePickers() {
        this.colorSelPanel.style.background = this.color.getRgbString();

        this.rgbHueSliderCircleOut.style.left = Math.max(0, Math.min(150, map(this.color.hsb.h, 0, 360, 0, 150))) + "px";

        this.rgbSaturationSliderCircleOut.style.left = Math.max(0, Math.min(150, map(this.color.hsb.s, 0, 100, 0, 150))) + "px";
        this.rgbSaturationSlider02.style.background = "linear-gradient(to right, rgb(0, 0, 0) 0%, " + this.color.getRgbString() + " 100%)";

        this.rgbBrightSliderCircleOut.style.left = Math.max(0, Math.min(150, map(this.color.hsb.b, 0, 100, 0, 150))) + "px";
        this.rgbBrightSlider02.style.background = "linear-gradient(to right, rgb(255, 255, 255) 0%, " + this.color.getRgbString() + " 100%)";
    }

    #createColorPicker() {
        let _self = this;

        this.colorPickerDialog = document.createElement("dialog");
        this.colorPickerDialog.id = "favDialog";
        Object.assign(this.colorPickerDialog.style, {
            width: '672px',
            height: '672px',
            padding: '0px',
            border: '0px',
            margin: '0px',
            visibility: "hidden",
            backgroundColor: 'transparent'
        });
        this.colorPickerDialog.onclose = function (event) { 
            if (_self.colorPickerDialog.returnValue != "") {
                _self.f.call(null, _self.colorPickerDialog.returnValue);
            }
        }
        document.body.appendChild(this.colorPickerDialog);

        //////// COLOR PICKER PANEL ////////////////////////////////
        this.colorPickerPanel = document.createElement("div");
        Object.assign(this.colorPickerPanel.style, {
            position: "absolute",
            top: "10px",
            left: "10px"
        });
        this.colorPickerDialog.appendChild(this.colorPickerPanel);

        this.closeButtonPanel = document.createElement("div");
        Object.assign(this.closeButtonPanel.style, {
            position: 'absolute',
            top: '140px',
            left: '10px',
            width: '30px',
            height: '30px',
            borderRadius: '50%',
            backgroundColor: 'rgb(0, 0, 0)'
        });
        this.closeButtonPanel.appendChild(this.#crateCloseButton());
        this.colorPickerPanel.appendChild(this.closeButtonPanel);

        this.formPanel = document.createElement("div");
        Object.assign(this.formPanel.style, {
            position: "absolute",
            top: "160px",
            left: "30px",
            width: "280px",
            height: "280px",
            borderRadius: "10px",
            backgroundColor: "#000"
        });
        this.formPanel.appendChild(this.#createForm());
        this.colorPickerPanel.appendChild(this.formPanel);

        //////// CMD PANEL ////////////////////////////////
        this.cmdPanel = document.createElement("div");
        Object.assign(this.cmdPanel.style, {
            width: "260px",
            height: "40px",
            alignContent: "end"
        });

        this.cmdAcceptBtn = document.createElement("button");
        Object.assign(this.cmdAcceptBtn.style, {
            float: "right",
            color: "#fff",
            backgroundColor: "#000",
            border: "2px solid #fff",
            borderRadius: "4px"
        });
        this.cmdAcceptBtn.innerText = "Accept";
        this.cmdAcceptBtn.onclick = function () {
            this.focus();
            _self.colorPickerDialog.returnValue = ( this.colorFormat=="hsl")?_self.color.getHslString():( this.colorFormat=="rgb")?_self.color.getRgbString():_self.color.getHexString();
            _self.colorPickerDialog.close();
        }

        this.cmdPanel.appendChild(this.cmdAcceptBtn);
        this.formPanel.appendChild(this.cmdPanel);

        //////// WHEEL PANEL ////////////////////////////////
        this.wheelPanel = document.createElement("div");
        Object.assign(this.wheelPanel.style, {
            position: "absolute",
            top: "10px",
            left: "280px",
            width: "200px",
            height: "200px",
            borderRadius: "50%",
            backgroundColor: "#000"
        });
        this.colorPickerPanel.appendChild(this.wheelPanel);

        //////// RGB WHEEL PANEL ////////////////////////////////
        this.rgbWheelPanel = document.createElement("div");
        this.rgbWheelPanel.className = "IroWheel";
        Object.assign(this.rgbWheelPanel.style, {
            width: '180px',
            height: '180px',
            position: 'relative',
            left: '9px',
            top: '9px',
            overflow: 'hidden',
            display: 'block',
            borderRadius: '50%',
            backgroundColor: this.color.getRgbString(),
            border: '2px solid white'
        });
        this.rgbWheelPanel.onmouseover = function (event) {
            this.style.cursor = "url(\"data:image/svg+xml," + _self.#dropIcon + "\") 0 0, pointer";
        };
        this.rgbWheelPanel.onclick = function (event) {
            if (event.target.className == "") return;
            let x = event.layerX - 13;
            let y = event.layerY - 13;

            /* _self.rgbWheelSliderCircleOut.style.left = x + "px";
            _self.rgbWheelSliderCircleOut.style.top = y + "px";
            */
            _self.rgbSaturationSliderCircleOut.style.left = Math.max(0, Math.min(150, (map(x, 0, 200, 0, 150)))) + "px";
            _self.rgbBrightSliderCircleOut.style.left = Math.max(0, Math.min(150, map(y, 0, 200, 150, 0))) + "px";

            _self.color = xcolor.getHsb(_self.color.hsb.h, map(parseInt(_self.rgbSaturationSliderCircleOut.style.left), 0, 150, 0, 100), map(parseInt(_self.rgbBrightSliderCircleOut.style.left), 0, 150, 0, 100));
            _self.#updateForm();
            _self.#updatePickers();
        };

        /* this.rgbWheelSliderCircleOut = this.#createCircle(250, 161);
        this.rgbWheelSliderCircleOut.style.zIndex = "9000";

        this.rgbWheelPanel.appendChild(this.rgbWheelSliderCircleOut); */

        this.rgbWheelLight = document.createElement("div");
        this.rgbWheelLight.className = "IroWheelSat";
        Object.assign(this.rgbWheelLight.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "180px",
            height: "180px",
            boxSizing: "border-box",
            borderRadius: "50%",
            background: "linear-gradient(to right, rgb(255, 255, 255) 0%, rgba(255, 255, 255, 0) 100%)"
        });
        this.rgbWheelPanel.appendChild(this.rgbWheelLight);

        this.rgbWheelSat = document.createElement("div");
        this.rgbWheelSat.className = "IroWheelSaturation";
        Object.assign(this.rgbWheelSat.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "180px",
            height: "180px",
            boxSizing: "border-box",
            borderRadius: "50%",
            background: "linear-gradient(transparent 0%, rgb(0, 0, 0) 100%)"
        });
        this.rgbWheelPanel.appendChild(this.rgbWheelSat);

        this.wheelPanel.appendChild(this.rgbWheelPanel);

        //////// HSB WHEEL PANEL ////////////////////////////////
        this.hsbWheelPanel = document.createElement("div");
        this.hsbWheelPanel.className = "IroWheel";
        Object.assign(this.hsbWheelPanel.style, {
            display: 'none',
            width: '180px',
            height: '180px',
            position: 'relative',
            left: '9px',
            top: '9px',
            overflow: 'hidden',
            borderRadius: '50%',
            border: '2px solid white'
        });
        this.hsbWheelPanel.onmouseover = function (event) {
            this.style.cursor = "url(\"data:image/svg+xml," + _self.#dropIcon + "\") 0 0, pointer";
        };
        this.hsbWheelPanel.onclick = function (event) {
            if (event.target.className == "") return;
            let data = _self.#calculateWheelColor(event);
           /*  _self.rgbHueSliderCircleOut.style.left = event.layerX - 13 + "px";
            _self.rgbHueSliderCircleOut.style.top = event.layerY - 13 + "px";
 */
            _self.rgbHueSliderCircleOut.style.left = Math.max(0, Math.min(150, (map(data.angle, 0, 360, 0, 150)))) + "px";
            //.rgbSaturationSliderCircleOut.style.left = Math.max(0, Math.min(150, (map(data.angle, 0, 360, 0, 150)))) + "px";
            _self.rgbBrightSliderCircleOut.style.left = Math.max(0, Math.min(150, map(data.distance, 0, 88, 0, 150))) + "px";

            _self.color = xcolor.getHsl(data.angle, _self.color.hsl.s, map(data.distance, 0, 88, 0, 100));
            _self.#updateForm();
            _self.#updatePickers();
        };

        /* this.hsbWheelSliderCircleOut = this.#createCircle(250, 161);
        this.hsbWheelSliderCircleOut.style.zIndex = "9000";

        this.hsbWheelPanel.appendChild(this.hsbWheelSliderCircleOut); */

        this.hsbWheelHue = document.createElement("div");
        this.hsbWheelHue.className = "IroWheelSat";
        Object.assign(this.hsbWheelHue.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "180px",
            height: "180px",
            boxSizing: "border-box",
            borderRadius: "50%",
            transform: "rotateZ(90deg)",
            background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)"
        });
        this.hsbWheelPanel.appendChild(this.hsbWheelHue);

        this.hsbWheelSat = document.createElement("div");
        this.hsbWheelSat.className = "IroWheelSaturation";
        Object.assign(this.hsbWheelSat.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "180px",
            height: "180px",
            boxSizing: "border-box",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(0,0,0,0.5) 10%, transparent 20%, transparent 40%, rgba(255,255,255,0.9) 80%, rgba(255,255,255,1) 100%)"
        });
        this.hsbWheelPanel.appendChild(this.hsbWheelSat);

        this.wheelPanel.appendChild(this.hsbWheelPanel);
        /////////////////////////////////////////////////////
        this.colorSelPanel = document.createElement("div");
        Object.assign(this.colorSelPanel.style, {
            position: "absolute",
            top: "0px",
            left: "300px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#f00",
            border: '4px solid #000'
        });
        this.colorPickerPanel.appendChild(this.colorSelPanel);
        /////////////////////////////////////////////////////
        this.rgbModeBtnPanel = document.createElement("div");
        Object.assign(this.rgbModeBtnPanel.style, {
            position: "absolute",
            top: "60px",
            left: "474px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#000",
            border: '2px solid red'
        });
        this.rgbModeBtnPanel.appendChild(this.#createRgbButton());
        this.colorPickerPanel.appendChild(this.rgbModeBtnPanel);

        this.hsbModeBtnPanel = document.createElement("div");
        Object.assign(this.hsbModeBtnPanel.style, {
            position: "absolute",
            top: "100px",
            left: "479px",
            width: "30px",
            height: "30px",
            borderRadius: "50%",
            backgroundColor: "#000"
        });
        this.hsbModeBtnPanel.appendChild(this.#createHsbButton());
        this.colorPickerPanel.appendChild(this.hsbModeBtnPanel);
        /////////////////////////////////////////////////////
        this.hueSliderPanel = document.createElement("div");
        Object.assign(this.hueSliderPanel.style, {
            position: "absolute",
            top: "250px",
            left: "310px",
            width: "180px",
            height: "30px",
            borderRadius: "15px",
            backgroundColor: "#000"
        });
        this.hueSliderPanel.appendChild(this.#createHueSlider());
        this.colorPickerPanel.appendChild(this.hueSliderPanel);

        this.satSliderPanel = document.createElement("div");
        Object.assign(this.satSliderPanel.style, {
            position: "absolute",
            top: "300px",
            left: "310px",
            width: "180px",
            height: "30px",
            borderRadius: "15px",
            backgroundColor: "#000"
        });
        this.satSliderPanel.appendChild(this.#createSatSlider());
        this.colorPickerPanel.appendChild(this.satSliderPanel);

        this.briSliderPanel = document.createElement("div");
        Object.assign(this.briSliderPanel.style, {
            position: "absolute",
            top: "350px",
            left: "310px",
            width: "180px",
            height: "30px",
            borderRadius: "15px",
            backgroundColor: "#000"
        });
        this.briSliderPanel.appendChild(this.#createBrightSlider());
        this.colorPickerPanel.appendChild(this.briSliderPanel);
    }

    #crateCloseButton() {
        let _self = this;
        let _closeButton = document.createElement("button");
        _closeButton.type = "button";
        Object.assign(_closeButton.style, {
            width: '24px',
            height: '24px',
            padding: '0px',
            backgroundColor: 'rgb(0, 0, 0)',
            color: 'rgb(255, 255, 255)',
            border: '0px',
            borderRadius: '50%',
            marginTop: '3px',
            marginLeft: '3px',
            cursor: "pointer"
        });
        _closeButton.innerHTML = this.#closeIcon;
        _closeButton.onclick = function () {
            //this.colorPickerPanel.style.visibility = 'hidden';
            _self.colorPickerDialog.close();
        }
        return _closeButton;
    }

    #createRgbButton() {
        let _self = this;

        this.rgbButton = document.createElement("button");
        Object.assign(this.rgbButton.style, {
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            left: "2px",
            position: "absolute",
            top: "2px",
            backgroundColor: "#000",
            cursor: "pointer"
        });

        var rgbRedBar = document.createElement("div");
        Object.assign(rgbRedBar.style, {
            position: "absolute",
            left: "4px",
            top: "4px",
            height: "15px",
            width: "4px",
            backgroundColor: "red"
        });
        this.rgbButton.appendChild(rgbRedBar);

        var rgbGreenBar = document.createElement("div");
        Object.assign(rgbGreenBar.style, {
            position: "absolute",
            left: "10px",
            top: "4px",
            height: "15px",
            width: "4px",
            backgroundColor: "#2fba2f"
        });
        this.rgbButton.appendChild(rgbGreenBar);

        var rgbBlueBar = document.createElement("div");
        Object.assign(rgbBlueBar.style, {
            position: "absolute",
            left: "16px",
            top: "4px",
            height: "15px",
            width: "4px",
            backgroundColor: "#0090ff"
        });
        this.rgbButton.appendChild(rgbBlueBar);

        this.rgbButton.onclick = function () {
            _self.rgbWheelPanel.style.display = 'block';
            _self.hsbWheelPanel.style.display = 'none';
            _self.rgbModeBtnPanel.style.border = '2px solid #f00';
            _self.hsbModeBtnPanel.style.border = '2px solid #000';
        }

        return this.rgbButton;
    }

    #createHsbButton() {
        let _self = this;

        this.hsbButton = document.createElement("button");
        Object.assign(this.hsbButton.style, {
            width: "26px",
            height: "26px",
            borderRadius: "50%",
            left: "2px",
            position: "absolute",
            top: "2px",
            backgroundColor: "rgb(0, 0, 0)",
            padding: "0px",
            overflow: "hidden",
            cursor: "pointer"
        });

        var hsbButtonPanel = document.createElement("div");
        hsbButtonPanel.className = "IroWheel";
        Object.assign(hsbButtonPanel.style, {
            width: "26px",
            height: "26px",
            position: "absolute",
            overflow: "hidden",
            display: "block",
            left: "-3px",
            top: "-3px",
            borderRadius: "50%"
        });

        var hsbBtnHue = document.createElement("div");
        hsbBtnHue.className = "IroWheelHue";
        Object.assign(hsbBtnHue.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxSizing: "border-box",
            transform: "rotateZ(90deg)",
            background: "conic-gradient(red, yellow, lime, aqua, blue, magenta, red)"
        });
        hsbButtonPanel.appendChild(hsbBtnHue);

        var hsbBtnSat = document.createElement("div");
        hsbBtnSat.className = "IroWheelSaturation";
        Object.assign(hsbBtnSat.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            boxSizing: "border-box",
            background: "radial-gradient(circle, rgb(0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 10%, transparent 20%, transparent 40%, rgba(255, 255, 255, 0.9) 80%, rgb(255, 255, 255) 100%)"
        });
        hsbButtonPanel.appendChild(hsbBtnSat);

        this.hsbButton.appendChild(hsbButtonPanel);

        this.hsbButton.onclick = function () {
            _self.rgbWheelPanel.style.display = 'none';
            _self.hsbWheelPanel.style.display = 'block';
            _self.hsbModeBtnPanel.style.border = '2px solid #f00';
            _self.rgbModeBtnPanel.style.border = '2px solid #000';
        }

        return this.hsbButton;
    }

    #createSlider() {
        let slider01 = document.createElement("div");
        slider01.className = "IroSlider";
        Object.assign(slider01.style, {
            position: "relative",
            width: "176px",
            height: "26px",
            borderRadius: "50%",
            overflow: "visible",
            display: "block",
            marginTop: '2px',
            marginLeft: '2px'
        });

        let slider02 = document.createElement("div");
        slider02.className = "IroSliderGradient";
        Object.assign(slider02.style, {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            borderRadius: "22px",
            boxSizing: "border-box"
        })

        return { slider01: slider01, slider02: slider02 };
    }

    #createCircle(left, top) {
        let _circleOut = document.createElement("div");
        Object.assign(_circleOut.style, {
            border: '2px solid rgb(68, 68, 68)',
            borderRadius: '13px',
            willChange: 'transform',
            top: top + 'px',
            left: left + 'px',
            width: '22px',
            height: '22px',
            position: 'absolute',
            overflow: 'visible',
            zIndex: '9000',
            cursor: "pointer"
        });

        let _circleIn = document.createElement("div");
        Object.assign(_circleIn.style, {
            border: '2px solid rgb(255, 255, 255)',
            borderRadius: '12px',
            top: '0px',
            left: '0px',
            width: '18px',
            height: '18px',
            position: 'absolute',
            overflow: 'visible'
        });

        _circleOut.appendChild(_circleIn);
        return _circleOut;
    }

    #createInputColorElm(id, type, label, value, params = {}) {
        const labelsStyle = {
            fontFamily: 'monospace',
            fontSize: '1.2em',
            color: '#ffffff'
        };
        const inputsStyle = {
            width: '160px',
            fontFamily: 'monospace',
            fontSize: '1.2em',
            marginBottom: '10px',
            textAlign: 'left',
            marginTop: '10px',
            backgroundColor: '#000',
            color: '#fff',
            border: '2px solid #fff',
            borderRadius: '4px'
        };
        let inputColorElmForm = document.createElement("div");
        Object.assign(inputColorElmForm.style, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
        });

        let inputColorElmLabel = document.createElement("label");
        inputColorElmLabel.for = id;
        inputColorElmLabel.innerText = label;
        Object.assign(inputColorElmLabel.style, labelsStyle);

        let inputColorElm = document.createElement("input");
        inputColorElm.id = id;
        inputColorElm.type = type;
        inputColorElm.value = value;
        inputColorElm.min = params.min || "0";
        inputColorElm.max = params.max || "100";
        Object.assign(inputColorElm.style, inputsStyle);
        if (params.style !== undefined && typeof params.style === 'object') {
            Object.assign(inputColorElm.style, params.style);
        }

        return { form: inputColorElmForm, label: inputColorElmLabel, input: inputColorElm };
    }

    #createCopyButton(copyElm) {
        let _copyButton = document.createElement("button");
        _copyButton.type = "button";
        Object.assign(_copyButton.style, {
            width: '24px',
            height: '24px',
            padding: '0px',
            backgroundColor: '#000000',
            border: '2px solid #ffffff',
            borderRadius: '4px',
            cursor: "pointer"
        });
        _copyButton.innerHTML = this.#copyIcon;
        _copyButton.onclick = function () {
            navigator.clipboard.writeText(copyElm.value);
        }
        return _copyButton;
    }

    #createForm() {
        let _self = this;

        this.formCont = document.createElement("div");
        Object.assign(this.formCont.style, {
            margin: "20px"
        });

        // rgb
        let _rgbRgbForm = this.#createInputColorElm("rgbRgb", "text", "RGB", this.color.getRgbString(), { style: { width: '160px', marginTop: '10px', textAlign: 'left' } });
        this.rgbRgbForm = _rgbRgbForm.form;
        this.rgbRgbLabel = _rgbRgbForm.label;
        this.rgbRgbInput = _rgbRgbForm.input;
        this.rgbRgbInput.onchange = function () {
            _self.color = xcolor.getXcolor(this.value);
            _self.rgbWheelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.colorSelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.#updateForm();
            _self.#updatePickers();
        }
        this.copyIconRgb = this.#createCopyButton(this.rgbRgbInput);
        this.rgbRgbForm.appendChild(this.rgbRgbLabel);
        this.rgbRgbForm.appendChild(this.rgbRgbInput);
        this.rgbRgbForm.appendChild(this.copyIconRgb);

        // hex
        let _hexHexForm = this.#createInputColorElm("hexHex", "text", "HEX", this.color.getHexString(), { style: { width: '160px', marginTop: '10px', textAlign: 'left' } });
        this.hexHexForm = _hexHexForm.form;
        this.hexHexLabel = _hexHexForm.label;
        this.hexHexInput = _hexHexForm.input;
        this.hexHexInput.onchange = function () {
            this.value = this.value.toUpperCase();
            _self.color = xcolor.getXcolor(this.value);
            _self.rgbWheelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.colorSelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.#updateForm();
            _self.#updatePickers();
        }
        this.copyIconHex = this.#createCopyButton(this.hexHexInput);
        this.hexHexForm.appendChild(this.hexHexLabel);
        this.hexHexForm.appendChild(this.hexHexInput);
        this.hexHexForm.appendChild(this.copyIconHex);

        // hsl
        let _hslHslForm = this.#createInputColorElm("hslHsl", "text", "HSL", this.color.getHslString(), { style: { width: '160px', marginTop: '10px', textAlign: 'left' } });
        this.hslHslForm = _hslHslForm.form;
        this.hslHslLabel = _hslHslForm.label;
        this.hslHslInput = _hslHslForm.input;
        this.hslHslInput.onchange = function () {
            _self.color = xcolor.getXcolor(this.value);
            _self.rgbWheelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.colorSelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.#updateForm();
            _self.#updatePickers();
        }
        this.copyIconHsl = this.#createCopyButton(this.hslHslInput);
        this.hslHslForm.appendChild(this.hslHslLabel);
        this.hslHslForm.appendChild(this.hslHslInput);
        this.hslHslForm.appendChild(this.copyIconHsl);

        //hsb
        let _hsbHsbForm = this.#createInputColorElm("hsbHsb", "text", "HSB", this.color.getHsbString(), { style: { width: '160px', marginTop: '10px', textAlign: 'left' } });
        this.hsbHsbForm = _hsbHsbForm.form;
        this.hsbHsbLabel = _hsbHsbForm.label;
        this.hsbHsbInput = _hsbHsbForm.input;
        this.hsbHsbInput.onchange = function () {
            _self.color = xcolor.getXcolor(this.value);
            _self.rgbWheelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.colorSelPanel.style.backgroundColor = _self.color.getRgbString();
            _self.#updateForm();
            _self.#updatePickers();
        }
        this.copyIconHsb = this.#createCopyButton(this.hsbHsbInput);
        this.hsbHsbForm.appendChild(this.hsbHsbLabel);
        this.hsbHsbForm.appendChild(this.hsbHsbInput);
        this.hsbHsbForm.appendChild(this.copyIconHsb);

        this.formCont.appendChild(this.rgbRgbForm);
        this.formCont.appendChild(this.hexHexForm);
        this.formCont.appendChild(this.hslHslForm);
        this.formCont.appendChild(this.hsbHsbForm);

        return this.formCont;
    }

    #createHueSlider() {
        let _self = this;

        let hueSlider = this.#createSlider();
        this.rgbHueSlider01 = hueSlider.slider01;
        this.rgbHueSlider01.style.background = "conic-gradient(rgb(204, 204, 204) 25%, rgb(255, 255, 255) 0deg, rgb(255, 255, 255) 50%, rgb(204, 204, 204) 0deg, rgb(204, 204, 204) 75%, rgb(255, 255, 255) 0deg) 0% 0% / 8px 8px";

        this.rgbHueSlider02 = hueSlider.slider02;
        this.rgbHueSlider02.style.background = "linear-gradient(to right, rgb(255, 0, 0) 0%, rgb(255, 255, 0) 16.666%, rgb(0, 255, 0) 33.333%, rgb(0, 255, 255) 50%, rgb(0, 0, 255) 66.666%, rgb(255, 0, 255) 83.333%, rgb(255, 0, 0) 100%)";
        this.rgbHueSlider02.onclick = function (e) {
            let newleft = e.layerX - 13;
            _self.rgbHueSliderCircleOut.style.left = newleft + "px";
            _self.color = xcolor.getHsb(map(newleft, 0, 150, 0, 360), _self.color.hsb.s, _self.color.hsb.b);
            _self.rgbWheelPanel.style.backgroundColor = xcolor.getHsb(_self.color.hsb.h, 100, 100).getRgbString();
            _self.colorSelPanel.style.backgroundColor = xcolor.getHsb(_self.color.hsb.h, 100, 100).getRgbString();
            _self.#updateForm();
            _self.#updatePickers();
        }

        this.rgbHueSliderCircleOut = this.#createCircle(150, 0);
        this.rgbHueSliderCircleOut.onmousedown = function (e) {
            this.isDragging = true;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
            this.initDragPosition = { x: e.clientX, y: e.clientY };
        };
        this.rgbHueSliderCircleOut.onmousemove = function (e) {
            if (this.isDragging) {
                let newleft = (e.clientX > this.initDragPosition.x) ? this.initialPosition.x + (e.clientX - this.initDragPosition.x) : this.initialPosition.x - (this.initDragPosition.x - e.clientX);
                newleft = Math.max(0, Math.min(150, newleft));
                this.style.left = newleft + "px";

                _self.color = xcolor.getHsb(map(parseInt(this.style.left), 0, 150, 0, 360), _self.color.hsb.s, _self.color.hsb.b);
                _self.rgbWheelPanel.style.backgroundColor = xcolor.getHsb(_self.color.hsb.h, 100, 100).getRgbString();
                _self.colorSelPanel.style.backgroundColor = xcolor.getHsb(_self.color.hsb.h, 100, 100).getRgbString();
                _self.#updateForm();
                _self.#updatePickers();
            }
        }
        this.rgbHueSliderCircleOut.onmouseup = function (e) {
            this.isDragging = false;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
        };

        this.rgbHueSlider01.appendChild(this.rgbHueSliderCircleOut);

        this.rgbHueSlider01.appendChild(this.rgbHueSlider02);

        return this.rgbHueSlider01;
    }

    #createSatSlider() {
        let _self = this;

        let satSlider = this.#createSlider();
        this.rgbSaturationSlider01 = satSlider.slider01;
        this.rgbSaturationSlider01.style.background = "conic-gradient(rgb(204, 204, 204) 25%, rgb(255, 255, 255) 0deg, rgb(255, 255, 255) 50%, rgb(204, 204, 204) 0deg, rgb(204, 204, 204) 75%, rgb(255, 255, 255) 0deg) 0% 0% / 8px 8px";//"conic-gradient(rgb(204, 204, 204) 25%, rgb(255, 255, 255) 0deg, rgb(255, 255, 255) 50%, rgb(204, 204, 204) 0deg, rgb(204, 204, 204) 75%, rgb(255, 255, 255) 0deg) 0% 0% / 8px 8px";

        this.rgbSaturationSlider02 = satSlider.slider02;
        this.rgbSaturationSlider02.style.background = "linear-gradient(to right, rgb(0, 0, 0) 0%, " + this.color.getRgbString() + " 100%)";
        this.rgbSaturationSlider02.onclick = function (e) {
            let newleft = e.layerX - 13;
            _self.rgbSaturationSliderCircleOut.style.left = newleft + "px";
            _self.color = xcolor.getHsb(_self.color.hsb.h, map(newleft, 0, 150, 0, 100), _self.color.hsb.b);
            _self.#updateForm();
            _self.#updatePickers();
        }

        this.rgbSaturationSliderCircleOut = this.#createCircle(150, 0);
        this.rgbSaturationSliderCircleOut.onmousedown = function (e) {
            this.isDragging = true;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
            this.initDragPosition = { x: e.clientX, y: e.clientY };
        };
        this.rgbSaturationSliderCircleOut.onmousemove = function (e) {
            if (this.isDragging) {
                let newleft = (e.clientX > this.initDragPosition.x) ? this.initialPosition.x + (e.clientX - this.initDragPosition.x) : this.initialPosition.x - (this.initDragPosition.x - e.clientX);
                newleft = Math.max(0, Math.min(150, newleft));
                this.style.left = newleft + "px";

                _self.color = xcolor.getHsb(_self.color.hsb.h, map(parseInt(this.style.left), 0, 150, 0, 100), _self.color.hsb.b);
                _self.#updateForm();
                _self.#updatePickers();
            }
        }
        this.rgbSaturationSliderCircleOut.onmouseup = function (e) {
            this.isDragging = false;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
        };

        this.rgbSaturationSlider01.appendChild(this.rgbSaturationSliderCircleOut);

        this.rgbSaturationSlider01.appendChild(this.rgbSaturationSlider02);

        return this.rgbSaturationSlider01;
    }

    #createBrightSlider() {
        let _self = this;

        let brightSlider = this.#createSlider();
        this.rgbBrightSlider01 = brightSlider.slider01;
        this.rgbBrightSlider01.style.background = "conic-gradient(rgb(204, 204, 204) 25%, rgb(255, 255, 255) 0deg, rgb(255, 255, 255) 50%, rgb(204, 204, 204) 0deg, rgb(204, 204, 204) 75%, rgb(255, 255, 255) 0deg) 0% 0% / 8px 8px";

        this.rgbBrightSlider02 = brightSlider.slider02;
        this.rgbBrightSlider02.style.background = "linear-gradient(to right, " + this.color.getRgbString() + " 0%, rgb(255, 255, 255) 100%)";
        this.rgbBrightSlider02.onclick = function (e) {
            let newleft = e.layerX - 13;
            _self.rgbbrightSliderCircleOut.style.left = newleft + "px";
            _self.color = xcolor.getHsb(_self.color.hsb.h, _self.color.hsb.s, map(newleft, 0, 150, 0, 100));
            _self.#updateForm();
            _self.#updatePickers();
        }

        this.rgbBrightSliderCircleOut = this.#createCircle(150, 0);
        this.rgbBrightSliderCircleOut.onmousedown = function (e) {
            this.isDragging = true;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
            this.initDragPosition = { x: e.clientX, y: e.clientY };
        };
        this.rgbBrightSliderCircleOut.onmousemove = function (e) {
            if (this.isDragging) {
                let newleft = (e.clientX > this.initDragPosition.x) ? this.initialPosition.x + (e.clientX - this.initDragPosition.x) : this.initialPosition.x - (this.initDragPosition.x - e.clientX);
                newleft = Math.max(0, Math.min(150, newleft));
                this.style.left = newleft + "px";

                _self.color = xcolor.getHsb(_self.color.hsb.h, _self.color.hsb.s, map(parseInt(this.style.left), 0, 150, 0, 100));
                _self.#updateForm();
                _self.#updatePickers();
            }
        }
        this.rgbBrightSliderCircleOut.onmouseup = function (e) {
            this.isDragging = false;
            this.initialPosition = { x: parseInt(this.style.left), y: parseInt(this.style.top) };
        };

        this.rgbBrightSlider01.appendChild(this.rgbBrightSliderCircleOut);

        this.rgbBrightSlider01.appendChild(this.rgbBrightSlider02);

        return this.rgbBrightSlider01;
    }
}
