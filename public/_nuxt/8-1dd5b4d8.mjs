import{_ as h,d as a,a as s,c as i,b as d,e as l,o as p}from"./bootstrap-ab28dcca.mjs";const F=a({components:{designingmath:s},setup(){},methods:{setupFunc(u,o,e,c,n,t){console.log("setupFunc")},loopFunc(u,o,e,c,n,t){console.log("loopFunc"),u.clearRect(0,0,o,e),t&&(u.beginPath(),u.arc(c,n,200,0,Math.PI*2),u.stroke())},touchOrMouseStartFunc(u,o,e,c,n,t){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,o,e,c,n,t){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,o,e,c,n,t){console.log("touchOrMouseEndFunc")}}}),M=l("p",null,"Chapter 2 2-8 \u30BF\u30C3\u30C1\u306E\u72B6\u614B",-1);function b(u,o,e,c,n,t){const r=s;return p(),i("div",null,[M,d(r,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var g=h(F,[["render",b]]);export{g as default};
