import{_ as k,d as f,a as y,c as g,b as v,e as O,o as m}from"./bootstrap-ddf56d88.mjs";class Y{constructor(e,n){this.x=e,this.y=n}}class _{constructor(e,n){this.x=e,this.y=n}sayuHantei(e,n){const s=n.x-e.x,c=n.y-e.y,a=this.x-e.x,t=this.y-e.y;return Math.sign(s*t-a*c)}}var u=[],d=[],M=0;const E=f({components:{designingmath:y},setup(){},methods:{setupFunc(o,e,n,s,c,a){console.log("setupFunc"),u=[...Array(4).keys()].map(i=>new Y(e/2,n/2));const t=20,h=e/(t-1),l=h*Math.sin(Math.PI/3),r=Math.floor(n/l)+1;M=h,d=[...Array(r).keys()].map(i=>[...Array(t).keys()].map(p=>{const F=h*p-(i%2==0?h/2:0),b=l*i;return new _(F,b)}))},loopFunc(o,e,n,s,c,a){console.log("loopFunc");var t=null;u.forEach(r=>{t===null?a&&(r.x=s,r.y=c):(r.x+=(t.x-r.x)/10,r.y+=(t.y-r.y)/10),t=r}),o.clearRect(0,0,e,n);const h=M/4;d.forEach(r=>r.forEach(i=>{o.strokeStyle=i.sayuHantei(u[3],u[0])===1?"red":"black",o.lineWidth=1,o.beginPath(),o.arc(i.x,i.y,h,0,Math.PI*2,!0),o.stroke()})),o.beginPath(),o.lineWidth=4,o.strokeStyle="black",o.moveTo(u[0].x,u[0].y),o.bezierCurveTo(u[1].x,u[1].y,u[2].x,u[2].y,u[3].x,u[3].y),o.stroke();const l=35;o.fillStyle="white",o.strokeStyle="black",o.lineWidth=4,o.beginPath(),o.arc(u[0].x,u[0].y,l,0,Math.PI*2,!0),o.fill(),o.stroke(),o.beginPath(),o.arc(u[3].x,u[3].y,l,0,Math.PI*2,!0),o.fill(),o.stroke()},touchOrMouseStartFunc(o,e,n,s,c,a){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(o,e,n,s,c,a){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(o,e,n,s,c,a){console.log("touchOrMouseEndFunc")}}}),P=O("p",null,"Chapter 9 9-4 \u5DE6\u53F3\u5224\u5B9A",-1);function S(o,e,n,s,c,a){const t=y;return m(),g("div",null,[P,v(t,{setupFunc:o.setupFunc,loopFunc:o.loopFunc,touchOrMouseStartFunc:o.touchOrMouseStartFunc,touchOrMouseEndFunc:o.touchOrMouseEndFunc,touchOrMouseMoveFunc:o.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var A=k(E,[["render",S]]);export{A as default};
