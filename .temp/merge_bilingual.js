const fs = require('fs');
const path = require('path');

// 加载数据
const largeData = require('../data/games_large.json');
const smallDataPath = path.resolve(__dirname, '../../data/games.json');
const smallDataRaw = fs.readFileSync(smallDataPath, 'utf-8');
const smallData = JSON.parse(smallDataRaw);

console.log('Large games:', largeData.length);
console.log('Bilingual games (small):', smallData.length);

// 转换小文件为 camelCase 并提取双语数据
const bilingualGames = smallData.map(g => ({
  appId: g.app_id,
  nameEn: g.name_en,
  genresEn: g.genres_en || [],
  contentDescriptors: g.content_descriptors?.ids || [],
  contentDescriptorsEn: g.content_descriptors_en?.ids || [],
}));

// 建立双语数据映射
const bilingualMap = {};
bilingualGames.forEach(g => {
  bilingualMap[g.appId] = g;
});

// 检查重叠
const largeIds = new Set(largeData.map(g => g.appId));
const bilingualIds = new Set(bilingualGames.map(g => g.appId));
const overlap = [...largeIds].filter(id => bilingualIds.has(id));
console.log('Overlap AppIDs:', overlap.length);

// 合并：为大列表添加双语字段
const merged = largeData.map(g => {
  const bData = bilingualMap[g.appId];
  if (bData) {
    // 有双语数据，添加双语字段
    return {
      ...g,
      nameEn: bData.nameEn,
      genresEn: bData.genresEn,
      contentDescriptors: bData.contentDescriptors,
      contentDescriptorsEn: bData.contentDescriptorsEn,
    };
  } else {
    // 没有双语数据，添加空字段
    return {
      ...g,
      nameEn: null,
      genresEn: null,
      contentDescriptors: [],
      contentDescriptorsEn: [],
    };
  }
});

// 统计
const withNameEn = merged.filter(g => g.nameEn).length;
const withGenresEn = merged.filter(g => g.genresEn && g.genresEn.length > 0).length;
const withContentDescriptors = merged.filter(g => g.contentDescriptors && g.contentDescriptors.length > 0).length;

console.log('\n=== Merge Summary ===');
console.log('Total games:', merged.length);
console.log('With nameEn:', withNameEn);
console.log('With genresEn:', withGenresEn);
console.log('With content descriptors:', withContentDescriptors);

// 保存合并后的数据
fs.writeFileSync('../data/games.json', JSON.stringify(merged, null, 2), 'utf-8');
console.log('\nSaved to:', path.resolve(__dirname, '../data/games.json'));
