# Hiệu ứng GSAP trên HomePage

## Các file

- `src/features/home/pages/HomePage.tsx`: gắn ref vào `.storage-home`, gọi `useHomeMotion` và đặt `HomeScrollExperience` ở phần quy trình thuê kho.
- `src/features/home/hooks/useHomeMotion.ts`: đăng ký GSAP, ScrollTrigger và useGSAP; hiệu ứng ảnh hero và chữ.
- `src/features/home/components/HomeScrollExperience.tsx`: hai component StorageStory và StorageTour.
- Sticky layout, canvas, lớp ảnh zoom, responsive và reduced motion dùng class Tailwind ngay trong `HomeScrollExperience.tsx` và `HomePage.tsx`.
- `scripts/generate-storage-sequence.cjs`: tạo 48 khung hình SVG tại `public/images/storage-sequence`.

## 1. Scroll-Driven Animation

```tsx
gsap.fromTo('.hero-image',
  { scale: 1.04, rotation: -1.5 },
  {
    scale: 1.2, yPercent: 8, rotation: 1.5, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: .6,
    },
  },
)
```

Code thực tế dùng selector giới hạn trong ref của HomePage. `scale` phóng ảnh, `yPercent` dịch ảnh theo phần trăm chiều cao của ảnh, `rotation` xoay ảnh quanh trục Z. Story còn dùng `rotationY` với CSS `perspective` để tạo cảm giác thay đổi góc nhìn.

`trigger` là phần tử dùng đo vị trí cuộn. `start: 'top top'` nghĩa là bắt đầu khi đỉnh phần tử chạm đỉnh viewport; `end: 'bottom top'` là kết thúc khi đáy phần tử chạm đỉnh viewport. `scrub: .6` liên kết tiến độ với vị trí cuộn và cho playhead khoảng 0,6 giây để bắt kịp vị trí mới. `ease: 'none'` giữ tốc độ thay đổi tuyến tính theo tiến độ. Cuộn lên sẽ chạy ngược.

## 2. Sticky Scroll Storytelling

StorageStory chia layout thành hai cột: hình ảnh và ba bài viết. Ảnh có `position: sticky` và `top` bằng chiều cao header cộng khoảng cách 35px. Mỗi bài viết cao tối thiểu `62svh`, tạo khoảng cuộn để lần lượt giới thiệu chọn kho, đặt thuê và bàn giao.

Ba ảnh xếp chồng bằng `position: absolute`. ScrollTrigger gắn với từng bài viết chuyển opacity ảnh tương ứng từ 0 thành 1. Chữ vẫn nằm trong DOM và đọc được; không có auto-scroll hay khóa wheel. Trên màn hình dưới 900px, ảnh trở về vị trí bình thường và các bước xếp dọc.

## 3. Image Sequence Animation

Đây là chuỗi khung SVG minh họa phối cảnh, chưa phải bộ ảnh render 3D chân thực. Script tạo các giai đoạn camera tiến gần, cửa cuốn mở và đèn bật. Có thể thay các khung bằng ảnh WebP render từ Blender; đổi `framePath()` và `FRAME_COUNT` tương ứng.

```tsx
const sequence = { frame: 0 }
timeline.to(sequence, {
  frame: FRAME_COUNT - 1,
  duration: 2.4,
  ease: 'none',
  onUpdate: render,
}, 0)
```

GSAP thay đổi thuộc tính frame của object. `render()` làm tròn frame về chỉ số nguyên rồi dùng `canvas.drawImage()` vẽ ảnh tương ứng. Không gọi React setState cho mỗi frame, tránh render lại cây component khi cuộn.

IntersectionObserver bắt đầu tải ảnh khi phần tour cách viewport không quá 600px, chỉ chạy tối đa 4 yêu cầu đồng thời. Canvas giới hạn pixel ratio ở 1,5. ResizeObserver cập nhật kích thước khi viewport đổi. Ảnh poster hiển thị trong khi chưa tải đủ khung hoặc tải lỗi; reduced motion chỉ dùng poster.

## 4. Cinematic Text Reveal

Các tiêu đề có `data-cinematic-heading`. Những tiêu đề cần tách dòng được viết sẵn bằng `<span className="motion-line">`, giữ nguyên cấu trúc h1/h2.

Hook chuyển opacity từ 0,2 đến 1, y từ 28px về 0, scale từ 0,97 đến 1. `stagger: .12` làm mỗi dòng tiến triển lệch nhau. ScrollTrigger bắt đầu khi tiêu đề đến 90% chiều cao viewport và hoàn tất ở 58%. Riêng slogan hero có reveal ngắn khi trang xuất hiện.

## 5. Fullscreen Zoom Transition

StorageTour dùng một timeline cho chuỗi ảnh và chuyển cảnh tiếp theo. Trên desktop, `pin` giữ viewport tour dưới header và tạo khoảng cuộn dài bằng 2,2 lần chiều cao màn hình. Trên mobile, bỏ pin và cho animation tiến triển trong lúc phần tour đi qua màn hình.

```tsx
timeline
  .fromTo('.storage-tour-zoom',
    { opacity: 0, clipPath: 'inset(24% 20% round 24px)' },
    { opacity: 1, duration: .25, ease: 'none' }, 2.35)
  .to('.storage-tour-zoom',
    { clipPath: 'inset(0% 0% round 0px)', duration: 1, ease: 'none' }, 2.6)
```

Ảnh zoom thực chất đã phủ viewport. `clipPath` ban đầu chỉ cho thấy vùng nhỏ giữa ảnh; giảm inset về 0 mở rộng vùng nhìn thấy ra toàn khung dưới header. Lớp slogan xuất hiện ở cuối và có một đoạn giữ ngắn trước khi người dùng cuộn sang phần tiếp theo.

Các duration trong timeline scrub quyết định tỷ lệ thời lượng giữa các giai đoạn trên đoạn cuộn, không có nghĩa animation tự chạy trong chừng đó giây.

## Cleanup và khả năng tiếp cận

`useGSAP({scope: ref})` và `gsap.matchMedia()` giới hạn các selector và tự hoàn nguyên animation, inline styles và ScrollTrigger khi component bị unmount. Cleanup riêng dừng observer, gỡ listener và giải phóng danh sách ảnh, giúp chuyển sang FM rồi trở lại Home không tạo pin trùng. Không gọi `ScrollTrigger.getAll().forEach(kill)`, vì thao tác đó có thể ảnh hưởng animation trang khác.

Các hiệu ứng chỉ được khởi tạo khi `prefers-reduced-motion: no-preference`. Khi giảm chuyển động, tiêu đề đọc được ngay, không pin và không tải 48 khung. Canvas trang trí có aria-hidden; ảnh poster cung cấp mô tả thay thế. Header giữ các nút điều hướng truy cập được.

## Điều chỉnh

- Mức phóng ảnh hero: `scale: 1.2` trong `useHomeMotion.ts`.
- Độ mượt: `scrub` trong mỗi ScrollTrigger; giảm để bám cuộn sát hơn.
- Khoảng cuộn tour: `window.innerHeight * 2.2`.
- Khoảng cách giữa ba bước: `min-height: 62svh` trong CSS.
- Breakpoint desktop: đồng bộ `900px` trong TSX và CSS.
- Tạo lại SVG: `node scripts/generate-storage-sequence.cjs`.

Kiểm tra build: `npx tsc --noEmit` và `npx vite build`. Kiểm tra trong trình duyệt cần cuộn xuống và lên qua hero, ba bước, chuỗi cửa mở và ảnh zoom; thử chuyển Home → FM → Home, mobile 390px và bật Reduce Motion trong thiết lập trình duyệt/hệ điều hành.
