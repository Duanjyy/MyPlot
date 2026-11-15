const mock = require('../../data/mock');
const store = require('../../utils/store');
const vmh = require('../../utils/vm');
const icons = require('../../utils/icons');
const media = require('../../utils/media');

const PAGE_SIZE = 8;
const MAX_LEN = 280;

Page({
  data: {
    sb: 20,
    navH: 64,
    rightReserve: 0,
    closeSrc: '',
    composeSrc: '',
    tab: 0,
    list: [],
    loadingMore: false,
    noMore: false,
    // 发布器
    composeShow: false,
    composeAnim: '',
    composeText: '',
    composeCount: 0,
    sendable: false,
    meAvatar: '',
    toolbarIcons: [],
    emptyHint: false
  },

  onLoad() {
    const app = getApp();
    let rightReserve = 0;
    try {
      const rect = wx.getMenuButtonBoundingClientRect();
      const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
      rightReserve = Math.ceil(win.windowWidth - rect.left + 8);
    } catch (e) { /* 退化处理 */ }
    this.setData({
      sb: app.globalData.statusBarHeight,
      navH: app.globalData.navH,
      rightReserve,
      composeSrc: icons.compose('#ffffff'),
      closeSrc: icons.back('#0f1419'),
      meAvatar: vmh.meVM().avatar,
      toolbarIcons: [
        icons.image('#1d9bf0'), icons.poll('#1d9bf0'), icons.emoji('#1d9bf0'), icons.location('#1d9bf0')
      ]
    });
    this.all = this.buildAll();
    this.applyPage(true);
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
    // 其他页面（发布/关注/删除）标记了脏数据时重建
    const app = getApp();
    if (app.globalData.feedDirty) {
      app.globalData.feedDirty = false;
      this.all = this.buildAll();
      this.applyPage(true);
      this.setData({ meAvatar: vmh.meVM().avatar });
    }
  },

  buildAll() {
    const mine = store.getUserTweets().map((t) => vmh.tweetVM(t, true));
    const others = mock.getTimeline().map((t) => vmh.tweetVM(t));
    return mine.concat(others);
  },

  /* 按当前 tab + 分页渲染 */
  applyPage(reset) {
    const tab = this.data.tab;
    let pool = this.all;
    if (tab === 1) {
      pool = this.all.filter((t) => t.mine || store.isFollow(t.handle));
    }
    if (reset) this.page = 1;
    const end = this.page * PAGE_SIZE;
    const slice = pool.slice(0, end);
    this.setData({
      list: slice,
      noMore: end >= pool.length && pool.length > 0,
      emptyHint: tab === 1 && pool.length === 0
    });
  },

  /* 下拉刷新 */
  onPullDownRefresh() {
    this.all = this.buildAll();
    setTimeout(() => {
      this.applyPage(true);
      wx.stopPullDownRefresh();
    }, 700);
  },

  /* 上拉加载更多 */
  onReachBottom() {
    if (this.data.loadingMore || this.data.noMore) return;
    const tab = this.data.tab;
    const pool = tab === 1
      ? this.all.filter((t) => t.mine || store.isFollow(t.handle))
      : this.all;
    if (this.page * PAGE_SIZE >= pool.length) {
      this.setData({ noMore: true });
      return;
    }
    this.setData({ loadingMore: true });
    setTimeout(() => {
      this.page += 1;
      this.applyPage(false);
      this.setData({ loadingMore: false });
    }, 600);
  },

  /* 顶部 tab 切换 */
  onTab(e) {
    const tab = +e.currentTarget.dataset.tab;
    if (tab === this.data.tab) return;
    this.setData({ tab, noMore: false });
    this.page = 1;
    this.applyPage(true);
  },

  onDismiss(e) {
    const id = e.detail.id;
    this.all = this.all.filter((t) => t.id !== id);
    this.applyPage(false);
    wx.showToast({ title: '已减少此类内容', icon: 'none' });
  },

  onDeleted(e) {
    const id = e.detail.id;
    this.all = this.all.filter((t) => t.id !== id);
    this.applyPage(false);
  },

  goProfile() {
    wx.switchTab({ url: '/pages/profile/profile' });
  },

  onGoExplore() {
    wx.switchTab({ url: '/pages/explore/explore' });
  },

  /* ---------- 发布器 ---------- */
  openCompose() {
    wx.vibrateShort({ type: 'light' });
    this.setData({ composeShow: true, composeAnim: 'in' });
  },
  closeCompose() {
    this.setData({ composeAnim: 'out' });
    setTimeout(() => this.setData({ composeShow: false, composeAnim: '', composeText: '', composeCount: 0, sendable: false }), 220);
  },
  onInput(e) {
    const v = e.detail.value;
    this.setData({
      composeText: v,
      composeCount: v.length,
      sendable: v.trim().length > 0 && v.length <= MAX_LEN
    });
  },
  send() {
    if (!this.data.sendable) return;
    const me = vmh.meVM();
    store.addUserTweet({
      id: 'u' + Date.now(),
      user: me.handle,
      text: this.data.composeText,
      ts: Date.now(),
      likes: 0, rts: 0, repliesN: 0, views: 0
    });
    getApp().globalData.feedDirty = true;
    this.closeCompose();
    wx.showToast({ title: '帖子已发送', icon: 'none' });
    // 立即回到顶部展示新帖
    wx.pageScrollTo({ scrollTop: 0, duration: 200 });
  }
});
