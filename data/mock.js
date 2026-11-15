/**
 * 模拟数据：多领域用户 / 推文流 / 评论生态 / 趋势 / 热搜 / 推荐账号
 * 数据带话题联动、引用、媒体、时间梯度，覆盖排版与搜索分支
 */
const media = require('../utils/media');

/* ---------------- 用户 ---------------- */
const users = [
  { handle: 'elaborate', name: 'X开发者社区', verified: 2, bio: 'X（Twitter）平台官方开发者社区账号，分享 API、设计与最佳实践。', location: 'San Francisco, CA', link: 'dev.x.com', followers: 4820000, following: 312, bannerSeed: 'b-dev' },
  { handle: 'elonmusk', name: 'Elon Musk', verified: 2, bio: 'Free the platforms. Rockets, cars, and questionable humor.', location: 'Boca Chica, TX', link: 'x.com', followers: 168000000, following: 912, bannerSeed: 'b-space' },
  { handle: 'tsunaze', name: '陈皓 · 左耳朵耗子', verified: 1, bio: '极客时间创始合伙人，前阿里云研究员。写代码，聊架构，谈人生。', location: 'Hangzhou', link: 'coolshell.cn', followers: 820000, following: 486, bannerSeed: 'b-code' },
  { handle: 'iphonedesign', name: 'Apple Design', verified: 2, bio: 'Unofficial fan account celebrating Apple design language. HIG lover.', location: 'Cupertino', link: 'developer.apple.com', followers: 1450000, following: 88, bannerSeed: 'b-apple' },
  { handle: 'ai_daily', name: 'AI 前线', verified: 1, bio: '追踪全球人工智能前沿进展，每日精选论文解读与行业动态。', location: '北京', link: 'aidaily.io', followers: 2360000, following: 156, bannerSeed: 'b-ai' },
  { handle: 'racer88', name: 'F1 赛事速递', verified: 1, bio: 'Formula 1 中文资讯。赛事直播讨论、车队动态、技术规则解读。🏁', location: 'Shanghai Int\'l Circuit', link: '', followers: 640000, following: 230, bannerSeed: 'b-f1' },
  { handle: 'photographer', name: '城市光影', verified: 0, bio: '街头摄影爱好者 | 器材党退坑 | 每周更新扫街作品集', location: 'Guangzhou', link: '', followers: 128000, following: 743, bannerSeed: 'b-photo' },
  { handle: 'chef_lee', name: '李师傅的厨房', verified: 0, bio: '家常菜也能做出高级感。每天一道菜，认真记录 cooking as coding。🍳', location: 'Chengdu', link: '', followers: 356000, following: 1024, bannerSeed: 'b-food' },
  { handle: 'market_watch', name: '市场观察者', verified: 1, bio: '美股、A股、加密市场每日复盘。不构成投资建议。', location: 'Hong Kong', link: '', followers: 980000, following: 65, bannerSeed: 'b-finance' },
  { handle: 'game_designer', name: '独立游戏开发者', verified: 0, bio: '正在做一款 2D 平台跳跃游戏。分享开发日志、像素美术与游戏设计思考。', location: '厦门', link: 'itch.io', followers: 92000, following: 890, bannerSeed: 'b-game' },
  { handle: 'jack', name: 'jack dorsey', verified: 2, bio: 'small teams, big dreams.', location: '', link: '', followers: 6500000, following: 28, bannerSeed: 'b-jack' },
  { handle: 'space_news', name: '航天日报', verified: 1, bio: '全球航天发射计划、深空探测进展、火箭回收技术追踪。🚀', location: '文昌', link: '', followers: 1750000, following: 142, bannerSeed: 'b-rocket' },
  { handle: 'ux_research', name: 'UX 望远镜', verified: 0, bio: '交互设计师。写写设计系统、可用性测试，偶尔吐槽。', location: '上海', link: '', followers: 210000, following: 512, bannerSeed: 'b-ux' },
  { handle: 'runner_li', name: '跑者李一', verified: 0, bio: '马拉松 PB 3:12 | 跑鞋评测 | 城市晨跑路线分享', location: '武汉', link: '', followers: 76000, following: 320, bannerSeed: 'b-run' }
];

/* 用户头像 / 封面（SVG 生成） */
users.forEach((u) => {
  u.avatar = media.avatar(u.name, u.handle);
  u.banner = media.photo(u.bannerSeed);
  u.followersText = u.followers >= 10000 ? Math.round(u.followers / 10000) + '万' : String(u.followers);
});

/* 当前登录用户（可被“编辑资料”修改并持久化） */
const me = {
  handle: 'itwitter_fan',
  name: '推特复刻爱好者',
  verified: 0,
  bio: '正在用微信小程序 1:1 复刻 X（Twitter）界面，欢迎交流设计细节。',
  location: '深圳',
  link: 'github.com/itwitter',
  followers: 1024,
  following: 286,
  bannerSeed: 'b-me',
  joined: '2024年3月'
};
me.avatar = media.avatar(me.name, me.handle);
me.banner = media.photo(me.bannerSeed);

function findUser(handle) {
  if (handle === me.handle) return me;
  return users.find((u) => u.handle === handle) || null;
}

/* ---------------- 推文 ---------------- */
/** mins: 发布距今分钟数 */
const tweets = [
  {
    id: 't1', user: 'elaborate', mins: 12, likes: 12400, rts: 2310, repliesN: 892, views: 1240000,
    text: 'X API v2 现已全面开放经典端点。开发者可以更自由地构建时间线、搜索与用户数据应用。\n\n本次更新重点：\n· 速率限制整体上调\n· 新增媒体上传接口\n· Webhook 事件订阅支持长轮询\n\n欢迎在评论区告诉我们你的构建计划。#DevX #API',
    tags: ['DevX', 'API'], media: ['m-api1'],
    replies: [
      { user: 'tsunaze', text: '速率限制终于上来了，之前做机器人监控一晚上就打满。', mins: 8, likes: 342 },
      { user: 'ai_daily', text: 'webhook 长轮询的稳定性如何？打算接进内部告警系统。', mins: 6, likes: 128 },
      { user: 'game_designer', text: '刚注册了开发者账号，文档体验比想象中好。', mins: 4, likes: 87 },
      { user: 'jack', text: 'ship it 🚢', mins: 3, likes: 2140 }
    ]
  },
  {
    id: 't2', user: 'elonmusk', mins: 26, likes: 286000, rts: 42100, repliesN: 18300, views: 56000000,
    text: 'Starship 第 12 次试飞已进入倒计时，这次将尝试在轨燃料补加演示。🚀',
    media: ['m-rocket1'],
    replies: [
      { user: 'space_news', text: '已在文昌同步准备直播信号，倒计时页见我们主页。', mins: 20, likes: 4210 },
      { user: 'racer88', text: '火箭圈也卷起来了', mins: 18, likes: 892 },
      { user: 'elaborate', text: '直播入口已置顶在发现页。', mins: 10, likes: 632 }
    ]
  },
  {
    id: 't3', user: 'iphonedesign', mins: 48, likes: 45800, rts: 6820, repliesN: 1240, views: 3800000,
    text: '设计细节考古：iOS 系统里那些你以为是贴图、其实是实时渲染的界面。\n\n· 控制中心滑块是带物理回弹的实时图层\n· 锁屏天气背景随实时天气插值\n· Apple Pencil 悬停预览是 GPU 光标投影\n\n把「看起来像图片」的东西做成「真的渲染」，是拟真的关键。',
    media: ['m-design1', 'm-design2'],
    replies: [
      { user: 'ux_research', text: 'Pencil 悬停那个投影真的惊艳，第一次拿到时反复确认了好几遍。', mins: 30, likes: 1204 },
      { user: 'tsunaze', text: '「看起来像图片的东西做成真的渲染」，这句可以裱起来。', mins: 22, likes: 2100 }
    ]
  },
  {
    id: 't4', user: 'ai_daily', mins: 65, likes: 31200, rts: 9840, repliesN: 2100, views: 6200000,
    text: '最新研究：多模态模型在「空间关系推理」任务上的表现首次超过人类基线。\n\n论文核心是引入了三维场景一致性损失，让模型在生成与理解时保持同一几何坐标系。这意味着文生图可能告别「左手六根手指」的时代。',
    quote: 't5', tags: ['AI'],
    replies: [
      { user: 'elonmusk', text: 'interesting', mins: 40, likes: 8600 },
      { user: 'game_designer', text: '做独立游戏素材的同学狂喜。', mins: 35, likes: 654 }
    ]
  },
  {
    id: 't5', user: 'ux_research', mins: 90, likes: 8900, rts: 1420, repliesN: 386, views: 940000,
    text: '做了一个小实验：同一组信息流卡片，去掉分割线只留 8px 间距，阅读效率没有变化，但页面「安静感」评分提升 23%。\n\n留白也是一种信息层级。',
    media: ['m-ux1'],
    replies: [
      { user: 'iphonedesign', text: '暗色模式下尤其明显，黑底上细线反而制造噪音。', mins: 60, likes: 742 }
    ]
  },
  {
    id: 't6', user: 'racer88', mins: 110, likes: 62400, rts: 11200, repliesN: 4300, views: 9800000,
    text: 'BREAKING: 本周大奖赛排位赛因暴雨红旗中断 47 分钟。雨地排位 RNG 之王再次上演「最后一圈绝杀」。\n\n正赛发车顺序完整版已整理，雨天胎策略会是最大变数。#F1',
    media: ['m-f1'], tags: ['F1'],
    replies: [
      { user: 'runner_li', text: '看雨战比看冲刺赛刺激多了', mins: 90, likes: 890 },
      { user: 'market_watch', text: '博彩公司赔率都乱了', mins: 80, likes: 456 }
    ]
  },
  {
    id: 't7', user: 'chef_lee', mins: 140, likes: 15600, rts: 2300, repliesN: 620, views: 1400000,
    text: '蛋炒饭的终极公式（二十年厨房经验总结）：\n\n1. 隔夜饭不是玄学，是含水量控制\n2. 蛋液先裹饭再下锅，粒粒金黄\n3. 盐只在最后 10 秒放\n4. 锅气 = 高温 + 少翻动 + 敢空烧\n\n附上 tonight 的成品图。',
    media: ['m-food1'],
    replies: [
      { user: 'photographer', text: '这个光线是打光的吧？太好看了', mins: 100, likes: 321 },
      { user: 'runner_li', text: '健身党哭了，但还是点了收藏', mins: 95, likes: 218 }
    ]
  },
  {
    id: 't8', user: 'market_watch', mins: 180, likes: 22400, rts: 5600, repliesN: 1870, views: 4100000,
    text: '今日复盘：三大指数缩量整理，AI 算力板块午后回流。利率决议前市场普遍观望，波动率指数回落至年内低位。\n\n明晚的发布会才是本周主线。',
    replies: [
      { user: 'tsunaze', text: '缩量说明多头不急，空头不敢，都在等信号。', mins: 150, likes: 1100 }
    ]
  },
  {
    id: 't9', user: 'tsunaze', mins: 240, likes: 45200, rts: 12400, repliesN: 980, views: 7200000,
    text: '给年轻工程师的建议：\n\n「学到什么程度才算够？」——够到你能给别人讲明白为止。讲不明白的知识，只是浏览过的知识。\n\n写博客、做分享、教别人，不是付出，是复利。',
    replies: [
      { user: 'ux_research', text: '设计圈同理：讲不清设计理由的稿子，只是好看的图。', mins: 210, likes: 890 },
      { user: 'game_designer', text: '去年开始写开发日志，感觉技术水平肉眼可见地变扎实了。', mins: 200, likes: 432 },
      { user: 'ai_daily', text: '转发给团队全员了。', mins: 190, likes: 267 }
    ]
  },
  {
    id: 't10', user: 'space_news', mins: 300, likes: 89200, rts: 21400, repliesN: 3200, views: 12500000,
    text: '本周全球发射窗口一览：共 11 次发射计划，创单周新高。\n\n最受关注的是周四的重型火箭第 12 次试飞与周六的深空望远镜补给任务。发射时间表见长图。',
    media: ['m-space1', 'm-space2'], tags: ['航天'],
    replies: [
      { user: 'elonmusk', text: 'Thursday it is 🚀', mins: 260, likes: 12400 },
      { user: 'racer88', text: '比排位赛还密集的赛程', mins: 250, likes: 780 }
    ]
  },
  {
    id: 't11', user: 'game_designer', mins: 360, likes: 5600, rts: 890, repliesN: 240, views: 320000,
    text: '开发日志 #47：跳跃手感调了整整两周。\n\n最终方案是「起跳蓄力 3 帧 + 空中惯性 0.85 + 落地缓冲 6 帧」。数值不重要，重要的是每一帧都要问自己：玩家此刻在想什么。',
    media: ['m-game1'], tags: ['独立游戏'],
    replies: [
      { user: 'tsunaze', text: '「每一帧都要问玩家在想什么」，这个视角比大多数策划文档高级。', mins: 320, likes: 410 }
    ]
  },
  {
    id: 't12', user: 'photographer', mins: 420, likes: 12800, rts: 2100, repliesN: 460, views: 1100000,
    text: '扫街Vol.32：雨后的老城区。夜景模式其实一直被低估，长曝 + 自然光足够讲故事。',
    media: ['m-street1', 'm-street2', 'm-street3'],
    replies: [
      { user: 'chef_lee', text: '第三张的构图绝了', mins: 380, likes: 356 },
      { user: 'ux_research', text: '整体色温统一得很好，是怎么后期的？', mins: 370, likes: 145 }
    ]
  },
  {
    id: 't13', user: 'jack', mins: 500, likes: 76400, rts: 18600, repliesN: 2400, views: 15800000,
    text: 'small teams, big dreams.\n\n十个人以内的团队可以做到一百人团队做不到的事，前提是：目标唯一、决策链最短、写下来的比说出来的多。',
    replies: [
      { user: 'elonmusk', text: 'true', mins: 460, likes: 9800 },
      { user: 'tsunaze', text: '深有同感。会议纪要是团队的第一设计文档。', mins: 450, likes: 1200 }
    ]
  },
  {
    id: 't14', user: 'runner_li', mins: 600, likes: 3200, rts: 420, repliesN: 180, views: 210000,
    text: '晨跑路线推荐 · 武汉东湖绿道段：\n\n全程 10.5km，沿途 3 处补水点，5:30 出发人最少，日出口的湖面光斑是免费的补给品。🏃',
    media: ['m-run1'],
    replies: [
      { user: 'photographer', text: '日出口的光斑，拍出来也绝。', mins: 560, likes: 96 }
    ]
  },
  {
    id: 't15', user: 'ai_daily', mins: 720, likes: 42800, rts: 11200, repliesN: 1560, views: 8600000,
    text: '行业动态：三大云厂商同周降价，推理成本进入「分币时代」。\n\n对小团队的影响是真实的：一个日活 10 万的应用，AI 功能的边际成本从每月数万降到数千。2026 是 AI 功能从「亮点」变「标配」的转折年。#AI',
    tags: ['AI'], quote: 't9',
    replies: [
      { user: 'market_watch', text: '算力通缩传导速度比预期快。', mins: 680, likes: 640 },
      { user: 'game_designer', text: '我们游戏里的 NPC 对话成本直接砍半，立刻上线了新剧情。', mins: 670, likes: 388 }
    ]
  },
  {
    id: 't16', user: 'iphonedesign', mins: 900, likes: 38600, rts: 7400, repliesN: 1100, views: 5300000,
    text: '界面上的物理直觉：为什么「下拉刷新」让人愉悦？\n\n因为它模拟了真实世界的橡皮筋——阻力渐进、越拉越紧、释放即回弹。好的动效不是动画，是物理定律的隐喻。',
    media: ['m-physics1'],
    replies: [
      { user: 'ux_research', text: '所以橡皮筋感的关键是阻尼曲线，不是时长。', mins: 860, likes: 890 }
    ]
  },
  {
    id: 't17', user: 'elaborate', mins: 1080, likes: 18600, rts: 3400, repliesN: 760, views: 2800000,
    text: '产品更新：时间线新增「关注优先」智能排序开关，可在设置中切换「为你推荐」与「正在关注」的默认视图。\n\n所有改动都会先在小范围内灰度，欢迎反馈。',
    replies: [
      { user: 'jack', text: '学到了，灰度先行。', mins: 1000, likes: 430 }
    ]
  },
  {
    id: 't18', user: 'chef_lee', mins: 1260, likes: 9800, rts: 1400, repliesN: 520, views: 890000,
    text: '周末高阶课预告：低温慢煮入门。\n\n器材不用贵，一个恒温水浴棒就够了。核心是温度 × 时间的矩阵表，我整理了 12 种常见食材的参数，评论区自取。',
    media: ['m-sous1'],
    replies: [
      { user: 'runner_li', text: '鸡胸肉那栏感谢！减脂期福音', mins: 1200, likes: 210 }
    ]
  },
  {
    id: 't19', user: 'racer88', mins: 1440, likes: 31200, rts: 6800, repliesN: 2400, views: 6600000,
    text: '赛季中点总结：车队冠军悬念不大，车手冠军还有 3 站变数。这套新规则下的超车率提升了 41%，规则设计者赢麻了。',
    quote: 't6',
    replies: [
      { user: 'space_news', text: '规则设计赢了，但雨战还是靠天赋。', mins: 1380, likes: 520 }
    ]
  },
  {
    id: 't20', user: 'market_watch', mins: 1680, likes: 14200, rts: 3200, repliesN: 980, views: 3200000,
    text: '本周关键词：等待。\n\n宏观数据真空期，资金在确定性资产里抱团。历史上这种「缩量 + 低波动」组合出现后 30 天内，出现方向性选择的概率是 87%。方向向上还是向下？样本不够，不下结论。',
    replies: [
      { user: 'ai_daily', text: '87% 这个数字怎么算的？好奇方法。', mins: 1600, likes: 156 }
    ]
  },
  {
    id: 't21', user: 'ux_research', mins: 2000, likes: 6800, rts: 1100, repliesN: 320, views: 620000,
    text: '吐槽：把「确定」按钮放在弹窗左边的团队，你们让整个安卓生态的肌肉记忆蒙羞了。\n\n（当然，iOS 左主右次，安卓右主左次，做跨端的都懂这种痛。）',
    replies: [
      { user: 'iphonedesign', text: '平台的对，才是真的对。', mins: 1900, likes: 760 }
    ]
  },
  {
    id: 't22', user: 'space_news', mins: 2400, likes: 52400, rts: 12800, repliesN: 2100, views: 9200000,
    text: '深空望远镜补给任务成功。舱段对接误差 2.1cm，比上一任务缩小 60%。在轨服务时代正式开始。',
    media: ['m-deep1'],
    replies: [
      { user: 'elonmusk', text: '2.1cm。nice.', mins: 2300, likes: 6200 }
    ]
  },
  {
    id: 't23', user: 'photographer', mins: 2880, likes: 8400, rts: 980, repliesN: 260, views: 520000,
    text: '设备减法日记：出掉了第 4 支镜头，只留 35mm 定焦。\n\n限制焦段之后，构图完成度反而提升。「选择少」逼出了「观察多」。',
    media: ['m-gear1'],
    replies: [
      { user: 'tsunaze', text: '工程和摄影在这一点上完全同构：约束出创造。', mins: 2800, likes: 340 }
    ]
  },
  {
    id: 't24', user: 'game_designer', mins: 3600, likes: 4600, rts: 620, repliesN: 190, views: 280000,
    text: '像素美术冷知识：眼睛高 1px 还是 2px，决定角色「年龄感」。2px 显幼，1px 显酷，3px 直接变 Q 版。\n\n灵瞳效应用户感知实验 n=42，p<0.05，欢迎引用（bushi）',
    media: ['m-pixel1'],
    replies: [
      { user: 'ux_research', text: '样本量 42 也敢说 p 值，勇气可嘉 😂', mins: 3500, likes: 220 }
    ]
  },
  {
    id: 't25', user: 'tsunaze', mins: 4320, likes: 28600, rts: 7400, repliesN: 1200, views: 4800000,
    text: '重读《人月神话》有感：50 年了，这本书里的每个坑我们都还在踩。\n\n没有银弹，但有好习惯：小步提交、代码评审、把「为什么」写进注释。',
    replies: [
      { user: 'jack', text: 'brooks was right', mins: 4200, likes: 890 },
      { user: 'elaborate', text: '经典永不过时。', mins: 4100, likes: 240 }
    ]
  },
  {
    id: 't26', user: 'ai_daily', mins: 5760, likes: 36400, rts: 9200, repliesN: 1800, views: 7400000,
    text: '一周论文精选：\n\n1. 端侧模型蒸馏新范式，4B 模型逼近 70B 表现\n2. 视频生成的时间一致性 loss\n3. 代码模型自我修复能力的涌现分析\n\n每篇都附中文导读，专栏更新。',
    media: ['m-papers1'], tags: ['AI'],
    replies: [
      { user: 'game_designer', text: '端侧蒸馏那篇已拜读，蒸馏方案讲得很细。', mins: 5600, likes: 320 }
    ]
  },
  {
    id: 't27', user: 'runner_li', mins: 7200, likes: 2800, rts: 380, repliesN: 140, views: 190000,
    text: '跑鞋横评更新：四款碳板竞速鞋 300km 实测。\n\n结论只有一句：回弹和稳定性不可兼得，比赛鞋别用来日常通勤。完整数据表在图里。',
    media: ['m-shoe1', 'm-shoe2'],
    replies: [
      { user: 'chef_lee', text: '跑完的奖励是一顿好的', mins: 7000, likes: 180 }
    ]
  },
  {
    id: 't28', user: 'elaborate', mins: 8640, likes: 21400, rts: 4200, repliesN: 1600, views: 3400000,
    text: '社区精选：本周最佳第三方客户端提名已开启。规则很简单——开源、无广告、尊重用户数据。提名与投票都在本帖评论区进行。',
    replies: [
      { user: 'ux_research', text: '提名一个极简第三方客户端，动效做得和官方一样丝滑。', mins: 8500, likes: 460 }
    ]
  },
  {
    id: 't29', user: 'iphonedesign', mins: 10080, likes: 51800, rts: 12400, repliesN: 2200, views: 8800000,
    text: '十年前的今天，扁平化设计语言发布。\n\n十年过去，拟物与扁平的争论早已终结——答案从来不是二选一，而是「哪里需要拟物，哪里需要抽象」。界面设计没有终点站，只有下一站。',
    media: ['m-decade1'],
    replies: [
      { user: 'ux_research', text: '「哪里需要拟物，哪里需要抽象」——十年后才读懂这句话。', mins: 9900, likes: 1200 },
      { user: 'tsunaze', text: '设计和工程一样：抽象是手段不是信仰。', mins: 9800, likes: 640 }
    ]
  },
  {
    id: 't30', user: 'jack', mins: 12960, likes: 62800, rts: 15200, repliesN: 3800, views: 12400000,
    text: '十年前做的产品决定，一半后悔，一半庆幸。\n\n后悔的都是因为快，庆幸的都是因为慢。给所有 builder 的忠告：方向上慢，执行上快。',
    replies: [
      { user: 'elonmusk', text: 'half true', mins: 12800, likes: 7600 },
      { user: 'tsunaze', text: '「方向上慢，执行上快」—— this is the way.', mins: 12700, likes: 2100 }
    ]
  }
];

/* 处理时间戳与引用解析 */
const now = Date.now();
tweets.forEach((t) => {
  t.ts = now - t.mins * 60000;
  if (t.quote) {
    const q = tweets.find((x) => x.id === t.quote);
    if (q) {
      t.quoted = {
        id: q.id,
        name: findUser(q.user).name,
        handle: q.user,
        verified: findUser(q.user).verified,
        text: q.text,
        media: q.media ? q.media.slice(0, 1) : null
      };
    }
  }
});

/* 媒体图生成 */
tweets.forEach((t) => {
  if (t.media) t.mediaUrls = t.media.map((m) => media.photo(m));
  if (t.quoted && t.quoted.media) t.quoted.mediaUrl = media.photo(t.quoted.media[0]);
});

/* ---------------- 发现页数据 ---------------- */
const trends = [
  { rank: 1, topic: 'Starship 第12次试飞', category: '航天 · 实时热点', posts: 826000, hot: true },
  { rank: 2, topic: '多模态空间推理', category: '科技 · 趋势', posts: 412000, hot: true },
  { rank: 3, topic: 'F1 雨战排位赛', category: '体育 · 热门', posts: 388000 },
  { rank: 4, topic: 'iOS 物理动效', category: '设计 · 趋势', posts: 156000 },
  { rank: 5, topic: '推理成本分币时代', category: '科技 · 热门', posts: 142000 },
  { rank: 6, topic: '低温慢煮入门', category: '美食 · 新趋势', posts: 98000, fresh: true },
  { rank: 7, topic: '像素美术年龄感', category: '游戏 · 趋势', posts: 76000 },
  { rank: 8, topic: '东湖绿道晨跑', category: '运动 · 本地', posts: 54000 },
  { rank: 9, topic: '人月神话 50 年', category: '技术 · 书籍', posts: 52000 },
  { rank: 10, topic: '扫街摄影 Vol.32', category: '摄影 · 趋势', posts: 43000 }
];

const hotSearchList = [
  { term: 'Starship 第12次试飞', heat: 4862000, tag: '爆' },
  { term: '多模态超越人类', heat: 3200000, tag: '热' },
  { term: 'F1 雨战', heat: 2680000, tag: '热' },
  { term: 'iOS 27 曝光', heat: 1960000, tag: '新' },
  { term: '推理成本降价', heat: 1540000, tag: '' },
  { term: '低温慢煮参数表', heat: 1120000, tag: '' },
  { term: '独立游戏开发日志', heat: 860000, tag: '新' },
  { term: '东湖晨跑路线', heat: 620000, tag: '' },
  { term: '像素眼睛画法', heat: 480000, tag: '' },
  { term: '人月神话重读', heat: 360000, tag: '' }
];

/* 推荐账号（部分已通过 store 关注态控制） */
const suggestions = ['ai_daily', 'ux_research', 'space_news', 'photographer', 'game_designer', 'market_watch'];

module.exports = {
  users,
  me,
  tweets,
  trends,
  hotSearch: hotSearchList,
  suggestions,
  findUser,
  getTimeline() { return tweets; },
  getTweet(id) { return tweets.find((t) => t.id === id) || null; },
  getRelated(id) {
    const cur = this.getTweet(id);
    if (!cur) return [];
    const others = tweets.filter((t) => t.id !== id && !t.quoted);
    // 优先同话题/同用户，再按热度补足
    const sameTag = others.filter((t) => cur.tags && t.tags && t.tags.some((g) => cur.tags.includes(g)));
    const sameUser = others.filter((t) => t.user === cur.user && !sameTag.includes(t));
    const rest = others.filter((t) => !sameTag.includes(t) && !sameUser.includes(t))
      .sort((a, b) => b.views - a.views);
    return sameTag.concat(sameUser).concat(rest).slice(0, 4);
  },
  searchTweets(q) {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return tweets.filter((t) =>
      t.text.toLowerCase().includes(k) ||
      (t.tags || []).some((g) => g.toLowerCase().includes(k)) ||
      findUser(t.user).name.toLowerCase().includes(k) ||
      t.user.toLowerCase().includes(k)
    );
  },
  searchUsers(q) {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return users.filter((u) =>
      u.name.toLowerCase().includes(k) || u.handle.toLowerCase().includes(k) || u.bio.toLowerCase().includes(k)
    );
  },
  trendsMatching(q) {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return trends.filter((t) => t.topic.toLowerCase().includes(k));
  }
};
