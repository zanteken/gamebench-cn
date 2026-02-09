# GameBench CN - PC游戏配置检测平台

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 打开浏览器访问
open http://localhost:3000
```

## 项目结构

```
gamebench-cn/
├── data/
│   └── games.json           # 游戏数据（由 steam_scraper.py 生成）
├── src/
│   ├── app/
│   │   ├── layout.tsx        # 全局布局（Header + Footer）
│   │   ├── page.tsx          # 首页（游戏列表 + 搜索 + 筛选）
│   │   ├── sitemap.ts        # 自动生成 sitemap.xml
│   │   ├── robots.ts         # robots.txt
│   │   ├── not-found.tsx     # 404 页面
│   │   ├── globals.css       # 全局样式
│   │   ├── fps-calculator/
│   │   │   └── page.tsx      # FPS 计算器（占位页）
│   │   └── game/
│   │       └── [slug]/
│   │           └── page.tsx  # ⭐ 游戏详情页（核心SEO页面）
│   ├── components/
│   │   ├── Header.tsx        # 顶部导航
│   │   ├── GameCard.tsx      # 游戏卡片组件
│   │   └── RequirementsTable.tsx  # 配置需求表格
│   └── lib/
│       ├── games.ts          # 数据加载工具函数
│       └── types.ts          # TypeScript 类型定义
└── public/                   # 静态资源
```

## 核心页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 游戏列表，支持搜索和类型筛选 |
| 游戏详情 | `/game/[slug]` | SSG 预生成，核心 SEO 页面 |
| FPS 计算器 | `/fps-calculator` | 占位页，后续开发 |

## 生产部署

```bash
# 构建静态页面（SSG）
npm run build

# 启动生产服务器
npm start
```

推荐部署到 Vercel（Next.js 原生支持，免费额度足够 MVP）：
```bash
npx vercel
```

## 更新游戏数据

1. 运行 `steam_scraper.py` 抓取新数据
2. 运行 `transform_data.py` 转换格式
3. 将输出的 `games.json` 复制到 `data/` 目录
4. 重新 `npm run build`

## 下一步开发

- [ ] 接入真实搜索（Meilisearch）
- [ ] CPU/GPU 硬件数据库 + 独立页面
- [ ] FPS 预测模型集成
- [ ] 京东联盟导购链接
- [ ] 移动端适配优化
