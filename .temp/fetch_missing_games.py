# -*- coding: utf-8 -*-
"""
获取 Top 1000 中缺失的游戏数据
"""

import json
import time
import requests
from pathlib import Path

# 文件路径
MISSING_FILE = Path(__file__).parent.parent / "data" / "missing_top1000.json"
OUTPUT_FILE = Path(__file__).parent.parent / "data" / "fetched_missing_games.json"

# 加载缺失游戏
with open(MISSING_FILE, "r", encoding="utf-8") as f:
    missing = json.load(f)

print(f"需要获取 {len(missing)} 款游戏数据")

# 提取 AppID 列表
app_ids = [g["appid"] for g in missing]
print(f"AppID: {app_ids[:10]}...")

def fetch_app_details(app_id: int, retries: int = 3) -> dict | None:
    """获取单个游戏详情（中文）"""
    url = "https://store.steampowered.com/api/appdetails"
    params = {
        "appids": app_id,
        "l": "schinese",
        "cc": "cn",
    }

    for attempt in range(retries):
        try:
            resp = requests.get(url, params=params, timeout=15)
            if resp.status_code == 429:
                print(f"  [!] 限速，等待 30 秒...")
                time.sleep(30)
                continue
            if resp.status_code == 200:
                result = resp.json()
                app_data = result.get(str(app_id), {})
                if app_data.get("success"):
                    return app_data["data"]
        except Exception as e:
            print(f"  [!] 异常: {e}")

        time.sleep(2)

    return None

# 批量获取
results = []
total = len(app_ids)

for i, app_id in enumerate(app_ids, 1):
    print(f"[{i}/{total}] 正在获取 App {app_id}...", end=" ")

    data = fetch_app_details(app_id)

    if data:
        results.append({
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
        })
        try:
            print(f"[OK] {data.get('name', app_id)}")
        except:
            print(f"[OK] AppID {app_id}")
    else:
        print(f"[X] 跳过")

    # 限速
    if i < total:
        time.sleep(1.5)

# 保存结果
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print(f"\n[OK] 获取完成：成功 {len(results)}/{total}")
print(f"保存到: {OUTPUT_FILE}")
