/* ============ DATA ============ */
const pratos = [
  { name:"Salmão em Crosta de Ervas", badge:"Favorito dos Clientes", tag:"Salmão selvagem, molho beurre blanc, aneto",
    img:"https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=900&q=80", tempo:"25 min", porcao:"1 pessoa", picante:"Suave" },
  { name:"Costeleta de Porco Grelhada", badge:"Mais Pedido", tag:"Batata rústica, ervas frescas, jus de vinho tinto",
    img:"https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=900&q=80", tempo:"30 min", porcao:"1 pessoa", picante:"Médio" },
  { name:"Bife com Batata Frita Le Prestige", badge:"Favorito dos Clientes", tag:"Corte nobre maturado, batata artesanal, manteiga de ervas",
    img:"https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80", tempo:"35 min", porcao:"1 pessoa", picante:"Suave" },
  { name:"Tábua de Antepastos da Casa", badge:"Mais Pedido", tag:"Pão artesanal, azeitonas, tomate confitado, presunto",
    img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80", tempo:"15 min", porcao:"2 pessoas", picante:"Suave" },
  { name:"Tábua de Queijos Maturados", badge:"Favorito dos Clientes", tag:"Queijo azul, mel de castanheiro, nozes torradas",
    img:"https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=900&q=80", tempo:"10 min", porcao:"2 pessoas", picante:"Suave" },
  { name:"Café e Doce da Casa", badge:"Mais Pedido", tag:"Espresso artesanal, sobremesa de autor, canela",
    img:"https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80", tempo:"10 min", porcao:"1 pessoa", picante:"Suave" },
];

const experiencias = [
  { title:"Adega Privada", desc:"Uma seleção rara, provada à luz de velas.",
    img:"https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=1000&q=80" },
  { title:"Mesa do Chef", desc:"Assista à criação de cada prato de perto.",
    img:"https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=1000&q=80" },
  { title:"Terraço ao Anoitecer", desc:"Jantar sob o céu, entre âmbar e sombra.",
    img:"https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1000&q=80" },
  { title:"Sala de Charutos", desc:"Whisky envelhecido, couro escuro, silêncio.",
    img:"https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=1000&q=80" },
  { title:"Sommelier Dedicado", desc:"Um brinde perfeito para cada ocasião.",
    img:"https://images.unsplash.com/photo-1470158499416-75be9aa0c4db?auto=format&fit=crop&w=1000&q=80" },
];

const origens = [
  { cls:"j1", title:"Vinhas da Borgonha", desc:"Encostas de Pinot Noir sob a bruma da manhã, colhidas à mão.",
    img:"https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=800&q=80" },
  { cls:"j2", title:"Colinas da Toscana", desc:"Fileiras douradas de videiras que se estendem até ao horizonte, berço dos nossos tintos de reserva.",
    img:"https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80" },
  { cls:"j3", title:"Vale do Douro", desc:"Uvas escuras e taninos profundos, herdados de gerações de vinicultores.",
    img:"https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=1000&q=80" },
  { cls:"j4", title:"Altos da Colômbia", desc:"Grãos de café colhidos ao nascer do sol, torrados à nossa medida.",
    img:"https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1000&q=80" },
  { cls:"j5", title:"Queijaria Alpina", desc:"Caves frias e maturação lenta, herança de mestres queijeiros.",
    img:"https://images.unsplash.com/photo-1452195100486-9cc805987862?auto=format&fit=crop&w=800&q=80" },
  { cls:"j6", title:"Mercado Mediterrânico", desc:"Azeite, tomate e ervas colhidos ao sol do Mediterrâneo.",
    img:"https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80" },
  { cls:"j7", title:"Floresta de Trufas", desc:"Trufa negra desenterrada em bosques de carvalho ao amanhecer.",
    img:"https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80" },
];

/* ============ ICONS ============ */
const icons = {
  tempo:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
  porcao:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M17 8a3 3 0 1 0 0-6M21 20c0-2.8-1.9-5.1-4.5-5.8"/></svg>',
  picante:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2c-1 3-4 4-4 8a4 4 0 0 0 8 0c0-1.3-.5-2-1-2.7"/></svg>',
};

/* ============ RENDER ============ */
function renderPratos(){
  document.getElementById("pratosGrid").innerHTML = pratos.map(p=>`
    <article class="room reveal">
      <div class="room__media">
        <span class="badge room__badge">${p.badge}</span>
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
      </div>
      <h3 class="room__name">${p.name}</h3>
      <p class="room__tag">${p.tag}</p>
      <div class="room__stats">
        <span class="room__stat">${icons.tempo}${p.tempo}</span>
        <span class="room__stat">${icons.porcao}${p.porcao}</span>
        <span class="room__stat">${icons.picante}${p.picante}</span>
      </div>
    </article>`).join("");
}
function renderExperiencias(){
  document.getElementById("carTrack").innerHTML = experiencias.map(a=>`
    <div class="amenity">
      <img src="${a.img}" alt="${a.title}" loading="lazy" />
      <div class="amenity__scrim"></div>
      <div class="amenity__label"><h3>${a.title}</h3><p>${a.desc}</p></div>
    </div>`).join("");
}
function renderOrigens(){
  document.getElementById("bento").innerHTML = origens.map(j=>`
    <article class="journey ${j.cls}">
      <img src="${j.img}" alt="${j.title}" loading="lazy" />
      <div class="journey__grad"></div>
      <div class="journey__panel"><h3>${j.title}</h3><p>${j.desc}</p></div>
    </article>`).join("");
}

/* ============ MENU OVERLAY ============ */
function initMenu(){
  const btn = document.getElementById("hamburger");
  const overlay = document.getElementById("overlay");
  const toggle = (open)=>{
    document.body.classList.toggle("menu-open", open);
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", open?"Fechar menu":"Abrir menu");
    overlay.setAttribute("aria-hidden", !open);
  };
  btn.addEventListener("click", ()=>toggle(!document.body.classList.contains("menu-open")));
  overlay.querySelectorAll("[data-close]").forEach(a=>a.addEventListener("click", ()=>toggle(false)));
  document.addEventListener("keydown", e=>{ if(e.key==="Escape") toggle(false); });
}

/* ============ SCROLL REVEAL + WORD STAGGER ============ */
function splitWords(){
  document.querySelectorAll("[data-split]").forEach(el=>{
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w=>`<span class="word">${w}</span>`).join(" ");
  });
}
function initReveal(){
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add("in");
      const words = el.querySelectorAll(".word");
      words.forEach((w,i)=> w.style.transitionDelay = (i*45)+"ms");
      requestAnimationFrame(()=> words.forEach(w=>w.classList.add("in")));
      io.unobserve(el);
    });
  }, { threshold:.18, rootMargin:"0px 0px -8% 0px" });
  document.querySelectorAll(".reveal, [data-split]").forEach(el=>io.observe(el));
}

/* ============ CAROUSEL ============ */
function initCarousel(){
  const track = document.getElementById("carTrack");
  const thumb = document.getElementById("carThumb");
  const prev = document.getElementById("carPrev");
  const next = document.getElementById("carNext");
  const carousel = track.parentElement;
  let index = 0;

  const step = ()=>{
    const card = track.querySelector(".amenity");
    if(!card) return 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return card.offsetWidth + gap;
  };
  const maxIndex = ()=>{
    const visible = Math.max(1, Math.round(carousel.offsetWidth / step()));
    return Math.max(0, experiencias.length - visible);
  };
  const update = ()=>{
    const mi = maxIndex();
    index = Math.min(index, mi);
    track.style.transform = `translateX(${-index*step()}px)`;
    const thumbW = 100 / (mi + 1);
    thumb.style.width = thumbW + "%";
    thumb.style.transform = `translateX(${index*100}%)`;
    prev.disabled = index<=0;
    next.disabled = index>=mi;
  };
  prev.addEventListener("click", ()=>{ index--; update(); });
  next.addEventListener("click", ()=>{ index++; update(); });

  let startX=0, dragging=false;
  carousel.addEventListener("pointerdown", e=>{ dragging=true; startX=e.clientX; carousel.classList.add("dragging"); });
  window.addEventListener("pointerup", e=>{
    if(!dragging) return; dragging=false; carousel.classList.remove("dragging");
    const dx = e.clientX - startX;
    if(dx < -60 && index<maxIndex()){ index++; update(); }
    else if(dx > 60 && index>0){ index--; update(); }
  });
  window.addEventListener("resize", update);
  update();
}

/* ============ FORM ============ */
function initForm(){
  const form = document.getElementById("bookingForm");
  form.addEventListener("submit", e=>{
    e.preventDefault();
    if(!form.checkValidity()){ form.reportValidity(); return; }
    document.getElementById("formNote").hidden = false;
    form.reset();
  });
}

/* ============ INIT ============ */
document.addEventListener("DOMContentLoaded", ()=>{
  renderPratos();
  renderExperiencias();
  renderOrigens();
  splitWords();
  initMenu();
  initReveal();
  initCarousel();
  initForm();
});
