const fs = require('fs');

// 加载数据
const games = require('../data/games.json');
const fetched = require('../data/fetched_missing_games.json');
const top1000 = require('../../steam_top_1000_games.json');

console.log('Our games:', games.length);
console.log('Fetched new games:', fetched.length);
console.log('Top 1000 games:', top1000.games.length);

// 建立 Top1000 的中文名映射
const top1000Map = {};
top1000.games.forEach(g => {
  if (g.name_cn) {
    top1000Map[g.appid] = {
      nameCn: g.name_cn,
      nameEn: g.name,
      rank: g.rank,
      currentPlayers: g.current_players,
    };
  }
});

// 合并逻辑
const merged = [...games];

// 1. 添加新获取的游戏
const existingIds = new Set(games.map(g => g.appId));
let addedCount = 0;

fetched.forEach(g => {
  if (!existingIds.has(g.appId)) {
    // 使用 Top1000 的中文名
    const topInfo = top1000Map[g.appId];
    if (topInfo && topInfo.nameCn) {
      g.nameEn = g.name;
      g.name = topInfo.nameCn;
      // 重新生成 slug（基于中文名）
      g.slug = g.name.toLowerCase().replace(/,/g, '').replace(/:/g, '').replace(/\//g, '-').replace(/ /g, '-').replace(/'/g, '').replace(/---/g, '-').replace(/--/g, '-');
    }
    merged.push(g);
    addedCount++;
  }
});

console.log('Added new games:', addedCount);

// 2. 更新现有游戏的中文名（使用 Top1000 的更准确译名）
let updatedCount = 0;
const top1000NameUpdates = [];

merged.forEach(g => {
  const topInfo = top1000Map[g.appId];
  if (topInfo && topInfo.nameCn) {
    // 只有当当前是英文名且 Top1000 有中文名时才更新
    const hasChineseChars = /[\u4e00-\u9fa5]/.test(g.name);
    if (!hasChineseChars && g.name !== topInfo.nameCn) {
      if (!g.nameEn) {
        g.nameEn = g.name; // 保存原有英文名
      }
      g.name = topInfo.nameCn;
      updatedCount++;
      if (updatedCount <= 10) {
        top1000NameUpdates.push({ appId: g.appId, oldName: g.nameEn, newName: g.name });
      }
    }
  }
});

console.log('Updated Chinese names:', updatedCount);

// 3. 统计 Top1000 覆盖率
const ourIds = new Set(merged.map(g => g.appId));
const top1000Ids = new Set(top1000.games.map(g => g.appid));
const covered = top1000.games.filter(g => ourIds.has(g.appid)).length;
console.log(`\nTop 1000 覆盖率: ${covered}/1000 (${(covered/10).toFixed(1)}%)`);

if (top1000NameUpdates.length > 0) {
  console.log('\n样本更新（Top1000 中文名）:');
  top1000NameUpdates.forEach(u => {
    console.log(`- ${u.oldName} -> ${u.newName}`);
  });
}

// 保存
fs.writeFileSync('../data/games.json', JSON.stringify(merged, null, 2), 'utf-8');
console.log(`\n[OK] 保存完成！总游戏数: ${merged.length}`);
