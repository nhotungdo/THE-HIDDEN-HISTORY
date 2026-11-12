import { keysPressed, resetVelocity } from "./movement.js";
import { showMenu, hideMenu } from "./menu.js";
import { toggleAudio, startAudio, stopAudio, setVolume, playWingTrack } from "./audioGuide.js";
import { toggleLights } from "./lighting.js";

let lockPointer = true;
let showMenuOnUnlock = false;

export function clearAllMovementKeys() {
  keysPressed.w = false;
  keysPressed.a = false;
  keysPressed.s = false;
  keysPressed.d = false;
  keysPressed.ArrowUp = false;
  keysPressed.ArrowDown = false;
  keysPressed.ArrowLeft = false;
  keysPressed.ArrowRight = false;
  keysPressed.sprint = false;
  resetVelocity();
}

// add the controls parameter which is the pointer lock controls and is passed from main.js where setupEventListeners is called
const DEFAULT_KEYS = {
  toggleLights: 'l',
  toggleAudio: 'k',
  toggleMouse: ' ',
  inspectObject: 't',
  showMenu: 'm',
  sprint: 'Shift'
};

// Initialize global customKeys from localStorage or defaults
window.customKeys = (() => {
  try {
    const saved = localStorage.getItem('hcm_gallery_keys');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.sprint) {
        parsed.sprint = 'Shift';
      }
      return parsed;
    }
  } catch (e) {
    console.error('Error loading custom keys from localStorage:', e);
  }
  return { ...DEFAULT_KEYS };
})();

export const updateHUDKeys = () => {
  const keys = window.customKeys;

  const lLabel = document.querySelector('.key-lights-label');
  const aLabel = document.querySelector('.key-audio-label');
  const iLabel = document.querySelector('.key-inspect-label');
  const mLabel = document.querySelector('.key-menu-label');
  const sLabel = document.querySelector('.key-sprint-label');

  const formatKey = (key) => key === ' ' ? 'SPACE' : key.toUpperCase();

  if (lLabel) lLabel.innerText = `${formatKey(keys.toggleLights)}:`;
  if (aLabel) aLabel.innerText = `${formatKey(keys.toggleAudio)}:`;
  if (iLabel) iLabel.innerText = `${formatKey(keys.inspectObject)}:`;
  if (mLabel) mLabel.innerText = `${formatKey(keys.showMenu)}:`;
  if (sLabel) sLabel.innerText = `${formatKey(keys.sprint)}:`;

  // Also update instructions modal
  const kbdMenu = document.getElementById('kbd_showMenu');
  const kbdLights = document.getElementById('kbd_toggleLights');
  const kbdAudio = document.getElementById('kbd_toggleAudio');
  const kbdInspect = document.getElementById('kbd_inspectObject');
  const kbdMouse = document.getElementById('kbd_toggleMouse');
  const kbdSprint = document.getElementById('kbd_sprint');

  if (kbdMenu) kbdMenu.innerText = formatKey(keys.showMenu);
  if (kbdLights) kbdLights.innerText = formatKey(keys.toggleLights);
  if (kbdAudio) kbdAudio.innerText = formatKey(keys.toggleAudio);
  if (kbdInspect) kbdInspect.innerText = formatKey(keys.inspectObject);
  if (kbdMouse) kbdMouse.innerText = formatKey(keys.toggleMouse);
  if (kbdSprint) kbdSprint.innerText = formatKey(keys.sprint);
};

export const setupEventListeners = (controls, camera, scene) => {
  // Keep lockPointer in sync with actual pointer-lock state
  document.addEventListener('pointerlockchange', () => {
    lockPointer = !!document.pointerLockElement;
  });

  // Update HUD key labels at startup
  updateHUDKeys();

  // add the event listeners to the document which is the whole page
  document.addEventListener(
    "keydown",
    (event) => onKeyDown(event, controls),
    false
  );
  document.addEventListener(
    "keyup",
    (event) => onKeyUp(event, controls),
    false
  );

  // Auto-clear stuck keys when tab loses focus or page hides
  window.addEventListener("blur", clearAllMovementKeys);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) clearAllMovementKeys();
  });

  controls.addEventListener("unlock", () => {
    clearAllMovementKeys();
    if (showMenuOnUnlock) {
      showMenu();
    }
    showMenuOnUnlock = false;
  });

  // Add event listeners for the unified HUD control buttons
  const toggleAudioBtn = document.getElementById("btn_toggle_audio") || document.getElementById("toggle_audio");
  if (toggleAudioBtn) {
    toggleAudioBtn.addEventListener("click", (e) => {
      e.currentTarget.blur(); // Hủy focus để Spacebar không kích hoạt nhầm
      toggleAudio();
    });
  }

  const toggleLightBtn = document.getElementById("toggle_light");
  if (toggleLightBtn) {
    toggleLightBtn.addEventListener("click", (e) => {
      e.currentTarget.blur(); // Hủy focus
      toggleLights();
    });
  }

  // Volume Slider Event
  const volumeSlider = document.getElementById("volume_slider");
  if (volumeSlider) {
    volumeSlider.addEventListener("input", (e) => {
      const vol = parseFloat(e.target.value);
      setVolume(vol);
    });
    volumeSlider.addEventListener("change", (e) => {
      e.target.blur(); // Hủy focus sau khi kéo xong
    });
  }

  // Dropdown Toggle Event
  const dropdownToggle = document.getElementById("btn_dropdown_toggle");
  const dropdownMenu = document.getElementById("track_dropdown_menu");
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click sủi bọt
      e.currentTarget.blur(); // Hủy focus
      dropdownMenu.style.display = dropdownMenu.style.display === "none" ? "block" : "none";
    });

    // Tự động đóng dropdown khi click ra ngoài
    document.addEventListener("click", () => {
      dropdownMenu.style.display = "none";
    });
  }

  // Chọn track trong Dropdown Menu
  const dropdownItems = document.querySelectorAll(".dropdown-item");
  dropdownItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation(); // Ngăn sự kiện click sủi bọt
      e.currentTarget.blur(); // Hủy focus
      const index = parseInt(e.currentTarget.getAttribute("data-index"));
      playWingTrack(index);
      if (dropdownMenu) dropdownMenu.style.display = "none"; // Tự động đóng menu sau khi chọn bài
    });
  });
};

// toggle the pointer lock
function togglePointerLock(controls) {
  if (lockPointer) {
    controls.lock();
  } else {
    showMenuOnUnlock = false;
    controls.unlock();
  }
  lockPointer = !lockPointer; // toggle the lockPointer variable
}

function onKeyDown(event, controls) {
  // If user is focusing on an input (rebind input), do not trigger gameplay actions!
  if (document.activeElement && document.activeElement.tagName === 'INPUT') {
    return;
  }

  const code = event.code || '';
  const key = event.key ? event.key.toLowerCase() : '';

  // ── WASD & Arrow Movement (Supports CapsLock, Shift, and Vietnamese Telex like w->ư, a->â, d->đ)
  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'ư' || key === 'arrowup') {
    keysPressed.w = true;
    keysPressed.ArrowUp = true;
  }
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
    keysPressed.s = true;
    keysPressed.ArrowDown = true;
  }
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'â' || key === 'ă' || key === 'arrowleft') {
    keysPressed.a = true;
    keysPressed.ArrowLeft = true;
  }
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'đ' || key === 'arrowright') {
    keysPressed.d = true;
    keysPressed.ArrowRight = true;
  }

  const keys = window.customKeys || DEFAULT_KEYS;
  const sprintKey = (keys.sprint || 'Shift').toLowerCase();

  // Tăng tốc di chuyển (Chạy / Sprint)
  if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift' || key === sprintKey) {
    keysPressed.sprint = true;
  }

  if (event.key === "Escape") {
    clearAllMovementKeys();
    showMenu();
  }

  // Phím tắt Bật/Tắt Đèn
  if (keys.toggleLights && (key === keys.toggleLights.toLowerCase() || code === `Key${keys.toggleLights.toUpperCase()}`)) {
    toggleLights();
  }

  // Phím tắt Bật/Tắt Nhạc
  if (keys.toggleAudio && (key === keys.toggleAudio.toLowerCase() || code === `Key${keys.toggleAudio.toUpperCase()}`)) {
    toggleAudio();
  }

  // if key pressed is enter or return for mac
  if (event.key === "Enter" || event.key === "Return") {
    hideMenu();
    controls.lock();
    lockPointer = true;
  }

  // Khóa / nhả chuột
  if (keys.toggleMouse && (key === keys.toggleMouse.toLowerCase() || (keys.toggleMouse === ' ' && code === 'Space'))) {
    togglePointerLock(controls);
  }

  // Mở menu chính
  if (keys.showMenu && (key === keys.showMenu.toLowerCase() || code === `Key${keys.showMenu.toUpperCase()}`)) {
    clearAllMovementKeys();
    showMenu();
  }

  if (key === "r" && !event.ctrlKey && !event.metaKey) {
    location.reload();
  }
}

function onKeyUp(event, controls) {
  const code = event.code || '';
  const key = event.key ? event.key.toLowerCase() : '';

  // ── WASD & Arrow Release
  if (code === 'KeyW' || code === 'ArrowUp' || key === 'w' || key === 'ư' || key === 'arrowup') {
    keysPressed.w = false;
    keysPressed.ArrowUp = false;
  }
  if (code === 'KeyS' || code === 'ArrowDown' || key === 's' || key === 'arrowdown') {
    keysPressed.s = false;
    keysPressed.ArrowDown = false;
  }
  if (code === 'KeyA' || code === 'ArrowLeft' || key === 'a' || key === 'â' || key === 'ă' || key === 'arrowleft') {
    keysPressed.a = false;
    keysPressed.ArrowLeft = false;
  }
  if (code === 'KeyD' || code === 'ArrowRight' || key === 'd' || key === 'đ' || key === 'arrowright') {
    keysPressed.d = false;
    keysPressed.ArrowRight = false;
  }

  const keys = window.customKeys || DEFAULT_KEYS;
  const sprintKey = (keys.sprint || 'Shift').toLowerCase();
  if (code === 'ShiftLeft' || code === 'ShiftRight' || key === 'shift' || key === sprintKey) {
    keysPressed.sprint = false;
  }
}

document.getElementById("toggle-info").addEventListener("click", () => {
  document.getElementById("info-panel").classList.toggle("collapsed");
  document.getElementById("toggle-info").innerText = document
    .getElementById("info-panel")
    .classList.contains("collapsed")
    ? "Hiện"
    : "Ẩn";
});

document.getElementById("about_button").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.add("show");
});

document.getElementById("close-about").addEventListener("click", function () {
  document.getElementById("about-overlay").classList.remove("show");
});
