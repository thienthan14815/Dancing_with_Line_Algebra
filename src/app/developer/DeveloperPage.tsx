import { useState } from 'react';
import { Link } from 'react-router-dom';
import { chapters } from '../../chapters/registry';
import { COURSE } from '../../core/content/course';
import { useDeveloperMode } from '../../core/developerMode';
import { MODULES } from '../../content/registry';
import './developer.css';

const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

export default function DeveloperPage() {
  const enabled = useDeveloperMode((state) => state.enabled);
  const setEnabled = useDeveloperMode((state) => state.setEnabled);
  const [search, setSearch] = useState('');
  const query = normalize(search.trim());
  const visible = chapters.map((chapter) => ({
    ...chapter,
    lessons: chapter.lessons.filter((lesson) => normalize(`${chapter.title} ${lesson.title} ${chapter.id} ${lesson.id}`).includes(query)),
  })).filter((chapter) => chapter.lessons.length > 0);

  return <div className="dl-page developer-page">
    <h1>Kiểm tra giáo trình</h1>
    <p>Mở trực tiếp lý thuyết, hình minh họa hoặc bài tập của bất kỳ bài học nào.</p>
    {!enabled ? <div className="panel">
      <p>Bật Developer mode để xem toàn bộ bài học và thử đáp án mà không ghi tiến độ.</p>
      <button className="btn" type="button" onClick={() => setEnabled(true)}>Bật Developer mode</button>
    </div> : <>
      <label className="developer-search">Tìm bài học
        <input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tên bài, chương hoặc mã bài…" />
      </label>
      <p role="status">{visible.reduce((count, chapter) => count + chapter.lessons.length, 0)} bài · {visible.length} chương</p>
      {visible.map((chapter) => <section className="panel" key={chapter.id}>
        <h2>{chapter.num}. {chapter.title}</h2>
        <ul className="developer-lessons">{chapter.lessons.map((lesson) => {
          const unit = COURSE.sections.find((section) => section.id === chapter.id)?.units.find((candidate) => candidate.id === `${chapter.id}:${lesson.id}`);
          return <li key={lesson.id}>
            <span>{lesson.title}</span>
            <div>
              <Link to={`/ch/${chapter.id}/${lesson.id}`}>Học & hình</Link>
              {!MODULES.some((module) => module.id === chapter.id) && <Link to={`/ch/${chapter.id}/${lesson.id}/kiem-tra`}>Kiểm tra hiểu</Link>}
              {unit?.lessons.filter((candidate) => candidate.kind !== 'concept').map((candidate) =>
                <Link key={candidate.id} to={`/learn/${candidate.id}`}>{candidate.kind === 'practice' ? 'Bài tập' : candidate.kind === 'review' ? 'Ôn tập' : 'Thử thách'}</Link>,
              )}
            </div>
          </li>;
        })}</ul>
      </section>)}
      {visible.length === 0 && <p>Không tìm thấy bài phù hợp.</p>}
    </>}
  </div>;
}
