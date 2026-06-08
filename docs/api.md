# 📋 API ENDPOINTS — HỆ THỐNG ĐIỂM DANH SINH VIÊN (DDSV)

> Tổng hợp đầy đủ toàn bộ API, bao gồm API cũ + bổ sung các endpoint còn thiếu.
> Các endpoint đánh dấu `[MỚI]` là bổ sung so với danh sách ban đầu.

---

## 1. 🔐 AUTH — Xác thực

```
POST   api/auth/login                  Đăng nhập hệ thống
POST   api/auth/logout                 Đăng xuất tài khoản
POST   api/auth/refresh-token          Cấp access token mới
GET    api/auth/me                     Lấy thông tin user hiện tại
POST   api/auth/change-password        Đổi mật khẩu
POST   api/auth/forgot-password        Gửi yêu cầu quên mật khẩu
POST   api/auth/reset-password         Đặt lại mật khẩu
POST   api/auth/verify-token           Kiểm tra token còn hợp lệ
```

---

## 2. 👥 USERS — Tài khoản & phân quyền

```
GET    /users                       Lấy danh sách tài khoản
GET    /users/:id                   Lấy chi tiết tài khoản
POST   /users                       Tạo tài khoản mới
PUT    /users/:id                   Cập nhật tài khoản
DELETE /users/:id                   Xoá tài khoản
PATCH  /users/:id/lock              Khoá tài khoản
PATCH  /users/:id/unlock            Mở khoá tài khoản
GET    /roles                       Lấy danh sách vai trò
```

---

## 3. 👨‍🏫 LECTURERS — Giảng viên

```
GET    /lecturers                   Lấy danh sách giảng viên
GET    /lecturers/:id               Lấy chi tiết giảng viên
POST   /lecturers                   Tạo giảng viên
PUT    /lecturers/:id               Cập nhật giảng viên
DELETE /lecturers/:id               Xoá giảng viên
GET    /lecturers/:id/schedule      [MỚI] Lấy thời khóa biểu của giảng viên
GET    /lecturers/:id/course-classes [MỚI] Lấy danh sách lớp môn học GV đang dạy
```

---

## 4. 👨‍🎓 STUDENTS — Sinh viên

```
GET    /students                    Lấy danh sách sinh viên
GET    /students/:id                Lấy chi tiết sinh viên
POST   /students                    Tạo sinh viên
PUT    /students/:id                Cập nhật sinh viên
DELETE /students/:id                Xoá sinh viên
GET    /students/:id/classes        Lấy danh sách lớp sinh viên tham gia
GET    /students/:id/schedule       [MỚI] Lấy thời khóa biểu cá nhân của sinh viên
GET    /students/:id/attendance     Lấy lịch sử điểm danh
GET    /students/:id/statistics     Lấy thống kê chuyên cần
```

---

## 5. 🏫 FACULTIES — Khoa

```
GET    /faculties                   Lấy danh sách khoa
POST   /faculties                   Tạo khoa
PUT    /faculties/:id               Cập nhật khoa
DELETE /faculties/:id               Xoá khoa
```

---

## 6. 📚 MAJORS — Ngành học

```
GET    /majors                      Lấy danh sách ngành
POST   /majors                      Tạo ngành
PUT    /majors/:id                  Cập nhật ngành
DELETE /majors/:id                  Xoá ngành
```

---

## 7. 🏛️ CLASSES — Lớp hành chính

```
GET    /classes                     Lấy danh sách lớp hành chính
POST   /classes                     Tạo lớp hành chính
PUT    /classes/:id                 Cập nhật lớp
DELETE /classes/:id                 Xoá lớp
```

---

## 8. 📖 SUBJECTS — Học phần

```
GET    /subjects                    Lấy danh sách học phần
GET    /subjects/:id                Lấy chi tiết học phần
POST   /subjects                    Tạo học phần
PUT    /subjects/:id                Cập nhật học phần
DELETE /subjects/:id                Xoá học phần
```

---

## 9. 📅 SEMESTERS — Học kỳ [MỚI HOÀN TOÀN]

```
GET    /semesters                   Lấy danh sách học kỳ
GET    /semesters/:id               Lấy chi tiết học kỳ
POST   /semesters                   Tạo học kỳ
PUT    /semesters/:id               Cập nhật học kỳ
DELETE /semesters/:id               Xoá học kỳ
GET    /semesters/current           [MỚI] Lấy học kỳ hiện tại đang hoạt động
PATCH  /semesters/:id/activate      [MỚI] Kích hoạt học kỳ
```

> **Body POST/PUT:**
> ```json
> {
>   "name": "Học kỳ 1 - 2024-2025",
>   "start_date": "2024-09-01",
>   "end_date": "2025-01-15",
>   "is_active": true
> }
> ```

---

## 10. 🏫 COURSE-CLASSES — Lớp môn học

```
GET    /course-classes              Lấy danh sách lớp môn học
GET    /course-classes/:id          Lấy chi tiết lớp môn học
POST   /course-classes              Tạo lớp môn học
PUT    /course-classes/:id          Cập nhật lớp môn học
DELETE /course-classes/:id          Xoá lớp môn học
GET    /course-classes/:id/students Lấy danh sách sinh viên trong lớp
POST   /course-classes/:id/register Đăng ký sinh viên vào lớp (Admin/GV thực hiện)
DELETE /course-classes/:id/register/:studentId  Huỷ đăng ký lớp
POST   /course-classes/:id/self-register [MỚI] Sinh viên tự đăng ký lớp
DELETE /course-classes/:id/self-register [MỚI] Sinh viên tự huỷ đăng ký lớp
```

---

## 11. 🗓️ SCHEDULE — Thời khóa biểu

```
GET    /schedule                    Lấy thời khóa biểu (filter theo query: ?courseClassId, ?lecturerId, ?studentId, ?semesterId)
POST   /schedule                    Tạo thời khóa biểu
PUT    /schedule/:id                Cập nhật thời khóa biểu
DELETE /schedule/:id                Xoá thời khóa biểu
```

> **Ghi chú:** Thêm query params để lọc linh hoạt, thay vì tạo nhiều endpoint riêng:
> - `GET /schedule?lecturerId=5` → lịch dạy của GV
> - `GET /schedule?studentId=12` → lịch học của SV
> - `GET /schedule?semesterId=3` → lịch theo học kỳ

---

## 12. 📆 SESSIONS — Buổi học

```
GET    /sessions                    Lấy danh sách buổi học
GET    /sessions/:id                Lấy chi tiết buổi học
POST   /sessions                    Tạo buổi học
PUT    /sessions/:id                Cập nhật buổi học
DELETE /sessions/:id                Huỷ buổi học
PATCH  /sessions/:id/open-attendance   Mở điểm danh
PATCH  /sessions/:id/close-attendance  Đóng điểm danh
PATCH  /sessions/:id/change-room       Đổi phòng học
```

---

## 13. 📲 QR — Mã QR điểm danh

```
POST   /qr/generate                 Tạo mã QR điểm danh cho buổi học
GET    /qr/current/:sessionId       Lấy QR hiện tại đang hoạt động
POST   /qr/scan                     Quét QR điểm danh (SV gọi)
POST   /qr/refresh                  Tạo QR mới (reset token, cập nhật TTL)
GET    /qr/history/:sessionId       Lấy lịch sử các QR đã tạo của buổi học
```

> **Body POST /qr/scan — bổ sung GPS:** [MỚI]
> ```json
> {
>   "token": "abc123xyz",
>   "session_id": 45,
>   "latitude": 21.0285,
>   "longitude": 105.8542,
>   "wifi_bssid": "AA:BB:CC:DD:EE:FF"
> }
> ```

> **Body POST /qr/generate:**
> ```json
> {
>   "session_id": 45,
>   "expires_in_seconds": 10,
>   "radius_meters": 50
> }
> ```

---

## 14. ✅ ATTENDANCE — Điểm danh

```
POST   /attendance/checkin          Điểm danh sinh viên (kèm GPS + WiFi) [CẬP NHẬT]
GET    /attendance/session/:id      Xem danh sách điểm danh của buổi học
GET    /attendance/student/:id      Xem lịch sử điểm danh sinh viên
PUT    /attendance/:id              Chỉnh sửa điểm danh
DELETE /attendance/:id              Xoá điểm danh
POST   /attendance/manual           Điểm danh thủ công (GV thêm SV vắng → có mặt)
POST   /attendance/auto-absent      Tự động đánh vắng toàn bộ SV chưa điểm danh
GET    /attendance/statistics       Lấy thống kê điểm danh tổng hợp
GET    /attendance/export-excel     Xuất file Excel báo cáo điểm danh
GET    /attendance/realtime/:sessionId  Polling danh sách điểm danh realtime (REST)
```

> **Body POST /attendance/checkin — đầy đủ GPS & WiFi:**
> ```json
> {
>   "qr_token": "abc123xyz",
>   "session_id": 45,
>   "student_id": 12,
>   "latitude": 21.0285,
>   "longitude": 105.8542,
>   "accuracy_meters": 10,
>   "wifi_bssid": "AA:BB:CC:DD:EE:FF",
>   "wifi_ssid": "SchoolWifi_2G"
> }
> ```

### 🌐 WebSocket — Realtime điểm danh [MỚI]

```
WS     /ws/attendance/:sessionId    Kết nối WebSocket realtime điểm danh
```

> **Mô tả:** GV giữ kết nối WS để nhận sự kiện mỗi khi SV điểm danh thành công.
> Server emit event:
> ```json
> {
>   "event": "student_checked_in",
>   "data": {
>     "student_id": 12,
>     "student_name": "Nguyễn Văn A",
>     "checked_in_at": "2024-10-01T08:05:00Z",
>     "method": "qr"
>   }
> }
> ```

---

## 15. 📍 GPS & WIFI VALIDATION — Chống gian lận [MỚI HOÀN TOÀN]

```
POST   /validate/gps                [MỚI] Kiểm tra sinh viên có trong bán kính phòng học
POST   /validate/wifi               [MỚI] Kiểm tra kết nối WiFi hợp lệ của trường
```

> **Body POST /validate/gps:**
> ```json
> {
>   "session_id": 45,
>   "latitude": 21.0285,
>   "longitude": 105.8542,
>   "accuracy_meters": 10
> }
> ```
> **Response:**
> ```json
> {
>   "valid": true,
>   "distance_meters": 12.5,
>   "allowed_radius_meters": 50
> }
> ```

> **Body POST /validate/wifi:**
> ```json
> {
>   "room_id": 7,
>   "wifi_bssid": "AA:BB:CC:DD:EE:FF",
>   "wifi_ssid": "SchoolWifi_2G"
> }
> ```
> **Response:**
> ```json
> {
>   "valid": true,
>   "matched_network": "SchoolWifi_2G"
> }
> ```

---

## 16. 🏢 ROOMS — Phòng học

```
GET    /rooms                       Lấy danh sách phòng học
POST   /rooms                       Tạo phòng học
PUT    /rooms/:id                   Cập nhật phòng học
DELETE /rooms/:id                   Xoá phòng học
GET    /rooms/:id/wifi              Lấy danh sách WiFi hợp lệ của phòng
POST   /rooms/:id/wifi              Thêm WiFi hợp lệ cho phòng
DELETE /rooms/:id/wifi/:wifiId      [MỚI] Xoá WiFi khỏi phòng
```

> **Body POST /rooms (bổ sung toạ độ GPS):** [MỚI]
> ```json
> {
>   "name": "A101",
>   "building": "Nhà A",
>   "capacity": 50,
>   "latitude": 21.0285,
>   "longitude": 105.8542,
>   "radius_meters": 50
> }
> ```

---

## 17. 🔔 NOTIFICATIONS — Thông báo

```
GET    /notifications               Lấy danh sách thông báo của user hiện tại
POST   /notifications               Gửi thông báo
GET    /notifications/:id           Xem chi tiết thông báo
PATCH  /notifications/:id/read      Đánh dấu đã đọc
DELETE /notifications/:id           Xoá thông báo
GET    /notifications/unread-count  Đếm số thông báo chưa đọc
PATCH  /notifications/read-all      [MỚI] Đánh dấu tất cả là đã đọc
```

> **Body POST /notifications — bổ sung filter nhóm nhận:** [CẬP NHẬT]
> ```json
> {
>   "title": "Thông báo nghỉ học",
>   "content": "Lớp Toán rời thứ 2 sang thứ 4",
>   "target": {
>     "type": "all" | "role" | "course_class" | "student_ids",
>     "role": "student",
>     "course_class_id": 12,
>     "student_ids": [1, 2, 3]
>   }
> }
> ```

---

## 18. 🚨 WARNINGS — Cảnh báo chuyên cần

```
GET    /warnings                    Lấy danh sách cảnh báo
POST   /warnings                    Tạo cảnh báo thủ công
PATCH  /warnings/:id/process        Xử lý / đóng cảnh báo
DELETE /warnings/:id                Xoá cảnh báo
GET    /warnings/student/:id        Xem cảnh báo của sinh viên cụ thể
GET    /warnings/course-class/:id   [MỚI] Xem cảnh báo theo lớp môn học
```

---

## 19. 📊 DASHBOARD — Tổng quan

```
GET    /dashboard/admin             Dashboard admin (tổng quan hệ thống)
GET    /dashboard/lecturer          Dashboard giảng viên (lớp đang dạy, buổi hôm nay)
GET    /dashboard/student           [MỚI] Dashboard sinh viên (chuyên cần, lịch sắp tới)
```

> **Response GET /dashboard/student:**
> ```json
> {
>   "upcoming_sessions": [...],
>   "attendance_summary": {
>     "total": 30,
>     "present": 27,
>     "absent": 3,
>     "percent": 90
>   },
>   "warnings": [...],
>   "recent_notifications": [...]
> }
> ```

---

## 20. 📈 REPORTS — Báo cáo

```
GET    /reports/attendance          Báo cáo điểm danh tổng hợp
GET    /reports/top-absent          Thống kê sinh viên vắng nhiều nhất
GET    /reports/weekly-attendance   Biểu đồ chuyên cần theo tuần
GET    /reports/export              Xuất báo cáo (Excel / PDF)
GET    /reports/by-course-class     [MỚI] Báo cáo theo từng lớp môn học
GET    /reports/by-semester         [MỚI] Báo cáo theo học kỳ
```

> **Query params dùng chung cho /reports/***:
> `?semesterId=3&courseClassId=10&from=2024-09-01&to=2024-12-31&format=excel`

---

## 21. 📱 DEVICES — Thiết bị & Push notification

```
POST   /devices/register            Đăng ký thiết bị
PUT    /devices/push-token          Cập nhật push token (FCM/APNS)
DELETE /devices/:id                 Xoá thiết bị
GET    /devices/my                  [MỚI] Lấy danh sách thiết bị của user hiện tại
```

---

## 22. ⚙️ SYSTEM — Hệ thống & cấu hình

```
GET    /logs                        Xem log hệ thống (Admin)
GET    /configs                     Lấy cấu hình hệ thống
PUT    /configs/:key                Cập nhật cấu hình theo key
GET    /holidays                    Lấy danh sách ngày nghỉ lễ
POST   /holidays                    Tạo ngày nghỉ lễ
DELETE /holidays/:id                [MỚI] Xoá ngày nghỉ lễ
```

---

## 23. 🌐 WEBSOCKET — Kết nối realtime [MỚI HOÀN TOÀN]

```
WS     /ws/attendance/:sessionId    Realtime điểm danh theo buổi (GV lắng nghe)
WS     /ws/notifications            Realtime thông báo đẩy đến user
```

> **Handshake:** Client gửi Bearer token trong header `Authorization` khi upgrade connection.

---

## 📌 TỔNG KẾT CÁC API BỔ SUNG

| # | Endpoint | Lý do thêm |
|---|----------|------------|
| 1 | `GET /semesters` + CRUD | Học kỳ là thực thể cốt lõi, lớp môn học cần gắn với học kỳ |
| 2 | `GET /semesters/current` | Cần biết học kỳ nào đang hoạt động để filter dữ liệu |
| 3 | `GET /lecturers/:id/schedule` | GV xem lịch dạy của chính mình |
| 4 | `GET /lecturers/:id/course-classes` | GV xem danh sách lớp đang phụ trách |
| 5 | `GET /students/:id/schedule` | SV xem thời khóa biểu cá nhân |
| 6 | `POST /course-classes/:id/self-register` | SV tự đăng ký lớp môn học |
| 7 | GPS params trong `/qr/scan` & `/attendance/checkin` | Chống gian lận vị trí |
| 8 | WiFi params trong `/attendance/checkin` | Chống điểm danh ngoài trường |
| 9 | `POST /validate/gps` | Validate GPS riêng trước khi checkin |
| 10 | `POST /validate/wifi` | Validate WiFi riêng trước khi checkin |
| 11 | GPS coords trong `POST /rooms` | Phòng phải có toạ độ để validate GPS |
| 12 | `DELETE /rooms/:id/wifi/:wifiId` | Xoá WiFi khỏi phòng |
| 13 | `GET /dashboard/student` | SV cần dashboard riêng xem chuyên cần |
| 14 | target filter trong `POST /notifications` | Gửi thông báo cho lớp / nhóm cụ thể |
| 15 | `PATCH /notifications/read-all` | UX cơ bản — đọc tất cả thông báo |
| 16 | `GET /warnings/course-class/:id` | GV xem cảnh báo theo lớp mình dạy |
| 17 | `WS /ws/attendance/:sessionId` | Realtime thật sự, thay REST polling |
| 18 | `WS /ws/notifications` | Push thông báo realtime đến client |
| 19 | `GET /reports/by-course-class` | Báo cáo chi tiết theo lớp |
| 20 | `GET /reports/by-semester` | Báo cáo tổng kết theo học kỳ |
| 21 | `GET /devices/my` | User quản lý thiết bị của mình |
| 22 | `DELETE /holidays/:id` | Xoá ngày nghỉ lễ bị tạo nhầm |
