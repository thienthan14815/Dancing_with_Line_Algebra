"""Import the supplied, trusted HTML lesson source. Requires beautifulsoup4.

Run: python scripts/import-calculus.py
Only lesson markup is imported: document scripts, remote fonts and progress UI
are replaced by the app's renderer and completion store.
"""
import json
from pathlib import Path
from bs4 import BeautifulSoup

root = Path(__file__).resolve().parents[1]
source = root / 'Giai_tich_30_ngay_ban_trinh_bay_lai.html'
target = root / 'src/content/modules/calculus-30'
target.mkdir(parents=True, exist_ok=True)
soup = BeautifulSoup(source.read_text(encoding='utf-8'), 'html.parser')
metadata, content = [], {}
for day in range(1, 31):
    lesson_id = f'd{day:02}'
    section = soup.select_one(f'section#{lesson_id}')
    assert section is not None, f'Missing {lesson_id}'
    heading = section.h2
    badge = heading.select_one('.test')
    title = heading.get_text(' ', strip=True)
    if badge:
        title = title.removesuffix(badge.get_text(' ', strip=True)).strip()
    metadata.append({
        'id': lesson_id, 'day': day,
        'title': title,
        'skillId': f'calculus_{lesson_id}',
        'objective': section.select_one('.goal').get_text(' ', strip=True).removeprefix('Mục tiêu:').strip(),
        'stage': section.select_one('.eyebrow').get_text(' ', strip=True),
    })
    for element in section.select('.done, script, iframe, link'):
        element.decompose()
    for element in section.find_all(True):
        for attr in list(element.attrs):
            if attr.lower().startswith('on'):
                del element[attr]
    content[lesson_id] = str(section)
content['cards'] = str(soup.select_one('section#cards'))
for name, value in [('lessons.json', metadata), ('content.json', content)]:
    (target / name).write_text(json.dumps(value, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Imported {len(metadata)} days and formula cards; {sum(len(BeautifulSoup(v, "html.parser").select("details.ans")) for v in content.values())} original answers preserved.')
