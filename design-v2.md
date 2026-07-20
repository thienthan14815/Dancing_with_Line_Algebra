# LA App Design System v2

## Philosophy

LA (Line Algebra) không phải là một ứng dụng học tập truyền thống.

Mục tiêu là tạo ra cảm giác:

> **A calm, intelligent workspace for learning mathematics.**

Người dùng không mở app để "chơi game", mà để **tập trung suy nghĩ**. Mọi thành phần UI đều phải giảm tải nhận thức (Cognitive Load), giúp người học tập trung vào kiến thức thay vì giao diện.

---

# Design DNA

| Nguồn cảm hứng        | Tỷ lệ | Mục tiêu                                          |
| --------------------- | ----: | ------------------------------------------------- |
| Linear.app            |   40% | Layout, khoảng trắng, typography, hierarchy       |
| Apple Human Interface |   25% | Motion, transition, touch feeling, card design    |
| Notion                |   20% | Minimalism, readability, information organization |
| Duolingo              |   15% | Motivation, XP, streak, progress, achievement     |

Không sao chép giao diện của bất kỳ sản phẩm nào.

Chỉ kế thừa triết lý thiết kế.

---

# Core Principles

## 1. Less but Better

Mỗi màn hình chỉ nên có một mục tiêu.

Không bao giờ hiển thị nhiều chức năng cùng lúc.

Ví dụ:

❌

* Continue Learning
* Leaderboard
* Marketplace
* Daily Quest
* Friend
* Notification
* Event
* Ranking

✅

* Continue Learning
* Today's Goal
* AI Tutor

---

## 2. White Space is UI

Khoảng trắng không phải là vùng trống.

Khoảng trắng chính là thành phần quan trọng nhất.

Spacing Scale

* 8px
* 16px
* 24px
* 32px
* 48px
* 64px

Không sử dụng khoảng cách ngẫu nhiên.

---

## 3. Typography before Decoration

Thông tin luôn quan trọng hơn hiệu ứng.

Typography tạo hierarchy thay vì dùng quá nhiều màu sắc.

Ví dụ

Display

40px

Heading

28px

Title

22px

Body

16px

Caption

13px

---

## 4. Motion with Purpose

Animation chỉ xuất hiện khi giúp người dùng hiểu trạng thái hệ thống.

Không dùng animation chỉ để "đẹp".

Các animation được phép:

* Card Fade In
* Bottom Sheet Slide Up
* Hero Transition
* Progress Fill
* Success Bounce
* AI Typing Indicator

Không sử dụng:

* Zoom liên tục
* Flash
* Spin
* Shake không cần thiết

---

# Visual Language

## Background

Primary Background

F7F8FA

Secondary Background

FFFFFF

Card

FFFFFF

Divider

ECECEC

---

## Text

Primary

111111

Secondary

666666

Hint

999999

Disabled

BBBBBB

---

## Accent

Primary Accent

5B6CFF

Success

2ECC71

Warning

F4B400

Danger

FF5F57

Không sử dụng quá một màu nhấn trong cùng một màn hình.

---

# Border Radius

Button

18px

Card

24px

Bottom Sheet

32px

Avatar

Circle

Chip

999px

Toàn bộ app phải thống nhất.

---

# Elevation

Không sử dụng shadow đậm.

Level 0

No Shadow

Level 1

Blur nhẹ

Level 2

Floating Card

Level 3

Modal

---

# Icon System

Sử dụng icon dạng outline.

Chỉ duy trì khoảng 10–15 icon xuyên suốt ứng dụng.

Ví dụ

Home

Book

AI

Search

Chart

Fire

Star

Clock

Settings

Profile

Không trộn nhiều bộ icon khác nhau.

---

# Layout Structure

Mỗi màn hình tuân theo cấu trúc:

Header

↓

Primary Content

↓

Secondary Content

↓

Bottom Navigation

Không đặt FAB nổi nếu không thật sự cần.

---

# Home Screen

Thứ tự hiển thị

1. Greeting

2. Continue Learning

3. Today's Goal

4. Practice

5. AI Tutor

6. Progress

7. Bottom Navigation

Không thêm banner quảng cáo hoặc popup khi mở app.

---

# Lesson Screen

Thứ tự

Lesson Title

↓

Concept Animation

↓

Explanation

↓

Example

↓

Interactive Practice

↓

Next

Người học luôn nhìn thấy đúng một nội dung chính.

---

# AI Experience

AI là trung tâm của hệ thống.

Người dùng có thể:

* Ask
* Explain
* Visualize
* Generate Example
* Generate Quiz
* Review Mistakes

AI không được che khuất nội dung bài học.

AI là người hướng dẫn, không phải nhân vật chính.

---

# Gamification

Gamification phải hỗ trợ việc học.

Không biến ứng dụng thành trò chơi.

Cho phép

* XP
* Daily Goal
* Streak
* Achievement
* Progress Ring

Không khuyến khích

* Loot Box
* Wheel Spin
* Random Reward
* Pop-up thưởng liên tục

---

# Interaction

Button

Scale

100%

↓

97%

↓

100%

Card

Hover Elevation

Bottom Sheet

Slide Up

Progress

Smooth Fill

Không dùng animation dài hơn khoảng 300ms cho các thao tác thường xuyên.

---

# Navigation

Bottom Navigation gồm 5 mục

Home

Learn

AI

Progress

Profile

Không vượt quá 5 tab chính.

---

# Accessibility

Minimum touch target

44 × 44

Contrast

AA trở lên

Dynamic Text

Có hỗ trợ

Dark Mode

Native

Reduced Motion

Có hỗ trợ

---

# Emotional Design

Ứng dụng phải mang lại cảm giác:

* Bình tĩnh
* Thông minh
* Hiện đại
* Đáng tin cậy
* Tập trung
* Cao cấp

Không tạo cảm giác:

* Ồn ào
* Quá nhiều màu
* Quá nhiều popup
* Quá nhiều hiệu ứng

---

# UX Rules

* Mỗi màn hình chỉ có một CTA chính.
* Người dùng luôn biết bước tiếp theo.
* Không có dead-end screen.
* Mọi thao tác đều có phản hồi trực quan.
* Không yêu cầu nhiều hơn ba lần chạm để bắt đầu học.
* Ưu tiên khả năng đọc hơn trang trí.
* Ưu tiên tốc độ hơn hiệu ứng.

---

# Final Design Statement

LA App được thiết kế như một **AI Workspace for Mathematics**.

Nó không cạnh tranh bằng số lượng hiệu ứng hay màu sắc.

Giá trị cốt lõi nằm ở:

* Sự rõ ràng.
* Sự tập trung.
* Khả năng đọc.
* Trải nghiệm mượt mà.
* AI hỗ trợ học tập đúng thời điểm.

Người dùng nên cảm thấy rằng ứng dụng "biến mất" khỏi nhận thức, chỉ còn lại quá trình học tập và tư duy toán học.
