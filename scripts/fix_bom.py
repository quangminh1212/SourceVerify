#!/usr/bin/env python3
"""Remove BOM from all i18n JSON files."""
import os
import glob

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
fixed = 0

# Find ALL json files in methods i18n dirs
for root, dirs, files in os.walk(os.path.join(BASE_DIR, "src", "app", "methods")):
    for fname in files:
        if fname.endswith(".json"):
            fpath = os.path.join(root, fname)
            with open(fpath, "rb") as f:
                data = f.read()
            if data.startswith(b"\xef\xbb\xbf"):
                with open(fpath, "wb") as f:
                    f.write(data[3:])
                fixed += 1
                print(f"Fixed BOM: {os.path.relpath(fpath, BASE_DIR)}")

# Also fix global locales
for fname in os.listdir(os.path.join(BASE_DIR, "src", "i18n", "locales")):
    if fname.endswith(".json"):
        fpath = os.path.join(BASE_DIR, "src", "i18n", "locales", fname)
        with open(fpath, "rb") as f:
            data = f.read()
        if data.startswith(b"\xef\xbb\xbf"):
            with open(fpath, "wb") as f:
                f.write(data[3:])
            fixed += 1
            print(f"Fixed BOM: {os.path.relpath(fpath, BASE_DIR)}")

print(f"\nTotal files fixed: {fixed}")
