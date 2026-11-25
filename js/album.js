/* O Vovô do X1 e sua Tropinha — a jornada em rolagem (v3).
   Três passos, sem jogo: conhecer os sete (uma página igual para cada um), ver o lance de cada um
   (replay em quadros, com as poses dos books) e, no fim, o filme.
   Sem dependências além da biblioteca de virar página (vendor/page-flip.browser.js). */
(() => {
"use strict";
const P = window.PERSONAGENS, A = window.ALBUM, POSES = window.POSES, REV = window.REVISTA, JUNTOS = window.JUNTOS, VIDEOS = window.VIDEOS || [], TR = window.TRILHAS || [];
const porId = Object.fromEntries(P.map(p => [p.id, p]));
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fig = (id, n) => `assets/p/${id}/pose-${String(n).padStart(2, "0")}.webp`;
const rosto = (id, n = 1) => `assets/p/${id}/expr-${n}.webp`;
const capa = id => `assets/p/${id}/capa.webp`;
const WHATS = "5521986663161", CHAVE = "tropinha-v3";
const reduz = matchMedia("(prefers-reduced-motion: reduce)").matches;
const CURTO = { vovo: "Vovô", nanda: "Nanda", joia: "Joia", duda: "Duda", prancheta: "Prancheta", val: "Val", topete: "Topete" };
const FEM = { nanda: 1, duda: 1, val: 1 };
const de = id => (FEM[id] ? "da " : "do ") + CURTO[id];
const artigo = id => (FEM[id] ? "a " : "o ") + CURTO[id];
document.documentElement.classList.add("js");

/* ---------- estado (fica só neste aparelho) ---------- */
let st = { vis: {}, on: null, faixa: TR[0] ? TR[0].id : "", vez: {}, notas: {}, geral: "", festa: false };
try { Object.assign(st, JSON.parse(localStorage.getItem(CHAVE) || "{}")); } catch (e) {}
const salvar = () => { try { localStorage.setItem(CHAVE, JSON.stringify(st)); } catch (e) {} };
const vistos = () => P.filter(p => st.vis[p.id]).length;

let tAviso;
function aviso(msg, ms = 2800) { const a = $("#aviso"); a.textContent = msg; a.hidden = false; clearTimeout(tAviso); tAviso = setTimeout(() => { a.hidden = true; }, ms); }
const irPara = sel => { const el = $(sel); if (el) el.scrollIntoView({ behavior: reduz ? "auto" : "smooth", block: "start" }); };

/* ---------- música: três estilos e pausa ---------- */
const tema = $("#tema"); tema.volume = .22;
let videoTocando = false, faixaPosta = "";
$("#estilo").innerHTML = TR.map(t => `<option value="${t.id}">♪ ${esc(t.nome)}</option>`).join("");
$("#trilha").innerHTML = `<span class="trilha-t">Trilha sonora</span>` + TR.map(t => `<button data-faixa="${t.id}" aria-pressed="false">${esc(t.nome)}</button>`).join("") + `<button class="trilha-pausa" data-pausa>Pausar</button>`;
function musica() {
  const t = TR.find(x => x.id === st.faixa) || TR[0]; if (!t) return;
  if (faixaPosta !== t.id) { tema.src = t.arq; faixaPosta = t.id; }
  if (st.on && !videoTocando && !document.hidden) { const pr = tema.play(); if (pr) pr.catch(() => {}); } else tema.pause();
  const b = $("#toca"); b.setAttribute("aria-pressed", String(!!st.on)); b.setAttribute("aria-label", st.on ? "Pausar a música" : "Tocar a música"); b.title = st.on ? "Pausar a música" : "Tocar a música";
  $("#estilo").value = t.id;
  $$("[data-faixa]").forEach(x => x.setAttribute("aria-pressed", String(!!st.on && x.dataset.faixa === t.id)));
  const pz = $("[data-pausa]"); pz.textContent = st.on ? "Pausar" : "Tocar"; pz.setAttribute("aria-label", st.on ? "Pausar a música" : "Tocar a música");
}
const ligar = (on, faixa) => { st.on = on; if (faixa) st.faixa = faixa; salvar(); musica(); };
$("#toca").onclick = () => ligar(!st.on);
$("#estilo").onchange = e => ligar(true, e.target.value);
$("#trilha").onclick = e => { const f = e.target.closest("[data-faixa]"); if (f) return ligar(true, f.dataset.faixa); if (e.target.closest("[data-pausa]")) ligar(!st.on); };
// O navegador só deixa tocar depois de um toque: se a música já estava ligada numa visita anterior, ela volta no primeiro toque.
document.addEventListener("pointerdown", () => { if (st.on) musica(); }, { once: true, capture: true });
document.addEventListener("visibilitychange", musica);
const viraPagina = new Audio("assets/audio/sfx-pagina.mp3");
const somDePagina = () => { if (!st.on) return; try { viraPagina.currentTime = 0; viraPagina.volume = .6; const pr = viraPagina.play(); if (pr) pr.catch(() => {}); } catch (e) {} };

/* ---------- capa: os sete na quadra, com nome ---------- */
const AJ = { nanda: [0, 5], topete: [-3, -3], joia: [1, 0] };
$("#arte").insertAdjacentHTML("beforeend", P.map(p => {
  const [l, t, w, h] = p.area, aj = AJ[p.id] || [0, 0];
  return `<a class="alvo-p" href="#p-${p.id}" aria-label="${esc(p.nome)}: ${esc(A[p.id].papel)}" style="left:${l}%;top:${t}%;width:${w}%;height:${h}%"></a>` +
    `<span class="etq" style="--cor:${p.cor};left:${(l + w / 2 + aj[0]).toFixed(1)}%;top:${Math.min(91, t + h + aj[1]).toFixed(1)}%">${esc(CURTO[p.id])}</span>`;
}).join(""));
$("#abrir").onclick = () => { if (st.on === null) ligar(true); else musica(); irPara("#como"); };

/* ---------- o time ---------- */
$("#time-grade").innerHTML = P.map(p => `<a class="cartao" href="#p-${p.id}" style="--cor:${p.cor}">
  <span class="cartao-fig"><img src="${capa(p.id)}" alt="" loading="lazy"></span><b>${esc(p.nome)}</b>
  <span class="cartao-papel">${esc(A[p.id].papel)}</span></a>`).join("");

/* ---------- as páginas ---------- */
function pagina(p, i) {
  const a = A[p.id], nomes = POSES[p.id], num = String(i + 1).padStart(2, "0"), qs = a.lance.quadros, vi = VIDEOS.findIndex(v => v.de === p.id), prox = P[i + 1];
  const fato = (t, txt) => `<div class="fato"><h4>${t}</h4><p>${esc(txt)}</p></div>`;
  const ponto = (t, txt, largo) => `<div class="ponto ${largo ? "largo" : ""}"><h4>${t}</h4><p>${esc(txt)}</p></div>`;
  return `<section class="pg" id="p-${p.id}" data-id="${p.id}" style="--cor:${p.cor}"><div class="pg-miolo">
    <div class="pg-topo">
      <div class="figura"><span class="num">${num}<i>/07</i></span><img src="${capa(p.id)}" alt="${esc(p.nome)}"${i ? ' loading="lazy"' : ""}></div>
      <div class="pg-texto">
        <p class="papel"><b>${esc(a.papel)}</b><span>${esc(p.origem)}</span></p>
        <h2>${esc(p.nome)}</h2>
        <p class="epiteto">${esc(p.epiteto)}</p>
        <blockquote class="fala">“${esc(a.fala)}”</blockquote>
        <p class="quadra"><b>Na quadra</b>${esc(a.quadra)}</p>
      </div>
    </div>
    <div class="fatos">${fato("O que quer", p.desejo)}${fato("Qualidade", p.qualidade)}${fato("Defeito", p.defeito)}${fato("O que esperar", p.esperar)}</div>
    <aside class="jargao" id="j-${p.id}">
      <div class="jargao-cab"><p class="sobre">O jargão ${de(p.id)}</p><p class="jargao-frase">“${esc(a.jargao.frase).replace(/\*(.+?)\*/g, "<i>$1</i>")}”</p></div>
      <div class="jargao-txt"><div><h4>Por que esse jargão</h4><p>${esc(a.jargao.porque)}</p></div><div><h4>Quando aparece</h4><p>${esc(a.jargao.quando)}</p></div></div>
    </aside>
    <div class="lance" id="l-${p.id}">
      <div class="lance-texto">
        <p class="sobre">O lance ${de(p.id)}</p><h3>${esc(a.lance.nome)}</h3>
        <p class="lance-desc">${esc(a.lance.texto)}</p>
        <button class="botao principal grande" data-ver>▶ Ver o lance</button>
        <p class="lance-dica">Ou toque num quadro para ver com calma.</p>
      </div>
      <div class="lance-cena">
        <button class="palco" data-palco aria-label="Ver o lance ${de(p.id)}"><span class="chao"></span><img class="sp" src="${fig(p.id, qs[0])}" alt="" loading="lazy" draggable="false"></button>
        <p class="quadro-leg" data-leg aria-live="polite"><b>1 de ${qs.length}</b> ${esc(nomes.poses[qs[0] - 1] || "")}</p>
        <div class="quadros">${qs.map((n, k) => `<button data-q="${k}" aria-current="${k === 0}" aria-label="Quadro ${k + 1}: ${esc(nomes.poses[n - 1] || "")}"><img src="${fig(p.id, n)}" alt="" loading="lazy"><span>${k + 1}</span></button>`).join("")}</div>
      </div>
    </div>
    ${vi >= 0 ? `<div class="tem-video"><img src="${esc(VIDEOS[vi].capa)}" alt="" loading="lazy"><div><p class="sobre">O vídeo ${de(p.id)}</p><h3>${esc(VIDEOS[vi].titulo)}</h3><p>${esc(VIDEOS[vi].linha)}. É o vídeo que vai para o Instagram.</p></div><button class="botao principal" data-video="${vi}">▶ Assistir agora</button></div>` : ""}
    <div><h3 class="bloco-t">Os seis rostos ${de(p.id)} <span>toque para ampliar</span></h3>
      <div class="rostos">${nomes.expr.map((e, k) => `<button data-salto="${p.id}|e|${k + 1}"><img src="${rosto(p.id, k + 1)}" alt="" loading="lazy"><span>${esc(e)}</span></button>`).join("")}</div></div>
    <div><h3 class="bloco-t">As 36 poses ${de(p.id)} <span>arraste para o lado e toque para ampliar</span></h3>
      <div class="tira">${nomes.poses.map((e, k) => `<button data-salto="${p.id}|p|${k + 1}"><img src="${fig(p.id, k + 1)}" alt="" loading="lazy"><span>${esc(e)}</span></button>`).join("")}</div></div>
    <details class="mais"><summary>Mais sobre ${artigo(p.id)}<span>função na história, sonho, medo, voz, falas e como reconhecer</span></summary>
      <div class="mais-corpo"><div class="mais-grade">
        ${ponto("Função na história", p.funcao, 1)}${ponto("Sonho", p.sonho)}${ponto("Medo", p.medo)}
        ${ponto("Como reconhecer", p.reconhecer, 1)}${ponto("Voz", p.voz)}
        <div class="ponto"><h4>Falas</h4>${p.falas.map(f => `<p class="dito">“${esc(f)}”</p>`).join("")}</div>
        ${ponto("Um momento de jogo", p.momento, 1)}</div>
        ${p.real ? `<p class="miudo">Sonhos, medos e falas são do personagem de ficção, não da pessoa que o inspira.</p>` : ""}
        <p><button class="botao linha" data-cap="${p.id}">Ler o capítulo ${de(p.id)} na revista</button></p>
      </div></details>
    <p class="pg-pe"><a class="botao principal" href="${prox ? "#p-" + prox.id : "#filme-secao"}">${prox ? "Próximo: " + esc(CURTO[prox.id]) : "Fim da jornada: o filme"}</a></p>
  </div></section>`;
}
$("#paginas").innerHTML = P.map(pagina).join("");

/* ---------- o lance: replay em quadros, sem acerto nem erro ---------- */
function montarLance(p) {
  const raiz = $("#l-" + p.id), img = $(".sp", raiz), leg = $("[data-leg]", raiz), btn = $("[data-ver]", raiz), ths = $$("[data-q]", raiz), qs = A[p.id].lance.quadros, nomes = POSES[p.id].poses;
  let i = 0, t = 0, pronto = false;
  const mostra = k => { i = k; img.src = fig(p.id, qs[k]); leg.innerHTML = `<b>${k + 1} de ${qs.length}</b> ${esc(nomes[qs[k] - 1] || "")}`; ths.forEach((b, j) => b.setAttribute("aria-current", String(j === k))); };
  const para = () => { clearInterval(t); t = 0; btn.textContent = i === qs.length - 1 ? "↺ Ver de novo" : "▶ Ver o lance"; };
  const toca = async () => {
    if (t) return para();
    if (!pronto) { btn.textContent = "Carregando…"; await Promise.all(qs.map(n => new Promise(r => { const im = new Image(); im.onload = im.onerror = r; im.src = fig(p.id, n); }))); pronto = true; }
    mostra(0); btn.textContent = "❚❚ Pausar";
    t = setInterval(() => { if (i >= qs.length - 1) return para(); mostra(i + 1); if (i >= qs.length - 1) para(); }, reduz ? 1200 : 780);
  };
  btn.onclick = toca; $("[data-palco]", raiz).onclick = toca;
  ths.forEach((b, j) => { b.onclick = () => { para(); mostra(j); btn.textContent = "▶ Ver o lance"; }; });
}
P.forEach(montarLance);

/* ---------- por onde você já passou ---------- */
function atualizar() {
  const n = vistos(), faltam = P.filter(p => !st.vis[p.id]);
  $("#progresso").innerHTML = P.map(p => `<a href="#p-${p.id}" data-chip="${p.id}" class="${st.vis[p.id] ? "tem" : ""}" style="--cor:${p.cor}" title="${esc(p.nome)}" aria-label="${esc(p.nome)}${st.vis[p.id] ? ", já visto" : ""}"><img src="${rosto(p.id)}" alt=""></a>`).join("");
  $("#trilho-titulo").textContent = n === 7 ? "Você conheceu os sete" : n ? `Você já conheceu ${n} de 7` : "Quem você vai conhecer";
  $("#fileira").innerHTML = P.map((p, i) => st.vis[p.id] ? `<a class="tem" href="#p-${p.id}" style="--cor:${p.cor}" aria-label="${esc(p.nome)}: já visto"><img src="${capa(p.id)}" alt="" loading="lazy"></a>` : `<a href="#p-${p.id}" aria-label="${esc(p.nome)}: ainda não visto">${i + 1}</a>`).join("");
  $("#trilho-nota").innerHTML = n === 7 ? "A figurinha de cada um apareceu aqui conforme você passou pela página dele." : faltam.length === 7 ? "A figurinha de cada um aparece aqui quando você passa pela página dele. O filme já pode ser visto." : "Falta conhecer: " + faltam.map(p => `<a href="#p-${p.id}">${esc(CURTO[p.id])}</a>`).join(", ") + ". O filme já pode ser visto.";
}
function marcar(id) {
  if (st.vis[id]) return; st.vis[id] = true; salvar(); atualizar();
  const chip = $(`[data-chip="${id}"]`); if (chip) chip.classList.add("aqui");
}

/* ---------- vídeos: o filme no fim da jornada ---------- */
let videoAtual = -1;
function porVideo(k, tocar) {
  const v = VIDEOS[k], cx = $("#filme"); if (!v) return;
  if (videoAtual !== k) {
    videoAtual = k;
    cx.innerHTML = `<div class="video"><video playsinline preload="none" poster="${esc(v.capa)}" src="${esc(v.src)}"></video><button class="video-play" aria-label="Assistir: ${esc(v.titulo)}"><i aria-hidden="true"></i><b>Assistir</b><span>${esc(v.linha)}</span></button></div>` +
      (VIDEOS.length > 1 ? `<div class="video-lista">${VIDEOS.map((x, j) => `<button data-video="${j}" aria-pressed="${j === k}"><img src="${esc(x.capa)}" alt="">${esc(CURTO[x.de] || "")}</button>`).join("")}</div>` : "");
    const el = $("video", cx), bt = $(".video-play", cx);
    const comeca = () => { el.controls = true; bt.hidden = true; const pr = el.play(); if (pr) pr.catch(() => { bt.hidden = false; }); };
    bt.onclick = comeca; cx.comeca = comeca;
    el.addEventListener("play", () => { videoTocando = true; musica(); });
    ["pause", "ended"].forEach(ev => el.addEventListener(ev, () => { videoTocando = false; musica(); }));
  }
  if (tocar && cx.comeca) cx.comeca();
}
if (VIDEOS.length) porVideo(0, false);
$("#breve").innerHTML = P.filter(p => !VIDEOS.some(v => v.de === p.id)).map(p => `<span style="--cor:${p.cor}"><i class="avatar"><img src="${rosto(p.id)}" alt="" loading="lazy"></i><b>${esc(CURTO[p.id])}</b>em breve</span>`).join("");

/* ---------- a figura que salta (rostos, poses e revista) ---------- */
function saltar(cid, k, n, daRevista) {
  const p = porId[cid], nomes = POSES[cid], lista = k === "p" ? nomes.poses : nomes.expr, tot = lista.length, cx = $("#salto");
  const desenha = primeira => {
    cx.innerHTML = `<div class="salto-cartao" style="--cor:${p.cor}${primeira ? "" : ";animation:none"}"><p class="leg">${esc(p.nome)} · ${k === "p" ? "pose" : "rosto"} ${n} de ${tot}</p>
      <div class="quadro"><img src="${k === "p" ? fig(cid, n) : rosto(cid, n)}" alt=""></div><h3>${esc(lista[n - 1] || "")}</h3>
      <div class="salto-nav"><button class="botao escuro" data-s="-1">‹ Anterior</button><button class="botao escuro" data-s="1">Próxima ›</button>${daRevista ? `<button class="botao" data-s="pg">Página ${de(cid)}</button>` : ""}<button class="botao" data-s="x">Fechar</button></div></div>`;
  };
  cx.hidden = false; desenha(true);
  cx.onclick = e => {
    const b = e.target.closest("[data-s]");
    if (!b) { if (e.target === cx) cx.hidden = true; return; }
    const s = b.dataset.s;
    if (s === "x") cx.hidden = true;
    else if (s === "pg") { cx.hidden = true; sairDaTelaCheia(); irPara("#p-" + cid); }
    else { n = (n - 1 + (+s) + tot) % tot + 1; desenha(false); }
  };
}

/* ---------- juntos ---------- */
let par = [];
$("#escolha").innerHTML = P.map(p => `<button data-par="${p.id}" aria-pressed="false" style="--cor:${p.cor}"><span class="avatar"><img src="${rosto(p.id)}" alt="" loading="lazy"></span>${esc(CURTO[p.id])}</button>`).join("");
$("#escolha").onclick = e => {
  const b = e.target.closest("[data-par]"); if (!b) return; const id = b.dataset.par;
  if (par.includes(id)) par = par.filter(x => x !== id); else { par.push(id); if (par.length > 2) par.shift(); }
  $$("[data-par]").forEach(x => x.setAttribute("aria-pressed", String(par.includes(x.dataset.par))));
  const d = $("#duelo");
  if (par.length === 2) {
    const [a, c] = par.map(i => porId[i]), t = JUNTOS[[a.id, c.id].sort().join("|")];
    d.className = "duelo cheio";
    d.innerHTML = `<div class="duelo-figs"><img src="${capa(a.id)}" alt=""><img src="${capa(c.id)}" alt=""></div><div><h3>${esc(CURTO[a.id])}<i>×</i>${esc(CURTO[c.id])}</h3><p>${t ? esc(t) : "Esse encontro ainda não foi escrito nos books. É uma história por fazer."}</p></div>`;
  } else { d.className = "duelo"; d.innerHTML = `<p>Toque em ${par.length ? "mais um rosto" : "dois rostos"}.</p>`; }
};

/* ---------- revista ---------- */
let pf = null, paginaAtual = 0, mostrarPagina = null, carregarPagina = null;
const emTelaCheia = () => !!(document.fullscreenElement || document.webkitFullscreenElement);
function ajustarRevista() { const rv = $("#rv"); if (!rv) return; const on = rv.classList.contains("cheia"); $("#cheia").textContent = on ? "Sair da tela cheia" : "Tela cheia"; document.body.classList.toggle("travado", on); setTimeout(() => dispatchEvent(new Event("resize")), 60); setTimeout(() => dispatchEvent(new Event("resize")), 400); }
function entrarNaTelaCheia() {
  const rv = $("#rv"); if (!rv) return; rv.classList.add("cheia"); ajustarRevista();
  // Tela cheia de verdade onde o navegador deixa (some a barra de endereço); onde não deixa, a revista ocupa a janela inteira.
  const raiz = document.documentElement, pede = raiz.requestFullscreen || raiz.webkitRequestFullscreen;
  if (pede) { try { const pr = pede.call(raiz); if (pr && pr.then) pr.then(() => { try { const o = screen.orientation; if (o && o.lock) o.lock("landscape").catch(() => {}); } catch (e) {} }).catch(() => {}); } catch (e) {} }
}
function sairDaTelaCheia() {
  const rv = $("#rv"); if (!rv || !rv.classList.contains("cheia")) return; rv.classList.remove("cheia"); ajustarRevista();
  if (emTelaCheia()) { try { (document.exitFullscreen || document.webkitExitFullscreen).call(document); } catch (e) {} }
  try { const o = screen.orientation; if (o && o.unlock) o.unlock(); } catch (e) {}
  setTimeout(() => rv.scrollIntoView({ block: "center" }), 120);
}
["fullscreenchange", "webkitfullscreenchange"].forEach(ev => document.addEventListener(ev, () => { if (!emTelaCheia()) sairDaTelaCheia(); }));
function meia(i, lado) {
  const pg = REV.paginas[i];
  // uma figura que cruza a dobra ganha área tocável nas duas metades
  const areas = pg.a.filter(a => (lado ? a.x + a.w > 50 : a.x < 50)).map(a =>
    `<button class="salta" data-c="${pg.c}" data-k="${a.k}" data-n="${a.n}" aria-label="Ver esta figura de perto" style="left:${((a.x - (lado ? 50 : 0)) * 2).toFixed(2)}%;top:${a.y}%;width:${(a.w * 2).toFixed(2)}%;height:${a.h}%"></button>`).join("");
  return `<div class="pagina" data-pg="${i}" data-density="soft"><div class="folha ${lado ? "dir" : "esq"}">${areas}</div></div>`;
}
function abrirRevista(capId) {
  const caps = REV.capitulos, total = REV.paginas.length, inicio = caps[Math.max(0, caps.findIndex(c => c.id === capId))].inicio;
  if (pf) { carregarPagina(inicio); pf.turnToPage(inicio * 2); mostrarPagina(inicio); return; }
  $("#revista-corpo").innerHTML = `<div class="revista" id="rv">
    <div class="capitulos" id="caps">${caps.map((c, i) => `<button data-capi="${i}" style="--cor:${c.id === "elenco" ? "#c4f13e" : porId[c.id].cor}" aria-selected="false">${esc(c.titulo)}</button>`).join("")}</div>
    <div class="livro-area"><div class="livro-wrap"><div id="livro">${REV.paginas.map((pg, i) => meia(i, 0) + meia(i, 1)).join("")}</div></div></div>
    <div class="livro-pe"><button class="botao" id="ant">‹ Anterior</button><span class="pag" id="pag"></span><button class="botao" id="prox">Próxima ›</button><button class="botao" id="lupa">Ampliar</button><button class="botao destaque" id="cheia">Tela cheia</button></div>
    <p class="gire">Arraste o canto da página para virar. Os pontos coral nas figuras fazem o personagem saltar da página.</p></div>`;
  const metades = $$("#livro .pagina"), folhas = $$("#livro .folha");
  carregarPagina = i => { for (let k = i - 2; k <= i + 3; k++) { if (k < 0 || k >= total) continue; const u = `url(assets/revista/${String(k + 1).padStart(3, "0")}.webp)`; if (!folhas[k * 2].style.backgroundImage) { folhas[k * 2].style.backgroundImage = u; folhas[k * 2 + 1].style.backgroundImage = u; } } };
  mostrarPagina = i => {
    paginaAtual = Math.max(0, Math.min(total - 1, i)); carregarPagina(paginaAtual);
    const ci = caps.findIndex((c, k) => paginaAtual >= c.inicio && (k === caps.length - 1 || paginaAtual < caps[k + 1].inicio));
    $("#pag").textContent = `${paginaAtual + 1} de ${total}`;
    const cx = $("#caps");
    $$("button", cx).forEach((b, k) => { b.setAttribute("aria-selected", String(k === ci)); if (k === ci) cx.scrollLeft = Math.max(0, b.offsetLeft - cx.clientWidth / 2 + b.offsetWidth / 2); });
  };
  carregarPagina(inicio);
  try {
    pf = new St.PageFlip($("#livro"), { width: 900, height: 1272, size: "stretch", minWidth: 140, maxWidth: 2400, minHeight: 198, maxHeight: 3392, usePortrait: false, showCover: false, drawShadow: true, maxShadowOpacity: .35, flippingTime: 750, mobileScrollSupport: true, disableFlipByClick: true, swipeDistance: 30, startPage: inicio * 2 });
    pf.loadFromHTML(metades);
    pf.on("flip", e => { mostrarPagina(Math.floor(e.data / 2)); somDePagina(); });
  } catch (err) { aviso("A revista não abriu neste navegador."); }
  mostrarPagina(inicio);
  $("#ant").onclick = () => pf && pf.flipPrev();
  $("#prox").onclick = () => pf && pf.flipNext();
  $("#caps").onclick = e => { const b = e.target.closest("[data-capi]"); if (!b || !pf) return; const i = caps[+b.dataset.capi].inicio; carregarPagina(i); pf.turnToPage(i * 2); mostrarPagina(i); somDePagina(); };
  $("#livro").addEventListener("click", e => { const b = e.target.closest(".salta"); if (b) { e.stopPropagation(); saltar(b.dataset.c, b.dataset.k, +b.dataset.n, true); } });
  $("#lupa").onclick = () => {
    const l = document.createElement("div"); l.className = "lupa";
    l.innerHTML = `<button class="botao principal">Fechar</button><img src="assets/revista/${String(paginaAtual + 1).padStart(3, "0")}.webp" alt="Página ${paginaAtual + 1} ampliada">`;
    document.body.appendChild(l); l.querySelector("button").onclick = () => l.remove();
  };
  $("#cheia").onclick = () => ($("#rv").classList.contains("cheia") ? sairDaTelaCheia() : entrarNaTelaCheia());
}
$("#abrir-revista").onclick = () => { somDePagina(); abrirRevista(); };
document.addEventListener("keydown", e => {
  if (e.key === "Escape") { if (!$("#salto").hidden) { $("#salto").hidden = true; return; } const l = $(".lupa"); if (l) return l.remove(); sairDaTelaCheia(); return; }
  const rv = $("#rv"); if (!pf || !rv || !$("#salto").hidden) return;
  const r = rv.getBoundingClientRect(); if (r.bottom < 80 || r.top > innerHeight - 80) return;
  if (e.key === "ArrowRight") pf.flipNext(); if (e.key === "ArrowLeft") pf.flipPrev();
});

/* ---------- sua vez ---------- */
const ROT = { isso: "é isso", quase: "quase", mudaria: "mudaria" };
function textoVez() {
  const l = ["Leitura do Anselmo: O Vovô do X1 e sua Tropinha", ""];
  P.forEach(p => { const v = st.vez[p.id], n = (st.notas[p.id] || "").trim(); if (v || n) l.push(`${p.nome}: ${v ? ROT[v] : "sem marcação"}${n ? ". " + n : ""}`); });
  if ((st.geral || "").trim()) l.push("", "Geral: " + st.geral.trim());
  if (l.length === 2) l.push("(ainda sem marcações)");
  return l.join("\n");
}
const zap = () => { $("#zap").href = `https://wa.me/${WHATS}?text=${encodeURIComponent(textoVez())}`; };
$("#vez-lista").innerHTML = P.map(p => `<div class="vez-linha" style="--cor:${p.cor}"><span class="avatar"><img src="${rosto(p.id)}" alt="" loading="lazy"></span><b>${esc(CURTO[p.id])}</b>
  <div class="vez-op" data-vez="${p.id}">${Object.entries({ isso: "É isso", quase: "Quase", mudaria: "Mudaria" }).map(([k, t]) => `<button data-op="${k}" aria-pressed="${st.vez[p.id] === k}">${t}</button>`).join("")}</div>
  <input type="text" data-nota="${p.id}" placeholder="O que você mudaria? (opcional)" value="${esc(st.notas[p.id] || "")}" aria-label="Comentário sobre ${esc(p.nome)}"></div>`).join("");
$("#geral").value = st.geral || "";
$("#vez").addEventListener("click", e => {
  const b = e.target.closest("[data-op]");
  if (b) { const id = b.parentElement.dataset.vez; st.vez[id] = st.vez[id] === b.dataset.op ? "" : b.dataset.op; salvar(); $$("[data-op]", b.parentElement).forEach(x => x.setAttribute("aria-pressed", String(st.vez[id] === x.dataset.op))); zap(); return; }
  if (e.target.id === "copiar") { const t = textoVez(); (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(() => aviso("Texto copiado."), () => aviso("Não deu para copiar. Use o botão do WhatsApp.")); }
});
$("#vez").addEventListener("input", e => { if (e.target.dataset.nota) st.notas[e.target.dataset.nota] = e.target.value; else if (e.target.id === "geral") st.geral = e.target.value; else return; salvar(); zap(); });

/* ---------- festa ---------- */
function confete() {
  const cv = $("#festa"), g = cv.getContext("2d"), W = cv.width = innerWidth, H = cv.height = innerHeight, cores = ["#c4f13e", "#f0786a", "#fffdf7", "#7fe3cb", "#e0c084"];
  const ps = Array.from({ length: 160 }, () => ({ x: W / 2 + (Math.random() - .5) * W * .5, y: H * .45, vx: (Math.random() - .5) * 13, vy: -Math.random() * 15 - 4, r: 4 + Math.random() * 6, c: cores[Math.floor(Math.random() * cores.length)], a: Math.random() * 6 }));
  const t0 = performance.now();
  const passo = () => {
    const t = performance.now() - t0; g.clearRect(0, 0, W, H);
    ps.forEach(p => { p.vy += .42; p.x += p.vx; p.y += p.vy; p.a += .2; g.save(); g.translate(p.x, p.y); g.rotate(p.a); g.fillStyle = p.c; g.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); g.restore(); });
    if (t < 3200) requestAnimationFrame(passo); else g.clearRect(0, 0, W, H);
  };
  passo();
}

/* ---------- comandos gerais ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const sa = t.closest("[data-salto]"); if (sa) { const [c, k, n] = sa.dataset.salto.split("|"); return saltar(c, k, +n); }
  const cp = t.closest("[data-cap]"); if (cp) { abrirRevista(cp.dataset.cap); return irPara("#revista"); }
  const vd = t.closest("[data-video]"); if (vd) { irPara("#filme-secao"); return porVideo(+vd.dataset.video, true); }
});

/* ---------- em que página estou; quem já foi visto ---------- */
if ("IntersectionObserver" in window) {
  const espera = {};
  const io = new IntersectionObserver(es => es.forEach(en => {
    const id = en.target.dataset.id, chip = $(`[data-chip="${id}"]`);
    if (chip) chip.classList.toggle("aqui", en.isIntersecting);
    clearTimeout(espera[id]);
    // só conta como visto quem ficou na tela um instante (pular pela página não marca os sete de uma vez)
    if (en.isIntersecting) { en.target.classList.add("visto"); espera[id] = setTimeout(() => marcar(id), 900); }
  }), { rootMargin: "-45% 0px -45% 0px" });
  $$(".pg").forEach(s => io.observe(s));
  new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting && vistos() === 7 && !st.festa) { st.festa = true; salvar(); if (!reduz) confete(); aviso("Você conheceu os sete. Falta o filme.", 4000); }
  }), { threshold: .35 }).observe($("#filme-secao"));
} else $$(".pg").forEach(s => s.classList.add("visto"));

/* ---------- partida ---------- */
atualizar(); musica(); zap();
})();
