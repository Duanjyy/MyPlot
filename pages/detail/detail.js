const mock = require('../../data/mock');
const store = require('../../utils/store');
const vmh = require('../../utils/vm');
const icons = require('../../utils/icons');
const fmt = require('../../utils/format');

const ME_HANDLE = 'itwitter_fan';

Page({
  data: {
    sb: 20,
    navH: 64,
    vm: null,
    timeFull: '',
    found: false,
    replies: [],
    repliesText: '',
    related: [],
    replyText: '',
    sendable: false,
    meAvatar: '',
    mi: 0
  },

  onLoad(options) {
    const app = getApp();
    this.setData({
      sb: app.globalData.statusBarHeight,
      navH: app.globalData.navH,
      meAvatar: vmh.meVM().avatar
    });
    this.tweetId = options.id || '';
    this.build();
  },

  onShow() {
    if (this.data.vm) this.build(true);
  },

  build(soft) {
    let t = store.getUserTweet(this.tweetId);
    let mine = false;
    if (t) mine = true;
    else t = mock.getTweet(this.tweetId);
    if (!t) { this.setData({ found: false, vm: null }); return; }
    const vm = vmh.tweetVM(t, mine);
    const baseReplies = (t.replies || []).map((r) => {
      const rvm = vmh.replyVM(r);
      rvm.liked = false;
      rvm.heartSrc = icons.heart('#536471', false);
      return rvm;
    });
    // 会话内新增的回复在 soft 重建时保留
    if (soft && this.sessionExtra) {
      this.sessionExtra.forEach((r) => baseReplies.unshift(r));
    }
    this.setData({
      found: true,
      vm,
      timeFull: fmt.fullTime(t.ts),
      repliesText: fmt.count((t.repliesN || 0) + (this.sessionExtra ? this.sessionExtra.length : 0)),
      replies: baseReplies,
      related: mock.getRelated(this.tweetId).map((x) => vmh.tweetVM(x))
    });
  },

  /* ---------- 主推文互动 ---------- */
  onLike() {
    store.toggleLike(this.data.vm.id);
    this.refreshCounts();
    if (this.data.vm.liked) wx.vibrateShort({ type: 'light' });
  },
  refreshCounts() {
    const id = this.data.vm.id;
    const liked = store.isLiked(id);
    const rted = store.isRt(id);
    const bmed = store.isBm(id);
    const t = store.getUserTweet(id) || mock.getTweet(id);
    if (!t) return;
    this.setData({
      'vm.liked': liked,
      'vm.rted': rted,
      'vm.bmed': bmed,
      'vm.likesText': fmt.count((t.likes || 0) + (liked ? 1 : 0)),
      'vm.rtsText': fmt.count((t.rts || 0) + (rted ? 1 : 0)),
      'vm.icons.heart': icons.heart(liked ? '#f91880' : '#536471', liked),
      'vm.icons.rt': icons.retweet(rted ? '#00ba7c' : '#536471'),
      'vm.icons.bm': icons.bookmark(bmed ? '#1d9bf0' : '#536471', bmed)
    });
  },
  onRt() {
    const id = this.data.vm.id;
    if (store.isRt(id)) { store.toggleRt(id); this.refreshCounts(); return; }
    wx.showActionSheet({
      itemList: ['转推', '引用转推'],
      itemColor: '#0f1419',
      success: (res) => {
        if (res.tapIndex === 0) { store.toggleRt(id); this.refreshCounts(); wx.showToast({ title: '已转推', icon: 'none' }); }
        else wx.showToast({ title: '引用转推：请在首页发布器中继续（演示）', icon: 'none' });
      }
    });
  },
  onBm() {
    const bmed = store.toggleBm(this.data.vm.id);
    this.refreshCounts();
    wx.showToast({ title: bmed ? '已加入书签' : '已从书签移除', icon: 'none' });
  },
  onShare() {
    wx.showActionSheet({
      itemList: ['复制链接', '通过私信发送'],
      itemColor: '#0f1419',
      success: (res) => {
        if (res.tapIndex === 0) wx.setClipboardData({ data: 'https://x.com/' + this.data.vm.handle + '/status/' + this.data.vm.id });
        else wx.showToast({ title: '私信分享（演示）', icon: 'none' });
      }
    });
  },
  onMore() {
    wx.showActionSheet({
      itemList: ['不感兴趣', '举报帖子'],
      itemColor: '#0f1419',
      success: () => wx.showToast({ title: '已收到反馈', icon: 'none' })
    });
  },
  goProfile(e) {
    const handle = e.currentTarget.dataset.handle;
    if (handle === ME_HANDLE) wx.switchTab({ url: '/pages/profile/profile' });
    else wx.navigateTo({ url: '/pages/profile/profile?handle=' + handle });
  },

  /* ---------- 回复 ---------- */
  onReplyInput(e) {
    this.setData({ replyText: e.detail.value, sendable: e.detail.value.trim().length > 0 });
  },
  sendReply() {
    if (!this.data.sendable) return;
    const rvm = vmh.replyVM({ user: ME_HANDLE, text: this.data.replyText, mins: 0, likes: 0 });
    rvm.liked = false;
    rvm.heartSrc = icons.heart('#536471', false);
    if (!this.sessionExtra) this.sessionExtra = [];
    this.sessionExtra.unshift(rvm);
    const t = store.getUserTweet(this.tweetId) || mock.getTweet(this.tweetId);
    this.setData({
      replies: [rvm].concat(this.data.replies),
      replyText: '',
      sendable: false,
      repliesText: fmt.count(((t && t.repliesN) || 0) + this.sessionExtra.length)
    });
    getApp().globalData.feedDirty = true;
    wx.showToast({ title: '回复已发布', icon: 'none' });
    wx.vibrateShort({ type: 'light' });
  },

  /* 评论点赞（会话内） */
  onReplyLike(e) {
    const i = e.currentTarget.dataset.i;
    const r = this.data.replies[i];
    r.liked = !r.liked;
    if (r._base == null) r._base = parseInt(r.likesText) || 0;
    r.likesText = fmt.count(r._base + (r.liked ? 1 : 0));
    r.heartSrc = icons.heart(r.liked ? '#f91880' : '#536471', r.liked);
    this.setData({ ['replies[' + i + ']']: r });
    if (r.liked) wx.vibrateShort({ type: 'light' });
  }
});
