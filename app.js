const store = require('./utils/store');

App({
  globalData: {
    statusBarHeight: 20,
    navH: 64,
    windowWidth: 375
  },
  onLaunch() {
    let win = {};
    try {
      win = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();
    } catch (e) {
      win = wx.getSystemInfoSync();
    }
    const sb = win.statusBarHeight || 20;
    this.globalData.statusBarHeight = sb;
    // 依据原生胶囊按钮计算导航内容区高度，使导航与胶囊垂直居中
    let navBarH = 44;
    try {
      const rect = wx.getMenuButtonBoundingClientRect();
      if (rect && rect.height > 0 && rect.top >= sb) {
        const h = Math.ceil((rect.top - sb) * 2 + rect.height);
        if (h >= 32 && h <= 64) navBarH = h;
      }
    } catch (e) { /* 拿不到胶囊信息时用默认 44px */ }
    this.globalData.navBarH = navBarH;
    this.globalData.navH = sb + navBarH;
    this.globalData.windowWidth = win.windowWidth || 375;
    store.init();
  }
});
