import{_ as i,d as l,a as t,c as a,b as h,e as p,o as F}from"./bootstrap-ab28dcca.mjs";const d=l({components:{designingmath:t},setup(){},methods:{setupFunc(u,o,e,n,c,s){console.log("setupFunc"),u.beginPath(),u.moveTo(0,0),u.lineTo(o,e),u.lineTo(o/3,e),u.lineTo(0,0),u.stroke(),u.beginPath(),u.moveTo(o*.5,e*.1),u.lineTo(o,0),u.lineTo(o*.8,e*.6),u.lineTo(o*.4,e*.2),u.fill()},loopFunc(u,o,e,n,c,s){console.log("loopFunc")},touchOrMouseStartFunc(u,o,e,n,c,s){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,o,e,n,c,s){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,o,e,n,c,s){console.log("touchOrMouseEndFunc")}}}),b=p("p",null,"Chapter 2 2-2 \u753B\u9762\u30B5\u30A4\u30BA\u3001\u7DDA\u3092\u3064\u306A\u3052\u308B",-1);function M(u,o,e,n,c,s){const r=t;return F(),a("div",null,[b,h(r,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var Y=i(d,[["render",M]]);export{Y as default};
