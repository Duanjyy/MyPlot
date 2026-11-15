/**
 * 本地状态存储：点赞 / 转推 / 书签 / 关注 / 搜索历史 / 个人资料 —— 全部持久化
 */
const KEYS = {
  liked: 'it_liked',
  rt: 'it_rt',
  bm: 'it_bm',
  follow: 'it_follow',
  history: 'it_history',
  profile: 'it_profile',
  userTweets: 'it_user_tweets'
};

const state = {
  liked: {},
  rt: {},
  bm: {},
  follow: {},
  history: [],
  profile: null,
  userTweets: []
};

function load() {
  state.liked = wx.getStorageSync(KEYS.liked) || {};
  state.rt = wx.getStorageSync(KEYS.rt) || {};
  state.bm = wx.getStorageSync(KEYS.bm) || {};
  state.follow = wx.getStorageSync(KEYS.follow) || {};
  state.history = wx.getStorageSync(KEYS.history) || [];
  state.profile = wx.getStorageSync(KEYS.profile) || null;
  state.userTweets = wx.getStorageSync(KEYS.userTweets) || [];
}

function save(key) {
  try { wx.setStorageSync(KEYS[key], state[key]); } catch (e) { /* 存储满时忽略 */ }
}

function init() { load(); }

/* ---------- 互动状态 ---------- */
const isLiked = (id) => !!state.liked[id];
const isRt = (id) => !!state.rt[id];
const isBm = (id) => !!state.bm[id];
const isFollow = (handle) => !!state.follow[handle];

function toggleLike(id) {
  state.liked[id] = !state.liked[id];
  if (!state.liked[id]) delete state.liked[id];
  save('liked');
  return state.liked[id];
}
function toggleRt(id) {
  state.rt[id] = !state.rt[id];
  if (!state.rt[id]) delete state.rt[id];
  save('rt');
  return state.rt[id];
}
function toggleBm(id) {
  state.bm[id] = !state.bm[id];
  if (!state.bm[id]) delete state.bm[id];
  save('bm');
  return state.bm[id];
}
function toggleFollow(handle) {
  state.follow[handle] = !state.follow[handle];
  if (!state.follow[handle]) delete state.follow[handle];
  save('follow');
  return state.follow[handle];
}

/* ---------- 搜索历史 ---------- */
function addHistory(term) {
  const t = (term || '').trim();
  if (!t) return;
  const i = state.history.indexOf(t);
  if (i > -1) state.history.splice(i, 1);
  state.history.unshift(t);
  if (state.history.length > 12) state.history.pop();
  save('history');
}
function removeHistory(term) {
  const i = state.history.indexOf(term);
  if (i > -1) state.history.splice(i, 1);
  save('history');
}
function clearHistory() {
  state.history = [];
  save('history');
}

/* ---------- 个人资料 ---------- */
function getProfile() { return state.profile; }
function setProfile(p) {
  state.profile = Object.assign({}, state.profile || {}, p);
  save('profile');
  return state.profile;
}

/* ---------- 我发布的帖子 ---------- */
function getUserTweets() { return state.userTweets; }
function addUserTweet(t) {
  state.userTweets.unshift(t);
  save('userTweets');
}
function getUserTweet(id) {
  return state.userTweets.find((t) => t.id === id) || null;
}
function deleteUserTweet(id) {
  state.userTweets = state.userTweets.filter((t) => t.id !== id);
  save('userTweets');
}

module.exports = {
  init,
  isLiked, isRt, isBm, isFollow,
  toggleLike, toggleRt, toggleBm, toggleFollow,
  addHistory, removeHistory, clearHistory,
  getProfile, setProfile,
  getUserTweets, addUserTweet, getUserTweet, deleteUserTweet
};
