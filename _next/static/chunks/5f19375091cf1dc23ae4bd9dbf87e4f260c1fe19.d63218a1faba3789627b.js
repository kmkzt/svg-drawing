(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{DSo7:function(t,e){t.exports=function(t){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}},HO86:function(t,e,n){"use strict";n.d(e,"a",(function(){return i}));var r=n("lEbO");function i(t,e){if(t){if("string"===typeof t)return Object(r.a)(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Object(r.a)(t,e):void 0}}},J9Yr:function(t,e,n){"use strict";var r=n("zQIG"),i=n("N7I1"),o=n("8mBC"),a=n("I/kN"),s=n("cMav"),u=n("pSQP"),c=n("iN+R");function l(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=u(t);if(e){var i=u(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return s(this,n)}}e.__esModule=!0,e.default=void 0;var h=n("ERkP"),d=!1;e.default=function(){var t,e=new Set;function n(n){t=n.props.reduceComponentsToState(c(e),n.props),n.props.handleStateChange&&n.props.handleStateChange(t)}return(function(s){a(c,s);var u=l(c);function c(t){var o;return r(this,c),o=u.call(this,t),d&&(e.add(i(o)),n(i(o))),o}return o(c,null,[{key:"rewind",value:function(){var n=t;return t=void 0,e.clear(),n}}]),o(c,[{key:"componentDidMount",value:function(){e.add(this),n(this)}},{key:"componentDidUpdate",value:function(){n(this)}},{key:"componentWillUnmount",value:function(){e.delete(this),n(this)}},{key:"render",value:function(){return null}}]),c}(h.Component))}},KeDb:function(t,e,n){"use strict";var r=n("zQIG"),i=n("8mBC"),o=n("I/kN"),a=n("cMav"),s=n("pSQP");function u(t){var e=function(){if("undefined"===typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"===typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}();return function(){var n,r=s(t);if(e){var i=s(this).constructor;n=Reflect.construct(r,arguments,i)}else n=r.apply(this,arguments);return a(this,n)}}var c=n("Y3ZS"),l=n("pONU");e.__esModule=!0,e.default=void 0;var h,d=l(n("ERkP")),f=n("cRaD"),p=n("fvxO"),v=c(n("7xIC")),m=n("L9lV");function g(t){return t&&"object"===typeof t?(0,p.formatWithValidation)(t):t}var w=new Map,y=window.IntersectionObserver,E={};function b(){return h||(y?h=new y((function(t){t.forEach((function(t){if(w.has(t.target)){var e=w.get(t.target);(t.isIntersecting||t.intersectionRatio>0)&&(h.unobserve(t.target),w.delete(t.target),e())}}))}),{rootMargin:"200px"}):void 0)}var _=function(t){o(n,t);var e=u(n);function n(t){var i;return r(this,n),(i=e.call(this,t)).p=void 0,i.cleanUpListeners=function(){},i.formatUrls=function(t){var e=null,n=null,r=null;return function(i,o){if(r&&i===e&&o===n)return r;var a=t(i,o);return e=i,n=o,r=a,a}}((function(t,e){return{href:(0,m.addBasePath)(g(t)),as:e?(0,m.addBasePath)(g(e)):e}})),i.linkClicked=function(t){var e=t.currentTarget,n=e.nodeName,r=e.target;if("A"!==n||!(r&&"_self"!==r||t.metaKey||t.ctrlKey||t.shiftKey||t.nativeEvent&&2===t.nativeEvent.which)){var o=i.formatUrls(i.props.href,i.props.as),a=o.href,s=o.as;if(function(t){var e=(0,f.parse)(t,!1,!0),n=(0,f.parse)((0,p.getLocationOrigin)(),!1,!0);return!e.host||e.protocol===n.protocol&&e.host===n.host}(a)){var u=window.location.pathname;a=(0,f.resolve)(u,a),s=s?(0,f.resolve)(u,s):a,t.preventDefault();var c=i.props.scroll;null==c&&(c=s.indexOf("#")<0),v.default[i.props.replace?"replace":"push"](a,s,{shallow:i.props.shallow}).then((function(t){t&&c&&(window.scrollTo(0,0),document.body.focus())}))}}},i.p=!1!==t.prefetch,i}return i(n,[{key:"componentWillUnmount",value:function(){this.cleanUpListeners()}},{key:"getPaths",value:function(){var t=window.location.pathname,e=this.formatUrls(this.props.href,this.props.as),n=e.href,r=e.as,i=(0,f.resolve)(t,n);return[i,r?(0,f.resolve)(t,r):i]}},{key:"handleRef",value:function(t){var e=this;this.p&&y&&t&&t.tagName&&(this.cleanUpListeners(),E[this.getPaths().join("%")]||(this.cleanUpListeners=function(t,e){var n=b();return n?(n.observe(t),w.set(t,e),function(){try{n.unobserve(t)}catch(e){console.error(e)}w.delete(t)}):function(){}}(t,(function(){e.prefetch()}))))}},{key:"prefetch",value:function(t){if(this.p){var e=this.getPaths();v.default.prefetch(e[0],e[1],t).catch((function(t){0})),E[e.join("%")]=!0}}},{key:"render",value:function(){var t=this,e=this.props.children,n=this.formatUrls(this.props.href,this.props.as),r=n.href,i=n.as;"string"===typeof e&&(e=d.default.createElement("a",null,e));var o=d.Children.only(e),a={ref:function(e){t.handleRef(e),o&&"object"===typeof o&&o.ref&&("function"===typeof o.ref?o.ref(e):"object"===typeof o.ref&&(o.ref.current=e))},onMouseEnter:function(e){o.props&&"function"===typeof o.props.onMouseEnter&&o.props.onMouseEnter(e),t.prefetch({priority:!0})},onClick:function(e){o.props&&"function"===typeof o.props.onClick&&o.props.onClick(e),e.defaultPrevented||t.linkClicked(e)}};return!this.props.passHref&&("a"!==o.type||"href"in o.props)||(a.href=i||r),d.default.cloneElement(o,a)}}]),n}(d.Component);e.default=_},S95l:function(t,e,n){!function(t){"use strict";var e=function(t,e,n){return function(t){function e(){return t.exports=e=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(t[r]=n[r])}return t},e.apply(this,arguments)}t.exports=e}(n={path:void 0,exports:{},require:function(t,e){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==e&&n.path)}},n.exports),n.exports}(),n=function(t,e){if(null==t)return{};var n,r,i={},o=Object.keys(t);for(r=0;r<o.length;r++)n=o[r],e.indexOf(n)>=0||(i[n]=t[n]);return i},r=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t},i=function(t,e){t.prototype=Object.create(e.prototype),t.prototype.constructor=t,t.__proto__=e};function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var a=function(t,e){return void 0===e&&(e=2),+t.toFixed(e)},s=function(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},u=function(t){return t.replace(/-([a-z])/g,(function(t,e){return e.toUpperCase()}))},c=function(t){return"data:image/svg+xml;base64,"+btoa(t)},l="http://www.w3.org/2000/svg",h=function(t,e){var n=document.createElementNS(l,"svg");return n.setAttributeNS(null,"version","1.1"),n.setAttribute("xmlns",l),n.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),Object.keys(t).sort().map((function(e){n.setAttribute(e,t[e])})),e.map((function(t){n.appendChild(t)})),n},d=function(t,e){var n=document.createElementNS(l,t);return Object.keys(e).sort().map((function(t){n.setAttribute(t,e[t])})),n},f={png:"image/png",jpg:"image/jpeg",svg:"image/svg+xml"},p=function(t){for(var e=t.data,n=t.extension,r=t.filename,i=atob(e.replace(/^.*,/,"")),o=new Uint8Array(i.length),a=0;a<i.length;a+=1)o[a]=i.charCodeAt(a);var s=r||Date.now()+"."+n,u=new Blob([o.buffer],{type:f[n]});if(window.navigator.msSaveBlob)window.navigator.msSaveBlob(u,s);else if(window.URL&&window.URL.createObjectURL){var c=document.createElement("a");c.download=s,c.href=window.URL.createObjectURL(u),document.body.appendChild(c),c.click(),document.body.removeChild(c)}else window.open(e,"_blank")},v=function(){function t(t,e){this.x=t,this.y=e}var e=t.prototype;return e.toVector=function(){var t=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)),e=Math.atan2(this.y,this.x);return new w(t,e)},e.scale=function(e){return new t(this.x*e,this.y*e)},e.add=function(e){return new t(this.x+e.x,this.y+e.y)},e.sub=function(e){return new t(this.x-e.x,this.y-e.y)},e.eql=function(t){return this.x===t.x&&this.y===t.y},e.clone=function(){return new t(this.x,this.y)},t}(),m={MOVE:"M",MOVE_RELATIVE:"m",LINE:"L",LINE_RELATIVE:"l",CURVE:"C",CURVE_RELATIVE:"c",CLOSE:"Z",HORIZONTAL:"H",HORIZONTAL_RELATIVE:"h",VERTICAL:"V",VERTICAL_RELATIVE:"v",ARC_CURVE:"A",ARC_CURVE_RELATIVE:"a",QUADRATIC_CURVE:"Q",QUADRATIC_CURVE_RELATIVE:"q"},g=function(){function t(t,e){void 0===e&&(e=[]),this.value=e,this.type=t}var e=t.prototype;return e.toString=function(){return this.type===m.CLOSE?m.CLOSE:this.type+" "+this.value.map((function(t){return a(t)})).join(" ")},e.scale=function(e){return new t(this.type,this.value.map((function(t){return t*e})))},e.clone=function(){return new t(this.type,this.value.slice())},function(t,e,n){e&&o(t.prototype,e),n&&o(t,n)}(t,[{key:"cr",set:function(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(2,1,t.x),this.value.splice(3,1,t.y)))},get:function(){if(("C"===this.type||"c"===this.type)&&6===this.value.length){var t=this.value.slice(2,4),e=t[0],n=t[1];return new v(e,n)}}},{key:"cl",set:function(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(0,1,t.x),this.value.splice(1,1,t.y)))},get:function(){if(("C"===this.type||"c"===this.type)&&6===this.value.length){var t=this.value.slice(0,2),e=t[0],n=t[1];return new v(e,n)}}},{key:"point",set:function(t){t&&(this.value.splice(this.value.length-2,1,t.x),this.value.splice(this.value.length-1,1,t.y))},get:function(){var t=this.value.slice(this.value.length-2);return 2===t.length?new v(t[0],t[1]):void 0}}]),t}(),w=function(){function t(t,e){this.value=t,this.angle=e}var e=t.prototype;return e.toPoint=function(){var t=Math.cos(this.angle)*this.value,e=Math.sin(this.angle)*this.value;return new v(t,e)},e.scale=function(e){return new t(this.value*e,this.angle)},t}(),y=function(){function t(t){var e=void 0===t?{}:t,r=e.d,i=n(e,["d"]);this.attrs=i,this.commands=[],r&&this.parseCommandString(r)}var r=t.prototype;return r.scale=function(t){return this.commands=this.commands.map((function(e){return e.scale(t)})),this.attrs.strokeWidth=String(t*+(this.attrs.strokeWidth||0)),this},r.addCommand=function(t){var e;return Array.isArray(t)?(e=this.commands).push.apply(e,t):this.commands.push(t),this},r.getCommandString=function(){return 0===this.commands.length?"":this.commands.map((function(t,e){return t.toString()})).join(" ").trim()},r.parseCommandString=function(t){this.commands=[];for(var e,n=null,r=[],i=t.split(" "),o=function(t){return Object.values(m).includes(t)?t:null},a=0;a<i.length;a+=1){var s=o(i[a]);if(s){if(!n){n=s;continue}this.commands.push(new g(n,r)),n=s,r=[]}else{if((e=+i[a])!=e)return;r.push(+i[a])}}null!==n&&this.commands.push(new g(n,r))},r.parsePathElement=function(t){for(var n=0;n<t.attributes.length;n+=1){var r,i=t.attributes.item(n);i&&i.value&&("d"!==i.name?this.attrs=e({},this.attrs,((r={})[u(i.name)]=i.value,r)):this.parseCommandString(i.value))}return this},r.toJson=function(){return e({},this.attrs,{d:this.getCommandString()})},r.toElement=function(){var t=Object.entries(this.attrs).reduce((function(t,n,r){var i,o=n[0],a=n[1];return a?e({},t,((i={})[s(o)]=a,i)):t}),{});return d("path",e({},t,{d:this.getCommandString()}))},r.clone=function(){var e=new t(this.attrs);return this.commands.map((function(t){e.commands.push(t.clone())})),e},t}(),E=function(){function t(t){var e=t.width,n=t.height,r=t.background;this.paths=[],this.width=e,this.height=n,this.background=r}var n=t.prototype;return n.scalePath=function(t){if(1!==t)for(var e=0;e<this.paths.length;e+=1)this.paths[e].scale(t);return this},n.addPath=function(t){var e;return Array.isArray(t)?(e=this.paths).push.apply(e,t):this.paths.push(t),this},n.clonePaths=function(){return this.paths.map((function(t){return t.clone()}))},n.updatePath=function(t,e){var n=e||this.paths.length-1;return n<0&&this.paths.push(t),this.paths[n]=t,this},n.toJson=function(){return{width:this.width,height:this.height,background:this.background,paths:this.paths.map((function(t){return t.toJson()}))}},n.copy=function(t){return this.paths=t.clonePaths(),t.width&&this.width&&this.scalePath(this.width/t.width),this},n.toElement=function(){var t={width:String(this.width),height:String(this.height)},n=this.background?[d("rect",e({},t,{fill:this.background}))]:[];return h({width:String(this.width),height:String(this.height)},n.concat(this.paths.map((function(t){return t.toElement()}))))},n.toBase64=function(){return c(this.toElement().outerHTML)},n.parseSVGString=function(t){var e=(new DOMParser).parseFromString(t,"image/svg+xml").querySelector("svg");return e?this.parseSVGElement(e):(this.paths=[],this)},n.parseSVGElement=function(t){var e=[];t.querySelectorAll("path").forEach((function(t){var n=(new y).parsePathElement(t);0!==n.commands.length&&e.push(n)})),this.paths=e;var n=Number(t.getAttribute("width"));return n&&this.width&&this.scalePath(this.width/n),this},n.download=function(t,e){var n=this;if(void 0===t&&(t="svg"),void 0===e&&(e=p),"svg"!==t){var r=new Image;r.addEventListener("load",(function(){var i=document.createElement("canvas");i.setAttribute("width",String(n.width)),i.setAttribute("height",String(n.height));var o=i.getContext("2d");o&&((n.background||"jpg"===t)&&(o.fillStyle=n.background||"#fff",o.fillRect(0,0,n.width,n.height)),o.drawImage(r,0,0),e("png"===t?{data:i.toDataURL("image/png"),extension:"png"}:{data:i.toDataURL("image/jpeg"),extension:"jpg"}))}),!1),r.src=this.toBase64()}else e({data:this.toBase64(),extension:"svg"})},t}(),b=function(t){function n(n,r){var i;void 0===r&&(r={});var o=n.getBoundingClientRect(),a=o.width,s=o.height,u=o.left,c=o.top;return(i=t.call(this,e({width:a,height:s},r))||this).el=n,i.left=u,i.top=c,n.appendChild(i.toElement()),i._setupAdjustResize(),i}i(n,t);var r=n.prototype;return r.update=function(){this.el.replaceChild(this.toElement(),this.el.childNodes[0])},r.resizeElement=function(t){var e=t||this.el.getBoundingClientRect(),n=e.width,r=e.height,i=e.left,o=e.top;this.scalePath(n/this.width),this.width=n,this.height=r,this.left=i,this.top=o},r._setupAdjustResize=function(){var t=this;window.ResizeObserver?new window.ResizeObserver((function(e){t.resizeElement(e[0].contentRect),t.update()})).observe(this.el):window.addEventListener("resize",(function(e){t.resizeElement(t.el.getBoundingClientRect()),t.update()}))},n}(E),_=function(){function t(t){var e=(void 0===t?{}:t).ratio;this.ratio=null!=e?e:.2}var e=t.prototype;return e._controlPoint=function(t,e,n){var r=n.sub(t).toVector().scale(this.ratio).toPoint(),i=e.add(r);return[i.x,i.y]},e.createCommand=function(t,e,n,r){var i=[].concat(this._controlPoint(t,e,n),this._controlPoint(r,n,e),[n.x,n.y]);return new g(m.CURVE,i)},t}();function C(t,e,n){var r,i,o;void 0===n&&(n={});var a=null,s=0,u=function(){s=!1===n.leading?0:Date.now(),a=null,o=t.apply(r,i),a||(r=null,i=null)},c=function(){a&&(clearTimeout(a),a=null)};return function(){var l=Date.now();s||!1!==n.leading||(s=l);var h=e-(l-s);r=this;for(var d=arguments.length,f=new Array(d),p=0;p<d;p++)f[p]=arguments[p];return i=f,h<=0||h>e?(c(),s=l,o=t.apply(r,i),a||(r=null,i=null)):a||!1===n.trailing||(a=setTimeout(u,h)),o}}var L=function(t){function o(i,o){var a,s=void 0===o?{}:o,u=s.penColor,c=s.penWidth,l=s.curve,h=s.close,d=s.delay,f=s.fill,p=n(s,["penColor","penWidth","curve","close","delay","fill"]);return(a=t.call(this,i,e({},p))||this).penColor=null!=u?u:"#000",a.penWidth=null!=c?c:1,a.curve=null==l||l,a.close=null!=h&&h,a.delay=null!=d?d:20,a.fill=null!=f?f:"none",a.bezier=new _,a._drawPath=null,a._listenerOption=function(t){void 0===t&&(t=!0);try{var e=function(){return null};return window.addEventListener("testPassive",e,{passive:t}),window.removeEventListener("testPassive",e),{passive:t}}catch(t){return!1}}(!1),a._clearPointListener=null,a._clearMouseListener=null,a._clearTouchListener=null,a.drawingMove=a.drawingMove.bind(r(a)),a.on(),a}i(o,t);var a=o.prototype;return a.clear=function(){this.paths=[],this.update()},a.undo=function(){this.paths.pop(),this.update()},a.changeDelay=function(t){this.delay=t,this.on()},a.on=function(){this.off(),window.PointerEvent?this._setupPointEventListener():this._setupMouseEventListener(),"ontouchstart"in window&&this._setupTouchEventListener()},a.off=function(){[this._clearPointListener,this._clearMouseListener,this._clearTouchListener].map((function(t){t&&(t(),t=null)}))},a.drawingStart=function(){this._drawPath||(this._drawPath=this._createDrawPath(),this.addPath(this._drawPath))},a.drawingMove=function(t){var e=t.x,n=t.y;if(this._drawPath){var r=this._createDrawPoint({x:e,y:n});this._addDrawPoint(r),(this._drawPath.attrs.strokeWidth&&+this._drawPath.attrs.strokeWidth!==this.penWidth||this._drawPath.attrs.stroke!==this.penColor)&&(this._drawPath=this._createDrawPath(),this._addDrawPoint(r),this.addPath(this._drawPath)),this.update()}},a.drawingEnd=function(){this.close&&this._drawPath&&this._drawPath.commands.push(new g(m.CLOSE)),this._drawPath=null,this.update()},a._addDrawPoint=function(t){if(this._drawPath){var e=this._drawPath.commands;if(0!==e.length&&e[e.length-1].type!==m.CLOSE)if(!this.curve||e.length<2)e.push(new g(m.LINE,t));else{var n=2===e.length?e[e.length-2].point:e[e.length-3].point,r=e[e.length-2].point,i=e[e.length-1].point;if(n&&r&&i){var o=new v(t[0],t[1]);e[e.length-1]=this.bezier.createCommand(n,r,i,o),e.push(this.bezier.createCommand(r,i,o,o))}else e.push(new g(m.LINE,t))}else e.push(new g(m.MOVE,t))}},a._createDrawPath=function(){return this.resizeElement(),new y({stroke:this.penColor,strokeWidth:String(this.penWidth),fill:this.fill,strokeLinecap:this.curve?"round":"mitter",strokeLinejoin:this.curve?"round":"square"})},a._createDrawPoint=function(t){var e=t.x,n=t.y;return[e-this.left,n-this.top]},a._handleMouseOrPoint=function(t){return function(e){e.preventDefault(),t({x:e.clientX,y:e.clientY})}},a._setupPointEventListener=function(){var t=this,e=this._handleMouseOrPoint((function(e){t.drawingStart(),t.el.addEventListener("pointermove",n,t._listenerOption),t.el.addEventListener("pointerup",r,t._listenerOption),t.el.addEventListener("pointerleave",r,t._listenerOption),t.el.addEventListener("pointercancel",r,t._listenerOption)})),n=C(this._handleMouseOrPoint(this.drawingMove),this.delay),r=this._handleMouseOrPoint((function(e){t.el.removeEventListener("pointermove",n),t.el.removeEventListener("pointerup",r),t.el.removeEventListener("pointerleave",r),t.el.addEventListener("pointercancel",r),t.drawingEnd()}));this.el.addEventListener("pointerdown",e,this._listenerOption),this._clearPointListener=function(){return t.el.removeEventListener("pointerdown",e)}},a._setupMouseEventListener=function(){var t=this,e=this._handleMouseOrPoint((function(e){t.drawingStart(),t.el.addEventListener("mousemove",n,t._listenerOption),t.el.addEventListener("mouseup",r,t._listenerOption),t.el.addEventListener("mouseleave",r,t._listenerOption)})),n=C(this._handleMouseOrPoint(this.drawingMove),this.delay),r=this._handleMouseOrPoint((function(e){t.el.removeEventListener("mousemove",n),t.el.removeEventListener("mouseup",r),t.el.removeEventListener("mouseleave",r),t.drawingEnd()}));this.el.addEventListener("mousedown",e,this._listenerOption),this._clearMouseListener=function(){return t.el.removeEventListener("mousedown",e)}},a._setupTouchEventListener=function(){var t=this,e=function(t){return function(e){e.preventDefault();var n=e.touches[0];t({x:n.clientX,y:n.clientY})}},n=e((function(e){t.drawingStart(),t.el.addEventListener("touchmove",r,t._listenerOption),t.el.addEventListener("touchend",i,t._listenerOption)})),r=C(e(this.drawingMove),this.delay),i=e((function(e){t.el.removeEventListener("touchmove",r),t.el.removeEventListener("touchend",i),t.drawingEnd()}));this.el.addEventListener("touchstart",n,this._listenerOption),this._clearTouchListener=function(){return t.el.removeEventListener("touchstart",n)}},o}(b);t.BezierCurve=_,t.COMMAND_TYPE=m,t.Command=g,t.Path=y,t.Point=v,t.Renderer=b,t.Svg=E,t.SvgDrawing=L,t.Vector=w,t.camel2kebab=s,t.createSvgChildElement=d,t.createSvgElement=h,t.download=p,t.kebab2camel=u,t.roundUp=a,t.svg2base64=c,t.throttle=C,Object.defineProperty(t,"__esModule",{value:!0})}(e)},TZT2:function(t,e,n){"use strict";var r;e.__esModule=!0,e.AmpStateContext=void 0;var i=((r=n("ERkP"))&&r.__esModule?r:{default:r}).default.createContext({});e.AmpStateContext=i},apO0:function(t,e,n){"use strict";var r=n("ERkP"),i=n.n(r),o=n("jvFD"),a=n.n(o),s=n("ysqo"),u=n.n(s),c=n("j/s1"),l=i.a.createElement;function h(){var t,e,n=(t=["\n * {\n   margin: 0;\n }\n"],e||(e=t.slice(0)),Object.freeze(Object.defineProperties(t,{raw:{value:Object.freeze(e)}})));return h=function(){return n},n}var d=Object(c.b)(h()),f=c.c.header.withConfig({displayName:"Layout__Header",componentId:"sc-163up9s-0"})([""]),p=c.c.div.withConfig({displayName:"Layout__Content",componentId:"sc-163up9s-1"})([""]);e.a=function(t){var e=t.children,n=t.title,i=void 0===n?"":n;return l(r.Fragment,null,l(u.a,null,l("title",null,"svg-drawing ".concat(i)),l("meta",{charSet:"utf-8"}),l("meta",{name:"viewport",content:"width=device-width, initial-scale=1.0, user-scalable=no"})),l(d,null),l(f,null,l("h1",null,"svg-drawing"),l("nav",null,l(a.a,{href:"/"},l("a",null,"drawing")),"|",l(a.a,{href:"/img-trace"},l("a",null,"img-trace")),"|",l(a.a,{href:"/react"},l("a",null,"react")),"|",l("a",{href:"https://github.com/kmkzt/svg-drawing"},"GitHub"))),l(p,null,e))}},bOkD:function(t,e,n){var r=n("cHE3");t.exports=function(t){if(Array.isArray(t))return r(t)}},dq4L:function(t,e,n){"use strict";e.__esModule=!0,e.isInAmpMode=a,e.useAmp=function(){return a(i.default.useContext(o.AmpStateContext))};var r,i=(r=n("ERkP"))&&r.__esModule?r:{default:r},o=n("TZT2");function a(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.ampFirst,n=void 0!==e&&e,r=t.hybrid,i=void 0!==r&&r,o=t.hasQuery;return n||i&&(void 0!==o&&o)}},"iN+R":function(t,e,n){var r=n("bOkD"),i=n("DSo7"),o=n("D7XE"),a=n("uYlf");t.exports=function(t){return r(t)||i(t)||o(t)||a()}},jvFD:function(t,e,n){t.exports=n("KeDb")},lEbO:function(t,e,n){"use strict";function r(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}n.d(e,"a",(function(){return r}))},uYlf:function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},ysqo:function(t,e,n){"use strict";e.__esModule=!0,e.defaultHead=c,e.default=void 0;var r=u(n("ERkP")),i=u(n("J9Yr")),o=n("TZT2"),a=n("op+c"),s=n("dq4L");function u(t){return t&&t.__esModule?t:{default:t}}function c(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=[r.default.createElement("meta",{charSet:"utf-8"})];return t||e.push(r.default.createElement("meta",{name:"viewport",content:"width=device-width"})),e}function l(t,e){return"string"===typeof e||"number"===typeof e?t:e.type===r.default.Fragment?t.concat(r.default.Children.toArray(e.props.children).reduce((function(t,e){return"string"===typeof e||"number"===typeof e?t:t.concat(e)}),[])):t.concat(e)}var h=["name","httpEquiv","charSet","itemProp"];function d(t,e){return t.reduce((function(t,e){var n=r.default.Children.toArray(e.props.children);return t.concat(n)}),[]).reduce(l,[]).reverse().concat(c(e.inAmpMode)).filter(function(){var t=new Set,e=new Set,n=new Set,r={};return function(i){var o=!0;if(i.key&&"number"!==typeof i.key&&i.key.indexOf("$")>0){var a=i.key.slice(i.key.indexOf("$")+1);t.has(a)?o=!1:t.add(a)}switch(i.type){case"title":case"base":e.has(i.type)?o=!1:e.add(i.type);break;case"meta":for(var s=0,u=h.length;s<u;s++){var c=h[s];if(i.props.hasOwnProperty(c))if("charSet"===c)n.has(c)?o=!1:n.add(c);else{var l=i.props[c],d=r[c]||new Set;d.has(l)?o=!1:(d.add(l),r[c]=d)}}}return o}}()).reverse().map((function(t,e){var n=t.key||e;return r.default.cloneElement(t,{key:n})}))}var f=(0,i.default)();function p(t){var e=t.children;return(r.default.createElement(o.AmpStateContext.Consumer,null,(function(t){return r.default.createElement(a.HeadManagerContext.Consumer,null,(function(n){return r.default.createElement(f,{reduceComponentsToState:d,handleStateChange:n,inAmpMode:(0,s.isInAmpMode)(t)},e)}))})))}p.rewind=f.rewind;var v=p;e.default=v}}]);