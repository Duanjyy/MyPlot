const icons = require('../../utils/icons');

Component({
  options: { multipleSlots: true },
  properties: {
    title: { type: String, value: '' },
    back: { type: Boolean, value: false },
    rightIcon: { type: String, value: '' } // gear | more | close | ''
  },
  data: { sb: 20, navBarH: 44, rightReserve: 0, backIcon: '', rightSrc: '' },
  lifetimes: {
    attached() {
      const app = getApp();
      // 计算原生胶囊按钮位置：右侧预留 + 垂直居中的内容区高度
      let rightReserve = 0;
      try {
        const rect = wx.getMenuButtonBoundingClientRect();
        const win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
        // 胶囊左边缘到屏幕右侧的距离 + 8px 间距
        rightReserve = Math.ceil(win.windowWidth - rect.left + 8);
      } catch (e) { /* 部分环境拿不到胶囊信息，退化为无预留 */ }
      this.setData({
        sb: app.globalData.statusBarHeight,
        navBarH: app.globalData.navBarH || 44,
        rightReserve
      });
      this.build();
    }
  },
  observers: {
    'back, rightIcon'() { this.build(); }
  },
  methods: {
    build() {
      this.setData({
        backIcon: this.data.back ? icons.back('#0f1419') : '',
        rightSrc: this.data.rightIcon ? icons[this.data.rightIcon]('#0f1419') : ''
      });
    },
    onBack() {
      wx.navigateBack({
        fail() { wx.switchTab({ url: '/pages/index/index' }); }
      });
    },
    onRight() { this.triggerEvent('right'); }
  }
});
