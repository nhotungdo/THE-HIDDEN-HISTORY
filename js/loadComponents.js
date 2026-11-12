/**
 * loadComponents.js — Bootstrap game sau khi DOM đã sẵn sàng
 *
 * Tất cả component HTML đã được inline trong index.html.
 * Script này phát event 'components:all-loaded', cấu hình tương tác Popup Mã QR, rồi import main.js.
 */

function setupQRModal() {
  const openBtn = document.getElementById('btn-open-qr-modal');
  const modal = document.getElementById('qrModal');
  const closeBtn = document.getElementById('close-qr-modal-btn');

  function openQR(e) {
    if (e) e.stopPropagation();
    if (!modal) return;
    modal.classList.add('active');
    modal.style.display = 'flex';
    if (document.pointerLockElement) {
      document.exitPointerLock();
    }
  }

  function closeQR(e) {
    if (e) e.stopPropagation();
    if (!modal) return;
    modal.classList.remove('active');
    modal.style.display = 'none';
  }

  if (openBtn) {
    openBtn.addEventListener('click', openQR);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeQR);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      // Đóng khi click vào vùng nền tối bên ngoài hộp nội dung
      if (e.target === modal) {
        closeQR();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeQR();
    }
  });
}

function setupOrientationHint() {
  const dismissBtn = document.getElementById('btn-dismiss-orientation');
  const overlay = document.getElementById('orientation-overlay');
  if (dismissBtn && overlay) {
    dismissBtn.addEventListener('click', () => {
      overlay.classList.add('dismissed');
    });
  }
}

async function bootstrapGame() {
  setupQRModal();
  setupOrientationHint();
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
