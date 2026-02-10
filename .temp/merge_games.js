const fs = require('fs');
const largeData = require('data/games_large.json');
const bilingualData = require('../../data/games.json');

console.log('Large first appId:', largeData[0].appId, typeof largeData[0].appId);
console.log('Bilingual first app_id:', bilingualData[0].app_id, typeof bilingualData[0].app_id);

// 建立双语数据的映射 (用 app_id)
const bilingualMap = {};
bilingualData.forEach(g => {
  bilingualMap[g.app_id] = g;
});

// 检查是否有匹配
const firstMatch = largeData.find(g => g.appId === bilingualData[0].app_id);
console.log('First match test:', firstMatch ? 'Found' : 'Not found');

// 合并：为大列表添加双语字段
const merged = largeData.map(g => {
  const bData = bilingualMap[g.appId];
  if (bData) {
    // 有双语数据，添加双语字段
    return {
      ...g,
      nameEn: bData.nameEn,
      genresEn: bData.genresEn,
      contentDescriptors: bData.contentDescriptors || [],
      contentDescriptorsEn: bData.contentDescriptorsEn || [],
      // 保留原有的 requirements
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

fs.writeFileSync('data/games.json', JSON.stringify(merged, null, 2), 'utf-8');

// 统计
const withBilingual = merged.filter(g => g.nameEn);
const withDesc = merged.filter(g => g.contentDescriptors && g.contentDescriptors.length > 0);

console.log('Total games:', merged.length);
console.log('With bilingual data:', withBilingual.length);
console.log('With content descriptors:', withDesc.length);
