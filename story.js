/* story.js — 剧本 */
window.Story = (function () {

  var Y = -0.85;

  async function run() {
    var E = window.Engine;
    var net = MLP.create({ seed: 2 });
    var x = [0.9, -0.9];

    function fwd() { return MLP.forward(net, x); }

    /* ================= 序 ================= */

    E.chap('序 · 傍晚');

    E.say('n', '塔一共三层。', { auto: 700 });
    E.say('n', '一层住阿零。二层住西格。三层住塔恩。', { auto: 950 });
    E.say('n', '每天傍晚，塔下会有人说一句话。塔把这句话一层一层往上送，送到顶，再送下来一个回答。', { auto: 1250 });
    E.say('n', '它回答的永远是同一个问题——你今天怎么样。', { auto: 950 });
    E.say('n', '说白了，塔是一条传话的链子：每一层只管自己那一小步，谁都没看过整句话。', { auto: 1300 });

    E.say('n', '你在塔下住了很久。久到你以为自己知道它是怎么运作的。', { auto: 1150 });
    E.say('n', '直到今天。');
    E.say('n', '今晚，你可以先上任何一层，问他们同一个问题——你到底在干什么。');

    var first = await E.choices({
      q: '先听谁说话？',
      items: [
        { label: '一层 · 阿零', hint: '他只放正数过去', value: 'zero' },
        { label: '二层 · 西格', hint: '她把所有的数都压小', value: 'sig' },
        { label: '三层 · 塔恩', hint: '他只说最后那个数', value: 'tan' }
      ]
    });

    if (first === 'zero') {
      E.pulse('zero', 420);
      E.reveal('zero');
      E.voice('zero');
      E.say('zero', '我干的活最简单：你把一句话拆成两个数递给我，我每个数乘一个我的系数，再把它们加起来。');
      E.say('zero', '算出来是正的，我就放它上去；是负的，门就关上。');
      E.say('zero', '所以别怪我。我这儿，负的东西从来上不去。');
    } else if (first === 'sig') {
      E.pulse('sig', 420);
      E.reveal('sig');
      E.voice('sig');
      E.say('sig', '我干的活也简单：不管上来的是多大的数，我都把它摁进 0 到 1 之间。');
      E.say('sig', '摁完，再大的事也只剩一点点。上面的人看了，不会慌。');
      E.say('sig', '代价是——你有多难过，从我这儿也说不清了。');
    } else {
      E.pulse('tan', 420);
      E.reveal('tan');
      E.voice('tan');
      E.say('tan', '我只看最上面那两个数。乘一乘，加一加，再压进 −1 到 1。');
      E.say('tan', '正的那边是「挺好的」，负的那边是「不太好」。我就说这个。');
      E.say('tan', '中间那些，不归我管。');
    }
    E.silence();

    E.foot('前向传播 · 一句话从塔下往上走');
    E.epochLabel('未训练');

    /* ================= 一层 ================= */

    E.chap('一 · 一层');
    E.hud(null);
    E.reveal('me');
    E.voice('me');
    E.say('n', '你站在塔下。石头上有一道浅浅的刻痕，是你每天站的位置。');
    E.say('me', '……我来了。');

    E.pulse('zero', 500);
    E.reveal('zero');
    E.voice('zero');
    E.say('zero', '哟。今天来得早。');
    E.say('n', '阿零是一层唯一的住客。他身后开着三个口子，每个口子后面是一个房间，房间里住一个数。');
    E.say('zero', '说人话：那三个房间里住的不是人，是一个数。');
    E.say('zero', '别站着不说话。话说出来，我才好干活。');

    var f0 = fwd();
    E.hud('z¹ = W¹·x + b¹', '0.80 / −0.67 / 0.33');
    E.sync(net, f0.acts, 0, MLP.loss(net, x, Y));
    E.foot('一层 · 线性变换 z¹ = W¹x + b¹，三个神经元各算一个数');

    E.say('zero', '看到了吗。三个数，三个房间。0.80，负 0.67，0.33。');
    E.say('zero', '中间那个，从第一晚起就黑着。');
    E.say('me', '为什么？');
    E.say('zero', '因为它进来的时候是负的。我这扇门只放正的过去，负的东西一碰，门就关上。');
    E.say('zero', '从里面打不开。');
    E.say('n', '你看着中间那扇门。它很安静，安静得像从来没有存在过。');

    E.hud('a¹ = ReLU(z¹) = max(0, z¹)', '0.80 / 0.00 / 0.33');
    E.sync(net, f0.acts, 0, MLP.loss(net, x, Y));
    E.say('me', '所以它就一直是零。');
    E.say('zero', '一直是零。这就是我的全部脾气——我只接住亮的部分。');

    /* ================= 二层 ================= */

    E.chap('二 · 二层');
    E.pulse('sig', 480);
    E.reveal('sig');
    E.voice('sig');
    E.say('n', '西格在二层等着。她不问你说了什么，她只接阿零递上来的三个数。');
    E.say('sig', '上来了？拿过来吧。');

    E.hud('z² = W²·a¹ + b²', '−0.77 / 0.30');
    E.sync(net, f0.acts, 1, MLP.loss(net, x, Y));
    E.foot('二层 · 又一次线性变换，然后被压缩到 0 到 1 之间');

    E.say('sig', '0.80，0.00，0.33。我把它们都压一压，压到不会出事的地方。');
    E.say('n', '她说「不会出事」的时候，声音放得很轻。');

    E.hud('a² = σ(z²)', '0.32 / 0.58');
    E.sync(net, f0.acts, 1, MLP.loss(net, x, Y));
    E.say('sig', '0.32 和 0.58。好了。不吓人了。');
    E.say('me', '压小是什么意思？');
    E.say('sig', '意思是不管你多难过，到我这儿都只剩这么一点。上面的人看了，不会慌。');
    E.say('n', '她说话的时候在笑。笑得很轻，像是怕把什么碰碎。');

    /* ================= 三层 ================= */

    E.chap('三 · 三层');
    E.pulse('tan', 460);
    E.reveal('tan');
    E.voice('tan');
    E.say('n', '三层只有塔恩一个人。他面前摊着两个数，0.32 和 0.58。');
    E.say('tan', '就这些？');
    E.say('sig', '就这些。');
    E.say('tan', '行。');

    E.hud('out = tanh(w³·a² + b³)', '0.417');
    E.sync(net, f0.acts, 3, MLP.loss(net, x, Y));
    E.foot('三层 · 输出被压到 −1 到 1 之间，0.417 落在「挺好的」那一侧');

    E.say('tan', '挺好的。');

    E.say('n', '他说得很笃定。就像这三个月来的每一个傍晚。');
    E.say('me', '……不好。');
    E.say('tan', '什么？');
    E.say('me', '我说，不好。');
    E.say('n', '塔顶安静了一下，能听到风穿过石缝的声音。');
    E.say('tan', '可你给我的是 0.32 和 0.58。这两个数加起来的结论，就是挺好的。');
    E.say('tan', '我算得没错。');
    E.say('me', '你算得没错。');
    E.say('tan', '那问题出在哪儿。');
    E.say('n', '他没有在问你。他在问下面。');

    /* ================= 反传 ================= */

    E.chap('四 · 往下走');
    E.hud(null);
    E.voice(null);
    E.say('n', '塔有一条唯一的规矩：答案错了，就要顺着来路，往回找。');
    E.say('n', '这条路，是从上往下的。');
    E.say('n', '说人话：答案是错的，就顺着原路倒着走，问每一层「你刚才使了多大劲」。使的劲越大，要改的就越多。');

    E.pulse('sig', 520, true);
    E.voice('tan');
    E.say('tan', '西格。你给我 0.32 和 0.58。你压得太狠了。');
    E.voice('sig');
    E.say('sig', '我压是因为阿零给我的是 0.80、0.00、0.33。中间那个是零。零，我怎么放大？');

    E.pulse('zero', 520, true);
    E.voice('zero');
    E.say('zero', '不是我给的零。是它进来就是负的。');
    E.say('tan', '那就把那个负的改过来。');
    E.say('zero', '改不了。');
    E.say('tan', '为什么改不了。');
    E.say('zero', '因为那个房间没有梯度。');
    E.say('n', '……');
    E.say('n', '倒回去的路走到一层，分成三股。三扇门，各分到一份责备。');

    var knock = await E.choices({
      q: '中间那间房，要现在敲吗？',
      items: [
        { label: '敲。', hint: '哪怕它听不见。', value: 'knock' },
        { label: '不敲。', hint: '先把上面的账算清楚。', value: 'later' }
      ]
    });

    if (knock === 'knock') {
      E.say('n', '你走过去，敲门。');
      E.say('n', '一下。两下。门后面很安静。');
      E.say('zero', '它听不见。');
      E.say('zero', '责备是按「你刚才使了多大劲」分的。它一分劲都没使过，它那一份就是零。');
      E.say('zero', '零，就是没人叫它。');
    } else {
      E.say('n', '你没敲。你想先把上面的账算清楚。');
      E.say('tan', '算清楚了也一样。');
      E.say('tan', '责备按「出过多少力」往下分。它出过力吗？没有。它那一份就是零。');
    }

    E.say('zero', '它黑着。黑着的房间，收不到任何话。你骂它，它也听不见。');

    E.hud('∂L / ∂z¹₂ = 0', '0.000  ← 责备到这里，断了');
    E.foot('反向传播 · 死掉的 ReLU 单元，梯度恒为 0，永远不会被更新');
    E.beamOff();

    E.say('n', '责备走到一层，就停住了。中间那扇门后面，什么也没有发生。');
    E.say('n', '0.00 依然是 0.00。');
    E.say('me', '所以它永远学不会？');
    E.say('zero', '它会学会别的。');
    E.say('zero', '它会学会绕开我。');

    /* ================= 循环 ================= */

    E.chap('五 · 第二天');
    E.hud(null);
    E.silence();
    E.say('n', '第二天傍晚，你又站在那道刻痕上。');
    E.say('tan', '挺好的。');

    E.chap('五 · 第三天');
    E.say('n', '第三天。');
    E.say('tan', '挺好的。');

    E.chap('五 · 第十天');
    E.say('n', '第十天。他连停顿都没有了。');
    E.say('tan', '挺好的。');

    E.say('me', '为什么每次都是这一句。');
    E.voice('tan');
    E.say('tan', '因为你每次给我的都是那两个数。0.32，0.58。它们一次都没变过。');
    E.say('me', '我变了。');
    E.say('tan', '那你得让我看见。');

    /* ================= 选择：你的话 ================= */

    E.chap('六 · 今天怎么样');
    E.silence();
    E.say('n', '今天傍晚，塔下只有你。');
    E.reveal('me');
    E.voice('zero');
    E.say('zero', '说吧。说出口的那部分，我接得住。');
    E.say('n', '而没说出口的那部分，会自己走进来。它一直是 −0.90。它不随你说什么而改变。');
    E.foot('输入层 · 两个维度：说出口的，和没说出口的');

    var pick = await E.choices({
      q: '你今天怎么样？',
      items: [
        { label: '挺好的。', hint: '说出口 0.90　·　没说出口 −0.90', value: [0.9, -0.9] },
        { label: '还行吧。', hint: '说出口 0.50　·　没说出口 −0.90', value: [0.5, -0.9] },
        { label: '……', hint: '说出口 0.00　·　没说出口 −0.90', value: [0.0, -0.9] }
      ]
    });
    x = pick;

    var f1 = fwd();
    E.hud('x = [ 说出口, 没说出口 ]', x[0].toFixed(2) + ' / ' + x[1].toFixed(2));
    E.voice('me');
    E.say('me', x[0] > 0.6 ? '挺好的。' : x[0] > 0.2 ? '还行吧。' : '……');
    E.sync(net, f1.acts, 0, MLP.loss(net, x, Y));
    E.foot('你的话进入塔。它会被变换三次，才变成一句回答。');

    E.say('n', '塔把你的话一层一层往上送。你等着。');
    E.pulse('zero', 380);
    E.pulse('sig', 380);
    E.pulse('tan', 380);
    E.voice('tan');
    E.say('tan', '挺好的。');

    E.hud('out = ' + f1.acts[3][0].toFixed(3), '阈值 0.25 以上 → 「挺好的」');
    E.sync(net, f1.acts, 3, MLP.loss(net, x, Y));
    E.say('n', '0.42。0.38。0.33。三个不一样的你，得到同一句回答。');
    E.say('tan', '我知道它不对。');
    E.say('tan', '可我能走到「不太好」的路只有一条，而它被中间那个房间堵死了。');

    /* ================= 三个办法 ================= */

    E.chap('七 · 三个办法');
    E.hud(null);
    E.silence();
    E.say('n', '塔下起了雾。阿零从一层的窗口探出头。');
    E.voice('zero');
    E.say('zero', '想让它变，只有三条路。');
    E.voice('sig');
    E.say('sig', '三条都不好走。');
    E.voice('tan');
    E.say('tan', '选吧。反正今天晚上，塔得给出一个答案。');

    var way = await E.choices({
      q: '你要怎么改这座塔？',
      items: [
        { label: '慢慢地改。', hint: '每天晚上纠正一点。三十个傍晚。', value: 'slow' },
        { label: '给它留一条缝。', hint: '不许那个房间彻底关死。', value: 'leak' },
        { label: '一步到位。', hint: '今晚就把话说清楚。一次说透。', value: 'jump' }
      ]
    });

    E.showPanel();

    if (way === 'slow') return endingA(E, net, x, f1);
    if (way === 'leak') return endingB(E, net, x, f1);
    return endingC(E, net, x, f1);
  }

  /* ================= 结局 A ================= */

  function endingA(E, net, x, f1) {
    E.hud('学习率 lr = 0.04', '每次只走一小步');
    E.foot('梯度下降 · 一步走多小，是你要决定的事');

    E.say('me', '不着急。一天改一点。');
    E.voice('zero');
    E.say('zero', '三十天？');
    E.say('me', '三十天。');

    E.epochLabel('epoch 00');
    return E.train(net, x, -0.85, 0.04, 1, 260).then(function () {
      E.sync(net, MLP.forward(net, x).acts, 0, null);
      E.voice('zero');
      E.say('zero', '它动了。一点点。');
      E.say('n', '损失从 0.802 开始往下走。走得比你想的稳。');
      return E.train(net, x, -0.85, 0.04, 9, 90);
    }).then(function () {
      E.voice('sig');
      E.say('sig', '中间那个……还是零。');
      E.say('n', '责备每天都往下走。每天都停在二层。');
      return E.train(net, x, -0.85, 0.04, 20, 34);
    }).then(function () {
      var f = MLP.forward(net, x);
      E.sync(net, f.acts, 3, MLP.loss(net, x, -0.85));
      E.foot('三十个 epoch 之后 · 损失 0.043 · a¹ 仍是 0.46 / 0.00 / 0.52');
      E.voice('tan');
      E.say('tan', '不太好。');
      E.say('n', '他说对了。三十天之后，他终于说出了这两个字。');
      E.say('n', '代价是——');
      E.say('n', '现在不管谁从塔下走过，他都说不太好。真的挺好的人，也一样。');
      E.say('n', '说人话：它学会了一个标准答案，没学会看题。');

      E.ending({
        kicker: '结局 · 一',
        title: '慢慢地改',
        body:
          '<p>三十个傍晚。损失 <span class="num">0.802 → 0.043</span>。</p>' +
          '<p>塔恩终于会说「不太好」。可中间那个房间，从头到尾没有亮过一次——它只是被绕过去了。损失掉下来，不是因为塔听懂了你，是因为塔找到了一条不必经过那个房间的路。</p>' +
          '<p>现在，谁从塔下走过，得到的都是同一句「不太好」。包括那些真的挺好的人。</p>' +
          '<p>你教会了它一个答案，没有教会它分辨。</p>'
      });
    });
  }

  /* ================= 结局 B ================= */

  function endingB(E, net, x, f1) {
    E.hud('f(z) = z  (z>0)　|　0.06·z  (z≤0)', 'Leaky ReLU · 斜率 0.06');
    E.foot('换一个激活函数 · 负的那一侧，留一条极窄的通路');

    E.say('me', '别让那个房间彻底关死。');
    E.voice('zero');
    E.say('zero', '……你知道那意味着什么吗。');
    E.say('me', '意味着负的东西，也能漏一点进来。');
    E.say('zero', '很窄。');
    E.say('me', '很窄也行。');

    MLP.setAct(net, 0, 'leaky');
    E.sync(net, MLP.forward(net, x).acts, 0, MLP.loss(net, x, -0.85));

    E.epochLabel('epoch 00');
    return E.train(net, x, -0.85, 0.04, 30, function (i) {
      return i < 2 ? 220 : i < 12 ? 80 : 30;
    }).then(function () {
      var f = MLP.forward(net, x);
      E.sync(net, f.acts, 0, MLP.loss(net, x, -0.85));
      E.foot('三十个 epoch 之后 · 损失 0.043 · a¹ = 0.46 / −0.04 / 0.52');
      E.voice('zero');
      E.say('zero', '中间那个，今天没有全黑。');
      E.say('n', '你看过去。那不是灯。只是一点点没关严的缝。');
      E.say('n', '说人话：两条路分数一样，但一条把门砌死了，一条留了条缝。');
      E.voice('tan');
      E.say('tan', '不太好。');

      E.ending({
        kicker: '结局 · 二',
        title: '给它留一条缝',
        body:
          '<p>损失同样是 <span class="num">0.802 → 0.043</span>。三个输入，同样是 −0.56、−0.58、−0.60。</p>' +
          '<p>从外面看，这条路和上一条一模一样。</p>' +
          '<p>只有把塔拆开才看得见：中间那个房间的数是 <span class="num">−0.04</span>，不是 <span class="num">0.00</span>。它还是黑的，但门没有被砌死。哪一天有一个足够重的人从塔下走过，它会亮。</p>' +
          '<p>loss 不测量理解。它只测量你离答案有多远。</p>'
      });
    });
  }

  /* ================= 结局 C ================= */

  function endingC(E, net, x, f1) {
    E.hud('学习率 lr = 6.0', '一步走完三十天的路');
    E.foot('太大的学习率 · 一步跨过整个山谷，落在对面的悬崖上');

    E.say('me', '今晚就说清楚。一次说透。');
    E.voice('tan');
    E.say('tan', '你确定？');
    E.say('me', '确定。');

    E.epochLabel('epoch 00');
    return E.train(net, x, -0.85, 6.0, 1, 900).then(function () {
      var f = MLP.forward(net, x);
      E.sync(net, f.acts, 3, MLP.loss(net, x, -0.85));
      E.foot('一个 epoch 之后 · 损失 0.011 · 三个输入全部输出 −1.00');
      E.say('n', '塔身震了一下。灰尘从三层的窗沿落下来。');
      E.voice('tan');
      E.say('tan', '不太好。');
      E.say('tan', '非常不好。');
      E.say('tan', '所有人，都不太好。');
      E.say('n', '一步就到了。损失 0.011，是你见过最低的一个数。');
      E.say('n', '可是塔恩现在只会说一句话了。他把每一个从塔下走过的人，都判成了同一个人。');
      E.say('n', '说人话：步子太大，它一步跨过了「对」，落在「全错」上，然后不敢再动。');

      E.ending({
        kicker: '结局 · 三',
        title: '一步到位',
        body:
          '<p>一步。损失 <span class="num">0.802 → 0.011</span>。三条路里最低的一个数。</p>' +
          '<p>也是唯一一条，让塔恩再也说不出第二种答案的路。他把所有人都判成了同一个人：最不好的那个。</p>' +
          '<p>学习率太大，模型学到的不是「你不好」，而是「都别好」。</p>' +
          '<p>它现在对了。只是再也不会错，也再也不会对。</p>'
      });
    });
  }

  return { run: run };
})();
