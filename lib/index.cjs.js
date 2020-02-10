'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var Two = _interopDefault(require('two.js'));

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return extendStatics(d, b);
};

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

var svgFormatting = function (svgXML) {
    var doc = typeof svgXML === 'string'
        ? new DOMParser().parseFromString(svgXML, 'image/svg+xml')
        : svgXML;
    var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    var originSvgEle = doc.querySelector('svg');
    if (!originSvgEle)
        return svgEle;
    ['width', 'height', 'viewBox'].map(function (attr) {
        var attrValue = originSvgEle.getAttribute(attr);
        if (attrValue)
            svgEle.setAttribute(attr, attrValue);
    });
    var pathEle = doc.querySelectorAll('path');
    pathEle.forEach(function (path) {
        path.removeAttribute('transform');
        svgEle.appendChild(path);
    });
    return svgEle;
};

var getPassiveOptions = function (passive) {
    if (passive === void 0) { passive = true; }
    try {
        var check = function () { return null; };
        window.addEventListener('testPassive', check, { passive: passive });
        window.removeEventListener('testPassive', check);
        return { passive: passive };
    }
    catch (e) {
        return false;
    }
};

var SvgDrawing = (function (_super) {
    __extends(SvgDrawing, _super);
    function SvgDrawing(params) {
        var _this = _super.call(this, params) || this;
        _this.clearListner = _this.clearListner.bind(_this);
        _this.toSvgXml = _this.toSvgXml.bind(_this);
        _this.toSvgBase64 = _this.toSvgBase64.bind(_this);
        _this.drawingStart = _this.drawingStart.bind(_this);
        _this.drawingMove = _this.drawingMove.bind(_this);
        _this.drawingEnd = _this.drawingEnd.bind(_this);
        _this.mouseUp = _this.mouseUp.bind(_this);
        _this.mouseMove = _this.mouseMove.bind(_this);
        _this.mouseDown = _this.mouseDown.bind(_this);
        _this.touchStart = _this.touchStart.bind(_this);
        _this.touchMove = _this.touchMove.bind(_this);
        _this.touchEnd = _this.touchEnd.bind(_this);
        _this.init.bind(_this);
        _this.line = null;
        _this.current = new Two.Vector(0, 0);
        _this.penColor = params.penColor || '#333';
        _this.penWidth = params.penWidth || 10;
        _this.strokeCap = params.strokeCap || 'round';
        _this.strokeLineJoin = params.strokeLineJoin || 'round';
        _this.type = params.type || Two.Types.svg;
        _this.el = params.el;
        _this.width = params.width || _this.el.clientWidth;
        _this.height = params.height || _this.el.clientHeight;
        _this.init();
        return _this;
    }
    SvgDrawing.prototype.toSvgXml = function () {
        var domElement = this.renderer.domElement;
        var svgElement = svgFormatting(domElement.outerHTML);
        if (!domElement)
            return null;
        return "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + this.width + "\" height=\"" + this.height + "\" viewBox=\"0 0 " + this.width + " " + this.height + "\">" + svgElement.innerHTML + "</svg>";
    };
    SvgDrawing.prototype.toSvgBase64 = function () {
        var svgXml = this.toSvgXml();
        if (!svgXml)
            return null;
        return "data:image/svg+xml;base64," + btoa(svgXml);
    };
    SvgDrawing.prototype.clearListner = function () {
        this.el.removeEventListener('mousedown', this.mouseDown);
        this.el.removeEventListener('touchstart', this.touchStart);
    };
    SvgDrawing.prototype.init = function () {
        this.appendTo(this.el);
        this.el.addEventListener('mousedown', this.mouseDown, getPassiveOptions(false));
        this.el.addEventListener('touchstart', this.touchStart, getPassiveOptions(false));
        return this;
    };
    SvgDrawing.prototype.drawingStart = function (_a) {
        var x = _a.x, y = _a.y;
        this.current.set(x, y);
    };
    SvgDrawing.prototype.drawingMove = function (_a) {
        var _this = this;
        var x = _a.x, y = _a.y;
        var rect = this.el.getBoundingClientRect();
        var makePoint = function (mx, my) {
            return new Two.Vector(mx - rect.left, my - rect.top);
        };
        if (this.line) {
            if (this.line.linewidth !== this.penWidth ||
                this.line.stroke !== this.penColor) {
                this.drawingEnd();
                return;
            }
            var v = makePoint(x, y);
            this.line.vertices.push(v);
            return;
        }
        var vprev = makePoint(this.current.x, this.current.y);
        var vnext = makePoint(x, y);
        this.current.set(x, y);
        this.line = this.makeCurve([vprev, vnext], true);
        this.line.noFill().stroke = this.penColor;
        this.line.linewidth = this.penWidth;
        this.line.cap = this.strokeCap;
        this.line.join = this.strokeLineJoin;
        this.line.vertices.map(function (v) {
            if (!_this.line)
                return;
            v.addSelf(_this.line.translation);
        });
        this.line.translation.clear();
    };
    SvgDrawing.prototype.drawingEnd = function () {
        this.line = null;
    };
    SvgDrawing.prototype.mouseDown = function (e) {
        e.preventDefault();
        this.drawingStart({ x: e.clientX, y: e.clientY });
        this.el.addEventListener('mousemove', this.mouseMove, getPassiveOptions(false));
        this.el.addEventListener('mouseup', this.mouseUp, getPassiveOptions(false));
    };
    SvgDrawing.prototype.mouseMove = function (e) {
        e.preventDefault();
        this.drawingMove({ x: e.clientX, y: e.clientY });
    };
    SvgDrawing.prototype.mouseUp = function (e) {
        e.preventDefault();
        this.el.removeEventListener('mousemove', this.mouseMove);
        this.el.removeEventListener('mouseup', this.mouseUp);
        this.drawingEnd();
    };
    SvgDrawing.prototype.touchStart = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.drawingStart({ x: touch.clientX, y: touch.clientY });
        this.el.addEventListener('touchmove', this.touchMove, getPassiveOptions(false));
        this.el.addEventListener('touchend', this.touchEnd, getPassiveOptions(false));
    };
    SvgDrawing.prototype.touchMove = function (e) {
        e.preventDefault();
        var touch = e.touches[0];
        this.drawingMove({
            x: touch.clientX,
            y: touch.clientY
        });
    };
    SvgDrawing.prototype.touchEnd = function (e) {
        e.preventDefault();
        this.el.removeEventListener('touchmove', this.touchMove);
        this.el.removeEventListener('touchend', this.touchEnd);
        this.drawingEnd();
    };
    return SvgDrawing;
}(Two));

var SvgAnimation = (function (_super) {
    __extends(SvgAnimation, _super);
    function SvgAnimation(params) {
        var _this = _super.call(this, params) || this;
        _this.animationStart = _this.animationStart.bind(_this);
        _this.shaking = _this.shaking.bind(_this);
        _this.initSvgXml = _this.initSvgXml.bind(_this);
        _this.strokeAnimation = _this.strokeAnimation.bind(_this);
        _this.loadScene = _this.loadScene.bind(_this);
        _this.loadSvgXml = _this.loadSvgXml.bind(_this);
        _this.splitEnd = _this.splitEnd.bind(_this);
        _this.shakingRange = params.shakingRange || 2;
        _this.type = params.type || Two.Types.canvas;
        _this.el = params.el;
        _this.width = params.width || _this.el.clientWidth;
        _this.height = params.height || _this.el.clientHeight;
        _this.animationStart();
        return _this;
    }
    SvgAnimation.prototype.shaking = function () {
        var _this = this;
        var randomShaking = function () {
            return Math.random() * _this.shakingRange - _this.shakingRange / 2;
        };
        var updateShake = function (frameCount, timeDelta) {
            if (frameCount % 5 !== 0)
                return;
            _this.scene.children.map(function (child) {
                if (!child.vertices)
                    return;
                child.vertices.map(function (v) {
                    if (!v.position) {
                        v.position = v.clone();
                    }
                    v.x = v.position.x + randomShaking();
                    v.y = v.position.y + randomShaking();
                });
            });
        };
        var sceneChildrenRestore = function () {
            return _this.scene.children.map(function (child) {
                var vertices = child.vertices;
                if (!vertices)
                    return;
                vertices.map(function (v) {
                    if (!v.position) {
                        return;
                    }
                    v.x = v.position.x;
                    v.y = v.position.y;
                    delete v.position;
                });
            });
        };
        this.bind('update', updateShake).play();
        return function () {
            _this.unbind('update', updateShake);
            sceneChildrenRestore();
        };
    };
    SvgAnimation.prototype.loadScene = function (scene) {
        var _this = this;
        this.clear();
        scene.children.map(function (twoObj) {
            _this.scene.add(twoObj.clone());
        });
        this.update();
    };
    SvgAnimation.prototype.loadSvgXml = function (svgXml) {
        var _this = this;
        var svgElement = svgFormatting(svgXml);
        if (!svgElement)
            return;
        var svgTwo = this.interpret(svgElement);
        this.clear();
        document.body.appendChild(svgElement);
        var originWidth = svgElement.clientWidth;
        document.body.removeChild(svgElement);
        this.scene.scale = this.width / originWidth;
        svgTwo.children.map(function (twoObj) {
            _this.scene.add(twoObj.clone());
        });
        this.scene.center().translation.set(this.width / 2, this.height / 2);
        this.update();
    };
    SvgAnimation.prototype.animationStart = function () {
        this.appendTo(this.el);
        return this;
    };
    SvgAnimation.prototype.initSvgXml = function (svgNode) {
        this.clear();
        var fresh = this.interpret(svgNode);
        fresh.subdivide();
        this.scene.add(fresh);
    };
    SvgAnimation.prototype.strokeAnimation = function () {
        var _this = this;
        var t = 0;
        var update = function () {
            if (t < 0.9999) {
                t += 0.00625;
            }
            else {
                t = 0;
            }
            setEndScene(_this.scene, t);
        };
        this.bind('update', update).play();
        return function () { return _this.unbind('update', update); };
    };
    SvgAnimation.prototype.splitEnd = function (p) {
        setEndScene(this.scene, p);
        this.update();
    };
    return SvgAnimation;
}(Two));
var setEndScene = function (group, ti) {
    var distances = calculateDistances(group);
    var total = distances.reduce(function (to, d) { return to + d; }, 0);
    var traversed = ti * total;
    var current = 0;
    for (var i = 0; i < group.children.length; i++) {
        var distance = distances[i];
        var min = current;
        var max = current + distance;
        group.children[i].ending = cmap(traversed, min, max, 0, 1);
        current = max;
    }
};
function calculateDistances(group) {
    return group.children.reduce(function (distances, child) {
        var d = 0;
        var a;
        if (!child.vertices)
            return distances;
        child.vertices.map(function (b, i) {
            if (i > 0) {
                d += a.distanceTo(b);
            }
            a = b;
        });
        return __spread(distances, [d]);
    }, []);
}
var clamp = function (v, min, max) {
    return Math.max(Math.min(v, max), min);
};
var map = function (v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
};
var cmap = function (v, i1, i2, o1, o2) {
    return clamp(map(v, i1, i2, o1, o2), o1, o2);
};

exports.SvgAnimation = SvgAnimation;
exports.SvgDrawing = SvgDrawing;
