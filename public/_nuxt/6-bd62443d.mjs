var v=Object.defineProperty;var _=(o,e,t)=>e in o?v(o,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):o[e]=t;var f=(o,e,t)=>(_(o,typeof e!="symbol"?e+"":e,t),t);import{_ as E,d as Y,a as b,c as S,b as m,e as P,o as I}from"./bootstrap-24038287.mjs";class ${constructor(e,t){f(this,"touched");this.x=e,this.y=t,this.touched=!1}kyori(e,t){return Math.sqrt(Math.pow(e-this.x,2)+Math.pow(t-this.y,2))}kakudo(e,t){return Math.atan2(t-this.y,e-this.x)}setTouched(){this.touched=!0}clearTouched(){this.touched=!1}isTouched(){return this.touched}}const w=0,A=0;var k=0,F=[],g;const W=Y({components:{designingmath:b},setup(){},methods:{setupFunc(o,e,t,s,r,h){console.log("setupFunc");const c=20,n=e/(c-1),l=n*Math.sin(Math.PI/3),p=Math.ceil(t/l);k=n,F=[...Array(p).keys()].map(u=>[...Array(c).keys()].map(d=>{const a=n*d+w+(u%2==1?n/2:0),i=l*u+A;return new $(a,i)})),g=new Date().getTime()},loopFunc(o,e,t,s,r,h){console.log("loopFunc");const c=(new Date().getTime()-g)/1e3,n=Math.sin(c*Math.PI*2)*Math.PI*.2,l=Math.min(e,t);o.clearRect(0,0,e,t),F.forEach(p=>p.forEach(u=>{const d=u.kyori(s,r),a=u.kakudo(s,r);d<k/2&&u.setTouched();const i=Math.max(1-d/l,0),M=k/2*i;o.strokeStyle="black",o.lineWidth=i*5;const T=M*Math.cos(a+n),O=M*Math.sin(a+n);o.beginPath(),o.moveTo(u.x,u.y),o.lineTo(u.x+T,u.y+O),o.stroke();const y=i*255;o.fillStyle=u.isTouched()?"red":`rgb(${y},${y},${y})`,o.strokeStyle="black",o.lineWidth=2,o.beginPath(),o.arc(u.x,u.y,M,a-Math.PI/2,a+Math.PI/2,!0),o.fill(),o.strokeStyle="black",o.lineWidth=2,o.beginPath(),o.arc(u.x,u.y,M,0,Math.PI*2,!0),o.stroke()}))},touchOrMouseStartFunc(o,e,t,s,r,h){console.log("touchOrMouseStartFunc"),F.forEach(c=>c.forEach(n=>{n.clearTouched()}))},touchOrMouseMoveFunc(o,e,t,s,r,h){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(o,e,t,s,r,h){console.log("touchOrMouseEndFunc")}}}),B=P("p",null,"Chapter 7 7-6 \u6307\u306E\u65B9\u5411\u306E\u7DDA\u304C\u3086\u3089\u3050",-1);function D(o,e,t,s,r,h){const c=b;return I(),S("div",null,[B,m(c,{setupFunc:o.setupFunc,loopFunc:o.loopFunc,touchOrMouseStartFunc:o.touchOrMouseStartFunc,touchOrMouseEndFunc:o.touchOrMouseEndFunc,touchOrMouseMoveFunc:o.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var z=E(W,[["render",D]]);export{z as default};
