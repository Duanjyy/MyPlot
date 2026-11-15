const mock = require('../../data/mock');
const store = require('../../utils/store');
const vmh = require('../../utils/vm');
const icons = require('../../utils/icons');
const fmt = require('../../utils/format');

Page({
  data: {
    sb: 20,
    navH: 64,
    pillW: 300,
    pillH: 32,
    searchIcon: '',
    trendIcon: '',
    tab: 0,
    trends: [],
    suggestions: [],
    hotTweets: []
  },

  onLoad() {
    const app = getApp();
    // 搜索条宽度/高度：与原生胶囊对齐（宽度延伸到胶囊左侧，高度等于胶囊高度）
    const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    let pillW = win.windowWidth - 24;
    let pillH = 32;
    try {
      const cap = wx.getMenuButtonBoundingClientRect();
      if (cap && cap.left) pillW = cap.left - 24;
      if (cap && cap.height) pillH = cap.height;
    } catch (e) {}
    this.setData({
      sb: app.globalData.statusBarHeight,
      navH: app.globalData.navH,
      pillW: pillW,
      pillH: pillH,
      searchIcon: icons.search('#536471'),
      trendIcon: icons.trendUp('#00ba7c')
    });
    this.build();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    if (getApp().globalData.feedDirty) {
      getApp().globalData.feedDirty = false;
      this.build();
    }
  },

  build() {
    const trends = mock.trends.map((t) => Object.assign({}, t, {
      postsText: fmt.count(t.posts) + ' 条帖子'
    }));
    const suggestions = mock.suggestions.map((h) => vmh.userRowVM(h));
    // 趋势内容：取热度最高的帖子前 6 条
    const hotTweets = mock.getTimeline()
      .slice().sort((a, b) => b.views - a.views).slice(0, 6)
      .map((t) => vmh.tweetVM(t));
    this.setData({ trends, suggestions, hotTweets });
  },

  onTab(e) {
    const tab = +e.currentTarget.dataset.tab;
    if (tab === this.data.tab) return;
    // 热门 tab 仅展示趋势榜单
    this.setData({ tab });
  },

  goSearch() {
    wx.navigateTo({ url: '/pages/search/search' });
  },
  goTrend(e) {
    const topic = e.currentTarget.dataset.topic;
    wx.navigateTo({ url: '/pages/search/search?q=' + encodeURIComponent(topic) });
  },
  goProfile(e) {
    const handle = e.currentTarget.dataset.handle;
    if (handle === 'itwitter_fan') wx.switchTab({ url: '/pages/profile/profile' });
    else wx.navigateTo({ url: '/pages/profile/profile?handle=' + handle });
  },
  onFollow(e) {
    const handle = e.currentTarget.dataset.handle;
    const followed = store.toggleFollow(handle);
    const i = e.currentTarget.dataset.i;
    this.setData({ ['suggestions[' + i + '].following']: followed });
    getApp().globalData.feedDirty = true;
    wx.showToast({ title: followed ? '已关注 @' + handle : '已取消关注', icon: 'none' });
  }
});
