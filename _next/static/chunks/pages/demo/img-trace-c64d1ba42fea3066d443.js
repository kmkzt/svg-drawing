(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[106],{5128:function(t,n,e){"use strict";var i,r=e(1171),a=e(1628),o=e(7729),s=e(9097),h=e(2784),u=e(6451),l=e(4149),c=e(2322),d=(0,l.createGlobalStyle)(i||(i=(0,r.Z)(["\n body, * {\n   margin: 0;\n   box-sizing: border-box;\n }\n\n  a {\n    color: initial;\n    text-decoration: initial;\n  }\n"]))),p=function(){return(0,c.jsx)(u.xu,{bg:"#fafafa",py:"8px",px:"16px",children:(0,c.jsxs)(u.kC,{justifyContent:"space-between",children:[(0,c.jsx)(u.xu,{width:.3,children:(0,c.jsx)(s.default,{href:"/",children:(0,c.jsx)("a",{children:(0,c.jsx)(u.xv,{fontSize:3,as:"h1",style:{whiteSpace:"nowrap"},children:"svg-drawing"})})})}),(0,c.jsxs)(u.kC,{as:"nav",alignContent:"center",width:.6,children:[(0,c.jsx)(s.default,{href:"/",children:(0,c.jsx)("a",{children:(0,c.jsx)(u.xv,{mr:2,children:"drawing"})})}),(0,c.jsx)(u.xv,{mr:2,children:(0,c.jsx)(s.default,{href:"/demo/animation",children:(0,c.jsx)("a",{children:"animation"})})}),(0,c.jsx)(u.xv,{mr:2,children:(0,c.jsx)(s.default,{href:"/demo/img-trace",children:(0,c.jsx)("a",{children:"img-trace"})})})]}),(0,c.jsx)(u.xu,{width:.1,style:{textAlign:"right"},children:(0,c.jsx)(u.rU,{color:"#000",href:"https://github.com/kmkzt/svg-drawing",children:(0,c.jsx)(a.X,{size:"24"})})})]})})};n.Z=function(t){var n=t.children,e=t.title,i=void 0===e?"":e;return(0,c.jsxs)(h.Fragment,{children:[(0,c.jsx)(o.default,{children:(0,c.jsx)("title",{children:"svg-drawing ".concat(i)})}),(0,c.jsx)(d,{}),(0,c.jsx)(p,{}),(0,c.jsx)(u.xu,{py:"12px",px:["2vw","2vw","5vw"],children:n})]})}},8171:function(t,n,e){"use strict";e.r(n),e.d(n,{default:function(){return C}});var i=e(926);var r=e(9147);function a(t){return function(t){if(Array.isArray(t))return(0,i.Z)(t)}(t)||function(t){if("undefined"!==typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||(0,r.Z)(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var o=e(6666);function s(t,n,e,i,r,a,o){try{var s=t[a](o),h=s.value}catch(u){return void e(u)}s.done?n(h):Promise.resolve(h).then(i,r)}function h(t){return function(){var n=this,e=arguments;return new Promise((function(i,r){var a=t.apply(n,e);function o(t){s(a,i,r,o,h,"next",t)}function h(t){s(a,i,r,o,h,"throw",t)}o(void 0)}))}}var u=e(7162),l=e.n(u),c=e(2755),d=e(5793),p=e(5087),f=e(2784),v=e(6451),g=e(5128),m=e(4406).env.BASE_PATH||"",w=e(2322);function b(t,n){var e=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);n&&(i=i.filter((function(n){return Object.getOwnPropertyDescriptor(t,n).enumerable}))),e.push.apply(e,i)}return e}function y(t){for(var n=1;n<arguments.length;n++){var e=null!=arguments[n]?arguments[n]:{};n%2?b(Object(e),!0).forEach((function(n){(0,o.Z)(t,n,e[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(e)):b(Object(e)).forEach((function(n){Object.defineProperty(t,n,Object.getOwnPropertyDescriptor(e,n))}))}return t}var x=["/img_trace/cat.jpg","/img_trace/harinezumi.jpg","/img_trace/kuma.jpg","/img_trace/panda.png","/img_trace/risu.jpg","/img_trace/tanuki.jpg"].map((function(t){return"".concat(m).concat(t)})),_=[{r:0,g:0,b:0,a:255},{r:50,g:50,b:50,a:255},{r:100,g:100,b:100,a:255},{r:150,g:150,b:150,a:255},{r:200,g:200,b:200,a:255}],C=function(){var t=(0,f.useState)(x),n=t[0],e=t[1],i=(0,f.useState)(_),r=i[0],o=i[1],s=(0,f.useState)(),u=s[0],m=s[1],b=(0,f.useState)({numberOfColors:8,colorQuantCycles:3})[0],C=(0,f.useState)({})[0],E=(0,f.useState)(x[0]),j=E[0],P=E[1],M=(0,f.useState)(""),L=M[0],O=M[1],k=(0,f.useState)(),S=k[0],A=k[1],R=(0,f.useRef)(null),z=(0,f.useRef)(null),I=(0,f.useCallback)((function(t){O(t.target.value)}),[O]),D=(0,f.useCallback)((function(){u&&o(p.Palette.imageData(u,b))}),[b,o,u]),T=(0,f.useCallback)((function(){o(_)}),[o]),V=(0,f.useCallback)((function(t){return function(){var n=r.filter((function(n,e){return e!==t}));o(n)}}),[o,r]),U=(0,f.useCallback)(h(l().mark((function t(){var n,e,i;return l().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(t.prev=0,t.t0=u,t.t0){t.next=6;break}return t.next=5,new p.ImgLoader({corsenabled:!0}).fromUrl(j);case 5:t.t0=t.sent;case 6:if(n=t.t0,!u&&n&&m(n),n){t.next=10;break}return t.abrupt("return");case 10:e=new p.ImgTrace(y(y({},C),{},{palettes:r})),i=e.load(n),A(i),e.palettes&&o(e.palettes),t.next=18;break;case 16:t.prev=16,t.t1=t.catch(0);case 18:case"end":return t.stop()}}),t,null,[[0,16]])}))),[j,u,r,C]);(0,f.useEffect)((function(){if(z.current){var t=function(){if(z.current&&S){var t=new d.Renderer(z.current),n=z.current.getBoundingClientRect(),e=n.width,i=n.height;S.resize({width:e,height:i}),t.update(S.toJson())}};return t(),window.addEventListener("resize",t),function(){return window.removeEventListener("resize",t)}}}),[S]);var N=(0,f.useCallback)((function(t){return function(){P(t),n.includes(t)||e([].concat(a(n),[t]))}}),[P,n]),q=(0,f.useCallback)((function(){S&&(0,d.download)(S)}),[S]);return(0,f.useEffect)((function(){R.current&&(R.current.onload=function(){R.current&&new p.ImgLoader({corsenabled:!0}).fromImageElement(R.current,m)})}),[m]),(0,w.jsxs)(g.Z,{children:[(0,w.jsxs)(v.kC,{justifyContent:"start",flexWrap:"wrap",children:[(0,w.jsxs)(v.xu,{mb:3,children:[(0,w.jsx)(v.zx,{mr:2,mb:2,onClick:D,children:"Load Image Palette!"}),(0,w.jsx)(v.zx,{mr:2,mb:2,onClick:T,children:"GrayScale Palette!"}),(0,w.jsx)(v.kC,{justifyContent:"start",py:"2px",px:"0",children:r.sort((function(t,n){return t.r+t.g+t.b>n.r+n.g+n.b?-1:1})).map((function(t,n){return(0,w.jsx)("div",{style:{width:30,height:30,margin:2,position:"relative",backgroundColor:"rgba(".concat(t.r,", ").concat(t.g,", ").concat(t.b,", ").concat(t.a/255,")")},children:(0,w.jsx)("div",{style:{position:"absolute",background:"#fff",bottom:2,left:2,width:8,lineHeight:"8px",textAlign:"center",fontSize:3,cursor:"pointer"},onMouseUp:V(n),children:"x"})},n)}))})]}),(0,w.jsxs)(v.xu,{mb:3,children:[(0,w.jsx)(v.zx,{mr:2,mb:2,variant:"secondary",onClick:U,children:"Image Trace!"}),S&&(0,w.jsx)(v.zx,{mr:2,mb:2,onClick:q,children:"Download"}),(0,w.jsxs)(v.kC,{justifyContent:"start",flexWrap:"wrap",children:[(0,w.jsx)(v.xu,{width:["80vw","80vw","30vw"],height:["80vw","80vw","30vw"],children:(0,w.jsx)(v.Ee,{width:"100%",ref:R,crossOrigin:"anonymous",src:j,alt:""})}),(0,w.jsx)(v.xu,{width:["80vw","80vw","30vw"],height:["80vw","80vw","30vw"],children:(0,w.jsx)("div",{style:{width:"100%",height:"100%"},ref:z})})]})]})]}),(0,w.jsxs)(v.xu,{as:"fieldset",children:[(0,w.jsx)(v.X6,{children:"Select Image"}),(0,w.jsxs)(v.xu,{children:[(0,w.jsx)(c.II,{type:"text",placeholder:"input image url",value:L,onChange:I}),(0,w.jsx)(v.zx,{onClick:N(L),children:"Load image url"})]}),(0,w.jsx)(v.kC,{flexWrap:"wrap",children:n.map((function(t,n){return(0,w.jsx)(v.Zb,{width:"256px",children:(0,w.jsx)(v.Ee,{src:t,alt:t,onClick:N(t)})},n)}))})]})]})}},8931:function(t,n,e){(window.__NEXT_P=window.__NEXT_P||[]).push(["/demo/img-trace",function(){return e(8171)}])},5793:function(t,n){!function(t){"use strict";function n(){return(n=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}function e(t,n){for(var e=0;e<n.length;e++){var i=n[e];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(t,i.key,i)}}var i=function(t){return t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase()},r=function(t,n){return void 0===n&&(n=2),+t.toFixed(n)},a=function(t){return t.replace(/-([a-z])/g,(function(t,n){return n.toUpperCase()}))},o=function(t,n){return Math.trunc(t)===Math.trunc(n)},s=function(t){return t!=t},h=function(){function t(t,n){this.x=t,this.y=n}var n=t.prototype;return n.toVector=function(){var t=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)),n=Math.atan2(this.y,this.x);return new c(t,n)},n.scale=function(n){return new t(this.x*n,this.y*n)},n.add=function(n){return new t(this.x+n.x,this.y+n.y)},n.sub=function(n){return new t(this.x-n.x,this.y-n.y)},n.eql=function(t){return this.x===t.x&&this.y===t.y},n.clone=function(){return new t(this.x,this.y)},t}(),u={MOVE:"M",MOVE_RELATIVE:"m",LINE:"L",LINE_RELATIVE:"l",CURVE:"C",CURVE_RELATIVE:"c",CLOSE:"Z",HORIZONTAL:"H",HORIZONTAL_RELATIVE:"h",VERTICAL:"V",VERTICAL_RELATIVE:"v",ARC_CURVE:"A",ARC_CURVE_RELATIVE:"a",QUADRATIC_CURVE:"Q",QUADRATIC_CURVE_RELATIVE:"q"},l=function(){function t(t,n){void 0===n&&(n=[]),this.value=n,this.type=t}var n,i,a,o=t.prototype;return o.toString=function(){return this.type===u.CLOSE?u.CLOSE:this.type+" "+this.value.map((function(t){return r(t)})).join(" ")},o.scale=function(n){return new t(this.type,this.value.map((function(t){return t*n})))},o.clone=function(){return new t(this.type,this.value.slice())},n=t,(i=[{key:"cr",set:function(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(2,1,t.x),this.value.splice(3,1,t.y)))},get:function(){if(("C"===this.type||"c"===this.type)&&6===this.value.length){var t=this.value.slice(2,4),n=t[0],e=t[1];return new h(n,e)}}},{key:"cl",set:function(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(0,1,t.x),this.value.splice(1,1,t.y)))},get:function(){if(("C"===this.type||"c"===this.type)&&6===this.value.length){var t=this.value.slice(0,2),n=t[0],e=t[1];return new h(n,e)}}},{key:"point",set:function(t){t&&(this.value.splice(this.value.length-2,1,t.x),this.value.splice(this.value.length-1,1,t.y))},get:function(){var t=this.value.slice(this.value.length-2);return 2===t.length?new h(t[0],t[1]):void 0}}])&&e(n.prototype,i),a&&e(n,a),t}(),c=function(){function t(t,n){this.value=t,this.angle=n}var n=t.prototype;return n.toPoint=function(){var t=Math.cos(this.angle)*this.value,n=Math.sin(this.angle)*this.value;return new h(t,n)},n.scale=function(n){return new t(this.value*n,this.angle)},t}(),d=function(){function t(t){var n=void 0===t?{}:t,e=n.d,i=function(t,n){if(null==t)return{};var e,i,r={},a=Object.keys(t);for(i=0;i<a.length;i++)e=a[i],n.indexOf(e)>=0||(r[e]=t[e]);return r}(n,["d"]);this.attrs=i,this.commands=[],e&&this.parseCommandString(e)}var e=t.prototype;return e.scale=function(t){return this.commands=this.commands.map((function(n){return n.scale(t)})),this.attrs.strokeWidth=String(t*+(this.attrs.strokeWidth||0)),this},e.addCommand=function(t){var n;return Array.isArray(t)?(n=this.commands).push.apply(n,t):this.commands.push(t),this},e.getCommandString=function(){return 0===this.commands.length?"":this.commands.map((function(t,n){return t.toString()})).join(" ").trim()},e.parseCommandString=function(t){this.commands=[];for(var n=null,e=[],i=t.split(" "),r=function(t){return Object.values(u).includes(t)?t:null},a=0;a<i.length;a+=1){var o=r(i[a]);if(o){if(!n){n=o;continue}this.commands.push(new l(n,e)),n=o,e=[]}else{if(s(+i[a]))return;e.push(+i[a])}}null!==n&&this.commands.push(new l(n,e))},e.parsePathElement=function(t){for(var e=0;e<t.attributes.length;e+=1){var i,r=t.attributes.item(e);r&&r.value&&("d"!==r.name?this.attrs=n({},this.attrs,((i={})[a(r.name)]=r.value,i)):this.parseCommandString(r.value))}return this},e.toJson=function(){return n({},this.attrs,{d:this.getCommandString()})},e.clone=function(){var n=new t(this.attrs);return this.commands.map((function(t){n.commands.push(t.clone())})),n},t}(),p=function(){function t(t){var n=t.width,e=t.height,i=t.background;this.paths=[],this.width=n,this.height=e,this.background=i}var n=t.prototype;return n.resize=function(t){var n=t.width,e=t.height;this.scalePath(n/this.width),this.width=n,this.height=e},n.scalePath=function(t){if(1!==t)for(var n=0;n<this.paths.length;n+=1)this.paths[n].scale(t);return this},n.addPath=function(t){var n;return Array.isArray(t)?(n=this.paths).push.apply(n,t):this.paths.push(t),this},n.clonePaths=function(){return this.paths.map((function(t){return t.clone()}))},n.updatePath=function(t,n){var e=n||this.paths.length-1;return e<0&&this.paths.push(t),this.paths[e]=t,this},n.toJson=function(){return{width:this.width,height:this.height,background:this.background,paths:this.paths.map((function(t){return t.toJson()}))}},n.copy=function(t){return this.paths=t.clonePaths(),t.width&&this.width&&this.scalePath(this.width/t.width),this},n.parseSVGString=function(t){var n=(new DOMParser).parseFromString(t,"image/svg+xml").querySelector("svg");return n?this.parseSVGElement(n):(this.paths=[],this)},n.parseSVGElement=function(t){var n=[];t.querySelectorAll("path").forEach((function(t){var e=(new d).parsePathElement(t);0!==e.commands.length&&n.push(e)})),this.paths=n;var e=Number(t.getAttribute("width"));return e&&this.width&&this.scalePath(this.width/e),this},t}(),f=function(){function t(t){var n=(void 0===t?{}:t).ratio;this.ratio=null!=n?n:.2}var n=t.prototype;return n._controlPoint=function(t,n,e){var i=new h(t.x,t.y),r=new h(n.x,n.y),a=new h(e.x,e.y).sub(i).toVector().scale(this.ratio).toPoint(),o=r.add(a);return[o.x,o.y]},n.bezierCurve=function(t,n,e,i){var r=[].concat(this._controlPoint(t,n,e),this._controlPoint(i,e,n),[e.x,e.y]);return new l(u.CURVE,r)},n.lineCommands=function(t){return t.map((function(t,n){return new l(0===n?u.MOVE:u.LINE,[t.x,t.y])}))},n.bezierCurveCommands=function(t){var n=[];if(t.length<3)return this.lineCommands(t);for(var e=0;e<t.length;e+=1)0!==e?n.push(this.bezierCurve(t[e-2<0?0:e-2],t[e-1],t[e],e<t.length-1?t[e+1]:t[e])):n.push(new l(u.MOVE,[t[e].x,t[e].y]));return n},t}(),v="http://www.w3.org/2000/svg",g=function(t,n){var e=document.createElementNS(v,"svg");return e.setAttributeNS(null,"version","1.1"),e.setAttribute("xmlns",v),e.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),Object.keys(t).sort().map((function(n){e.setAttribute(n,t[n])})),n.map((function(t){e.appendChild(t)})),e},m=function(t,n){var e=document.createElementNS(v,t);return Object.keys(n).sort().map((function(t){e.setAttribute(t,n[t])})),e},w=function(t){var e=Object.entries(t).reduce((function(t,e,r){var a,o=e[0],s=e[1];return s?n({},t,((a={})[i(o)]=s,a)):t}),{});return m("path",e)},b=function(t){var e=t.width,i=t.height,r=t.background,a=t.paths,o={width:String(e),height:String(i)},s=r?[m("rect",n({},o,{fill:r}))]:[];return g(o,[].concat(s,a.map(w)))},y=function(){function t(t,n){var e=(void 0===n?{}:n).background;this.el=t;var i=t.getBoundingClientRect(),r=i.width,a=i.height;t.appendChild(b({background:e,width:r,height:a,paths:[]}))}return t.prototype.update=function(t){this.el.replaceChild(b(t),this.el.childNodes[0])},t}(),x=function(t){return _(b(t).outerHTML)},_=function(t){return"data:image/svg+xml;base64,"+btoa(t)},C={png:"image/png",jpg:"image/jpeg",svg:"image/svg+xml"},E=function(t){for(var n=t.data,e=t.extension,i=t.filename,r=atob(n.replace(/^.*,/,"")),a=new Uint8Array(r.length),o=0;o<r.length;o+=1)a[o]=r.charCodeAt(o);var s=i||Date.now()+"."+e,h=new Blob([a.buffer],{type:C[e]});if(window.navigator.msSaveBlob)window.navigator.msSaveBlob(h,s);else if(window.URL&&window.URL.createObjectURL){var u=document.createElement("a");u.download=s,u.href=window.URL.createObjectURL(h),document.body.appendChild(u),u.click(),document.body.removeChild(u)}else window.open(n,"_blank")},j={extension:"svg"},P=function(t,e,i){void 0===e&&(e=j),void 0===i&&(i=E);var r=n({},j,e),a=r.filename,o=r.extension,s=x(t.toJson());if("svg"!==o){var h=t.width,u=t.height,l=t.background,c=new Image;c.addEventListener("load",(function(){var t=document.createElement("canvas");t.setAttribute("width",String(h)),t.setAttribute("height",String(u));var n=t.getContext("2d");n&&((l||"jpg"===o)&&(n.fillStyle=l||"#fff",n.fillRect(0,0,h,u)),n.drawImage(c,0,0),i("png"===o?{data:t.toDataURL("image/png"),extension:"png"}:{data:t.toDataURL("image/jpeg"),extension:"jpg"}))}),!1),c.src=s}else i({data:s,extension:"svg",filename:a})},M=function(t){void 0===t&&(t=!0);try{var n=function(){return null};return addEventListener("testPassive",n,{passive:t}),removeEventListener("testPassive",n),{passive:t}}catch(t){return!1}},L={pointer:{start:["pointerdown"],move:["pointermove"],end:["pointerleave","pointercancel"],frameout:["pointerup"]},touch:{start:["touchstart"],move:["touchmove"],end:["touchend"],frameout:["touchcancel"]},mouse:{start:["mousedown"],move:["mousemove"],end:["mouseleave","mouseout"],frameout:["mouseup"]}},O=function(){function t(t,n){var e=n.end,i=n.start,r=n.move;this._el=t,this.end=e,this.start=i,this.move=r,this._clearEventList=[],this._listenerOption=M(!1);var a=t.getBoundingClientRect(),o=a.left,s=a.top;this._left=o,this._top=s,this._handleStart=this._handleStart.bind(this),this._handleMove=this._handleMove.bind(this),this._handleEnd=this._handleEnd.bind(this)}var n=t.prototype;return n.off=function(){this._clearEventList.map((function(t){return t()})),this._clearEventList=[]},n.on=function(){this.off(),this._setupCoordinatesListener(),window.PointerEvent?this._setupDrawListener("pointer"):this._setupDrawListener("mouse"),"ontouchstart"in window&&this._setupDrawListener("touch")},n._handleStart=function(t){t.preventDefault(),this.start()},n._handleEnd=function(t){t.preventDefault(),this.end()},n._handleMove=function(t){if(t.preventDefault(),t instanceof TouchEvent){var n=t.touches[0];this.move({x:n.clientX-this._left,y:n.clientY-this._top,pressure:n.force})}else t instanceof PointerEvent?this.move({x:t.clientX-this._left,y:t.clientY-this._top,pressure:t.pressure}):t instanceof MouseEvent&&this.move({x:t.clientX-this._left,y:t.clientY-this._top,pressure:null==t?void 0:t.pressure})},n._setupDrawListener=function(t){var n,e=this,i=L[t],r=i.start,a=i.move,o=i.end,s=i.frameout,h=r.map((function(t){return e._el.addEventListener(t,e._handleStart,e._listenerOption),function(){return e._el.removeEventListener(t,e._handleStart)}})),u=a.map((function(t){return e._el.addEventListener(t,e._handleMove,e._listenerOption),function(){return e._el.removeEventListener(t,e._handleMove)}})),l=o.map((function(t){return e._el.addEventListener(t,e._handleEnd,e._listenerOption),function(){return e._el.removeEventListener(t,e._handleEnd)}})),c=s.map((function(t){return addEventListener(t,e._handleEnd,e._listenerOption),function(){return removeEventListener(t,e._handleEnd)}}));(n=this._clearEventList).push.apply(n,h.concat(u,l,c))},n._setupCoordinatesListener=function(){var t=this,n=function(n){var e=t._el.getBoundingClientRect(),i=e.left,r=e.top;t._left=i,t._top=r};addEventListener("scroll",n),this._el.addEventListener("resize",n),this._clearEventList.push((function(){removeEventListener("scroll",n),t._el.removeEventListener("resize",n)}))},t}(),k=function(){function t(t,n){var e=n.resize;this._el=t,this.resize=e,this._clearEventList=[]}var n=t.prototype;return n.off=function(){this._clearEventList.map((function(t){return t()})),this._clearEventList=[]},n.on=function(){this.off(),this._setupListerner()},n._setupListerner=function(){var t=this;if(window.ResizeObserver){var n=new window.ResizeObserver((function(n){var e=n[0];t.resize(e.contentRect)}));n.observe(this._el),this._clearEventList.push((function(){return n.disconnect()}))}else{var e=function(){t.resize(t._el.getBoundingClientRect())};addEventListener("resize",e),this._clearEventList.push((function(){return removeEventListener("resize",e)}))}},t}();function S(t,n,e){var i,r,a;void 0===e&&(e={});var o=null,s=0,h=function(){s=!1===e.leading?0:Date.now(),o=null,a=t.apply(i,r),o||(i=null,r=null)},u=function(){o&&(clearTimeout(o),o=null)};return function(){var l=Date.now();s||!1!==e.leading||(s=l);var c=n-(l-s);i=this;for(var d=arguments.length,p=new Array(d),f=0;f<d;f++)p[f]=arguments[f];return r=p,c<=0||c>n?(u(),s=l,a=t.apply(i,r),o||(i=null,r=null)):o||!1===e.trailing||(o=setTimeout(h,c)),a}}var A=function(){function t(t,n){var e=void 0===n?{}:n,i=e.penColor,r=e.penWidth,a=e.curve,o=e.close,s=e.delay,h=e.fill,u=e.background;this.el=t,this.penColor=null!=i?i:"#000",this.penWidth=null!=r?r:1,this.curve=null==a||a,this.close=null!=o&&o,this.delay=null!=s?s:0,this.fill=null!=h?h:"none";var l=t.getBoundingClientRect(),c=l.width,d=l.height;this._drawPath=null,this._drawPoints=[],this.svg=new p({width:c,height:d,background:u}),this.renderer=new y(t,{background:u}),this.convert=new f,this._resize=this._resize.bind(this),this.resizeHandler=new k(t,{resize:this._resize}),this.drawStart=this.drawStart.bind(this),this.drawMove=this.drawMove.bind(this),this._drawMoveThrottle=S(this.drawMove,this.delay),this.drawEnd=this.drawEnd.bind(this),this.drawHandler=new O(t,{start:this.drawStart,move:this._drawMoveThrottle,end:this.drawEnd}),this.on()}var n=t.prototype;return n.update=function(){this.renderer.update(this.svg.toJson())},n.clear=function(){var t=this.svg.paths;return this.svg.paths=[],this.update(),t},n.undo=function(){var t=this.svg.paths.pop();return this.update(),t},n.changeDelay=function(t){this.delay=t,this.drawHandler.move=S(this.drawMove,this.delay),this.drawHandler.on()},n.on=function(){this.drawHandler.on(),this.resizeHandler.on()},n.off=function(){this.drawHandler.off(),this.resizeHandler.off()},n.drawStart=function(){this._drawPath||(this._drawPath=this._createDrawPath(),this.svg.addPath(this._drawPath))},n.drawMove=function(t){this._drawPath&&(this._addDrawPoint(t),(this._drawPath.attrs.strokeWidth&&+this._drawPath.attrs.strokeWidth!==this.penWidth||this._drawPath.attrs.stroke!==this.penColor)&&(this._drawPath=this._createDrawPath(),this._addDrawPoint(t),this.svg.addPath(this._drawPath)),this.update())},n.drawEnd=function(){this._drawPath=null,this.update()},n._createCommand=function(){this._drawPath&&(this.curve?this._drawPath.commands=this.convert.bezierCurveCommands(this._drawPoints):this._drawPath.commands=this.convert.lineCommands(this._drawPoints),this.close&&this._drawPath.commands.push(new l(u.CLOSE)))},n._addDrawPoint=function(t){this._drawPoints.push(t),this._createCommand()},n._createDrawPath=function(){return this._resize(this.el.getBoundingClientRect()),this._drawPoints=[],new d({stroke:this.penColor,strokeWidth:String(this.penWidth),fill:this.fill,strokeLinecap:this.curve?"round":"mitter",strokeLinejoin:this.curve?"round":"square"})},n._resize=function(t){var n=t.width,e=t.height;o(this.svg.width,n)||(this.svg.resize({width:n,height:e}),this.update())},n.download=function(t){P(this.svg,t)},t}();t.COMMAND_TYPE=u,t.Command=l,t.Convert=f,t.DrawHandler=O,t.Path=d,t.Point=h,t.Renderer=y,t.ResizeHandler=k,t.Svg=p,t.SvgDrawing=A,t.Vector=c,t.camel2kebab=i,t.createSvgChildElement=m,t.createSvgElement=g,t.download=P,t.downloadBlob=E,t.getPassiveOptions=M,t.isAlmostSameNumber=o,t.isNaN=s,t.kebab2camel=a,t.mimeTypeMap=C,t.pathObjectToElement=w,t.roundUp=r,t.svg2base64=_,t.svgObjectToElement=b,t.throttle=S,t.toBase64=x,Object.defineProperty(t,"__esModule",{value:!0})}(n)},5087:function(t,n,e){!function(t,n){"use strict";function e(){return(e=Object.assign||function(t){for(var n=1;n<arguments.length;n++){var e=arguments[n];for(var i in e)Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i])}return t}).apply(this,arguments)}var i=function(t){var n=t.width*t.height;if(!(t.data.length<4*n))return t;for(var i=new Uint8ClampedArray(4*n),r=0;r<n;r++)i[4*r]=t.data[3*r],i[4*r+1]=t.data[3*r+1],i[4*r+2]=t.data[3*r+2],i[4*r+3]=255;return e({},t,{data:i})},r=[[.27901,.44198,.27901],[.135336,.228569,.272192,.228569,.135336],[.086776,.136394,.178908,.195843,.178908,.136394,.086776],[.063327,.093095,.122589,.144599,.152781,.144599,.122589,.093095,.063327],[.049692,.069304,.089767,.107988,.120651,.125194,.120651,.107988,.089767,.069304,.049692]],a=function(){function t(t){var n=t.radius,e=t.delta;this.radius=null!=n?n:0,this.delta=null!=e?e:20}return t.prototype.apply=function(t){var n=i(t),e=new Uint8ClampedArray(n.data),a=Math.floor(this.radius);if(a<1)return n;a>r.length&&(a=r.length);var o=Math.abs(this.delta);o>1024&&(o=1024);for(var s=r[a-1],h=0;h<n.height;h++)for(var u=0;u<n.width;u++){for(var l=0,c=0,d=0,p=0,f=0,v=-a;v<a+1;v++)if(u+v>0&&u+v<n.width){var g=4*(h*n.width+u+v);l+=n.data[g]*s[v+a],c+=n.data[g+1]*s[v+a],d+=n.data[g+2]*s[v+a],p+=n.data[g+3]*s[v+a],f+=s[v+a]}var m=4*(h*n.width+u);e[m]=Math.floor(l/f),e[m+1]=Math.floor(c/f),e[m+2]=Math.floor(d/f),e[m+3]=Math.floor(p/f)}for(var w=new Uint8ClampedArray(e),b=0;b<n.height;b++)for(var y=0;y<n.width;y++){for(var x=0,_=0,C=0,E=0,j=0,P=-a;P<a+1;P++)if(b+P>0&&b+P<n.height){var M=4*((b+P)*n.width+y);x+=w[M]*s[P+a],_+=w[M+1]*s[P+a],C+=w[M+2]*s[P+a],E+=w[M+3]*s[P+a],j+=s[P+a]}var L=4*(b*n.width+y);e[L]=Math.floor(x/j),e[L+1]=Math.floor(_/j),e[L+2]=Math.floor(C/j),e[L+3]=Math.floor(E/j)}for(var O=0;O<n.height;O++)for(var k=0;k<n.width;k++){var S=4*(O*n.width+k);Math.abs(e[S]-n.data[S])+Math.abs(e[S+1]-n.data[S+1])+Math.abs(e[S+2]-n.data[S+2])+Math.abs(e[S+3]-n.data[S+3])>o&&(e[S]=n.data[S],e[S+1]=n.data[S+1],e[S+2]=n.data[S+2],e[S+3]=n.data[S+3])}return new ImageData(e,n.width,n.height)},t}(),o=function(){function t(t){var n;this.corsenabled=null==(n=t.corsenabled)||n}var n=t.prototype;return n.fromUrl=function(t,n){var e=this,i=function(n,i){var r=new Image;e.corsenabled&&(r.crossOrigin="Anonymous"),r.onload=function(){e.fromImageElement(r,n)},r.onerror=function(t){i?i(t):console.error(t)},r.src=t};if(!n)return new Promise(i);i(n)},n.fromImageElement=function(t,n){var e=function(n,e){var i=document.createElement("canvas");i.width=t.naturalWidth||t.width,i.height=t.naturalHeight||t.height;var r=i.getContext("2d");null==r||r.drawImage(t,0,0);var a=null==r?void 0:r.getImageData(0,0,i.width,i.height);if(!a){if(e)return void e("error canvas context.");throw"error canvas context."}n(a)};if(!n)return new Promise(e);e(n)},t}(),s=function(){function t(){}return t.imageData=function(t,n){for(var e=void 0===n?{}:n,r=e.numberOfColors||16,a=e.colorQuantCycles||3,o=i(t),s=this._deterministic(o,r),h=[],u=0;u<a;u++){if(u>0)for(var l=0;l<s.length;l++)h[l].n>0&&(s[l]={r:Math.floor(h[l].r/h[l].n),g:Math.floor(h[l].g/h[l].n),b:Math.floor(h[l].b/h[l].n),a:Math.floor(h[l].a/h[l].n)});h=Array.from({length:s.length},(function(){return{r:0,g:0,b:0,a:0,n:0}}));for(var c=0;c<o.height;c++)for(var d=function(t){var n=4*(c*o.width+t),e=1024,i=s.reduce((function(t,i,r){var a=Math.abs(i.r-o.data[n])+Math.abs(i.g-o.data[n+1])+Math.abs(i.b-o.data[n+2])+Math.abs(i.a-o.data[n+3]);return a<e?(e=a,r):t}),0);h[i].r+=o.data[n],h[i].g+=o.data[n+1],h[i].b+=o.data[n+2],h[i].a+=o.data[n+3],h[i].n+=1},p=0;p<o.width;p++)d(p)}return s},t._deterministic=function(t,n){for(var e=[],i=Math.ceil(Math.sqrt(n)),r=Math.ceil(n/i),a=t.width/(i+1),o=t.height/(r+1),s=0;s<r;s++)for(var h=0;h<i&&e.length!==n;h++){var u=4*Math.floor((s+1)*o*t.width+(h+1)*a);e.push({r:t.data[u],g:t.data[u+1],b:t.data[u+2],a:t.data[u+3]})}return e},t.number=function(t){if(void 0===t&&(t=16),t<8)return this.grey(t);for(var n=[],e=Math.floor(Math.pow(t,1/3)),i=Math.floor(255/(e-1)),r=0;r<e;r+=1)for(var a=0;a<e;a+=1)for(var o=0;o<e;o+=1)n.push({r:r*i,g:a*i,b:o*i,a:255});for(var s=t-e*e*e,h=0;h<s;h++)n.push({r:Math.floor(255*Math.random()),g:Math.floor(255*Math.random()),b:Math.floor(255*Math.random()),a:Math.floor(255*Math.random())});return n},t.grey=function(t){void 0===t&&(t=16);for(var n=[],e=Math.floor(255/(t-1)),i=0;i<t;i++)n.push({r:i*e,g:i*e,b:i*e,a:255});return n},t}(),h=0,u=1,l=2,c=3,d=4,p=5,f=6,v=7,g=8,m=-1,w=[[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[0,1,0,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[0,2,-1,0]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,0,-1],[0,0,1,0]],[[0,0,1,0],[-1,-1,-1,-1],[0,2,-1,0],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[0,0,1,0],[0,3,0,1],[-1,-1,-1,-1]],[[13,3,0,1],[13,2,-1,0],[7,1,0,-1],[7,0,1,0]],[[-1,-1,-1,-1],[0,1,0,-1],[-1,-1,-1,-1],[0,3,0,1]],[[0,3,0,1],[0,2,-1,0],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[0,3,0,1],[0,2,-1,0],[-1,-1,-1,-1],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[0,1,0,-1],[-1,-1,-1,-1],[0,3,0,1]],[[11,1,0,-1],[14,0,1,0],[14,3,0,1],[11,2,-1,0]],[[-1,-1,-1,-1],[0,0,1,0],[0,3,0,1],[-1,-1,-1,-1]],[[0,0,1,0],[-1,-1,-1,-1],[0,2,-1,0],[-1,-1,-1,-1]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[0,1,0,-1],[0,0,1,0]],[[0,1,0,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[0,2,-1,0]],[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]]],b=[{r:0,g:0,b:0,a:255},{r:50,g:50,b:50,a:255},{r:100,g:100,b:100,a:255},{r:150,g:150,b:150,a:255},{r:200,g:200,b:200,a:255}],y=function(){function t(t){var n,i,r,a,o;void 0===t&&(t={}),this.ltres=null!=(n=t.ltres)?n:1,this.qtres=null!=(i=t.qtres)?i:1,this.rightangleenhance=null==(r=t.rightangleenhance)||r,this.pathOmit=null!=(a=t.pathOmit)?a:8,this.commandOmit=null!=(o=t.commandOmit)?o:0,this.pathAttrs=e({strokeWidth:"1"},t.pathAttrs||{}),this.palettes=t.palettes||b}var r=t.prototype;return r.load=function(t){for(var e=i(t),r=this._colorQuantization(e),a=[],o=0;o<this.palettes.length;o++){var s=this._edgeDetection(r,o),h=this._pathScan(s),u=this._interpolation(h).map(this._tracePath.bind(this));a.push(u)}var l=this._createPaths(a);return new n.Svg({width:r[0].length-2,height:r.length-2}).addPath(l)},r._colorQuantization=function(t){var n=this;return Array.from({length:t.height+2},(function(e,i){return Array.from({length:t.width+2},(function(e,r){if(0===r||r===t.width+1||0===i||i===t.height+1)return-1;var a=r-1,o=4*((i-1)*t.width+a);return n._findPaletteIndex({r:t.data[o],g:t.data[o+1],b:t.data[o+2],a:t.data[o+3]})}))}))},r._findPaletteIndex=function(t){var n=t.r,e=t.g,i=t.b,r=t.a,a=1024;return this.palettes.reduce((function(t,o,s){var h=Math.abs(o.r-n)+Math.abs(o.g-e)+Math.abs(o.b-i)+Math.abs(o.a-r);return h<a?(a=h,s):t}),0)},r._edgeDetection=function(t,n){for(var e=[],i=t.length,r=t[0].length,a=0;a<i;a++){e[a]=[];for(var o=0;o<r;o++)e[a][o]=0===a||0===o?0:(t[a-1][o-1]===n?1:0)+(t[a-1][o]===n?2:0)+(t[a][o-1]===n?8:0)+(t[a][o]===n?4:0)}return e},r._pointpoly=function(t,n){for(var e=!1,i=0,r=n.length-1;i<n.length;r=i++)e=n[i].y>t.y!=n[r].y>t.y&&t.x<(n[r].x-n[i].x)*(t.y-n[i].y)/(n[r].y-n[i].y)+n[i].x?!e:e;return e},r._pathScan=function(t){for(var n=t[0].length,e=t.length,i=[],r=0,a=0;a<e;a++)for(var o=0;o<n;o++){var s=t[a][o];if(4===s||11===s){var h=o,u=a,l=1,c=0,d=!1;for(i[r]={points:[],boundingbox:[h,u,h,u],holechildren:[],isholepath:!1};!d;){i[r].points[c]={x:h-1,y:u-1,direction:m},h-1<i[r].boundingbox[0]&&(i[r].boundingbox[0]=h-1),h-1>i[r].boundingbox[2]&&(i[r].boundingbox[2]=h-1),u-1<i[r].boundingbox[1]&&(i[r].boundingbox[1]=u-1),u-1>i[r].boundingbox[3]&&(i[r].boundingbox[3]=u-1);var p=w[t[u][h]][l];if(t[u][h]=p[0],l=p[1],h+=p[2],u+=p[3],h-1===i[r].points[0].x&&u-1===i[r].points[0].y)if(d=!0,i[r].points.length<this.pathOmit)i.pop();else{if(11===s){i[r].isholepath=!0;for(var f=0,v=[-1,-1,n+1,e+1],g=0;g<r;g++)!i[g].isholepath&&this._boundingboxincludes(i[g].boundingbox,i[r].boundingbox)&&this._boundingboxincludes(v,i[g].boundingbox)&&this._pointpoly(i[r].points[0],i[g].points)&&(f=g,v=i[g].boundingbox);i[f].holechildren.push(r)}r++}c++}}}return i},r._boundingboxincludes=function(t,n){return t[0]<n[0]&&t[1]<n[1]&&t[2]>n[2]&&t[3]>n[3]},r._interpolation=function(t){for(var n=[],e=0,i=0,r=0,a=0,o=0;o<t.length;o++){n[o]={points:[],boundingbox:t[o].boundingbox,holechildren:t[o].holechildren,isholepath:t[o].isholepath};for(var s=t[o].points.length,h=0;h<s;h++)e=(h+1)%s,i=(h+2)%s,r=(h-1+s)%s,a=(h-2+s)%s,this.rightangleenhance&&this._testrightangle(t[o],a,r,h,e,i)&&(n[o].points.length>0&&(n[o].points[n[o].points.length-1].direction=this._getdirection(n[o].points[n[o].points.length-1].x,n[o].points[n[o].points.length-1].y,t[o].points[h].x,t[o].points[h].y)),n[o].points.push({x:t[o].points[h].x,y:t[o].points[h].y,direction:this._getdirection(t[o].points[h].x,t[o].points[h].y,(t[o].points[h].x+t[o].points[e].x)/2,(t[o].points[h].y+t[o].points[e].y)/2)})),n[o].points.push({x:(t[o].points[h].x+t[o].points[e].x)/2,y:(t[o].points[h].y+t[o].points[e].y)/2,direction:this._getdirection(t[o].points[h].x+t[o].points[e].x,t[o].points[h].y+t[o].points[e].y,t[o].points[e].x+t[o].points[i].x,t[o].points[e].y+t[o].points[i].y)})}return n},r._testrightangle=function(t,n,e,i,r,a){return t.points[i].x===t.points[n].x&&t.points[i].x===t.points[e].x&&t.points[i].y===t.points[r].y&&t.points[i].y===t.points[a].y||t.points[i].y===t.points[n].y&&t.points[i].y===t.points[e].y&&t.points[i].x===t.points[r].x&&t.points[i].x===t.points[a].x},r._getdirection=function(t,n,e,i){return t<e?n<i?u:v:t>e?n<i?c:n>i?p:d:n<i?l:n>i?f:g},r._tracePath=function(t){for(var e=0,i=[],r=[];e<t.points.length;){for(var a=t.points[e].direction,o=m,s=e+1;(t.points[s].direction===a||t.points[s].direction===o||-1===o)&&s<t.points.length-1;)t.points[s].direction!==a&&o===m&&(o=t.points[s].direction||h),s++;s===t.points.length-1?(i.push.apply(i,this._fitseq(t,e,0)),r.push.apply(r,this._fitseq(t,e,0,!0)),e=t.points.length):(i.push.apply(i,this._fitseq(t,e,s)),r.push.apply(r,this._fitseq(t,e,s,!0)),e=s)}var u=[new n.Command("M",[t.points[0].x,t.points[0].y])].concat(i,[new n.Command("Z")]);return r.reverse(),{commands:u,holeCommands:[new n.Command("M",r[r.length-1].value.slice(0,2))].concat(r,[new n.Command("Z")]),holechildren:t.holechildren,isholepath:t.isholepath}},r._fitseq=function(t,e,i,r){var a=this.ltres,o=this.qtres;if(i>t.points.length||i<0)return[];var s,h,u,l=e,c=0,d=!0,p=i-e;p<0&&(p+=t.points.length);for(var f=(t.points[i].x-t.points[e].x)/p,v=(t.points[i].y-t.points[e].y)/p,g=(e+1)%t.points.length;g!=i;){var m=g-e;m<0&&(m+=t.points.length),s=t.points[e].x+f*m,h=t.points[e].y+v*m,(u=(t.points[g].x-s)*(t.points[g].x-s)+(t.points[g].y-h)*(t.points[g].y-h))>a&&(d=!1),u>c&&(l=g,c=u),g=(g+1)%t.points.length}if(d)return[new n.Command("L",r?[t.points[e].x,t.points[e].y]:[t.points[i].x,t.points[i].y])];var w=l;d=!0,c=0;var b=(w-e)/p,y=(1-b)*(1-b),x=2*(1-b)*b,_=b*b,C=(y*t.points[e].x+_*t.points[i].x-t.points[w].x)/-x,E=(y*t.points[e].y+_*t.points[i].y-t.points[w].y)/-x;for(g=e+1;g!=i;)x=2*(1-(b=(g-e)/p))*b,_=b*b,s=(y=(1-b)*(1-b))*t.points[e].x+x*C+_*t.points[i].x,h=y*t.points[e].y+x*E+_*t.points[i].y,(u=(t.points[g].x-s)*(t.points[g].x-s)+(t.points[g].y-h)*(t.points[g].y-h))>o&&(d=!1),u>c&&(l=g,c=u),g=(g+1)%t.points.length;if(d)return[new n.Command("Q",[C,E,t.points[i].x,t.points[i].y])];var j=w;return this._fitseq(t,e,j,r).concat(this._fitseq(t,j,i,r))},r._complementCommand=function(t,n){for(var e=t[n],i=[],r=0;r<e.holechildren.length;r++)i.push.apply(i,t[e.holechildren[r]].holeCommands);return i},r._createPaths=function(t){for(var i=[],r=0;r<t.length;r++)for(var a=0;a<t[r].length;a++){var o=t[r],s=o[a];if(!(s.isholepath||s.commands.length<this.commandOmit)){var h=this.palettes[r],u="rgb("+h.r+", "+h.g+", "+h.b+")",l=new n.Path(e({},this.pathAttrs,{stroke:u,fill:u,opacity:String(h.a/255)}));l.addCommand([].concat(s.commands,this._complementCommand(o,a))),i.push(l)}}return i},t}();t.Blur=a,t.ImgLoader=o,t.ImgTrace=y,t.Palette=s,Object.defineProperty(t,"__esModule",{value:!0})}(n,e(5793))}},function(t){t.O(0,[99,774,888,179],(function(){return n=8931,t(t.s=n);var n}));var n=t.O();_N_E=n}]);