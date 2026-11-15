const icons = require('../utils/icons');

Component({
  data: {
    selected: 0,
    list: [
      { page: 'pages/index/index', key: 'home', src: '' },
      { page: 'pages/explore/explore', key: 'search', src: '' },
      { page: 'pages/profile/profile', key: 'person', src: '' }
    ]
  },
  lifetimes: {
    attached() { this.build(); }
  },
  observers: {
    selected() { this.build(); }
  },
  methods: {
    build() {
      const active = this.data.selected;
      const GRAY = '#536471';
      const WHITE = '#0f1419';
      const list = this.data.list.map((it, i) => {
        const c = i === active ? WHITE : GRAY;
        let src;
        if (it.key === 'home') src = icons.home(c, i === active);
        else if (it.key === 'search') src = icons.search(c);
        else src = icons.person(c, i === active);
        return Object.assign({}, it, { src });
      });
      this.setData({ list });
    },
    switchTab(e) {
      const i = +e.currentTarget.dataset.i;
      const it = this.data.list[i];
      if (i === this.data.selected) return;
      wx.switchTab({ url: '/' + it.page });
    }
  }
});
