//letter definitions 5x7
const letters = {
    'a': [[0, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [0, 1, 1, 1, 1, 1, 1]],
    'b': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 1, 0]],
    'c': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1]],
    'd': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [0, 1, 1, 1, 1, 1, 0]],
    'e': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1]],
    'f': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0]],
    'g': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 1, 0, 1], [1, 0, 0, 0, 1, 1, 1]],
    'h': [[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]],
    'i': [[0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0]],
    'j': [[0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 0]],
    'k': [[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 1, 0, 0], [1, 1, 0, 0, 0, 1, 1]],
    'l': [[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1]],
    'm': [[1, 1, 1, 1, 1, 1, 1], [0, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]],
    'n': [[1, 1, 1, 1, 1, 1, 1], [0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1]],
    'o': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [0, 1, 1, 1, 1, 1, 0]],
    'p': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [0, 1, 1, 0, 0, 0, 0]],
    'q': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 0, 0, 1, 0], [0, 1, 1, 1, 1, 0, 1]],
    'r': [[1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 0, 1, 1, 0, 0], [0, 1, 1, 1, 0, 1, 1]],
    's': [[0, 1, 1, 0, 0, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 0, 0, 1, 1, 0]],
    't': [[1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 0]],
    'u': [[1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 0]],
    'v': [[1, 1, 1, 1, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 0], [1, 1, 1, 1, 1, 0, 0]],
    'w': [[1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 0, 0, 1, 0], [1, 1, 1, 1, 1, 1, 1]],
    'x': [[1, 1, 0, 0, 0, 1, 1], [0, 0, 1, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 1, 0, 0], [1, 1, 0, 0, 0, 1, 1]],
    'y': [[1, 1, 0, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 1, 1, 1], [0, 0, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]],
    'z': [[1, 0, 0, 0, 0, 1, 1], [1, 0, 0, 0, 1, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 1, 0, 0, 0, 1], [1, 1, 0, 0, 0, 0, 1]],
    ' ': [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
    '.': [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0]],
    ':': [[0, 0, 0, 0, 0, 0, 0], [0, 0, 1, 0, 1, 0, 0], [0, 0, 0, 0, 0, 0, 0]],
    ',': [[0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 1, 0], [0, 0, 0, 0, 0, 0, 0]],
    '-': [[0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0]],
    '_': [[0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1]],
    '/': [[0, 0, 0, 0, 0, 1, 1], [0, 0, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]],
    '|': [[0, 0, 0, 0, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 0]],
    '(': [[0, 0, 1, 1, 1, 0, 0], [0, 1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1]],
    ')': [[1, 0, 0, 0, 0, 0, 1], [0, 1, 0, 0, 0, 1, 0], [0, 0, 1, 1, 1, 0, 0]],
    '[': [[1,1,1,1,1,1,1],[1,0,0,0,0,0,1]],
    ']': [[1,0,0,0,0,0,1],[1,1,1,1,1,1,1]],
    '#': [[0, 0, 1, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 1, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1, 1], [0, 0, 1, 0, 1, 0, 0]],
    '@': [[0, 0, 1, 1, 1, 0, 0], [0, 1, 0, 0, 0, 1, 0], [1, 0, 1, 1, 1, 0, 1], [1, 0, 1, 0, 1, 0, 1], [1, 0, 1, 1, 1, 0, 1], [0, 1, 0, 0, 1, 0, 1], [0, 0, 1, 1, 0, 0, 0]],
    '%': [[1, 1, 0, 0, 0, 1, 1], [1, 1, 0, 0, 1, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 1, 0, 0, 1, 1], [1, 1, 0, 0, 0, 1, 1]],
    '&': [[0, 1, 1, 0, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 1, 0, 1], [0, 1, 1, 0, 0, 1, 0], [0, 0, 0, 0, 1, 0, 1]],
    '0': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 0, 1, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 1, 0, 0, 0, 1], [0, 1, 1, 1, 1, 1, 0]],
    '1': [[0, 0, 0, 0, 0, 0, 0], [0, 1, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0]],
    '2': [[0, 1, 0, 0, 0, 1, 1], [1, 0, 0, 0, 1, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 0, 0, 1]],
    '3': [[0, 1, 0, 0, 0, 1, 0], [1, 0, 0, 0, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 1, 0]],
    '4': [[1, 1, 1, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0], [1, 1, 1, 1, 1, 1, 1]],
    '5': [[1, 1, 1, 1, 0, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 0, 1, 1, 0]],
    '6': [[0, 1, 1, 1, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 0, 0, 0, 1, 1, 0]],
    '7': [[1, 0, 0, 0, 0, 1, 1], [1, 0, 0, 0, 1, 0, 0], [1, 0, 0, 1, 0, 0, 0], [1, 0, 1, 0, 0, 0, 0], [1, 1, 0, 0, 0, 0, 0]],
    '8': [[0, 1, 1, 0, 1, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 0, 1, 1, 0]],
    '9': [[0, 1, 1, 0, 0, 0, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 1, 1, 1, 1, 0]],
    '♥': [[0, 1, 1, 1, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 0, 0, 0]],
    '☺': [[0, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 0, 1, 1], [1, 1, 0, 1, 1, 0, 1], [1, 1, 1, 1, 1, 0, 1], [1, 1, 0, 1, 1, 0, 1], [1, 1, 1, 1, 0, 1, 1], [0, 1, 1, 1, 1, 1, 0]],
    '♦': [[0, 0, 0, 0, 0, 0, 0], [1, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 1], [1, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 0, 0, 0], [1, 1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 1, 1, 0], [0, 1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1, 0], [1, 1, 1, 1, 1, 0, 0], [0, 1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [0, 0, 0, 0, 0, 0, 1], [1, 1, 1, 1, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0], [0, 1, 1, 0, 0, 1, 0], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [1, 0, 0, 1, 0, 0, 1], [0, 1, 0, 0, 1, 1, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0, 0]]

};

const Array2D = (r, c) => [...Array(r)].map(_ => Array(c).fill(0));

export default class XVirtualLedDisplay {
    #options = {
        'mode': 'production', // 'production' or 'development'
        'inverse_colors': false,
        'callback': null
    };
    constructor(container_, options_) {
        var self = this;
        this.matrix = container_;
        if (options_ !== undefined && typeof (options_) == 'object') {
            Object.assign(this.#options, options_);
        }

        this.rowlength = 7;
        this.collength = 89;

        this.mat = Array2D(this.rowlength, this.collength);
        this.vmat = new Array();

        this.rotationL = 0;
        this.rotationR = 0;

        this.start_index = 0;
        this.end_index = -1;
        this.start_anim_index = 0;

        this.vmatrowlength = 0;

        this.leftOffset = 0;
        this.rightOffset = this.vmatrowlength;

        if (this.#options.mode == 'development') {
            ///draw listeners
            this.isDrawing = false;
            document.addEventListener("mousedown", function (e) {
                if (e.button == 0) {
                    isDrawing = true;
                }
            });

            document.addEventListener("mouseup", function (e) {
                if (e.button == 0) {
                    isDrawing = false;
                }
            });
        }else{
            this.matrix.onclick = function() {
                self.#options.callback();
            };
        }

        this.__led = document.createElement('div');
        this.__led.className = 'led';

        for (var i = 0; i < 7; i++) {
            this.mat[i] = this.newLine();
        }
    }

    newLine() {
        var self = this;
        var line = new Array();
        for (var i = 0; i < this.collength; i++) {
            var led = this.__led.cloneNode();
            if (this.#options.mode == 'development') {
                led.onclick = function() { self.onOff(this) };
                led.onmouseover= function() {
                    if (isDrawing) {
                        this.className = "led";
                    }
                };
            }
            led.className = "led off";
            this.matrix.appendChild(led);
            line[i] = led;
        }
        return line;
    }

    // Tturning on/off
    onOff(led) {
        if (led.className == "led off")
            led.className = "led";
        else
            led.className = "led off";
    }

    write(arr) {
        var i = 0;
        while (i < arr.length) {
            this.mat[arr[i++]][arr[i++]].className = "led";
        }
    }

    drawText(text_, start_index_, end_index_) {
        this.start_index = (start_index_!==undefined && start_index_!=null && start_index_>-1)?start_index_:this.start_index;
        this.end_index = (end_index_!==undefined && end_index_!=null && (end_index_==-1 || end_index_>0))?end_index_:this.end_index;
        if (this.start_index > 0 && (this.end_index != -1 && this.end_index < this.start_index)) {
            alert("End index must be greater than start index or -1(-1==end of text)");
            return;
        }
        if (this.start_index > 0) {
            if (this.end_index == -1) {
                this.vmatrowlength = this.start_index;
            } else {
                this.vmatrowlength = this.start_index;
            }
        } else {
            if (this.end_index == -1) {
                this.vmatrowlength = 0
            } else {
                this.vmatrowlength = this.vmatrowlength;
            }
        }
        var text = text_.toLowerCase();
        text = text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        var textarr = text.split("");

        //set  this.vmat
        if (this.end_index == -1) {
            for (var c = 0; c < textarr.length - 1; c++) {
                var arr = letters[textarr[c]];
                this.vmatrowlength += arr.length;
            }
            this.vmatrowlength += (textarr.length - 1);
        }

        for (var i = 0; i < 7; i++) {
            if (this.start_index > 0) {
                if (this.end_index == -1) {
                    this.vmat[i] = this.vmat[i].slice(0, this.start_index).concat(new Array(this.vmatrowlength + this.start_index).fill(0));
                } else {
                    this.vmat[i] = this.vmat[i].slice(0, this.start_index).concat(new Array(this.end_index - this.start_index).fill(0)).concat(this.vmat[i].slice(this.end_index));
                }
            } else {
                if (this.end_index == -1) {
                    this.vmat[i] = new Array(this.vmatrowlength).fill(0);
                } else {
                    this.vmat[i] = this.vmat[i].slice(0, this.start_index).concat(new Array(this.end_index - this.start_index).fill(0)).concat(this.vmat[i].slice(this.end_index));
                }
            }
        }

        var offset = 0 + this.start_index;
        for (var c = 0; c < textarr.length; c++) {
            var arr = letters[textarr[c]];
            for (var i = 0; i < arr.length; i++) {
                for (var j = 0; j < arr[i].length; j++) {
                    let y = (j * this.collength) % this.collength;
                    let x = i;
                    this.vmat[j][i + offset] = arr[i][j];
                }
            }
            offset += (arr.length + 1);
        }
        this.draw();
    }

    getCoords() {
        var coords = new Array();
        for (var i = 0; i < this.mat.length; i++)
            for (var j = 0; j < this.mat[i].length; j++)
                if (this.mat[i][j].className == "led") {
                    coords.push(i);
                    coords.push(j);
                }
        return coords;
    }

    getCoordsChar(pixels) {
        var coords = Array2D(pixels, 7);
        for (var i = 0; i < this.mat.length; i++)
            for (var j = 0; j < pixels; j++)
                if (this.mat[i][j].className == "led") {
                    coords[j][i] = 1;
                } else {
                    coords[j][i] = 0;
                }
        return JSON.stringify(coords);
    }

    draw() {
        for (var i = 0; i < this.mat.length; i++) {
            var max = (this.end_index == -1) ? (this.mat[i].length - 1) : this.end_index;
            for (var j = 0 + this.start_index; j < max; j++) {
                if(this.#options.inverse_colors){
                    this.mat[i][j].className = (this.vmat[i][j] == 1) ? "led off" : "led";
                }else{
                    this.mat[i][j].className = (this.vmat[i][j] == 1) ? "led" : "led off";
                }
            }
        }
    }

    stop() {
        clearInterval(this.rotationL);
        clearInterval(this.rotationR);
        clearInterval(this.timer);
        this.rotationL = 0;
        this.rotationR = 0;
        this.timer = 0;
    }

    rotate(dir, start_anim_index_) {
        var self = this;
        this.start_anim_index = start_anim_index_ || this.start_anim_index;
        if (dir == "left" && this.rotationL == 0) {
            this.rotationL = setInterval(function () { self.moveLeft() }, 100);
            clearInterval(this.rotationR);
            this.rotationR = 0;
        }
        else if (dir == "right" && this.rotationR == 0) {
            this.rotationR = setInterval(function () { self.moveRight() }, 100);
            clearInterval(this.rotationL);
            this.rotationL = 0;
        }
    }

    moveLeft0() {
        for (var i = 0; i < this.mat.length; i++) {
            var first = this.mat[i][0].className;
            for (var j = 0; j < this.mat[i].length - 1; j++)
                this.mat[i][j].className = this.mat[i][j + 1].className;
            this.mat[i][this.mat[i].length - 1].className = first;
        }
    }

    moveLeft() {
        if (this.vmatrowlength < this.collength) { this.moveLeft0(); return; }

        for (var i = 0; i < this.mat.length; i++) {
            var calcLeftOffset = this.leftOffset + this.start_anim_index;
            for (var j = calcLeftOffset; j < this.mat[i].length + this.leftOffset - 1; j++) {
                if(this.#options.inverse_colors){
                    this.mat[i][(j - this.leftOffset) % this.vmatrowlength].className = (this.vmat[i][((j - this.start_anim_index + 1) % (this.vmatrowlength)) + this.start_anim_index] == 1) ? "led off" : "led";
                }else{
                    this.mat[i][(j - this.leftOffset) % this.vmatrowlength].className = (this.vmat[i][((j - this.start_anim_index + 1) % (this.vmatrowlength)) + this.start_anim_index] == 1) ? "led" : "led off";
                }
            }
        }
        this.leftOffset++;
        if (this.leftOffset >= this.vmatrowlength) {
            this.leftOffset = 0;
        }
    }

    moveRight() {
        if (this.vmatrowlength < this.collength) { this.moveRight0(); return; }

        for (var i = 0; i < this.mat.length; i++) {
            var last = this.vmat[i][vmat[i].length - 1];
            for (var j = this.rightOffset; j < this.mat[i].length + this.rightOffset - 1; j++){
                if(this.#options.inverse_colors){
                    this.mat[i][(j - this.rightOffset) % this.vmatrowlength].className = (this.vmat[i][(j - 1) % this.vmatrowlength] == 1) ? "led off" : "led";
                }else{
                    this.mat[i][(j - this.rightOffset) % this.vmatrowlength].className = (this.vmat[i][(j - 1) % this.vmatrowlength] == 1) ? "led" : "led off";
                }
            }
            this.mat[i][mat[i].length - 1].className = last;
        }
        this.rightOffset--;
        if (rightOffset <= 0) {
            this.rightOffset = this.vmatrowlength;
        }
    }

    moveRight0() {
        for (var i = 0; i < this.mat.length; i++) {
            var last = this.mat[i][mat[i].length - 1].className;
            for (var j = this.mat[i].length - 1; j > 0; j--)
                this.mat[i][j].className = this.mat[i][j - 1].className;
            this.mat[i][0].className = last;
        }
    }

    clearM() {
        for (var i = 0; i < this.mat.length; i++)
            for (var j = 0; j < this.mat[i].length; j++)
                this.mat[i][j].className = "led off";
    }

    fill() {
        for (var i = 0; i < this.mat.length; i++)
            for (var j = 0; j < this.mat[i].length; j++)
                this.mat[i][j].className = "led";
    }

    inverseColors(){
        this.#options.inverse_colors = !this.#options.inverse_colors;
    }

    printFormattedMatrix(matrix) {
        // print formated array
        console.log(JSON.stringify(matrix).replace(/(\[\[)(.*)(\]\])/g, '[\n  [$2]\n]').replace(/],/g, '],\n  '));
    }

}