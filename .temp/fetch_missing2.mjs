/**
 * 获取剩余缺失的游戏数据
 */

import fs from 'fs';
import https from 'https';

const MISSING_FILE = '../data/missing_appids.json';
const TOP1000_FILE = '../../steam_top_1000_games.json';
const OUTPUT_FILE = '../data/fetched_missing_games2.json';

const appIds = JSON.parse(fs.readFileSync(MISSING_FILE, 'utf-8'));
const top1000 = JSON.parse(fs.readFileSync(TOP1000_FILE, 'utf-8'));

// 建立 Top1000 信息映射
const top1000Map = {};
top1000.games.forEach(g => {
  top1000Map[g.appid] = {
    nameCn: g.name_cn,
    nameEn: g.name,
    rank: g.rank,
  };
});

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
        // 使用 Top1000 的中文名
        const topInfo = top1000Map[appId];
        let name = data.name || '';
        let slug = name.toLowerCase().replace(/,/g, '').replace(/:/g, '').replace(/\//g, '-').replace(/ /g, '-').replace(/'/g, '').replace(/---/g, '-').replace(/--/g, '-');
        let nameEn = null;

        if (topInfo && topInfo.nameCn) {
          nameEn = name;
          name = topInfo.nameCn;
          // 重新生成 slug（基于中文名）
          slug = name.toLowerCase().replace(/,/g, '').replace(/:/g, '').replace(/\//g, '-').replace(/ /g, '-').replace(/'/g, '').replace(/---/g, '-').replace(/--/g, '-');
        }

        return {
          appId: appId,
          name: name,
          nameEn: nameEn,
          slug: slug,
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
