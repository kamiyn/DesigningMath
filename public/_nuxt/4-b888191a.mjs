import{_ as f,d as _,a as l,c as v,b as y,e as E,o as T}from"./bootstrap-c494a676.mjs";const c=16;var s,p,d,F;const B=_({components:{designingmath:l},setup(){},methods:{setupFunc(u,o,e,t,n,r){console.log("setupFunc"),s=Math.min(o,e)/c,F=new Date().getTime()},loopFunc(u,o,e,t,n,r){console.log("loopFunc"),u.clearRect(0,0,o,e);const i=(new Date().getTime()-F)%1e3/999,h=s*c;p=(o-h)/2,d=(e-h)/2;const a=s/2;var M=0;[...Array(c).keys()].forEach(b=>[...Array(c).keys()].forEach(m=>{const Y=M++%(c+1)/c,g=s*m+p,O=s*b+d;u.beginPath(),u.arc(g+a,O+a,(Y+i)*a%a+1,0,Math.PI*2,!0),u.fill()}))},touchOrMouseStartFunc(u,o,e,t,n,r){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,o,e,t,n,r){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,o,e,t,n,r){console.log("touchOrMouseEndFunc")}}}),S=E("p",null,"Chapter 3 3-4 \u6642\u9593\u306B\u6CBF\u3063\u3066\u5927\u304D\u3055\u3092\u52D5\u304B\u3059",-1);function X(u,o,e,t,n,r){const i=l;return T(),v("div",null,[S,y(i,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var D=f(B,[["render",X]]);export{D as default};
