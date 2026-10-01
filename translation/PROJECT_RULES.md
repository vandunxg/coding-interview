# Rule bổ sung theo project

**Trạng thái ban đầu: chưa có ngoại lệ được phê duyệt.** File này không chép lại core và không tự cấp quyền vượt core.

## Context chuyên biệt

Điền các đặc điểm không biểu diễn đủ trong `PROJECT_CONTEXT.yaml`: tên chương/Item phải giữ; tác giả/ngôi kể; cách biểu diễn công thức; tài liệu tham chiếu trong cùng edition; format đặc biệt; yêu cầu của người dùng áp dụng riêng project.

Không thêm quy tắc Java vào tài liệu SQL chỉ vì template có ví dụ Java. Không ghi “luôn đọc PDF” khi nguồn là repo docs.

## Quyết định có phạm vi

Mỗi mục dùng cấu trúc sau, xoá hướng dẫn mẫu khi có quyết định thật:

- ID: `PROJECT-001`.
- Áp dụng: file/section/loại nội dung chính xác.
- Policy liên quan: rule ID và trường context tương ứng.
- Quyết định: cách xử lý được phép, không để hai lựa chọn mâu thuẫn cùng hiệu lực.
- Căn cứ: nguồn hoặc yêu cầu người dùng đã được kiểm chứng.
- Người/phạm vi phê duyệt và ngày: dữ liệu thật.
- Kiểm tra: cách xác minh kết quả và trường hợp phải dừng.

Đổi policy giữa batch phải kết thúc hoặc thu hồi assignment cũ, đánh version và đánh giá lại các unit bị ảnh hưởng. Không âm thầm sửa rule để hợp thức hoá bản dịch sai.

## Ngoại lệ cần đặc biệt thận trọng

Dịch comment không đồng nghĩa được đổi identifier/string. Thay đường dẫn link để giữ cùng đích không đồng nghĩa được sửa URL trong đoạn code. Dịch label sơ đồ không đồng nghĩa được thay node ID hoặc quan hệ. Cho phép tạo site không đồng nghĩa được sửa source upstream.

Các ngoại lệ có nội dung thực thi phải còn nằm trong policy mà core cho phép. Trường hợp làm thay đổi ví dụ/ý nghĩa nguồn cần một tác vụ adaptation riêng, không gọi là faithful translation.
