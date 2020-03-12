import _assertThisInitialized from '@babel/runtime/helpers/esm/assertThisInitialized';
import _inheritsLoose from '@babel/runtime/helpers/esm/inheritsLoose';
import _defineProperty from '@babel/runtime/helpers/esm/defineProperty';
import Two from 'two.js';

/**
 * remove <g>
 * remove transform attribure
 * @param svgString
 * @returns {SVGSVGElement}
 */
var svgFormatting = function svgFormatting(svgXML) {
  var doc = typeof svgXML === 'string' ? new DOMParser().parseFromString(svgXML, 'image/svg+xml') : svgXML;
  var svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  var originSvgEle = doc.querySelector('svg');
  if (!originSvgEle) return svgEle;
  ['width', 'height', 'viewBox'].map(function (attr) {
    var attrValue = originSvgEle.getAttribute(attr);
    if (attrValue) svgEle.setAttribute(attr, attrValue);
  });
  var pathEle = doc.querySelectorAll('path');
  pathEle.forEach(function (path) {
    path.removeAttribute('transform');
    svgEle.appendChild(path);
  });
  return svgEle;
};

var getPassiveOptions = function getPassiveOptions(passive) {
  if (passive === void 0) {
    passive = true;
  }

  try {
    var check = function check() {
      return null;
    };

    window.addEventListener('testPassive', check, {
      passive: passive
    });
    window.removeEventListener('testPassive', check);
    return {
      passive: passive
    };
  } catch (e) {
    return false;
  }
};

var SvgDrawing =
/*#__PURE__*/
function (_Two) {
  _inheritsLoose(SvgDrawing, _Two);

  function SvgDrawing(params) {
    var _this;

    _this = _Two.call(this, params) || this;
    /**
     * bind methods
     */

    _defineProperty(_assertThisInitialized(_this), "penColor", void 0);

    _defineProperty(_assertThisInitialized(_this), "penWidth", void 0);

    _defineProperty(_assertThisInitialized(_this), "strokeCap", void 0);

    _defineProperty(_assertThisInitialized(_this), "strokeLineJoin", void 0);

    _defineProperty(_assertThisInitialized(_this), "line", void 0);

    _defineProperty(_assertThisInitialized(_this), "current", void 0);

    _defineProperty(_assertThisInitialized(_this), "el", void 0);

    _this.clearListner = _this.clearListner.bind(_assertThisInitialized(_this));
    _this.toSvgXml = _this.toSvgXml.bind(_assertThisInitialized(_this));
    _this.toSvgBase64 = _this.toSvgBase64.bind(_assertThisInitialized(_this));
    _this.drawingStart = _this.drawingStart.bind(_assertThisInitialized(_this));
    _this.drawingMove = _this.drawingMove.bind(_assertThisInitialized(_this));
    _this.drawingEnd = _this.drawingEnd.bind(_assertThisInitialized(_this));
    _this.mouseUp = _this.mouseUp.bind(_assertThisInitialized(_this));
    _this.mouseMove = _this.mouseMove.bind(_assertThisInitialized(_this));
    _this.mouseDown = _this.mouseDown.bind(_assertThisInitialized(_this));
    _this.touchStart = _this.touchStart.bind(_assertThisInitialized(_this));
    _this.touchMove = _this.touchMove.bind(_assertThisInitialized(_this));
    _this.touchEnd = _this.touchEnd.bind(_assertThisInitialized(_this));

    _this.init.bind(_assertThisInitialized(_this));
    /**
     * Setup parameter
     */


    _this.line = null; // TODO: Fix Two.vector constructor params

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
  /**
   * toSvgXML
   */


  var _proto = SvgDrawing.prototype;

  _proto.toSvgXml = function toSvgXml() {
    var domElement = this.renderer.domElement;
    var svgElement = svgFormatting(domElement.outerHTML);
    if (!domElement) return null;
    return "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + this.width + "\" height=\"" + this.height + "\" viewBox=\"0 0 " + this.width + " " + this.height + "\">" + svgElement.innerHTML + "</svg>";
  }
  /**
   * toSvgXML
   */
  ;

  _proto.toSvgBase64 = function toSvgBase64() {
    var svgXml = this.toSvgXml();
    if (!svgXml) return null;
    return "data:image/svg+xml;base64," + btoa(svgXml);
  }
  /**
   * listner clear
   */
  ;

  _proto.clearListner = function clearListner() {
    this.el.removeEventListener('mousedown', this.mouseDown);
    this.el.removeEventListener('touchstart', this.touchStart);
  }
  /**
   * Init methods
   */
  ;

  _proto.init = function init() {
    this.appendTo(this.el);
    this.el.addEventListener('mousedown', this.mouseDown, getPassiveOptions(false));
    this.el.addEventListener('touchstart', this.touchStart, getPassiveOptions(false));
    return this;
  }
  /**
   * Drawing Line methods
   */
  ;

  _proto.drawingStart = function drawingStart(_ref) {
    var x = _ref.x,
        y = _ref.y;
    this.current.set(x, y);
  };

  _proto.drawingMove = function drawingMove(_ref2) {
    var _this2 = this;

    var x = _ref2.x,
        y = _ref2.y;
    var rect = this.el.getBoundingClientRect();

    var makePoint = function makePoint(mx, my) {
      return new Two.Vector(mx - rect.left, my - rect.top);
    };

    if (this.line) {
      if (this.line.linewidth !== this.penWidth || this.line.stroke !== this.penColor) {
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
      if (!_this2.line) return;
      v.addSelf(_this2.line.translation);
    });
    this.line.translation.clear();
  };

  _proto.drawingEnd = function drawingEnd() {
    this.line = null;
  }
  /**
   * Drawing MouseEvent
   */
  ;

  _proto.mouseDown = function mouseDown(e) {
    e.preventDefault();
    this.drawingStart({
      x: e.clientX,
      y: e.clientY
    });
    this.el.addEventListener('mousemove', this.mouseMove, getPassiveOptions(false));
    this.el.addEventListener('mouseup', this.mouseUp, getPassiveOptions(false));
  };

  _proto.mouseMove = function mouseMove(e) {
    e.preventDefault();
    this.drawingMove({
      x: e.clientX,
      y: e.clientY
    });
  };

  _proto.mouseUp = function mouseUp(e) {
    e.preventDefault();
    this.el.removeEventListener('mousemove', this.mouseMove);
    this.el.removeEventListener('mouseup', this.mouseUp);
    this.drawingEnd();
  }
  /**
   * Drawing TouchEvent
   */
  ;

  _proto.touchStart = function touchStart(e) {
    e.preventDefault();
    var touch = e.touches[0];
    this.drawingStart({
      x: touch.clientX,
      y: touch.clientY
    });
    this.el.addEventListener('touchmove', this.touchMove, getPassiveOptions(false));
    this.el.addEventListener('touchend', this.touchEnd, getPassiveOptions(false));
  };

  _proto.touchMove = function touchMove(e) {
    e.preventDefault();
    var touch = e.touches[0];
    this.drawingMove({
      x: touch.clientX,
      y: touch.clientY
    });
  };

  _proto.touchEnd = function touchEnd(e) {
    e.preventDefault();
    this.el.removeEventListener('touchmove', this.touchMove);
    this.el.removeEventListener('touchend', this.touchEnd);
    this.drawingEnd();
  };

  return SvgDrawing;
}(Two);

var SvgAnimation =
/*#__PURE__*/
function (_Two) {
  _inheritsLoose(SvgAnimation, _Two);

  function SvgAnimation(params) {
    var _this;

    _this = _Two.call(this, params) || this;
    /**
     * bind methods
     */

    _defineProperty(_assertThisInitialized(_this), "shakingRange", void 0);

    _defineProperty(_assertThisInitialized(_this), "el", void 0);

    _this.animationStart = _this.animationStart.bind(_assertThisInitialized(_this));
    _this.shaking = _this.shaking.bind(_assertThisInitialized(_this));
    _this.initSvgXml = _this.initSvgXml.bind(_assertThisInitialized(_this));
    _this.strokeAnimation = _this.strokeAnimation.bind(_assertThisInitialized(_this));
    _this.loadScene = _this.loadScene.bind(_assertThisInitialized(_this));
    _this.loadSvgXml = _this.loadSvgXml.bind(_assertThisInitialized(_this));
    _this.splitEnd = _this.splitEnd.bind(_assertThisInitialized(_this));
    /**
     * Setup parameter
     */
    // TODO: Fix Two.vector constructor params

    _this.shakingRange = params.shakingRange || 2;
    _this.type = params.type || Two.Types.canvas;
    _this.el = params.el;
    _this.width = params.width || _this.el.clientWidth;
    _this.height = params.height || _this.el.clientHeight;

    _this.animationStart();

    return _this;
  }
  /**
   * Shaking Drawing line
   */


  var _proto = SvgAnimation.prototype;

  _proto.shaking = function shaking() {
    var _this2 = this;

    var randomShaking = function randomShaking() {
      return Math.random() * _this2.shakingRange - _this2.shakingRange / 2;
    };

    var updateShake = function updateShake(frameCount, timeDelta) {
      // shake speed
      if (frameCount % 5 !== 0) return;

      _this2.scene.children.map(function (child) {
        if (!child.vertices) return;
        child.vertices.map(function (v) {
          // TODO: define position types
          // v.position is base position
          if (!v.position) {
            v.position = v.clone();
          }

          v.x = v.position.x + randomShaking();
          v.y = v.position.y + randomShaking();
        });
      });
    };

    var sceneChildrenRestore = function sceneChildrenRestore() {
      return _this2.scene.children.map(function (child) {
        var vertices = child.vertices;
        if (!vertices) return;
        vertices.map(function (v) {
          // TODO: define position types
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
      _this2.unbind('update', updateShake);

      sceneChildrenRestore();
    };
  }
  /**
   * Load SCENE
   * @param {Two.Group} scene
   */
  ;

  _proto.loadScene = function loadScene(scene) {
    var _this3 = this;

    this.clear();
    scene.children.map(function (twoObj) {
      _this3.scene.add(twoObj.clone());
    });
    this.update();
  }
  /**
   * Load SVGXML
   * @param {string | SVGSVGElement} svgXml
   */
  ;

  _proto.loadSvgXml = function loadSvgXml(svgXml) {
    var _this4 = this;

    var svgElement = svgFormatting(svgXml);
    if (!svgElement) return;
    var svgTwo = this.interpret(svgElement);
    this.clear(); // get element width
    // TODO: getelement Refactor

    document.body.appendChild(svgElement);
    var originWidth = svgElement.clientWidth;
    document.body.removeChild(svgElement);
    this.scene.scale = this.width / originWidth;
    svgTwo.children.map(function (twoObj) {
      _this4.scene.add(twoObj.clone());
    });
    this.scene.center().translation.set(this.width / 2, this.height / 2);
    this.update();
  }
  /**
   * DrawingStart
   */
  ;

  _proto.animationStart = function animationStart() {
    this.appendTo(this.el);
    return this;
  } // TODO: SvgElement XML test
  ;

  _proto.initSvgXml = function initSvgXml(svgNode) {
    this.clear();
    var fresh = this.interpret(svgNode);
    fresh.subdivide();
    this.scene.add(fresh);
  }
  /**
   * strokeAnimationGif
   */
  ;

  _proto.strokeAnimation = function strokeAnimation() {
    var _this5 = this;

    var t = 0;

    var update = function update() {
      if (t < 0.9999) {
        t += 0.00625;
      } else {
        t = 0;
      }

      setEndScene(_this5.scene, t);
    };

    this.bind('update', update).play();
    return function () {
      return _this5.unbind('update', update);
    };
  }
  /**
   * SplitEnd
   * @param {number} p
   */
  ;

  _proto.splitEnd = function splitEnd(p) {
    setEndScene(this.scene, p);
    this.update();
  };

  return SvgAnimation;
}(Two);

var setEndScene = function setEndScene(group, ti) {
  var distances = calculateDistances(group);
  var total = distances.reduce(function (to, d) {
    return to + d;
  }, 0);
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
    if (!child.vertices) return distances;
    child.vertices.map(function (b, i) {
      if (i > 0) {
        d += a.distanceTo(b);
      }

      a = b;
    });
    return [].concat(distances, [d]);
  }, []);
}

var clamp = function clamp(v, min, max) {
  return Math.max(Math.min(v, max), min);
};

var map = function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
};

var cmap = function cmap(v, i1, i2, o1, o2) {
  return clamp(map(v, i1, i2, o1, o2), o1, o2);
};

export { SvgAnimation, SvgDrawing };
//# sourceMappingURL=index.esm.js.map
