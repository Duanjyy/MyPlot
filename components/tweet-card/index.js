const store = require('../../utils/store');
const mock = require('../../data/mock');

Component({
  properties: {
    vm: { type: Object, value: null },
    composed: { type: Boolean, value: false } // 是否为“我”发布的帖子（默认样式为普通卡片）
  },
  data: {},
  methods: {
    onTap(e) {
      const id = e.currentTarget.dataset.id;
      if (id) wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
    },
    onAvatar(e) {
      const handle = e.currentTarget.dataset.handle;
      if (handle === 'itwitter_fan') {
        wx.switchTab({ url: '/pages/profile/profile' });
      } else {
        wx.navigateTo({ url: '/pages/profile/profile?handle=' + handle });
      }
    },
    onQuoted(e) {
      const id = e.currentTarget.dataset.id;
      if (id) wx.navigateTo({ url: '/pages/detail/detail?id=' + id });
    },
    onLike(e) {
      const vm = this.data.vm;
      const liked = store.toggleLike(vm.id);
      this.setData({
        'vm.liked': liked,
        'vm.icons.heart': require('../../utils/icons').heart(liked ? '#f91880' : '#536471', liked)
      });
      // 触发心跳动画
      this.setData({ beat: true });
      setTimeout(() => this.setData({ beat: false }), 350);
      if (liked) wx.vibrateShort({ type: 'light' });
    },
    onRt(e) {
      const vm = this.data.vm;
      const icons = require('../../utils/icons');
      const doRt = () => {
        const rted = store.toggleRt(vm.id);
        this.setData({
          'vm.rted': rted,
          'vm.icons.rt': icons.retweet(rted ? '#00ba7c' : '#536471')
        });
        if (rted) {
          wx.showToast({ title: '已转推', icon: 'none' });
          wx.vibrateShort({ type: 'light' });
        }
      };
      if (!vm.rted) {
        wx.showActionSheet({
          itemList: ['转推', '引用转推'],
          itemColor: '#0f1419',
          success: (res) => {
            if (res.tapIndex === 0) doRt();
            else wx.showToast({ title: '引用转推：请在编辑器中继续（演示）', icon: 'none' });
          }
        });
      } else {
        doRt();
      }
    },
    onBm() {
      const vm = this.data.vm;
      const bmed = store.toggleBm(vm.id);
      this.setData({
        'vm.bmed': bmed,
        'vm.icons.bm': require('../../utils/icons').bookmark(bmed ? '#1d9bf0' : '#536471', bmed)
      });
      wx.showToast({ title: bmed ? '已加入书签' : '已从书签移除', icon: 'none' });
    },
    onShare() {
      wx.showActionSheet({
        itemList: ['复制链接', '通过私信发送'],
        itemColor: '#0f1419',
        success: (res) => {
          if (res.tapIndex === 0) {
            wx.setClipboardData({ data: 'https://x.com/' + this.data.vm.handle + '/status/' + this.data.vm.id });
          } else {
            wx.showToast({ title: '私信分享（演示）', icon: 'none' });
          }
        }
      });
    },
    onMore() {
      const vm = this.data.vm;
      if (vm.mine) {
        wx.showActionSheet({
          itemList: ['删除帖子'],
          itemColor: '#f4212e',
          success: (res) => {
            if (res.tapIndex === 0) {
              store.deleteUserTweet(vm.id);
              this.triggerEvent('deleted', { id: vm.id });
              wx.showToast({ title: '帖子已删除', icon: 'none' });
            }
          }
        });
      } else {
        wx.showActionSheet({
          itemList: ['不感兴趣', '屏蔽 @' + vm.handle, '举报帖子'],
          itemColor: '#0f1419',
          success: (res) => {
            if (res.tapIndex === 0) this.triggerEvent('dismiss', { id: vm.id });
            else wx.showToast({ title: '已收到反馈', icon: 'none' });
          }
        });
      }
    }
  }
});
