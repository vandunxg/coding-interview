# Glossary theo concept và context

Version ban đầu: `0.1.0-bootstrap`. Chưa có quyết định domain riêng.

Đọc STYLE-02 trước khi dùng. Glossary là baseline về thuật ngữ, không phải danh sách duy nhất được giữ English. Trong batch, glossary là read-only; worker ghi đề xuất vào report, coordinator duyệt ở checkpoint.

| Source term | Context/concept | Cách dùng ưu tiên | Không áp dụng khi | Trạng thái |
| --- | --- | --- | --- | --- |
| API | Tên khái niệm hoặc chữ viết tắt trong source | API | Không tự thêm chữ viết tắt nếu source không có | baseline |
| request | HTTP/domain object | request | Động từ thông thường như request access | baseline |
| source | Nguồn tài liệu đang dịch | nguồn / bản gốc, nhất quán theo câu | Identifier hoặc tên chính thức | baseline |

Đây là bảng khởi đầu, không phải glossary Java/PostgreSQL đầy đủ. Chỉ nạp domain profile có trong context; chốt thêm term xuất hiện trong source thực tế.

## Đề xuất term mới

Ghi source term, một đoạn context ngắn, source locator, cách dùng đề xuất, các trường hợp dễ nhầm và unit bị ảnh hưởng. Không global-replace toàn repo. Không thêm định nghĩa hoặc bản dịch ngoặc vào target chỉ vì glossary có phần giải thích dành cho agent.

Term nhiều nghĩa được phép có nhiều hàng nếu scope khác nhau. Một concept trong cùng scope không đổi qua lại theo sở thích. Khi hai domain dùng khác nhau, ghi quyết định cho scope cụ thể thay vì lấy thứ tự file làm ưu tiên ngầm.
