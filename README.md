# Self-Storage Facility Rental and Management System

## Cách chạy Frontend

npm i

npm run dev

## Quy ước giao diện

Dùng class Tailwind CSS trong component `.tsx` cho toàn project, bao gồm responsive, hover/focus và reduced motion. Các chuỗi class dùng lặp lại được đặt trong hằng `styles` ngay tại file component. Không tạo file CSS hoặc HTML riêng cho từng trang/component.

`src/index.css` chỉ chứa ba chỉ thị Tailwind. `tailwind.config.js` chứa font, màu và keyframe dùng chung. `index.html` ở thư mục gốc là entry bắt buộc của Vite.

## Luồng đặt kho khách hàng (frontend demo)

- `/storage`: danh sách kho mẫu, lọc địa điểm/kích thước/loại kho, chọn ngày và sắp xếp giá.
- `/storage/:unitId`: chi tiết kho và bắt đầu đặt thuê.
- `/login`: chọn **Trải nghiệm đặt kho demo** để thử khi chưa có backend. Lựa chọn kho và ngày được giữ qua trang đăng nhập/đăng ký.
- `/customer/book/:unitId`: thời gian thuê → thông tin liên hệ → xem chi phí và xác nhận điều khoản demo.
- `/customer/bookings/:bookingId`: xem đơn, thanh toán mô phỏng, hủy đơn có xác nhận.
- `/customer/units`, `/customer/payments`: lịch sử đơn và giao dịch mô phỏng theo tài khoản.

Giá, địa điểm, chu kỳ thuê và cọc một tháng là dữ liệu/quy tắc minh họa, không phải chính sách kinh doanh đã xác nhận. Tiền thuê = giá mẫu × số tháng; tổng mẫu = tiền thuê + cọc. Ngày kết thúc không thuộc kỳ thuê. Ngày cuối tháng được điều chỉnh về ngày hợp lệ của tháng đích.

Đơn demo lưu tại `localStorage` với khóa `selfstorage:demo-bookings:v1:<userId>`; bản nháp lưu trong `sessionStorage`. Dữ liệu chỉ tồn tại trong trình duyệt hiện tại và không được đồng bộ giữa thiết bị. Phiên demo sử dụng tài khoản mẫu riêng (`userId=0`); Axios chặn mọi API thật khi phiên này đang mở. Không nhập dữ liệu nhạy cảm, không thu tiền, không giữ kho thật, không ký hợp đồng hoặc cấp mã truy cập. Kiểm tra trùng thời gian chỉ áp dụng cho đơn của tài khoản trong trình duyệt, không đảm bảo tồn kho đa người dùng. Dữ liệu hỏng hoặc lỗi lưu trữ được báo lỗi thay vì báo đặt thành công.

### Kiểm tra

```sh
npm run test:booking
npm run build
```

Kiểm thử bao gồm tính tiền, tháng lịch/năm nhuận, dữ liệu không hợp lệ, đơn trùng thời gian, thao tác tạo/thanh toán lặp, hủy đơn, tách dữ liệu tài khoản và lỗi lưu trữ.

### Khi có backend

`src/features/booking/catalog.ts` chứa danh mục mẫu. `domain.ts` tách quy tắc minh họa và repository lưu trữ local khỏi giao diện trong `BookingPages.tsx`. Thay danh mục và repository bằng API theo Swagger thực tế. Backend phải kiểm tra quyền sở hữu đơn, tồn kho đồng thời, giá/chính sách chính thức, idempotency, hợp đồng và trạng thái thanh toán từ gateway. Không dùng trạng thái local hoặc nút thanh toán demo để xác nhận giao dịch thật.

## Facility Manager demo

Nhấn **FM** trên header để mở giao diện quản lý không cần đăng nhập. `/login` và `/register` tạm chuyển về HomePage.

- `/manager/units`: thêm, sửa, tìm kiếm và vô hiệu hóa kho. Kho có hợp đồng đang hoạt động không được đổi loại, diện tích hoặc trạng thái trực tiếp.
- `/manager/assign`: chọn đơn đặt và kho phù hợp theo loại, diện tích, thời hạn và tình trạng còn trống. Có thể đổi kho chờ bàn giao; kho cũ chuyển sang bảo trì.
- `/manager/rentals`: danh sách kho khách thuê, hợp đồng, ngày thuê, sắp hết hạn trong 7 ngày, quá hạn và trạng thái thanh toán chỉ đọc.
- `/manager/operations`: ghi nhận bàn giao, trả kho, gia hạn và giao nhiệm vụ hỗ trợ hoặc xử lý quá hạn. Facility Staff thực hiện, FM điều phối và ghi nhận kết quả trong demo.
- `/manager/staff`: danh sách nhân viên cơ sở, giao việc, đổi người phụ trách, hạn xử lý và tiến độ. Chưa có phân ca.
- `/manager/reports`: thống kê kho, tỷ lệ sử dụng, tổng tiền mẫu của các hợp đồng đã thanh toán và danh sách quá hạn.

Dữ liệu cơ sở District 1 lưu trong `selfstorage:fm-workspace:v1`. Dữ liệu kho cũ tại `selfstorage:fm-units:v1` được đọc khi chưa có workspace. Dữ liệu FM không đồng bộ với luồng đặt kho khách hàng hay backend. Doanh thu là tổng khoản mẫu có trạng thái Đã thanh toán, không phải báo cáo kế toán hoặc giao dịch thật. Không có thao tác cho FM tự xác nhận thanh toán.

Kiểm tra: `npm run test:manager-units`, `npm run test:facility-workspace`, `npx tsc --noEmit`.
