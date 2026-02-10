const fs = require('fs');
const data = require('../data/games.json');

// 找出需要翻译的游戏（只有英文名称）
const gamesToTranslate = data.filter(g => !g.nameEn && /[a-zA-Z]/.test(g.name));

console.log('Games needing translation:', gamesToTranslate.length);

// 导出为单独的文件
const toTranslate = gamesToTranslate.map(g => ({
  appId: g.appId,
  nameEn: g.name,
}));

fs.writeFileSync('../data/games_to_translate.json', JSON.stringify(toTranslate, null, 2), 'utf-8');
console.log('Saved to data/games_to_translate.json');
