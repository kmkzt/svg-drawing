(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[804],{3554:function(t,e,i){"use strict";var n,s=i(7328),r=i(1628),o=i(7729),a=i.n(o),h=i(9097),l=i.n(h),d=i(2784),u=i(6451),c=i(8694),p=i(2322),m=(0,c.createGlobalStyle)(n||(n=(0,s.Z)(["\n body, * {\n   margin: 0;\n   box-sizing: border-box;\n }\n\n  a {\n    color: initial;\n    text-decoration: initial;\n  }\n"]))),v=function(){return(0,p.jsx)(u.xu,{bg:"#fafafa",py:"8px",px:"16px",children:(0,p.jsxs)(u.kC,{justifyContent:"space-between",children:[(0,p.jsx)(u.xu,{width:.3,children:(0,p.jsx)(l(),{href:"/",children:(0,p.jsx)("a",{children:(0,p.jsx)(u.xv,{fontSize:3,as:"h1",style:{whiteSpace:"nowrap"},children:"svg-drawing"})})})}),(0,p.jsxs)(u.kC,{as:"nav",alignContent:"center",width:.6,children:[(0,p.jsx)(l(),{href:"/",children:(0,p.jsx)("a",{children:(0,p.jsx)(u.xv,{mr:2,children:"drawing"})})}),(0,p.jsx)(u.xv,{mr:2,children:(0,p.jsx)(l(),{href:"/demo/animation",children:(0,p.jsx)("a",{children:"animation"})})}),(0,p.jsx)(u.xv,{mr:2,children:(0,p.jsx)(l(),{href:"/demo/img-trace",children:(0,p.jsx)("a",{children:"img-trace"})})})]}),(0,p.jsx)(u.xu,{width:.1,style:{textAlign:"right"},children:(0,p.jsx)(u.rU,{color:"#000",href:"https://github.com/kmkzt/svg-drawing",children:(0,p.jsx)(r.X,{size:"24"})})})]})})};e.Z=function(t){var e=t.children,i=t.title,n=void 0===i?"":i;return(0,p.jsxs)(d.Fragment,{children:[(0,p.jsx)(a(),{children:(0,p.jsx)("title",{children:"svg-drawing ".concat(n)})}),(0,p.jsx)(m,{}),(0,p.jsx)(v,{}),(0,p.jsx)(u.xu,{py:"12px",px:["2vw","2vw","5vw"],children:e})]})}},7465:function(t,e,i){"use strict";i.r(e),i.d(e,{default:function(){return g}});var n=i(8529),s=i(2146);function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function o(t,e,i){return(e=function(t){var e=function(t,e){if("object"!==r(t)||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var n=i.call(t,e);if("object"!==r(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"===r(e)?e:String(e)}(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}class a{constructor(t,e){let{background:i,ms:n}=void 0===e?{ms:60}:e;o(this,"ms",void 0),o(this,"_stopId",void 0),o(this,"_stopAnimation",void 0),o(this,"_anim",void 0),o(this,"_restorePaths",void 0),o(this,"_framesNumber",void 0),o(this,"svg",void 0),o(this,"renderer",void 0),o(this,"resizeHandler",void 0),o(this,"_repeatCount",void 0),this.ms=n,this._stopAnimation=null,this._anim=null,this._restorePaths=[],this._stopId=0,this._repeatCount="indefinite";const{width:r,height:a}=t.getBoundingClientRect();this.svg=new s.ny({width:r,height:a,background:i}),this.renderer=new s.Th(t,{background:i}),this._resize=this._resize.bind(this),this.resizeHandler=new s.Yq(t,{resize:this._resize}),this.resizeHandler.on()}setAnimation(t,e){let{frames:i,repeatCount:n,ms:s}=void 0===e?{}:e;this._anim=t,this._framesNumber=i,this._repeatCount=n?`${n}`:"indefinite",s&&(this.ms=s)}stop(){return!!this._stopAnimation&&(this._stopAnimation(),this.restore(),!0)}restore(){this.svg.paths=this._restorePaths,this.update()}generateFrame(t){return this._anim?this._anim(this._restorePaths.map((t=>t.clone())),t):this.svg.paths}start(){this.stop(),this._registerRestorePaths(),this._startAnimation()}_startAnimation(){let t,e=0;const i=this.ms,n=this._getFramesNumber(),s=r=>{if(i!==this.ms)return this.restore(),void this.start();(!t||r-t>i)&&(t=r,this.svg.paths=this.generateFrame(e),this.update(),e=e>n?0:e+1),this._stopId=requestAnimationFrame(s)};this._stopId=requestAnimationFrame(s),this._stopAnimation=()=>{cancelAnimationFrame(this._stopId),this._stopAnimation=null}}update(){this.renderer.update(this.svg.toJson())}toElement(){this._stopAnimation||this._registerRestorePaths();const t=this._getFramesNumber(),e=Array(t).fill(null).map(((t,e)=>this.generateFrame(e))),i=t*(this.ms>0?this.ms:1)+"ms",n=1/t,r=`0;${Array(t).fill(void 0).map(((t,e)=>(0,s.vd)((e+1)*n,4)+"")).join(";")}`,o=(t,n,o,a)=>{const h=e.map((e=>{const i=e.find((e=>e.attrs.id===t.attrs.id));return a({origin:t,path:i})||o}));return h.every((t=>t===o))?null:(0,s.oT)("animate",{dur:i,keyTimes:r,attributeName:n,repeatCount:this._repeatCount,values:[o,...h].join(";")})},a=this._restorePaths.map((t=>{const e=(0,s.SE)(t.toJson()),i=o(t,"d",t.getCommandString(),(t=>{let{origin:e,path:i}=t;return i&&i.commands.length>0?i.getCommandString():e.commands[0].toString()}));i&&e.appendChild(i);const{id:n,...r}=t.attrs;return Object.entries(r).map((i=>{let[n,r]=i;if(!r)return;const a=(0,s.CT)(n),h=o(t,a,r,(t=>{let{path:e}=t;return e?.attrs[n]}));h&&e.appendChild(h)})),e})),h={width:String(this.svg.width),height:String(this.svg.height)},l=this.svg.background?[(0,s.oT)("rect",{...h,fill:this.svg.background})]:[];return(0,s.uO)({width:String(this.svg.width),height:String(this.svg.height)},l.concat(a))}download(t){(0,s.lm)({data:(0,s.zt)(this.toElement().outerHTML),extension:"svg",filename:t})}_getFramesNumber(){return this._framesNumber&&this._framesNumber>0?this._framesNumber:this._restorePaths.reduce(((t,e)=>t+e.commands.length),0)}_registerRestorePaths(){this._restorePaths=this.svg.clonePaths().map(((t,e)=>(t.attrs.id=`t${e}`,t)))}_resize(t){let{width:e,height:i}=t;this.stop(),this.svg.resize({width:e,height:i}),this.start()}}var h=i(2784),l=i(6451),d=i(3554),u=i(2322),c=function(t){for(var e=function(){return 5*Math.random()-2.5},i=0;i<t.length;i+=1)t[i].commands=t[i].commands.map((function(t){var i,n,r;return t.point=null===(i=t.point)||void 0===i?void 0:i.add(new s.E9(e(),e())),t.cl=null===(n=t.cl)||void 0===n?void 0:n.add(new s.E9(e(),e())),t.cr=null===(r=t.cr)||void 0===r?void 0:r.add(new s.E9(e(),e())),t}));return t},p=["#F44336","#E91E63","#9C27B0","#673AB7","#3F51B5","#2196F3","#00BCD4","#009688","#4CAF50","#8BC34A","#CDDC39","#FFEB3B","#FFC107","#FF9800","#FF5722"],m=function(t,e){if(!e)return t;for(var i=0;i<t.length;i+=1)t[i].attrs.stroke=p[e%p.length],t[i].attrs.fill=p[(e+4)%p.length];return t},v=function(t,e){if(!e)return t;for(var i=[],n=0;n<t.length;n+=1){if(e<t[n].commands.length){t[n].commands=t[n].commands.slice(0,e),i.push(t[n]);break}e-=t[n].commands.length,i.push(t[n])}return i},C=function(t){t.isSp;var e=(0,h.useRef)(null),i=(0,h.useRef)(null),s=(0,h.useState)(20),r=s[0],o=s[1],C=(0,h.useCallback)((function(t){if(i.current){var e=Number(t.target.value);Number.isNaN(e)||(i.current.ms=e,o(e))}}),[]);(0,h.useEffect)((function(){i.current||e.current&&(i.current=new a(e.current,{ms:r,background:"#fff"}),i.current.svg.parseSVGString('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="370.921875" width="370.921875"><path d="M 40.55 81.18 C 40.59 81.18 40.09 81.18 40.78 81.18 C 41.46 81.18 41.67 81.18 43.96 81.18 C 46.26 81.18 49.43 81.18 52.27 81.18 C 55.11 81.18 54.07 81.18 58.18 81.18 C 62.29 81.18 66.58 81.18 72.8 81.18 C 79.03 81.18 82.53 81.18 89.3 81.18 C 96.07 81.18 97.3 81.18 106.66 81.18 C 116.03 81.18 126.28 81.18 136.12 81.18 C 145.96 81.18 150.14 81.18 155.87 81.18 C 161.59 81.18 161.04 81.18 164.74 81.18 C 168.44 81.18 171.98 81.18 174.37 81.18 C 176.75 81.18 176.11 81.18 176.67 81.18 C 177.23 81.18 177.03 81.39 177.18 81.18 C 177.33 80.96 177.6 80.73 177.43 80.11 C 177.26 79.49 176.56 78.48 176.34 78.08" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 150.09 48.41 C 150.09 48.55 150.09 47.41 150.09 49.13 C 150.09 50.85 150.09 51.9 150.09 57.02 C 150.09 62.13 150.09 69.16 150.09 74.69 C 150.09 80.22 150.09 76.61 150.09 84.68 C 150.09 92.76 150.09 103.41 150.09 115.06 C 150.09 126.7 150.09 132.34 150.09 142.91 C 150.09 153.48 150.09 152.15 150.09 167.91 C 150.09 183.67 150.09 204.36 150.09 221.71 C 150.09 239.05 150.09 242.46 150.09 254.65 C 150.09 266.84 150.09 275.46 150.09 282.65 C 150.09 289.85 150.09 287.44 150.09 290.62 C 150.09 293.8 150.21 296.6 150.09 298.56 C 149.96 300.53 149.58 299.91 149.46 300.45 C 149.33 300.98 149.9 300.06 149.46 301.23 C 149.02 302.39 148.18 304.31 147.27 306.28 C 146.35 308.26 146.07 308.71 144.88 311.11 C 143.69 313.51 142.43 316.09 141.31 318.28 C 140.2 320.47 139.82 321.09 139.32 322.07 C 138.81 323.05 138.9 322.84 138.8 323.16 C 138.69 323.49 138.85 323.58 138.8 323.69 C 138.75 323.79 138.65 323.69 138.55 323.69 C 138.46 323.69 138.41 323.69 138.32 323.69 C 138.22 323.69 138.5 323.81 138.08 323.69 C 137.66 323.56 138.3 324.35 136.21 323.06 C 134.12 321.77 132.92 321.6 127.64 317.23 C 122.37 312.86 115.35 306.59 109.84 301.21 C 104.33 295.84 104.62 295.32 100.11 290.37 C 95.6 285.41 91.07 280.45 87.3 276.45 C 83.53 272.46 83.31 272.61 81.25 270.41 C 79.18 268.2 78.06 266.64 76.99 265.43 C 75.92 264.21 76.16 264.56 75.89 264.34 C 75.63 264.12 75.7 264.34 75.65 264.34" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 85.88 235.16 C 86.55 235.16 87.04 235.47 89.2 235.16 C 91.35 234.86 92.99 234.96 96.66 233.64 C 100.33 232.32 101.96 232.35 107.54 228.59 C 113.11 224.82 118.81 219.52 124.51 214.8 C 130.21 210.09 130.33 209.34 136.04 204.99 C 141.76 200.65 148.08 196.6 153.09 193.08 C 158.11 189.56 157.87 189.58 161.1 187.39 C 164.33 185.2 167.19 183.38 169.26 182.14 C 171.33 180.89 170.96 181.36 171.45 181.17 C 171.93 180.98 171.6 181.17 171.7 181.17 C 171.8 181.17 171.9 181.17 171.95 181.17" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 178.37 127.34 C 179.86 127.34 181.15 127.34 185.83 127.34 C 190.52 127.34 195.56 127.58 201.79 127.34 C 208.03 127.1 210.23 127.47 217.01 126.16 C 223.79 124.84 229.06 122.77 235.68 120.77 C 242.31 118.77 244.05 118.21 250.15 116.15 C 256.24 114.09 260.59 112.56 266.15 110.46 C 271.71 108.36 274.1 107.37 277.96 105.66 C 281.81 103.96 282.23 103.29 285.43 101.95 C 288.63 100.6 291.37 99.94 293.97 98.95 C 296.56 97.96 296.85 97.65 298.4 97 C 299.96 96.36 300.93 96.09 301.75 95.73 C 302.57 95.37 302.36 95.37 302.52 95.22 C 302.67 95.07 302.56 95.03 302.52 94.98 C 302.47 94.94 302.32 94.98 302.27 94.98" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 241.5 94.98 C 241.5 95.03 241.5 94.54 241.5 95.22 C 241.5 95.9 241.5 96.09 241.5 98.39 C 241.5 100.7 241.5 104 241.5 106.73 C 241.5 109.46 241.5 109.57 241.5 112.05 C 241.5 114.53 241.5 116.3 241.5 119.14 C 241.5 121.98 241.5 123.96 241.5 126.23 C 241.5 128.5 241.5 129.18 241.5 130.49 C 241.5 131.8 241.5 131.98 241.5 132.8 C 241.5 133.61 241.5 134.17 241.5 134.57 C 241.5 134.98 241.5 134.83 241.5 134.84 C 241.5 134.84 241.5 134.76 241.5 134.61 C 241.5 134.46 241.5 134.19 241.5 134.09" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 269.17 88.05 C 269.17 88.25 269.17 88.18 269.17 89.02 C 269.17 89.86 269.17 89.93 269.17 92.23 C 269.17 94.54 269.17 97.46 269.17 100.56 C 269.17 103.66 269.17 104.39 269.17 107.75 C 269.17 111.1 269.17 114.12 269.17 117.35 C 269.17 120.58 270.16 120.6 269.17 123.9 C 268.17 127.2 265.66 130.94 264.19 133.86 C 262.71 136.78 262.89 136.44 261.8 138.51 C 260.71 140.59 259.52 142.86 258.74 144.23 C 257.95 145.6 258.16 144.98 257.88 145.38 C 257.59 145.77 257.54 146.04 257.33 146.21 C 257.11 146.37 256.96 146.21 256.81 146.21 C 256.66 146.21 256.62 146.21 256.57 146.21" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 215.92 158.91 C 215.92 159.28 215.92 159.52 215.92 160.76 C 215.92 162 215.92 161.8 215.92 165.11 C 215.92 168.42 215.92 173.28 215.92 177.31 C 215.92 181.34 215.92 181.38 215.92 185.27 C 215.92 189.15 215.92 192.71 215.92 196.74 C 215.92 200.77 215.92 199.64 215.92 205.42 C 215.92 211.19 215.92 218.68 215.92 225.61 C 215.92 232.55 215.92 233.7 215.92 240.08 C 215.92 246.47 215.75 251.64 215.92 257.54 C 216.09 263.43 215.99 265.93 216.77 269.56 C 217.55 273.19 218.46 273.39 219.82 275.68 C 221.18 277.97 222.3 279.5 223.56 281.01 C 224.81 282.52 225.36 282.68 226.09 283.24 C 226.82 283.8 226.84 283.6 227.23 283.82 C 227.61 284.04 227.79 284.24 228 284.34 C 228.21 284.44 228.16 284.34 228.26 284.34 C 228.36 284.34 228.45 284.34 228.5 284.34" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 211.44 186.56 C 211.58 186.56 211.05 186.56 212.14 186.56 C 213.24 186.56 212.93 186.56 216.9 186.56 C 220.87 186.56 226.44 186.67 231.99 186.56 C 237.54 186.45 238.9 186.41 244.66 186 C 250.42 185.58 255.54 185.2 260.78 184.5 C 266.02 183.8 265.64 182.99 270.86 182.48 C 276.08 181.98 280.93 182.18 286.88 181.98 C 292.82 181.78 296.74 181.69 300.57 181.5 C 304.39 181.32 303.26 181.14 306 181.05 C 308.75 180.96 311.8 181.05 314.3 181.05 C 316.8 181.05 316.99 181.05 318.48 181.05 C 319.98 181.05 320.89 181 321.77 181.05 C 322.64 181.11 322.58 181.16 322.85 181.32 C 323.12 181.47 323.05 181.63 323.11 181.84 C 323.16 182.05 323.05 182.08 323.11 182.35 C 323.16 182.62 323.18 182.55 323.36 183.18 C 323.55 183.81 323.58 183.89 324.02 185.49 C 324.45 187.09 324.9 188.26 325.54 191.19 C 326.18 194.11 326.68 196.46 327.21 200.12 C 327.75 203.79 327.7 204.62 328.2 209.51 C 328.7 214.4 329.19 218.37 329.7 224.58 C 330.21 230.79 330.42 235.48 330.73 240.55 C 331.04 245.62 331.14 246.52 331.24 249.94 C 331.34 253.35 331.24 255.44 331.24 257.62 C 331.24 259.8 331.24 259.89 331.24 260.83 C 331.24 261.78 331.24 261.83 331.24 262.35 C 331.24 262.87 331.24 263.12 331.24 263.44 C 331.24 263.76 331.24 263.81 331.24 263.96 C 331.24 264.11 331.24 263.5 331.24 264.2 C 331.24 264.89 331.24 264.87 331.24 267.41 C 331.24 269.95 331.4 273.47 331.24 276.91 C 331.07 280.36 330.64 282.61 330.41 284.64 C 330.19 286.67 330.24 286.14 330.13 287.06 C 330.01 287.98 329.95 288.81 329.84 289.25 C 329.73 289.69 329.75 289.55 329.58 289.25 C 329.42 288.95 329.37 289 329.02 287.75 C 328.67 286.49 328.06 283.94 327.82 282.99" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 260.1 189.45 C 260.1 189.54 260.1 189.08 260.1 189.92 C 260.1 190.75 260.1 191.45 260.1 193.61 C 260.1 195.78 260.1 197.76 260.1 200.73 C 260.1 203.7 260.1 205.72 260.1 208.46 C 260.1 211.2 260.1 211.7 260.1 214.45 C 260.1 217.21 260.1 219.92 260.1 222.23 C 260.1 224.53 260.1 223.9 260.1 225.98 C 260.1 228.05 260.1 230.07 260.1 232.59 C 260.1 235.11 260.1 236.19 260.1 238.6 C 260.1 241.01 260.1 242.49 260.1 244.65 C 260.1 246.82 260.1 247.53 260.1 249.42 C 260.1 251.31 260.1 252.85 260.1 254.09 C 260.1 255.33 260.1 255.25 260.1 255.61 C 260.1 255.96 260.1 256.39 260.1 255.86 C 260.1 255.34 260.1 253.56 260.1 252.98" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 222.5 222.28 C 222.54 222.28 221.84 222.28 222.73 222.28 C 223.61 222.28 224.3 222.28 226.94 222.28 C 229.57 222.28 232.38 222.28 235.91 222.28 C 239.44 222.28 240.13 222.28 244.61 222.28 C 249.09 222.28 253.38 222.28 258.31 222.28 C 263.25 222.28 265.22 222.28 269.29 222.28 C 273.37 222.28 275.27 222.28 278.7 222.28 C 282.12 222.28 283.55 222.28 286.41 222.28 C 289.28 222.28 291.05 222.28 293.01 222.28 C 294.97 222.28 294.67 222.28 296.22 222.28 C 297.77 222.28 299.28 222.28 300.75 222.28 C 302.22 222.28 302.77 222.28 303.56 222.28 C 304.35 222.28 304.32 222.28 304.7 222.28 C 305.08 222.28 305.31 222.37 305.47 222.28 C 305.62 222.18 305.64 221.9 305.47 221.81 C 305.3 221.71 304.8 221.81 304.64 221.81" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path><path d="M 221.03 270.27 C 221.67 270.27 221.66 270.27 224.23 270.27 C 226.81 270.27 230.52 270.27 233.91 270.27 C 237.3 270.27 237.35 270.27 241.21 270.27 C 245.07 270.27 248.63 270.27 253.21 270.27 C 257.79 270.27 260.61 270.27 264.1 270.27 C 267.6 270.27 267.47 270.27 270.68 270.27 C 273.9 270.27 276.99 270.27 280.17 270.27 C 283.36 270.27 283.78 270.27 286.62 270.27 C 289.45 270.27 291.85 270.27 294.35 270.27 C 296.85 270.27 296.95 270.27 299.11 270.27 C 301.27 270.27 303.2 270.27 305.14 270.27 C 307.09 270.27 306.99 270.27 308.83 270.27 C 310.67 270.27 312.33 270.27 314.35 270.27 C 316.37 270.27 317.47 270.2 318.92 270.27 C 320.38 270.34 320.6 270.48 321.63 270.61 C 322.66 270.75 323.28 270.8 324.07 270.93 C 324.86 271.06 324.87 271.06 325.58 271.25 C 326.3 271.43 326.96 271.62 327.66 271.85 C 328.35 272.08 328.67 272.29 329.05 272.4 C 329.44 272.51 329.36 272.35 329.57 272.4 C 329.78 272.45 329.98 272.61 330.09 272.66" fill="none" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="5"></path></svg>'),w())}));var g=(0,h.useCallback)((function(t){var e,s=new FileReader;s.onload=function(t){if(t.target&&"string"===typeof t.target.result){var e=t.target.result.split(","),s=(0,n.Z)(e,2),r=s[0],o=s[1];if("data:image/svg+xml;base64"===r){var a=atob(o);if(!i.current)return;i.current.svg.parseSVGString(a),i.current.update()}}},null!==(e=t.target)&&void 0!==e&&e.files&&s.readAsDataURL(t.target.files[0])}),[]),f=(0,h.useCallback)((function(){i.current&&(i.current.setAnimation(c,{frames:3}),i.current.start())}),[]),w=(0,h.useCallback)((function(){i.current&&(i.current.setAnimation(v,{repeatCount:1}),i.current.start())}),[]),_=(0,h.useCallback)((function(){i.current&&(i.current.setAnimation(m,{frames:p.length}),i.current.start())}),[]),b=(0,h.useCallback)((function(){i.current&&i.current.stop()}),[]),y=(0,h.useCallback)((function(){i.current&&i.current.restore()}),[]),x=(0,h.useCallback)((function(){i.current&&i.current.download()}),[]);return(0,u.jsxs)(d.Z,{children:[(0,u.jsxs)(l.xu,{as:"fieldset",children:[(0,u.jsxs)(l.kC,{justifyContent:"start",mb:2,children:[(0,u.jsxs)("label",{style:{whiteSpace:"nowrap"},children:["ANIMATION MS:",(0,u.jsx)("input",{type:"range",min:"0",max:"500",step:"5",value:r,onChange:C})]}),(0,u.jsx)("input",{type:"number",min:"0",max:"500",step:"5",value:r,onChange:C})]}),(0,u.jsx)(l.kC,{flexWrap:"wrap",justifyContent:"start",mb:2,children:(0,u.jsxs)(l.xu,{children:[(0,u.jsx)(l.zx,{mr:1,mb:1,onClick:f,children:"Shaking"}),(0,u.jsx)(l.zx,{variant:"secondary",mr:1,mb:1,onClick:w,children:"Drawing"}),(0,u.jsx)(l.zx,{variant:"secondary",mr:1,mb:1,onClick:_,children:"Colorful"}),(0,u.jsx)(l.zx,{mr:1,mb:1,onClick:b,children:"Stop"}),(0,u.jsx)(l.zx,{mr:1,mb:1,onClick:y,children:"Restore"}),(0,u.jsx)(l.zx,{variant:"secondary",mr:1,mb:1,onClick:x,children:"Download Anmation SVG"})]})}),(0,u.jsxs)(l.xu,{children:[(0,u.jsx)(l.xv,{children:"Svg exported by this library can be read."}),(0,u.jsx)("input",{type:"file",onChange:g,multiple:!0,accept:"image/*"})]})]}),(0,u.jsx)(l.xu,{width:["96vw","96vw","40vw"],height:["96vw","96vw","40vw"],children:(0,u.jsx)("div",{ref:e,style:{backgroundSize:"".concat(30,"px ").concat(30,"px"),border:"1px solid #333",width:"100%",height:"100%",margin:"0 auto 0 0"}})})]})};C.getInitialProps=function(t){var e=t.req,i=e?e.headers["user-agent"]:navigator.userAgent;return{isSp:!i||/iPhone|Android.+Mobile/.test(i)}};var g=C},2082:function(t,e,i){(window.__NEXT_P=window.__NEXT_P||[]).push(["/demo/animation",function(){return i(7465)}])},8529:function(t,e,i){"use strict";i.d(e,{Z:function(){return s}});var n=i(7211);function s(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var i=null==t?null:"undefined"!==typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=i){var n,s,r=[],o=!0,a=!1;try{for(i=i.call(t);!(o=(n=i.next()).done)&&(r.push(n.value),!e||r.length!==e);o=!0);}catch(h){a=!0,s=h}finally{try{o||null==i.return||i.return()}finally{if(a)throw s}}return r}}(t,e)||(0,n.Z)(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},2146:function(t,e,i){"use strict";function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function s(t){var e=function(t,e){if("object"!==n(t)||null===t)return t;var i=t[Symbol.toPrimitive];if(void 0!==i){var s=i.call(t,e);if("object"!==n(s))return s;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(t,"string");return"symbol"===n(e)?e:String(e)}function r(t,e,i){return(e=s(e))in t?Object.defineProperty(t,e,{value:i,enumerable:!0,configurable:!0,writable:!0}):t[e]=i,t}i.d(e,{CT:function(){return o},E9:function(){return d},LR:function(){return j},SE:function(){return _},Th:function(){return y},Yq:function(){return A},en:function(){return b},hK:function(){return R},lm:function(){return E},mY:function(){return c},ny:function(){return v},oT:function(){return w},uO:function(){return f},vd:function(){return a},y$:function(){return m},zt:function(){return x}});const o=t=>t.replace(/([a-z])([A-Z])/g,"$1-$2").toLowerCase(),a=function(t,e){return void 0===e&&(e=2),+t.toFixed(e)},h=t=>t.replace(/-([a-z])/g,((t,e)=>e.toUpperCase())),l=t=>t!=t;class d{constructor(t,e){r(this,"x",void 0),r(this,"y",void 0),this.x=t,this.y=e}toVector(){const t=Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2)),e=Math.atan2(this.y,this.x);return new p(t,e)}scale(t){return new d(this.x*t,this.y*t)}add(t){return new d(this.x+t.x,this.y+t.y)}sub(t){return new d(this.x-t.x,this.y-t.y)}eql(t){return this.x===t.x&&this.y===t.y}clone(){return new d(this.x,this.y)}}const u={MOVE:"M",MOVE_RELATIVE:"m",LINE:"L",LINE_RELATIVE:"l",CURVE:"C",CURVE_RELATIVE:"c",CLOSE:"Z",HORIZONTAL:"H",HORIZONTAL_RELATIVE:"h",VERTICAL:"V",VERTICAL_RELATIVE:"v",ARC_CURVE:"A",ARC_CURVE_RELATIVE:"a",QUADRATIC_CURVE:"Q",QUADRATIC_CURVE_RELATIVE:"q"};class c{constructor(t,e){void 0===e&&(e=[]),r(this,"type",void 0),r(this,"value",void 0),this.value=e,this.type=t}set cr(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(2,1,t.x),this.value.splice(3,1,t.y)))}get cr(){if("C"!==this.type&&"c"!==this.type||6!==this.value.length)return;const[t,e]=this.value.slice(2,4);return new d(t,e)}set cl(t){t&&("C"!==this.type&&"c"!==this.type||6!==this.value.length||(this.value.splice(0,1,t.x),this.value.splice(1,1,t.y)))}get cl(){if("C"!==this.type&&"c"!==this.type||6!==this.value.length)return;const[t,e]=this.value.slice(0,2);return new d(t,e)}set point(t){t&&(this.value.splice(this.value.length-2,1,t.x),this.value.splice(this.value.length-1,1,t.y))}get point(){const t=this.value.slice(this.value.length-2);return 2===t.length?new d(t[0],t[1]):void 0}toString(){return this.type===u.CLOSE?u.CLOSE:`${this.type} ${this.value.map((t=>a(t))).join(" ")}`}scale(t){return new c(this.type,this.value.map((e=>e*t)))}clone(){return new c(this.type,this.value.slice())}}class p{constructor(t,e){r(this,"angle",void 0),r(this,"value",void 0),this.value=t,this.angle=e}toPoint(){const t=Math.cos(this.angle)*this.value,e=Math.sin(this.angle)*this.value;return new d(t,e)}scale(t){return new p(this.value*t,this.angle)}}class m{constructor(t){let{d:e,...i}=void 0===t?{}:t;r(this,"attrs",void 0),r(this,"commands",void 0),this.attrs=i,this.commands=[],e&&this.parseCommandString(e)}scale(t){return this.commands=this.commands.map((e=>e.scale(t))),this.attrs.strokeWidth=String(t*+(this.attrs.strokeWidth||0)),this}addCommand(t){return Array.isArray(t)?this.commands.push(...t):this.commands.push(t),this}getCommandString(){return 0===this.commands.length?"":this.commands.map(((t,e)=>t.toString())).join(" ").trim()}parseCommandString(t){this.commands=[];let e=null,i=[];const n=t.split(" "),s=t=>Object.values(u).includes(t)?t:null;for(let r=0;r<n.length;r+=1){const t=s(n[r]);if(t){if(!e){e=t;continue}this.commands.push(new c(e,i)),e=t,i=[]}else{if(l(+n[r]))return;i.push(+n[r])}}null!==e&&this.commands.push(new c(e,i))}parsePathElement(t){for(let e=0;e<t.attributes.length;e+=1){const i=t.attributes.item(e);i&&i.value&&("d"!==i.name?this.attrs={...this.attrs,[h(i.name)]:i.value}:this.parseCommandString(i.value))}return this}toJson(){return{...this.attrs,d:this.getCommandString()}}clone(){const t=new m(this.attrs);return this.commands.map((e=>{t.commands.push(e.clone())})),t}}class v{constructor(t){let{width:e,height:i,background:n}=t;r(this,"paths",void 0),r(this,"width",void 0),r(this,"height",void 0),r(this,"background",void 0),this.paths=[],this.width=e,this.height=i,this.background=n}resize(t){let{width:e,height:i}=t;this.scalePath(e/this.width),this.width=e,this.height=i}scalePath(t){if(1!==t)for(let e=0;e<this.paths.length;e+=1)this.paths[e].scale(t);return this}addPath(t){return Array.isArray(t)?this.paths.push(...t):this.paths.push(t),this}clonePaths(){return this.paths.map((t=>t.clone()))}updatePath(t,e){const i=e||this.paths.length-1;return i<0&&this.paths.push(t),this.paths[i]=t,this}toJson(){return{width:this.width,height:this.height,background:this.background,paths:this.paths.map((t=>t.toJson()))}}copy(t){return this.paths=t.clonePaths(),t.width&&this.width&&this.scalePath(this.width/t.width),this}parseSVGString(t){const e=(new DOMParser).parseFromString(t,"image/svg+xml").querySelector("svg");return e?this.parseSVGElement(e):(this.paths=[],this)}parseSVGElement(t){const e=[];t.querySelectorAll("path").forEach((t=>{const i=(new m).parsePathElement(t);0!==i.commands.length&&e.push(i)})),this.paths=e;const i=Number(t.getAttribute("width"));return i&&this.width&&this.scalePath(this.width/i),this}}class C{constructor(t){let{ratio:e}=void 0===t?{}:t;r(this,"ratio",void 0),this.ratio=e??.2}_controlPoint(t,e,i){const n=new d(t.x,t.y),s=new d(e.x,e.y),r=new d(i.x,i.y).sub(n).toVector().scale(this.ratio).toPoint(),o=s.add(r);return[o.x,o.y]}bezierCurve(t,e,i,n){const s=[...this._controlPoint(t,e,i),...this._controlPoint(n,i,e),i.x,i.y];return new c(u.CURVE,s)}lineCommands(t){return t.map(((t,e)=>new c(0===e?u.MOVE:u.LINE,[t.x,t.y])))}bezierCurveCommands(t){const e=[];if(t.length<3)return this.lineCommands(t);for(let i=0;i<t.length;i+=1)0!==i?e.push(this.bezierCurve(t[i-2<0?0:i-2],t[i-1],t[i],i<t.length-1?t[i+1]:t[i])):e.push(new c(u.MOVE,[t[i].x,t[i].y]));return e}}const g="http://www.w3.org/2000/svg",f=(t,e)=>{const i=document.createElementNS(g,"svg");return i.setAttributeNS(null,"version","1.1"),i.setAttribute("xmlns",g),i.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink"),Object.keys(t).sort().map((e=>{i.setAttribute(e,t[e])})),e.map((t=>{i.appendChild(t)})),i},w=(t,e)=>{const i=document.createElementNS(g,t);return Object.keys(e).sort().map((t=>{i.setAttribute(t,e[t])})),i},_=t=>{const e=Object.entries(t).reduce(((t,e,i)=>{let[n,s]=e;return s?{...t,[o(n)]:s}:t}),{});return w("path",e)},b=t=>{let{width:e,height:i,background:n,paths:s}=t;const r={width:String(e),height:String(i)},o=n?[w("rect",{...r,fill:n})]:[];return f(r,[...o,...s.map(_)])};class y{constructor(t,e){let{background:i}=void 0===e?{}:e;this.el=t;const{width:n,height:s}=t.getBoundingClientRect();t.appendChild(b({background:i,width:n,height:s,paths:[]}))}update(t){this.el.replaceChild(b(t),this.el.childNodes[0])}}const x=t=>`data:image/svg+xml;base64,${btoa(t)}`,k={png:"image/png",jpg:"image/jpeg",svg:"image/svg+xml"},E=t=>{let{data:e,extension:i,filename:n}=t;const s=atob(e.replace(/^.*,/,"")),r=new Uint8Array(s.length);for(let h=0;h<s.length;h+=1)r[h]=s.charCodeAt(h);const o=n||`${Date.now()}.${i}`,a=new Blob([r.buffer],{type:k[i]});if(window.navigator.msSaveBlob)window.navigator.msSaveBlob(a,o);else if(window.URL&&window.URL.createObjectURL){const t=document.createElement("a");t.download=o,t.href=window.URL.createObjectURL(a),document.body.appendChild(t),t.click(),document.body.removeChild(t)}else window.open(e,"_blank")},S={extension:"svg"},j=function(t,e,i){void 0===e&&(e=S),void 0===i&&(i=E);const{filename:n,extension:s}={...S,...e},r=(t=>x(b(t).outerHTML))(t.toJson());if("svg"===s)return void i({data:r,extension:"svg",filename:n});const{width:o,height:a,background:h}=t,l=new Image;l.addEventListener("load",(()=>{const t=document.createElement("canvas");t.setAttribute("width",String(o)),t.setAttribute("height",String(a));const e=t.getContext("2d");e&&((h||"jpg"===s)&&(e.fillStyle=h||"#fff",e.fillRect(0,0,o,a)),e.drawImage(l,0,0),i("png"===s?{data:t.toDataURL("image/png"),extension:"png"}:{data:t.toDataURL("image/jpeg"),extension:"jpg"}))}),!1),l.src=r},P={pointer:{start:["pointerdown"],move:["pointermove"],end:["pointerleave","pointercancel"],frameout:["pointerup"]},touch:{start:["touchstart"],move:["touchmove"],end:["touchend"],frameout:["touchcancel"]},mouse:{start:["mousedown"],move:["mousemove"],end:["mouseleave","mouseout"],frameout:["mouseup"]}};class L{constructor(t,e){let{end:i,start:n,move:s}=e;this._el=t,r(this,"_clearEventList",void 0),r(this,"_listenerOption",void 0),r(this,"_left",void 0),r(this,"_top",void 0),r(this,"end",void 0),r(this,"start",void 0),r(this,"move",void 0),this.end=i,this.start=n,this.move=s,this._clearEventList=[],this._listenerOption=function(t){void 0===t&&(t=!0);try{const e=()=>null;return addEventListener("testPassive",e,{passive:t}),removeEventListener("testPassive",e),{passive:t}}catch(t){return!1}}(!1);const{left:o,top:a}=t.getBoundingClientRect();this._left=o,this._top=a,this._handleStart=this._handleStart.bind(this),this._handleMove=this._handleMove.bind(this),this._handleEnd=this._handleEnd.bind(this)}off(){this._clearEventList.map((t=>t())),this._clearEventList=[]}on(){this.off(),this._setupCoordinatesListener(),window.PointerEvent?this._setupDrawListener("pointer"):this._setupDrawListener("mouse"),"ontouchstart"in window&&this._setupDrawListener("touch")}_handleStart(t){t.preventDefault(),this.start()}_handleEnd(t){t.preventDefault(),this.end()}_handleMove(t){if(t.preventDefault(),t instanceof TouchEvent){const e=t.touches[0];this.move({x:e.clientX-this._left,y:e.clientY-this._top,pressure:e.force})}else t instanceof PointerEvent?this.move({x:t.clientX-this._left,y:t.clientY-this._top,pressure:t.pressure}):t instanceof MouseEvent&&this.move({x:t.clientX-this._left,y:t.clientY-this._top,pressure:t?.pressure})}_setupDrawListener(t){const{start:e,move:i,end:n,frameout:s}=P[t],r=e.map((t=>(this._el.addEventListener(t,this._handleStart,this._listenerOption),()=>this._el.removeEventListener(t,this._handleStart)))),o=i.map((t=>(this._el.addEventListener(t,this._handleMove,this._listenerOption),()=>this._el.removeEventListener(t,this._handleMove)))),a=n.map((t=>(this._el.addEventListener(t,this._handleEnd,this._listenerOption),()=>this._el.removeEventListener(t,this._handleEnd)))),h=s.map((t=>(addEventListener(t,this._handleEnd,this._listenerOption),()=>removeEventListener(t,this._handleEnd))));this._clearEventList.push(...r,...o,...a,...h)}_setupCoordinatesListener(){const t=t=>{const{left:e,top:i}=this._el.getBoundingClientRect();this._left=e,this._top=i};addEventListener("scroll",t),this._el.addEventListener("resize",t),this._clearEventList.push((()=>{removeEventListener("scroll",t),this._el.removeEventListener("resize",t)}))}}class A{constructor(t,e){let{resize:i}=e;this._el=t,r(this,"_clearEventList",void 0),r(this,"resize",void 0),this.resize=i,this._clearEventList=[]}off(){this._clearEventList.map((t=>t())),this._clearEventList=[]}on(){this.off(),this._setupListerner()}_setupListerner(){if(window.ResizeObserver){const t=new window.ResizeObserver((t=>{let[e]=t;this.resize(e.contentRect)}));t.observe(this._el),this._clearEventList.push((()=>t.disconnect()))}else{const t=()=>{this.resize(this._el.getBoundingClientRect())};addEventListener("resize",t),this._clearEventList.push((()=>removeEventListener("resize",t)))}}}function z(t,e,i){let n,s,r;void 0===i&&(i={});let o=null,a=0;const h=()=>{a=!1===i.leading?0:Date.now(),o=null,r=t.apply(n,s),o||(n=null,s=null)},l=()=>{o&&(clearTimeout(o),o=null)};return function(){const d=Date.now();a||!1!==i.leading||(a=d);const u=e-(d-a);n=this;for(var c=arguments.length,p=new Array(c),m=0;m<c;m++)p[m]=arguments[m];return s=p,u<=0||u>e?(l(),a=d,r=t.apply(n,s),o||(n=null,s=null)):o||!1===i.trailing||(o=setTimeout(h,u)),r}}class R{constructor(t,e){let{penColor:i,penWidth:n,curve:s,close:o,delay:a,fill:h,background:l}=void 0===e?{}:e;this.el=t,r(this,"penColor",void 0),r(this,"penWidth",void 0),r(this,"fill",void 0),r(this,"curve",void 0),r(this,"close",void 0),r(this,"delay",void 0),r(this,"svg",void 0),r(this,"convert",void 0),r(this,"renderer",void 0),r(this,"drawHandler",void 0),r(this,"resizeHandler",void 0),r(this,"_drawPath",void 0),r(this,"_drawPoints",void 0),r(this,"_drawMoveThrottle",void 0),this.penColor=i??"#000",this.penWidth=n??1,this.curve=s??!0,this.close=o??!1,this.delay=a??0,this.fill=h??"none";const{width:d,height:u}=t.getBoundingClientRect();this._drawPath=null,this._drawPoints=[],this.svg=new v({width:d,height:u,background:l}),this.renderer=new y(t,{background:l}),this.convert=new C,this._resize=this._resize.bind(this),this.resizeHandler=new A(t,{resize:this._resize}),this.drawStart=this.drawStart.bind(this),this.drawMove=this.drawMove.bind(this),this._drawMoveThrottle=z(this.drawMove,this.delay),this.drawEnd=this.drawEnd.bind(this),this.drawHandler=new L(t,{start:this.drawStart,move:this._drawMoveThrottle,end:this.drawEnd}),this.on()}update(){this.renderer.update(this.svg.toJson())}clear(){const t=this.svg.paths;return this.svg.paths=[],this.update(),t}undo(){const t=this.svg.paths.pop();return this.update(),t}changeDelay(t){this.delay=t,this.drawHandler.move=z(this.drawMove,this.delay),this.drawHandler.on()}on(){this.drawHandler.on(),this.resizeHandler.on()}off(){this.drawHandler.off(),this.resizeHandler.off()}drawStart(){this._drawPath||(this._drawPath=this._createDrawPath(),this.svg.addPath(this._drawPath))}drawMove(t){this._drawPath&&(this._addDrawPoint(t),(this._drawPath.attrs.strokeWidth&&+this._drawPath.attrs.strokeWidth!==this.penWidth||this._drawPath.attrs.stroke!==this.penColor)&&(this._drawPath=this._createDrawPath(),this._addDrawPoint(t),this.svg.addPath(this._drawPath)),this.update())}drawEnd(){this._drawPath=null,this.update()}_createCommand(){this._drawPath&&(this.curve?this._drawPath.commands=this.convert.bezierCurveCommands(this._drawPoints):this._drawPath.commands=this.convert.lineCommands(this._drawPoints),this.close&&this._drawPath.commands.push(new c(u.CLOSE)))}_addDrawPoint(t){this._drawPoints.push(t),this._createCommand()}_createDrawPath(){return this._resize(this.el.getBoundingClientRect()),this._drawPoints=[],new m({stroke:this.penColor,strokeWidth:String(this.penWidth),fill:this.fill,strokeLinecap:this.curve?"round":"mitter",strokeLinejoin:this.curve?"round":"square"})}_resize(t){let{width:e,height:i}=t;((t,e)=>Math.trunc(t)===Math.trunc(e))(this.svg.width,e)||(this.svg.resize({width:e,height:i}),this.update())}download(t){j(this.svg,t)}}}},function(t){t.O(0,[61,774,888,179],(function(){return e=2082,t(t.s=e);var e}));var e=t.O();_N_E=e}]);