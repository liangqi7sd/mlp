/* 三层塔 · 立绘
   三张手绘 SVG 半身像，纯矢量、无图片资源。
   对外：window.Sprites.build() / show(id) / hide() / flash(id)          */
(function (root) {
  'use strict';

  var ART = {

    /* ---------- 阿零 · 一层 · ReLU ---------- */
    zero:
      '<svg viewBox="46 4 208 376" preserveAspectRatio="xMidYMax meet">' +
      '<defs>' +
        '<radialGradient id="z-halo" cx="50%" cy="46%" r="50%">' +
          '<stop offset="0" stop-color="#6ea6ff" stop-opacity=".26"/>' +
          '<stop offset=".55" stop-color="#5b8cff" stop-opacity=".08"/>' +
          '<stop offset="1" stop-color="#5b8cff" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="z-body" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#22375c"/><stop offset=".55" stop-color="#131f36"/>' +
          '<stop offset="1" stop-color="#080d18"/>' +
        '</linearGradient>' +
        '<linearGradient id="z-face" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#1b2c4a"/><stop offset="1" stop-color="#0d1626"/>' +
        '</linearGradient>' +
      '</defs>' +

      '<circle cx="150" cy="170" r="136" fill="url(#z-halo)"/>' +

      /* 身体：方肩 */
      '<path d="M92 380 L92 262 Q92 250 104 247 L150 238 L196 247 Q208 250 208 262 L208 380 Z" ' +
        'fill="url(#z-body)" stroke="#7fb2ff" stroke-opacity=".38" stroke-width="1.2"/>' +
      /* 肩线 + 手臂接缝 */
      '<path d="M110 258 h80" stroke="#9cc6ff" stroke-opacity=".30"/>' +
      '<path d="M106 268 L101 348 M194 268 L199 348" stroke="#7fb2ff" stroke-opacity=".18"/>' +
      /* 领口 */
      '<path d="M128 244 L150 268 L172 244" fill="none" stroke="#9cc6ff" stroke-opacity=".42"/>' +

      /* 胸口：三个房间，中间那间永远黑着 */
      '<rect x="116" y="292" width="68" height="44" rx="4" fill="#070c16" ' +
        'stroke="#7fb2ff" stroke-opacity=".22"/>' +
      '<rect x="123" y="300" width="16" height="28" rx="2" fill="#7fb2ff" fill-opacity=".55"/>' +
      '<rect x="142" y="300" width="16" height="28" rx="2" fill="#03060c" ' +
        'stroke="#7fb2ff" stroke-opacity=".26"/>' +
      '<rect x="161" y="300" width="16" height="28" rx="2" fill="#7fb2ff" fill-opacity=".45"/>' +
      /* 中间那间：一个叉 */
      '<path d="M145 307 l10 10 M155 307 l-10 10" stroke="#7fb2ff" stroke-opacity=".55" ' +
        'stroke-width="1.6"/>' +

      /* 脖子 + 头（下巴收窄） */
      '<path d="M140 214 h20 v26 h-20 z" fill="#0d1728" stroke="#7fb2ff" stroke-opacity=".2"/>' +
      '<path d="M120 94 h60 q12 0 12 14 v56 q0 20 -16 30 l-26 13 -26 -13 q-16 -10 -16 -30 ' +
        'v-56 q0 -14 12 -14 z" fill="url(#z-face)" stroke="#7fb2ff" stroke-opacity=".55" ' +
        'stroke-width="1.3"/>' +
      /* 面罩上沿 */
      '<path d="M112 118 q38 -12 76 0" fill="none" stroke="#9cc6ff" stroke-opacity=".28"/>' +

      /* 面罩上极淡的扫描线 */
      '<path d="M117 128 h66 M117 158 h66 M117 188 h66" stroke="#7fb2ff" stroke-opacity=".07"/>' +

      /* 眼：两道平行的横线；嘴：一条直线 */
      '<path d="M128 146 h16 M156 146 h16" stroke="#dcecff" stroke-width="3.4" ' +
        'stroke-linecap="round"/>' +
      '<path d="M139 174 h22" stroke="#8fbcff" stroke-opacity=".7" stroke-width="2.2" ' +
        'stroke-linecap="round"/>' +

      /* 头顶的信号灯 */
      '<path d="M150 94 v-20 M133 74 h34" stroke="#7fb2ff" stroke-opacity=".5" stroke-width="1.8"/>' +
      '<circle cx="150" cy="66" r="5" fill="#a9d0ff" fill-opacity=".95"/>' +
      '<circle cx="150" cy="66" r="13" fill="#7fb2ff" fill-opacity=".14"/>' +

      /* 左侧轮廓光 */
      '<path d="M92 380 L92 262 Q92 250 104 247" fill="none" stroke="#c6e0ff" ' +
        'stroke-opacity=".55" stroke-width="1.6"/>' +
      '</svg>',

    /* ---------- 西格 · 二层 · Sigmoid ---------- */
    sig:
      '<svg viewBox="46 4 208 376" preserveAspectRatio="xMidYMax meet">' +
      '<defs>' +
        '<radialGradient id="s-halo" cx="50%" cy="44%" r="50%">' +
          '<stop offset="0" stop-color="#5ee0bd" stop-opacity=".24"/>' +
          '<stop offset=".55" stop-color="#56d9b0" stop-opacity=".07"/>' +
          '<stop offset="1" stop-color="#56d9b0" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="s-body" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#16383a"/><stop offset=".6" stop-color="#0d2226"/>' +
          '<stop offset="1" stop-color="#060d10"/>' +
        '</linearGradient>' +
        '<linearGradient id="s-face" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#173b3c"/><stop offset="1" stop-color="#0a191c"/>' +
        '</linearGradient>' +
      '</defs>' +

      '<circle cx="150" cy="172" r="138" fill="url(#s-halo)"/>' +
      /* 压下来的力场 */
      '<ellipse cx="150" cy="172" rx="66" ry="72" fill="none" stroke="#6fe0c0" stroke-opacity=".10"/>' +
      '<ellipse cx="150" cy="172" rx="82" ry="88" fill="none" stroke="#6fe0c0" stroke-opacity=".055"/>' +

      /* 压下来的那块板 */
      '<path d="M84 58 L112 104 M216 58 L188 104" stroke="#6fe0c0" stroke-opacity=".16" ' +
        'stroke-width="1.4"/>' +
      '<path d="M76 36 v-14 M224 36 v-14" stroke="#6fe0c0" stroke-opacity=".20" stroke-width="2"/>' +
      '<rect x="64" y="36" width="172" height="14" rx="7" fill="#0c1e21" ' +
        'stroke="#6fe0c0" stroke-opacity=".55" stroke-width="1.2"/>' +
      '<rect x="64" y="36" width="172" height="4" rx="2" fill="#8ff0d8" fill-opacity=".25"/>' +
      '<path d="M64 50 v22 M236 50 v22" stroke="#6fe0c0" stroke-opacity=".22" stroke-width="2"/>' +

      /* 身体：被压扁的钟形 */
      '<path d="M84 380 Q88 262 150 250 Q212 262 216 380 Z" ' +
        'fill="url(#s-body)" stroke="#6fe0c0" stroke-opacity=".42" stroke-width="1.2"/>' +
      /* 抱在胸前的手 */
      '<path d="M112 306 q38 24 76 0" fill="none" stroke="#6fe0c0" stroke-opacity=".34" ' +
        'stroke-width="2"/>' +
      '<path d="M116 328 q34 20 68 0" fill="none" stroke="#6fe0c0" stroke-opacity=".20" ' +
        'stroke-width="2"/>' +
      '<path d="M150 250 v46" stroke="#6fe0c0" stroke-opacity=".16"/>' +

      /* 头：压扁的圆 */
      '<ellipse cx="150" cy="170" rx="49" ry="53" fill="url(#s-face)" ' +
        'stroke="#6fe0c0" stroke-opacity=".55" stroke-width="1.3"/>' +
      '<path d="M101 158 q0 -58 49 -58 q49 0 49 58 q-24 -30 -49 -30 q-25 0 -49 30 Z" ' +
        'fill="#123034" stroke="#6fe0c0" stroke-opacity=".28"/>' +

      /* 半睁的眼：一切都是平的；嘴：一条短线 */
      '<path d="M124 176 h17 M159 176 h17" stroke="#d8fff4" stroke-width="2.8" ' +
        'stroke-linecap="round"/>' +
      '<path d="M141 204 h18" stroke="#6fe0c0" stroke-opacity=".65" stroke-width="2" ' +
        'stroke-linecap="round"/>' +

      /* 输出的刻度：0 与 1 */
      '<path d="M96 300 h-14 M204 300 h14" stroke="#6fe0c0" stroke-opacity=".26"/>' +
      '<circle cx="80" cy="300" r="2.2" fill="#6fe0c0" fill-opacity=".55"/>' +
      '<circle cx="220" cy="300" r="2.2" fill="#6fe0c0" fill-opacity=".55"/>' +

      /* 轮廓光 */
      '<path d="M84 380 Q88 262 150 250" fill="none" stroke="#a8ffe6" ' +
        'stroke-opacity=".42" stroke-width="1.6"/>' +
      '</svg>',

    /* ---------- 塔恩 · 三层 · tanh ---------- */
    tan:
      '<svg viewBox="46 4 208 376" preserveAspectRatio="xMidYMax meet">' +
      '<defs>' +
        '<radialGradient id="t-halo" cx="50%" cy="40%" r="52%">' +
          '<stop offset="0" stop-color="#ffbd8a" stop-opacity=".26"/>' +
          '<stop offset=".55" stop-color="#ff9f6a" stop-opacity=".08"/>' +
          '<stop offset="1" stop-color="#ff9f6a" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="t-lamp" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0" stop-color="#ffbd8a" stop-opacity=".6"/>' +
          '<stop offset=".45" stop-color="#ffa872" stop-opacity=".22"/>' +
          '<stop offset="1" stop-color="#ff9f6a" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<linearGradient id="t-body" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#331f22"/><stop offset=".55" stop-color="#1a1017"/>' +
          '<stop offset="1" stop-color="#080509"/>' +
        '</linearGradient>' +
        '<linearGradient id="t-face" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0" stop-color="#3a2418"/><stop offset=".45" stop-color="#1e1218"/>' +
          '<stop offset="1" stop-color="#0a0710"/>' +
        '</linearGradient>' +
        '<linearGradient id="t-hat" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0" stop-color="#2a1a1c"/><stop offset="1" stop-color="#120c13"/>' +
        '</linearGradient>' +
      '</defs>' +

      '<circle cx="150" cy="164" r="140" fill="url(#t-halo)"/>' +

      /* 斗篷 */
      '<path d="M80 380 L92 258 Q104 218 150 212 Q196 218 208 258 L220 380 Z" ' +
        'fill="url(#t-body)" stroke="#ffbd8a" stroke-opacity=".38" stroke-width="1.2"/>' +
      /* 披肩 */
      '<path d="M96 272 Q150 300 204 272" fill="none" stroke="#ffbd8a" stroke-opacity=".30" ' +
        'stroke-width="1.6"/>' +
      '<path d="M150 214 v166" stroke="#ffbd8a" stroke-opacity=".12"/>' +

      /* 尖帽 */
      '<path d="M150 22 L202 120 Q150 104 98 120 Z" fill="url(#t-hat)" ' +
        'stroke="#ffbd8a" stroke-opacity=".5" stroke-width="1.3"/>' +
      '<path d="M150 40 L186 110" stroke="#ffbd8a" stroke-opacity=".20"/>' +
      '<path d="M150 22 L146 12 h8 z" fill="#ffbd8a" fill-opacity=".7"/>' +

      /* 头：明暗各一半 */
      '<rect x="112" y="102" width="76" height="96" rx="24" fill="url(#t-face)" ' +
        'stroke="#ffbd8a" stroke-opacity=".5" stroke-width="1.3"/>' +
      '<path d="M150 104 v92" stroke="#ffbd8a" stroke-opacity=".16"/>' +
      /* 帽檐的阴影 */
      '<path d="M112 116 q38 -12 76 0" fill="none" stroke="#ffbd8a" stroke-opacity=".22"/>' +
      /* 左侧的暖光扫过脸 */
      '<path d="M113 108 q9 44 6 86" fill="none" stroke="#ffd9b5" stroke-opacity=".38" ' +
        'stroke-width="1.8"/>' +

      /* 一明一暗的眼睛 */
      '<circle cx="131" cy="148" r="10" fill="url(#t-lamp)"/>' +
      '<circle cx="131" cy="148" r="3.6" fill="#ffe8d0"/>' +
      '<circle cx="169" cy="148" r="2.6" fill="#7d5f4c"/>' +
      /* 嘴 */
      '<path d="M137 178 h26" stroke="#ffbd8a" stroke-opacity=".55" stroke-width="2.2" ' +
        'stroke-linecap="round"/>' +

      /* 提灯的手 */
      '<path d="M206 314 q10 -26 24 -46" fill="none" stroke="#ffbd8a" stroke-opacity=".45" ' +
        'stroke-width="1.6"/>' +
      '<circle cx="231" cy="266" r="3" fill="#ffd9b5" fill-opacity=".8"/>' +
      '<circle cx="238" cy="248" r="34" fill="url(#t-lamp)"/>' +
      '<circle cx="238" cy="248" r="12" fill="#ffbd8a" fill-opacity=".14" ' +
        'stroke="#ffbd8a" stroke-opacity=".7" stroke-width="1.2"/>' +
      '<circle cx="238" cy="248" r="4.2" fill="#ffe6cb"/>' +
      /* 飘起来的火星 */
      '<circle cx="259" cy="222" r="1.8" fill="#ffcf9e" fill-opacity=".85"/>' +
      '<circle cx="251" cy="206" r="1.2" fill="#ffcf9e" fill-opacity=".5"/>' +

      /* 轮廓光 */
      '<path d="M80 380 L92 258 Q104 218 150 212" fill="none" stroke="#ffd9b5" ' +
        'stroke-opacity=".5" stroke-width="1.6"/>' +
      '</svg>'
  };

  var ORDER = ['zero', 'sig', 'tan'];
  var host = null, built = false, current = null;

  function build() {
    host = document.getElementById('sprites');
    if (!host || built) return;
    var html = '';
    for (var i = 0; i < ORDER.length; i++) {
      var id = ORDER[i];
      html += '<div class="sp" id="sp-' + id + '" data-id="' + id + '">' + ART[id] + '</div>';
    }
    host.innerHTML = html;
    built = true;
  }

  /* 谁在说话：显示对应立绘，其余淡出 */
  function show(id) {
    build();
    if (!host) return;
    var known = ORDER.indexOf(id) !== -1;
    if (!known) {
      /* 旁白 / 你 / 塔：保留最后一张，压暗 */
      for (var i = 0; i < ORDER.length; i++) {
        var el = document.getElementById('sp-' + ORDER[i]);
        if (!el) continue;
        el.classList.remove('on');
        el.classList.toggle('dim', ORDER[i] === current);
      }
      return;
    }
    current = id;
    for (var j = 0; j < ORDER.length; j++) {
      var node = document.getElementById('sp-' + ORDER[j]);
      if (!node) continue;
      node.classList.toggle('on', ORDER[j] === id);
      node.classList.remove('dim');
    }
  }

  function hide() {
    build();
    for (var i = 0; i < ORDER.length; i++) {
      var el = document.getElementById('sp-' + ORDER[i]);
      if (el) el.classList.remove('on', 'dim');
    }
  }

  root.Sprites = { build: build, show: show, hide: hide, current: function () { return current; } };

})(typeof window !== 'undefined' ? window : this);
