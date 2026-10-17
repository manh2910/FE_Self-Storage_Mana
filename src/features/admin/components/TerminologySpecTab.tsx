import { useState } from 'react'
import { AdminIcon } from './AdminIcons'
import { selfStorageDictionary } from '../model/adminDomain'

export function TerminologySpecTab() {
  const [activeSection, setActiveSection] = useState<'dictionary' | 'srs' | 'stories' | 'usecase'>('dictionary')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2500)
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
              <AdminIcon name="dictionary" size={18} />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Bản dịch chuyên ngành & Đặc tả cấu trúc SRS / Agile
            </h2>
          </div>
          <p className="mt-1 text-sm text-slate-500 max-w-3xl">
            Từ điển thuật ngữ chuyên ngành chuẩn hóa dịch vụ cho thuê kho bãi (Self-Storage) cùng tài liệu đặc tả
            yêu cầu phần mềm (SRS), Agile User Stories và Use Case chuẩn hóa sẵn sàng sao chép vào báo cáo đề tài.
          </p>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 bg-slate-100 p-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveSection('dictionary')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeSection === 'dictionary'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Từ điển chuyên ngành
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('srs')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeSection === 'srs'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Đặc tả SRS
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('stories')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeSection === 'stories'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            User Stories
          </button>
          <button
            type="button"
            onClick={() => setActiveSection('usecase')}
            className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
              activeSection === 'usecase'
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Use Case
          </button>
        </div>
      </div>

      {/* SECTION 1: DICTIONARY */}
      {activeSection === 'dictionary' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Thuật ngữ chuyên ngành Self-Storage chuẩn hóa tiếng Việt
            </h3>
            <span className="text-xs text-slate-500">Chuẩn hóa cho UI, tài liệu và mã nguồn</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {selfStorageDictionary.map((item, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-teal-300 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                      {item.termEn}
                    </span>
                    <h4 className="text-base font-bold text-slate-900 mt-2">{item.termVi}</h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(`term-${idx}`, `${item.termEn}: ${item.termVi} - ${item.explanation}`)}
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
                    title="Sao chép thuật ngữ"
                  >
                    {copiedId === `term-${idx}` ? (
                      <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                        <AdminIcon name="check" size={13} /> Đã chép
                      </span>
                    ) : (
                      <AdminIcon name="copy" size={14} />
                    )}
                  </button>
                </div>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: SRS SPECIFICATION */}
      {activeSection === 'srs' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                1. Yêu cầu chức năng phần mềm (Software Requirements Specification - SRS)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Phân hệ Quản trị viên Hệ thống (System Administrator Subsystem)
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                handleCopy(
                  'srs-copy',
                  `=== TÀI LIỆU YÊU CẦU PHẦN MỀM (SRS) - PHÂN HỆ QUẢN TRỊ VIÊN HỆ THỐNG ===\n...`
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copiedId === 'srs-copy' ? <AdminIcon name="check" size={13} /> : <AdminIcon name="copy" size={13} />}
              <span>{copiedId === 'srs-copy' ? 'Đã sao chép SRS' : 'Sao chép toàn bộ SRS'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-blue-700 uppercase">FR-ADM-01: Quản lý tài khoản người dùng</span>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 leading-relaxed">
                <li>Hệ thống cho phép Quản trị viên tạo mới tài khoản với đầy đủ thông tin: Tên đăng nhập, Họ tên, Email, SĐT, Vai trò, Cơ sở phân công.</li>
                <li>Hệ thống cung cấp tính năng khóa/tạm đình chỉ (Suspended) hoặc kích hoạt lại (Active) trạng thái tài khoản.</li>
                <li>Hệ thống hỗ trợ đặt lại mật khẩu tạm thời (Temporary Password) và gửi thông báo bảo mật.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-blue-700 uppercase">FR-ADM-02: Phân quyền vai trò người dùng (RBAC)</span>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 leading-relaxed">
                <li>Phân quyền nghiêm ngặt 5 vai trò: Khách hàng (StorageCustomer), Nhân viên cơ sở (FacilityStaff), Quản lý cơ sở (FacilityManager), Quản lý ĐHKD (BusinessOperationsManager), Quản trị viên (SystemAdministrator).</li>
                <li>Cấu hình các quyền CRUD (Xem, Tạo, Sửa, Xóa, Xuất báo cáo) trên từng phân hệ độc lập.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-blue-700 uppercase">FR-ADM-03: Cấu hình truy cập dữ liệu theo cơ sở (Facility Scoping)</span>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 leading-relaxed">
                <li>Hệ thống cô lập dữ liệu phòng kho, hợp đồng và mã PIN theo từng cơ sở (Quận 1, Thủ Đức, Bình Thạnh, Quận 7, Cầu Giấy).</li>
                <li>Nhân sự của cơ sở A tuyệt đối không được truy cập hay can thiệp vào tài nguyên của cơ sở B nếu không được cấp quyền toàn hệ thống.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-blue-700 uppercase">FR-ADM-04: Theo dõi lịch sử đăng nhập & Kiểm toán hoạt động</span>
              <ul className="list-disc list-inside mt-2 space-y-1 text-slate-700 leading-relaxed">
                <li>Ghi nhận nhật ký đăng nhập: Thời gian, IP, trình duyệt, thiết bị, kết quả (Thành công/Thất bại) và phát hiện dò quét (Suspicious).</li>
                <li>Lưu vết toàn bộ thao tác thay đổi dữ liệu trọng yếu (Cập nhật giá, bàn giao kho, xử lý quá hạn, khóa mã PIN).</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: AGILE USER STORIES */}
      {activeSection === 'stories' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-bold text-slate-900">
              Agile User Stories & Tiêu chí nghiệm thu (Acceptance Criteria)
            </h3>
            <span className="text-xs text-slate-500">Chuẩn định dạng: As a... I want to... So that...</span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Story 1 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  US-ADM-01: Quản trị tài khoản
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Độ ưu tiên: Cao (High)
                </span>
              </div>
              <p className="font-semibold text-slate-800">
                <strong>Là:</strong> Quản trị viên Hệ thống (System Administrator),<br />
                <strong>Tôi muốn:</strong> Có thể tạo mới, cập nhật thông tin và đình chỉ/kích hoạt tài khoản người dùng,<br />
                <strong>Để:</strong> Kiểm soát danh tính người truy cập và đảm bảo an ninh vận hành hệ thống.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 font-mono text-[11px] space-y-1 text-slate-700">
                <div className="font-bold text-slate-900">Tiêu chí chấp nhận (Given / When / Then):</div>
                <div>- <strong>Given:</strong> Quản trị viên đăng nhập vào trang quản trị tài khoản,</div>
                <div>- <strong>When:</strong> Điền đầy đủ thông tin người dùng và ấn "Lưu tài khoản",</div>
                <div>- <strong>Then:</strong> Hệ thống lưu người dùng mới vào cơ sở dữ liệu và hiển thị ngay trên bảng danh sách.</div>
              </div>
            </div>

            {/* Story 2 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  US-ADM-02: Ma trận phân quyền vai trò
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Độ ưu tiên: Cao (High)
                </span>
              </div>
              <p className="font-semibold text-slate-800">
                <strong>Là:</strong> Quản trị viên Hệ thống,<br />
                <strong>Tôi muốn:</strong> Cấu hình quyền Xem, Tạo, Sửa, Xóa cho từng vai trò trên ma trận phân quyền,<br />
                <strong>Để:</strong> Đảm bảo nguyên tắc đặc quyền tối thiểu (Least Privilege) cho từng bộ phận nhân sự.
              </p>
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 font-mono text-[11px] space-y-1 text-slate-700">
                <div className="font-bold text-slate-900">Tiêu chí chấp nhận (Given / When / Then):</div>
                <div>- <strong>Given:</strong> Vai trò Nhân viên cơ sở (Facility Staff),</div>
                <div>- <strong>When:</strong> Bật/tắt quyền "Xuất báo cáo",</div>
                <div>- <strong>Then:</strong> Giao diện nhân viên cơ sở sẽ ẩn hoặc hiện nút tải báo cáo tương ứng.</div>
              </div>
            </div>

            {/* Story 3 */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  US-ADM-03: Phân quyền theo cơ sở (Facility Scoping)
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Độ ưu tiên: Cao (High)
                </span>
              </div>
              <p className="font-semibold text-slate-800">
                <strong>Là:</strong> Quản trị viên Hệ thống,<br />
                <strong>Tôi muốn:</strong> Phân bổ nhân sự trực tiếp vào từng cơ sở kho (VD: Cơ sở Quận 1, Cơ sở Thủ Đức),<br />
                <strong>Để:</strong> Nhân sự chỉ quản lý danh sách phòng kho và khách hàng thuộc cơ sở của mình.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: USE CASE SPECIFICATION */}
      {activeSection === 'usecase' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Sơ đồ & Đặc tả Use Case: UC-ADM-01 (Quản trị tài khoản & Phân quyền)
              </h3>
              <p className="text-xs text-slate-500 mt-1">Đặc tả theo chuẩn quy trình phần mềm quốc tế</p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('uc-copy', `USE CASE: UC-ADM-01...`)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              {copiedId === 'uc-copy' ? <AdminIcon name="check" size={13} /> : <AdminIcon name="copy" size={13} />}
              <span>{copiedId === 'uc-copy' ? 'Đã sao chép Use Case' : 'Sao chép Use Case'}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">Tác nhân chính (Primary Actor):</span>
                <span className="text-slate-900 font-semibold">Quản trị viên Hệ thống (System Administrator)</span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                <span className="font-bold text-slate-700 block mb-1">Điều kiện tiên quyết (Preconditions):</span>
                <span className="text-slate-900">Quản trị viên đã đăng nhập và được xác thực quyền root.</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-2">Luồng sự kiện chính (Main Success Scenario):</span>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-700 leading-relaxed">
                <li>Quản trị viên truy cập vào Bảng điều khiển Quản trị viên Hệ thống (/admin).</li>
                <li>Hệ thống hiển thị danh sách tài khoản kèm vai trò và trạng thái hoạt động.</li>
                <li>Quản trị viên chọn tạo mới tài khoản hoặc chọn một tài khoản hiện có để chỉnh sửa.</li>
                <li>Quản trị viên cấu hình cơ sở phân công (Facility Scoping) và gán vai trò tương ứng.</li>
                <li>Quản trị viên xác nhận lưu thay đổi.</li>
                <li>Hệ thống kiểm tra tính hợp lệ, lưu vào cơ sở dữ liệu và ghi nhận vào Nhật ký kiểm toán (Activity Audit Log).</li>
              </ol>
            </div>

            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900">
              <span className="font-bold block mb-1">Luồng ngoại lệ (Exception Flows):</span>
              <p className="leading-relaxed">
                <strong>4a. Trùng tên đăng nhập hoặc email:</strong> Hệ thống hiển thị thông báo lỗi yêu cầu Quản trị viên nhập thông tin duy nhất khác.<br />
                <strong>4b. Lỗi kết nối máy chủ:</strong> Hệ thống tự động lưu trữ tạm cục bộ (LocalStorage cache) và thông báo thử lại sau.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
