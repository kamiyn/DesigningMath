import{_ as Y,d as y,a as h,c as O,b as f,e as g,o as m}from"./bootstrap-24038287.mjs";class _{constructor(u,e){this.x=u,this.y=e}}const v=0,k=0;var l=0,p=[];const E=y({components:{designingmath:h},setup(){},methods:{setupFunc(o,u,e,n,r,s){console.log("setupFunc");const t=20,c=u/(t-1),a=c*Math.sin(Math.PI/3),d=Math.ceil(e/a);l=c,p=[...Array(d).keys()].map(i=>[...Array(t).keys()].map(F=>{const M=c*F+v+(i%2==1?c/2:0),b=a*i+k;return new _(M,b)}))},loopFunc(o,u,e,n,r,s){console.log("loopFunc"),o.clearRect(0,0,u,e),p.forEach(t=>t.forEach(c=>{const a=l/2;o.strokeStyle="black",o.lineWidth=2,o.beginPath(),o.arc(c.x,c.y,a,0,Math.PI*2,!0),o.stroke()}))},touchOrMouseStartFunc(o,u,e,n,r,s){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(o,u,e,n,r,s){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(o,u,e,n,r,s){console.log("touchOrMouseEndFunc")}}}),S=g("p",null,"Chapter 7 7-1 \u3007\u3092\u6577\u304D\u8A70\u3081\u308B",-1);function T(o,u,e,n,r,s){const t=h;return m(),O("div",null,[S,f(t,{setupFunc:o.setupFunc,loopFunc:o.loopFunc,touchOrMouseStartFunc:o.touchOrMouseStartFunc,touchOrMouseEndFunc:o.touchOrMouseEndFunc,touchOrMouseMoveFunc:o.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var A=Y(E,[["render",T]]);export{A as default};
