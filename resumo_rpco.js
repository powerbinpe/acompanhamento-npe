/* Resumo para a RPCO (25/11/2026). Usado pelo book (Aba 6) e pela pagina RPCO (rpco.html).
   Diagnostico por UM indicador, o CUSTO POR HHT, com a margem do executivo como base:
   ideal = faturamento por hora x (1 - margem do executivo). Cada OS guarda a sua "base" (somas de
   faturamento, custo e horas do acumulado, dos ultimos 3 meses, da projecao e do executivo); qualquer
   conjunto de OSs (gerencia, superintendencia, empresa ou uma selecao) e a soma das bases. */
(function () {
  "use strict";
  var MES = ["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function fmt(v, d) { d = d || 0; return v == null || !isFinite(v) ? "–" : Number(v).toLocaleString("pt-BR", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function rs(v) { return v == null || !isFinite(v) ? "–" : "R$ " + fmt(Math.round(v)); }
  function rsh(v) { return v == null || !isFinite(v) ? "–" : "R$ " + fmt(v, 2); }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function div(a, b) { return a == null || b == null || !b ? null : a / b; }
  function soma(bs, k, q) { var s = 0, tem = false; bs.forEach(function (b) { var o = b[k]; if (o && o[q] != null && isFinite(o[q])) { s += +o[q]; tem = true; } }); return tem ? s : null; }
  function maisComum(xs) { var c = {}, best = "", n = 0; xs.forEach(function (x) { if (!x) return; c[x] = (c[x] || 0) + 1; if (c[x] > n) { n = c[x]; best = x; } }); return best; }
  var ROT_QUEM = { ger: "OSs que mais tiram do ideal", sup: "Gerências que mais tiram do ideal", dir: "Superintendências que mais tiram do ideal", sel: "OSs que mais tiram do ideal" };
  var N_CAUSAS = { os: 3, sel: 2, ger: 2, sup: 2, dir: 2 };

  // bases: [{os, nome, ger, sup, neg, ms0, ms1, horiz, tol, acum{f,c,h}, ex{f,r,c,h}, ult{f,c,h}, pj{f,c,h}, anoEx{f,r}, causas[{conta,valor,tipo,rec}], alertas[], semReaj}]
  function deBases(bases, nivel, rotulo) {
    var B = (bases || []).filter(function (b) { return b && b.acum && b.acum.h; }); if (!B.length) return null;
    var A = { f: soma(B, "acum", "f"), c: soma(B, "acum", "c"), h: soma(B, "acum", "h") };
    var X = { f: soma(B, "ex", "f"), r: soma(B, "ex", "r"), c: soma(B, "ex", "c"), h: soma(B, "ex", "h") };
    var U = { f: soma(B, "ult", "f"), c: soma(B, "ult", "c"), h: soma(B, "ult", "h") };
    var P = { f: soma(B, "pj", "f"), c: soma(B, "pj", "c"), h: soma(B, "pj", "h") };
    var AE = { f: soma(B, "anoEx", "f"), r: soma(B, "anoEx", "r") };
    var m = AE.f ? AE.r / AE.f : div(X.r, X.f); if (m == null) return null;
    var ideal = function (fph) { return fph == null ? null : fph * (1 - m); };
    var tol = B[0].tol != null ? B[0].tol : 0.054;
    var margU = U.f ? (U.f - U.c) / U.f : null, margP = P.f ? (P.f - P.c) / P.f : null;
    function leituraDe(mu, mp) { return mp == null || mu == null ? "sem projeção" : (mp - mu > tol ? "OTIMISTA" : (mp - mu < -tol ? "CONSERVADORA" : "COERENTE")); }
    var hAno = (A.h || 0) + (P.h || 0), fAno = (A.f || 0) + (P.f || 0), cAno = (A.c || 0) + (P.c || 0);
    var fphU = div(U.f, U.h), fphP = div(P.f, P.h);
    var ms0 = Math.min.apply(null, B.map(function (b) { return b.ms0 || 1; })), ms1 = Math.max.apply(null, B.map(function (b) { return b.ms1 || 1; }));
    // contas: soma por conta, com as OSs que mais contribuiram
    var ct = {};
    B.forEach(function (b) { (b.causas || []).forEach(function (x) { var c = ct[x.conta] = ct[x.conta] || { conta: x.conta, valor: 0, tipo: x.tipo, rec: x.rec, oss: [] }; c.valor += x.valor || 0; c.oss.push([b.os, x.valor || 0]); }); });
    var causas = Object.keys(ct).map(function (k) { var c = ct[k]; c.oss.sort(function (p, q) { return q[1] - p[1]; }); c.oss = c.oss.slice(0, 2).map(function (o) { return o[0]; }); return c; })
      .sort(function (p, q) { return q.valor - p.valor; }).slice(0, N_CAUSAS[nivel] || 2);
    // quem mais tira do ideal: custo acima do que entregaria a margem do executivo, no acumulado
    var quem = [];
    if (nivel !== "os") {
      var gk = {};
      B.forEach(function (b) {
        var k = nivel === "sup" ? (b.ger || "(sem gerência)") : nivel === "dir" ? (b.sup || "(sem superintendência)") : (b.nome || b.os);
        var g = gk[k] = gk[k] || { nome: k, v: 0 }; g.v += (b.acum.c || 0) - (b.acum.f || 0) * (1 - m);
      });
      quem = Object.keys(gk).map(function (k) { return gk[k]; }).filter(function (g) { return g.v >= 1; }).sort(function (p, q) { return q.v - p.v; }).slice(0, 2);
    }
    var otim = B.filter(function (b) { var u = b.ult || {}, p = b.pj || {}; return leituraDe(u.f ? (u.f - u.c) / u.f : null, p.f ? (p.f - p.c) / p.f : null) === "OTIMISTA"; }).length;
    return { v: 3, nivel: nivel, rotulo: rotulo || "", nOS: B.length, oss: B.map(function (b) { return b.os; }), margBase: m,
      periodo: MES[ms0] + "–" + MES[ms1], horiz: maisComum(B.map(function (b) { return b.horiz; })) || "",
      acum: { fph: div(A.f, A.h), cph: div(A.c, A.h), ideal: ideal(div(A.f, A.h)), exec: div(X.c, X.h) },
      ult: { fph: fphU, cph: div(U.c, U.h) },
      proj: { fph: fphP, cph: div(P.c, P.h), ideal: ideal(fphP), dFph: fphU && fphP ? fphP / fphU - 1 : null, semReaj: B.some(function (b) { return b.semReaj; }) },
      ano: { fph: div(fAno, hAno), cph: div(cAno, hAno), ideal: ideal(div(fAno, hAno)), precisa: P.h ? (fAno * (1 - m) - (A.c || 0)) / P.h : null },
      leitura: leituraDe(margU, margP), causas: causas, quem: quem, otim: otim, alertas: nivel === "os" ? (B[0].alertas || []).slice(0, 2) : [] };
  }

  function textos(R) {
    if (!R || !R.acum) return null;
    var mb = fmt(R.margBase * 100, 1) + "%", T = {};
    var d = function (a, b) { return a == null || b == null ? "" : (a > b ? rsh(a - b) + "/h acima do ideal" : rsh(b - a) + "/h abaixo do ideal"); };
    var fph = R.proj.dFph != null && Math.abs(R.proj.dFph) >= 0.05 ? "; faturamento por hora " + (R.proj.dFph > 0 ? "+" : "") + fmt(R.proj.dFph * 100, 1) + "% sobre os últimos 3 meses" + (R.proj.semReaj && R.proj.dFph > 0 ? " sem reajuste cadastrado" : "") : "";
    var ptsC = (R.causas || []).map(function (x) { return x.conta + " " + rs(x.valor) + (R.nivel === "os" ? (x.tipo === "sem orçamento" ? " sem orçamento" : "") + (x.rec ? " (" + x.rec + ")" : "") : (x.oss && x.oss.length && (R.nivel === "ger" || R.nivel === "sel") ? " (" + x.oss.join(", ") + ")" : "")); });
    if (R.nivel === "os") {
      T.l = [
        "Custo por HHT ideal para a margem do executivo (" + mb + "): " + rsh(R.acum.ideal) + " sobre o faturamento real de " + rsh(R.acum.fph) + "/h.",
        "Acumulado " + R.periodo + ": " + rsh(R.acum.cph) + " (executivo " + rsh(R.acum.exec) + "), " + d(R.acum.cph, R.acum.ideal) + ".",
        R.horiz ? "Projeção " + R.horiz + ": " + rsh(R.proj.cph) + " contra o ideal de " + rsh(R.proj.ideal) + " e " + rsh(R.ult.cph) + " dos últimos 3 meses" + fph + " (" + R.leitura + ")." : "",
        "Fechamento do ano: " + rsh(R.ano.cph) + " contra o ideal de " + rsh(R.ano.ideal) + (R.horiz && R.ano.precisa != null ? "; para fechar em " + mb + ", " + R.horiz + " precisaria de " + rsh(R.ano.precisa) + "/h" : "") + ".",
        ptsC.concat(R.alertas || []).length ? "Pontos: " + ptsC.concat(R.alertas || []).join("; ") + "." : ""
      ];
    } else {
      T.l = [
        "Acumulado " + R.periodo + ": " + rsh(R.acum.cph) + " contra o ideal de " + rsh(R.acum.ideal) + " para a margem do executivo (" + mb + "); executivo " + rsh(R.acum.exec) + ".",
        R.horiz ? "Projeção " + R.horiz + ": " + rsh(R.proj.cph) + " contra o ideal de " + rsh(R.proj.ideal) + " (" + R.leitura + "); " + R.otim + " de " + R.nOS + " OSs com projeção otimista." : "",
        "Fechamento do ano: " + rsh(R.ano.cph) + " contra o ideal de " + rsh(R.ano.ideal) + (R.horiz && R.ano.precisa != null ? "; " + R.horiz + " precisaria de " + rsh(R.ano.precisa) + "/h" : "") + ".",
        R.quem && R.quem.length ? (ROT_QUEM[R.nivel] || "Quem mais tira do ideal") + ": " + R.quem.map(function (q) { return q.nome + " " + rs(q.v); }).join("; ") + "." : "",
        ptsC.length ? "Pontos: " + ptsC.join("; ") + "." : ""
      ];
    }
    T.l = T.l.filter(Boolean);
    return T;
  }
  function linhas(R) { var T = textos(R); return T ? T.l : []; }
  function html(R, cobrar, titulo) {
    var T = textos(R); if (!T) return "";
    // leitura da projecao em texto simples (negrito), sem etiqueta colorida (26/11/2026)
    var li = T.l.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("").replace("(" + esc(R.leitura) + ")", "<b>" + esc(R.leitura) + "</b>");
    return '<section class="rl-cap rl-resumo"><h2><span>★</span>' + esc(titulo || "Resumo para a RPCO · custo por HHT") + "</h2>" +
      '<ul style="margin:0;padding-left:20px;display:flex;flex-direction:column;gap:6px;font-size:18px;line-height:1.55">' + li +
      (cobrar ? "<li><b>Cobrar:</b> " + esc(cobrar) + "</li>" : "") + "</ul></section>";
  }
  window.NPE_RESUMO = { deBases: deBases, textos: textos, linhas: linhas, html: html, rsh: rsh, rs: rs, fmt: fmt, esc: esc };
})();
