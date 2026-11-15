const mock = require('../../data/mock');
const store = require('../../utils/store');
const vmh = require('../../utils/vm');
const icons = require('../../utils/icons');

const ME_HANDLE = 'itwitter_fan';

Page({
  data: {
    sb: 20,
    navH: 64,
    isMe: true,
    u: null,
    posts: [],
    emptyTitle: '',
    emptySub: '',
    // 编辑资料
    editShow: false,
    editAnim: '',
    eName: '',
    eBio: '',
    eLoc: '',
    settingsIcon: '',
    calendarIcon: '',
    linkIcon: '',
    locationIcon: ''
  },

  onLoad(options) {
    const app = getApp();
    this.setData({
      sb: app.globalData.statusBarHeight,
      navH: app.globalData.navH,
      settingsIcon: icons.gear('#0f1419'),
      calendarIcon: icons.calendar('#536471'),
      linkIcon: icons.link('#1d9bf0'),
      locationIcon: icons.location('#536471')
    });
    this.viewHandle = options.handle || ME_HANDLE;
    this.build();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 2 });
    }
    const app = getApp();
    if (app.globalData.feedDirty) {
      app.globalData.feedDirty = false;
      this.build();
    }
  },

  build() {
    const handle = this.viewHandle;
    const isMe = handle === ME_HANDLE;
    const u = vmh.userVM(handle);
    if (!u) { this.setData({ u: null }); return; }

    // 帖子列表
    let posts;
    if (isMe) {
      posts = store.getUserTweets().map((t) => vmh.tweetVM(t, true));
    } else {
      posts = mock.getTimeline().filter((t) => t.user === handle).map((t) => vmh.tweetVM(t));
    }

    this.setData({ isMe, u, posts });
    const m = posts.length
      ? { e: '', s: '' }
      : { e: '还没有发过帖子', s: '有了想法就分享出来吧' };
    this.setData({ emptyTitle: m.e, emptySub: m.s });
  },

  /* ---------- 编辑资料 ---------- */
  openEdit() {
    const u = this.data.u;
    this.setData({ editShow: true, editAnim: 'in', eName: u.name, eBio: u.bio, eLoc: u.location });
  },
  closeEdit() {
    this.setData({ editAnim: 'out' });
    setTimeout(() => this.setData({ editShow: false, editAnim: '' }), 220);
  },
  onEName(e) { this.setData({ eName: e.detail.value }); },
  onEBio(e) { this.setData({ eBio: e.detail.value }); },
  onELoc(e) { this.setData({ eLoc: e.detail.value }); },
  saveEdit() {
    const name = this.data.eName.trim();
    if (!name) { wx.showToast({ title: '昵称不能为空', icon: 'none' }); return; }
    store.setProfile({ name, bio: this.data.eBio, location: this.data.eLoc });
    getApp().globalData.feedDirty = true;
    this.closeEdit();
    this.build();
    wx.showToast({ title: '资料已更新', icon: 'none' });
  },

  /* ---------- 设置 ---------- */
  onSettings() {
    if (this.data.isMe) {
      wx.showActionSheet({
        itemList: ['账号与安全', '隐私与安全', '通知设置', '深色模式（已开启）', '退出登录'],
        itemColor: '#0f1419',
        success: (res) => {
          if (res.tapIndex === 4) {
            wx.showModal({
              title: '退出登录',
              content: '退出后将无法接收新消息通知（演示）。',
              confirmColor: '#f4212e',
              confirmText: '退出',
              cancelText: '取消',
              success: (r) => { if (r.confirm) wx.showToast({ title: '已退出（演示）', icon: 'none' }); }
            });
          } else {
            wx.showToast({ title: '设置（演示）', icon: 'none' });
          }
        }
      });
    } else {
      wx.showActionSheet({
        itemList: ['屏蔽 @' + this.viewHandle, '举报账号'],
        itemColor: '#0f1419',
        success: () => wx.showToast({ title: '已收到反馈', icon: 'none' })
      });
    }
  },

  onFollow() {
    const followed = store.toggleFollow(this.viewHandle);
    this.setData({ 'u.followState': followed });
    getApp().globalData.feedDirty = true;
    wx.showToast({ title: followed ? '已关注' : '已取消关注', icon: 'none' });
  },

  /* 查看回复所属的父帖 */
  goDetail(e) {
    const id = e.currentTarget.dataset.id;
    if (id) wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
  },

  /* 我的帖子删除（由卡片事件冒泡） */
  onDeleted() {
    this.build();
  },

  stop() {}
});
