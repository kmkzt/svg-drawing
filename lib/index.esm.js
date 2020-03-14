import Two from 'two.js';

/**
 * remove <g>
 * remove transform attribure
 * @param svgString
 * @returns {SVGSVGElement}
 */
const svgFormatting = svgXML => {
  const doc = typeof svgXML === 'string' ? new DOMParser().parseFromString(svgXML, 'image/svg+xml') : svgXML;
  const svgEle = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  const originSvgEle = doc.querySelector('svg');
  if (!originSvgEle) return svgEle;
  ['width', 'height', 'viewBox'].map(attr => {
    const attrValue = originSvgEle.getAttribute(attr);
    if (attrValue) svgEle.setAttribute(attr, attrValue);
  });
  const pathEle = doc.querySelectorAll('path');
  pathEle.forEach(path => {
    path.removeAttribute('transform');
    svgEle.appendChild(path);
  });
  return svgEle;
};

const getPassiveOptions = (passive = true) => {
  try {
    const check = () => null;

    window.addEventListener('testPassive', check, {
      passive
    });
    window.removeEventListener('testPassive', check);
    return {
      passive
    };
  } catch (e) {
    return false;
  }
};

class SvgDrawing extends Two {
  constructor(params) {
    super(params);
    /**
     * bind methods
     */

    this.clearListner = this.clearListner.bind(this);
    this.toSvgXml = this.toSvgXml.bind(this);
    this.toSvgBase64 = this.toSvgBase64.bind(this);
    this.drawingStart = this.drawingStart.bind(this);
    this.drawingMove = this.drawingMove.bind(this);
    this.drawingEnd = this.drawingEnd.bind(this);
    this.mouseUp = this.mouseUp.bind(this);
    this.mouseMove = this.mouseMove.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
    this.init.bind(this);
    /**
     * Setup parameter
     */

    this.line = null; // TODO: Fix Two.vector constructor params

    this.current = new Two.Vector(0, 0);
    this.penColor = params.penColor || '#333';
    this.penWidth = params.penWidth || 10;
    this.strokeCap = params.strokeCap || 'round';
    this.strokeLineJoin = params.strokeLineJoin || 'round';
    this.type = params.type || Two.Types.svg;
    this.el = params.el;
    this.width = params.width || this.el.clientWidth;
    this.height = params.height || this.el.clientHeight;
    this.init();
  }
  /**
   * toSvgXML
   */


  toSvgXml() {
    const domElement = this.renderer.domElement;
    const svgElement = svgFormatting(domElement.outerHTML);
    if (!domElement) return null;
    return "<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" width=\"" + this.width + "\" height=\"" + this.height + "\" viewBox=\"0 0 " + this.width + " " + this.height + "\">" + svgElement.innerHTML + "</svg>";
  }
  /**
   * toSvgXML
   */


  toSvgBase64() {
    const svgXml = this.toSvgXml();
    if (!svgXml) return null;
    return "data:image/svg+xml;base64," + btoa(svgXml);
  }
  /**
   * listner clear
   */


  clearListner() {
    this.el.removeEventListener('mousedown', this.mouseDown);
    this.el.removeEventListener('touchstart', this.touchStart);
  }
  /**
   * Init methods
   */


  init() {
    this.appendTo(this.el);
    this.el.addEventListener('mousedown', this.mouseDown, getPassiveOptions(false));
    this.el.addEventListener('touchstart', this.touchStart, getPassiveOptions(false));
    return this;
  }
  /**
   * Drawing Line methods
   */


  drawingStart({
    x,
    y
  }) {
    this.current.set(x, y);
  }

  drawingMove({
    x,
    y
  }) {
    const rect = this.el.getBoundingClientRect();

    const makePoint = (mx, my) => new Two.Vector(mx - rect.left, my - rect.top);

    if (this.line) {
      if (this.line.linewidth !== this.penWidth || this.line.stroke !== this.penColor) {
        this.drawingEnd();
        return;
      }

      const v = makePoint(x, y);
      this.line.vertices.push(v);
      return;
    }

    const vprev = makePoint(this.current.x, this.current.y);
    const vnext = makePoint(x, y);
    this.current.set(x, y);
    this.line = this.makeCurve([vprev, vnext], true);
    this.line.noFill().stroke = this.penColor;
    this.line.linewidth = this.penWidth;
    this.line.cap = this.strokeCap;
    this.line.join = this.strokeLineJoin;
    this.line.vertices.map(v => {
      if (!this.line) return;
      v.addSelf(this.line.translation);
    });
    this.line.translation.clear();
  }

  drawingEnd() {
    this.line = null;
  }
  /**
   * Drawing MouseEvent
   */


  mouseDown(e) {
    e.preventDefault();
    this.drawingStart({
      x: e.clientX,
      y: e.clientY
    });
    this.el.addEventListener('mousemove', this.mouseMove, getPassiveOptions(false));
    this.el.addEventListener('mouseup', this.mouseUp, getPassiveOptions(false));
  }

  mouseMove(e) {
    e.preventDefault();
    this.drawingMove({
      x: e.clientX,
      y: e.clientY
    });
  }

  mouseUp(e) {
    e.preventDefault();
    this.el.removeEventListener('mousemove', this.mouseMove);
    this.el.removeEventListener('mouseup', this.mouseUp);
    this.drawingEnd();
  }
  /**
   * Drawing TouchEvent
   */


  touchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.drawingStart({
      x: touch.clientX,
      y: touch.clientY
    });
    this.el.addEventListener('touchmove', this.touchMove, getPassiveOptions(false));
    this.el.addEventListener('touchend', this.touchEnd, getPassiveOptions(false));
  }

  touchMove(e) {
    e.preventDefault();
    const touch = e.touches[0];
    this.drawingMove({
      x: touch.clientX,
      y: touch.clientY
    });
  }

  touchEnd(e) {
    e.preventDefault();
    this.el.removeEventListener('touchmove', this.touchMove);
    this.el.removeEventListener('touchend', this.touchEnd);
    this.drawingEnd();
  }

}

class SvgAnimation extends Two {
  constructor(params) {
    super(params);
    /**
     * bind methods
     */

    this.animationStart = this.animationStart.bind(this);
    this.shaking = this.shaking.bind(this);
    this.initSvgXml = this.initSvgXml.bind(this);
    this.strokeAnimation = this.strokeAnimation.bind(this);
    this.loadScene = this.loadScene.bind(this);
    this.loadSvgXml = this.loadSvgXml.bind(this);
    this.splitEnd = this.splitEnd.bind(this);
    /**
     * Setup parameter
     */
    // TODO: Fix Two.vector constructor params

    this.shakingRange = params.shakingRange || 2;
    this.type = params.type || Two.Types.canvas;
    this.el = params.el;
    this.width = params.width || this.el.clientWidth;
    this.height = params.height || this.el.clientHeight;
    this.animationStart();
  }
  /**
   * Shaking Drawing line
   */


  shaking() {
    const randomShaking = () => Math.random() * this.shakingRange - this.shakingRange / 2;

    const updateShake = (frameCount, timeDelta) => {
      // shake speed
      if (frameCount % 5 !== 0) return;
      this.scene.children.map(child => {
        if (!child.vertices) return;
        child.vertices.map(v => {
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

    const sceneChildrenRestore = () => this.scene.children.map(child => {
      const vertices = child.vertices;
      if (!vertices) return;
      vertices.map(v => {
        // TODO: define position types
        if (!v.position) {
          return;
        }

        v.x = v.position.x;
        v.y = v.position.y;
        delete v.position;
      });
    });

    this.bind('update', updateShake).play();
    return () => {
      this.unbind('update', updateShake);
      sceneChildrenRestore();
    };
  }
  /**
   * Load SCENE
   * @param {Two.Group} scene
   */


  loadScene(scene) {
    this.clear();
    scene.children.map(twoObj => {
      this.scene.add(twoObj.clone());
    });
    this.update();
  }
  /**
   * Load SVGXML
   * @param {string | SVGSVGElement} svgXml
   */


  loadSvgXml(svgXml) {
    const svgElement = svgFormatting(svgXml);
    if (!svgElement) return;
    const svgTwo = this.interpret(svgElement);
    this.clear(); // get element width
    // TODO: getelement Refactor

    document.body.appendChild(svgElement);
    const originWidth = svgElement.clientWidth;
    document.body.removeChild(svgElement);
    this.scene.scale = this.width / originWidth;
    svgTwo.children.map(twoObj => {
      this.scene.add(twoObj.clone());
    });
    this.scene.center().translation.set(this.width / 2, this.height / 2);
    this.update();
  }
  /**
   * DrawingStart
   */


  animationStart() {
    this.appendTo(this.el);
    return this;
  } // TODO: SvgElement XML test


  initSvgXml(svgNode) {
    this.clear();
    const fresh = this.interpret(svgNode);
    fresh.subdivide();
    this.scene.add(fresh);
  }
  /**
   * strokeAnimationGif
   */


  strokeAnimation() {
    let t = 0;

    const update = () => {
      if (t < 0.9999) {
        t += 0.00625;
      } else {
        t = 0;
      }

      setEndScene(this.scene, t);
    };

    this.bind('update', update).play();
    return () => this.unbind('update', update);
  }
  /**
   * SplitEnd
   * @param {number} p
   */


  splitEnd(p) {
    setEndScene(this.scene, p);
    this.update();
  }

}

const setEndScene = (group, ti) => {
  const distances = calculateDistances(group);
  const total = distances.reduce((to, d) => to + d, 0);
  const traversed = ti * total;
  let current = 0;

  for (let i = 0; i < group.children.length; i++) {
    const distance = distances[i];
    const min = current;
    const max = current + distance;
    group.children[i].ending = cmap(traversed, min, max, 0, 1);
    current = max;
  }
};

function calculateDistances(group) {
  return group.children.reduce((distances, child) => {
    let d = 0;
    let a;
    if (!child.vertices) return distances;
    child.vertices.map((b, i) => {
      if (i > 0) {
        d += a.distanceTo(b);
      }

      a = b;
    });
    return [...distances, d];
  }, []);
}

const clamp = (v, min, max) => Math.max(Math.min(v, max), min);

const map = (v, i1, i2, o1, o2) => o1 + (o2 - o1) * ((v - i1) / (i2 - i1));

const cmap = (v, i1, i2, o1, o2) => clamp(map(v, i1, i2, o1, o2), o1, o2);

export { SvgAnimation, SvgDrawing };
//# sourceMappingURL=index.esm.js.map
