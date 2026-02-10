const fs = require('fs');
const ourGames = require('../data/games.json');
const top1000 = require('../../steam_top_1000_games.json');

console.log('Our games:', ourGames.length);
console.log('Top 1000 games:', top1000.games.length);

// 我们的 AppID 集合
const ourAppIds = new Set(ourGames.map(g => g.appId));
const topAppIds = new Set(top1000.games.map(g => g.appid));

// 找出我们没有的游戏
const missing = top1000.games.filter(g => !ourAppIds.has(g.appid));
console.log('\n=== Missing from our database ===');
console.log('Count:', missing.length);

// 找出我们共有的游戏
const common = top1000.games.filter(g => ourAppIds.has(g.appid));
console.log('\n=== Common games ===');
console.log('Count:', common.length);

// 检查中文名称差异
const nameDiff = [];
top1000.games.forEach(top => {
  const our = ourGames.find(g => g.appId === top.appid);
  if (our && top.name_cn && our.name !== top.name_cn && !our.nameEn) {
    nameDiff.push({ appId: top.appid, ourName: our.name, topName: top.name_cn, topNameEn: top.name });
  }
});
console.log('\n=== Name differences (our DB has only English, Top1000 has Chinese) ===');
console.log('Count:', nameDiff.length);
if (nameDiff.length > 0) {
  console.log('\nSamples:');
  nameDiff.slice(0, 10).forEach(d => {
    console.log(`- ${d.topNameEn} -> ${d.topName}`);
  });
}

// 保存缺失的游戏列表
fs.writeFileSync('../data/missing_top1000.json', JSON.stringify(missing, null, 2), 'utf-8');
console.log('\nSaved missing games to data/missing_top1000.json');
