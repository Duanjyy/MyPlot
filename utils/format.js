/**
 * 格式化工具：相对时间 / 数字缩写 —— 与 X 中文语言环境一致
 */

/** 相对时间：X 风格（· 3小时 / 11月8日） */
function relTime(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return '刚刚';
  if (m < 60) return m + '分钟';
  const h = Math.floor(m / 60);
  if (h < 24) return h + '小时';
  const d = Math.floor(h / 24);
  if (d < 8) return d + '天';
  const date = new Date(ts);
  const now = new Date();
  const md = (date.getMonth() + 1) + '月' + date.getDate() + '日';
  if (date.getFullYear() === now.getFullYear()) return md;
  return date.getFullYear() + '年' + md;
}

/** 详情页完整时间：下午8:30 · 11月14日, 2026年 */
function fullTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  let h = d.getHours();
  const mm = String(d.getMinutes()).padStart(2, '0');
  const clock = (h < 12 ? '上午' : '下午') + (h % 12 === 0 ? 12 : h % 12) + ':' + mm;
  return clock + ' · ' + (d.getMonth() + 1) + '月' + d.getDate() + '日, ' + d.getFullYear() + '年';
}

/** 数字缩写：1.2万，与 X 一致 */
function count(n) {
  if (n == null) return '';
  if (n < 10000) return String(n);
  const w = n / 10000;
  const s = w >= 100 ? Math.round(w) + '' : (Math.floor(w * 10) / 10) + '';
  return s.replace(/\.0$/, '') + '万';
}

module.exports = { relTime, fullTime, count };
