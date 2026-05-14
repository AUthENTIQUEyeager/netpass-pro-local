(()=>{var e={};e.id=314,e.ids=[314],e.modules={47849:e=>{"use strict";e.exports=require("next/dist/client/components/action-async-storage.external")},55403:e=>{"use strict";e.exports=require("next/dist/client/components/request-async-storage.external")},94749:e=>{"use strict";e.exports=require("next/dist/client/components/static-generation-async-storage.external")},20399:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},25528:e=>{"use strict";e.exports=require("next/dist\\client\\components\\action-async-storage.external.js")},91877:e=>{"use strict";e.exports=require("next/dist\\client\\components\\request-async-storage.external.js")},25319:e=>{"use strict";e.exports=require("next/dist\\client\\components\\static-generation-async-storage.external.js")},39491:e=>{"use strict";e.exports=require("assert")},6113:e=>{"use strict";e.exports=require("crypto")},82361:e=>{"use strict";e.exports=require("events")},57147:e=>{"use strict";e.exports=require("fs")},13685:e=>{"use strict";e.exports=require("http")},85158:e=>{"use strict";e.exports=require("http2")},95687:e=>{"use strict";e.exports=require("https")},41808:e=>{"use strict";e.exports=require("net")},71017:e=>{"use strict";e.exports=require("path")},12781:e=>{"use strict";e.exports=require("stream")},24404:e=>{"use strict";e.exports=require("tls")},76224:e=>{"use strict";e.exports=require("tty")},57310:e=>{"use strict";e.exports=require("url")},73837:e=>{"use strict";e.exports=require("util")},59796:e=>{"use strict";e.exports=require("zlib")},66102:(e,t,s)=>{"use strict";s.r(t),s.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>x,pages:()=>c,routeModule:()=>u,tree:()=>d});var i=s(50482),r=s(69108),a=s(62563),n=s.n(a),l=s(68300),o={};for(let e in l)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(o[e]=()=>l[e]);s.d(t,o);let d=["",{children:["admin",{children:["tickets",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(s.bind(s,51079)),"C:\\mes_logiciel\\netpass-pro-local\\frontend\\app\\admin\\tickets\\page.tsx"]}]},{}]},{layout:[()=>Promise.resolve().then(s.bind(s,66294)),"C:\\mes_logiciel\\netpass-pro-local\\frontend\\app\\admin\\layout.tsx"]}]},{layout:[()=>Promise.resolve().then(s.bind(s,82917)),"C:\\mes_logiciel\\netpass-pro-local\\frontend\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(s.t.bind(s,69361,23)),"next/dist/client/components/not-found-error"]}],c=["C:\\mes_logiciel\\netpass-pro-local\\frontend\\app\\admin\\tickets\\page.tsx"],x="/admin/tickets/page",p={require:s,loadChunk:()=>Promise.resolve()},u=new i.AppPageRouteModule({definition:{kind:r.x.APP_PAGE,page:"/admin/tickets/page",pathname:"/admin/tickets",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},97413:(e,t,s)=>{Promise.resolve().then(s.bind(s,44141))},44141:(e,t,s)=>{"use strict";s.r(t),s.d(t,{default:()=>m});var i=s(95344),r=s(3729),a=s(28765),n=s(51838),l=s(33733),o=s(94256),d=s(69224);/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let c=(0,d.Z)("Trash2",[["path",{d:"M3 6h18",key:"d0wm0j"}],["path",{d:"M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6",key:"4alrt4"}],["path",{d:"M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2",key:"v07s0e"}],["line",{x1:"10",x2:"10",y1:"11",y2:"17",key:"1uufr5"}],["line",{x1:"14",x2:"14",y1:"11",y2:"17",key:"xtxkd"}]]),x=(0,d.Z)("Printer",[["polyline",{points:"6 9 6 2 18 2 18 9",key:"1306q4"}],["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["rect",{width:"12",height:"8",x:"6",y:"14",key:"5ipwut"}]]);var p=s(18117);let u=({status:e})=>i.jsx("span",{className:{actif:"badge-active",expiré:"badge-expired",désactivé:"badge-disabled",en_attente:"badge-pending"}[e]||"badge-expired",children:{actif:"Actif",expiré:"Expir\xe9",désactivé:"D\xe9sactiv\xe9",en_attente:"En attente"}[e]||e});function m(){let[e,t]=(0,r.useState)([]),[s,d]=(0,r.useState)(0),[m,h]=(0,r.useState)(!0),[b,f]=(0,r.useState)(""),[g,v]=(0,r.useState)(""),[y,j]=(0,r.useState)(1),[w,N]=(0,r.useState)(!1),[k,z]=(0,r.useState)([]),[_,S]=(0,r.useState)([]),[q,C]=(0,r.useState)({forfait_id:"",routeur_id:"",quantite:1}),[P,F]=(0,r.useState)(!1),[M,$]=(0,r.useState)([]);(0,r.useEffect)(()=>{A(),(0,p.QY)().then(z).catch(()=>{}),(0,p.yF)().then(S).catch(()=>{})},[b,g,y]);let A=async()=>{h(!0);try{let e=await (0,p.SP)({search:b,statut:g,page:y});t(e.tickets),d(e.total)}catch{t([]),d(0)}finally{h(!1)}},E=async e=>{if(confirm("D\xe9sactiver ce ticket ?"))try{await (0,p.nk)(e),A()}catch{}},T=async e=>{if(confirm("Supprimer d\xe9finitivement ce ticket ?"))try{await (0,p.sN)(e),A()}catch{}},Z=async()=>{if(q.forfait_id&&q.routeur_id){F(!0);try{let e=await (0,p.pS)(q);$(e.tickets)}catch(e){alert(e.response?.data?.error||"Erreur lors de la g\xe9n\xe9ration")}finally{F(!1)}}};return(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsxs)("div",{className:"flex items-center justify-between flex-wrap gap-3",children:[i.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:[{label:"Tous",value:""},{label:"Actifs",value:"actif"},{label:"Expir\xe9s",value:"expir\xe9"},{label:"D\xe9sactiv\xe9s",value:"d\xe9sactiv\xe9"}].map(e=>i.jsx("button",{onClick:()=>{v(e.value),j(1)},className:`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all
                ${g===e.value?"border-blue-500 bg-blue-600/10 text-blue-400":"border-white/8 text-zinc-500 hover:border-white/15"}`,children:e.label},e.value))}),(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[(0,i.jsxs)("div",{className:"relative",children:[i.jsx(a.Z,{size:12,className:"absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"}),i.jsx("input",{value:b,onChange:e=>{f(e.target.value),j(1)},placeholder:"Rechercher...",className:"bg-white/3 border border-white/8 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500/40 w-40 font-sans"})]}),(0,i.jsxs)("button",{onClick:()=>{N(!0),$([])},className:"btn-primary text-xs py-2 px-3",children:[i.jsx(n.Z,{size:13})," G\xe9n\xe9rer vouchers"]}),i.jsx("button",{onClick:A,className:"w-8 h-8 rounded-xl bg-white/3 border border-white/8 flex items-center justify-center text-zinc-500 hover:text-zinc-300 transition-colors",children:i.jsx(l.Z,{size:13,className:m?"animate-spin":""})})]})]}),(0,i.jsxs)("div",{className:"rounded-2xl border border-white/8 bg-[#141414] overflow-hidden",children:[i.jsx("div",{className:"overflow-x-auto",children:(0,i.jsxs)("table",{className:"w-full text-xs",children:[i.jsx("thead",{children:i.jsx("tr",{className:"border-b border-white/6",children:["Utilisateur","Statut","Type","Site","Montant","Expiration","Actions"].map(e=>i.jsx("th",{className:"text-left px-4 py-3 text-zinc-500 font-medium",children:e},e))})}),i.jsx("tbody",{children:m?i.jsx("tr",{children:i.jsx("td",{colSpan:7,className:"px-4 py-8 text-center text-zinc-600",children:"Chargement..."})}):0===e.length?i.jsx("tr",{children:i.jsx("td",{colSpan:7,className:"px-4 py-8 text-center text-zinc-600",children:"Aucun ticket"})}):e.map(e=>(0,i.jsxs)("tr",{className:"border-b border-white/4 last:border-0 hover:bg-white/2 transition-colors",children:[i.jsx("td",{className:"px-4 py-3 font-mono font-medium text-white",children:e.username}),i.jsx("td",{className:"px-4 py-3",children:i.jsx(u,{status:e.statut})}),i.jsx("td",{className:"px-4 py-3 text-zinc-500 capitalize",children:e.type}),i.jsx("td",{className:"px-4 py-3 text-zinc-400",children:e.routeur?.site}),(0,i.jsxs)("td",{className:"px-4 py-3 text-white font-medium",children:[e.commande?.montant?.toLocaleString("fr")," F"]}),(0,i.jsxs)("td",{className:"px-4 py-3 text-zinc-500",children:[new Date(e.date_expiration).toLocaleDateString("fr-FR")," ",new Date(e.date_expiration).toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"})]}),i.jsx("td",{className:"px-4 py-3",children:(0,i.jsxs)("div",{className:"flex gap-1",children:[i.jsx("button",{onClick:()=>E(e.id),className:"w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all",title:"D\xe9sactiver",children:i.jsx(o.Z,{size:12})}),i.jsx("button",{onClick:()=>T(e.id),className:"w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all",title:"Supprimer",children:i.jsx(c,{size:12})})]})})]},e.id))})]})}),(0,i.jsxs)("div",{className:"px-4 py-3 border-t border-white/6 flex items-center justify-between text-xs text-zinc-500",children:[(0,i.jsxs)("span",{children:[s," ticket",s>1?"s":""]}),(0,i.jsxs)("div",{className:"flex gap-1",children:[i.jsx("button",{disabled:1===y,onClick:()=>j(e=>e-1),className:"px-2.5 py-1 rounded-lg border border-white/8 text-zinc-400 disabled:opacity-40 hover:border-white/15 transition-colors",children:"Pr\xe9c\xe9dent"}),i.jsx("button",{className:"px-2.5 py-1 rounded-lg bg-blue-600/15 border border-blue-500/30 text-blue-400",children:y}),i.jsx("button",{disabled:20*y>=s,onClick:()=>j(e=>e+1),className:"px-2.5 py-1 rounded-lg border border-white/8 text-zinc-400 disabled:opacity-40 hover:border-white/15 transition-colors",children:"Suivant"})]})]})]}),w&&(0,i.jsxs)("div",{className:"fixed inset-0 z-50 flex items-center justify-center px-6",children:[i.jsx("div",{className:"absolute inset-0 bg-black/60 backdrop-blur-sm",onClick:()=>{0===M.length&&N(!1)}}),i.jsx("div",{className:"relative z-10 w-full max-w-md bg-[#141414] border border-white/10 rounded-2xl p-6",children:0===M.length?(0,i.jsxs)(i.Fragment,{children:[i.jsx("h3",{className:"text-white font-semibold text-sm mb-1",children:"G\xe9n\xe9rer des vouchers cash"}),i.jsx("p",{className:"text-zinc-500 text-xs mb-5",children:"Les tickets seront cr\xe9\xe9s dans MikroTik et pr\xeats \xe0 \xeatre vendus en cash."}),(0,i.jsxs)("div",{className:"space-y-4",children:[(0,i.jsxs)("div",{children:[i.jsx("label",{className:"block text-xs text-zinc-500 mb-2",children:"Forfait"}),(0,i.jsxs)("select",{value:q.forfait_id,onChange:e=>C(t=>({...t,forfait_id:e.target.value})),className:"form-input",style:{background:"#1a1a1a"},children:[i.jsx("option",{value:"",children:"S\xe9lectionner un forfait"}),k.map(e=>(0,i.jsxs)("option",{value:e.id,children:[e.nom," — ",e.prix.toLocaleString("fr")," FCFA"]},e.id))]})]}),(0,i.jsxs)("div",{children:[i.jsx("label",{className:"block text-xs text-zinc-500 mb-2",children:"Site WiFi"}),(0,i.jsxs)("select",{value:q.routeur_id,onChange:e=>C(t=>({...t,routeur_id:e.target.value})),className:"form-input",style:{background:"#1a1a1a"},children:[i.jsx("option",{value:"",children:"S\xe9lectionner un site"}),_.map(e=>(0,i.jsxs)("option",{value:e.id,children:[e.site," — ",e.nom]},e.id))]})]}),(0,i.jsxs)("div",{children:[i.jsx("label",{className:"block text-xs text-zinc-500 mb-2",children:"Quantit\xe9 (max 200)"}),i.jsx("input",{type:"number",min:1,max:200,value:q.quantite,onChange:e=>C(t=>({...t,quantite:parseInt(e.target.value)||1})),className:"form-input"})]}),(0,i.jsxs)("div",{className:"flex gap-3 pt-2",children:[i.jsx("button",{onClick:()=>N(!1),className:"btn-ghost flex-1 justify-center py-2.5",children:"Annuler"}),i.jsx("button",{onClick:Z,disabled:P||!q.forfait_id||!q.routeur_id,className:"btn-primary flex-1 justify-center py-2.5",children:P?(0,i.jsxs)(i.Fragment,{children:[i.jsx("div",{className:"w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin"}),"G\xe9n\xe9ration..."]}):(0,i.jsxs)(i.Fragment,{children:[i.jsx(n.Z,{size:13}),"G\xe9n\xe9rer"]})})]})]})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"flex items-center gap-2 mb-1",children:[i.jsx("div",{className:"w-6 h-6 rounded-full bg-emerald-500/15 flex items-center justify-center text-emerald-400 text-xs",children:"✓"}),(0,i.jsxs)("h3",{className:"text-white font-semibold text-sm",children:[M.length," voucher",M.length>1?"s":""," g\xe9n\xe9r\xe9",M.length>1?"s":""]})]}),i.jsx("p",{className:"text-zinc-500 text-xs mb-4",children:"Tickets cr\xe9\xe9s dans MikroTik et pr\xeats \xe0 vendre."}),i.jsx("div",{className:"max-h-52 overflow-y-auto space-y-2 mb-4",children:M.map((e,t)=>(0,i.jsxs)("div",{className:"bg-white/3 border border-white/6 rounded-xl px-3 py-2.5 flex justify-between items-center",children:[(0,i.jsxs)("div",{children:[i.jsx("p",{className:"font-mono text-blue-400 text-xs font-bold",children:e.username}),i.jsx("p",{className:"font-mono text-emerald-400 text-xs",children:e.password})]}),(0,i.jsxs)("div",{className:"text-right",children:[i.jsx("p",{className:"text-zinc-400 text-xs",children:e.forfait}),(0,i.jsxs)("p",{className:"text-zinc-600 text-xs",children:[e.prix?.toLocaleString("fr")," F"]})]})]},t))}),(0,i.jsxs)("div",{className:"flex gap-2",children:[(0,i.jsxs)("button",{onClick:()=>(function(e){let t=e=>new Date(e).toLocaleDateString("fr-FR",{day:"2-digit",month:"2-digit",year:"numeric",hour:"2-digit",minute:"2-digit"}),s=e.map(e=>`
    <div class="voucher">
      <div class="voucher-header">
        <div class="wifi-icon">📶</div>
        <div>
          <div class="reseau">${e.nom_reseau||"NetPass WiFi"}</div>
          <div class="site">${e.site||""}</div>
        </div>
      </div>
      <div class="voucher-body">
        <div class="label">Identifiant</div>
        <div class="value username">${e.username}</div>
        <div class="label">Mot de passe</div>
        <div class="value password">${e.password}</div>
      </div>
      <div class="voucher-footer">
        <div class="forfait-info">
          <span class="badge-forfait">${e.forfait||""}</span>
          <span class="badge-prix">${e.prix?e.prix.toLocaleString("fr")+" FCFA":""}</span>
        </div>
        <div class="expiration">Expire le : ${e.date_expiration?t(e.date_expiration):""}</div>
      </div>
    </div>
  `).join(""),i=`<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Vouchers WiFi — NetPass Pro</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #fff; padding: 10mm; }
    .page-title { text-align: center; font-size: 14px; color: #666; margin-bottom: 8mm; }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 6mm; }
    .voucher {
      border: 2px dashed #4f46e5;
      border-radius: 10px;
      padding: 5mm;
      background: #fff;
      break-inside: avoid;
    }
    .voucher-header {
      display: flex;
      align-items: center;
      gap: 8px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 4mm;
      margin-bottom: 4mm;
    }
    .wifi-icon { font-size: 22px; }
    .reseau { font-weight: 700; font-size: 13px; color: #1e1b4b; }
    .site { font-size: 10px; color: #6b7280; }
    .voucher-body { margin-bottom: 4mm; }
    .label { font-size: 9px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.5px; margin-top: 3mm; }
    .value { font-size: 15px; font-weight: 700; letter-spacing: 1px; color: #111827; font-family: 'Courier New', monospace; }
    .username { color: #4f46e5; }
    .password { color: #059669; }
    .voucher-footer { border-top: 1px solid #e5e7eb; padding-top: 3mm; }
    .forfait-info { display: flex; gap: 6px; margin-bottom: 2mm; }
    .badge-forfait {
      background: #ede9fe; color: #4f46e5;
      font-size: 9px; font-weight: 600;
      padding: 2px 7px; border-radius: 20px;
    }
    .badge-prix {
      background: #d1fae5; color: #065f46;
      font-size: 9px; font-weight: 600;
      padding: 2px 7px; border-radius: 20px;
    }
    .expiration { font-size: 9px; color: #9ca3af; }
    @media print {
      body { padding: 5mm; }
      .grid { gap: 4mm; }
    }
  </style>
</head>
<body>
  <div class="page-title">NetPass Pro — Vouchers WiFi (${e.length} ticket${e.length>1?"s":""})</div>
  <div class="grid">${s}</div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`,r=window.open("","_blank","width=900,height=700");r&&(r.document.write(i),r.document.close())})(M),className:"flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-blue-500/30 bg-blue-600/10 text-blue-400 text-xs font-medium hover:bg-blue-600/20 transition-all",children:[i.jsx(x,{size:13})," Imprimer les vouchers"]}),i.jsx("button",{onClick:()=>{N(!1),$([]),A()},className:"btn-primary flex-1 justify-center py-2.5 text-xs",children:"Terminer"})]})]})})]})]})}},94256:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,s(69224).Z)("Power",[["path",{d:"M12 2v10",key:"mnfbl"}],["path",{d:"M18.4 6.6a9 9 0 1 1-12.77.04",key:"obofu9"}]])},33733:(e,t,s)=>{"use strict";s.d(t,{Z:()=>i});/**
 * @license lucide-react v0.303.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */let i=(0,s(69224).Z)("RefreshCw",[["path",{d:"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8",key:"v9h5vc"}],["path",{d:"M21 3v5h-5",key:"1q7to0"}],["path",{d:"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16",key:"3uifl3"}],["path",{d:"M8 16H3v5",key:"1cv678"}]])},51079:(e,t,s)=>{"use strict";s.r(t),s.d(t,{$$typeof:()=>a,__esModule:()=>r,default:()=>n});let i=(0,s(86843).createProxy)(String.raw`C:\mes_logiciel\netpass-pro-local\frontend\app\admin\tickets\page.tsx`),{__esModule:r,$$typeof:a}=i,n=i.default}};var t=require("../../../webpack-runtime.js");t.C(e);var s=e=>t(t.s=e),i=t.X(0,[572,54,770,676],()=>s(66102));module.exports=i})();