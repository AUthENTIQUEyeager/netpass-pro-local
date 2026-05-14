exports.id=622,exports.ids=[622],exports.modules={34109:(e,t,s)=>{Promise.resolve().then(s.bind(s,45778))},12103:(e,t,s)=>{Promise.resolve().then(s.t.bind(s,2583,23)),Promise.resolve().then(s.t.bind(s,26840,23)),Promise.resolve().then(s.t.bind(s,38771,23)),Promise.resolve().then(s.t.bind(s,13225,23)),Promise.resolve().then(s.t.bind(s,9295,23)),Promise.resolve().then(s.t.bind(s,43982,23))},4404:()=>{},45778:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>k});var a=s(95344),l=s(3729),r=s(22254),i=s(20783),n=s.n(i),d=s(24482),o=s(76196),c=s(89895),h=s(85674),x=s(91917),m=s(61238),u=s(13746),p=s(98200),f=s(48120),y=s(28765),b=s(33037);let v=[{href:"/admin",label:"Dashboard",icon:d.Z},{href:"/admin/tickets",label:"Tickets",icon:o.Z},{href:"/admin/utilisateurs",label:"Utilisateurs",icon:c.Z},{href:"/admin/paiements",label:"Paiements",icon:h.Z},{href:"/admin/forfaits",label:"Forfaits",icon:x.Z},{href:"/admin/routeurs",label:"Routeurs",icon:m.Z},{href:"/admin/parametres",label:"Parametres",icon:u.Z}];function k({children:e}){let[t,s]=(0,l.useState)(!1),[i,d]=(0,l.useState)(null),o=(0,r.useRouter)(),c=(0,r.usePathname)();(0,l.useEffect)(()=>{let e=localStorage.getItem("netpass_token"),t=localStorage.getItem("netpass_admin");if(!e){o.push("/admin/login");return}t&&d(JSON.parse(t))},[]);let h=v.find(e=>e.href===c)?.label||"Administration";return(0,a.jsxs)("div",{className:"flex h-screen bg-[#0a0a0a] text-white overflow-hidden",children:[(0,a.jsxs)("aside",{className:`${t?"w-16":"w-56"} flex-shrink-0 bg-[#0f0f0f] border-r border-white/6 flex flex-col transition-all duration-300 h-screen sticky top-0`,children:[(0,a.jsxs)("div",{className:"h-16 flex items-center px-4 border-b border-white/6 gap-3 overflow-hidden",children:[a.jsx("div",{className:"w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(37,99,235,0.4)]",children:a.jsx(m.Z,{size:14,className:"text-white"})}),!t&&(0,a.jsxs)("div",{className:"overflow-hidden",children:[a.jsx("p",{className:"text-white text-sm font-semibold leading-none",children:"NetPass"}),a.jsx("p",{className:"text-blue-500 text-xs font-light tracking-widest mt-0.5",children:"ADMIN"})]}),a.jsx("button",{onClick:()=>s(!t),className:"ml-auto text-zinc-600 hover:text-zinc-400 transition-colors flex-shrink-0",children:a.jsx(p.Z,{size:14})})]}),a.jsx("nav",{className:"flex-1 py-3 px-2 space-y-0.5 overflow-y-auto",children:v.map(({href:e,label:s,icon:l})=>{let r=c===e;return(0,a.jsxs)(n(),{href:e,className:`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 overflow-hidden whitespace-nowrap border
                  ${r?"bg-blue-600/10 text-blue-400 border-blue-500/20":"text-zinc-500 hover:text-zinc-300 hover:bg-white/4 border-transparent"}`,children:[a.jsx(l,{size:15,className:"flex-shrink-0"}),!t&&a.jsx("span",{children:s})]},e)})}),a.jsx("div",{className:"p-2 border-t border-white/6",children:(0,a.jsxs)("button",{onClick:()=>{localStorage.removeItem("netpass_token"),localStorage.removeItem("netpass_admin"),o.push("/admin/login")},className:"w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-zinc-600 hover:text-zinc-400 text-sm transition-colors overflow-hidden whitespace-nowrap",children:[a.jsx(f.Z,{size:14,className:"flex-shrink-0"}),!t&&a.jsx("span",{children:"Deconnexion"})]})})]}),(0,a.jsxs)("div",{className:"flex-1 flex flex-col overflow-hidden",children:[(0,a.jsxs)("header",{className:"h-16 flex items-center justify-between px-6 border-b border-white/6 bg-[#0a0a0a] sticky top-0 z-10 flex-shrink-0",children:[(0,a.jsxs)("div",{children:[a.jsx("p",{className:"text-white font-semibold text-sm",children:h}),a.jsx("p",{className:"text-zinc-600 text-xs",children:new Date().toLocaleDateString("fr-FR",{weekday:"long",day:"2-digit",month:"long",year:"numeric"})})]}),(0,a.jsxs)("div",{className:"flex items-center gap-3",children:[(0,a.jsxs)("div",{className:"hidden md:flex relative",children:[a.jsx(y.Z,{size:12,className:"absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"}),a.jsx("input",{placeholder:"Rechercher...",className:"bg-white/3 border border-white/8 rounded-xl pl-8 pr-4 py-2 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 w-44 font-sans"})]}),(0,a.jsxs)("div",{className:"relative w-8 h-8 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer",children:[a.jsx(b.Z,{size:13}),a.jsx("span",{className:"absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500"})]}),a.jsx("div",{className:"w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center",children:a.jsx("span",{className:"text-blue-400 text-xs font-bold",children:i?.nom?.[0]?.toUpperCase()||"A"})})]})]}),a.jsx("main",{className:"flex-1 overflow-y-auto p-6",children:e})]})]})}},24482:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("BarChart2",[["line",{x1:"18",x2:"18",y1:"20",y2:"10",key:"1xfpm4"}],["line",{x1:"12",x2:"12",y1:"20",y2:"4",key:"be30l9"}],["line",{x1:"6",x2:"6",y1:"20",y2:"14",key:"1r4le6"}]])},33037:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Bell",[["path",{d:"M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9",key:"1qo2s2"}],["path",{d:"M10.3 21a1.94 1.94 0 0 0 3.4 0",key:"qgo35s"}]])},85674:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("CreditCard",[["rect",{width:"20",height:"14",x:"2",y:"5",rx:"2",key:"ynyp8z"}],["line",{x1:"2",x2:"22",y1:"10",y2:"10",key:"1b3vmo"}]])},1222:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("EyeOff",[["path",{d:"M9.88 9.88a3 3 0 1 0 4.24 4.24",key:"1jxqfv"}],["path",{d:"M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68",key:"9wicm4"}],["path",{d:"M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61",key:"1jreej"}],["line",{x1:"2",x2:"22",y1:"2",y2:"22",key:"a6p6uj"}]])},53148:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Eye",[["path",{d:"M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z",key:"rwhkz3"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},48120:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("LogOut",[["path",{d:"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4",key:"1uf3rs"}],["polyline",{points:"16 17 21 12 16 7",key:"1gabdz"}],["line",{x1:"21",x2:"9",y1:"12",y2:"12",key:"1uyos4"}]])},91917:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Package",[["path",{d:"m7.5 4.27 9 5.15",key:"1c824w"}],["path",{d:"M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z",key:"hh9hay"}],["path",{d:"m3.3 7 8.7 5 8.7-5",key:"g66t2b"}],["path",{d:"M12 22V12",key:"d0xqtd"}]])},28765:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Search",[["circle",{cx:"11",cy:"11",r:"8",key:"4ej97u"}],["path",{d:"m21 21-4.3-4.3",key:"1qie3q"}]])},13746:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Settings",[["path",{d:"M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",key:"1qme2f"}],["circle",{cx:"12",cy:"12",r:"3",key:"1v7zrd"}]])},76196:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Ticket",[["path",{d:"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z",key:"qn84l0"}],["path",{d:"M13 5v2",key:"dyzc3o"}],["path",{d:"M13 17v2",key:"1ont0d"}],["path",{d:"M13 11v2",key:"1wjjxi"}]])},89895:(e,t,s)=>{"use strict";s.d(t,{Z:()=>a});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let a=(0,s(69224).Z)("Users",[["path",{d:"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2",key:"1yyitq"}],["circle",{cx:"9",cy:"7",r:"4",key:"nufk8"}],["path",{d:"M22 21v-2a4 4 0 0 0-3-3.87",key:"kshegd"}],["path",{d:"M16 3.13a4 4 0 0 1 0 7.75",key:"1da9ce"}]])},66294:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>r,__esModule:()=>l,default:()=>i});let a=(0,s(86843).createProxy)(String.raw`C:\mes_logiciel\netpass-pro-local\frontend\app\admin\layout.tsx`),{__esModule:l,$$typeof:r}=a,i=a.default},82917:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>o,metadata:()=>d});var a=s(25036),l=s(9106),r=s.n(l),i=s(69048),n=s.n(i);s(67272);let d={title:"NetPass Pro — Plateforme WiFi Intelligente",description:"Achetez un acc\xe8s WiFi instantan\xe9. Payez avec Wave et connectez-vous imm\xe9diatement."};function o({children:e}){return a.jsx("html",{lang:"fr",className:`${r().variable} ${n().variable}`,children:a.jsx("body",{className:"bg-[#0f0f0f] text-white antialiased",children:e})})}},67272:()=>{}};