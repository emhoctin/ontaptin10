// Fix: Provide prompt templates used by the Gemini service.
export const SUMMARY_PROMPT_TEMPLATE = `
Nhiệm vụ của bạn là tổng hợp và tóm tắt kiến thức trọng tâm của các bài học sau đây từ Sách giáo khoa Tin học 10 - Bộ Kết nối tri thức với cuộc sống.
Nội dung tóm tắt phải được trình bày dưới dạng gạch đầu dòng (-), sử dụng các tiêu đề lớn cho mỗi bài học, và nhấn mạnh các khái niệm, định nghĩa, hoặc ý nghĩa quan trọng.
Đầu ra phải tuân thủ nghiêm ngặt cấu trúc sau:

### TÓM TẮT KIẾN THỨC ÔN TẬP TIN HỌC 10 (KẾT NỐI TRI THỨC)

#### 1. Bài 1. Thông tin và xử lí thông tin
- **Phân biệt Thông tin và Dữ liệu:** Nêu rõ định nghĩa và mối quan hệ giữa chúng.
- **Quá trình xử lí thông tin của máy tính:** Tóm tắt 3 bước cơ bản.
- **Đơn vị lưu trữ dữ liệu:** Liệt kê các đơn vị cơ bản (Bit, Byte, KB, MB, GB, TB,...) và mối quan hệ quy đổi.
- **Ưu điểm của thiết bị số:** Nêu các ưu điểm chính.

#### 2. Bài 2. Vai trò của thiết bị thông minh và tin học đối với xã hội
- **Thiết bị thông minh:** Nêu khái niệm và ví dụ về các thành phần cơ bản.
- **Thành tựu và Đóng góp của Tin học:** Tóm tắt đóng góp đối với các lĩnh vực quan trọng.
- **Kết nối vạn vật (IoT):** Giải thích ngắn gọn và ví dụ ứng dụng.

#### 3. Bài 7. Thực hành sử dụng thiết bị số thông dụng
- Nêu mục tiêu và các kỹ năng thực hành chính của bài học.

#### 4. Bài 8. Mạng máy tính trong cuộc sống hiện đại
- **Mạng LAN và Internet:** Phân biệt rõ ràng về phạm vi kết nối và quy mô.
- **Vai trò của Internet:** Tóm tắt các vai trò chính.

#### 5. Bài 9. An toàn trên không gian mạng
- **Các mối đe dọa:** Liệt kê các mối đe dọa phổ biến (ví dụ: virus, lừa đảo, bắt nạt).
- **Biện pháp phòng tránh cơ bản:** Tóm tắt các nguyên tắc chung để bảo vệ bản thân.

#### 6. Bài 10. Thực hành khai thác tài nguyên trên Internet
- Nêu mục tiêu và nội dung chính của bài thực hành (ví dụ: Kỹ năng tìm kiếm, sử dụng phần mềm dịch).

#### 7. Bài 11. Ứng xử trên môi trường số. Nghĩa vụ tôn trọng bản quyền
- **Quy tắc Ứng xử:** Tóm tắt các nguyên tắc về văn hóa, đạo đức, và pháp luật.
- **Nghĩa vụ Tôn trọng bản quyền:** Định nghĩa Quyền tác giả và giải thích nghĩa vụ tôn trọng bản quyền đối với các sản phẩm số.
`;

export const ADAPTIVE_PROMPT_TEMPLATE = `
Dựa trên lịch sử trả lời câu hỏi trắc nghiệm gần đây của học sinh, hãy phân tích và đưa ra các gợi ý để cải thiện việc học. Lịch sử được cung cấp dưới dạng một mảng JSON.
Lịch sử trả lời (10 câu gần nhất):
{attempts}

Vui lòng trả về một đối tượng JSON với cấu trúc sau:
{
  "knowledge_gaps": ["string"],
  "next_difficulty": "string",
  "recommended_topics": ["string"]
}

Trong đó:
- "knowledge_gaps" là một mảng chuỗi liệt kê các lỗ hổng kiến thức cụ thể dựa trên các câu trả lời sai.
- "next_difficulty" là một chuỗi đề xuất độ khó cho câu hỏi tiếp theo ('Easy', 'Medium', hoặc 'Hard').
- "recommended_topics" là một mảng chuỗi đề xuất các chủ đề liên quan mà học sinh nên xem lại.
`;

export const EXPLANATION_PROMPT_TEMPLATE = `
Giải thích chi tiết và rõ ràng cho câu hỏi trắc nghiệm sau đây, tập trung vào việc tại sao đáp án đúng lại đúng và tại sao các đáp án sai lại sai. Giải thích bằng tiếng Việt cho học sinh lớp 10.
Câu hỏi: {question}
Các lựa chọn:
{options}
Đáp án đúng: {correctAnswerText}
Câu trả lời của học sinh: {userAnswerText}

Cung cấp một lời giải thích toàn diện và dễ hiểu.
`;