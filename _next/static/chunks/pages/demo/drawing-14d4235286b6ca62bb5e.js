_N_E=(window.webpackJsonp_N_E=window.webpackJsonp_N_E||[]).push([[10],{"1lKD":function(e,n,t){!function(e,n,t){"use strict";var r=function(e,n,t){return e(t={path:void 0,exports:{},require:function(e,n){return function(){throw new Error("Dynamic requires are not currently supported by @rollup/plugin-commonjs")}(null==n&&t.path)}},t.exports),t.exports}((function(e){function n(){return e.exports=n=Object.assign||function(e){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])}return e},n.apply(this,arguments)}e.exports=n}));e.useSvgDrawing=function(e){var a=n.useRef(null),o=n.useRef(null),l=n.useCallback((function(){return o.current?o.current.renderer.svg.toElement().outerHTML:null}),[]),c=n.useCallback((function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];var r=n[0],a=n[1];o.current&&o.current.renderer.svg.download(null!=r?r:"svg",a)}),[]),u=n.useCallback((function(e){o.current&&e&&(o.current.penColor=e)}),[]),i=n.useCallback((function(e){o.current&&e&&(o.current.fill=e)}),[]),s=n.useCallback((function(e){o.current&&e&&o.current.changeDelay(e)}),[]),d=n.useCallback((function(e){o.current&&(o.current.penWidth=Number(e))}),[]),b=n.useCallback((function(e){o.current&&(o.current.close=null!=e&&e)}),[]),p=n.useCallback((function(e){o.current&&(o.current.curve=null==e||e)}),[]),f=n.useCallback((function(){o.current&&o.current.clear()}),[]),h=n.useCallback((function(){o.current&&o.current.undo()}),[]);return n.useEffect((function(){o.current||a.current&&(o.current=new t.SvgDrawing(a.current,r({},e)))})),[a,{instance:o.current,changePenWidth:d,changePenColor:u,changeFill:i,changeDelay:s,changeClose:b,changeCurve:p,clear:f,undo:h,getSvgXML:l,download:c}]},Object.defineProperty(e,"__esModule",{value:!0})}(n,t("ERkP"),t("S95l"))},KKW1:function(e,n,t){(window.__NEXT_P=window.__NEXT_P||[]).push(["/demo/drawing",function(){return t("e86e")}])},e86e:function(e,n,t){"use strict";t.r(n);var r=t("zygG"),a=t("ERkP"),o=t.n(a),l=t("1lKD"),c=t("rh/l"),u=t("c7sy"),i=t("apO0"),s=o.a.createElement,d=["none","#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722","#795548","#ddd","#9E9E9E","#444","black"],b=function(){return"#".concat(Array.from({length:3},(function(){return String((e=255,Math.floor(Math.random()*Math.floor(e))).toString(16)).padStart(2,"0");var e})).join(""))},p=function(e){var n=e.isSp,t=Object(a.useState)(!1),o=t[0],p=t[1],f=Object(a.useState)(!0),h=f[0],g=f[1],v=Object(a.useState)(!1),C=v[0],x=v[1],m=Object(a.useState)("none"),w=m[0],k=m[1],y=Object(a.useState)("black"),S=y[0],O=y[1],j=Object(a.useState)(20),F=j[0],E=j[1],B=Object(a.useState)(5),D=B[0],N=B[1],P=Object(l.useSvgDrawing)({curve:h,close:C,delay:F,penWidth:D,fill:w}),I=Object(r.a)(P,2),L=I[0],_=I[1],W=Object(a.useCallback)((function(e){return function(n){_.download(e)}}),[_]),A=Object(a.useCallback)((function(e){_.changeFill("none"),_.changeClose(!1),p(e.target.checked)}),[_]),z=Object(a.useCallback)((function(){_.changeCurve(!h),g(!h)}),[h,_]),R=Object(a.useCallback)((function(){_.changeClose(!C),x(!C)}),[C,_]),T=Object(a.useCallback)((function(e){var n=Number(e.target.value);Number.isNaN(n)||(_.changePenWidth(n),N(n))}),[_]),K=Object(a.useCallback)((function(e){var n=Number(e.target.value);Number.isNaN(n)||(_.changeDelay(n),E(n))}),[_]),M=Object(a.useCallback)((function(e){_.changePenColor(e),O(e)}),[_]),G=Object(a.useCallback)((function(e){M(e.target.value)}),[M]),H=Object(a.useCallback)((function(e){return function(){M(e)}}),[M]),q=Object(a.useCallback)((function(e){_.changeFill(e),k(e)}),[_]),J=Object(a.useCallback)((function(e){q(e.target.value)}),[q]),X=Object(a.useCallback)((function(e){return function(){q(e)}}),[q]),U=Object(a.useCallback)((function(){_.clear()}),[_]),V=Object(a.useCallback)((function(){_.undo()}),[_]);Object(a.useEffect)((function(){var e=setInterval((function(){if(o){var e=b();_.changePenColor(e),O(e)}}),4*F);return function(){return clearInterval(e)}}),[F,o,_]);var Y,Q=Object(a.useCallback)((function(e){var n,t=new FileReader;t.onload=function(e){if(e.target&&"string"===typeof e.target.result){var n=e.target.result.split(","),t=Object(r.a)(n,2),a=t[0],o=t[1];if("data:image/svg+xml;base64"===a){var l=atob(o);if(!_.instance)return;_.instance.renderer.svg.parseSVGString(l),_.instance.renderer.update()}}},(null===(n=e.target)||void 0===n?void 0:n.files)&&t.readAsDataURL(e.target.files[0])}),[_]);return s(i.a,null,s(c.Box,{as:"fieldset"},s(c.Flex,{flexWrap:"wrap"},s(c.Box,{width:[1,.5,.5],pr:3},s(c.Flex,{alignItems:"center"},s(u.Label,{fontSize:[2,1,1],width:.3,htmlFor:"strokeWidth"},"STROKE WIDTH:"),s(u.Slider,{width:.5,min:"1",max:"20",step:"1",value:D,onChange:T}),s(u.Input,{width:"auto",id:"strokeWidth",type:"number",min:"1",max:"20",step:"1",value:D,onChange:T})),s(c.Flex,{alignItems:"center"},s(u.Label,{width:.3,fontSize:[2,1,1],htmlFor:"throttleDelay"},"THROTTLE DELAY:"),s(u.Slider,{width:.5,type:"range",min:"0",max:"300",step:"5",value:F,onChange:K}),s(u.Input,{width:"auto",id:"throttleDelay",type:"number",min:"0",max:"300",step:"5",value:F,onChange:K})),s(c.Flex,{pt:3,justifyContent:"start"},s(u.Label,{htmlFor:"curve"},s(u.Checkbox,{id:"curve",checked:h,onChange:z}),"Curve"),!o&&s(u.Label,{htmlFor:"close"},s(u.Checkbox,{id:"close",checked:C,onChange:R}),"Close"),s(u.Label,{htmlFor:"rainbow"},s(u.Checkbox,{id:"rainbow",checked:o,onChange:A}),"Rainbow pen"))),!o&&s(c.Box,{width:[1,.5,.5]},s(u.Label,{fontSize:0,htmlFor:"fill"},"FILL:",s(u.Input,{p:1,fontSize:0,id:"fill",type:"text",placeholder:"#000 or black or rgba(0,0,0,1)",value:w,onChange:J})),s(c.Flex,{flexWrap:"wrap"},d.map((function(e){return s(c.Box,{key:e,width:["24px","24px","20px"],height:["24px","24px","20px"],style:{display:"inline-block",backgroundColor:e,border:e===w?"2px solid #000":"2px solid #999"},onClick:X(e)})}))),s(u.Label,{fontSize:0,htmlFor:"penColor",style:{whiteSpace:"nowrap"}},"PEN COLOR:",s(u.Input,{fontSize:0,p:1,id:"penColor",type:"text",placeholder:"#000 or black or rgba(0,0,0,1)",value:S,onChange:G})),s(c.Flex,{flexWrap:"wrap"},d.map((function(e){return s(c.Box,{key:e,width:["24px","24px","20px"],height:["24px","24px","20px"],bg:e,style:{border:e===S?"2px solid #000":"2px solid #999"},onClick:H(e)})})))))),s(c.Box,{as:"fieldset"},s(c.Flex,{flexWrap:"wrap",justifyContent:"start"},s(c.Box,{mr:2},s(c.Button,{mr:1,mb:1,onClick:U},"Clear"),s(c.Button,{mr:1,mb:1,onClick:V},"Undo"),s(c.Button,{variant:"secondary",mr:1,mb:1,onClick:W("png")},"Download PNG"),s(c.Button,{variant:"secondary",mr:1,mb:1,onClick:W("jpg")},"Download JPG"),s(c.Button,{variant:"secondary",mr:1,mb:1,onClick:W("svg")},"Download SVG")),!n&&s(c.Box,{width:"auto"},s(c.Text,{fontSize:0},"Svg exported by this library can be read."),s(u.Input,{type:"file",onChange:Q,multiple:!0,accept:"image/*"})))),s(c.Box,{width:["96vw","96vw","40vw"],height:["96vw","96vw","40vw"]},s("div",{ref:L,style:{backgroundImage:(Y=30,"\n  repeating-linear-gradient(\n    90deg,\n    #ddd ,\n    #ddd 1px,\n    transparent 1px,\n    transparent ".concat(String(Y),"px\n  ),\n  repeating-linear-gradient(\n    0deg,\n    #ddd ,\n    #ddd 1px,\n    transparent 1px,\n    transparent ").concat(String(Y),"px\n  )\n")),backgroundSize:"".concat(30,"px ").concat(30,"px"),border:"1px solid #333",margin:"0 auto 0 0",width:"100%",height:"100%"}})))};p.getInitialProps=function(e){var n=e.req,t=n?n.headers["user-agent"]:navigator.userAgent;return{isSp:!t||/iPhone|Android.+Mobile/.test(t)}},n.default=p},zygG:function(e,n,t){"use strict";t.d(n,"a",(function(){return a}));var r=t("HO86");function a(e,n){return function(e){if(Array.isArray(e))return e}(e)||function(e,n){if("undefined"!==typeof Symbol&&Symbol.iterator in Object(e)){var t=[],r=!0,a=!1,o=void 0;try{for(var l,c=e[Symbol.iterator]();!(r=(l=c.next()).done)&&(t.push(l.value),!n||t.length!==n);r=!0);}catch(u){a=!0,o=u}finally{try{r||null==c.return||c.return()}finally{if(a)throw o}}return t}}(e,n)||Object(r.a)(e,n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}}},[["KKW1",0,2,1,3,4,5]]]);