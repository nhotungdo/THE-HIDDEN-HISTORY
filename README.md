<div align="center">

  <h1>🇻🇳 VIỆT NAM: 30 NĂM KHÁNG CHIẾN (1945–1975)</h1>
  <h3>Không Gian Triển Lãm Lịch Sử Số Hóa 3D — 3D Virtual Art & History Gallery</h3>

  <p>
    Khám phá hai cuộc kháng chiến trường kỳ và vĩ đại của dân tộc Việt Nam qua không gian thực tế ảo ba chiều tương tác trực quan, sống động.
  </p>

  <p>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-4.3+-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"></a>
    <a href="https://threejs.org/"><img src="https://img.shields.io/badge/Three.js-0.151+-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js"></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Deploy-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
    <img src="https://img.shields.io/badge/License-MIT-blue.style=for-the-badge?style=for-the-badge" alt="License">
  </p>

</div>

---

## 📌 Mục Lục

- [Giới Thiệu Dự Án](#-giới-thiệu-dự-án)
- [Tính Năng Nổi Bật](#-tính-năng-nổi-bật)
- [Nội Dung Trưng Bày Lịch Sử](#-nội-dung-trưng-bày-lịch-sử)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Hệ Thống Phím Điều Khiển](#-hệ-thống-phím-điều-khiển)
- [Cấu Trúc Thư Mục](#-cấu-trúc-thư-mục)
- [Cài Đặt & Khởi Chạy](#-cài-đặt--khởi-chạy)
- [Triển Khai Lên Vercel](#-triển-khai-lên-vercel)
- [Giấy Phép](#-giấy-phép)

---

## 🌟 Giới Thiệu Dự Án

**Việt Nam: 30 Năm Kháng Chiến (1945–1975)** là một ứng dụng bảo tàng thực tế ảo 3D chạy trực tiếp trên nền web. Dự án tái hiện chân thực không gian phòng trưng bày nghệ thuật lịch sử, cho phép người học và khách tham quan tự do di chuyển góc nhìn thứ nhất (First-Person Perspective), chiêm ngưỡng các tư liệu hình ảnh quý giá và lắng nghe những âm hưởng hào hùng của lịch sử giải phóng dân tộc.

Dự án phục vụ học tập, nghiên cứu môn **Lịch sử Đảng Cộng sản Việt Nam (VNR202)** kết hợp cùng kỹ thuật lập trình đồ họa tương tác hiện đại.

---

## ✨ Tính Năng Nổi Bật

- **Không gian 3D Chân Thực:** Xây dựng bằng **Three.js** với hệ thống sàn gỗ phản chiếu ánh sáng, tường bao 4 chiều, ánh sáng điểm (Spotlight) chiếu trực diện từng bức tranh.
- **Tương Tác Hiện Vật Đa Dạng:**
  - 📻 **Đài Radio Cổ Điển:** Phát bản ghi âm gốc *Tuyên ngôn Độc lập ngày 02/09/1945* của Chủ tịch Hồ Chí Minh.
  - ⌨️ **Máy Đánh Chữ & Bàn Làm Việc:** Hiệu ứng âm thanh gõ phím chân thực khi tương tác.
  - 🏛️ **Tượng Bác Hồ & Phù Điêu Lịch Sử:** Mô hình 3D tỉ mỉ tái hiện không gian trang nghiêm.
  - 🚪 **Cổng Ra Vào (Entrance & Exit Gate):** Hiệu ứng giữ phím để kết thúc chuyến tham quan (*Hold to exit*).
- **Hồ Sơ Tư Liệu Chi Tiết:** Tâm ngắm kính lúp (Reticle) tự động bắt tiêu điểm khi nhìn vào tranh; click để mở hồ sơ phân tích chuyên sâu gồm: *Thời gian, Bối cảnh, Diễn biến, Kết quả, Ý nghĩa lịch sử & Trích dẫn tiêu biểu*.
- **Âm Thanh & Audio Guide Sống Động:** Nhạc nền nhẹ nhàng kết hợp các ca khúc lịch sử bất hủ (*The Ballad of Ho Chi Minh*, *Người là niềm tin tất thắng*, *Đêm nghe hát đò đưa nhớ Bác*...).
- **Tùy Biến Điều Khiển & Lưu Trữ:** Cho phép tùy chỉnh bàn phím trong bảng Cài đặt và tự động lưu vào `localStorage`.
- **Hỗ Trợ Thực Tế Ảo (WebXR/VR):** Sẵn sàng trải nghiệm qua kính VR tương thích.

---

## 🏛️ Nội Dung Trưng Bày Lịch Sử

Phòng triển lãm chia làm 2 giai đoạn lịch sử hào hùng qua 16 tác phẩm tư liệu được bố trí trên các diện tường:

| Khu Vực | Giai Đoạn | Các Sự Kiện & Tranh Tiêu Biểu |
| :--- | :--- | :--- |
| **Tường Mặt Trước & Trái** | **Kháng chiến chống thực dân Pháp (1945–1954)** | • Bác Hồ đọc *Tuyên ngôn Độc lập* tại Quảng trường Ba Đình (1945)<br>• Chiến thắng *Việt Bắc Thu - Đông 1947*<br>• Chiến dịch *Biên giới Thu - Đông 1950*<br>• Chiến dịch lịch sử *Điện Biên Phủ "lừng lẫy năm châu" (1954)* |
| **Tường Phải & Mặt Sau** | **Kháng chiến chống đế quốc Mỹ (1954–1975)** | • Phong trào *Đồng Khởi Bến Tre (1960)*<br>• Mở đường mòn *Hồ Chí Minh huyền thoại*<br>• Tổng tiến công và nổi dậy *Tết Mậu Thân (1968)*<br>• Chiến thắng *Hà Nội - Điện Biên Phủ trên không (1972)*<br>• Đại thắng mùa Xuân - *Chiến dịch Hồ Chí Minh (1975)* |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend Core:** HTML5, CSS3 hiện đại, Vanilla JavaScript (ES Modules).
- **Đồ Họa 3D:** [Three.js](https://threejs.org/) (r151), [three-stdlib](https://github.com/pmndrs/three-stdlib) (GLTFLoader, OrbitControls, PointerLockControls).
- **Build Tool:** [Vite 4.x](https://vitejs.dev/) — Tối ưu bundle size, hot reload tức thì.
- **Tài Nguyên 3D & Âm Thanh:** GLTF/GLB models, HDR Environment Maps, Web Audio API.
- **Deployment Platform:** [Vercel](https://vercel.com/) với CDN Caching tối ưu hóa cho tài nguyên tĩnh dung lượng cao.

---

## 🎮 Hệ Thống Phím Điều Khiển

| Phím | Thao Tác | Mô Tả |
| :---: | :--- | :--- |
| <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> / <kbd>↑</kbd> <kbd>←</kbd> <kbd>↓</kbd> <kbd>→</kbd> | **Di Chuyển** | Tiến, lùi, di chuyển sang trái và phải |
| <kbd>Shift</kbd> | **Chạy Nhanh** | Tăng tốc độ di chuyển trong phòng trưng bày |
| **Chuột (Mouse)** | **Góc Nhìn** | Xoay hướng nhìn 360° theo góc nhìn thứ nhất |
| **Chuột Trái / Click** | **Tương Tác** | Xem chi tiết tranh / bật radio / gõ máy chữ |
| <kbd>Space</kbd> | **Khóa Chuột** | Bật / tắt chế độ khóa con trỏ chuột (Pointer Lock) |
| <kbd>L</kbd> | **Bật/Tắt Đèn** | Bật hoặc tắt hệ thống đèn chiếu sáng triển lãm |
| <kbd>K</kbd> | **Âm Thanh** | Bật / tạm dừng nhạc nền và thuyết minh |
| <kbd>M</kbd> / <kbd>ESC</kbd> | **Menu & Cài Đặt** | Mở bảng điều khiển, cài đặt phím hoặc thoát |

*(Các phím có thể được cá nhân hóa trong menu **Cài đặt** của ứng dụng).*

---

## 📂 Cấu Trúc Thư Mục

```text
history-art-gallery/
├── components/             # Các thành phần HTML modal & overlay giao diện
│   ├── about-modal.html    # Giới thiệu thông tin đề tài & thành viên
│   ├── exit-progress.html  # Thanh tiến trình giữ phím thoát
│   ├── intro-menu.html     # Menu mở đầu triển lãm
│   └── settings-modal.html # Modal cài đặt phím & âm lượng
├── js/
│   └── loadComponents.js   # Script nạp các component & khởi tạo
├── modules/                # Toàn bộ module logic Three.js
│   ├── audioGuide.js       # Quản lý nhạc nền & âm thanh không gian
│   ├── gates.js            # Cổng ra vào triển lãm
│   ├── interaction.js      # Raycasting & xử lý tương tác vật thể
│   ├── movement.js         # Xử lý di chuyển & va chạm (Collision)
│   ├── paintingData.js     # Dữ liệu 16 bức tranh lịch sử
│   ├── paintings.js        # Khởi tạo tranh & khung tranh 3D
│   ├── scene.js            # Khởi tạo Camera, Scene, Renderer
│   ├── ui.js               # Quản lý HUD & popup hồ sơ hiện vật
│   └── walls.js            # Dựng tường, sàn và trần nhà
├── public/                 # Tài nguyên tĩnh (3D Models, Textures, Sounds)
│   ├── img/                # Ảnh texture tường, sàn, cờ
│   ├── models2/            # Mô hình 3D GLB (Radio, đèn, bàn, máy chữ)
│   ├── sounds/             # Âm thanh hiệu ứng & bản thu âm lịch sử
│   └── textures/           # HDR Map môi trường
├── index.html              # Trang chủ ứng dụng
├── main.js                 # Entry point chính kết nối các module
├── style.css               # Phong cách thiết kế bảo tàng cổ điển sang trọng
├── vercel.json             # File cấu hình deploy Vercel (Routing & CDN Caching)
└── vite.config.js          # Cấu hình Vite build tool
```

---

## 🚀 Cài Đặt & Khởi Chạy

### Yêu Cầu Hệ Thống
- Đã cài đặt **[Node.js](https://nodejs.org/)** (khuyến nghị phiên bản 18 trở lên).
- Trình duyệt web hiện đại hỗ trợ WebGL (Chrome, Edge, Firefox, Safari).

### Các Bước Thực Hiện

1. **Clone repository về máy:**
   ```bash
   git clone https://github.com/nhotungdo/history-art-gallery.git
   cd history-art-gallery
   ```

2. **Cài đặt các thư viện phụ thuộc:**
   ```bash
   npm install
   ```

3. **Khởi chạy môi trường phát triển (Development):**
   ```bash
   npm run dev
   ```
   Mở trình duyệt và truy cập: `http://localhost:5173/`

4. **Đóng gói phiên bản Production:**
   ```bash
   npm run build
   ```
   Thư mục đóng gói `dist/` sẽ sẵn sàng để đưa lên bất kỳ server hoặc nền tảng lưu trữ tĩnh nào.

5. **Chạy thử bản đóng gói (Preview):**
   ```bash
   npm run preview
   ```

---

## 🌐 Triển Khai Lên Vercel

Dự án đã được cấu hình sẵn file `vercel.json` tối ưu cho Vite Single Page Application và bộ nhớ đệm Cache-Control cho các tệp đồ họa/âm thanh lớn.

### Cách 1: Triển khai tự động qua GitHub (Khuyên dùng)
1. Đẩy code lên GitHub:
   ```bash
   git add .
   git commit -m "feat: complete 3d exhibition project"
   git push origin main
   ```
2. Truy cập [Vercel](https://vercel.com/) và chọn **Add New...** ➔ **Project**.
3. Chọn repo `history-art-gallery` và bấm **Deploy**.

### Cách 2: Triển khai trực tiếp bằng Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

---

## 📜 Giấy Phép

Phát hành dưới giấy phép [MIT License](LICENSE). Dự án được xây dựng vì mục đích giáo dục, tôn vinh truyền thống lịch sử vẻ vang của dân tộc Việt Nam.
