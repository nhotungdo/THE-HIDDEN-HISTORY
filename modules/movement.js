import * as THREE from 'three';
import { deskBox } from './office.js';

// Keys tracked by modules/eventListeners.js.
// Supporting WASD, Arrow keys, Vietnamese Telex (w -> ư, etc.), and Sprint.
export const keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  sprint: false,
};

// Movement physics parameters
const WALK_SPEED = 5.2;     // Tốc độ tham quan bảo tàng (m/s)
const SPRINT_SPEED = 9.0;   // Tốc độ chạy nhanh (m/s)
const ACCELERATION = 14.0;  // Hệ số tăng tốc mượt mà (responsive acceleration)
const DECELERATION = 11.0;  // Hệ số hãm quán tính tự nhiên (gentle footsteps damping)

// Velocity vector (x = right/left, y = forward/back relative to camera view)
const currentVelocity = new THREE.Vector2(0, 0);

// Room boundaries — walls are at x = ±20, z = ±20
const ROOM_MIN_X = -18.2;
const ROOM_MAX_X = 18.2;
const ROOM_MIN_Z = -18.2;
const ROOM_MAX_Z = 18.2;

// Camera eye level in gallery (y = 2.2)
const CAMERA_HEIGHT = 2.2;

// Reusable vectors to avoid per-frame GC allocations
const _playerBox = new THREE.Box3();
const _playerCenter = new THREE.Vector3();
const _playerSize = new THREE.Vector3(0.8, 1.8, 0.8);

/**
 * Reset movement velocity to 0 (called on menu open or window blur)
 */
export function resetVelocity() {
  currentVelocity.set(0, 0);
}

/**
 * Check if a given position collides with any room wall
 */
export const checkCollision = (camera, walls) => {
  if (!walls || !walls.children) return false;
  camera.getWorldPosition(_playerCenter);
  _playerBox.setFromCenterAndSize(_playerCenter, _playerSize);

  for (let i = 0; i < walls.children.length; i++) {
    const wall = walls.children[i];
    if (wall.BoundingBox && _playerBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }
  return false;
};

/**
 * Internal check if position collides with room walls
 */
function collidesWithWalls(pos, walls) {
  if (!walls || !walls.children) return false;
  _playerBox.setFromCenterAndSize(pos, _playerSize);

  for (let i = 0; i < walls.children.length; i++) {
    const wall = walls.children[i];
    if (wall.BoundingBox && _playerBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }
  return false;
}

/**
 * Check collision with historical desk in the middle of room
 */
function collidesWithDesk(pos) {
  if (!deskBox || deskBox.isEmpty()) return false;
  _playerBox.setFromCenterAndSize(pos, _playerSize);
  return _playerBox.intersectsBox(deskBox);
}

/**
 * Main movement update loop with smooth acceleration, inertia damping,
 * and 2-axis wall sliding collision.
 */
export const updateMovement = (delta, controls, camera, walls) => {
  if (!controls || !controls.isLocked) {
    currentVelocity.set(0, 0);
    return;
  }

  // 1. Gather input from tracked keys
  let forwardInput = 0;
  let rightInput = 0;

  if (keysPressed.w || keysPressed.ArrowUp) forwardInput += 1;
  if (keysPressed.s || keysPressed.ArrowDown) forwardInput -= 1;
  if (keysPressed.d || keysPressed.ArrowRight) rightInput += 1;
  if (keysPressed.a || keysPressed.ArrowLeft) rightInput -= 1;

  // 2. Normalize input direction (prevents faster diagonal movement)
  const inputMagnitude = Math.hypot(rightInput, forwardInput);
  if (inputMagnitude > 0) {
    rightInput /= inputMagnitude;
    forwardInput /= inputMagnitude;
  }

  // 3. Compute target velocity
  const isSprinting = !!keysPressed.sprint;
  const targetSpeed = isSprinting ? SPRINT_SPEED : WALK_SPEED;
  const targetVelX = rightInput * targetSpeed;
  const targetVelY = forwardInput * targetSpeed;

  // 4. Smooth exponential acceleration / deceleration (framerate independent)
  const rate = inputMagnitude > 0 ? ACCELERATION : DECELERATION;
  const factor = 1 - Math.exp(-rate * delta);

  currentVelocity.x += (targetVelX - currentVelocity.x) * factor;
  currentVelocity.y += (targetVelY - currentVelocity.y) * factor;

  // Snap tiny floating point values to 0
  if (Math.abs(currentVelocity.x) < 0.0005) currentVelocity.x = 0;
  if (Math.abs(currentVelocity.y) < 0.0005) currentVelocity.y = 0;

  // If completely idle, skip position updates
  if (currentVelocity.x === 0 && currentVelocity.y === 0) {
    camera.position.y = CAMERA_HEIGHT;
    return;
  }

  // 5. Measure desired camera displacement in world coordinates
  const startX = camera.position.x;
  const startZ = camera.position.z;

  controls.moveRight(currentVelocity.x * delta);
  controls.moveForward(currentVelocity.y * delta);

  const desiredX = camera.position.x;
  const desiredZ = camera.position.z;

  // Reset to start position to test each world axis independently (Wall Sliding)
  camera.position.x = startX;
  camera.position.z = startZ;

  const deltaWorldX = desiredX - startX;
  const deltaWorldZ = desiredZ - startZ;

  // ── 6. Test World X Axis Movement ──────────────────────────
  if (deltaWorldX !== 0) {
    camera.position.x += deltaWorldX;
    // Room boundary clamp
    if (camera.position.x < ROOM_MIN_X) {
      camera.position.x = ROOM_MIN_X;
    } else if (camera.position.x > ROOM_MAX_X) {
      camera.position.x = ROOM_MAX_X;
    }
    // Obstacle collision check (walls & desk)
    if (collidesWithWalls(camera.position, walls) || collidesWithDesk(camera.position)) {
      camera.position.x = startX; // Revert X only — allows sliding freely along Z!
    }
  }

  // ── 7. Test World Z Axis Movement ──────────────────────────
  if (deltaWorldZ !== 0) {
    camera.position.z += deltaWorldZ;
    // Room boundary clamp
    if (camera.position.z < ROOM_MIN_Z) {
      camera.position.z = ROOM_MIN_Z;
    } else if (camera.position.z > ROOM_MAX_Z) {
      camera.position.z = ROOM_MAX_Z;
    }
    // Obstacle collision check (walls & desk)
    if (collidesWithWalls(camera.position, walls) || collidesWithDesk(camera.position)) {
      camera.position.z = startZ; // Revert Z only — allows sliding freely along X!
    }
  }

  // ── 8. Lock Eye Level Height (Zero vertical wobble) ─────────
  camera.position.y = CAMERA_HEIGHT;
};
