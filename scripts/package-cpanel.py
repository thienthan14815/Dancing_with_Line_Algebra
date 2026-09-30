"""Package the current production build without an enclosing dist directory."""
from datetime import datetime
from hashlib import sha256
from pathlib import Path
from zipfile import ZipFile, ZipInfo, ZIP_DEFLATED

root = Path(__file__).resolve().parents[1]
dist = root / 'dist'
assert (dist / 'index.html').is_file(), 'Run npm run build first'
assert (dist / 'sw.js').is_file(), 'Production service worker is missing'
output = root / 'releases'
output.mkdir(exist_ok=True)
archive = output / f'linal-lab-cpanel-{datetime.now():%Y%m%d-%H%M%S}.zip'
files = sorted(path for path in dist.rglob('*') if path.is_file())
with ZipFile(archive, 'w', ZIP_DEFLATED) as bundle:
    for path in files:
        # Windows stat modes otherwise become world-writable 0666 on Linux.
        entry = ZipInfo(path.relative_to(dist).as_posix(), datetime.now().timetuple()[:6])
        entry.create_system = 3
        entry.external_attr = 0o100644 << 16
        entry.compress_type = ZIP_DEFLATED
        bundle.writestr(entry, path.read_bytes())
with ZipFile(archive) as bundle:
    assert bundle.testzip() is None
    assert 'index.html' in bundle.namelist()
print(f'Package: {archive}')
print(f'Files: {len(files)}; bytes: {archive.stat().st_size}')
print(f'SHA256: {sha256(archive.read_bytes()).hexdigest()}')
