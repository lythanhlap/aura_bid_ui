# UI Design Specification - Sàn Đấu Giá Trực Tuyến (Auction Platform)

## 1. Tổng Quan & Triết Lý Thiết Kế (Overview & Design Philosophy)
Dự án nhằm xây dựng giao diện web React hiện đại, đẳng cấp thế giới cho sàn đấu giá trực tuyến chuyên nghiệp. Giao diện được thiết kế theo phong cách **Obsidian Cyber-Luxury**: sự kết hợp hoàn hảo giữa tông màu tối huyền bí (Deep Dark Obsidian), điểm nhấn ánh vàng hoàng gia (Cyber Gold/Amber) và xanh lá năng lượng (Emerald Green - tượng trưng cho giao dịch thành công).

### Nguyên tắc thiết kế chính:
1. **Trực quan & Thời gian thực (Real-time & High Visual Impact):** Đồng hồ đếm ngược sinh động đến từng millisecond, luồng lịch sử đặt giá cập nhật liên tục với hiệu ứng chuyển động mượt mà.
2. **Minh bạch & Đáng tin cậy (Trust & Transparency):** Cung cấp đầy đủ thông tin người bán được xác minh (Verified Seller), lịch sử trả giá công khai, phí sàn và điều khoản đấu giá rõ ràng.
3. **Trải nghiệm người dùng mượt mà (Seamless UX):** Đặt giá nhanh với 1-click preset (+ $50, + $100, + $500), tự động đấu giá (Auto-bid/Proxy bidding), và hệ thống thông báo Toast outbid tức thì.

---

## 2. Hệ Thống Màu Sắc & Typography (Color Palette & Typography)

### Color Tokens
- **Background Main:** `#0B0F17` (Deep Space Dark)
- **Card / Surface Background:** `#151D2A` (Obsidian Navy)
- **Glassmorphism Backdrop:** `rgba(21, 29, 42, 0.75)` với `backdrop-filter: blur(16px)`
- **Border & Dividers:** `rgba(255, 255, 255, 0.08)`
- **Primary Accent (Gold/Amber):** `#F59E0B` / `#FBBF24` (Sử dụng cho nút Đấu Giá, Giá Hiện Tại, Nổi Bật)
- **Secondary Accent (Emerald Green):** `#10B981` (Trạng thái LIVE, Đang dẫn đầu, Nạp tiền)
- **Danger Accent (Rose Red):** `#F43F5E` (Bị đè giá - Outbid, Sắp kết thúc < 5 phút)
- **Text Main:** `#F9FAFB` (Pure Crisp White)
- **Text Muted:** `#9CA3AF` (Cool Neutral Gray)

### Typography
- Font Family: **'Outfit', 'Inter', sans-serif**
- Display Headings: Weight 700 / 800, `letter-spacing: -0.02em`
- Numbers / Prices / Timers: Font Monospace hoặc Numeric Variant `tabular-nums` để số đếm ngược không bị rung lắc.

---

## 3. Kiến Trúc Hợp Phần UI (Component Architecture)

```
[ App Root ]
 ├── [ Header / Navigation Bar ]
 │    ├── Logo & Brand Name ("AuraBid")
 │    ├── Global Search & Filter Modal Trigger
 │    ├── Category Quick Links
 │    ├── Live Wallet Balance ($) & Quick Deposit Button
 │    ├── Notifications Bell (Outbid / Win / Alert Badges)
 │    └── User Avatar / Profile Drawer
 │
 ├── [ Hero Featured Live Auction ]
 │    ├── Dynamic Live Banner (Highlight Sản phẩm Đấu Giá Hot nhất)
 │    ├── Real-time Countdown Timer (Hours:Minutes:Seconds)
 │    ├── Current Highest Bid & Bidder Badge
 │    └── Instant Quick Bid Button + Watchlist Toggle
 │
 ├── [ Main Content Grid ]
 │    ├── [ Filter & Sort Toolbar ]
 │    │    ├── Category Chips (Tất cả, Đồng hồ Thụy Sĩ, Nghệ thuật Digital, Xe sang, Đồ cổ)
 │    │    ├── Status Tabs (Đang diễn ra - LIVE, Sắp diễn ra, Đã kết thúc)
 │    │    └── Sorting Dropdown (Kết thúc sớm nhất, Giá cao nhất, Phổ biến nhất)
 │    │
 │    └── [ Auction Cards Grid ]
 │         └── [ Auction Card Component ]
 │              ├── Live Tag / Ending Soon Alert Badge
 │              ├── Image Carousel & Dynamic Hover Zoom
 │              ├── Product Title & Category
 │              ├── Current Bid vs Starting Price
 │              ├── Real-time Countdown Counter
 │              └── Quick Bid Action (+ $10 / + $50)
 │
 ├── [ Auction Detail Drawer / Modal ]
 │    ├── Multi-angle Image Gallery & HD Zoom
 │    ├── Detailed Product Description, Authenticity Certificate & Seller Info
 │    ├── Real-time Live Bidding Stream (Feed Lịch Sử Đặt Giá)
 │    ├── Auto-Bid System (Ủy quyền đặt giá tối đa)
 │    └── Bid Input Panel với Quick Increment Buttons
 │
 ├── [ User Dashboard Drawer / Modal ]
 │    ├── Tab 1: Đang tham gia đấu giá (Active Bids - Status: Leading / Outbid)
 │    ├── Tab 2: Danh sách Yêu thích (Watchlist)
 │    ├── Tab 3: Sản phẩm Đã thắng (Auction Won)
 │    └── Tab 4: Đăng bán tài sản mới (Seller Listing Form)
 │
 └── [ Notification Toast System ]
      └── Pop-up cảnh báo Outbid, Đặt giá thành công, hoặc Đấu giá thành công.
```

---

## 4. Các Tính Năng Tương Tác Cốt Lõi (Core Interactive Features)

### 1. Đặt Giá Thời Gian Thực (Real-time Interactive Bidding)
- Người dùng bấm chọn các mức tăng nhanh (+ $50, + $100, + $500) hoặc nhập số tiền tùy chỉnh (bắt buộc lớn hơn bước giá tối thiểu `Current Bid + Min Increment`).
- Khi đặt giá thành công:
  - Giá cao nhất ngay lập tức tăng lên.
  - Tên/Avatar người dùng được đưa vào danh sách dẫn đầu.
  - Tạo hiệu ứng ăn mừng pháo hoa/ánh kim (Confetti & Pulse highlight).
  - Tự động cộng thêm 30 giây vào đếm ngược nếu đặt giá vào phút cuối (Anti-sniping rule).

### 2. Hệ Thống Đếm Ngược Động (Dynamic Countdown Timer)
- Hiển thị thời gian thực theo định dạng `HH : MM : SS`.
- Khi thời gian `< 5 phút`: Đồng hồ đổi sang màu đỏ nhấp nháy (`animate-pulse`).
- Khi hết giờ: Tự động khóa lượt đặt giá, hiển thị nhãn `SOLD` và người thắng cuộc.

### 3. Bộ Lọc Đa Chiều (Advanced Filtering)
- Lọc theo danh mục: *Watches*, *Art & Collectibles*, *Automotive*, *Jewelry*, *Tech*.
- Tìm kiếm theo từ khóa thông minh.
- Phân loại theo giá hiện tại, thời gian còn lại.

### 4. Đăng Sản Phẩm Đấu Giá Mới (Seller Listing Modal)
- Nút "+ Tạo Đấu Giá" trên Header.
- Form nhập đầy đủ: Tên sản phẩm, Danh mục, Giá khởi điểm, Bước giá tối thiểu, Thời gian diễn ra đấu giá, Hình ảnh minh họa.

---

## 5. Đánh Giá Trải Nghiệm & Thẩm Mỹ UI (Visual & UX Benchmarks)
- **Visual WOW Factor:** Sử dụng viền neon glow nhẹ (`box-shadow: 0 0 20px rgba(245, 158, 11, 0.2)`), card hiệu ứng kính mờ glassmorphic, chuyển cảnh mượt.
- **Responsiveness:** Tối ưu hóa 100% cho Desktop, Tablet và Mobile devices.
- **Accessibility & Contrast:** Chữ hiển thị rõ ràng trên nền tối, nút tương tác to dễ chạm trên thiết bị di động.
