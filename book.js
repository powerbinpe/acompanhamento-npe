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
  CSS += "\n.rl{background:#fff;border:1px solid #E3E8F2;border-radius:14px;padding:34px 44px;max-width:1080px;margin:0 auto;color:#1E293B;width:100%;box-sizing:border-box}\n.rl-capa{border-bottom:3px solid #14204A;padding-bottom:18px;margin-bottom:18px}\n.rl-capa-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#5B6B82}\n.rl-tag{color:#14204A;font-weight:700}\n.rl-capa h1{font-size:30px;color:#14204A;margin:8px 0 10px;line-height:1.15;text-wrap:balance}\n.rl-ficha{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:12.5px;color:#334155}\n.rl-manchete{font-size:19px!important;line-height:1.45!important;color:#0F172A;margin:16px 0 0!important;font-weight:600;border-left:4px solid #E5484D;padding-left:14px}\n.rl-nums{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:4px 0 8px}\n.rl-nums-g{background:#F5F7FD;border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}\n.rl-nums-g h3{grid-column:1/-1;margin:0;font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#5B6B82}\n.rl-num .l{display:block;font-size:11px;color:#5B6B82;font-weight:700}.rl-num .v{display:block;font-size:17px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}.rl-num .s{font-size:11.5px;color:#5B6B82}\n.rl-num.ok .v{color:#0B7A6C}.rl-num.bad .v{color:#B42318}\n.rl-cap{margin-top:26px}\n.rl-cap h2{font-size:19px;color:#14204A;display:flex;align-items:center;gap:10px;margin:0 0 12px;border-bottom:1px solid #E3E8F2;padding-bottom:8px}\n.rl-cap h2 span{display:inline-flex;width:28px;height:28px;border-radius:50%;background:#14204A;color:#fff;font-size:13px;align-items:center;justify-content:center;flex:none}\n.rl p{font-size:14.5px;line-height:1.75;margin:0 0 12px}\n.rl p b{color:#14204A}\n.rl-fig{margin:14px 0 18px;border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px}\n.rl-fig figcaption{font-size:12.5px;color:#14204A;margin-bottom:6px}.rl-fig figcaption span{display:block;color:#5B6B82;font-size:11.5px}\n.rl-duas{display:grid;grid-template-columns:1fr 1fr;gap:14px}.rl-duas .rl-fig{margin:6px 0}\n.rl-flex{display:flex;gap:16px;align-items:flex-start}.rl-lado{flex:0 0 380px}.rl-txt{flex:1;min-width:0}\n.rl-tab{overflow-x:auto}.rl-tab table{border-collapse:collapse;width:100%;font-size:12.5px;font-variant-numeric:tabular-nums}\n.rl-tab th{text-align:right;font-size:11px;color:#5B6B82;text-transform:uppercase;letter-spacing:.4px;padding:6px 8px;border-bottom:2px solid #E3E8F2;vertical-align:bottom}\n.rl-tab th:first-child,.rl-tab td:first-child{text-align:left}\n.rl-tab td{text-align:right;padding:6px 8px;border-bottom:1px solid #EEF1F6}\n.rl-tab td.neg{color:#B42318;font-weight:700}.rl-tab td.pos{color:#0B7A6C;font-weight:700}\n.rl .rl-nota{font-size:12px;color:#5B6B82;line-height:1.5;margin-top:8px}\n.rl-diag{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px}\n.rl-diag-c{border-radius:12px;padding:12px 14px}.rl-diag-c.ges{background:#FDF2F2;border:1px solid #F5C2C2}.rl-diag-c.orc{background:#F0F4FF;border:1px solid #C7D3F3}\n.rl-diag-c h4{margin:0 0 8px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#14204A}\n.rl-diag-c ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}\n.rl-diag-c li{font-size:13px;line-height:1.55;color:#334155}\n.rl-li-t{display:flex;justify-content:space-between;gap:8px}.rl-li-t b{color:#14204A}.rl-li-t span{font-weight:700;color:#B42318;white-space:nowrap}\n.rl-plano{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px}\n.rl-plano li{font-size:14px;line-height:1.6}.rl-plano li b{color:#14204A;display:block}.rl-plano li span{display:block;color:#334155}.rl-plano li em{font-style:normal;font-size:12px;color:#5B6B82}\n.rl-orc{border:2px solid #14204A;border-radius:14px;padding:16px 18px;background:linear-gradient(180deg,#F5F7FD,#fff)}\n.rl-alerta{background:#FFF6E5;border:1px solid #F0C36D;border-left:5px solid #E08A0B;border-radius:10px;padding:10px 14px;margin:0 0 14px;font-size:13.5px;line-height:1.55;color:#5C3D00}.rl-alerta b{display:block;color:#7A4B00;margin-bottom:2px}\n.rl .rl-veredito{font-size:15px;font-weight:600;color:#14204A;border-left:4px solid #14204A;padding-left:12px}\n.rl-anexo .bk-strip em{display:none}.rl-anexo td{vertical-align:middle}.rl-cx{text-align:left!important;font-size:11.5px;color:#334155;max-width:420px}\n@media (max-width:900px){.rl{padding:18px}.rl-nums,.rl-duas,.rl-diag{grid-template-columns:1fr}.rl-nums-g{grid-template-columns:1fr 1fr}.rl-flex{flex-direction:column}.rl-lado{flex:none;width:100%}}";
  (function () { var s = document.createElement("style"); s.id = "bkCss"; s.textContent = CSS; document.head.appendChild(s); })();

  var st = { nivel: "os", sel: { os: "", ger: "", sup: "" }, linhas: { os: null, ger: null, sup: null }, carregando: false, msg: "" };

  // ------------------------------------------------------------------ utilidades
  function el(id) { return document.getElementById(id); }
  function esc(t) { return String(t == null ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function rico(t) { return esc(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>"); }
  function fmt(v, d) { if (v == null || isNaN(v)) return "–"; return Number(v).toLocaleString("pt-BR", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 }); }
  // R$ 1.500.000 (sem centavos a partir de mil) | R$ 850,00 (com centavos abaixo de mil) | negativo entre parenteses
  function moeda(v) { if (v == null || isNaN(v)) return "–"; var a = Math.abs(v), t = a >= 1000 ? fmt(a, 0) : fmt(a, 2); return v < 0 ? "R$ (" + t + ")" : "R$ " + t; }
  function brl(v) { return moeda(v); }
  function mi(v) { return moeda(v); }
  function miAntigo(v) { if (v == null) return "–"; var a = Math.abs(v); var s = a >= 1e6 ? fmt(a / 1e6, 2) + " mi" : fmt(a / 1e3) + " mil"; return v < 0 ? "(" + s + ")" : s; }
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
  // URL do NPE-Ler-Dados-Book: padrao no codigo (o fluxo so responde com o token de sessao de Master/Proprietario);
  // a gravada no navegador, se houver, tem prioridade.
  var URL_FLUXO_PADRAO = "https://defaultdff5d80f6e7141999a3fbf5dc8891d.18.environment.api.powerplatform.com:443/powerautomate/automations/direct/cu/09/workflows/a6f581cd6acb433f94e2ac3155fc0665/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4Y51GJvXSLzYC0O-GMj_Ni9zwIc1F01sTImr61VOHS4";
  function urlFluxo() { return String((A.lerConfigIA ? A.lerConfigIA("npe_flow_ler_dados_book_url", "") : "") || URL_FLUXO_PADRAO).trim(); }
  function temChaveIA() {
    var c = String((A.lerConfigIA && A.lerConfigIA("npe_claude_api_key", "")) || ""), g = String((A.lerConfigIA && A.lerConfigIA("npe_gemini_api_key", "")) || "");
    return c.trim().length >= 20 || g.trim().length >= 20;
  }
  // Sem chave de IA no navegador, o book e gerado pelo agente da nuvem (mesmo fluxo do "Fechar o mes com IA").
  async function pedirAoAgente(os, etapas) {
    var url = A.urlIniciarAgente ? A.urlIniciarAgente() : "";
    if (url.indexOf("https://") !== 0) throw new Error("O fluxo NPE-Iniciar-Agente nao esta configurado.");
    var tk = await obterToken();
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: tk.login, token: tk.token, etapas: etapas || "aba6", ano: String(anoAtivo()), mes: "", gravar: true, refazer: true, permitir_mes_fechado: false, os: os || "" }) });
    var j = null; try { j = await r.json(); } catch (e) {}
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("Sem permiss\u00e3o para acionar o agente."); }
    if (!(r.ok && j && j.ok === true)) throw new Error("O GitHub recusou o pedido (c\u00f3digo " + ((j && j.status) || r.status) + ").");
    return true;
  }
  // bloco de OSs vai ao fluxo como "A|B" (o app mostra "A + B")
  function codigosBloco(rot) { return String(rot || "").split(/[|+]/).map(function (x) { return x.trim().toUpperCase(); }).filter(Boolean).join("|"); }
  async function lerDadosFluxo(rotulo, ano, mes, tk, urlOpt) {
    rotulo = codigosBloco(rotulo);
    var url = String(urlOpt || urlFluxo() || "").trim();
    if (url.indexOf("http") !== 0) throw new Error("Cole a URL do fluxo NPE-Ler-Dados-Book (botão ⚙ Fluxo do Book).");
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: tk.login, token: tk.token, os: rotulo, ano: ano, mes: mes }) });
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("O fluxo recusou o acesso (sessão expirada ou perfil sem permissão)."); }
    if (!r.ok) throw new Error("O fluxo NPE-Ler-Dados-Book respondeu " + r.status + ".");
    var j = await r.json();
    if (!j || j.ok !== true) throw new Error("O fluxo não devolveu os dados.");
    // fin = contabil numa tabela so: C = conta x mes (real, executivo, FCST anterior), E = eventos da folha (CT2), M = executivo/FCST do mes
    var custos = [], evt = [], mesx = [], proj = [], projx = [], fer = null, ctt = {};
    norm(j.fin).forEach(function (x) {
      if (x.tipo === "C") custos.push({ "Nível": x.a, "Sub Nível I": x.b, "C.Contabil - Descricao": x.c, MesNo: x.mes, r: x.r, e: x.e, f: x.f });
      else if (x.tipo === "E") evt.push({ "C.Contábil": x.a, "Histórico de Lançamento": x.c, MesNo: x.mes, v: x.r });
      else if (x.tipo === "M") mesx.push({ MesNo: x.mes, fe: x.r, re: x.e, ff: x.f, rf: x.g });
      else if (x.tipo === "P") proj.push({ m: x.mes, efet: x.r, hht: x.e, fat: x.f, res: x.g });
      else if (x.tipo === "Q") projx.push({ m: x.mes, fe: x.r, re: x.e });
      else if (x.tipo === "F") fer = { f30: x.r, f45: x.e, saldo: x.f };
      else if (x.tipo === "H") { var cc = String(x.b || "").toUpperCase(); ctt[cc] = ctt[cc] || {}; if (ctt[cc][x.a] == null) ctt[cc][x.a] = x.c == null ? "" : String(x.c); }
    });
    return { rh: norm(j.rh), ri: norm(j.ri), hist: norm(j.hist), custos: custos, evt: evt, mesx: mesx, proj: proj, projx: projx, fer: fer, ctt: ctt, ri2: norm(j.ri2) };
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
    S.rh = { efet: col("efetFolha"), efetPR: col("efetPR"), hht: col("hht"), hhtPR: col("hhtPR"), he: col("hePct", function (v) { return v * 100; }), abs: col("absPct", function (v) { return v * 100; }),
      adm: col("adm"), dem: col("dem"), demTurn: col("demTurnover"), ativos: col("ativosFim"), tIn: col("transfEntra"), tOut: col("transfSai"),
      fat: col("fat"), res: col("res"), perdaPR: col("perdaPR") };
    var r1 = rh[S.meses[S.meses.length - 1]] || {};
    S.rh.ferSaldo = r1.feriasSaldoHoje == null ? null : r1.feriasSaldoHoje;
    S.rh.fer45 = r1.ferias45Hoje == null ? null : r1.ferias45Hoje;
    S.rh.fer30 = r1.ferias30Hoje == null ? null : r1.ferias30Hoje;
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

  // A projecao do mes seguinte (EFETIVO PR / HHT PR) tem que refletir a movimentacao do ultimo mes fechado:
  // entrou mais gente do que saiu -> o efetivo projetado nao pode ficar abaixo do realizado (e vice-versa).
  function conferirProjecao(S, proj) {
    var i = S.meses.length - 1; if (i < 0 || !proj.length) return proj.length ? { meses: proj, alerta: null } : null;
    var m = S.meses[i], adm = S.rh.adm[i] || 0, dem = S.rh.dem[i] || 0, saldo = adm - dem;
    var efetR = S.rh.efet[i], hhtR = S.rh.hht[i], efetPRm = S.rh.efetPR ? S.rh.efetPR[i] : null, prox = proj[0];
    var a = { mes: m, prox: prox.m, adm: adm, dem: dem, efetReal: efetR, efetPRmes: efetPRm, hhtReal: hhtR, efetProj: prox.efet, hhtProj: prox.hht, problemas: [] };
    if (efetR != null && prox.efet != null) {
      if (saldo > 0 && prox.efet < efetR) a.problemas.push("entraram " + adm + " e saíram " + dem + " pessoas em " + MES[m] + ", o efetivo da folha fechou em " + fmt(efetR) + ", mas o EFETIVO PR de " + MES[prox.m] + " está em " + fmt(prox.efet));
      if (saldo < 0 && prox.efet > efetR) a.problemas.push("saíram " + dem + " e entraram " + adm + " pessoas em " + MES[m] + ", o efetivo da folha fechou em " + fmt(efetR) + ", mas o EFETIVO PR de " + MES[prox.m] + " está em " + fmt(prox.efet));
    }
    if (saldo > 0 && hhtR != null && prox.hht != null && prox.hht < hhtR) a.problemas.push("com mais gente, o HHT PR de " + MES[prox.m] + " (" + fmt(prox.hht) + " h) está abaixo do HHT realizado em " + MES[m] + " (" + fmt(hhtR) + " h)");
    var iguais = proj.length > 1 && proj.every(function (x) { return x.efet === proj[0].efet; });
    if (iguais && saldo !== 0) a.problemas.push("o EFETIVO PR está fixo em " + fmt(proj[0].efet) + " de " + MES[proj[0].m] + " a " + MES[proj[proj.length - 1].m] + ", sem refletir a movimentação");
    return { meses: proj, alerta: a.problemas.length ? a : null, base: a };
  }

  function coletarOS(os, ano, mes, dados) {
    var contract = contratoDa(os);
    if (!contract || !contract.monthHistory) throw new Error("Os dados da OS " + os + " não chegaram ao app. Selecione uma única OS no Power BI.");
    var H = hier()[os] || {};
    var p0 = A.primeiroMesPreenchido ? A.primeiroMesPreenchido(os) : 1;
    var mesesVal = A.mesesValidadosDaOS ? A.mesesValidadosDaOS(os, mes) : [];
    var S = montarSeries(dados, mes);
    S.fin = montarFin(dados, mes, S);
    if (dados.fer) { S.rh.fer30 = dados.fer.f30; S.rh.fer45 = dados.fer.f45; S.rh.ferSaldo = dados.fer.saldo; }
    S.proj = conferirProjecao(S, (dados.proj || []).slice().sort(function (a, b) { return a.m - b.m; }));
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

  // ------------------------------------------------------------------ prompt da OS (relatório v2)
  function linhaSerie(arr, f) { return arr.map(function (v, i) { return MES[i + 1] + " " + (v == null ? "–" : (f ? f(v) : fmt(v))); }).join(" · "); }
  function rs(v) { return moeda(v); }
  function cu(v) { return v == null ? "–" : moeda(Math.abs(v)); }
  function dif(v) { return v == null ? "–" : moeda(Math.abs(v)) + (v < 0 ? " a mais" : " a menos"); }
  function promptOS(os, ano, mes, C) {
    var S = C.S, k = C.kpi, fi = S.fin, an = analisarCustos(fi), L = [];
    function pf(v) { return fi && fi.FR ? fmt(v / fi.FR * 100, 2) + "%" : "–"; }
    L.push("Você é o controller sênior do Setor de Performance da NPE. Escreva o RELATÓRIO GERENCIAL da OS " + os + " (" + (C.H.desc || "") + ") de janeiro a " + MESF[mes] + "/" + ano + ".");
    L.push("É um relatório executivo em forma de narrativa: cada capítulo conta uma parte da mesma história e liga causa e efeito entre faturamento, custos, pessoas e contrato. Não é uma lista de indicadores.");
    L.push("");
    L.push("COMO ANALISAR");
    L.push("1. Proporcionalidade. O faturamento real ficou " + (an ? fmt((an.ratio - 1) * 100, 2) + "% " + (an.ratio >= 1 ? "acima" : "abaixo") : "–") + " do executivo. Se o volume cresce, o custo deve crescer na mesma proporção; a margem só cai se algum custo cresceu mais que o volume. Use a PONTE DA MARGEM (pontos que cada grupo tirou ou devolveu) e as CONTAS para dizer exatamente o que descolou e por quê.");
    L.push("2. Receita e custo sem faturamento em três efeitos, sempre em R$ e em % do faturamento: PERDAS (faturamento que não entrou por recurso indisponível, por motivo), SLA (desconto contratual direto no faturamento, por item e parâmetro) e NÃO FATURÁVEIS (custo de recursos que não geram faturamento, por função) Feche com o RESULTADO POTENCIAL: real + perdas (como faturamento) + SLA (desconto direto) + não faturáveis (custo de recurso que não fatura). Os DILUÍDOS são apenas informativos: cite se relevante, mas nunca some em conta nenhuma. A comparação Receita Ideal x PR é só conferência: cite em no máximo uma frase, sem destaque.");
    L.push("3. FCST mês a mês. Use a linha do tempo para explicar o ANO: o que os FCSTs do mês anterior prometeram de resultado, o que foi entregue e quais grupos explicam a diferença. Não descreva mês a mês; cite no máximo os 2 ou 3 meses decisivos.");
    L.push("4. Movimentação de efetivo. Admissão traz custo imediato (exames, EPIs, consumíveis) e o faturamento do recurso novo normalmente só aparece no mês seguinte (HHT e faturamento sobem). Se o HHT ou o faturamento não subiram depois das admissões, aponte. Demissão traz custo rescisório.");
    L.push("5. Encargos. Seguem o salário. Separe o que é automático do que foi provocado por demissão: rescisões, aviso prévio indenizado, multa de 40% do FGTS e FGTS de rescisão (tabela FOLHA e EVENTOS). Esses itens não são proporcionais ao salário.");
    L.push("6. Acúmulo de férias. Pessoas com 30 dias ou mais de saldo já têm direito a sair; as com 45 dias ou mais são o ponto de atenção. O acúmulo é o que amplia o custo do dissídio (o saldo de férias e 13º é recalculado retroativamente com o salário novo, no primeiro mês do dissídio) e da reoneração (retroativo dos encargos sobre as férias acumuladas). Use os sinais dos DADOS (verbas de dissídio no contábil, pico das provisões sobre o salário); quando for inferência, escreva 'provável'.");
    L.push("7. Dissídio e reoneração da folha (janeiro/" + (ano + 1) + ") são premissas básicas do orçamento: NÃO os trate como premissa a rever nem como item para o Orçamento. O que o orçamento não consegue prever é o tamanho do ACÚMULO DE FÉRIAS, que multiplica esses dois efeitos; é isso que deve ser apontado, com as pessoas com 30 e com 45 dias ou mais. Não estime valor que não esteja nos DADOS.");
    L.push("8. Para o ORÇAMENTO, as observações que importam são: absenteísmo e turnover altos (realidade do contrato e da região), custos que ficam acima do executivo de forma padronizada, mês após mês (use RECORRÊNCIA), e acúmulo de férias (30 e 45 dias ou mais). Cada observação com o número que a sustenta.");
    L.push("10. Projeção dos próximos meses. Faça a análise futura com os números que o contrato projetou (EFETIVO PR, HHT PR, faturamento e resultado projetados). Se houver ALERTA DE PROJEÇÃO, diga com clareza que a projeção não acompanha a movimentação do último mês e peça a correção: quem admitiu tem que projetar mais efetivo e HHT (e o faturamento correspondente); quem desligou, menos.");
    L.push("9. Gestão ou orçamento. Para cada causa, decida: é GESTÃO (o contrato controla: hora extra, absenteísmo, demissões evitáveis, perdas por falta de mão de obra, SLA, recursos sem faturar) ou é PREMISSA DE ORÇAMENTO (o preço não previu: custo estrutural não orçado ou que fica acima do executivo todo mês, absenteísmo e turnover da região). Seja assertivo. Se o problema é de gestão, o parecer ao Orçamento diz isso com todas as letras.");
    L.push("");
    L.push("REGRAS");
    L.push("- Use SOMENTE os números dos DADOS, escritos exatamente como neles: R$ 1.500.000 (sem centavos a partir de R$ 1.000), R$ 850,00 (com centavos abaixo de R$ 1.000), valores negativos entre parênteses, R$ (647.973), e percentuais sempre com duas casas, 10,00% e 1,00%. Nunca abrevie (nada de 'mi', 'mil' ou 'milhões'). Não invente valor, data, causa, nome ou evento; sem registro, diga que não há registro.");
    L.push("- Português do Brasil, tom executivo, frases curtas, sem listas dentro dos textos. Parágrafos separados por uma linha em branco. **Negrito** só para 1 ou 2 números-chave por texto.");
    L.push("- Não compare com orçado, PR ou meta um número que não tenha essa comparação nos DADOS.");
    L.push("- Custos são sempre escritos positivos (Hospedagem R$ 308.361; custou R$ 582.396 a mais que a proporção). Parênteses só para resultado ou margem negativos.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push('{"sumario":"(3 parágrafos, 900 a 1500 caracteres: receita, custo e o que fazer)",' +
      '"receita":"(2 parágrafos, até 1400 caracteres: perdas por motivo, SLA, não faturáveis, % do faturamento e resultado potencial; diluídos só como informação)",' +
      '"custos":"(2 ou 3 parágrafos, até 1700 caracteres: proporcionalidade, ponte da margem, contas, o que o FCST prometeu e não entregou)",' +
      '"pessoas":"(2 ou 3 parágrafos, até 1500 caracteres: efetivo, admissões/demissões e seus custos, HHT, HE, absenteísmo, faturamento do recurso novo e a coerência da projeção dos próximos meses)",' +
      '"eventos":"(até 1000 caracteres: rescisões e multa de 40%, encargos fora do padrão, acúmulo de férias (30 e 45 dias ou mais) e o efeito dele no dissídio e na reoneração ' + (ano + 1) + ')",' +
      '"ssma":"(até 700 caracteres: segurança, satisfação do cliente, boas práticas e renovação)",' +
      '"diagnostico":"(até 600 caracteres: a conclusão: quanto é gestão e quanto é orçamento)",' +
      '"gestao":[{"titulo":"(até 45 caracteres)","valor":"(até 25 caracteres, o número)","texto":"(até 260 caracteres)"}] (3 a 5 itens),' +
      '"premissas":[{"titulo":"","valor":"","texto":""}] (2 a 5 itens),' +
      '"plano":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres, com o ganho esperado se houver número nos DADOS)","acompanhar":"(até 90 caracteres)"}] (4 a 6 itens),' +
      '"parecerOrcamento":"(até 450 caracteres: o veredito para a renovação: o que considerar no preço, ou corrigir a gestão antes)",' +
      '"orcamento":[{"titulo":"(até 40 caracteres)","valor":"(até 30 caracteres)","texto":"(até 300 caracteres)"}] (5 a 8 itens: absenteísmo, turnover, custos acima do executivo de forma recorrente, acúmulo de férias e o que mais os DADOS sustentarem; dissídio e reoneração não entram como item)}');
    L.push("");
    L.push("DADOS");
    L.push("Contrato (CTT): " + (C.H.desc || os) + " | Negócio " + (C.H.neg || "–") + " | Gestor do contrato " + (C.H.gestor || "–") + " | Gerente " + (C.H.ger || "–") + " | Superintendente " + (C.H.sup || "–"));
    L.push("Período: janeiro a " + MESF[mes] + "/" + ano + ", analisado mês a mês. Todos os meses do período estão fechados; não comente fechamento, validação ou meses provisórios.");
    if (fi) {
      L.push("JAN A " + MES[mes].toUpperCase() + " (contábil): faturamento real " + rs(fi.FR) + " x executivo " + rs(fi.FE) + " | resultado real " + rs(fi.resReal) + " x executivo " + rs(fi.resExec) +
        " | margem real " + pct(fi.FR ? fi.resReal / fi.FR : null) + " x executivo " + pct(fi.FE ? fi.resExec / fi.FE : null) + ".");
    }
    L.push("PROJEÇÃO DO ANO (caixas #1 e #2: real até o mês + FCST até dezembro): faturamento " + rs(k.fatAno) + " x meta " + rs(k.fatMeta) + " | resultado " + rs(k.resAno) + " x meta " + rs(k.resMeta) + ".");
    if (an) {
      L.push("");
      L.push("PONTE DA MARGEM (pontos de margem por grupo; negativo = o grupo custou mais que a proporção do faturamento): " + an.grupos.map(function (g) { return g.nome + " " + (g.pp > 0 ? "+" : "") + fmt(g.pp, 2) + " p.p. (real " + cu(g.real) + ", orçado " + cu(g.exec) + ", na proporção " + cu(g.prop) + ")"; }).join("; ") + ".");
      if (fi.recorrentes && fi.recorrentes.length) L.push("RECORRÊNCIA (contas de custo acima do executivo de forma padronizada; meses acima / meses com valor | real | executivo): " + fi.recorrentes.map(function (x) { return x[0] + " (" + x[1] + "): " + x[2] + " de " + x[3] + " meses | " + cu(x[4]) + " | " + (x[5] ? cu(x[5]) : "não orçado"); }).join("; ") + ".");
      L.push("CONTAS QUE MAIS DESCOLARAM (custo real | orçado | orçado na proporção | quanto custou a mais ou a menos que a proporção):");
      an.contas.slice(0, 16).forEach(function (x) { L.push("  " + x.conta + ": " + cu(x.real) + " | " + (x.exec ? cu(x.exec) : "não orçado") + " | " + cu(x.prop) + " | " + dif(x.desvio)); });
    }
    if (fi && fi.receita) {
      var rc = fi.receita, perda = rc.perdaRI != null ? rc.perdaRI : rc.perdaPR, pot = fi.resReal + (perda || 0) + (rc.sla || 0) + (rc.nf || 0);
      L.push("");
      L.push("RECEITA E CUSTO SEM FATURAMENTO (jan a " + MES[mes] + "):");
      L.push("Perdas de receita " + (rc.perdaRI != null ? "(Receita Ideal) " : "(PR) ") + rs(perda) + " = " + pf(perda) + " do faturamento" + (rc.perdaRI != null ? " | conferência pela PR: " + rs(rc.perdaPR) : "") + ".");
      L.push("Descontos de SLA " + rs(rc.sla) + " = " + pf(rc.sla) + " do faturamento. Por mês: " + linhaSerie(rc.slaM, rs) + ". Itens: " + (rc.slaItens.length ? rc.slaItens.map(function (x) { return x[0] + " (" + x[1] + ", " + (x[4] != null ? fmt(x[4] * 100, 2) + "% de desconto, " : "") + x[3] + " meses) " + rs(x[2]); }).join("; ") : "nenhum") + ".");
      L.push("Recursos não faturáveis (custo) " + rs(rc.nf) + " = " + pf(rc.nf) + " do faturamento. Por mês: " + linhaSerie(rc.nfM, rs) + ". Funções: " + (rc.nfItens.length ? rc.nfItens.map(function (x) { return x[0] + " (" + x[1] + ", " + x[3] + " pessoa-mês) " + rs(x[2]); }).join("; ") : "nenhuma") + ".");
      if (rc.dil != null) L.push("Recursos diluídos (APENAS INFORMATIVO, não entram em nenhuma conta nem no resultado potencial) " + rs(rc.dil) + " = " + pf(rc.dil) + " do faturamento. Por mês: " + linhaSerie(rc.dilM, rs) + ". Funções: " + (rc.dilItens.length ? rc.dilItens.map(function (x) { return x[0] + " (" + x[1] + ", " + x[3] + " pessoa-mês) " + rs(x[2]); }).join("; ") : "nenhuma") + ".");
      L.push("RESULTADO POTENCIAL (real + perdas + SLA + não faturáveis; diluídos NÃO entram): " + rs(pot) + ", margem " + pct(fi.FR ? pot / fi.FR : null) + " (real " + pct(fi.FR ? fi.resReal / fi.FR : null) + ").");
    }
    if (S.ri) {
      L.push("Perda (Receita Ideal) por mês: " + linhaSerie(S.ri.perda, rs) + " | % sobre o ideal: " + S.ri.perda.map(function (p, i) { return MES[i + 1] + " " + (S.ri.ideal[i] ? fmt(p / S.ri.ideal[i] * 100, 2) + "%" : "–"); }).join(" · ") + " (referência 4%).");
      L.push("Perda por motivo no período: " + S.ri.todos.map(function (x) { return x[0] + " " + rs(x[1]); }).join("; ") + ".");
      S.ri.top.forEach(function (x) { L.push("  " + x[0] + " por mês: " + linhaSerie(x[1], rs)); });
    }
    if (S.anos.length) L.push("PERDA DE RECEITA POR ANO (PR): " + S.anos.map(function (a) { return a[0] + " " + rs(a[1]) + " (" + (a[2] ? fmt(a[1] / a[2] * 100, 2) + "% do faturamento" : "–") + ", " + a[3] + " meses com perda)"; }).join("; ") + ".");
    if (fi && fi.fc) {
      L.push("");
      L.push("FCST DO MÊS ANTERIOR x REALIZADO (para explicar o ano; diferença por grupo = realizado − FCST, negativo piora o resultado):");
      fi.fc.forEach(function (o) {
        if (o.resFc == null) { L.push("  " + MES[o.m] + ": sem FCST anterior | faturamento " + rs(o.fat) + " | resultado " + rs(o.res) + " | executivo do mês: faturamento " + rs(o.fatEx) + ", resultado " + rs(o.resEx)); return; }
        L.push("  " + MES[o.m] + ": faturamento " + rs(o.fat) + " x FCST " + rs(o.fatFc) + " | resultado " + rs(o.res) + " x FCST " + rs(o.resFc) + " (diferença " + rs(o.res - o.resFc) + ") | executivo do mês " + rs(o.resEx) +
          (o.causas && o.causas.length ? " | explicam: " + o.causas.map(function (x) { return x[0] + (x[1] < 0 ? " piorou " : " melhorou ") + moeda(Math.abs(x[1])); }).join(", ") : ""));
      });
      var pr = fi.promessa;
      if (pr && pr.meses.length) L.push("NO ANO (" + MES[pr.meses[0]] + " a " + MES[pr.meses[pr.meses.length - 1]] + "): os FCSTs somados prometeram " + rs(pr.fc) + " de resultado e o realizado foi " + rs(pr.res) + " (diferença " + rs(pr.res - pr.fc) + "). Por grupo: " +
        pr.grupos.slice().sort(function (a, b) { return a.v - b.v; }).map(function (x) { return x.nome + " " + (x.v < 0 ? "piorou " : "melhorou ") + moeda(Math.abs(x.v)); }).join("; ") + ".");
      if (S.assert) L.push("ASSERTIVIDADE (diferença de margem real x FCST anterior, em p.p.; assertivo se dentro de ±5): " + linhaSerie(S.assert.dmarg, function (v) { return fmt(v, 2); }) + " | % acumulada: " + linhaSerie(S.assert.acum, function (v) { return fmt(v, 2) + "%"; }));
    }
    if (fi && fi.folha) {
      var fo = fi.folha;
      L.push("");
      L.push("FOLHA NO CONTÁBIL, MÊS A MÊS (R$; custo em valor absoluto):");
      function ab(v) { return v == null ? "–" : moeda(Math.abs(v)); }
      L.push("Salário base (conta Salários): " + linhaSerie(fo.base, ab));
      L.push("Horas extras: " + linhaSerie(fo.he, ab));
      L.push("Conta Rescisões: " + linhaSerie(fo.resc, ab) + " | encargos e ajustes rescisórios em outras contas: " + linhaSerie(fo.rescOutras, function (v) { return fmt(-v); }) + " | dos quais multa de 40% do FGTS: " + linhaSerie(fo.multa40, ab));
      L.push("Encargos (total): " + linhaSerie(fo.enc, ab) + " | encargos sem os rescisórios ÷ salário base: " + linhaSerie(fo.encR, function (v) { return fmt(v * 100, 2) + "%"; }));
      L.push("Provisões (férias, 13º e encargos): " + linhaSerie(fo.prov, ab) + " | provisão de férias: " + linhaSerie(fo.provFer, ab) + " | provisão de 13º: " + linhaSerie(fo.prov13, ab) + " | provisões ÷ salário base: " + linhaSerie(fo.provR, function (v) { return fmt(v * 100, 2) + "%"; }));
      L.push("Picos de provisão sobre o salário (acima de 12% da mediana do ano): " + (fo.picosProv.length ? fo.picosProv.map(function (p) { return MES[p.m] + " " + fmt(p.ratio * 100, 2) + "% (mediana " + fmt(p.mediana * 100, 2) + "%, excesso " + rs(-p.excesso) + ")" + ((fo.provTop[p.m] || []).length ? ": " + fo.provTop[p.m].map(function (e) { return e[1] + " " + rs(e[2]); }).join("; ") : ""); }).join(" | ") : "nenhum") + ".");
      L.push("Picos de encargos sem rescisórios sobre o salário: " + (fo.picosEnc.length ? fo.picosEnc.map(function (p) { return MES[p.m] + " " + fmt(p.ratio * 100, 2) + "% (mediana " + fmt(p.mediana * 100, 2) + "%)"; }).join(" | ") : "nenhum") + ".");
      L.push("Lançamentos de dissídio ou diferença salarial no contábil: " + (fo.diss.length ? fo.diss.map(function (d) { return MES[d[0]] + " conta " + d[1] + " '" + d[2] + "' " + rs(d[3]); }).join("; ") : "nenhum") + ".");
      L.push("Exames médicos: " + linhaSerie(fo.exa, ab) + " | EPIs e uniformes: " + linhaSerie(fo.epi, ab) + " | materiais consumíveis: " + linhaSerie(fo.con, ab));
    }
    L.push("");
    L.push("PESSOAS MÊS A MÊS (folha, ponto e cadastro):");
    L.push("Efetivo da folha: " + linhaSerie(S.rh.efet) + " | ativos no fim do mês: " + linhaSerie(S.rh.ativos));
    L.push("Admissões: " + linhaSerie(S.rh.adm) + " | Demissões: " + linhaSerie(S.rh.dem) + " | que contam no turnover: " + linhaSerie(S.rh.demTurn) + " | transferências entrada/saída: " + linhaSerie(S.rh.tIn) + " / " + linhaSerie(S.rh.tOut));
    if (S.rh.hhtPR && S.rh.hhtPR.some(function (v) { return v != null; })) L.push("HHT da PR (h): " + linhaSerie(S.rh.hhtPR));
    // efeito das admissoes calculado aqui: a IA nao deduz tendencia de HHT/faturamento sozinha
    var efe = [];
    S.meses.forEach(function (m, i) {
      var a = S.rh.adm[i] || 0; if (a < 5) return;
      if (i + 1 >= S.meses.length) { efe.push(MES[m] + ": " + a + " admissões; o mês seguinte ainda não está fechado, efeito a confirmar"); return; }
      var h0 = S.rh.hht[i], h1 = S.rh.hht[i + 1], f0 = S.rh.fat[i], f1 = S.rh.fat[i + 1];
      efe.push(MES[m] + ": " + a + " admissões e " + (S.rh.dem[i] || 0) + " demissões; em " + MES[S.meses[i + 1]] + " o HHT " + (h0 && h1 != null ? (h1 >= h0 ? "subiu " : "caiu ") + fmt(Math.abs(h1 / h0 - 1) * 100, 2) + "%" : "–") +
        " e o faturamento " + (f0 && f1 != null ? (f1 >= f0 ? "subiu " : "caiu ") + fmt(Math.abs(f1 / f0 - 1) * 100, 2) + "%" : "–") + " sobre " + MES[m]);
    });
    if (efe.length) L.push("EFEITO DAS ADMISSÕES NO MÊS SEGUINTE (calculado; use estes números, não deduza outra tendência): " + efe.join(" | ") + ".");
    L.push("HHT realizado (h): " + linhaSerie(S.rh.hht) + " | % HE: " + linhaSerie(S.rh.he, function (v) { return fmt(v, 2) + "%"; }) + " | % absenteísmo: " + linhaSerie(S.rh.abs, function (v) { return fmt(v, 2) + "%"; }));
    L.push("Faturamento do mês: " + linhaSerie(S.rh.fat, rs));
    if (S.rh.efetPR && S.rh.efetPR.some(function (v) { return v != null; })) L.push("EFETIVO PR (projetado) nos meses fechados: " + linhaSerie(S.rh.efetPR));
    if (S.proj && S.proj.meses && S.proj.meses.length) {
      L.push("PROJEÇÃO LANÇADA PELO CONTRATO PARA OS PRÓXIMOS MESES (EFETIVO PR, HHT PR, faturamento e resultado projetados): " + S.proj.meses.map(function (x) { return MES[x.m] + ": efetivo " + fmt(x.efet) + ", HHT " + fmt(x.hht) + " h, faturamento " + rs(x.fat) + ", resultado " + rs(x.res); }).join(" | ") + ".");
      if (S.proj.alerta) L.push("ALERTA DE PROJEÇÃO (calculado): " + S.proj.alerta.problemas.join("; ") + ". Chame a atenção do gestor para corrigir a projeção (efetivo, HHT e o faturamento que vem com eles); sem isso a comparação do próximo mês fica errada.");
      else if (S.proj.base) L.push("CONFERÊNCIA DA PROJEÇÃO (calculado): a projeção de " + MES[S.proj.base.prox] + " está coerente com a movimentação de " + MES[S.proj.base.mes] + " (" + S.proj.base.adm + " admissões, " + S.proj.base.dem + " demissões).");
    }
    L.push("ACÚMULO DE FÉRIAS (posição de hoje): saldo " + fmt(S.rh.ferSaldo) + " dias | pessoas com 30 dias ou mais de saldo (já têm direito a sair de férias): " + fmt(S.rh.fer30) + " | pessoas com 45 dias ou mais (ponto de atenção): " + fmt(S.rh.fer45) + " | efetivo da folha no último mês: " + fmt(S.rh.efet[S.rh.efet.length - 1]) + ".");
    L.push("Perda PR acumulada " + rs(k.perdaAcum) + " (" + pct(k.perdaPct) + "). Absenteísmo acumulado " + pct(k.absAcum) + " (referência " + pct(k.absMeta) + "). Turnover acumulado " + pct(k.turnAcum) + ".");
    L.push("SATISFAÇÃO DO CLIENTE (todos os anos): " + (S.sat.length ? S.sat.map(function (s) { return s[0] + " " + pct(s[1], 1) + " (meta " + pct(s[2], 1) + ")"; }).join("; ") : "nenhuma pesquisa registrada") + ". Meta do ano: " + pct(S.satMeta, 1) + ".");
    L.push("");
    L.push("INDICADORES (A=atendeu, N=não atendeu, V=não avaliado, -=sem apuração; caixa = valores do último mês; parecer do último mês):");
    C.inds.forEach(function (x) {
      L.push("#" + x.id + " " + x.nome + " | " + x.strip.split("").map(function (ch, i) { return MES[i + 1] + ":" + ch; }).join(" ") + " | caixa: " + (x.val || "–"));
      var p = ata(os, x.id, mes); if (p) L.push("  parecer " + MES[mes] + ": " + p.replace(/\s+/g, " ").slice(0, 500));
      var g = ata(os, x.id, mes, "GESTOR"); if (g) L.push("  justificativa do gestor: " + g.replace(/\s+/g, " ").slice(0, 300));
    });
    var obs = ata(os, 23, mes); if (obs) L.push("#23 Observações gerais (" + MES[mes] + "): " + obs.replace(/\s+/g, " ").slice(0, 700));
    L.push("SÍNTESE DO MÊS (#24), últimos meses:");
    for (var m2 = Math.max(1, mes - 3); m2 <= mes; m2++) { var s24 = ata(os, 24, m2); if (s24) L.push("[" + MESF[m2] + "] " + s24.replace(/\s+/g, " ").slice(0, 1200)); }
    return L.join("\n");
  }

  function extrairJSON(txt) {
    var t = String(txt || "").replace(/```json|```/g, "");
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b <= a) throw new Error("A IA não devolveu um JSON.");
    return JSON.parse(t.slice(a, b + 1));
  }
  function conferirOS(j) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    ["receita", "custos", "pessoas", "eventos", "ssma", "diagnostico", "parecerOrcamento"].forEach(function (k) { if (!j[k] || String(j[k]).length < 40) falta.push(k); });
    if (!j.sumario || String(j.sumario).length < 400) falta.push("sumario");
    if (!Array.isArray(j.gestao) || j.gestao.length < 2) falta.push("gestao");
    if (!Array.isArray(j.premissas) || j.premissas.length < 1) falta.push("premissas");
    if (!Array.isArray(j.plano) || j.plano.length < 3) falta.push("plano");
    if (!Array.isArray(j.orcamento) || j.orcamento.length < 4) falta.push("orcamento");
    return falta;
  }

  async function gerarOS(opts) {
    opts = opts || {};
    var os = osAtiva(), ano = anoAtivo();
    var mes = opts.mes || mesAtivo() || (A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 12);
    if (!os) throw new Error("Selecione uma única OS no Power BI.");
    if (!(mes >= 1)) throw new Error("Selecione o mês no Power BI.");
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
    progresso("Lendo contábil, RH, Receita Ideal e histórico (NPE-Ler-Dados-Book)…");
    var dados = await lerDadosFluxo(H.rotulo || os, ano, mes, tk, opts.urlFluxo);
    var ct = (dados.ctt || {})[os];
    if (ct) { H = { rotulo: H.rotulo || os, desc: ct.desc || "", neg: ct.neg || "", ger: ct.gerente || "", sup: ct.sup || "", gestor: ct.gestor || "", ctt: true }; window.OS_HIER_CTT = window.OS_HIER_CTT || {}; window.OS_HIER_CTT[os] = H; }
    var C = coletarOS(os, ano, mes, dados);
    if (ct) C.H = H;
    var prompt = promptOS(os, ano, mes, C);
    progresso("A IA está escrevendo o book (" + Math.round(prompt.length / 1000) + " mil caracteres de dados)…");
    var j = null, falta = ["tudo"], tent = 0;
    while (falta.length && tent < 2) {
      var p = tent === 0 ? prompt : prompt + "\n\nATENÇÃO: na resposta anterior faltaram ou vieram vazios: " + falta.join(", ") + ". Devolva o JSON COMPLETO.";
      var txt = await A.chamarGerarTexto("gpt41", p);
      try { j = extrairJSON(txt); falta = conferirOS(j); } catch (e) { falta = ["JSON válido"]; }
      tent++;
    }
    if (falta.length) throw new Error("A IA não completou o book (faltou: " + falta.join(", ") + ").");
    var s = A.sessaoAcesso ? A.sessaoAcesso() : null;
    if (!C.S.fin) throw new Error("O fluxo NPE-Ler-Dados-Book não devolveu o contábil da OS (consulta de custos).");
    var book = {
      v: 2, nivel: "os", os: os, rotulo: H.rotulo || os, desc: H.desc || C.contract.name || "", descCtt: !!H.ctt, neg: H.neg || "", ger: H.ger || "", sup: H.sup || "", gestor: H.gestor || "",
      ano: ano, mes: mes, em: new Date().toISOString(), por: s ? s.login : "", p0: C.p0, mesesVal: C.mesesVal,
      kpi: C.kpi, S: C.S, inds: C.inds,
      txt: { sumario: j.sumario, receita: j.receita, custos: j.custos, pessoas: j.pessoas, eventos: j.eventos, ssma: j.ssma, diagnostico: j.diagnostico,
        gestao: j.gestao.slice(0, 5), premissas: j.premissas.slice(0, 5), plano: j.plano.slice(0, 6), parecerOrcamento: j.parecerOrcamento, orcamento: j.orcamento.slice(0, 10) }
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
      s += lbl(x + w / 2, base - h - 19, moeda(a[1]), { s: 12 });
      s += lbl(x + w / 2, base - h - 5, a[2] ? fmt(a[1] / a[2] * 100, 2) + "% do fat." : "", { s: 10, w: 600, c: COR.muted });
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
    var f = fr(1100, 280, { l: 62, r: 10, t: 20, b: 22 }), n = meses.length, bw = f.iw / n, base = f.m.t + f.ih;
    var max = niceMax(Math.max.apply(null, ri.perda.map(function (v) { return v / 1000; })) * 1.08), sc = function (v) { return v / 1000 / max * f.ih; };
    var s = grade(f, max, max / 4, function (v) { return fmt(v * 1000); }, f.m.t, f.ih);
    for (var i = 0; i < n; i++) {
      var y = base, x = f.m.l + bw * i + bw * 0.2, w = bw * 0.6;
      var ser = ri.top.map(function (t, k) { return [t[1][i], CORES_MOTIVO[k], "#fff"]; }).concat([[ri.demais[i], "#CBD3E0", "#334155"]]);
      ser.forEach(function (z) { var h = sc(Math.max(0, z[0])); y -= h; if (h <= 0) return; s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + z[1] + '"/>'; if (z[0] >= max * 1000 * 0.05 && h >= 13) s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-size="9" font-weight="600" fill="' + z[2] + '">' + moeda(z[0]) + "</text>"; });
      s += lbl(x + w / 2, y - 6, moeda(ri.perda[i]), { s: 11 });
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
    pts.forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.orange + '"/>' + lbl(p[0], p[1] - 9, fmt(p[2], 2) + "%", { s: 10.5, c: COR.warnfg }); });
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
      if (z[1] != null) s += '<rect x="' + x + '" y="' + y(z[1]) + '" width="' + w + '" height="' + (base - y(z[1])) + '" rx="2" fill="' + (z[1] >= z[2] ? COR.teal : COR.pr) + '"/>' + lbl(x + w / 2, y(z[1]) - 5, fmt(z[1], 2) + "%", { s: 10.5, c: COR.navy });
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
      kpi("bad", "Perda de receita", mi(k.perdaAcum), pct(k.perdaPct) + " do faturamento", spark(S.rh.perdaPR)) +
      kpi(k.assertAcum != null && k.assertAcum >= 80 ? "ok" : "warn", "Assertividade acum.", k.assertAcum == null ? "–" : fmt(k.assertAcum, 2) + "%", "diferença de margem real x FCST", S.assert ? spark(S.assert.acum) : "") +
      kpi("warn", "Hora extra " + MES[b.mes], k.heMes == null ? "–" : fmt(k.heMes, 2) + "%", "média do ano " + (k.heMedia == null ? "–" : fmt(k.heMedia, 2) + "%"), spark(S.rh.he)) +
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
        '<div class="bk-leg">' + S.ri.top.map(function (x, i) { return '<span><i style="background:' + CORES_MOTIVO[i] + '"></i>' + esc(x[0].charAt(0) + x[0].slice(1).toLowerCase()) + " · " + moeda(x[1].reduce(function (a, v) { return a + v; }, 0)) + "</span>"; }).join("") +
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

  // ================================================================== RELATORIO DA OS (v2)
  // Grupos de custo para a ponte da margem: pessoal aberto por subnivel (e o que mais pesa), o resto por nivel.
  // Receita operacional e provisao de receita ficam de fora: somam 100% do faturamento nos dois lados.
  // ------------------------------------------------------------------ análise financeira do relatório (v2)
  function grupoDaConta(nivel, sub) {
    var s = String(sub || ""), n = String(nivel || "");
    if (s.indexOf("3.1.1.1.") === 0 || s.indexOf("3.1.1.5.") === 0) return null;
    if (s.indexOf("4.1.1.1.") === 0) return "Salários";
    if (s.indexOf("4.1.1.2.") === 0) return "Encargos";
    if (s.indexOf("4.1.1.3.") === 0) return "Benefícios";
    if (s.indexOf("4.1.1.4.") === 0) return "Provisões";
    if (s.indexOf("4.1.1.9.") === 0) return "Apoio de pessoal";
    if (n.indexOf("4.1.2.") === 0) return "Materiais e EPIs";
    if (n.indexOf("4.1.3.") === 0) return "Serviços de terceiros";
    if (n.indexOf("4.1.4.") === 0) return "Locação";
    if (n.indexOf("4.1.6.") === 0 || n.indexOf("4.1.7.") === 0) return "Mobilização e canteiro";
    if (n.indexOf("4.1.5.") === 0 || n.indexOf("4.1.8.") === 0) return "Despesas gerais e taxas";
    if (s.indexOf("3.1.1.2.") === 0 || n.indexOf("3.2.1.") === 0) return "Deduções e impostos";
    if (n.indexOf("5.2.1.") === 0) return "Despesas financeiras";
    return "Demais";
  }
  function codConta(c) { var m = String(c || "").match(/^(\d{8})/); return m ? m[1] : ""; }
  function soma(a) { return (a || []).reduce(function (s, v) { return s + (v || 0); }, 0); }
  function mediana(a) { var b = a.filter(function (v) { return v != null && isFinite(v); }).sort(function (x, y) { return x - y; }); if (!b.length) return null; var h = Math.floor(b.length / 2); return b.length % 2 ? b[h] : (b[h - 1] + b[h]) / 2; }
  var RX_RESC = /RESCIS|MULTA 40|AV\.?\s?PREV|INDENIZ|MULTA CONTR/i, RX_DISS = /DISS[IÍ]DIO|DIF\.?\s?SALAR|RETROAT|REONER/i;

  // Junta o contabil (conta x mes: real, executivo, FCST anterior), os eventos de folha do CT2,
  // o executivo/FCST do mes e a Receita Ideal (nao faturaveis e SLA). Tudo o que e conta fica pronto aqui;
  // a IA recebe os numeros calculados.
  function montarFin(dados, mes, S) {
    var linhas = norm(dados.custos), evt = norm(dados.evt), mx = norm(dados.mesx), r2 = norm(dados.ri2);
    if (!linhas.length) return null;
    var meses = S.meses, rh = S.rh;
    function ix(m) { return meses.indexOf(parseInt(m, 10)); }
    function zeros() { return meses.map(function () { return 0; }); }
    function arred(a) { return a.map(function (v) { return v == null ? null : Math.round(v); }); }
    var mxm = {}; mx.forEach(function (r) { mxm[parseInt(r.MesNo, 10)] = r; });
    var temFc = meses.map(function (m) { return !!(mxm[m] && mxm[m].ff != null && mxm[m].ff !== 0); });
    var porSub = {}, porConta = {}, grpFc = {}, grpR = {}, grpF = {}, ordemG = [], recGap = zeros(), recor = {};
    var GR_REC = { "Salários": 1, "Encargos": 1, "Benefícios": 1, "Provisões": 1, "Apoio de pessoal": 1, "Materiais e EPIs": 1, "Serviços de terceiros": 1, "Locação": 1, "Mobilização e canteiro": 1, "Despesas gerais e taxas": 1 };
    var ajM = zeros();
    var F = { base: zeros(), he: zeros(), resc: zeros(), enc: zeros(), prov: zeros(), provFer: zeros(), prov13: zeros(), exa: zeros(), epi: zeros(), con: zeros() };
    linhas.forEach(function (l) {
      var i = ix(l.MesNo); if (i < 0) return;
      var niv = l["Nível"], sub = String(l["Sub Nível I"] || ""), conta = l["C.Contabil - Descricao"], r = +l.r || 0, e = +l.e || 0, f = +l.f || 0, cod = codConta(conta), noMes = parseInt(l.MesNo, 10) === mes;
      var a = porSub[niv + "|" + sub] = porSub[niv + "|" + sub] || [niv, sub, 0, 0, null, null];
      a[2] += r; a[3] += e; if (noMes) { a[4] = (a[4] || 0) + r; a[5] = (a[5] || 0) + f; }
      var c = porConta[conta] = porConta[conta] || [sub, conta, 0, 0, null, null, niv];
      c[2] += r; c[3] += e; if (noMes) { c[4] = (c[4] || 0) + r; c[5] = (c[5] || 0) + f; }
      var g = grupoDaConta(niv, sub);
      if (g && GR_REC[g] && (r !== 0 || e !== 0)) { var rc0 = recor[conta] = recor[conta] || { conta: conta, g: g, acima: 0, meses: 0, real: 0, exec: 0 }; rc0.meses++; rc0.real += r; rc0.exec += e; if (e < 0 ? r < e * 1.05 : r < -100) rc0.acima++; }
      if (g) { if (!grpFc[g]) { grpFc[g] = zeros(); grpR[g] = zeros(); grpF[g] = zeros(); ordemG.push(g); } grpR[g][i] += r; grpF[g][i] += f; }
      if (temFc[i]) { if (!g) recGap[i] += r - f; else grpFc[g][i] += r - f; }
      if (cod === "31111008") ajM[i] += r;
      if (cod === "41111001") F.base[i] += r;
      if (cod === "41111002") F.he[i] += r;
      if (cod === "41111004") F.resc[i] += r;
      if (cod === "41141001") F.provFer[i] += r;
      if (cod === "41141003") F.prov13[i] += r;
      if (cod === "41191001") F.exa[i] += r;
      if (sub.indexOf("4.1.1.2.") === 0) F.enc[i] += r;
      if (sub.indexOf("4.1.1.4.") === 0) F.prov[i] += r;
      if (sub.indexOf("4.1.2.4.") === 0) F.epi[i] += r;
      if (sub.indexOf("4.1.2.2.") === 0) F.con[i] += r;
    });
    // eventos de folha (historico do lancamento contabil, texto como esta no CT2)
    var rescOutras = zeros(), rescEnc = zeros(), multa40 = zeros(), diss = [], provEv = {};
    evt.forEach(function (x) {
      var i = ix(x.MesNo); if (i < 0) return;
      var h = String(x["Histórico de Lançamento"] || ""), c = String(x["C.Contábil"] || ""), v = +x.v || 0;
      if (/MULTA 40/i.test(h)) multa40[i] += v;
      if (RX_RESC.test(h) && c !== "41111004") { rescOutras[i] += v; if (c.indexOf("4112") === 0) rescEnc[i] += v; }
      if (RX_DISS.test(h)) diss.push([meses[i], c, h, Math.round(v)]);
      if (c.indexOf("4114") === 0) (provEv[meses[i]] = provEv[meses[i]] || []).push([c, h, Math.round(v)]);
    });
    var rescTot = F.resc.map(function (v, i) { return v + rescOutras[i]; });
    var provR = F.prov.map(function (v, i) { return F.base[i] ? v / F.base[i] : null; });
    var encR = F.enc.map(function (v, i) { return F.base[i] ? (v - rescEnc[i]) / F.base[i] : null; });
    function picos(rat, val) {
      var md = mediana(rat); if (md == null) return [];
      return rat.map(function (q, i) { return q != null && Math.abs(q) > Math.abs(md) * 1.12 && Math.abs((q - md) * F.base[i]) >= 5000 ? { m: meses[i], ratio: q, mediana: md, excesso: Math.round((q - md) * F.base[i]) } : null; }).filter(Boolean);
    }
    var picosProv = picos(provR), picosEnc = picos(encR);
    var provTop = {}; picosProv.forEach(function (p) { provTop[p.m] = (provEv[p.m] || []).sort(function (a, b) { return Math.abs(b[2]) - Math.abs(a[2]); }).slice(0, 4); });
    // grupo sem lancamento real no mes, mas com valor no FCST: o mes ainda esta incompleto nesse grupo
    var pend = {};
    // FCST do mes anterior x realizado, mes a mes (alimenta a analise; o relatorio mostra so o ano)
    var fc = meses.map(function (m, i) {
      var r = mxm[m] || {}, o = { m: m, fat: rh.fat[i], fatFc: temFc[i] ? r.ff : null, res: rh.res[i], resFc: temFc[i] ? r.rf : null, fatEx: r.fe, resEx: r.re };
      if (pend[m]) o.pend = pend[m];
      if (ajM[i] > 0) o.ajuste = ajM[i];
      if (temFc[i]) {
        var lst = ordemG.filter(function (g) { return !(pend[m] && pend[m].indexOf(g) >= 0); }).map(function (g) { return [g, grpFc[g][i]]; }).concat([["Receita", recGap[i]]]);
        lst.sort(function (a, b) { return Math.abs(b[1]) - Math.abs(a[1]); });
        o.causas = lst.slice(0, 4).filter(function (x) { return Math.abs(x[1]) >= 1000; }).map(function (x) { return [x[0], Math.round(x[1])]; });
      }
      return o;
    });
    var ok = meses.map(function (m, i) { return temFc[i] && !pend[m]; });
    var prMes = meses.filter(function (m, i) { return ok[i]; });
    function somaOk(a) { return soma(a.map(function (v, i) { return ok[i] ? v : 0; })); }
    var prRes = somaOk(fc.map(function (o) { return o.res; })), prFc = somaOk(fc.map(function (o) { return o.resFc; }));
    var prG = ordemG.map(function (g) { return { nome: g, v: somaOk(grpFc[g]) }; }).concat([{ nome: "Receita", v: somaOk(recGap) }]);
    var resid = (prRes - prFc) - soma(prG.map(function (x) { return x.v; }));
    if (Math.abs(resid) >= 1) prG.push({ nome: "Demais", v: resid });
    // Receita Ideal: nao faturaveis (custo) e SLA (desconto no faturamento)
    var slaM = zeros(), nfM = zeros(), dilM = zeros(), slaIt = {}, nfIt = {}, dilIt = {};
    r2.forEach(function (x) {
      var i = ix(x.mes); if (i < 0) return; var v = +x.valor || 0;
      if (x.tipo === "SLA") { slaM[i] += v; var k = String(x.item || "") + " | " + String(x.cat || ""); slaIt[k] = slaIt[k] || [x.item, x.cat, 0, 0, x.pct]; slaIt[k][2] += v; slaIt[k][3]++; }
      else if (x.tipo === "DIL") { dilM[i] += v; var k3 = String(x.item || "") + " | " + String(x.cat || ""); dilIt[k3] = dilIt[k3] || [x.item, x.cat, 0, 0]; dilIt[k3][2] += v; dilIt[k3][3] += (+x.n || 1); }
      else if (x.tipo === "NF") { nfM[i] += v; var k2 = String(x.item || "") + " | " + String(x.cat || ""); nfIt[k2] = nfIt[k2] || [x.item, x.cat, 0, 0]; nfIt[k2][2] += v; nfIt[k2][3] += (+x.n || 1); }
    });
    var FR = soma(rh.fat), FE = soma(mx.map(function (r) { return +r.fe || 0; })), resReal = soma(rh.res), resExec = soma(mx.map(function (r) { return +r.re || 0; }));
    var ratio = FE ? FR / FE : null;
    var contas = Object.keys(porConta).map(function (k) { return porConta[k]; })
      .filter(function (c) { return grupoDaConta(c[6], c[0]); })
      .sort(function (a, b) { return Math.abs(b[2] - b[3] * ratio) - Math.abs(a[2] - a[3] * ratio); }).slice(0, 40)
      .map(function (c) { return [c[0], c[1], Math.round(c[2]), Math.round(c[3]), c[4] == null ? null : Math.round(c[4]), c[5] == null ? null : Math.round(c[5])]; });
    var perdaRI = S.ri ? soma(S.ri.perda) : null, perdaPR = soma(rh.perdaPR);
    return {
      FR: Math.round(FR), FE: Math.round(FE), resReal: Math.round(resReal), resExec: Math.round(resExec),
      linhas: Object.keys(porSub).map(function (k) { var a = porSub[k]; return [a[0], a[1], Math.round(a[2]), Math.round(a[3]), a[4] == null ? null : Math.round(a[4]), a[5] == null ? null : Math.round(a[5])]; }),
      contas: contas,
      fc: fc.map(function (o) { return { m: o.m, pend: o.pend || null, ajuste: o.ajuste ? Math.round(o.ajuste) : null, fat: o.fat == null ? null : Math.round(o.fat), fatFc: o.fatFc == null ? null : Math.round(o.fatFc), res: o.res == null ? null : Math.round(o.res), resFc: o.resFc == null ? null : Math.round(o.resFc), fatEx: o.fatEx == null ? null : Math.round(o.fatEx), resEx: o.resEx == null ? null : Math.round(o.resEx), causas: o.causas || null }; }),
      pend: pend,
      recorrentes: Object.keys(recor).map(function (k) { return recor[k]; }).filter(function (x) { return x.meses >= Math.min(6, meses.length) && x.acima / x.meses >= 0.75 && x.real < x.exec; })
        .sort(function (a, b) { return (b.acima / b.meses - a.acima / a.meses) || (a.real - a.exec) - (b.real - b.exec); }).slice(0, 12)
        .map(function (x) { return [x.conta, x.g, x.acima, x.meses, Math.round(x.real), Math.round(x.exec)]; }),
      promessa: { fora: meses.filter(function (m, i) { return temFc[i] && !ok[i]; }), meses: prMes, res: Math.round(prRes), fc: Math.round(prFc), grupos: prG.map(function (x) { return { nome: x.nome, v: Math.round(x.v) }; }) },
      receita: { perdaRI: perdaRI == null ? null : Math.round(perdaRI), perdaPR: Math.round(perdaPR), sla: Math.round(soma(slaM)), nf: Math.round(soma(nfM)), dil: Math.round(soma(dilM)), slaM: arred(slaM), nfM: arred(nfM), dilM: arred(dilM),
        dilItens: Object.keys(dilIt).map(function (k) { var a = dilIt[k]; return [a[0], a[1], Math.round(a[2]), a[3]]; }).sort(function (a, b) { return b[2] - a[2]; }).slice(0, 10),
        slaItens: Object.keys(slaIt).map(function (k) { var a = slaIt[k]; return [a[0], a[1], Math.round(a[2]), a[3], a[4]]; }).sort(function (a, b) { return b[2] - a[2]; }).slice(0, 8),
        nfItens: Object.keys(nfIt).map(function (k) { var a = nfIt[k]; return [a[0], a[1], Math.round(a[2]), a[3]]; }).sort(function (a, b) { return b[2] - a[2]; }).slice(0, 10) },
      folha: { base: arred(F.base), he: arred(F.he), resc: arred(F.resc), rescOutras: arred(rescOutras), rescTot: arred(rescTot), multa40: arred(multa40), enc: arred(F.enc), rescEnc: arred(rescEnc),
        prov: arred(F.prov), provFer: arred(F.provFer), prov13: arred(F.prov13), exa: arred(F.exa), epi: arred(F.epi), con: arred(F.con),
        provR: provR.map(function (v) { return v == null ? null : Math.round(v * 10000) / 10000; }), encR: encR.map(function (v) { return v == null ? null : Math.round(v * 10000) / 10000; }),
        picosProv: picosProv, picosEnc: picosEnc, provTop: provTop, diss: diss.slice(0, 20) }
    };
  }

  // custos = { FR, FE, resReal, resExec, linhas: [[nivel, subnivel, realAno, execAno, realMes, fcstMes]], contas: [[subnivel, conta, real, exec, realMes, fcstMes]] }
  function analisarCustos(c) {
    if (!c || !c.FR || !c.FE) return null;
    var ratio = c.FR / c.FE, g = {}, ordem = [];
    (c.linhas || []).forEach(function (l) {
      var k = grupoDaConta(l[0], l[1]); if (!k) return;
      if (!g[k]) { g[k] = { nome: k, real: 0, exec: 0 }; ordem.push(k); }
      g[k].real += l[2] || 0; g[k].exec += l[3] || 0;
    });
    var grupos = ordem.map(function (k) {
      var x = g[k];
      x.pp = (x.real / c.FR - x.exec / c.FE) * 100;         // pontos de margem ganhos (+) ou perdidos (-)
      x.prop = x.exec * ratio;                               // orcado na proporcao do faturamento real
      x.desvio = x.real - x.prop;
      return x;
    }).sort(function (a, b) { return a.pp - b.pp; });
    var contas = (c.contas || []).map(function (l) {
      var prop = (l[3] || 0) * ratio;
      return { sub: l[0], conta: l[1], real: l[2] || 0, exec: l[3], prop: prop, desvio: (l[2] || 0) - prop, realMes: l[4], fcstMes: l[5] };
    }).sort(function (a, b) { return a.desvio - b.desvio; });
    return { FR: c.FR, FE: c.FE, ratio: ratio, grupos: grupos, contas: contas,
      margReal: c.resReal != null ? c.resReal / c.FR : null, margExec: c.resExec != null ? c.resExec / c.FE : null };
  }

  // ------------------------------------------------------------------ gráficos do relatório
  // cascata generica: passos = [{nome, v, tipo: "base"|"passo"}]
  function cascata(passos, o) {
    o = o || {};
    var acc = 0, cols = passos.map(function (p) {
      if (p.tipo === "base") { acc = p.v; return { nome: p.nome, a: 0, b: p.v, v: p.v, tipo: "base" }; }
      var a = acc; acc += p.v; return { nome: p.nome, a: a, b: acc, v: p.v, tipo: "passo" };
    });
    var vals = []; cols.forEach(function (c) { vals.push(c.a, c.b); });
    var mn = Math.min.apply(null, vals.concat([0])), mx = Math.max.apply(null, vals.concat([0]));
    var pad = (mx - mn) * 0.12 || 1; mn -= pad; mx += pad;
    var f = fr(1100, o.h || 330, { l: 70, r: 10, t: 26, b: 64 }), n = cols.length, bw = f.iw / n, y = function (v) { return f.m.t + (mx - v) / (mx - mn) * f.ih; };
    var s = "", passo = niceMax((mx - mn) / 5);
    for (var v = Math.ceil(mn / passo) * passo; v <= mx; v += passo) s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (Math.abs(v) < 1e-9 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="' + COR.muted + '">' + (o.fEixo ? o.fEixo(v) : fmt(v, o.dEixo || 0)) + "</text>";
    cols.forEach(function (c, i) {
      var x = f.m.l + bw * i + bw * 0.16, w = bw * 0.68, top = y(Math.max(c.a, c.b)), h = Math.max(1.5, Math.abs(y(c.a) - y(c.b)));
      var cor = c.tipo === "base" ? COR.navy : (c.v < 0 ? COR.red : COR.teal);
      s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + h + '" rx="2" fill="' + cor + '"/>';
      if (i < n - 1) s += '<line x1="' + (x + w) + '" x2="' + (x + bw) + '" y1="' + y(c.b) + '" y2="' + y(c.b) + '" stroke="' + COR.muted + '" stroke-dasharray="3 2"/>';
      var txt = c.tipo === "base" ? o.fBase(c.v) : (c.v > 0 ? "+" : "−") + o.fPasso(Math.abs(c.v));
      s += lbl(x + w / 2, top - 5, txt, { s: n > 11 ? 9.5 : 11, c: c.tipo === "base" ? COR.navy : (c.v < 0 ? COR.badfg : COR.okfg) });
      var linhas = [], atual = "";
      String(c.nome).split(" ").forEach(function (p) { if ((atual + " " + p).trim().length > 11 && atual) { linhas.push(atual); atual = p; } else atual = (atual + " " + p).trim(); });
      if (atual) linhas.push(atual);
      linhas.slice(0, 3).forEach(function (ln, li) { s += '<text x="' + (x + w / 2) + '" y="' + (f.H - 48 + li * 13) + '" text-anchor="middle" font-size="10.5" font-weight="' + (c.tipo === "base" ? 700 : 500) + '" fill="' + COR.ink + '">' + esc(ln) + "</text>"; });
    });
    return svg(f, s, o.titulo || "Cascata");
  }
  function chPonte(an) {
    var gs = an.grupos.filter(function (x) { return Math.abs(x.pp) >= 0.15; });
    var resto = an.grupos.filter(function (x) { return Math.abs(x.pp) < 0.15; }).reduce(function (s, x) { return s + x.pp; }, 0);
    if (Math.abs(resto) >= 0.01) gs = gs.concat([{ nome: "Demais", pp: resto }]);
    return cascata([{ nome: "Margem orçada", v: an.margExec * 100, tipo: "base" }].concat(gs.map(function (x) { return { nome: x.nome, v: x.pp, tipo: "passo" }; })).concat([{ nome: "Margem real", v: an.margReal * 100, tipo: "base" }]),
      { fBase: function (v) { return fmt(v, 2) + "%"; }, fPasso: function (v) { return fmt(v, 2); }, dEixo: 1, titulo: "Ponte da margem" });
  }
  function chPromessa(pr) {
    var gs = pr.grupos.filter(function (x) { return Math.abs(x.v) >= 10000; }).sort(function (a, b) { return a.v - b.v; });
    var resto = pr.grupos.filter(function (x) { return Math.abs(x.v) < 10000; }).reduce(function (s, x) { return s + x.v; }, 0);
    if (Math.abs(resto) >= 1000) gs.push({ nome: "Demais", v: resto });
    return cascata([{ nome: "Prometido nos FCSTs", v: pr.fc / 1000, tipo: "base" }].concat(gs.map(function (x) { return { nome: x.nome, v: x.v / 1000, tipo: "passo" }; })).concat([{ nome: "Entregue", v: pr.res / 1000, tipo: "base" }]),
      { fBase: function (v) { return moeda(v * 1000); }, fPasso: function (v) { return moeda(v * 1000).replace("R$ ", ""); }, fEixo: function (v) { return fmt(v * 1000); }, titulo: "Prometido x entregue" });
  }
  function chPotencial(p) {
    var passos = [{ nome: "Resultado real", v: p.res / 1000, tipo: "base" }];
    if (p.perda) passos.push({ nome: "Perdas de receita", v: p.perda / 1000, tipo: "passo" });
    if (p.sla) passos.push({ nome: "Descontos de SLA", v: p.sla / 1000, tipo: "passo" });
    if (p.nf) passos.push({ nome: "Não faturáveis", v: p.nf / 1000, tipo: "passo" });
    passos.push({ nome: "Resultado potencial", v: (p.res + (p.perda || 0) + (p.sla || 0) + (p.nf || 0)) / 1000, tipo: "base" });
    return cascata(passos, { fBase: function (v) { return moeda(v * 1000); }, fPasso: function (v) { return moeda(v * 1000).replace("R$ ", ""); }, fEixo: function (v) { return fmt(v * 1000); }, h: 300, titulo: "Resultado potencial" });
  }
  // custo provocado por demissao, por mes (conta rescisoes + encargos rescisorios), com o numero de demissoes
  function chResc(meses, fo, rh) {
    // azul = conta de rescisoes; laranja = encargos/ajustes rescisorios em outras contas (liquido; credito reduz o azul)
    var a = fo.resc.map(function (v) { return Math.abs(v || 0) / 1000; }), b = fo.rescOutras.map(function (v) { return -(v || 0) / 1000; });
    var tot = a.map(function (v, i) { return Math.max(0, v + b[i]); });
    var max = niceMax(Math.max.apply(null, tot) * 1.12), f = fr(1100, 250, { l: 40, r: 8, t: 26, b: 22 });
    var n = meses.length, bw = f.iw / n, y = function (v) { return f.m.t + f.ih - v / max * f.ih; }, s = grade(f, max, max / 4, function (v) { return fmt(v * 1000); }, f.m.t, f.ih);
    meses.forEach(function (m, i) {
      var x = f.m.l + bw * i + bw * 0.25, w = bw * 0.5, az = b[i] >= 0 ? a[i] : tot[i], lj = b[i] >= 0 ? b[i] : 0;
      s += '<rect x="' + x + '" y="' + y(az) + '" width="' + w + '" height="' + (f.m.t + f.ih - y(az)) + '" fill="' + COR.navy2 + '"/>';
      if (lj > 0) s += '<rect x="' + x + '" y="' + y(az + lj) + '" width="' + w + '" height="' + (y(az) - y(az + lj)) + '" fill="' + COR.orange + '"/>';
      s += lbl(x + w / 2, y(tot[i]) - 5, moeda(tot[i] * 1000), { s: 10.5 });
      var d = rh.dem ? rh.dem[i] : null;
      if (d != null) s += '<text x="' + (x + w / 2) + '" y="' + (f.m.t - 10) + '" text-anchor="middle" font-size="10.5" fill="' + COR.muted + '">' + d + " dem.</text>";
    });
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Custo de demissões");
  }

  function renderRelatorioOS(b) {
    var S = b.S, k = b.kpi, t = b.txt || {}, c = S.fin || S.custos || {}, an = analisarCustos(c), h = [], fig = 0;
    function figura(titulo, cap, corpo, leg) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + (leg || "") + "</figure>"; }
    function par(txt) { return String(txt || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return '<p>' + rico(p.trim()) + "</p>"; }).join(""); }
    function pf(v) { return c.FR ? fmt(v / c.FR * 100, 2) + "%" : "–"; }
    var valid = (b.mesesVal || []).length, mesN = MESF[b.mes];
    // capa
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório gerencial do contrato</span><span class="rl-per">janeiro a ' + mesN + " de " + b.ano + "</span></div>" +
      '<h1>' + (b.descCtt ? esc(b.desc) : esc(b.rotulo.replace("|", " + ")) + " · " + esc(b.desc)) + "</h1>" +
      '<div class="rl-ficha"><span>' + esc(b.neg || "") + "</span><span>Gestor do contrato: <b>" + esc(b.gestor || "–") + "</b></span><span>Gerente: <b>" + esc(b.ger || "–") + "</b></span><span>Superintendente: <b>" + esc(b.sup || "–") + "</b></span></div>" +
      "</header>");
    // numeros-chave: o que ja aconteceu x para onde o ano vai
    function cel(l, v, s, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s + "</span></div>"; }
    var margR = c.FR ? c.resReal / c.FR : null, margE = c.FE ? c.resExec / c.FE : null;
    h.push('<section class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", mi(c.FR), "executivo " + mi(c.FE) + (c.FE ? " · " + (c.FR >= c.FE ? "+" : "") + fmt((c.FR / c.FE - 1) * 100, 2) + "%" : ""), c.FR >= c.FE ? "ok" : "bad") +
      cel("Resultado", mi(c.resReal), "executivo " + mi(c.resExec), c.resReal >= c.resExec ? "ok" : "bad") +
      cel("Margem", pct(margR), "executivo " + pct(margE), margR >= margE ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Projeção do ano · real até ' + MES[b.mes] + " + FCST até dez</h3>" +
      cel("Faturamento", mi(k.fatAno), "meta " + mi(k.fatMeta), k.fatAno >= k.fatMeta ? "ok" : "bad") +
      cel("Resultado", mi(k.resAno), "meta " + mi(k.resMeta), k.resAno >= k.resMeta ? "ok" : "bad") +
      cel("Margem", pct(k.fatAno ? k.resAno / k.fatAno : null), "meta " + pct(k.fatMeta ? k.resMeta / k.fatMeta : null), (k.fatAno && k.fatMeta && k.resAno / k.fatAno >= k.resMeta / k.fatMeta) ? "ok" : "bad") + "</div></section>");
    // 1. sumario
    h.push('<section class="rl-cap"><h2><span>1</span>Sumário executivo</h2>' + par(t.sumario) + "</section>");
    // 2. receita: perdas, SLA e nao faturaveis
    var rc = c.receita, r2 = par(t.receita);
    if (rc && c.FR) {
      var perda = rc.perdaRI != null ? rc.perdaRI : rc.perdaPR, pot = c.resReal + (perda || 0) + (rc.sla || 0) + (rc.nf || 0);
      r2 += figura("Resultado potencial: o que o contrato entregaria sem perdas, SLA e não faturáveis", "jan a " + MES[b.mes] + " · margem real " + pct(margR) + " → potencial " + pct(pot / c.FR),
        chPotencial({ res: c.resReal, perda: perda, sla: rc.sla, nf: rc.nf }),
        '<div class="rl-tab"><table><thead><tr><th>Efeito</th><th>Natureza</th><th>Valor</th><th>% do faturamento</th></tr></thead><tbody>' +
        "<tr><td>Perdas de receita" + (rc.perdaRI != null ? " (Receita Ideal)" : " (PR)") + "</td><td>faturamento que não entrou por recurso indisponível</td><td>" + moeda(perda || 0) + "</td><td>" + pf(perda || 0) + "</td></tr>" +
        "<tr><td>Descontos de SLA</td><td>desconto contratual direto no faturamento</td><td>" + moeda(rc.sla || 0) + "</td><td>" + pf(rc.sla || 0) + "</td></tr>" +
        "<tr><td>Recursos não faturáveis</td><td>custo de quem não gera faturamento</td><td>" + moeda(rc.nf || 0) + "</td><td>" + pf(rc.nf || 0) + "</td></tr>" +
        (rc.dil != null ? "<tr><td>Recursos diluídos <i>(informativo)</i></td><td>custo de quem fica diluído nos serviços; não entra no resultado potencial</td><td>" + moeda(rc.dil || 0) + "</td><td>" + pf(rc.dil || 0) + "</td></tr>" : "") +
        "</tbody></table>" + (rc.perdaRI != null ? '<p class="rl-nota">Conferência: perda pela Receita Ideal ' + moeda(rc.perdaRI) + " · pela PR " + moeda(rc.perdaPR) + ".</p>" : "") + "</div>");
    }
    if (S.ri) r2 += figura("De onde vem a perda de receita", "por mês, maiores motivos do período (Receita Ideal)", chMotivos(S.meses, S.ri),
      '<div class="bk-leg">' + S.ri.top.map(function (x, i) { return '<span><i style="background:' + CORES_MOTIVO[i] + '"></i>' + esc(x[0].charAt(0) + x[0].slice(1).toLowerCase()) + " · " + moeda(x[1].reduce(function (a, v) { return a + v; }, 0)) + "</span>"; }).join("") + "</div>");
    if ((S.anos && S.anos.length) || S.assert) r2 += '<div class="rl-duas">' + (S.anos && S.anos.length ? figura("Perda de receita por ano (PR)", "valor e % sobre o faturamento do período", chAnos(S.anos)) : "") +
      (S.assert ? figura("Assertividade do FCST do resultado", "diferença de margem real x FCST do mês anterior (p.p.) e % de meses assertivos no ano", chAssert(S.meses, S.assert)) : "") + "</div>";
    h.push('<section class="rl-cap"><h2><span>2</span>Receita: o que entrou, o que se perdeu e o que custou sem faturar</h2>' + r2 + "</section>");
    // 3. custos
    if (an) {
      var tab = '<div class="rl-tab"><table><thead><tr><th>Conta</th><th>Real jan–' + MES[b.mes] + '</th><th>Orçado</th><th>Orçado na proporção do faturamento</th><th>Desvio</th></tr></thead><tbody>' +
        an.contas.slice(0, 10).map(function (x) {
          return "<tr><td>" + esc(String(x.conta).replace(/^\d+\s*-\s*/, "")) + "</td><td>" + moeda(Math.abs(x.real)) + "</td><td>" + (!x.exec ? "não orçado" : moeda(Math.abs(x.exec))) + "</td><td>" + moeda(Math.abs(x.prop)) +
            '</td><td class="' + (x.desvio < 0 ? "neg" : "pos") + '">' + moeda(x.desvio) + "</td></tr>";
        }).join("") + "</tbody></table><p class=\"rl-nota\">Orçado na proporção = executivo × (faturamento real ÷ faturamento executivo): o que a conta poderia ter custado com o volume que de fato foi faturado. Desvio negativo = custou mais que a proporção.</p></div>";
      var pr = c.promessa, pendTxt = "";
      h.push('<section class="rl-cap"><h2><span>3</span>Custos e margem: o custo acompanhou o faturamento?</h2>' + par(t.custos) +
        figura("Ponte da margem: do orçado ao realizado", "pontos percentuais de margem que cada grupo de custo tirou (vermelho) ou devolveu (verde), jan a " + MES[b.mes] + pendTxt, chPonte(an)) +
        figura("As contas que mais descolaram do faturamento", "", tab) +
        (pr && pr.meses && pr.meses.length ? figura("O que os FCSTs prometeram e o que foi entregue no ano", "soma, de " + MES[pr.meses[0]] + " a " + MES[pr.meses[pr.meses.length - 1]] + ", do resultado previsto no FCST do mês anterior x o realizado, e quanto cada grupo explica da diferença", chPromessa(pr)) : "") + "</section>");
    }
    // 4. pessoas e eventos de folha
    var fo = c.folha;
    var pa = S.proj && S.proj.alerta;
    var projBox = pa ? '<div class="rl-alerta"><b>Atenção à projeção de ' + MES[pa.prox] + '</b>' + esc(pa.problemas.join("; ")) + '. Corrija o EFETIVO PR, o HHT PR e o faturamento projetado; sem isso a comparação do próximo mês fica errada.</div>' : "";
    h.push('<section class="rl-cap"><h2><span>4</span>Pessoas: quadro, horas e o que a folha custou</h2>' + projBox + par(t.pessoas) +
      '<div class="rl-duas">' + figura("Efetivo e movimentação", "efetivo da folha; admissões e demissões do mês", chMov(S.meses, S.rh)) + figura("Horas e hora extra", "% de HE e HHT realizado (mil h)", chHHT(S.meses, S.rh)) + "</div>" +
      (fo ? par(t.eventos) + figura("Custo provocado por demissão", "por mês · azul = conta de rescisões (aviso indenizado, 13º e férias de rescisão) · laranja = encargos rescisórios (multa de 40% e FGTS de rescisão) · acima, as demissões do mês", chResc(S.meses, fo, S.rh)) : "") +
      '<p class="rl-nota">Acúmulo de férias (posição de hoje): ' + (S.rh.fer30 == null ? "" : fmt(S.rh.fer30) + " pessoas com 30 dias ou mais de saldo (já têm direito), ") + (S.rh.fer45 == null ? "" : "<b>" + fmt(S.rh.fer45) + " com 45 dias ou mais</b> (ponto de atenção), ") + (S.rh.ferSaldo == null ? "–" : fmt(S.rh.ferSaldo) + " dias de saldo no total") + ". Transferências no ano: " + S.rh.tIn.reduce(function (a, v) { return a + (v || 0); }, 0) + " entradas e " + S.rh.tOut.reduce(function (a, v) { return a + (v || 0); }, 0) + " saídas.</p></section>");
    // 5. ssma, cliente e contrato
    var g5 = (S.sat && (S.sat.length || S.satMeta != null)) ? '<div class="rl-lado">' + figura("Satisfação do cliente por pesquisa", "barra = resultado · traço = meta do ano", chSat(S.sat, S.satMeta, b.ano)) + "</div>" : "";
    h.push('<section class="rl-cap"><h2><span>5</span>Segurança, cliente e contrato</h2><div class="rl-flex">' + g5 + '<div class="rl-txt">' + par(t.ssma) + "</div></div></section>");
    // 6. diagnostico
    function lista(xs) { return (xs || []).map(function (x) { return '<li><div class="rl-li-t"><b>' + esc(x.titulo || "") + '</b><span>' + esc(x.valor || "") + "</span></div>" + rico(x.texto || "") + "</li>"; }).join(""); }
    h.push('<section class="rl-cap"><h2><span>6</span>Diagnóstico: é gestão ou é orçamento?</h2>' + par(t.diagnostico) +
      '<div class="rl-diag"><div class="rl-diag-c ges"><h4>Gestão · o contrato controla</h4><ul>' + lista(t.gestao) + '</ul></div><div class="rl-diag-c orc"><h4>Orçamento · premissa a rever</h4><ul>' + lista(t.premissas) + "</ul></div></div></section>");
    // 7. plano
    h.push('<section class="rl-cap"><h2><span>7</span>Plano de ação</h2><ol class="rl-plano">' + (t.plano || []).map(function (p) {
      return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(p.efeito) + "</span>" : "") + (p.acompanhar ? '<em>Acompanhar: ' + esc(p.acompanhar) + "</em>" : "") + "</li>";
    }).join("") + "</ol></section>");
    // 8. orcamento
    h.push('<section class="rl-cap rl-orc"><h2><span>8</span>Parecer para o Orçamento · renovação</h2>' + (t.parecerOrcamento ? '<p class="rl-veredito">' + rico(t.parecerOrcamento) + "</p>" : "") +
      '<div class="bk-orcgrid">' + (t.orcamento || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.titulo || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(o.texto || "") + "</p></div>"; }).join("") + "</div></section>");
    // anexo
    h.push('<section class="rl-cap rl-anexo"><h2><span>A</span>Anexo · situação dos indicadores</h2><div class="rl-tab"><table><thead><tr><th>Indicador</th><th>Situação em ' + MES[b.mes] + '</th><th>Jan → ' + MES[b.mes] + '</th><th>Valores da caixa</th></tr></thead><tbody>' +
      b.inds.map(function (x) { return "<tr><td>#" + x.id + " " + esc(x.nome) + '</td><td><span class="bk-pill ' + x.st + '">' + esc(x.pill) + "</span></td><td>" + stripHtml(x.strip) + '</td><td class="rl-cx">' + esc(x.val || "") + "</td></tr>"; }).join("") + "</tbody></table></div></section>");
    h.push('<div class="bk-fontes">Fontes: RESULTADOS (contábil real, executivo e FCST por conta; lançamentos da folha no contábil; folha, ponto, cadastro, rescisões, transferências, férias, perdas e satisfação), RECEITA IDEAL (perdas por motivo, não faturáveis, diluídos e SLA) e ATA_COMENTARIO. Números calculados a partir dessas fontes; textos escritos por IA. Gerado em ' +
      esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }

  // ------------------------------------------------------------------ books de Gerência e Superintendência
  // Somam os books das OSs (v2) do mesmo mês: os números do grupo batem com os das OSs e cada impacto
  // aponta as OSs que o causaram. Nomes de gerente e superintendente vêm da CTT gravada no book da OS.
  function elegiveis() { try { return (A.tab5OSElegiveis ? A.tab5OSElegiveis() : []) || []; } catch (e) { return []; } }
  // grupos pela hierarquia das OSs elegíveis do acompanhamento
  function listarGrupos(nivel) {
    var g = {};
    elegiveis().forEach(function (o) { var k = String((nivel === "ger" ? o.ger : o.sup) || "").trim().toUpperCase(); if (k) (g[k] = g[k] || []).push(o.codigo); });
    return Object.keys(g).sort().map(function (k) { return { nome: k, oss: g[k] }; });
  }
  // Dados de uma OS direto do painel (o mesmo fluxo do book da OS, sem IA)
  async function resumoOS(o, ano, mes, tk, urlFluxo) {
    var dados = await lerDadosFluxo(o.rotulo || o.codigo, ano, mes, tk, urlFluxo);
    var S = montarSeries(dados, mes);
    S.fin = montarFin(dados, mes, S);
    if (!S.fin) throw new Error("sem dados contábeis");
    if (dados.fer) { S.rh.fer30 = dados.fer.f30; S.rh.fer45 = dados.fer.f45; S.rh.ferSaldo = dados.fer.saldo; }
    var proj = (dados.proj || []).slice().sort(function (x, y) { return x.m - y.m; });
    S.proj = conferirProjecao(S, proj.slice(0, 3));
    var ct = (dados.ctt || {})[o.codigo] || {}, f = S.fin;
    function med(a) { var v = a.filter(function (x) { return x != null; }); return v.length ? soma(v) / v.length / 100 : null; }
    var kpi = { fatAno: f.FR + soma(proj.map(function (x) { return x.fat; })), resAno: f.resReal + soma(proj.map(function (x) { return x.res; })),
      fatMeta: f.FE + soma((dados.projx || []).map(function (x) { return x.fe; })), resMeta: f.resExec + soma((dados.projx || []).map(function (x) { return x.re; })),
      absAcum: med(S.rh.abs), turnAcum: null };
    return { v: 2, os: o.codigo, rotulo: o.rotulo || o.codigo, desc: ct.desc || o.desc || o.codigo, gestor: ct.gestor || "", ger: ct.gerente || "", sup: ct.sup || "", neg: ct.neg || "", ano: ano, mes: mes, S: S, kpi: kpi };
  }
  function maisComum(xs) { var c = {}, best = "", n = 0; xs.forEach(function (x) { if (!x) return; c[x] = (c[x] || 0) + 1; if (c[x] > n) { n = c[x]; best = x; } }); return best; }
  function linhaOS(b) {
    var f = b.S.fin, rc = f.receita || {}, an = analisarCustos(f), S = b.S, k = b.kpi || {}, n = S.meses.length - 1;
    var perda = rc.perdaRI != null ? rc.perdaRI : rc.perdaPR, he = an ? an.contas.filter(function (x) { return /^41111002/.test(x.conta); })[0] : null;
    var pot = f.resReal + (perda || 0) + (rc.sla || 0) + (rc.nf || 0);
    return { os: b.os, desc: b.desc, gestor: b.gestor || "", ger: b.ger || "", sup: b.sup || "", FR: f.FR, FE: f.FE, res: f.resReal, rex: f.resExec, gap: f.resReal - f.resExec,
      perda: perda || 0, sla: rc.sla || 0, nf: rc.nf || 0, dil: rc.dil || 0, pot: pot, heDesvio: he ? Math.round(he.desvio) : 0,
      rescTot: f.folha ? -soma(f.folha.rescTot) : 0, multa40: f.folha ? -soma(f.folha.multa40) : 0,
      efet: S.rh.efet[n], adm: soma(S.rh.adm), dem: soma(S.rh.dem), he: S.rh.he[n], abs: k.absAcum, turn: k.turnAcum, demTurn: soma(S.rh.demTurn || []),
      f30: S.rh.fer30, f45: S.rh.fer45, alerta: S.proj && S.proj.alerta ? S.proj.alerta.problemas : null,
      fatAno: k.fatAno, fatMeta: k.fatMeta, resAno: k.resAno, resMeta: k.resMeta, diag: (b.txt && b.txt.diagnostico) || "",
      mm: (f.fc || []).map(function (o) { return [o.m, o.fat, o.res, o.fatEx, o.resEx, o.resFc]; }), efetM: S.rh.efet.slice() };
  }
  function agregarGrupo(books) {
    var A2 = { FR: 0, FE: 0, resReal: 0, resExec: 0, linhas: [], contas: [], receita: { perda: 0, sla: 0, nf: 0, dil: 0, perdaPR: 0 }, promessa: { res: 0, fc: 0, grupos: [], n: 0 },
      kpi: { fatAno: 0, fatMeta: 0, resAno: 0, resMeta: 0 }, f30: 0, f45: 0, saldo: 0, resc: 0, multa40: 0 };
    var sub = {}, cont = {}, pg = {}, rec = {};
    books.forEach(function (b) {
      var f = b.S.fin, an = analisarCustos(f), rc = f.receita || {}, k = b.kpi || {};
      A2.FR += f.FR; A2.FE += f.FE; A2.resReal += f.resReal; A2.resExec += f.resExec;
      (f.linhas || []).forEach(function (l) { var key = l[0] + "|" + l[1]; var a = sub[key] = sub[key] || [l[0], l[1], 0, 0, null, null]; a[2] += l[2] || 0; a[3] += l[3] || 0; });
      if (an) an.contas.forEach(function (x) { var c = cont[x.conta] = cont[x.conta] || { conta: x.conta, real: 0, exec: 0, desvio: 0, oss: [] }; c.real += x.real; c.exec += x.exec || 0; c.desvio += x.desvio; c.oss.push([b.os, Math.round(x.desvio)]); });
      A2.receita.perda += rc.perdaRI != null ? rc.perdaRI : (rc.perdaPR || 0); A2.receita.perdaPR += rc.perdaPR || 0; A2.receita.sla += rc.sla || 0; A2.receita.nf += rc.nf || 0; A2.receita.dil += rc.dil || 0;
      if (f.promessa && f.promessa.meses && f.promessa.meses.length) { A2.promessa.n++; A2.promessa.res += f.promessa.res; A2.promessa.fc += f.promessa.fc; f.promessa.grupos.forEach(function (x) { pg[x.nome] = (pg[x.nome] || 0) + x.v; }); }
      ["fatAno", "fatMeta", "resAno", "resMeta"].forEach(function (q) { A2.kpi[q] += k[q] || 0; });
      A2.f30 += b.S.rh.fer30 || 0; A2.f45 += b.S.rh.fer45 || 0; A2.saldo += b.S.rh.ferSaldo || 0;
      if (f.folha) { A2.resc += -soma(f.folha.rescTot); A2.multa40 += -soma(f.folha.multa40); }
      (f.recorrentes || []).forEach(function (x) { var r = rec[x[0]] = rec[x[0]] || { conta: x[0], oss: [], real: 0, exec: 0 }; r.oss.push(b.os); r.real += x[4]; r.exec += x[5]; });
    });
    A2.linhas = Object.keys(sub).map(function (k) { return sub[k]; });
    A2.contas = Object.keys(cont).map(function (k) { var c = cont[k]; c.oss.sort(function (a, b) { return a[1] - b[1]; }); c.oss = c.oss.slice(0, 4); c.real = Math.round(c.real); c.exec = Math.round(c.exec); c.desvio = Math.round(c.desvio); return c; })
      .sort(function (a, b) { return a.desvio - b.desvio; }).slice(0, 12);
    A2.promessa.grupos = Object.keys(pg).map(function (k) { return { nome: k, v: Math.round(pg[k]) }; });
    A2.promessa.meses = A2.promessa.n ? [1] : [];
    A2.recorrentes = Object.keys(rec).map(function (k) { return rec[k]; }).sort(function (a, b) { return b.oss.length - a.oss.length || (a.real - a.exec) - (b.real - b.exec); }).slice(0, 10);
    A2.linhasOS = books.map(linhaOS).sort(function (a, b) { return a.gap - b.gap; });
    var mm = {};
    A2.linhasOS.forEach(function (o) { o.mm.forEach(function (x) { var t = mm[x[0]] = mm[x[0]] || [x[0], 0, 0, 0, 0, 0, 0]; t[1] += x[1] || 0; t[2] += x[2] || 0; t[3] += x[3] || 0; t[4] += x[4] || 0; if (x[5] != null) { t[5] += x[5]; t[6]++; } }); });
    A2.mesAMes = Object.keys(mm).map(function (k) { return mm[k]; }).sort(function (a, b) { return a[0] - b[0]; });
    return A2;
  }

  function promptGrupo(nivel, nome, ano, mes, G, extra) {
    var L = [], ger = nivel === "ger", an = analisarCustos(G), quem = ger ? "Gerência " + nome : "Superintendência " + nome;
    function pf(v) { return G.FR ? fmt(v / G.FR * 100, 2) + "%" : "–"; }
    L.push("Você é o controller sênior do Setor de Performance da NPE. Escreva o RELATÓRIO da " + quem + " de janeiro a " + MESF[mes] + "/" + ano + ", analisado mês a mês, com os dados de todas as OSs elegíveis do acompanhamento. Todos os meses do período estão fechados; não comente fechamento nem validação.");
    L.push(ger ? "É para o gerente: mais resumido que o da OS, por OS. Mostre os contratos piores e melhores, as alavancas (custo, faturamento, perda, absenteísmo, folha) e a solução, sempre dizendo quais OSs causam cada impacto."
      : "É para o superintendente: estratégico e mais resumido que o da gerência, por gerência. Mostre onde estão os impactos globais, quais gerências e OSs os causam e as decisões que cabem a ele.");
    L.push("");
    L.push("REGRAS");
    L.push("- Use SOMENTE os números dos DADOS, como estão: R$ 1.500.000 (sem centavos a partir de R$ 1.000), R$ 850,00 abaixo disso, negativos entre parênteses, R$ (647.973); percentuais com duas casas, 10,00%. Nunca abrevie (nada de 'mi' ou 'mil'). Custos sempre positivos.");
    L.push("- Analise o ano mês a mês: use o MÊS A MÊS do grupo e de cada OS para mostrar quando o resultado melhorou ou piorou e por quê; os totais fecham a história.");
    L.push("- Proporcionalidade: se o faturamento cresceu além do executivo, o custo pode crescer na mesma proporção; a margem cai quando algum custo cresce mais que o volume.");
    L.push("- Pessoas (gerentes, gestores, superintendentes) são citadas só pelo nome como está nos DADOS; nunca presuma gênero (não use ele/ela, dele/dela, o gerente/a gerente): escreva 'a gerência de NOME' ou 'as OSs de NOME'.");
    L.push("- Toda afirmação de impacto cita as OSs (código) que o causam" + (ger ? "." : " e a gerência delas."));
    L.push("- Ao falar de contratos, um contrato por linha: cada linha começa com o código e a descrição da OS (ex.: 'M03100 - NEXA - TRES MARIAS: ...') e termina antes do próximo contrato; quebre a linha (\\n) a cada contrato. Nunca deixe o código de um contrato no fim da linha de outro." + (ger ? "" : " O mesmo vale para as gerências: uma gerência por linha, começando pelo nome."));
    L.push("- Acúmulo de férias (30 e 45 dias ou mais) é ponto de atenção: amplia o dissídio e a reoneração. Alertas de projeção (EFETIVO PR/HHT PR que não acompanham a movimentação) devem ser cobrados das OSs citadas.");
    L.push("- Português do Brasil, tom executivo, frases curtas, sem listas dentro dos textos, parágrafos separados por linha em branco, **negrito** só para 1 ou 2 números por texto. Não invente nada; sem registro, diga que não há registro.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push(ger ? '{"sumario":"(2 ou 3 parágrafos, até 1200 caracteres)","ranking":"(uma linha por contrato, do pior para o melhor, cada linha começando pelo código e descrição da OS, com os números dele; até 1200 caracteres)","impactos":"(2 ou 3 parágrafos, até 1500 caracteres: custos acima da proporção, perdas, SLA, não faturáveis e diluídos, FCST prometido x entregue, rescisões; com as OSs que causaram)","pessoas":"(até 900 caracteres: efetivo, HE, absenteísmo, turnover, férias 30/45 e alertas de projeção, com as OSs)","alavancas":[{"alavanca":"(Custo, Faturamento, Perda, Absenteísmo, Folha ou Projeção)","valor":"(até 25 caracteres)","texto":"(até 260 caracteres)","oss":"(códigos)"}] (3 a 6 itens),"plano":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres)","acompanhar":"(até 90 caracteres)","oss":"(códigos)"}] (3 a 6 itens)}'
      : '{"sumario":"(2 parágrafos, até 900 caracteres)","gerencias":"(uma linha por gerência, começando pelo nome, com os números e as OSs que mais pesam; até 1100 caracteres)","impactos":"(até 1200 caracteres: os impactos globais e quem causa, gerência e OSs)","pessoas":"(até 600 caracteres: férias, absenteísmo, turnover e alertas de projeção)","alavancas":[{"alavanca":"","valor":"","texto":"(até 220 caracteres)","oss":"(gerência e códigos)"}] (3 a 5 itens),"plano":[{"acao":"","efeito":"(até 180 caracteres)","acompanhar":"","oss":""}] (3 a 5 itens)}');
    L.push("");
    L.push("DADOS (" + quem + ", " + G.linhasOS.length + " OSs elegíveis" + (extra.semBook && extra.semBook.length ? "; sem dados no painel: " + extra.semBook.join(", ") : "") + ")");
    L.push("JAN A " + MES[mes].toUpperCase() + ": faturamento real " + rs(G.FR) + " x executivo " + rs(G.FE) + " (" + (G.FE ? fmt((G.FR / G.FE - 1) * 100, 2) + "%" : "–") + ") | resultado real " + rs(G.resReal) + " x executivo " + rs(G.resExec) + " | margem real " + pct(G.FR ? G.resReal / G.FR : null) + " x executivo " + pct(G.FE ? G.resExec / G.FE : null) + ".");
    if (G.mesAMes && G.mesAMes.length) L.push("MÊS A MÊS DO GRUPO (faturamento real x executivo | resultado real x executivo | resultado previsto no FCST do mês anterior): " + G.mesAMes.map(function (t) { return MES[t[0]] + ": " + rs(t[1]) + " x " + rs(t[3]) + " | " + rs(t[2]) + " x " + rs(t[4]) + (t[6] ? " | FCST " + rs(t[5]) : ""); }).join(" · ") + ".");
    L.push("PROJEÇÃO DO ANO (real até o mês + projetado no painel até dezembro, somando as OSs): faturamento " + rs(G.kpi.fatAno) + " x meta " + rs(G.kpi.fatMeta) + " | resultado " + rs(G.kpi.resAno) + " x meta " + rs(G.kpi.resMeta) + ".");
    if (an) L.push("PONTE DA MARGEM DO GRUPO (p.p. por grupo de custo; negativo = custou mais que a proporção): " + an.grupos.map(function (g) { return g.nome + " " + (g.pp > 0 ? "+" : "") + fmt(g.pp, 2); }).join("; ") + ".");
    L.push("CONTAS QUE MAIS PESARAM (quanto custaram a mais que a proporção, somando as OSs; e as OSs que mais contribuíram): " + G.contas.slice(0, 10).map(function (c) { return c.conta + " " + dif(c.desvio) + " (" + c.oss.filter(function (o) { return o[1] < 0; }).map(function (o) { return o[0] + " " + moeda(Math.abs(o[1])); }).join(", ") + ")"; }).join("; ") + ".");
    if (G.recorrentes.length) L.push("CUSTOS ACIMA DO EXECUTIVO DE FORMA RECORRENTE (conta: OSs): " + G.recorrentes.map(function (r) { return r.conta + ": " + r.oss.join(", "); }).join("; ") + ".");
    var rc = G.receita, pot = G.resReal + rc.perda + rc.sla + rc.nf;
    L.push("RECEITA E CUSTO SEM FATURAMENTO: perdas " + rs(rc.perda) + " (" + pf(rc.perda) + ") | SLA " + rs(rc.sla) + " (" + pf(rc.sla) + ") | não faturáveis " + rs(rc.nf) + " (" + pf(rc.nf) + ") | resultado potencial (real + perdas + SLA + não faturáveis) " + rs(pot) + ", margem " + pct(G.FR ? pot / G.FR : null) + ". Diluídos, apenas informativo e fora de qualquer conta: " + rs(rc.dil) + ".");
    if (G.promessa.n) L.push("FCST: somando as OSs, os FCSTs do mês anterior prometeram " + rs(G.promessa.fc) + " e o realizado foi " + rs(G.promessa.res) + " (diferença " + rs(G.promessa.res - G.promessa.fc) + "). Por grupo: " + G.promessa.grupos.slice().sort(function (a, b) { return a.v - b.v; }).map(function (x) { return x.nome + (x.v < 0 ? " piorou " : " melhorou ") + moeda(Math.abs(x.v)); }).join("; ") + ".");
    L.push("FOLHA: rescisões e encargos rescisórios " + rs(G.resc) + ", dos quais multa de 40% do FGTS " + rs(G.multa40) + ". Férias: " + fmt(G.f30) + " pessoas com 30 dias ou mais e " + fmt(G.f45) + " com 45 dias ou mais (saldo " + fmt(G.saldo) + " dias).");
    if (!ger && extra.porGer) {
      L.push("");
      L.push("POR GERÊNCIA (faturamento real x executivo | resultado real x executivo | margem real | perdas | férias 45+ | OSs com alerta de projeção):");
      extra.porGer.forEach(function (g) { L.push("  " + g.nome + " (" + g.n + " OSs): " + rs(g.FR) + " x " + rs(g.FE) + " | " + rs(g.res) + " x " + rs(g.rex) + " | " + pct(g.FR ? g.res / g.FR : null) + " | " + rs(g.perda) + " | " + fmt(g.f45) + " | " + (g.alertas.length ? g.alertas.join(", ") : "nenhuma")); });
    }
    L.push("");
    L.push("POR OS (do pior para o melhor resultado contra o executivo):");
    G.linhasOS.forEach(function (o) {
      L.push("  " + (String(o.desc).indexOf(o.os) === 0 ? o.desc : o.os + " " + o.desc) + (ger ? "" : " [" + o.ger + "]") + " | gestor " + (o.gestor || "–") + " | faturamento " + rs(o.FR) + " x " + rs(o.FE) + " | resultado " + rs(o.res) + " x " + rs(o.rex) + " (diferença " + rs(o.gap) + ") | margem " + pct(o.FR ? o.res / o.FR : null) + " x " + pct(o.FE ? o.rex / o.FE : null) +
        " | perdas " + rs(o.perda) + " | SLA " + rs(o.sla) + " | não faturáveis " + rs(o.nf) + " | diluídos (informativo) " + rs(o.dil) + " | HE " + (o.heDesvio < 0 ? moeda(-o.heDesvio) + " acima da proporção" : "na proporção") + " | rescisões " + rs(o.rescTot) +
        " | efetivo " + fmt(o.efet) + " (" + o.adm + " admissões, " + o.dem + " demissões no ano, " + o.demTurn + " contam no turnover) | absenteísmo médio mensal " + pct(o.abs) + " | férias 30+ " + fmt(o.f30) + ", 45+ " + fmt(o.f45) + (o.alerta ? " | ALERTA DE PROJEÇÃO: " + o.alerta.join("; ") : ""));
      L.push("    resultado mês a mês (real x executivo): " + o.mm.map(function (x) { return MES[x[0]] + " " + rs(x[2]) + " x " + rs(x[4]); }).join(" · "));
      if (ger && o.diag) L.push("    diagnóstico da OS: " + String(o.diag).replace(/\s+/g, " ").slice(0, 420));
    });
    return L.join("\n");
  }
  function conferirGrupo(j, nivel) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    (nivel === "ger" ? ["sumario", "ranking", "impactos", "pessoas"] : ["sumario", "gerencias", "impactos", "pessoas"]).forEach(function (k) { if (!j[k] || String(j[k]).length < 60) falta.push(k); });
    if (!Array.isArray(j.alavancas) || j.alavancas.length < 2) falta.push("alavancas");
    if (!Array.isArray(j.plano) || j.plano.length < 2) falta.push("plano");
    return falta;
  }
  function porGerencia(linhas) {
    var g = {};
    linhas.forEach(function (o) { var k = o.ger || "(sem gerente)"; var x = g[k] = g[k] || { nome: k, n: 0, FR: 0, FE: 0, res: 0, rex: 0, perda: 0, f45: 0, alertas: [] }; x.n++; x.FR += o.FR; x.FE += o.FE; x.res += o.res; x.rex += o.rex; x.perda += o.perda; x.f45 += o.f45 || 0; if (o.alerta) x.alertas.push(o.os); });
    return Object.keys(g).map(function (k) { return g[k]; }).sort(function (a, b) { return (a.res - a.rex) - (b.res - b.rex); });
  }
  async function gerarGrupo(nivel, nome, opts) {
    opts = opts || {};
    var ano = opts.ano || anoAtivo(), mes = opts.mes || mesAtivo() || (A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 0);
    if (!(mes >= 1)) throw new Error("Selecione o mês no Power BI.");
    if (A.garantirHierarquia) await A.garantirHierarquia();
    var alvo = String(nome).toUpperCase(), lista = elegiveis().filter(function (o) { return String((nivel === "ger" ? o.ger : o.sup) || "").trim().toUpperCase() === alvo; });
    if (!lista.length) throw new Error("Nenhuma OS elegível do acompanhamento para " + nome + ".");
    var tk;
    if (opts.token) tk = { login: opts.login, token: opts.token };
    else if (opts.login && opts.senha) {
      var aa = await A.autenticarAcesso(opts.login, opts.senha);
      if (!aa.ok || String(aa.token || "").length !== 64) throw new Error(aa.erro || "O login do agente nao gerou token.");
      tk = { login: String(opts.login).toLowerCase().trim(), token: aa.token };
    } else tk = await obterToken();
    var res = [], falhas = [], fila = lista.slice(), feitas = 0;
    async function trabalhador() {
      while (fila.length) {
        var o = fila.shift();
        try { res.push(await resumoOS(o, ano, mes, tk, opts.urlFluxo)); } catch (e) { falhas.push(o); }
        feitas++; progresso("Lendo os dados das OSs de " + nome + " no painel: " + feitas + " de " + lista.length + "…");
      }
    }
    await Promise.all([trabalhador(), trabalhador(), trabalhador()]);
    // segunda tentativa, uma por vez, guardando o motivo de quem falhar de novo
    var semDados = [];
    for (var fi = 0; fi < falhas.length; fi++) {
      try { res.push(await resumoOS(falhas[fi], ano, mes, tk, opts.urlFluxo)); }
      catch (e) { semDados.push(falhas[fi].codigo + " (" + String(e && e.message || e).slice(0, 120) + ")"); }
    }
    if (!res.length) throw new Error("O painel não devolveu dados para as OSs de " + nome + ".");
    var G = agregarGrupo(res), extra = { semBook: semDados };
    if (nivel === "sup") extra.porGer = porGerencia(G.linhasOS);
    var titulo = maisComum(res.map(function (b) { return nivel === "ger" ? b.ger : b.sup; })) || nome;
    var prompt = promptGrupo(nivel, titulo, ano, mes, G, extra);
    progresso("A IA está escrevendo o relatório de " + titulo + " (" + res.length + " OSs)…");
    var j = null, falta = ["tudo"], tent = 0;
    while (falta.length && tent < 2) {
      var p = tent === 0 ? prompt : prompt + "\n\nATENÇÃO: na resposta anterior faltaram ou vieram vazios: " + falta.join(", ") + ". Devolva o JSON COMPLETO.";
      var txt = await A.chamarGerarTexto("gpt41", p);
      try { j = extrairJSON(txt); falta = conferirGrupo(j, nivel); } catch (e) { falta = ["JSON válido"]; }
      tent++;
    }
    if (falta.length) throw new Error("A IA não completou o relatório (faltou: " + falta.join(", ") + ").");
    var s2 = A.sessaoAcesso ? A.sessaoAcesso() : null;
    var book = { v: 2, nivel: nivel, chave: alvo, nome: titulo, sup: nivel === "ger" ? maisComum(res.map(function (b) { return b.sup; })) : titulo, ano: ano, mes: mes, em: new Date().toISOString(), por: s2 ? s2.login : "",
      G: G, porGer: extra.porGer || null, semBook: semDados,
      txt: { sumario: j.sumario, ranking: j.ranking || "", gerencias: j.gerencias || "", impactos: j.impactos, pessoas: j.pessoas, alavancas: j.alavancas.slice(0, 6), plano: j.plano.slice(0, 6) } };
    if (opts.gravar === false) return book;
    progresso("Gravando no SharePoint…");
    await gravar(nivel, alvo, book);
    return book;
  }

  // resultado do grupo mes a mes: barra = real, traco = executivo
  function chMesGrupo(mm) {
    if (!mm || !mm.length) return "";
    var vals = []; mm.forEach(function (t) { vals.push(t[2], t[4]); });
    var mn = Math.min.apply(null, vals.concat([0])), mx = Math.max.apply(null, vals.concat([0])), pad = (mx - mn) * 0.15 || 1; mn -= pad; mx += pad;
    var f = fr(1100, 300, { l: 80, r: 10, t: 24, b: 26 }), n = mm.length, bw = f.iw / n, y = function (v) { return f.m.t + (mx - v) / (mx - mn) * f.ih; };
    var s = "", passo = niceMax((mx - mn) / 5);
    for (var v = Math.ceil(mn / passo) * passo; v <= mx; v += passo) s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (Math.abs(v) < 1e-9 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="10" fill="' + COR.muted + '">' + fmt(v) + "</text>";
    mm.forEach(function (t, i) {
      var x = f.m.l + bw * i + bw * 0.25, w = bw * 0.5, r = t[2], e = t[4], top = y(Math.max(0, r)), h = Math.abs(y(r) - y(0));
      s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + Math.max(1.5, h) + '" rx="2" fill="' + (r >= e ? COR.teal : COR.red) + '"/>';
      s += '<line x1="' + (x - 6) + '" x2="' + (x + w + 6) + '" y1="' + y(e) + '" y2="' + y(e) + '" stroke="' + COR.navy + '" stroke-width="3"/>';
      s += lbl(x + w / 2, (r >= 0 ? top - 6 : y(r) + 14), moeda(r), { s: 10 });
    });
    return svg(f, s + eixoX(f, mm.map(function (t) { return MES[t[0]]; })), "Resultado mês a mês");
  }
  function chGap(linhas) {
    var xs = linhas.slice(0, 14), max = Math.max.apply(null, xs.map(function (o) { return Math.abs(o.gap); }).concat([1]));
    var lh = 30, f = fr(1100, 20 + xs.length * lh, { l: 300, r: 150, t: 10, b: 10 }), mid = f.m.l + f.iw / 2, sc = function (v) { return Math.abs(v) / max * (f.iw / 2 - 10); };
    var s = '<line x1="' + mid + '" x2="' + mid + '" y1="' + f.m.t + '" y2="' + (f.H - f.m.b) + '" stroke="' + COR.muted + '"/>';
    xs.forEach(function (o, i) {
      var y = f.m.t + i * lh, w = sc(o.gap), neg = o.gap < 0;
      s += '<text x="' + (f.m.l - 10) + '" y="' + (y + 19) + '" text-anchor="end" font-size="12.5" fill="' + COR.ink + '">' + esc((o.os + " " + o.desc.replace(/^\S+\s*-\s*/, "")).slice(0, 40)) + "</text>";
      s += '<rect x="' + (neg ? mid - w : mid) + '" y="' + (y + 6) + '" width="' + w + '" height="17" rx="2" fill="' + (neg ? COR.red : COR.teal) + '"/>';
      s += '<text x="' + (f.W - 6) + '" y="' + (y + 19) + '" text-anchor="end" font-size="12" font-weight="700" fill="' + (neg ? COR.badfg : COR.okfg) + '">' + moeda(o.gap) + "</text>";
    });
    return svg(f, s, "Resultado contra o executivo por OS");
  }
  function renderRelatorioGrupo(b) {
    var G = b.G, t = b.txt || {}, ger = b.nivel === "ger", an = analisarCustos(G), h = [], fig = 0, nc = 0;
    function figura(titulo, cap, corpo) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + "</figure>"; }
    function par(txt) { return String(txt || "").split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) { return '<p>' + rico(p) + "</p>"; }).join(""); }
    function cap(n, tit, corpo, cls) { return '<section class="rl-cap' + (cls ? " " + cls : "") + '"><h2><span>' + n + "</span>" + tit + "</h2>" + corpo + "</section>"; }
    function cel(l, v, s2, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s2 + "</span></div>"; }
    var margR = G.FR ? G.resReal / G.FR : null, margE = G.FE ? G.resExec / G.FE : null, k = G.kpi;
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório da ' + (ger ? "Gerência" : "Superintendência") + '</span><span class="rl-per">janeiro a ' + MESF[b.mes] + " de " + b.ano + "</span></div>" +
      "<h1>" + esc(b.nome) + "</h1>" + '<div class="rl-ficha">' + (ger ? "<span>Superintendente: <b>" + esc(b.sup || "–") + "</b></span>" : "") + "<span>OSs elegíveis: <b>" + G.linhasOS.length + "</b></span>" +
      (b.porGer ? "<span>Gerências: <b>" + b.porGer.length + "</b></span>" : "") + (b.semBook && b.semBook.length ? "<span>Sem dados no painel: <b>" + esc(b.semBook.join(", ")) + "</b></span>" : "") + "</div></header>");
    h.push('<section class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", moeda(G.FR), "executivo " + moeda(G.FE), G.FR >= G.FE ? "ok" : "bad") + cel("Resultado", moeda(G.resReal), "executivo " + moeda(G.resExec), G.resReal >= G.resExec ? "ok" : "bad") + cel("Margem", pct(margR), "executivo " + pct(margE), margR >= margE ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Projeção do ano · real + projetado até dez</h3>' +
      cel("Faturamento", moeda(k.fatAno), "meta " + moeda(k.fatMeta), k.fatAno >= k.fatMeta ? "ok" : "bad") + cel("Resultado", moeda(k.resAno), "meta " + moeda(k.resMeta), k.resAno >= k.resMeta ? "ok" : "bad") +
      cel("Margem", pct(k.fatAno ? k.resAno / k.fatAno : null), "meta " + pct(k.fatMeta ? k.resMeta / k.fatMeta : null), (k.fatAno && k.fatMeta && k.resAno / k.fatAno >= k.resMeta / k.fatMeta) ? "ok" : "bad") + "</div></section>");
    h.push(cap(++nc, "Sumário executivo", par(t.sumario) + figura("Resultado do mês, somando as OSs", "barra = realizado (verde acima do executivo, vermelho abaixo) · traço = executivo do mês", chMesGrupo(G.mesAMes))));
    // ranking / gerencias
    var tabOS = '<div class="rl-tab"><table><thead><tr><th>OS</th>' + (ger ? "<th>Gestor</th>" : "<th>Gerente</th>") + "<th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Potencial</th></tr></thead><tbody>" +
      G.linhasOS.map(function (o) {
        return "<tr><td>" + esc(o.os) + "</td><td>" + esc(ger ? o.gestor : o.ger) + "</td><td>" + moeda(o.FR) + "</td><td>" + (o.FE ? (o.FR >= o.FE ? "+" : "") + fmt((o.FR / o.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (o.res < o.rex ? "neg" : "pos") + '">' + moeda(o.res) + "</td><td>" + moeda(o.rex) + "</td><td>" + pct(o.FR ? o.res / o.FR : null) + "</td><td>" + moeda(o.perda) + "</td><td>" + moeda(o.pot) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    if (ger) h.push(cap(++nc, "Contratos: onde está o resultado", par(t.ranking) + figura("Resultado contra o executivo, por OS", "jan a " + MES[b.mes] + " · vermelho = abaixo do executivo", chGap(G.linhasOS)) + figura("As OSs da gerência", "do pior para o melhor resultado contra o executivo", tabOS)));
    else {
      var tabG = '<div class="rl-tab"><table><thead><tr><th>Gerência</th><th>OSs</th><th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Férias 45+</th><th>Alertas de projeção</th></tr></thead><tbody>' +
        (b.porGer || []).map(function (g) { return "<tr><td>" + esc(g.nome) + "</td><td>" + g.n + "</td><td>" + moeda(g.FR) + "</td><td>" + (g.FE ? (g.FR >= g.FE ? "+" : "") + fmt((g.FR / g.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (g.res < g.rex ? "neg" : "pos") + '">' + moeda(g.res) + "</td><td>" + moeda(g.rex) + "</td><td>" + pct(g.FR ? g.res / g.FR : null) + "</td><td>" + moeda(g.perda) + "</td><td>" + fmt(g.f45) + "</td><td>" + esc(g.alertas.join(", ") || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>";
      h.push(cap(++nc, "Gerências: onde está o resultado", par(t.gerencias) + figura("As gerências", "da pior para a melhor contra o executivo", tabG) + figura("As OSs que mais pesam", "as 14 piores contra o executivo", chGap(G.linhasOS))));
    }
    // impactos
    var rc = G.receita, pot = G.resReal + rc.perda + rc.sla + rc.nf;
    var tabC = '<div class="rl-tab"><table><thead><tr><th>Conta</th><th>Custou a mais que a proporção</th><th>OSs que mais contribuíram</th></tr></thead><tbody>' +
      G.contas.filter(function (c) { return c.desvio < 0; }).slice(0, 8).map(function (c) { return "<tr><td>" + esc(String(c.conta).replace(/^\d+\s*-\s*/, "")) + '</td><td class="neg">' + moeda(-c.desvio) + '</td><td class="rl-cx">' + esc(c.oss.filter(function (o) { return o[1] < 0; }).map(function (o) { return o[0] + " " + moeda(-o[1]); }).join(" · ")) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    h.push(cap(++nc, "Impactos: o que tirou resultado e quem causou", par(t.impactos) +
      (an ? figura("Ponte da margem do grupo", "pontos percentuais de margem por grupo de custo, somando as OSs", chPonte(an)) : "") +
      figura("As contas que mais pesaram", "", tabC) +
      figura("Resultado potencial do grupo", "sem perdas, SLA e não faturáveis · margem real " + pct(margR) + " → potencial " + pct(G.FR ? pot / G.FR : null), chPotencial({ res: G.resReal, perda: rc.perda, sla: rc.sla, nf: rc.nf }))));
    // pessoas
    var tabP = '<div class="rl-tab"><table><thead><tr><th>OS</th><th>Efetivo</th><th>Adm./dem. no ano</th><th>HE no mês</th><th>Absenteísmo médio</th><th>Demissões (turnover)</th><th>Férias 30+</th><th>Férias 45+</th><th>Projeção</th></tr></thead><tbody>' +
      G.linhasOS.map(function (o) { return "<tr><td>" + esc(o.os) + "</td><td>" + fmt(o.efet) + "</td><td>" + o.adm + " / " + o.dem + "</td><td>" + (o.he == null ? "–" : fmt(o.he, 2) + "%") + "</td><td>" + pct(o.abs) + "</td><td>" + o.demTurn + "</td><td>" + fmt(o.f30) + '</td><td class="' + ((o.f45 || 0) > 0 ? "neg" : "") + '">' + fmt(o.f45) + '</td><td class="' + (o.alerta ? "neg" : "") + '">' + (o.alerta ? "corrigir" : "ok") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var al = G.linhasOS.filter(function (o) { return o.alerta; });
    h.push(cap(++nc, "Pessoas, férias e projeção", (al.length ? '<div class="rl-alerta"><b>Projeção a corrigir em ' + al.length + (al.length > 1 ? " OSs" : " OS") + "</b>" + esc(al.map(function (o) { return o.os + ": " + o.alerta[0]; }).join(" · ")) + "</div>" : "") + par(t.pessoas) + figura("Pessoas por OS", "férias: pessoas com 30 dias ou mais de saldo (já têm direito) e com 45 dias ou mais (ponto de atenção)", tabP)));
    // alavancas e plano
    h.push(cap(++nc, "Alavancas", '<div class="bk-orcgrid">' + (t.alavancas || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.alavanca || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(o.texto || "") + "</p>" + (o.oss ? '<p class="rl-nota">' + esc(o.oss) + "</p>" : "") + "</div>"; }).join("") + "</div>"));
    h.push(cap(++nc, "Plano de ação", '<ol class="rl-plano">' + (t.plano || []).map(function (p) { return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(p.efeito) + "</span>" : "") + (p.acompanhar || p.oss ? '<em>' + (p.acompanhar ? "Acompanhar: " + esc(p.acompanhar) : "") + (p.oss ? " · " + esc(p.oss) : "") + "</em>" : "") + "</li>"; }).join("") + "</ol>"));
    h.push('<div class="bk-fontes">Dados de todas as OSs elegíveis do acompanhamento, direto do painel (RESULTADOS, RECEITA IDEAL e CTT), janeiro a ' + MESF[b.mes] + ". Textos escritos por IA. Gerado em " + esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }

  // ------------------------------------------------------------------ tela
  var _prog = "";
  function progresso(t) { _prog = t; var p = el("bkProgresso"); if (p) { p.style.display = t ? "block" : "none"; p.textContent = t; } }
  function osPermitidas() {
    var lista = [];
    try { lista = master() ? A.tab5OSElegiveis() : A.tab5OSDoUsuario(); } catch (e) { lista = []; }
    return lista || [];
  }
  function abas() {
    return '<div class="bk-tabs"><button type="button" class="' + (st.nivel === "os" ? "on" : "") + '" data-action="book:nivel:os">OS</button><button type="button" disabled title="Em revisão">Gerência</button><button type="button" disabled title="Em revisão">Superintendência</button></div>';
  }
  async function renderGrupo(box) {
    var nivel = st.nivel, ano = anoAtivo(), mes = A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 0, rot = nivel === "ger" ? "Gerência" : "Superintendência";
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() + '</div><div id="bkConteudo"><p class="bk-vazio">Carregando…</p></div></div>';
    var gs = [], mapa = {};
    try { gs = listarGrupos(nivel); mapa = await lerNivel(nivel); } catch (e) { var c0 = el("bkConteudo"); if (c0) c0.innerHTML = '<p class="bk-vazio">Não consegui ler os books: ' + esc(e.message || e) + "</p>"; return; }
    // acesso pela hierarquia: Master ve todos; os demais, os grupos das suas OSs
    if (!master()) { var minhas = osPermitidas().map(function (o) { return o.codigo; }); gs = gs.filter(function (g) { return g.oss.some(function (os) { return minhas.indexOf(os) >= 0; }); }); }
    Object.keys(mapa).forEach(function (k) { if (!gs.some(function (g) { return g.nome === k; }) && (master() || false)) gs.push({ nome: k, oss: [] }); });
    var sel = st.sel[nivel] && gs.some(function (g) { return g.nome === st.sel[nivel]; }) ? st.sel[nivel] : (gs[0] ? gs[0].nome : "");
    st.sel[nivel] = sel;
    var itens = gs.map(function (g) { return '<button type="button" class="bk-dd-it' + (g.nome === sel ? " on" : "") + '" data-action="book:grp:' + esc(g.nome) + '" data-busca="' + esc(g.nome) + '">' + esc(g.nome) + (g.oss.length ? " · " + g.oss.length + " OSs" : "") + "</button>"; }).join("");
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() +
      '<div class="bk-dd"><span class="bk-dd-rot">' + rot + '</span><button type="button" class="bk-dd-btn" data-action="book:dd" aria-haspopup="listbox">' + esc(sel || "Nenhum grupo") + '</button>' +
      '<div class="bk-dd-pan" id="bkDdPan" style="display:none"><input type="text" id="bkDdBusca" placeholder="Buscar…" autocomplete="off"><div class="bk-dd-lista" id="bkDdLista" role="listbox">' + (itens || '<p class="bk-dd-vazio">Nenhum grupo.</p>') + "</div></div></div>" +
      (master() ? '<span class="bk-acoes">' + (temChaveIA() ? '<button type="button" class="bk-bt sec" data-action="book:gerargrp"' + (sel ? "" : " disabled") + ">🤖 Gerar agora (neste navegador)</button>" : "") +
        '<button type="button" class="bk-bt" data-action="book:nuvemgrp" title="O agente da nuvem gera e grava os relatórios de todas as ' + (nivel === "ger" ? "gerências" : "superintendências") + '">☁ Gerar pela nuvem</button></span>' : "") +
      '</div><div id="bkProgresso" class="bk-prog" style="display:none"></div><div class="bk-dica">O relatório da ' + rot.toLowerCase() + " usa os dados de todas as OSs elegíveis do acompanhamento, direto do painel.</div>" + '<div id="bkConteudo"></div></div>';
    var busca = el("bkDdBusca");
    if (busca) busca.oninput = function () { var q = String(busca.value || "").toUpperCase().trim(); Array.prototype.forEach.call(document.querySelectorAll("#bkDdLista .bk-dd-it"), function (b) { b.style.display = (!q || b.getAttribute("data-busca").indexOf(q) >= 0) ? "" : "none"; }); };
    if (_prog) progresso(_prog);
    var c = el("bkConteudo"); if (!c) return;
    var reg = sel ? mapa[sel] : null;
    c.innerHTML = !sel ? '<p class="bk-vazio">Nenhuma OS elegível encontrada.</p>' : (reg && reg.d ? renderRelatorioGrupo(reg.d) : '<p class="bk-vazio">Ainda não há relatório gravado para ' + esc(sel) + ".</p>");
  }
  async function render() {
    var box = el("tabBookContainer"); if (!box) return;
    if (A.garantirHierarquia) { try { await A.garantirHierarquia(); } catch (e) {} }
    st.nivel = "os"; // Gerência/Superintendência em revisão
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
    var dica = !temChaveIA() ? "" : (!osSlicer ? "Para gerar neste navegador, filtre uma única OS no Power BI (ou use Gerar pela nuvem)" : (os !== osSlicer ? "Para gerar neste navegador, selecione esta OS no filtro do Power BI (ou use Gerar pela nuvem)" : ""));
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() +
      '<div class="bk-dd"><span class="bk-dd-rot">OS</span><button type="button" class="bk-dd-btn" data-action="book:dd" aria-haspopup="listbox">' + rotSel + '</button>' +
      '<div class="bk-dd-pan" id="bkDdPan" style="display:none"><input type="text" id="bkDdBusca" placeholder="Buscar por código ou nome…" autocomplete="off"><div class="bk-dd-lista" id="bkDdLista" role="listbox">' + (itens || '<p class="bk-dd-vazio">Nenhuma OS disponível.</p>') + "</div></div></div>" +
      (master() ? '<span class="bk-acoes">' + (temChaveIA() ? '<button type="button" class="bk-bt sec" data-action="book:gerar"' + (podeGerar ? "" : ' disabled title="' + esc(dica) + '"') + ">🤖 Gerar agora (neste navegador)</button>" : "") +
        '<button type="button" class="bk-bt" data-action="book:nuvem"' + (os ? "" : ' disabled title="Escolha uma OS na lista"') + ' title="O agente da nuvem gera e grava o book desta OS em alguns minutos">☁ Gerar pela nuvem</button></span>' : "") +
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
      c.innerHTML = (reg.d && reg.d.v >= 2) ? renderRelatorioOS(reg.d) : renderBookOS(reg.d);
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
    if (nome === "nivel:os" || nome === "nivel:ger" || nome === "nivel:sup") { st.nivel = nome.slice(6); render(); return; }
    if (nome.indexOf("grp:") === 0) { st.sel[st.nivel] = nome.slice(4); abrirLista(false); render(); return; }
    if (nome === "gerargrp") {
      if (st.carregando || !st.sel[st.nivel]) return;
      st.carregando = true;
      try { await gerarGrupo(st.nivel, st.sel[st.nivel], {}); progresso(""); toast("✅ Relatório gravado."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; render(); }
      return;
    }
    if (nome === "nuvemgrp") {
      if (st.carregando) return;
      st.carregando = true;
      try { progresso("Pedindo ao agente da nuvem os relatórios de " + (st.nivel === "ger" ? "gerência" : "superintendência") + "…"); await pedirAoAgente("", st.nivel === "ger" ? "aba6g" : "aba6s"); progresso("☁ Pedido enviado. O agente monta e grava os relatórios em alguns minutos; depois é só abrir esta aba de novo."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; }
      return;
    }
    if (nome === "dd") { abrirLista(); return; }
    if (nome.indexOf("os:") === 0) { st.sel.os = nome.slice(3); abrirLista(false); render(); return; }
    if (nome === "fluxo") { configurarFluxo(); return; }
    if (nome === "nuvem") {
      if (st.carregando || !st.sel.os) return;
      st.carregando = true;
      try { progresso("Pedindo ao agente da nuvem o book de " + st.sel.os + "…"); await pedirAoAgente(st.sel.os); progresso("☁ Pedido enviado. O agente gera e grava o book de " + st.sel.os + " em alguns minutos; depois é só abrir esta aba de novo."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; }
      return;
    }
    if (nome === "gerar") {
      if (st.carregando) return;
      st.carregando = true;
      try { await gerarOS({}); progresso(""); toast("✅ Book gravado."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; render(); }
    }
  }

  window.BOOK = { render: render, acao: acao, gerarOS: gerarOS, lerNivel: lerNivel, _promptOS: promptOS, _coletarOS: coletarOS, _montarSeries: montarSeries, _renderBookOS: renderBookOS, _renderRelatorioOS: renderRelatorioOS, _analisarCustos: analisarCustos, _montarFin: montarFin, _conferirProjecao: conferirProjecao, gerarGrupo: gerarGrupo, listarGrupos: listarGrupos, _agregarGrupo: agregarGrupo, _promptGrupo: promptGrupo, _renderRelatorioGrupo: renderRelatorioGrupo };
})();
