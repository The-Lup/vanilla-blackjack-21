const blackjackModule = (() => {
  'use strict';
  let e = [],
    t = ['C', 'D', 'H', 'S'],
    l = ['A', 'J', 'Q', 'K'],
    s = [],
    n = document.querySelector('#btnHit'),
    a = document.querySelector('#btnStand'),
    r = document.querySelector('#btnNew'),
    d = [
      document.querySelector('#ply-cards'),
      document.querySelector('#comp-cards'),
    ],
    o = document.querySelectorAll('h2 small'),
    c = document.createElement('div');
  function i(e, t = 3e3) {
    (c.textContent = e),
      (c.style.opacity = '1'),
      (c.style.pointerEvents = 'auto'),
      setTimeout(() => {
        (c.style.opacity = '0'), (c.style.pointerEvents = 'none');
      }, t);
  }
  (c.id = 'game-message'), document.body.appendChild(c);
  let u = document.createElement('div');
  (u.id = 'deck-counter'),
    (u.innerHTML = `
    <div class="counter-container">
      <span class="counter-label">Cards left</span>
      <span class="counter-value">0</span>
    </div>
  `),
    document.body.appendChild(u);
  let $ = () => {
      let t = u.querySelector('.counter-value');
      t &&
        ((t.textContent = e.length),
        u.classList.remove('bg-low', 'bg-medium', 'bg-high'),
        e.length < 10
          ? u.classList.add('bg-low')
          : e.length < 20
          ? u.classList.add('bg-medium')
          : u.classList.add('bg-high'));
    },
    h = (e) => {
      let t = e.substring(0, e.length - 1);
      return isNaN(t) ? ('A' === t ? 11 : 10) : parseInt(t);
    },
    p = [[], []],
    b = () => {
      let e = [];
      for (let s = 2; s <= 10; s++) for (let n of t) e.push(s + n);
      for (let a of t) for (let r of l) e.push(r + a);
      return _.shuffle(e);
    },
    g = () => {
      if (0 === e.length) throw Error('No cards left in the deck.');
      let t = e.pop();
      return $(), t;
    },
    f = (e, t) => ((s[t] += h(e)), (o[t].innerText = s[t]), s[t]),
    y = (e, t) => {
      let l = document.createElement('img');
      (l.src = `./01-Blackjack/assets/cartas/${e}.png`),
        l.classList.add('cards'),
        d[t].appendChild(l);
    },
    m = () => {
      let [e, t] = s;
      setTimeout(() => {
        e > 21
          ? i('You busted! You lose \uD83D\uDE1E')
          : t > 21
          ? i('Computer busted! You win \uD83C\uDF89')
          : e === t
          ? i('Tie! \uD83E\uDD1D')
          : (e > t && e <= 21) || t > 21
          ? i('You won!!! \uD83C\uDF89')
          : i('You Lose!!! \uD83D\uDE22');
      }, 200);
    },
    v = (e) => {
      let t = 0;
      do {
        let l = g();
        p[1].push(l), y(l, 1), (t = f(l, 1));
      } while (t < e && e <= 21);
      m();
    },
    L = (t = 2) => {
      (s = []),
        (p = [[], []]),
        o.forEach((e) => (e.innerText = '0')),
        d.forEach((e) => (e.innerHTML = ''));
      for (let l = 0; l < t; l++) s.push(0), (p[l] = []);
      (e = b()),
        (n.disabled = !1),
        (a.disabled = !1),
        $(),
        console.clear(),
        console.log('New deck created:', e.length, 'cards');
    };
  return (
    n.addEventListener('click', () => {
      let e = g();
      p[0].push(e), y(e, 0);
      let t = f(e, 0);
      t > 21
        ? (console.warn('You Lose'), (n.disabled = !0), (a.disabled = !0), v(t))
        : 21 === t &&
          (console.warn('21, You Win!'),
          (n.disabled = !0),
          (a.disabled = !0),
          v(t));
    }),
    a.addEventListener('click', () => {
      (n.disabled = !0), (a.disabled = !0), v(s[0]);
    }),
    r.addEventListener('click', () => L()),
    L(),
    { newGame: L }
  );
})();
