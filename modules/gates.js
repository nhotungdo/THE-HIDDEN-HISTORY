import * as THREE from 'three';
import { interactiveObjects } from './interaction.js';
import { showModal, hideModal } from './ui.js';

let endingShown = false;

export function setupGates(scene) {
    const gateGroup = new THREE.Group();
    scene.add(gateGroup);

    const FLOOR_Y = -Math.PI; // -3.14

    // Antique dark wood material for doors and posts
    const woodMat = new THREE.MeshStandardMaterial({
        color: 0x3d2712, // Indochine dark wood
        roughness: 0.6,
        metalness: 0.1
    });

    // Gold decorative trims
    const goldMat = new THREE.MeshStandardMaterial({
        color: 0xc4a882,
        roughness: 0.4,
        metalness: 0.8
    });

    // ── 1. ENTRANCE GATE (Back Wall: x = 0, z = 19.85) ─────────────
    const entranceGroup = new THREE.Group();

    // Left post
    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 0.3), woodMat);
    leftPost.position.set(-1.8, FLOOR_Y + 2.5, 19.8);
    entranceGroup.add(leftPost);

    // Right post
    const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 0.3), woodMat);
    rightPost.position.set(1.8, FLOOR_Y + 2.5, 19.8);
    entranceGroup.add(rightPost);

    // Header beam
    const headerBeam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.4, 0.35), woodMat);
    headerBeam.position.set(0, FLOOR_Y + 5.2, 19.8);
    entranceGroup.add(headerBeam);

    // Gold trim at the top
    const goldTrim = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, 0.4), goldMat);
    goldTrim.position.set(0, FLOOR_Y + 5.44, 19.8);
    entranceGroup.add(goldTrim);

    // Arched crown plate (Entrance badge)
    const badgeGeo = new THREE.BoxGeometry(1.8, 0.5, 0.1);
    const badgeMesh = new THREE.Mesh(badgeGeo, goldMat);
    badgeMesh.position.set(0, FLOOR_Y + 5.73, 19.8);
    entranceGroup.add(badgeMesh);

    // Closed Door Panels (solid wood panels)
    const doorPanel1 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 5, 0.1), woodMat);
    doorPanel1.position.set(-0.825, FLOOR_Y + 2.5, 19.85);
    entranceGroup.add(doorPanel1);

    const doorPanel2 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 5, 0.1), woodMat);
    doorPanel2.position.set(0.825, FLOOR_Y + 2.5, 19.85);
    entranceGroup.add(doorPanel2);

    // Antique gold door handles
    const handleGeo = new THREE.BoxGeometry(0.05, 0.3, 0.05);
    const handleL = new THREE.Mesh(handleGeo, goldMat);
    handleL.position.set(-0.15, FLOOR_Y + 2.5, 19.92);
    entranceGroup.add(handleL);

    const handleR = new THREE.Mesh(handleGeo, goldMat);
    handleR.position.set(0.15, FLOOR_Y + 2.5, 19.92);
    entranceGroup.add(handleR);

    gateGroup.add(entranceGroup);

    // ── 2. EXIT GATE (Front Wall: x = 10, z = -19.85) ──────────────
    const exitGroup = new THREE.Group();

    // Left post
    const exitLeftPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 0.3), woodMat);
    exitLeftPost.position.set(8.2, FLOOR_Y + 2.5, -19.8);
    exitGroup.add(exitLeftPost);

    // Right post
    const exitRightPost = new THREE.Mesh(new THREE.BoxGeometry(0.3, 5, 0.3), woodMat);
    exitRightPost.position.set(11.8, FLOOR_Y + 2.5, -19.8);
    exitGroup.add(exitRightPost);

    // Header beam
    const exitHeaderBeam = new THREE.Mesh(new THREE.BoxGeometry(3.9, 0.4, 0.35), woodMat);
    exitHeaderBeam.position.set(10, FLOOR_Y + 5.2, -19.8);
    exitGroup.add(exitHeaderBeam);

    // Gold trim
    const exitGoldTrim = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.08, 0.4), goldMat);
    exitGoldTrim.position.set(10, FLOOR_Y + 5.44, -19.8);
    exitGroup.add(exitGoldTrim);

    // EXIT SIGN — MeshBasicMaterial to avoid extra texture unit usage
    // (MeshStandardMaterial with map+emissiveMap = 2 texture slots.
    //  With 16 Cloudinary paintings + floor, we only have 1 slot left.)
    const exitCanvas = document.createElement('canvas');
    exitCanvas.width = 512;
    exitCanvas.height = 128;
    const ctx = exitCanvas.getContext('2d');

    ctx.fillStyle = '#062d1c';
    ctx.fillRect(0, 0, 512, 128);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 8;
    ctx.strokeRect(8, 8, 512 - 16, 128 - 16);

    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.moveTo(35, 64);
    ctx.lineTo(75, 30);
    ctx.lineTo(75, 50);
    ctx.lineTo(125, 50);
    ctx.lineTo(125, 78);
    ctx.lineTo(75, 78);
    ctx.lineTo(75, 98);
    ctx.closePath();
    ctx.fill();

    ctx.font = 'bold 44px "Be Vietnam Pro", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#10b981';
    ctx.fillText('EXIT • LỐI RA', 315, 64);

    // EXIT SIGN — solid emissive green, no texture needed
    const exitSignMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(0x062d1c),
        emissive: new THREE.Color(0x10b981),
        emissiveIntensity: 0.8,
        roughness: 0.3,
        metalness: 0.2,
    });

    const exitSignPlate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.6, 0.1), exitSignMat);
    exitSignPlate.position.set(10, FLOOR_Y + 5.73, -19.8);
    exitGroup.add(exitSignPlate);

    // Open Door Panel 1 (Swing open inwards slightly!)
    const exitDoor1 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 5, 0.1), woodMat);
    exitDoor1.position.set(7.5, FLOOR_Y + 2.5, -19.2);
    exitDoor1.rotation.y = -Math.PI / 4; // Swung open
    exitDoor1.userData = { interactive: true, interactiveName: 'exit_gate' };
    exitDoor1.name = 'exit_gate';
    if (interactiveObjects) interactiveObjects.push(exitDoor1);
    exitGroup.add(exitDoor1);

    // Open Door Panel 2 (Swing open inwards slightly!)
    const exitDoor2 = new THREE.Mesh(new THREE.BoxGeometry(1.65, 5, 0.1), woodMat);
    exitDoor2.position.set(12.5, FLOOR_Y + 2.5, -19.2);
    exitDoor2.rotation.y = Math.PI / 4; // Swung open
    exitDoor2.userData = { interactive: true, interactiveName: 'exit_gate' };
    exitDoor2.name = 'exit_gate';
    if (interactiveObjects) interactiveObjects.push(exitDoor2);
    exitGroup.add(exitDoor2);

    // Portal Bright Glow Background (warm sunlit path simulating outdoors)
    const glowGeo = new THREE.PlaneGeometry(3.3, 5);
    const glowMat = new THREE.MeshBasicMaterial({
        color: 0xffedd5, // Super bright warm orange-cream glow
        side: THREE.DoubleSide
    });
    const glowPlane = new THREE.Mesh(glowGeo, glowMat);
    glowPlane.position.set(10, FLOOR_Y + 2.5, -19.95);
    glowPlane.userData = { interactive: true, interactiveName: 'exit_gate' };
    glowPlane.name = 'exit_gate';
    if (interactiveObjects) interactiveObjects.push(glowPlane);
    exitGroup.add(glowPlane);

    // ── 3. PHYSICAL 3D EXIT BUTTON (Nút bấm cơ học lối ra) ───────────
    const buttonGroup = new THREE.Group();
    buttonGroup.position.set(7.5, FLOOR_Y + 2.2, -19.7); // Đặt bên cạnh tay trái cổng ra rất trực quan

    // Đế gỗ tròn màu tối sẫm
    const baseGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32);
    const baseMesh = new THREE.Mesh(baseGeo, woodMat);
    baseMesh.rotation.x = Math.PI / 2;
    buttonGroup.add(baseMesh);

    // Nút bấm bằng vàng phát sáng cổ vật
    const btnGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 32);
    const btnMesh = new THREE.Mesh(btnGeo, goldMat);
    btnMesh.rotation.x = Math.PI / 2;
    btnMesh.position.z = 0.03;

    // Đăng ký tương tác Raycast trực tiếp trên nút bấm này
    btnMesh.userData = { interactive: true, interactiveName: 'exit_gate' };
    btnMesh.name = 'exit_gate';
    if (interactiveObjects) {
        interactiveObjects.push(btnMesh);
    }
    buttonGroup.add(btnMesh);

    exitGroup.add(buttonGroup);

    gateGroup.add(exitGroup);
}

export function checkExitTrigger(camera) {
    // Tự động hóa khoảng cách đã bị gỡ bỏ theo yêu cầu để tránh kích hoạt ngoài ý muốn.
    // Thay vào đó, người chơi sử dụng ngắm bắn Raycast và giữ chuột trái trực tiếp trên Cổng ra.
}

export function triggerEndingModal() {
    const html = `
      <div class="modal-tag">KẾT THÚC HÀNH TRÌNH THAM QUAN</div>
      <h2 class="modal-artwork-title">VIỆT NAM: 30 NĂM KHÁNG CHIẾN (1945–1975)</h2>
      <p class="modal-meta">Thông Điệp Bế Mạc · Phòng Triển Lãm Lịch Sử 3D</p>
      <div class="modal-divider"></div>
      <div class="modal-quote-wrapper">
        <blockquote class="modal-quote" style="text-align: center; margin: 1.5rem auto; line-height: 1.8; max-width: 620px;">
          "Không có gì quý hơn độc lập, tự do. Nước độc lập muốn thật sự là nước độc lập thì dân cũng phải đứng dậy tự giải phóng lấy mình."
        </blockquote>
      </div>
      <div class="ending-modal-content">
        <p class="ending-message">
          Xin chân thành cảm ơn Quý khách đã dành thời gian khám phá không gian triển lãm lịch sử 3D.<br>
          Trải qua hai cuộc kháng chiến trường kỳ chống thực dân Pháp (1945–1954) và đế quốc Mỹ (1954–1975), toàn thể dân tộc Việt Nam đã hun đúc nên ý chí kiên cường bất khuất, giành lại nền độc lập, tự do và thống nhất vẹn toàn non sông.
        </p>
        <div class="ending-btn-group">
          <button id="btn_resume_tour" class="btn-gallery-secondary">
            TIẾP TỤC THAM QUAN ↺
          </button>
          <button id="btn_exit_to_menu" class="btn-gallery-primary">
            RỜI TRIỂN LÃM &amp; QUAY VỀ MENU ➔
          </button>
        </div>
      </div>
    `;

    showModal(html);

    // Hook events (defer so DOM is in place after showModal).
    setTimeout(() => {
        const resumeBtn = document.getElementById('btn_resume_tour');
        if (resumeBtn) {
            resumeBtn.addEventListener('click', () => {
                hideModal();

                // Allow another trigger after cooldown
                setTimeout(() => {
                    endingShown = false;
                }, 10000);
            });
        }

        const exitBtn = document.getElementById('btn_exit_to_menu');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => {
                // Redirect/Reload the page to naturally return to the gorgeous AAA Landing Page menu
                location.reload();
            });
        }
    }, 100);
}