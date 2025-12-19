import{d as hr,f as c,a as n,c as Ne,t as we,e as Ur}from"../chunks/B2rijitG.js";import{o as lt}from"../chunks/B5uXoKDF.js";import{n as nt,o as dt,b6 as ct,h as Dr,q as vt,C as ut,T as Kr,y as Xr,s as qr,z as pt,Y as ar,a1 as i,$ as t,a4 as r,g as e,a2 as F,a3 as sr,d as te,f as oe,a5 as Se,a6 as Ke,a0 as a,Z as A,aC as gt,v as yr,b7 as mt,_ as ur,b as Hr,ae as Jr,a7 as zr,a9 as Fr}from"../chunks/DztSR9n7.js";import{s as b}from"../chunks/DGtZoTxw.js";import{p as u,i as y,b as ft}from"../chunks/BepJJDSh.js";import{e as Ze,i as Qe}from"../chunks/ClWVLaBt.js";import{r as tr,a as De,e as Je,b as pr,B as Ve}from"../chunks/BNNCyM1d.js";import{a as Oe,A as We}from"../chunks/COqA2GOA.js";import{g as Vr}from"../chunks/BHD2reim.js";import"../chunks/Bx2k2zCd.js";import{i as gr}from"../chunks/7VvCqicd.js";import{s as ht}from"../chunks/_UCmf4u3.js";function bt(Te,d){let l=null,g=Dr;var x;if(Dr){l=pt;for(var m=vt(document.head);m!==null&&(m.nodeType!==ut||m.data!==Te);)m=Kr(m);if(m===null)Xr(!1);else{var R=Kr(m);m.remove(),qr(R)}}Dr||(x=document.head.appendChild(nt()));try{dt(()=>d(x),ct)}finally{g&&(Xr(!0),qr(l))}}var xt=c('<button type="button"> </button>'),_t=c('<p class="genre-selected-hint svelte-c2sxfd">선택된 장르: <strong class="svelte-c2sxfd"> </strong></p>'),yt=c('<div class="file-info"><span class="file-icon">📄</span> <span class="file-name"> </span> <span class="file-size"> </span> <button type="button" class="file-remove">✕</button></div>'),wt=c('<div class="error-banner"> </div>'),kt=c('<p class="upload-text">S3에 파일 업로드 중...</p> <div class="upload-progress-bar"><div class="upload-progress-fill"></div></div> <p class="upload-percentage"> </p>',1),Et=c('<p class="upload-text upload-processing"><span class="inline-spinner" aria-hidden="true"></span> 업로드 완료! 분석을 시작합니다...</p>'),zt=c('<p class="upload-text">소설을 업로드하고 있습니다...</p>'),Ct=c('<div class="info-banner"><div class="upload-status"><div class="upload-icon">⏳</div> <div class="upload-info"><!></div></div></div>'),Tt=c('<div class="success-banner">✅ 준비 완료! 소설 업로드 버튼을 클릭하세요</div>'),St=c('<div class="content-card"><div class="card-header"><h2 class="card-title">1단계: 소설 텍스트 입력</h2> <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p></div> <div class="card-body"><div class="section-block"><div class="section-header"><h3 class="section-title">기본 정보</h3> <p class="section-subtitle">소설의 제목과 설명을 입력하세요</p></div> <div class="section-content"><div class="form-row"><div class="form-group form-group-half"><label class="form-label">소설 제목 *</label> <input type="text" class="form-input" placeholder="예: 파리대왕"/></div> <div class="form-group form-group-half"><label class="form-label">설명 (선택)</label> <input type="text" class="form-input" placeholder="소설에 대한 간단한 설명"/></div></div> <div class="form-group"><label class="form-label">장르 선택 (선택)</label> <p class="field-hint">소설의 장르를 선택하세요</p> <div class="genre-grid svelte-c2sxfd"></div> <!></div></div></div> <div class="section-block"><div class="section-header"><h3 class="section-title">소설 내용 입력</h3> <p class="section-subtitle">파일을 업로드하거나 텍스트를 직접 입력하세요</p></div> <div class="section-content"><div class="input-method-card"><div class="method-header"><label class="form-label">파일 업로드</label> <p class="field-hint">지원 형식: .txt, .pdf, .doc, .docx (최대 10MB)</p></div> <div class="file-upload-wrapper"><label for="file-upload" class="file-upload-button"><span class="file-upload-icon">📁</span> <span class="file-upload-text">파일 선택</span></label> <input id="file-upload" type="file" accept=".txt,.pdf,.doc,.docx" class="file-input-hidden"/></div> <!></div></div></div> <!> <!></div></div>');function Gt(Te,d){ar(d,!1);let l=u(d,"title",8,""),g=u(d,"description",8,""),x=u(d,"genre",8,""),m=u(d,"uploadedFile",8,null),R=u(d,"uploading",8,!1),z=u(d,"uploadProgress",8,0),se=u(d,"canGoNext",8,!1),ue=u(d,"error",8,""),ve=u(d,"onTitleChange",8),Y=u(d,"onDescriptionChange",8),U=u(d,"onGenreChange",8),L=u(d,"onFileChange",8),pe=u(d,"onRemoveFile",8);const me=["고전문학","SF","추리","판타지","로맨스","교육"];gr();var le=St(),B=i(t(le),2),w=t(B),W=i(t(w),2),Z=t(W),q=t(Z),v=i(t(q),2);tr(v),v.__input=M=>ve()(M.target.value),r(q);var I=i(q,2),J=i(t(I),2);tr(J),J.__input=M=>Y()(M.target.value),r(I),r(Z);var ne=i(Z,2),G=i(t(ne),4);Ze(G,5,()=>me,Qe,(M,P)=>{var O=xt();let H;O.__click=()=>U()(e(P));var E=t(O,!0);r(O),F(()=>{H=De(O,1,"genre-button svelte-c2sxfd",null,H,{selected:x()===e(P)}),O.disabled=R(),b(E,e(P))}),n(M,O)}),r(G);var K=i(G,2);{var C=M=>{var P=_t(),O=i(t(P)),H=t(O,!0);r(O),r(P),F(()=>b(H,x())),n(M,P)};y(K,M=>{x()&&M(C)})}r(ne),r(W),r(w);var T=i(w,2),N=i(t(T),2),_=t(N),S=i(t(_),2),j=i(t(S),2);j.__change=function(...M){var P;(P=L())==null||P.apply(this,M)},r(S);var p=i(S,2);{var k=M=>{var P=yt(),O=i(t(P),2),H=t(O,!0);r(O);var E=i(O,2),D=t(E);r(E);var ie=i(E,2);ie.__click=function(...ge){var fe;(fe=pe())==null||fe.apply(this,ge)},r(P),F(ge=>{b(H,(oe(m()),te(()=>m().name))),b(D,`(${ge??""} KB)`),ie.disabled=R()},[()=>(oe(m()),te(()=>(m().size/1024).toFixed(1)))]),n(M,P)};y(p,M=>{m()&&M(k)})}r(_),r(N),r(T);var $=i(T,2);{var _e=M=>{var P=wt(),O=t(P);r(P),F(()=>b(O,`❌ ${ue()??""}`)),n(M,P)};y($,M=>{ue()&&M(_e)})}var f=i($,2);{var Q=M=>{var P=Ct(),O=t(P),H=i(t(O),2),E=t(H);{var D=ge=>{var fe=kt(),ee=i(Se(fe),2),ce=t(ee);r(ee);var re=i(ee,2),de=t(re);r(re),F(Ee=>{pr(ce,`width: ${z()??""}%`),b(de,`${Ee??""}%`)},[()=>(oe(z()),te(()=>z().toFixed(1)))]),n(ge,fe)},ie=ge=>{var fe=Ne(),ee=Se(fe);{var ce=de=>{var Ee=Et();n(de,Ee)},re=de=>{var Ee=zt();n(de,Ee)};y(ee,de=>{z()===100?de(ce):de(re,!1)},!0)}n(ge,fe)};y(E,ge=>{z()>0&&z()<100?ge(D):ge(ie,!1)})}r(H),r(O),r(P),n(M,P)},ke=M=>{var P=Ne(),O=Se(P);{var H=E=>{var D=Tt();n(E,D)};y(O,E=>{se()&&E(H)},!0)}n(M,P)};y(f,M=>{R()?M(Q):M(ke,!1)})}r(B),r(le),F(()=>{Je(v,l()),Je(J,g()),j.disabled=R()}),n(Te,le),sr()}hr(["input","click","change"]);var It=c('<div class="extracting-state"><div class="spinner"></div> <p class="extracting-text">AI가 소설을 분석하고 있습니다...</p> <p class="extracting-hint">요약과 등장인물을 추출하는 중...</p></div>'),Nt=c('<div class="summary-section"><h3 class="section-subtitle">소설 요약</h3> <div class="summary-box"> </div></div>'),Pt=c('<div class="selection-info"><p> </p></div>'),At=c('<div class="analysis-results"><div class="analysis-layout"><!> <div class="characters-section"><div class="section-subtitle-row"><h3 class="section-subtitle">추출된 등장인물 <span class="count-badge"> </span></h3> <p class="section-hint">NPC로 만들 캐릭터를 선택하세요 (1~2명)</p></div> <div class="character-list"><!></div></div></div> <!> <div class="success-banner"> </div></div>'),Mt=c('<div class="content-card"><div class="card-header"><h2 class="card-title">2단계: 등장인물 자동 추출</h2> <p class="card-desc">NPC 챗봇으로 만들 캐릭터를 1~2명 선택하세요</p></div> <div class="card-body"><!></div></div>');function Dt(Te,d){ar(d,!1);let l=u(d,"loadingAnalysis",8,!1),g=u(d,"summary",8,""),x=u(d,"characters",24,()=>[]),m=u(d,"selectedCharacterNames",24,()=>[]);u(d,"selectingCharacters",8,!1),gr();var R=Mt(),z=i(t(R),2),se=t(z);{var ue=Y=>{var U=It();n(Y,U)},ve=Y=>{var U=Ne(),L=Se(U);{var pe=me=>{var le=At(),B=t(le),w=t(B);{var W=_=>{var S=Nt(),j=i(t(S),2),p=t(j,!0);r(j),r(S),F(()=>b(p,g())),n(_,S)};y(w,_=>{g()&&_(W)})}var Z=i(w,2),q=t(Z),v=t(q),I=i(t(v)),J=t(I);r(I),r(v),Ke(2),r(q);var ne=i(q,2),G=t(ne);ht(G,d,"default",{}),r(ne),r(Z),r(B);var K=i(B,2);{var C=_=>{var S=Pt(),j=t(S);let p;var k=t(j);r(j),r(S),F(()=>{p=De(j,1,"selection-count",null,p,{complete:m().length>=1&&m().length<=2}),b(k,`${oe(m()),te(()=>m().length)??""}/2 선택됨 ${oe(m()),te(()=>m().length>=1&&m().length<=2?"✓":"")??""}`)}),n(_,S)};y(K,_=>{oe(m()),te(()=>m().length>0)&&_(C)})}var T=i(K,2),N=t(T);r(T),r(le),F(()=>{b(J,`${oe(x()),te(()=>x().length)??""}명`),b(N,`✅ 분석 완료! 등장인물 ${oe(x()),te(()=>x().length)??""}명 추출`)}),n(me,le)};y(L,me=>{oe(x()),te(()=>x().length>0)&&me(pe)},!0)}n(Y,U)};y(se,Y=>{l()?Y(ue):Y(ve,!1)})}r(z),r(R),n(Te,R),sr()}var Ft=c('<div class="loading-state"><div class="spinner"></div> <p>AI가 소설 주제에 맞는 게이지를 제안하고 있습니다...</p></div>'),jt=c('<div class="gauge-range"> </div>'),Rt=c('<button type="button"><div class="gauge-check"><!></div> <div class="gauge-info"><div class="gauge-name"> </div> <div class="gauge-desc"> </div> <!></div></button>'),Lt=c("<p> </p>"),Bt=c('<div class="form-group"><label class="form-label">AI가 제안한 게이지 (정확히 2개 선택) <span class="required">*</span></label> <p class="field-hint">소설의 주제와 내용에 맞춰 AI가 선택한 5가지 게이지입니다</p> <div class="gauge-grid"></div> <!></div>'),Ot=c('<div class="content-card"><div class="card-header"><h2 class="card-title">3단계: 게이지 선택</h2> <p class="card-desc">스토리에서 사용할 상태 지표를 선택하세요 (최소 2개)</p></div> <div class="card-body"><!></div></div>');function Yt(Te,d){ar(d,!1);let l=u(d,"proposedGauges",24,()=>[]),g=u(d,"selectedGaugeIds",24,()=>[]),x=u(d,"loadingGauges",8,!1),m=u(d,"selectingGauges",8,!1),R=u(d,"toggleGauge",8);gr();var z=Ot(),se=i(t(z),2),ue=t(se);{var ve=U=>{var L=Ft();n(U,L)},Y=U=>{var L=Ne(),pe=Se(L);{var me=le=>{var B=Bt(),w=i(t(B),4);Ze(w,5,l,Qe,(q,v)=>{var I=Rt();let J;I.__click=()=>R()(e(v).id);var ne=t(I),G=t(ne);{var K=k=>{var $=we("✓");n(k,$)};y(G,k=>{oe(g()),e(v),te(()=>g().includes(e(v).id))&&k(K)})}r(ne);var C=i(ne,2),T=t(C),N=t(T,!0);r(T);var _=i(T,2),S=t(_,!0);r(_);var j=i(_,2);{var p=k=>{var $=jt(),_e=t($);r($),F(()=>b(_e,`${e(v),te(()=>e(v).min_label)??""} ↔ ${e(v),te(()=>e(v).max_label)??""}`)),n(k,$)};y(j,k=>{e(v),te(()=>e(v).min_label&&e(v).max_label)&&k(p)})}r(C),r(I),F(k=>{J=De(I,1,"gauge-option",null,J,k),I.disabled=m(),b(N,(e(v),te(()=>e(v).name))),b(S,(e(v),te(()=>e(v).meaning||e(v).description)))},[()=>({selected:g().includes(e(v).id)})]),n(q,I)}),r(w);var W=i(w,2);{var Z=q=>{var v=Lt();let I;var J=t(v);r(v),F(()=>{I=De(v,1,"selection-count",null,I,{complete:g().length===2}),b(J,`${oe(g()),te(()=>g().length)??""}/2 선택됨 ${oe(g()),te(()=>g().length===2?"✓":"")??""}`)}),n(q,v)};y(W,q=>{oe(g()),te(()=>g().length>0)&&q(Z)})}r(B),n(le,B)};y(pe,le=>{oe(l()),te(()=>l().length>0)&&le(me)},!0)}n(U,L)};y(ue,U=>{x()?U(ve):U(Y,!1)})}r(se),r(z),n(Te,z),sr()}hr(["click"]);var Ut=c('<div class="content-card"><div class="card-header"><h2 class="card-title">4단계: 예상 엔딩 설계</h2> <p class="card-desc">스토리에서 생성할 엔딩의 유형과 개수를 설정하세요</p></div> <div class="card-body"><div class="config-layout"><div class="config-main"><div class="form-group"><label class="form-label">엔딩 구성</label> <div class="ending-config"><div class="ending-item"><label>😊 해피 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>😢 비극 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>😐 중립 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>🤔 열린 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>💀 배드 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div></div></div> <div class="form-row"><div class="form-group form-group-half"><label class="form-label">에피소드 수 (1-10)</label> <div class="slider-container"><input type="range" min="1" max="10" class="slider"/> <span class="slider-value"> </span></div></div> <div class="form-group form-group-half"><label class="form-label">분기 깊이 (2-5)</label> <div class="slider-container"><input type="range" min="2" max="5" class="slider"/> <span class="slider-value"> </span></div></div></div></div> <div class="config-sidebar"><div class="info-card"><h3 class="info-title">예상 생성 규모</h3> <ul class="info-list"><li>총 에피소드: <strong> </strong></li> <li>분기 깊이: <strong> </strong></li> <li>예상 노드 수: <strong> </strong></li> <li>총 엔딩 수: <strong> </strong></li></ul></div></div></div></div></div>');function Kt(Te,d){ar(d,!1);let l=u(d,"endingConfig",24,()=>({happy:2,tragic:1,neutral:1,open:1,bad:0})),g=u(d,"numEpisodes",8,5),x=u(d,"maxDepth",8,3),m=u(d,"onEndingChange",8),R=u(d,"onNumEpisodesChange",8),z=u(d,"onMaxDepthChange",8);gr();var se=Ut(),ue=i(t(se),2),ve=t(ue),Y=t(ve),U=t(Y),L=i(t(U),2),pe=t(L),me=i(t(pe),2);tr(me),me.__input=ee=>m()("happy",+ee.target.value),r(pe);var le=i(pe,2),B=i(t(le),2);tr(B),B.__input=ee=>m()("tragic",+ee.target.value),r(le);var w=i(le,2),W=i(t(w),2);tr(W),W.__input=ee=>m()("neutral",+ee.target.value),r(w);var Z=i(w,2),q=i(t(Z),2);tr(q),q.__input=ee=>m()("open",+ee.target.value),r(Z);var v=i(Z,2),I=i(t(v),2);tr(I),I.__input=ee=>m()("bad",+ee.target.value),r(v),r(L),r(U);var J=i(U,2),ne=t(J),G=i(t(ne),2),K=t(G);tr(K),K.__input=ee=>R()(+ee.target.value);var C=i(K,2),T=t(C);r(C),r(G),r(ne);var N=i(ne,2),_=i(t(N),2),S=t(_);tr(S),S.__input=ee=>z()(+ee.target.value);var j=i(S,2),p=t(j);r(j),r(_),r(N),r(J),r(Y);var k=i(Y,2),$=t(k),_e=i(t($),2),f=t(_e),Q=i(t(f)),ke=t(Q);r(Q),r(f);var M=i(f,2),P=i(t(M)),O=t(P);r(P),r(M);var H=i(M,2),E=i(t(H)),D=t(E);r(E),r(H);var ie=i(H,2),ge=i(t(ie)),fe=t(ge);r(ge),r(ie),r(_e),r($),r(k),r(ve),r(ue),r(se),F((ee,ce)=>{Je(me,(oe(l()),te(()=>l().happy))),Je(B,(oe(l()),te(()=>l().tragic))),Je(W,(oe(l()),te(()=>l().neutral))),Je(q,(oe(l()),te(()=>l().open))),Je(I,(oe(l()),te(()=>l().bad))),Je(K,g()),b(T,`${g()??""}화`),Je(S,x()),b(p,`레벨 ${x()??""}`),b(ke,`${g()??""}화`),b(O,`레벨 ${x()??""}`),b(D,`약 ${ee??""}개`),b(fe,`${ce??""}개`)},[()=>(oe(x()),oe(g()),te(()=>Math.pow(2,x())*g())),()=>(oe(l()),te(()=>Object.values(l()).reduce((ee,ce)=>ee+ce,0)))]),n(Te,se),sr()}hr(["input"]);var Xt=c('<span class="choices-badge svelte-1dd3ufc"> </span>'),qt=c('<span class="children-badge svelte-1dd3ufc"> </span>'),Jt=c('<div class="selected-indicator svelte-1dd3ufc"><span class="svelte-1dd3ufc">✏️ 편집 중</span></div>'),Vt=c('<div class="child-branch svelte-1dd3ufc"><div class="connector-to-child svelte-1dd3ufc"></div> <!></div>'),Ht=c('<div class="children-wrapper svelte-1dd3ufc"><div class="connector-vertical svelte-1dd3ufc"></div> <div class="connector-horizontal svelte-1dd3ufc"></div> <div class="children-row svelte-1dd3ufc"></div></div>'),Wt=c('<div><button type="button"><div class="node-badges svelte-1dd3ufc"><span class="depth-badge svelte-1dd3ufc"> </span> <span class="id-badge svelte-1dd3ufc"> </span></div> <div class="node-body svelte-1dd3ufc"><p class="node-text svelte-1dd3ufc"> </p></div> <div class="node-footer svelte-1dd3ufc"><!> <!></div> <!></button> <!></div>'),Zt=c('<div class="tree-content svelte-1dd3ufc"><!></div>'),Qt=c('<div class="empty-state svelte-1dd3ufc"><span class="empty-icon svelte-1dd3ufc">🌳</span> <p class="svelte-1dd3ufc">트리 데이터가 없습니다.</p></div>'),$t=c('<div class="tree-container svelte-1dd3ufc"><div class="tree-controls svelte-1dd3ufc"><div class="control-hint svelte-1dd3ufc"><span class="hint-icon svelte-1dd3ufc">✋</span> <span class="svelte-1dd3ufc">빈 공간 드래그로 이동</span></div> <div class="control-actions svelte-1dd3ufc"><span class="zoom-label svelte-1dd3ufc"> </span> <button type="button" class="zoom-btn svelte-1dd3ufc">−</button> <button type="button" class="zoom-btn svelte-1dd3ufc">+</button> <button type="button" class="zoom-btn reset svelte-1dd3ufc">↺</button></div></div> <div role="application" aria-label="스토리 트리 뷰어"><!></div></div>');function ea(Te,d){ar(d,!0);let l=u(d,"rootNode",3,null),g=u(d,"selectedNodeId",3,"");u(d,"maxDepth",3,3),u(d,"episodeTitle",3,"");let x,m=A(!1),R=A(0),z=A(0),se=A(0),ue=A(0);function ve(p){e(m)||(console.log("노드 클릭됨:",p.id),d.onselectnode&&d.onselectnode(new CustomEvent("selectnode",{detail:{node:p}})))}function Y(p){return g()===p}function U(p){const k=["#ff4d4f","#1890ff","#52c41a","#faad14","#722ed1"];return k[Math.min(p,k.length-1)]}function L(p,k=60){return p?p.length>k?p.slice(0,k)+"...":p:""}function pe(p){p.target.closest(".node-card")||(a(m,!0),a(R,p.pageX-x.offsetLeft),a(z,p.pageY-x.offsetTop),a(se,x.scrollLeft,!0),a(ue,x.scrollTop,!0))}function me(p){if(!e(m))return;p.preventDefault();const k=p.pageX-x.offsetLeft,$=p.pageY-x.offsetTop,_e=(k-e(R))*1.5,f=($-e(z))*1.5;x.scrollLeft=e(se)-_e,x.scrollTop=e(ue)-f}function le(){a(m,!1)}function B(){a(m,!1)}let w=A(1);function W(p){if(p.ctrlKey){p.preventDefault();const k=p.deltaY>0?-.1:.1;a(w,Math.min(Math.max(.5,e(w)+k),2),!0)}}function Z(){a(w,1)}var q=$t(),v=t(q),I=i(t(v),2),J=t(I),ne=t(J);r(J);var G=i(J,2);G.__click=()=>a(w,Math.max(.5,e(w)-.1),!0);var K=i(G,2);K.__click=()=>a(w,Math.min(2,e(w)+.1),!0);var C=i(K,2);C.__click=Z,r(I),r(v);var T=i(v,2);let N;T.__mousedown=pe,T.__mousemove=me,T.__mouseup=le;var _=t(T);{var S=p=>{var k=Zt();{const _e=(f,Q=gt,ke)=>{let M=yr(()=>mt(ke==null?void 0:ke(),!1));var P=Wt();let O;var H=t(P);let E;H.__click=()=>ve(Q());var D=t(H),ie=t(D),ge=t(ie);r(ie);var fe=i(ie,2),ee=t(fe,!0);r(fe),r(D);var ce=i(D,2),re=t(ce),de=t(re,!0);r(re),r(ce);var Ee=i(ce,2),he=t(Ee);{var Ge=xe=>{var Pe=Xt(),$e=t(Pe);r(Pe),F(()=>b($e,`🎯 ${Q().choices.length??""}`)),n(xe,Pe)};y(he,xe=>{Q().choices&&Q().choices.length>0&&xe(Ge)})}var Re=i(he,2);{var Ie=xe=>{var Pe=qt(),$e=t(Pe);r(Pe),F(()=>b($e,`🌿 ${Q().children.length??""}`)),n(xe,Pe)};y(Re,xe=>{Q().children&&Q().children.length>0&&xe(Ie)})}r(Ee);var ir=i(Ee,2);{var nr=xe=>{var Pe=Jt();n(xe,Pe)};y(ir,xe=>{Y(Q().id)&&xe(nr)})}r(H);var dr=i(H,2);{var Le=xe=>{var Pe=Ht(),$e=i(t(Pe),4);Ze($e,21,()=>Q().children,Qe,(br,Cr)=>{var mr=Vt(),Tr=i(t(mr),2);_e(Tr,()=>e(Cr),()=>!1),r(mr),n(br,mr)}),r($e),r(Pe),n(xe,Pe)};y(dr,xe=>{Q().children&&Q().children.length>0&&xe(Le)})}r(P),F((xe,Pe,$e,br)=>{O=De(P,1,"node-branch svelte-1dd3ufc",null,O,{"is-root":e(M)}),E=De(H,1,"node-card svelte-1dd3ufc",null,E,xe),pr(H,`--node-color: ${Pe??""}`),pr(ie,`background: ${$e??""}`),b(ge,`D${Q().depth??""}`),b(ee,Q().id),b(de,br)},[()=>({selected:Y(Q().id)}),()=>U(Q().depth),()=>U(Q().depth),()=>L(Q().text)]),n(f,P)};var $=t(k);_e($,l,()=>!0),r(k)}F(()=>pr(k,`transform: scale(${e(w)??""}); transform-origin: top left;`)),n(p,k)},j=p=>{var k=Qt();n(p,k)};y(_,p=>{l()?p(S):p(j,!1)})}r(T),ft(T,p=>x=p,()=>x),r(q),F(p=>{b(ne,`확대: ${p??""}%`),N=De(T,1,"tree-scroll-area svelte-1dd3ufc",null,N,{dragging:e(m)})},[()=>Math.round(e(w)*100)]),Ur("mouseleave",T,B),Ur("wheel",T,W),n(Te,q),sr()}hr(["click","mousedown","mousemove","mouseup"]);var ra=c('<span class="tag svelte-cwg4ci"> </span>'),ta=c('<div class="choice-tags svelte-cwg4ci"></div>'),aa=c('<div class="choice-item svelte-cwg4ci"><span class="choice-number svelte-cwg4ci"></span> <input type="text" class="choice-input svelte-cwg4ci" placeholder="선택지 텍스트..."/> <!></div>'),sa=c('<div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci"> </label> <div class="choices-list svelte-cwg4ci"></div></div>'),ia=c('<p class="form-hint svelte-cwg4ci">💡 이 프롬프트는 소설의 전체적인 분위기와 스타일에 맞게 자동으로 조정됩니다.</p>'),oa=c('<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">상황:</span> <span class="detail-value svelte-cwg4ci"> </span></div>'),la=c('<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">NPC 감정:</span> <span class="detail-value svelte-cwg4ci"> </span></div>'),na=c('<div class="details-section svelte-cwg4ci"><h4 class="details-title svelte-cwg4ci">📋 상세 정보</h4> <!> <!></div>'),da=c('<span class="status-changed svelte-cwg4ci">⚠️ 변경사항이 있습니다</span>'),ca=c('<span class="status-saved svelte-cwg4ci">✓ 저장됨</span>'),va=c('<div class="editor-header svelte-cwg4ci"><h3 class="editor-title svelte-cwg4ci">✏️ 노드 편집</h3> <div class="node-info svelte-cwg4ci"><span class="info-badge svelte-cwg4ci"> </span> <span class="info-badge svelte-cwg4ci"> </span></div></div> <div class="editor-body svelte-cwg4ci"><div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci">노드 텍스트</label> <textarea class="form-textarea svelte-cwg4ci" rows="4" placeholder="스토리 텍스트를 입력하세요..."></textarea></div> <!> <div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci">🖼️ 이미지 프롬프트 <span class="label-hint svelte-cwg4ci">소설 분위기에 맞는 이미지를 위한 프롬프트를 입력하세요</span></label> <textarea class="form-textarea image-prompt-textarea svelte-cwg4ci" rows="3" placeholder="예: 어둡고 신비로운 숲 속 마법사의 탑, 판타지 스타일, 달빛이 비치는 밤..."></textarea> <!></div> <!></div> <div class="editor-footer svelte-cwg4ci"><div class="status-info svelte-cwg4ci"><!></div> <div class="editor-actions svelte-cwg4ci"><!> <!></div></div>',1),ua=c('<div class="no-selection svelte-cwg4ci"><div class="no-selection-icon svelte-cwg4ci">👆</div> <p class="no-selection-text svelte-cwg4ci">편집할 노드를 선택하세요</p> <p class="no-selection-hint svelte-cwg4ci">트리에서 노드를 클릭하면 여기서 편집할 수 있습니다</p></div>'),pa=c('<div class="editor-panel svelte-cwg4ci"><!></div>');function ga(Te,d){ar(d,!0);let l=u(d,"node",3,null),g=u(d,"isLoading",3,!1);u(d,"episodeTitle",3,""),u(d,"episodeOrder",3,1);let x=A(""),m=A(ur([])),R=A(""),z=A(!1);Hr(()=>{l()&&(a(x,l().text,!0),a(m,l().choices?[...l().choices.map(w=>({...w}))]:[],!0),a(R,l().imagePrompt||"",!0),a(z,!1))});function se(w){const W=w.target;a(x,W.value,!0),Y()}function ue(w,W){e(m)[w].text=W,Y()}function ve(w){const W=w.target;a(R,W.value,!0),Y()}function Y(){if(!l()){a(z,!1);return}const w=e(x)!==l().text,W=e(m).some((q,v)=>l().choices&&l().choices[v]&&q.text!==l().choices[v].text),Z=e(R)!==(l().imagePrompt||"");a(z,w||W||Z,!0)}function U(){!l()||!e(z)||d.onapplychanges&&d.onapplychanges(new CustomEvent("applychanges",{detail:{nodeId:l().id,newText:e(x),newChoices:e(m),newImagePrompt:e(R)}}))}function L(){l()&&(a(x,l().text,!0),a(m,l().choices?[...l().choices.map(w=>({...w}))]:[],!0),a(R,l().imagePrompt||"",!0),a(z,!1)),d.oncancel&&d.oncancel()}var pe=pa(),me=t(pe);{var le=w=>{var W=va(),Z=Se(W),q=i(t(Z),2),v=t(q),I=t(v);r(v);var J=i(v,2),ne=t(J);r(J),r(q),r(Z);var G=i(Z,2),K=t(G),C=i(t(K),2);Jr(C),C.__input=se,r(K);var T=i(K,2);{var N=E=>{var D=sa(),ie=t(D),ge=t(ie);r(ie);var fe=i(ie,2);Ze(fe,21,()=>e(m),Qe,(ee,ce,re)=>{var de=aa(),Ee=t(de);Ee.textContent=re+1;var he=i(Ee,2);tr(he),he.__input=Ie=>ue(re,Ie.target.value);var Ge=i(he,2);{var Re=Ie=>{var ir=ta();Ze(ir,21,()=>e(ce).tags,Qe,(nr,dr)=>{var Le=ra(),xe=t(Le,!0);r(Le),F(()=>b(xe,e(dr))),n(nr,Le)}),r(ir),n(Ie,ir)};y(Ge,Ie=>{e(ce).tags&&e(ce).tags.length>0&&Ie(Re)})}r(de),F(()=>{Je(he,e(ce).text),he.disabled=g()}),n(ee,de)}),r(fe),r(D),F(()=>b(ge,`선택지 (${e(m).length??""}개)`)),n(E,D)};y(T,E=>{e(m).length>0&&E(N)})}var _=i(T,2),S=i(t(_),2);Jr(S),S.__input=ve;var j=i(S,2);{var p=E=>{var D=ia();n(E,D)};y(j,E=>{e(R)&&E(p)})}r(_);var k=i(_,2);{var $=E=>{var D=na(),ie=i(t(D),2);{var ge=ce=>{var re=oa(),de=i(t(re),2),Ee=t(de,!0);r(de),r(re),F(()=>b(Ee,l().details.situation)),n(ce,re)};y(ie,ce=>{l().details.situation&&ce(ge)})}var fe=i(ie,2);{var ee=ce=>{var re=la(),de=i(t(re),2),Ee=t(de,!0);r(de),r(re),F(he=>b(Ee,he),[()=>Object.entries(l().details.npc_emotions).map(([he,Ge])=>`${he}: ${Ge}`).join(", ")]),n(ce,re)};y(fe,ce=>{l().details.npc_emotions&&Object.keys(l().details.npc_emotions).length>0&&ce(ee)})}r(D),n(E,D)};y(k,E=>{l().details&&E($)})}r(G);var _e=i(G,2),f=t(_e),Q=t(f);{var ke=E=>{var D=da();n(E,D)},M=E=>{var D=ca();n(E,D)};y(Q,E=>{e(z)?E(ke):E(M,!1)})}r(f);var P=i(f,2),O=t(P);Ve(O,{variant:"outline",onclick:L,get disabled(){return g()},children:(E,D)=>{Ke();var ie=we("취소");n(E,ie)},$$slots:{default:!0}});var H=i(O,2);{let E=zr(()=>!e(z)||g());Ve(H,{onclick:U,get disabled(){return e(E)},children:(D,ie)=>{var ge=Ne(),fe=Se(ge);{var ee=re=>{var de=we("⏳ 적용 중...");n(re,de)},ce=re=>{var de=we("🔄 적용 (서브트리 재생성)");n(re,de)};y(fe,re=>{g()?re(ee):re(ce,!1)})}n(D,ge)},$$slots:{default:!0}})}r(P),r(_e),F(()=>{b(I,`ID: ${l().id??""}`),b(ne,`깊이: ${l().depth??""}`),Je(C,e(x)),C.disabled=g(),Je(S,e(R)),S.disabled=g()}),n(w,W)},B=w=>{var W=ua();n(w,W)};y(me,w=>{l()?w(le):w(B,!1)})}r(pe),n(Te,pe),sr()}hr(["input"]);var ma=c('<span class="btn-icon svelte-10hxdp2">✅</span> 완료하기',1),fa=c('<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드',1),ha=c('<div class="edit-main svelte-10hxdp2"><div class="tree-panel svelte-10hxdp2"><div class="panel-header svelte-10hxdp2"><div class="panel-title-group svelte-10hxdp2"><span class="panel-icon svelte-10hxdp2">📊</span> <span class="panel-title svelte-10hxdp2">스토리 트리</span></div> <div class="panel-actions svelte-10hxdp2"><span class="tree-stats svelte-10hxdp2"><!></span></div></div> <div class="tree-viewport svelte-10hxdp2"><!></div></div> <div class="editor-panel svelte-10hxdp2"><!></div></div> <div class="edit-footer svelte-10hxdp2"><div class="footer-left svelte-10hxdp2"><div class="hint-card svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">💡</span> <div class="hint-content svelte-10hxdp2"><strong class="svelte-10hxdp2">사용법</strong> <span class="svelte-10hxdp2">노드 클릭 → 내용 수정 → 적용 버튼</span></div></div></div> <div class="footer-right svelte-10hxdp2"><!> <!></div></div>',1),ba=c('<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드',1),xa=c('<div class="empty-state svelte-10hxdp2"><div class="empty-visual svelte-10hxdp2"><div class="empty-icon-wrapper svelte-10hxdp2"><span class="empty-icon svelte-10hxdp2">⚠️</span></div> <div class="empty-rings svelte-10hxdp2"></div></div> <h3 class="empty-title svelte-10hxdp2">트리 데이터를 불러올 수 없습니다</h3> <p class="empty-desc svelte-10hxdp2">에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.</p> <div class="empty-actions svelte-10hxdp2"><!> <!></div></div>'),_a=c('<div class="tree-edit-mode svelte-10hxdp2"><div class="edit-header svelte-10hxdp2"><div class="header-left svelte-10hxdp2"><div class="step-badge svelte-10hxdp2"><span class="step-icon svelte-10hxdp2">🌳</span> <span class="step-text svelte-10hxdp2">5단계</span></div> <div class="header-info svelte-10hxdp2"><h2 class="header-title svelte-10hxdp2">에피소드 트리 편집</h2> <p class="header-desc svelte-10hxdp2">스토리 분기를 검토하고 필요하면 수정하세요</p></div></div> <div class="header-right svelte-10hxdp2"><div class="episode-indicator svelte-10hxdp2"><span class="episode-label svelte-10hxdp2">에피소드</span> <span class="episode-current svelte-10hxdp2"> </span> <span class="episode-divider svelte-10hxdp2">/</span> <span class="episode-total svelte-10hxdp2"> </span></div></div></div> <!></div>'),ya=c('<div class="particle svelte-10hxdp2"></div>'),wa=c('<p class="progress-message svelte-10hxdp2"> </p>'),ka=c('<span class="dot-icon svelte-10hxdp2">✓</span>'),Ea=c('<span class="dot-spinner svelte-10hxdp2"></span>'),za=c('<span class="dot-number svelte-10hxdp2"></span>'),Ca=c("<div><!></div>"),Ta=c('<div class="generating-mode svelte-10hxdp2"><div class="gen-visual svelte-10hxdp2"><div class="gen-animation svelte-10hxdp2"><div class="gen-core svelte-10hxdp2"><span class="gen-emoji svelte-10hxdp2">🚀</span></div> <div class="gen-orbit orbit-1 svelte-10hxdp2"></div> <div class="gen-orbit orbit-2 svelte-10hxdp2"></div> <div class="gen-orbit orbit-3 svelte-10hxdp2"></div> <div class="gen-particles svelte-10hxdp2"></div></div> <div class="gen-status svelte-10hxdp2"><h2 class="gen-title svelte-10hxdp2">AI가 스토리를 생성하고 있습니다 <span class="gen-dots svelte-10hxdp2"><span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span></span></h2> <p class="gen-subtitle svelte-10hxdp2"> </p></div></div> <div class="gen-progress-card svelte-10hxdp2"><div class="progress-header svelte-10hxdp2"><span class="progress-label svelte-10hxdp2">전체 진행률</span> <span class="progress-value svelte-10hxdp2"> </span></div> <div class="progress-bar-container svelte-10hxdp2"><div class="progress-bar-fill svelte-10hxdp2"></div> <div class="progress-bar-active svelte-10hxdp2"></div></div> <!> <div class="episode-grid svelte-10hxdp2"></div> <p class="progress-hint svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">⏱️</span> 예상 소요 시간: 약 1-2분</p></div></div>'),Sa=c('<div class="error-toast svelte-10hxdp2"><span class="error-icon svelte-10hxdp2">❌</span> <span class="error-text svelte-10hxdp2"> </span></div>'),Ga=c('<div class="step5-container svelte-10hxdp2"><!> <!></div>');function Ia(Te,d){ar(d,!1);let l=u(d,"treeEditMode",8,!1),g=u(d,"currentEpisodeTree",8,null),x=u(d,"selectedNode",8,null),m=u(d,"regenerating",8,!1),R=u(d,"currentEpisodeTitle",8,""),z=u(d,"currentEpisode",8,1),se=u(d,"actualTotalEpisodes",8,0),ue=u(d,"generating",8,!1),ve=u(d,"progressMessage",8,""),Y=u(d,"totalEpisodesGenerated",8,0),U=u(d,"numEpisodes",8,0),L=u(d,"error",8,""),pe=u(d,"maxDepth",8,3),me=u(d,"onSelectNode",8),le=u(d,"onApplyChanges",8),B=u(d,"onCancelSelect",8),w=u(d,"onGenerateNextEpisodeFromTree",8),W=u(d,"onBackToSettings",8);gr();var Z=Ga(),q=t(Z);{var v=G=>{var K=_a(),C=t(K),T=i(t(C),2),N=t(T),_=i(t(N),2),S=t(_,!0);r(_);var j=i(_,4),p=t(j,!0);r(j),r(N),r(T),r(C);var k=i(C,2);{var $=f=>{var Q=ha(),ke=Se(Q),M=t(ke),P=t(M),O=i(t(P),2),H=t(O),E=t(H);{var D=he=>{var Ge=we();F(()=>b(Ge,`📖 ${R()??""}`)),n(he,Ge)};y(E,he=>{R()&&he(D)})}r(H),r(O),r(P);var ie=i(P,2),ge=t(ie);{let he=yr(()=>(oe(x()),te(()=>{var Ge;return((Ge=x())==null?void 0:Ge.id)||""})));ea(ge,{get rootNode(){return g()},get selectedNodeId(){return e(he)},get maxDepth(){return pe()},episodeTitle:"",get onselectnode(){return me()}})}r(ie),r(M);var fe=i(M,2),ee=t(fe);ga(ee,{get node(){return x()},get isLoading(){return m()},get episodeTitle(){return R()},get episodeOrder(){return z()},get onapplychanges(){return le()},get oncancel(){return B()}}),r(fe),r(ke);var ce=i(ke,2),re=i(t(ce),2),de=t(re);{let he=yr(()=>ue()||m());Ve(de,{variant:"outline",get onclick(){return W()},get disabled(){return e(he)},children:(Ge,Re)=>{Ke();var Ie=we("← 설정으로");n(Ge,Ie)},$$slots:{default:!0}})}var Ee=i(de,2);{let he=yr(()=>ue()||m());Ve(Ee,{onclick:()=>{confirm("현재 에피소드를 확정하고 다음으로 진행하시겠습니까?")&&w()()},get disabled(){return e(he)},children:(Ge,Re)=>{var Ie=Ne(),ir=Se(Ie);{var nr=Le=>{var xe=ma();Ke(),n(Le,xe)},dr=Le=>{var xe=fa();Ke(),n(Le,xe)};y(ir,Le=>{z()>=se()?Le(nr):Le(dr,!1)})}n(Ge,Ie)},$$slots:{default:!0}})}r(re),r(ce),n(f,Q)},_e=f=>{var Q=xa(),ke=i(t(Q),6),M=t(ke);{let O=yr(()=>ue()||m());Ve(M,{onclick:()=>{confirm("현재 에피소드를 건너뛰고 다음을 생성하시겠습니까?")&&w()()},get disabled(){return e(O)},children:(H,E)=>{var D=ba();Ke(),n(H,D)},$$slots:{default:!0}})}var P=i(M,2);Ve(P,{variant:"outline",get onclick(){return W()},children:(O,H)=>{Ke();var E=we("← 설정으로 돌아가기");n(O,E)},$$slots:{default:!0}}),r(ke),r(Q),n(f,Q)};y(k,f=>{g()?f($):f(_e,!1)})}r(K),F(()=>{b(S,z()),b(p,se())}),n(G,K)},I=G=>{var K=Ta(),C=t(K),T=t(C),N=i(t(T),8);Ze(N,4,()=>Array(8),Qe,(H,E,D)=>{var ie=ya();pr(ie,`--delay: ${D*.15}s; --angle: ${D*45}deg`),n(H,ie)}),r(N),r(T);var _=i(T,2),S=i(t(_),2),j=t(S);r(S),r(_),r(C);var p=i(C,2),k=t(p),$=i(t(k),2),_e=t($);r($),r(k);var f=i(k,2),Q=t(f),ke=i(Q,2);r(f);var M=i(f,2);{var P=H=>{var E=wa(),D=t(E,!0);r(E),F(()=>b(D,ve())),n(H,E)};y(M,H=>{ve()&&H(P)})}var O=i(M,2);Ze(O,5,()=>(oe(se()),oe(U()),te(()=>Array(se()||U()))),Qe,(H,E,D)=>{var ie=Ca();let ge;var fe=t(ie);{var ee=re=>{var de=ka();n(re,de)},ce=re=>{var de=Ne(),Ee=Se(de);{var he=Re=>{var Ie=Ea();n(Re,Ie)},Ge=Re=>{var Ie=za();Ie.textContent=D+1,n(Re,Ie)};y(Ee,Re=>{D===Y()&&ue()?Re(he):Re(Ge,!1)},!0)}n(re,de)};y(fe,re=>{D<Y()?re(ee):re(ce,!1)})}r(ie),F(()=>ge=De(ie,1,"episode-dot svelte-10hxdp2",null,ge,{completed:D<Y(),active:D===Y()&&ue(),pending:D>Y()})),n(H,ie)}),r(O),Ke(2),r(p),r(K),F(()=>{b(j,`에피소드 ${z()??""} 생성 중`),b(_e,`${z()??""} / ${(se()||U())??""}`),pr(Q,`width: ${(z()-1)/(se()||U())*100}%`),pr(ke,`left: ${(z()-1)/(se()||U())*100}%`)}),n(G,K)};y(q,G=>{l()?G(v):G(I,!1)})}var J=i(q,2);{var ne=G=>{var K=Sa(),C=i(t(K),2),T=t(C,!0);r(C),r(K),F(()=>b(T,L())),n(G,K)};y(J,G=>{L()&&G(ne)})}r(Z),n(Te,Z),sr()}var Na=c('<p class="progress-message"> </p>'),Pa=c("<div><!></div>"),Aa=c('<p class="error-line"> </p>'),Ma=c('<div class="error-state"><div class="error-icon">❌</div> <h3 class="error-title">생성 실패</h3> <div class="error-detail"></div> <div class="error-actions"><!> <!></div></div>'),Da=c('<div class="content-card"><div class="card-header"><h2 class="card-title">6단계: 에피소드 생성 중</h2> <p class="card-desc">AI가 스토리와 디테일을 생성하고 있습니다...</p></div> <div class="card-body"><div class="generating-state"><div class="spinner"></div> <div class="progress-info"><div class="episode-progress"><span class="episode-label">에피소드 생성</span> <span class="episode-count"> </span></div> <!> <p class="progress-hint">동기 방식으로 생성 중입니다. 약 1-2분 소요됩니다...</p> <div class="episode-list"></div></div></div> <!></div></div>');function Fa(Te,d){ar(d,!1);let l=u(d,"generating",8,!1),g=u(d,"progressMessage",8,""),x=u(d,"currentEpisode",8,1),m=u(d,"actualTotalEpisodes",8,0),R=u(d,"numEpisodes",8,0),z=u(d,"totalEpisodesGenerated",8,0),se=u(d,"error",8,""),ue=u(d,"onBackToStep4",8);gr();var ve=Da(),Y=i(t(ve),2),U=t(Y),L=i(t(U),2),pe=t(L),me=i(t(pe),2),le=t(me);r(me),r(pe);var B=i(pe,2);{var w=v=>{var I=Na(),J=t(I,!0);r(I),F(()=>b(J,g())),n(v,I)};y(B,v=>{g()&&v(w)})}var W=i(B,4);Ze(W,5,()=>(oe(m()),oe(R()),te(()=>Array(m()||R()))),Qe,(v,I,J)=>{var ne=Pa();let G;var K=t(ne);{var C=N=>{var _=we("✓");n(N,_)},T=N=>{var _=Ne(),S=Se(_);{var j=k=>{var $=we("⏳");n(k,$)},p=k=>{var $=we();$.nodeValue=J+1,n(k,$)};y(S,k=>{J===z()&&l()?k(j):k(p,!1)},!0)}n(N,_)};y(K,N=>{J<z()?N(C):N(T,!1)})}r(ne),F(()=>G=De(ne,1,"episode-item",null,G,{completed:J<z(),active:J===z()&&l()})),n(v,ne)}),r(W),r(L),r(U);var Z=i(U,2);{var q=v=>{var I=Ma(),J=i(t(I),4);Ze(J,5,()=>(oe(se()),te(()=>se().split(`
`))),Qe,(C,T)=>{var N=Aa(),_=t(N,!0);r(N),F(()=>b(_,e(T))),n(C,N)}),r(J);var ne=i(J,2),G=t(ne);Ve(G,{get onclick(){return ue()},children:(C,T)=>{Ke();var N=we("← 설정 수정");n(C,N)},$$slots:{default:!0}});var K=i(G,2);Ve(K,{variant:"outline",onclick:()=>{alert("콘솔(F12)에서 상세 정보를 확인하세요")},children:(C,T)=>{Ke();var N=we("🔍 콘솔에서 자세히 보기");n(C,N)},$$slots:{default:!0}}),r(ne),r(I),n(v,I)};y(Z,v=>{se()&&v(q)})}r(Y),r(ve),F(()=>b(le,`${x()??""} / ${(m()||R())??""}`)),n(Te,ve),sr()}var ja=c('<p class="success-desc"> </p>'),Ra=c('<div class="success-state"><div class="success-icon">✨</div> <h3 class="success-title"> </h3> <!> <div class="story-stats"><div class="stat-item"><span class="stat-label">총 에피소드</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">총 노드</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">게이지 수</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">생성일</span> <span class="stat-value"> </span></div></div> <div class="action-buttons"><!> <!></div></div>'),La=c('<div class="content-card"><div class="card-header"><h2 class="card-title">7단계: 생성 완료</h2> <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p></div> <div class="card-body"><!></div></div>');function Ba(Te,d){ar(d,!1);let l=u(d,"metadata",8,null),g=u(d,"storyDataId",8,null),x=u(d,"startPlaying",8),m=u(d,"createNew",8);gr();var R=La(),z=i(t(R),2),se=t(z);{var ue=ve=>{var Y=Ra(),U=i(t(Y),2),L=t(U,!0);r(U);var pe=i(U,2);{var me=S=>{var j=ja(),p=t(j,!0);r(j),F(()=>b(p,(oe(l()),te(()=>l().description)))),n(S,j)};y(pe,S=>{oe(l()),te(()=>l().description)&&S(me)})}var le=i(pe,2),B=t(le),w=i(t(B),2),W=t(w);r(w),r(B);var Z=i(B,2),q=i(t(Z),2),v=t(q);r(q),r(Z);var I=i(Z,2),J=i(t(I),2),ne=t(J);r(J),r(I);var G=i(I,2),K=i(t(G),2),C=t(K,!0);r(K),r(G),r(le);var T=i(le,2),N=t(T);Ve(N,{size:"lg",get onclick(){return x()},children:(S,j)=>{Ke();var p=we("🎮 지금 플레이하기");n(S,p)},$$slots:{default:!0}});var _=i(N,2);Ve(_,{size:"lg",variant:"outline",get onclick(){return m()},children:(S,j)=>{Ke();var p=we("➕ 새로 만들기");n(S,p)},$$slots:{default:!0}}),r(T),r(Y),F(S=>{b(L,(oe(l()),te(()=>l().title))),b(W,`${oe(l()),te(()=>l().totalEpisodes)??""}화`),b(v,`${oe(l()),te(()=>l().totalNodes)??""}개`),b(ne,`${oe(l()),te(()=>l().totalGauges)??""}개`),b(C,S)},[()=>(oe(l()),te(()=>new Date(l().createdAt).toLocaleDateString("ko-KR")))]),n(ve,Y)};y(se,ve=>{l()&&g()&&ve(ue)})}r(z),r(R),n(Te,R),sr()}var Oa=c(`<style>.wizard-page {
    min-height: calc(100vh - 60px);
    background: hsl(0 0% 4%);
    padding: 2.5rem 1.5rem;
  }

  .wizard-container {
    max-width: 1200px;
    width: min(1200px, 96vw);
    margin: 0 auto;
  }

  /* 헤더 */
  .wizard-header {
    text-align: center;
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid hsl(var(--border));
  }

  .wizard-title {
    font-size: 2.5rem;
    font-weight: 800;
    margin-bottom: 0.75rem;
    color: hsl(var(--foreground));
    letter-spacing: -0.02em;
  }

  .wizard-subtitle {
    font-size: 1rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.6;
  }

  /* 진행 단계 */
  .progress-bar-container {
    background: linear-gradient(135deg, hsl(var(--card) / 0.9), hsl(var(--card) / 0.8));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-lg);
    padding: 1.75rem;
    margin-bottom: 2rem;
    box-shadow:
      0 4px 18px hsl(var(--foreground) / 0.15),
      0 0 0 1px hsl(var(--card) / 0.7);
    backdrop-filter: blur(6px);
  }

  .steps-container {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .step-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .step-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
  }

  .step-circle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: radial-gradient(circle, hsl(var(--muted) / 0.2) 0%, hsl(var(--muted) / 0.05) 60%, transparent 100%);
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 0.9375rem;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .step-circle.active {
    background: radial-gradient(circle at 50% 40%, #ff4d4f, #d9353a);
    border-color: #ff4d4f;
    color: white;
    transform: scale(1.15);
    box-shadow: 
      0 0 0 4px #ff4d4f44,
      0 0 20px #ff4d4f88,
      0 0 40px #ff4d4f66;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 
        0 0 0 4px hsl(var(--primary) / 0.2),
        0 0 20px hsl(var(--primary) / 0.6),
        0 0 40px hsl(var(--primary) / 0.4);
    }
    50% {
      box-shadow: 
        0 0 0 8px hsl(var(--primary) / 0.3),
        0 0 30px hsl(var(--primary) / 0.8),
        0 0 60px hsl(var(--primary) / 0.6);
    }
  }

  .step-circle.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .step-info {
    text-align: center;
    width: 100%;
  }

  .step-title {
    font-weight: 700;
    font-size: 0.9rem;
    color: hsl(var(--foreground));
    margin-bottom: 0.35rem;
    transition: all 0.3s ease;
  }

  .step-title.active-title {
    color: #ff4d4f;
    text-shadow: 0 0 8px #ff4d4fcc;
  }

  .step-title.completed-title {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    transition: all 0.3s ease;
    color: hsl(var(--muted-foreground));
  }

  .step-desc.active-desc {
    color: #ffd7d8;
    text-shadow: 0 0 6px #ff4d4fcc;
  }

  .step-desc.completed-desc {
    color: hsl(142 76% 45%);
  }

  .step-desc {
    font-size: 0.6875rem;
    color: hsl(var(--muted-foreground));
    line-height: 1.4;
  }

  .step-connector {
    flex: 1;
    height: 2px;
    background: hsl(var(--border));
    margin: 0 0.25rem;
    margin-top: -1.25rem;
    transition: all 0.3s ease;
  }

  .step-connector.completed {
    background: hsl(142 76% 36%);
  }

  .step-connector.active {
    background: linear-gradient(90deg, hsl(142 76% 36%), hsl(var(--primary)));
    animation: connector-flow 2s ease-in-out infinite;
  }

  @keyframes connector-flow {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* 콘텐츠 카드 */
  .step-content {
    margin-bottom: 2rem;
  }

  .content-card {
    background: hsl(var(--card));
    border: none;
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.05);
  }

  .card-header {
    padding: 1.75rem 2rem;
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
    background: hsl(var(--muted) / 0.3);
  }

  .card-title {
    font-size: 1.375rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .card-desc {
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
    line-height: 1.5;
  }

  .card-body {
    padding: 2rem;
    background: hsl(var(--card));
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  /* 섹션 블록 */
  .section-block {
    margin-bottom: 2.5rem;
    background: hsl(var(--muted) / 0.4);
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-lg);
    overflow: hidden;
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.15);
  }

  .section-block:last-child {
    margin-bottom: 0;
  }

  .section-header {
    padding: 1.25rem 1.5rem;
    background: hsl(var(--muted) / 0.6);
    border-bottom: 2px solid hsl(0 0% 50% / 0.3);
  }

  .section-title {
    font-size: 1.125rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin: 0 0 0.25rem 0;
  }

  .section-subtitle {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin: 0;
  }

  .section-content {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
  }

  /* 폼 요소 */
  .form-group {
    margin-bottom: 0;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    margin-bottom: 0;
  }

  .form-group-half {
    margin-bottom: 0;
  }

  .form-label {
    display: block;
    font-weight: 600;
    margin-bottom: 0.625rem;
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
  }

  .form-input {
    width: 100%;
    padding: 0.875rem 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.9375rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .form-textarea {
    width: 100%;
    min-height: 300px;
    padding: 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-size: 0.875rem;
    font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
    resize: vertical;
    line-height: 1.6;
    transition: all 0.2s ease;
  }

  .input-method-card .form-textarea {
    min-height: 280px;
  }

  .form-textarea:focus {
    outline: none;
    border-color: hsl(var(--primary));
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .form-textarea:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background: hsl(var(--muted) / 0.3);
  }

  .textarea-info {
    margin-top: 0.5rem;
    font-size: 0.875rem;
  }

  /* 파일 업로드 */
  .file-upload-wrapper {
    position: relative;
    width: 100%;
  }

  .file-input-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  .file-upload-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    width: 100%;
    padding: 1rem 1.5rem;
    background: hsl(var(--primary));
    color: white;
    border: 3px solid hsl(0 0% 50% / 0.5);
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .file-upload-button:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.9);
    border-color: hsl(0 0% 50% / 0.7);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--primary) / 0.3);
  }

  .file-upload-button:active:not(:disabled) {
    transform: translateY(0);
  }

  .file-upload-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .file-upload-icon {
    font-size: 1.25rem;
  }

  .file-upload-text {
    font-size: 1rem;
  }

  .file-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
    cursor: pointer;
  }

  .file-info {
    margin-top: 0.75rem;
    padding: 1rem 1.25rem;
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    align-items: center;
    gap: 0.875rem;
    transition: all 0.2s ease;
  }

  .file-info:hover {
    background: hsl(var(--muted) / 0.3);
  }

  .file-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .file-name {
    flex: 1;
    font-weight: 600;
    color: hsl(var(--foreground));
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.9375rem;
  }

  .file-size {
    font-size: 0.8125rem;
    color: hsl(var(--muted-foreground));
    flex-shrink: 0;
  }

  .file-remove {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--muted-foreground));
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
  }

  .file-remove:hover:not(:disabled) {
    background: hsl(0 84.2% 60.2% / 0.1);
    border-color: hsl(0 84.2% 60.2%);
    color: hsl(0 84.2% 60.2%);
    transform: scale(1.1);
  }

  .file-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* 입력 방법 레이아웃 */
  .input-methods {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  .input-method-card {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: hsl(var(--background));
    border: none;
    border-radius: var(--radius-md);
  }

  .method-header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .divider-vertical {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
    position: relative;
  }

  .divider-vertical::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 50%;
    width: 1px;
    background: hsl(var(--border));
    transform: translateX(-50%);
  }

  .divider-vertical span {
    position: relative;
    z-index: 1;
    padding: 0.5rem 0.75rem;
    background: hsl(var(--card));
    color: hsl(var(--muted-foreground));
    font-size: 0.8125rem;
    font-weight: 600;
    border-radius: var(--radius-full);
    border: 1px solid hsl(var(--border));
  }

  /* 구분선 (기존 - 사용 안 함) */
  .divider-or {
    position: relative;
    text-align: center;
    margin: 2rem 0;
  }

  .divider-or::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    right: 0;
    height: 1px;
    background: hsl(var(--border));
    z-index: 0;
  }

  .divider-or span {
    position: relative;
    z-index: 1;
    padding: 0 1rem;
    background: hsl(var(--card));
    color: hsl(var(--muted-foreground));
    font-size: 0.875rem;
    font-weight: 600;
  }

  /* 업로드 진행률 */
  .upload-status {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .upload-icon {
    font-size: 2rem;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }

  .upload-info {
    flex: 1;
  }

  .upload-text {
    font-weight: 600;
    color: hsl(var(--primary));
    margin-bottom: 0.5rem;
  }

  .upload-processing {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: hsl(var(--foreground));
    font-weight: 700;
  }

  .inline-spinner {
    width: 1rem;
    height: 1rem;
    border: 3px solid #ffffff44;
    border-top-color: #ffffff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    flex-shrink: 0;
  }

  .upload-progress-bar {
    width: 100%;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.25rem;
  }

  .upload-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.3s ease;
  }

  .upload-percentage {
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--primary));
    text-align: right;
  }

  .text-success {
    color: hsl(142 76% 36%);
  }

  .text-muted {
    color: hsl(var(--muted-foreground));
  }

  .file-input {
    width: 100%;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--foreground));
  }

  .success-banner {
    padding: 1rem 1.25rem;
    background: hsl(142 76% 36% / 0.1);
    border: 1px solid hsl(142 76% 36% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(142 76% 36%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .error-banner {
    padding: 1rem 1.25rem;
    background: hsl(0 84.2% 60.2% / 0.1);
    border: 1px solid hsl(0 84.2% 60.2% / 0.3);
    border-radius: var(--radius-md);
    color: hsl(0 84.2% 60.2%);
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .info-banner {
    padding: 1rem 1.25rem;
    background: hsl(var(--primary) / 0.1);
    border: 1px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
    color: hsl(var(--primary));
    font-weight: 600;
    text-align: center;
    font-size: 0.9375rem;
  }

  /* 슬라이더 */
  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .slider {
    flex: 1;
    height: 0.5rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    outline: none;
    appearance: none;
  }

  .slider::-webkit-slider-thumb {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    background: hsl(var(--primary));
    border-radius: 50%;
    cursor: pointer;
  }

  .slider-value {
    min-width: 5rem;
    font-weight: 600;
    color: hsl(var(--primary));
  }

  .field-hint {
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .required {
    color: hsl(0 84.2% 60.2%);
    font-weight: 700;
  }

  .gauge-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .gauge-option {
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;
    padding: 1.25rem;
    background: hsl(var(--card));
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-md);
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
  }

  .gauge-option:hover {
    border-color: hsl(var(--primary) / 0.5);
    background: hsl(var(--muted) / 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.05);
  }

  .gauge-option.selected {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary) / 0.1);
    box-shadow: 0 0 0 3px hsl(var(--primary) / 0.1);
  }

  .gauge-check {
    width: 1.5rem;
    height: 1.5rem;
    border: 2px solid hsl(var(--border));
    border-radius: var(--radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    color: hsl(var(--primary));
    flex-shrink: 0;
  }

  .gauge-option.selected .gauge-check {
    border-color: hsl(var(--primary));
    background: hsl(var(--primary));
    color: white;
  }

  .gauge-info {
    flex: 1;
  }

  .gauge-name {
    font-weight: 600;
    color: hsl(var(--foreground));
    margin-bottom: 0.25rem;
  }

  .gauge-desc {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .selection-count {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
  }

  .info-card {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.2);
    border: 2px solid hsl(var(--primary) / 0.3);
    border-radius: var(--radius-md);
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .info-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .info-list li {
    color: hsl(var(--muted-foreground));
  }

  .info-list strong {
    color: hsl(var(--foreground));
  }

  /* 생성 중 상태 */
  .generating-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 3rem 0;
  }

  .spinner {
    width: 4rem;
    height: 4rem;
    border: 4px solid hsl(var(--muted));
    border-top-color: hsl(var(--primary));
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .progress-info {
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .progress-bar {
    width: 100%;
    height: 0.75rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-full);
    overflow: hidden;
    margin-bottom: 0.75rem;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)));
    transition: width 0.5s;
  }

  .progress-text {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .generating-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    width: 100%;
    max-width: 400px;
  }

  .gen-step {
    padding: 0.75rem 1rem;
    background: hsl(var(--muted));
    border-radius: var(--radius-md);
    color: hsl(var(--muted-foreground));
    transition: all 0.3s;
  }

  .gen-step.active {
    background: hsl(var(--primary) / 0.1);
    color: hsl(var(--primary));
    font-weight: 600;
  }

  /* 에러 상태 */
  .error-state {
    text-align: center;
    padding: 3rem 0;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .error-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(0 84.2% 60.2%);
    margin-bottom: 0.5rem;
  }

  .error-message {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .error-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 성공 상태 */
  .success-state {
    text-align: center;
    padding: 2rem 0;
  }

  .success-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .success-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: hsl(var(--foreground));
  }

  .success-desc {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .story-stats {
    display: flex;
    justify-content: center;
    gap: 3rem;
    margin-bottom: 2rem;
    padding: 2rem 0;
    border-top: 1px solid hsl(var(--border));
    border-bottom: 1px solid hsl(var(--border));
  }

  .stat-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .stat-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
  }

  .action-buttons {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  /* 네비게이션 */
  .navigation {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.5rem 0;
    border-top: 1px solid hsl(var(--border));
    margin-top: 2rem;
  }

  .step-indicator {
    font-weight: 600;
    color: hsl(var(--muted-foreground));
    font-size: 0.9375rem;
  }

  /* 등장인물 */
  .extracting-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem;
  }

  .extracting-text {
    font-size: 1.125rem;
    color: hsl(var(--muted-foreground));
  }

  .characters-list {
    padding: 1rem;
  }

  .list-title {
    font-size: 1.125rem;
    font-weight: 700;
    margin-bottom: 1.5rem;
    color: hsl(var(--foreground));
  }

  .character-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .character-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  .character-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: hsl(var(--primary));
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 700;
  }

  .character-name {
    font-weight: 700;
    color: hsl(var(--foreground));
    text-align: left;
    font-size: 1rem;
  }

  /* 설정 레이아웃 */
  .config-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 2rem;
    align-items: start;
  }

  .config-main {
    display: flex;
    flex-direction: column;
    gap: 1.75rem;
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .config-sidebar {
    position: sticky;
    top: 2rem;
  }

  /* 엔딩 설정 */
  .ending-config {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    padding: 1rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .ending-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .ending-item label {
    font-weight: 600;
    color: hsl(var(--foreground));
    font-size: 0.875rem;
  }

  .ending-input {
    padding: 0.5rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    font-size: 1rem;
    text-align: center;
    font-weight: 600;
  }

  .ending-input:focus {
    outline: none;
    border-color: hsl(var(--primary));
  }

  /* 분석 결과 */
  .analysis-results {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .analysis-layout {
    display: flex;
    flex-direction: column;
    gap: 2rem;
  }

  .summary-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    max-height: 360px;
    overflow: auto;
  }

  .characters-section {
    padding: 1.5rem;
    background: hsl(var(--muted) / 0.15);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
  }

  .section-subtitle-row {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .section-subtitle {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: hsl(var(--foreground));
  }

  .section-hint {
    font-size: 0.85rem;
    color: hsl(var(--muted-foreground));
  }

  .count-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-left: 0.5rem;
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
    background: hsl(var(--primary) / 0.15);
    color: hsl(var(--primary));
    font-size: 0.85rem;
    font-weight: 700;
  }

  .summary-box {
    padding: 1.25rem;
    background: hsl(var(--background));
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    line-height: 1.8;
    color: hsl(var(--foreground));
    margin-top: 1rem;
  }

  .character-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 1.25rem;
    margin-top: 1rem;
  }

  .character-card-wrapper {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .character-card {
    display: flex;
    gap: 1rem;
    padding: 1rem 1rem 0.75rem 1rem;
    background: hsl(var(--background));
    border: 1.5px solid hsl(var(--border));
    border-radius: var(--radius-md);
    transition: all 0.2s ease;
    cursor: pointer;
    text-align: left;
    box-shadow: 0 2px 8px hsl(var(--foreground) / 0.08);
    width: 100%;
  }

  .character-card:hover {
    border-color: hsl(var(--primary) / 0.3);
    box-shadow: 0 4px 12px hsl(var(--foreground) / 0.08);
    background: hsl(var(--muted) / 0.1);
  }

  .character-card.expanded {
    border-color: hsl(var(--primary));
    box-shadow: 0 6px 16px hsl(var(--primary) / 0.15);
    background: hsl(var(--muted) / 0.15);
  }

  .character-card.selected {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.1);
  }

  .character-card.selected:hover {
    border-color: hsl(142 76% 36%);
    background: hsl(142 76% 36% / 0.15);
  }

  .character-select-btn {
    padding: 0.625rem 1rem;
    background: hsl(var(--muted));
    border: 1.5px solid hsl(var(--border));
    border-radius: var(--radius-md);
    color: hsl(var(--foreground));
    font-weight: 600;
    font-size: 0.875rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: center;
  }

  .character-select-btn:hover:not(:disabled) {
    background: hsl(var(--primary) / 0.1);
    border-color: hsl(var(--primary));
    color: hsl(var(--primary));
  }

  .character-select-btn.selected {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .character-select-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .character-details {
    flex: 1;
  }

  .character-aliases {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.25rem;
  }

  .character-description {
    margin-top: 0.35rem;
    line-height: 1.55;
    color: hsl(var(--foreground));
    max-height: 4.6rem;
    overflow: hidden;
    position: relative;
  }

  .character-description:not(.expanded)::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 55%, hsl(var(--background)) 100%);
    pointer-events: none;
  }

  .character-description.expanded {
    max-height: none;
  }

  .character-toggle {
    margin-top: 0.6rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .extracting-hint {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 3rem;
  }

  .gauge-range {
    font-size: 0.75rem;
    color: hsl(var(--primary));
    margin-top: 0.25rem;
    font-weight: 600;
  }

  .selection-info {
    padding: 1rem 1.5rem;
    background: hsl(var(--muted) / 0.1);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    margin-top: 1rem;
  }

  .selection-count {
    margin-top: 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: hsl(var(--muted-foreground));
  }

  .selection-count.complete {
    color: hsl(var(--primary));
    font-weight: 700;
  }

  /* 트리 편집 레이아웃 */
  .tree-edit-card {
    min-height: 600px;
    overflow: visible;
  }

  .tree-edit-layout {
    display: grid;
    grid-template-columns: 1fr 350px;
    gap: 1.5rem;
    min-height: 500px;
    overflow: visible;
    padding-bottom: 0.5rem;
  }

  .tree-panel {
    background: hsl(var(--muted) / 0.2);
    border: 1px solid hsl(var(--border));
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    overflow: visible;
    min-width: 360px;
  }

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-bottom: 1px solid hsl(var(--border));
  }

  .panel-title {
    font-weight: 600;
    color: hsl(var(--foreground));
  }

  .episode-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.75rem;
    background: hsl(var(--primary));
    color: white;
    border-radius: var(--radius-full);
    font-weight: 600;
  }

  .tree-scroll-container {
    flex: 1;
    overflow-x: auto !important;
    overflow-y: auto;
    padding: 1rem;
    max-height: 70vh;
    min-width: 0;
    width: 100%;
    position: relative;
  }
  
  .tree-scroll-container::-webkit-scrollbar {
    height: 12px;
    width: 12px;
  }
  
  .tree-scroll-container::-webkit-scrollbar-track {
    background: hsl(var(--muted) / 0.3);
    border-radius: 6px;
  }
  
  .tree-scroll-container::-webkit-scrollbar-thumb {
    background: hsl(var(--primary) / 0.5);
    border-radius: 6px;
    border: 2px solid hsl(var(--muted) / 0.3);
  }
  
  .tree-scroll-container::-webkit-scrollbar-thumb:hover {
    background: hsl(var(--primary));
  }

  .editor-panel-container {
    min-height: 400px;
    min-width: 320px;
  }

  .tree-edit-footer {
    margin-top: 1.5rem;
    padding-top: 1.5rem;
    border-top: 1px solid hsl(var(--border));
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
  }

  .edit-instructions {
    flex: 1;
  }

  .edit-instructions p {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-bottom: 0.25rem;
  }

  .edit-instructions strong {
    color: hsl(var(--foreground));
  }

  .edit-actions {
    flex-shrink: 0;
  }

  @media (max-width: 900px) {
    .tree-edit-layout {
      grid-template-columns: 1fr;
    }

    .editor-panel-container {
      min-height: 300px;
    }
  }

  .progress-message {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
    margin-top: 0.5rem;
  }

  .progress-hint {
    font-size: 0.875rem;
    color: hsl(var(--primary));
    margin-top: 1rem;
    font-weight: 500;
  }

  /* 에피소드 진행 표시 */
  .episode-progress {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
  }

  .episode-label {
    font-size: 0.875rem;
    color: hsl(var(--muted-foreground));
  }

  .episode-count {
    font-size: 1.25rem;
    font-weight: 700;
    color: hsl(var(--primary));
  }

  .episode-list {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 1.5rem;
    flex-wrap: wrap;
  }

  .episode-item {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    border: 2px solid hsl(var(--border));
    background: hsl(var(--muted));
    color: hsl(var(--muted-foreground));
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s;
  }

  .episode-item.completed {
    background: hsl(142 76% 36%);
    border-color: hsl(142 76% 36%);
    color: white;
  }

  .episode-item.active {
    background: hsl(var(--primary));
    border-color: hsl(var(--primary));
    color: white;
    animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }

  .error-detail {
    margin: 1.5rem 0;
    padding: 1rem;
    background: hsl(var(--muted) / 0.3);
    border-radius: var(--radius-md);
    text-align: left;
    max-height: 300px;
    overflow-y: auto;
  }

  .error-line {
    margin: 0.5rem 0;
    color: hsl(var(--foreground));
    font-family: monospace;
    font-size: 0.875rem;
    line-height: 1.6;
  }

  /* 빈 트리 상태 */
  .empty-tree-state {
    text-align: center;
    padding: 3rem;
  }

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  .empty-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: hsl(var(--foreground));
    margin-bottom: 0.5rem;
  }

  .empty-message {
    color: hsl(var(--muted-foreground));
    margin-bottom: 2rem;
  }

  .empty-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .input-methods {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .divider-vertical {
      display: none;
    }

    .analysis-layout {
      flex-direction: column;
    }

    .character-list {
      grid-template-columns: 1fr;
    }

    .config-layout {
      grid-template-columns: 1fr;
    }

    .config-sidebar {
      position: static;
    }
  }

  @media (max-width: 768px) {
    .wizard-page {
      padding: 1.5rem 1rem;
    }

    .wizard-title {
      font-size: 2rem;
    }

    .wizard-header {
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
    }

    .progress-bar-container {
      padding: 1.25rem;
    }

    .steps-container {
      flex-wrap: wrap;
      gap: 1rem;
    }

    .step-wrapper {
      flex: 0 0 calc(50% - 0.5rem);
      min-width: 0;
    }

    .step-connector {
      display: none;
    }

    .card-header {
      padding: 1.5rem;
    }

    .card-body {
      padding: 1.5rem;
    }

    .form-row {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .story-stats {
      flex-direction: column;
      gap: 1rem;
    }

    .navigation {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .step-indicator {
      text-align: center;
    }

    .gauge-grid {
      grid-template-columns: 1fr;
    }

    .ending-config {
      grid-template-columns: repeat(2, 1fr);
    }
  }</style>`),Ya=c("<div></div>"),Ua=c('<div class="step-wrapper"><div class="step-item"><div><!></div> <div class="step-info"><div> </div> <div> </div></div></div> <!></div>'),Ka=c('<div class="character-aliases"> </div>'),Xa=c('<div class="character-card-wrapper"><button type="button"><div class="character-avatar"> </div> <div class="character-details"><div class="character-name"> </div> <!> <div> </div> <div class="character-toggle"> </div></div></button> <button type="button"><!></button></div>'),qa=c('<div class="wizard-page"><div class="wizard-container"><div class="wizard-header"><h1 class="wizard-title">인터랙티브 스토리 생성</h1> <p class="wizard-subtitle">소설을 입력하면 AI가 자동으로 인터랙티브 게임으로 변환합니다</p></div> <div class="progress-bar-container"><div class="steps-container"></div></div> <div class="step-content"><!></div> <div class="navigation"><!> <div class="step-indicator"> </div> <!></div></div></div>');function is(Te,d){ar(d,!0);let l=A(1),g=A(""),x=A(""),m=A(""),R=A(""),z=A(null),se=A(0),ue=A(!1),ve=A(""),Y=A(ur([])),U=A(ur(new Set)),L=A(ur([])),pe=A(!1),me=A(!1),le=A(ur([])),B=A(ur([])),w=A(!1),W=A(!1),Z=A(""),q=A(ur({happy:2,tragic:1,neutral:1,open:1,bad:0})),v=A(5),I=A(3),J=A(3),ne=A(!1),G=A(!1),K=A(""),C=A(1),T=A(0),N=A(0),_=A(null),S=A(""),j=A(null),p=A(!1),k=A(!1),$=A(null),_e=A(null),f=A("");const Q="wizard-state";function ke(){try{const o={currentStep:e(l),storyId:e(g),title:e(x),description:e(Z),genre:e(R),summary:e(ve),characters:e(Y).map(s=>({...s})),selectedCharacterNames:[...e(L)],selectedGaugeIds:[...e(B)],endingConfig:{...e(q)},numEpisodes:e(v),maxDepth:e(I),numEpisodeEndings:e(J),currentEpisode:e(C),totalEpisodesGenerated:e(T),actualTotalEpisodes:e(N),currentEpisodeTitle:e(S),storyDataId:e($),metadata:e(_e),treeEditMode:e(k),currentEpisodeTree:e(_)?JSON.parse(JSON.stringify(e(_))):null,proposedGauges:e(le).map(s=>({...s}))};sessionStorage.setItem(Q,JSON.stringify(o))}catch(o){console.warn("상태 저장 실패:",o)}}function M(){try{const o=sessionStorage.getItem(Q);if(!o)return;const s=JSON.parse(o);s.currentStep&&a(l,s.currentStep,!0),s.storyId&&a(g,s.storyId,!0),s.title&&a(x,s.title,!0),s.description&&a(Z,s.description,!0),s.genre&&a(R,s.genre,!0),s.summary&&a(ve,s.summary,!0),s.characters&&a(Y,s.characters,!0),s.selectedCharacterNames&&a(L,s.selectedCharacterNames,!0),s.selectedGaugeIds&&a(B,s.selectedGaugeIds,!0),s.endingConfig&&a(q,s.endingConfig,!0),s.numEpisodes&&a(v,s.numEpisodes,!0),s.maxDepth&&a(I,s.maxDepth,!0),s.numEpisodeEndings&&a(J,s.numEpisodeEndings,!0),s.currentEpisode&&a(C,s.currentEpisode,!0),s.totalEpisodesGenerated&&a(T,s.totalEpisodesGenerated,!0),s.actualTotalEpisodes&&a(N,s.actualTotalEpisodes,!0),s.currentEpisodeTitle&&a(S,s.currentEpisodeTitle,!0),s.storyDataId&&a($,s.storyDataId,!0),s.metadata&&a(_e,s.metadata,!0),s.treeEditMode!==void 0&&a(k,s.treeEditMode,!0),s.currentEpisodeTree&&a(_,s.currentEpisodeTree,!0),s.proposedGauges&&a(le,s.proposedGauges,!0)}catch(o){console.warn("상태 복원 실패:",o)}}Hr(()=>{e(l),e(g),e(x),e(Z),e(ve),e(Y).length,e(B).length,e(v),e(I),e(C),e($),e(k),e(_),e(le).length;const o=setTimeout(()=>{ke()},100);return()=>clearTimeout(o)}),lt(()=>{if(!Oe.auth.isAuthenticated()){alert("로그인이 필요합니다."),Vr("/login");return}localStorage.removeItem(Q),M();const o=()=>{ke()};return window.addEventListener("beforeunload",o),()=>{window.removeEventListener("beforeunload",o),ke()}});const P=[{number:1,title:"소설 텍스트",desc:"전문 입력"},{number:2,title:"등장인물",desc:"자동 추출"},{number:3,title:"게이지",desc:"5개 → 2개 선택"},{number:4,title:"엔딩",desc:"예상 엔딩 설계"},{number:5,title:"트리 편집",desc:"노드 수정/검토"},{number:6,title:"에피소드 생성",desc:"순차 생성"},{number:7,title:"완료",desc:"체크/등록"}];function O(){switch(e(l)){case 1:return e(z)!==null&&e(x).length>0;case 2:return e(Y).length>0&&e(ve).length>0&&e(L).length>=1&&e(L).length<=2;case 3:return e(B).length===2;case 4:return!0;case 5:case 6:return!1;case 7:return e($)!==null;default:return!1}}function H(o){a(x,o,!0)}function E(o){a(Z,o,!0)}function D(o){a(R,o,!0)}function ie(){a(z,null)}function ge(o){e(B).includes(o)?a(B,e(B).filter(s=>s!==o),!0):e(B).length<2?a(B,[...e(B),o],!0):a(B,[e(B)[1],o],!0)}function fe(o){const s=new Set(e(U));s.has(o)?s.delete(o):s.add(o),a(U,s,!0)}function ee(o){e(L).includes(o)?a(L,e(L).filter(s=>s!==o),!0):e(L).length<2?a(L,[...e(L),o],!0):a(L,[e(L)[1],o],!0)}function ce(o,s=140){return o?o.length>s?o.slice(0,s)+"…":o:""}function re(o,s){a(q,{...e(q),[o]:s},!0)}function de(o){a(v,o,!0)}function Ee(o){a(I,o,!0)}async function he(){var o;if(console.log("uploadNovel 호출됨"),console.log("canGoNext:",O()),console.log("title:",e(x)),console.log("uploadedFile:",e(z)),console.log("novelText length:",e(m).length),!O()){alert("제목과 소설 파일을 입력해주세요");return}a(ue,!0),a(se,0),a(f,"");try{let s;if(e(z)){console.log("S3 업로드 방식 사용...");const h=await Oe.upload.uploadStoryFile(e(z),V=>{a(se,V,!0),console.log(`업로드 진행률: ${V.toFixed(1)}%`)});console.log("S3 업로드 완료, fileKey:",h),s=await Oe.story.uploadNovelFromS3({title:e(x),description:e(Z),genre:e(R),fileKey:h})}else throw new Error("파일을 선택해주세요");if(console.log("업로드 성공:",s),s.status==="FAILED")throw new Error("파일 분석에 실패했습니다. 파일 형식이나 내용을 확인해주세요.");a(g,s.storyId,!0),a(l,2),Ge()}catch(s){console.error("업로드 실패:",s),s instanceof We?(a(f,((o=s.data)==null?void 0:o.message)||"소설 업로드에 실패했습니다.",!0),alert("업로드 실패: "+e(f))):(a(f,"네트워크 오류가 발생했습니다."),alert("네트워크 오류: "+s.message))}finally{a(ue,!1),a(se,0)}}async function Ge(){a(pe,!0);try{const o=async()=>{var h;const s=await Oe.story.getProgress(e(g));if(s.status==="CHARACTERS_READY"||s.status==="GAUGES_READY"){const[V,ae]=await Promise.all([Oe.story.getSummary(e(g)),Oe.story.getCharacters(e(g))]);a(ve,V.summary,!0),a(Y,ae.characters,!0),a(pe,!1)}else if(s.status==="FAILED"){const V=((h=s.progress)==null?void 0:h.error)||"분석에 실패했습니다";throw console.error("분석 실패 상세:",s),new Error(`파일 분석 실패: ${V}

파일 형식이나 내용을 확인해주세요.`)}else setTimeout(()=>o(),3e3)};await o()}catch(o){console.error("분석 데이터 로드 실패:",o),a(f,o.message||"분석에 실패했습니다.",!0),a(pe,!1)}}async function Re(){console.log("nextStep 호출됨, currentStep:",e(l));try{e(l)===1?(console.log("1단계: uploadNovel 호출"),await he()):e(l)===2?(console.log("2단계: 캐릭터 선택 제출"),await Ie()):e(l)===3?(console.log("3단계: 게이지 선택 제출"),await nr()):e(l)===4?(console.log("4단계: 설정 제출 & 생성 시작"),await dr()):O()&&(console.log("일반 다음 단계"),Fr(l))}catch(o){console.error("nextStep 에러:",o),alert("에러 발생: "+o)}}async function Ie(){var o;if(e(L).length<1||e(L).length>2){alert("NPC로 만들 캐릭터를 1~2명 선택해주세요.");return}a(me,!0),a(f,"");try{await Oe.story.selectCharacters(e(g),{characterNames:e(L)}),a(l,3),await ir()}catch(s){console.error("캐릭터 선택 실패:",s),s instanceof We?a(f,((o=s.data)==null?void 0:o.message)||"캐릭터 선택에 실패했습니다.",!0):a(f,"네트워크 오류가 발생했습니다."),alert("캐릭터 선택 실패: "+e(f))}finally{a(me,!1)}}async function ir(){var o;a(w,!0),a(f,"");try{const s=await Oe.story.getGauges(e(g));a(le,s.gauges,!0)}catch(s){console.error("게이지 로드 실패:",s),s instanceof We?a(f,((o=s.data)==null?void 0:o.message)||"게이지 로드에 실패했습니다.",!0):a(f,"네트워크 오류가 발생했습니다.")}finally{a(w,!1)}}async function nr(){var o;if(e(B).length!==2){alert("게이지를 정확히 2개 선택해주세요.");return}a(W,!0),a(f,"");try{await Oe.story.selectGauges(e(g),{selectedGaugeIds:e(B)}),a(l,4)}catch(s){console.error("게이지 선택 실패:",s),s instanceof We?a(f,((o=s.data)==null?void 0:o.message)||"게이지 선택에 실패했습니다.",!0):a(f,"네트워크 오류가 발생했습니다.")}finally{a(W,!1)}}async function dr(){var o,s;a(ne,!0),a(G,!0),a(f,""),a(C,1),a(T,0),a(N,e(v),!0),a(l,5),a(K,"에피소드 1 생성 중... (약 1-2분 소요)");try{await Oe.story.configureStory(e(g),{description:e(Z),numEpisodes:e(v),maxDepth:e(I),endingConfig:e(q),numEpisodeEndings:e(J)}),console.log("EP1 생성 시작 (동기 방식)..."),console.log("StoryId:",e(g));const h=await Oe.story.startEpisodeGeneration(e(g));console.log("EP1 생성 완료:",h),console.log("EpisodeData 구조:",{hasNodes:!!h.nodes,nodesLength:((o=h.nodes)==null?void 0:o.length)||0,title:h.title,order:h.order,keys:Object.keys(h)}),h.nodes&&h.nodes.length>0&&console.log("첫 번째 노드:",h.nodes[0]),jr(h)}catch(h){console.error("생성 실패:",h),h instanceof We?(a(f,((s=h.data)==null?void 0:s.message)||h.message||"스토리 생성에 실패했습니다.",!0),console.error("API 에러 상세:",{status:h.status,data:h.data,message:h.message})):(a(f,h.message||"네트워크 오류가 발생했습니다.",!0),console.error("일반 에러:",h)),a(G,!1),a(l,4)}finally{a(ne,!1)}}async function Le(){let s=0;const h=async()=>{var V,ae;try{s++,console.log(`결과 조회 시도 ${s}/5... storyId:`,e(g));const X=await Oe.story.getResult(e(g));console.log("✅ 결과 조회 성공:",X),a($,X.storyDataId,!0),a(_e,X.metadata,!0),a(l,7),a(G,!1),alert("🎉 스토리 생성이 완료되었습니다!")}catch(X){console.error(`결과 조회 실패 (${s}/5):`,X),s<5?(console.log("⏳ 5초 후 다시 시도..."),await new Promise(ze=>setTimeout(ze,5e3)),await h()):(console.error("=== 최종 에러 정보 ==="),console.error("storyId:",e(g)),console.error("에러 객체:",X),X instanceof We&&(console.error("API Error Status:",X.status),console.error("API Error Data:",X.data)),X instanceof We&&X.status===404?a(f,`❌ 스토리를 찾을 수 없습니다 (404)

storyId: ${e(g)}
백엔드에서 생성은 완료되었지만 결과를 저장하지 못했을 수 있습니다.

백엔드 콘솔 로그를 확인해주세요.`):X instanceof We&&X.status===500?a(f,`❌ 백엔드 서버 내부 오류 (500)

storyId: ${e(g)}
에러 메시지: ${((V=X.data)==null?void 0:V.message)||X.message}

백엔드 콘솔에서 다음을 확인하세요:
1. Exception 스택 트레이스
2. /api/stories/\${storyId}/result 관련 로그
3. 데이터베이스 연결 상태
4. AI 서버 응답 데이터`):X instanceof We?a(f,`❌ API 에러 (${X.status})

storyId: ${e(g)}
메시지: ${((ae=X.data)==null?void 0:ae.message)||X.message}`):a(f,`❌ 네트워크 오류

storyId: ${e(g)}
메시지: ${X.message}`),a(G,!1))}};await h()}function xe(){e(l)>1&&Fr(l,-1)}async function Pe(o){var ze,Ce;const s=o.target,h=(ze=s.files)==null?void 0:ze[0];if(!h)return;const V=[".txt",".pdf",".doc",".docx"],ae="."+((Ce=h.name.split(".").pop())==null?void 0:Ce.toLowerCase());if(!V.includes(ae)){alert("지원하는 파일 형식: .txt, .pdf, .doc, .docx"),s.value="";return}const X=10*1024*1024;if(h.size>X){alert("파일 크기는 10MB 이하여야 합니다."),s.value="";return}try{a(z,h,!0),a(m,""),e(x)||a(x,h.name.replace(/\.(txt|pdf|doc|docx)$/i,""),!0),console.log("파일 선택됨:",h.name,`(${(h.size/1024).toFixed(1)} KB)`)}catch(ye){console.error("파일 처리 실패:",ye),a(f,"파일을 처리할 수 없습니다."),a(z,null)}}function $e(){e($)&&Vr(`/play/${e($)}`)}function br(o){var s;a(j,o.detail.node,!0),console.log("노드 선택됨:",(s=e(j))==null?void 0:s.id)}async function Cr(o){var X,ze,Ce;if(!e(j)||!e(_))return;const{nodeId:s,newText:h,newChoices:V,newImagePrompt:ae}=o.detail;a(p,!0),a(f,"");try{console.log("서브트리 재생성 요청:",{nodeId:s,newText:h,newImagePrompt:ae}),ae!==void 0&&mr(s,ae);const ye=await Oe.story.regenerateSubtree(e(g),e(C),s,{nodeText:h,choices:V.map(He=>He.text),situation:((X=e(j).details)==null?void 0:X.situation)||"",npcEmotions:((ze=e(j).details)==null?void 0:ze.npc_emotions)||{},tags:V.flatMap(He=>He.tags)});console.log("서브트리 재생성 완료:",ye.totalNodesRegenerated,"개 노드"),Tr(s,ye.regeneratedNodes),ae!==void 0&&mr(s,ae),a(j,null),alert(`✅ 서브트리 재생성 완료! ${ye.totalNodesRegenerated}개 노드가 업데이트되었습니다.`)}catch(ye){console.error("서브트리 재생성 실패:",ye),ye instanceof We?a(f,((Ce=ye.data)==null?void 0:Ce.message)||"서브트리 재생성에 실패했습니다.",!0):a(f,ye.message||"서브트리 재생성에 실패했습니다.",!0),alert("❌ 서브트리 재생성 실패: "+e(f))}finally{a(p,!1)}}function mr(o,s){if(!e(_))return;function h(V){if(V.id===o)return V.imagePrompt=s,!0;if(V.children){for(const ae of V.children)if(h(ae))return!0}return!1}h(e(_)),e(j)&&e(j).id===o&&(e(j).imagePrompt=s)}function Tr(o,s){if(!e(_)||s.length===0)return;function h(V){return V.id===o?xr(s[0]):(V.children&&V.children.length>0&&(V.children=V.children.map(ae=>h(ae))),V)}a(_,h({...e(_)}),!0)}function xr(o){if(!o)return console.warn("convertToTreeNode: apiNode is null or undefined"),{id:"unknown",text:"Unknown node",depth:0,choices:[],children:[]};const s={id:o.id||o.nodeId||String(Math.random()),text:o.text||"No text",depth:o.depth??0,choices:[],children:[],details:{},imagePrompt:o.imagePrompt||o.image_prompt||void 0,imageUrl:o.imageUrl||o.image_url||void 0};return o.choices&&Array.isArray(o.choices)&&(s.choices=o.choices.map(h=>({text:h.text||"",tags:h.tags||[]}))),o.details?s.details={situation:o.details.situation,npc_emotions:o.details.npc_emotions||o.details.npcEmotions||{},relations_update:o.details.relations_update||o.details.relationsUpdate||{}}:s.details={situation:o.situation,npc_emotions:o.npc_emotions||o.npcEmotions||{},relations_update:o.relations_update||o.relationsUpdate||{}},o.children&&Array.isArray(o.children)&&o.children.length>0&&(s.children=o.children.map(h=>xr(h))),s}async function Wr(){var o;if(a(T,e(C),!0),e(T)>=e(N)){console.log("🎉 모든 에피소드 생성 완료!"),await Le();return}a(G,!0),a(k,!1),a(f,""),Fr(C),a(K,`에피소드 ${e(C)}/${e(N)} 생성 중... (약 1-2분 소요)`);try{console.log(`EP${e(C)} 생성 시작 (동기 방식)...`);const s=await Oe.story.generateNextEpisode(e(g));console.log(`EP${e(C)} 생성 완료:`,s),jr(s)}catch(s){console.error("다음 에피소드 생성 실패:",s),s instanceof We?a(f,((o=s.data)==null?void 0:o.message)||"다음 에피소드 생성에 실패했습니다.",!0):a(f,s.message||"네트워크 오류가 발생했습니다.",!0),a(G,!1)}}function jr(o){if(console.log("트리 편집 모드 진입:",o),o.nodes&&o.nodes.length>0){const s=o.nodes[0];if(a(_,xr(s),!0),o.nodes.length>1){let V=function(ae){const X=xr(ae);if(ae.children&&Array.isArray(ae.children))X.children=ae.children.map(ze=>V(ze));else{const ze=o.nodes.filter(Ce=>(Ce.parent_id||Ce.parentId)===(ae.id||ae.nodeId));ze.length>0&&(X.children=ze.map(Ce=>V(Ce)))}return X};const h=new Map;o.nodes.forEach(ae=>{h.set(ae.id||ae.nodeId,ae)}),a(_,V(s),!0)}}else o.startNode?a(_,xr(o.startNode),!0):(console.warn("에피소드 데이터에 노드가 없습니다:",o),a(_,null));a(S,o.title||`에피소드 ${e(C)}`,!0),a(k,!0),a(l,5),a(G,!1),a(j,null),console.log("트리 편집 모드 설정 완료:",{title:e(S),hasTree:e(_)!==null,treeNodeCount:e(_)?Rr(e(_)):0})}function Rr(o){let s=1;return o.children&&o.children.forEach(h=>{s+=Rr(h)}),s}function Zr(){a(l,1),a(g,""),a(x,""),a(m,""),a(z,null),a(se,0),a(Z,""),a(R,""),a(ve,""),a(Y,[],!0),a(le,[],!0),a(B,[],!0),a(q,{happy:2,tragic:1,neutral:1,open:1,bad:0},!0),a(v,5),a(I,3),a(J,3),a($,null),a(_e,null),a(f,""),a(K,""),a(C,1),a(T,0),a(N,0),a(_,null),a(S,""),a(j,null),a(p,!1),a(k,!1)}var Sr=qa();bt("jma69v",o=>{var s=Oa();n(o,s)});var Lr=t(Sr),Gr=i(t(Lr),2),Br=t(Gr);Ze(Br,21,()=>P,Qe,(o,s,h)=>{var V=Ua(),ae=t(V),X=t(ae);let ze;var Ce=t(X);{var ye=Be=>{var Ae=we("✓");n(Be,Ae)},He=Be=>{var Ae=we();F(()=>b(Ae,e(s).number)),n(Be,Ae)};y(Ce,Be=>{e(l)>e(s).number?Be(ye):Be(He,!1)})}r(X);var Ye=i(X,2),be=t(Ye);let Fe;var Me=t(be,!0);r(be);var er=i(be,2);let je;var lr=t(er,!0);r(er),r(Ye),r(ae);var Ue=i(ae,2);{var Xe=Be=>{var Ae=Ya();let cr;F(()=>cr=De(Ae,1,"step-connector",null,cr,{completed:e(l)>e(s).number,active:e(l)===e(s).number||e(l)===e(s).number+1})),n(Be,Ae)};y(Ue,Be=>{h<P.length-1&&Be(Xe)})}r(V),F(()=>{ze=De(X,1,"step-circle",null,ze,{active:e(l)===e(s).number,completed:e(l)>e(s).number}),Fe=De(be,1,"step-title",null,Fe,{"active-title":e(l)===e(s).number,"completed-title":e(l)>e(s).number}),b(Me,e(s).title),je=De(er,1,"step-desc",null,je,{"active-desc":e(l)===e(s).number,"completed-desc":e(l)>e(s).number}),b(lr,e(s).desc)}),n(o,V)}),r(Br),r(Gr);var Ir=i(Gr,2),Qr=t(Ir);{var $r=o=>{{let s=zr(O);Gt(o,{get title(){return e(x)},get description(){return e(Z)},get genre(){return e(R)},get uploadedFile(){return e(z)},get uploading(){return e(ue)},get uploadProgress(){return e(se)},get canGoNext(){return e(s)},get error(){return e(f)},onTitleChange:H,onDescriptionChange:E,onGenreChange:D,onFileChange:Pe,onRemoveFile:ie})}},et=o=>{var s=Ne(),h=Se(s);{var V=X=>{Dt(X,{get loadingAnalysis(){return e(pe)},get summary(){return e(ve)},get characters(){return e(Y)},get selectedCharacterNames(){return e(L)},get selectingCharacters(){return e(me)},children:(ze,Ce)=>{var ye=Ne(),He=Se(ye);Ze(He,17,()=>e(Y),Qe,(Ye,be)=>{var Fe=Xa(),Me=t(Fe);let er;Me.__click=()=>fe(e(be).name);var je=t(Me),lr=t(je,!0);r(je);var Ue=i(je,2),Xe=t(Ue),Be=t(Xe,!0);r(Xe);var Ae=i(Xe,2);{var cr=qe=>{var rr=Ka(),Ar=t(rr);r(rr),F(Mr=>b(Ar,`별칭: ${Mr??""}`),[()=>e(be).aliases.join(", ")]),n(qe,rr)};y(Ae,qe=>{e(be).aliases&&e(be).aliases.length>0&&qe(cr)})}var fr=i(Ae,2);let wr;var Pr=t(fr,!0);r(fr);var or=i(fr,2),kr=t(or,!0);r(or),r(Ue),r(Me);var vr=i(Me,2);let Er;vr.__click=()=>ee(e(be).name);var _r=t(vr);{var at=qe=>{var rr=we("✓ 선택됨");n(qe,rr)},st=qe=>{var rr=we();F(()=>b(rr,e(L).length>=2?"선택 불가":"NPC로 선택")),n(qe,rr)};y(_r,qe=>{e(L).includes(e(be).name)?qe(at):qe(st,!1)})}r(vr),r(Fe),F((qe,rr,Ar,Mr,it,ot)=>{er=De(Me,1,"character-card",null,er,qe),Me.disabled=e(me),b(lr,rr),b(Be,e(be).name),wr=De(fr,1,"character-description",null,wr,Ar),b(Pr,Mr),b(kr,it),Er=De(vr,1,"character-select-btn",null,Er,ot),vr.disabled=e(me)},[()=>({expanded:e(U).has(e(be).name),selected:e(L).includes(e(be).name)}),()=>e(be).name.charAt(0),()=>({expanded:e(U).has(e(be).name)}),()=>e(U).has(e(be).name)?e(be).description:ce(e(be).description,140),()=>e(U).has(e(be).name)?"접기":"더보기",()=>({selected:e(L).includes(e(be).name)})]),n(Ye,Fe)}),n(ze,ye)},$$slots:{default:!0}})},ae=X=>{var ze=Ne(),Ce=Se(ze);{var ye=Ye=>{Yt(Ye,{get proposedGauges(){return e(le)},get selectedGaugeIds(){return e(B)},get loadingGauges(){return e(w)},get selectingGauges(){return e(W)},toggleGauge:ge})},He=Ye=>{var be=Ne(),Fe=Se(be);{var Me=je=>{Kt(je,{get endingConfig(){return e(q)},get numEpisodes(){return e(v)},get maxDepth(){return e(I)},onEndingChange:re,onNumEpisodesChange:de,onMaxDepthChange:Ee})},er=je=>{var lr=Ne(),Ue=Se(lr);{var Xe=Ae=>{Ia(Ae,{get treeEditMode(){return e(k)},get currentEpisodeTree(){return e(_)},get selectedNode(){return e(j)},get regenerating(){return e(p)},get currentEpisodeTitle(){return e(S)},get currentEpisode(){return e(C)},get actualTotalEpisodes(){return e(N)},get generating(){return e(G)},get progressMessage(){return e(K)},get totalEpisodesGenerated(){return e(T)},get numEpisodes(){return e(v)},get error(){return e(f)},get maxDepth(){return e(I)},onSelectNode:br,onApplyChanges:Cr,onCancelSelect:()=>{a(j,null)},onGenerateNextEpisodeFromTree:Wr,onBackToSettings:()=>{a(l,4),a(f,"")}})},Be=Ae=>{var cr=Ne(),fr=Se(cr);{var wr=or=>{Fa(or,{get generating(){return e(G)},get progressMessage(){return e(K)},get currentEpisode(){return e(C)},get actualTotalEpisodes(){return e(N)},get numEpisodes(){return e(v)},get totalEpisodesGenerated(){return e(T)},get error(){return e(f)},onBackToStep4:()=>{a(l,4),a(f,"")}})},Pr=or=>{var kr=Ne(),vr=Se(kr);{var Er=_r=>{Ba(_r,{get metadata(){return e(_e)},get storyDataId(){return e($)},startPlaying:$e,createNew:Zr})};y(vr,_r=>{e(l)===7&&_r(Er)},!0)}n(or,kr)};y(fr,or=>{e(l)===6?or(wr):or(Pr,!1)},!0)}n(Ae,cr)};y(Ue,Ae=>{e(l)===5?Ae(Xe):Ae(Be,!1)},!0)}n(je,lr)};y(Fe,je=>{e(l)===4?je(Me):je(er,!1)},!0)}n(Ye,be)};y(Ce,Ye=>{e(l)===3?Ye(ye):Ye(He,!1)},!0)}n(X,ze)};y(h,X=>{e(l)===2?X(V):X(ae,!1)},!0)}n(o,s)};y(Qr,o=>{e(l)===1?o($r):o(et,!1)})}r(Ir);var Or=i(Ir,2),Yr=t(Or);{let o=zr(()=>e(l)===1||e(G));Ve(Yr,{onclick:xe,get disabled(){return e(o)},variant:"outline",size:"lg",children:(s,h)=>{Ke();var V=we("← 이전");n(s,V)},$$slots:{default:!0}})}var Nr=i(Yr,2),rt=t(Nr);r(Nr);var tt=i(Nr,2);{let o=zr(()=>!O()||e(l)>=5||e(ue)||e(pe)||e(w)||e(W)||e(ne)||e(G));Ve(tt,{onclick:async()=>await Re(),get disabled(){return e(o)},size:"lg",children:(s,h)=>{var V=Ne(),ae=Se(V);{var X=Ce=>{var ye=we();F(()=>b(ye,e(ue)?"업로드 중...":"소설 업로드 →")),n(Ce,ye)},ze=Ce=>{var ye=Ne(),He=Se(ye);{var Ye=Fe=>{var Me=we();F(()=>b(Me,e(W)?"선택 중...":"게이지 선택 →")),n(Fe,Me)},be=Fe=>{var Me=Ne(),er=Se(Me);{var je=Ue=>{var Xe=we();F(()=>b(Xe,e(ne)?"시작 중...":"생성 시작 →")),n(Ue,Xe)},lr=Ue=>{var Xe=we("다음 →");n(Ue,Xe)};y(er,Ue=>{e(l)===4?Ue(je):Ue(lr,!1)},!0)}n(Fe,Me)};y(He,Fe=>{e(l)===3?Fe(Ye):Fe(be,!1)},!0)}n(Ce,ye)};y(ae,Ce=>{e(l)===1?Ce(X):Ce(ze,!1)})}n(s,V)},$$slots:{default:!0}})}r(Or),r(Lr),r(Sr),F(()=>b(rt,`${e(l)??""} / 7 단계`)),n(Te,Sr),sr()}hr(["click"]);export{is as component};
