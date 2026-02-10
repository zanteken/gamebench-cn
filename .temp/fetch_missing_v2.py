# -*- coding: utf-8 -*-
"""
从 missing_appids.json 抓取缺失的游戏 - 增强版
"""

import json
import time
import requests
from pathlib import Path

# 文件路径
MISSING_FILE = Path(__file__).parent.parent / "data" / "missing_appids.json"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "fetched_missing_games2.json"
EXISTING_FILE = Path(__file__).parent.parent / "data" / "fetched_missing_games.json"

# 加载缺失 AppID
with open(MISSING_FILE, "r", encoding="utf-8") as f:
    missing_appids = json.load(f)

print(f"需要获取 {len(missing_appids)} 个 AppID")

# 加载已抓取的数据
existing = {}
if EXISTING_FILE.exists():
    with open(EXISTING_FILE, "r", encoding="utf-8") as f:
        existing_data = json.load(f)
        for game in existing_data:
            existing[game["appId"]] = game
    print(f"已有数据: {len(existing)} 款游戏")

# 加载输出文件（如果存在）
output_existing = {}
if OUTPUT_FILE.exists():
    with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
        output_data = json.load(f)
        for game in output_data:
            output_existing[game["appId"]] = game
    print(f"输出文件已有: {len(output_existing)} 款游戏")

# 合并已有数据
existing.update(output_existing)

# 过滤掉已抓取的
app_ids = [aid for aid in missing_appids if aid not in existing]
print(f"待抓取: {len(app_ids)} 个 AppID")

def fetch_app_details(app_id: int, retries: int = 5) -> dict | None:
    """获取单个游戏详情"""
    # 先尝试英文API（更稳定）
    url = "https://store.steampowered.com/api/appdetails"

    for attempt in range(retries):
        try:
            # 使用英文API作为fallback
            params = {
                "appids": app_id,
                "l": "english",
                "cc": "us",
            }

            resp = requests.get(url, params=params, timeout=20)

            if resp.status_code == 429:
                wait = 30 + (attempt * 10)
                print(f"  [!] 限速，等待 {wait} 秒...")
                time.sleep(wait)
                continue

            if resp.status_code == 200:
                result = resp.json()
                app_data = result.get(str(app_id), {})

                if app_data.get("success"):
                    return app_data["data"]
                else:
                    # API返回success=false，可能是下架或无效
                    return None

        except requests.exceptions.Timeout:
            print(f"  [!] 超时，重试 ({attempt+1}/{retries})...")
            time.sleep(5)
        except Exception as e:
            print(f"  [!] 异常: {e}")
            time.sleep(2)

    return None

def parse_game_data(app_id: int, data: dict) -> dict:
    """解析游戏数据"""
    return {
        "appId": app_id,
        "name": data.get("name", ""),
        "slug": data.get("name", "").lower().replace(",", "").replace(":", "").replace("/", "-").replace(" ", "-").replace("'", "").replace("---", "-").replace("--", "-"),
        "type": data.get("type", "game"),
        "isFree": data.get("is_free", False),
        "headerImage": data.get("header_image", ""),
        "developers": data.get("developers", []),
        "publishers": data.get("publishers", []),
        "genres": [g["description"] for g in data.get("genres", [])],
        "categories": [c["description"] for c in data.get("categories", [])],
        "contentDescriptors": [],
        "contentDescriptorsEn": [],
        "releaseDate": data.get("release_date", {}).get("date", ""),
        "platforms": data.get("platforms", {}),
        "price": data.get("price_overview", None),
        "metacritic": data.get("metacritic", None),
        "recommendations": data.get("recommendations", {}).get("total", 0),
        "requirements": {
            "minimum": {"cpu": None, "gpu": None, "ram_gb": None, "storage": None, "directx": None},
            "recommended": {"cpu": None, "gpu": None, "ram_gb": None, "storage": None, "directx": None}
        },
        "comingSoon": data.get("release_date", {}).get("coming_soon", False),
    }

# 批量获取
results = list(existing.values())
total = len(app_ids)
success_count = 0
fail_count = 0

for i, app_id in enumerate(app_ids, 1):
    print(f"[{i}/{total}] App {app_id}...", end=" ", flush=True)

    data = fetch_app_details(app_id)

    if data:
        game = parse_game_data(app_id, data)
        results.append(game)
        success_count += 1
        try:
            name = data.get('name', '')[:50]
            print(f"[OK] {name}")
        except:
            print(f"[OK]")
    else:
        fail_count += 1
        print(f"[SKIP] API返回无效")

    # 每50个保存一次
    if i % 50 == 0:
        with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"  [*] 进度: 成功 {success_count}, 跳过 {fail_count}, 已保存 {len(results)}")

    # 限速
    if i < total:
        time.sleep(1.5)

# 最终保存
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n[OK] 完成!")
print(f"  成功: {success_count}")
print(f"  跳过: {fail_count}")
print(f"  总计: {len(results)}")
print(f"  保存到: {OUTPUT_FILE}")
