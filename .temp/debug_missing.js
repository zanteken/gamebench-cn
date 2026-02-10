const top1000 = require('../../steam_top_1000_games.json');
const games = require('../data/games.json');

const ourIds = new Set(games.map(g => g.appId));
const missing = top1000.games.filter(g => !ourIds.has(g.appid));

console.log('Missing count:', missing.length);
console.log('\nFirst 10 missing:');
missing.slice(0, 10).forEach(g => console.log(g.appid, g.name));
