const data = require('../data/games.json');

const examples = data.filter(g => g.nameEn && g.nameEn !== g.name).slice(0, 30);
examples.forEach(g => console.log(g.name, '|', g.nameEn || 'N/A'));
