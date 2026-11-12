// modules/ui.js — Single source of truth for all modal + hover-info DOM mutations.
// All callers (modules/interaction.js, modules/gates.js, etc.) MUST go through these helpers
// and never write `modalContent.innerHTML` directly. This keeps the modal template consistent
// and prevents drift between painting modal and historical-info modal.

let controlsRef = null;

export function bindControls(controls) {
    controlsRef = controls || null;
}

export function showModal(html) {
    const modal = document.getElementById('infoModal');
    const content = document.getElementById('modalContent');
    if (modal && content) {
        content.innerHTML = html;
        modal.classList.add('active');
        modal.style.display = 'flex';
        if (controlsRef) controlsRef.unlock();
        if (document.pointerLockElement) document.exitPointerLock();
    }
}

export function hideModal() {
    const modal = document.getElementById('infoModal');
    if (!modal) return;
    if (modal.style.display === 'none' || modal.style.display === '') return;
    modal.style.display = 'none';
    modal.classList.remove('active');
    if (controlsRef) {
        setTimeout(() => {
            if (controlsRef) controlsRef.lock();
        }, 100);
    }
}

export function closeModalSafely() {
    const modal = document.getElementById('infoModal');
    if (modal) hideModal();
}

export function showHoverInfo(title, description) {
    const infoPanel = document.getElementById('painting-info');
    if (infoPanel) {
        infoPanel.innerHTML = `<h3>${title}</h3><p>${description}</p>`;
        infoPanel.classList.add('show');
    }
}

export function hideHoverInfo() {
    const infoPanel = document.getElementById('painting-info');
    if (infoPanel) {
        infoPanel.classList.remove('show');
    }
}

// ── Modal templates ─────────────────────────────────────────────
// Build an HTML payload from a structured info object. Centralizing the markup
// here ensures both painting modals and historical prop modals share the same
// visual language and reduce duplicate template code at call sites.

function quoteBlock(quote) {
    return quote
        ? `<div class="modal-quote-wrapper">
             <blockquote class="modal-quote">${String(quote).replace(/\n/g, '<br>')}</blockquote>
           </div>`
        : '';
}

function formatDescription(desc) {
    if (!desc) return '';
    return desc
        .split('\n')
        .map(line => {
            line = line.trim();
            if (!line) return '';
            const headerMatch = line.match(/^(Thời gian|Bối cảnh|Diễn biến chính|Kết quả|Ý nghĩa lịch sử):\s*(.*)/i);
            if (headerMatch) {
                return `<div class="modal-desc-section"><span class="desc-header">${headerMatch[1]}:</span> <span class="desc-text">${headerMatch[2]}</span></div>`;
            }
            if (line.startsWith('- ')) {
                return `<div class="modal-desc-bullet"><span class="bullet-dot">◆</span><span class="bullet-text">${line.substring(2)}</span></div>`;
            }
            return `<p class="modal-desc-p">${line}</p>`;
        })
        .filter(Boolean)
        .join('');
}

export function paintingModalHTML(info) {
    if (!info) return '';
    const imgTag = info.imgSrc ? `
      <div class="modal-artwork-wrapper">
        <div class="modal-artwork-frame">
          <img src="${info.imgSrc}" alt="${info.title || 'Tác phẩm'}" class="modal-artwork-img" loading="lazy" />
        </div>
      </div>
    ` : '';

    return `
        <div class="modal-tag">${info.tag || 'Hiện vật trưng bày'}</div>
        <h2 class="modal-artwork-title">${info.title || ''}</h2>
        <p class="modal-meta">${info.artist || 'Tư liệu lịch sử'} · ${info.year || ''}</p>
        ${imgTag}
        <div class="modal-divider"></div>
        <div class="modal-body">${formatDescription(info.description || '')}</div>
        ${quoteBlock(info.quote)}
    `;
}

export function historicalModalHTML(info) {
    if (!info) return '';
    return `
        <div class="modal-tag">${info.tag || 'Hiện vật tương tác'}</div>
        <h2 class="modal-artwork-title">${info.title || ''}</h2>
        <p class="modal-meta">${info.meta || ''}</p>
        <div class="modal-divider"></div>
        <div class="modal-body">${formatDescription(info.description || '')}</div>
        ${quoteBlock(info.quote)}
    `;
}

// High-level openers that combine template + showModal in one call.
// Callers (interaction.js, gates.js) just pass info, no need to know HTML.

export function openPaintingModal(info) {
    showModal(paintingModalHTML(info));
}

export function openHistoricalModal(info) {
    showModal(historicalModalHTML(info));
}