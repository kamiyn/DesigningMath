import{_ as i,d as h,a as s,c as a,b as d,e as l,o as F}from"./bootstrap-b9527510.mjs";const p=h({components:{designingmath:s},setup(){},methods:{setupFunc(u,e,o,c,n,t){console.log("setupFunc"),u.beginPath(),u.moveTo(100,100),u.lineTo(200,100),u.bezierCurveTo(300,200,100,300,200,400),u.stroke(),u.beginPath(),u.moveTo(200,500),u.quadraticCurveTo(300,600,100,700),u.lineTo(100,500),u.closePath(),u.stroke()},loopFunc(u,e,o,c,n,t){console.log("loopFunc")},touchOrMouseStartFunc(u,e,o,c,n,t){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,e,o,c,n,t){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,e,o,c,n,t){console.log("touchOrMouseEndFunc")}}}),b=l("p",null,"Chapter 2 2-3 \u3044\u308D\u3044\u308D\u306A\u7DDA\u3092\u63CF\u304F",-1);function M(u,e,o,c,n,t){const r=s;return F(),a("div",null,[b,d(r,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var O=i(p,[["render",M]]);export{O as default};