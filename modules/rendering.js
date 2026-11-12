import * as THREE from "three";
import { updateMovement } from "./movement.js";
import { updateInteraction, isHovering } from "./interaction.js";
import { checkExitTrigger } from "./gates.js";

export const setupRendering = (
  scene,
  camera,
  renderer,
  paintings,
  controls,
  walls
) => {
  const clock = new THREE.Clock();

  let render = function () {
    // Clamp delta time to max 0.1s to prevent frame-spike stuttering or wall tunneling
    const rawDelta = clock.getDelta();
    const delta = Math.min(rawDelta, 0.1);

    updateMovement(delta, controls, camera, walls);
    updateInteraction(camera);
    checkExitTrigger(camera);

    renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;

    renderer.render(scene, camera);
    requestAnimationFrame(render);
  };

  console.info('[render] setupRendering active');
  render();
};