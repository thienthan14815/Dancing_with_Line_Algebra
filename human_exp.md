# Human Experience (human_exp.md)

# LA App — Human Experience (HX) Design

## Design Vision

LA không phải là một ứng dụng đọc tài liệu hay xem video. Mục tiêu là xây dựng một **AI Learning Operating System** giúp người học luôn biết:

1. Mình đang ở đâu?
2. Mình cần làm gì tiếp theo?
3. Tại sao phải học bước này?
4. AI có thể giúp gì ngay lúc này?
5. Mình đã tiến bộ đến đâu?

Nếu người dùng luôn trả lời được 5 câu hỏi trên thì UX được xem là thành công.

---

# Core Principles

## 1. One Screen = One Goal

Mỗi màn hình chỉ nên phục vụ một mục tiêu duy nhất.

Ví dụ Lesson:

Theory
→ Example
→ Interactive Animation
→ Mini Quiz
→ Summary
→ Continue

Không hiển thị đồng thời Discussion, Ranking, Community, Setting...

---

## 2. Progressive Disclosure

Chỉ hiển thị đúng lượng thông tin cần thiết.

Ví dụ:

Matrix Multiplication

Ban đầu:

- Learn
- Practice

Sau khi nhấn Learn mới mở:

- Definition
- Visualization
- AI Explain
- Example
- Applications

---

## 3. AI First, But Invisible

AI không phải là một tab chat.

AI xuất hiện đúng thời điểm:

- Sai bài → "Need a hint?"
- Dừng lâu → "Want a visualization?"
- Hoàn thành bài → "Would you like a harder challenge?"
- Học liên tục → "Ready for the next concept?"

AI chủ động hỗ trợ thay vì chờ được gọi.

---

# Navigation

Bottom Navigation chỉ gồm 5 mục:

- Learn
- Practice
- AI
- Progress
- Me

## Learn

- Continue Learning
- Roadmap
- Chapter
- Lesson
- Knowledge Graph

## Practice

- Exercises
- Challenge
- Mistake Notebook
- Review

## AI

- Ask AI
- Explain
- Hint
- Generate Questions
- Voice Tutor
- Image Solver

## Progress

- XP
- Streak
- Mastery
- Weak Topics
- Calendar
- Achievements

## Me

- Profile
- Theme
- Downloads
- Language
- Subscription

---

# Learning Flow

Goal

↓

Warm-up (1 minute)

↓

Learn

↓

Animation

↓

Example

↓

Exercise

↓

Reflection

↓

AI Feedback

↓

Reward

↓

Next Lesson

---

# Knowledge Graph

Không tổ chức theo Chapter đơn thuần.

Thay vào đó là mạng kiến thức:

Vector
→ Matrix
→ Linear Transformation
→ Eigenvalue
→ Eigenvector
→ SVD
→ PCA

Người học luôn biết:

- Đang học gì
- Đến từ đâu
- Bước tiếp theo là gì

---

# Visual Hierarchy

Mỗi màn hình:

Title

↓

One sentence description

↓

Illustration / Animation

↓

Primary CTA

↓

Secondary CTA

Chỉ có một CTA chính.

---

# Gamification

Giữ ở mức vừa đủ.

Bao gồm:

- XP
- Level
- Daily Goal
- Streak
- Achievement

Không sử dụng quá nhiều badge, popup hay hiệu ứng gây mất tập trung.

---

# Animation Principles

Animation phải phục vụ việc học.

Ví dụ:

Matrix Multiplication

A × B

↓

Cells Move

↓

Result Appears

Linear Transformation

Grid

↓

Stretch

↓

Rotate

↓

Shear

Eigenvector

Arrow

↓

Direction Remains

Animation dùng để giải thích khái niệm, không chỉ để trang trí.

---

# Color System

Primary Blue → Learning

Green → Correct

Orange → Hint

Red → Mistake

Gray → Background

Không vượt quá 5 màu chính.

---

# Homepage Structure

Launch

↓

Daily Goal

↓

Continue Learning

↓

Today's Lesson

↓

Knowledge Map

↓

Progress Snapshot

↓

Recent Achievements

---

# Human Experience Rules

- Người dùng không bao giờ bị lạc.
- Luôn biết bước tiếp theo.
- Mỗi thao tác đều có phản hồi ngay lập tức.
- AI hỗ trợ đúng ngữ cảnh.
- Nội dung luôn quan trọng hơn hiệu ứng.
- Hoạt ảnh chỉ xuất hiện khi giúp người học hiểu nhanh hơn.
- Điều hướng tối giản, nhất quán.
- Giảm tối đa tải nhận thức (Cognitive Load).

---

# Design DNA

## 40% Linear

- Dashboard gọn gàng
- Typography rõ ràng
- Khoảng trắng rộng
- Điều hướng tối giản

## 25% Apple HIG

- Animation mượt
- Transition tự nhiên
- Card bo góc
- Phản hồi trực quan

## 20% Notion

- Giao diện yên tĩnh
- Dễ đọc
- Ít nhiễu thị giác
- Nội dung là trung tâm

## 15% Duolingo

- XP
- Streak
- Progress
- Daily Goal
- Achievement

Gamification chỉ đóng vai trò tạo động lực, không biến việc học thành trò chơi.

---

# Ultimate Experience

Người dùng không cần suy nghĩ:

"Tôi phải làm gì tiếp theo?"

Ứng dụng luôn dẫn dắt:

Continue Learning
→ Learn
→ Understand
→ Practice
→ AI Feedback
→ Reward
→ Next Lesson

Toàn bộ trải nghiệm phải mang lại cảm giác:

- Đơn giản
- Thông minh
- Bình tĩnh
- Có định hướng
- Luôn tiến về phía trước
