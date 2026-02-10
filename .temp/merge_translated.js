const fs = require('fs');

// 加载数据
const data = require('../data/games.json');
const translated = require('../data/games_translated.json');

console.log('Original games:', data.length);
console.log('Translated entries:', translated.length);

// 建立翻译映射
const transMap = {};
translated.forEach(t => {
  transMap[t.appId] = t.nameZh;
});

// 更新游戏数据
const updated = data.map(g => {
  const zhName = transMap[g.appId];
  if (zhName && zhName !== g.name) {
    // 有翻译且与原名不同
    return {
      ...g,
      nameEn: g.nameEn || g.name,  // 保留原有英文名
      name: zhName,  // 更新为中文译名
    };
  }
  return g;
});

// 统计
const updatedCount = updated.filter(g => transMap[g.appId]).length;
console.log('Games with Chinese name updated:', updatedCount);

// 保存
fs.writeFileSync('../data/games.json', JSON.stringify(updated, null, 2), 'utf-8');
console.log('Saved to data/games.json');

// 显示一些示例
const samples = updated.filter(g => g.nameEn && g.nameEn !== g.name).slice(0, 10);
console.log('\nSample updated games:');
samples.forEach(g => {
  console.log(`- ${g.nameEn} -> ${g.name}`);
});
