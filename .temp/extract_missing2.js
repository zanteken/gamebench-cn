const top1000 = require('../../steam_top_1000_games.json');
const games = require('../data/games.json');
const fs = require('fs');

const ourIds = new Set(games.map(g => g.appId));
const missing = top1000.games.filter(g => !ourIds.has(g.appid));
const toFetch = missing.map(g => g.appid);

fs.writeFileSync('../data/missing_appids.json', JSON.stringify(toFetch, null, 2), 'utf-8');
console.log('Missing AppIDs:', toFetch.length);
console.log('Saved to data/missing_appids.json');
