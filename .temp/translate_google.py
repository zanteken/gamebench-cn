# -*- coding: utf-8 -*-
"""
批量翻译游戏名称（英文 -> 中文）
使用 Google Translate 免费接口
"""

import json
import time
import requests
from pathlib import Path

# 输入文件
INPUT_FILE = Path(__file__).parent.parent / "data" / "games_to_translate.json"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "games_translated.json"

def translate_google(text):
    """使用 Google Translate 免费接口"""
    url = "https://translate.googleapis.com/translate_a/single"
    params = {
        "client": "gtx",
        "sl": "en",
        "tl": "zh-CN",
        "dt": "t",
        "q": text
    }

    try:
        response = requests.get(url, params=params, timeout=10)
        if response.status_code == 200:
            result = response.json()
            if result and result[0] and result[0][0]:
                return result[0][0][0]
    except Exception as e:
        print(f"  [!] 请求异常: {e}")

    return None

# 加载需要翻译的游戏
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    games = json.load(f)

print(f"需要翻译的游戏数量: {len(games)}")

# 翻译所有游戏名称
results = []
for i, game in enumerate(games):
    if i % 50 == 0:
        print(f"[进度] {i}/{len(games)}...")

    translated = translate_google(game["nameEn"])

    if not translated:
        translated = game["nameEn"]

    results.append({
        "appId": game["appId"],
        "nameEn": game["nameEn"],
        "nameZh": translated
    })

    # 避免限速
    time.sleep(0.3)

# 保存结果
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n[OK] 翻译完成，保存到: {OUTPUT_FILE}")
