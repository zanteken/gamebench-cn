"""
批量翻译游戏名称（英文 -> 中文）
使用百度翻译 API
"""

import json
import time
import hashlib
import random
import requests
from pathlib import Path

# 百度翻译 API 配置
# 你需要去 https://fanyi-api.baidu.com/ 注册获取
APP_ID = "20250101002076173"  # 替换你的 APP ID
SECRET_KEY = "EfGZ3kzSWRdP8VWqITX_"  # 替换你的密钥

# 输入文件
INPUT_FILE = Path(__file__).parent.parent / "data" / "games_to_translate.json"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "games_translated.json"

def translate_baidu(text, from_lang="en", to_lang="zh"):
    """使用百度翻译 API"""
    url = "https://fanyi-api.baidu.com/api/trans/vip/translate"

    # 生成签名
    salt = str(random.randint(32768, 65536))
    sign = hashlib.md5((APP_ID + text + salt + SECRET_KEY).encode()).hexdigest()

    params = {
        "q": text,
        "from": from_lang,
        "to": to_lang,
        "appid": APP_ID,
        "salt": salt,
        "sign": sign,
    }

    try:
        response = requests.get(url, params=params, timeout=5)
        if response.status_code == 200:
            result = response.json()
            if "trans_result" in result:
                return result["trans_result"][0]["dst"]
            elif "error_code" in result:
                print(f"  [!] API 错误: {result.get('error_msg', result)}")
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
    if i % 100 == 0:
        print(f"[进度] {i}/{len(games)}...")

    translated = translate_baidu(game["nameEn"])

    if not translated:
        # 失败时使用原文
        translated = game["nameEn"]
        print(f"  [!] 翻译失败: {game['nameEn']}")

    results.append({
        "appId": game["appId"],
        "nameEn": game["nameEn"],
        "nameZh": translated
    })

    # 避免限速 (百度免费版 QPS=1)
    time.sleep(1.1)

# 保存结果
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n[OK] 翻译完成，保存到: {OUTPUT_FILE}")
