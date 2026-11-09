# Mật Mã Thời Gian — VNR202

Game lịch sử React + TypeScript + Vite, 5 chương / 15 nhiệm vụ. Không cần tài khoản hay database.

## Chạy dự án

Yêu cầu Node.js 22.12+ hoặc 24, npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Tính năng

- 12 màn hình: trang chủ → hướng dẫn → hồ sơ → cốt truyện → bản đồ → giới thiệu chương → phòng chơi → kết quả → bộ sưu tập → thư viện → kết thúc → chứng nhận.
- 5 mini game: sắp xếp bằng nút ↑/↓, ghép hồ sơ, đọc manh mối, đặt ghim trên sa bàn và đúng/sai. Điều khiển bằng chuột, chạm hoặc bàn phím.
- 100 điểm/nhiệm vụ, mỗi gợi ý trừ 10 điểm (tối đa 2 mức). Thử thách 180 giây/nhiệm vụ; thưởng 5 điểm mỗi 10 giây còn lại. Cần giải đúng cả 3 nhiệm vụ để hoàn thành chương.
- Tiến độ hoàn thành, điểm, mảnh ký ức và mã chứng nhận lưu trong LocalStorage. Đáp án đang làm, gợi ý và đồng hồ lưu trong SessionStorage, tiếp tục được khi tải lại trong cùng tab. Xóa dữ liệu trình duyệt sẽ mất tiến độ.
- Chơi lại thay kết quả từng nhiệm vụ, không cộng dồn điểm cũ. Điểm tốt nhất của chương giữ riêng. Chứng nhận dùng tổng điểm hiện tại và mã cấp lần đầu.
- Thư viện tìm kiếm không dấu, lọc theo năm, đọc lời giải và nguồn. Chứng nhận PNG 1920×1080; không phải chứng chỉ chính thức của FPT.
- Âm thanh tổng hợp bằng Web Audio, không yêu cầu tải file âm thanh ngoài.

## Cố vấn lịch sử

Gợi ý trong lúc giải dùng JSON để bảo đảm quy tắc điểm. Hỏi đáp/giải thích mở sau khi giải đúng nhiệm vụ. Nếu API không có hoặc lỗi, hiển thị rõ phần tư liệu biên soạn sẵn thay vì giả vờ trả lời AI.

`api/history-guide.mjs` là hàm serverless cho Vercel. Cấu hình `GEMINI_API_KEY` và `GEMINI_MODEL` trong môi trường máy chủ; không đặt khóa trong biến `VITE_*` hay frontend. Chọn model còn hoạt động trong tài khoản của bạn theo [tài liệu Gemini](https://ai.google.dev/api?hl=en). `npm run dev` chỉ chạy frontend và dùng fallback; kiểm tra API bằng môi trường Vercel khi đã cấu hình. API có timeout, giới hạn câu hỏi 500 ký tự và chỉ nạp tư liệu từ dữ liệu máy chủ.

Chưa gọi Gemini thật trong lần triển khai này vì chưa có cấu hình tài khoản. 6 kiểm tra API dùng phản hồi giả lập, không tiêu tốn API.

## Triển khai

Import repository vào Vercel, framework Vite, build `npm run build`, output `dist`. `vercel.json` xử lý tải trực tiếp các route SPA và đóng gói dữ liệu cho hàm API. Có thể chỉ deploy `dist` lên static hosting khác với fallback về `index.html`; khi đó cố vấn dùng dữ liệu có sẵn.

Chưa deploy lên hosting trong phiên này. Không có service worker: cần mạng để tải ứng dụng lần đầu; việc không cần database không đồng nghĩa hỗ trợ khởi động offline.

## Kiểm chứng

`npm test`: 40 kiểm tra dữ liệu/logic (15 câu đố, đáp án sai, khóa chương, hoàn thành 5 chương, gửi trùng, tính điểm, storage, canvas chứng nhận) và 6 kiểm tra API. Browser smoke test: tạo hồ sơ → chương 1 → trả lời 3 nhiệm vụ → kết quả 300 điểm, tải lại tiếp tục nhiệm vụ tiếp theo. Đã quan sát giao diện desktop trang chủ và màn kết quả ở khung hẹp.

Các hiệu ứng điện ảnh, ảnh tư liệu có bản quyền, đọc thuyết minh và mô hình cổ vật 3D trong bản định hướng chưa được sản xuất; hiện dùng SVG/CSS, emoji và tư liệu chữ. Nội dung lịch sử kế thừa từ bản nháp cần được giảng viên rà soát trước khi dùng làm học liệu chính thức.

Xem [plan và trạng thái triển khai](docs/implementation_plan_vnr202.md).
