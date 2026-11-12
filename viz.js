/* viz.js — 观测窗：网络图 + 损失曲线 */
window.Viz = (function () {
  var NS = 'http://www.w3.org/2000/svg';
  var XS = [34, 110, 186, 262];
  var COUNTS = [2, 3, 2, 1];
  var NAMES = ['输入', '一层', '二层', '三层'];
  var YS = [];

  var netEl, chartEl, edgeRefs = [], nodeRefs = [], valRefs = [];
  var built = false;

  (function layout() {
    var gap = [62, 58, 62, 0];
    for (var l = 0; l < 4; l++) {
      var arr = [], n = COUNTS[l], g = gap[l], start = 188 - (n - 1) * g / 2;
      for (var i = 0; i < n; i++) arr.push(start + i * g);
      YS.push(arr);
    }
  })();

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  function build(net) {
    netEl = document.getElementById('net');
    chartEl = document.getElementById('chart');
    clear(netEl);
    clear(chartEl);
    edgeRefs = []; nodeRefs = []; valRefs = [];

    var gEdges = el('g', {});
    var gNodes = el('g', {});
    var gLabels = el('g', {});
    netEl.appendChild(gEdges); netEl.appendChild(gNodes); netEl.appendChild(gLabels);

    // 层名
    for (var l = 0; l < 4; l++) {
      var t = el('text', { x: XS[l], y: 26, 'text-anchor': 'middle', class: 'lname' });
      t.textContent = NAMES[l];
      gLabels.appendChild(t);
    }

    // 边
    for (var l2 = 0; l2 < 3; l2++) {
      var grid = [];
      for (var i = 0; i < COUNTS[l2 + 1]; i++) {
        var row = [];
        for (var j = 0; j < COUNTS[l2]; j++) {
          var ln = el('line', {
            x1: XS[l2], y1: YS[l2][j], x2: XS[l2 + 1], y2: YS[l2 + 1][i],
            stroke: 'rgba(127,219,255,.3)', 'stroke-width': 1, 'stroke-opacity': .25, class: 'edge'
          });
          gEdges.appendChild(ln);
          row.push(ln);
        }
        grid.push(row);
      }
      edgeRefs.push(grid);
    }

    // 节点
    for (var l3 = 0; l3 < 4; l3++) {
      var nodes = [], vals = [];
      for (var k = 0; k < COUNTS[l3]; k++) {
        var c = el('circle', {
          cx: XS[l3], cy: YS[l3][k], r: 8,
          fill: 'rgba(20,30,50,.9)', stroke: 'rgba(150,190,240,.35)',
          'stroke-width': 1, class: 'node'
        });
        gNodes.appendChild(c); nodes.push(c);

        var v = el('text', {
          x: XS[l3], y: YS[l3][k] + 20, 'text-anchor': 'middle',
          class: 'nval', opacity: 0
        });
        gLabels.appendChild(v); vals.push(v);
      }
      nodeRefs.push(nodes); valRefs.push(vals);
    }
    built = true;
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  // acts: [输入, 一层, 二层, 三层]
  function update(net, acts, focus) {
    var l, i, j, v;

    for (l = 0; l < 3; l++) {
      var maxW = 0.001;
      for (i = 0; i < net.layers[l].W.length; i++)
        for (j = 0; j < net.layers[l].W[i].length; j++)
          maxW = Math.max(maxW, Math.abs(net.layers[l].W[i][j]));

      for (i = 0; i < edgeRefs[l].length; i++) {
        for (j = 0; j < edgeRefs[l][i].length; j++) {
          var w = net.layers[l].W[i][j];
          var a = Math.abs(w) / maxW;
          var e = edgeRefs[l][i][j];
          e.setAttribute('stroke-width', (0.5 + a * 2.6).toFixed(2));
          e.setAttribute('stroke-opacity', (0.06 + a * 0.42).toFixed(2));
          e.setAttribute('stroke', w >= 0 ? '#5fb8ff' : '#ff7a9c');
        }
      }
    }

    for (l = 0; l < 4; l++) {
      for (i = 0; i < nodeRefs[l].length; i++) {
        v = (acts && acts[l]) ? acts[l][i] : 0;
        var mag = clamp(Math.abs(v), 0, 1.4);
        var n = nodeRefs[l][i];
        n.setAttribute('r', (7.5 + mag * 2.6).toFixed(2));
        n.setAttribute('fill', v > 0.02
          ? 'rgba(64,150,230,' + (0.25 + mag * 0.55).toFixed(2) + ')'
          : v < -0.02
            ? 'rgba(220,80,120,' + (0.25 + mag * 0.55).toFixed(2) + ')'
            : 'rgba(16,24,40,.95)');
        n.setAttribute('stroke', focus === l
          ? 'rgba(190,235,255,.95)' : 'rgba(150,190,240,.3)');
        n.setAttribute('stroke-width', focus === l ? 1.6 : 1);

        var t = valRefs[l][i];
        t.textContent = (v >= 0 ? '' : '') + v.toFixed(2);
        t.setAttribute('opacity', focus === l ? 0.95 : 0.4);
      }
    }
  }

  function chart(hist) {
    if (!chartEl) chartEl = document.getElementById('chart');
    clear(chartEl);
    var W = 300, H = 90, pad = 8;
    // 网格
    for (var g = 0; g < 3; g++) {
      var y = pad + g * (H - 2 * pad) / 2;
      chartEl.appendChild(el('line', {
        x1: pad, y1: y, x2: W - pad, y2: y, class: 'grid'
      }));
    }
    if (!hist || hist.length === 0) return;

    var max = Math.max(0.9, Math.max.apply(null, hist)) * 1.06;
    var pts = hist.map(function (v, i) {
      var x = pad + (hist.length === 1 ? 0 : i * (W - 2 * pad) / (hist.length - 1));
      var yy = H - pad - (v / max) * (H - 2 * pad);
      return x.toFixed(1) + ',' + yy.toFixed(1);
    }).join(' ');

    chartEl.appendChild(el('polyline', { points: pts }));
    var last = hist[hist.length - 1];
    var lx = pad + (hist.length === 1 ? 0 : (W - 2 * pad));
    var ly = H - pad - (last / max) * (H - 2 * pad);
    chartEl.appendChild(el('circle', {
      cx: lx, cy: ly, r: 2.6, fill: '#9fe3ff'
    }));
  }

  function reset() {
    if (!built) return;
    chart([]);
  }

  return { build: build, update: update, chart: chart, reset: reset };
})();
