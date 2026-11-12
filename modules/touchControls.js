import * as THREE from 'three';

/**
 * modules/touchControls.js — Hệ thống điều khiển cảm ứng Dual-Zone cho Mobile & Tablet
 *
 * 1. Nửa trái màn hình: Virtual Dynamic Joystick (Di chuyển tiến/lùi/trái/phải)
 * 2. Nửa phải màn hình: Touch Look Pan (Vuốt xoay góc nhìn camera Pitch/Yaw) + Chạm nhanh tương tác
 * 3. Nút hành động nhanh: [⚡ Chạy nhanh], [👁️ Xem chi tiết / Tương tác]
 */

// Phát hiện thiết bị cảm ứng
export const isTouchDevice = () => {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    window.matchMedia('(pointer: coarse)').matches ||
    /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
};

// Phân biệt thiết bị mobile/tablet thực thụ so với desktop cảm ứng
export const isMobileDevice = () => {
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const isMobileUA = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  const isSmallScreen = window.matchMedia('(max-width: 900px)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  return isMobileUA || (hasTouch && (isSmallScreen || isCoarse));
};

// Trạng thái người chơi đang trong triển lãm (không bị chặn bởi Menu hay Modal)
let isExploring = false;

export const setExploringState = (active) => {
  isExploring = !!active;
  const touchUI = document.getElementById('mobile-controls-container');
  if (touchUI && isTouchDevice()) {
    touchUI.style.display = isExploring ? 'block' : 'none';
    if (isExploring) {
      setTimeout(() => {
        const hints = document.querySelectorAll('.mobile-zone-hint');
        hints.forEach(h => {
          h.style.opacity = '0';
          h.style.pointerEvents = 'none';
        });
      }, 5000);
    }
  }
};

export const getExploringState = () => isExploring;

// Vector điều khiển di chuyển từ joystick (-1 đến 1)
export const joystickVector = new THREE.Vector2(0, 0);

// Trạng thái chạy nhanh trên mobile
let isSprintingMobile = false;
export const isMobileSprinting = () => isSprintingMobile;

// Cấu hình độ nhạy góc nhìn cảm ứng
const LOOK_SENSITIVITY = 0.0035;
const MAX_PITCH = Math.PI / 2 - 0.08; // Giới hạn không bị lộn ngược camera khi ngửa/cúi

// Biến lưu trạng thái Touch Look
let lookTouchId = null;
let lastLookX = 0;
let lastLookY = 0;
let touchStartTime = 0;
let touchStartX = 0;
let touchStartY = 0;

// Biến lưu trạng thái Joystick
let joystickTouchId = null;
let joystickBaseX = 0;
let joystickBaseY = 0;
const JOYSTICK_MAX_RADIUS = 46; // px

let onMobileTapCallback = null;
export const setMobileTapCallback = (cb) => {
  onMobileTapCallback = cb;
};

/**
 * Khởi tạo hệ thống Touch Controls
 */
export function initTouchControls(camera, controls) {
  if (!isTouchDevice()) return;

  console.info('[TouchControls] Khởi tạo hệ thống điều khiển cảm ứng cho di động');

  // Đảm bảo thứ tự quay của camera cho phép Yaw (Y) trước Pitch (X)
  camera.rotation.order = 'YXZ';

  const leftZone = document.getElementById('mobile-left-zone');
  const rightZone = document.getElementById('mobile-right-zone');
  const joystickBase = document.getElementById('joystick-base');
  const joystickKnob = document.getElementById('joystick-knob');
  const sprintBtn = document.getElementById('mobile-sprint-btn');
  const interactBtn = document.getElementById('mobile-interact-btn');

  // ── 1. VIRTUAL JOYSTICK (NỬA TRÁI) ───────────────────────────
  if (leftZone && joystickBase && joystickKnob) {
    leftZone.addEventListener('touchstart', (e) => {
      if (!isExploring || joystickTouchId !== null) return;
      e.preventDefault();

      const touch = e.changedTouches[0];
      joystickTouchId = touch.identifier;

      // Đặt tâm joystick ngay tại vị trí ngón tay chạm xuống
      joystickBaseX = touch.clientX;
      joystickBaseY = touch.clientY;

      joystickBase.style.left = `${joystickBaseX}px`;
      joystickBase.style.top = `${joystickBaseY}px`;
      joystickBase.style.display = 'block';

      joystickKnob.style.transform = 'translate(-50%, -50%)';
      joystickVector.set(0, 0);
    }, { passive: false });

    leftZone.addEventListener('touchmove', (e) => {
      if (!isExploring || joystickTouchId === null) return;
      e.preventDefault();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === joystickTouchId) {
          const dx = touch.clientX - joystickBaseX;
          const dy = touch.clientY - joystickBaseY;
          const distance = Math.hypot(dx, dy);

          const clampedDistance = Math.min(distance, JOYSTICK_MAX_RADIUS);
          const angle = Math.atan2(dy, dx);

          const knobX = Math.cos(angle) * clampedDistance;
          const knobY = Math.sin(angle) * clampedDistance;

          joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;

          // Chuẩn hóa vector di chuyển (-1 đến 1)
          // dy âm là kéo ngón tay lên phía trước -> nhân vật tiến (y dương)
          joystickVector.x = clampedDistance > 5 ? knobX / JOYSTICK_MAX_RADIUS : 0;
          joystickVector.y = clampedDistance > 5 ? -knobY / JOYSTICK_MAX_RADIUS : 0;
          break;
        }
      }
    }, { passive: false });

    const endJoystick = (e) => {
      if (joystickTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === joystickTouchId) {
          joystickTouchId = null;
          joystickBase.style.display = 'none';
          joystickVector.set(0, 0);
          break;
        }
      }
    };

    leftZone.addEventListener('touchend', endJoystick, { passive: true });
    leftZone.addEventListener('touchcancel', endJoystick, { passive: true });
  }

  const _touchEuler = new THREE.Euler(0, 0, 0, 'YXZ');

  // ── 2. TOUCH LOOK & QUICK TAP (NỬA PHẢI) ─────────────────────
  if (rightZone) {
    rightZone.addEventListener('touchstart', (e) => {
      if (!isExploring || lookTouchId !== null) return;
      e.preventDefault();

      const touch = e.changedTouches[0];
      lookTouchId = touch.identifier;
      lastLookX = touch.clientX;
      lastLookY = touch.clientY;
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = performance.now();
    }, { passive: false });

    rightZone.addEventListener('touchmove', (e) => {
      if (!isExploring || lookTouchId === null) return;
      e.preventDefault();

      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId) {
          const deltaX = touch.clientX - lastLookX;
          const deltaY = touch.clientY - lastLookY;

          // Xoay góc nhìn camera theo chuẩn Quaternion Euler
          _touchEuler.setFromQuaternion(camera.quaternion);
          _touchEuler.y -= deltaX * LOOK_SENSITIVITY;
          _touchEuler.x -= deltaY * LOOK_SENSITIVITY;

          // Khống chế góc ngẩng đầu/cúi đầu
          _touchEuler.x = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, _touchEuler.x));

          camera.quaternion.setFromEuler(_touchEuler);
          camera.updateMatrix();
          camera.updateMatrixWorld();

          lastLookX = touch.clientX;
          lastLookY = touch.clientY;
          break;
        }
      }
    }, { passive: false });

    const endLook = (e) => {
      if (lookTouchId === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === lookTouchId) {
          const elapsed = performance.now() - touchStartTime;
          const dist = Math.hypot(touch.clientX - touchStartX, touch.clientY - touchStartY);

          // Nếu là chạm nhanh (không kéo di chuyển góc nhìn) -> kích hoạt Tap to Interact
          if (elapsed < 300 && dist < 12) {
            if (typeof onMobileTapCallback === 'function') {
              onMobileTapCallback(touch.clientX, touch.clientY);
            }
          }

          lookTouchId = null;
          break;
        }
      }
    };

    rightZone.addEventListener('touchend', endLook, { passive: true });
    rightZone.addEventListener('touchcancel', endLook, { passive: true });
  }

  // ── 3. NÚT CHẠY NHANH (SPRINT) ──────────────────────────────
  if (sprintBtn) {
    const toggleSprint = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      isSprintingMobile = !isSprintingMobile;
      sprintBtn.classList.toggle('active', isSprintingMobile);
    };
    sprintBtn.addEventListener('click', toggleSprint);
    sprintBtn.addEventListener('touchend', toggleSprint);
  }

  // ── 4. NÚT TƯƠNG TÁC NHANH TRÊN MÀN HÌNH ───────────────────
  if (interactBtn) {
    const triggerInteract = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (typeof onMobileTapCallback === 'function') {
        // Tương tác vật thể đang nhắm ngay tâm camera
        onMobileTapCallback(window.innerWidth / 2, window.innerHeight / 2);
      }
    };
    interactBtn.addEventListener('click', triggerInteract);
    interactBtn.addEventListener('touchend', triggerInteract);
  }

  // ── 5. NÚT MENU CHÍNH TRÊN MOBILE ───────────────────────────
  const menuBtn = document.getElementById('mobile-menu-btn');
  if (menuBtn) {
    const handleMenuClick = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      import('./menu.js').then(m => m.showMenu());
    };
    menuBtn.addEventListener('click', handleMenuClick);
    menuBtn.addEventListener('touchend', handleMenuClick);
  }
}

