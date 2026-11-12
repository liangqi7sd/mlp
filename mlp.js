/* mlp.js — 一个真的会学的小网络。2 → 3 → 2 → 1
 * 浏览器里挂到 window.MLP；Node 里 module.exports。
 * 没有依赖，手写前向 / 反向。
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MLP = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var ACTS = {
    relu: {
      f: function (z) { return z > 0 ? z : 0; },
      d: function (z) { return z > 0 ? 1 : 0; }
    },
    leaky: {
      f: function (z) { return z > 0 ? z : 0.06 * z; },
      d: function (z) { return z > 0 ? 1 : 0.06; }
    },
    sigmoid: {
      f: function (z) { return 1 / (1 + Math.exp(-z)); },
      d: function (z) { var s = 1 / (1 + Math.exp(-z)); return s * (1 - s); }
    },
    tanh: {
      f: function (z) { return Math.tanh(z); },
      d: function (z) { var t = Math.tanh(z); return 1 - t * t; }
    }
  };

  // 固定种子的随机数：每次打开，塔里的人都一模一样
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function create(opt) {
    opt = opt || {};
    var shape = opt.shape || [2, 3, 2, 1];
    var acts = opt.acts || ['relu', 'sigmoid', 'tanh'];
    var rnd = mulberry32(opt.seed || 7);
    var scale = opt.scale == null ? 1.6 : opt.scale;
    var layers = [];
    for (var l = 0; l < shape.length - 1; l++) {
      var nin = shape[l], nout = shape[l + 1];
      var W = [], b = [];
      for (var i = 0; i < nout; i++) {
        var row = [];
        for (var j = 0; j < nin; j++) {
          row.push((rnd() * 2 - 1) * Math.sqrt(1 / nin) * scale);
        }
        W.push(row);
        b.push((rnd() * 2 - 1) * 0.08);
      }
      layers.push({ W: W, b: b, act: acts[l] });
    }
    return { layers: layers, shape: shape.slice(), acts: acts.slice() };
  }

  function forward(net, x) {
    var actsArr = [x.slice()];
    var zs = [null];
    var a = x;
    for (var l = 0; l < net.layers.length; l++) {
      var L = net.layers[l];
      var z = [];
      for (var i = 0; i < L.W.length; i++) {
        var s = L.b[i];
        for (var j = 0; j < a.length; j++) s += L.W[i][j] * a[j];
        z.push(s);
      }
      var f = ACTS[L.act].f;
      var out = z.map(f);
      zs.push(z);
      actsArr.push(out);
      a = out;
    }
    return { acts: actsArr, zs: zs };
  }

  function backward(net, x, y) {
    var fw = forward(net, x);
    var actsArr = fw.acts, zs = fw.zs;
    var out = actsArr[actsArr.length - 1][0];
    var loss = 0.5 * (out - y) * (out - y);

    var da = [out - y];
    var grads = new Array(net.layers.length);

    for (var l = net.layers.length - 1; l >= 0; l--) {
      var L = net.layers[l];
      var f = ACTS[L.act];
      var dz = [];
      for (var i = 0; i < L.W.length; i++) {
        dz.push(da[i] * f.d(zs[l + 1][i], actsArr[l + 1][i]));
      }
      var aPrev = actsArr[l];
      var dW = [], db = dz.slice();
      for (var i2 = 0; i2 < L.W.length; i2++) {
        var row = [];
        for (var j = 0; j < aPrev.length; j++) row.push(dz[i2] * aPrev[j]);
        dW.push(row);
      }
      var daPrev = [];
      for (var j2 = 0; j2 < aPrev.length; j2++) {
        var s = 0;
        for (var i3 = 0; i3 < L.W.length; i3++) s += dz[i3] * L.W[i3][j2];
        daPrev.push(s);
      }
      grads[l] = { dW: dW, db: db };
      da = daPrev;
    }
    return { loss: loss, out: out, grads: grads, acts: actsArr, zs: zs };
  }

  function applyGrads(net, grads, lr) {
    for (var l = 0; l < net.layers.length; l++) {
      var L = net.layers[l], g = grads[l];
      for (var i = 0; i < L.W.length; i++) {
        for (var j = 0; j < L.W[i].length; j++) L.W[i][j] -= lr * g.dW[i][j];
        L.b[i] -= lr * g.db[i];
      }
    }
  }

  function setAct(net, layer, act) { net.layers[layer].act = act; }

  function clone(net) {
    return {
      shape: net.shape.slice(),
      acts: net.acts.slice(),
      layers: net.layers.map(function (L) {
        return {
          W: L.W.map(function (r) { return r.slice(); }),
          b: L.b.slice(),
          act: L.act
        };
      })
    };
  }

  function loss(net, x, y) {
    var out = forward(net, x).acts[net.layers.length][0];
    return 0.5 * (out - y) * (out - y);
  }

  return {
    ACTS: ACTS,
    create: create,
    forward: forward,
    backward: backward,
    applyGrads: applyGrads,
    setAct: setAct,
    clone: clone,
    loss: loss
  };
});
