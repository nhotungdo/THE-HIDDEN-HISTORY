/**
 * loadComponents.js — Bootstrap game sau khi DOM đã sẵn sàng
 *
 * Tất cả component HTML đã được inline trong index.html.
 * Script này phát event 'components:all-loaded', cấu hình tương tác Header QR, rồi import main.js.
 */

function setupHeaderQR() {
  const qrWrapper = document.getElementById('header-qr-wrapper');
  const qrBtn = document.getElementById('header-qr-btn');
  if (qrWrapper && qrBtn) {
    qrBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      qrWrapper.classList.toggle('is-open');
    });

    document.addEventListener('click', (e) => {
      if (!qrWrapper.contains(e.target)) {
        qrWrapper.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        qrWrapper.classList.remove('is-open');
      }
    });
  }
}

async function bootstrapGame() {
  setupHeaderQR();
  window.dispatchEvent(new CustomEvent('components:all-loaded'));
  try {
    await import('../main.js');
  } catch (err) {
    console.error('[loadComponents] Lỗi import main.js:', err);
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrapGame, { once: true });
} else {
  bootstrapGame();
}
