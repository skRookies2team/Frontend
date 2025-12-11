import { b as attr, e as ensure_array_like, a as attr_class, c as attr_style, d as bind_props, f as stringify, g as slot, h as head } from "../../../../chunks/index2.js";
import { B as Button } from "../../../../chunks/button.js";
import { a as api } from "../../../../chunks/index3.js";
import { g as goto } from "../../../../chunks/client.js";
import { X as noop, Y as fallback, V as escape_html } from "../../../../chunks/context.js";
import { A as ApiError } from "../../../../chunks/ai-api.js";
function createEventDispatcher() {
  return noop;
}
function Step1Upload($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let title = fallback($$props["title"], "");
    let description = fallback($$props["description"], "");
    let genre = fallback($$props["genre"], "");
    let uploadedFile = fallback($$props["uploadedFile"], null);
    let uploading = fallback($$props["uploading"], false);
    let uploadProgress = fallback($$props["uploadProgress"], 0);
    let canGoNext = fallback($$props["canGoNext"], false);
    let error = fallback($$props["error"], "");
    let onTitleChange = $$props["onTitleChange"];
    let onDescriptionChange = $$props["onDescriptionChange"];
    let onGenreChange = $$props["onGenreChange"];
    let onFileChange = $$props["onFileChange"];
    let onRemoveFile = $$props["onRemoveFile"];
    const genres = ["고전문학", "SF", "추리", "판타지", "로맨스", "교육"];
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">1단계: 소설 텍스트 입력</h2> <p class="card-desc">인터랙티브 게임으로 만들 소설의 전문을 입력하세요</p></div> <div class="card-body"><div class="section-block"><div class="section-header"><h3 class="section-title">기본 정보</h3> <p class="section-subtitle">소설의 제목과 설명을 입력하세요</p></div> <div class="section-content"><div class="form-row"><div class="form-group form-group-half"><label class="form-label">소설 제목 *</label> <input type="text" class="form-input"${attr("value", title)} placeholder="예: 파리대왕"/></div> <div class="form-group form-group-half"><label class="form-label">설명 (선택)</label> <input type="text" class="form-input"${attr("value", description)} placeholder="소설에 대한 간단한 설명"/></div></div> <div class="form-group"><label class="form-label">장르 선택 (선택)</label> <p class="field-hint">소설의 장르를 선택하세요</p> <div class="genre-grid svelte-c2sxfd"><!--[-->`);
    const each_array = ensure_array_like(genres);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let g = each_array[$$index];
      $$renderer2.push(`<button type="button"${attr_class("genre-button svelte-c2sxfd", void 0, { "selected": genre === g })}${attr("disabled", uploading, true)}>${escape_html(g)}</button>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (genre) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="genre-selected-hint svelte-c2sxfd">선택된 장르: <strong class="svelte-c2sxfd">${escape_html(genre)}</strong></p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div class="section-block"><div class="section-header"><h3 class="section-title">소설 내용 입력</h3> <p class="section-subtitle">파일을 업로드하거나 텍스트를 직접 입력하세요</p></div> <div class="section-content"><div class="input-method-card"><div class="method-header"><label class="form-label">파일 업로드</label> <p class="field-hint">지원 형식: .txt, .pdf, .doc, .docx (최대 10MB)</p></div> <div class="file-upload-wrapper"><label for="file-upload" class="file-upload-button"><span class="file-upload-icon">📁</span> <span class="file-upload-text">파일 선택</span></label> <input id="file-upload" type="file" accept=".txt,.pdf,.doc,.docx" class="file-input-hidden"${attr("disabled", uploading, true)}/></div> `);
    if (uploadedFile) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="file-info"><span class="file-icon">📄</span> <span class="file-name">${escape_html(uploadedFile.name)}</span> <span class="file-size">(${escape_html((uploadedFile.size / 1024).toFixed(1))} KB)</span> <button type="button" class="file-remove"${attr("disabled", uploading, true)}>✕</button></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="error-banner">❌ ${escape_html(error)}</div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (uploading) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="info-banner"><div class="upload-status"><div class="upload-icon">⏳</div> <div class="upload-info">`);
      if (uploadProgress > 0 && uploadProgress < 100) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="upload-text">S3에 파일 업로드 중...</p> <div class="upload-progress-bar"><div class="upload-progress-fill"${attr_style(`width: ${stringify(uploadProgress)}%`)}></div></div> <p class="upload-percentage">${escape_html(uploadProgress.toFixed(1))}%</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (uploadProgress === 100) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p class="upload-text upload-processing"><span class="inline-spinner" aria-hidden="true"></span> 업로드 완료! 분석을 시작합니다...</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<p class="upload-text">소설을 업로드하고 있습니다...</p>`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (canGoNext) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="success-banner">✅ 준비 완료! 소설 업로드 버튼을 클릭하세요</div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      title,
      description,
      genre,
      uploadedFile,
      uploading,
      uploadProgress,
      canGoNext,
      error,
      onTitleChange,
      onDescriptionChange,
      onGenreChange,
      onFileChange,
      onRemoveFile
    });
  });
}
function Step2Characters($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let loadingAnalysis = fallback($$props["loadingAnalysis"], false);
    let summary = fallback($$props["summary"], "");
    let characters = fallback($$props["characters"], () => [], true);
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">2단계: 등장인물 자동 추출</h2> <p class="card-desc">AI가 소설에서 등장인물을 자동으로 추출합니다</p></div> <div class="card-body">`);
    if (loadingAnalysis) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="extracting-state"><div class="spinner"></div> <p class="extracting-text">AI가 소설을 분석하고 있습니다...</p> <p class="extracting-hint">요약과 등장인물을 추출하는 중...</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (characters.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="analysis-results"><div class="analysis-layout">`);
        if (summary) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="summary-section"><h3 class="section-subtitle">소설 요약</h3> <div class="summary-box">${escape_html(summary)}</div></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> <div class="characters-section"><div class="section-subtitle-row"><h3 class="section-subtitle">추출된 등장인물 <span class="count-badge">${escape_html(characters.length)}명</span></h3> <p class="section-hint">카드를 클릭하면 상세가 펼쳐집니다</p></div> <div class="character-list"><!--[-->`);
        slot($$renderer2, $$props, "default", {});
        $$renderer2.push(`<!--]--></div></div></div> <div class="success-banner">✅ 분석 완료! 등장인물 ${escape_html(characters.length)}명 추출</div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { loadingAnalysis, summary, characters });
  });
}
function Step3Gauges($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let proposedGauges = fallback($$props["proposedGauges"], () => [], true);
    let selectedGaugeIds = fallback($$props["selectedGaugeIds"], () => [], true);
    let loadingGauges = fallback($$props["loadingGauges"], false);
    let selectingGauges = fallback($$props["selectingGauges"], false);
    let toggleGauge = $$props["toggleGauge"];
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">3단계: 게이지 선택</h2> <p class="card-desc">스토리에서 사용할 상태 지표를 선택하세요 (최소 2개)</p></div> <div class="card-body">`);
    if (loadingGauges) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="loading-state"><div class="spinner"></div> <p>AI가 소설 주제에 맞는 게이지를 제안하고 있습니다...</p></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      if (proposedGauges.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="form-group"><label class="form-label">AI가 제안한 게이지 (정확히 2개 선택) <span class="required">*</span></label> <p class="field-hint">소설의 주제와 내용에 맞춰 AI가 선택한 5가지 게이지입니다</p> <div class="gauge-grid"><!--[-->`);
        const each_array = ensure_array_like(proposedGauges);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let gauge = each_array[$$index];
          $$renderer2.push(`<button type="button"${attr_class("gauge-option", void 0, { "selected": selectedGaugeIds.includes(gauge.id) })}${attr("disabled", selectingGauges, true)}><div class="gauge-check">`);
          if (selectedGaugeIds.includes(gauge.id)) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`✓`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div> <div class="gauge-info"><div class="gauge-name">${escape_html(gauge.name)}</div> <div class="gauge-desc">${escape_html(gauge.meaning || gauge.description)}</div> `);
          if (gauge.min_label && gauge.max_label) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="gauge-range">${escape_html(gauge.min_label)} ↔ ${escape_html(gauge.max_label)}</div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div></button>`);
        }
        $$renderer2.push(`<!--]--></div> `);
        if (selectedGaugeIds.length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<p${attr_class("selection-count", void 0, { "complete": selectedGaugeIds.length === 2 })}>${escape_html(selectedGaugeIds.length)}/2 선택됨 ${escape_html(selectedGaugeIds.length === 2 ? "✓" : "")}</p>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      proposedGauges,
      selectedGaugeIds,
      loadingGauges,
      selectingGauges,
      toggleGauge
    });
  });
}
function Step4Ending($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let endingConfig = fallback($$props["endingConfig"], () => ({ happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 }), true);
    let numEpisodes = fallback($$props["numEpisodes"], 5);
    let maxDepth = fallback($$props["maxDepth"], 3);
    let onEndingChange = $$props["onEndingChange"];
    let onNumEpisodesChange = $$props["onNumEpisodesChange"];
    let onMaxDepthChange = $$props["onMaxDepthChange"];
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">4단계: 예상 엔딩 설계</h2> <p class="card-desc">스토리에서 생성할 엔딩의 유형과 개수를 설정하세요</p></div> <div class="card-body"><div class="config-layout"><div class="config-main"><div class="form-group"><label class="form-label">엔딩 구성</label> <div class="ending-config"><div class="ending-item"><label>😊 해피 엔딩</label> <input type="number" min="0" max="5"${attr("value", endingConfig.happy)} class="ending-input"/></div> <div class="ending-item"><label>😢 비극 엔딩</label> <input type="number" min="0" max="5"${attr("value", endingConfig.tragic)} class="ending-input"/></div> <div class="ending-item"><label>😐 중립 엔딩</label> <input type="number" min="0" max="5"${attr("value", endingConfig.neutral)} class="ending-input"/></div> <div class="ending-item"><label>🤔 열린 엔딩</label> <input type="number" min="0" max="5"${attr("value", endingConfig.open)} class="ending-input"/></div> <div class="ending-item"><label>💀 배드 엔딩</label> <input type="number" min="0" max="5"${attr("value", endingConfig.bad)} class="ending-input"/></div></div></div> <div class="form-row"><div class="form-group form-group-half"><label class="form-label">에피소드 수 (1-10)</label> <div class="slider-container"><input type="range" min="1" max="10"${attr("value", numEpisodes)} class="slider"/> <span class="slider-value">${escape_html(numEpisodes)}화</span></div></div> <div class="form-group form-group-half"><label class="form-label">분기 깊이 (2-5)</label> <div class="slider-container"><input type="range" min="2" max="5"${attr("value", maxDepth)} class="slider"/> <span class="slider-value">레벨 ${escape_html(maxDepth)}</span></div></div></div></div> <div class="config-sidebar"><div class="info-card"><h3 class="info-title">예상 생성 규모</h3> <ul class="info-list"><li>총 에피소드: <strong>${escape_html(numEpisodes)}화</strong></li> <li>분기 깊이: <strong>레벨 ${escape_html(maxDepth)}</strong></li> <li>예상 노드 수: <strong>약 ${escape_html(Math.pow(2, maxDepth) * numEpisodes)}개</strong></li> <li>총 엔딩 수: <strong>${escape_html(Object.values(endingConfig).reduce((a, b) => a + b, 0))}개</strong></li></ul></div></div></div></div></div>`);
    bind_props($$props, {
      endingConfig,
      numEpisodes,
      maxDepth,
      onEndingChange,
      onNumEpisodesChange,
      onMaxDepthChange
    });
  });
}
function Story_tree($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      rootNode = null,
      selectedNodeId = ""
    } = $$props;
    let isDragging = false;
    function isSelected(nodeId) {
      return selectedNodeId === nodeId;
    }
    function getNodeColor(depth) {
      const colors = [
        "#ff4d4f",
        // depth 0 - 빨강
        "#1890ff",
        // depth 1 - 파랑
        "#52c41a",
        // depth 2 - 초록
        "#faad14",
        // depth 3 - 주황
        "#722ed1"
        // depth 4 - 보라
      ];
      return colors[Math.min(depth, colors.length - 1)];
    }
    function truncateText(text, maxLen = 60) {
      if (!text) return "";
      return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
    }
    let scale = 1;
    $$renderer2.push(`<div class="tree-container svelte-1dd3ufc"><div class="tree-controls svelte-1dd3ufc"><div class="control-hint svelte-1dd3ufc"><span class="hint-icon svelte-1dd3ufc">✋</span> <span class="svelte-1dd3ufc">빈 공간 드래그로 이동</span></div> <div class="control-actions svelte-1dd3ufc"><span class="zoom-label svelte-1dd3ufc">확대: ${escape_html(Math.round(scale * 100))}%</span> <button type="button" class="zoom-btn svelte-1dd3ufc">−</button> <button type="button" class="zoom-btn svelte-1dd3ufc">+</button> <button type="button" class="zoom-btn reset svelte-1dd3ufc">↺</button></div></div> <div${attr_class("tree-scroll-area svelte-1dd3ufc", void 0, { "dragging": isDragging })} role="application" aria-label="스토리 트리 뷰어">`);
    if (rootNode) {
      let renderNode = function($$renderer3, node, isRoot = false) {
        $$renderer3.push(`<div${attr_class("node-branch svelte-1dd3ufc", void 0, { "is-root": isRoot })}><button type="button"${attr_class("node-card svelte-1dd3ufc", void 0, { "selected": isSelected(node.id) })}${attr_style(`--node-color: ${stringify(getNodeColor(node.depth))}`)}><div class="node-badges svelte-1dd3ufc"><span class="depth-badge svelte-1dd3ufc"${attr_style(`background: ${stringify(getNodeColor(node.depth))}`)}>D${escape_html(node.depth)}</span> <span class="id-badge svelte-1dd3ufc">${escape_html(node.id)}</span></div> <div class="node-body svelte-1dd3ufc"><p class="node-text svelte-1dd3ufc">${escape_html(truncateText(node.text))}</p></div> <div class="node-footer svelte-1dd3ufc">`);
        if (node.choices && node.choices.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<span class="choices-badge svelte-1dd3ufc">🎯 ${escape_html(node.choices.length)}</span>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--> `);
        if (node.children && node.children.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<span class="children-badge svelte-1dd3ufc">🌿 ${escape_html(node.children.length)}</span>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div> `);
        if (isSelected(node.id)) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="selected-indicator svelte-1dd3ufc"><span class="svelte-1dd3ufc">✏️ 편집 중</span></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></button> `);
        if (node.children && node.children.length > 0) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`<div class="children-wrapper svelte-1dd3ufc"><div class="connector-vertical svelte-1dd3ufc"></div> <div class="connector-horizontal svelte-1dd3ufc"></div> <div class="children-row svelte-1dd3ufc"><!--[-->`);
          const each_array = ensure_array_like(node.children);
          for (let idx = 0, $$length = each_array.length; idx < $$length; idx++) {
            let child = each_array[idx];
            $$renderer3.push(`<div class="child-branch svelte-1dd3ufc"><div class="connector-to-child svelte-1dd3ufc"></div> `);
            renderNode($$renderer3, child, false);
            $$renderer3.push(`<!----></div>`);
          }
          $$renderer3.push(`<!--]--></div></div>`);
        } else {
          $$renderer3.push("<!--[!-->");
        }
        $$renderer3.push(`<!--]--></div>`);
      };
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="tree-content svelte-1dd3ufc"${attr_style(`transform: scale(${stringify(scale)}); transform-origin: top left;`)}>`);
      renderNode($$renderer2, rootNode, true);
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="empty-state svelte-1dd3ufc"><span class="empty-icon svelte-1dd3ufc">🌳</span> <p class="svelte-1dd3ufc">트리 데이터가 없습니다.</p></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
function Node_editor($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let {
      node = null,
      isLoading = false
    } = $$props;
    let editedText = "";
    let editedChoices = [];
    let hasChanges = false;
    const dispatch = createEventDispatcher();
    function handleApply() {
      if (!node || !hasChanges) return;
      dispatch("applyChanges", {
        nodeId: node.id,
        newText: editedText,
        newChoices: editedChoices
      });
    }
    function handleCancel() {
      if (node) {
        editedText = node.text;
        editedChoices = node.choices ? [...node.choices.map((c) => ({ ...c }))] : [];
        hasChanges = false;
      }
    }
    $$renderer2.push(`<div class="editor-panel svelte-cwg4ci">`);
    if (node) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="editor-header svelte-cwg4ci"><h3 class="editor-title svelte-cwg4ci">✏️ 노드 편집</h3> <div class="node-info svelte-cwg4ci"><span class="info-badge svelte-cwg4ci">ID: ${escape_html(node.id)}</span> <span class="info-badge svelte-cwg4ci">깊이: ${escape_html(node.depth)}</span></div></div> <div class="editor-body svelte-cwg4ci"><div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci">노드 텍스트</label> <textarea class="form-textarea svelte-cwg4ci"${attr("disabled", isLoading, true)} rows="4" placeholder="스토리 텍스트를 입력하세요...">`);
      const $$body = escape_html(editedText);
      if ($$body) {
        $$renderer2.push(`${$$body}`);
      }
      $$renderer2.push(`</textarea></div> `);
      if (editedChoices.length > 0) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="form-group svelte-cwg4ci"><label class="form-label svelte-cwg4ci">선택지 (${escape_html(editedChoices.length)}개)</label> <div class="choices-list svelte-cwg4ci"><!--[-->`);
        const each_array = ensure_array_like(editedChoices);
        for (let index = 0, $$length = each_array.length; index < $$length; index++) {
          let choice = each_array[index];
          $$renderer2.push(`<div class="choice-item svelte-cwg4ci"><span class="choice-number svelte-cwg4ci">${escape_html(index + 1)}</span> <input type="text" class="choice-input svelte-cwg4ci"${attr("value", choice.text)}${attr("disabled", isLoading, true)} placeholder="선택지 텍스트..."/> `);
          if (choice.tags && choice.tags.length > 0) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="choice-tags svelte-cwg4ci"><!--[-->`);
            const each_array_1 = ensure_array_like(choice.tags);
            for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
              let tag = each_array_1[$$index];
              $$renderer2.push(`<span class="tag svelte-cwg4ci">${escape_html(tag)}</span>`);
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
          }
          $$renderer2.push(`<!--]--></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> `);
      if (node.details) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="details-section svelte-cwg4ci"><h4 class="details-title svelte-cwg4ci">📋 상세 정보</h4> `);
        if (node.details.situation) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">상황:</span> <span class="detail-value svelte-cwg4ci">${escape_html(node.details.situation)}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (node.details.npc_emotions && Object.keys(node.details.npc_emotions).length > 0) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="detail-item svelte-cwg4ci"><span class="detail-label svelte-cwg4ci">NPC 감정:</span> <span class="detail-value svelte-cwg4ci">${escape_html(Object.entries(node.details.npc_emotions).map(([k, v]) => `${k}: ${v}`).join(", "))}</span></div>`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="editor-footer svelte-cwg4ci"><div class="status-info svelte-cwg4ci">`);
      if (hasChanges) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<span class="status-changed svelte-cwg4ci">⚠️ 변경사항이 있습니다</span>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<span class="status-saved svelte-cwg4ci">✓ 저장됨</span>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="editor-actions svelte-cwg4ci">`);
      Button($$renderer2, {
        variant: "outline",
        onclick: handleCancel,
        disabled: isLoading,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->취소`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        onclick: handleApply,
        disabled: !hasChanges || isLoading,
        children: ($$renderer3) => {
          if (isLoading) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`⏳ 적용 중...`);
          } else {
            $$renderer3.push("<!--[!-->");
            $$renderer3.push(`🔄 적용 (서브트리 재생성)`);
          }
          $$renderer3.push(`<!--]-->`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="no-selection svelte-cwg4ci"><div class="no-selection-icon svelte-cwg4ci">👆</div> <p class="no-selection-text svelte-cwg4ci">편집할 노드를 선택하세요</p> <p class="no-selection-hint svelte-cwg4ci">트리에서 노드를 클릭하면 여기서 편집할 수 있습니다</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
  });
}
function Step5Tree($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let treeEditMode = fallback($$props["treeEditMode"], false);
    let currentEpisodeTree = fallback($$props["currentEpisodeTree"], null);
    let selectedNode = fallback($$props["selectedNode"], null);
    let regenerating = fallback($$props["regenerating"], false);
    let currentEpisodeTitle = fallback($$props["currentEpisodeTitle"], "");
    let currentEpisode = fallback($$props["currentEpisode"], 1);
    let actualTotalEpisodes = fallback($$props["actualTotalEpisodes"], 0);
    let generating = fallback($$props["generating"], false);
    let progressMessage = fallback($$props["progressMessage"], "");
    let totalEpisodesGenerated = fallback($$props["totalEpisodesGenerated"], 0);
    let numEpisodes = fallback($$props["numEpisodes"], 0);
    let error = fallback($$props["error"], "");
    let maxDepth = fallback($$props["maxDepth"], 3);
    let onSelectNode = $$props["onSelectNode"];
    let onApplyChanges = $$props["onApplyChanges"];
    let onCancelSelect = $$props["onCancelSelect"];
    let onGenerateNextEpisodeFromTree = $$props["onGenerateNextEpisodeFromTree"];
    let onBackToSettings = $$props["onBackToSettings"];
    $$renderer2.push(`<div class="step5-container svelte-10hxdp2">`);
    if (treeEditMode) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="tree-edit-mode svelte-10hxdp2"><div class="edit-header svelte-10hxdp2"><div class="header-left svelte-10hxdp2"><div class="step-badge svelte-10hxdp2"><span class="step-icon svelte-10hxdp2">🌳</span> <span class="step-text svelte-10hxdp2">5단계</span></div> <div class="header-info svelte-10hxdp2"><h2 class="header-title svelte-10hxdp2">에피소드 트리 편집</h2> <p class="header-desc svelte-10hxdp2">스토리 분기를 검토하고 필요하면 수정하세요</p></div></div> <div class="header-right svelte-10hxdp2"><div class="episode-indicator svelte-10hxdp2"><span class="episode-label svelte-10hxdp2">에피소드</span> <span class="episode-current svelte-10hxdp2">${escape_html(currentEpisode)}</span> <span class="episode-divider svelte-10hxdp2">/</span> <span class="episode-total svelte-10hxdp2">${escape_html(actualTotalEpisodes)}</span></div></div></div> `);
      if (currentEpisodeTree) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div class="edit-main svelte-10hxdp2"><div class="tree-panel svelte-10hxdp2"><div class="panel-header svelte-10hxdp2"><div class="panel-title-group svelte-10hxdp2"><span class="panel-icon svelte-10hxdp2">📊</span> <span class="panel-title svelte-10hxdp2">스토리 트리</span></div> <div class="panel-actions svelte-10hxdp2"><span class="tree-stats svelte-10hxdp2">`);
        if (currentEpisodeTitle) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`📖 ${escape_html(currentEpisodeTitle)}`);
        } else {
          $$renderer2.push("<!--[!-->");
        }
        $$renderer2.push(`<!--]--></span></div></div> <div class="tree-viewport svelte-10hxdp2">`);
        Story_tree($$renderer2, {
          rootNode: currentEpisodeTree,
          selectedNodeId: selectedNode?.id || ""
        });
        $$renderer2.push(`<!----></div></div> <div class="editor-panel svelte-10hxdp2">`);
        Node_editor($$renderer2, {
          node: selectedNode,
          isLoading: regenerating
        });
        $$renderer2.push(`<!----></div></div> <div class="edit-footer svelte-10hxdp2"><div class="footer-left svelte-10hxdp2"><div class="hint-card svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">💡</span> <div class="hint-content svelte-10hxdp2"><strong class="svelte-10hxdp2">사용법</strong> <span class="svelte-10hxdp2">노드 클릭 → 내용 수정 → 적용 버튼</span></div></div></div> <div class="footer-right svelte-10hxdp2">`);
        Button($$renderer2, {
          variant: "outline",
          onclick: onBackToSettings,
          disabled: generating || regenerating,
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->← 설정으로`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Button($$renderer2, {
          onclick: () => {
            if (confirm("현재 에피소드를 확정하고 다음으로 진행하시겠습니까?")) {
              onGenerateNextEpisodeFromTree();
            }
          },
          disabled: generating || regenerating,
          children: ($$renderer3) => {
            if (currentEpisode >= actualTotalEpisodes) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`<span class="btn-icon svelte-10hxdp2">✅</span> 완료하기`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드`);
            }
            $$renderer3.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`<div class="empty-state svelte-10hxdp2"><div class="empty-visual svelte-10hxdp2"><div class="empty-icon-wrapper svelte-10hxdp2"><span class="empty-icon svelte-10hxdp2">⚠️</span></div> <div class="empty-rings svelte-10hxdp2"></div></div> <h3 class="empty-title svelte-10hxdp2">트리 데이터를 불러올 수 없습니다</h3> <p class="empty-desc svelte-10hxdp2">에피소드가 생성되었지만 트리 구조를 불러오지 못했습니다.</p> <div class="empty-actions svelte-10hxdp2">`);
        Button($$renderer2, {
          onclick: () => {
            if (confirm("현재 에피소드를 건너뛰고 다음을 생성하시겠습니까?")) {
              onGenerateNextEpisodeFromTree();
            }
          },
          disabled: generating || regenerating,
          children: ($$renderer3) => {
            $$renderer3.push(`<span class="btn-icon svelte-10hxdp2">⏭️</span> 다음 에피소드`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----> `);
        Button($$renderer2, {
          variant: "outline",
          onclick: onBackToSettings,
          children: ($$renderer3) => {
            $$renderer3.push(`<!---->← 설정으로 돌아가기`);
          },
          $$slots: { default: true }
        });
        $$renderer2.push(`<!----></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<div class="generating-mode svelte-10hxdp2"><div class="gen-visual svelte-10hxdp2"><div class="gen-animation svelte-10hxdp2"><div class="gen-core svelte-10hxdp2"><span class="gen-emoji svelte-10hxdp2">🚀</span></div> <div class="gen-orbit orbit-1 svelte-10hxdp2"></div> <div class="gen-orbit orbit-2 svelte-10hxdp2"></div> <div class="gen-orbit orbit-3 svelte-10hxdp2"></div> <div class="gen-particles svelte-10hxdp2"><!--[-->`);
      const each_array = ensure_array_like(Array(8));
      for (let i = 0, $$length = each_array.length; i < $$length; i++) {
        each_array[i];
        $$renderer2.push(`<div class="particle svelte-10hxdp2"${attr_style(`--delay: ${stringify(i * 0.15)}s; --angle: ${stringify(i * 45)}deg`)}></div>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="gen-status svelte-10hxdp2"><h2 class="gen-title svelte-10hxdp2">AI가 스토리를 생성하고 있습니다 <span class="gen-dots svelte-10hxdp2"><span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span> <span class="dot svelte-10hxdp2"></span></span></h2> <p class="gen-subtitle svelte-10hxdp2">에피소드 ${escape_html(currentEpisode)} 생성 중</p></div></div> <div class="gen-progress-card svelte-10hxdp2"><div class="progress-header svelte-10hxdp2"><span class="progress-label svelte-10hxdp2">전체 진행률</span> <span class="progress-value svelte-10hxdp2">${escape_html(currentEpisode)} / ${escape_html(actualTotalEpisodes || numEpisodes)}</span></div> <div class="progress-bar-container svelte-10hxdp2"><div class="progress-bar-fill svelte-10hxdp2"${attr_style(`width: ${stringify((currentEpisode - 1) / (actualTotalEpisodes || numEpisodes) * 100)}%`)}></div> <div class="progress-bar-active svelte-10hxdp2"${attr_style(`left: ${stringify((currentEpisode - 1) / (actualTotalEpisodes || numEpisodes) * 100)}%`)}></div></div> `);
      if (progressMessage) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="progress-message svelte-10hxdp2">${escape_html(progressMessage)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="episode-grid svelte-10hxdp2"><!--[-->`);
      const each_array_1 = ensure_array_like(Array(actualTotalEpisodes || numEpisodes));
      for (let i = 0, $$length = each_array_1.length; i < $$length; i++) {
        each_array_1[i];
        $$renderer2.push(`<div${attr_class("episode-dot svelte-10hxdp2", void 0, {
          "completed": i < totalEpisodesGenerated,
          "active": i === totalEpisodesGenerated && generating,
          "pending": i > totalEpisodesGenerated
        })}>`);
        if (i < totalEpisodesGenerated) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<span class="dot-icon svelte-10hxdp2">✓</span>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (i === totalEpisodesGenerated && generating) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<span class="dot-spinner svelte-10hxdp2"></span>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<span class="dot-number svelte-10hxdp2">${escape_html(i + 1)}</span>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div> <p class="progress-hint svelte-10hxdp2"><span class="hint-icon svelte-10hxdp2">⏱️</span> 예상 소요 시간: 약 1-2분</p></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="error-toast svelte-10hxdp2"><span class="error-icon svelte-10hxdp2">❌</span> <span class="error-text svelte-10hxdp2">${escape_html(error)}</span></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, {
      treeEditMode,
      currentEpisodeTree,
      selectedNode,
      regenerating,
      currentEpisodeTitle,
      currentEpisode,
      actualTotalEpisodes,
      generating,
      progressMessage,
      totalEpisodesGenerated,
      numEpisodes,
      error,
      maxDepth,
      onSelectNode,
      onApplyChanges,
      onCancelSelect,
      onGenerateNextEpisodeFromTree,
      onBackToSettings
    });
  });
}
function Step6Generating($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let generating = fallback($$props["generating"], false);
    let progressMessage = fallback($$props["progressMessage"], "");
    let currentEpisode = fallback($$props["currentEpisode"], 1);
    let actualTotalEpisodes = fallback($$props["actualTotalEpisodes"], 0);
    let numEpisodes = fallback($$props["numEpisodes"], 0);
    let totalEpisodesGenerated = fallback($$props["totalEpisodesGenerated"], 0);
    let error = fallback($$props["error"], "");
    let onBackToStep4 = $$props["onBackToStep4"];
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">6단계: 에피소드 생성 중</h2> <p class="card-desc">AI가 스토리와 디테일을 생성하고 있습니다...</p></div> <div class="card-body"><div class="generating-state"><div class="spinner"></div> <div class="progress-info"><div class="episode-progress"><span class="episode-label">에피소드 생성</span> <span class="episode-count">${escape_html(currentEpisode)} / ${escape_html(actualTotalEpisodes || numEpisodes)}</span></div> `);
    if (progressMessage) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<p class="progress-message">${escape_html(progressMessage)}</p>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <p class="progress-hint">동기 방식으로 생성 중입니다. 약 1-2분 소요됩니다...</p> <div class="episode-list"><!--[-->`);
    const each_array = ensure_array_like(Array(actualTotalEpisodes || numEpisodes));
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      each_array[i];
      $$renderer2.push(`<div${attr_class("episode-item", void 0, {
        "completed": i < totalEpisodesGenerated,
        "active": i === totalEpisodesGenerated && generating
      })}>`);
      if (i < totalEpisodesGenerated) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`✓`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (i === totalEpisodesGenerated && generating) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`⏳`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`${escape_html(i + 1)}`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div> `);
    if (error) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="error-state"><div class="error-icon">❌</div> <h3 class="error-title">생성 실패</h3> <div class="error-detail"><!--[-->`);
      const each_array_1 = ensure_array_like(error.split("\n"));
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let line = each_array_1[$$index_1];
        $$renderer2.push(`<p class="error-line">${escape_html(line)}</p>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="error-actions">`);
      Button($$renderer2, {
        onclick: onBackToStep4,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->← 설정 수정`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        variant: "outline",
        onclick: () => {
          alert("콘솔(F12)에서 상세 정보를 확인하세요");
        },
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->🔍 콘솔에서 자세히 보기`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, {
      generating,
      progressMessage,
      currentEpisode,
      actualTotalEpisodes,
      numEpisodes,
      totalEpisodesGenerated,
      error,
      onBackToStep4
    });
  });
}
function Step7Complete($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let metadata = fallback($$props["metadata"], null);
    let storyDataId = fallback($$props["storyDataId"], null);
    let startPlaying = $$props["startPlaying"];
    let createNew = $$props["createNew"];
    $$renderer2.push(`<div class="content-card"><div class="card-header"><h2 class="card-title">7단계: 생성 완료</h2> <p class="card-desc">인터랙티브 스토리가 성공적으로 생성되었습니다</p></div> <div class="card-body">`);
    if (metadata && storyDataId) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="success-state"><div class="success-icon">✨</div> <h3 class="success-title">${escape_html(metadata.title)}</h3> `);
      if (metadata.description) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<p class="success-desc">${escape_html(metadata.description)}</p>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--> <div class="story-stats"><div class="stat-item"><span class="stat-label">총 에피소드</span> <span class="stat-value">${escape_html(metadata.totalEpisodes)}화</span></div> <div class="stat-item"><span class="stat-label">총 노드</span> <span class="stat-value">${escape_html(metadata.totalNodes)}개</span></div> <div class="stat-item"><span class="stat-label">게이지 수</span> <span class="stat-value">${escape_html(metadata.totalGauges)}개</span></div> <div class="stat-item"><span class="stat-label">생성일</span> <span class="stat-value">${escape_html(new Date(metadata.createdAt).toLocaleDateString("ko-KR"))}</span></div></div> <div class="action-buttons">`);
      Button($$renderer2, {
        size: "lg",
        onclick: startPlaying,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->🎮 지금 플레이하기`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----> `);
      Button($$renderer2, {
        size: "lg",
        variant: "outline",
        onclick: createNew,
        children: ($$renderer3) => {
          $$renderer3.push(`<!---->➕ 새로 만들기`);
        },
        $$slots: { default: true }
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    bind_props($$props, { metadata, storyDataId, startPlaying, createNew });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let currentStep = 1;
    let storyId = "";
    let title = "";
    let novelText = "";
    let genre = "";
    let uploadedFile = null;
    let uploadProgress = 0;
    let uploading = false;
    let summary = "";
    let characters = [];
    let expandedCharacters = /* @__PURE__ */ new Set();
    let loadingAnalysis = false;
    let proposedGauges = [];
    let selectedGaugeIds = [];
    let loadingGauges = false;
    let selectingGauges = false;
    let description = "";
    let endingConfig = { happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 };
    let numEpisodes = 5;
    let maxDepth = 3;
    let numEpisodeEndings = 3;
    let configuringStory = false;
    let generating = false;
    let progressMessage = "";
    let currentEpisode = 1;
    let totalEpisodesGenerated = 0;
    let actualTotalEpisodes = 0;
    let currentEpisodeTree = null;
    let currentEpisodeTitle = "";
    let selectedNode = null;
    let regenerating = false;
    let treeEditMode = false;
    let storyDataId = null;
    let metadata = null;
    let error = "";
    const steps = [
      { number: 1, title: "소설 텍스트", desc: "전문 입력" },
      { number: 2, title: "등장인물", desc: "자동 추출" },
      { number: 3, title: "게이지", desc: "5개 → 2개 선택" },
      { number: 4, title: "엔딩", desc: "예상 엔딩 설계" },
      { number: 5, title: "트리 편집", desc: "노드 수정/검토" },
      { number: 6, title: "에피소드 생성", desc: "순차 생성" },
      { number: 7, title: "완료", desc: "체크/등록" }
    ];
    function canGoNext() {
      switch (currentStep) {
        case 1:
          return uploadedFile !== null && title.length > 0;
        case 2:
          return characters.length > 0 && summary.length > 0;
        case 3:
          return selectedGaugeIds.length === 2;
        case 4:
          return true;
        case 5:
        case 6:
          return false;
        case // 자동 진행
        7:
          return storyDataId !== null;
        default:
          return false;
      }
    }
    function setTitleValue(value) {
      title = value;
    }
    function setDescriptionValue(value) {
      description = value;
    }
    function setGenreValue(value) {
      genre = value;
    }
    function clearUploadedFile() {
      uploadedFile = null;
    }
    function toggleGauge(gaugeId) {
      if (selectedGaugeIds.includes(gaugeId)) {
        selectedGaugeIds = selectedGaugeIds.filter((id) => id !== gaugeId);
      } else if (selectedGaugeIds.length < 2) {
        selectedGaugeIds = [...selectedGaugeIds, gaugeId];
      } else {
        selectedGaugeIds = [selectedGaugeIds[1], gaugeId];
      }
    }
    function truncate(text, maxLength = 140) {
      if (!text) return "";
      return text.length > maxLength ? text.slice(0, maxLength) + "…" : text;
    }
    function handleEndingChange(key, value) {
      endingConfig = { ...endingConfig, [key]: value };
    }
    function handleNumEpisodesChange(value) {
      numEpisodes = value;
    }
    function handleMaxDepthChange(value) {
      maxDepth = value;
    }
    async function uploadNovel() {
      console.log("uploadNovel 호출됨");
      console.log("canGoNext:", canGoNext());
      console.log("title:", title);
      console.log("uploadedFile:", uploadedFile);
      console.log("novelText length:", novelText.length);
      if (!canGoNext()) {
        alert("제목과 소설 파일을 입력해주세요");
        return;
      }
      uploading = true;
      uploadProgress = 0;
      error = "";
      try {
        let response;
        if (uploadedFile) {
          console.log("S3 업로드 방식 사용...");
          const fileKey = await api.upload.uploadStoryFile(uploadedFile, (progress) => {
            uploadProgress = progress;
            console.log(`업로드 진행률: ${progress.toFixed(1)}%`);
          });
          console.log("S3 업로드 완료, fileKey:", fileKey);
          response = await api.story.uploadNovelFromS3({ title, description, fileKey });
        } else {
          throw new Error("파일을 선택해주세요");
        }
        console.log("업로드 성공:", response);
        if (response.status === "FAILED") {
          throw new Error("파일 분석에 실패했습니다. 파일 형식이나 내용을 확인해주세요.");
        }
        storyId = response.storyId;
        currentStep = 2;
        loadAnalysisData();
      } catch (err) {
        console.error("업로드 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || "소설 업로드에 실패했습니다.";
          alert("업로드 실패: " + error);
        } else {
          error = "네트워크 오류가 발생했습니다.";
          alert("네트워크 오류: " + err.message);
        }
      } finally {
        uploading = false;
        uploadProgress = 0;
      }
    }
    async function loadAnalysisData() {
      loadingAnalysis = true;
      try {
        const checkProgress = async () => {
          const progressData = await api.story.getProgress(storyId);
          if (progressData.status === "CHARACTERS_READY" || progressData.status === "GAUGES_READY") {
            const [summaryData, charactersData] = await Promise.all([
              api.story.getSummary(storyId),
              api.story.getCharacters(storyId)
            ]);
            summary = summaryData.summary;
            characters = charactersData.characters;
            loadingAnalysis = false;
          } else if (progressData.status === "FAILED") {
            const errorMsg = progressData.progress?.error || "분석에 실패했습니다";
            console.error("분석 실패 상세:", progressData);
            throw new Error(`파일 분석 실패: ${errorMsg}

파일 형식이나 내용을 확인해주세요.`);
          } else {
            setTimeout(() => checkProgress(), 3e3);
          }
        };
        await checkProgress();
      } catch (err) {
        console.error("분석 데이터 로드 실패:", err);
        error = err.message || "분석에 실패했습니다.";
        loadingAnalysis = false;
      }
    }
    async function nextStep() {
      console.log("nextStep 호출됨, currentStep:", currentStep);
      try {
        if (currentStep === 1) {
          console.log("1단계: uploadNovel 호출");
          await uploadNovel();
        } else if (currentStep === 2) {
          console.log("2단계: 게이지 로드");
          currentStep = 3;
          await loadGauges();
        } else if (currentStep === 3) {
          console.log("3단계: 게이지 선택 제출");
          await submitGaugeSelection();
        } else if (currentStep === 4) {
          console.log("4단계: 설정 제출 & 생성 시작");
          await submitConfig();
        } else if (canGoNext()) {
          console.log("일반 다음 단계");
          currentStep++;
        }
      } catch (error2) {
        console.error("nextStep 에러:", error2);
        alert("에러 발생: " + error2);
      }
    }
    async function loadGauges() {
      loadingGauges = true;
      error = "";
      try {
        const response = await api.story.getGauges(storyId);
        proposedGauges = response.gauges;
      } catch (err) {
        console.error("게이지 로드 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || "게이지 로드에 실패했습니다.";
        } else {
          error = "네트워크 오류가 발생했습니다.";
        }
      } finally {
        loadingGauges = false;
      }
    }
    async function submitGaugeSelection() {
      if (selectedGaugeIds.length !== 2) {
        alert("게이지를 정확히 2개 선택해주세요.");
        return;
      }
      selectingGauges = true;
      error = "";
      try {
        await api.story.selectGauges(storyId, { selectedGaugeIds });
        currentStep = 4;
      } catch (err) {
        console.error("게이지 선택 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || "게이지 선택에 실패했습니다.";
        } else {
          error = "네트워크 오류가 발생했습니다.";
        }
      } finally {
        selectingGauges = false;
      }
    }
    async function submitConfig() {
      configuringStory = true;
      generating = true;
      error = "";
      currentEpisode = 1;
      totalEpisodesGenerated = 0;
      actualTotalEpisodes = numEpisodes;
      currentStep = 5;
      progressMessage = "에피소드 1 생성 중... (약 1-2분 소요)";
      try {
        await api.story.configureStory(storyId, {
          description,
          numEpisodes,
          maxDepth,
          endingConfig,
          numEpisodeEndings
        });
        console.log("EP1 생성 시작 (동기 방식)...");
        console.log("StoryId:", storyId);
        const episodeData = await api.story.startEpisodeGeneration(storyId);
        console.log("EP1 생성 완료:", episodeData);
        console.log("EpisodeData 구조:", {
          hasNodes: !!episodeData.nodes,
          nodesLength: episodeData.nodes?.length || 0,
          title: episodeData.title,
          order: episodeData.order,
          keys: Object.keys(episodeData)
        });
        if (episodeData.nodes && episodeData.nodes.length > 0) {
          console.log("첫 번째 노드:", episodeData.nodes[0]);
        }
        enterTreeEditMode(episodeData);
      } catch (err) {
        console.error("생성 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || err.message || "스토리 생성에 실패했습니다.";
          console.error("API 에러 상세:", { status: err.status, data: err.data, message: err.message });
        } else {
          error = err.message || "네트워크 오류가 발생했습니다.";
          console.error("일반 에러:", err);
        }
        generating = false;
        currentStep = 4;
      } finally {
        configuringStory = false;
      }
    }
    async function loadResultDirectly() {
      const maxRetries = 5;
      let retryCount = 0;
      const tryLoad = async () => {
        try {
          retryCount++;
          console.log(`결과 조회 시도 ${retryCount}/${maxRetries}... storyId:`, storyId);
          const result = await api.story.getResult(storyId);
          console.log("✅ 결과 조회 성공:", result);
          storyDataId = result.storyDataId;
          metadata = result.metadata;
          currentStep = 7;
          generating = false;
          alert("🎉 스토리 생성이 완료되었습니다!");
        } catch (err) {
          console.error(`결과 조회 실패 (${retryCount}/${maxRetries}):`, err);
          if (retryCount < maxRetries) {
            console.log(`⏳ 5초 후 다시 시도...`);
            await new Promise((resolve) => setTimeout(resolve, 5e3));
            await tryLoad();
          } else {
            console.error("=== 최종 에러 정보 ===");
            console.error("storyId:", storyId);
            console.error("에러 객체:", err);
            if (err instanceof ApiError) {
              console.error("API Error Status:", err.status);
              console.error("API Error Data:", err.data);
            }
            if (err instanceof ApiError && err.status === 404) {
              error = `❌ 스토리를 찾을 수 없습니다 (404)

storyId: ${storyId}
백엔드에서 생성은 완료되었지만 결과를 저장하지 못했을 수 있습니다.

백엔드 콘솔 로그를 확인해주세요.`;
            } else if (err instanceof ApiError && err.status === 500) {
              error = `❌ 백엔드 서버 내부 오류 (500)

storyId: ${storyId}
에러 메시지: ${err.data?.message || err.message}

백엔드 콘솔에서 다음을 확인하세요:
1. Exception 스택 트레이스
2. /api/stories/\${storyId}/result 관련 로그
3. 데이터베이스 연결 상태
4. AI 서버 응답 데이터`;
            } else if (err instanceof ApiError) {
              error = `❌ API 에러 (${err.status})

storyId: ${storyId}
메시지: ${err.data?.message || err.message}`;
            } else {
              error = `❌ 네트워크 오류

storyId: ${storyId}
메시지: ${err.message}`;
            }
            generating = false;
          }
        }
      };
      await tryLoad();
    }
    function prevStep() {
      if (currentStep > 1) {
        currentStep--;
      }
    }
    async function handleFileUpload(event) {
      const input = event.target;
      const file = input.files?.[0];
      if (!file) return;
      const allowedTypes = [".txt", ".pdf", ".doc", ".docx"];
      const fileExt = "." + file.name.split(".").pop()?.toLowerCase();
      if (!allowedTypes.includes(fileExt)) {
        alert("지원하는 파일 형식: .txt, .pdf, .doc, .docx");
        input.value = "";
        return;
      }
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("파일 크기는 10MB 이하여야 합니다.");
        input.value = "";
        return;
      }
      try {
        uploadedFile = file;
        novelText = "";
        if (!title) {
          title = file.name.replace(/\.(txt|pdf|doc|docx)$/i, "");
        }
        console.log("파일 선택됨:", file.name, `(${(file.size / 1024).toFixed(1)} KB)`);
      } catch (err) {
        console.error("파일 처리 실패:", err);
        error = "파일을 처리할 수 없습니다.";
        uploadedFile = null;
      }
    }
    function startPlaying() {
      if (storyDataId) {
        goto();
      }
    }
    function handleNodeSelect(event) {
      selectedNode = event.detail.node;
      console.log("노드 선택됨:", selectedNode?.id);
    }
    async function handleApplyChanges(event) {
      if (!selectedNode || !currentEpisodeTree) return;
      const { nodeId, newText, newChoices } = event.detail;
      regenerating = true;
      error = "";
      try {
        console.log("서브트리 재생성 요청:", { nodeId, newText });
        const response = await api.story.regenerateSubtree(storyId, currentEpisode, nodeId, {
          nodeText: newText,
          choices: newChoices.map((c) => c.text),
          situation: selectedNode.details?.situation || "",
          npcEmotions: selectedNode.details?.npc_emotions || {},
          tags: newChoices.flatMap((c) => c.tags)
        });
        console.log("서브트리 재생성 완료:", response.totalNodesRegenerated, "개 노드");
        updateTreeWithRegeneratedNodes(nodeId, response.regeneratedNodes);
        selectedNode = null;
        alert(`✅ 서브트리 재생성 완료! ${response.totalNodesRegenerated}개 노드가 업데이트되었습니다.`);
      } catch (err) {
        console.error("서브트리 재생성 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || "서브트리 재생성에 실패했습니다.";
        } else {
          error = err.message || "서브트리 재생성에 실패했습니다.";
        }
        alert("❌ 서브트리 재생성 실패: " + error);
      } finally {
        regenerating = false;
      }
    }
    function updateTreeWithRegeneratedNodes(parentNodeId, regeneratedNodes) {
      if (!currentEpisodeTree || regeneratedNodes.length === 0) return;
      function findAndReplace(node) {
        if (node.id === parentNodeId) {
          const newNode = convertToTreeNode(regeneratedNodes[0]);
          return newNode;
        }
        if (node.children && node.children.length > 0) {
          node.children = node.children.map((child) => findAndReplace(child));
        }
        return node;
      }
      currentEpisodeTree = findAndReplace({ ...currentEpisodeTree });
    }
    function convertToTreeNode(apiNode) {
      if (!apiNode) {
        console.warn("convertToTreeNode: apiNode is null or undefined");
        return {
          id: "unknown",
          text: "Unknown node",
          depth: 0,
          choices: [],
          children: []
        };
      }
      const node = {
        id: apiNode.id || apiNode.nodeId || String(Math.random()),
        text: apiNode.text || "No text",
        depth: apiNode.depth ?? 0,
        choices: [],
        children: [],
        details: {}
      };
      if (apiNode.choices && Array.isArray(apiNode.choices)) {
        node.choices = apiNode.choices.map((choice) => ({ text: choice.text || "", tags: choice.tags || [] }));
      }
      if (apiNode.details) {
        node.details = {
          situation: apiNode.details.situation,
          npc_emotions: apiNode.details.npc_emotions || apiNode.details.npcEmotions || {},
          relations_update: apiNode.details.relations_update || apiNode.details.relationsUpdate || {}
        };
      } else {
        node.details = {
          situation: apiNode.situation,
          npc_emotions: apiNode.npc_emotions || apiNode.npcEmotions || {},
          relations_update: apiNode.relations_update || apiNode.relationsUpdate || {}
        };
      }
      if (apiNode.children && Array.isArray(apiNode.children) && apiNode.children.length > 0) {
        node.children = apiNode.children.map((child) => convertToTreeNode(child));
      }
      return node;
    }
    async function generateNextEpisodeFromTree() {
      totalEpisodesGenerated = currentEpisode;
      if (totalEpisodesGenerated >= actualTotalEpisodes) {
        console.log("🎉 모든 에피소드 생성 완료!");
        await loadResultDirectly();
        return;
      }
      generating = true;
      treeEditMode = false;
      error = "";
      currentEpisode++;
      progressMessage = `에피소드 ${currentEpisode}/${actualTotalEpisodes} 생성 중... (약 1-2분 소요)`;
      try {
        console.log(`EP${currentEpisode} 생성 시작 (동기 방식)...`);
        const episodeData = await api.story.generateNextEpisode(storyId);
        console.log(`EP${currentEpisode} 생성 완료:`, episodeData);
        enterTreeEditMode(episodeData);
      } catch (err) {
        console.error("다음 에피소드 생성 실패:", err);
        if (err instanceof ApiError) {
          error = err.data?.message || "다음 에피소드 생성에 실패했습니다.";
        } else {
          error = err.message || "네트워크 오류가 발생했습니다.";
        }
        generating = false;
      }
    }
    function enterTreeEditMode(episodeData) {
      console.log("트리 편집 모드 진입:", episodeData);
      if (episodeData.nodes && episodeData.nodes.length > 0) {
        const rootNode = episodeData.nodes[0];
        currentEpisodeTree = convertToTreeNode(rootNode);
        if (episodeData.nodes.length > 1) {
          let buildTree = function(node) {
            const treeNode = convertToTreeNode(node);
            if (node.children && Array.isArray(node.children)) {
              treeNode.children = node.children.map((child) => buildTree(child));
            } else {
              const children = episodeData.nodes.filter((n) => (n.parent_id || n.parentId) === (node.id || node.nodeId));
              if (children.length > 0) {
                treeNode.children = children.map((child) => buildTree(child));
              }
            }
            return treeNode;
          };
          const nodeMap = /* @__PURE__ */ new Map();
          episodeData.nodes.forEach((node) => {
            nodeMap.set(node.id || node.nodeId, node);
          });
          currentEpisodeTree = buildTree(rootNode);
        }
      } else if (episodeData.startNode) {
        currentEpisodeTree = convertToTreeNode(episodeData.startNode);
      } else {
        console.warn("에피소드 데이터에 노드가 없습니다:", episodeData);
        currentEpisodeTree = null;
      }
      currentEpisodeTitle = episodeData.title || `에피소드 ${currentEpisode}`;
      treeEditMode = true;
      currentStep = 5;
      generating = false;
      selectedNode = null;
      console.log("트리 편집 모드 설정 완료:", {
        title: currentEpisodeTitle,
        hasTree: currentEpisodeTree !== null,
        treeNodeCount: currentEpisodeTree ? countNodes(currentEpisodeTree) : 0
      });
    }
    function countNodes(node) {
      let count = 1;
      if (node.children) {
        node.children.forEach((child) => {
          count += countNodes(child);
        });
      }
      return count;
    }
    function createNew() {
      currentStep = 1;
      storyId = "";
      title = "";
      novelText = "";
      uploadedFile = null;
      uploadProgress = 0;
      description = "";
      genre = "";
      summary = "";
      characters = [];
      proposedGauges = [];
      selectedGaugeIds = [];
      endingConfig = { happy: 2, tragic: 1, neutral: 1, open: 1, bad: 0 };
      numEpisodes = 5;
      maxDepth = 3;
      numEpisodeEndings = 3;
      storyDataId = null;
      metadata = null;
      error = "";
      progressMessage = "";
      currentEpisode = 1;
      totalEpisodesGenerated = 0;
      actualTotalEpisodes = 0;
      currentEpisodeTree = null;
      currentEpisodeTitle = "";
      selectedNode = null;
      regenerating = false;
      treeEditMode = false;
    }
    head("jma69v", $$renderer2, ($$renderer3) => {
      $$renderer3.push(`<style>
  .wizard-page {
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
  }
</style>`);
    });
    $$renderer2.push(`<div class="wizard-page"><div class="wizard-container"><div class="wizard-header"><h1 class="wizard-title">인터랙티브 스토리 생성</h1> <p class="wizard-subtitle">소설을 입력하면 AI가 자동으로 인터랙티브 게임으로 변환합니다</p></div> <div class="progress-bar-container"><div class="steps-container"><!--[-->`);
    const each_array = ensure_array_like(steps);
    for (let index = 0, $$length = each_array.length; index < $$length; index++) {
      let step = each_array[index];
      $$renderer2.push(`<div class="step-wrapper"><div class="step-item"><div${attr_class("step-circle", void 0, {
        "active": currentStep === step.number,
        "completed": currentStep > step.number
      })}>`);
      if (currentStep > step.number) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`✓`);
      } else {
        $$renderer2.push("<!--[!-->");
        $$renderer2.push(`${escape_html(step.number)}`);
      }
      $$renderer2.push(`<!--]--></div> <div class="step-info"><div${attr_class("step-title", void 0, {
        "active-title": currentStep === step.number,
        "completed-title": currentStep > step.number
      })}>${escape_html(step.title)}</div> <div${attr_class("step-desc", void 0, {
        "active-desc": currentStep === step.number,
        "completed-desc": currentStep > step.number
      })}>${escape_html(step.desc)}</div></div></div> `);
      if (index < steps.length - 1) {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<div${attr_class("step-connector", void 0, {
          "completed": currentStep > step.number,
          "active": currentStep === step.number || currentStep === step.number + 1
        })}></div>`);
      } else {
        $$renderer2.push("<!--[!-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div class="step-content">`);
    if (currentStep === 1) {
      $$renderer2.push("<!--[-->");
      Step1Upload($$renderer2, {
        title,
        description,
        genre,
        uploadedFile,
        uploading,
        uploadProgress,
        canGoNext: canGoNext(),
        error,
        onTitleChange: setTitleValue,
        onDescriptionChange: setDescriptionValue,
        onGenreChange: setGenreValue,
        onFileChange: handleFileUpload,
        onRemoveFile: clearUploadedFile
      });
    } else {
      $$renderer2.push("<!--[!-->");
      if (currentStep === 2) {
        $$renderer2.push("<!--[-->");
        Step2Characters($$renderer2, {
          loadingAnalysis,
          summary,
          characters,
          children: ($$renderer3) => {
            $$renderer3.push(`<!--[-->`);
            const each_array_1 = ensure_array_like(characters);
            for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
              let character = each_array_1[$$index_1];
              $$renderer3.push(`<button type="button"${attr_class("character-card", void 0, { "expanded": expandedCharacters.has(character.name) })}><div class="character-avatar">${escape_html(character.name.charAt(0))}</div> <div class="character-details"><div class="character-name">${escape_html(character.name)}</div> `);
              if (character.aliases && character.aliases.length > 0) {
                $$renderer3.push("<!--[-->");
                $$renderer3.push(`<div class="character-aliases">별칭: ${escape_html(character.aliases.join(", "))}</div>`);
              } else {
                $$renderer3.push("<!--[!-->");
              }
              $$renderer3.push(`<!--]--> <div${attr_class("character-description", void 0, { "expanded": expandedCharacters.has(character.name) })}>${escape_html(expandedCharacters.has(character.name) ? character.description : truncate(character.description, 140))}</div> <div class="character-toggle">${escape_html(expandedCharacters.has(character.name) ? "접기" : "더보기")}</div></div></button>`);
            }
            $$renderer3.push(`<!--]-->`);
          },
          $$slots: { default: true }
        });
      } else {
        $$renderer2.push("<!--[!-->");
        if (currentStep === 3) {
          $$renderer2.push("<!--[-->");
          Step3Gauges($$renderer2, {
            proposedGauges,
            selectedGaugeIds,
            loadingGauges,
            selectingGauges,
            toggleGauge
          });
        } else {
          $$renderer2.push("<!--[!-->");
          if (currentStep === 4) {
            $$renderer2.push("<!--[-->");
            Step4Ending($$renderer2, {
              endingConfig,
              numEpisodes,
              maxDepth,
              onEndingChange: handleEndingChange,
              onNumEpisodesChange: handleNumEpisodesChange,
              onMaxDepthChange: handleMaxDepthChange
            });
          } else {
            $$renderer2.push("<!--[!-->");
            if (currentStep === 5) {
              $$renderer2.push("<!--[-->");
              Step5Tree($$renderer2, {
                treeEditMode,
                currentEpisodeTree,
                selectedNode,
                regenerating,
                currentEpisodeTitle,
                currentEpisode,
                actualTotalEpisodes,
                generating,
                progressMessage,
                totalEpisodesGenerated,
                numEpisodes,
                error,
                maxDepth,
                onSelectNode: handleNodeSelect,
                onApplyChanges: handleApplyChanges,
                onCancelSelect: () => {
                  selectedNode = null;
                },
                onGenerateNextEpisodeFromTree: generateNextEpisodeFromTree,
                onBackToSettings: () => {
                  currentStep = 4;
                  error = "";
                }
              });
            } else {
              $$renderer2.push("<!--[!-->");
              if (currentStep === 6) {
                $$renderer2.push("<!--[-->");
                Step6Generating($$renderer2, {
                  generating,
                  progressMessage,
                  currentEpisode,
                  actualTotalEpisodes,
                  numEpisodes,
                  totalEpisodesGenerated,
                  error,
                  onBackToStep4: () => {
                    currentStep = 4;
                    error = "";
                  }
                });
              } else {
                $$renderer2.push("<!--[!-->");
                if (currentStep === 7) {
                  $$renderer2.push("<!--[-->");
                  Step7Complete($$renderer2, { metadata, storyDataId, startPlaying, createNew });
                } else {
                  $$renderer2.push("<!--[!-->");
                }
                $$renderer2.push(`<!--]-->`);
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div> <div class="navigation">`);
    Button($$renderer2, {
      onclick: prevStep,
      disabled: currentStep === 1 || generating,
      variant: "outline",
      size: "lg",
      children: ($$renderer3) => {
        $$renderer3.push(`<!---->← 이전`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----> <div class="step-indicator">${escape_html(currentStep)} / 7 단계</div> `);
    Button($$renderer2, {
      onclick: async () => await nextStep(),
      disabled: !canGoNext() || currentStep >= 5 || uploading || loadingAnalysis || loadingGauges || selectingGauges || configuringStory || generating,
      size: "lg",
      children: ($$renderer3) => {
        if (currentStep === 1) {
          $$renderer3.push("<!--[-->");
          $$renderer3.push(`${escape_html(uploading ? "업로드 중..." : "소설 업로드 →")}`);
        } else {
          $$renderer3.push("<!--[!-->");
          if (currentStep === 3) {
            $$renderer3.push("<!--[-->");
            $$renderer3.push(`${escape_html(selectingGauges ? "선택 중..." : "게이지 선택 →")}`);
          } else {
            $$renderer3.push("<!--[!-->");
            if (currentStep === 4) {
              $$renderer3.push("<!--[-->");
              $$renderer3.push(`${escape_html(configuringStory ? "시작 중..." : "생성 시작 →")}`);
            } else {
              $$renderer3.push("<!--[!-->");
              $$renderer3.push(`다음 →`);
            }
            $$renderer3.push(`<!--]-->`);
          }
          $$renderer3.push(`<!--]-->`);
        }
        $$renderer3.push(`<!--]-->`);
      },
      $$slots: { default: true }
    });
    $$renderer2.push(`<!----></div></div></div>`);
  });
}
export {
  _page as default
};
