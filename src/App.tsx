import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLearnStore } from './core/progress/store';
import Shell from './app/Shell';
import './app/shell.css';

// Trang cũ (giữ nguyên) — chương "cổ điển" + các màn phụ trợ.
import Home from './pages/Home';
import LessonPage from './pages/LessonPage';
const DevCheck = lazy(() => import('./dev-check'));
const MathWiki = lazy(() => import('./wiki/MathWiki'));
const Roadmap = lazy(() => import('./roadmap/Roadmap'));
const Practice = lazy(() => import('./practice/Practice'));

// Màn hình shell MỚI (lazy-load).
const AppHome = lazy(() => import('./app/home/Home')); // do agent HOME tạo song song
const LearningPath = lazy(() => import('./app/path/LearningPath'));
const LessonPlayer = lazy(() => import('./app/player/LessonPlayer'));
const Dashboard = lazy(() => import('./app/progress/Dashboard'));
const Onboarding = lazy(() => import('./app/onboarding/Onboarding'));
const PracticeCenter = lazy(() => import('./app/practice/PracticeCenter'));
const Profile = lazy(() => import('./app/profile/Profile'));
const Guidebook = lazy(() => import('./app/guidebook/Guidebook'));
const Settings = lazy(() => import('./app/settings/Settings'));
const TutorHub = lazy(() => import('./app/tutor/TutorHub'));
const DeveloperPage = lazy(() => import('./app/developer/DeveloperPage'));
const CalculusPage = lazy(() => import('./content/modules/calculus-30/CalculusPage'));

function Loading() {
  return <div className="dl-loading">Đang tải…</div>;
}

/** Trang chủ mới; nhắc onboarding nếu chưa hoàn tất (soft, có thể bỏ qua). */
function HomeRoute() {
  const onboarded = useLearnStore((s) => s.profile.onboarded);
  if (!onboarded) return <Navigate to="/onboarding" replace />;
  return <AppHome />;
}

export default function App() {
  return (
    <HashRouter>
      <Shell>
        <Suspense fallback={<Loading />}>
          <Routes>
            {/* Bộ mặt mới */}
            <Route path="/" element={<HomeRoute />} />
            <Route path="/lo-trinh" element={<LearningPath />} />
            <Route path="/ke-hoach" element={<Roadmap />} />
            <Route path="/learn/:lessonId" element={<LessonPlayer />} />
            <Route path="/luyen" element={<PracticeCenter />} />
            <Route path="/tien-do" element={<Dashboard />} />
            <Route path="/ho-so" element={<Profile />} />
            <Route path="/tutor" element={<TutorHub />} />
            <Route path="/so-tay" element={<Guidebook />} />
            <Route path="/so-tay/:sectionId" element={<Guidebook />} />
            <Route path="/cai-dat" element={<Settings />} />
            <Route path="/developer" element={<DeveloperPage />} />
            <Route path="/giai-tich" element={<CalculusPage />} />
            <Route path="/giai-tich/:dayId" element={<CalculusPage />} />
            <Route path="/onboarding" element={<Onboarding />} />

            {/* Trang "Chương (cổ điển)" = Home cũ */}
            <Route path="/chapters" element={<Home />} />

            {/* Route CŨ — giữ nguyên; thêm trang Kiểm tra hiểu tách riêng */}
            <Route path="/ch/:chapterId/:lessonId" element={<LessonPage />} />
            <Route path="/ch/:chapterId/:lessonId/kiem-tra" element={<LessonPage view="quiz" />} />
            <Route path="/wiki" element={<MathWiki />} />
            <Route path="/luyen-tap" element={<Practice />} />
            <Route path="/luyen-tap/:chapterId" element={<Practice />} />
            <Route path="/dev-check" element={<DevCheck />} />

            {/* Mặc định về trang chủ */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </Shell>
    </HashRouter>
  );
}
