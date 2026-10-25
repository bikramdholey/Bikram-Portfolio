#!/usr/bin/env python3
"""Make memory photos web-sized before the site is built (run in CI).

- Photos larger than MAX_SIDE px are shrunk (rotation from EXIF is applied first).
- iPhone HEIC/HEIF photos are converted to JPEG, since browsers can't show them.

Works on the build checkout only; the originals in the repository are untouched.
Usage: python _scripts/optimize_memory_photos.py [photos_dir]
"""
import os
import sys

from PIL import Image, ImageOps

try:
    from pillow_heif import register_heif_opener

    register_heif_opener()
    HEIF = True
except ImportError:
    HEIF = False

MAX_SIDE = 1600
ROOT = sys.argv[1] if len(sys.argv) > 1 else "assets/img/memories"

resized = converted = skipped = 0
for dirpath, _, names in os.walk(ROOT):
    for name in names:
        path = os.path.join(dirpath, name)
        stem, ext = os.path.splitext(name)
        ext = ext.lower()
        if name.startswith("._") or name == ".DS_Store":
            os.remove(path)  # macOS metadata files, not photos
            continue
        heic = ext in (".heic", ".heif")
        if not (heic or ext in (".jpg", ".jpeg", ".png", ".webp")):
            continue
        if heic and not HEIF:
            skipped += 1
            continue
        try:
            with Image.open(path) as im:
                if not heic and max(im.size) <= MAX_SIDE:
                    continue
                im = ImageOps.exif_transpose(im)
                im.thumbnail((MAX_SIDE, MAX_SIDE), Image.LANCZOS)
                if heic:
                    out = os.path.join(dirpath, stem + ".jpg")
                    im.convert("RGB").save(out, "JPEG", quality=82, optimize=True, progressive=True)
                    converted += 1
                elif ext == ".png":
                    im.save(path, "PNG", optimize=True)
                    resized += 1
                elif ext == ".webp":
                    im.save(path, "WEBP", quality=82)
                    resized += 1
                else:
                    im.convert("RGB").save(path, "JPEG", quality=82, optimize=True, progressive=True)
                    resized += 1
            if heic:
                os.remove(path)
        except Exception as e:  # leave anything unreadable as it is
            skipped += 1
            print(f"skipped {path}: {e}")

print(f"memory photos: resized={resized} heic->jpg={converted} skipped={skipped}")
