# Self-Storage Facility Rental and Management System

## Cấu trúc Backend

```
Backend/
├── SelfStorage.API/            → Controllers, JWT, Swagger, Program.cs
├── SelfStorage.Services/       → Business Logic (Interfaces + Services)
├── SelfStorage.Repositories/   → DbContext, Entities, Repositories
└── SelfStorage.Common/         → DTOs, Enums, Constants
```

## API Auth & Users

### AuthController (public + authenticated)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| POST | /api/auth/login | Đăng nhập | Public |
| POST | /api/auth/register | Đăng ký Customer | Public |
| GET | /api/auth/me | Lấy info user đang login | Đã login |

### UsersController (quản lý user)
| Method | Endpoint | Mô tả | Quyền |
|--------|----------|-------|-------|
| GET | /api/users | Danh sách tất cả user | SystemAdministrator |
| GET | /api/users/{id} | Chi tiết 1 user | SystemAdministrator |
| POST | /api/users | Tạo user (mọi role) | SystemAdministrator |
| PUT | /api/users/{id} | Cập nhật user | SystemAdministrator |
| DELETE | /api/users/{id} | Xóa user | SystemAdministrator |

## Tài khoản mẫu

Password tất cả: **123456**

| Role | Email |
|------|-------|
| Storage Customer | customer@selfstorage.local |
| Facility Staff | staff@selfstorage.local |
| Facility Manager | manager@selfstorage.local |
| Business Operations Manager | bom@selfstorage.local |
| System Administrator | admin@selfstorage.local |

## Cách chạy

1. SSMS: chạy `01_CreateDatabase.sql` → `02_SeedSampleAccounts.sql`
2. Visual Studio: mở `Backend/SelfStorage.sln` → F5 (API)
3. Frontend: `cd Frontend && npm install && npm run dev`
