/* =========================================================================
   Edu Coffee — camada de interação
   Imagens gratuitas do Unsplash (licença Unsplash) na paleta quente do café.
   ========================================================================= */

/* -- Mapa central de imagens. CDN do Unsplash, recorte + compressão por URL. -- */
const U = (id, w = 800, h = 1000) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70&h=${h}`;

const IMAGES = {
  store:     U('1554118811-1e0d58224f24', 1400, 700),  // interior acolhedor de café
  americano: U('1510707577719-ae7c14805e3a', 400, 320),
  latte:     U('1541167760496-1628856ab772', 400, 320),
  event1:    U('1521017432531-fbd92d768814', 800, 600), // pessoas no café
  event2:    U('1442512595331-e89e73853f31', 800, 600), // catering / mesa de pastelaria
  event3:    U('1495474472287-4d71bcdd2085', 800, 600), // barista a preparar bebida
};

/* -- Os 12 itens do menu (alinhados com a lista original) -- */
const MENU = [
  { name: 'Espresso',                        cat: 'hot',    id: '1510591509098-f4fdc6d0ff04' },
  { name: 'Latte',                           cat: 'hot',    id: '1509042239860-f550ce710b93' },
  { name: 'Latte Gelado',                    cat: 'cold',   id: '1461023058943-07fcbe16d735' },
  { name: 'Cappuccino',                      cat: 'hot',    id: '1572442388796-11668a67e53d' },
  { name: 'Mocha',                           cat: 'hot',    id: '1578374173705-969cbe6f2d6b' },
  { name: 'Flat White Gelado',               cat: 'cold',   id: '1517701550927-30cf4ba1dba5' },
  { name: 'Chai Latte',                      cat: 'hot',    id: '1519082274554-1ca37fb8abb7' },
  { name: 'Cold Brew',                       cat: 'cold',   id: '1517705008128-361805f42e86' },
  { name: 'Croissant',                       cat: 'pastry', id: '1555507036-ab1f4038808a' },
  { name: 'Bolacha de Pepitas de Chocolate', cat: 'pastry', id: '1499636136210-6f4ee915583e' },
  { name: 'Americano Gelado',                cat: 'cold',   id: '1447933601403-0c6688de566e' },
  { name: 'Rolo de Canela',                  cat: 'pastry', id: '1509365465985-25d11c17e812' },
];

/* -- Resolver os placeholders data-src no markup estático -- */
document.querySelectorAll('[data-src]').forEach((el) => {
  const key = el.dataset.src;
  if (IMAGES[key]) el.src = IMAGES[key];
  el.loading = 'lazy';
});

/* -- Construir a grelha do menu -- */
const grid = document.getElementById('menuGrid');
grid.innerHTML = MENU.map((m) => `
  <article class="mcard reveal" data-cat="${m.cat}">
    <img src="${U(m.id, 600, 800)}" alt="${m.name}" loading="lazy" />
    <div class="mcard__label glass">${m.name}</div>
  </article>`).join('');

/* -- Filtragem do menu -- */
const filters = document.getElementById('filters');
filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter');
  if (!btn) return;
  const cat = btn.dataset.filter;

  filters.querySelectorAll('.filter').forEach((f) => {
    const active = f === btn;
    f.setAttribute('aria-pressed', active);
    f.classList.toggle('glass', !active);
  });

  grid.querySelectorAll('.mcard').forEach((card) => {
    card.classList.toggle('is-hidden', cat !== 'all' && card.dataset.cat !== cat);
  });
});

/* -- Revelação com desfoque ao entrar no ecrã (fade + de-blur + subida) -- */
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('in');
      io.unobserve(en.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal:not(.in)').forEach((el) => io.observe(el));

/* -- Menu hambúrguer → sobreposição de ecrã inteiro -- */
const hamb = document.getElementById('hamb');
const overlay = document.getElementById('overlay');
const setMenu = (open) => {
  overlay.classList.toggle('is-open', open);
  overlay.setAttribute('aria-hidden', !open);
  hamb.setAttribute('aria-expanded', open);
  hamb.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  hamb.innerHTML = open
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>`;
  document.body.style.overflow = open ? 'hidden' : '';
};
hamb.addEventListener('click', () => setMenu(!overlay.classList.contains('is-open')));
overlay.querySelectorAll('[data-close]').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

/* -- Nitidez por proximidade do cursor no título "mood" + rasto de café -- */
const moodTitle = document.getElementById('moodTitle');
const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
let mouseX = innerWidth / 2, mouseY = innerHeight / 2, moving = 0;

if (canHover) {
  const trailSrcs = [IMAGES.americano, IMAGES.latte, U(MENU[4].id, 120, 120)];
  const trails = trailSrcs.map((src) => {
    const img = document.createElement('img');
    img.className = 'trail';
    img.src = src;
    img.alt = '';
    document.body.appendChild(img);
    return { el: img, x: innerWidth / 2, y: innerHeight / 2 };
  });

  window.addEventListener('pointermove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY; moving = 1;
  });
  window.addEventListener('pointerleave', () => { moving = 0; });

  (function trailLoop() {
    trails.forEach((t, i) => {
      const ease = 0.18 - i * 0.045;
      t.x += (mouseX - t.x) * ease;
      t.y += (mouseY - t.y) * ease;
      t.el.style.opacity = moving ? (0.9 - i * 0.25) : 0;
      t.el.style.transform =
        `translate(${t.x}px, ${t.y}px) translate(-50%,-50%) scale(${moving ? 1 - i * 0.12 : 0.4}) rotate(${i * 8 - 8}deg)`;
    });
    requestAnimationFrame(trailLoop);
  })();
} else {
  // Sem rato (toque): o título nunca fica desfocado
  moodTitle.style.filter = 'none';
}

/* -- Parallax de scroll para a montra do hero -- */
const parallax = [...document.querySelectorAll('.parallax')];
let ticking = false;
const applyParallax = () => {
  const y = window.scrollY;
  parallax.forEach((el) => {
    const s = parseFloat(el.dataset.speed) || 0;
    el.style.translate = `0 ${y * s}px`;
  });
  ticking = false;
};
window.addEventListener('scroll', () => {
  if (!ticking) { requestAnimationFrame(applyParallax); ticking = true; }
}, { passive: true });
applyParallax();
