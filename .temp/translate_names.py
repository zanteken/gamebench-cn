"""
批量翻译游戏名称（英文 -> 中文）
使用 Google Translate API (通过 googletrans 库)
"""

import json
import time
import requests
from pathlib import Path

# 输入文件
INPUT_FILE = Path(__file__).parent.parent / "data" / "games_to_translate.json"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "games_translated.json"

# 加载需要翻译的游戏
with open(INPUT_FILE, "r", encoding="utf-8") as f:
    games = json.load(f)

print(f"需要翻译的游戏数量: {len(games)}")

def translate_text(text, retries=3):
    """使用 LibreTranslate (免费 API) 翻译文本"""
    url = "https://libretranslate.com/translate"
    data = {
        "q": text,
        "source": "en",
        "target": "zh",
        "format": "text"
    }

    for attempt in range(retries):
        try:
            response = requests.post(url, data=data, timeout=10)
            if response.status_code == 200:
                result = response.json()
                return result.get("translatedText", text)
            elif response.status_code == 429:
                print(f"  [!] 限速，等待 5 秒...")
                time.sleep(5)
            else:
                print(f"  [!] 错误: {response.status_code}")
        except Exception as e:
            print(f"  [!] 异常: {e}")

    return text  # 失败时返回原文

def translate_with_my_memory(text):
    """使用 MyMemory 免费翻译 API"""
    url = f"https://api.mymemory.translated.net/get?q={text}&langpair=en|zh"

    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            result = response.json()
            translated = result.get("responseData", {}).get("translatedText")
            if translated and translated != text:
                return translated
    except:
        pass

    return None

# 翻译所有游戏名称
results = []
batch_size = 100

for i, game in enumerate(games):
    if i % batch_size == 0:
        print(f"\n[进度] {i}/{len(games)}...")

    # 先尝试 MyMemory (更快)
    translated = translate_with_my_memory(game["nameEn"])

    # 如果失败，尝试 LibreTranslate
    if not translated:
        translated = translate_text(game["nameEn"])

    results.append({
        "appId": game["appId"],
        "nameEn": game["nameEn"],
        "nameZh": translated
    })

    # 避免限速
    time.sleep(0.1)

# 保存结果
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n[OK] 翻译完成，保存到: {OUTPUT_FILE}")
