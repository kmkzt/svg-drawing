var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
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
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import Two from 'two.js';
var SvgAnimation = (function (_super) {
    __extends(SvgAnimation, _super);
    function SvgAnimation(params) {
        var _this = _super.call(this, params) || this;
        _this.animationStart = _this.animationStart.bind(_this);
        _this.shaking = _this.shaking.bind(_this);
        _this.initSvgXml = _this.initSvgXml.bind(_this);
        _this.strokeAnimation = _this.strokeAnimation.bind(_this);
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
        var distances = calculateDistances(this.scene);
        var total = distances.reduce(function (to, d) { return to + d; }, 0);
        var setEnding = function (group, ti) {
            var traversed = ti * total;
            var current = 0;
            group.children.map(function (child, i) {
                var distance = distances[i];
                var min = current;
                var max = current + distance;
                child.ending = cmap(traversed, min, max, 0, 1);
                current = max;
            });
        };
        var t = 0;
        var update = function () {
            var arg = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                arg[_i] = arguments[_i];
            }
            if (t < 0.9999) {
                t += 0.00625;
            }
            else {
                t = 0;
            }
            setEnding(_this.scene, t);
        };
        this.bind('update', update).play();
        return function () { return _this.unbind('update', update); };
    };
    return SvgAnimation;
}(Two));
export { SvgAnimation };
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
