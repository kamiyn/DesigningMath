import{_ as l,d as F,a,c as p,b as d,e as M,o as b}from"./bootstrap-b9527510.mjs";class O{constructor(o,c){this.x=o,this.y=c}}var i=[];const y=F({components:{designingmath:a},setup(){},methods:{setupFunc(u,o,c,t,r,s){console.log("setupFunc"),i=[...Array(4).keys()].map(n=>new O(o/2,c/2))},loopFunc(u,o,c,t,r,s){console.log("loopFunc");var n=null;i.forEach(e=>{n===null?s&&(e.x=t,e.y=r):(e.x+=(n.x-e.x)/10,e.y+=(n.y-e.y)/10),n=e}),u.clearRect(0,0,o,c);const h=35;u.fillStyle="white",u.strokeStyle="black",u.lineWidth=4,i.forEach(e=>{u.beginPath(),u.arc(e.x,e.y,h,0,Math.PI*2,!0),u.fill(),u.stroke()})},touchOrMouseStartFunc(u,o,c,t,r,s){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(u,o,c,t,r,s){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(u,o,c,t,r,s){console.log("touchOrMouseEndFunc")}}}),f=M("p",null,"Chapter 9 9-1 \u30B3\u30F3\u30C8\u30ED\u30FC\u30EB\u30DD\u30A4\u30F3\u30C8\u3092\u4F5C\u308B",-1);function g(u,o,c,t,r,s){const n=a;return b(),p("div",null,[f,d(n,{setupFunc:u.setupFunc,loopFunc:u.loopFunc,touchOrMouseStartFunc:u.touchOrMouseStartFunc,touchOrMouseEndFunc:u.touchOrMouseEndFunc,touchOrMouseMoveFunc:u.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var _=l(y,[["render",g]]);export{_ as default};