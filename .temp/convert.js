const rawData = require('../../data/games.json');
const oldParsed = require('../../data/games_parsed.json');

// 建立配置需求映射
const reqMap = {};
oldParsed.forEach(g => {
  reqMap[g.app_id] = {
    minimum: g.requirements_minimum,
    recommended: g.requirements_recommended
  };
});

// 转换格式
const converted = rawData.map(g => {
  const reqs = reqMap[g.app_id];
  return {
    appId: g.app_id,
    name: g.name,
    nameEn: g.name_en,
    slug: g.slug,
    type: g.type,
    isFree: g.is_free,
    headerImage: g.header_image,
    developers: g.developers,
    publishers: g.publishers,
    genres: g.genres,
    genresEn: g.genres_en,
    categories: g.categories,
    contentDescriptors: (g.content_descriptors?.ids || []).filter(x => x),
    contentDescriptorsEn: (g.content_descriptors_en?.ids || []).filter(x => x),
    releaseDate: g.release_date,
    comingSoon: false,
    platforms: g.platforms,
    price: g.price,
    metacritic: g.metacritic,
    recommendations: g.recommendations,
    requirements: reqs || {
      minimum: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null },
      recommended: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null }
    }
  };
});

const fs = require('fs');
fs.writeFileSync('../data/games.json', JSON.stringify(converted, null, 2), 'utf-8');
console.log('Converted', converted.length, 'games');
console.log('With nameEn:', converted.filter(g => g.nameEn).length);
console.log('With genresEn:', converted.filter(g => g.genresEn && g.genresEn.length > 0).length);
