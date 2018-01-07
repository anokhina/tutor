function merge(obj1, obj2) {
    for (var i in obj2) {
        obj1[i] = obj2[i];
    }
}

function GRAFFITI () {
        //It's possible to add something like https://en.wikipedia.org/wiki/Graffiti_(Palm_OS)
    this._isDown = null; 
    this._points = null;
    this._r =  null;
    this._canvas = null;
    this._useProtractor = null; 
    this._logField = null; 
    this._bindInput = null;
}

merge(GRAFFITI.prototype, {
            init : function (canvas, useProtractor, logField) {
                this._logField = logField;
                this._canvas = canvas;
                this._useProtractor = useProtractor;
                this._points = new Array();
                this._r = new DollarRecognizer();

                var _g = this.getGCtx() ;
                
                _g.fillStyle = "rgb(0,0,225)";
                _g.strokeStyle = "rgb(0,0,225)";
                _g.lineWidth = 3;
                _g.font = "16px Gentilis";
                _g.fillStyle = "rgb(255,255,136)";
                _g.fillRect(0, 0, this.getCanvasRect(this._canvas).width, 20);


                this._isDown = false;
            },
            getGCtx: function() {
                return this._canvas.getContext('2d');
            },
            bind: function (inp) {
                this._bindInput = inp;
            },
            getCanvasRect : function (canvas) {
                var w = canvas.width;
                var h = canvas.height;

                var cx = canvas.offsetLeft;
                var cy = canvas.offsetTop;
                while (canvas.offsetParent != null) {
                    canvas = canvas.offsetParent;
                    cx += canvas.offsetLeft;
                    cy += canvas.offsetTop;
                }
                ret = {x: cx, y: cy, width: w, height: h};

                return ret;
            },
            getScrollY : function () {
                var rect = this._canvas.getBoundingClientRect(); //TODO see getCanvasRect
                //return rect.top;
                return 0;
            },
            getScrollX : function () {
                var rect = this._canvas.getBoundingClientRect(); //TODO see getCanvasRect
                //return rect.left;
                return 0;
            },
            mouseDownEvent : function (x, y) {
                document.onselectstart = function() { return false; } // disable drag-select
                document.onmousedown = function() { return false; } // disable drag-select
                this._isDown = true;
                var _rc = this.getCanvasRect(this._canvas);
                x -= _rc.x - this.getScrollX();
                y -= _rc.y - this.getScrollY();
                if (this._points.length > 0)
                    this.getGCtx().clearRect(0, 0, _rc.width, _rc.height);
                this._points.length = 1; // clear
                this._points[0] = new Point(x, y);
                this.drawText("Recording unistroke...");
                this.getGCtx().fillRect(x - 4, y - 3, 9, 9);
            },
            mouseMoveEvent : function (x, y) {
                if (this._isDown) {
                    var _rc = this.getCanvasRect(this._canvas);
                    x -= _rc.x - this.getScrollX();
                    y -= _rc.y - this.getScrollY();
                    this._points[this._points.length] = new Point(x, y);
                    this.drawConnectedPoint(this._points.length - 2, this._points.length - 1);
                }
            },
            mouseUpEvent : function (x, y) {
                document.onselectstart = function() { return true; } // enable drag-select
                document.onmousedown = function() { return true; } // enable drag-select
                if (this._isDown) {
                    this._isDown = false;
                    if (this._points.length >= 10) {
                        var useProtractor = false;
                        if (this._useProtractor && this._useProtractor.checked) {
                            useProtractor = true;
                        }
                        var result = this._r.Recognize(this._points, useProtractor);
                        this.drawText("" + result.Name + " (" + this.round_n_to_d_decimals(result.Score,2) + ").");
                        if (this._bindInput && result.Score > 0.7) {
                            this.insertAtCursor(this._bindInput, result.Name);
                        }
                    } else {
                        this.drawText("Too few points (fewer than 10) made. Please try again.");
                    }
                }
            },
            insertAtCursor : function(myField, myValue) {
                var sel;
                //IE support
                if (document.selection) {
                    myField.focus();
                    sel = document.selection.createRange();
                    sel.text = myValue;
                } else //MOZILLA and others
                if (window.navigator.userAgent.indexOf("Edge") > -1 || myField.selectionStart || myField.selectionStart == '0') {
                    var startPos = myField.selectionStart;
                    var endPos = myField.selectionEnd;
                    myField.value = myField.value.substring(0, startPos)
                        + myValue
                        + myField.value.substring(endPos, myField.value.length);
                    var pos = startPos + myValue.length;
                    myField.focus();
                    myField.setSelectionRange(pos, pos);
                } else {
                    myField.value += myValue;
                }
            },
            drawText : function(str) {
                var _g = this.getGCtx();
                _g.fillStyle = "rgb(255,255,136)";
                _g.fillRect(0, 0, this.getCanvasRect(this._canvas).width, 20);
                _g.fillStyle = "rgb(0,0,255)";
                _g.fillText(str, 1, 14);
                this.log(0, str);
            },
            log : function (idx, str){
                if (this._logField && this._logField.length > idx && this._logField[idx]) {
                    this._logField[idx].value = str;
                }
            },
            drawConnectedPoint : function (fromPt, toPt) {
                var _g = this.getGCtx(), _points = this._points;
                _g.beginPath();
                _g.moveTo(_points[fromPt].X, _points[fromPt].Y);
                _g.lineTo(_points[toPt].X, _points[toPt].Y);
                _g.closePath();
                _g.stroke();
            },
            round_n_to_d_decimals : function (n, d) {
                d = Math.pow(10, d);
                return Math.round(n * d) / d
            },
            addReplaceGesture : function(name, points) {
                if (points) {} else {
                    points = this._points;
                }
                if (points.length >= 10 && name.length > 0) {
                    var num = this._r.AddGesture(name, points);
                    this.log(1, name +": "+ JSON.stringify(points));
                    this.drawText("\"" + name + "\" added. Number of \"" + name + "\"s defined: " + num + ".");
                }
            },
            delCustom : function() {
                var num = this._r.DeleteUserGestures();
                alert("All user-defined gestures have been deleted. Only the 1 predefined gesture remains for each of the " + num + " types.");
            },
            getGestures: function() {
                var ret = {};
                for (var i = 0; i < this._r.Unistrokes.length; i++) {
                    ret[this._r.Unistrokes[i].Name] = this._r.Unistrokes[i].Points;
                }
                return ret;
            },
            logGesturesStr: function() {
                this.log(1, JSON.stringify(this.getGestures()).replace(/],/g, "],\n"));
            }
});

function Rad2Deg(r) { return (r * 180.0 / Math.PI); }

function ScaleTo(points, size)
{
	var B = BoundingBox(points);
	var newpoints = new Array();
	for (var i = 0; i < points.length; i++) {
        var qx = 0, qy = 0;
        if (B.Width != 0) {
            var qx = points[i].X * (size / B.Width);
        } 
        if (B.Height != 0) {
            var qy = points[i].Y * (size / B.Height);
        }
		newpoints[newpoints.length] = new Point(qx, qy);
	}
	return newpoints;
}

function DistanceAtBestAngle(points, T, a, b, threshold)
{
    var maxAngleSize = Deg2Rad(10);
    b = Deg2Rad(10);
    a = -b;
	var x1 = Phi * a + (1.0 - Phi) * b;
	var f1 = DistanceAtAngle(points, T, x1);
	var x2 = (1.0 - Phi) * a + Phi * b;
	var f2 = DistanceAtAngle(points, T, x2);
	while (Math.abs(b - a) > threshold && Math.abs(x1) < maxAngleSize &&  Math.abs(x2) < maxAngleSize)
	{
		if (f1 < f2) {
			b = x2;
			x2 = x1;
			f2 = f1;
			x1 = Phi * a + (1.0 - Phi) * b;
			f1 = DistanceAtAngle(points, T, x1);
		} else {
			a = x1;
			x1 = x2;
			f1 = f2;
			x2 = (1.0 - Phi) * a + Phi * b;
			f2 = DistanceAtAngle(points, T, x2);
		}
	}
	return Math.min(f1, f2);
}