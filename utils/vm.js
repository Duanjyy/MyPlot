/**
 * 视图模型装配：把数据层对象转换为页面可直接渲染的 VM（含图标、格式化文本、互动状态）
 */
const icons = require('./icons');
const fmt = require('./format');
const store = require('./store');
const mock = require('../data/mock');
const media = require('./media');

const GRAY = '#536471';
const WHITE = '#0f1419';
const BLUE = '#1d9bf0';
const PINK = '#f91880';
const GREEN = '#00ba7c';
const GOLD = '#dc9f20';

// 当前用户默认头像（本地真实图片资源）
const ME_AVATAR = '/assets/avatar_me.jpg';

function badgeIcon(v) {
  // 认证徽章统一使用蓝色（与新版 X 一致）
  if (v === 1 || v === 2) return icons.verified(BLUE);
  return '';
}
/** 当前用户（合并已编辑的资料） */
function meVM() {
  const m = Object.assign({}, mock.me, store.getProfile() || {});
  m.avatar = ME_AVATAR;
  m.isMe = true;
  return m;
}

/** 用户视图模型 */
function userVM(handle) {
  const u = handle === mock.me.handle ? meVM() : mock.findUser(handle);
  if (!u) return null;
  return {
    handle: u.handle,
    name: u.name,
    verified: u.verified || 0,
    vBadge: badgeIcon(u.verified),
    avatar: u.avatar,
    banner: u.banner,
    bio: u.bio,
    location: u.location,
    link: u.link,
    followersText: u.followersText || fmt.count(u.followers || 0),
    following: u.following,
    joined: u.joined || '2016年7月',
    isMe: u.handle === mock.me.handle,
    followState: store.isFollow(u.handle)
  };
}

/** 评论区一条回复 */
function replyVM(r) {
  const u = r.user === mock.me.handle ? meVM() : mock.findUser(r.user);
  return {
    id: (r.id || r.user + '_' + r.mins),
    handle: u.handle,
    name: u.name,
    verified: u.verified || 0,
    vBadge: badgeIcon(u.verified),
    avatar: u.avatar,
    text: r.text,
    timeText: fmt.relTime(Date.now() - r.mins * 60000),
    likesText: fmt.count(r.likes || 0)
  };
}

/** 推文卡片 VM（时间线/搜索/相关推荐/个人列表通用） */
function tweetVM(t, mine) {
  const u = mine ? meVM() : mock.findUser(t.user);
  if (!u) return null;
  const liked = store.isLiked(t.id);
  const rted = store.isRt(t.id);
  const bmed = store.isBm(t.id);
  const vm = {
    id: t.id,
    mine: !!mine,
    name: u.name,
    handle: u.handle,
    verified: u.verified || 0,
    vBadge: badgeIcon(u.verified),
    avatar: u.avatar,
    timeText: fmt.relTime(t.ts),
    text: t.text,
    tagText: (t.tags || []).map((x) => '#' + x).join(' '),
    mediaUrls: t.mediaUrls || null,
    likesText: fmt.count((t.likes || 0) + (liked ? 1 : 0)),
    rtsText: fmt.count((t.rts || 0) + (rted ? 1 : 0)),
    repliesText: fmt.count(t.repliesN || 0),
    viewsText: fmt.count(t.views || 0),
    liked, rted, bmed,
    quoted: null,
    icons: {
      more: icons.more(GRAY),
      reply: icons.reply(GRAY),
      replyBlue: icons.reply(BLUE),
      rt: icons.retweet(rted ? GREEN : GRAY),
      heart: icons.heart(liked ? PINK : GRAY, liked),
      views: icons.views(GRAY),
      bm: icons.bookmark(bmed ? BLUE : GRAY, bmed),
      share: icons.share(GRAY)
    }
  };
  if (t.quoted) {
    const qu = t.quoted.handle === mock.me.handle ? meVM() : mock.findUser(t.quoted.handle);
    vm.quoted = {
      id: t.quoted.id,
      name: t.quoted.name,
      handle: t.quoted.handle,
      vBadge: badgeIcon(t.quoted.verified),
      text: t.quoted.text.length > 140 ? t.quoted.text.slice(0, 140) + '…' : t.quoted.text,
      mediaUrl: t.quoted.mediaUrl || null,
      avatar: qu ? qu.avatar : ''
    };
  }
  return vm;
}

/** 用户行 VM（推荐账号 / 搜索结果） */
function userRowVM(handle) {
  const vm = userVM(handle);
  if (!vm) return null;
  return {
    handle: vm.handle,
    name: vm.name,
    vBadge: vm.vBadge,
    avatar: vm.avatar,
    bio: vm.bio,
    isMe: vm.isMe,
    following: vm.followState
  };
}

module.exports = { meVM, userVM, tweetVM, replyVM, userRowVM, badgeIcon };
