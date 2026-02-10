const fs = require('fs');
const path = require('path');

// Content Descriptor ID 到文本的映射
const DESCRIPTOR_MAP = {
  1: { zh: '包含成人内容', en: 'Includes Adult Content' },
  2: { zh: '频繁出现的暴力或血腥', en: 'Frequent Violence or Gore' },
  3: { zh: '频繁出现的裸露或性内容', en: 'Frequent Nudity or Sexual Content' },
  5: { zh: '一般成人内容', en: 'Some Adult Content' },
};

function idsToLabels(ids, lang = 'zh') {
  return ids.map(id => DESCRIPTOR_MAP[id]?.[lang] || `ID:${id}`).filter(x => x);
}

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
  contentDescriptors: idsToLabels(g.content_descriptors?.ids || [], 'zh'),
  contentDescriptorsEn: idsToLabels(g.content_descriptors_en?.ids || [], 'en'),
}));

// 建立双语数据映射
const bilingualMap = {};
bilingualGames.forEach(g => {
  bilingualMap[g.appId] = g;
});

// 合并：为大列表添加双语字段
const merged = largeData.map(g => {
  const bData = bilingualMap[g.appId];
  if (bData) {
    return {
      ...g,
      nameEn: bData.nameEn,
      genresEn: bData.genresEn,
      contentDescriptors: bData.contentDescriptors,
      contentDescriptorsEn: bData.contentDescriptorsEn,
    };
  } else {
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

// 显示示例
const sample = merged.find(g => g.contentDescriptors.length > 0);
if (sample) {
  console.log('\n=== Sample with content descriptors ===');
  console.log('name:', sample.name);
  console.log('contentDescriptors:', sample.contentDescriptors);
  console.log('contentDescriptorsEn:', sample.contentDescriptorsEn);
}

// 保存合并后的数据
fs.writeFileSync('../data/games.json', JSON.stringify(merged, null, 2), 'utf-8');
console.log('\nSaved to:', path.resolve(__dirname, '../data/games.json'));
