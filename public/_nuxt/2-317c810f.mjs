import{_,d as $,a as M,c as z,e as C,b as X,o as B}from"./bootstrap-3d44acdd.mjs";function x(n){const e=n.hue%360+(n.hue<0?360:0),t=Math.min(Math.max(n.sat,0),255),u=Math.min(Math.max(n.bri,0),255),o=(1-t/255)*u;if(e<60)return{red:u,green:o+(e-0)/60*(u-o),blue:o};if(e<120)return{red:u-(e-60)/60*(u-o),green:u,blue:o};if(e<180)return{red:o,green:u,blue:o+(e-120)/60*(u-o)};if(e<240)return{red:o,green:u-(e-180)/60*(u-o),blue:u};if(e<300)return{red:o+(e-240)/60*(u-o),green:o,blue:u};if(e<=360)return{red:u,green:o,blue:u-(e-300)/60*(u-o)};throw"invalid hue"}const s=8,b=s,F=s*2;var a,m,f,v,O;const P=2;var i=0,Y;const V=$({components:{designingmath:M},setup(){},methods:{onClick(){i=++i%P,console.log(i)},setupFunc(n,e,t,r,u,o){console.log("setupFunc"),Y=new Date().getTime()},loopFunc(n,e,t,r,u,o){console.log("loopFunc");const l=(new Date().getTime()-Y)/1e3,c=Math.min(e,t);a=c/s,m=c/b,f=c/F;const g=a*s;v=(e-g)/2,O=(t-g)/2;const y=(F+1)*(b+1);var T=0;[...Array(F+1).keys()].forEach(p=>[...Array(b+1).keys()].forEach(S=>{const h=a/2,k=m*S+v+(p%2==1?-a/2:0),E=f*(p-1)+O,d=x({hue:T++/y*360+l*60*i,sat:r/e*255,bri:u/t*255});n.fillStyle=`rgb(${d.red},${d.green},${d.blue})`,n.beginPath(),n.arc(k+h,E+h,h,0,Math.PI*2,!0),n.fill()}))},touchOrMouseStartFunc(n,e,t,r,u,o){console.log("touchOrMouseStartFunc")},touchOrMouseMoveFunc(n,e,t,r,u,o){console.log("touchOrMouseMoveFunc")},touchOrMouseEndFunc(n,e,t,r,u,o){console.log("touchOrMouseEndFunc")}}});function w(n,e,t,r,u,o){const l=M;return B(),z("div",null,[C("p",{onClick:e[0]||(e[0]=c=>n.onClick())},"Chapter 6 6-2 \u8272\u76F8\u3092\u4F4D\u7F6E\u306B\u5C55\u958B"),X(l,{setupFunc:n.setupFunc,loopFunc:n.loopFunc,touchOrMouseStartFunc:n.touchOrMouseStartFunc,touchOrMouseEndFunc:n.touchOrMouseEndFunc,touchOrMouseMoveFunc:n.touchOrMouseMoveFunc},null,8,["setupFunc","loopFunc","touchOrMouseStartFunc","touchOrMouseEndFunc","touchOrMouseMoveFunc"])])}var K=_(V,[["render",w]]);export{K as default};
