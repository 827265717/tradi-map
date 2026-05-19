#!/usr/bin/env python3
"""
将 /Users/didi/Desktop/民俗分布/*.xlsx 转换为 public/data/folklore.json

文件名 → 类型映射：
  大众戏剧和曲艺 → 曲艺·戏曲
  节庆民俗       → 节庆·花会
  民间工艺美术   → 工艺·作坊
  民间信仰       → 信仰·仪式
  游艺民俗       → 游艺·队列

运行方式：
  cd tradi-map
  python3 scripts/convert_data.py
"""

import json
import os
from pathlib import Path

try:
    import openpyxl
except ImportError:
    print('请先安装 openpyxl：pip3 install openpyxl')
    raise

SOURCE_DIR = Path('/Users/didi/Desktop/民俗分布')
OUTPUT_DIR = Path(__file__).parent.parent / 'public' / 'data'
OUTPUT_FILE = OUTPUT_DIR / 'folklore.json'

FILE_TYPE_MAP = {
    '大众戏剧和曲艺': '曲艺·戏曲',
    '节庆民俗':       '节庆·花会',
    '民间工艺美术':   '工艺·作坊',
    '民间信仰':       '信仰·仪式',
    '游艺民俗':       '游艺·队列',
}


def safe_float(val):
    try:
        f = float(val)
        return f if f != 0.0 else None
    except (TypeError, ValueError):
        return None


def safe_int(val):
    try:
        return int(float(val)) if val is not None else 0
    except (TypeError, ValueError):
        return 0


def safe_str(val):
    if val is None:
        return ''
    s = str(val).strip()
    # Remove NaT / None strings
    return '' if s in ('None', 'NaT', 'nan') else s


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    entries = []
    global_idx = 0

    for filepath in sorted(SOURCE_DIR.glob('*.xlsx')):
        filename = filepath.stem

        folk_type = None
        for key, t in FILE_TYPE_MAP.items():
            if key in filename:
                folk_type = t
                break

        if not folk_type:
            print(f'[跳过] 无类型映射：{filename}')
            continue

        print(f'[处理] {filename} → {folk_type}')
        wb = openpyxl.load_workbook(filepath, read_only=True, data_only=True)
        ws = wb.active

        count = 0
        skip = 0
        for row_idx, row in enumerate(ws.iter_rows(values_only=True)):
            if row_idx == 0:
                continue  # skip header

            lng = safe_float(row[13])  # N 列：经度
            lat = safe_float(row[14])  # O 列：纬度

            if lng is None or lat is None:
                skip += 1
                continue

            # 粗略过滤中国范围外的坐标（避免无效数据）
            if not (73.0 <= lng <= 135.0) or not (15.0 <= lat <= 55.0):
                skip += 1
                continue

            published_at = safe_str(row[16])  # Q 列：发布时间
            year = None
            if published_at and len(published_at) >= 4:
                try:
                    year = int(published_at[:4])
                except ValueError:
                    pass

            entry = {
                'id': f'{folk_type}-{global_idx:05d}',
                'type': folk_type,
                'bio': safe_str(row[8]),           # I 列：简介
                'locationName': safe_str(row[10]), # K 列：地点名称
                'address': safe_str(row[12]),      # M 列：详细地址
                'lat': round(lat, 6),
                'lng': round(lng, 6),
                'publishedAt': published_at,
                'year': year,
                'retweets': safe_int(row[18]),     # S 列：转发数
                'comments': safe_int(row[19]),     # T 列：评论数
                'likes': safe_int(row[20]),        # U 列：点赞数
                'text': safe_str(row[21]),         # V 列：微博正文
            }
            entries.append(entry)
            count += 1
            global_idx += 1

        wb.close()
        print(f'       有效 {count} 条，跳过 {skip} 条（坐标缺失/越界）')

    print(f'\n总计：{len(entries)} 条有效记录')

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(entries, f, ensure_ascii=False, separators=(',', ':'))

    size_mb = OUTPUT_FILE.stat().st_size / 1024 / 1024
    print(f'输出：{OUTPUT_FILE}  ({size_mb:.1f} MB)')


if __name__ == '__main__':
    main()
