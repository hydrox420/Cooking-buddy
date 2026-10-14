#!/usr/bin/env python3
"""Download legally attributed recipe photographs as optimized local WebP assets.

Run this from repository root in CI or locally:
    python3 preview-1-2/build_recipe_photos.py

No generated image is substituted for a missing/failed source photo.
Failed downloads are reported and existing images are left in place.
"""
from __future__ import annotations
import json, io, time, re, urllib.request, urllib.error
from pathlib import Path
from PIL import Image, ImageOps, UnidentifiedImageError

HERE = Path(__file__).resolve().parent
ASSETS = HERE / 'assets' / 'recipes'
MANIFEST = HERE / 'photo-sources.json'
REPORT = HERE / 'photo-download-report.json'
HEADERS = {
    'User-Agent': 'KitchenBuddyPhotoPack/1.0 (personal recipe cookbook; contact through project repository)',
    'Accept': 'image/avif,image/webp,image/jpeg,image/png,image/*;q=0.8',
}

def get_photo(url: str) -> bytes:
    if not url.startswith('https://'):
        raise ValueError('Only https image sources allowed')
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req, timeout=35) as response:
        mime = response.headers.get('Content-Type', '')
        if not mime.startswith('image/'):
            raise ValueError(f'Expected image, received {mime!r}')
        data = response.read(16_000_001)
        if len(data) > 16_000_000:
            raise ValueError('Photo exceeds 16 MB source limit')
        return data

def render_webp(data: bytes, out: Path) -> tuple[int, int, int]:
    with Image.open(io.BytesIO(data)) as img:
        img.load()
        if img.width < 320 or img.height < 240:
            raise ValueError(f'Image too small: {img.size}')
        # Scale + crop to 4:3 for consistent cards, preserving natural color.
        img = ImageOps.exif_transpose(img).convert('RGB')
        img = ImageOps.fit(img, (800, 600), method=Image.Resampling.LANCZOS,
                           centering=(0.5, 0.46))
        out.parent.mkdir(parents=True, exist_ok=True)
        img.save(out, 'WEBP', quality=83, method=5)
    return 800, 600, out.stat().st_size

def main():
    rows = json.loads(MANIFEST.read_text(encoding='utf-8'))['images']
    result = {'processed': 0, 'already_present': 0, 'downloaded': 0, 'failed': []}
    for row in rows:
        ident = row['id']
        if not re.fullmatch(r'[a-z0-9-]{3,100}', ident):
            raise ValueError(f'Unsafe file id: {ident}')
        out = ASSETS / f'{ident}.webp'
        # Always regenerate from the current manifest. Otherwise a new URL
        # would silently leave the old recipe photograph in the bundle.
        result['processed'] += 1
        failure = None
        for attempt in range(3):
            try:
                image = get_photo(row['url'])
                dimensions = render_webp(image, out)
                result['downloaded'] += 1
                print(f'OK   {ident}: {dimensions}', flush=True)
                failure = None
                break
            except (Exception,) as exc:
                failure = f'{type(exc).__name__}: {exc}'
                if attempt < 2:
                    time.sleep(2 + attempt * 3)
        if failure:
            result['failed'].append({'id':ident, 'reason': failure})
            print(f'FAIL {ident}: {failure}', flush=True)
    REPORT.write_text(json.dumps(result, indent=2)+'\n', encoding='utf-8')
    print(json.dumps(result, indent=2))
    # Failure does not erase other successfully downloaded assets; keep report.
    if result['failed']:
        print(f"ERROR: {len(result['failed'])} photos need a different source.")
        raise SystemExit(1)  # Never report a partially bundled photo pack as success.

if __name__=='__main__':
    main()
