/**
 * 批量翻译游戏名称
 * 使用 Google Translate 免费接口
 */

import fs from 'fs';
import https from 'https';

const INPUT_FILE = '../data/games_to_translate.json';
const OUTPUT_FILE = '../data/games_translated.json';

function translate(text) {
  return new Promise((resolve) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (result && result[0] && result[0][0]) {
            resolve(result[0][0][0]);
          } else {
            resolve(text);
          }
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function main() {
  const games = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf-8'));
  console.log(`需要翻译的游戏数量: ${games.length}`);

  const results = [];
  const batchSize = 10;

  for (let i = 0; i < games.length; i += batchSize) {
    const batch = games.slice(i, i + batchSize);
    console.log(`[进度] ${i}/${games.length}...`);

    const promises = batch.map(async (game) => {
      const translated = await translate(game.nameEn);
      return {
        appId: game.appId,
        nameEn: game.nameEn,
        nameZh: translated
      };
    });

    const batchResults = await Promise.all(promises);
    results.push(...batchResults);

    // 保存中间结果
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');

    // 延迟避免限速
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log(`\n[OK] 翻译完成，保存到: ${OUTPUT_FILE}`);
}

main().catch(console.error);
