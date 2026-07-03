#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script để gộp các file sections vào Report_Overleaf.tex
Thứ tự gộp:
1. 00-preface.tex
2. 01-summary.tex
3. 02-introduction.tex
4. 03-theory.tex
5. 04-system-design.tex
6. 05-implementation-results.tex
7. 06-conclusion.tex
8. 07-references.tex
"""

import os
import sys

# Đường dẫn
DOCS_DIR = os.path.dirname(os.path.abspath(__file__))
REPORT_FILE = os.path.join(DOCS_DIR, "Report_Overleaf.tex")
SECTIONS_DIR = os.path.join(DOCS_DIR, "sections")

# Thứ tự các file sections
SECTIONS_ORDER = [
    "00-preface.tex",
    "01-summary.tex",
    "02-introduction.tex",
    "03-theory.tex",
    "04-system-design.tex",
    "05-implementation-results.tex",
    "06-conclusion.tex",
    "07-references.tex"
]

def read_file_content(file_path):
    """Đọc nội dung file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"Warning: File {file_path} không tồn tại")
        return ""
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return ""

def merge_sections():
    """Gộp các sections vào report"""
    
    print(f"DOCS_DIR: {DOCS_DIR}")
    print(f"REPORT_FILE: {REPORT_FILE}")
    print(f"SECTIONS_DIR: {SECTIONS_DIR}")
    
    # Đọc phần preamble của Report_Overleaf.tex (từ đầu đến \begin{document})
    preamble = ""
    sections_content = []
    
    # Đọc nội dung hiện tại của Report_Overleaf.tex
    report_content = read_file_content(REPORT_FILE)
    
    # Tìm phần preamble (trước \begin{document})
    if report_content:
        begin_doc_idx = report_content.find(r"\begin{document}")
        if begin_doc_idx != -1:
            preamble = report_content[:begin_doc_idx]
    
    # Đọc từng section theo thứ tự
    for section_file in SECTIONS_ORDER:
        section_path = os.path.join(SECTIONS_DIR, section_file)
        content = read_file_content(section_path)
        if content:
            # Thêm comment để đánh dấu section
            sections_content.append(f"% === {section_file} ===\n")
            sections_content.append(content)
            sections_content.append("\n\n")
            print(f"✓ Đã gộp {section_file}")
        else:
            print(f"✗ Bỏ qua {section_file} (không có nội dung)")
    
    # Gộp tất cả lại
    merged_content = preamble + r"\begin{document}" + "\n"
    merged_content += r"\pagenumbering{gobble}" + "\n\n"
    merged_content += "".join(sections_content)
    merged_content += r"\end{document}" + "\n"
    
    # Ghi vào Report_Overleaf.tex
    try:
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            f.write(merged_content)
        print(f"\n✓ Đã gộp thành công vào {REPORT_FILE}")
    except Exception as e:
        print(f"Error writing to {REPORT_FILE}: {e}")

if __name__ == "__main__":
    print("Bắt đầu gộp sections vào Report_Overleaf.tex...")
    merge_sections()
