import{_ as m,d as v,a as d,c as y,b as S,e as E,o as k}from"./bootstrap-86595c19.mjs";const r=8,p=r,F=r*4;var a,M,b,Y,f;const z=v({components:{designingmath:d},setup(){},methods:{setupFunc(u,o,e,c,n,t){console.log("setupFunc");const s=Math.min(o,e);a=s/r,M=s/p,b=s/F;const h=a*r;Y=(o-h)/2,f=(e-h)/2,[...Array(F+1).keys()].forEach(l=>[...Array(p+1).keys()].forEach(g=>{const i=a/2,O=M*g+Y+(l%2==1?-a/2:0),_=b*(l-1)+f;u.fillStyle="rgba(255, 200, 200, 0.7)",u.strokeStyle="red",u.beginPath(),u.arc(O+i,_+i,i,0,Math.PI*2,!0),u.fill(),u.stroke()}))},loopFunc(u,o,e,c,n,t){console.log("loopFunc")},touchOrMouseStartFunc(u,o,e,c,n,t){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,o,e,c,n,t){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,o,e,c,n,t){console.log("touchOrMouseEndFunc")}}}),X=E("p",null,"Chapter 4 4-3 \u4E92\u3044\u9055\u3044\u306B\u914D\u7F6E\u3059\u308B",-1);function T(u,o,e,c,n,t){const s=d;return k(),y("div",null,[X,S(s,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var $=m(z,[["render",T]]);export{$ as default};
