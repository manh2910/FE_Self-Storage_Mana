# Self-Storage Facility Rental and Management System

## Cách chạy Frontend

npm i

npm run dev

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
