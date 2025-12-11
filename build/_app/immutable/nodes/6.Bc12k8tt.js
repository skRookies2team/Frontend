import{d as pr,f as c,a as n,c as Ge,t as ze,e as Fr}from"../chunks/B2rijitG.js";import{c as Vr,o as Hr}from"../chunks/DPorY5mc.js";import{n as Wr,o as Zr,b6 as Qr,h as Ir,q as $r,C as et,T as jr,y as Rr,s as Lr,z as rt,Y as rr,a1 as i,$ as t,a4 as r,g as e,a2 as R,a3 as tr,d as oe,f as ne,a5 as Ee,a6 as Ue,a0 as a,Z as j,aC as tt,v as xr,b7 as at,_ as ur,b as Or,ae as st,a7 as kr,a9 as Ar}from"../chunks/DztSR9n7.js";import{s as b}from"../chunks/DGtZoTxw.js";import{p as u,i as w,b as it}from"../chunks/BepJJDSh.js";import{e as Ve,i as He}from"../chunks/ClWVLaBt.js";import{r as er,a as Le,e as Je,b as dr,B as Xe}from"../chunks/BNNCyM1d.js";import{a as Ye,A as $e}from"../chunks/fm54UEUU.js";import{g as Br}from"../chunks/DGacg_c2.js";import"../chunks/Bx2k2zCd.js";import{i as cr}from"../chunks/7VvCqicd.js";import{s as ot}from"../chunks/_UCmf4u3.js";function lt(we,d){let l=null,g=Ir;var h;if(Ir){l=rt;for(var _=$r(document.head);_!==null&&(_.nodeType!==et||_.data!==we);)_=jr(_);if(_===null)Rr(!1);else{var O=jr(_);_.remove(),Lr(O)}}Ir||(h=document.head.appendChild(Wr()));try{Zr(()=>d(h),Qr)}finally{g&&(Rr(!0),Lr(l))}}var nt=c('<button type="button"> </button>'),dt=c('<p class="genre-selected-hint svelte-c2sxfd">선택된 장르: <strong class="svelte-c2sxfd"> </strong></p>'),ct=c('<div class="file-info"><span class="file-icon">📄</span> <span class="file-name"> </span> <span class="file-size"> </span> <button type="button" class="file-remove">✕</button></div>'),vt=c('<div class="error-banner"> </div>'),ut=c('<p class="upload-text">S3에 파일 업로드 중...</p> <div class="upload-progress-bar"><div class="upload-progress-fill"></div></div> <p class="upload-percentage"> </p>',1),pt=c('<p class="upload-text upload-processing"><span class="inline-spinner" aria-hidden="true"></span> 업로드 완료! 분석을 시작합니다...</p>'),gt=c('<p class="upload-text">소설을 업로드하고 있습니다...</p>'),mt=c('<div class="info-banner"><div class="upload-status"><div class="upload-icon">⏳</div> <div class="upload-info"><!></div></div></div>'),ft=c('<div class="success-banner">✅ 준비 완료! 소설 업로드 버튼을 클릭하세요</div>'),ht=c('<div class="content-card"><div class="card-header"><h2 class="card-title">1단계: 소설 텍스트 입력</h2> <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p></div> <div class="card-body"><div class="section-block"><div class="section-header"><h3 class="section-title">기본 정보</h3> <p class="section-subtitle">소설의 제목과 설명을 입력하세요</p></div> <div class="section-content"><div class="form-row"><div class="form-group form-group-half"><label class="form-label">소설 제목 *</label> <input type="text" class="form-input" placeholder="예: 파리대왕"/></div> <div class="form-group form-group-half"><label class="form-label">설명 (선택)</label> <input type="text" class="form-input" placeholder="소설에 대한 간단한 설명"/></div></div> <div class="form-group"><label class="form-label">장르 선택 (선택)</label> <p class="field-hint">소설의 장르를 선택하세요</p> <div class="genre-grid svelte-c2sxfd"></div> <!></div></div></div> <div class="section-block"><div class="section-header"><h3 class="section-title">소설 내용 입력</h3> <p class="section-subtitle">파일을 업로드하거나 텍스트를 직접 입력하세요</p></div> <div class="section-content"><div class="input-method-card"><div class="method-header"><label class="form-label">파일 업로드</label> <p class="field-hint">지원 형식: .txt, .pdf, .doc, .docx (최대 10MB)</p></div> <div class="file-upload-wrapper"><label for="file-upload" class="file-upload-button"><span class="file-upload-icon">📁</span> <span class="file-upload-text">파일 선택</span></label> <input id="file-upload" type="file" accept=".txt,.pdf,.doc,.docx" class="file-input-hidden"/></div> <!></div></div></div> <!> <!></div></div>');function bt(we,d){rr(d,!1);let l=u(d,"title",8,""),g=u(d,"description",8,""),h=u(d,"genre",8,""),_=u(d,"uploadedFile",8,null),O=u(d,"uploading",8,!1),G=u(d,"uploadProgress",8,0),ae=u(d,"canGoNext",8,!1),ue=u(d,"error",8,""),W=u(d,"onTitleChange",8),J=u(d,"onDescriptionChange",8),q=u(d,"onGenreChange",8),de=u(d,"onFileChange",8),ce=u(d,"onRemoveFile",8);const V=["고전문학","SF","추리","판타지","로맨스","교육"];cr();var le=ht(),S=i(t(le),2),T=t(S),se=i(t(T),2),Y=t(se),K=t(Y),y=i(t(K),2);er(y),y.__input=p=>W()(p.target.value),r(K);var N=i(K,2),C=i(t(N),2);er(C),C.__input=p=>J()(p.target.value),r(N),r(Y);var Q=i(Y,2),k=i(t(Q),4);Ve(k,5,()=>V,He,(p,E)=>{var P=nt();let D;P.__click=()=>q()(e(E));var ee=t(P,!0);r(P),R(()=>{D=Le(P,1,"genre-button svelte-c2sxfd",null,D,{selected:h()===e(E)}),P.disabled=O(),b(ee,e(E))}),n(p,P)}),r(k);var I=i(k,2);{var A=p=>{var E=dt(),P=i(t(E)),D=t(P,!0);r(P),r(E),R(()=>b(D,h())),n(p,E)};w(I,p=>{h()&&p(A)})}r(Q),r(se),r(T);var m=i(T,2),M=i(t(m),2),U=t(M),Z=i(t(U),2),ie=i(t(Z),2);ie.__change=function(...p){var E;(E=de())==null||E.apply(this,p)},r(Z);var v=i(Z,2);{var z=p=>{var E=ct(),P=i(t(E),2),D=t(P,!0);r(P);var ee=i(P,2),F=t(ee);r(ee);var L=i(ee,2);L.__click=function(...re){var me;(me=ce())==null||me.apply(this,re)},r(E),R(re=>{b(D,(ne(_()),oe(()=>_().name))),b(F,`(${re??""} KB)`),L.disabled=O()},[()=>(ne(_()),oe(()=>(_().size/1024).toFixed(1)))]),n(p,E)};w(v,p=>{_()&&p(z)})}r(U),r(M),r(m);var f=i(m,2);{var be=p=>{var E=vt(),P=t(E);r(E),R(()=>b(P,`❌ ${ue()??""}`)),n(p,E)};w(f,p=>{ue()&&p(be)})}var ge=i(f,2);{var $=p=>{var E=mt(),P=t(E),D=i(t(P),2),ee=t(D);{var F=re=>{var me=ut(),X=i(Ee(me),2),xe=t(X);r(X);var ke=i(X,2),fe=t(ke);r(ke),R(Te=>{dr(xe,`width: ${G()??""}%`),b(fe,`${Te??""}%`)},[()=>(ne(G()),oe(()=>G().toFixed(1)))]),n(re,me)},L=re=>{var me=Ge(),X=Ee(me);{var xe=fe=>{var Te=pt();n(fe,Te)},ke=fe=>{var Te=gt();n(fe,Te)};w(X,fe=>{G()===100?fe(xe):fe(ke,!1)},!0)}n(re,me)};w(ee,re=>{G()>0&&G()<100?re(F):re(L,!1)})}r(D),r(P),r(E),n(p,E)},H=p=>{var E=Ge(),P=Ee(E);{var D=ee=>{var F=ft();n(ee,F)};w(P,ee=>{ae()&&ee(D)},!0)}n(p,E)};w(ge,p=>{O()?p($):p(H,!1)})}r(S),r(le),R(()=>{Je(y,l()),Je(C,g()),ie.disabled=O()}),n(we,le),tr()}pr(["input","click","change"]);var xt=c('<div class="extracting-state"><div class="spinner"></div> <p class="extracting-text">AI가 소설을 분석하고 있습니다...</p> <p class="extracting-hint">요약과 등장인물을 추출하는 중...</p></div>'),_t=c('<div class="summary-section"><h3 class="section-subtitle">소설 요약</h3> <div class="summary-box"> </div></div>'),yt=c('<div class="analysis-results"><div class="analysis-layout"><!> <div class="characters-section"><div class="section-subtitle-row"><h3 class="section-subtitle">추출된 등장인물 <span class="count-badge"> </span></h3> <p class="section-hint">카드를 클릭하면 상세가 펼쳐집니다</p></div> <div class="character-list"><!></div></div></div> <div class="success-banner"> </div></div>'),wt=c('<div class="content-card"><div class="card-header"><h2 class="card-title">2단계: 등장인물 자동 추출</h2> <p class="card-desc">AI가 소설에서 등장인물을 자동으로 추출합니다</p></div> <div class="card-body"><!></div></div>');function kt(we,d){rr(d,!1);let l=u(d,"loadingAnalysis",8,!1),g=u(d,"summary",8,""),h=u(d,"characters",24,()=>[]);cr();var _=wt(),O=i(t(_),2),G=t(O);{var ae=W=>{var J=xt();n(W,J)},ue=W=>{var J=Ge(),q=Ee(J);{var de=ce=>{var V=yt(),le=t(V),S=t(le);{var T=A=>{var m=_t(),M=i(t(m),2),U=t(M,!0);r(M),r(m),R(()=>b(U,g())),n(A,m)};w(S,A=>{g()&&A(T)})}var se=i(S,2),Y=t(se),K=t(Y),y=i(t(K)),N=t(y);r(y),r(K),Ue(2),r(Y);var C=i(Y,2),Q=t(C);ot(Q,d,"default",{}),r(C),r(se),r(le);var k=i(le,2),I=t(k);r(k),r(V),R(()=>{b(N,`${ne(h()),oe(()=>h().length)??""}명`),b(I,`✅ 분석 완료! 등장인물 ${ne(h()),oe(()=>h().length)??""}명 추출`)}),n(ce,V)};w(q,ce=>{ne(h()),oe(()=>h().length>0)&&ce(de)},!0)}n(W,J)};w(G,W=>{l()?W(ae):W(ue,!1)})}r(O),r(_),n(we,_),tr()}var Et=c('<div class="loading-state"><div class="spinner"></div> <p>AI가 소설 주제에 맞는 게이지를 제안하고 있습니다...</p></div>'),zt=c('<div class="gauge-range"> </div>'),Tt=c('<button type="button"><div class="gauge-check"><!></div> <div class="gauge-info"><div class="gauge-name"> </div> <div class="gauge-desc"> </div> <!></div></button>'),Ct=c("<p> </p>"),St=c('<div class="form-group"><label class="form-label">AI가 제안한 게이지 (정확히 2개 선택) <span class="required">*</span></label> <p class="field-hint">소설의 주제와 내용에 맞춰 AI가 선택한 5가지 게이지입니다</p> <div class="gauge-grid"></div> <!></div>'),Gt=c('<div class="content-card"><div class="card-header"><h2 class="card-title">3단계: 게이지 선택</h2> <p class="card-desc">스토리에서 사용할 상태 지표를 선택하세요 (최소 2개)</p></div> <div class="card-body"><!></div></div>');function It(we,d){rr(d,!1);let l=u(d,"proposedGauges",24,()=>[]),g=u(d,"selectedGaugeIds",24,()=>[]),h=u(d,"loadingGauges",8,!1),_=u(d,"selectingGauges",8,!1),O=u(d,"toggleGauge",8);cr();var G=Gt(),ae=i(t(G),2),ue=t(ae);{var W=q=>{var de=Et();n(q,de)},J=q=>{var de=Ge(),ce=Ee(de);{var V=le=>{var S=St(),T=i(t(S),4);Ve(T,5,l,He,(K,y)=>{var N=Tt();let C;N.__click=()=>O()(e(y).id);var Q=t(N),k=t(Q);{var I=z=>{var f=ze("✓");n(z,f)};w(k,z=>{ne(g()),e(y),oe(()=>g().includes(e(y).id))&&z(I)})}r(Q);var A=i(Q,2),m=t(A),M=t(m,!0);r(m);var U=i(m,2),Z=t(U,!0);r(U);var ie=i(U,2);{var v=z=>{var f=zt(),be=t(f);r(f),R(()=>b(be,`${e(y),oe(()=>e(y).min_label)??""} ↔ ${e(y),oe(()=>e(y).max_label)??""}`)),n(z,f)};w(ie,z=>{e(y),oe(()=>e(y).min_label&&e(y).max_label)&&z(v)})}r(A),r(N),R(z=>{C=Le(N,1,"gauge-option",null,C,z),N.disabled=_(),b(M,(e(y),oe(()=>e(y).name))),b(Z,(e(y),oe(()=>e(y).meaning||e(y).description)))},[()=>({selected:g().includes(e(y).id)})]),n(K,N)}),r(T);var se=i(T,2);{var Y=K=>{var y=Ct();let N;var C=t(y);r(y),R(()=>{N=Le(y,1,"selection-count",null,N,{complete:g().length===2}),b(C,`${ne(g()),oe(()=>g().length)??""}/2 선택됨 ${ne(g()),oe(()=>g().length===2?"✓":"")??""}`)}),n(K,y)};w(se,K=>{ne(g()),oe(()=>g().length>0)&&K(Y)})}r(S),n(le,S)};w(ce,le=>{ne(l()),oe(()=>l().length>0)&&le(V)},!0)}n(q,de)};w(ue,q=>{h()?q(W):q(J,!1)})}r(ae),r(G),n(we,G),tr()}pr(["click"]);var At=c('<div class="content-card"><div class="card-header"><h2 class="card-title">4단계: 예상 엔딩 설계</h2> <p class="card-desc">스토리에서 생성할 엔딩의 유형과 개수를 설정하세요</p></div> <div class="card-body"><div class="config-layout"><div class="config-main"><div class="form-group"><label class="form-label">엔딩 구성</label> <div class="ending-config"><div class="ending-item"><label>😊 해피 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>😢 비극 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>😐 중립 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>🤔 열린 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div> <div class="ending-item"><label>💀 배드 엔딩</label> <input type="number" min="0" max="5" class="ending-input"/></div></div></div> <div class="form-row"><div class="form-group form-group-half"><label class="form-label">에피소드 수 (1-10)</label> <div class="slider-container"><input type="range" min="1" max="10" class="slider"/> <span class="slider-value"> </span></div></div> <div class="form-group form-group-half"><label class="form-label">분기 깊이 (2-5)</label> <div class="slider-container"><input type="range" min="2" max="5" class="slider"/> <span class="slider-value"> </span></div></div></div></div> <div class="config-sidebar"><div class="info-card"><h3 class="info-title">예상 생성 규모</h3> <ul class="info-list"><li>총 에피소드: <strong> </strong></li> <li>분기 깊이: <strong> </strong></li> <li>예상 노드 수: <strong> </strong></li> <li>총 엔딩 수: <strong> </strong></li></ul></div></div></div></div></div>');function Mt(we,d){rr(d,!1);let l=u(d,"endingConfig",24,()=>({happy:2,tragic:1,neutral:1,open:1,bad:0})),g=u(d,"numEpisodes",8,5),h=u(d,"maxDepth",8,3),_=u(d,"onEndingChange",8),O=u(d,"onNumEpisodesChange",8),G=u(d,"onMaxDepthChange",8);cr();var ae=At(),ue=i(t(ae),2),W=t(ue),J=t(W),q=t(J),de=i(t(q),2),ce=t(de),V=i(t(ce),2);er(V),V.__input=X=>_()("happy",+X.target.value),r(ce);var le=i(ce,2),S=i(t(le),2);er(S),S.__input=X=>_()("tragic",+X.target.value),r(le);var T=i(le,2),se=i(t(T),2);er(se),se.__input=X=>_()("neutral",+X.target.value),r(T);var Y=i(T,2),K=i(t(Y),2);er(K),K.__input=X=>_()("open",+X.target.value),r(Y);var y=i(Y,2),N=i(t(y),2);er(N),N.__input=X=>_()("bad",+X.target.value),r(y),r(de),r(q);var C=i(q,2),Q=t(C),k=i(t(Q),2),I=t(k);er(I),I.__input=X=>O()(+X.target.value);var A=i(I,2),m=t(A);r(A),r(k),r(Q);var M=i(Q,2),U=i(t(M),2),Z=t(U);er(Z),Z.__input=X=>G()(+X.target.value);var ie=i(Z,2),v=t(ie);r(ie),r(U),r(M),r(C),r(J);var z=i(J,2),f=t(z),be=i(t(f),2),ge=t(be),$=i(t(ge)),H=t($);r($),r(ge);var p=i(ge,2),E=i(t(p)),P=t(E);r(E),r(p);var D=i(p,2),ee=i(t(D)),F=t(ee);r(ee),r(D);var L=i(D,2),re=i(t(L)),me=t(re);r(re),r(L),r(be),r(f),r(z),r(W),r(ue),r(ae),R((X,xe)=>{Je(V,(ne(l()),oe(()=>l().happy))),Je(S,(ne(l()),oe(()=>l().tragic))),Je(se,(ne(l()),oe(()=>l().neutral))),Je(K,(ne(l()),oe(()=>l().open))),Je(N,(ne(l()),oe(()=>l().bad))),Je(I,g()),b(m,`${g()??""}화`),Je(Z,h()),b(v,`레벨 ${h()??""}`),b(H,`${g()??""}화`),b(P,`레벨 ${h()??""}`),b(F,`약 ${X??""}개`),b(me,`${xe??""}개`)},[()=>(ne(h()),ne(g()),oe(()=>Math.pow(2,h())*g())),()=>(ne(l()),oe(()=>Object.values(l()).reduce((X,xe)=>X+xe,0)))]),n(we,ae),tr()}pr(["input"]);var Dt=c('<span class="choices-badge svelte-1dd3ufc"> </span>'),Nt=c('<span class="children-badge svelte-1dd3ufc"> </span>'),Pt=c('<div class="selected-indicator svelte-1dd3ufc"><span class="svelte-1dd3ufc">✏️ 편집 중</span></div>'),Ft=c('<div class="child-branch svelte-1dd3ufc"><div class="connector-to-child svelte-1dd3ufc"></div> <!></div>'),jt=c('<div class="children-wrapper svelte-1dd3ufc"><div class="connector-vertical svelte-1dd3ufc"></div> <div class="connector-horizontal svelte-1dd3ufc"></div> <div class="children-row svelte-1dd3ufc"></div></div>'),Rt=c('<div><button type="button"><div class="node-badges svelte-1dd3ufc"><span class="depth-badge svelte-1dd3ufc"> </span> <span class="id-badge svelte-1dd3ufc"> </span></div> <div class="node-body svelte-1dd3ufc"><p class="node-text svelte-1dd3ufc"> </p></div> <div class="node-footer svelte-1dd3ufc"><!> <!></div> <!></button> <!></div>'),Lt=c('<div class="tree-content svelte-1dd3ufc"><!></div>'),Bt=c('<div class="empty-state svelte-1dd3ufc"><span class="empty-icon svelte-1dd3ufc">🌳</span> <p class="svelte-1dd3ufc">트리 데이터가 없습니다.</p></div>'),Ot=c('<div class="tree-container svelte-1dd3ufc"><div class="tree-controls svelte-1dd3ufc"><div class="control-hint svelte-1dd3ufc"><span class="hint-icon svelte-1dd3ufc">✋</span> <span class="svelte-1dd3ufc">빈 공간 드래그로 이동</span></div> <div class="control-actions svelte-1dd3ufc"><span class="zoom-label svelte-1dd3ufc"> </span> <button type="button" class="zoom-btn svelte-1dd3ufc">−</button> <button type="button" class="zoom-btn svelte-1dd3ufc">+</button> <button type="button" class="zoom-btn reset svelte-1dd3ufc">↺</button></div></div> <div role="application" aria-label="스토리 트리 뷰어"><!></div></div>');function Yt(we,d){rr(d,!0);let l=u(d,"rootNode",3,null),g=u(d,"selectedNodeId",3,"");u(d,"maxDepth",3,3),u(d,"episodeTitle",3,"");let h,_=j(!1),O=j(0),G=j(0),ae=j(0),ue=j(0);function W(v){e(_)||(console.log("노드 클릭됨:",v.id),d.onselectnode&&d.onselectnode(new CustomEvent("selectnode",{detail:{node:v}})))}function J(v){return g()===v}function q(v){const z=["#ff4d4f","#1890ff","#52c41a","#faad14","#722ed1"];return z[Math.min(v,z.length-1)]}function de(v,z=60){return v?v.length>z?v.slice(0,z)+"...":v:""}function ce(v){v.target.closest(".node-card")||(a(_,!0),a(O,v.pageX-h.offsetLeft),a(G,v.pageY-h.offsetTop),a(ae,h.scrollLeft,!0),a(ue,h.scrollTop,!0))}function V(v){if(!e(_))return;v.preventDefault();const z=v.pageX-h.offsetLeft,f=v.pageY-h.offsetTop,be=(z-e(O))*1.5,ge=(f-e(G))*1.5;h.scrollLeft=e(ae)-be,h.scrollTop=e(ue)-ge}function le(){a(_,!1)}function S(){a(_,!1)}let T=j(1);function se(v){if(v.ctrlKey){v.preventDefault();const z=v.deltaY>0?-.1:.1;a(T,Math.min(Math.max(.5,e(T)+z),2),!0)}}function Y(){a(T,1)}var K=Ot(),y=t(K),N=i(t(y),2),C=t(N),Q=t(C);r(C);var k=i(C,2);k.__click=()=>a(T,Math.max(.5,e(T)-.1),!0);var I=i(k,2);I.__click=()=>a(T,Math.min(2,e(T)+.1),!0);var A=i(I,2);A.__click=Y,r(N),r(y);var m=i(y,2);let M;m.__mousedown=ce,m.__mousemove=V,m.__mouseup=le;var U=t(m);{var Z=v=>{var z=Lt();{const be=(ge,$=tt,H)=>{let p=xr(()=>at(H==null?void 0:H(),!1));var E=Rt();let P;var D=t(E);let ee;D.__click=()=>W($());var F=t(D),L=t(F),re=t(L);r(L);var me=i(L,2),X=t(me,!0);r(me),r(F);var xe=i(F,2),ke=t(xe),fe=t(ke,!0);r(ke),r(xe);var Te=i(xe,2),Ce=t(Te);{var Ie=he=>{var Ae=Dt(),je=t(Ae);r(Ae),R(()=>b(je,`🎯 ${$().choices.length??""}`)),n(he,Ae)};w(Ce,he=>{$().choices&&$().choices.length>0&&he(Ie)})}var De=i(Ce,2);{var Pe=he=>{var Ae=Nt(),je=t(Ae);r(Ae),R(()=>b(je,`🌿 ${$().children.length??""}`)),n(he,Ae)};w(De,he=>{$().children&&$().children.length>0&&he(Pe)})}r(Te);var gr=i(Te,2);{var mr=he=>{var Ae=Pt();n(he,Ae)};w(gr,he=>{J($().id)&&he(mr)})}r(D);var fr=i(D,2);{var We=he=>{var Ae=jt(),je=i(t(Ae),4);Ve(je,21,()=>$().children,He,(hr,_r)=>{var vr=Ft(),Er=i(t(vr),2);be(Er,()=>e(_r),()=>!1),r(vr),n(hr,vr)}),r(je),r(Ae),n(he,Ae)};w(fr,he=>{$().children&&$().children.length>0&&he(We)})}r(E),R((he,Ae,je,hr)=>{P=Le(E,1,"node-branch svelte-1dd3ufc",null,P,{"is-root":e(p)}),ee=Le(D,1,"node-card svelte-1dd3ufc",null,ee,he),dr(D,`--node-color: ${Ae??""}`),dr(L,`background: ${je??""}`),b(re,`D${$().depth??""}`),b(X,$().id),b(fe,hr)},[()=>({selected:J($().id)}),()=>q($().depth),()=>q($().depth),()=>de($().text)]),n(ge,E)};var f=t(z);be(f,l,()=>!0),r(z)}R(()=>dr(z,`transform: scale(${e(T)??""}); transform-origin: top left;`)),n(v,z)},ie=v=>{var z=Bt();n(v,z)};w(U,v=>{l()?v(Z):v(ie,!1)})}r(m),it(m,v=>h=v,()=>h),r(K),R(v=>{b(Q,`확대: ${v??""}%`),M=Le(m,1,"tree-scroll-area svelte-1dd3ufc",null,M,{dragging:e(_)})},[()=>Math.round(e(T)*100)]),Fr("mouseleave",m,S),Fr("wheel",m,se),n(we,K),tr()}pr(["click","mousedown","mousemove","mouseup"]);var Ut=c('<span class="tag svelte-cwg4ci"> </span>'),Kt=c('<div class="choice-tags svelte-cwg4ci"></div>'),Xt=c('<div class="choice-item svelte-cwg4ci"><span class="choice-number svelte-cwg4ci"></span> <input type="text" class="choice-input svelte-cwg4ci" placeholder="선택지 텍스트..."/> <!></div>'),qt=c('<div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci"> </label> <div class="choices-list svelte-cwg4ci"></div></div>'),Jt=c('<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">상황:</span> <span class="detail-value svelte-cwg4ci"> </span></div>'),Vt=c('<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">NPC 감정:</span> <span class="detail-value svelte-cwg4ci"> </span></div>'),Ht=c('<div class="details-section svelte-cwg4ci"><h4 class="details-title svelte-cwg4ci">📋 상세 정보</h4> <!> <!></div>'),Wt=c('<span class="status-changed svelte-cwg4ci">⚠️ 변경사항이 있습니다</span>'),Zt=c('<span class="status-saved svelte-cwg4ci">✓ 저장됨</span>'),Qt=c('<div class="editor-header svelte-cwg4ci"><h3 class="editor-title svelte-cwg4ci">✏️ 노드 편집</h3> <div class="node-info svelte-cwg4ci"><span class="info-badge svelte-cwg4ci"> </span> <span class="info-badge svelte-cwg4ci"> </span></div></div> <div class="editor-body svelte-cwg4ci"><div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci">노드 텍스트</label> <textarea class="form-textarea svelte-cwg4ci" rows="4" placeholder="스토리 텍스트를 입력하세요..."></textarea></div> <!> <!></div> <div class="editor-footer svelte-cwg4ci"><div class="status-info svelte-cwg4ci"><!></div> <div class="editor-actions svelte-cwg4ci"><!> <!></div></div>',1),$t=c('<div class="no-selection svelte-cwg4ci"><div class="no-selection-icon svelte-cwg4ci">👆</div> <p class="no-selection-text svelte-cwg4ci">편집할 노드를 선택하세요</p> <p class="no-selection-hint svelte-cwg4ci">트리에서 노드를 클릭하면 여기서 편집할 수 있습니다</p></div>'),ea=c('<div class="editor-panel svelte-cwg4ci"><!></div>');function ra(we,d){rr(d,!0);let l=u(d,"node",3,null),g=u(d,"isLoading",3,!1);u(d,"episodeTitle",3,""),u(d,"episodeOrder",3,1);let h=j(""),_=j(ur([])),O=j(!1);const G=Vr();Or(()=>{l()&&(a(h,l().text,!0),a(_,l().choices?[...l().choices.map(S=>({...S}))]:[],!0),a(O,!1))});function ae(S){const T=S.target;a(h,T.value,!0),W()}function ue(S,T){e(_)[S].text=T,W()}function W(){if(!l()){a(O,!1);return}const S=e(h)!==l().text,T=e(_).some((se,Y)=>l().choices&&l().choices[Y]&&se.text!==l().choices[Y].text);a(O,S||T,!0)}function J(){!l()||!e(O)||G("applyChanges",{nodeId:l().id,newText:e(h),newChoices:e(_)})}function q(){l()&&(a(h,l().text,!0),a(_,l().choices?[...l().choices.map(S=>({...S}))]:[],!0),a(O,!1)),G("cancel")}var de=ea(),ce=t(de);{var V=S=>{var T=Qt(),se=Ee(T),Y=i(t(se),2),K=t(Y),y=t(K);r(K);var N=i(K,2),C=t(N);r(N),r(Y),r(se);var Q=i(se,2),k=t(Q),I=i(t(k),2);st(I),I.__input=ae,r(k);var A=i(k,2);{var m=H=>{var p=qt(),E=t(p),P=t(E);r(E);var D=i(E,2);Ve(D,21,()=>e(_),He,(ee,F,L)=>{var re=Xt(),me=t(re);me.textContent=L+1;var X=i(me,2);er(X),X.__input=fe=>ue(L,fe.target.value);var xe=i(X,2);{var ke=fe=>{var Te=Kt();Ve(Te,21,()=>e(F).tags,He,(Ce,Ie)=>{var De=Ut(),Pe=t(De,!0);r(De),R(()=>b(Pe,e(Ie))),n(Ce,De)}),r(Te),n(fe,Te)};w(xe,fe=>{e(F).tags&&e(F).tags.length>0&&fe(ke)})}r(re),R(()=>{Je(X,e(F).text),X.disabled=g()}),n(ee,re)}),r(D),r(p),R(()=>b(P,`선택지 (${e(_).length??""}개)`)),n(H,p)};w(A,H=>{e(_).length>0&&H(m)})}var M=i(A,2);{var U=H=>{var p=Ht(),E=i(t(p),2);{var P=F=>{var L=Jt(),re=i(t(L),2),me=t(re,!0);r(re),r(L),R(()=>b(me,l().details.situation)),n(F,L)};w(E,F=>{l().details.situation&&F(P)})}var D=i(E,2);{var ee=F=>{var L=Vt(),re=i(t(L),2),me=t(re,!0);r(re),r(L),R(X=>b(me,X),[()=>Object.entries(l().details.npc_emotions).map(([X,xe])=>`${X}: ${xe}`).join(", ")]),n(F,L)};w(D,F=>{l().details.npc_emotions&&Object.keys(l().details.npc_emotions).length>0&&F(ee)})}r(p),n(H,p)};w(M,H=>{l().details&&H(U)})}r(Q);var Z=i(Q,2),ie=t(Z),v=t(ie);{var z=H=>{var p=Wt();n(H,p)},f=H=>{var p=Zt();n(H,p)};w(v,H=>{e(O)?H(z):H(f,!1)})}r(ie);var be=i(ie,2),ge=t(be);Xe(ge,{variant:"outline",onclick:q,get disabled(){return g()},children:(H,p)=>{Ue();var E=ze("취소");n(H,E)},$$slots:{default:!0}});var $=i(ge,2);{let H=kr(()=>!e(O)||g());Xe($,{onclick:J,get disabled(){return e(H)},children:(p,E)=>{var P=Ge(),D=Ee(P);{var ee=L=>{var re=ze("⏳ 적용 중...");n(L,re)},F=L=>{var re=ze("🔄 적용 (서브트리 재생성)");n(L,re)};w(D,L=>{g()?L(ee):L(F,!1)})}n(p,P)},$$slots:{default:!0}})}r(be),r(Z),R(()=>{b(y,`ID: ${l().id??""}`),b(C,`깊이: ${l().depth??""}`),Je(I,e(h)),I.disabled=g()}),n(S,T)},le=S=>{var T=$t();n(S,T)};w(ce,S=>{l()?S(V):S(le,!1)})}r(de),n(we,de),tr()}pr(["input"]);var ta=c('<span class="btn-icon svelte-10hxdp2">✅</span> 완료하기',1),aa=c('<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드',1),sa=c('<div class="edit-main svelte-10hxdp2"><div class="tree-panel svelte-10hxdp2"><div class="panel-header svelte-10hxdp2"><div class="panel-title-group svelte-10hxdp2"><span class="panel-icon svelte-10hxdp2">📊</span> <span class="panel-title svelte-10hxdp2">스토리 트리</span></div> <div class="panel-actions svelte-10hxdp2"><span class="tree-stats svelte-10hxdp2"><!></span></div></div> <div class="tree-viewport svelte-10hxdp2"><!></div></div> <div class="editor-panel svelte-10hxdp2"><!></div></div> <div class="edit-footer svelte-10hxdp2"><div class="footer-left svelte-10hxdp2"><div class="hint-card svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">💡</span> <div class="hint-content svelte-10hxdp2"><strong class="svelte-10hxdp2">사용법</strong> <span class="svelte-10hxdp2">노드 클릭 → 내용 수정 → 적용 버튼</span></div></div></div> <div class="footer-right svelte-10hxdp2"><!> <!></div></div>',1),ia=c('<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드',1),oa=c('<div class="empty-state svelte-10hxdp2"><div class="empty-visual svelte-10hxdp2"><div class="empty-icon-wrapper svelte-10hxdp2"><span class="empty-icon svelte-10hxdp2">⚠️</span></div> <div class="empty-rings svelte-10hxdp2"></div></div> <h3 class="empty-title svelte-10hxdp2">트리 데이터를 불러올 수 없습니다</h3> <p class="empty-desc svelte-10hxdp2">에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.</p> <div class="empty-actions svelte-10hxdp2"><!> <!></div></div>'),la=c('<div class="tree-edit-mode svelte-10hxdp2"><div class="edit-header svelte-10hxdp2"><div class="header-left svelte-10hxdp2"><div class="step-badge svelte-10hxdp2"><span class="step-icon svelte-10hxdp2">🌳</span> <span class="step-text svelte-10hxdp2">5단계</span></div> <div class="header-info svelte-10hxdp2"><h2 class="header-title svelte-10hxdp2">에피소드 트리 편집</h2> <p class="header-desc svelte-10hxdp2">스토리 분기를 검토하고 필요하면 수정하세요</p></div></div> <div class="header-right svelte-10hxdp2"><div class="episode-indicator svelte-10hxdp2"><span class="episode-label svelte-10hxdp2">에피소드</span> <span class="episode-current svelte-10hxdp2"> </span> <span class="episode-divider svelte-10hxdp2">/</span> <span class="episode-total svelte-10hxdp2"> </span></div></div></div> <!></div>'),na=c('<div class="particle svelte-10hxdp2"></div>'),da=c('<p class="progress-message svelte-10hxdp2"> </p>'),ca=c('<span class="dot-icon svelte-10hxdp2">✓</span>'),va=c('<span class="dot-spinner svelte-10hxdp2"></span>'),ua=c('<span class="dot-number svelte-10hxdp2"></span>'),pa=c("<div><!></div>"),ga=c('<div class="generating-mode svelte-10hxdp2"><div class="gen-visual svelte-10hxdp2"><div class="gen-animation svelte-10hxdp2"><div class="gen-core svelte-10hxdp2"><span class="gen-emoji svelte-10hxdp2">🚀</span></div> <div class="gen-orbit orbit-1 svelte-10hxdp2"></div> <div class="gen-orbit orbit-2 svelte-10hxdp2"></div> <div class="gen-orbit orbit-3 svelte-10hxdp2"></div> <div class="gen-particles svelte-10hxdp2"></div></div> <div class="gen-status svelte-10hxdp2"><h2 class="gen-title svelte-10hxdp2">AI가 스토리를 생성하고 있습니다 <span class="gen-dots svelte-10hxdp2"><span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span></span></h2> <p class="gen-subtitle svelte-10hxdp2"> </p></div></div> <div class="gen-progress-card svelte-10hxdp2"><div class="progress-header svelte-10hxdp2"><span class="progress-label svelte-10hxdp2">전체 진행률</span> <span class="progress-value svelte-10hxdp2"> </span></div> <div class="progress-bar-container svelte-10hxdp2"><div class="progress-bar-fill svelte-10hxdp2"></div> <div class="progress-bar-active svelte-10hxdp2"></div></div> <!> <div class="episode-grid svelte-10hxdp2"></div> <p class="progress-hint svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">⏱️</span> 예상 소요 시간: 약 1-2분</p></div></div>'),ma=c('<div class="error-toast svelte-10hxdp2"><span class="error-icon svelte-10hxdp2">❌</span> <span class="error-text svelte-10hxdp2"> </span></div>'),fa=c('<div class="step5-container svelte-10hxdp2"><!> <!></div>');function ha(we,d){rr(d,!1);let l=u(d,"treeEditMode",8,!1),g=u(d,"currentEpisodeTree",8,null),h=u(d,"selectedNode",8,null),_=u(d,"regenerating",8,!1),O=u(d,"currentEpisodeTitle",8,""),G=u(d,"currentEpisode",8,1),ae=u(d,"actualTotalEpisodes",8,0),ue=u(d,"generating",8,!1),W=u(d,"progressMessage",8,""),J=u(d,"totalEpisodesGenerated",8,0),q=u(d,"numEpisodes",8,0),de=u(d,"error",8,""),ce=u(d,"maxDepth",8,3),V=u(d,"onSelectNode",8),le=u(d,"onApplyChanges",8),S=u(d,"onCancelSelect",8),T=u(d,"onGenerateNextEpisodeFromTree",8),se=u(d,"onBackToSettings",8);cr();var Y=fa(),K=t(Y);{var y=k=>{var I=la(),A=t(I),m=i(t(A),2),M=t(m),U=i(t(M),2),Z=t(U,!0);r(U);var ie=i(U,4),v=t(ie,!0);r(ie),r(M),r(m),r(A);var z=i(A,2);{var f=ge=>{var $=sa(),H=Ee($),p=t(H),E=t(p),P=i(t(E),2),D=t(P),ee=t(D);{var F=Ce=>{var Ie=ze();R(()=>b(Ie,`📖 ${O()??""}`)),n(Ce,Ie)};w(ee,Ce=>{O()&&Ce(F)})}r(D),r(P),r(E);var L=i(E,2),re=t(L);{let Ce=xr(()=>(ne(h()),oe(()=>{var Ie;return((Ie=h())==null?void 0:Ie.id)||""})));Yt(re,{get rootNode(){return g()},get selectedNodeId(){return e(Ce)},get maxDepth(){return ce()},episodeTitle:"",get onselectnode(){return V()}})}r(L),r(p);var me=i(p,2),X=t(me);ra(X,{get node(){return h()},get isLoading(){return _()},get episodeTitle(){return O()},get episodeOrder(){return G()},get onapplychanges(){return le()},get oncancel(){return S()}}),r(me),r(H);var xe=i(H,2),ke=i(t(xe),2),fe=t(ke);{let Ce=xr(()=>ue()||_());Xe(fe,{variant:"outline",get onclick(){return se()},get disabled(){return e(Ce)},children:(Ie,De)=>{Ue();var Pe=ze("← 설정으로");n(Ie,Pe)},$$slots:{default:!0}})}var Te=i(fe,2);{let Ce=xr(()=>ue()||_());Xe(Te,{onclick:()=>{confirm("현재 에피소드를 확정하고 다음으로 진행하시겠습니까?")&&T()()},get disabled(){return e(Ce)},children:(Ie,De)=>{var Pe=Ge(),gr=Ee(Pe);{var mr=We=>{var he=ta();Ue(),n(We,he)},fr=We=>{var he=aa();Ue(),n(We,he)};w(gr,We=>{G()>=ae()?We(mr):We(fr,!1)})}n(Ie,Pe)},$$slots:{default:!0}})}r(ke),r(xe),n(ge,$)},be=ge=>{var $=oa(),H=i(t($),6),p=t(H);{let P=xr(()=>ue()||_());Xe(p,{onclick:()=>{confirm("현재 에피소드를 건너뛰고 다음을 생성하시겠습니까?")&&T()()},get disabled(){return e(P)},children:(D,ee)=>{var F=ia();Ue(),n(D,F)},$$slots:{default:!0}})}var E=i(p,2);Xe(E,{variant:"outline",get onclick(){return se()},children:(P,D)=>{Ue();var ee=ze("← 설정으로 돌아가기");n(P,ee)},$$slots:{default:!0}}),r(H),r($),n(ge,$)};w(z,ge=>{g()?ge(f):ge(be,!1)})}r(I),R(()=>{b(Z,G()),b(v,ae())}),n(k,I)},N=k=>{var I=ga(),A=t(I),m=t(A),M=i(t(m),8);Ve(M,4,()=>Array(8),He,(D,ee,F)=>{var L=na();dr(L,`--delay: ${F*.15}s; --angle: ${F*45}deg`),n(D,L)}),r(M),r(m);var U=i(m,2),Z=i(t(U),2),ie=t(Z);r(Z),r(U),r(A);var v=i(A,2),z=t(v),f=i(t(z),2),be=t(f);r(f),r(z);var ge=i(z,2),$=t(ge),H=i($,2);r(ge);var p=i(ge,2);{var E=D=>{var ee=da(),F=t(ee,!0);r(ee),R(()=>b(F,W())),n(D,ee)};w(p,D=>{W()&&D(E)})}var P=i(p,2);Ve(P,5,()=>(ne(ae()),ne(q()),oe(()=>Array(ae()||q()))),He,(D,ee,F)=>{var L=pa();let re;var me=t(L);{var X=ke=>{var fe=ca();n(ke,fe)},xe=ke=>{var fe=Ge(),Te=Ee(fe);{var Ce=De=>{var Pe=va();n(De,Pe)},Ie=De=>{var Pe=ua();Pe.textContent=F+1,n(De,Pe)};w(Te,De=>{F===J()&&ue()?De(Ce):De(Ie,!1)},!0)}n(ke,fe)};w(me,ke=>{F<J()?ke(X):ke(xe,!1)})}r(L),R(()=>re=Le(L,1,"episode-dot svelte-10hxdp2",null,re,{completed:F<J(),active:F===J()&&ue(),pending:F>J()})),n(D,L)}),r(P),Ue(2),r(v),r(I),R(()=>{b(ie,`에피소드 ${G()??""} 생성 중`),b(be,`${G()??""} / ${(ae()||q())??""}`),dr($,`width: ${(G()-1)/(ae()||q())*100}%`),dr(H,`left: ${(G()-1)/(ae()||q())*100}%`)}),n(k,I)};w(K,k=>{l()?k(y):k(N,!1)})}var C=i(K,2);{var Q=k=>{var I=ma(),A=i(t(I),2),m=t(A,!0);r(A),r(I),R(()=>b(m,de())),n(k,I)};w(C,k=>{de()&&k(Q)})}r(Y),n(we,Y),tr()}var ba=c('<p class="progress-message"> </p>'),xa=c("<div><!></div>"),_a=c('<p class="error-line"> </p>'),ya=c('<div class="error-state"><div class="error-icon">❌</div> <h3 class="error-title">생성 실패</h3> <div class="error-detail"></div> <div class="error-actions"><!> <!></div></div>'),wa=c('<div class="content-card"><div class="card-header"><h2 class="card-title">6단계: 에피소드 생성 중</h2> <p class="card-desc">AI가 스토리와 디테일을 생성하고 있습니다...</p></div> <div class="card-body"><div class="generating-state"><div class="spinner"></div> <div class="progress-info"><div class="episode-progress"><span class="episode-label">에피소드 생성</span> <span class="episode-count"> </span></div> <!> <p class="progress-hint">동기 방식으로 생성 중입니다. 약 1-2분 소요됩니다...</p> <div class="episode-list"></div></div></div> <!></div></div>');function ka(we,d){rr(d,!1);let l=u(d,"generating",8,!1),g=u(d,"progressMessage",8,""),h=u(d,"currentEpisode",8,1),_=u(d,"actualTotalEpisodes",8,0),O=u(d,"numEpisodes",8,0),G=u(d,"totalEpisodesGenerated",8,0),ae=u(d,"error",8,""),ue=u(d,"onBackToStep4",8);cr();var W=wa(),J=i(t(W),2),q=t(J),de=i(t(q),2),ce=t(de),V=i(t(ce),2),le=t(V);r(V),r(ce);var S=i(ce,2);{var T=y=>{var N=ba(),C=t(N,!0);r(N),R(()=>b(C,g())),n(y,N)};w(S,y=>{g()&&y(T)})}var se=i(S,4);Ve(se,5,()=>(ne(_()),ne(O()),oe(()=>Array(_()||O()))),He,(y,N,C)=>{var Q=xa();let k;var I=t(Q);{var A=M=>{var U=ze("✓");n(M,U)},m=M=>{var U=Ge(),Z=Ee(U);{var ie=z=>{var f=ze("⏳");n(z,f)},v=z=>{var f=ze();f.nodeValue=C+1,n(z,f)};w(Z,z=>{C===G()&&l()?z(ie):z(v,!1)},!0)}n(M,U)};w(I,M=>{C<G()?M(A):M(m,!1)})}r(Q),R(()=>k=Le(Q,1,"episode-item",null,k,{completed:C<G(),active:C===G()&&l()})),n(y,Q)}),r(se),r(de),r(q);var Y=i(q,2);{var K=y=>{var N=ya(),C=i(t(N),4);Ve(C,5,()=>(ne(ae()),oe(()=>ae().split(`
`))),He,(A,m)=>{var M=_a(),U=t(M,!0);r(M),R(()=>b(U,e(m))),n(A,M)}),r(C);var Q=i(C,2),k=t(Q);Xe(k,{get onclick(){return ue()},children:(A,m)=>{Ue();var M=ze("← 설정 수정");n(A,M)},$$slots:{default:!0}});var I=i(k,2);Xe(I,{variant:"outline",onclick:()=>{alert("콘솔(F12)에서 상세 정보를 확인하세요")},children:(A,m)=>{Ue();var M=ze("🔍 콘솔에서 자세히 보기");n(A,M)},$$slots:{default:!0}}),r(Q),r(N),n(y,N)};w(Y,y=>{ae()&&y(K)})}r(J),r(W),R(()=>b(le,`${h()??""} / ${(_()||O())??""}`)),n(we,W),tr()}var Ea=c('<p class="success-desc"> </p>'),za=c('<div class="success-state"><div class="success-icon">✨</div> <h3 class="success-title"> </h3> <!> <div class="story-stats"><div class="stat-item"><span class="stat-label">총 에피소드</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">총 노드</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">게이지 수</span> <span class="stat-value"> </span></div> <div class="stat-item"><span class="stat-label">생성일</span> <span class="stat-value"> </span></div></div> <div class="action-buttons"><!> <!></div></div>'),Ta=c('<div class="content-card"><div class="card-header"><h2 class="card-title">7단계: 생성 완료</h2> <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p></div> <div class="card-body"><!></div></div>');function Ca(we,d){rr(d,!1);let l=u(d,"metadata",8,null),g=u(d,"storyDataId",8,null),h=u(d,"startPlaying",8),_=u(d,"createNew",8);cr();var O=Ta(),G=i(t(O),2),ae=t(G);{var ue=W=>{var J=za(),q=i(t(J),2),de=t(q,!0);r(q);var ce=i(q,2);{var V=Z=>{var ie=Ea(),v=t(ie,!0);r(ie),R(()=>b(v,(ne(l()),oe(()=>l().description)))),n(Z,ie)};w(ce,Z=>{ne(l()),oe(()=>l().description)&&Z(V)})}var le=i(ce,2),S=t(le),T=i(t(S),2),se=t(T);r(T),r(S);var Y=i(S,2),K=i(t(Y),2),y=t(K);r(K),r(Y);var N=i(Y,2),C=i(t(N),2),Q=t(C);r(C),r(N);var k=i(N,2),I=i(t(k),2),A=t(I,!0);r(I),r(k),r(le);var m=i(le,2),M=t(m);Xe(M,{size:"lg",get onclick(){return h()},children:(Z,ie)=>{Ue();var v=ze("🎮 지금 플레이하기");n(Z,v)},$$slots:{default:!0}});var U=i(M,2);Xe(U,{size:"lg",variant:"outline",get onclick(){return _()},children:(Z,ie)=>{Ue();var v=ze("➕ 새로 만들기");n(Z,v)},$$slots:{default:!0}}),r(m),r(J),R(Z=>{b(de,(ne(l()),oe(()=>l().title))),b(se,`${ne(l()),oe(()=>l().totalEpisodes)??""}화`),b(y,`${ne(l()),oe(()=>l().totalNodes)??""}개`),b(Q,`${ne(l()),oe(()=>l().totalGauges)??""}개`),b(A,Z)},[()=>(ne(l()),oe(()=>new Date(l().createdAt).toLocaleDateString("ko-KR")))]),n(W,J)};w(ae,W=>{l()&&g()&&W(ue)})}r(G),r(O),n(we,O),tr()}var Sa=c(`<style>.wizard-page {
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
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 2rem;
    align-items: start;
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
      grid-template-columns: 1fr;
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
  }</style>`),Ga=c("<div></div>"),Ia=c('<div class="step-wrapper"><div class="step-item"><div><!></div> <div class="step-info"><div> </div> <div> </div></div></div> <!></div>'),Aa=c('<div class="character-aliases"> </div>'),Ma=c('<button type="button"><div class="character-avatar"> </div> <div class="character-details"><div class="character-name"> </div> <!> <div> </div> <div class="character-toggle"> </div></div></button>'),Da=c('<div class="wizard-page"><div class="wizard-container"><div class="wizard-header"><h1 class="wizard-title">인터랙티브 스토리 생성</h1> <p class="wizard-subtitle">소설을 입력하면 AI가 자동으로 인터랙티브 게임으로 변환합니다</p></div> <div class="progress-bar-container"><div class="steps-container"></div></div> <div class="step-content"><!></div> <div class="navigation"><!> <div class="step-indicator"> </div> <!></div></div></div>');function qa(we,d){rr(d,!0);let l=j(1),g=j(""),h=j(""),_=j(""),O=j(""),G=j(null),ae=j(0),ue=j(!1),W=j(""),J=j(ur([])),q=j(ur(new Set)),de=j(!1),ce=j(ur([])),V=j(ur([])),le=j(!1),S=j(!1),T=j(""),se=j(ur({happy:2,tragic:1,neutral:1,open:1,bad:0})),Y=j(5),K=j(3),y=j(3),N=j(!1),C=j(!1),Q=j(""),k=j(1),I=j(0),A=j(0),m=j(null),M=j(""),U=j(null),Z=j(!1),ie=j(!1),v=j(null),z=j(null),f=j("");const be="wizard-state";function ge(){try{const o={currentStep:e(l),storyId:e(g),title:e(h),description:e(T),genre:e(O),summary:e(W),characters:e(J).map(s=>({...s})),selectedGaugeIds:[...e(V)],endingConfig:{...e(se)},numEpisodes:e(Y),maxDepth:e(K),numEpisodeEndings:e(y),currentEpisode:e(k),totalEpisodesGenerated:e(I),actualTotalEpisodes:e(A),currentEpisodeTitle:e(M),storyDataId:e(v),metadata:e(z),treeEditMode:e(ie),currentEpisodeTree:e(m)?JSON.parse(JSON.stringify(e(m))):null,proposedGauges:e(ce).map(s=>({...s}))};sessionStorage.setItem(be,JSON.stringify(o))}catch(o){console.warn("상태 저장 실패:",o)}}function $(){try{const o=sessionStorage.getItem(be);if(!o)return;const s=JSON.parse(o);s.currentStep&&a(l,s.currentStep,!0),s.storyId&&a(g,s.storyId,!0),s.title&&a(h,s.title,!0),s.description&&a(T,s.description,!0),s.genre&&a(O,s.genre,!0),s.summary&&a(W,s.summary,!0),s.characters&&a(J,s.characters,!0),s.selectedGaugeIds&&a(V,s.selectedGaugeIds,!0),s.endingConfig&&a(se,s.endingConfig,!0),s.numEpisodes&&a(Y,s.numEpisodes,!0),s.maxDepth&&a(K,s.maxDepth,!0),s.numEpisodeEndings&&a(y,s.numEpisodeEndings,!0),s.currentEpisode&&a(k,s.currentEpisode,!0),s.totalEpisodesGenerated&&a(I,s.totalEpisodesGenerated,!0),s.actualTotalEpisodes&&a(A,s.actualTotalEpisodes,!0),s.currentEpisodeTitle&&a(M,s.currentEpisodeTitle,!0),s.storyDataId&&a(v,s.storyDataId,!0),s.metadata&&a(z,s.metadata,!0),s.treeEditMode!==void 0&&a(ie,s.treeEditMode,!0),s.currentEpisodeTree&&a(m,s.currentEpisodeTree,!0),s.proposedGauges&&a(ce,s.proposedGauges,!0)}catch(o){console.warn("상태 복원 실패:",o)}}Or(()=>{e(l),e(g),e(h),e(T),e(W),e(J).length,e(V).length,e(Y),e(K),e(k),e(v),e(ie),e(m),e(ce).length;const o=setTimeout(()=>{ge()},100);return()=>clearTimeout(o)}),Hr(()=>{if(!Ye.auth.isAuthenticated()){alert("로그인이 필요합니다."),Br("/login");return}localStorage.removeItem(be),$();const o=()=>{ge()};return window.addEventListener("beforeunload",o),()=>{window.removeEventListener("beforeunload",o),ge()}});const H=[{number:1,title:"소설 텍스트",desc:"전문 입력"},{number:2,title:"등장인물",desc:"자동 추출"},{number:3,title:"게이지",desc:"5개 → 2개 선택"},{number:4,title:"엔딩",desc:"예상 엔딩 설계"},{number:5,title:"트리 편집",desc:"노드 수정/검토"},{number:6,title:"에피소드 생성",desc:"순차 생성"},{number:7,title:"완료",desc:"체크/등록"}];function p(){switch(e(l)){case 1:return e(G)!==null&&e(h).length>0;case 2:return e(J).length>0&&e(W).length>0;case 3:return e(V).length===2;case 4:return!0;case 5:case 6:return!1;case 7:return e(v)!==null;default:return!1}}function E(o){a(h,o,!0)}function P(o){a(T,o,!0)}function D(o){a(O,o,!0)}function ee(){a(G,null)}function F(o){e(V).includes(o)?a(V,e(V).filter(s=>s!==o),!0):e(V).length<2?a(V,[...e(V),o],!0):a(V,[e(V)[1],o],!0)}function L(o){const s=new Set(e(q));s.has(o)?s.delete(o):s.add(o),a(q,s,!0)}function re(o,s=140){return o?o.length>s?o.slice(0,s)+"…":o:""}function me(o,s){a(se,{...e(se),[o]:s},!0)}function X(o){a(Y,o,!0)}function xe(o){a(K,o,!0)}async function ke(){var o;if(console.log("uploadNovel 호출됨"),console.log("canGoNext:",p()),console.log("title:",e(h)),console.log("uploadedFile:",e(G)),console.log("novelText length:",e(_).length),!p()){alert("제목과 소설 파일을 입력해주세요");return}a(ue,!0),a(ae,0),a(f,"");try{let s;if(e(G)){console.log("S3 업로드 방식 사용...");const x=await Ye.upload.uploadStoryFile(e(G),te=>{a(ae,te,!0),console.log(`업로드 진행률: ${te.toFixed(1)}%`)});console.log("S3 업로드 완료, fileKey:",x),s=await Ye.story.uploadNovelFromS3({title:e(h),description:e(T),fileKey:x})}else throw new Error("파일을 선택해주세요");if(console.log("업로드 성공:",s),s.status==="FAILED")throw new Error("파일 분석에 실패했습니다. 파일 형식이나 내용을 확인해주세요.");a(g,s.storyId,!0),a(l,2),fe()}catch(s){console.error("업로드 실패:",s),s instanceof $e?(a(f,((o=s.data)==null?void 0:o.message)||"소설 업로드에 실패했습니다.",!0),alert("업로드 실패: "+e(f))):(a(f,"네트워크 오류가 발생했습니다."),alert("네트워크 오류: "+s.message))}finally{a(ue,!1),a(ae,0)}}async function fe(){a(de,!0);try{const o=async()=>{var x;const s=await Ye.story.getProgress(e(g));if(s.status==="CHARACTERS_READY"||s.status==="GAUGES_READY"){const[te,ve]=await Promise.all([Ye.story.getSummary(e(g)),Ye.story.getCharacters(e(g))]);a(W,te.summary,!0),a(J,ve.characters,!0),a(de,!1)}else if(s.status==="FAILED"){const te=((x=s.progress)==null?void 0:x.error)||"분석에 실패했습니다";throw console.error("분석 실패 상세:",s),new Error(`파일 분석 실패: ${te}

파일 형식이나 내용을 확인해주세요.`)}else setTimeout(()=>o(),3e3)};await o()}catch(o){console.error("분석 데이터 로드 실패:",o),a(f,o.message||"분석에 실패했습니다.",!0),a(de,!1)}}async function Te(){console.log("nextStep 호출됨, currentStep:",e(l));try{e(l)===1?(console.log("1단계: uploadNovel 호출"),await ke()):e(l)===2?(console.log("2단계: 게이지 로드"),a(l,3),await Ce()):e(l)===3?(console.log("3단계: 게이지 선택 제출"),await Ie()):e(l)===4?(console.log("4단계: 설정 제출 & 생성 시작"),await De()):p()&&(console.log("일반 다음 단계"),Ar(l))}catch(o){console.error("nextStep 에러:",o),alert("에러 발생: "+o)}}async function Ce(){var o;a(le,!0),a(f,"");try{const s=await Ye.story.getGauges(e(g));a(ce,s.gauges,!0)}catch(s){console.error("게이지 로드 실패:",s),s instanceof $e?a(f,((o=s.data)==null?void 0:o.message)||"게이지 로드에 실패했습니다.",!0):a(f,"네트워크 오류가 발생했습니다.")}finally{a(le,!1)}}async function Ie(){var o;if(e(V).length!==2){alert("게이지를 정확히 2개 선택해주세요.");return}a(S,!0),a(f,"");try{await Ye.story.selectGauges(e(g),{selectedGaugeIds:e(V)}),a(l,4)}catch(s){console.error("게이지 선택 실패:",s),s instanceof $e?a(f,((o=s.data)==null?void 0:o.message)||"게이지 선택에 실패했습니다.",!0):a(f,"네트워크 오류가 발생했습니다.")}finally{a(S,!1)}}async function De(){var o,s;a(N,!0),a(C,!0),a(f,""),a(k,1),a(I,0),a(A,e(Y),!0),a(l,5),a(Q,"에피소드 1 생성 중... (약 1-2분 소요)");try{await Ye.story.configureStory(e(g),{description:e(T),numEpisodes:e(Y),maxDepth:e(K),endingConfig:e(se),numEpisodeEndings:e(y)}),console.log("EP1 생성 시작 (동기 방식)..."),console.log("StoryId:",e(g));const x=await Ye.story.startEpisodeGeneration(e(g));console.log("EP1 생성 완료:",x),console.log("EpisodeData 구조:",{hasNodes:!!x.nodes,nodesLength:((o=x.nodes)==null?void 0:o.length)||0,title:x.title,order:x.order,keys:Object.keys(x)}),x.nodes&&x.nodes.length>0&&console.log("첫 번째 노드:",x.nodes[0]),_r(x)}catch(x){console.error("생성 실패:",x),x instanceof $e?(a(f,((s=x.data)==null?void 0:s.message)||x.message||"스토리 생성에 실패했습니다.",!0),console.error("API 에러 상세:",{status:x.status,data:x.data,message:x.message})):(a(f,x.message||"네트워크 오류가 발생했습니다.",!0),console.error("일반 에러:",x)),a(C,!1),a(l,4)}finally{a(N,!1)}}async function Pe(){let s=0;const x=async()=>{var te,ve;try{s++,console.log(`결과 조회 시도 ${s}/5... storyId:`,e(g));const B=await Ye.story.getResult(e(g));console.log("✅ 결과 조회 성공:",B),a(v,B.storyDataId,!0),a(z,B.metadata,!0),a(l,7),a(C,!1),alert("🎉 스토리 생성이 완료되었습니다!")}catch(B){console.error(`결과 조회 실패 (${s}/5):`,B),s<5?(console.log("⏳ 5초 후 다시 시도..."),await new Promise(_e=>setTimeout(_e,5e3)),await x()):(console.error("=== 최종 에러 정보 ==="),console.error("storyId:",e(g)),console.error("에러 객체:",B),B instanceof $e&&(console.error("API Error Status:",B.status),console.error("API Error Data:",B.data)),B instanceof $e&&B.status===404?a(f,`❌ 스토리를 찾을 수 없습니다 (404)

storyId: ${e(g)}
백엔드에서 생성은 완료되었지만 결과를 저장하지 못했을 수 있습니다.

백엔드 콘솔 로그를 확인해주세요.`):B instanceof $e&&B.status===500?a(f,`❌ 백엔드 서버 내부 오류 (500)

storyId: ${e(g)}
에러 메시지: ${((te=B.data)==null?void 0:te.message)||B.message}

백엔드 콘솔에서 다음을 확인하세요:
1. Exception 스택 트레이스
2. /api/stories/\${storyId}/result 관련 로그
3. 데이터베이스 연결 상태
4. AI 서버 응답 데이터`):B instanceof $e?a(f,`❌ API 에러 (${B.status})

storyId: ${e(g)}
메시지: ${((ve=B.data)==null?void 0:ve.message)||B.message}`):a(f,`❌ 네트워크 오류

storyId: ${e(g)}
메시지: ${B.message}`),a(C,!1))}};await x()}function gr(){e(l)>1&&Ar(l,-1)}async function mr(o){var _e,pe;const s=o.target,x=(_e=s.files)==null?void 0:_e[0];if(!x)return;const te=[".txt",".pdf",".doc",".docx"],ve="."+((pe=x.name.split(".").pop())==null?void 0:pe.toLowerCase());if(!te.includes(ve)){alert("지원하는 파일 형식: .txt, .pdf, .doc, .docx"),s.value="";return}const B=10*1024*1024;if(x.size>B){alert("파일 크기는 10MB 이하여야 합니다."),s.value="";return}try{a(G,x,!0),a(_,""),e(h)||a(h,x.name.replace(/\.(txt|pdf|doc|docx)$/i,""),!0),console.log("파일 선택됨:",x.name,`(${(x.size/1024).toFixed(1)} KB)`)}catch(Se){console.error("파일 처리 실패:",Se),a(f,"파일을 처리할 수 없습니다."),a(G,null)}}function fr(){e(v)&&Br(`/play/${e(v)}`)}function We(o){var s;a(U,o.detail.node,!0),console.log("노드 선택됨:",(s=e(U))==null?void 0:s.id)}async function he(o){var ve,B,_e;if(!e(U)||!e(m))return;const{nodeId:s,newText:x,newChoices:te}=o.detail;a(Z,!0),a(f,"");try{console.log("서브트리 재생성 요청:",{nodeId:s,newText:x});const pe=await Ye.story.regenerateSubtree(e(g),e(k),s,{nodeText:x,choices:te.map(Se=>Se.text),situation:((ve=e(U).details)==null?void 0:ve.situation)||"",npcEmotions:((B=e(U).details)==null?void 0:B.npc_emotions)||{},tags:te.flatMap(Se=>Se.tags)});console.log("서브트리 재생성 완료:",pe.totalNodesRegenerated,"개 노드"),Ae(s,pe.regeneratedNodes),a(U,null),alert(`✅ 서브트리 재생성 완료! ${pe.totalNodesRegenerated}개 노드가 업데이트되었습니다.`)}catch(pe){console.error("서브트리 재생성 실패:",pe),pe instanceof $e?a(f,((_e=pe.data)==null?void 0:_e.message)||"서브트리 재생성에 실패했습니다.",!0):a(f,pe.message||"서브트리 재생성에 실패했습니다.",!0),alert("❌ 서브트리 재생성 실패: "+e(f))}finally{a(Z,!1)}}function Ae(o,s){if(!e(m)||s.length===0)return;function x(te){return te.id===o?je(s[0]):(te.children&&te.children.length>0&&(te.children=te.children.map(ve=>x(ve))),te)}a(m,x({...e(m)}),!0)}function je(o){if(!o)return console.warn("convertToTreeNode: apiNode is null or undefined"),{id:"unknown",text:"Unknown node",depth:0,choices:[],children:[]};const s={id:o.id||o.nodeId||String(Math.random()),text:o.text||"No text",depth:o.depth??0,choices:[],children:[],details:{}};return o.choices&&Array.isArray(o.choices)&&(s.choices=o.choices.map(x=>({text:x.text||"",tags:x.tags||[]}))),o.details?s.details={situation:o.details.situation,npc_emotions:o.details.npc_emotions||o.details.npcEmotions||{},relations_update:o.details.relations_update||o.details.relationsUpdate||{}}:s.details={situation:o.situation,npc_emotions:o.npc_emotions||o.npcEmotions||{},relations_update:o.relations_update||o.relationsUpdate||{}},o.children&&Array.isArray(o.children)&&o.children.length>0&&(s.children=o.children.map(x=>je(x))),s}async function hr(){var o;if(a(I,e(k),!0),e(I)>=e(A)){console.log("🎉 모든 에피소드 생성 완료!"),await Pe();return}a(C,!0),a(ie,!1),a(f,""),Ar(k),a(Q,`에피소드 ${e(k)}/${e(A)} 생성 중... (약 1-2분 소요)`);try{console.log(`EP${e(k)} 생성 시작 (동기 방식)...`);const s=await Ye.story.generateNextEpisode(e(g));console.log(`EP${e(k)} 생성 완료:`,s),_r(s)}catch(s){console.error("다음 에피소드 생성 실패:",s),s instanceof $e?a(f,((o=s.data)==null?void 0:o.message)||"다음 에피소드 생성에 실패했습니다.",!0):a(f,s.message||"네트워크 오류가 발생했습니다.",!0),a(C,!1)}}function _r(o){if(console.log("트리 편집 모드 진입:",o),o.nodes&&o.nodes.length>0){const s=o.nodes[0];if(a(m,je(s),!0),o.nodes.length>1){let te=function(ve){const B=je(ve);if(ve.children&&Array.isArray(ve.children))B.children=ve.children.map(_e=>te(_e));else{const _e=o.nodes.filter(pe=>(pe.parent_id||pe.parentId)===(ve.id||ve.nodeId));_e.length>0&&(B.children=_e.map(pe=>te(pe)))}return B};const x=new Map;o.nodes.forEach(ve=>{x.set(ve.id||ve.nodeId,ve)}),a(m,te(s),!0)}}else o.startNode?a(m,je(o.startNode),!0):(console.warn("에피소드 데이터에 노드가 없습니다:",o),a(m,null));a(M,o.title||`에피소드 ${e(k)}`,!0),a(ie,!0),a(l,5),a(C,!1),a(U,null),console.log("트리 편집 모드 설정 완료:",{title:e(M),hasTree:e(m)!==null,treeNodeCount:e(m)?vr(e(m)):0})}function vr(o){let s=1;return o.children&&o.children.forEach(x=>{s+=vr(x)}),s}function Er(){a(l,1),a(g,""),a(h,""),a(_,""),a(G,null),a(ae,0),a(T,""),a(O,""),a(W,""),a(J,[],!0),a(ce,[],!0),a(V,[],!0),a(se,{happy:2,tragic:1,neutral:1,open:1,bad:0},!0),a(Y,5),a(K,3),a(y,3),a(v,null),a(z,null),a(f,""),a(Q,""),a(k,1),a(I,0),a(A,0),a(m,null),a(M,""),a(U,null),a(Z,!1),a(ie,!1)}var zr=Da();lt("jma69v",o=>{var s=Sa();n(o,s)});var Mr=t(zr),Tr=i(t(Mr),2),Dr=t(Tr);Ve(Dr,21,()=>H,He,(o,s,x)=>{var te=Ia(),ve=t(te),B=t(ve);let _e;var pe=t(B);{var Se=Fe=>{var Ne=ze("✓");n(Fe,Ne)},or=Fe=>{var Ne=ze();R(()=>b(Ne,e(s).number)),n(Fe,Ne)};w(pe,Fe=>{e(l)>e(s).number?Fe(Se):Fe(or,!1)})}r(B);var Be=i(B,2),ye=t(Be);let Me;var Ke=t(ye,!0);r(ye);var qe=i(ye,2);let Oe;var ar=t(qe,!0);r(qe),r(Be),r(ve);var Re=i(ve,2);{var Ze=Fe=>{var Ne=Ga();let Qe;R(()=>Qe=Le(Ne,1,"step-connector",null,Qe,{completed:e(l)>e(s).number,active:e(l)===e(s).number||e(l)===e(s).number+1})),n(Fe,Ne)};w(Re,Fe=>{x<H.length-1&&Fe(Ze)})}r(te),R(()=>{_e=Le(B,1,"step-circle",null,_e,{active:e(l)===e(s).number,completed:e(l)>e(s).number}),Me=Le(ye,1,"step-title",null,Me,{"active-title":e(l)===e(s).number,"completed-title":e(l)>e(s).number}),b(Ke,e(s).title),Oe=Le(qe,1,"step-desc",null,Oe,{"active-desc":e(l)===e(s).number,"completed-desc":e(l)>e(s).number}),b(ar,e(s).desc)}),n(o,te)}),r(Dr),r(Tr);var Cr=i(Tr,2),Yr=t(Cr);{var Ur=o=>{{let s=kr(p);bt(o,{get title(){return e(h)},get description(){return e(T)},get genre(){return e(O)},get uploadedFile(){return e(G)},get uploading(){return e(ue)},get uploadProgress(){return e(ae)},get canGoNext(){return e(s)},get error(){return e(f)},onTitleChange:E,onDescriptionChange:P,onGenreChange:D,onFileChange:mr,onRemoveFile:ee})}},Kr=o=>{var s=Ge(),x=Ee(s);{var te=B=>{kt(B,{get loadingAnalysis(){return e(de)},get summary(){return e(W)},get characters(){return e(J)},children:(_e,pe)=>{var Se=Ge(),or=Ee(Se);Ve(or,17,()=>e(J),He,(Be,ye)=>{var Me=Ma();let Ke;Me.__click=()=>L(e(ye).name);var qe=t(Me),Oe=t(qe,!0);r(qe);var ar=i(qe,2),Re=t(ar),Ze=t(Re,!0);r(Re);var Fe=i(Re,2);{var Ne=ir=>{var lr=Aa(),br=t(lr);r(lr),R(nr=>b(br,`별칭: ${nr??""}`),[()=>e(ye).aliases.join(", ")]),n(ir,lr)};w(Fe,ir=>{e(ye).aliases&&e(ye).aliases.length>0&&ir(Ne)})}var Qe=i(Fe,2);let yr;var Gr=t(Qe,!0);r(Qe);var wr=i(Qe,2),sr=t(wr,!0);r(wr),r(ar),r(Me),R((ir,lr,br,nr,Jr)=>{Ke=Le(Me,1,"character-card",null,Ke,ir),b(Oe,lr),b(Ze,e(ye).name),yr=Le(Qe,1,"character-description",null,yr,br),b(Gr,nr),b(sr,Jr)},[()=>({expanded:e(q).has(e(ye).name)}),()=>e(ye).name.charAt(0),()=>({expanded:e(q).has(e(ye).name)}),()=>e(q).has(e(ye).name)?e(ye).description:re(e(ye).description,140),()=>e(q).has(e(ye).name)?"접기":"더보기"]),n(Be,Me)}),n(_e,Se)},$$slots:{default:!0}})},ve=B=>{var _e=Ge(),pe=Ee(_e);{var Se=Be=>{It(Be,{get proposedGauges(){return e(ce)},get selectedGaugeIds(){return e(V)},get loadingGauges(){return e(le)},get selectingGauges(){return e(S)},toggleGauge:F})},or=Be=>{var ye=Ge(),Me=Ee(ye);{var Ke=Oe=>{Mt(Oe,{get endingConfig(){return e(se)},get numEpisodes(){return e(Y)},get maxDepth(){return e(K)},onEndingChange:me,onNumEpisodesChange:X,onMaxDepthChange:xe})},qe=Oe=>{var ar=Ge(),Re=Ee(ar);{var Ze=Ne=>{ha(Ne,{get treeEditMode(){return e(ie)},get currentEpisodeTree(){return e(m)},get selectedNode(){return e(U)},get regenerating(){return e(Z)},get currentEpisodeTitle(){return e(M)},get currentEpisode(){return e(k)},get actualTotalEpisodes(){return e(A)},get generating(){return e(C)},get progressMessage(){return e(Q)},get totalEpisodesGenerated(){return e(I)},get numEpisodes(){return e(Y)},get error(){return e(f)},get maxDepth(){return e(K)},onSelectNode:We,onApplyChanges:he,onCancelSelect:()=>{a(U,null)},onGenerateNextEpisodeFromTree:hr,onBackToSettings:()=>{a(l,4),a(f,"")}})},Fe=Ne=>{var Qe=Ge(),yr=Ee(Qe);{var Gr=sr=>{ka(sr,{get generating(){return e(C)},get progressMessage(){return e(Q)},get currentEpisode(){return e(k)},get actualTotalEpisodes(){return e(A)},get numEpisodes(){return e(Y)},get totalEpisodesGenerated(){return e(I)},get error(){return e(f)},onBackToStep4:()=>{a(l,4),a(f,"")}})},wr=sr=>{var ir=Ge(),lr=Ee(ir);{var br=nr=>{Ca(nr,{get metadata(){return e(z)},get storyDataId(){return e(v)},startPlaying:fr,createNew:Er})};w(lr,nr=>{e(l)===7&&nr(br)},!0)}n(sr,ir)};w(yr,sr=>{e(l)===6?sr(Gr):sr(wr,!1)},!0)}n(Ne,Qe)};w(Re,Ne=>{e(l)===5?Ne(Ze):Ne(Fe,!1)},!0)}n(Oe,ar)};w(Me,Oe=>{e(l)===4?Oe(Ke):Oe(qe,!1)},!0)}n(Be,ye)};w(pe,Be=>{e(l)===3?Be(Se):Be(or,!1)},!0)}n(B,_e)};w(x,B=>{e(l)===2?B(te):B(ve,!1)},!0)}n(o,s)};w(Yr,o=>{e(l)===1?o(Ur):o(Kr,!1)})}r(Cr);var Nr=i(Cr,2),Pr=t(Nr);{let o=kr(()=>e(l)===1||e(C));Xe(Pr,{onclick:gr,get disabled(){return e(o)},variant:"outline",size:"lg",children:(s,x)=>{Ue();var te=ze("← 이전");n(s,te)},$$slots:{default:!0}})}var Sr=i(Pr,2),Xr=t(Sr);r(Sr);var qr=i(Sr,2);{let o=kr(()=>!p()||e(l)>=5||e(ue)||e(de)||e(le)||e(S)||e(N)||e(C));Xe(qr,{onclick:async()=>await Te(),get disabled(){return e(o)},size:"lg",children:(s,x)=>{var te=Ge(),ve=Ee(te);{var B=pe=>{var Se=ze();R(()=>b(Se,e(ue)?"업로드 중...":"소설 업로드 →")),n(pe,Se)},_e=pe=>{var Se=Ge(),or=Ee(Se);{var Be=Me=>{var Ke=ze();R(()=>b(Ke,e(S)?"선택 중...":"게이지 선택 →")),n(Me,Ke)},ye=Me=>{var Ke=Ge(),qe=Ee(Ke);{var Oe=Re=>{var Ze=ze();R(()=>b(Ze,e(N)?"시작 중...":"생성 시작 →")),n(Re,Ze)},ar=Re=>{var Ze=ze("다음 →");n(Re,Ze)};w(qe,Re=>{e(l)===4?Re(Oe):Re(ar,!1)},!0)}n(Me,Ke)};w(or,Me=>{e(l)===3?Me(Be):Me(ye,!1)},!0)}n(pe,Se)};w(ve,pe=>{e(l)===1?pe(B):pe(_e,!1)})}n(s,te)},$$slots:{default:!0}})}r(Nr),r(Mr),r(zr),R(()=>b(Xr,`${e(l)??""} / 7 단계`)),n(we,zr),tr()}pr(["click"]);export{qa as component};
