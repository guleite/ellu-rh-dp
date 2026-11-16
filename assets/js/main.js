/* =========================================================
   ELLÜ PERFORMANCE — scripts compartilhados
   - header, menu mobile, animações de entrada
   - botão flutuante de WhatsApp
   - popup de qualificação (todo contato passa por ele)
   ========================================================= */

// Número da Ellu no formato internacional, só dígitos (trocar antes de publicar)
const ELLU_WHATSAPP = "5500000000000";

const ICON = {
  arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="10" width="16" height="11" rx="3"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>',
  wa: '<svg viewBox="0 0 32 32" fill="currentColor"><path d="M16.04 3C9.4 3 4 8.4 4 15.04c0 2.12.55 4.19 1.6 6.02L4 29l8.13-1.56a12 12 0 0 0 3.9.65h.01C22.67 28.09 28 22.7 28 16.06 28 9.4 22.68 3 16.04 3Zm0 22.9h-.01a9.9 9.9 0 0 1-5.06-1.39l-.36-.21-4.83.93.95-4.7-.24-.38a9.86 9.86 0 0 1-1.52-5.1c0-5.47 4.46-9.93 9.94-9.93 5.47 0 9.92 4.46 9.92 9.94 0 5.48-4.45 9.94-9.79 9.94Zm5.45-7.43c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48a9 9 0 0 1-1.66-2.06c-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.63-.93-2.24-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.1 3.2 5.08 4.49.71.3 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z"/></svg>',
};

/* ---------- Header / menu / reveal ---------- */
(function ui() {
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-solid", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open);
      document.body.classList.toggle("modal-open", open);
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.classList.remove("is-open");
        document.body.classList.remove("modal-open");
      })
    );
  }

  // Submenu (Testes Comportamentais): clique abre/fecha; clique fora ou Esc fecha
  const drops = document.querySelectorAll(".nav-drop");
  const closeDrop = (d) => { d.classList.remove("is-open"); d.querySelector(".nav-drop__btn").setAttribute("aria-expanded", "false"); };
  drops.forEach((d) => {
    const btn = d.querySelector(".nav-drop__btn");
    btn.addEventListener("click", () => {
      const open = d.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
    });
  });
  document.addEventListener("click", (e) => drops.forEach((d) => { if (!d.contains(e.target)) closeDrop(d); }));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") drops.forEach(closeDrop); });

  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();

/* =========================================================
   Popup de qualificação
   ========================================================= */
const Qualify = (function () {
  const PAINS = {
    "Equipe desengajada": "Engajamento raramente é falta de vontade. Quase sempre é falta de clareza, reconhecimento e uma liderança próxima — e isso se trabalha.",
    "Líderes que não sabem liderar": "Muitos líderes foram promovidos por serem ótimos tecnicamente e nunca foram preparados para liderar pessoas. Não é culpa deles — é um gap de formação.",
    "Conflitos e falhas de comunicação": "Conflito mal resolvido vira custo invisível: retrabalho, ruído e gente boa pedindo pra sair. Entender perfis comportamentais muda o jogo.",
    "Rotatividade alta (turnover)": "Cada saída leva junto conhecimento, tempo e dinheiro. Dá para estancar — começando por entender por que as pessoas vão embora.",
    "Contratações que não dão certo": "Contratar pelo currículo e desligar pelo comportamento é um padrão comum. A análise comportamental entra justamente aqui.",
    "A empresa cresceu, a gestão de pessoas não": "Crescimento sem estrutura de pessoas cobra a conta rápido. É hora de desenhar papéis, rituais e lideranças para o próximo nível.",
    "Folha, eSocial e rotinas de DP no improviso": "Um erro pequeno na folha ou no eSocial hoje pode virar multa ou passivo trabalhista amanhã. Com processo e calendário organizados, o DP deixa de ser preocupação.",
  };

  const steps = [
    {
      id: "nome", type: "text", kicker: "Vamos nos conhecer",
      title: "Antes de tudo: como podemos te chamar?",
      hint: "Prometemos: são só 6 perguntinhas rápidas e você sai daqui com um primeiro diagnóstico.",
      placeholder: "Seu nome",
    },
    {
      id: "papel", type: "single", kicker: "Seu lugar no jogo",
      title: "Prazer, {nome}! Qual cadeira você ocupa hoje?",
      hint: "Isso ajuda a gente a falar a sua língua.",
      options: [
        { v: "Sou dono(a) / sócio(a)", em: "🚀" },
        { v: "Sou líder / gestor(a) de equipe", em: "🧭" },
        { v: "Trabalho no RH / DP / Gente & Gestão", em: "🤝" },
        { v: "Quero me desenvolver como profissional", em: "🌱" },
      ],
    },
    {
      id: "time", type: "single", layout: "two", kicker: "Tamanho do desafio",
      title: "Quantas pessoas estão envolvidas nessa história?",
      hint: "Conte o time ou a empresa — o que fizer mais sentido.",
      options: [
        { v: "Até 10 pessoas", k: "1–10" },
        { v: "De 11 a 50 pessoas", k: "11+" },
        { v: "De 51 a 200 pessoas", k: "51+" },
        { v: "Mais de 200 pessoas", k: "200+" },
      ],
    },
    {
      id: "dor", type: "single", kicker: "A pergunta de ouro",
      title: "Se a gente pudesse resolver UMA coisa amanhã, qual seria?",
      hint: "Escolha a que mais tira seu sono hoje.",
      insight: true,
      options: Object.keys(PAINS).map((v, i) => ({ v, em: ["😶‍🌫️", "🧩", "⚡", "🚪", "🎯", "📈", "📋"][i] })),
    },
    {
      id: "urgencia", type: "heat", kicker: "Termômetro",
      title: "E quão quente está essa situação?",
      hint: "Sem resposta certa — só queremos priorizar do jeito certo.",
      options: [
        { v: "Pra ontem", em: "🔥", s: "Já está doendo" },
        { v: "Próximos 3 meses", em: "🌡️", s: "Está no radar" },
        { v: "Só pesquisando", em: "🧊", s: "Quero entender opções" },
      ],
    },
    {
      id: "interesse", type: "multi", kicker: "Caminhos possíveis",
      title: "O que mais chama sua atenção como solução?",
      hint: "Pode marcar mais de uma opção.",
      options: [
        { v: "Treinamento de líderes" },
        { v: "Treinamento de equipes" },
        { v: "Business Partner (RH estratégico)" },
        { v: "Análise comportamental (DISC)" },
        { v: "Engenharia de equipes" },
        { v: "Departamento Pessoal (folha, admissões, eSocial)" },
        { v: "Ainda não sei — quero uma orientação" },
      ],
    },
    {
      id: "contato", type: "contact", kicker: "Última etapa",
      title: "Perfeito, {nome}. Para onde mandamos o próximo passo?",
      hint: "A Cíntia e o time Ellü olham cada diagnóstico pessoalmente.",
    },
  ];

  let modal, cur = 0, data = {}, context = {};

  function build() {
    const html = `
    <div class="qmodal" role="dialog" aria-modal="true" aria-labelledby="qmodal-title">
      <div class="qmodal__backdrop" data-qclose></div>
      <div class="qmodal__card">
        <div class="qmodal__top grain">
          <button class="qmodal__close" data-qclose aria-label="Fechar">${ICON.close}</button>
          <div class="qmodal__brand">
            <span class="av"><img src="assets/img/cintia-1.jpg" alt=""></span>
            <div><b id="qmodal-title">Diagnóstico rápido Ellü</b><small>Cíntia e time respondem pessoalmente</small></div>
          </div>
          <div class="qprogress"><div class="qprogress__bar"><i></i></div><span class="qprogress__txt">1 de ${steps.length}</span></div>
        </div>
        <div class="qbody">
          <form novalidate autocomplete="on">
            ${steps.map(renderStep).join("")}
            <div class="qstep qdone" data-step="done">
              <div class="seal">${ICON.check}</div>
              <span class="kicker">Diagnóstico enviado</span>
              <h3 class="qdone-title">Tudo certo!</h3>
              <p class="hint qdone-msg"></p>
              <dl class="qsummary"></dl>
              <a class="btn btn--wa btn--lg qwa" href="#" target="_blank" rel="noopener">${ICON.wa} Continuar no WhatsApp</a>
              <p class="qprivacy" style="justify-content:center">Sua conversa já abre com o diagnóstico preenchido — nada de repetir tudo.</p>
            </div>
            <div class="qnav">
              <button type="button" class="qback" hidden>${ICON.back} Voltar</button>
              <button type="submit" class="btn btn--orange qnext">Continuar ${ICON.arrow}</button>
            </div>
          </form>
          <p class="qprivacy">${ICON.lock} Seus dados ficam só com a Ellü. Zero spam, prometido.</p>
        </div>
      </div>
    </div>`;
    document.body.insertAdjacentHTML("beforeend", html);
    modal = document.querySelector(".qmodal");

    modal.querySelectorAll("[data-qclose]").forEach((b) => b.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && modal.classList.contains("is-open")) close(); });

    const form = modal.querySelector("form");
    form.addEventListener("submit", (e) => { e.preventDefault(); next(); });
    modal.querySelector(".qback").addEventListener("click", back);

    modal.querySelectorAll(".qopt").forEach((btn) => btn.addEventListener("click", () => pick(btn)));
    modal.querySelectorAll("input").forEach((inp) => inp.addEventListener("input", () => {
      inp.closest(".qfield")?.classList.remove("has-error");
      if (inp.name === "whats") inp.value = maskPhone(inp.value);
      syncNext();
    }));
  }

  function renderStep(s, i) {
    let body = "";
    if (s.type === "text") {
      body = `<div class="qfield big"><input id="q-${s.id}" name="${s.id}" placeholder=" " autocomplete="given-name"><label for="q-${s.id}">${s.placeholder}</label></div><p class="qerr"></p>`;
    } else if (s.type === "contact") {
      body = `
        <div class="qfield"><input id="q-empresa" name="empresa" placeholder=" " autocomplete="organization"><label for="q-empresa">Empresa</label></div>
        <div class="qfield"><input id="q-whats" name="whats" type="tel" inputmode="tel" placeholder=" " autocomplete="tel"><label for="q-whats">WhatsApp com DDD</label></div>
        <div class="qfield"><input id="q-email" name="email" type="email" placeholder=" " autocomplete="email"><label for="q-email">E-mail</label></div>
        <p class="qerr"></p>`;
    } else {
      const cls = s.type === "heat" ? "heat" : "qopts" + (s.layout === "two" ? " two" : "");
      body = `<div class="${cls}">${s.options.map((o, j) => `
        <button type="button" class="qopt${s.type === "multi" ? " multi" : ""}" data-v="${o.v}">
          ${o.em ? `<span class="em">${o.em}</span>` : `<span class="k">${o.k || String.fromCharCode(65 + j)}</span>`}
          ${s.type === "heat" ? `<span><b>${o.v}</b><small>${o.s}</small></span>` : `<span>${o.v}</span>`}
        </button>`).join("")}</div>
        ${s.insight ? `<div class="qinsight"><span class="dots"></span><span class="qinsight__txt"></span></div>` : ""}`;
    }
    return `<div class="qstep" data-step="${i}" data-type="${s.type}">
      <span class="kicker">${s.kicker}</span>
      <h3 data-title="${s.title}">${s.title}</h3>
      <p class="hint">${s.hint}</p>
      ${body}
    </div>`;
  }

  function stepEl(i) { return modal.querySelector(`.qstep[data-step="${i}"]`); }

  function show(i, dir = 1) {
    modal.querySelectorAll(".qstep").forEach((el) => el.classList.remove("is-active", "back"));
    const el = i === "done" ? modal.querySelector('.qstep[data-step="done"]') : stepEl(i);
    el.classList.add("is-active");
    if (dir < 0) el.classList.add("back");

    const done = i === "done";
    const n = done ? steps.length : i + 1;
    modal.querySelector(".qprogress__bar i").style.width = (done ? 100 : (i / steps.length) * 100 + 4) + "%";
    modal.querySelector(".qprogress__txt").textContent = done ? "Concluído ✓" : remainingText(i);
    modal.querySelector(".qnav").style.display = done ? "none" : "";
    modal.querySelector(".qback").hidden = done || i === 0;

    if (!done) {
      const h = el.querySelector("h3");
      h.textContent = h.dataset.title.replace("{nome}", firstName());
      const nextBtn = modal.querySelector(".qnext");
      nextBtn.innerHTML = (i === steps.length - 1 ? "Ver meu diagnóstico " : "Continuar ") + ICON.arrow;
      syncNext();
      const inp = el.querySelector("input");
      if (inp && window.matchMedia("(min-width: 641px)").matches) setTimeout(() => inp.focus(), 250);
    }
    modal.querySelector(".qmodal__card").scrollTop = 0;
  }

  function remainingText(i) {
    const left = steps.length - i;
    if (i === 0) return `1 de ${steps.length}`;
    if (left === 1) return "Última pergunta!";
    if (left === 2) return "Falta só mais uma 🙌";
    return `${i + 1} de ${steps.length}`;
  }

  function firstName() { return (data.nome || "").trim().split(/\s+/)[0] || ""; }

  function pick(btn) {
    const stepNode = btn.closest(".qstep");
    const s = steps[+stepNode.dataset.step];
    if (s.type === "multi") {
      btn.classList.toggle("is-selected");
      data[s.id] = [...stepNode.querySelectorAll(".qopt.is-selected")].map((b) => b.dataset.v);
      syncNext();
      return;
    }
    stepNode.querySelectorAll(".qopt").forEach((b) => b.classList.remove("is-selected"));
    btn.classList.add("is-selected");
    data[s.id] = btn.dataset.v;
    syncNext();

    if (s.insight) {
      const box = stepNode.querySelector(".qinsight");
      box.querySelector(".qinsight__txt").textContent = PAINS[btn.dataset.v];
      box.classList.remove("show"); void box.offsetWidth; box.classList.add("show");
      return; // let the person read the insight, then continue manually
    }
    setTimeout(() => next(), 380);
  }

  function syncNext() {
    if (cur === "done") return;
    const s = steps[cur];
    const el = stepEl(cur);
    let ok = true;
    if (s.type === "text") ok = el.querySelector("input").value.trim().length >= 2;
    else if (s.type === "multi") ok = (data[s.id] || []).length > 0;
    else if (s.type === "contact") ok = true;
    else ok = !!data[s.id];
    modal.querySelector(".qnext").disabled = !ok;
  }

  function validate() {
    const s = steps[cur];
    const el = stepEl(cur);
    const err = el.querySelector(".qerr");
    if (s.type === "text") {
      const v = el.querySelector("input").value.trim();
      if (v.length < 2) { err.textContent = "Conta pra gente seu nome 🙂"; return false; }
      data.nome = v;
    }
    if (s.type === "contact") {
      const emp = el.querySelector('[name="empresa"]');
      const wa = el.querySelector('[name="whats"]');
      const em = el.querySelector('[name="email"]');
      const digits = wa.value.replace(/\D/g, "");
      let msg = "";
      [emp, wa, em].forEach((i) => i.closest(".qfield").classList.remove("has-error"));
      if (emp.value.trim().length < 2) { emp.closest(".qfield").classList.add("has-error"); msg = "Qual o nome da empresa?"; }
      else if (digits.length < 10) { wa.closest(".qfield").classList.add("has-error"); msg = "Confere o WhatsApp? Precisa ter DDD + número."; }
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em.value.trim())) { em.closest(".qfield").classList.add("has-error"); msg = "Esse e-mail parece incompleto."; }
      err.textContent = msg;
      if (msg) return false;
      data.empresa = emp.value.trim(); data.whats = wa.value.trim(); data.email = em.value.trim();
    }
    if (err) err.textContent = "";
    return true;
  }

  function next() {
    if (cur === "done" || !validate()) return;
    if (cur < steps.length - 1) { cur++; show(cur); }
    else finish();
  }

  function back() {
    if (cur === "done" || cur === 0) return;
    cur--; show(cur, -1);
  }

  function finish() {
    cur = "done";
    const nome = firstName();
    modal.querySelector(".qdone-title").textContent = `${nome}, seu diagnóstico chegou até nós!`;
    modal.querySelector(".qdone-msg").textContent =
      data.urgencia === "Pra ontem"
        ? "Vimos que o assunto é urgente — seu contato entra com prioridade. Clique abaixo e fale agora com o time Ellü."
        : "Agora é só clicar abaixo para continuar a conversa com o time Ellü no WhatsApp.";

    const rows = [
      ["Você", data.papel],
      ["Pessoas envolvidas", data.time],
      ["Maior desafio", data.dor],
      ["Urgência", data.urgencia],
      ["Interesse", (data.interesse || []).join(", ")],
    ];
    const teste = context.teste || "DISC";
    if (context.perfil) rows.unshift([`Perfil ${teste}`, context.perfil]);
    modal.querySelector(".qsummary").innerHTML = rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v || "—"}</dd></div>`).join("");

    const text = [
      `Olá, Ellü! Sou ${data.nome}, da ${data.empresa}.`,
      context.origem ? `Vim pelo site (${context.origem}).` : "Vim pelo site.",
      context.perfil ? `Meu resultado no teste ${teste}: ${context.perfil}.` : "",
      "",
      `• Quem sou: ${data.papel}`,
      `• Pessoas envolvidas: ${data.time}`,
      `• Maior desafio: ${data.dor}`,
      `• Urgência: ${data.urgencia}`,
      `• Interesse: ${(data.interesse || []).join(", ")}`,
      `• E-mail: ${data.email}`,
      "",
      "Quero conversar sobre os próximos passos!",
    ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

    modal.querySelector(".qwa").href = `https://wa.me/${ELLU_WHATSAPP}?text=${encodeURIComponent(text)}`;

    // Lead pronto para CRM/planilha — na versão final, enviar via fetch() para o endpoint do CRM
    const lead = { ...data, ...context, score: leadScore(), criadoEm: new Date().toISOString(), pagina: location.pathname };
    try { localStorage.setItem("ellu_last_lead", JSON.stringify(lead)); } catch (e) {}
    console.info("[Ellü] Lead qualificado:", lead);

    show("done");
  }

  function leadScore() {
    let s = 0;
    s += { "Sou dono(a) / sócio(a)": 30, "Sou líder / gestor(a) de equipe": 20, "Trabalho no RH / Gente & Gestão": 25, "Quero me desenvolver como profissional": 5 }[data.papel] || 0;
    s += { "Até 10 pessoas": 5, "De 11 a 50 pessoas": 15, "De 51 a 200 pessoas": 25, "Mais de 200 pessoas": 30 }[data.time] || 0;
    s += { "Pra ontem": 40, "Próximos 3 meses": 25, "Só pesquisando": 5 }[data.urgencia] || 0;
    return s >= 75 ? "quente" : s >= 45 ? "morno" : "frio";
  }

  function maskPhone(v) {
    const d = v.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, d.length - 4)}-${d.slice(-4)}`;
  }

  function open(ctx = {}) {
    context = ctx;
    if (cur === "done") reset();
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    show(cur);
  }

  function close() {
    modal.classList.remove("is-open");
    document.body.classList.remove("modal-open");
  }

  function reset() {
    cur = 0;
    const keep = data.nome;
    data = keep ? { nome: keep } : {};
    modal.querySelectorAll(".qopt").forEach((b) => b.classList.remove("is-selected"));
    modal.querySelectorAll(".qinsight").forEach((b) => b.classList.remove("show"));
  }

  return { build, open };
})();

/* ---------- Floating WhatsApp + CTA wiring ---------- */
(function contact() {
  Qualify.build();

  const wa = document.createElement("button");
  wa.className = "wa-float";
  wa.setAttribute("aria-label", "Falar com a Ellü pelo WhatsApp");
  wa.innerHTML = `<span class="bubble"><b>Oi! 👋</b> Quer descobrir o que está travando a performance do seu time?</span><span class="wa-btn">${ICON.wa}<i>1</i></span>`;
  document.body.appendChild(wa);
  wa.addEventListener("click", () => {
    wa.classList.remove("show-bubble");
    Qualify.open({ origem: "botão WhatsApp" });
  });
  setTimeout(() => wa.classList.add("show-bubble"), 4000);
  setTimeout(() => wa.classList.remove("show-bubble"), 14000);

  // Qualquer elemento com data-contact abre o popup (nunca um link direto)
  document.addEventListener("click", (e) => {
    const t = e.target.closest("[data-contact]");
    if (!t) return;
    e.preventDefault();
    Qualify.open({ origem: t.dataset.contact || "site" });
  });
})();

/* =========================================================
   Cards do Departamento Pessoal: inclinação 3D, luz que segue
   o mouse, confete ao clicar e animação automática no celular
   ========================================================= */
(function dpCards() {
  const items = document.querySelectorAll(".dp-item");
  if (!items.length) return;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const COLORS = ["#EF7828", "#F79A5A", "#F2A93B", "#004444", "#1F7A72"];

  const play = (el) => {
    el.classList.remove("is-play");
    void el.offsetWidth; // reinicia as animações
    el.classList.add("is-play");
    clearTimeout(el._playT);
    el._playT = setTimeout(() => el.classList.remove("is-play"), 2200);
  };

  const burst = (x, y) => {
    for (let i = 0; i < 14; i++) {
      const d = document.createElement("span");
      d.className = "dp-burst";
      d.style.left = x + "px";
      d.style.top = y + "px";
      d.style.background = COLORS[i % COLORS.length];
      document.body.appendChild(d);
      const ang = (Math.PI * 2 * i) / 14 + Math.random() * 0.4;
      const dist = 40 + Math.random() * 50;
      const dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist;
      d.animate(
        [
          { transform: "translate(0,0) scale(1)", opacity: 1 },
          { transform: `translate(${dx}px, ${dy + 24}px) scale(.2)`, opacity: 0 },
        ],
        { duration: 700 + Math.random() * 300, easing: "cubic-bezier(.22,1,.36,1)" }
      ).onfinish = () => d.remove();
    }
  };

  items.forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.style.setProperty("--mx", px * 100 + "%");
      el.style.setProperty("--my", py * 100 + "%");
      if (calm || e.pointerType !== "mouse") return;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", (px - 0.5) * 12 + "deg");
      el.style.setProperty("--rx", (0.5 - py) * 12 + "deg");
    });
    el.addEventListener("pointerleave", () => {
      el.classList.remove("is-tilting");
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    });
    el.addEventListener("click", (e) => {
      if (calm) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
      burst(x, y);
      el.animate([{ scale: "1" }, { scale: ".95" }, { scale: "1.02" }, { scale: "1" }], { duration: 450, easing: "ease-out" });
      play(el);
    });
    el.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); el.click(); } });
  });

  // Sem mouse (celular): cada card se anima sozinho quando aparece na tela
  if (!calm && !window.matchMedia("(hover: hover)").matches) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => {
      if (en.isIntersecting) { setTimeout(() => play(en.target), 350); io.unobserve(en.target); }
    }), { threshold: 0.6 });
    items.forEach((el) => io.observe(el));
  }
})();
