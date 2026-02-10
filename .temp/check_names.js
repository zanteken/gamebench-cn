const data = require('../data/games.json');

const noZhName = data.filter(g => !g.nameEn && /[a-zA-Z]/.test(g.name));
console.log('Games with English-only name:', noZhName.length);
if (noZhName.length > 0) {
  console.log('\nSample:');
  noZhName.slice(0, 20).forEach(g => console.log('-', g.name, '(appId:', g.appId + ')'));
}
