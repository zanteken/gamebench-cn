const top1000 = require('../../steam_top_1000_games.json');
const games = require('../data/games.json');

const topIds = new Set(top1000.games.map(g => g.appid));
const ourIds = new Set(games.map(g => g.appId));
const missing = top1000.games.filter(g => !ourIds.has(g.appid));

console.log('Top 1000:', top1000.games.length);
console.log('Our games:', games.length);
console.log('Still missing:', missing.length);
console.log('\nSample missing:');
missing.slice(0, 30).forEach(g => console.log('-', g.name, '(appid:', g.appid + ')'));
