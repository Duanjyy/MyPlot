/**
 * SVG 媒体生成器：头像 / 推文配图
 * 用确定性伪随机生成抽象渐变图，模拟真实推文媒体形态（无外部网络依赖）
 */
const { b64 } = require('./icons');

function rng(seed) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = (h * 16777619) | 0;
  }
  return function () {
    h ^= h << 13; h |= 0;
    h ^= h >> 7;
    h ^= h << 17; h |= 0;
    return ((h >>> 8) & 0xffffff) / 0xffffff;
  };
}

function svg64(svg) {
  return 'data:image/svg+xml;base64,' + b64(svg);
}

/** 头像：双色渐变圆 + 名字首字符 */
function avatar(name, seed) {
  const r = rng(seed || name);
  const h1 = Math.floor(r() * 360);
  const h2 = (h1 + 60 + Math.floor(r() * 120)) % 360;
  const ch = (name || '?').trim().charAt(0).toUpperCase();
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
    `<stop offset="0" stop-color="hsl(${h1},62%,52%)"/>` +
    `<stop offset="1" stop-color="hsl(${h2},58%,38%)"/>` +
    '</linearGradient></defs>' +
    '<rect width="200" height="200" fill="url(#g)"/>' +
    `<circle cx="${40 + r() * 120}" cy="${30 + r() * 60}" r="${30 + r() * 40}" fill="rgba(255,255,255,0.14)"/>` +
    `<text x="100" y="118" text-anchor="middle" dominant-baseline="middle" font-family="-apple-system,'PingFang SC',sans-serif" font-size="86" font-weight="600" fill="rgba(255,255,255,0.95)">${ch}</text>` +
    '</svg>';
  return svg64(svg);
}

/** 推文配图：抽象风景/几何构图，16:9 */
function photo(seed) {
  const r = rng(seed);
  const h = Math.floor(r() * 360);
  const dark = h;
  const svg =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450">' +
    '<defs><linearGradient id="g" x1="0" y1="0" x2="0.4" y2="1">' +
    `<stop offset="0" stop-color="hsl(${h},48%,26%)"/>` +
    `<stop offset="1" stop-color="hsl(${(h + 40) % 360},52%,12%)"/>` +
    '</linearGradient>' +
    '<radialGradient id="s" cx="0.7" cy="0.3" r="0.5">' +
    `<stop offset="0" stop-color="hsl(${(h + 200) % 360},80%,72%)" stop-opacity="0.85"/>` +
    '<stop offset="1" stop-color="hsl(0,0%,0%)" stop-opacity="0"/>' +
    '</radialGradient></defs>' +
    '<rect width="800" height="450" fill="url(#g)"/>' +
    '<rect width="800" height="450" fill="url(#s)"/>' +
    `<circle cx="${(r() * 800) | 0}" cy="${(r() * 200) | 0}" r="${(60 + r() * 90) | 0}" fill="hsla(${(h + 180) % 360},70%,60%,0.35)"/>` +
    `<circle cx="${(r() * 800) | 0}" cy="${(r() * 400) | 0}" r="${(30 + r() * 60) | 0}" fill="hsla(${(h + 90) % 360},65%,55%,0.3)"/>` +
    `<polygon points="0,${380 + (r() * 40 - 20) | 0} 260,${240 + (r() * 60 - 30) | 0} 520,${390 + (r() * 30 - 15) | 0} 800,${260 + (r() * 50 - 25) | 0} 800,450 0,450" fill="hsla(${dark},45%,16%,0.85)"/>` +
    `<polygon points="0,${410 + (r() * 20 - 10) | 0} 400,${330 + (r() * 40 - 20) | 0} 800,${420 + (r() * 20 - 10) | 0} 800,450 0,450" fill="hsla(${dark},40%,10%,0.9)"/>` +
    '</svg>';
  return svg64(svg);
}

module.exports = { avatar, photo };
