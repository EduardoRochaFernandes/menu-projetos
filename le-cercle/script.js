/* =====================================================================
   MONRION IMOBILIÁRIA — interacções
   · preloader · nav · overlay do menu · botões letra-a-letra
   · reveal por scroll · frase que se preenche
   · HERO: vídeo controlado por scroll (scroll-scrubbing) + fallback móvel
   · CARTAS: vídeo no hover + preço/localização, restantes a cinzento
   ===================================================================== */
(function () {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  // Progressive enhancement: só escondemos conteúdo se o JS correr.
  document.documentElement.classList.remove("no-js");
  document.documentElement.classList.add("js");

  /* ╔══════════════════════════════════════════════════════════════════╗
     ║  CONFIGURAÇÃO DO SCROLL-SCRUBBING DO HERO — afina tudo aqui       ║
     ╠══════════════════════════════════════════════════════════════════╣
     ║  SMOOTHING  → fator de interpolação (lerp) por frame.            ║
     ║               Baixo (0.06) = movimento lento/cinematográfico;    ║
     ║               alto (0.2) = mais reativo. Recomendado: 0.08–0.12.  ║
     ║  MAX_STEP   → avanço MÁXIMO de currentTime por frame, em segundos.║
     ║               É o "clamp" de velocidade: por mais rápido que se   ║
     ║               faça scroll, o vídeo nunca salta mais do que isto — ║
     ║               é o que impede o salto brusco início→fim.           ║
     ║  SENSITIVITY→ quão "longe" o vídeo avança por unidade de scroll.  ║
     ║               1.0 = o vídeo inteiro cabe exatamente na secção.    ║
     ║  SCROLL_LEN → altura da secção de scroll em múltiplos da viewport ║
     ║               (3.2 = 320vh). Mais alto = scrubbing mais gradual.  ║
     ║  SEEK_THRESHOLD → só faz seek se a diferença for maior que isto,  ║
     ║               evitando seeks redundantes que "engasgam" o vídeo.  ║
     ╚══════════════════════════════════════════════════════════════════╝ */
  const HERO = {
    smoothing:     0.10,
    maxStep:       0.20,
    sensitivity:   1.00,
    scrollLength:  3.2,
    seekThreshold: 0.010
  };

  /* --------------------------------------------------------------- NAV --- */
  // O nav só ganha fundo branco quando o hero fica para trás — ou seja,
  // quando o vídeo termina de fazer scrub / entra a secção seguinte. Enquanto
  // o vídeo está atrás do nav, este mantém-se transparente (logótipo branco).
  const nav = $("#nav");
  const navHero = $("#heroScroll");
  const onNavScroll = () => {
    const solid = navHero
      ? navHero.getBoundingClientRect().bottom <= nav.offsetHeight
      : window.scrollY > 40;
    nav.classList.toggle("is-scrolled", solid);
  };
  onNavScroll();
  window.addEventListener("scroll", onNavScroll, { passive: true });
  window.addEventListener("resize", onNavScroll);

  /* ------------------------------------------------------- MENU OVERLAY -- */
  const hamb = $("#hamb");
  const overlay = $("#overlay");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    hamb.setAttribute("aria-expanded", String(open));
    overlay.setAttribute("aria-hidden", String(!open));
  };
  hamb.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $$("[data-close]", overlay).forEach((a) => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* -------------------------------------------- BOTÕES LETRA-A-LETRA ----- */
  $$("[data-letters]").forEach((btn) => {
    const text = btn.textContent.trim();
    const label = document.createElement("span");
    label.className = "btn__label";
    text.split("").forEach((ch, i) => {
      const s = document.createElement("span");
      s.className = "ltr";
      s.style.setProperty("--i", i);
      s.textContent = ch === " " ? " " : ch;
      label.appendChild(s);
    });
    btn.textContent = "";
    btn.appendChild(label);
  });

  /* --------------------------- TÍTULOS EM CASCATA (palavra a palavra) ---- */
  $$("[data-stagger]").forEach((el) => {
    el.innerHTML = el.textContent.trim().split(/\s+/)
      .map((w, i) => `<span class="word" style="transition-delay:${i * 0.08}s">${w}</span>`)
      .join(" ");
  });

  /* ------------------------------------------------ REVEAL AO SCROLL ----- */
  let revealEls = $$("[data-reveal]").concat($$("[data-stagger]"));
  const revealPass = () => {
    const trigger = window.innerHeight * 0.9;
    revealEls = revealEls.filter((el) => {
      if (el.getBoundingClientRect().top < trigger) { el.classList.add("is-in"); return false; }
      return true;
    });
  };
  let revTick = false;
  const onReveal = () => {
    if (revTick) return;
    revTick = true;
    requestAnimationFrame(() => { revealPass(); revTick = false; });
  };
  window.addEventListener("scroll", onReveal, { passive: true });
  window.addEventListener("resize", onReveal);
  setTimeout(() => revealEls.forEach((el) => el.classList.add("is-in")), 4000); // failsafe

  /* ------------- FRASE-DECLARAÇÃO: preenche de cinza a carvão no scroll -- */
  const sr = $("[data-scroll-reveal]");
  let paint = () => {};
  if (sr) {
    const words = sr.textContent.trim().split(/\s+/);
    sr.innerHTML = words.map((w) => `<span class="word">${w}</span>`).join(" ");
    const spans = $$(".word", sr);
    spans.forEach((s) => (s.style.color = "rgba(26,26,26,0.16)"));
    paint = () => {
      const r = sr.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85, end = vh * 0.35;
      let p = clamp((start - r.top) / (start - end), 0, 1);
      const active = p * spans.length;
      spans.forEach((s, i) => {
        const local = clamp(active - i, 0, 1);
        s.style.color = `rgba(26,26,26,${(0.16 + local * 0.84).toFixed(3)})`;
      });
    };
    window.addEventListener("scroll", paint, { passive: true });
    window.addEventListener("resize", paint);
  }

  /* ╔══════════════════════════════════════════════════════════════════╗
     ║  HERO — VÍDEO CONTROLADO PELO SCROLL (scroll-scrubbing)           ║
     ║                                                                   ║
     ║  Biblioteca recomendada: JS PURO (sem dependências).             ║
     ║  Porquê: o "scrubbing" resume-se a mapear o progresso do scroll  ║
     ║  para video.currentTime dentro de um requestAnimationFrame, com  ║
     ║  interpolação (lerp) e limites (clamp). O GSAP + ScrollTrigger    ║
     ║  faz o mesmo internamente e traz ~30 KB de dependência que aqui  ║
     ║  não acrescenta nada — só valeria a pena para timelines/pinning  ║
     ║  complexos ou sincronização multi-elemento. Mantemos leve.       ║
     ╚══════════════════════════════════════════════════════════════════╝ */
  const heroScroll = $("#heroScroll");
  const heroEl = $("#top");
  const video = $("#heroVideo");

  if (video && heroScroll) {
    // Define a altura da secção de scroll a partir da config.
    heroScroll.style.setProperty("--hero-scroll-length", (HERO.scrollLength * 100) + "vh");

    // Sem poster: força a pintura da 1.ª frame do vídeo assim que houver dados,
    // para que ao entrar se veja logo o vídeo (frame 0) e não uma imagem fixa.
    const paintFirstFrame = () => {
      try { if (video.currentTime < 0.001) video.currentTime = 0.001; } catch (e) {}
    };
    if (video.readyState >= 2) paintFirstFrame();
    else video.addEventListener("loadeddata", paintFirstFrame, { once: true });

    // Estado partilhado + handles para limpar listeners/loop no fim.
    let rafId = 0, scrubbing = false, fellBack = false;

    /* -------- FALLBACK: autoplay muted loop (toque, ecrã pequeno, etc.) ---- */
    const enableFallback = () => {
      if (fellBack) return;
      fellBack = true;
      scrubbing = false;
      if (rafId) cancelAnimationFrame(rafId);
      heroEl.classList.add("is-fallback");
      heroScroll.style.setProperty("--hero-scroll-length", "100svh");
      video.loop = true;
      video.muted = true;
      video.setAttribute("autoplay", "");
      const pr = video.play();
      if (pr && pr.catch) pr.catch(() => {});
    };

    // Em toque/telemóvel/menos-movimento o scrubbing de currentTime é pouco
    // fiável → cai já para o fallback.
    const coarse = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    const small  = window.matchMedia("(max-width: 768px)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (coarse || small || reduce) {
      enableFallback();
    } else {
      let duration = 0;                 // duração REAL do vídeo (só usada depois de válida)
      let current  = 0;                 // currentTimeSmoothed — o valor aplicado ao vídeo
      let target   = 0;                 // targetTime — vem diretamente do progresso do scroll

      /* Progresso do scroll (0→1) dentro da secção do hero → targetTime.
         getBoundingClientRect + normalização + clamp; protegido contra /0. */
      const computeTarget = () => {
        const scrollable = heroScroll.offsetHeight - window.innerHeight;
        if (scrollable <= 0) { target = 0; return; }           // guarda: evita divisão por zero
        const passed = -heroScroll.getBoundingClientRect().top; // px já percorridos na secção
        const progress = clamp(passed / scrollable, 0, 1);      // SEMPRE em [0, 1]
        target = clamp(progress * HERO.sensitivity, 0, 1) * duration; // e o alvo em [0, duration]
      };

      /* Ciclo de animação — corre dentro de requestAnimationFrame (nunca no
         evento de scroll) para ser fluido e não sobrecarregar o browser. */
      const loop = () => {
        computeTarget();

        // 1) Interpolação suave (lerp): aproxima current do target.
        let next = current + (target - current) * HERO.smoothing;

        // 2) Clamp de velocidade: limita o avanço por frame a ±MAX_STEP.
        //    (É isto que torna o scroll rápido "comedido" e mata o salto brusco.)
        const stepped = clamp(next - current, -HERO.maxStep, HERO.maxStep);
        current = clamp(current + stepped, 0, Math.max(0, duration - 0.04));

        // 3) Só faz seek se: houver diferença relevante, não estiver já a fazer
        //    seek, e o vídeo for realmente seekable naquele instante.
        const seekable = video.seekable && video.seekable.length > 0;
        if (seekable && !video.seeking &&
            Math.abs(video.currentTime - current) > HERO.seekThreshold) {
          try { video.currentTime = current; } catch (e) { /* ignora seeks inválidos */ }
        }
        rafId = requestAnimationFrame(loop);
      };

      /* Só arranca quando a duração for um número FINITO e POSITIVO.
         É a causa nº1 do salto início→fim: se duration vier NaN/0/Infinity
         durante o carregamento, o mapeamento dá disparates. Aqui nunca
         calculamos nada enquanto isso não estiver garantido. */
      const tryStart = () => {
        if (scrubbing || fellBack) return;
        const d = video.duration;
        if (!isFinite(d) || d <= 0) return;   // ainda não pronto — não faz nada
        duration = d;
        scrubbing = true;
        video.pause();                        // garante que fica pausado (frame-a-frame)
        rafId = requestAnimationFrame(loop);
      };

      // Espera pelos metadados (duração) e por poder reproduzir (seekable).
      if (video.readyState >= 1) tryStart();
      video.addEventListener("loadedmetadata", tryStart);
      video.addEventListener("canplay", tryStart);
      video.addEventListener("canplaythrough", tryStart);

      // Se a duração não ficar válida a tempo, cai para autoplay em loop.
      setTimeout(() => { if (!scrubbing) enableFallback(); }, 6000);
    }

    /* Limpeza: para o loop e liberta o vídeo ao sair da página. */
    window.addEventListener("pagehide", () => {
      if (rafId) cancelAnimationFrame(rafId);
    }, { once: true });
  }

  /* ╔══════════════════════════════════════════════════════════════════╗
     ║  CARTAS — vídeo no hover (as restantes ficam a cinzento via CSS) ║
     ╚══════════════════════════════════════════════════════════════════╝ */
  if (window.matchMedia("(hover: hover)").matches) {
    $$(".card").forEach((card) => {
      const v = $(".card__video", card);
      const src = card.getAttribute("data-video");
      if (!v || !src) return;
      let loaded = false;
      card.addEventListener("mouseenter", () => {
        if (!loaded) { v.src = src; loaded = true; }   // carrega o vídeo só no 1.º hover
        try { v.currentTime = 0; } catch (e) {}
        const pr = v.play(); if (pr && pr.catch) pr.catch(() => {});
      });
      card.addEventListener("mouseleave", () => { v.pause(); });
    });
  }

  /* ----------------------------------------------- FORM (demo) ---------- */
  const form = $(".form");
  if (form) form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = $(".btn--send", form);
    btn.innerHTML = '<span class="btn__label">Mensagem Enviada ✓</span>';
    btn.style.background = "var(--accent)";
    btn.style.color = "var(--fg)";
    form.reset();
  });

  /* ------------------------------------------------------------- BOOT --- */
  // Sem preloader: revela o conteúdo imediatamente e repete quando a página
  // termina de carregar (por causa de imagens/vídeo que mudam a geometria).
  const boot = () => { revealPass(); paint(); };
  window.addEventListener("load", boot);
  boot();
})();
