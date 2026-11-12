/* engine.js — 极简视觉小说引擎 */
window.Engine = (function () {
  var $ = function (id) { return document.getElementById(id); };

  var SPEAKERS = {
    n:    { name: '',       color: '' },
    zero: { name: '阿零',   color: '#7fb2ff' },
    sig:  { name: '西格',   color: '#6fe0c0' },
    tan:  { name: '塔恩',   color: '#ffbd8a' },
    me:   { name: '你',     color: '#c9b6ff' },
    sys:  { name: '广播',   color: '#7fdbff' },
    tower:{ name: '塔',     color: '#9fb2cf' }
  };

  var S = {
    typing: false, finishType: null, pending: null,
    choosing: false, started: false, hist: [], epoch: 0, timer: null
  };

  var textEl, dialogEl, speakerEl, nextEl, hudEl, hudK, hudV, choicesEl;

  /* ---------- 基础 ---------- */

  function wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  // 演出队列：剧本可以连写 say()，不必层层 await
  var Q = Promise.resolve();
  function enqueue(fn) {
    var p = Q.then(fn);
    Q = p.then(function () { }, function () { });
    return p;
  }

  // 把“即演”命令也放进队列：剧本按书写顺序调用，屏幕上就按同一顺序发生
  function defer(fn) {
    return function () {
      var args = arguments;
      return enqueue(function () { return fn.apply(null, args); });
    };
  }

  function type(text, speed) {    return new Promise(function (resolve) {
      var i = 0, done = false, t = null;
      textEl.textContent = '';
      S.typing = true;

      function finish() {
        if (done) return;
        done = true;
        clearTimeout(t);
        textEl.textContent = text;
        S.typing = false;
        S.finishType = null;
        resolve();
      }
      S.finishType = finish;

      function step() {
        if (done) return;
        if (i >= text.length) { finish(); return; }
        i++;
        textEl.textContent = text.slice(0, i);
        var c = text[i - 1];
        var extra = 0;
        if ('。！？…'.indexOf(c) >= 0) extra = 150;
        else if ('，、；：'.indexOf(c) >= 0) extra = 55;
        else if (c === '\n') extra = 120;
        t = setTimeout(step, (speed || 26) + extra);
      }
      step();
    });
  }

  function waitClick() {
    return new Promise(function (resolve) {
      S.pending = resolve;
      nextEl.classList.add('show');
    });
  }

  function advance() {
    if (!S.started || S.choosing) return;
    if (S.finishType) { S.finishType(); return; }
    if (S.pending) {
      var r = S.pending;
      S.pending = null;
      nextEl.classList.remove('show');
      r();
    }
  }

  function setSpeaker(who, opt) {
    var sp = SPEAKERS[who] || SPEAKERS.n;
    var name = (opt && opt.as) || sp.name;
    if (!name) {
      speakerEl.classList.remove('show');
      textEl.className = 'narration';
    } else {
      speakerEl.classList.add('show');
      speakerEl.textContent = name;
      speakerEl.style.color = sp.color || '#94a6c2';
      textEl.className = '';
    }
    textEl.style.color = (opt && opt.color) || '';
    if (window.Sprites) window.Sprites.show(who);
  }

  /* ---------- 演出 ---------- */

  function sayNow(who, text, opt) {
    opt = opt || {};
    setSpeaker(who, opt);
    return type(text, opt.speed).then(function () {
      if (opt.auto != null) return wait(opt.auto);
      return waitClick();
    });
  }

  function say(who, text, opt) {
    return enqueue(function () { return sayNow(who, text, opt); });
  }

  function hud(k, v) {
    if (k == null) { hudEl.classList.remove('show'); return; }
    hudK.textContent = k;
    hudV.textContent = v;
    hudEl.classList.add('show');
  }

  function voice(name) {
    ['tan', 'sig', 'zero', 'me'].forEach(function (n) {
      var o = $('orb-' + n);
      if (o) o.classList.toggle('active', n === name);
    });
  }

  function silence() { voice(null); }

  function reveal(name) {
    var o = $('orb-' + name);
    if (o) { o.classList.add('awake'); o.classList.remove('dead'); }
  }

  function dim(name) {
    var o = $('orb-' + name);
    if (o) { o.classList.add('dead'); o.classList.remove('awake', 'active'); }
  }

  function beamTo(name, back) {
    var o = $('orb-' + name);
    if (!o) return;
    var r = o.getBoundingClientRect();
    var b = $('beam');
    b.style.left = (r.left + r.width / 2) + 'px';
    b.style.top = (r.top + r.height / 2) + 'px';
    b.classList.add('on');
    b.classList.toggle('back', !!back);
  }

  function beamOff() {
    var b = $('beam');
    if (b) b.classList.remove('on');
  }

  function pulse(name, ms, back) {
    beamTo(name, back);
    return wait(ms || 420).then(beamOff);
  }

  /* ---------- 观测窗 ---------- */

  var vizReady = false;

  function sync(net, acts, focus, lv) {
    if (!net) return;
    if (!vizReady) { Viz.build(net); vizReady = true; showPanel(); }
    Viz.update(net, acts, focus);
    var l = (lv != null) ? lv : MLP.loss(net, [0.9, -0.9], -0.85);
    $('loss-v').textContent = l.toFixed(3);
  }

  function chart() { Viz.chart(S.hist); }

  function showPanel() {
    document.body.classList.add('panel-open');
  }
  function hidePanel() {
    document.body.classList.remove('panel-open');
  }
  function togglePanel() {
    document.body.classList.toggle('panel-open');
  }

  function foot(t) { $('p-foot').textContent = t; }

  function epochLabel(prefix) {
    $('epoch').textContent = prefix || ('epoch ' + String(S.epoch).padStart(2, '0'));
  }

  function trainNow(net, x, y, lr, steps, delay, onStep) {
    var i = 0;
    function one() {
      if (i >= steps) return Promise.resolve();
      var r = MLP.backward(net, x, y);
      MLP.applyGrads(net, r.grads, lr);
      S.hist.push(r.loss);
      S.epoch = S.hist.length;
      epochLabel();
      sync(net, r.acts, null);
      chart();
      if (onStep) onStep(i, r, net);
      i++;
      var d = typeof delay === 'function' ? delay(i) : delay;
      return wait(d).then(one);
    }
    return one();
  }

  function train(net, x, y, lr, steps, delay, onStep) {
    return enqueue(function () {
      return trainNow(net, x, y, lr, steps, delay, onStep);
    });
  }

  /* ---------- 选择 ---------- */

  function choicesNow(opt) {
    return new Promise(function (resolve) {
      S.choosing = true;
      nextEl.classList.remove('show');
      choicesEl.innerHTML = '';
      if (opt.q) {
        var q = document.createElement('div');
        q.className = 'q';
        q.textContent = opt.q;
        choicesEl.appendChild(q);
      }
      opt.items.forEach(function (it, i) {
        var b = document.createElement('button');
        b.className = 'choice';
        b.innerHTML = '<span class="idx">0' + (i + 1) + '</span>' + it.label +
          (it.hint ? '<span class="hint">' + it.hint + '</span>' : '');
        b.onclick = function (e) {
          e.stopPropagation();
          choicesEl.classList.remove('show');
          choicesEl.innerHTML = '';
          S.choosing = false;
          resolve(it.value != null ? it.value : i);
        };
        choicesEl.appendChild(b);
      });
      choicesEl.classList.add('show');
    });
  }

  /* ---------- 结局 ---------- */

  function choices(opt) {
    return enqueue(function () { return choicesNow(opt); });
  }

  function endingNow(o) {
    var e = $('ending');
    hidePanel();
    $('end-kicker').textContent = o.kicker || '结局';
    $('end-title').textContent = o.title || '';
    $('end-body').innerHTML = o.body || '';
    e.classList.add('show');
    requestAnimationFrame(function () { e.classList.add('in'); });
    $('again').onclick = function () { location.reload(); };
  }

  function ending(o) {
    return enqueue(function () { endingNow(o); });
  }

  function chap(t) { $('chap').textContent = t; }

  /* ---------- 启动 ---------- */

  function bind() {
    textEl = $('text');
    dialogEl = $('dialog');
    speakerEl = $('speaker');
    nextEl = $('next');
    hudEl = $('hud');
    hudK = $('hud-k');
    hudV = $('hud-v');
    choicesEl = $('choices');

    var stage = $('stage');
    stage.addEventListener('click', function (e) {
      if (e.target.closest('#panel') || e.target.closest('#topbar')) return;
      advance();
    });
    document.addEventListener('keydown', function (e) {
      if (e.code === 'Space' || e.code === 'Enter') { e.preventDefault(); advance(); }
      if (e.code === 'KeyP') togglePanel();
    });

    $('panel-btn').addEventListener('click', function (e) {
      e.stopPropagation();
      togglePanel();
    });

    $('start').addEventListener('click', function () {
      if (S.started) return;
      S.started = true;
      $('cover').classList.add('gone');
      setTimeout(function () { window.Story.run(); }, 700);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bind);
  } else {
    bind();
  }

  return {
    say: say,
    hud: defer(hud), voice: defer(voice), silence: defer(silence),
    reveal: defer(reveal), dim: defer(dim), pulse: defer(pulse), beamOff: defer(beamOff),
    wait: defer(wait), chap: defer(chap), sync: defer(sync), chart: defer(chart),
    foot: defer(foot), epochLabel: defer(epochLabel),
    showPanel: defer(showPanel), hidePanel: defer(hidePanel), togglePanel: togglePanel,
    choices: choices, ending: ending, train: train,
    state: S
  };
})();
