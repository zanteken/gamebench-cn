/**
 * 获取 Top 1000 中缺失的游戏数据
 */

import fs from 'fs';
import https from 'https';

const MISSING_FILE = '../data/missing_top1000.json';
const OUTPUT_FILE = '../data/fetched_missing_games.json';

// 加载缺失游戏
const missing = JSON.parse(fs.readFileSync(MISSING_FILE, 'utf-8'));
const appIds = missing.map(g => g.appid);

console.log(`需要获取 ${appIds.length} 款游戏数据`);

function fetchAppDetails(appId) {
  return new Promise((resolve) => {
    const url = `https://store.steampowered.com/api/appdetails?appids=${appId}&l=schinese&cc=cn`;

    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const appData = result[String(appId)];
          if (appData && appData.success) {
            resolve(appData.data);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function main() {
  const results = [];
  const batchSize = 20;

  for (let i = 0; i < appIds.length; i += batchSize) {
    const batch = appIds.slice(i, i + batchSize);
    console.log(`[进度] ${i}/${appIds.length}...`);

    const promises = batch.map(async (appId) => {
      const data = await fetchAppDetails(appId);
      if (data) {
        const name = data.name || '';
        return {
          appId: appId,
          name: name,
          slug: name.toLowerCase().replace(/,/g, '').replace(/:/g, '').replace(/\//g, '-').replace(/ /g, '-').replace(/'/g, '').replace(/---/g, '-').replace(/--/g, '-'),
          type: data.type || 'game',
          isFree: data.is_free || false,
          headerImage: data.header_image || '',
          developers: data.developers || [],
          publishers: data.publishers || [],
          genres: (data.genres || []).map(g => g.description),
          categories: (data.categories || []).map(c => c.description),
          contentDescriptors: [],
          contentDescriptorsEn: [],
          releaseDate: data.release_date?.date || '',
          platforms: data.platforms || {},
          price: data.price_overview || null,
          metacritic: data.metacritic || null,
          recommendations: data.recommendations?.total || 0,
          requirements: {
            minimum: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null },
            recommended: { cpu: null, gpu: null, ram_gb: null, storage: null, directx: null }
          },
          comingSoon: data.release_date?.coming_soon || false,
        };
      }
      return null;
    });

    const batchResults = await Promise.all(promises);
    for (const r of batchResults) {
      if (r) results.push(r);
    }

    // 保存中间结果
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2), 'utf-8');

    // 延迟避免限速
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log(`\n[OK] 获取完成：成功 ${results.length}/${appIds.length}`);
  console.log(`保存到: ${OUTPUT_FILE}`);
}

main().catch(console.error);
