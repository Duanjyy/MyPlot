const mock = require('../../data/mock');
const store = require('../../utils/store');
const vmh = require('../../utils/vm');
const icons = require('../../utils/icons');
const fmt = require('../../utils/format');

Page({
  data: {
    sb: 20,
    navH: 64,
    searchIcon: '',
    q: '',
    focus: false,
    history: [],
    hot: [],
    // 结果
    searched: false,
    userResults: [],
    trendResults: [],
    tweetResults: [],
    noResult: false
  },

  onLoad(options) {
    const app = getApp();
    this.setData({
      sb: app.globalData.statusBarHeight,
      navH: app.globalData.navH,
      searchIcon: icons.search('#536471'),
      focus: !options.q,
      history: this.loadHistory(),
      hot: this.loadHot()
    });
    if (options.q) {
      const q = decodeURIComponent(options.q);
      this.setData({ q });
      this.runSearch(q);
    }
  },

  loadHistory() { return (wx.getStorageSync('it_history') || []); },
  loadHot() {
    return mock.hotSearch.map((h) => Object.assign({}, h, {
      heatText: fmt.count(h.heat) + ' 条相关帖子'
    }));
  },

  refreshHistory() { this.setData({ history: this.loadHistory() }); },

  /* 实时搜索（300ms 防抖） */
  onInput(e) {
    const q = e.detail.value;
    this.setData({ q, searched: false });
    if (this.debounce) clearTimeout(this.debounce);
    if (!q.trim()) return;
    this.debounce = setTimeout(() => this.runSearch(q), 300);
  },

  onConfirm() {
    const q = this.data.q.trim();
    if (!q) return;
    store.addHistory(q);
    this.refreshHistory();
    this.runSearch(q);
  },

  runSearch(q) {
    const users = mock.searchUsers(q).map((u) => vmh.userRowVM(u.handle));
    const trends = mock.trendsMatching(q).map((t) => Object.assign({}, t, {
      postsText: fmt.count(t.posts) + ' 条帖子'
    }));
    const tweets = mock.searchTweets(q).map((t) => vmh.tweetVM(t));
    store.addHistory(q);
    this.refreshHistory();
    this.setData({
      searched: true,
      userResults: users,
      trendResults: trends,
      tweetResults: tweets,
      noResult: !users.length && !trends.length && !tweets.length
    });
  },

  chipTap(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ q });
    this.runSearch(q);
  },
  clearQ() {
    this.setData({ q: '', searched: false, noResult: false, focus: true });
  },
  chipDel(e) {
    store.removeHistory(e.currentTarget.dataset.q);
    this.refreshHistory();
  },
  clearAll() {
    wx.showModal({
      title: '清空搜索历史',
      content: '确定要清除所有搜索历史吗？',
      confirmColor: '#1d9bf0',
      confirmText: '清除',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) { store.clearHistory(); this.refreshHistory(); }
      }
    });
  },
  hotTap(e) {
    const q = e.currentTarget.dataset.q;
    this.setData({ q });
    this.runSearch(q);
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
    this.setData({ ['userResults[' + i + '].following']: followed });
    getApp().globalData.feedDirty = true;
    wx.showToast({ title: followed ? '已关注 @' + handle : '已取消关注', icon: 'none' });
  }
});
