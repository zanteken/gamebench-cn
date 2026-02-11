export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

/**
 * 完整翻译字典
 */
export type Dictionary = {
  // ── 通用 ──
  siteName: string;
  siteSlogan: string;
  siteDescription: string;

  // ── 导航 ──
  nav: {
    games: string;
    fpsCalc: string;
    gpuTier: string;
    cpuTier: string;
    download: string;
  };

  // ── 首页 ──
  home: {
    title: string;
    searchPlaceholder: string;
    statsGames: string;
    statsCPU: string;
    statsGPU: string;
    statsFPS: string;
    allGenres: string;
    free: string;
  };

  // ── 游戏详情 ──
  game: {
    configTitle: string;
    minimum: string;
    recommended: string;
    cpu: string;
    gpu: string;
    ram: string;
    storage: string;
    directx: string;
    os: string;
    developer: string;
    publisher: string;
    releaseDate: string;
    genres: string;
    viewOnSteam: string;
    testFPS: string;
    quickSpecs: string;
    metaTitle: string;
    metaDesc: string;
  };

  // ── FPS 计算器 ──
  fps: {
    title: string;
    subtitle: string;
    selectCPU: string;
    selectGPU: string;
    labelCPU: string;
    labelGPU: string;
    labelRAM: string;
    labelRes: string;
    labelQuality: string;
    qualityLow: string;
    qualityMed: string;
    qualityHigh: string;
    qualityUltra: string;
    avgFPS: string;
    over60: string;
    playable: string;
    totalGames: string;
    searchGame: string;
    sortFPSDesc: string;
    sortFPSAsc: string;
    sortName: string;
    disclaimer: string;
    placeholder: string;
    placeholderSub: string;
    statusRec: string;
    statusMin: string;
    statusBelow: string;
    bottleneck: string;
    moreGames: string;
  };

  // ── 天梯榜 ──
  tier: {
    gpuTitle: string;
    gpuSubtitle: string;
    cpuTitle: string;
    cpuSubtitle: string;
    score: string;
    gpuCount: string;
    cpuCount: string;
  };

  // ── GPU/CPU 详情 ──
  hardware: {
    perfScore: string;
    over60: string;
    fps30_60: string;
    under30: string;
    testCondition: string;
    testNote: string;
    smooth: string;
    playable: string;
    notRecommended: string;
    relatedGPU: string;
    relatedCPU: string;
    recGPU: string;
    recGPUNote: string;
    wantToBuy: string;
    checkPrice: string;
    games: string;
  };

  // ── 升级建议 ──
  upgrade: {
    title: string;
    priorityHigh: string;
    cpuUpgrade: string;
    gpuUpgrade: string;
    ramUpgrade: string;
    tierBudget: string;
    tierValue: string;
    tierPremium: string;
    priceNote: string;
    shopCTA: string;
  };

  // ── 导购 ──
  shop: {
    buyButton: string;
    goToShop: string;
    shopName: string;
  };

  // ── Footer ──
  footer: {
    tagline: string;
  };

  // ── Player Marks ──
  marks: {
    slogan: string;
    sloganDesc: string;
    statsMarks: string;
    statsAvg: string;
    avgFPS: string;
    statsFriends: string;
    sortLatest: string;
    sortPopular: string;
    sortSimilar: string;
    sortFriends: string;
    leaveMark: string;
    cancel: string;
    leaveMarkShort: string;
    markLeft: string;
    loading: string;
    noMarks: string;
    noMarksDesc: string;
    myMark: string;
    wantFriends: string;
    fromDesktop: string;
    avgFpsLabel: string;
    low1Percent: string;
    resolution: string;
    quality: string;
    replies: string;
    addFriend: string;
    justNow: string;
    minutesAgo: string;
    hoursAgo: string;
    daysAgo: string;
    monthsAgo: string;
    sendMessage: string;
    send: string;
    saySomething: string;
    nickname: string;
    loadingReplies: string;
  };

  // ── Post Mark Form ──
  postMark: {
    title: string;
    subtitle: string;
    nickname: string;
    nicknamePlaceholder: string;
    avatar: string;
    gpu: string;
    gpuPlaceholder: string;
    cpu: string;
    cpuPlaceholder: string;
    ram: string;
    ramPlaceholder: string;
    fps: string;
    fpsPlaceholder: string;
    low1: string;
    resolution: string;
    quality: string;
    qualityLow: string;
    qualityMedium: string;
    qualityHigh: string;
    qualityUltra: string;
    message: string;
    messagePlaceholder: string;
    messageLimit: string;
    tags: string;
    tagsPlaceholder: string;
    tagsLimit: string;
    lookingForFriends: string;
    lookingForFriendsDesc: string;
    submit: string;
    submitting: string;
    errorNickname: string;
    errorGpu: string;
    errorMessage: string;
    errorNicknameTooLong: string;
    errorMessageTooLong: string;
  };

  // ── Friend Requests ──
  friends: {
    sendRequest: string;
    sendRequestTitle: string;
    yourNickname: string;
    yourContact: string;
    contactType: string;
    contactWechat: string;
    contactQq: string;
    contactSteam: string;
    contactDiscord: string;
    message: string;
    messagePlaceholder: string;
    send: string;
    sending: string;
    sent: string;
    errorAlreadySent: string;
    errorRateLimit: string;
    myRequests: string;
    noRequests: string;
    requestFrom: string;
    accept: string;
    reject: string;
    accepted: string;
    rejected: string;
    replyContact: string;
    replyMessage: string;
    replyMessagePlaceholder: string;
  };
};

const dictionaries: Record<Locale, Dictionary> = {
  zh: {
    // ── 通用 ──
    siteName: "GameBencher",
    siteSlogan: "中国首个PC游戏性能检测平台",
    siteDescription: "查看你的电脑能玩什么游戏，预测游戏FPS帧数，找到最值得升级的硬件。",

    // ── 导航 ──
    nav: {
      games: "游戏库",
      fpsCalc: "FPS计算器",
      gpuTier: "显卡天梯",
      cpuTier: "CPU天梯",
      download: "下载桌面版",
    },

    // ── 首页 ──
    home: {
      title: "PC游戏配置检测与FPS预测",
      searchPlaceholder: "搜索游戏名称或开发商...",
      statsGames: "游戏数据库",
      statsCPU: "CPU型号",
      statsGPU: "GPU型号",
      statsFPS: "FPS测试数据",
      allGenres: "全部",
      free: "免费",
    },

    // ── 游戏详情 ──
    game: {
      configTitle: "配置需求",
      minimum: "最低配置",
      recommended: "推荐配置",
      cpu: "处理器",
      gpu: "显卡",
      ram: "内存",
      storage: "存储空间",
      directx: "DirectX",
      os: "操作系统",
      developer: "开发商",
      publisher: "发行商",
      releaseDate: "发行日期",
      genres: "类型",
      viewOnSteam: "在 Steam 查看",
      testFPS: "测试这款游戏的FPS",
      quickSpecs: "快速规格",
      metaTitle: "{game} 配置需求 - 最低配置与推荐配置",
      metaDesc: "查看 {game} 的最低配置和推荐配置要求。CPU: {cpu}, 显卡: {gpu}, 内存: {ram}GB。",
    },

    // ── FPS 计算器 ──
    fps: {
      title: "🎯 FPS 计算器",
      subtitle: "选择你的硬件配置，预测 {count} 款游戏的帧数表现",
      selectCPU: "搜索 CPU...",
      selectGPU: "搜索 GPU...",
      labelCPU: "处理器 (CPU)",
      labelGPU: "显卡 (GPU)",
      labelRAM: "内存 (RAM)",
      labelRes: "分辨率",
      labelQuality: "画质",
      qualityLow: "低画质",
      qualityMed: "中画质",
      qualityHigh: "高画质",
      qualityUltra: "极高画质",
      avgFPS: "平均 FPS",
      over60: "≥60 FPS",
      playable: "可运行 (≥30)",
      totalGames: "测试游戏数",
      searchGame: "搜索游戏...",
      sortFPSDesc: "FPS 高→低",
      sortFPSAsc: "FPS 低→高",
      sortName: "按名称",
      disclaimer: "⚠️ FPS 为算法预测值（±20%），仅供参考。实际帧数受驱动版本、温度、后台程序等因素影响。",
      placeholder: "请先选择 CPU 和 GPU",
      placeholderSub: "支持 {cpuCount} 款处理器 · {gpuCount} 款显卡",
      statusRec: "推荐",
      statusMin: "最低",
      statusBelow: "不足",
      bottleneck: "瓶颈",
      moreGames: "还有 {count} 款游戏，使用搜索查看特定游戏",
    },

    // ── 天梯榜 ──
    tier: {
      gpuTitle: "🎮 显卡天梯榜",
      gpuSubtitle: "点击任意显卡查看能流畅运行哪些游戏",
      cpuTitle: "🧠 CPU 天梯榜",
      cpuSubtitle: "点击任意处理器查看搭配不同显卡的游戏表现",
      score: "评分",
      gpuCount: "共 {count} 款显卡",
      cpuCount: "共 {count} 款 CPU",
    },

    // ── GPU/CPU 详情 ──
    hardware: {
      perfScore: "性能评分",
      over60: "60FPS+ 游戏",
      fps30_60: "30-60 FPS",
      under30: "30FPS 以下",
      testCondition: "📋 测试条件：搭配 {cpu} · 16GB 内存 · 1080p 分辨率 · 高画质预设",
      testNote: "预测值仅供参考（±20%），实际帧数受驱动、温度等因素影响。",
      smooth: "流畅运行 (≥60 FPS)",
      playable: "基本可玩 (30-60 FPS)",
      notRecommended: "不推荐 (<30 FPS)",
      relatedGPU: "📊 相近性能的显卡",
      relatedCPU: "📊 相近性能的处理器",
      recGPU: "🔗 推荐搭配显卡",
      recGPUNote: "以下显卡与 {cpu} 性能匹配度最高，不会产生明显瓶颈：",
      wantToBuy: "想入手 {name}？",
      checkPrice: "查看最新价格和评价",
      games: "款",
    },

    // ── 升级建议 ──
    upgrade: {
      title: "⬆️ 升级建议",
      priorityHigh: "优先升级",
      cpuUpgrade: "处理器升级方案",
      gpuUpgrade: "显卡升级方案",
      ramUpgrade: "内存升级方案",
      tierBudget: "高性价比",
      tierValue: "推荐",
      tierPremium: "旗舰",
      priceNote: "价格仅供参考，以实时价格为准",
      shopCTA: "查看详情 →",
    },

    // ── 导购 ──
    shop: {
      buyButton: "🛒 京东查看价格",
      goToShop: "🛒 前往京东",
      shopName: "京东",
    },

    // ── Footer ──
    footer: {
      tagline: "GameBencher — 中国首个PC游戏性能检测平台",
    },

    // ── Player Marks ──
    marks: {
      slogan: "朋友是游戏最高的配置",
      sloganDesc: "在这里留下你的印记，找到同一个世界的同路人",
      statsMarks: " 位玩家留下印记",
      statsAvg: "平均 ",
      avgFPS: " FPS",
      statsFriends: " 人想交朋友",
      sortLatest: "最新",
      sortPopular: "最热",
      sortSimilar: "和我相似",
      sortFriends: "找朋友",
      leaveMark: "留下印记",
      cancel: "取消",
      leaveMarkShort: "留下印记",
      markLeft: "✓ 你已留下印记",
      loading: "加载中...",
      noMarks: "还没有人留下印记",
      noMarksDesc: "成为第一个分享 {game} 体验的人",
      myMark: "我的印记",
      wantFriends: "👋 想交朋友",
      fromDesktop: "桌面端",
      avgFpsLabel: "平均",
      low1Percent: "1% Low",
      resolution: "分辨率",
      quality: "画质",
      replies: "💬",
      addFriend: "🤝 加为好友",
      justNow: "刚刚",
      minutesAgo: "分钟前",
      hoursAgo: "小时前",
      daysAgo: "天前",
      monthsAgo: "个月前",
      sendMessage: "发送",
      send: "发送",
      saySomething: "说点什么...",
      nickname: "昵称",
      loadingReplies: "加载回复...",
    },

    // ── Post Mark Form ──
    postMark: {
      title: "留下你的游戏印记",
      subtitle: "分享你的硬件配置和游戏体验，帮助其他玩家",
      nickname: "昵称",
      nicknamePlaceholder: "你的游戏昵称",
      avatar: "头像",
      gpu: "显卡",
      gpuPlaceholder: "如：RTX 4070",
      cpu: "处理器",
      cpuPlaceholder: "如：i5-13600K",
      ram: "内存",
      ramPlaceholder: "如：16GB DDR5",
      fps: "平均 FPS",
      fpsPlaceholder: "可选，如 60",
      low1: "1% Low FPS",
      resolution: "分辨率",
      quality: "画质",
      qualityLow: "低",
      qualityMedium: "中",
      qualityHigh: "高",
      qualityUltra: "极高",
      message: "留言",
      messagePlaceholder: "分享你的游戏体验、配置心得...",
      messageLimit: "最多 500 字",
      tags: "标签",
      tagsPlaceholder: "用逗号分隔，最多3个",
      tagsLimit: "最多 3 个标签",
      lookingForFriends: "想交朋友",
      lookingForFriendsDesc: "允许其他玩家向你发送好友请求",
      submit: "发布印记",
      submitting: "发布中...",
      errorNickname: "请输入昵称",
      errorGpu: "请输入显卡型号",
      errorMessage: "请输入留言",
      errorNicknameTooLong: "昵称不能超过30字",
      errorMessageTooLong: "留言不能超过500字",
    },

    // ── Friend Requests ──
    friends: {
      sendRequest: "发送好友请求",
      sendRequestTitle: "向 {nickname} 发送好友请求",
      yourNickname: "你的昵称",
      yourContact: "联系方式",
      contactType: "联系方式类型",
      contactWechat: "微信",
      contactQq: "QQ",
      contactSteam: "Steam",
      contactDiscord: "Discord",
      message: "附言",
      messagePlaceholder: "打个招呼吧（可选）",
      send: "发送请求",
      sending: "发送中...",
      sent: "已发送",
      errorAlreadySent: "你已经向这位玩家发过请求了",
      errorRateLimit: "请求太频繁，请稍后再试",
      myRequests: "好友请求",
      noRequests: "暂无好友请求",
      requestFrom: "{nickname} 想加你为好友",
      accept: "接受",
      reject: "拒绝",
      accepted: "已接受",
      rejected: "已拒绝",
      replyContact: "你的联系方式（可选）",
      replyMessage: "回复留言（可选）",
      replyMessagePlaceholder: "打个招呼吧",
    },
  },

  en: {
    siteName: "GameBencher",
    siteSlogan: "PC Game Performance Testing Platform",
    siteDescription: "Check if your PC can run any game, predict FPS, and find the best hardware upgrades.",

    nav: {
      games: "Games",
      fpsCalc: "FPS Calculator",
      gpuTier: "GPU Tier List",
      cpuTier: "CPU Tier List",
      download: "Download App",
    },

    home: {
      title: "PC Game System Requirements & FPS Predictions",
      searchPlaceholder: "Search games or developers...",
      statsGames: "Games Database",
      statsCPU: "CPU Models",
      statsGPU: "GPU Models",
      statsFPS: "FPS Test Data",
      allGenres: "All",
      free: "Free",
    },

    game: {
      configTitle: "System Requirements",
      minimum: "Minimum",
      recommended: "Recommended",
      cpu: "Processor",
      gpu: "Graphics",
      ram: "Memory",
      storage: "Storage",
      directx: "DirectX",
      os: "OS",
      developer: "Developer",
      publisher: "Publisher",
      releaseDate: "Release Date",
      genres: "Genres",
      viewOnSteam: "View on Steam",
      testFPS: "Test FPS for This Game",
      quickSpecs: "Quick Specs",
      metaTitle: "{game} System Requirements - Minimum & Recommended",
      metaDesc: "Check {game} system requirements. CPU: {cpu}, GPU: {gpu}, RAM: {ram}GB.",
    },

    fps: {
      title: "🎯 FPS Calculator",
      subtitle: "Select your hardware to predict FPS across {count} games",
      selectCPU: "Search CPU...",
      selectGPU: "Search GPU...",
      labelCPU: "Processor (CPU)",
      labelGPU: "Graphics Card (GPU)",
      labelRAM: "Memory (RAM)",
      labelRes: "Resolution",
      labelQuality: "Quality",
      qualityLow: "Low",
      qualityMed: "Medium",
      qualityHigh: "High",
      qualityUltra: "Ultra",
      avgFPS: "Average FPS",
      over60: "≥60 FPS",
      playable: "Playable (≥30)",
      totalGames: "Games Tested",
      searchGame: "Search games...",
      sortFPSDesc: "FPS High→Low",
      sortFPSAsc: "FPS Low→High",
      sortName: "By Name",
      disclaimer: "⚠️ FPS values are algorithm predictions (±20%) for reference only. Actual performance may vary.",
      placeholder: "Select your CPU and GPU to begin",
      placeholderSub: "{cpuCount} processors · {gpuCount} graphics cards supported",
      statusRec: "Recommended",
      statusMin: "Minimum",
      statusBelow: "Below Min",
      bottleneck: "Bottleneck",
      moreGames: "{count} more games available, use search to find specific games",
    },

    tier: {
      gpuTitle: "🎮 GPU Tier List",
      gpuSubtitle: "Click any GPU to see which games it can run smoothly",
      cpuTitle: "🧠 CPU Tier List",
      cpuSubtitle: "Click any CPU to see gaming performance with different GPUs",
      score: "Score",
      gpuCount: "{count} GPUs",
      cpuCount: "{count} CPUs",
    },

    hardware: {
      perfScore: "Performance Score",
      over60: "60FPS+ Games",
      fps30_60: "30-60 FPS",
      under30: "Below 30 FPS",
      testCondition: "📋 Test Setup: Paired with {cpu} · 16GB RAM · 1080p · High Quality",
      testNote: "Predicted values for reference (±20%). Actual FPS varies by driver, temperature, etc.",
      smooth: "Smooth (≥60 FPS)",
      playable: "Playable (30-60 FPS)",
      notRecommended: "Not Recommended (<30 FPS)",
      relatedGPU: "📊 Similar Performance GPUs",
      relatedCPU: "📊 Similar Performance CPUs",
      recGPU: "🔗 Recommended GPU Pairings",
      recGPUNote: "These GPUs are well-matched with {cpu} and won't bottleneck:",
      wantToBuy: "Want to buy {name}?",
      checkPrice: "Check latest prices and reviews",
      games: "games",
    },

    upgrade: {
      title: "⬆️ Upgrade Suggestions",
      priorityHigh: "Priority Upgrade",
      cpuUpgrade: "CPU Upgrade Options",
      gpuUpgrade: "GPU Upgrade Options",
      ramUpgrade: "RAM Upgrade Options",
      tierBudget: "Budget",
      tierValue: "Best Value",
      tierPremium: "Premium",
      priceNote: "Prices are estimates, check retailer for current pricing",
      shopCTA: "View on Amazon →",
    },

    shop: {
      buyButton: "🛒 Check Price on Amazon",
      goToShop: "🛒 Go to Amazon",
      shopName: "Amazon",
    },

    footer: {
      tagline: "GameBencher — PC Game Performance Testing Platform",
    },

    // ── Player Marks ──
    marks: {
      slogan: "Friends are the highest gaming spec",
      sloganDesc: "Leave your mark and find like-minded gamers",
      statsMarks: " players left marks",
      statsAvg: "Avg ",
      avgFPS: " FPS",
      statsFriends: " looking for friends",
      sortLatest: "Latest",
      sortPopular: "Popular",
      sortSimilar: "Similar to Me",
      sortFriends: "Find Friends",
      leaveMark: "Leave Mark",
      cancel: "Cancel",
      leaveMarkShort: "Leave Mark",
      markLeft: "✓ You've left a mark",
      loading: "Loading...",
      noMarks: "No marks yet",
      noMarksDesc: "Be the first to share your {game} experience",
      myMark: "My Mark",
      wantFriends: "👋 Looking for friends",
      fromDesktop: "Desktop",
      avgFpsLabel: "Average",
      low1Percent: "1% Low",
      resolution: "Resolution",
      quality: "Quality",
      replies: "💬",
      addFriend: "🤝 Add Friend",
      justNow: "Just now",
      minutesAgo: "m ago",
      hoursAgo: "h ago",
      daysAgo: "d ago",
      monthsAgo: "mo ago",
      sendMessage: "Send",
      send: "Send",
      saySomething: "Say something...",
      nickname: "Nickname",
      loadingReplies: "Loading replies...",
    },

    // ── Post Mark Form ──
    postMark: {
      title: "Leave Your Gaming Mark",
      subtitle: "Share your hardware setup and gaming experience",
      nickname: "Nickname",
      nicknamePlaceholder: "Your gaming nickname",
      avatar: "Avatar",
      gpu: "GPU",
      gpuPlaceholder: "e.g. RTX 4070",
      cpu: "CPU",
      cpuPlaceholder: "e.g. i5-13600K",
      ram: "RAM",
      ramPlaceholder: "e.g. 16GB DDR5",
      fps: "Average FPS",
      fpsPlaceholder: "Optional, e.g. 60",
      low1: "1% Low FPS",
      resolution: "Resolution",
      quality: "Quality",
      qualityLow: "Low",
      qualityMedium: "Medium",
      qualityHigh: "High",
      qualityUltra: "Ultra",
      message: "Message",
      messagePlaceholder: "Share your gaming experience, setup tips...",
      messageLimit: "Max 500 chars",
      tags: "Tags",
      tagsPlaceholder: "Comma separated, max 3",
      tagsLimit: "Max 3 tags",
      lookingForFriends: "Looking for friends",
      lookingForFriendsDesc: "Allow other players to send you friend requests",
      submit: "Post Mark",
      submitting: "Posting...",
      errorNickname: "Please enter nickname",
      errorGpu: "Please enter GPU model",
      errorMessage: "Please enter message",
      errorNicknameTooLong: "Nickname cannot exceed 30 chars",
      errorMessageTooLong: "Message cannot exceed 500 chars",
    },

    // ── Friend Requests ──
    friends: {
      sendRequest: "Send Friend Request",
      sendRequestTitle: "Send friend request to {nickname}",
      yourNickname: "Your nickname",
      yourContact: "Contact info",
      contactType: "Contact type",
      contactWechat: "WeChat",
      contactQq: "QQ",
      contactSteam: "Steam",
      contactDiscord: "Discord",
      message: "Note",
      messagePlaceholder: "Say hello (optional)",
      send: "Send Request",
      sending: "Sending...",
      sent: "Sent",
      errorAlreadySent: "You've already sent a request to this player",
      errorRateLimit: "Too many requests, please try again later",
      myRequests: "Friend Requests",
      noRequests: "No friend requests yet",
      requestFrom: "{nickname} wants to be your friend",
      accept: "Accept",
      reject: "Reject",
      accepted: "Accepted",
      rejected: "Rejected",
      replyContact: "Your contact info (optional)",
      replyMessage: "Reply message (optional)",
      replyMessagePlaceholder: "Say hello",
    },
  },
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

/**
 * 简单模板替换: t("Hello {name}", { name: "World" })
 */
export function t(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  let result = template;
  for (const [key, val] of Object.entries(vars)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, "g"), String(val));
  }
  return result;
}
