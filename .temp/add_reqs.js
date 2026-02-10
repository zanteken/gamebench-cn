const data = require('../data/games.json');
const fs = require('fs');

// 使用旧的 games_parsed.json 获取配置数据
const oldData = require('../../data/games_parsed.json');
const reqMap = {};
oldData.forEach(g => {
  reqMap[g.app_id] = {
    minimum: g.requirements_minimum,
    recommended: g.requirements_recommended
  };
});

const withReqs = data.map(g => {
  const reqs = reqMap[g.appId];
  return {
    ...g,
    requirements: reqs || {
      minimum: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null },
      recommended: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null }
    }
  };
});

fs.writeFileSync('../data/games.json', JSON.stringify(withReqs, null, 2), 'utf-8');
console.log('Added requirements to', withReqs.length, 'games');
