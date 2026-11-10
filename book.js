/* Aba 6 -- BOOK do contrato (OS, Gerencia, Superintendencia).
   Le e grava na SNAPSHOT_FECHAMENTO: ano 9995 = book da OS (1 linha por OS, titulo "BOOK_OS <OS>"),
   9994 = book da gerencia ("BOOK_GER <gerente>"), 9993 = book da superintendencia ("BOOK_SUP <nome>").
   Os numeros dos indicadores vem das caixas do app (ATA/monthHistory); RH, Receita Ideal e historico
   vem do fluxo NPE-Ler-Dados-Book (so Master, com token de sessao). Os textos sao da IA. */
(function () {
  "use strict";
  var A = window.NPE_APP || {};
  var ANO_OS = 9995, ANO_GER = 9994, ANO_SUP = 9993;
  var MES = ["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  var MESF = ["", "janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  var CATS = [
    { cat: "Financeiro", ids: [1, 2, 4, 6, 7, 8] },
    { cat: "Pessoas", ids: [9, 10, 11, 12, 13, 14] },
    { cat: "SSMA", ids: [15, 16, 19] },
    { cat: "Cliente e contrato", ids: [17, 20, 22] }
  ];
  var NOME = { 1: "Faturamento Ano", 2: "Resultado Ano", 4: "Assertividade", 6: "Perda de Receita", 7: "Receita Ideal", 8: "Indenização",
    9: "Efetivo", 10: "HHT", 11: "Absenteísmo", 12: "TurnOver", 13: "Excesso de Hora Extra", 14: "Acúmulo de Férias",
    15: "SAF", 16: "CAF", 19: "PBI/PBD", 17: "Satisfação do Cliente", 20: "Boas Práticas", 22: "Renovação do Contrato" };
  var COR = { navy: "#14204A", navy2: "#22367A", teal: "#12A594", red: "#E5484D", orange: "#E08A0B", muted: "#5B6B82", line: "#E3E8F2",
    soft: "#EEF2FA", okfg: "#0B7A6C", badfg: "#B42318", warnfg: "#9A5B00", okbg: "#E3F6F2", ink: "#0F172A", pr: "#9AA8C7", hht: "#B8C4DE" };
  var CORES_MOTIVO = ["#22367A", "#E5484D", "#E08A0B", "#12A594", "#7C8DB5"];

  var CSS = "#tabBook{background:#F3F5FA;padding:16px;color:#0F172A}\n.bk-wrap{max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:14px;font-family:'Segoe UI',system-ui,Arial,sans-serif;font-size:13.5px;line-height:1.5}\n.bk-wrap svg{width:100%;height:auto;display:block}\n.bk-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.bk-marca{font-weight:800;letter-spacing:3px;color:#14204A;font-size:13px}\n.bk-tabs{display:flex;background:#fff;border:1px solid #E3E8F2;border-radius:10px;padding:3px}\n.bk-tabs button{border:0;background:none;padding:6px 14px;border-radius:8px;font:inherit;font-weight:600;color:#5B6B82;cursor:pointer}\n.bk-tabs button.on{background:#14204A;color:#fff}.bk-tabs button:disabled{opacity:.5;cursor:default}\n.bk-sel{display:flex;gap:6px;align-items:center;color:#5B6B82;font-size:12px}\n.bk-sel select{border:1px solid #E3E8F2;border-radius:8px;padding:6px 10px;font:inherit;font-weight:600;color:#0F172A;background:#fff;max-width:420px}\n.bk-acoes{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}\n.bk-bt{border:0;border-radius:8px;padding:7px 14px;font:inherit;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#22367A,#14204A);color:#fff}\n.bk-bt.sec{background:#E2E8F0;color:#334155}.bk-bt:disabled{opacity:.55;cursor:default}\n.bk-bt:focus-visible,.bk-tabs button:focus-visible,.bk-sel select:focus-visible{outline:2px solid #1F6FD1;outline-offset:2px}\n.bk-prog{background:#FFF8E6;border:1px solid #E0B24A;color:#7A5300;border-radius:10px;padding:8px 14px;font-weight:600}\n.bk-vazio{background:#fff;border:1px dashed #C5CEDC;border-radius:12px;padding:18px;color:#5B6B82}\n.bk-capa{background:linear-gradient(120deg,#14204A 0%,#22367A 100%);color:#fff;border-radius:16px;padding:22px 26px;display:grid;grid-template-columns:1.4fr 1fr;gap:22px}\n.bk-eyebrow{font-size:11px;letter-spacing:2.5px;text-transform:uppercase;opacity:.75}\n.bk-capa h1{font-size:26px;line-height:1.15;margin:4px 0 10px;color:#fff;text-wrap:balance}\n.bk-chips{display:flex;flex-wrap:wrap;gap:6px}.bk-chip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:2px 10px;font-size:11.5px}\n.bk-periodo{margin-top:12px;font-size:12px;background:rgba(255,255,255,.1);border-radius:8px;padding:6px 10px}\n.bk-ficha{display:grid;grid-template-columns:auto 1fr;gap:3px 14px;font-size:12.5px;align-content:start;margin:0}.bk-ficha dt{opacity:.7}.bk-ficha dd{font-weight:600;margin:0}\n.bk-card{background:#fff;border:1px solid #E3E8F2;border-radius:14px}.bk-sec{padding:18px 20px}\n.bk-sec h2{font-size:16px;color:#14204A;display:flex;align-items:baseline;gap:10px;margin:0 0 10px}.bk-sec h2 .sub{font-size:12px;color:#5B6B82;font-weight:500}\n.bk-lead{font-size:14.5px;line-height:1.65;margin:0}.bk-lead b,.bk-texto b{color:#14204A}\n.bk-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:14px}\n.bk-kpi{border:1px solid #E3E8F2;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;min-width:0}\n.bk-kpi .l{font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#5B6B82;font-weight:700}.bk-kpi .v{font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}.bk-kpi .s{font-size:11.5px;color:#5B6B82}\n.bk-kpi.bad .v{color:#B42318}.bk-kpi.ok .v{color:#0B7A6C}.bk-kpi.warn .v{color:#9A5B00}.bk-spark{max-width:140px;margin-top:4px}\n.bk-prior{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.bk-prior>div{border-radius:12px;padding:12px 14px;background:#EEF2FA}\n.bk-prior h3{font-size:13px;color:#14204A;margin:0 0 4px}.bk-prior p{font-size:12.5px;color:#334155;margin:0}.bk-prior .rank{font-size:11px;font-weight:700;color:#E5484D;letter-spacing:1px}\n.bk-g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.bk-g3{display:grid;grid-template-columns:1.5fr 1fr;gap:14px}\n.bk-chart{border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px}.bk-chart h4{font-size:12.5px;color:#14204A;margin:0 0 2px}.bk-chart .cap{font-size:11.5px;color:#5B6B82;margin-bottom:6px}\n.bk-leg{display:flex;flex-wrap:wrap;gap:10px;font-size:11px;color:#5B6B82;margin-top:4px}.bk-leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}\n.bk-texto{font-size:13.5px;line-height:1.65;color:#1E293B;margin:12px 0 0}\n.bk-acum{display:flex;flex-direction:column;gap:10px}.bk-acum div{background:#EEF2FA;border-radius:12px;padding:12px 14px}\n.bk-acum .l{font-size:10.5px;letter-spacing:1px;text-transform:uppercase;color:#5B6B82;font-weight:700;display:block}.bk-acum b{display:block;font-size:22px;color:#B42318;font-variant-numeric:tabular-nums}.bk-acum span{font-size:12px;color:#334155}\n.bk-ferias{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.bk-ferias div{background:#EEF2FA;border-radius:10px;padding:10px 12px}\n.bk-ferias b{font-size:18px;color:#14204A;display:block}.bk-ferias span{font-size:11.5px;color:#5B6B82}\n.bk-cat h3{font-size:13px;letter-spacing:1.5px;text-transform:uppercase;color:#5B6B82;margin:14px 0 8px}\n.bk-inds{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}\n.bk-ind{border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;border-left:4px solid #E3E8F2}\n.bk-ind.wide{grid-column:1/-1}.bk-ind.ok{border-left-color:#12A594}.bk-ind.bad{border-left-color:#E5484D}.bk-ind.na{border-left-color:#C5CEDC}\n.bk-ind .top{display:flex;align-items:center;gap:8px}.bk-ind .nome{font-weight:700;color:#14204A;font-size:13.5px}.bk-ind .id{font-size:11px;color:#5B6B82;font-weight:600}\n.bk-pill{margin-left:auto;font-size:10.5px;font-weight:700;border-radius:999px;padding:2px 9px;letter-spacing:.4px;white-space:nowrap}\n.bk-pill.ok{background:#E3F6F2;color:#0B7A6C}.bk-pill.bad{background:#FDE8E8;color:#B42318}.bk-pill.na{background:#EEF1F6;color:#5B6B82}\n.bk-ind .val{font-size:12.5px;color:#334155;font-variant-numeric:tabular-nums}\n.bk-strip{display:flex;gap:3px;align-items:center}.bk-strip span{width:20px;height:8px;border-radius:2px;background:#E6EAF1}\n.bk-strip span.ok{background:#12A594}.bk-strip span.bad{background:#E5484D}.bk-strip span.na{background:#CBD3E0}.bk-strip em{font-style:normal;font-size:10.5px;color:#5B6B82;margin-left:6px}\n.bk-ind .bl{font-size:12.5px;line-height:1.55;color:#1E293B}.bk-ind .bl strong{color:#14204A;font-size:11px;letter-spacing:.8px;text-transform:uppercase;display:block;margin-bottom:1px}\n.bk-ind .bl.cam strong{color:#12A594}.bk-ind.bad .bl.cam strong{color:#E5484D}\n.bk-ind .duo{display:grid;grid-template-columns:1.3fr 1fr;gap:14px;align-items:start}.bk-ind .duo .txts{display:flex;flex-direction:column;gap:8px}\n.bk-orc{border:2px solid #14204A;border-radius:14px;background:linear-gradient(180deg,#F5F7FD,#FFFFFF)}\n.bk-orc .tag{display:inline-block;background:#14204A;color:#fff;font-size:10.5px;letter-spacing:1.5px;text-transform:uppercase;border-radius:999px;padding:2px 10px;margin-bottom:6px}\n.bk-orcgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}.bk-orci{border:1px solid #E3E8F2;border-radius:10px;padding:10px 12px;background:#fff}\n.bk-orci h4{font-size:12.5px;color:#14204A;display:flex;justify-content:space-between;gap:8px;margin:0}.bk-orci h4 span{font-variant-numeric:tabular-nums;color:#B42318;text-align:right}.bk-orci p{font-size:12.5px;color:#334155;margin:3px 0 0}\n.bk-fontes{font-size:11px;color:#5B6B82;padding:4px}\n.bk-modal{position:fixed;inset:0;background:rgba(11,26,58,.6);z-index:99999999;display:flex;align-items:flex-start;justify-content:center;padding-top:80px}\n.bk-modal-box{background:#fff;border-radius:14px;padding:20px 22px;width:420px;max-width:92vw;font-family:'Segoe UI',Arial,sans-serif}\n.bk-modal-box h3{margin:0 0 6px;color:#14204A}.bk-modal-box p{margin:0 0 12px;color:#334155;font-size:13px}\n.bk-modal-box input{width:100%;box-sizing:border-box;border:1px solid #CBD5E1;border-radius:8px;padding:8px 10px;font:inherit}\n.bk-modal-bt{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}\n@media (max-width:900px){.bk-capa,.bk-g2,.bk-g3,.bk-inds,.bk-orcgrid,.bk-prior,.bk-ind .duo{grid-template-columns:1fr}.bk-kpis{grid-template-columns:repeat(2,1fr)}.bk-ferias{grid-template-columns:1fr}}";
  CSS += "\n.bk-dd{position:relative;display:flex;align-items:center;gap:6px}\n.bk-dd-rot{color:#5B6B82;font-size:12px}\n.bk-dd-btn{min-width:340px;max-width:460px;text-align:left;border:1px solid #CBD5E1;border-radius:8px;padding:7px 30px 7px 10px;background:#fff;font:inherit;font-weight:600;color:#0F172A;cursor:pointer;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.bk-dd-btn:after{content:'';position:absolute;right:11px;top:50%;margin-top:-2px;border:5px solid transparent;border-top-color:#5B6B82}\n.bk-dd-btn:focus-visible{outline:2px solid #1F6FD1;outline-offset:2px}\n.bk-dd-pan{position:absolute;top:100%;left:22px;margin-top:4px;z-index:2000;background:#fff;border:1px solid #CBD5E1;border-radius:10px;box-shadow:0 10px 28px rgba(20,32,74,.18);width:440px;max-width:90vw;max-height:380px;flex-direction:column;overflow:hidden}\n.bk-dd-pan input{border:0;border-bottom:1px solid #E3E8F2;padding:9px 12px;font:inherit;outline:none}\n.bk-dd-lista{overflow:auto;padding:4px}\n.bk-dd-it{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 10px;border-radius:6px;font:inherit;color:#0F172A;cursor:pointer}\n.bk-dd-it:hover,.bk-dd-it:focus-visible{background:#EEF2FA;outline:none}.bk-dd-it.on{background:#14204A;color:#fff}\n.bk-dd-vazio{padding:10px;color:#5B6B82;margin:0}\n.bk-dica{font-size:12px;color:#5B6B82;margin-top:-6px}";
  (function () { var s = document.createElement("style"); s.id = "bkCss"; s.textContent = CSS; document.head.appendChild(s); })();

  var st = { nivel: "os", sel: { os: "", ger: "", sup: "" }, linhas: { os: null, ger: null, sup: null }, carregando: false, msg: "" };

  // ------------------------------------------------------------------ utilidades
  function el(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rico(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function fmt(v, d) { if (v == null || isNaN(v)) return "–"; return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  function brl(v) { return v == null ? "–" : (v < 0 ? "R$ (" + fmt(-v) + ")" : "R$ " + fmt(v)); }
  function mi(v) { if (v == null) return "–"; var a = Math.abs(v); var s = a >= 1e6 ? fmt(a / 1e6, 2) + " mi" : fmt(a / 1e3) + " mil"; return v < 0 ? "(" + s + ")" : s; }
  function pct(v, d) { return v == null || isNaN(v) ? "–" : fmt(v * 100, d == null ? 2 : d) + "%"; }
  function chave(k) { var m = String(k).match(/\[([^\]]+)\]$/); return m ? m[1] : k; }
  function norm(rows) { return (rows || []).map(function (r) { var o = {}; Object.keys(r).forEach(function (k) { o[chave(k)] = r[k]; }); return o; }); }
  function params() { return new URLSearchParams(window.location.search); }
  function osAtiva() {
    var c = A.extractPrimaryOSCode ? A.extractPrimaryOSCode(params().get("SelectedOS") || "") : "";
    return /^[A-Z]\d{5}$/.test(String(c || "")) ? c : "";
  }
  function anoAtivo() { return parseInt(params().get("SelectedAno"), 10) || new Date().getFullYear(); }
  function mesAtivo() { return A.getMonthNumberFromParams ? A.getMonthNumberFromParams(params()) : 0; }
  function master() { return !!window.isMaster; }
  function toast(t) { if (A.showToast) A.showToast(t); }
  function hier() { try { return A.carregarHierarquiaOS ? A.carregarHierarquiaOS() : {}; } catch (e) { return {}; } }
  function niceMax(v) { if (!(v > 0)) return 1; var p = Math.pow(10, Math.floor(Math.log10(v))); var n = v / p; var s = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10; return s * p; }

  // ------------------------------------------------------------------ leitura do SharePoint
  async function lerNivel(nivel, forcar) {
    if (st.linhas[nivel] && !forcar) return st.linhas[nivel];
    var ano = nivel === "os" ? ANO_OS : nivel === "ger" ? ANO_GER : ANO_SUP;
    var pref = nivel === "os" ? "BOOK_OS " : nivel === "ger" ? "BOOK_GER " : "BOOK_SUP ";
    var mapa = {};
    var linhas = await A.tab5Post(window.FLOW_LER_SNAPSHOT_URL, { ano: ano });
    (linhas || []).forEach(function (l) {
      var tit = String(l && l.titulo || "");
      if (tit.indexOf(pref) !== 0 || !l.dados) return;
      var k = tit.slice(pref.length).trim().toUpperCase();
      var id = parseInt(l.id, 10) || 0;
      if (mapa[k] && mapa[k].id >= id) return;
      var d = null; try { d = JSON.parse(l.dados); } catch (e) { return; }
      mapa[k] = { id: id, d: d, em: String(l.atualizadoEm || l.geradoEm || "") };
    });
    st.linhas[nivel] = mapa;
    return mapa;
  }

  async function gravar(nivel, k, dados) {
    var mapa = await lerNivel(nivel, true);
    var reg = mapa[k] || { id: 0 };
    var ano = nivel === "os" ? ANO_OS : nivel === "ger" ? ANO_GER : ANO_SUP;
    var pref = nivel === "os" ? "BOOK_OS " : nivel === "ger" ? "BOOK_GER " : "BOOK_SUP ";
    var s = A.sessaoAcesso ? A.sessaoAcesso() : null;
    var corpo = JSON.stringify(dados);
    if (corpo.length > 60000) throw new Error("O book ficou grande demais para gravar (" + corpo.length + " caracteres).");
    var r = await fetch(window.FLOW_GRAVAR_SNAPSHOT_URL, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reg.id || 0, titulo: pref + k, ano: ano, mes: dados.mes || 1, dados: corpo, geradoPor: s ? s.login : "" })
    });
    if (!(r.ok || r.status === 202)) throw new Error("O SharePoint recusou a gravação (" + r.status + ").");
    await lerNivel(nivel, true);
    return true;
  }

  // ------------------------------------------------------------------ token e fluxo
  function pedirSenha(login) {
    return new Promise(function (resolve) {
      var f = document.createElement("div");
      f.className = "bk-modal";
      f.innerHTML = '<div class="bk-modal-box"><h3>Confirme sua senha</h3><p>O book lê dados de RH e da Receita Ideal, liberados só para o Máster. Usuário: <b>' + esc(login) +
        '</b></p><input type="password" id="bkSenha" autocomplete="current-password" placeholder="Senha"><div class="bk-modal-bt"><button type="button" id="bkSenhaCancelar" class="bk-bt sec">Cancelar</button><button type="button" id="bkSenhaOk" class="bk-bt">Confirmar</button></div></div>';
      document.body.appendChild(f);
      var inp = el("bkSenha"); setTimeout(function () { try { inp.focus(); } catch (e) {} }, 50);
      function fim(v) { try { document.body.removeChild(f); } catch (e) {} resolve(v); }
      el("bkSenhaCancelar").onclick = function () { fim(""); };
      el("bkSenhaOk").onclick = function () { fim(inp.value || ""); };
      inp.onkeydown = function (ev) { if (ev.key === "Enter") fim(inp.value || ""); };
    });
  }
  async function obterToken() {
    var s = A.sessaoAcesso ? A.sessaoAcesso() : null;
    if (!s || !s.login) throw new Error("Entre como Máster para gerar o book.");
    var cands = [window._NPE_TOKEN_BOOK, window._NPE_TOKEN_AGENTE];
    for (var i = 0; i < cands.length; i++) {
      var c = cands[i];
      if (c && c.login === s.login && c.token && (Date.now() - c.ts) < 3 * 3600 * 1000) return { login: s.login, token: c.token };
    }
    var senha = await pedirSenha(s.login);
    if (!senha) throw new Error("Geração cancelada.");
    var a = await A.autenticarAcesso(s.login, senha);
    if (!a.ok || String(a.token || "").length !== 64) throw new Error(a.erro || "Acesso não confirmado.");
    window._NPE_TOKEN_BOOK = { login: s.login, token: a.token, ts: Date.now() };
    return { login: s.login, token: a.token };
  }
  function urlFluxo() { return String((A.lerConfigIA ? A.lerConfigIA("npe_flow_ler_dados_book_url", "") : "") || "").trim(); }
  async function lerDadosFluxo(rotulo, ano, mes, tk, urlOpt) {
    var url = String(urlOpt || urlFluxo() || "").trim();
    if (url.indexOf("http") !== 0) throw new Error("Cole a URL do fluxo NPE-Ler-Dados-Book (botão ⚙ Fluxo do Book).");
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: tk.login, token: tk.token, os: rotulo, ano: ano, mes: mes }) });
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("O fluxo recusou o acesso (sessão expirada ou perfil sem permissão)."); }
    if (!r.ok) throw new Error("O fluxo NPE-Ler-Dados-Book respondeu " + r.status + ".");
    var j = await r.json();
    if (!j || j.ok !== true) throw new Error("O fluxo não devolveu os dados.");
    return { rh: norm(j.rh), ri: norm(j.ri), hist: norm(j.hist) };
  }
  function configurarFluxo() {
    var f = document.createElement("div");
    f.className = "bk-modal";
    f.innerHTML = '<div class="bk-modal-box"><h3>Fluxo do Book</h3><p>Cole a URL do gatilho do fluxo <b>NPE-Ler-Dados-Book</b>. Ela fica só neste navegador.</p>' +
      '<input type="password" id="bkUrlFluxo" placeholder="https://..." value=""><p style="font-size:12px;color:#5B6B82">' + (urlFluxo() ? "Já existe uma URL gravada; colar outra substitui." : "Nenhuma URL gravada ainda.") +
      '</p><div class="bk-modal-bt"><button type="button" id="bkUrlCancelar" class="bk-bt sec">Fechar</button><button type="button" id="bkUrlOk" class="bk-bt">Gravar</button></div></div>';
    document.body.appendChild(f);
    function fim() { try { document.body.removeChild(f); } catch (e) {} }
    el("bkUrlCancelar").onclick = fim;
    el("bkUrlOk").onclick = function () {
      var v = String(el("bkUrlFluxo").value || "").trim();
      if (v.indexOf("https://") !== 0) { toast("URL inválida."); return; }
      A.gravarSegredoIA("npe_flow_ler_dados_book_url", v);
      toast("URL do fluxo do Book gravada neste navegador.");
      fim(); render();
    };
  }

  // ------------------------------------------------------------------ coleta da OS selecionada
  function contratoDa(os) {
    var cat = window.ACTIVE_CONTRACTS_CATALOG || [];
    for (var i = 0; i < cat.length; i++) if (A.extractPrimaryOSCode(cat[i].code) === os) return cat[i];
    return null;
  }
  function ata(os, tid, m, tipo) {
    var db = window.ATA_COMENTARIOS_DB && window.ATA_COMENTARIOS_DB[os] && window.ATA_COMENTARIOS_DB[os][String(tid)];
    if (!db) return "";
    var r = db.filter(function (x) { return x.tipo === (tipo || "PERFORMANCE") && x.mes === m; })[0];
    var t = r ? String(r.comentario || "").trim() : "";
    return t === "Sem parecer registrado" ? "" : t;
  }
  function primeiraLinha(t) { return String(t || "").split("\n")[0].trim(); }
  var SCORE = { 1: "t1", 2: "t2", 4: "t4", 6: "t6", 7: "t7", 8: "t8", 9: "t9", 10: "t10", 11: "t11", 12: "t12", 13: "t13", 14: "t14", 15: "t15", 16: "t16", 17: "t17", 19: "t19", 20: "t20" };
  // A situacao do mes vem da CAIXA: a primeira linha do parecer gravado traz "Mes: ATENDEU / NAO ATENDEU /
  // nao avaliado", escrita pelo codigo a partir dos valores da caixa. So sem parecer cai na nota calculada.
  function statusCaixa(os, m, id) {
    var l = primeiraLinha(ata(os, id, m));
    var r = l.match(/M\u00eas:\s*(N\u00c3O ATENDEU|N\u00c3O atendeu|ATENDEU|n\u00e3o avaliado)/i);
    if (!r) return "";
    var t = r[1].toUpperCase();
    return t.indexOf("N\u00c3O AT") === 0 ? "bad" : t.indexOf("ATENDEU") === 0 ? "ok" : "na";
  }
  function statusMes(contract, m, id, os) {
    var cx = os ? statusCaixa(os, m, id) : "";
    if (cx) return cx;
    var sc = SCORE[id]; if (!sc) return "";
    try {
      var tp = window.calculateOSScore(contract, m).topics[sc];
      if (!tp) return "";
      if (!tp.applicable) return "na";
      return tp.earned >= tp.max - 0.01 ? "ok" : "bad";
    } catch (e) { return ""; }
  }

  function montarSeries(dados, mes) {
    var S = { meses: [] }, i, m;
    for (m = 1; m <= mes; m++) S.meses.push(m);
    var rh = {}; (dados.rh || []).forEach(function (r) { rh[parseInt(r.MesNo, 10)] = r; });
    function col(k, f) { return S.meses.map(function (mm) { var r = rh[mm]; var v = r ? r[k] : null; return v == null ? null : (f ? f(v) : v); }); }
    S.rh = { efet: col("efetFolha"), hht: col("hht"), he: col("hePct", function (v) { return v * 100; }), abs: col("absPct", function (v) { return v * 100; }),
      adm: col("adm"), dem: col("dem"), demTurn: col("demTurnover"), ativos: col("ativosFim"), tIn: col("transfEntra"), tOut: col("transfSai"),
      fat: col("fat"), res: col("res"), perdaPR: col("perdaPR") };
    var r1 = rh[S.meses[S.meses.length - 1]] || {};
    S.rh.ferSaldo = r1.feriasSaldoHoje == null ? null : r1.feriasSaldoHoje;
    S.rh.fer45 = r1.ferias45Hoje == null ? null : r1.ferias45Hoje;
    // Receita Ideal: mes x motivo
    var ideal = S.meses.map(function () { return 0; }), perda = S.meses.map(function () { return 0; }), tem = false, mot = {};
    (dados.ri || []).forEach(function (r) {
      var mm = parseInt(r.mes, 10); var ix = S.meses.indexOf(mm); if (ix < 0) return;
      tem = true;
      var p = (r.ideal || 0) - (r.medido || 0);
      ideal[ix] += r.ideal || 0; perda[ix] += p;
      var k = String(r.motivo || "(SEM JUSTIFICATIVA)");
      mot[k] = mot[k] || S.meses.map(function () { return 0; }); mot[k][ix] += p;
    });
    if (tem) {
      var lista = Object.keys(mot).map(function (k) { return [k, mot[k], mot[k].reduce(function (a, b) { return a + b; }, 0)]; }).sort(function (a, b) { return b[2] - a[2]; });
      var top = lista.slice(0, 5).filter(function (x) { return x[2] > 0; });
      var demais = perda.map(function (t, ix) { return t - top.reduce(function (s, x) { return s + x[1][ix]; }, 0); });
      S.ri = { ideal: ideal, perda: perda, top: top.map(function (x) { return [x[0], x[1].map(Math.round)]; }), demais: demais.map(Math.round),
        todos: lista.slice(0, 12).map(function (x) { return [x[0], Math.round(x[2])]; }) };
    }
    // historico
    S.anos = []; S.sat = []; S.satMeta = null; S.assert = null;
    var dm = S.meses.map(function () { return null; }), ac = S.meses.map(function () { return null; }), temA = false;
    (dados.hist || []).forEach(function (r) {
      if (r.tipo === "PERDA") { if (r.v1 != null && r.v1 !== 0) S.anos.push([String(r.ref), r.v1 || 0, r.v2 || 0, r.v3 || 0]); }
      else if (r.tipo === "SAT") S.sat.push([String(r.ref), r.v1, r.v2]);
      else if (r.tipo === "SATMETA") S.satMeta = r.v1;
      else if (r.tipo === "ASSERT") { var ix = S.meses.indexOf(parseInt(r.ref, 10)); if (ix >= 0) { dm[ix] = r.v1 == null ? null : r.v1 * 100; ac[ix] = r.v2 == null ? null : r.v2 * 100; temA = true; } }
    });
    S.anos.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });
    S.sat.sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });
    if (temA) S.assert = { dmarg: dm, acum: ac };
    return S;
  }

  function coletarOS(os, ano, mes, dados) {
    var contract = contratoDa(os);
    if (!contract || !contract.monthHistory) throw new Error("Os dados da OS " + os + " não chegaram ao app. Selecione uma única OS no Power BI.");
    var H = hier()[os] || {};
    var p0 = A.primeiroMesPreenchido ? A.primeiroMesPreenchido(os) : 1;
    var mesesVal = A.mesesValidadosDaOS ? A.mesesValidadosDaOS(os, mes) : [];
    var S = montarSeries(dados, mes);
    var md = contract.monthHistory[mes] || {};
    // Valores das caixas: vem na URL so para o mes selecionado; fora dele, o historico mensal.
    var P = params(), cx = (mes === mesAtivo());
    function num(t) {
      if (t == null) return null; t = String(t).trim(); if (!t || t === "-") return null;
      var neg = /^\(.*\)$/.test(t) || t.charAt(0) === "-";
      t = t.replace(/[()R$\s%a-zA-Z]/g, "").replace(/^-/, "").replace(/\./g, "").replace(",", ".");
      var v = parseFloat(t); return isNaN(v) ? null : (neg ? -v : v);
    }
    var kpi = {
      fatAno: cx ? num(P.get("FatRealAno")) : md.fatAnoRealV, fatMeta: cx ? num(P.get("FatExecAno")) : md.fatAnoExecV,
      resAno: cx ? num(P.get("ResRealAno")) : md.resAnoRealV, resMeta: cx ? num(P.get("ResExecAno")) : md.resAnoExecV,
      margReal: cx && num(P.get("MargReal")) != null ? num(P.get("MargReal")) / 100 : null,
      margMeta: cx && num(P.get("MargExec")) != null ? num(P.get("MargExec")) / 100 : null,
      perdaAcum: cx && num(P.get("PerdaAcum")) != null ? num(P.get("PerdaAcum")) : md.perdaAcumV, perdaPct: md.perdaPctAcum, absAcum: md.absenteismoAcumPct, absMeta: md.absenteismoMetaPct,
      turnAcum: md.turnoverAcumPct, assertAcum: S.assert ? S.assert.acum[S.assert.acum.length - 1] : null,
      heMes: S.rh.he[S.rh.he.length - 1], heMedia: null
    };
    var hs = S.rh.he.filter(function (v) { return v != null; });
    if (hs.length) kpi.heMedia = hs.reduce(function (a, b) { return a + b; }, 0) / hs.length;
    var inds = [];
    CATS.forEach(function (c) {
      c.ids.forEach(function (id) {
        var strip = "", m;
        for (m = 1; m <= mes; m++) strip += (m < p0) ? "-" : ({ ok: "A", bad: "N", na: "V" }[statusMes(contract, m, id, os)] || "-");
        var s = statusMes(contract, mes, id, os);
        var caixa = primeiraLinha(ata(os, id, mes));
        inds.push({ id: id, nome: NOME[id], cat: c.cat, st: s || "na", strip: strip,
          pill: s === "ok" ? "ATENDEU" : s === "bad" ? "NÃO ATENDEU" : "NÃO AVALIADO",
          val: caixa.replace(/\s\|\s/g, " · ").slice(0, 260) });
      });
    });
    return { contract: contract, H: H, p0: p0, mesesVal: mesesVal, S: S, kpi: kpi, inds: inds };
  }

  // ------------------------------------------------------------------ prompt da OS
  function linhaSerie(arr, f) { return arr.map(function (v, i) { return MES[i + 1] + " " + (v == null ? "–" : (f ? f(v) : fmt(v))); }).join(" · "); }
  function promptOS(os, ano, mes, C) {
    var S = C.S, k = C.kpi, L = [];
    L.push("Você é o analista sênior do Setor de Performance da NPE. Escreva o BOOK da OS " + os + " (" + (C.H.desc || "") + "): um relatório gerencial que conta a história do contrato de janeiro a " + MESF[mes] + "/" + ano + ", passando por todos os indicadores, com leitura estratégica.");
    L.push("");
    L.push("REGRAS");
    L.push("1. Use SOMENTE os números e fatos dos DADOS. Não invente valor, percentual, data, nome, causa ou evento. Sem registro, diga que não há registro.");
    L.push("2. Escreva os números como estão nos DADOS (R$ 1.234.567; 12,81%). Valores em R$ podem ser arredondados para mil ou milhão (R$ 1,82 mi; R$ 160,8 mil).");
    L.push("3. Indicador bom: diga o que sustenta o resultado e recomende manter a mesma gestão. Indicador ruim: os principais problemas, com números, e um caminho concreto e mensurável para melhorar.");
    L.push("4. Relacione os indicadores entre si: movimentação de efetivo (admissões, demissões, transferências), horas extras, absenteísmo, férias acumuladas, perda de receita (Receita Ideal por motivo x PR) e resultado. Mesmo com margem boa, aponte onde ainda há ganho.");
    L.push("5. Meses não validados pelo Máster entram na análise; não trate o parecer desses meses como definitivo.");
    L.push("6. Português do Brasil, tom executivo e direto, frases curtas. Sem listas dentro dos textos; **negrito** só para 1 ou 2 números-chave por texto.");
    L.push("7. 'orcamento' é para o Setor de Orçamento revisar o orçamento na renovação do contrato: traga tudo o que os indicadores mostram que o preço precisa considerar (absenteísmo, turnover, HE, perdas por motivo, treinamento, férias, efetivo, satisfação, assertividade, pendências contratuais), cada item com o número que o sustenta.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push('{"resumo":"(600 a 1000 caracteres: a história do contrato até o mês)","prioridades":[{"rank":"AGIR PRIMEIRO","titulo":"(até 60 caracteres)","texto":"(até 300 caracteres)"},{"rank":"EM SEGUIDA","titulo":"","texto":""},{"rank":"EM SEGUIDA","titulo":"","texto":""}],' +
      '"receita":"(até 900 caracteres: onde a receita se perde, por ano e por motivo, Receita Ideal x PR)","pessoas":"(até 900 caracteres: efetivo, movimentação, horas, HE, absenteísmo, férias)",' +
      '"indicadores":{' + C.inds.map(function (x) { return '"' + x.id + '":{"leitura":"(até 450 caracteres)","caminho":"(até 350 caracteres)"}'; }).join(",") + '},' +
      '"orcamento":[{"titulo":"(até 40 caracteres)","valor":"(até 30 caracteres, o número)","texto":"(até 300 caracteres)"}  (de 6 a 10 itens)]}');
    L.push("");
    L.push("DADOS");
    L.push("Contrato: " + os + " | " + (C.H.desc || "") + " | Negócio " + (C.H.neg || "–") + " | Gerente " + (C.H.ger || "–") + " | Superintendente " + (C.H.sup || "–"));
    L.push("Período: janeiro a " + MESF[mes] + "/" + ano + ". Primeiro mês com acompanhamento: " + (C.p0 <= 12 ? MESF[C.p0] : "nenhum") + ". Meses validados pelo Máster: " + (C.mesesVal.length ? C.mesesVal.map(function (x) { return MES[x]; }).join(", ") : "nenhum") + ".");
    L.push("Faturamento do ano (caixa #1): real " + brl(k.fatAno) + " | meta " + brl(k.fatMeta) + ". Resultado do ano (caixa #2): real " + brl(k.resAno) + " | meta " + brl(k.resMeta) +
      " | margem real " + pct(k.margReal != null ? k.margReal : (k.fatAno ? k.resAno / k.fatAno : null)) + " | margem meta " + pct(k.margMeta != null ? k.margMeta : (k.fatMeta ? k.resMeta / k.fatMeta : null)) + ".");
    L.push("Perda de receita acumulada (PR): " + brl(k.perdaAcum) + " (" + pct(k.perdaPct) + "). Absenteísmo acumulado " + pct(k.absAcum) + " (referência " + pct(k.absMeta) + "). Turnover acumulado " + pct(k.turnAcum) + ".");
    L.push("");
    L.push("RH MÊS A MÊS (folha, ponto e cadastro):");
    L.push("Efetivo da folha: " + linhaSerie(S.rh.efet));
    L.push("Admissões: " + linhaSerie(S.rh.adm) + " | Demissões: " + linhaSerie(S.rh.dem) + " | Demissões que contam no turnover: " + linhaSerie(S.rh.demTurn));
    L.push("Transferências de entrada: " + linhaSerie(S.rh.tIn) + " | de saída: " + linhaSerie(S.rh.tOut));
    L.push("Ativos no fim do mês (cadastro): " + linhaSerie(S.rh.ativos));
    L.push("HHT realizado (h): " + linhaSerie(S.rh.hht) + " | % HE: " + linhaSerie(S.rh.he, function (v) { return fmt(v, 1) + "%"; }) + " | % absenteísmo: " + linhaSerie(S.rh.abs, function (v) { return fmt(v, 1) + "%"; }));
    L.push("Faturamento do mês: " + linhaSerie(S.rh.fat, function (v) { return "R$ " + fmt(v); }) + " | Perda PR do mês: " + linhaSerie(S.rh.perdaPR, function (v) { return "R$ " + fmt(v); }));
    L.push("Férias (posição de hoje, sem histórico): saldo " + fmt(S.rh.ferSaldo) + " dias | pessoas com 45 dias ou mais: " + fmt(S.rh.fer45) + ".");
    if (S.ri) {
      L.push("");
      L.push("RECEITA IDEAL (detalhe da perda de receita, por mês):");
      L.push("Receita ideal: " + linhaSerie(S.ri.ideal, function (v) { return "R$ " + fmt(v); }));
      L.push("Perda: " + linhaSerie(S.ri.perda, function (v) { return "R$ " + fmt(v); }) + " | % sobre o ideal: " + S.ri.perda.map(function (p, i) { return MES[i + 1] + " " + (S.ri.ideal[i] ? fmt(p / S.ri.ideal[i] * 100, 1) + "%" : "–"); }).join(" · ") + " (referência 4%)");
      L.push("Perda por motivo no período: " + S.ri.todos.map(function (x) { return x[0] + " R$ " + fmt(x[1]); }).join("; "));
      S.ri.top.forEach(function (x) { L.push("  " + x[0] + " por mês: " + linhaSerie(x[1], function (v) { return "R$ " + fmt(v); })); });
    } else { L.push(""); L.push("RECEITA IDEAL: sem registro para esta OS no período."); }
    if (S.anos.length) { L.push(""); L.push("PERDA DE RECEITA POR ANO (PR): " + S.anos.map(function (a) { return a[0] + " R$ " + fmt(a[1]) + " (" + (a[2] ? fmt(a[1] / a[2] * 100, 1) + "% do faturamento" : "–") + ", " + a[3] + " meses com perda)"; }).join("; ")); }
    if (S.assert) { L.push("ASSERTIVIDADE (diferença de margem real x FCST anterior, em p.p.; assertivo se dentro de ±5): " + linhaSerie(S.assert.dmarg, function (v) { return fmt(v, 2); }) + " | % assertividade acumulada: " + linhaSerie(S.assert.acum, function (v) { return fmt(v, 1) + "%"; })); }
    L.push("SATISFAÇÃO DO CLIENTE (pesquisas, todos os anos): " + (S.sat.length ? S.sat.map(function (s) { return s[0] + " " + pct(s[1], 1) + " (meta " + pct(s[2], 1) + ")"; }).join("; ") : "nenhuma pesquisa registrada") + ". Meta do ano atual: " + pct(S.satMeta, 1) + ".");
    L.push("");
    L.push("INDICADORES (situação mês a mês: A=atendeu, N=não atendeu, V=não avaliado, -=sem apuração; caixa = valores do último mês; pareceres dos últimos meses):");
    C.inds.forEach(function (x) {
      L.push("#" + x.id + " " + x.nome + " | situação " + x.strip.split("").map(function (c, i) { return MES[i + 1] + ":" + c; }).join(" ") + " | caixa: " + (x.val || "–"));
      for (var m = Math.max(1, mes - 2); m <= mes; m++) {
        var p = ata(os, x.id, m); if (p) L.push("  parecer " + MES[m] + ": " + p.replace(/\s+/g, " ").slice(0, 700));
      }
      var g = ata(os, x.id, mes, "GESTOR"); if (g) L.push("  justificativa do gestor em " + MES[mes] + ": " + g.replace(/\s+/g, " ").slice(0, 400));
      var ra = window.RESUMOS_ANUAIS && window.RESUMOS_ANUAIS[os] && window.RESUMOS_ANUAIS[os].resumos && window.RESUMOS_ANUAIS[os].resumos[String(x.id)];
      if (ra && (ra.t || typeof ra === "string")) L.push("  resumo anual (Aba 3): " + String(ra.t || ra).replace(/\s+/g, " ").slice(0, 500));
    });
    var obs = ata(os, 23, mes); if (obs) L.push("#23 Observações gerais (" + MES[mes] + "): " + obs.replace(/\s+/g, " ").slice(0, 800));
    L.push("");
    L.push("SÍNTESE DO MÊS (#24), mês a mês:");
    for (var m2 = 1; m2 <= mes; m2++) { var s24 = ata(os, 24, m2); if (s24) L.push("[" + MESF[m2] + "] " + s24.replace(/\s+/g, " ").slice(0, 1800)); }
    return L.join("\n");
  }

  function extrairJSON(txt) {
    var t = String(txt || "").replace(/```json|```/g, "");
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b <= a) throw new Error("A IA não devolveu um JSON.");
    return JSON.parse(t.slice(a, b + 1));
  }
  function conferirOS(j, inds) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    if (!j.resumo || String(j.resumo).length < 200) falta.push("resumo");
    if (!Array.isArray(j.prioridades) || j.prioridades.length < 3) falta.push("prioridades");
    if (!j.receita) falta.push("receita");
    if (!j.pessoas) falta.push("pessoas");
    if (!Array.isArray(j.orcamento) || j.orcamento.length < 4) falta.push("orcamento");
    inds.forEach(function (x) { var o = j.indicadores && j.indicadores[String(x.id)]; if (!o || !o.leitura || !o.caminho) falta.push("indicador #" + x.id); });
    return falta;
  }

  async function gerarOS(opts) {
    opts = opts || {};
    var os = osAtiva(), ano = anoAtivo();
    var mes = Math.min(mesAtivo() || 12, A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 12);
    if (!os) throw new Error("Selecione uma única OS no Power BI.");
    if (!(mes >= 1)) throw new Error("Nenhum mês fechado em " + ano + ".");
    progresso("Carregando a ATA e a hierarquia…");
    if (A.garantirHierarquia) await A.garantirHierarquia();
    if (!window.HISTORICO_PRONTO && A.carregarHistoricoCompleto) await A.carregarHistoricoCompleto();
    if (!window.HISTORICO_PRONTO) throw new Error("O histórico da ATA não carregou. Tente de novo.");
    if (A.carregarResumosAnuais && !window.RESUMOS_ANUAIS) { try { await A.carregarResumosAnuais(); } catch (e) {} }
    var H = hier()[os] || {};
    // O agente do fechamento manda login e senha (ou o token) e a URL do fluxo; na tela, pede a senha.
    var tk;
    if (opts.token) tk = { login: opts.login, token: opts.token };
    else if (opts.login && opts.senha) {
      var aa = await A.autenticarAcesso(opts.login, opts.senha);
      if (!aa.ok || String(aa.token || "").length !== 64) throw new Error(aa.erro || "O login do agente nao gerou token.");
      tk = { login: String(opts.login).toLowerCase().trim(), token: aa.token };
    } else tk = await obterToken();
    progresso("Lendo RH, Receita Ideal e histórico (NPE-Ler-Dados-Book)…");
    var dados = await lerDadosFluxo(H.rotulo || os, ano, mes, tk, opts.urlFluxo);
    var C = coletarOS(os, ano, mes, dados);
    var prompt = promptOS(os, ano, mes, C);
    progresso("A IA está escrevendo o book (" + Math.round(prompt.length / 1000) + " mil caracteres de dados)…");
    var j = null, falta = ["tudo"], tent = 0;
    while (falta.length && tent < 2) {
      var p = tent === 0 ? prompt : prompt + "\n\nATENÇÃO: na resposta anterior faltaram ou vieram vazios: " + falta.join(", ") + ". Devolva o JSON COMPLETO.";
      var txt = await A.chamarGerarTexto("gpt41", p);
      try { j = extrairJSON(txt); falta = conferirOS(j, C.inds); } catch (e) { falta = ["JSON válido"]; }
      tent++;
    }
    if (falta.length) throw new Error("A IA não completou o book (faltou: " + falta.join(", ") + ").");
    var s = A.sessaoAcesso ? A.sessaoAcesso() : null;
    var book = {
      v: 1, nivel: "os", os: os, rotulo: H.rotulo || os, desc: H.desc || C.contract.name || "", neg: H.neg || "", ger: H.ger || "", sup: H.sup || "",
      ano: ano, mes: mes, em: new Date().toISOString(), por: s ? s.login : "", p0: C.p0, mesesVal: C.mesesVal,
      kpi: C.kpi, S: C.S, inds: C.inds.map(function (x) { var o = j.indicadores[String(x.id)] || {}; x.ler = String(o.leitura || ""); x.cam = String(o.caminho || ""); return x; }),
      txt: { resumo: j.resumo, prioridades: j.prioridades.slice(0, 3), receita: j.receita, pessoas: j.pessoas, orcamento: j.orcamento.slice(0, 10) }
    };
    if (opts.gravar === false) return book;
    progresso("Gravando no SharePoint…");
    await gravar("os", os, book);
    return book;
  }

  // ------------------------------------------------------------------ gráficos (SVG em texto)
  function lbl(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" font-size="' + (o.s || 10.5) + '" font-weight="' + (o.w || 700) + '" fill="' + (o.c || COR.ink) + '"' +
      (o.halo === false ? "" : ' stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"') + ">" + t + "</text>";
  }
  function fr(W, H, m) { return { W: W, H: H, m: m, iw: W - m.l - m.r, ih: H - m.t - m.b }; }
  function grade(f, max, step, fv, y0, hh) { var s = ""; for (var v = 0; v <= max + 1e-9; v += step) { var y = y0 + hh - (v / max) * hh; s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y + '" y2="' + y + '" stroke="' + COR.line + '"/><text x="' + (f.m.l - 6) + '" y="' + (y + 3.5) + '" text-anchor="end" font-size="10" fill="' + COR.muted + '">' + fv(v) + "</text>"; } return s; }
  function eixoX(f, rot) { var bw = f.iw / rot.length; return rot.map(function (r, i) { return '<text x="' + (f.m.l + bw * i + bw / 2) + '" y="' + (f.H - 6) + '" text-anchor="middle" font-size="10.5" fill="' + COR.muted + '">' + r + "</text>"; }).join(""); }
  function svg(f, s, aria) { return '<svg viewBox="0 0 ' + f.W + " " + f.H + '" role="img" aria-label="' + esc(aria) + '">' + s + "</svg>"; }
  function spark(vals) {
    vals = (vals || []).filter(function (v) { return v != null; }); if (vals.length < 2) return "";
    var w = 120, h = 26, p = 3, mn = Math.min.apply(null, vals), mx = Math.max.apply(null, vals), r = (mx - mn) || 1;
    var x = function (i) { return p + i * (w - 2 * p) / (vals.length - 1); }, y = function (v) { return h - p - (v - mn) / r * (h - 2 * p); };
    var d = vals.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(" ");
    return '<svg viewBox="0 0 ' + w + " " + h + '" class="bk-spark" aria-hidden="true"><path d="' + d + " L" + x(vals.length - 1) + " " + h + " L" + x(0) + " " + h + ' Z" fill="' + COR.soft + '"/><path d="' + d + '" fill="none" stroke="' + COR.navy2 + '" stroke-width="1.5"/><circle cx="' + x(vals.length - 1) + '" cy="' + y(vals[vals.length - 1]) + '" r="2.6" fill="' + COR.navy + '"/></svg>';
  }
  function chAnos(anos) {
    var f = fr(640, 260, { l: 44, r: 10, t: 36, b: 36 }), n = anos.length, bw = f.iw / n, base = f.m.t + f.ih;
    var max = niceMax(Math.max.apply(null, anos.map(function (a) { return a[1] / 1000; })) * 1.05);
    var s = grade(f, max, max / 4, function (v) { return fmt(v); }, f.m.t, f.ih);
    anos.forEach(function (a, i) {
      var h = a[1] / 1000 / max * f.ih, x = f.m.l + bw * i + bw * 0.22, w = bw * 0.56;
      s += '<rect x="' + x + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" rx="3" fill="' + (i === n - 1 ? COR.red : COR.pr) + '"/>';
      s += lbl(x + w / 2, base - h - 19, "R$ " + fmt(a[1] / 1000) + " mil", { s: 12.5 });
      s += lbl(x + w / 2, base - h - 5, a[2] ? fmt(a[1] / a[2] * 100, 1) + "% do fat." : "", { s: 10, w: 600, c: COR.muted });
      s += '<text x="' + (x + w / 2) + '" y="' + (f.H - 20) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + COR.ink + '">' + a[0] + '</text><text x="' + (x + w / 2) + '" y="' + (f.H - 7) + '" text-anchor="middle" font-size="9.5" fill="' + COR.muted + '">' + a[3] + " meses com perda</text>";
    });
    return svg(f, s, "Perda por ano");
  }
  function chRiPr(meses, ri, pr) {
    var f = fr(1100, 250, { l: 44, r: 10, t: 20, b: 22 }), n = meses.length, bw = f.iw / n, base = f.m.t + f.ih;
    var max = niceMax(Math.max.apply(null, ri.concat(pr).map(function (v) { return (v || 0) / 1000; })) * 1.08);
    var sc = function (v) { return (v || 0) / 1000 / max * f.ih; };
    var s = grade(f, max, max / 4, function (v) { return fmt(v); }, f.m.t, f.ih);
    for (var i = 0; i < n; i++) {
      var x = f.m.l + bw * i, a = sc(ri[i]), b = sc(pr[i]), w = bw * 0.36;
      s += '<rect x="' + (x + bw * 0.12) + '" y="' + (base - a) + '" width="' + w + '" height="' + a + '" fill="' + COR.navy2 + '"/><rect x="' + (x + bw * 0.52) + '" y="' + (base - b) + '" width="' + w + '" height="' + b + '" fill="' + COR.pr + '"/>';
      if (ri[i] != null) s += lbl(x + bw * 0.12 + w / 2, base - a - 4, fmt(ri[i] / 1000), { s: 11.5, c: COR.navy2 });
      if (pr[i] != null) s += lbl(x + bw * 0.52 + w / 2, base - b - 4, fmt(pr[i] / 1000), { s: 11.5, c: "#5B6B8F" });
    }
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Receita Ideal x PR");
  }
  function chMotivos(meses, ri) {
    var f = fr(1100, 280, { l: 44, r: 10, t: 20, b: 22 }), n = meses.length, bw = f.iw / n, base = f.m.t + f.ih;
    var max = niceMax(Math.max.apply(null, ri.perda.map(function (v) { return v / 1000; })) * 1.08), sc = function (v) { return v / 1000 / max * f.ih; };
    var s = grade(f, max, max / 4, function (v) { return fmt(v); }, f.m.t, f.ih);
    for (var i = 0; i < n; i++) {
      var y = base, x = f.m.l + bw * i + bw * 0.2, w = bw * 0.6;
      var ser = ri.top.map(function (t, k) { return [t[1][i], CORES_MOTIVO[k], "#fff"]; }).concat([[ri.demais[i], "#CBD3E0", "#334155"]]);
      ser.forEach(function (z) { var h = sc(Math.max(0, z[0])); y -= h; if (h <= 0) return; s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + z[1] + '"/>'; if (z[0] >= max * 1000 * 0.05 && h >= 13) s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-size="10.5" font-weight="600" fill="' + z[2] + '">' + fmt(z[0] / 1000) + "</text>"; });
      s += lbl(x + w / 2, y - 6, fmt(ri.perda[i] / 1000), { s: 12 });
    }
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Perda por motivo");
  }
  function chMov(meses, rh) {
    var f = fr(560, 330, { l: 30, r: 12, t: 22, b: 22 }), n = meses.length, bw = f.iw / n, ex = function (i) { return f.m.l + bw * i + bw / 2; };
    var ef = rh.efet.filter(function (v) { return v != null; }); var emn = ef.length ? Math.min.apply(null, ef) : 0, emx = ef.length ? Math.max.apply(null, ef) : 1;
    var pad = Math.max(5, (emx - emn) * 0.15); emn -= pad; emx += pad;
    var topH = f.ih * 0.36, y0 = f.m.t, ey = function (v) { return y0 + topH - (v - emn) / ((emx - emn) || 1) * topH; };
    var s = '<text x="' + f.m.l + '" y="' + (y0 - 8) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">EFETIVO (FOLHA)</text>';
    var pts = []; rh.efet.forEach(function (v, i) { if (v != null) pts.push([ex(i), ey(v), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.navy + '" stroke-width="2.2"/>';
    pts.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.navy + '"/>' + lbl(p[0], p[1] - 9, fmt(p[2]), { s: 11, c: COR.navy }); });
    var b0 = y0 + topH + 30, hh = f.ih - topH - 30, mid = b0 + hh * 0.6, up = hh * 0.6 - 14, dn = hh * 0.4 - 14;
    var mmax = Math.max(1, Math.max.apply(null, rh.adm.concat(rh.dem).map(function (v) { return v || 0; })));
    s += '<text x="' + f.m.l + '" y="' + (b0 - 8) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">MOVIMENTAÇÃO DO MÊS</text><line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + mid + '" y2="' + mid + '" stroke="' + COR.muted + '" stroke-width=".7"/>';
    for (var i = 0; i < n; i++) {
      var x = f.m.l + bw * i + bw * 0.27, w = bw * 0.46, ad = rh.adm[i] || 0, de = rh.dem[i] || 0, a = ad / mmax * up, d = de / mmax * dn;
      s += '<rect x="' + x + '" y="' + (mid - a) + '" width="' + w + '" height="' + a + '" fill="' + COR.teal + '"/><rect x="' + x + '" y="' + mid + '" width="' + w + '" height="' + d + '" fill="' + COR.red + '"/>';
      s += lbl(x + w / 2, mid - a - 4, "+" + ad, { s: 10.5, c: COR.okfg }) + lbl(x + w / 2, mid + d + 12, "−" + de, { s: 10.5, c: COR.badfg });
    }
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Efetivo e movimentação");
  }
  function chHHT(meses, rh) {
    var f = fr(560, 330, { l: 30, r: 12, t: 22, b: 22 }), n = meses.length, bw = f.iw / n, ex = function (i) { return f.m.l + bw * i + bw / 2; };
    var he = rh.he.filter(function (v) { return v != null; }); var hmn = he.length ? Math.min.apply(null, he) : 0, hmx = he.length ? Math.max.apply(null, he) : 1;
    hmn = Math.max(0, hmn - 1.5); hmx += 1.5;
    var topH = f.ih * 0.36, y0 = f.m.t, hy = function (v) { return y0 + topH - (v - hmn) / ((hmx - hmn) || 1) * topH; };
    var s = '<text x="' + f.m.l + '" y="' + (y0 - 8) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">% HORA EXTRA</text>';
    var pts = []; rh.he.forEach(function (v, i) { if (v != null) pts.push([ex(i), hy(v), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.orange + '" stroke-width="2.2"/>';
    pts.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.orange + '"/>' + lbl(p[0], p[1] - 9, fmt(p[2], 1) + "%", { s: 10.5, c: COR.warnfg }); });
    var b0 = y0 + topH + 30, bh = f.ih - topH - 30, base = b0 + bh;
    var max = niceMax(Math.max.apply(null, rh.hht.map(function (v) { return (v || 0) / 1000; })) * 1.05);
    s += '<text x="' + f.m.l + '" y="' + (b0 - 8) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">HHT REALIZADO (MIL H)</text>';
    for (var i = 0; i < n; i++) {
      var v = rh.hht[i]; if (v == null) continue;
      var x = f.m.l + bw * i + bw * 0.2, w = bw * 0.6, h = v / 1000 / max * bh;
      s += '<rect x="' + x + '" y="' + (base - h) + '" width="' + w + '" height="' + h + '" rx="2" fill="' + COR.hht + '"/>' + lbl(x + w / 2, base - h + (h > 22 ? 15 : -5), fmt(v / 1000, 1), { s: 10.5, c: COR.navy, halo: h <= 22 });
    }
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "HHT e hora extra");
  }
  function chAssert(meses, a) {
    var f = fr(620, 330, { l: 34, r: 12, t: 24, b: 22 }), n = meses.length, bw = f.iw / n, ex = function (i) { return f.m.l + bw * i + bw / 2; };
    var topH = 84, ay = function (v) { return f.m.t + topH - ((v - 40) / 60) * (topH - 22); };
    var s = '<text x="' + f.m.l + '" y="' + (f.m.t - 10) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">% ASSERTIVIDADE ACUMULADA NO ANO</text>';
    var pts = []; a.acum.forEach(function (v, i) { if (v != null) pts.push([ex(i), ay(Math.max(40, v)), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.navy + '" stroke-width="2.2"/>';
    pts.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.navy + '"/>' + lbl(p[0], p[1] - 9, fmt(p[2], p[2] % 1 ? 1 : 0) + "%", { s: 10.5, c: COR.navy }); });
    var vals = a.dmarg.filter(function (v) { return v != null; });
    var mn = Math.min(-10, Math.floor(Math.min.apply(null, vals.concat([0])) / 5) * 5 - 3), mx = Math.max(10, Math.ceil(Math.max.apply(null, vals.concat([0])) / 5) * 5 + 3);
    var b0 = f.m.t + topH + 34, bh = f.ih - topH - 34, y = function (v) { return b0 + (mx - v) / (mx - mn) * bh; }, z = y(0);
    s += '<text x="' + f.m.l + '" y="' + (b0 - 12) + '" font-size="10" font-weight="600" fill="' + COR.muted + '">DIFERENÇA DE MARGEM REAL x FCST (p.p.) · faixa verde = assertivo (±5 p.p.)</text>';
    s += '<rect x="' + f.m.l + '" y="' + y(5) + '" width="' + f.iw + '" height="' + (y(-5) - y(5)) + '" fill="' + COR.okbg + '"/>';
    [mn, Math.round(mn / 2), 0, mx].forEach(function (v) { s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (v === 0 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="' + COR.muted + '">' + fmt(v) + "</text>"; });
    a.dmarg.forEach(function (v, i) {
      if (v == null) { s += lbl(ex(i), z - 6, "sem FCST", { s: 9.5, w: 600, c: COR.muted }); return; }
      var ok = Math.abs(v) <= 5, top = Math.min(y(v), z), h = Math.abs(y(v) - z);
      s += '<rect x="' + (f.m.l + bw * i + bw * 0.25) + '" y="' + top + '" width="' + (bw * 0.5) + '" height="' + Math.max(h, 1.5) + '" fill="' + (ok ? COR.teal : COR.red) + '"/>';
      s += lbl(ex(i), v >= 0 ? y(v) - 5 : y(v) + 13, (v > 0 ? "+" : "") + fmt(v, 2), { s: 10.5, c: ok ? COR.okfg : COR.badfg });
    });
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Assertividade mês a mês");
  }
  function chSat(sat, metaAtual, anoAtual) {
    var lista = sat.map(function (x) { return [x[0].slice(0, 4), x[1] * 100, x[2] * 100]; });
    if (metaAtual != null && !lista.some(function (x) { return x[0] === String(anoAtual); })) lista.push([String(anoAtual), null, metaAtual * 100]);
    var f = fr(420, 200, { l: 30, r: 8, t: 22, b: 22 }), n = lista.length, bw = f.iw / n, base = f.m.t + f.ih;
    var mn = 50, mx = 100, y = function (v) { return f.m.t + (mx - v) / (mx - mn) * f.ih; };
    var s = ""; [60, 70, 80, 90, 100].forEach(function (v) { s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + COR.line + '"/><text x="' + (f.m.l - 5) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="' + COR.muted + '">' + v + "</text>"; });
    lista.forEach(function (z, i) {
      var x = f.m.l + bw * i + bw * 0.22, w = bw * 0.56;
      if (z[1] != null) s += '<rect x="' + x + '" y="' + y(z[1]) + '" width="' + w + '" height="' + (base - y(z[1])) + '" rx="2" fill="' + (z[1] >= z[2] ? COR.teal : COR.pr) + '"/>' + lbl(x + w / 2, y(z[1]) - 5, fmt(z[1], 1) + "%", { s: 10.5, c: COR.navy });
      else s += '<text x="' + (x + w / 2) + '" y="' + (base - 6) + '" text-anchor="middle" font-size="9.5" fill="' + COR.muted + '">sem pesquisa</text>';
      if (z[2] != null) s += '<line x1="' + (x - 3) + '" x2="' + (x + w + 3) + '" y1="' + y(z[2]) + '" y2="' + y(z[2]) + '" stroke="' + COR.red + '" stroke-width="2"/>';
    });
    s += lbl(f.W - f.m.r - 2, f.m.t + 10, "— meta", { a: "end", s: 9.5, c: COR.badfg, w: 600 });
    return svg(f, s + eixoX(f, lista.map(function (x) { return x[0]; })), "Satisfação do cliente por ano");
  }

  // ------------------------------------------------------------------ desenho do book da OS
  function stripHtml(s) {
    var M = { A: "ok", N: "bad", V: "na" };
    return '<div class="bk-strip">' + String(s || "").split("").map(function (c, i) { return '<span class="' + (M[c] || "") + '" title="' + MES[i + 1] + '"></span>'; }).join("") + "<em>jan → " + MES[String(s || "").length] + "</em></div>";
  }
  function renderBookOS(b) {
    var S = b.S, k = b.kpi, t = b.txt, h = [];
    var valid = (b.mesesVal || []).length;
    h.push('<header class="bk-capa"><div><div class="bk-eyebrow">Book do contrato · acumulado do acompanhamento</div><h1>' + esc(b.rotulo.replace("|", " + ")) + " - " + esc(b.desc) + '</h1><div class="bk-chips">' +
      [b.neg].filter(Boolean).map(function (c) { return '<span class="bk-chip">' + esc(c) + "</span>"; }).join("") + '</div><div class="bk-periodo">Período analisado: <b>jan a ' + MES[b.mes] + "/" + b.ano + "</b> (" + b.mes + " meses fechados) · Meses validados pelo Máster: <b>" + valid + " de " + Math.max(0, b.mes - (b.p0 > 1 ? b.p0 - 1 : 0)) + "</b>" +
      (valid ? "" : ", a leitura usa os pareceres ainda não validados") + '.</div></div><dl class="bk-ficha"><dt>Gerente</dt><dd>' + esc(b.ger || "–") + "</dd><dt>Superintendente</dt><dd>" + esc(b.sup || "–") + "</dd><dt>Gerado em</dt><dd>" +
      esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + "</dd><dt>Por</dt><dd>" + esc(b.por || "–") + "</dd></dl></header>");
    var marg = k.margReal != null ? k.margReal : (k.fatAno ? k.resAno / k.fatAno : null), margMeta = k.margMeta != null ? k.margMeta : (k.fatMeta ? k.resMeta / k.fatMeta : null);
    function kpi(cls, l, v, s, sp) { return '<div class="bk-kpi ' + cls + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s + "</span>" + (sp || "") + "</div>"; }
    h.push('<section class="bk-card bk-sec"><h2>A história até ' + MESF[b.mes] + ' <span class="sub">resumo executivo</span></h2><p class="bk-lead">' + rico(t.resumo) + '</p><div class="bk-kpis">' +
      kpi(k.fatAno >= k.fatMeta ? "ok" : "bad", "Faturamento ano", mi(k.fatAno), "meta " + mi(k.fatMeta) + (k.fatMeta ? " · " + (k.fatAno >= k.fatMeta ? "+" : "") + fmt((k.fatAno / k.fatMeta - 1) * 100, 2) + "%" : "")) +
      kpi(k.resAno >= k.resMeta ? "ok" : "bad", "Resultado ano", mi(k.resAno), "margem " + pct(marg) + " · meta " + pct(margMeta)) +
      kpi("bad", "Perda de receita", "R$ " + mi(k.perdaAcum), pct(k.perdaPct) + " do faturamento", spark(S.rh.perdaPR)) +
      kpi(k.assertAcum != null && k.assertAcum >= 80 ? "ok" : "warn", "Assertividade acum.", k.assertAcum == null ? "–" : fmt(k.assertAcum, 1) + "%", "diferença de margem real x FCST", S.assert ? spark(S.assert.acum) : "") +
      kpi("warn", "Hora extra " + MES[b.mes], k.heMes == null ? "–" : fmt(k.heMes, 1) + "%", "média do ano " + (k.heMedia == null ? "–" : fmt(k.heMedia, 1) + "%"), spark(S.rh.he)) +
      kpi(k.absAcum != null && k.absMeta != null && k.absAcum <= k.absMeta ? "ok" : "bad", "Absenteísmo ano", pct(k.absAcum), "referência " + pct(k.absMeta), spark(S.rh.abs)) + "</div>");
    h.push('<div class="bk-prior">' + (t.prioridades || []).map(function (p) { return "<div><span class=\"rank\">" + esc(p.rank || "") + "</span><h3>" + esc(p.titulo || "") + "</h3><p>" + rico(p.texto || "") + "</p></div>"; }).join("") + "</div></section>");
    // receita
    var rx = [];
    if (S.anos && S.anos.length) {
      var tot = S.anos.reduce(function (a, x) { return a + x[1]; }, 0), ult = S.anos[S.anos.length - 1];
      rx.push('<div class="bk-g3"><div class="bk-chart"><h4>Perda por ano (PR)</h4><div class="cap">R$ mil · % sobre o faturamento do período · ' + ult[0] + " até " + MES[b.mes] + "</div>" + chAnos(S.anos) + "</div><div class=\"bk-acum\">" +
        '<div><span class="l">Perda até ' + MES[b.mes] + "/" + b.ano + " · PR</span><b>" + brl(ult[1]) + "</b><span>" + (ult[2] ? fmt(ult[1] / ult[2] * 100, 2) + "% do faturamento de jan a " + MES[b.mes] : "") + "</span></div>" +
        (S.ri ? '<div><span class="l">Perda até ' + MES[b.mes] + "/" + b.ano + " · Receita Ideal</span><b>" + brl(S.ri.perda.reduce(function (a, v) { return a + v; }, 0)) + "</b><span>" + fmt(S.ri.perda.reduce(function (a, v) { return a + v; }, 0) / (S.ri.ideal.reduce(function (a, v) { return a + v; }, 0) || 1) * 100, 2) + "% da receita ideal (referência 4%)</span></div>" : "") +
        '<div><span class="l">Desde ' + S.anos[0][0] + " (PR)</span><b>" + brl(tot) + "</b><span>" + S.anos.map(function (a) { return a[0] + " (" + a[3] + " meses)"; }).join(" + ") + "</span></div></div></div>");
    }
    if (S.ri) {
      rx.push('<div class="bk-chart" style="margin-top:14px"><h4>Perda por mês em ' + b.ano + ': Receita Ideal x PR</h4><div class="cap">R$ mil · a PR é o valor que alimenta o indicador #6</div>' + chRiPr(S.meses, S.ri.perda, S.rh.perdaPR) +
        '<div class="bk-leg"><span><i style="background:' + COR.navy2 + '"></i>Receita Ideal</span><span><i style="background:' + COR.pr + '"></i>PR (painel)</span></div></div>');
      rx.push('<div class="bk-chart" style="margin-top:14px"><h4>Perda por motivo, mês a mês (Receita Ideal, ' + b.ano + ')</h4><div class="cap">R$ mil · os maiores motivos do período; o resto somado em "demais"</div>' + chMotivos(S.meses, S.ri) +
        '<div class="bk-leg">' + S.ri.top.map(function (x, i) { return '<span><i style="background:' + CORES_MOTIVO[i] + '"></i>' + esc(x[0].charAt(0) + x[0].slice(1).toLowerCase()) + " · R$ " + fmt(x[1].reduce(function (a, v) { return a + v; }, 0) / 1000) + " mil</span>"; }).join("") +
        '<span><i style="background:#CBD3E0"></i>Demais · R$ ' + fmt(S.ri.demais.reduce(function (a, v) { return a + v; }, 0) / 1000) + " mil</span></div></div>");
    } else rx.push('<p class="bk-vazio">A Receita Ideal não tem registro desta OS no período.</p>');
    h.push('<section class="bk-card bk-sec"><h2>Onde a receita se perde <span class="sub">perda em valor · por ano e por motivo</span></h2>' + rx.join("") + '<p class="bk-texto">' + rico(t.receita) + "</p></section>");
    // pessoas
    h.push('<section class="bk-card bk-sec"><h2>Pessoas, horas e movimentação <span class="sub">valores realizados · cadastro, rescisões, transferências, folha e ponto</span></h2><div class="bk-g2"><div class="bk-chart"><h4>Efetivo e movimentação</h4><div class="cap">Em cima: efetivo da folha · embaixo: admissões e demissões do mês</div>' + chMov(S.meses, S.rh) +
      '<div class="bk-leg"><span><i style="background:' + COR.navy + '"></i>Efetivo folha</span><span><i style="background:' + COR.teal + '"></i>Admissões</span><span><i style="background:' + COR.red + '"></i>Demissões</span></div></div><div class="bk-chart"><h4>Horas trabalhadas e hora extra</h4><div class="cap">Em cima: % de HE sobre as horas normais · embaixo: HHT realizado (mil h)</div>' + chHHT(S.meses, S.rh) +
      '<div class="bk-leg"><span><i style="background:' + COR.orange + '"></i>% HE</span><span><i style="background:' + COR.hht + '"></i>HHT realizado</span></div></div></div><p class="bk-texto">' + rico(t.pessoas) + "</p>");
    var tin = S.rh.tIn.reduce(function (a, v) { return a + (v || 0); }, 0), tout = S.rh.tOut.reduce(function (a, v) { return a + (v || 0); }, 0);
    h.push('<div class="bk-ferias"><div><b>' + (S.rh.ferSaldo == null ? "–" : fmt(S.rh.ferSaldo) + " dias") + "</b><span>saldo de férias hoje, posição atual (sem histórico mensal)</span></div><div><b>" + (S.rh.fer45 == null ? "–" : fmt(S.rh.fer45) + " pessoas") + "</b><span>com 45 dias ou mais de saldo de férias</span></div><div><b>" + tin + " entradas · " + tout + " saídas</b><span>transferências entre OSs no ano</span></div></div></section>");
    // indicadores
    var cards = CATS.map(function (c) {
      var its = b.inds.filter(function (x) { return x.cat === c.cat; });
      return '<div class="bk-cat"><h3>' + esc(c.cat) + '</h3><div class="bk-inds">' + its.map(function (x) {
        var grafico = (x.id === 4 && S.assert) ? chAssert(S.meses, S.assert) : (x.id === 17 && S.sat && (S.sat.length || S.satMeta != null)) ? chSat(S.sat, S.satMeta, b.ano) : "";
        var corpo = (x.ler ? '<div class="bl"><strong>Leitura</strong>' + rico(x.ler) + "</div>" : "") + (x.cam ? '<div class="bl cam"><strong>' + (x.st === "ok" ? "Manter" : "Caminho") + "</strong>" + rico(x.cam) + "</div>" : "");
        return '<article class="bk-ind ' + x.st + (grafico ? " wide" : "") + '"><div class="top"><span class="id">#' + x.id + '</span><span class="nome">' + esc(x.nome) + '</span><span class="bk-pill ' + x.st + '">' + esc(x.pill) + "</span></div>" +
          (x.val ? '<div class="val">' + esc(x.val) + "</div>" : "") + (grafico ? "" : stripHtml(x.strip)) + (grafico ? '<div class="duo"><div>' + grafico + '</div><div class="txts">' + corpo + "</div></div>" : corpo) + "</article>";
      }).join("") + "</div></div>";
    }).join("");
    h.push('<section class="bk-card bk-sec"><h2>Indicador por indicador <span class="sub">situação em ' + MESF[b.mes] + " · faixa = jan a " + MES[b.mes] + " · leitura e caminho</span></h2>" + cards + "</section>");
    h.push('<section class="bk-orc bk-sec"><span class="tag">Para o Orçamento · renovação</span><h2>O que considerar na revisão do orçamento</h2><div class="bk-orcgrid">' +
      (t.orcamento || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.titulo || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(o.texto || "") + "</p></div>"; }).join("") + "</div></section>");
    h.push('<div class="bk-fontes">Fontes: ATA_COMENTARIO (pareceres e sínteses), modelo RESULTADOS (folha, ponto, FCST, perdas, satisfação, cadastro, rescisões, transferências, férias) e RECEITA IDEAL. Os números dos indicadores são os das caixas do app; os textos foram escritos por IA a partir deles.</div>');
    return h.join("");
  }

  // ------------------------------------------------------------------ tela
  var _prog = "";
  function progresso(t) { _prog = t; var p = el("bkProgresso"); if (p) { p.style.display = t ? "block" : "none"; p.textContent = t; } }
  function osPermitidas() {
    var lista = [];
    try { lista = master() ? A.tab5OSElegiveis() : A.tab5OSDoUsuario(); } catch (e) { lista = []; }
    return lista || [];
  }
  async function render() {
    var box = el("tabBookContainer"); if (!box) return;
    if (A.garantirHierarquia) { try { await A.garantirHierarquia(); } catch (e) {} }
    var lista = osPermitidas();
    var os = st.sel.os || osAtiva();
    st.sel.os = os;
    var atual = lista.filter(function (o) { return o.codigo === os; })[0];
    var rotSel = os ? esc(os + (atual && atual.desc ? " - " + atual.desc : "")) : "Selecione uma OS";
    var itens = lista.map(function (o) {
      return '<button type="button" class="bk-dd-it' + (o.codigo === os ? " on" : "") + '" data-action="book:os:' + esc(o.codigo) + '" data-busca="' + esc((o.codigo + " " + (o.desc || "")).toUpperCase()) + '">' + esc(o.codigo + (o.desc ? " - " + o.desc : "")) + "</button>";
    }).join("");
    var osSlicer = osAtiva();
    var podeGerar = master() && osSlicer && os === osSlicer;
    var dica = !osSlicer ? "Filtre uma única OS no Power BI para gerar o book dela" : (os !== osSlicer ? "Para gerar, selecione esta OS no filtro do Power BI" : "");
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span><div class="bk-tabs">' +
      '<button type="button" class="' + (st.nivel === "os" ? "on" : "") + '" data-action="book:nivel:os">OS</button><button type="button" disabled title="Em construção">Gerência</button><button type="button" disabled title="Em construção">Superintendência</button></div>' +
      '<div class="bk-dd"><span class="bk-dd-rot">OS</span><button type="button" class="bk-dd-btn" data-action="book:dd" aria-haspopup="listbox">' + rotSel + '</button>' +
      '<div class="bk-dd-pan" id="bkDdPan" style="display:none"><input type="text" id="bkDdBusca" placeholder="Buscar por código ou nome…" autocomplete="off"><div class="bk-dd-lista" id="bkDdLista" role="listbox">' + (itens || '<p class="bk-dd-vazio">Nenhuma OS disponível.</p>') + "</div></div></div>" +
      (master() ? '<span class="bk-acoes"><button type="button" class="bk-bt sec" data-action="book:fluxo">⚙ Fluxo do Book</button><button type="button" class="bk-bt" data-action="book:gerar"' + (podeGerar ? "" : ' disabled title="' + esc(dica) + '"') + ">🤖 Gerar / atualizar book desta OS</button></span>" : "") +
      '</div><div id="bkProgresso" class="bk-prog" style="display:none"></div>' + (master() && dica ? '<div class="bk-dica">' + esc(dica) + ".</div>" : "") + '<div id="bkConteudo"><p class="bk-vazio">Carregando os books gravados…</p></div></div>';
    var busca = el("bkDdBusca");
    if (busca) busca.oninput = function () {
      var q = String(busca.value || "").toUpperCase().trim();
      Array.prototype.forEach.call(document.querySelectorAll("#bkDdLista .bk-dd-it"), function (b) { b.style.display = (!q || b.getAttribute("data-busca").indexOf(q) >= 0) ? "" : "none"; });
    };
    if (_prog) progresso(_prog);
    var c = el("bkConteudo"); if (!c) return;
    if (!os) { c.innerHTML = '<p class="bk-vazio">Escolha uma OS na lista para ver o book dela.</p>'; return; }
    try {
      var mapa = await lerNivel("os");
      var reg = mapa[os];
      c = el("bkConteudo"); if (!c) return;
      if (!reg) { c.innerHTML = '<p class="bk-vazio">Ainda não há book gravado para ' + esc(os) + "." + (master() ? " Para gerar, filtre esta OS no Power BI e use “Gerar / atualizar book desta OS”." : "") + "</p>"; return; }
      c.innerHTML = renderBookOS(reg.d);
    } catch (e) {
      var c2 = el("bkConteudo"); if (c2) c2.innerHTML = '<p class="bk-vazio">Não consegui ler os books: ' + esc(e.message || e) + "</p>";
    }
  }
  function abrirLista(abrir) {
    var pan = el("bkDdPan"); if (!pan) return;
    var vai = abrir == null ? pan.style.display === "none" : abrir;
    pan.style.display = vai ? "flex" : "none";
    if (vai) { var b = el("bkDdBusca"); if (b) { b.value = ""; b.oninput && b.oninput(); setTimeout(function () { try { b.focus(); } catch (e) {} }, 30); } }
  }
  document.addEventListener("click", function (ev) {
    var pan = el("bkDdPan"); if (!pan || pan.style.display === "none") return;
    if (ev.target.closest && ev.target.closest(".bk-dd")) return;
    pan.style.display = "none";
  });
  document.addEventListener("keydown", function (ev) { if (ev.key === "Escape") abrirLista(false); });
  async function acao(nome, alvo) {
    if (nome === "nivel:os") { st.nivel = "os"; render(); return; }
    if (nome === "dd") { abrirLista(); return; }
    if (nome.indexOf("os:") === 0) { st.sel.os = nome.slice(3); abrirLista(false); render(); return; }
    if (nome === "fluxo") { configurarFluxo(); return; }
    if (nome === "gerar") {
      if (st.carregando) return;
      st.carregando = true;
      try { await gerarOS({}); progresso(""); toast("✅ Book gravado."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; render(); }
    }
  }

  window.BOOK = { render: render, acao: acao, gerarOS: gerarOS, lerNivel: lerNivel, _promptOS: promptOS, _coletarOS: coletarOS, _montarSeries: montarSeries, _renderBookOS: renderBookOS };
})();
