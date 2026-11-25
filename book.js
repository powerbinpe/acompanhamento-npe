/* Aba 6 -- BOOK do contrato (OS, Gerencia, Superintendencia).
   Le e grava na SNAPSHOT_FECHAMENTO: ano 9995 = book da OS (1 linha por OS, titulo "BOOK_OS <OS>"),
   9994 = book da gerencia ("BOOK_GER <gerente>"), 9993 = book da superintendencia ("BOOK_SUP <nome>").
   Os numeros dos indicadores vem das caixas do app (ATA/monthHistory); RH, Receita Ideal e historico
   vem do fluxo NPE-Ler-Dados-Book (so Master, com token de sessao). Os textos sao da IA. */
(function () {
  "use strict";
  var A = window.NPE_APP || {};
  var ANO_OS = 9995, ANO_GER = 9994, ANO_SUP = 9993, ANO_DIR = 9992;
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
  var COR = { navy: "#14204A", navy2: "#22367A", teal: "#12A594", red: "#E5484D", orange: "#E08A0B", muted: "#24324D", line: "#E3E8F2",
    soft: "#EEF2FA", okfg: "#0B7A6C", badfg: "#B42318", warnfg: "#9A5B00", okbg: "#E3F6F2", ink: "#0F172A", pr: "#9AA8C7", hht: "#B8C4DE" };
  var CORES_MOTIVO = ["#22367A", "#E5484D", "#E08A0B", "#12A594", "#7C8DB5"];

  // 13/11/2026 (decisao do usuario): o Book usa sempre o resultado SEM os encargos financeiros (tipo de saldo
  // ENC. FINANCEIROS, fixo nas consultas do NPE-Ler-Dados-Book), igual ao segmentador da RPC. Nota no rodape.
  var NOTA_ENC = "<b>Resultados sem os encargos financeiros</b> (despesas financeiras e provisão de IRPJ/CSLL, tipo de saldo ENC. FINANCEIROS), como na RPC. ";
  var CSS = "#tabBook{background:#F3F5FA;padding:16px;color:#0F172A}\n.bk-wrap{max-width:1240px;margin:0 auto;display:flex;flex-direction:column;gap:14px;font-family:'Segoe UI',system-ui,Arial,sans-serif;font-size:19px;line-height:1.5}\n.bk-wrap svg{width:100%;height:auto;display:block}\n.bk-nav{display:flex;align-items:center;gap:10px;flex-wrap:wrap}\n.bk-marca{font-weight:800;letter-spacing:3px;color:#14204A;font-size:18.5px}\n.bk-tabs{display:flex;background:#fff;border:1px solid #E3E8F2;border-radius:10px;padding:3px}\n.bk-tabs button{border:0;background:none;padding:6px 14px;border-radius:8px;font:inherit;font-weight:600;color:#24324D;cursor:pointer}\n.bk-tabs button.on{background:#14204A;color:#fff}.bk-tabs button:disabled{opacity:.5;cursor:default}\n.bk-sel{display:flex;gap:6px;align-items:center;color:#24324D;font-size:17px}\n.bk-sel select{border:1px solid #E3E8F2;border-radius:8px;padding:6px 10px;font:inherit;font-weight:600;color:#0F172A;background:#fff;max-width:420px}\n.bk-acoes{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}\n.bk-bt{border:0;border-radius:8px;padding:7px 14px;font:inherit;font-weight:700;cursor:pointer;background:linear-gradient(135deg,#22367A,#14204A);color:#fff}\n.bk-bt.sec{background:#E2E8F0;color:#334155}.bk-bt:disabled{opacity:.55;cursor:default}\n.bk-bt:focus-visible,.bk-tabs button:focus-visible,.bk-sel select:focus-visible{outline:2px solid #1F6FD1;outline-offset:2px}\n.bk-prog{background:#FFF8E6;border:1px solid #E0B24A;color:#7A5300;border-radius:10px;padding:8px 14px;font-weight:600}\n.bk-vazio{background:#fff;border:1px dashed #C5CEDC;border-radius:12px;padding:18px;color:#24324D}\n.bk-capa{background:linear-gradient(120deg,#14204A 0%,#22367A 100%);color:#fff;border-radius:16px;padding:22px 26px;display:grid;grid-template-columns:1.4fr 1fr;gap:22px}\n.bk-eyebrow{font-size:15.5px;letter-spacing:2.5px;text-transform:uppercase;opacity:.75}\n.bk-capa h1{font-size:32.5px;line-height:1.15;margin:4px 0 10px;color:#fff;text-wrap:balance}\n.bk-chips{display:flex;flex-wrap:wrap;gap:6px}.bk-chip{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.18);border-radius:999px;padding:2px 10px;font-size:16.5px}\n.bk-periodo{margin-top:12px;font-size:17px;background:rgba(255,255,255,.1);border-radius:8px;padding:6px 10px}\n.bk-ficha{display:grid;grid-template-columns:auto 1fr;gap:3px 14px;font-size:18px;align-content:start;margin:0}.bk-ficha dt{opacity:.7}.bk-ficha dd{font-weight:600;margin:0}\n.bk-card{background:#fff;border:1px solid #E3E8F2;border-radius:14px}.bk-sec{padding:18px 20px}\n.bk-sec h2{font-size:22.5px;color:#14204A;display:flex;align-items:baseline;gap:10px;margin:0 0 10px}.bk-sec h2 .sub{font-size:17px;color:#24324D;font-weight:500}\n.bk-lead{font-size:20.5px;line-height:1.65;margin:0}.bk-lead b,.bk-texto b{color:#14204A}\n.bk-kpis{display:grid;grid-template-columns:repeat(6,1fr);gap:10px;margin-top:14px}\n.bk-kpi{border:1px solid #E3E8F2;border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:2px;min-width:0}\n.bk-kpi .l{font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#24324D;font-weight:700}.bk-kpi .v{font-size:28.5px;font-weight:700;font-variant-numeric:tabular-nums}.bk-kpi .s{font-size:16.5px;color:#24324D}\n.bk-kpi.bad .v{color:#B42318}.bk-kpi.ok .v{color:#0B7A6C}.bk-kpi.warn .v{color:#9A5B00}.bk-spark{max-width:140px;margin-top:4px}\n.bk-prior{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:14px}.bk-prior>div{border-radius:12px;padding:12px 14px;background:#EEF2FA}\n.bk-prior h3{font-size:18.5px;color:#14204A;margin:0 0 4px}.bk-prior p{font-size:18px;color:#334155;margin:0}.bk-prior .rank{font-size:15.5px;font-weight:700;color:#E5484D;letter-spacing:1px}\n.bk-g2{display:grid;grid-template-columns:1fr 1fr;gap:14px}.bk-g3{display:grid;grid-template-columns:1.5fr 1fr;gap:14px}\n.bk-chart{border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px}.bk-chart h4{font-size:18px;color:#14204A;margin:0 0 2px}.bk-chart .cap{font-size:16.5px;color:#24324D;margin-bottom:6px}\n.bk-leg{display:flex;flex-wrap:wrap;gap:10px;font-size:15.5px;color:#24324D;margin-top:4px}.bk-leg i{display:inline-block;width:10px;height:10px;border-radius:2px;margin-right:4px;vertical-align:-1px}\n.bk-texto{font-size:19px;line-height:1.65;color:#1E293B;margin:12px 0 0}\n.bk-acum{display:flex;flex-direction:column;gap:10px}.bk-acum div{background:#EEF2FA;border-radius:12px;padding:12px 14px}\n.bk-acum .l{font-size:15px;letter-spacing:1px;text-transform:uppercase;color:#24324D;font-weight:700;display:block}.bk-acum b{display:block;font-size:31px;color:#B42318;font-variant-numeric:tabular-nums}.bk-acum span{font-size:17px;color:#334155}\n.bk-ferias{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-top:12px}.bk-ferias div{background:#EEF2FA;border-radius:10px;padding:10px 12px}\n.bk-ferias b{font-size:25.5px;color:#14204A;display:block}.bk-ferias span{font-size:16.5px;color:#24324D}\n.bk-cat h3{font-size:18.5px;letter-spacing:1.5px;text-transform:uppercase;color:#24324D;margin:14px 0 8px}\n.bk-inds{display:grid;grid-template-columns:repeat(2,1fr);gap:10px}\n.bk-ind{border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;border-left:4px solid #E3E8F2}\n.bk-ind.wide{grid-column:1/-1}.bk-ind.ok{border-left-color:#12A594}.bk-ind.bad{border-left-color:#E5484D}.bk-ind.na{border-left-color:#C5CEDC}\n.bk-ind .top{display:flex;align-items:center;gap:8px}.bk-ind .nome{font-weight:700;color:#14204A;font-size:19px}.bk-ind .id{font-size:15.5px;color:#24324D;font-weight:600}\n.bk-pill{margin-left:auto;font-size:15px;font-weight:700;border-radius:999px;padding:2px 9px;letter-spacing:.4px;white-space:nowrap}\n.bk-pill.ok{background:#E3F6F2;color:#0B7A6C}.bk-pill.bad{background:#FDE8E8;color:#B42318}.bk-pill.na{background:#EEF1F6;color:#24324D}\n.bk-ind .val{font-size:18px;color:#334155;font-variant-numeric:tabular-nums}\n.bk-strip{display:flex;gap:3px;align-items:center}.bk-strip span{width:20px;height:8px;border-radius:2px;background:#E6EAF1}\n.bk-strip span.ok{background:#12A594}.bk-strip span.bad{background:#E5484D}.bk-strip span.na{background:#CBD3E0}.bk-strip em{font-style:normal;font-size:15px;color:#24324D;margin-left:6px}\n.bk-ind .bl{font-size:18px;line-height:1.55;color:#1E293B}.bk-ind .bl strong{color:#14204A;font-size:15.5px;letter-spacing:.8px;text-transform:uppercase;display:block;margin-bottom:1px}\n.bk-ind .bl.cam strong{color:#12A594}.bk-ind.bad .bl.cam strong{color:#E5484D}\n.bk-ind .duo{display:grid;grid-template-columns:1.3fr 1fr;gap:14px;align-items:start}.bk-ind .duo .txts{display:flex;flex-direction:column;gap:8px}\n.bk-orc{border:2px solid #14204A;border-radius:14px;background:linear-gradient(180deg,#F5F7FD,#FFFFFF)}\n.bk-orc .tag{display:inline-block;background:#14204A;color:#fff;font-size:15px;letter-spacing:1.5px;text-transform:uppercase;border-radius:999px;padding:2px 10px;margin-bottom:6px}\n.bk-orcgrid{display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-top:10px}.bk-orci{border:1px solid #E3E8F2;border-radius:10px;padding:10px 12px;background:#fff}\n.bk-orci h4{font-size:18px;color:#14204A;display:flex;justify-content:space-between;gap:8px;margin:0}.bk-orci h4 span{font-variant-numeric:tabular-nums;color:#B42318;text-align:right}.bk-orci p{font-size:18px;color:#334155;margin:3px 0 0}\n.bk-fontes{font-size:15.5px;color:#24324D;padding:4px}\n.bk-modal{position:fixed;inset:0;background:rgba(11,26,58,.6);z-index:99999999;display:flex;align-items:flex-start;justify-content:center;padding-top:80px}\n.bk-modal-box{background:#fff;border-radius:14px;padding:20px 22px;width:420px;max-width:92vw;font-family:'Segoe UI',Arial,sans-serif}\n.bk-modal-box h3{margin:0 0 6px;color:#14204A}.bk-modal-box p{margin:0 0 12px;color:#334155;font-size:18.5px}\n.bk-modal-box input{width:100%;box-sizing:border-box;border:1px solid #CBD5E1;border-radius:8px;padding:8px 10px;font:inherit}\n.bk-modal-bt{display:flex;justify-content:flex-end;gap:8px;margin-top:12px}\n@media (max-width:900px){.bk-capa,.bk-g2,.bk-g3,.bk-inds,.bk-orcgrid,.bk-prior,.bk-ind .duo{grid-template-columns:1fr}.bk-kpis{grid-template-columns:repeat(2,1fr)}.bk-ferias{grid-template-columns:1fr}}";
  CSS += "\n.bk-dd{position:relative;display:flex;align-items:center;gap:6px}\n.bk-dd-rot{color:#24324D;font-size:17px}\n.bk-dd-btn{min-width:340px;max-width:460px;text-align:left;border:1px solid #CBD5E1;border-radius:8px;padding:7px 30px 7px 10px;background:#fff;font:inherit;font-weight:600;color:#0F172A;cursor:pointer;position:relative;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}\n.bk-dd-btn:after{content:'';position:absolute;right:11px;top:50%;margin-top:-2px;border:5px solid transparent;border-top-color:#24324D}\n.bk-dd-btn:focus-visible{outline:2px solid #1F6FD1;outline-offset:2px}\n.bk-dd-pan{position:absolute;top:100%;left:22px;margin-top:4px;z-index:2000;background:#fff;border:1px solid #CBD5E1;border-radius:10px;box-shadow:0 10px 28px rgba(20,32,74,.18);width:440px;max-width:90vw;max-height:380px;flex-direction:column;overflow:hidden}\n.bk-dd-pan input{border:0;border-bottom:1px solid #E3E8F2;padding:9px 12px;font:inherit;outline:none}\n.bk-dd-lista{overflow:auto;padding:4px}\n.bk-dd-it{display:block;width:100%;text-align:left;border:0;background:none;padding:6px 10px;border-radius:6px;font:inherit;color:#0F172A;cursor:pointer}\n.bk-dd-it:hover,.bk-dd-it:focus-visible{background:#EEF2FA;outline:none}.bk-dd-it.on{background:#14204A;color:#fff}\n.bk-dd-vazio{padding:10px;color:#24324D;margin:0}\n.bk-dica{font-size:17px;color:#24324D;margin-top:-6px}";
  CSS += "\n.rl{background:#fff;border:1px solid #E3E8F2;border-radius:14px;padding:34px 44px;max-width:1080px;margin:0 auto;color:#1E293B;width:100%;box-sizing:border-box}\n.rl-capa{border-bottom:3px solid #14204A;padding-bottom:18px;margin-bottom:18px}\n.rl-capa-top{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;font-size:15.5px;letter-spacing:2px;text-transform:uppercase;color:#24324D}\n.rl-tag{color:#14204A;font-weight:700}\n.rl-capa h1{font-size:37.5px;color:#14204A;margin:8px 0 10px;line-height:1.15;text-wrap:balance}\n.rl-ficha{display:flex;flex-wrap:wrap;gap:6px 18px;font-size:18px;color:#334155}\n.rl-manchete{font-size:27px!important;line-height:1.45!important;color:#0F172A;margin:16px 0 0!important;font-weight:600;border-left:4px solid #E5484D;padding-left:14px}\n.rl-nums{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:4px 0 8px}\n.rl-nums-g{background:#F5F7FD;border-radius:12px;padding:12px 14px;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}\n.rl-nums-g h3{grid-column:1/-1;margin:0;font-size:15.5px;letter-spacing:1.5px;text-transform:uppercase;color:#24324D}\n.rl-num .l{display:block;font-size:15.5px;color:#24324D;font-weight:700}.rl-num .v{display:block;font-size:24px;font-weight:700;font-variant-numeric:tabular-nums;white-space:nowrap}.rl-num .s{font-size:16.5px;color:#24324D}\n.rl-num.ok .v{color:#0B7A6C}.rl-num.bad .v{color:#B42318}\n.rl-cap{margin-top:26px}\n.rl-cap h2{font-size:27px;color:#14204A;display:flex;align-items:center;gap:10px;margin:0 0 12px;border-bottom:1px solid #E3E8F2;padding-bottom:8px}\n.rl-cap h2 span{display:inline-flex;width:28px;height:28px;border-radius:50%;background:#14204A;color:#fff;font-size:18.5px;align-items:center;justify-content:center;flex:none}\n.rl p{font-size:20.5px;line-height:1.75;margin:0 0 12px}\n.rl p b{color:#14204A}\n.rl-fig{margin:14px 0 18px;border:1px solid #E3E8F2;border-radius:12px;padding:12px 14px}\n.rl-fig figcaption{font-size:18px;color:#14204A;margin-bottom:6px}.rl-fig figcaption span{display:block;color:#24324D;font-size:16.5px}\n.rl-duas{display:grid;grid-template-columns:1fr 1fr;gap:14px}.rl-duas .rl-fig{margin:6px 0}\n.rl-flex{display:flex;gap:16px;align-items:flex-start}.rl-lado{flex:0 0 380px}.rl-txt{flex:1;min-width:0}\n.rl-tab{overflow-x:auto}.rl-tab table{border-collapse:collapse;width:100%;font-size:18px;font-variant-numeric:tabular-nums}\n.rl-tab th{text-align:right;font-size:15.5px;color:#24324D;text-transform:uppercase;letter-spacing:.4px;padding:6px 8px;border-bottom:2px solid #E3E8F2;vertical-align:bottom}\n.rl-tab th:first-child,.rl-tab td:first-child{text-align:left}\n.rl-tab td{text-align:right;padding:6px 8px;border-bottom:1px solid #EEF1F6}\n.rl-tab td.neg{color:#B42318;font-weight:700}.rl-tab td.pos{color:#0B7A6C;font-weight:700}\n.rl .rl-nota{font-size:17px;color:#24324D;line-height:1.5;margin-top:8px}\n.rl-diag{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-top:6px}\n.rl-diag-c{border-radius:12px;padding:12px 14px}.rl-diag-c.ges{background:#FDF2F2;border:1px solid #F5C2C2}.rl-diag-c.orc{background:#F0F4FF;border:1px solid #C7D3F3}\n.rl-diag-c h4{margin:0 0 8px;font-size:17px;letter-spacing:1px;text-transform:uppercase;color:#14204A}\n.rl-diag-c ul{margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:10px}\n.rl-diag-c li{font-size:18.5px;line-height:1.55;color:#334155}\n.rl-li-t{display:flex;justify-content:space-between;gap:8px}.rl-li-t b{color:#14204A}.rl-li-t span{font-weight:700;color:#B42318;white-space:nowrap}\n.rl-plano{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px}\n.rl-plano li{font-size:20px;line-height:1.6}.rl-plano li b{color:#14204A;display:block}.rl-plano li span{display:block;color:#334155}.rl-plano li em{font-style:normal;font-size:17px;color:#24324D}\n.rl-orc{border:2px solid #14204A;border-radius:14px;padding:16px 18px;background:linear-gradient(180deg,#F5F7FD,#fff)}\n.rl-alerta{background:#FFF6E5;border:1px solid #F0C36D;border-left:5px solid #E08A0B;border-radius:10px;padding:10px 14px;margin:0 0 14px;font-size:19px;line-height:1.55;color:#5C3D00}.rl-alerta b{display:block;color:#7A4B00;margin-bottom:2px}\n.rl .rl-veredito{font-size:21.5px;font-weight:600;color:#14204A;border-left:4px solid #14204A;padding-left:12px}\n.rl-anexo .bk-strip em{display:none}.rl-anexo td{vertical-align:middle}.rl-cx{text-align:left!important;font-size:16.5px;color:#334155;max-width:420px}\n@media (max-width:900px){.rl{padding:18px}.rl-nums,.rl-duas,.rl-diag{grid-template-columns:1fr}.rl-nums-g{grid-template-columns:1fr 1fr}.rl-flex{flex-direction:column}.rl-lado{flex:none;width:100%}}";
  CSS += "\n.rl{background:transparent;border:0;padding:0;display:flex;flex-direction:column;gap:16px}\n.rl-capa{background:linear-gradient(120deg,#14204A 0%,#22367A 70%,#2B4A9A 100%);color:#fff;border:0;border-radius:16px;padding:24px 30px;margin:0;box-shadow:0 6px 18px rgba(20,32,74,.18)}\n.rl-capa-top{color:rgba(255,255,255,.75)}.rl-capa .rl-tag{color:#fff;background:rgba(255,255,255,.14);border-radius:999px;padding:3px 12px}\n.rl-capa h1{color:#fff}.rl-capa .rl-ficha{color:rgba(255,255,255,.88)}.rl-capa .rl-ficha span{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.16);border-radius:8px;padding:4px 10px}.rl-capa .rl-ficha b{color:#fff}\n.rl-capa .rl-alerta{background:rgba(255,246,229,.97)}\n.rl-nums{margin:0}\n.rl-nums-g{background:#fff;border:1px solid #DCE3F0;box-shadow:0 2px 8px rgba(20,32,74,.06)}\n.rl-nums-g h3{color:#14204A}\n.rl-num{border-radius:10px;padding:8px 10px;background:#F3F6FC;border-top:3px solid #9AA8C7}.rl-num.ok{background:#E9F7F3;border-top-color:#12A594}.rl-num.bad{background:#FDEEEE;border-top-color:#E5484D}\n.rl-cap{margin:0;background:#fff;border:1px solid #DCE3F0;border-radius:14px;padding:0 24px 18px;box-shadow:0 2px 8px rgba(20,32,74,.06);overflow:hidden}\n.rl-cap h2{background:linear-gradient(90deg,#EEF2FA,#F7F9FD);margin:0 -24px 16px;padding:12px 24px;border-bottom:2px solid #14204A;font-size:25.5px}\n.rl-cap h2 span{background:#E5484D}\n.rl-fig{background:#FAFBFE;border-color:#DCE3F0}\n.rl-fig figcaption b{color:#E5484D}\n.rl-tab th{background:#14204A;color:#fff;border-bottom:0;padding:8px}\n.rl-tab tbody tr:nth-child(even) td{background:#F5F7FC}\n.rl-tab tbody tr:hover td{background:#EAF0FB}\n.rl-plano{list-style:none;padding:0;counter-reset:pl}\n.rl-plano li{counter-increment:pl;background:#F3F6FC;border:1px solid #DCE3F0;border-left:4px solid #22367A;border-radius:10px;padding:10px 14px 10px 46px;position:relative}\n.rl-plano li::before{content:counter(pl);position:absolute;left:12px;top:10px;width:24px;height:24px;border-radius:50%;background:#22367A;color:#fff;font-size:17px;font-weight:700;display:flex;align-items:center;justify-content:center}\n.rl-orc{background:linear-gradient(180deg,#EEF2FA,#fff);border:2px solid #14204A}\n.rl-orc h2{background:#14204A;color:#fff;border-bottom:0}.rl-orc h2 span{background:#fff;color:#14204A}\n.rl .bk-orci{background:#F7F9FD;border-color:#DCE3F0;border-top:3px solid #22367A}\n.rl-diag-c.ges{border-top:3px solid #E5484D}.rl-diag-c.orc{border-top:3px solid #22367A}\n.rl .bk-fontes{background:#fff;border:1px solid #DCE3F0;border-radius:10px;padding:10px 14px}\n@media (max-width:700px){.rl-cap{padding:0 14px 14px}.rl-cap h2{margin:0 -14px 12px;padding:10px 14px}.rl-capa{padding:18px}}";
  CSS += "\n.bk-wrap{max-width:none}\n.rl{max-width:none;width:100%}\n.rl-fig svg,.bk-chart svg{max-height:420px}\n.rl-duas .rl-fig svg{max-height:360px}\n.rl-lado{flex-basis:440px}\n@media (min-width:1500px){.rl-cap{padding:0 32px 22px}.rl-cap h2{margin:0 -32px 16px;padding:12px 32px}}";
  CSS += "\n.rl-duas-txt{align-items:start}.rl-duas-txt .rl-txt p:first-child{margin-top:6px}\n.rl-tab-txt th,.rl-tab-txt td{text-align:left;vertical-align:top}\n.rl-tab-txt2 th:nth-child(2),.rl-tab-txt2 td:nth-child(2){text-align:left}\n.rl-qfer{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:6px}.rl-qfer .rl-num .v{font-size:31px}\n.rl-tab td{white-space:nowrap}.rl-tab td:first-child,.rl-tab td.rl-cx,.rl-tab-txt td,.rl-tab-txt2 td:nth-child(2){white-space:normal}.rl-tab-txt td .bk-pill{white-space:nowrap}\n.rl-cap .rl-flex .rl-lado{flex-basis:46%}\n.rl-nota-caixa{background:#F3F6FC;border:1px dashed #C5CEDC;border-radius:10px;padding:10px 14px}\n@media (min-width:1100px){.rl-plano{display:grid;grid-template-columns:1fr 1fr;gap:10px}}\n@media (max-width:900px){.rl-qfer{grid-template-columns:1fr}}";
  CSS += "\n.rl-sub{font-size:22.5px;font-weight:700;color:#14204A;margin:26px 0 10px;padding-top:16px;border-top:1px solid #E3E8F2}.rl-cap>.rl-sub:first-of-type{border-top:0;padding-top:0;margin-top:8px}.rl-pos .bk-orci h4{color:#0B6E4F}";
  CSS += ".rl-nota-enc{font-size:16.5px;color:#24324D;margin:6px 2px 0;line-height:1.5}";
  CSS += ".rl-tab small.rl-v{display:block;font-size:15px;color:#24324D;font-weight:600;line-height:1.2}.rl-coer td{vertical-align:top}.rl-coer td .bk-pill{margin-left:0}.rl-coer td:last-child{white-space:normal;min-width:180px;text-align:left}.rl-coer th,.rl-coer td{padding-left:6px;padding-right:6px}.rl-coer small.rl-vn{display:block;font-size:15.5px;color:#334155;line-height:1.35;margin-top:3px}";
  CSS += "/* 18/11/2026: leitura em tela compartilhada (Teams) */\n#tabBook{color:#0F172A}.bk-wrap{line-height:1.6}\n.bk-eyebrow,.bk-ficha dt,.rl-capa-top{opacity:1!important;color:rgba(255,255,255,.95)!important}.rl-capa-top .rl-tag{color:#fff}\n.bk-kpis{grid-template-columns:repeat(auto-fit,minmax(240px,1fr))}.bk-kpi{padding:14px 16px}.bk-kpi .v,.rl-num .v,.bk-acum b,.bk-ferias b{white-space:nowrap}\n.rl-capa .rl-nota,.rl-capa p{color:#fff!important}.rl-capa .rl-nota b{color:#FFE7A3}.bk-capa,.bk-capa *{color:#fff}.rl-num{padding:12px 14px}\n.rl-tab table{font-size:16.5px}.rl-tab th{padding:12px 10px}.rl-tab td{padding:11px 10px}.rl p{line-height:1.7}.rl-plano li{line-height:1.6}\n.bk-ind{padding:16px 18px}.bk-strip span{width:26px;height:11px}.bk-pill{padding:3px 12px}\n.rl-cap{padding:0 30px 24px}.rl-cap h2{margin:0 -30px 18px;padding:14px 30px}.rl-cap h2 span{width:36px;height:36px}\n.rl-fig svg,.bk-chart svg{max-height:560px}.rl-duas .rl-fig svg{max-height:560px}";
  (function () { var s = document.createElement("style"); s.id = "bkCss"; s.textContent = CSS; document.head.appendChild(s); })();

  var st = { nivel: "os", vista: "pauta", sel: { os: "", ger: "", sup: "" }, linhas: { os: null, ger: null, sup: null, dir: null }, carregando: false, msg: "" };

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
    var ano = nivel === "os" ? ANO_OS : nivel === "ger" ? ANO_GER : nivel === "dir" ? ANO_DIR : ANO_SUP;
    var pref = nivel === "os" ? "BOOK_OS " : nivel === "ger" ? "BOOK_GER " : nivel === "dir" ? "BOOK_DIR " : "BOOK_SUP ";
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
    var ano = nivel === "os" ? ANO_OS : nivel === "ger" ? ANO_GER : nivel === "dir" ? ANO_DIR : ANO_SUP;
    var pref = nivel === "os" ? "BOOK_OS " : nivel === "ger" ? "BOOK_GER " : nivel === "dir" ? "BOOK_DIR " : "BOOK_SUP ";
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
  // 17/11/2026 (usuario): o agente gera para o MES DO FILTRO (fechado ou nao), nao o ultimo mes fechado.
  async function pedirAoAgente(os, etapas, mes) {
    var url = A.urlIniciarAgente ? A.urlIniciarAgente() : "";
    if (url.indexOf("https://") !== 0) throw new Error("O fluxo NPE-Iniciar-Agente nao esta configurado.");
    var tk = await obterToken();
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: tk.login, token: tk.token, etapas: etapas || "aba6", ano: String(anoAtivo()), mes: String(mes || mesAtivo() || ""), gravar: true, refazer: true, permitir_mes_fechado: false, os: os || "" }) });
    var j = null; try { j = await r.json(); } catch (e) {}
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("Sem permiss\u00e3o para acionar o agente."); }
    if (!(r.ok && j && j.ok === true)) throw new Error("O GitHub recusou o pedido (c\u00f3digo " + ((j && j.status) || r.status) + ").");
    return true;
  }
  // Quem respondeu pela OS em cada periodo do ano: cada vigencia vale ate o mes anterior a proxima.
  function mesAnt(am) { var a = Math.floor(am / 100), m = am % 100; return m === 1 ? (a - 1) * 100 + 12 : am - 1; }
  function rotMes(am) { return MES[am % 100] + "/" + String(Math.floor(am / 100)).slice(2); }
  function linhaTempo(resp, tipo, os, ano, mes) {
    var ini = ano * 100 + 1, fim = ano * 100 + mes;
    var xs = (resp || []).filter(function (r) { return r.tipo === tipo && r.os === os && r.vig; }).sort(function (a, b) { return a.vig - b.vig; });
    var out = [];
    xs.forEach(function (r, i) {
      var de = r.vig, ate = i + 1 < xs.length ? mesAnt(xs[i + 1].vig) : fim;
      if (ate < ini || de > fim) return;
      de = Math.max(de, ini); ate = Math.min(ate, fim);
      if (out.length && out[out.length - 1].nome === r.nome) { out[out.length - 1].ate = ate; return; }
      out.push({ nome: r.nome, de: de, ate: ate });
    });
    return out;
  }
  function txtLinha(lt, atual) {
    if (!lt || !lt.length) return atual || "–";
    if (lt.length === 1) return lt[0].nome;
    return lt.map(function (x, i) { return x.nome + (i === lt.length - 1 ? " (desde " + rotMes(x.de) + ")" : " (" + rotMes(x.de) + " a " + rotMes(x.ate) + ")"); }).join(" → ");
  }
  function historicoOS(dados, os, ano, mes) {
    return { gestor: linhaTempo(dados.resp, "RESPONSAVEL", os, ano, mes), ger: linhaTempo(dados.resp, "GERENTE_OS", os, ano, mes), sup: linhaTempo(dados.resp, "SUPERINTENDENTE_OS", os, ano, mes) };
  }
  function trocasTxt(hist) {
    var t = [];
    [["gestor", "Gestor do contrato"], ["ger", "Gerente"], ["sup", "Superintendente"]].forEach(function (q) { var lt = hist && hist[q[0]]; if (lt && lt.length > 1) t.push(q[1] + ": " + txtLinha(lt)); });
    return t;
  }
  // bloco de OSs vai ao fluxo como "A|B" (o app mostra "A + B")
  function codigosBloco(rot) { return String(rot || "").split(/[|+]/).map(function (x) { return x.trim().toUpperCase(); }).filter(Boolean).join("|"); }
  // 18/11/2026: todos os GESTOR DO CONTRATO da CTT (qualquer OS, inclusive encerrada) para o cadastro de
  // responsaveis. O mesmo fluxo do book devolve as linhas "G" quando chamado sem OS (so Master/Proprietario).
  async function lerGestoresCTT() {
    var tk = await obterToken(), url = urlFluxo();
    if (url.indexOf("http") !== 0) throw new Error("fluxo NPE-Ler-Dados-Book sem URL");
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login: tk.login, token: tk.token, os: "", ano: new Date().getFullYear(), mes: 1 }) });
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("sessão expirada"); }
    if (!r.ok) throw new Error("o fluxo respondeu " + r.status);
    var j = await r.json(), vistos = {}, out = [];
    norm(j && j.fin).forEach(function (x) { if (x.tipo !== "G") return; var n = String(x.c || "").trim(); if (n && !vistos[n]) { vistos[n] = true; out.push(n); } });
    if (!out.length) throw new Error("o fluxo não devolveu a lista de gestores");
    return out.sort();
  }
  // 18/11/2026: % acumulada de meses assertivos (diferenca de margem real x FCST anterior dentro de +-5 p.p.).
  // O modelo as vezes devolve o mes apurado sem o acumulado (M01014 set/26: 1 mes apurado e acumulado vazio);
  // nesse caso calcula pelos meses apurados, igual a Aba 1 (computeAssertividadeAccumPct).
  // 19/11/2026: tolerancia da assertividade vem da tabela de metas (TOL_ASSERTIV_MARGEM; padrao 5,40 p.p.)
  function tolAssert() { var t = window.NPE_APP && window.NPE_APP.tol ? window.NPE_APP.tol("TOL_ASSERTIV_MARGEM", 0.054) : 0.054; return Math.abs(t) * 100; }
  function tolAssertTxt() { return tolAssert().toFixed(2).replace(".", ","); }
  // 19/11/2026 (usuario): a META da assertividade e 5,0 p.p.; a tolerancia (tabela de metas) vai ate 5,40.
  // Entre a meta e a tolerancia o mes conta como assertivo, mas sempre identificado como "na tolerancia".
  var META_ASSERT_PP = 5;
  function faixaAssert(v) { var a = Math.abs(v); return a <= META_ASSERT_PP + 1e-9 ? "meta" : (a <= tolAssert() + 1e-9 ? "tol" : "fora"); }
  function preencherAssertAcum(dm, ac) {
    var tol = tolAssert(), n = 0, ok = 0;
    return dm.map(function (v, i) {
      if (v != null) { n++; if (Math.abs(v) <= tol) ok++; }
      return ac[i] != null ? ac[i] : (n ? ok / n * 100 : null);
    });
  }
  function assertAcumDe(k, S) {
    if (k && k.assertAcum != null) return k.assertAcum;
    var a = S && S.assert; if (!a) return null;
    var c = preencherAssertAcum(a.dmarg, a.dmarg.map(function () { return null; }));
    return c[c.length - 1];
  }
  async function lerDadosFluxo(rotulo, ano, mes, tk, urlOpt, extra) {
    rotulo = codigosBloco(rotulo);
    var url = String(urlOpt || urlFluxo() || "").trim();
    if (url.indexOf("http") !== 0) throw new Error("Cole a URL do fluxo NPE-Ler-Dados-Book (botão ⚙ Fluxo do Book).");
    var r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ login: tk.login, token: tk.token, os: rotulo, ano: ano, mes: mes }, extra || {})) });
    if (r.status === 401) { window._NPE_TOKEN_BOOK = null; throw new Error("O fluxo recusou o acesso (sessão expirada ou perfil sem permissão)."); }
    if (!r.ok) throw new Error("O fluxo NPE-Ler-Dados-Book respondeu " + r.status + ".");
    var j = await r.json();
    if (!j || j.ok !== true) throw new Error("O fluxo não devolveu os dados.");
    // fin = contabil numa tabela so: C = conta x mes (real, executivo, FCST anterior), E = eventos da folha (CT2), M = executivo/FCST do mes
    var custos = [], evt = [], mesx = [], proj = [], projx = [], fer = null, ctt = {}, resp = [], hex = [], ferRH = null, pr = { t1: null, t2: null, t3: null, k: [] };
    var numOuNulo = function (v) { return v == null || v === "" ? null : +v; };
    norm(j.fin).forEach(function (x) {
      if (x.tipo === "C") custos.push({ "Nível": x.a, "Sub Nível I": x.b, "C.Contabil - Descricao": x.c, MesNo: x.mes, r: x.r, e: x.e, f: x.f });
      else if (x.tipo === "E") evt.push({ "C.Contábil": x.a, "Histórico de Lançamento": x.c, MesNo: x.mes, v: x.r });
      else if (x.tipo === "M") mesx.push({ MesNo: x.mes, fe: x.r, re: x.e, ff: x.f, rf: x.g });
      else if (x.tipo === "P") proj.push({ m: x.mes, efet: x.r, hht: x.e, fat: x.f, res: x.g });
      else if (x.tipo === "Q") projx.push({ m: x.mes, fe: x.r, re: x.e });
      else if (x.tipo === "R") { var partes = String(x.c || "").split("|"); resp.push({ tipo: x.a, os: String(x.b || "").toUpperCase(), nome: partes[partes.length - 1], vig: parseInt(x.mes, 10) || 0 }); }
      else if (x.tipo === "F") fer = { f30: x.r, f45: x.e, saldo: x.f, tot: x.g };
      else if (x.tipo === "X") hex.push({ m: parseInt(x.mes, 10) || 0, acima: x.r == null ? null : +x.r, pessoas: x.e == null ? null : +x.e, horas: x.f == null ? null : +x.f });
      else if (x.tipo === "Y") ferRH = { f45: x.r == null ? null : +x.r };
      else if (x.tipo === "T1" || x.tipo === "T2" || x.tipo === "T3") pr[x.tipo.toLowerCase()] = { c: x.c, r: numOuNulo(x.r), e: numOuNulo(x.e), f: numOuNulo(x.f), g: numOuNulo(x.g) };
      else if (x.tipo === "KA") pr.kAno = true;
      else if (x.tipo === "K") { var cc0 = String(x.c || "").split("|"); pr.k.push({ nivel: String(x.a || ""), conta: String(x.b || ""), sub: cc0[0], desc: cc0.slice(1).join("|"), r: +x.r || 0, e: +x.e || 0 }); }
      else if (x.tipo === "H") { var cc = String(x.b || "").toUpperCase(); ctt[cc] = ctt[cc] || {}; if (ctt[cc][x.a] == null) ctt[cc][x.a] = x.c == null ? "" : String(x.c); }
    });
    return { rh: norm(j.rh), ri: norm(j.ri), hist: norm(j.hist), custos: custos, evt: evt, mesx: mesx, proj: proj, projx: projx, fer: fer, ctt: ctt, resp: resp, ri2: norm(j.ri2), dir: norm(j.dir), hex: hex, ferRH: ferRH, pautaRaw: pr };
  }
  function configurarFluxo() {
    var f = document.createElement("div");
    f.className = "bk-modal";
    f.innerHTML = '<div class="bk-modal-box"><h3>Fluxo do Book</h3><p>Cole a URL do gatilho do fluxo <b>NPE-Ler-Dados-Book</b>. Ela fica só neste navegador.</p>' +
      '<input type="password" id="bkUrlFluxo" placeholder="https://..." value=""><p style="font-size:12px;color:#24324D">' + (urlFluxo() ? "Já existe uma URL gravada; colar outra substitui." : "Nenhuma URL gravada ainda.") +
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
  // OS sempre com a OS DESCRICAO RELACIONADA (ou a descricao do bloco), nunca so o numero.
  function nomeOS(cod, desc) {
    cod = String(cod || ""); desc = String(desc || "").trim();
    if (!desc) return cod;
    return desc.indexOf(cod) === 0 || /^[A-Z]\d{5}/.test(desc) ? desc : cod + " - " + desc;
  }
  // Troca codigos soltos (M03100) pelo nome completo, sem duplicar quando o texto ja traz a descricao.
  function expandirOSs(txt, mapa) {
    return String(txt || "").replace(/\b([A-Z]\d{5})\b(?!\s*[-–+])/g, function (cod) {
      var n = mapa[cod]; if (!n) return cod;
      return String(txt).indexOf(n) >= 0 && n.indexOf(cod) >= 0 ? cod : n;
    });
  }
  function mapaNomesOS(linhas) {
    var m = {};
    (linhas || []).forEach(function (o) {
      var n = nomeOS(o.os, o.desc);
      String(o.rot || o.os || "").split(/\s*[|+]\s*/).forEach(function (c) { if (c) m[c.trim().toUpperCase()] = n; });
      m[o.os] = n;
    });
    return m;
  }
  // Texto livre da ATA sem o cabecalho da caixa e sem os textos padrao de "vazio".
  function limparAta(t, tiraCaixa) {
    var x = String(t || "").trim();
    if (tiraCaixa) x = x.split("\n").slice(1).join(" ");
    x = x.replace(/\s+/g, " ").trim();
    return /^(sem justificativas?|sem parecer registrado|-)\.?$/i.test(x) ? "" : x;
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
  // 16/11/2026 (usuario): a situacao vem SEMPRE da apuracao real (o score do app com os numeros do mes),
  // nao da conclusao do parecer. O parecer e o comentario do gestor entram so como contexto para a IA;
  // a primeira linha do parecer so e usada quando o mes nao tem apuracao.
  function statusApurado(contract, m, id) {
    var sc = SCORE[id]; if (!sc) return "";
    try {
      var tp = (window.calculateOSScoreDados || window.calculateOSScore)(contract, m).topics[sc];   // 17/11: todo mes pelos valores do sistema
      if (!tp) return "";
      if (!tp.applicable) return "na";
      return tp.earned >= tp.max - 0.01 ? "ok" : "bad";
    } catch (e) { return ""; }
  }
  function statusMes(contract, m, id, os) {
    var ap = statusApurado(contract, m, id);
    if (ap) return ap;
    return os ? statusCaixa(os, m, id) : "";
  }
  // Valores apurados do indicador no mes, pela mesma funcao que monta a caixa do app (numeros do painel).
  function valorApurado(contract, m, id) {
    try {
      var md = contract && contract.monthHistory ? contract.monthHistory[m] : null;
      return A.buildTopicDetailLine ? String(A.buildTopicDetailLine("t" + id, md, contract, m) || "").replace(/\s+/g, " ").trim() : "";
    } catch (e) { return ""; }
  }

  function montarSeries(dados, mes) {
    var S = { meses: [] }, i, m;
    for (m = 1; m <= mes; m++) S.meses.push(m);
    var rh = {}; (dados.rh || []).forEach(function (r) { rh[parseInt(r.MesNo, 10)] = r; });
    function col(k, f) { return S.meses.map(function (mm) { var r = rh[mm]; var v = r ? r[k] : null; return v == null ? null : (f ? f(v) : v); }); }
    S.rh = { efet: col("efetFolha"), efetPR: col("efetPR"), efetEx: col("efetEx"), hht: col("hht"), hhtPR: col("hhtPR"), hhtEx: col("hhtEx"), he: col("hePct", function (v) { return v * 100; }), abs: col("absPct", function (v) { return v * 100; }),
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
      var p = r.perda != null ? (r.perda || 0) : (r.ideal || 0) - (r.medido || 0);   // 16/11: regra do painel (PERDA TOTAL)
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
    if (temA) S.assert = { dmarg: dm, acum: preencherAssertAcum(dm, ac) };
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
    if (iguais && saldo !== 0) a.problemas.push(proj[0].efet == null   // 17/11 (usuario): projecao em branco ou mantida com admissao/demissao -> cobrar a revisao
      ? "não há EFETIVO PR projetado de " + MES[proj[0].m] + " a " + MES[proj[proj.length - 1].m] + ", apesar de " + adm + " admissões e " + dem + " demissões em " + MES[m]   // 17/11: sem projecao saia "fixo em –"
      : "o EFETIVO PR está fixo em " + fmt(proj[0].efet) + " de " + MES[proj[0].m] + " a " + MES[proj[proj.length - 1].m] + ", sem refletir a movimentação");
    return { meses: proj, alerta: a.problemas.length ? a : null, base: a };
  }

  // ---- REGUA DE TENDENCIA (25/11/2026, usuario) ------------------------------------------------
  // A referencia e a MARGEM prometida no executivo. Faturamento e custo so precisam seguir o efetivo
  // (por pessoa e por HHT); quando a margem sai da regua, o desvio precisa de causa, mes e destino
  // (fica no mes, segue nos meses projetados ou passa para o ano seguinte). Eventos previsiveis do
  // Cadastro de Metas > Eventos (EVENTO_OS: data-base do dissidio e reajuste do contrato; EVENTO_GERAL:
  // reoneracao etc.) e as ferias vencidas (regra do #14) tem que aparecer na projecao.
  var EVT_ABREV = ["", "jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  function eventosDaOS(codigos, neg, setor, ano) {
    var ps = (window.METAS_DB && window.METAS_DB.parametros) || [], out = { os: [], ger: [] };
    ps.forEach(function (p) {
      if (String(p.ativo) !== "Sim") return;
      var v = String(p.valor || "").split("|");
      if (String(p.tipo) === "EVENTO_OS" && codigos.indexOf(String(v[0]).toUpperCase()) >= 0 && Math.floor((parseInt(p.vigencia, 10) || 0) / 100) === ano)
        out.os.push({ os: v[0], db: parseInt(v[1], 10) || 0, dbp: v[2] === "" || v[2] == null ? null : +v[2] / 100, rj: parseInt(v[3], 10) || 0, rjp: v[4] === "" || v[4] == null ? null : +v[4] / 100, ind: v[5] || "", obs: p.comentario || "" });
      else if (String(p.tipo) === "EVENTO_GERAL") {
        var abr = String(v[4] || "TODAS"), vale = abr === "TODAS" || (abr.indexOf("NEGOCIO:") === 0 && abr.slice(8) === String(neg || "")) || (abr.indexOf("SETOR:") === 0 && abr.slice(6) === String(setor || ""));
        if (vale) out.ger.push({ nome: v[0], am: parseInt(v[1], 10) || 0, efeito: v[2] || "CUSTO", pct: v[3] === "" || v[3] == null ? null : +v[3] / 100, abr: abr, obs: p.comentario || "" });
      }
    });
    return out;
  }
  function reguaTendencia(S, dados, mes, os, ano, H) {
    var soma = function (a) { var s = 0, h = false; (a || []).forEach(function (v) { if (v != null && v !== "" && !isNaN(v)) { s += +v; h = true; } }); return h ? s : null; };
    var div = function (a, b) { return a == null || b == null || !b ? null : a / b; };
    var ms = S.meses || [], n = ms.length; if (!n || !S.rh) return null;
    var F = S.rh.fat || [], R = S.rh.res || [], E = S.rh.efet || [], Hh = S.rh.hht || [];
    function jan(fs, rs, es, hs) {
      var f = soma(fs), r = soma(rs), e = soma(es), h = soma(hs), c = f == null || r == null ? null : f - r;
      return { f: f, r: r, c: c, e: e, h: h, marg: div(r, f), fpp: div(f, e), cpp: div(c, e), fph: div(f, h), cph: div(c, h), hpp: div(h, e) };
    }
    var acum = jan(F, R, E, Hh), i3 = Math.max(0, n - 3), ult = jan(F.slice(i3), R.slice(i3), E.slice(i3), Hh.slice(i3));
    var mx = {}; (dados.mesx || []).forEach(function (r) { mx[parseInt(r.MesNo, 10)] = r; });
    var ex = jan(ms.map(function (m) { return mx[m] ? mx[m].fe : null; }), ms.map(function (m) { return mx[m] ? mx[m].re : null; }), S.rh.efetEx, S.rh.hhtEx);
    var P = (dados.proj || []).filter(function (x) { return +x.m > mes; }).sort(function (a, b) { return a.m - b.m; });
    var pj = jan(P.map(function (x) { return x.fat; }), P.map(function (x) { return x.res; }), P.map(function (x) { return x.efet; }), P.map(function (x) { return x.hht; }));
    var PX = (dados.projx || []).filter(function (x) { return +x.m > mes; });
    var exP = jan(PX.map(function (x) { return x.fe; }), PX.map(function (x) { return x.re; }), [], []);
    var anoR = { f: (acum.f || 0) + (pj.f || 0), r: (acum.r || 0) + (pj.r || 0) }; anoR.marg = div(anoR.r, anoR.f);
    var anoEx = { f: (ex.f || 0) + (exP.f || 0), r: (ex.r || 0) + (exP.r || 0) }; anoEx.marg = div(anoEx.r, anoEx.f);
    var margProm = anoEx.marg != null ? anoEx.marg : ex.marg;   // margem prometida = executivo do ano
    var tol = tolAssert() / 100, pp = function (v) { return v == null ? "–" : (v >= 0 ? "+" : "") + fmt(v * 100, 1) + " p.p."; };
    var mg = function (v) { return v == null ? "–" : fmt(v * 100, 1) + "%"; }, var1 = function (a, b) { return a == null || b == null || !b ? null : a / b - 1; };
    var vp = function (v) { return v == null ? "–" : (v >= 0 ? "+" : "") + fmt(v * 100, 1) + "%"; };
    var mesesP = P.map(function (x) { return EVT_ABREV[x.m]; });
    var horiz = mesesP.length ? mesesP[0] + (mesesP.length > 1 ? "–" + mesesP[mesesP.length - 1] : "") : "";
    // leitura da projecao: contra o que o contrato vem entregando (ultimos 3 meses) e contra a promessa
    var leitura = pj.marg == null || ult.marg == null ? "sem projeção" : (pj.marg - ult.marg > tol ? "OTIMISTA" : (pj.marg - ult.marg < -tol ? "CONSERVADORA" : "COERENTE com os últimos meses"));
    var alertas = [], causas = [], curtos = [];
    var dF = var1(pj.fpp, ult.fpp), dC = var1(pj.cpp, ult.cpp), dH = var1(pj.hpp, ult.hpp);
    var eUlt = E[n - 1], ePj = P.length ? P[P.length - 1].efet : null, hUlt = Hh[n - 1], hPj = P.length ? P[P.length - 1].hht : null;
    if (dH != null && Math.abs(dH) > 0.10) curtos.push("efetivo PR " + fmt(ePj) + " com " + fmt(eUlt) + " na folha e " + fmt(pj.hpp, 0) + " h por pessoa projetadas (eram " + fmt(ult.hpp, 0) + ")"), alertas.push("horas por pessoa projetadas " + fmt(pj.hpp, 0) + " h contra " + fmt(ult.hpp, 0) + " h nos últimos 3 meses (" + vp(dH) + "): efetivo PR (" + fmt(eUlt) + " → " + fmt(ePj) + ") e HHT PR (" + fmt(hUlt, 0) + " → " + fmt(hPj, 0) + " h) não se explicam");
    // eventos cadastrados
    var cods = codigosBloco((H && H.rotulo) || os).split("|").filter(Boolean); if (cods.indexOf(os) < 0) cods.push(os);
    var setor = window.ELEG_MES && window.ELEG_MES.porOS && window.ELEG_MES.porOS[os] ? window.ELEG_MES.porOS[os].setor : "";
    var ev = eventosDaOS(cods, (H && H.neg) || "", setor, ano), evTxt = [];
    // peso da folha no custo (salario + encargos + provisoes do contabil), para estimar o efeito do dissidio
    var fo = S.fin && S.fin.folha, pesoFolha = null;
    if (fo && fo.base) { var fl = -((soma(fo.base) || 0) + (soma(fo.enc) || 0) + (soma(fo.prov) || 0)); pesoFolha = div(fl, acum.c); }
    if (pesoFolha == null || pesoFolha <= 0 || pesoFolha > 1) pesoFolha = 0.6;
    var reajNoHoriz = false;
    ev.os.forEach(function (e) {
      if (e.db) {
        var txt = "dissídio " + (e.dbp != null ? fmt(e.dbp * 100, 2) + "% " : "") + "na data-base de " + EVT_ABREV[e.db];
        if (e.db > mes) {
          var esperado = e.dbp != null ? e.dbp * pesoFolha * 0.5 : 0.02;
          if (dC == null || dC < esperado) curtos.push(txt + " fora da projeção"), alertas.push(txt + " não aparece na projeção: custo por pessoa projetado " + vp(dC) + " sobre os últimos 3 meses, esperado ao menos " + vp(esperado));
          else evTxt.push(txt + " considerado na projeção (custo por pessoa " + vp(dC) + ")");
        } else {
          var ib = ms.indexOf(e.db), antes = ib > 0 ? jan(F.slice(Math.max(0, ib - 3), ib), R.slice(Math.max(0, ib - 3), ib), E.slice(Math.max(0, ib - 3), ib), []) : null, depois = ib >= 0 ? jan(F.slice(ib), R.slice(ib), E.slice(ib), []) : null;
          var dReal = antes && depois ? var1(depois.cpp, antes.cpp) : null, espR = e.dbp != null ? e.dbp * pesoFolha * 0.5 : 0.02;
          if (dReal != null && dReal >= espR) evTxt.push(txt + " já aparece no realizado (custo por pessoa " + vp(dReal) + " desde " + EVT_ABREV[e.db] + ")");
          else curtos.push(txt + " ainda não apareceu no realizado"), alertas.push(txt + " ainda não aparece no realizado (custo por pessoa " + vp(dReal) + " desde " + EVT_ABREV[e.db] + "): o reajuste e o retroativo precisam estar na projeção");
        }
      }
      if (e.rj) {
        var tr = "reajuste do contrato " + (e.rjp != null ? fmt(e.rjp * 100, 2) + "% " : "") + (e.ind ? "(" + e.ind + ") " : "") + "em " + EVT_ABREV[e.rj];
        if (e.rj > mes) {
          reajNoHoriz = true;
          var espF = e.rjp != null ? e.rjp * 0.5 : 0.02;
          if (dF == null || dF < espF) curtos.push(tr + " fora do faturamento projetado"), alertas.push(tr + " não aparece no faturamento projetado: faturamento por pessoa " + vp(dF) + ", esperado ao menos " + vp(espF));
          else evTxt.push(tr + " considerado na projeção (faturamento por pessoa " + vp(dF) + ")");
        } else evTxt.push(tr + " (já passou; conferir se o novo preço entrou no faturamento a partir desse mês)");
      }
    });
    ev.ger.forEach(function (g) {
      var ag = Math.floor(g.am / 100), mg0 = g.am % 100, nome = g.nome + (g.pct != null ? " (" + fmt(g.pct * 100, 2) + "%)" : "") + " em " + EVT_ABREV[mg0] + "/" + ag;
      if (ag > ano) evTxt.push(nome + ": fora do horizonte do FCST de " + ano + "; a projeção de " + ag + " precisa considerar");
      else if (ag === ano && mg0 > mes) {
        var alvo = g.efeito === "FATURAMENTO" ? dF : dC, esp = g.pct != null ? g.pct * (g.efeito === "FATURAMENTO" ? 0.5 : pesoFolha * 0.5) : 0.02;
        if (alvo == null || alvo < esp) curtos.push(nome + " fora da projeção"), alertas.push(nome + " não aparece na projeção (" + (g.efeito === "FATURAMENTO" ? "faturamento" : "custo") + " por pessoa " + vp(alvo) + ")");
        else evTxt.push(nome + " considerado na projeção");
      }
    });
    if (!reajNoHoriz && dF != null && dF > 0.10) curtos.push("faturamento por pessoa " + vp(dF) + " sem reajuste"), alertas.push("faturamento por pessoa projetado sobe " + vp(dF) + " sobre os últimos 3 meses sem reajuste cadastrado para " + horiz);
    // ferias vencidas (regra do #14)
    var f45 = S.rh.fer45;
    if (f45 != null && eUlt) {
      var qf = f45 / eUlt;
      if (qf >= 0.10 && (dC == null || dC <= 0.02)) curtos.push(fmt(f45) + " pessoas com férias vencidas sem custo projetado"), alertas.push(fmt(f45) + " pessoas com férias vencidas (" + fmt(qf * 100, 1) + "% do efetivo) e o custo por pessoa projetado não sobe (" + vp(dC) + "): reservar o custo das férias nos meses de saída");
      else if (f45 > 0) evTxt.push(fmt(f45) + " pessoas com férias vencidas (" + fmt(qf * 100, 1) + "% do efetivo)");
    }
    // destino do desvio: o que ficou para tras contra a margem prometida e o que a projecao recupera
    var gapAcum = acum.f != null && margProm != null ? acum.r - acum.f * margProm : null;
    var gapProj = pj.f != null && margProm != null ? pj.r - pj.f * margProm : null;
    var destino = "";
    if (gapAcum != null) {
      if (gapAcum < 0 && gapProj != null && gapProj > 0) destino = "a projeção de " + horiz + " recupera " + rs(gapProj) + " de " + rs(-gapAcum) + " abaixo da margem prometida até " + EVT_ABREV[mes] + " (" + fmt(Math.min(1, gapProj / -gapAcum) * 100, 0) + "%)";
      else if (gapAcum < 0) destino = "nada do desvio de " + rs(-gapAcum) + " volta na projeção de " + horiz;
      else destino = "acumulado acima da margem prometida em " + rs(gapAcum);
      if (anoR.marg != null && margProm != null && anoR.marg < margProm - 0.001) destino += "; o ano fecha " + pp(anoR.marg - margProm) + " abaixo da margem prometida, e o que não se confirmar passa para " + (ano + 1);
    }
    var linhas = [
      "RÉGUA DE TENDÊNCIA (calculado; referência = margem prometida no executivo do ano " + mg(margProm) + "; faturamento e custo devem seguir o efetivo):",
      "  Margem: acumulada jan–" + EVT_ABREV[mes] + " " + mg(acum.marg) + " | últimos 3 meses " + mg(ult.marg) + " | projetada " + horiz + " " + mg(pj.marg) + " | executivo " + mg(margProm) + " | ano (real + projeção) " + mg(anoR.marg) + ".",
      "  Leitura da projeção: " + leitura + " (projetada " + pp(pj.marg != null && ult.marg != null ? pj.marg - ult.marg : null) + " sobre os últimos 3 meses; tolerância " + fmt(tol * 100, 2) + " p.p.).",
      "  Por pessoa-mês: faturamento acumulado " + rs(acum.fpp) + ", últimos 3 meses " + rs(ult.fpp) + ", projetado " + rs(pj.fpp) + " (" + vp(dF) + "), executivo " + rs(ex.fpp) + " | custo acumulado " + rs(acum.cpp) + ", últimos 3 meses " + rs(ult.cpp) + ", projetado " + rs(pj.cpp) + " (" + vp(dC) + "), executivo " + rs(ex.cpp) + ".",
      "  Por HHT: faturamento " + (acum.fph != null ? "R$ " + fmt(acum.fph, 2) : "–") + " acumulado, " + (pj.fph != null ? "R$ " + fmt(pj.fph, 2) : "–") + " projetado, " + (ex.fph != null ? "R$ " + fmt(ex.fph, 2) : "–") + " executivo | custo " + (acum.cph != null ? "R$ " + fmt(acum.cph, 2) : "–") + " acumulado, " + (pj.cph != null ? "R$ " + fmt(pj.cph, 2) : "–") + " projetado, " + (ex.cph != null ? "R$ " + fmt(ex.cph, 2) : "–") + " executivo | horas por pessoa " + fmt(ult.hpp, 0) + " h nos últimos 3 meses x " + fmt(pj.hpp, 0) + " h projetadas.",
      "  Destino do desvio: " + (destino || "–") + ".",
      "  Eventos cadastrados e férias: " + (evTxt.length ? evTxt.join("; ") : "nenhum evento cadastrado para esta OS no Cadastro de Metas > Eventos") + ".",
      "  ALERTAS DA PROJEÇÃO: " + (alertas.length ? alertas.join(" | ") : "nenhum") + "."
    ];
    return { acum: acum, ult: ult, ex: ex, pj: pj, exP: exP, anoR: anoR, anoEx: anoEx, margProm: margProm, leitura: leitura, alertas: alertas, curtos: curtos, eventos: evTxt, destino: destino, horiz: horiz, linhas: linhas };
  }
  function reguaHTML(G) {
    if (!G) return "";
    var mg = function (v) { return v == null ? "–" : pct(v, 1); }, r0 = function (v) { return v == null ? "–" : moeda(v); };
    var cls = /OTIMISTA/.test(G.leitura) ? "bad" : (/CONSERVADORA/.test(G.leitura) ? "na" : "ok");
    return '<div class="rl-tab"><table><thead><tr><th></th><th>Acumulado</th><th>Últimos 3 meses</th><th>Projetado ' + esc(G.horiz) + '</th><th>Executivo</th></tr></thead><tbody>' +
      "<tr><td>Margem</td><td>" + mg(G.acum.marg) + "</td><td>" + mg(G.ult.marg) + "</td><td><b>" + mg(G.pj.marg) + "</b></td><td>" + mg(G.margProm) + "</td></tr>" +
      "<tr><td>Faturamento por pessoa-mês</td><td>" + r0(G.acum.fpp) + "</td><td>" + r0(G.ult.fpp) + "</td><td>" + r0(G.pj.fpp) + "</td><td>" + r0(G.ex.fpp) + "</td></tr>" +
      "<tr><td>Custo por pessoa-mês</td><td>" + r0(G.acum.cpp) + "</td><td>" + r0(G.ult.cpp) + "</td><td>" + r0(G.pj.cpp) + "</td><td>" + r0(G.ex.cpp) + "</td></tr>" +
      "<tr><td>Horas por pessoa</td><td>" + fmt(G.acum.hpp, 0) + "</td><td>" + fmt(G.ult.hpp, 0) + "</td><td>" + fmt(G.pj.hpp, 0) + "</td><td>" + fmt(G.ex.hpp, 0) + "</td></tr>" +
      '</tbody></table><p class="rl-nota">Leitura da projeção: <span class="bk-pill ' + cls + '">' + esc(G.leitura) + "</span> · ano (real + projeção) " + mg(G.anoR.marg) + " contra " + mg(G.margProm) + " prometidos" +
      (G.alertas.length ? "<br><b>Alertas:</b> " + esc(G.alertas.join(" · ")) : "") + "</p></div>";
  }

  // ---- RESUMO PARA A RPCO (25/11/2026, usuario) --------------------------------------------------
  // Um bloco so, com quatro partes fixas: situacao, principais causas, projecao e o que cobrar. Situacao,
  // causas e projecao saem dos numeros do book (valores exatos); a IA escreve so o "cobrar". O mesmo bloco
  // vai para a pagina RPCO. Nos degraus de cima (gerencia, superintendencia, empresa) ele soma os de baixo
  // e encurta. Contas: descricao como esta no contabil.
  function nomeConta(c) { var s = String(c || ""); var i = s.indexOf(" - "); return i > 0 ? s.slice(i + 3).trim() : s.trim(); }
  function contaDeCusto(x) { var sub = String(x.sub || x.conta || ""); return !/^3\./.test(sub) && !/^5\./.test(sub) && !/^3\d{7}/.test(String(x.conta || "")) && !/^5\d{7}/.test(String(x.conta || "")); }
  function causasDeCusto(contas, recor, n) {
    var rc = {}; (recor || []).forEach(function (r) { var k = Array.isArray(r) ? r[0] : r.conta; rc[k] = Array.isArray(r) ? { acima: r[2], meses: r[3] } : { oss: (r.oss || []).length }; });
    var custos = (contas || []).filter(contaDeCusto);
    var contra = custos.filter(function (x) { return x.desvio <= -1; }).slice(0, n).map(function (x) {
      var r = rc[x.conta], semOrc = !x.exec;
      return { conta: nomeConta(x.conta), valor: Math.round(-x.desvio), tipo: semOrc ? "sem orçamento" : "acima da proporção do efetivo",
        rec: r && r.meses ? r.acima + " de " + r.meses + " meses" : (r && r.oss ? r.oss + " OSs" : ""), oss: x.oss ? x.oss.slice(0, 2).map(function (o) { return o[0]; }) : null };
    });
    var favor = custos.filter(function (x) { return x.desvio >= 1; }).sort(function (a, b) { return b.desvio - a.desvio; }).slice(0, 2).map(function (x) { return { conta: nomeConta(x.conta), valor: Math.round(x.desvio) }; });
    return { contra: contra, favor: favor };
  }
  function resumoRpcoOS(S, regua) {
    var an = analisarCustos(S.fin); if (!an) return null;
    var c = causasDeCusto(an.contas, S.fin.recorrentes, 3), G = regua || {};
    return { nivel: "os", margAcum: an.margReal, margExecAcum: an.margExec, margAno: G.anoR ? G.anoR.marg : null, margProm: G.margProm,
      causas: c.contra, favor: c.favor, leitura: G.leitura || "", margProj: G.pj ? G.pj.marg : null, margUlt: G.ult ? G.ult.marg : null,
      horiz: G.horiz || "", alertas: (G.curtos || []).slice(0, 2) };
  }
  function resumoLinhas(R) {
    if (!R) return [];
    var mg = function (v) { return v == null ? "–" : fmt(v * 100, 1) + "%"; };
    var L = ["Situação: margem acumulada " + mg(R.margAcum) + " contra " + mg(R.margExecAcum) + " do executivo; o ano fecha em " + mg(R.margAno) + " contra " + mg(R.margProm) + " prometidos" +
      (R.margAno != null && R.margProm != null ? " (" + (R.margAno - R.margProm >= 0 ? "+" : "") + fmt((R.margAno - R.margProm) * 100, 1) + " p.p.)" : "") + "."];
    if (R.quem && R.quem.length) L.push("Quem mais puxa a margem para baixo: " + R.quem.map(function (q) { return q.nome + " (" + rs(q.gap) + ")"; }).join("; ") + ".");
    L.push("Principais causas: " + (R.causas.length ? R.causas.map(function (x, i) { return (i + 1) + ". " + x.conta + ": " + rs(x.valor) + " " + x.tipo + (x.rec ? ", em " + x.rec : "") + (x.oss && x.oss.length && R.nivel !== "os" ? " (" + x.oss.join(", ") + ")" : ""); }).join("; ") + "." : "nenhuma conta de custo acima da proporção do efetivo") +
      (R.favor && R.favor.length ? " A favor: " + R.favor.map(function (x) { return x.conta + " " + rs(x.valor); }).join(", ") + "." : ""));
    L.push("Projeção " + (R.horiz || "") + ": " + (R.leitura || "sem projeção") + (R.margProj != null ? " (margem projetada " + mg(R.margProj) + " contra " + mg(R.margUlt) + " dos últimos 3 meses)" : "") +
      (R.otimistas != null ? "; " + R.otimistas + " de " + R.nOS + " OSs com projeção otimista" : "") + (R.alertas && R.alertas.length ? ": " + R.alertas.join("; ") : "") + ".");
    return L;
  }
  function resumoHTML(R, cobrar) {
    if (!R) return "";
    var mg = function (v) { return v == null ? "–" : pct(v, 1); };
    var cls = /OTIMISTA/.test(R.leitura) ? "bad" : (/CONSERVADORA/.test(R.leitura) ? "na" : "ok");
    var h = '<section class="rl-cap rl-resumo"><h2><span>★</span>Resumo para a RPCO</h2><div class="rl-tab"><table><tbody>' +
      '<tr><td style="width:150px"><b>Situação</b></td><td>Margem acumulada <b>' + mg(R.margAcum) + "</b> contra " + mg(R.margExecAcum) + " do executivo; o ano fecha em <b>" + mg(R.margAno) + "</b> contra " + mg(R.margProm) + " prometidos.</td></tr>";
    if (R.quem && R.quem.length) h += "<tr><td><b>Quem puxa</b></td><td>" + R.quem.map(function (q) { return esc(q.nome) + " (" + moeda(q.gap) + ")"; }).join("; ") + "</td></tr>";
    h += "<tr><td><b>Principais causas</b></td><td>" + (R.causas.length ? "<ol style=\"margin:0;padding-left:18px\">" + R.causas.map(function (x) {
        return "<li><b>" + esc(x.conta) + "</b>: " + moeda(x.valor) + " " + esc(x.tipo) + (x.rec ? ", em " + esc(x.rec) : "") + (x.oss && x.oss.length && R.nivel !== "os" ? " (" + esc(x.oss.join(", ")) + ")" : "") + "</li>"; }).join("") + "</ol>" : "Nenhuma conta de custo acima da proporção do efetivo.") +
      (R.favor && R.favor.length ? '<div style="margin-top:4px">A favor: ' + R.favor.map(function (x) { return esc(x.conta) + " " + moeda(x.valor); }).join(", ") + "</div>" : "") + "</td></tr>" +
      "<tr><td><b>Projeção " + esc(R.horiz || "") + '</b></td><td><span class="bk-pill ' + cls + '">' + esc(R.leitura || "sem projeção") + "</span> " + (R.margProj != null ? "margem projetada " + mg(R.margProj) + " contra " + mg(R.margUlt) + " dos últimos 3 meses" : "") +
      (R.otimistas != null ? "; " + R.otimistas + " de " + R.nOS + " OSs com projeção otimista" : "") + (R.alertas && R.alertas.length ? ". " + esc(R.alertas.join("; ")) : "") + "</td></tr>" +
      "<tr><td><b>Cobrar</b></td><td>" + (cobrar ? esc(cobrar) : "–") + "</td></tr></tbody></table></div></section>";
    return h;
  }

  function coletarOS(os, ano, mes, dados) {
    var contract = contratoDa(os);
    if (!contract || !contract.monthHistory) throw new Error("Os dados da OS " + os + " não chegaram ao app. Selecione uma única OS no Power BI.");
    var H = hier()[os] || {};
    // 17/11/2026 (usuario): nenhum mes fica de fora. Todo mes ate o do filtro e avaliado pelos valores do sistema,
    // fechado ou nao, com ou sem comentario. Sem comentario faltam so a justificativa e o plano -- e isso conta contra.
    var p0 = 1;
    var semTrat = [];
    for (var mt = 1; mt <= mes; mt++) {
      var temT = false;
      for (var it = 1; it <= 24 && !temT; it++) if (limparAta(ata(os, it, mt)) || limparAta(ata(os, it, mt, "GESTOR"))) temT = true;
      if (!temT) semTrat.push(mt);
    }
    var mesesVal = A.mesesValidadosDaOS ? A.mesesValidadosDaOS(os, mes) : [];
    var S = montarSeries(dados, mes);
    S.fin = montarFin(dados, mes, S);
    if (dados.fer) { S.rh.fer30 = dados.fer.f30; S.rh.fer45 = dados.fer.f45; S.rh.ferSaldo = dados.fer.saldo; S.rh.ferTot = dados.fer.tot; }
    if (dados.ferRH && dados.ferRH.f45 != null) S.rh.fer45 = dados.ferRH.f45;   // 16/11: mais de 45 dias pela regra do painel RH (igual ao #14)
    S.proj = conferirProjecao(S, (dados.proj || []).slice().sort(function (a, b) { return a.m - b.m; }));
    try { S.regua = reguaTendencia(S, dados, mes, os, ano, H); } catch (eR) { S.regua = null; console.warn('regua de tendencia', eR); }
    try { S.resumo = resumoRpcoOS(S, S.regua); } catch (eS) { S.resumo = null; console.warn('resumo RPCO', eS); }
    var semAtiv = [];
    for (var ma = 1; ma <= mes; ma++) if (!mesComAtividade(S, ma)) semAtiv.push(ma);
    function inat(m) { return semAtiv.indexOf(m) >= 0; }
    semTrat = semTrat.filter(function (m) { return !inat(m); });
    for (var m1 = 1; m1 <= mes; m1++) if (!inat(m1)) { p0 = m1; break; }
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
    // 16/11/2026 (usuario): numeros dos paineis para os indicadores qualitativos, com as regras deles.
    // #13 Excesso de HE: pessoas acima do limite no mes (PARADA 60 h, demais 55 h; painel RH);
    // #14 Acumulo de ferias: qualquer pessoa com mais de 45 dias = nao aderente (painel RH; so a posicao de hoje);
    // #7 Receita Ideal: perda total acima de 4% da receita ideal = nao aderente (painel Receita Ideal).
    // Indicador ja marcado pelo Master segue a marcacao; o numero apurado vai junto para a IA.
    var hexM = {}; (dados.hex || []).forEach(function (x) { hexM[x.m] = x; });
    var ptM = {}; norm(dados.ri2).forEach(function (x) { if (x.tipo === "PT") ptM[parseInt(x.mes, 10)] = { perda: +x.valor || 0, ideal: +x.pct || 0 }; });
    S.qual = { hex: hexM, pt: ptM, fer45: dados.ferRH ? dados.ferRH.f45 : null };
    function apuraQual(id, m) {
      if (id === 13) { var h = hexM[m]; if (!h || h.acima == null) return null;
        return { st: h.acima > 0 ? "bad" : "ok", txt: fmt(h.acima) + (h.acima === 1 ? " pessoa" : " pessoas") + " acima do limite de hora extra no mês (55 h rotina, 60 h parada)" + (h.pessoas != null ? " · " + fmt(h.pessoas) + " pessoas com HE · " + fmt(h.horas || 0) + " h" : "") }; }
      if (id === 14) { if (m !== mes || S.qual.fer45 == null) return null;
        return { st: S.qual.fer45 > 0 ? "bad" : "ok", txt: fmt(S.qual.fer45) + (S.qual.fer45 === 1 ? " pessoa" : " pessoas") + " com mais de 45 dias de férias (posição de hoje, painel RH)" }; }
      // 17/11/2026: SAF e CAF tem o numero no sistema; sem a validacao do Master, vale a contagem do mes
      if (id === 15 || id === 16) { var mh0 = contract && contract.monthHistory ? contract.monthHistory[m] : null; if (!mh0) return null;
        var nq = id === 15 ? mh0.safCount : mh0.cafCount; if (nq == null) return null;
        return { st: nq > 0 ? "bad" : "ok", txt: fmt(nq) + (nq === 1 ? " ocorrência " : " ocorrências ") + (id === 15 ? "SAF" : "CAF") + " no mês (sistema)" }; }
      if (id === 7) { var t = ptM[m]; if (!t || !t.ideal) return null; var pc = t.perda / t.ideal;
        return { st: pc > 0.04 ? "bad" : "ok", txt: "perda " + moeda(t.perda) + " = " + fmt(pc * 100, 2) + "% da Receita Ideal " + moeda(t.ideal) + " (referência 4%)" }; }
      return null;
    }
    var inds = [];
    CATS.forEach(function (c) {
      c.ids.forEach(function (id) {
        var strip = "", m, sts = [];
        var caixa = primeiraLinha(ata(os, id, mes));
        var vals = [], diverge = [];
        for (m = 1; m <= mes; m++) {
          var st0 = inat(m) ? "" : statusMes(contract, m, id, os), v0 = inat(m) ? "sem atividade no mês (sem faturamento, custo nem efetivo)" : valorApurado(contract, m, id);
          var q0 = inat(m) ? null : apuraQual(id, m);
          if (q0) {
            if (/ainda n\u00e3o avaliada/.test(v0) || ((id === 15 || id === 16) && (!st0 || st0 === "na"))) { st0 = q0.st; v0 = q0.txt; }       // Master nao marcou: vale o numero do painel
            else if (v0.indexOf("painel RH") < 0) v0 = (v0 ? v0 + " | " : "") + "apurado: " + q0.txt   // 17/11: a caixa da Aba 1 ja traz o numero do painel RH (#13/#14)
               + (st0 && st0 !== "na" && st0 !== q0.st ? " (a marcação diverge do número)" : "");
          }
          sts.push(st0); vals.push(v0);
          strip += inat(m) ? "-" : ({ ok: "A", bad: "N", na: "V" }[st0] || "-");
          var ap = statusApurado(contract, m, id), pc = statusCaixa(os, m, id);
          if (!inat(m) && ap && pc && ap !== "na" && pc !== "na" && ap !== pc) diverge.push(MES[m] + " (parecer: " + ({ ok: "atendeu", bad: "não atendeu", na: "não avaliado" }[pc]) + ")");
        }
        var s = sts[sts.length - 1];
        var vMes = vals[vals.length - 1];
        inds.push({ id: id, nome: NOME[id], cat: c.cat, st: s || "na", strip: strip, vals: vals, diverge: diverge,
          pill: s === "ok" ? "ATENDEU" : s === "bad" ? "NÃO ATENDEU" : "NÃO AVALIADO",
          val: (vMes || caixa.replace(/\s\|\s/g, " · ")).slice(0, 260) });
      });
    });
    return { contract: contract, H: H, p0: p0, mesesVal: mesesVal, semTrat: semTrat, semAtiv: semAtiv, S: S, kpi: kpi, inds: inds };
  }

  // ------------------------------------------------------------------ prompt da OS (relatório v2)
  function linhaSerie(arr, f) { return arr.map(function (v, i) { return MES[i + 1] + " " + (v == null ? "–" : (f ? f(v) : fmt(v))); }).join(" · "); }
  function rs(v) { return moeda(v); }
  function cu(v) { return v == null ? "–" : moeda(Math.abs(v)); }
  function dif(v) { return v == null ? "–" : moeda(Math.abs(v)) + (v < 0 ? " a mais" : " a menos"); }
  // 16/11/2026 (usuario): faturamento e custo tem que acompanhar o efetivo. Faturamento por pessoa estavel; quando
  // o efetivo cai, o custo cai junto -- so no mes das demissoes o custo pode subir, pelas rescisoes, e isso e
  // apontado. Comparar so com o executivo nao basta (ele nao e corrigido mes a mes). Tolerancia de 5 p.p.
  // Devolve as linhas por mes e os meses fora, para cruzar com a justificativa do responsavel.
  var TOL_COER = 0.05;
  function coerenciaEfetivo(S) {
    var rh = S.rh || {}, fo = (S.fin && S.fin.folha) || {}, out = [], fora = [], rows = [];
    function pc(v) { return (v >= 0 ? "+" : "") + fmt(v * 100, 2) + "%"; }
    for (var i = 0; i < S.meses.length; i++) {
      var m = S.meses[i], e1 = rh.efet[i], f1 = rh.fat[i], r1 = rh.res[i], h1 = (rh.hht || [])[i];
      if (!e1 || f1 == null || r1 == null) continue;
      var c1 = f1 - r1, rc1 = Math.abs((fo.rescTot || [])[i] || 0), dem = (rh.dem || [])[i] || 0;
      // indicadores de proporcao: faturamento e custo por pessoa e por hora trabalhada
      var row = { m: m, efet: e1, hht: h1, fat: f1, custo: c1, res: r1, dem: dem, resc: rc1,
        fpp: f1 / e1, cpp: c1 / e1, fph: h1 ? f1 / h1 : null, cph: h1 ? c1 / h1 : null };
      rows.push(row);
      if (i === 0) continue;
      var e0 = rh.efet[i - 1], f0 = rh.fat[i - 1], r0 = rh.res[i - 1];
      if (!e0 || !f0 || r0 == null) continue;
      var c0 = f0 - r0;
      if (!(c0 > 0) || !(c1 > 0)) continue;
      var dE = e1 / e0 - 1, dF = f1 / f0 - 1, dC = c1 / c0 - 1;
      var rc0 = Math.abs((fo.rescTot || [])[i - 1] || 0);
      var dCs = (c0 - rc0) > 0 ? (c1 - rc1) / (c0 - rc0) - 1 : null;
      // HHT ao lado: admissao ou demissao no meio do mes mexe no efetivo da folha sem mexer no mes inteiro de horas
      var h0 = (rh.hht || [])[i - 1], dH = h0 && h1 != null ? h1 / h0 - 1 : null;
      row.dE = dE; row.dF = dF; row.dC = dC; row.dH = dH; row.dCs = dCs;
      var fatTxt, custoTxt, ruim = false;
      if (Math.abs(dF - dE) <= TOL_COER) { fatTxt = "faturamento coerente com o efetivo"; row.fatSt = "ok"; }
      else {
        fatTxt = "FATURAMENTO FORA DA PROPORÇÃO DO EFETIVO (" + (dF > dE ? "acima" : "abaixo") + " em " + fmt(Math.abs(dF - dE) * 100, 2) + " p.p.)";
        if (dH != null && Math.abs(dF - dH) <= TOL_COER) { fatTxt += ", mas acompanhou o HHT (" + pc(dH) + "): a diferença vem de admissão ou demissão no meio do mês, confirme na justificativa"; row.fatSt = "hht"; }
        else { if (dH != null) fatTxt += " e também fora do HHT (" + pc(dH) + ")"; row.fatSt = dF > dE ? "acima" : "abaixo"; }
        ruim = true;
      }
      var gap = dC - dE;
      if (Math.abs(gap) <= TOL_COER) { custoTxt = "custo coerente com o efetivo"; row.custoSt = "ok"; }
      else if (gap > 0) {
        if (dem > 0 && rc1 > 0 && dCs != null && Math.abs(dCs - dE) <= TOL_COER) { custoTxt = "custo acima da proporção SÓ pelas rescisões do mês das demissões (" + dem + " demissões, rescisões " + rs(rc1) + "): esperado neste mês, mas tem que ser apontado"; row.custoSt = "resc"; }
        else if (dem > 0 && rc1 > 0) { custoTxt = "CUSTO ACIMA DA PROPORÇÃO MESMO SEM AS RESCISÕES (" + dem + " demissões, rescisões " + rs(rc1) + "; sem elas o custo variou " + (dCs == null ? "–" : pc(dCs)) + ")"; ruim = true; row.custoSt = "acima"; }
        else { custoTxt = "CUSTO ACIMA DA PROPORÇÃO DO EFETIVO SEM DEMISSÃO QUE EXPLIQUE"; ruim = true; row.custoSt = "acima"; }
      } else { custoTxt = "CUSTO ABAIXO DA PROPORÇÃO DO EFETIVO (" + (dE >= 0 ? "subiu menos que o efetivo" : "caiu mais que o efetivo") + "; conferir custo de pessoal ainda não lançado, lançamento fora do mês ou estorno)"; ruim = true; row.custoSt = "abaixo"; }
      row.ruim = ruim;
      out.push(MES[m] + ": efetivo " + fmt(e0) + "→" + fmt(e1) + " (" + pc(dE) + ")" + (dH != null ? ", HHT " + pc(dH) : "") + ", faturamento " + pc(dF) + ", custo " + pc(dC) +
        (rc1 ? " (sem rescisões " + (dCs == null ? "–" : pc(dCs)) + ")" : "") + ", resultado " + rs(r0) + "→" + rs(r1) +
        "; faturamento por pessoa " + rs(f0 / e0) + "→" + rs(f1 / e1) + ", custo por pessoa " + rs(c0 / e0) + "→" + rs(c1 / e1) +
        (h0 && h1 ? ", faturamento por hora " + rs(f0 / h0) + "→" + rs(f1 / h1) + ", custo por hora " + rs(c0 / h0) + "→" + rs(c1 / h1) : "") +
        "; demissões " + dem + (rc1 ? ", rescisões " + rs(rc1) : "") + ". Leitura: " + fatTxt + "; " + custoTxt + ".");
      if (ruim) fora.push(m);
    }
    return { linhas: out, fora: fora, rows: rows };
  }

  // 23/11/2026 (usuario): diagnostico INTEGRADO de faturamento, efetivo e custo -- nao separar o faturamento do custo.
  // ANO contra o EXECUTIVO: razao de volume = efetivo real / efetivo do executivo (tabela EFETIVO E HH (EX)); faturamento
  // e custo esperados = executivo x razao. A diferenca de resultado fecha, sem sobra, em tres parcelas: VOLUME (o que o
  // efetivo a mais ou a menos traria na margem do executivo = resultado exec x (razao - 1)), FATURAMENTO POR PESSOA
  // (real - esperado) e CUSTO POR PESSOA (esperado - real; negativo = custou mais que a proporcao). Calculado mes a mes e
  // somado (o efetivo do executivo pode mudar no ano). Meses sem efetivo no executivo ficam numa parcela propria.
  // MES contra o FCST ANTERIOR: mesma conta com o efetivo do PR do mes (o PR nao guarda versao por FCST).
  function diagEfetivo(S) {
    if (!S || !S.fin || !S.fin.fc || !S.rh || !S.meses) return null;
    var rh = S.rh, fo = S.fin.folha || {}, rows = [];
    var A = { FR: 0, FE: 0, CR: 0, CE: 0, RR: 0, RE: 0, vol: 0, dFat: 0, dCus: 0, fatEsp: 0, cusEsp: 0, fatEspT: 0, cusEspT: 0, sEf: 0, sEx: 0, fV: 0, feV: 0, cV: 0, ceV: 0, n: 0, h: 0, hx: 0, hEf: 0, hEx: 0 };
    S.fin.fc.forEach(function (o) {
      var i = S.meses.indexOf(o.m);
      if (i < 0 || o.fat == null || o.res == null || o.fatEx == null || o.resEx == null) return;
      var ef = rh.efet[i], ex = (rh.efetEx || [])[i], cr = o.fat - o.res, ce = o.fatEx - o.resEx;
      var r = { m: o.m, ef: ef, ex: ex, fat: o.fat, fe: o.fatEx, cr: cr, ce: ce, res: o.res, re: o.resEx, adm: (rh.adm || [])[i] || 0, dem: (rh.dem || [])[i] || 0,
        tin: (rh.tIn || [])[i] || 0, tout: (rh.tOut || [])[i] || 0, h: (rh.hht || [])[i], hx: (rh.hhtEx || [])[i], resc: Math.abs((fo.rescTot || [])[i] || 0), pend: o.pend || null, ajuste: o.ajuste || null };
      if (ef > 0 && ex > 0) {
        r.v = ef / ex; r.fatEsp = o.fatEx * r.v; r.cusEsp = ce * r.v; r.vol = o.resEx * (r.v - 1); r.dFat = o.fat - r.fatEsp; r.dCus = r.cusEsp - cr;
        A.vol += r.vol; A.dFat += r.dFat; A.dCus += r.dCus; A.fatEsp += r.fatEsp; A.cusEsp += r.cusEsp; A.fatEspT += r.fatEsp; A.cusEspT += r.cusEsp;
        A.sEf += ef; A.sEx += ex; A.fV += o.fat; A.feV += o.fatEx; A.cV += cr; A.ceV += ce; A.n++;
        if (r.h != null && r.hx) { A.h += r.h; A.hx += r.hx; A.hEf += ef; A.hEx += ex; }
      } else { A.fatEspT += o.fatEx; A.cusEspT += ce; }
      A.FR += o.fat; A.FE += o.fatEx; A.CR += cr; A.CE += ce; A.RR += o.res; A.RE += o.resEx;
      rows.push(r);
    });
    if (!rows.length) return null;
    A.semEx = rows.filter(function (r) { return r.v == null; }).map(function (r) { return r.m; });
    A.resto = (A.RR - A.RE) - (A.vol + A.dFat + A.dCus);
    A.efMed = A.n ? A.sEf / A.n : null; A.exMed = A.n ? A.sEx / A.n : null; A.v = A.sEx ? A.sEf / A.sEx : null;
    A.fppR = A.sEf ? A.fV / A.sEf : null; A.fppE = A.sEx ? A.feV / A.sEx : null; A.cppR = A.sEf ? A.cV / A.sEf : null; A.cppE = A.sEx ? A.ceV / A.sEx : null;
    A.hppR = A.hEf ? A.h / A.hEf : null; A.hppE = A.hEx ? A.hx / A.hEx : null;
    var com = rows.filter(function (r) { return r.ef > 0; }), comX = rows.filter(function (r) { return r.ex > 0; });
    var mov = { adm: soma(rows.map(function (r) { return r.adm; })), dem: soma(rows.map(function (r) { return r.dem; })), tin: soma(rows.map(function (r) { return r.tin; })), tout: soma(rows.map(function (r) { return r.tout; })),
      resc: soma(rows.map(function (r) { return r.resc; })), ef0: com.length ? com[0].ef : null, ef1: com.length ? com[com.length - 1].ef : null, m0: com.length ? com[0].m : null, m1: com.length ? com[com.length - 1].m : null,
      ex0: comX.length ? comX[0].ex : null, ex1: comX.length ? comX[comX.length - 1].ex : null };
    var mm = S.meses[S.meses.length - 1], im = S.meses.length - 1, fm = S.fin.fc.filter(function (o) { return o.m === mm; })[0], M = null;
    if (fm && fm.fatFc != null && fm.resFc != null && fm.fat != null && fm.res != null) {
      var efm = rh.efet[im], epm = (rh.efetPR || [])[im], hm = (rh.hht || [])[im], hpm = (rh.hhtPR || [])[im], crm = fm.fat - fm.res, cfm = fm.fatFc - fm.resFc;
      M = { m: mm, fat: fm.fat, ff: fm.fatFc, cr: crm, cf: cfm, res: fm.res, rf: fm.resFc, ef: efm, ep: epm, h: hm, hp: hpm, pend: fm.pend || null, ajuste: fm.ajuste || null,
        adm: (rh.adm || [])[im] || 0, dem: (rh.dem || [])[im] || 0, resc: Math.abs((fo.rescTot || [])[im] || 0) };
      if (efm > 0 && epm > 0) { M.v = efm / epm; M.fatEsp = fm.fatFc * M.v; M.cusEsp = cfm * M.v; M.vol = fm.resFc * (M.v - 1); M.dFat = fm.fat - M.fatEsp; M.dCus = M.cusEsp - crm; }
      if (hm != null && hpm) M.vh = hm / hpm;
    }
    return { ano: A, meses: rows, mov: mov, mes: M };
  }
  function pcs(v) { return v == null || !isFinite(v) ? "–" : (v >= 0 ? "+" : "") + fmt(v * 100, 2) + "%"; }
  function cusTxt(d) { return d == null ? "–" : (d < 0 ? "acima da proporção " + rs(-d) : "abaixo da proporção " + rs(d)); }
  function diagLinhas(D) {
    if (!D) return [];
    var A = D.ano, L = [], ult = MES[D.meses[D.meses.length - 1].m], mv = D.mov;
    L.push("DIAGNÓSTICO INTEGRADO EFETIVO x FATURAMENTO x CUSTO (calculado pelo app; use estes números e esta leitura; as parcelas somam exatamente a diferença de resultado):");
    if (A.n) {
      L.push("  ANO (jan a " + ult + ") contra o EXECUTIVO: efetivo médio real " + fmt(A.efMed, 0) + " pessoas x " + fmt(A.exMed, 0) + " no executivo (" + pcs(A.v - 1) + ").");
      L.push("  Faturamento real " + rs(A.FR) + " x executivo " + rs(A.FE) + "; com o efetivo real, o faturamento esperado seria " + rs(A.fatEspT) + " (faturamento por pessoa-mês real " + rs(A.fppR) + " x executivo " + rs(A.fppE) + ").");
      L.push("  Custo real " + rs(A.CR) + " x executivo " + rs(A.CE) + "; com o efetivo real, o custo esperado seria " + rs(A.cusEspT) + " (custo por pessoa-mês real " + rs(A.cppR) + " x executivo " + rs(A.cppE) + ").");
      L.push("  Resultado real " + rs(A.RR) + " x executivo " + rs(A.RE) + " (diferença " + rs(A.RR - A.RE) + ") = volume de pessoas " + rs(A.vol) + " + faturamento por pessoa " + rs(A.dFat) +
        " + custo por pessoa " + rs(A.dCus) + " (custo " + cusTxt(A.dCus) + ")" + (Math.abs(A.resto) >= 1 ? " + meses sem efetivo no executivo (" + A.semEx.map(function (m) { return MES[m]; }).join(", ") + ") " + rs(A.resto) : "") + ".");
      if (A.hppR != null) L.push("  HHT: real " + fmt(A.h, 0) + " h x executivo " + fmt(A.hx, 0) + " h; horas por pessoa-mês real " + fmt(A.hppR, 1) + " x executivo " + fmt(A.hppE, 1) + ".");
    } else L.push("  O executivo não tem efetivo cadastrado para esta OS: não dá para separar o efeito do volume de pessoas; compare faturamento e custo com o efetivo da folha mês a mês.");
    L.push("  MOVIMENTAÇÃO DO PERÍODO: admissões " + mv.adm + ", demissões " + mv.dem + ", transferências entrando " + mv.tin + " e saindo " + mv.tout + "; efetivo da folha " + (mv.m0 ? MES[mv.m0] + " " + fmt(mv.ef0) + " → " + MES[mv.m1] + " " + fmt(mv.ef1) : "–") +
      (mv.ex0 != null ? "; o executivo previa " + fmt(mv.ex0) + " → " + fmt(mv.ex1) + " (variação prevista " + (mv.ex1 - mv.ex0 >= 0 ? "+" : "") + fmt(mv.ex1 - mv.ex0) + " pessoas; realizada " + (mv.ef1 - mv.ef0 >= 0 ? "+" : "") + fmt(mv.ef1 - mv.ef0) + ")" : "; sem efetivo no executivo") +
      "; rescisões no período " + rs(mv.resc) + ".");
    L.push("  MÊS A MÊS (efetivo real x executivo | faturamento real x esperado pelo efetivo | custo real x esperado pelo efetivo | admissões/demissões | rescisões):");
    D.meses.forEach(function (r) {
      L.push("    " + MES[r.m] + ": " + fmt(r.ef) + " x " + (r.ex ? fmt(r.ex) : "–") + (r.v ? " (" + pcs(r.v - 1) + ")" : "") + " | " + rs(r.fat) + " x " + (r.fatEsp != null ? rs(r.fatEsp) + " (" + rs(r.dFat) + ")" : "–") +
        " | " + rs(r.cr) + " x " + (r.cusEsp != null ? rs(r.cusEsp) + " (" + cusTxt(r.dCus) + ")" : "–") + " | " + r.adm + "/" + r.dem + (r.resc ? " | rescisões " + rs(r.resc) : "") +
        (r.pend ? " | mês com grupos ainda sem lançamento" : "") + (r.ajuste ? " | receita em ajuste de emissão " + rs(r.ajuste) : ""));
    });
    var M = D.mes;
    if (M) {
      L.push("  MÊS DE " + MES[M.m].toUpperCase() + " contra o FCST ANTERIOR (efetivo e HHT contra o PR do mês): efetivo " + fmt(M.ef) + " x PR " + (M.ep ? fmt(M.ep) : "–") + (M.v ? " (" + pcs(M.v - 1) + ")" : "") +
        "; HHT " + fmt(M.h, 0) + " h x PR " + (M.hp ? fmt(M.hp, 0) + " h" : "–") + (M.vh ? " (" + pcs(M.vh - 1) + ")" : "") + "; admissões " + M.adm + ", demissões " + M.dem + (M.resc ? ", rescisões " + rs(M.resc) : "") + ".");
      L.push("    Faturamento " + rs(M.fat) + " x FCST " + rs(M.ff) + (M.fatEsp != null ? " (esperado pelo efetivo " + rs(M.fatEsp) + ")" : "") + "; custo " + rs(M.cr) + " x FCST " + rs(M.cf) + (M.cusEsp != null ? " (esperado pelo efetivo " + rs(M.cusEsp) + ")" : "") +
        "; resultado " + rs(M.res) + " x FCST " + rs(M.rf) + " (diferença " + rs(M.res - M.rf) + ")" + (M.vol != null ? " = volume de pessoas " + rs(M.vol) + " + faturamento por pessoa " + rs(M.dFat) + " + custo por pessoa " + rs(M.dCus) + " (custo " + cusTxt(M.dCus) + ")" : "") +
        (M.pend ? ". Há grupos de custo ainda sem lançamento no mês: compare com cautela" : "") + ".");
    } else L.push("  MÊS: sem FCST anterior para comparar.");
    return L;
  }
  var REGRA_DIAG = "DIAGNÓSTICO INTEGRADO (campo diagnostico): conte UMA história só, com o bloco DIAGNÓSTICO INTEGRADO. Comece pelo efetivo: quantas pessoas o executivo previa e quantas o contrato teve, e a movimentação (admissões, demissões e transferências) contra a variação prevista no executivo. Daí, o que o faturamento e o custo deveriam ser com esse efetivo e o que foram. Feche com a diferença de resultado contra o executivo dividida nas três parcelas: volume de pessoas, faturamento por pessoa e custo por pessoa, com os valores. Diga qual parcela explica a diferença e em quais meses ela apareceu (custo acima da proporção, faturamento por pessoa abaixo). Depois, o mês contra o FCST anterior com a mesma lógica (efetivo e HHT contra o PR do mês). Faturamento e custo NUNCA são analisados separados um do outro.";
  function chDiag(base, A, real, rotBase) {
    var p = [{ nome: rotBase, v: base / 1000, tipo: "base" }, { nome: "Volume de pessoas", v: A.vol / 1000, tipo: "passo" }, { nome: "Faturamento por pessoa", v: A.dFat / 1000, tipo: "passo" }, { nome: "Custo por pessoa", v: A.dCus / 1000, tipo: "passo" }];
    if (Math.abs(A.resto || 0) >= 1000) p.push({ nome: "Meses sem efetivo no executivo", v: A.resto / 1000, tipo: "passo" });
    p.push({ nome: "Resultado real", v: real / 1000, tipo: "base" });
    return cascata(p, { fBase: function (v) { return moeda(v * 1000); }, fPasso: function (v) { return moeda(v * 1000).replace("R$ ", ""); }, fEixo: function (v) { return fmt(v * 1000); }, h: 300, titulo: "Ponte do resultado pelo efetivo" });
  }
  function difCel(d, f) { return '<td class="' + (d != null && d < 0 ? "neg" : "") + '">' + (d == null ? "–" : (d > 0 ? "+" : "") + f(d)) + "</td>"; }
  function diagHTML(D, figura, mesN) {
    if (!D) return "";
    var A = D.ano, M = D.mes, h = "", fN = function (v) { return v == null ? "–" : fmt(v, 0); }, fH = function (v) { return v == null ? "–" : fmt(v, 1); };
    if (A.n) {
      var resEsp = A.RE + A.vol;
      var lin = function (nome, ex, esp, re, f) { return "<tr><td>" + nome + "</td><td>" + f(ex) + "</td><td>" + (esp == null ? "–" : f(esp)) + "</td><td>" + f(re) + "</td>" + difCel(esp == null || re == null ? null : re - esp, f) + "</tr>"; };
      var tab = '<div class="rl-tab"><table><thead><tr><th>Jan a ' + esc(mesN) + '</th><th>Executivo</th><th>Esperado com o efetivo real</th><th>Realizado</th><th>Realizado − esperado</th></tr></thead><tbody>' +
        "<tr><td>Efetivo médio (pessoas)</td><td>" + fN(A.exMed) + "</td><td>–</td><td>" + fN(A.efMed) + "</td>" + difCel(A.efMed - A.exMed, fN) + "</tr>" +
        lin("Faturamento", A.FE, A.fatEspT, A.FR, moeda) + lin("Faturamento por pessoa-mês", A.fppE, A.fppE, A.fppR, moeda) +
        lin("Custo", A.CE, A.cusEspT, A.CR, moeda) + lin("Custo por pessoa-mês", A.cppE, A.cppE, A.cppR, moeda) +
        lin("Resultado", A.RE, resEsp, A.RR, moeda) +
        "<tr><td>Margem</td><td>" + pct(A.FE ? A.RE / A.FE : null) + "</td><td>" + pct(A.fatEspT ? resEsp / A.fatEspT : null) + "</td><td>" + pct(A.FR ? A.RR / A.FR : null) + "</td><td>–</td></tr>" +
        (A.hppR != null ? "<tr><td>HHT (h)</td><td>" + fN(A.hx) + "</td><td>–</td><td>" + fN(A.h) + "</td>" + difCel(A.h - A.hx, fN) + "</tr>" + lin("Horas por pessoa-mês", A.hppE, A.hppE, A.hppR, fH) : "") +
        "</tbody></table><p class=\"rl-nota\">Esperado = executivo × (efetivo real ÷ efetivo do executivo), mês a mês. Custo acima do esperado = custou mais que a proporção do efetivo.</p></div>";
      h += '<div class="rl-duas">' + figura("Ano contra o executivo, com o efetivo real", "o que o faturamento e o custo deveriam ser com as pessoas que o contrato teve", tab) +
        figura("De onde vem a diferença de resultado contra o executivo", "jan a " + mesN + " · as parcelas somam a diferença", chDiag(A.RE, A, A.RR, "Resultado executivo")) + "</div>";
    } else h += '<p class="rl-nota rl-nota-caixa">O executivo não tem efetivo cadastrado para este contrato: a análise abaixo compara faturamento e custo com o efetivo da folha.</p>';
    var mv = D.mov;
    var tabM = '<div class="rl-tab"><table><thead><tr><th>Mês</th><th>Efetivo real</th><th>Executivo</th><th>Admissões</th><th>Demissões</th><th>Faturamento</th><th>Esperado</th><th>Custo</th><th>Esperado</th><th>Custo x esperado</th><th>Rescisões</th></tr></thead><tbody>' +
      D.meses.map(function (r) {
        return "<tr><td>" + MES[r.m] + "</td><td>" + fN(r.ef) + "</td><td>" + (r.ex ? fN(r.ex) : "–") + "</td><td>" + r.adm + "</td><td>" + r.dem + "</td><td>" + moeda(r.fat) + "</td><td>" + (r.fatEsp != null ? moeda(r.fatEsp) : "–") +
          "</td><td>" + moeda(r.cr) + "</td><td>" + (r.cusEsp != null ? moeda(r.cusEsp) : "–") + '</td><td class="rl-cx">' + (r.dCus != null ? cusTxt(r.dCus) : "–") + "</td><td>" + (r.resc ? moeda(r.resc) : "–") + "</td></tr>";
      }).join("") + "</tbody></table><p class=\"rl-nota\">Movimentação no período: " + mv.adm + " admissões, " + mv.dem + " demissões, " + mv.tin + " transferências entrando e " + mv.tout + " saindo" +
      (mv.ex0 != null ? ". O executivo previa " + fN(mv.ex0) + " → " + fN(mv.ex1) + " pessoas; a folha foi de " + fN(mv.ef0) + " para " + fN(mv.ef1) : "") + ".</p></div>";
    h += figura("Mês a mês: efetivo, faturamento e custo contra o esperado pelo efetivo", "esperado = executivo do mês na proporção do efetivo real", tabM);
    if (M) {
      var lm = function (nome, fc, esp, re, f) { return "<tr><td>" + nome + "</td><td>" + (fc == null ? "–" : f(fc)) + "</td><td>" + (esp == null ? "–" : f(esp)) + "</td><td>" + (re == null ? "–" : f(re)) + "</td>" + difCel(esp == null || re == null ? null : re - esp, f) + "</tr>"; };
      var tabX = '<div class="rl-tab"><table><thead><tr><th>' + esc(MESF[M.m]) + '</th><th>FCST anterior / PR</th><th>Esperado com o efetivo real</th><th>Realizado</th><th>Realizado − esperado</th></tr></thead><tbody>' +
        "<tr><td>Efetivo (pessoas)</td><td>" + fN(M.ep) + "</td><td>–</td><td>" + fN(M.ef) + "</td>" + difCel(M.ep ? M.ef - M.ep : null, fN) + "</tr>" +
        "<tr><td>HHT (h)</td><td>" + fN(M.hp) + "</td><td>–</td><td>" + fN(M.h) + "</td>" + difCel(M.hp ? M.h - M.hp : null, fN) + "</tr>" +
        lm("Faturamento", M.ff, M.fatEsp, M.fat, moeda) + lm("Custo", M.cf, M.cusEsp, M.cr, moeda) + lm("Resultado", M.rf, M.vol != null ? M.rf + M.vol : null, M.res, moeda) +
        "</tbody></table><p class=\"rl-nota\">Efetivo e HHT contra o PR do mês; faturamento, custo e resultado contra o FCST do mês anterior." + (M.pend ? " Há grupos de custo ainda sem lançamento no mês." : "") + "</p></div>";
      h += M.vol != null ? '<div class="rl-duas">' + figura("O mês contra o FCST anterior", "com o efetivo real", tabX) + figura("De onde vem a diferença do mês contra o FCST anterior", MESF[M.m] + " · as parcelas somam a diferença", chDiag(M.rf, { vol: M.vol, dFat: M.dFat, dCus: M.dCus, resto: 0 }, M.res, "Resultado no FCST")) + "</div>"
        : figura("O mês contra o FCST anterior", "", tabX);
    }
    return h;
  }
  // resumo do diagnostico para os grupos e a Diretoria (somas)
  function diagResumo(D) {
    if (!D) return null;
    var A = D.ano, M = D.mes || {};
    return { n: A.n, FR: A.FR, FE: A.FE, CR: A.CR, CE: A.CE, RR: A.RR, RE: A.RE, fatEsp: A.fatEspT, cusEsp: A.cusEspT, vol: A.vol, dFat: A.dFat, dCus: A.dCus, resto: A.resto, sEf: A.sEf, sEx: A.sEx, nm: A.n,
      efMed: A.efMed, exMed: A.exMed, adm: D.mov.adm, dem: D.mov.dem, resc: D.mov.resc, tin: D.mov.tin, tout: D.mov.tout, ef0: D.mov.ef0, ef1: D.mov.ef1, ex0: D.mov.ex0, ex1: D.mov.ex1,
      mes: D.mes ? { res: M.res, rf: M.rf, vol: M.vol == null ? null : M.vol, dFat: M.dFat == null ? null : M.dFat, dCus: M.dCus == null ? null : M.dCus, ef: M.ef, ep: M.ep, h: M.h, hp: M.hp, fat: M.fat, ff: M.ff, cr: M.cr, cf: M.cf } : null };
  }
  function somarDiag(lista) {
    var T = { FR: 0, FE: 0, CR: 0, CE: 0, RR: 0, RE: 0, fatEsp: 0, cusEsp: 0, vol: 0, dFat: 0, dCus: 0, resto: 0, adm: 0, dem: 0, resc: 0, tin: 0, tout: 0, ef0: 0, ef1: 0, ex0: 0, ex1: 0, efMed: 0, exMed: 0, n: 0, semEf: 0,
      mes: { res: 0, rf: 0, vol: 0, dFat: 0, dCus: 0, ef: 0, ep: 0, fat: 0, ff: 0, cr: 0, cf: 0, n: 0 } };
    lista.forEach(function (d) {
      if (!d) return;
      ["FR", "FE", "CR", "CE", "RR", "RE", "fatEsp", "cusEsp", "vol", "dFat", "dCus", "resto", "adm", "dem", "resc", "tin", "tout", "ef0", "ef1", "ex0", "ex1"].forEach(function (k) { T[k] += d[k] || 0; });
      if (d.n) { T.efMed += d.efMed || 0; T.exMed += d.exMed || 0; T.n++; } else T.semEf++;
      if (d.mes && d.mes.rf != null) { var x = d.mes; T.mes.n++; ["res", "rf", "fat", "ff", "cr", "cf", "ef", "ep"].forEach(function (k) { T.mes[k] += x[k] || 0; });
        if (x.vol != null) { T.mes.vol += x.vol; T.mes.dFat += x.dFat; T.mes.dCus += x.dCus; } else T.mes.resto = (T.mes.resto || 0) + (x.res - x.rf); }
    });
    return T;
  }
  function diagLinhaGrupo(nome, d) {
    if (!d) return nome + ": sem dados para o diagnóstico.";
    return nome + ": efetivo médio " + (d.n ? fmt(d.efMed, 0) + " x executivo " + fmt(d.exMed, 0) : "sem efetivo no executivo") + " | admissões " + d.adm + ", demissões " + d.dem + ", transferências entrando " + (d.tin || 0) + " e saindo " + (d.tout || 0) + " | efetivo da folha " + fmt(d.ef0) + " → " + fmt(d.ef1) + (d.ex0 || d.ex1 ? "; executivo previa " + fmt(d.ex0) + " → " + fmt(d.ex1) : "") + " | faturamento " + rs(d.FR) + " x esperado pelo efetivo " + rs(d.fatEsp) +
      " | custo " + rs(d.CR) + " x esperado " + rs(d.cusEsp) + " | resultado " + rs(d.RR) + " x executivo " + rs(d.RE) + " = volume " + rs(d.vol) + " + faturamento por pessoa " + rs(d.dFat) + " + custo por pessoa " + rs(d.dCus) +
      (Math.abs(d.resto || 0) >= 1 ? " + sem efetivo no executivo " + rs(d.resto) : "") + (d.mes && d.mes.rf != null ? " | mês: resultado " + rs(d.mes.res) + " x FCST " + rs(d.mes.rf) + (d.mes.vol != null ? " (volume " + rs(d.mes.vol) + ", faturamento por pessoa " + rs(d.mes.dFat) + ", custo por pessoa " + rs(d.mes.dCus) + ")" : "") + ", efetivo " + fmt(d.mes.ef) + " x PR " + fmt(d.mes.ep) : "");
  }
  function tabelaDiagGrupo(linhas, rotulo) {
    return '<div class="rl-tab"><table><thead><tr><th>' + rotulo + '</th><th>Efetivo médio x executivo</th><th>Adm./dem.</th><th>Resultado − executivo</th><th>Volume de pessoas</th><th>Faturamento por pessoa</th><th>Custo por pessoa</th><th>Mês x FCST anterior</th></tr></thead><tbody>' +
      linhas.map(function (x) {
        var d = x.d; if (!d) return "<tr><td>" + esc(x.nome) + '</td><td colspan="7">sem dados</td></tr>';
        return "<tr><td>" + esc(x.nome) + "</td><td>" + (d.n ? fmt(d.efMed, 0) + " x " + fmt(d.exMed, 0) : "sem executivo") + "</td><td>" + d.adm + "/" + d.dem + "</td>" + difCel(d.RR - d.RE, moeda) + difCel(d.vol, moeda) + difCel(d.dFat, moeda) + difCel(d.dCus, moeda) +
          (d.mes && d.mes.rf != null ? difCel(d.mes.res - d.mes.rf, moeda) : "<td>–</td>") + "</tr>";
      }).join("") + "</tbody></table><p class=\"rl-nota\">Volume = o que o efetivo a mais ou a menos traria na margem do executivo; faturamento e custo por pessoa = realizado contra o esperado com o efetivo real. As três parcelas somam a diferença contra o executivo (valor negativo = tirou resultado).</p></div>";
  }
  // quem justificou o mes (qualquer texto do responsavel em faturamento, resultado, assertividade, efetivo, HHT ou observacoes)
  var IDS_JUST_COER = [1, 2, 4, 9, 10, 23];
  function justificouMes(os, m) {
    return IDS_JUST_COER.some(function (id) { return !!limparAta(ata(os, id, m, "GESTOR")); });
  }
  // 17/11/2026 (usuario): a classificacao do plano e calculada aqui, nao pela IA (variava a cada geracao).
  // Episodio atual = meses seguidos sem atender ate o ultimo mes apurado (V nao interrompe). O plano comeca no
  // primeiro mes do episodio em que o responsavel escreveu algo no indicador. Regras:
  //   ultimo mes atendeu                         -> FUNCIONANDO
  //   nao atende e o responsavel nada escreveu   -> SEM PLANO
  //   plano comecou no ultimo mes                -> AGUARDANDO
  //   depois do plano, numero do indicador melhorou mais de 5% -> PARCIAL; piorou mais de 5% -> PIOROU; senao SEM EFEITO
  //   sem numero para comparar                   -> SEM EFEITO (seguiu sem atender depois da acao)
  // 17/11/2026 (usuario): OS desmobilizando ou encerrando -- absenteismo sobe e nao se cobra acao
  function emDesmobilizacao(est) { return /DESMOBILIZ|DEMOBILIZ|FINALIZ|ENCERR/i.test(String(est || "")); }
  // 17/11/2026 (usuario): so ha o que apurar (e tratativa a cobrar) no mes em que a OS teve faturamento, custo ou efetivo na folha.
  // Antes de comecar (ou depois de terminar) o mes fica sem atividade: nao e avaliado nem entra como sem tratativa.
  function mesComAtividade(S, m) {
    var i = m - 1, fat = S.rh.fat[i], res = S.rh.res[i], efet = S.rh.efet[i];
    var custo = (fat || 0) - (res || 0);
    return (fat != null && Math.abs(fat) >= 1) || (res != null && Math.abs(custo) >= 1000) || (efet != null && efet > 0);
  }
  // absenteismo do ano ponderado pelo efetivo do mes (a media simples deixava 1 pessoa com 90% pesar como o mes cheio)
  function absPonderado(S) {
    var sp = 0, se = 0; (S.rh.abs || []).forEach(function (a, i) { var e = S.rh.efet[i]; if (a != null && e > 0) { sp += a * e; se += e; } });
    return se ? sp / se : null;
  }
  var TOL_PLANO = 0.05;
  function metricaPlano(id, m, C) {
    var mh = C.contract && C.contract.monthHistory ? C.contract.monthHistory[m] : null, q = (C.S && C.S.qual) || {};
    function n(v) { return typeof v === "number" && !isNaN(v) ? v : null; }
    function r(a, b) { a = n(a); b = n(b); return a != null && b ? a / b : null; }
    var v = null, rot = "", cont = false, f = function (x) { return pct(x, 2); };
    if (id === 13) { var h = q.hex && q.hex[m]; v = h ? n(h.acima) : null; rot = "pessoas acima do limite de HE"; cont = true; f = function (x) { return fmt(x, 0); }; }
    else if (id === 7) { var t = q.pt && q.pt[m]; v = t && t.ideal ? t.perda / t.ideal : null; rot = "perda sobre a Receita Ideal"; }
    else if (mh) {
      if (id === 1) { var a1 = r(mh.fatAnoRealV, mh.fatAnoExecV); v = a1 == null ? null : Math.max(0, 1 - a1); rot = "faturamento do ano abaixo do executivo"; }
      else if (id === 2) { var e2 = n(mh.resAnoExecV), x2 = n(mh.resAnoRealV); v = e2 && x2 != null ? Math.max(0, (e2 - x2) / Math.abs(e2)) : null; rot = "resultado do ano abaixo do executivo"; }
      else if (id === 4) { v = n(mh.resDifMesPct) == null ? null : Math.abs(mh.resDifMesPct); rot = "desvio da margem contra o FCST anterior"; }
      else if (id === 6) { v = n(mh.perdaPctAcum); rot = "perda acumulada"; }
      else if (id === 8) { v = n(mh.indenizAcumV); rot = "indenização acumulada"; f = moeda; }
      else if (id === 9) { var a9 = r(mh.efetivoRealV, mh.efetivoExecV); v = a9 == null ? null : Math.abs(a9 - 1); rot = "desvio do efetivo"; }
      else if (id === 10) { var a10 = r(mh.hhtRealV, mh.hhtExecV); v = a10 == null ? null : Math.abs(a10 - 1); rot = "desvio do HHT"; }
      else if (id === 11) { v = n(mh.absenteismoPct); rot = "absenteísmo"; }
      else if (id === 12) { v = n(mh.turnoverPct); rot = "turnover"; }
      else if (id === 15) { v = n(mh.safCount); rot = "ocorrências SAF"; cont = true; f = function (x) { return fmt(x, 0); }; }
      else if (id === 16) { v = n(mh.cafCount); rot = "ocorrências CAF"; cont = true; f = function (x) { return fmt(x, 0); }; }
    }
    return v == null ? null : { v: v, rot: rot, cont: cont, f: f };
  }
  function classificarPlanos(os, mes, C) {
    var out = {}, estC = (C.contract && C.contract.estagio) || "", desmob = emDesmobilizacao(estC);
    (C.inds || []).forEach(function (x) {
      var s = x.strip || "";
      if (s.indexOf("N") < 0) return;
      var L = 0, i;
      for (i = s.length; i >= 1; i--) { var c = s.charAt(i - 1); if (c === "A" || c === "N") { L = i; break; } }
      if (!L) return;
      function gest(m) { return limparAta(ata(os, x.id, m, "GESTOR")) ? true : false; }
      var r = { id: x.id, nome: x.nome, ultimo: L };
      if (x.id === 11 && desmob) { r.efeito = "NÃO SE APLICA"; r.motivo = "OS em " + estC + ": o aumento de absenteísmo é próprio da desmobilização; não há tratativa nem ação a cobrar"; out[x.id] = r; return; }
      var vL = String((x.vals || [])[L - 1] || ""), div = /diverge do número/.test(vL) ? "; a marcação do Master diverge do número apurado (" + vL.replace(/^.*apurado:\s*/, "").replace(/\s*\(a marca.*$/, "").slice(0, 140) + ")" : "";
      if (s.charAt(L - 1) === "A") {
        var teve = false, k = L, ulN = 0;
        for (i = 1; i < L; i++) if (s.charAt(i - 1) === "N") { ulN = i; if (gest(i)) teve = true; }
        for (i = ulN + 1; i <= L; i++) if (s.charAt(i - 1) === "A") { k = i; break; }
        r.efeito = "FUNCIONANDO"; r.motivo = "não atendeu pela última vez em " + MES[ulN] + " e atende desde " + MES[k] + (k === L ? " (só o último mês)" : "") +
          (teve ? "; havia ação informada" : "; sem ação informada pelo responsável") + div;
        r.diverge = !!div;
        out[x.id] = r; return;
      }
      var ini = L;
      for (i = L - 1; i >= 1; i--) { var c2 = s.charAt(i - 1); if (c2 === "N" || c2 === "V") ini = i; else break; }
      while (ini < L && s.charAt(ini - 1) !== "N") ini++;
      // reincidencia: se ja nao atendeu antes deste episodio, a acao conta desde a primeira vez (ela nao segurou o indicador)
      var pri = 0; for (i = 1; i <= L; i++) if (s.charAt(i - 1) === "N") { pri = i; break; }
      var d = 0; for (i = pri; i <= L; i++) if (s.charAt(i - 1) === "N" && gest(i)) { d = i; break; }
      r.desde = d ? MES[d] : ""; r.inicio = MES[ini];
      var base = (pri < ini ? "voltou a não atender em " + MES[ini] + " (já não tinha atendido desde " + MES[pri] + ")" : "não atende desde " + MES[ini]) + div;
      if (!d) { r.efeito = "SEM PLANO"; r.motivo = base + " e o responsável não informou ação"; out[x.id] = r; return; }
      if (d === L) { r.efeito = "AGUARDANDO"; r.motivo = base + "; a ação foi informada em " + MES[d] + ", o último mês apurado, e ainda não há mês seguinte para medir"; out[x.id] = r; return; }
      var a = metricaPlano(x.id, d, C), b = metricaPlano(x.id, L, C);
      if (!a || !b) { r.efeito = "SEM EFEITO"; r.motivo = base + "; ação desde " + MES[d] + " e seguiu sem atender até " + MES[L]; out[x.id] = r; return; }
      var melhor = a.cont ? b.v < a.v : b.v < a.v * (1 - TOL_PLANO), pior = a.cont ? b.v > a.v : b.v > a.v * (1 + TOL_PLANO);
      if (!a.cont && a.v === 0) { melhor = false; pior = b.v > 0; }
      r.efeito = melhor ? "PARCIAL" : pior ? "PIOROU" : "SEM EFEITO";
      r.motivo = base + "; ação desde " + MES[d] + "; " + a.rot + " " + a.f(a.v) + " em " + MES[d] + " → " + b.f(b.v) + " em " + MES[L] +
        (melhor ? " (melhorou, mas ainda não atende)" : pior ? " (piorou)" : " (não mudou o cenário)");
      out[x.id] = r;
    });
    return out;
  }
  // aplica a classificacao calculada sobre o que a IA devolveu (a IA escreve a evidencia e a recomendacao)
  function aplicarClassePlanos(j, CL) {
    if (!j || !Array.isArray(j.planos)) return;
    j.planos.forEach(function (pl) {
      var id = parseInt(String(pl.indicador || "").replace(/[^0-9]/g, ""), 10), c = CL[id];
      if (!c) return;
      pl.efeito = c.efeito; if (c.desde) pl.desde = c.desde; if (c.diverge) pl.diverge = true;
    });
  }
  // recomendacao que manda trocar plano que nao e para trocar (ou manter um que e para trocar)
  function recomendacoesIndevidas(j) {
    var trocar = { "SEM EFEITO": 1, "PIOROU": 1, "SEM PLANO": 1 }, ruins = [];
    (Array.isArray(j.planos) ? j.planos : []).forEach(function (pl) {
      var rec = semAcento(pl.recomendacao), ef = String(pl.efeito || "").toUpperCase();
      if (pl.diverge) return;   // marcacao do Master diverge do numero: a recomendacao pode pedir revisao
      if (ef === "NÃO SE APLICA") { if (/troc|cri|ajust/.test(rec)) ruins.push(pl.indicador + " (OS em desmobilização: não cobrar ação)"); return; }
      if (!trocar[ef] && /troc/.test(rec)) ruins.push(pl.indicador + " (" + ef + ": a recomendação manda trocar)");
      else if ((ef === "SEM EFEITO" || ef === "PIOROU") && /^\s*manter/.test(rec)) ruins.push(pl.indicador + " (" + ef + ": a recomendação manda manter)");
    });
    return ruins;
  }
  function promptOS(os, ano, mes, C) {
    var S = C.S, k = C.kpi, fi = S.fin, an = analisarCustos(fi), L = [];
    function pf(v) { return fi && fi.FR ? fmt(v / fi.FR * 100, 2) + "%" : "–"; }
    L.push("Você é o controller sênior do Setor de Performance da NPE. Escreva o RELATÓRIO GERENCIAL da OS " + os + " (" + (C.H.desc || "") + ") de janeiro a " + MESF[mes] + "/" + ano + ".");
    L.push("É um relatório executivo em forma de narrativa: cada capítulo conta uma parte da mesma história e liga causa e efeito entre faturamento, custos, pessoas e contrato. Não é uma lista de indicadores.");
    L.push("ROTEIRO, de cima para baixo, cada assunto em UM lugar só. Não existe sumário que adianta o que vem depois, e nada é recontado mais abaixo: (1) situacao = onde o contrato está: só o retrato geral (faturamento, resultado e margem do ano e do mês contra executivo e FCST, o total que os FCSTs prometeram x o entregue e a projeção do ano), sem causas; (2) positivos = o que está dando certo, com o número, e o que manter; (3) pontos de atenção por tema, nesta ordem: receita, custos, pessoas e ssma; cada problema aparece uma única vez, com o número, a causa, se é gestão ou premissa de orçamento e se o responsável justificou; (4) planos = a decisão por indicador: MANTER, AJUSTAR, TROCAR ou CRIAR o plano; (5) plano = o foco do próximo mês; (6) parecerOrcamento e orcamento = o que levar para o preço. CADA VALOR EM R$ APARECE EM UMA SEÇÃO SÓ: nas seções seguintes, cite o assunto pelo nome (ex.: a perda de receita, o excesso de HE, as rescisões de agosto) sem repetir o número. O mesmo vale para o ASSUNTO: o que está nos positivos não volta nos pontos de atenção, e uma ausência (ex.: não há perdas registradas) é dita uma vez só. Cada tema fala só dele: receita = perdas, SLA, não faturáveis e faturamento; margem e custos ficam em custos.");
    L.push("VOCÊ ESCREVE COMO O SETOR DE PERFORMANCE. Este relatório é a continuação dos pareceres que o Setor de Performance já escreveu mês a mês: parta do RESUMO DO MÊS (#24) de cada mês para saber o que mais afetou o resultado, mantenha coerência com os PARECERES POR INDICADOR, atualize tudo com a APURAÇÃO REAL e diga quando um ponto já apontado melhorou, piorou ou continua igual. Se um parecer antigo concluiu diferente da apuração, vale a apuração.");
    L.push("SEPARE AS DUAS VOZES. O que o RESPONSÁVEL (gestor do contrato) respondeu é a versão do contrato: cite como \"o responsável informou\" e confronte com os números; nunca trate como conclusão. O que o SETOR DE PERFORMANCE apontou é a avaliação técnica, e é nela que este relatório se apoia e avança.");
    L.push("");
    L.push("COMO ANALISAR");
    L.push("1. Proporcionalidade. O faturamento real ficou " + (an ? fmt((an.ratio - 1) * 100, 2) + "% " + (an.ratio >= 1 ? "acima" : "abaixo") : "–") + " do executivo. Se o volume cresce, o custo deve crescer na mesma proporção; a margem só cai se algum custo cresceu mais que o volume. Use a PONTE DA MARGEM (pontos que cada grupo tirou ou devolveu) e as CONTAS para dizer exatamente o que descolou e por quê.");
    L.push("2. Receita e custo sem faturamento em três efeitos, sempre em R$ e em % do faturamento: PERDAS (faturamento que não entrou por recurso indisponível, por motivo), SLA (desconto contratual direto no faturamento, por item e parâmetro) e NÃO FATURÁVEIS (custo de recursos que não geram faturamento, por função) Feche com o RESULTADO POTENCIAL: real + perdas (como faturamento) + SLA (desconto direto) + não faturáveis (custo de recurso que não fatura). Os DILUÍDOS são apenas informativos: cite se relevante, mas nunca some em conta nenhuma. A comparação Receita Ideal x PR é só conferência: cite em no máximo uma frase, sem destaque.");
    L.push("3. FCST mês a mês. Use a linha do tempo para explicar o ANO: o que os FCSTs do mês anterior prometeram de resultado, o que foi entregue e quais grupos explicam a diferença. Não descreva mês a mês; cite no máximo os 2 ou 3 meses decisivos.");
    L.push("4. Movimentação de efetivo. Admissão traz custo imediato (exames, EPIs, consumíveis) e o faturamento do recurso novo normalmente só aparece no mês seguinte (HHT e faturamento sobem). Se o HHT ou o faturamento não subiram depois das admissões, aponte. Demissão traz custo rescisório.");
    L.push("5. Encargos. Seguem o salário. Separe o que é automático do que foi provocado por demissão: rescisões, aviso prévio indenizado, multa de 40% do FGTS e FGTS de rescisão (tabela FOLHA e EVENTOS). Esses itens não são proporcionais ao salário.");
    L.push("6. Acúmulo de férias, sempre em PESSOAS: quantas pessoas o contrato tem, quantas já têm 30 dias ou mais de saldo (direito a sair) e quantas passam de 45 dias (ponto de atenção), com o % das pessoas no contrato. Nunca cite o saldo total de dias de férias. O acúmulo é o que amplia o custo do dissídio (o saldo de férias e 13º é recalculado retroativamente com o salário novo, no primeiro mês do dissídio) e da reoneração (retroativo dos encargos sobre as férias acumuladas). Use os sinais dos DADOS (verbas de dissídio no contábil, pico das provisões sobre o salário); quando for inferência, escreva 'provável'.");
    L.push("7. Dissídio e reoneração da folha (janeiro/" + (ano + 1) + ") são premissas básicas do orçamento: NÃO os trate como premissa a rever nem como item para o Orçamento. O que o orçamento não consegue prever é o tamanho do ACÚMULO DE FÉRIAS, que multiplica esses dois efeitos; é isso que deve ser apontado, com as pessoas com 30 e com 45 dias ou mais. Não estime valor que não esteja nos DADOS.");
    L.push("8. Para o ORÇAMENTO, as observações que importam são: absenteísmo e turnover altos (realidade do contrato e da região), custos que ficam acima do executivo de forma padronizada, mês após mês (use RECORRÊNCIA), e acúmulo de férias (30 e 45 dias ou mais). Cada observação com o número que a sustenta.");
    L.push("10. Projeção dos próximos meses. Faça a análise futura com os números que o contrato projetou (EFETIVO PR, HHT PR, faturamento e resultado projetados). Se houver ALERTA DE PROJEÇÃO, diga com clareza que a projeção não acompanha a movimentação do último mês e peça a correção: quem admitiu tem que projetar mais efetivo e HHT (e o faturamento correspondente); quem desligou, menos.");
    L.push("11. Planos de ação informados. Para cada indicador que não atendeu em algum mês, leia mês a mês o que o RESPONSÁVEL respondeu e o que o SETOR DE PERFORMANCE apontou (blocos separados nos DADOS) e compare com a APURAÇÃO REAL dos meses seguintes. A classificação de cada plano JÁ VEM CALCULADA no bloco CLASSIFICAÇÃO DOS PLANOS: use exatamente a mesma (e o mesmo mês de início), não reclassifique; o seu trabalho é mostrar a evidência e recomendar de acordo com ela. As definições são: FUNCIONANDO (depois da ação o indicador melhorou ou voltou a atender), PARCIAL (melhorou, mas ainda não atende), SEM EFEITO (a mesma ação se repete há 2 meses ou mais e o cenário não muda: diga com todas as letras que o que está sendo feito não está mudando o cenário e que o plano precisa ser trocado), PIOROU, AGUARDANDO (a ação começou no último mês e ainda não há mês seguinte para medir o efeito) ou SEM PLANO (não atende e o gestor não informou nenhuma ação: cobre o plano; se há ação informada, nunca use SEM PLANO), ou NÃO SE APLICA (absenteísmo de OS em desmobilização ou finalizada: não cobre ação). Use o parecer do Setor de Performance como referência técnica; quando o gestor disser uma coisa e os números ou o parecer mostrarem outra, aponte. Vale para todos os indicadores, inclusive os de SSMA.");
    L.push("13. Indicadores que dependiam da marcação do Máster agora vêm apurados pelos números dos painéis: #13 Excesso de Hora Extra = pessoas acima do limite no mês (55 h rotina, 60 h parada; painel RH); #14 Acúmulo de Férias = qualquer pessoa com mais de 45 dias está fora (painel RH; só a posição de hoje); #7 Receita Ideal = perda acima de 4% da Receita Ideal não é aderente (painel Receita Ideal). Quando o Máster já marcou, vale a marcação; se o número apurado diverge dela, diga. Ao citar a série de um desses indicadores, cite TODOS os meses em que ficou fora (ex.: no #13, todo mês com pessoa acima do limite), sem pular nenhum. PBI/PBD: só o que o Máster apurou.");
    L.push("15. Coerência: os pontos de atenção, o foco do próximo mês e o orçamento seguem a classificação dos planos. Só diga trocar o plano quando ele estiver SEM EFEITO, PIOROU ou SEM PLANO; PARCIAL é ajustar; FUNCIONANDO e AGUARDANDO é manter. Nunca recomende trocar um plano que está PARCIAL.");
    L.push("16. Normalidade e justificativa: tudo o que fugir da normalidade (indicador fora, variação de faturamento, custo ou resultado de um mês para o outro, número fora da proporção) precisa de justificativa do responsável. Para cada desvio diga se ele justificou; se não justificou, aponte a falta de justificativa com todas as letras; se justificou, diga se a justificativa é coerente com os números e, se não for, aponte e diga o que falta responder. Vale para todos os indicadores e valores.");
    L.push("17. Faturamento e resultado se explicam pelo efetivo, não só pelo executivo (o executivo não é corrigido de um mês para o outro). Use o bloco COERÊNCIA FATURAMENTO x EFETIVO x CUSTO: o faturamento deve variar na mesma proporção do efetivo (faturamento por pessoa estável) e o custo deve cair quando o efetivo cai. No mês da redução de efetivo é esperado aumento de custo pelas demissões (rescisões, multa de 40%): aponte esse custo e o valor. Nos demais meses, custo fora da proporção do efetivo não é aceitável: aponte e cobre a justificativa. Isso vale nos dois sentidos: custo ACIMA da proporção e também custo ABAIXO da proporção (subiu menos ou caiu mais que o efetivo). Custo abaixo não é ganho: indica custo de pessoal ainda não lançado, lançado em outro mês ou estornado, e o mês seguinte tende a pagar a conta. Cite cada mês com custo abaixo, o percentual do custo e do efetivo, e cobre a explicação do responsável. Ao explicar variação de faturamento ou de resultado no mês ou no ano, diga se houve movimentação de efetivo e se a variação ficou na proporção dela.");
    L.push("18. " + REGRA_DIAG);
    L.push("14. Perda de receita: sempre leve o valor da perda para as contas (é faturamento que não entrou e reduz o resultado) e diga se ela está melhorando ou piorando ao longo dos meses, com os números mês a mês.");
    L.push("12. SSMA (SAF, CAF, PBI/PBD): um acidente pode parar um dia inteiro de serviço, e esse dia deixa de ser medido. Quando houver acidente ou ocorrência, procure a perda de receita do mesmo mês e diga se o evento ajuda a explicar a perda; se os DADOS não permitirem ligar os dois, diga que não há registro. Avalie se as ações de segurança informadas evitaram nova ocorrência.");
    L.push("9. Gestão ou orçamento. Para cada causa, decida: é GESTÃO (o contrato controla: hora extra, absenteísmo, demissões evitáveis, perdas por falta de mão de obra, SLA, recursos sem faturar) ou é PREMISSA DE ORÇAMENTO (o preço não previu: custo estrutural não orçado ou que fica acima do executivo todo mês, absenteísmo e turnover da região). Seja assertivo. Diga isso no próprio ponto de atenção. Se o problema é de gestão, o parecer ao Orçamento diz isso com todas as letras.");
    L.push("");
    L.push("REGRAS");
    L.push("- Use SOMENTE os números dos DADOS, escritos exatamente como neles: R$ 1.500.000 (sem centavos a partir de R$ 1.000), R$ 850,00 (com centavos abaixo de R$ 1.000), valores negativos entre parênteses, R$ (647.973), e percentuais sempre com duas casas, 10,00% e 1,00%. Nunca abrevie (nada de 'mi', 'mil' ou 'milhões'). Não invente valor, data, causa, nome ou evento; sem registro, diga que não há registro. Todo valor em R$ que você escrever tem que estar nos DADOS ou ser a soma ou a diferença de valores que você cita no mesmo trecho, com as parcelas escritas (ex.: transporte R$ 121.126 e passagens R$ 75.485, total R$ 196.611). Nunca escreva um total sem as parcelas nem um número que não venha dos DADOS.");
    L.push("- Português do Brasil, tom executivo, frases curtas, sem listas dentro dos textos. Parágrafos separados por uma linha em branco. **Negrito** só para 1 ou 2 números-chave por texto.");
    L.push("- Não compare com orçado, PR ou meta um número que não tenha essa comparação nos DADOS.");
    L.push("- Pessoas (gestor, gerente, superintendente) são citadas só pelo nome como está nos DADOS; nunca presuma gênero (não use ele/ela, dele/dela, o gestor/a gestora).");
    L.push("- Custos são sempre escritos positivos (Hospedagem R$ 308.361; custou R$ 582.396 a mais que a proporção). Parênteses só para resultado ou margem negativos.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push('{"situacao":"(2 parágrafos, até 900 caracteres: onde o contrato está, só o retrato geral; sem causas)","positivos":[{"titulo":"(até 45 caracteres)","texto":"(até 260 caracteres: o que está dando certo, com o número, e o que manter)"}] (2 a 5 itens; se nada vai bem, 1 item dizendo isso),"cobrar":"(até 300 caracteres: o que cobrar do responsável, em 2 ou 3 ações curtas separadas por ponto e vírgula, tiradas do RESUMO PARA A RPCO e dos ALERTAS DA PROJEÇÃO: corrigir a projeção, plano para as principais causas e os meses sem justificativa; sem repetir os valores do resumo)","diagnostico":"(3 ou 4 parágrafos, até 2400 caracteres: a história única de efetivo, faturamento e custo pelo bloco DIAGNÓSTICO INTEGRADO; ano contra o executivo com as três parcelas e a movimentação contra o executivo; depois o mês contra o FCST anterior; gestão ou orçamento)","receita":"(até 1000 caracteres: SÓ perdas por motivo e a evolução mês a mês, SLA, não faturáveis, % do faturamento e resultado potencial; diluídos só como informação; não repita o diagnóstico)","custos":"(2 parágrafos, até 1500 caracteres: as CONTAS que explicam o custo por pessoa do diagnóstico (ponte da margem, contas, rescisões e encargos rescisórios, multa de 40%), os meses fora da proporção, acima E abaixo do efetivo, e se o responsável justificou cada um; não reconte o diagnóstico)","pessoas":"(2 ou 3 parágrafos, até 1500 caracteres: efetivo e movimentação, HHT, HE, absenteísmo, turnover, acúmulo de férias em pessoas (30 e 45 dias ou mais) e o efeito dele no dissídio e na reoneração ' + (ano + 1) + ', e a coerência da projeção dos próximos meses)","ssma":"(até 700 caracteres: segurança, satisfação do cliente, boas práticas e renovação)","coerencia":[{"mes":"(jan, fev, ...)","avaliacao":"(COERENTE, INCOERENTE ou SEM JUSTIFICATIVA)","nota":"(até 140 caracteres: o que o responsável escreveu sobre o mês e por que explica ou não o número)"}] (um item para CADA mês listado em O QUE O RESPONSÁVEL ESCREVEU NOS MESES FORA DA PROPORÇÃO; texto genérico, repetido de outro mês ou que não fala do desvio daquele mês é SEM JUSTIFICATIVA ou INCOERENTE, nunca COERENTE; [] se não houver mês fora),"planos":[{"indicador":"(#número e nome)","acao":"(o que o gestor informou que está fazendo, resumido, até 160 caracteres; nenhuma ação informada, se for o caso)","desde":"(mês em que a ação atual aparece pela primeira vez)","efeito":"(FUNCIONANDO, PARCIAL, SEM EFEITO, PIOROU, AGUARDANDO, SEM PLANO ou NÃO SE APLICA)","texto":"(até 300 caracteres: a evidência mês a mês pelos números do indicador (percentuais, pessoas, ocorrências) e o parecer do Setor de Performance; valores em R$ já citados acima não se repetem)","recomendacao":"(até 220 caracteres: começa com MANTER, AJUSTAR, TROCAR ou CRIAR e diz o que fazer)"}] (todos os indicadores que não atenderam em algum mês do ano, do mais grave para o menos grave, até 10 itens; [] se todos atenderam o ano todo),"plano":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres: o efeito esperado, citando o problema pelo nome, sem repetir valores já citados)","acompanhar":"(até 90 caracteres)"}] (3 a 5 itens: o foco do próximo mês),"parecerOrcamento":"(até 450 caracteres: o veredito para a renovação: o que considerar no preço, ou corrigir a gestão antes; cite os assuntos pelo nome)","orcamento":[{"titulo":"(até 40 caracteres)","valor":"(até 30 caracteres: a recorrência ou o %, sem repetir valores em R$ já citados)","texto":"(até 300 caracteres)"}] (4 a 8 itens: absenteísmo, turnover, custos acima do executivo de forma recorrente, acúmulo de férias e o que mais os DADOS sustentarem; dissídio e reoneração não entram como item)}');
    L.push("");
    L.push("DADOS");
    var hOS = C.H.hist || {};
    L.push("Contrato (CTT): " + ((C.H.rotulo && C.H.rotulo.indexOf("|") > 0 && C.H.grupo) ? C.H.grupo + " (bloco: valores somados das OSs " + C.H.rotulo.split("|").join(" + ") + ")" : (C.H.desc || os)) + " | Negócio " + (C.H.neg || "–") +
      " | Gestor do contrato " + txtLinha(hOS.gestor, C.H.gestor) + " | Gerente " + txtLinha(hOS.ger, C.H.ger) + " | Superintendente " + txtLinha(hOS.sup, C.H.sup));
    if (trocasTxt(hOS).length) L.push("TROCA DE RESPONSÁVEIS NO ANO (cadastro com vigência): " + trocasTxt(hOS).join("; ") + ". Diga quem era o anterior, até quando ficou e desde quando o novo responde, e atribua cada período a quem respondia.");
    L.push("Período: janeiro a " + MESF[mes] + "/" + ano + ", analisado mês a mês. Todos os meses do período entram na análise e são avaliados pelos números do sistema, estejam fechados ou não; não comente fechamento nem validação.");
    var estOS = (C.contract && C.contract.estagio) || "";
    L.push("ESTÁGIO DA OS (CTT): " + (estOS || "não informado") + "." + (emDesmobilizacao(estOS) ? " OS EM DESMOBILIZAÇÃO OU FINALIZADA: o aumento de absenteísmo nesse período é próprio da desmobilização. Não cobre ação nem plano para o absenteísmo dessa OS: diga que a causa é a desmobilização e que não há tratativa nem ação a cobrar. Os demais indicadores seguem a análise normal." : ""));
    if (C.semAtiv && C.semAtiv.length) L.push("MESES SEM ATIVIDADE (sem faturamento, sem custo e sem efetivo na folha): " + C.semAtiv.map(function (m) { return MESF[m]; }).join(", ") + ". A OS " + (C.semAtiv[0] === 1 && C.p0 > 1 ? "começou a ter atividade em " + MESF[C.p0] : "não teve atividade nesses meses") + ". Nesses meses não há o que apurar nem tratativa a cobrar: não os cite como meses sem tratativa e não avalie indicador neles.");
    if (C.semTrat && C.semTrat.length) L.push("MESES SEM TRATATIVA (nenhum comentário do responsável e nenhum parecer do Setor de Performance em nenhum indicador): " + C.semTrat.map(function (m) { return MESF[m]; }).join(", ") + ". Nesses meses avalie todos os indicadores pelos números, do mesmo jeito que os outros; diga com todas as letras que no mês não houve tratativa (sem justificativa e sem plano de ação) e conte isso contra a avaliação do contrato.");
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
      if (S.assert) L.push("ASSERTIVIDADE (diferença de margem real x FCST anterior, em p.p.; meta: dentro de ±5,00; tolerância: até ±" + tolAssertTxt() + ". Mês entre 5,00 e " + tolAssertTxt() + " é assertivo PELA TOLERÂNCIA: diga que ficou fora da meta e dentro da tolerância): " + linhaSerie(S.assert.dmarg, function (v) { return fmt(v, 2); }) + " | % acumulada: " + linhaSerie(S.assert.acum, function (v) { return fmt(v, 2) + "%"; }));
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
    L.push("Faturamento do mês: " + linhaSerie(S.rh.fat, rs) + " | resultado do mês: " + linhaSerie(S.rh.res, rs));
    diagLinhas(diagEfetivo(S)).forEach(function (l) { L.push(l); });
    var coe = coerenciaEfetivo(S);
    if (coe.linhas.length) {
      L.push("COERÊNCIA FATURAMENTO x EFETIVO x CUSTO, MÊS CONTRA O MÊS ANTERIOR (calculado; custo = faturamento - resultado; tolerância de 5 p.p.; use estes números e esta leitura):");
      coe.linhas.forEach(function (l) { L.push("  " + l); });
      var just = [];
      coe.fora.forEach(function (m) {
        var g = [1, 2, 4, 9, 10].map(function (id) { var t = limparAta(ata(os, id, m, "GESTOR")); return t ? "#" + id + " " + t.slice(0, 260) : ""; }).filter(Boolean);
        var ob = limparAta(ata(os, 23, m, "GESTOR"));
        if (ob) g.push("#23 " + ob.slice(0, 260));
        just.push("  " + MES[m] + ": " + (g.length ? g.join(" || ") : "NENHUMA JUSTIFICATIVA DO RESPONSÁVEL neste mês para faturamento, resultado, efetivo ou HHT"));
      });
      if (just.length) { L.push("O QUE O RESPONSÁVEL ESCREVEU NOS MESES FORA DA PROPORÇÃO (faturamento, resultado, assertividade, efetivo, HHT e observações; compare com os números acima):"); just.forEach(function (l) { L.push(l); }); }
      else L.push("Nenhum mês fora da proporção do efetivo.");
    }
    if (S.rh.efetPR && S.rh.efetPR.some(function (v) { return v != null; })) L.push("EFETIVO PR (projetado) nos meses fechados: " + linhaSerie(S.rh.efetPR));
    if (S.proj && S.proj.meses && S.proj.meses.length) {
      L.push("PROJEÇÃO LANÇADA PELO CONTRATO PARA OS PRÓXIMOS MESES (EFETIVO PR, HHT PR, faturamento e resultado projetados): " + S.proj.meses.map(function (x) { return MES[x.m] + ": efetivo " + fmt(x.efet) + ", HHT " + fmt(x.hht) + " h, faturamento " + rs(x.fat) + ", resultado " + rs(x.res); }).join(" | ") + ".");
      if (S.proj.alerta) L.push("ALERTA DE PROJEÇÃO (calculado): " + S.proj.alerta.problemas.join("; ") + ". Chame a atenção do gestor para corrigir a projeção (efetivo, HHT e o faturamento que vem com eles); sem isso a comparação do próximo mês fica errada.");
      else if (S.proj.base) L.push("CONFERÊNCIA DA PROJEÇÃO (calculado): a projeção de " + MES[S.proj.base.prox] + " está coerente com a movimentação de " + MES[S.proj.base.mes] + " (" + S.proj.base.adm + " admissões, " + S.proj.base.dem + " demissões).");
    }
    if (S.regua) {
      S.regua.linhas.forEach(function (l) { L.push(l); });
      if (S.resumo) { L.push("RESUMO PARA A RPCO (calculado; é o bloco que vai para a página RPCO; você escreve só o campo cobrar):"); resumoLinhas(S.resumo).forEach(function (l) { L.push("  " + l); }); }
      L.push("COMO USAR A RÉGUA DE TENDÊNCIA (campo cobrar e diagnóstico): a referência é a margem prometida no executivo, não o faturamento nem o custo isolados; faturamento e custo variam com o efetivo e a margem deve se manter. Diga se a projeção é OTIMISTA, CONSERVADORA ou COERENTE com o que o contrato vem entregando, com os números da régua. Para cada ALERTA DA PROJEÇÃO, cobre a correção da projeção (efetivo PR, HHT PR, custo ou faturamento projetado) citando o evento ou a incoerência. Diga o destino do desvio: se a projeção recupera o que ficou para trás ou se ele passa para o ano seguinte. Confira com o comentário do responsável e o parecer de performance se o desvio e a projeção estão justificados; se não estiverem, diga que falta a justificativa. Eventos previsíveis (dissídio na data-base, reajuste do contrato com o cliente, reoneração, férias vencidas) têm que aparecer na projeção do mês em que acontecem; sem variação de efetivo, um pico de custo por pessoa costuma ser um desses eventos.");
    }
    L.push("ACÚMULO DE FÉRIAS (posição de hoje, em pessoas): " + feriasTxt(S.rh.ferTot, S.rh.fer30, S.rh.fer45) + ".");
    L.push("Perda PR acumulada " + rs(k.perdaAcum) + " (" + pct(k.perdaPct) + "). Absenteísmo acumulado " + pct(k.absAcum) + " (referência " + pct(k.absMeta) + "). Turnover acumulado " + pct(k.turnAcum) + ".");
    L.push("SATISFAÇÃO DO CLIENTE (todos os anos): " + (S.sat.length ? S.sat.map(function (s) { return s[0] + " " + pct(s[1], 1) + " (meta " + pct(s[2], 1) + ")"; }).join("; ") : "nenhuma pesquisa registrada") + ". Meta do ano: " + pct(S.satMeta, 1) + ".");
    L.push("");
    L.push("INDICADORES, APURAÇÃO REAL MÊS A MÊS (números do painel; A=atendeu, N=não atendeu, V=não avaliado, -=sem apuração). A situação e os valores daqui mandam: o parecer e o comentário do gestor explicam, mas não mudam o número. Quando o parecer concluiu diferente da apuração, isso vem indicado; use a apuração e, se for relevante, diga que o parecer precisa ser revisto:");
    C.inds.forEach(function (x) {
      var vs = x.vals || [];
      L.push("#" + x.id + " " + x.nome + " | " + x.strip.split("").map(function (ch, i) { return MES[i + 1] + ":" + ch + (vs[i] ? " (" + vs[i].slice(0, 110) + ")" : ""); }).join(" · ") +
        (x.diverge && x.diverge.length ? " | parecer divergente da apuração em: " + x.diverge.join(", ") : ""));
    });
    L.push("");
    // 16/11/2026 (usuario): as duas vozes separadas -- o que o responsavel respondeu e o que o Setor de
    // Performance apontou -- e o resumo do mes (#24) de todos os meses, que ja destaca o que mais afetou.
    // 17/11/2026: classificacao dos planos calculada no app (a IA so descreve a evidencia e recomenda)
    var CLP = classificarPlanos(os, mes, C), clk = Object.keys(CLP);
    if (clk.length) {
      L.push("CLASSIFICAÇÃO DOS PLANOS (calculada pelo app a partir da apuração real e dos comentários do responsável; use exatamente esta classificação e este \"desde\" no campo planos, não reclassifique):");
      clk.forEach(function (k) { var c = CLP[k]; L.push("  #" + c.id + " " + c.nome + ": " + c.efeito + (c.desde ? " (ação desde " + c.desde + ")" : "") + " -- " + c.motivo); });
      L.push("");
    }
    L.push("RESUMO DO MÊS DO SETOR DE PERFORMANCE (#24, a última caixa de cada mês: já destaca o que mais afetou o mês):");
    var tem24 = false;
    for (var m2 = 1; m2 <= mes; m2++) { var s24 = ata(os, 24, m2); if (s24) { tem24 = true; L.push("[" + MESF[m2] + "] " + s24.replace(/\s+/g, " ").slice(0, 900)); } }
    if (!tem24) L.push("nenhum resumo do mês registrado; apoie-se nos pareceres por indicador e na apuração.");
    var obs = ata(os, 23, mes); if (obs) L.push("#23 Observações gerais (" + MES[mes] + "): " + obs.replace(/\s+/g, " ").slice(0, 700));
    L.push("");
    L.push("O QUE O SETOR DE PERFORMANCE APONTOU, por indicador e mês (parecer técnico; a situação [letra] é a da apuração real):");
    var vozG = [];
    C.inds.forEach(function (x) {
      var temN = x.strip.indexOf("N") >= 0, lp = [], lg = [];
      for (var m3 = 1; m3 <= mes; m3++) {
        var p3 = limparAta(ata(os, x.id, m3), true), g3 = limparAta(ata(os, x.id, m3, "GESTOR")), st3 = "[" + (x.strip.charAt(m3 - 1) || "-") + "]";
        if (p3) lp.push("  " + MES[m3] + " " + st3 + " " + p3.slice(0, 260));
        if (g3) lg.push("  " + MES[m3] + " " + st3 + " " + g3.slice(0, 260));
      }
      if (lp.length) { L.push("#" + x.id + " " + x.nome + ":"); (temN ? lp : lp.slice(-2)).forEach(function (l) { L.push(l); }); }
      if (lg.length) { vozG.push("#" + x.id + " " + x.nome + ":"); (temN ? lg : lg.slice(-2)).forEach(function (l) { vozG.push(l); }); }
      else if (temN) vozG.push("#" + x.id + " " + x.nome + ": não atendeu em " + (x.strip.split("N").length - 1) + " mês(es) e o responsável não respondeu nada.");
    });
    L.push("");
    L.push("O QUE O RESPONSÁVEL RESPONDEU, por indicador e mês (comentário do gestor do contrato: ações e justificativas; é a versão do contrato, não conclusão):");
    if (vozG.length) vozG.forEach(function (l) { L.push(l); }); else L.push("nenhum comentário do responsável no período.");
    return L.join("\n");
  }

  // 16/11/2026 (usuario): nenhum valor montado pela IA. Todo R$ da resposta tem que estar no prompt (DADOS)
  // ou ser soma/diferenca de 2 ou 3 valores citados no mesmo trecho. Se nao for, a IA refaz (ate 2 vezes).
  function numsBR(t) { var out = [], re = /\d{1,3}(?:\.\d{3})+(?:,\d+)?|\d+(?:,\d+)?/g, m; while ((m = re.exec(t))) out.push(Math.abs(parseFloat(m[0].replace(/\./g, "").replace(",", ".")))); return out; }
  function valoresRS(t) { var out = [], re = /R\$\s*\(?\s*-?(\d{1,3}(?:\.\d{3})+|\d{4,})(?:,\d+)?\s*\)?/g, m; while ((m = re.exec(t))) out.push({ txt: m[0].trim(), v: parseFloat(m[1].replace(/\./g, "")) }); return out; }
  function valoresSemOrigem(j, fonte) {
    var base = {}; numsBR(fonte).forEach(function (n) { base[Math.round(n)] = 1; });
    function tem(v) { var r = Math.round(v); return base[r] || base[r - 1] || base[r + 1]; }
    var itens = [];
    (function andar(v, k) {
      if (typeof v === "string") itens.push([k, v]);
      else if (Array.isArray(v)) v.forEach(function (o) { if (o && typeof o === "object") itens.push([k, Object.keys(o).map(function (q) { return String(o[q] == null ? "" : o[q]); }).join(" | ")]); else andar(o, k); });
      else if (v && typeof v === "object") Object.keys(v).forEach(function (q) { andar(v[q], k ? k + "." + q : q); });
    })(j, "");
    var ruins = [];
    itens.forEach(function (it) {
      var vs = valoresRS(it[1]), ns = vs.map(function (x) { return x.v; });
      vs.forEach(function (x) {
        if (x.v < 1000 || tem(x.v)) return;
        var ok = false, a, b, c;
        for (a = 0; a < ns.length && !ok; a++) for (b = 0; b < ns.length && !ok; b++) {
          if (a === b) continue;
          if (Math.abs(ns[a] + ns[b] - x.v) <= 2 || Math.abs(ns[a] - ns[b] - x.v) <= 2) ok = true;
          for (c = 0; c < ns.length && !ok; c++) if (c !== a && c !== b && Math.abs(ns[a] + ns[b] + ns[c] - x.v) <= 3) ok = true;
        }
        var rot = x.txt + " (" + it[0] + ")";
        if (!ok && ruins.indexOf(rot) < 0) ruins.push(rot);
      });
    });
    return ruins;
  }
  async function gerarConferido(prompt, conferir) {
    var j = null, falta = ["tudo"], orig = [], tent = 0;
    while (tent < 3) {
      var p = prompt;
      if (tent > 0 && falta.length) p += "\n\nATENÇÃO: na resposta anterior faltaram ou vieram vazios: " + falta.join(", ") + ". Devolva o JSON COMPLETO.";
      else if (tent > 0 && orig.length) p += "\n\nATENÇÃO: estes valores da resposta anterior não estão nos DADOS nem são a soma ou a diferença dos valores citados no mesmo trecho: " + orig.join("; ") + ". Use somente valores dos DADOS; se precisar de um total, escreva as parcelas no mesmo trecho. Devolva o JSON COMPLETO.";
      var txt = await A.chamarGerarTexto("gpt41", p);
      try { j = extrairJSON(txt); falta = conferir(j); orig = falta.length ? [] : valoresSemOrigem(j, prompt); } catch (e) { falta = ["JSON válido"]; orig = []; }
      tent++;
      if (!falta.length && !orig.length) break;
      if (falta.length && tent >= 2) break;
    }
    if (orig.length) try { console.warn("[BOOK] valores sem origem nos DADOS:", orig); } catch (e) {}
    return { j: j, falta: falta, semOrigem: orig };
  }

  // 16/11/2026: o sumario/diagnostico/parecer nao pode mandar TROCAR plano que a propria IA classificou como
  // PARCIAL, AGUARDANDO ou FUNCIONANDO. Busca por palavras do indicador nas frases com "troc".
  var CHAVES_PLANO = { 2: ["resultado ano"], 4: ["assertividade"], 6: ["perda de receita", "perdas de receita"], 7: ["receita ideal"], 9: ["plano de efetivo"], 10: ["hht"],
    11: ["absenteismo"], 12: ["turnover", "rotatividade"], 13: ["hora extra", "horas extras"], 14: ["ferias"], 15: ["saf", "seguranca", "acidente"], 16: ["caf"],
    17: ["satisfacao"], 19: ["pbi", "pbd"], 20: ["boas praticas"] };
  function semAcento(t) { return String(t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function trocasIndevidas(j) {
    var ok = { "SEM EFEITO": 1, "PIOROU": 1, "SEM PLANO": 1 }, ruins = [];
    var frases = [j.sumario, j.diagnostico, j.parecerOrcamento, j.situacao, (j.plano || []).map(function (p) { return (p.acao || "") + ". " + (p.efeito || ""); }).join(". ")].map(semAcento).join(" ").split(/[.;:]/).filter(function (f) { return /troc/.test(f); });
    (Array.isArray(j.planos) ? j.planos : []).forEach(function (pl) {
      if (ok[String(pl.efeito || "").toUpperCase()] || pl.diverge) return;
      var id = parseInt(String(pl.indicador || "").replace(/[^0-9]/g, ""), 10), ch = CHAVES_PLANO[id];
      if (!ch) return;
      if (frases.some(function (f) { return ch.some(function (c) { return f.indexOf(c) >= 0; }); })) ruins.push(pl.indicador + " (" + pl.efeito + ")");
    });
    return ruins;
  }
  // 17/11/2026 (usuario): roteiro sem repeticao -- cada valor em R$ (a partir de 10 mil) aparece em UMA secao so.
  function valoresRepetidos(secoes) {
    var onde = {};
    Object.keys(secoes).forEach(function (nome) {
      var txt = secoes[nome]; if (txt == null) return;
      if (typeof txt !== "string") txt = JSON.stringify(txt);
      var vistos = {}, re = /R\$\s*\(?\s*(\d{1,3}(?:\.\d{3})+)/g, m;
      while ((m = re.exec(txt))) { var v = m[1]; if (parseInt(v.replace(/\./g, ""), 10) < 10000 || vistos[v]) continue; vistos[v] = 1; (onde[v] = onde[v] || []).push(nome); }
    });
    return Object.keys(onde).filter(function (v) { return onde[v].length > 1; }).map(function (v) { return "R$ " + v + " em " + onde[v].join(" e "); });
  }
  var MSG_REPETICAO = "repetição de valores entre seções (cada valor em R$ aparece numa seção só; nas outras, cite o assunto pelo nome, sem o número): ";
  function extrairJSON(txt) {
    var t = String(txt || "").replace(/```json|```/g, "");
    var a = t.indexOf("{"), b = t.lastIndexOf("}");
    if (a < 0 || b <= a) throw new Error("A IA não devolveu um JSON.");
    return JSON.parse(t.slice(a, b + 1));
  }
  function conferirOS(j, temN) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    if (temN && (!Array.isArray(j.planos) || !j.planos.length)) falta.push("planos");
    ["receita", "custos", "pessoas", "ssma", "parecerOrcamento"].forEach(function (k) { if (!j[k] || String(j[k]).length < 40) falta.push(k); });
    if (!j.diagnostico || String(j.diagnostico).length < 300) falta.push("diagnostico");
    if (!j.cobrar || String(j.cobrar).length < 60) falta.push("cobrar");
    if (!j.situacao || String(j.situacao).length < 200) falta.push("situacao");
    if (!Array.isArray(j.positivos) || !j.positivos.length) falta.push("positivos");
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
    var elOS = elegiveis().filter(function (o) { return o.codigo === os; })[0];
    var rotBloco = (elOS && elOS.rotulo) || H.rotulo || os;
    var dados = await lerDadosFluxo(rotBloco, ano, mes, tk, opts.urlFluxo);
    var ct = (dados.ctt || {})[os];
    var hist = historicoOS(dados, os, ano, mes);
    if (ct) { H = { rotulo: codigosBloco(rotBloco) || os, grupo: ct.grupo || "", desc: ct.desc || "", neg: ct.neg || "", ger: ct.gerente || "", sup: ct.sup || "", gestor: ct.gestor || "", ctt: true }; window.OS_HIER_CTT = window.OS_HIER_CTT || {}; window.OS_HIER_CTT[os] = H; }
    try { if (window.METAS_DB && !window.METAS_DB.carregado && typeof window.carregarMetasDoFluxo === 'function') await window.carregarMetasDoFluxo(); } catch (eM) { console.warn('eventos do cadastro', eM); }
    var C = coletarOS(os, ano, mes, dados);
    if (ct) { H.hist = hist; C.H = H; }
    var prompt = promptOS(os, ano, mes, C);
    progresso("A IA está escrevendo o book (" + Math.round(prompt.length / 1000) + " mil caracteres de dados)…");
    var temNx = C.inds.some(function (x) { return x.strip.indexOf("N") >= 0; });
    var coeOS = coerenciaEfetivo(C.S), nFora = coeOS.fora.length;
    var MESF = ["", "janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    var mesesAbaixo = coeOS.rows.filter(function (r) { return r.custoSt === "abaixo"; }).map(function (r) { return r.m; });
    var CLP = classificarPlanos(os, mes, C);
    var gc = await gerarConferido(prompt, function (jj) {
      aplicarClassePlanos(jj, CLP);
      var f = conferirOS(jj, temNx);
      var ri = recomendacoesIndevidas(jj);
      if (ri.length) f.push("planos: a recomendação não segue a classificação calculada em " + ri.join(", ") + " (trocar só SEM EFEITO, PIOROU ou SEM PLANO; PARCIAL = ajustar; FUNCIONANDO e AGUARDANDO = manter)");
      if (nFora && (!Array.isArray(jj.coerencia) || !jj.coerencia.length)) f.push("coerencia (um item por mês fora da proporção)");
      var cx = semAcento(jj.custos).split(/[.;]/), semAbx = mesesAbaixo.filter(function (m) { return !cx.some(function (fr) { var tk = fr.split(/[^a-z]+/); return (tk.indexOf(MES[m]) >= 0 || tk.indexOf(MESF[m]) >= 0) && /abaixo|menos que o efetivo|caiu mais/.test(fr); }); });
      if (semAbx.length) f.push("custos: aponte também o custo ABAIXO da proporção do efetivo em " + semAbx.map(function (m) { return MES[m]; }).join(", ") + " (custo não lançado, lançado em outro mês ou estorno) e se o responsável explicou");
      var rpt = valoresRepetidos({ situacao: jj.situacao, positivos: jj.positivos, diagnostico: jj.diagnostico, receita: jj.receita, custos: jj.custos, pessoas: jj.pessoas, ssma: jj.ssma,
        planos: (jj.planos || []).map(function (q) { return [q.acao, q.texto, q.recomendacao].join(" "); }).join(" "), foco: jj.plano, orcamento: [jj.parecerOrcamento, JSON.stringify(jj.orcamento || [])].join(" ") });
      if (rpt.length) f.push(MSG_REPETICAO + rpt.join("; "));
      var tr = trocasIndevidas(jj);
      if (tr.length) f.push("coerência do sumário com os planos: o texto manda trocar o plano de " + tr.join(", ") + ", mas trocar é só para SEM EFEITO, PIOROU ou SEM PLANO (PARCIAL = ajustar; FUNCIONANDO e AGUARDANDO = manter)");
      return f;
    }), j = gc.j, falta = gc.falta;
    aplicarClassePlanos(j, CLP);
    if (falta.length && falta.every(function (x) { return /^coerência do sumário|^custos: aponte também|^planos: a recomendação|^repetição de valores/.test(x); })) falta = [];   // nao derruba o book por isso; a regra ja foi cobrada na nova tentativa
    if (falta.length) throw new Error("A IA não completou o book (faltou: " + falta.join(", ") + ").");
    var s = A.sessaoAcesso ? A.sessaoAcesso() : null;
    if (!C.S.fin) throw new Error("O fluxo NPE-Ler-Dados-Book não devolveu o contábil da OS (consulta de custos).");
    var book = {
      v: 2, nivel: "os", os: os, rotulo: H.rotulo || os, desc: (H.rotulo && H.rotulo.indexOf("|") > 0 && H.grupo) ? H.grupo : (H.desc || C.contract.name || ""), descCtt: !!H.ctt, hist: hist, neg: H.neg || "", ger: H.ger || "", sup: H.sup || "", gestor: H.gestor || "",
      ano: ano, mes: mes, em: new Date().toISOString(), por: s ? s.login : "", p0: C.p0, mesesVal: C.mesesVal, semTrat: C.semTrat, semAtiv: C.semAtiv, estagio: (C.contract && C.contract.estagio) || "", pauta: montarPauta(dados.pautaRaw, dados.custos, mes),
      kpi: C.kpi, S: C.S, inds: C.inds, valoresSemOrigem: gc.semOrigem, coerJust: (function () { var o = {}; coerenciaEfetivo(C.S).rows.forEach(function (r) { if (r.ruim) o[r.m] = justificouMes(os, r.m); }); return o; })(),
      txt: { coerencia: Array.isArray(j.coerencia) ? j.coerencia.slice(0, 12) : [], situacao: j.situacao, positivos: j.positivos.slice(0, 5), cobrar: j.cobrar || "", diagnostico: j.diagnostico || "", receita: j.receita, custos: j.custos, pessoas: j.pessoas, ssma: j.ssma, planos: Array.isArray(j.planos) ? j.planos.slice(0, 10) : [],
        plano: j.plano.slice(0, 6), parecerOrcamento: j.parecerOrcamento, orcamento: j.orcamento.slice(0, 10), repetidos: valoresRepetidos({ situacao: j.situacao, positivos: j.positivos, receita: j.receita, custos: j.custos, pessoas: j.pessoas, ssma: j.ssma, foco: j.plano }) }
    };
    if (opts.gravar === false) return book;
    progresso("Gravando no SharePoint…");
    await gravar("os", os, book);
    return book;
  }

  // ------------------------------------------------------------------ gráficos (SVG em texto)
  function lbl(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" text-anchor="' + (o.a || "middle") + '" font-size="' + Math.round((o.s || 10.5) * 1.3 * 2) / 2 + '" font-weight="' + (o.w || 700) + '" fill="' + (o.c || COR.ink) + '"' +
      (o.halo === false ? "" : ' stroke="#fff" stroke-width="3.2" stroke-linejoin="round" paint-order="stroke"') + ">" + t + "</text>";
  }
  // 16/11/2026: rotulo de grafico de linha no lado em que a linha nao passa. Ponto mais alto que a media dos
  // vizinhos (pico) = acima; mais baixo (vale) = abaixo, desde que caiba antes do limite da faixa (yMax).
  function rotY(pts, i, yMax) {
    var p = pts[i][1], yl = i > 0 ? pts[i - 1][1] : p, yr = i < pts.length - 1 ? pts[i + 1][1] : p;
    var acima = p <= (yl + yr) / 2 + 0.5;
    if (!acima && yMax != null && p + 17 > yMax) acima = true;
    return acima ? p - 9 : p + 17;
  }
  function fr(W, H, m) { return { W: W, H: H, m: m, iw: W - m.l - m.r, ih: H - m.t - m.b }; }
  function grade(f, max, step, fv, y0, hh) { var s = ""; for (var v = 0; v <= max + 1e-9; v += step) { var y = y0 + hh - (v / max) * hh; s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y + '" y2="' + y + '" stroke="' + COR.line + '"/><text x="' + (f.m.l - 6) + '" y="' + (y + 3.5) + '" text-anchor="end" font-size="14" fill="' + COR.muted + '">' + fv(v) + "</text>"; } return s; }
  function eixoX(f, rot) { var bw = f.iw / rot.length; return rot.map(function (r, i) { return '<text x="' + (f.m.l + bw * i + bw / 2) + '" y="' + (f.H - 6) + '" text-anchor="middle" font-size="14.5" fill="' + COR.muted + '">' + r + "</text>"; }).join(""); }
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
      s += '<text x="' + (x + w / 2) + '" y="' + (f.H - 20) + '" text-anchor="middle" font-size="15.5" font-weight="700" fill="' + COR.ink + '">' + a[0] + '</text><text x="' + (x + w / 2) + '" y="' + (f.H - 7) + '" text-anchor="middle" font-size="13.5" fill="' + COR.muted + '">' + a[3] + " meses com perda</text>";
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
      ser.forEach(function (z) { var h = sc(Math.max(0, z[0])); y -= h; if (h <= 0) return; s += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + z[1] + '"/>'; if (z[0] >= max * 1000 * 0.05 && h >= 13) s += '<text x="' + (x + w / 2) + '" y="' + (y + h / 2 + 4) + '" text-anchor="middle" font-size="12.5" font-weight="600" fill="' + z[2] + '">' + moeda(z[0]) + "</text>"; });
      s += lbl(x + w / 2, y - 6, moeda(ri.perda[i]), { s: 11 });
    }
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Perda por motivo");
  }
  function chMov(meses, rh) {
    var f = fr(560, 330, { l: 30, r: 12, t: 22, b: 22 }), n = meses.length, bw = f.iw / n, ex = function (i) { return f.m.l + bw * i + bw / 2; };
    var ef = rh.efet.filter(function (v) { return v != null; }); var emn = ef.length ? Math.min.apply(null, ef) : 0, emx = ef.length ? Math.max.apply(null, ef) : 1;
    var pad = Math.max(5, (emx - emn) * 0.15); emn -= pad; emx += pad;
    var topH = f.ih * 0.36, y0 = f.m.t, ey = function (v) { return y0 + topH - (v - emn) / ((emx - emn) || 1) * topH; };
    var s = '<text x="' + f.m.l + '" y="' + (y0 - 8) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">EFETIVO (FOLHA)</text>';
    var pts = []; rh.efet.forEach(function (v, i) { if (v != null) pts.push([ex(i), ey(v), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.navy + '" stroke-width="2.2"/>';
    pts.forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.navy + '"/>' + lbl(p[0], rotY(pts, i, y0 + topH + 14), fmt(p[2]), { s: 11, c: COR.navy }); });
    var b0 = y0 + topH + 30, hh = f.ih - topH - 30, mid = b0 + hh * 0.6, up = hh * 0.6 - 14, dn = hh * 0.4 - 14;
    var mmax = Math.max(1, Math.max.apply(null, rh.adm.concat(rh.dem).map(function (v) { return v || 0; })));
    s += '<text x="' + f.m.l + '" y="' + (b0 - 8) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">MOVIMENTAÇÃO DO MÊS</text><line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + mid + '" y2="' + mid + '" stroke="' + COR.muted + '" stroke-width=".7"/>';
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
    var s = '<text x="' + f.m.l + '" y="' + (y0 - 8) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">% HORA EXTRA</text>';
    var pts = []; rh.he.forEach(function (v, i) { if (v != null) pts.push([ex(i), hy(v), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.orange + '" stroke-width="2.2"/>';
    pts.forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.orange + '"/>' + lbl(p[0], rotY(pts, i, y0 + topH + 14), fmt(p[2], 2) + "%", { s: 10.5, c: COR.warnfg }); });
    var b0 = y0 + topH + 30, bh = f.ih - topH - 30, base = b0 + bh;
    var max = niceMax(Math.max.apply(null, rh.hht.map(function (v) { return (v || 0) / 1000; })) * 1.05);
    s += '<text x="' + f.m.l + '" y="' + (b0 - 8) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">HHT REALIZADO (MIL H)</text>';
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
    var s = '<text x="' + f.m.l + '" y="' + (f.m.t - 10) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">% ASSERTIVIDADE ACUMULADA NO ANO</text>';
    var pts = []; preencherAssertAcum(a.dmarg, a.acum).forEach(function (v, i) { if (v != null) pts.push([ex(i), ay(Math.max(40, v)), v]); });
    if (pts.length) s += '<path d="' + pts.map(function (p, i) { return (i ? "L" : "M") + p[0] + " " + p[1]; }).join(" ") + '" fill="none" stroke="' + COR.navy + '" stroke-width="2.2"/>';
    pts.forEach(function (p, i) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="' + COR.navy + '"/>' + lbl(p[0], rotY(pts, i, f.m.t + topH + 12), fmt(p[2], p[2] % 1 ? 1 : 0) + "%", { s: 10.5, c: COR.navy }); });
    var vals = a.dmarg.filter(function (v) { return v != null; });
    var mn = Math.min(-10, Math.floor(Math.min.apply(null, vals.concat([0])) / 5) * 5 - 3), mx = Math.max(10, Math.ceil(Math.max.apply(null, vals.concat([0])) / 5) * 5 + 3);
    var b0 = f.m.t + topH + 52, bh = f.ih - topH - 52, y = function (v) { return b0 + (mx - v) / (mx - mn) * bh; }, z = y(0);
    s += '<text x="' + f.m.l + '" y="' + (b0 - 28) + '" font-size="14" font-weight="600" fill="' + COR.muted + '">DIFERENÇA DE MARGEM REAL x FCST (p.p.)</text>';
    s += '<text x="' + f.m.l + '" y="' + (b0 - 10) + '" font-size="13" fill="' + COR.muted + '"><tspan fill="' + COR.okfg + '" font-weight="700">verde</tspan> = meta (±5,00 p.p.) · <tspan fill="' + COR.warnfg + '" font-weight="700">laranja</tspan> = tolerância (até ±' + tolAssertTxt() + ' p.p.)</text>';
    var tA = tolAssert();
    if (tA > META_ASSERT_PP) s += '<rect x="' + f.m.l + '" y="' + y(tA) + '" width="' + f.iw + '" height="' + (y(-tA) - y(tA)) + '" fill="#FBE3BC"/>';
    s += '<rect x="' + f.m.l + '" y="' + y(META_ASSERT_PP) + '" width="' + f.iw + '" height="' + (y(-META_ASSERT_PP) - y(META_ASSERT_PP)) + '" fill="' + COR.okbg + '"/>';
    [mn, Math.round(mn / 2), 0, mx].forEach(function (v) { s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (v === 0 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="14" fill="' + COR.muted + '">' + fmt(v) + "</text>"; });
    a.dmarg.forEach(function (v, i) {
      if (v == null) { s += lbl(ex(i), z - 6, "sem FCST", { s: 9.5, w: 600, c: COR.muted }); return; }
      var fx = faixaAssert(v), top = Math.min(y(v), z), h = Math.abs(y(v) - z);
      s += '<rect x="' + (f.m.l + bw * i + bw * 0.25) + '" y="' + top + '" width="' + (bw * 0.5) + '" height="' + Math.max(h, 1.5) + '" fill="' + (fx === "meta" ? COR.teal : fx === "tol" ? COR.orange : COR.red) + '"/>';
      s += lbl(ex(i), v >= 0 ? y(v) - 5 : y(v) + 13, (v > 0 ? "+" : "") + fmt(v, 2) + (fx === "tol" ? " tol." : ""), { s: 10.5, c: fx === "meta" ? COR.okfg : fx === "tol" ? COR.warnfg : COR.badfg });
    });
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Assertividade mês a mês");
  }
  function chSat(sat, metaAtual, anoAtual) {
    var lista = sat.map(function (x) { return [x[0].slice(0, 4), x[1] * 100, x[2] * 100]; });
    if (metaAtual != null && !lista.some(function (x) { return x[0] === String(anoAtual); })) lista.push([String(anoAtual), null, metaAtual * 100]);
    var f = fr(420, 200, { l: 30, r: 8, t: 22, b: 22 }), n = lista.length, bw = f.iw / n, base = f.m.t + f.ih;
    var mn = 50, mx = 100, y = function (v) { return f.m.t + (mx - v) / (mx - mn) * f.ih; };
    var s = ""; [60, 70, 80, 90, 100].forEach(function (v) { s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + COR.line + '"/><text x="' + (f.m.l - 5) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="14" fill="' + COR.muted + '">' + v + "</text>"; });
    lista.forEach(function (z, i) {
      var x = f.m.l + bw * i + bw * 0.22, w = bw * 0.56;
      if (z[1] != null) s += '<rect x="' + x + '" y="' + y(z[1]) + '" width="' + w + '" height="' + (base - y(z[1])) + '" rx="2" fill="' + (z[1] >= z[2] ? COR.teal : COR.pr) + '"/>' + lbl(x + w / 2, (z[2] != null && y(z[2]) <= y(z[1]) + 3 && y(z[2]) >= y(z[1]) - 18 ? y(z[2]) : y(z[1])) - 5, fmt(z[1], 2) + "%", { s: 10.5, c: COR.navy });
      else s += '<text x="' + (x + w / 2) + '" y="' + (base - 6) + '" text-anchor="middle" font-size="13.5" fill="' + COR.muted + '">sem pesquisa</text>';
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
      [b.neg].filter(Boolean).map(function (c) { return '<span class="bk-chip">' + esc(c) + "</span>"; }).join("") + '</div><div class="bk-periodo">Período analisado: <b>jan a ' + MES[b.mes] + "/" + b.ano + "</b> (" + b.mes + " meses, todos avaliados pelos números) · Meses validados pelo Máster: <b>" + valid + " de " + b.mes + "</b>" +
      (b.semTrat && b.semTrat.length ? " · Sem tratativa (sem comentário nem parecer): <b>" + b.semTrat.map(function (m) { return MES[m]; }).join(", ") + "</b>" : "") + '.</div></div><dl class="bk-ficha"><dt>Gerente</dt><dd>' + esc(b.ger || "–") + "</dd><dt>Superintendente</dt><dd>" + esc(b.sup || "–") + "</dd><dt>Gerado em</dt><dd>" +
      esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + "</dd><dt>Por</dt><dd>" + esc(b.por || "–") + "</dd></dl></header>");
    var marg = k.margReal != null ? k.margReal : (k.fatAno ? k.resAno / k.fatAno : null), margMeta = k.margMeta != null ? k.margMeta : (k.fatMeta ? k.resMeta / k.fatMeta : null);
    function kpi(cls, l, v, s, sp) { return '<div class="bk-kpi ' + cls + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s + "</span>" + (sp || "") + "</div>"; }
    h.push('<section class="bk-card bk-sec"><h2>A história até ' + MESF[b.mes] + ' <span class="sub">resumo executivo</span></h2><p class="bk-lead">' + rico(t.resumo) + '</p><div class="bk-kpis">' +
      kpi(k.fatAno >= k.fatMeta ? "ok" : "bad", "Faturamento ano", mi(k.fatAno), "meta " + mi(k.fatMeta) + (k.fatMeta ? " · " + (k.fatAno >= k.fatMeta ? "+" : "") + fmt((k.fatAno / k.fatMeta - 1) * 100, 2) + "%" : "")) +
      kpi(k.resAno >= k.resMeta ? "ok" : "bad", "Resultado ano", mi(k.resAno), "margem " + pct(marg) + " · meta " + pct(margMeta)) +
      kpi("bad", "Perda de receita", mi(k.perdaAcum), pct(k.perdaPct) + " do faturamento", spark(S.rh.perdaPR)) +
      kpi(assertAcumDe(k, S) != null && assertAcumDe(k, S) >= 80 ? "ok" : "warn", "Assertividade acum.", assertAcumDe(k, S) == null ? "–" : fmt(assertAcumDe(k, S), 2) + "%", "diferença de margem real x FCST", S.assert ? spark(S.assert.acum) : "") +
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
    h.push('<div class="bk-ferias"><div><b>' + (S.rh.fer30 == null ? "–" : fmt(S.rh.fer30) + " de " + fmt(S.rh.ferTot) + " pessoas") + "</b><span>com 30 dias ou mais de saldo de férias (já têm direito), posição de hoje</span></div><div><b>" + (S.rh.fer45 == null ? "–" : fmt(S.rh.fer45) + " pessoas") + "</b><span>com 45 dias ou mais de saldo de férias</span></div><div><b>" + tin + " entradas · " + tout + " saídas</b><span>transferências entre OSs no ano</span></div></div></section>");
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
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Fontes: ATA_COMENTARIO (pareceres e sínteses), modelo RESULTADOS (folha, ponto, FCST, perdas, satisfação, cadastro, rescisões, transferências, férias) e RECEITA IDEAL. Os números dos indicadores são os das caixas do app; os textos foram escritos por IA a partir deles.</div>');
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
    for (var v = Math.ceil(mn / passo) * passo; v <= mx; v += passo) s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (Math.abs(v) < 1e-9 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="14" fill="' + COR.muted + '">' + (o.fEixo ? o.fEixo(v) : fmt(v, o.dEixo || 0)) + "</text>";
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
      linhas.slice(0, 3).forEach(function (ln, li) { s += '<text x="' + (x + w / 2) + '" y="' + (f.H - 48 + li * 13) + '" text-anchor="middle" font-size="14.5" font-weight="' + (c.tipo === "base" ? 700 : 500) + '" fill="' + COR.ink + '">' + esc(ln) + "</text>"; });
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
      if (d != null) s += '<text x="' + (x + w / 2) + '" y="' + (f.m.t - 10) + '" text-anchor="middle" font-size="14.5" fill="' + COR.muted + '">' + d + " dem.</text>";
    });
    return svg(f, s + eixoX(f, meses.map(function (m) { return MES[m]; })), "Custo de demissões");
  }

  // 16/11/2026: quadro curto de ferias e transferencias, para ficar ao lado do grafico de rescisoes
  function quadroFerias(rh) {
    var tot = rh.ferTot, f30 = rh.fer30, f45 = rh.fer45, pp = function (v) { return tot ? fmt(v / tot * 100, 2) + "% das pessoas" : ""; };
    var tin = (rh.tIn || []).reduce(function (a, v) { return a + (v || 0); }, 0), tout = (rh.tOut || []).reduce(function (a, v) { return a + (v || 0); }, 0);
    function c(l, v, s2, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s2 + "</span></div>"; }
    if (f30 == null && f45 == null) return '<p class="rl-nota">Sem registro de férias.</p>';
    return '<div class="rl-qfer">' + c("Pessoas no contrato", tot ? fmt(tot) : "–", "ativos e em férias") + c("30 dias ou mais", fmt(f30 || 0), pp(f30 || 0) + " · já podem sair", (f30 || 0) > 0 ? "bad" : "ok") +
      c("Mais de 45 dias", fmt(f45 || 0), pp(f45 || 0) + " · fora da regra (painel RH)", (f45 || 0) > 0 ? "bad" : "ok") + c("Transferências no ano", tin + " / " + tout, "entradas / saídas") + "</div>";
  }
  // 16/11/2026 (usuario): tabela mes a mes de faturamento e custo contra o efetivo e o HHT, com a leitura de
  // proporcao (5 p.p.) e se o responsavel justificou o mes fora. Sai dos numeros calculados, nao da IA.
  function tabelaCoerencia(S, b, figura) {
    if (!S || !S.rh || !S.rh.efet) return "";
    var co = coerenciaEfetivo(S);
    if (co.rows.length < 2) return "";
    var J = b.coerJust || null, VD = {};
    ((b.txt && b.txt.coerencia) || []).forEach(function (x) { var mm = MES.indexOf(String(x.mes || "").toLowerCase().slice(0, 3)); if (mm > 0) VD[mm] = { a: String(x.avaliacao || "").toUpperCase(), n: x.nota || "" }; });
    function pv(v) { return v == null ? "" : '<small class="rl-v">' + (v >= 0 ? "+" : "") + fmt(v * 100, 2) + "%</small>"; }
    function pill(cl, t) { return '<span class="bk-pill ' + cl + '">' + t + "</span>"; }
    var FAT = { ok: pill("ok", "coerente"), hht: pill("na", "segue o HHT"), acima: pill("bad", "acima"), abaixo: pill("bad", "abaixo") };
    var CUS = { ok: pill("ok", "coerente"), resc: pill("na", "rescisões do mês"), acima: pill("bad", "acima"), abaixo: pill("bad", "abaixo") };
    var linhas = co.rows.map(function (r) {
      var vd = VD[r.m], just;
      if (!r.ruim) just = "–";
      else if (vd) just = (/^COER/.test(vd.a) ? pill("ok", "coerente") : /^INCOER/.test(vd.a) ? pill("bad", "incoerente") : pill("bad", "sem justificativa")) + (vd.n ? '<small class="rl-vn">' + esc(vd.n) + "</small>" : "");
      else just = !J || J[r.m] == null ? "–" : (J[r.m] ? pill("na", "registrada") : pill("bad", "não há"));
      return "<tr><td>" + MES[r.m] + "</td><td>" + fmt(r.efet) + pv(r.dE) + "</td><td>" + (r.hht ? fmt(r.hht) : "–") + pv(r.dH) + "</td><td>" + moeda(r.fat) + pv(r.dF) + "</td><td>" + moeda(r.custo) + pv(r.dC) + "</td>" +
        "<td>" + moeda(r.fpp) + "</td><td>" + moeda(r.cpp) + "</td><td>" + moeda(r.fph) + "</td><td>" + moeda(r.cph) + "</td>" +
        "<td>" + (r.dem || 0) + "</td><td>" + (r.resc ? moeda(r.resc) : "–") + "</td><td>" + (r.fatSt ? FAT[r.fatSt] : "–") + "</td><td>" + (r.custoSt ? CUS[r.custoSt] : "–") + "</td><td>" + just + "</td></tr>";
    }).join("");
    var tab = '<div class="rl-tab rl-coer"><table><thead><tr><th>Mês</th><th>Efetivo</th><th>HHT (h)</th><th>Faturamento</th><th>Custo</th><th>Faturamento por pessoa</th><th>Custo por pessoa</th><th>Faturamento por hora</th><th>Custo por hora</th>' +
      "<th>Demissões</th><th>Rescisões</th><th>Faturamento x efetivo</th><th>Custo x efetivo</th><th>Justificativa do responsável</th></tr></thead><tbody>" + linhas + "</tbody></table>" +
      '<p class="rl-nota">Variação contra o mês anterior abaixo de cada valor. Custo = faturamento − resultado. Coerente = a variação do faturamento (ou do custo) ficou a até 5 p.p. da variação do efetivo. "Segue o HHT" = fora do efetivo, mas na proporção das horas (admissão ou demissão no meio do mês). "Rescisões do mês" = custo acima da proporção só pelas rescisões do mês das demissões, esperado mas apontado. Justificativa = avaliação do Setor de Performance sobre o que o responsável escreveu no mês (Faturamento, Resultado, Assertividade, Efetivo, HHT e Observações): coerente com o número, incoerente ou sem justificativa.</p></div>';
    return figura("Faturamento, custo e efetivo mês a mês", "a proporção entre o que o contrato faturou, o que custou e o quadro que teve", tab);
  }
  function renderRelatorioOSv1(b) {
    var S = b.S, k = b.kpi, t = b.txt || {}, c = S.fin || S.custos || {}, an = analisarCustos(c), h = [], fig = 0;
    function figura(titulo, cap, corpo, leg) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + (leg || "") + "</figure>"; }
    function par(txt) { return String(txt || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return '<p>' + rico(p.trim()) + "</p>"; }).join(""); }
    function pf(v) { return c.FR ? fmt(v / c.FR * 100, 2) + "%" : "–"; }
    var valid = (b.mesesVal || []).length, mesN = MESF[b.mes];
    // capa
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório gerencial do contrato</span><span class="rl-per">janeiro a ' + mesN + " de " + b.ano + "</span></div>" +
      '<h1>' + (b.descCtt ? esc(b.desc) : esc(b.rotulo.replace("|", " + ")) + " · " + esc(b.desc)) + "</h1>" +
      '<div class="rl-ficha"><span>' + esc(b.neg || "") + "</span><span>Gestor do contrato: <b>" + esc(txtLinha(b.hist && b.hist.gestor, b.gestor)) + "</b></span><span>Gerente: <b>" + esc(txtLinha(b.hist && b.hist.ger, b.ger)) + "</b></span><span>Superintendente: <b>" + esc(txtLinha(b.hist && b.hist.sup, b.sup)) + "</b></span></div>" +
      (b.semAtiv && b.semAtiv.length ? '<p class="rl-nota">Sem atividade (sem faturamento, custo nem efetivo na folha): <b>' + b.semAtiv.map(function (m) { return MES[m]; }).join(", ") + "</b>. Esses meses não são avaliados.</p>" : "") +
      (b.semTrat && b.semTrat.length ? '<p class="rl-nota">Meses sem tratativa (nenhum comentário do responsável nem parecer do Setor de Performance): <b>' + b.semTrat.map(function (m) { return MES[m]; }).join(", ") + "</b>. Foram avaliados pelos números do sistema; não há justificativa nem plano de ação para eles.</p>" : "") +
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
      var zerado = !perda && !rc.sla && !rc.nf && !rc.dil && !rc.perdaPR;
      if (zerado) r2 += '<p class="rl-nota rl-nota-caixa">Sem perdas de receita, descontos de SLA, recursos não faturáveis ou diluídos registrados de janeiro a ' + MES[b.mes] + " (Receita Ideal e PR).</p>";
      else r2 += '<div class="rl-duas">' + figura("Resultado potencial: o que o contrato entregaria sem perdas, SLA e não faturáveis", "jan a " + MES[b.mes] + " · margem real " + pct(margR) + " → potencial " + pct(pot / c.FR),
        chPotencial({ res: c.resReal, perda: perda, sla: rc.sla, nf: rc.nf })) + figura("Os efeitos sobre o resultado", "valor de janeiro a " + MES[b.mes] + " e peso sobre o faturamento",
        '<div class="rl-tab rl-tab-txt2"><table><thead><tr><th>Efeito</th><th>Natureza</th><th>Valor</th><th>% do faturamento</th></tr></thead><tbody>' +
        "<tr><td>Perdas de receita" + (rc.perdaRI != null ? " (Receita Ideal)" : " (PR)") + "</td><td>faturamento que não entrou por recurso indisponível</td><td>" + moeda(perda || 0) + "</td><td>" + pf(perda || 0) + "</td></tr>" +
        "<tr><td>Descontos de SLA</td><td>desconto contratual direto no faturamento</td><td>" + moeda(rc.sla || 0) + "</td><td>" + pf(rc.sla || 0) + "</td></tr>" +
        "<tr><td>Recursos não faturáveis</td><td>custo de quem não gera faturamento</td><td>" + moeda(rc.nf || 0) + "</td><td>" + pf(rc.nf || 0) + "</td></tr>" +
        (rc.dil != null ? "<tr><td>Recursos diluídos <i>(informativo)</i></td><td>custo de quem fica diluído nos serviços; não entra no resultado potencial</td><td>" + moeda(rc.dil || 0) + "</td><td>" + pf(rc.dil || 0) + "</td></tr>" : "") +
        "</tbody></table>" + (rc.perdaRI != null ? '<p class="rl-nota">Conferência: perda pela Receita Ideal ' + moeda(rc.perdaRI) + " · pela PR " + moeda(rc.perdaPR) + ".</p>" : "") + "</div>") + "</div>";
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
      var fPonte = figura("Ponte da margem: do orçado ao realizado", "pontos de margem que cada grupo de custo tirou (vermelho) ou devolveu (verde), jan a " + MES[b.mes] + pendTxt, chPonte(an));
      var fProm = pr && pr.meses && pr.meses.length ? figura("O que os FCSTs prometeram e o que foi entregue no ano", "soma, de " + MES[pr.meses[0]] + " a " + MES[pr.meses[pr.meses.length - 1]] + ", do resultado previsto no FCST do mês anterior x o realizado, por grupo", chPromessa(pr)) : "";
      h.push('<section class="rl-cap"><h2><span>3</span>Custos e margem: o custo acompanhou o faturamento?</h2>' +
        '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.custos) + "</div>" + figura("As contas que mais descolaram do faturamento", "", tab) + "</div>" +
        (fProm ? '<div class="rl-duas">' + fPonte + fProm + "</div>" : fPonte) + tabelaCoerencia(S, b, figura) + "</section>");
    }
    // 4. pessoas e eventos de folha
    var fo = c.folha;
    var pa = S.proj && S.proj.alerta;
    var projBox = pa ? '<div class="rl-alerta"><b>Atenção à projeção de ' + MES[pa.prox] + '</b>' + esc(pa.problemas.join("; ")) + '. Corrija o EFETIVO PR, o HHT PR e o faturamento projetado; sem isso a comparação do próximo mês fica errada.</div>' : "";
    h.push('<section class="rl-cap"><h2><span>4</span>Pessoas: quadro, horas e o que a folha custou</h2>' + projBox + par(t.pessoas) +
      '<div class="rl-duas">' + figura("Efetivo e movimentação", "efetivo da folha; admissões e demissões do mês", chMov(S.meses, S.rh)) + figura("Horas e hora extra", "% de HE e HHT realizado (mil h)", chHHT(S.meses, S.rh)) + "</div>" +
      (fo ? par(t.eventos) : "") + '<div class="rl-duas">' +
      (fo ? figura("Custo provocado por demissão", "por mês · azul = conta de rescisões (aviso indenizado, 13º e férias de rescisão) · laranja = encargos rescisórios (multa de 40% e FGTS de rescisão) · acima, as demissões do mês", chResc(S.meses, fo, S.rh)) : "") +
      figura("Acúmulo de férias e transferências", "posição de hoje, em pessoas (ativos e em férias)", quadroFerias(S.rh)) + "</div></section>");
    // 5. ssma, cliente e contrato
    var g5 = (S.sat && (S.sat.length || S.satMeta != null)) ? '<div class="rl-lado">' + figura("Satisfação do cliente por pesquisa", "barra = resultado · traço = meta do ano", chSat(S.sat, S.satMeta, b.ano)) + "</div>" : "";
    h.push('<section class="rl-cap"><h2><span>5</span>Segurança, cliente e contrato</h2><div class="rl-flex">' + g5 + '<div class="rl-txt">' + par(t.ssma) + "</div></div></section>");
    // 6. diagnostico
    function lista(xs) { return (xs || []).map(function (x) { return '<li><div class="rl-li-t"><b>' + esc(x.titulo || "") + '</b><span>' + esc(x.valor || "") + "</span></div>" + rico(x.texto || "") + "</li>"; }).join(""); }
    var EF = { "FUNCIONANDO": "ok", "PARCIAL": "na", "AGUARDANDO": "na", "SEM EFEITO": "bad", "PIOROU": "bad", "SEM PLANO": "bad", "NÃO SE APLICA": "na" };
    var pls = t.planos || [];
    h.push('<section class="rl-cap"><h2><span>6</span>Planos informados: estão mudando o cenário?</h2>' + (pls.length ?
      '<p class="rl-nota">O que o responsável informou nos comentários, confrontado pelo Setor de Performance com a apuração real dos meses seguintes.</p><div class="rl-tab rl-tab-txt"><table><colgroup><col style="width:13%"><col style="width:24%"><col style="width:10%"><col style="width:31%"><col style="width:22%"></colgroup><thead><tr><th>Indicador</th><th>O que o responsável informou</th><th>Efeito</th><th>Avaliação do Setor de Performance</th><th>O que fazer</th></tr></thead><tbody>' +
      pls.map(function (q) { var ef = String(q.efeito || "").toUpperCase().trim(); return "<tr><td>" + esc(q.indicador || "") + '</td><td class="rl-cx">' + esc(q.acao || "") + (q.desde ? "<br><i>desde " + esc(q.desde) + "</i>" : "") + '</td><td><span class="bk-pill ' + (EF[ef] || "na") + '">' + esc(ef || "–") + '</span></td><td class="rl-cx">' + rico(q.texto || "") + '</td><td class="rl-cx">' + rico(q.recomendacao || "") + "</td></tr>"; }).join("") + "</tbody></table></div>"
      : '<p class="rl-nota">Todos os indicadores atenderam no ano, ou este relatório foi gerado antes da análise dos planos.</p>') + "</section>");
    h.push('<section class="rl-cap"><h2><span>7</span>Diagnóstico: é gestão ou é orçamento?</h2>' + par(t.diagnostico) +
      '<div class="rl-diag"><div class="rl-diag-c ges"><h4>Gestão · o contrato controla</h4><ul>' + lista(t.gestao) + '</ul></div><div class="rl-diag-c orc"><h4>Orçamento · premissa a rever</h4><ul>' + lista(t.premissas) + "</ul></div></div></section>");
    // 7. plano
    h.push('<section class="rl-cap"><h2><span>8</span>Plano de ação</h2><ol class="rl-plano">' + (t.plano || []).map(function (p) {
      return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(p.efeito) + "</span>" : "") + (p.acompanhar ? '<em>Acompanhar: ' + esc(p.acompanhar) + "</em>" : "") + "</li>";
    }).join("") + "</ol></section>");
    // 8. orcamento
    h.push('<section class="rl-cap rl-orc"><h2><span>9</span>Parecer para o Orçamento · renovação</h2>' + (t.parecerOrcamento ? '<p class="rl-veredito">' + rico(t.parecerOrcamento) + "</p>" : "") +
      '<div class="bk-orcgrid">' + (t.orcamento || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.titulo || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(o.texto || "") + "</p></div>"; }).join("") + "</div></section>");
    // anexo
    h.push('<section class="rl-cap rl-anexo"><h2><span>A</span>Anexo · situação dos indicadores</h2><div class="rl-tab"><table><thead><tr><th>Indicador</th><th>Situação em ' + MES[b.mes] + '</th><th>Jan → ' + MES[b.mes] + '</th><th>Valores da caixa</th></tr></thead><tbody>' +
      b.inds.map(function (x) { return "<tr><td>#" + x.id + " " + esc(x.nome) + '</td><td><span class="bk-pill ' + x.st + '">' + esc(x.pill) + "</span></td><td>" + stripHtml(x.strip) + '</td><td class="rl-cx">' + esc(x.val || "") + "</td></tr>"; }).join("") + "</tbody></table></div></section>");
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Fontes: RESULTADOS (contábil real, executivo e FCST por conta; lançamentos da folha no contábil; folha, ponto, cadastro, rescisões, transferências, férias, perdas e satisfação), RECEITA IDEAL (perdas por motivo, não faturáveis, diluídos e SLA) e ATA_COMENTARIO. Números calculados a partir dessas fontes; textos escritos por IA. Gerado em ' +
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
    return Object.keys(g).sort().map(function (k) { return { nome: k, oss: g[k].slice().sort(porCodigoOS) }; });
  }
  // Dados de uma OS direto do painel (o mesmo fluxo do book da OS, sem IA)
  async function resumoOS(o, ano, mes, tk, urlFluxo) {
    var dados = await lerDadosFluxo(o.rotulo || o.codigo, ano, mes, tk, urlFluxo);
    var S = montarSeries(dados, mes);
    S.fin = montarFin(dados, mes, S);
    if (!S.fin) throw new Error("sem dados contábeis");
    if (dados.fer) { S.rh.fer30 = dados.fer.f30; S.rh.fer45 = dados.fer.f45; S.rh.ferSaldo = dados.fer.saldo; S.rh.ferTot = dados.fer.tot; }
    if (dados.ferRH && dados.ferRH.f45 != null) S.rh.fer45 = dados.ferRH.f45;   // 16/11: mais de 45 dias pela regra do painel RH (igual ao #14)
    var proj = (dados.proj || []).slice().sort(function (x, y) { return x.m - y.m; });
    S.proj = conferirProjecao(S, proj.slice(0, 3));
    var ct = (dados.ctt || {})[o.codigo] || {}, f = S.fin, hist = historicoOS(dados, o.codigo, ano, mes), blocoCod = codigosBloco(o.rotulo || o.codigo);
    function med(a) { var v = a.filter(function (x) { return x != null; }); return v.length ? soma(v) / v.length / 100 : null; }
    var kpi = { fatAno: f.FR + soma(proj.map(function (x) { return x.fat; })), resAno: f.resReal + soma(proj.map(function (x) { return x.res; })),
      fatMeta: f.FE + soma((dados.projx || []).map(function (x) { return x.fe; })), resMeta: f.resExec + soma((dados.projx || []).map(function (x) { return x.re; })),
      absAcum: absPonderado(S), turnAcum: null };
    return { v: 2, os: o.codigo, rotulo: o.rotulo || o.codigo, hist: hist, desc: (blocoCod.indexOf("|") > 0 && ct.grupo) ? ct.grupo : (ct.desc || o.desc || o.codigo), gestor: atualDe(hist.gestor) || ct.gestor || "", ger: atualDe(hist.ger) || ct.gerente || "", sup: atualDe(hist.sup) || ct.sup || "", neg: ct.neg || "", ano: ano, mes: mes, S: S, kpi: kpi };
  }
  // Ferias contadas em pessoas: efetivo, quantas com 30+ dias (ja tem direito) e, dentro delas, quantas com 45+ (atencao).
  function feriasTxt(efet, f30, f45) {
    function pp(v) { return efet ? " (" + fmt(v / efet * 100, 2) + "% das pessoas)" : ""; }
    if (f30 == null && f45 == null) return "sem registro de férias";
    return (efet ? fmt(efet) + " pessoas no contrato (ativos e em férias; afastados e demitidos fora); " : "") + fmt(f30 || 0) + " com 30 dias ou mais de saldo, já com direito a sair" + pp(f30 || 0) + "; pela regra do painel RH, " + fmt(f45 || 0) + " com mais de 45 dias, fora da regra" + pp(f45 || 0);
  }
  // Responsavel vigente pelo cadastro do acompanhamento (PARAM_ELEGIBILIDADE). Decisao do usuario (12/11):
  // o cadastro define a gerencia/superintendencia de cada OS; a CTT so entra quando nao ha cadastro.
  function atualDe(lt) { return lt && lt.length ? lt[lt.length - 1].nome : ""; }
  function maisComum(xs) { var c = {}, best = "", n = 0; xs.forEach(function (x) { if (!x) return; c[x] = (c[x] || 0) + 1; if (c[x] > n) { n = c[x]; best = x; } }); return best; }
  function linhaOS(b) {
    var f = b.S.fin, rc = f.receita || {}, an = analisarCustos(f), S = b.S, k = b.kpi || {}, n = S.meses.length - 1;
    var perda = rc.perdaRI != null ? rc.perdaRI : rc.perdaPR, he = an ? an.contas.filter(function (x) { return /^41111002/.test(x.conta); })[0] : null;
    var pot = f.resReal + (perda || 0) + (rc.sla || 0) + (rc.nf || 0);
    return { os: b.os, rot: b.rotulo || b.os, desc: b.desc, planos: b.planos || null, estagio: b.estagio || "", gestor: b.gestor || "", ger: b.ger || "", sup: b.sup || "", FR: f.FR, FE: f.FE, res: f.resReal, rex: f.resExec, gap: f.resReal - f.resExec,
      perda: perda || 0, sla: rc.sla || 0, nf: rc.nf || 0, dil: rc.dil || 0, pot: pot, heDesvio: he ? Math.round(he.desvio) : 0,
      rescTot: f.folha ? -soma(f.folha.rescTot) : 0, multa40: f.folha ? -soma(f.folha.multa40) : 0,
      efet: S.rh.efet[n], adm: soma(S.rh.adm), dem: soma(S.rh.dem), he: S.rh.he[n], abs: k.absAcum, turn: k.turnAcum, demTurn: soma(S.rh.demTurn || []),
      f30: S.rh.fer30, f45: S.rh.fer45, ferTot: S.rh.ferTot, alerta: S.proj && S.proj.alerta ? S.proj.alerta.problemas : null,
      fatAno: k.fatAno, fatMeta: k.fatMeta, resAno: k.resAno, resMeta: k.resMeta, diag: (b.txt && (b.txt.diagnostico || [b.txt.situacao].concat((b.txt.positivos || []).map(function (q) { return "positivo: " + q.titulo; })).join(" "))) || "", trocas: trocasTxt(b.hist),
      mm: (f.fc || []).map(function (o) { return [o.m, o.fat, o.res, o.fatEx, o.resEx, o.resFc]; }), efetM: S.rh.efet.slice(), neg: b.neg || "", dg: S.rh && S.rh.efetEx ? diagResumo(diagEfetivo(S)) : null };
  }
  function agregarGrupo(books) {
    var A2 = { FR: 0, FE: 0, resReal: 0, resExec: 0, linhas: [], contas: [], receita: { perda: 0, sla: 0, nf: 0, dil: 0, perdaPR: 0 }, promessa: { res: 0, fc: 0, grupos: [], n: 0 },
      kpi: { fatAno: 0, fatMeta: 0, resAno: 0, resMeta: 0 }, f30: 0, f45: 0, efet: 0, resc: 0, multa40: 0 };
    var sub = {}, cont = {}, pg = {}, rec = {};
    books.forEach(function (b) {
      var f = b.S.fin, an = analisarCustos(f), rc = f.receita || {}, k = b.kpi || {};
      A2.FR += f.FR; A2.FE += f.FE; A2.resReal += f.resReal; A2.resExec += f.resExec;
      (f.linhas || []).forEach(function (l) { var key = l[0] + "|" + l[1]; var a = sub[key] = sub[key] || [l[0], l[1], 0, 0, null, null]; a[2] += l[2] || 0; a[3] += l[3] || 0; });
      if (an) an.contas.forEach(function (x) { var c = cont[x.conta] = cont[x.conta] || { conta: x.conta, real: 0, exec: 0, desvio: 0, oss: [] }; c.real += x.real; c.exec += x.exec || 0; c.desvio += x.desvio; c.oss.push([nomeOS(b.os, b.desc), Math.round(x.desvio)]); });
      A2.receita.perda += rc.perdaRI != null ? rc.perdaRI : (rc.perdaPR || 0); A2.receita.perdaPR += rc.perdaPR || 0; A2.receita.sla += rc.sla || 0; A2.receita.nf += rc.nf || 0; A2.receita.dil += rc.dil || 0;
      if (f.promessa && f.promessa.meses && f.promessa.meses.length) { A2.promessa.n++; A2.promessa.res += f.promessa.res; A2.promessa.fc += f.promessa.fc; f.promessa.grupos.forEach(function (x) { pg[x.nome] = (pg[x.nome] || 0) + x.v; }); }
      ["fatAno", "fatMeta", "resAno", "resMeta"].forEach(function (q) { A2.kpi[q] += k[q] || 0; });
      A2.f30 += b.S.rh.fer30 || 0; A2.f45 += b.S.rh.fer45 || 0; A2.efet += b.S.rh.ferTot || 0;
      if (f.folha) { A2.resc += -soma(f.folha.rescTot); A2.multa40 += -soma(f.folha.multa40); }
      (f.recorrentes || []).forEach(function (x) { var r = rec[x[0]] = rec[x[0]] || { conta: x[0], oss: [], real: 0, exec: 0 }; r.oss.push(nomeOS(b.os, b.desc)); r.real += x[4]; r.exec += x[5]; });
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
    A2.diag = somarDiag(A2.linhasOS.map(function (o) { return o.dg; }));
    return A2;
  }

  function promptGrupo(nivel, nome, ano, mes, G, extra) {
    var L = [], ger = nivel === "ger", an = analisarCustos(G), quem = ger ? "Gerência " + nome : "Superintendência " + nome;
    function pf(v) { return G.FR ? fmt(v / G.FR * 100, 2) + "%" : "–"; }
    L.push("Você é o controller sênior do Setor de Performance da NPE. Escreva o RELATÓRIO da " + quem + " de janeiro a " + MESF[mes] + "/" + ano + ", analisado mês a mês, com os dados de todas as OSs elegíveis do acompanhamento. Todos os meses do período entram, fechados ou não, avaliados pelos números do sistema; não comente fechamento nem validação.");
    L.push(ger ? "É para o gerente: mais resumido que o da OS, por OS. Mostre os contratos piores e melhores, as alavancas (custo, faturamento, perda, absenteísmo, folha) e a solução, sempre dizendo quais OSs causam cada impacto."
      : "É para o superintendente: estratégico e mais resumido que o da gerência, por gerência. Mostre onde estão os impactos globais, quais gerências e OSs os causam e as decisões que cabem a ele.");
    L.push("ROTEIRO, de cima para baixo, cada assunto em UM lugar só. Não existe sumário que adianta o que vem depois, e nada é recontado mais abaixo: (1) situacao = onde " + (ger ? "a gerência" : "a superintendência") + " está: só o retrato geral do grupo (faturamento, resultado e margem do ano e do mês contra executivo, o total que os FCSTs prometeram x o entregue e a projeção), sem causas e sem citar OS; (2) quadro = a leitura do quadro " + (ger ? "dos contratos" : "das gerências") + ": quem sustenta o resultado e quem puxa para baixo, só com os nomes (os números estão na tabela e não se repetem); (3) positivos = o que está dando certo, com os números e as OSs, e o que manter; (4) pontos de atenção por tema, nesta ordem: receita, custos e pessoas; cada problema aparece uma única vez, com o número, a causa, as OSs que causam e se é gestão ou premissa de orçamento; (5) planos = a decisão por contrato e indicador: MANTER, AJUSTAR, TROCAR ou CRIAR o plano, citando o problema pelo nome; (6) plano = o foco do próximo mês. CADA VALOR EM R$ APARECE EM UMA SEÇÃO SÓ: nas seções seguintes, cite o assunto pelo nome sem repetir o número. O mesmo vale para o ASSUNTO: o que está nos positivos não volta nos pontos de atenção, e uma ausência (ex.: não há perdas registradas) é dita uma vez só. Cada tema fala só dele: receita = perdas, SLA, não faturáveis e faturamento; margem e custos ficam em custos.");
    L.push("");
    L.push("REGRAS");
    L.push("- Use SOMENTE os números dos DADOS, como estão: R$ 1.500.000 (sem centavos a partir de R$ 1.000), R$ 850,00 abaixo disso, negativos entre parênteses, R$ (647.973); percentuais com duas casas, 10,00%. Nunca abrevie (nada de 'mi' ou 'mil'). Custos sempre positivos.");
    L.push("- Analise o ano mês a mês: use o MÊS A MÊS do grupo e de cada OS para mostrar quando o resultado melhorou ou piorou e por quê; os totais fecham a história.");
    L.push("- Proporcionalidade: se o faturamento cresceu além do executivo, o custo pode crescer na mesma proporção; a margem cai quando algum custo cresce mais que o volume.");
    L.push("- Blocos de OSs (ex.: 'M00100 + M05100 - CBMM - ARAXA') têm os valores somados: cite sempre o bloco com a composição. Quando houver TROCA DE RESPONSÁVEIS NO ANO, diga quem era o anterior, até quando ficou e desde quando o novo responde.");
    L.push("- Pessoas (gerentes, gestores, superintendentes) são citadas só pelo nome como está nos DADOS; nunca presuma gênero (não use ele/ela, dele/dela, o gerente/a gerente): escreva 'a gerência de NOME' ou 'as OSs de NOME'.");
    L.push("- Toda afirmação de impacto cita as OSs que o causam" + (ger ? "." : " e a gerência delas.") + " Sempre cite a OS com código e descrição, como está nos DADOS (ex.: 'M03100 - NEXA - TRES MARIAS'), nunca só o número; isso vale também para os campos oss e acompanhar.");
    L.push("- PLANOS INFORMADOS: cada OS traz a avaliação dos planos que o gestor informou nos comentários, cruzada com o parecer do Setor de Performance (FUNCIONANDO, PARCIAL, SEM EFEITO, PIOROU, SEM PLANO). Diga em quais contratos o que está sendo feito não está mudando o cenário (SEM EFEITO, PIOROU) ou não existe plano (SEM PLANO), em quais indicadores, e cobre a troca do plano. Vale para todos os indicadores, inclusive SSMA (acidente pode parar um dia de serviço e esse dia deixa de ser medido).");
    L.push("- Ao falar de contratos, um contrato por linha: cada linha começa com o código e a descrição da OS (ex.: 'M03100 - NEXA - TRES MARIAS: ...') e termina antes do próximo contrato; quebre a linha (\\n) a cada contrato. Nunca deixe o código de um contrato no fim da linha de outro." + (ger ? "" : " O mesmo vale para as gerências: uma gerência por linha, começando pelo nome."));
    L.push("- OSs com estágio DESMOBILIZAÇÃO ou FINALIZADA nos DADOS: o aumento de absenteísmo nesse período é próprio da desmobilização. Não cobre ação nem plano para o absenteísmo dessa OS: diga que a causa é a desmobilização e que não há tratativa nem ação a cobrar. Os demais indicadores seguem a análise normal.");
    L.push("- Férias sempre em PESSOAS, por contrato: quantas pessoas o contrato tem, quantas já têm 30 dias ou mais de saldo (direito a sair) e quantas passam de 45 dias (ponto de atenção), com o % das pessoas no contrato. Nunca cite saldo total de dias de férias: esse número não orienta o gestor.");
    L.push("- Acúmulo de férias (30 e 45 dias ou mais) é ponto de atenção: amplia o dissídio e a reoneração. Alertas de projeção (EFETIVO PR/HHT PR que não acompanham a movimentação) devem ser cobrados das OSs citadas.");
    L.push("- Português do Brasil, tom executivo, frases curtas, sem listas dentro dos textos, parágrafos separados por linha em branco, **negrito** só para 1 ou 2 números por texto. Não invente nada; sem registro, diga que não há registro. Todo valor em R$ que você escrever tem que estar nos DADOS ou ser a soma ou a diferença de valores que você cita no mesmo trecho, com as parcelas escritas (ex.: transporte R$ 121.126 e passagens R$ 75.485, total R$ 196.611). Nunca escreva um total sem as parcelas nem um número que não venha dos DADOS.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push(ger ? '{"situacao":"(2 parágrafos, até 900 caracteres)","quadro":"(até 700 caracteres: quais OSs sustentam o resultado e quais puxam para baixo, só os nomes, um contrato por linha; cada OS aparece em um grupo só)","positivos":[{"titulo":"(até 45 caracteres)","texto":"(até 260 caracteres: o que vai bem, com o número, e o que manter)","oss":"(códigos)"}] (2 a 5 itens),"diagnostico":"(3 parágrafos, até 2000 caracteres: a história única de efetivo, faturamento e custo pelo DIAGNÓSTICO INTEGRADO: efetivo do grupo contra o executivo e a movimentação, a diferença de resultado nas três parcelas com as OSs que explicam cada uma, e o mês contra o FCST anterior)","receita":"(até 900 caracteres: SÓ perdas, SLA, não faturáveis e resultado potencial, com as OSs que causam; não repita o diagnóstico)","custos":"(até 1500 caracteres: contas acima da proporção, recorrências, rescisões e multa de 40%, o FCST prometido x entregue por grupo de custo, com as OSs)","pessoas":"(até 1000 caracteres: efetivo, HE, absenteísmo, turnover, férias em pessoas por contrato (efetivo, 30 dias ou mais, 45 dias ou mais) e alertas de projeção, com as OSs)","planos":"(uma linha por contrato com problema, começando pelo código e descrição da OS: para cada indicador, MANTER, AJUSTAR, TROCAR ou CRIAR o plano, citando o problema pelo nome, sem repetir valores; até 1300 caracteres)","plano":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres: o efeito esperado, citando o problema pelo nome, sem repetir valores)","acompanhar":"(até 90 caracteres)","oss":"(códigos)"}] (3 a 5 itens: o foco do próximo mês)}'
      : '{"situacao":"(2 parágrafos, até 800 caracteres)","quadro":"(até 700 caracteres: quais gerências sustentam o resultado e quais puxam para baixo, só os nomes, uma gerência por linha; cada gerência aparece em um grupo só)","positivos":[{"titulo":"(até 45 caracteres)","texto":"(até 240 caracteres: o que vai bem, com o número, a gerência e as OSs, e o que manter)","oss":"(gerência e códigos)"}] (2 a 4 itens),"diagnostico":"(2 ou 3 parágrafos, até 1600 caracteres: a história única de efetivo, faturamento e custo pelo DIAGNÓSTICO INTEGRADO, com as gerências e OSs que explicam cada parcela, e o mês contra o FCST anterior)","receita":"(até 800 caracteres: SÓ perdas, SLA, não faturáveis e resultado potencial, com gerências e OSs; não repita o diagnóstico)","custos":"(até 1200 caracteres: contas acima da proporção, recorrências e rescisões, com gerências e OSs)","pessoas":"(até 700 caracteres: férias, absenteísmo, turnover e alertas de projeção, com gerências e OSs)","planos":"(uma linha por gerência, começando pelo nome: os contratos e indicadores em que o plano tem de ser trocado ou criado, e onde deve ser mantido ou ajustado, citando o problema pelo nome; até 1000 caracteres)","plano":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres)","acompanhar":"(até 90 caracteres)","oss":"(gerência e códigos)"}] (3 a 5 itens: as decisões do superintendente para o próximo mês)}');
    L.push("");
    L.push("DADOS (" + quem + ", " + G.linhasOS.length + " OSs elegíveis" + (extra.semBook && extra.semBook.length ? "; sem dados no painel: " + extra.semBook.join(", ") : "") + ")");
    L.push("JAN A " + MES[mes].toUpperCase() + ": faturamento real " + rs(G.FR) + " x executivo " + rs(G.FE) + " (" + (G.FE ? fmt((G.FR / G.FE - 1) * 100, 2) + "%" : "–") + ") | resultado real " + rs(G.resReal) + " x executivo " + rs(G.resExec) + " | margem real " + pct(G.FR ? G.resReal / G.FR : null) + " x executivo " + pct(G.FE ? G.resExec / G.FE : null) + ".");
    if (G.mesAMes && G.mesAMes.length) L.push("MÊS A MÊS DO GRUPO (faturamento real x executivo | resultado real x executivo | resultado previsto no FCST do mês anterior): " + G.mesAMes.map(function (t) { return MES[t[0]] + ": " + rs(t[1]) + " x " + rs(t[3]) + " | " + rs(t[2]) + " x " + rs(t[4]) + (t[6] ? " | FCST " + rs(t[5]) : ""); }).join(" · ") + ".");
    L.push("PROJEÇÃO DO ANO (real até o mês + projetado no painel até dezembro, somando as OSs): faturamento " + rs(G.kpi.fatAno) + " x meta " + rs(G.kpi.fatMeta) + " | resultado " + rs(G.kpi.resAno) + " x meta " + rs(G.kpi.resMeta) + ".");
    if (G.diag) {
      L.push("DIAGNÓSTICO INTEGRADO EFETIVO x FATURAMENTO x CUSTO (calculado pelo app, somando as OSs; as parcelas somam a diferença de resultado contra o executivo):");
      L.push("  GRUPO: " + diagLinhaGrupo("total", Object.assign({ n: G.diag.n, efMed: G.diag.efMed, exMed: G.diag.exMed }, G.diag)) + (G.diag.semEf ? " (" + G.diag.semEf + " OS(s) sem efetivo no executivo)" : ""));
      G.linhasOS.forEach(function (o) { L.push("  " + diagLinhaGrupo(nomeOS(o.os, o.desc) + (ger ? "" : " (gerência " + (o.ger || "–") + ")"), o.dg)); });
      L.push("  " + REGRA_DIAG + " No grupo, diga quais OSs explicam cada parcela.");
    }
    if (an) L.push("PONTE DA MARGEM DO GRUPO (p.p. por grupo de custo; negativo = custou mais que a proporção): " + an.grupos.map(function (g) { return g.nome + " " + (g.pp > 0 ? "+" : "") + fmt(g.pp, 2); }).join("; ") + ".");
    L.push("CONTAS QUE MAIS PESARAM (quanto custaram a mais que a proporção, somando as OSs; e as OSs que mais contribuíram): " + G.contas.slice(0, 10).map(function (c) { return c.conta + " " + dif(c.desvio) + " (" + c.oss.filter(function (o) { return o[1] < 0; }).map(function (o) { return o[0] + " " + moeda(Math.abs(o[1])); }).join(", ") + ")"; }).join("; ") + ".");
    if (G.recorrentes.length) L.push("CUSTOS ACIMA DO EXECUTIVO DE FORMA RECORRENTE (conta: OSs): " + G.recorrentes.map(function (r) { return r.conta + ": " + r.oss.join(", "); }).join("; ") + ".");
    var rc = G.receita, pot = G.resReal + rc.perda + rc.sla + rc.nf;
    L.push("RECEITA E CUSTO SEM FATURAMENTO: perdas " + rs(rc.perda) + " (" + pf(rc.perda) + ") | SLA " + rs(rc.sla) + " (" + pf(rc.sla) + ") | não faturáveis " + rs(rc.nf) + " (" + pf(rc.nf) + ") | resultado potencial (real + perdas + SLA + não faturáveis) " + rs(pot) + ", margem " + pct(G.FR ? pot / G.FR : null) + ". Diluídos, apenas informativo e fora de qualquer conta: " + rs(rc.dil) + ".");
    if (G.promessa.n) L.push("FCST: somando as OSs, os FCSTs do mês anterior prometeram " + rs(G.promessa.fc) + " e o realizado foi " + rs(G.promessa.res) + " (diferença " + rs(G.promessa.res - G.promessa.fc) + "). Por grupo: " + G.promessa.grupos.slice().sort(function (a, b) { return a.v - b.v; }).map(function (x) { return x.nome + (x.v < 0 ? " piorou " : " melhorou ") + moeda(Math.abs(x.v)); }).join("; ") + ".");
    L.push("FOLHA: rescisões e encargos rescisórios " + rs(G.resc) + ", dos quais multa de 40% do FGTS " + rs(G.multa40) + ". FÉRIAS (somando as OSs): " + feriasTxt(G.efet, G.f30, G.f45) + ".");
    if (!ger && extra.porGer) {
      L.push("");
      L.push("POR GERÊNCIA (faturamento real x executivo | resultado real x executivo | margem real | perdas | férias | OSs com alerta de projeção):");
      extra.porGer.forEach(function (g) { L.push("  " + g.nome + " (" + g.n + " OSs): " + rs(g.FR) + " x " + rs(g.FE) + " | " + rs(g.res) + " x " + rs(g.rex) + " | " + pct(g.FR ? g.res / g.FR : null) + " | " + rs(g.perda) + " | " + feriasTxt(g.efet, g.f30, g.f45) + " | " + (g.alertas.length ? g.alertas.join(", ") : "nenhuma")); });
    }
    L.push("");
    L.push("POR OS (do pior para o melhor resultado contra o executivo):");
    G.linhasOS.forEach(function (o) {
      L.push("  " + (String(o.desc).indexOf(o.os) === 0 ? o.desc : o.os + " " + o.desc) + (ger ? "" : " [" + o.ger + "]") + " | gestor " + (o.gestor || "–") + (o.estagio ? " | estágio " + o.estagio : "") + " | faturamento " + rs(o.FR) + " x " + rs(o.FE) + " | resultado " + rs(o.res) + " x " + rs(o.rex) + " (diferença " + rs(o.gap) + ") | margem " + pct(o.FR ? o.res / o.FR : null) + " x " + pct(o.FE ? o.rex / o.FE : null) +
        " | perdas " + rs(o.perda) + " | SLA " + rs(o.sla) + " | não faturáveis " + rs(o.nf) + " | diluídos (informativo) " + rs(o.dil) + " | HE " + (o.heDesvio < 0 ? moeda(-o.heDesvio) + " acima da proporção" : "na proporção") + " | rescisões " + rs(o.rescTot) +
        " | efetivo " + fmt(o.efet) + " (" + o.adm + " admissões, " + o.dem + " demissões no ano, " + o.demTurn + " contam no turnover) | absenteísmo do ano (ponderado pelo efetivo) " + pct(o.abs) + " | férias: " + feriasTxt(o.ferTot, o.f30, o.f45) + (o.alerta ? " | ALERTA DE PROJEÇÃO: " + o.alerta.join("; ") : "") + (o.trocas && o.trocas.length ? " | TROCA DE RESPONSÁVEIS NO ANO: " + o.trocas.join("; ") : ""));
      L.push("    resultado mês a mês (real x executivo): " + o.mm.map(function (x) { return MES[x[0]] + " " + rs(x[2]) + " x " + rs(x[4]); }).join(" · "));
      if (o.planos) { var pr0 = o.planos.filter(function (q) { return q.efeito !== "FUNCIONANDO"; }); L.push("    planos informados: " + (o.planos.length ? o.planos.map(function (q) { return q.indicador + " " + q.efeito; }).join("; ") : "todos os indicadores atenderam") + (pr0.length ? " | detalhe: " + pr0.slice(0, 5).map(function (q) { return q.indicador + ": " + String(q.acao).slice(0, 110) + " -> " + String(q.recomendacao).slice(0, 110); }).join(" / ") : "")); }
      else L.push("    planos informados: sem avaliação no book da OS");
      if (ger && o.diag) L.push("    diagnóstico da OS: " + String(o.diag).replace(/\s+/g, " ").slice(0, 420));
    });
    return L.join("\n");
  }
  function conferirGrupo(j, nivel) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    ["situacao", "quadro", "receita", "custos", "pessoas", "planos"].forEach(function (k) { if (!j[k] || String(j[k]).length < 60) falta.push(k); });
    if (!j.diagnostico || String(j.diagnostico).length < 250) falta.push("diagnostico");
    if (!Array.isArray(j.positivos) || !j.positivos.length) falta.push("positivos");
    if (!Array.isArray(j.plano) || j.plano.length < 2) falta.push("plano");
    var rpt = valoresRepetidos({ situacao: j.situacao, quadro: j.quadro, positivos: j.positivos, receita: j.receita, custos: j.custos, pessoas: j.pessoas, planos: j.planos, foco: j.plano });
    if (rpt.length) falta.push(MSG_REPETICAO + rpt.join("; "));
    return falta;
  }
  function porGerencia(linhas) {
    var g = {};
    linhas.forEach(function (o) { var k = o.ger || "(sem gerente)"; var x = g[k] = g[k] || { nome: k, n: 0, FR: 0, FE: 0, res: 0, rex: 0, perda: 0, f30: 0, f45: 0, efet: 0, alertas: [] }; x.n++; x.FR += o.FR; x.FE += o.FE; x.res += o.res; x.rex += o.rex; x.perda += o.perda; x.f30 += o.f30 || 0; x.f45 += o.f45 || 0; x.efet += o.ferTot || 0; if (o.alerta) x.alertas.push(nomeOS(o.os, o.desc)); });
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
    // OS sem contabil no ano e legitima (fica listada como "sem dados"); erro de acesso ou de tempo nao:
    // nesse caso o relatorio NAO e gravado pela metade (11/11: gerencia gravada com 1 de 6 OSs).
    var semDados = [], naoLidas = [];
    for (var fi = 0; fi < falhas.length; fi++) {
      var ult = null;
      for (var tt = 0; tt < 2; tt++) {
        if (tt) await new Promise(function (r) { setTimeout(r, 4000); });
        try { res.push(await resumoOS(falhas[fi], ano, mes, tk, opts.urlFluxo)); ult = null; break; } catch (e) { ult = e; }
      }
      if (!ult) continue;
      var msg = String(ult && ult.message || ult);
      if (/sem dados cont[aá]beis/i.test(msg)) semDados.push(nomeOS(falhas[fi].codigo, falhas[fi].desc) + " (sem contábil no ano)");
      else naoLidas.push(nomeOS(falhas[fi].codigo, falhas[fi].desc) + " (" + msg.slice(0, 100) + ")");
    }
    if (naoLidas.length) throw new Error("Não consegui ler " + naoLidas.length + " OS(s) de " + nome + ", nada foi gravado: " + naoLidas.join("; "));
    if (!res.length) throw new Error("O painel não devolveu dados para as OSs de " + nome + ".");
    // planos de acao avaliados no book de cada OS (gerado antes, na mesma rodada)
    try {
      var mapaOS = await lerNivel("os", true);
      res.forEach(function (b) { var r0 = mapaOS[String(b.os).toUpperCase()]; var d0 = r0 && r0.d; if (d0 && d0.estagio) b.estagio = d0.estagio; if (d0 && d0.ano === ano && d0.mes === mes && d0.txt && Array.isArray(d0.txt.planos)) b.planos = d0.txt.planos.map(function (q) { return { indicador: q.indicador || "", efeito: String(q.efeito || "").toUpperCase().trim(), acao: q.acao || "", recomendacao: q.recomendacao || "" }; }); });
    } catch (e) {}
    var G = agregarGrupo(res), extra = { semBook: semDados };
    if (nivel === "sup") extra.porGer = porGerencia(G.linhasOS);
    var titulo = maisComum(res.map(function (b) { return nivel === "ger" ? b.ger : b.sup; })) || nome;
    var prompt = promptGrupo(nivel, titulo, ano, mes, G, extra);
    progresso("A IA está escrevendo o relatório de " + titulo + " (" + res.length + " OSs)…");
    var gc = await gerarConferido(prompt, function (jj) { return conferirGrupo(jj, nivel); }), j = gc.j, falta = gc.falta;
    if (falta.length && falta.every(function (x) { return /^repetição de valores/.test(x); })) falta = [];   // nao derruba o relatorio; a regra ja foi cobrada nas novas tentativas
    if (falta.length) throw new Error("A IA não completou o relatório (faltou: " + falta.join(", ") + ").");
    var s2 = A.sessaoAcesso ? A.sessaoAcesso() : null;
    // o que vai para o SharePoint: sem o detalhe dos planos e sem o diagnostico de cada OS (so o prompt usa)
    var Gs = Object.assign({}, G, { linhasOS: G.linhasOS.map(function (o) { var c = Object.assign({}, o); delete c.diag; c.planos = o.planos ? o.planos.map(function (q) { return { indicador: q.indicador, efeito: q.efeito }; }) : null; return c; }) });
    var book = { v: 2, nivel: nivel, chave: alvo, nome: titulo, sup: nivel === "ger" ? maisComum(res.map(function (b) { return b.sup; })) : titulo, ano: ano, mes: mes, em: new Date().toISOString(), por: s2 ? s2.login : "",
      G: Gs, porGer: extra.porGer || null, semBook: semDados,
      txt: { situacao: j.situacao, quadro: j.quadro, positivos: j.positivos.slice(0, 5), diagnostico: j.diagnostico || "", receita: j.receita, custos: j.custos, pessoas: j.pessoas, planos: j.planos || "", plano: j.plano.slice(0, 6) } };
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
    for (var v = Math.ceil(mn / passo) * passo; v <= mx; v += passo) s += '<line x1="' + f.m.l + '" x2="' + (f.W - f.m.r) + '" y1="' + y(v) + '" y2="' + y(v) + '" stroke="' + (Math.abs(v) < 1e-9 ? COR.muted : COR.line) + '"/><text x="' + (f.m.l - 6) + '" y="' + (y(v) + 3.5) + '" text-anchor="end" font-size="14" fill="' + COR.muted + '">' + fmt(v) + "</text>";
    mm.forEach(function (t, i) {
      var x = f.m.l + bw * i + bw * 0.25, w = bw * 0.5, r = t[2], e = t[4], top = y(Math.max(0, r)), h = Math.abs(y(r) - y(0));
      s += '<rect x="' + x + '" y="' + top + '" width="' + w + '" height="' + Math.max(1.5, h) + '" rx="2" fill="' + (r >= e ? COR.teal : COR.red) + '"/>';
      s += '<line x1="' + (x - 6) + '" x2="' + (x + w + 6) + '" y1="' + y(e) + '" y2="' + y(e) + '" stroke="' + COR.navy + '" stroke-width="3"/>';
      var ly = r >= 0 ? top - 6 : y(r) + 14, ye = y(e);
      if (r >= 0 && ye <= ly + 4 && ye >= ly - 14) ly = ye - 6;
      if (r < 0 && ye >= ly - 12 && ye <= ly + 4) ly = ye + 15;
      s += lbl(x + w / 2, ly, moeda(r), { s: 10 });
    });
    return svg(f, s + eixoX(f, mm.map(function (t) { return MES[t[0]]; })), "Resultado mês a mês");
  }
  // 23/11/2026 (usuario): nomes saiam cortados a esquerda (M00100 + M05100 - CBMM - ARAXA). Agora o nome e o mesmo
  // da tabela (nomeOS), quebra em duas linhas quando e longo (codigos | descricao) e a margem acompanha o maior nome.
  function quebrarNomeOS(n) {
    n = String(n || "");
    if (n.length <= 30) return [n];
    var m = /^((?:[A-Z]\d{5}\s*\+\s*)*[A-Z]\d{5})\s*-\s*(.+)$/.exec(n);
    if (m) return [m[1], m[2].length > 34 ? m[2].slice(0, 33) + "…" : m[2]];
    var corte = n.lastIndexOf(" ", 30); if (corte < 10) corte = 30;
    var r = n.slice(corte).trim();
    return [n.slice(0, corte).trim(), r.length > 34 ? r.slice(0, 33) + "…" : r];
  }
  function chGap(linhas) {
    var xs = linhas.slice(0, 14), max = Math.max.apply(null, xs.map(function (o) { return Math.abs(o.gap); }).concat([1]));
    var rot = xs.map(function (o) { return quebrarNomeOS(nomeOS(o.os, o.desc)); });
    var dupla = rot.some(function (r) { return r.length > 1; });
    var maior = Math.max.apply(null, rot.map(function (r) { return Math.max.apply(null, r.map(function (l) { return l.length; })); }).concat([8]));
    var lh = dupla ? 44 : 30, fs = 15.5, ml = Math.min(470, Math.max(160, Math.round(maior * fs * 0.58) + 24));
    var f = fr(1100, 20 + xs.length * lh, { l: ml, r: 160, t: 10, b: 10 }), mid = f.m.l + f.iw / 2, sc = function (v) { return Math.abs(v) / max * (f.iw / 2 - 10); };
    var s = '<line x1="' + mid + '" x2="' + mid + '" y1="' + f.m.t + '" y2="' + (f.H - f.m.b) + '" stroke="' + COR.muted + '"/>';
    xs.forEach(function (o, i) {
      var y = f.m.t + i * lh, w = sc(o.gap), neg = o.gap < 0, yc = y + lh / 2;
      var r = rot[i];
      if (r.length === 1) s += '<text x="' + (f.m.l - 10) + '" y="' + (yc + 5) + '" text-anchor="end" font-size="' + fs + '" fill="' + COR.ink + '">' + esc(r[0]) + "</text>";
      else s += '<text x="' + (f.m.l - 10) + '" y="' + (yc - 4) + '" text-anchor="end" font-size="' + fs + '" font-weight="700" fill="' + COR.ink + '">' + esc(r[0]) + "</text>" +
                '<text x="' + (f.m.l - 10) + '" y="' + (yc + 14) + '" text-anchor="end" font-size="' + (fs - 1) + '" fill="' + COR.ink + '">' + esc(r[1]) + "</text>";
      s += '<rect x="' + (neg ? mid - w : mid) + '" y="' + (yc - 9) + '" width="' + w + '" height="18" rx="2" fill="' + (neg ? COR.red : COR.teal) + '"/>';
      s += '<text x="' + (f.W - 6) + '" y="' + (yc + 6) + '" text-anchor="end" font-size="16.5" font-weight="700" fill="' + (neg ? COR.badfg : COR.okfg) + '">' + moeda(o.gap) + "</text>";
    });
    return svg(f, s, "Resultado contra o executivo por OS");
  }
  function renderRelatorioGrupoV1(b) {
    var G = ordenarOSdoGrupo(b.G), t = b.txt || {}, ger = b.nivel === "ger", an = analisarCustos(G), h = [], fig = 0, nc = 0;
    var MN = mapaNomesOS(G.linhasOS);
    function nm(o) { return nomeOS(o.os, o.desc); }
    function xo(txt) { return expandirOSs(txt, MN); }
    function figura(titulo, cap, corpo) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + "</figure>"; }
    function par(txt) { return xo(txt).split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) { return '<p>' + rico(p) + "</p>"; }).join(""); }
    function cap(n, tit, corpo, cls) { return '<section class="rl-cap' + (cls ? " " + cls : "") + '"><h2><span>' + n + "</span>" + tit + "</h2>" + corpo + "</section>"; }
    function cel(l, v, s2, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s2 + "</span></div>"; }
    var margR = G.FR ? G.resReal / G.FR : null, margE = G.FE ? G.resExec / G.FE : null, k = G.kpi;
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório da ' + (ger ? "Gerência" : "Superintendência") + '</span><span class="rl-per">janeiro a ' + MESF[b.mes] + " de " + b.ano + "</span></div>" +
      "<h1>" + esc(b.nome) + "</h1>" + '<div class="rl-ficha">' + (ger ? "<span>Superintendente: <b>" + esc(b.sup || "–") + "</b></span>" : "") + "<span>OSs elegíveis: <b>" + G.linhasOS.length + "</b></span>" +
      (b.porGer ? "<span>Gerências: <b>" + b.porGer.length + "</b></span>" : "") + (b.semBook && b.semBook.length ? "<span>Sem dados no painel: <b>" + esc(b.semBook.join(", ")) + "</b></span>" : "") + "</div>" +
      (function () { var tr = G.linhasOS.filter(function (o) { return o.trocas && o.trocas.length; }); return tr.length ? '<div class="rl-alerta" style="margin-top:12px"><b>Trocas de responsáveis no ano</b>' + tr.map(function (o) { return esc(o.desc + ": " + o.trocas.join("; ")); }).join("<br>") + "</div>" : ""; })() + "</header>");
    h.push('<section class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", moeda(G.FR), "executivo " + moeda(G.FE), G.FR >= G.FE ? "ok" : "bad") + cel("Resultado", moeda(G.resReal), "executivo " + moeda(G.resExec), G.resReal >= G.resExec ? "ok" : "bad") + cel("Margem", pct(margR), "executivo " + pct(margE), margR >= margE ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Projeção do ano · real + projetado até dez</h3>' +
      cel("Faturamento", moeda(k.fatAno), "meta " + moeda(k.fatMeta), k.fatAno >= k.fatMeta ? "ok" : "bad") + cel("Resultado", moeda(k.resAno), "meta " + moeda(k.resMeta), k.resAno >= k.resMeta ? "ok" : "bad") +
      cel("Margem", pct(k.fatAno ? k.resAno / k.fatAno : null), "meta " + pct(k.fatMeta ? k.resMeta / k.fatMeta : null), (k.fatAno && k.fatMeta && k.resAno / k.fatAno >= k.resMeta / k.fatMeta) ? "ok" : "bad") + "</div></section>");
    h.push(cap(++nc, "Sumário executivo", '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.sumario) + "</div>" + figura("Resultado do mês, somando as OSs", "barra = realizado (verde acima do executivo, vermelho abaixo) · traço = executivo do mês", chMesGrupo(G.mesAMes)) + "</div>"));
    // ranking / gerencias
    var tabOS = '<div class="rl-tab"><table><thead><tr><th>OS</th>' + (ger ? "<th>Gestor</th>" : "<th>Gerente</th>") + "<th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Potencial</th></tr></thead><tbody>" +
      G.linhasOS.map(function (o) {
        return "<tr><td>" + esc(nm(o)) + "</td><td class=\"rl-cx\">" + esc(ger ? o.gestor : o.ger) + "</td><td>" + moeda(o.FR) + "</td><td>" + (o.FE ? (o.FR >= o.FE ? "+" : "") + fmt((o.FR / o.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (o.res < o.rex ? "neg" : "pos") + '">' + moeda(o.res) + "</td><td>" + moeda(o.rex) + "</td><td>" + pct(o.FR ? o.res / o.FR : null) + "</td><td>" + moeda(o.perda) + "</td><td>" + moeda(o.pot) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    if (ger) h.push(cap(++nc, "Contratos: onde está o resultado", par(t.ranking) + figura("Resultado contra o executivo, por OS", "jan a " + MES[b.mes] + " · vermelho = abaixo do executivo", chGap(G.linhasOS)) + figura("As OSs da gerência", "do pior para o melhor resultado contra o executivo", tabOS)));
    else {
      var tabG = '<div class="rl-tab"><table><thead><tr><th>Gerência</th><th>OSs</th><th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Férias 45+</th><th>Alertas de projeção</th></tr></thead><tbody>' +
        (b.porGer || []).map(function (g) { return "<tr><td>" + esc(g.nome) + "</td><td>" + g.n + "</td><td>" + moeda(g.FR) + "</td><td>" + (g.FE ? (g.FR >= g.FE ? "+" : "") + fmt((g.FR / g.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (g.res < g.rex ? "neg" : "pos") + '">' + moeda(g.res) + "</td><td>" + moeda(g.rex) + "</td><td>" + pct(g.FR ? g.res / g.FR : null) + "</td><td>" + moeda(g.perda) + "</td><td>" + fmt(g.f45) + "</td><td class=\"rl-cx\">" + esc(g.alertas.map(function (c) { return MN[c] || c; }).join(", ") || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>";
      h.push(cap(++nc, "Gerências: onde está o resultado", par(t.gerencias) + figura("As gerências", "da pior para a melhor contra o executivo", tabG) + figura("As OSs que mais pesam", "as 14 piores contra o executivo", chGap(G.linhasOS))));
    }
    // impactos
    var rc = G.receita, pot = G.resReal + rc.perda + rc.sla + rc.nf;
    var tabC = '<div class="rl-tab"><table><thead><tr><th>Conta</th><th>Custou a mais que a proporção</th><th>OSs que mais contribuíram</th></tr></thead><tbody>' +
      G.contas.filter(function (c) { return c.desvio < 0; }).slice(0, 8).map(function (c) { return "<tr><td>" + esc(String(c.conta).replace(/^\d+\s*-\s*/, "")) + '</td><td class="neg">' + moeda(-c.desvio) + '</td><td class="rl-cx">' + esc(c.oss.filter(function (o) { return o[1] < 0; }).map(function (o) { return (MN[o[0]] || o[0]) + " " + moeda(-o[1]); }).join(" · ")) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var fPot = figura("Resultado potencial do grupo", "sem perdas, SLA e não faturáveis · margem real " + pct(margR) + " → potencial " + pct(G.FR ? pot / G.FR : null), chPotencial({ res: G.resReal, perda: rc.perda, sla: rc.sla, nf: rc.nf }));
    h.push(cap(++nc, "Impactos: o que tirou resultado e quem causou",
      '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.impactos) + "</div>" + figura("As contas que mais pesaram", "", tabC) + "</div>" +
      (an ? '<div class="rl-duas">' + figura("Ponte da margem do grupo", "pontos percentuais de margem por grupo de custo, somando as OSs", chPonte(an)) + fPot + "</div>" : fPot)));
    // pessoas
    var tabP = '<div class="rl-tab"><table><thead><tr><th>OS</th><th>Efetivo</th><th>Adm./dem. no ano</th><th>HE no mês</th><th>Absenteísmo do ano</th><th>Demissões (turnover)</th><th>Férias 30+</th><th>Férias 45+</th><th>Projeção</th></tr></thead><tbody>' +
      G.linhasOS.map(function (o) { return "<tr><td>" + esc(nm(o)) + "</td><td>" + fmt(o.efet) + "</td><td>" + o.adm + " / " + o.dem + "</td><td>" + (o.he == null ? "–" : fmt(o.he, 2) + "%") + "</td><td>" + pct(o.abs) + "</td><td>" + o.demTurn + "</td><td>" + fmt(o.f30) + (o.ferTot && o.f30 != null ? " (" + fmt(o.f30 / o.ferTot * 100, 2) + "%)" : "") + '</td><td class="' + ((o.f45 || 0) > 0 ? "neg" : "") + '">' + fmt(o.f45) + (o.ferTot && o.f45 != null ? " (" + fmt(o.f45 / o.ferTot * 100, 2) + "%)" : "") + '</td><td class="' + (o.alerta ? "neg" : "") + '">' + (o.alerta ? "corrigir" : "ok") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var al = G.linhasOS.filter(function (o) { return o.alerta; });
    h.push(cap(++nc, "Pessoas, férias e projeção", (al.length ? '<div class="rl-alerta"><b>Projeção a corrigir em ' + al.length + (al.length > 1 ? " OSs" : " OS") + "</b>" + al.map(function (o) { return esc(nm(o) + ": " + o.alerta[0]); }).join("<br>") + "</div>" : "") + par(t.pessoas) + figura("Pessoas por OS", "férias em pessoas: com 30 dias ou mais de saldo (já têm direito) e com 45 dias ou mais (ponto de atenção), entre parênteses o % das pessoas no contrato (ativos e em férias; afastados e demitidos fora)", tabP)));
    // planos informados pelos gestores, avaliados no book de cada OS
    var comPl = G.linhasOS.filter(function (o) { return o.planos; });
    if (comPl.length || t.planos) {
      var conta = function (o, ef) { return (o.planos || []).filter(function (q) { return ef.indexOf(q.efeito) >= 0; }).length; };
      var tabPl = '<div class="rl-tab"><table><thead><tr><th>OS</th><th>Funcionando</th><th>Parcial</th><th>Sem efeito / piorou</th><th>Sem plano</th><th>Indicadores a trocar o plano</th></tr></thead><tbody>' +
        comPl.map(function (o) { var ruins = (o.planos || []).filter(function (q) { return ["SEM EFEITO", "PIOROU", "SEM PLANO"].indexOf(q.efeito) >= 0; }); return "<tr><td>" + esc(nm(o)) + "</td><td>" + conta(o, ["FUNCIONANDO"]) + "</td><td>" + conta(o, ["PARCIAL"]) + '</td><td class="' + (conta(o, ["SEM EFEITO", "PIOROU"]) ? "neg" : "") + '">' + conta(o, ["SEM EFEITO", "PIOROU"]) + '</td><td class="' + (conta(o, ["SEM PLANO"]) ? "neg" : "") + '">' + conta(o, ["SEM PLANO"]) + '</td><td class="rl-cx">' + esc(ruins.map(function (q) { return q.indicador; }).join(" · ") || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>";
      h.push(cap(++nc, "Planos informados: estão mudando o cenário?", par(t.planos) + (comPl.length ? figura("Planos por OS", "o que o gestor informou nos comentários, cruzado com o parecer do Setor de Performance e com os números dos meses seguintes", tabPl) : "")));
    }
    // alavancas e plano
    h.push(cap(++nc, "Alavancas", '<div class="bk-orcgrid">' + (t.alavancas || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.alavanca || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(xo(o.texto || "")) + "</p>" + (o.oss ? '<p class="rl-nota">' + esc(xo(o.oss)) + "</p>" : "") + "</div>"; }).join("") + "</div>"));
    h.push(cap(++nc, "Plano de ação", '<ol class="rl-plano">' + (t.plano || []).map(function (p) { return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(xo(p.efeito)) + "</span>" : "") + (p.acompanhar || p.oss ? '<em>' + (p.acompanhar ? "Acompanhar: " + esc(xo(p.acompanhar)) : "") + (p.oss ? " · " + esc(xo(p.oss)) : "") + "</em>" : "") + "</li>"; }).join("") + "</ol>"));
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Dados de todas as OSs elegíveis do acompanhamento, direto do painel (RESULTADOS, RECEITA IDEAL e CTT), janeiro a ' + MESF[b.mes] + ". Textos escritos por IA. Gerado em " + esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }

  // 17/11/2026 (usuario): roteiro de cima para baixo, cada assunto num lugar so -- Onde esta, quadro/indicadores,
  // destaques positivos, pontos de atencao por tema, planos (manter/ajustar/trocar/criar), foco do proximo mes
  // e (so na OS) o orcamento. Book antigo (com sumario) continua abrindo no formato v1.
  function renderRelatorioOS(b) { var t0 = b.txt || {}; return t0.situacao ? renderRelatorioOSv3(b) : renderRelatorioOSv1(b); }
  // 18/11/2026: na reuniao as OSs vao em ordem crescente de codigo (M01009, M01010, M01011...)
  function porCodigoOS(a, b) { return String(a || "").localeCompare(String(b || "")); }
  function ordenarOSdoGrupo(G) { return G && G.linhasOS ? Object.assign({}, G, { linhasOS: G.linhasOS.slice().sort(function (x, y) { return porCodigoOS(x.os, y.os); }) }) : G; }
  function renderRelatorioGrupo(b) { var t0 = b.txt || {}; return t0.situacao ? renderRelatorioGrupoV3(b) : renderRelatorioGrupoV1(b); }
  function cardsPositivos(xs, xo) {
    xo = xo || function (s) { return s; };
    if (!xs || !xs.length) return '<p class="rl-nota">Nenhum destaque positivo no período.</p>';
    return '<div class="bk-orcgrid rl-pos">' + xs.map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.titulo || "") + "</h4><p>" + rico(xo(o.texto || "")) + "</p>" + (o.oss ? '<p class="rl-nota">' + esc(xo(o.oss)) + "</p>" : "") + "</div>"; }).join("") + "</div>";
  }
  function renderRelatorioOSv3(b) {
    var S = b.S, k = b.kpi, t = b.txt || {}, c = S.fin || S.custos || {}, an = analisarCustos(c), h = [], fig = 0;
    function figura(titulo, cap, corpo, leg) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + (leg || "") + "</figure>"; }
    function par(txt) { return String(txt || "").split(/\n\s*\n/).filter(Boolean).map(function (p) { return '<p>' + rico(p.trim()) + "</p>"; }).join(""); }
    function pf(v) { return c.FR ? fmt(v / c.FR * 100, 2) + "%" : "–"; }
    function sub(tit) { return '<h3 class="rl-sub">' + tit + "</h3>"; }
    var mesN = MESF[b.mes];
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório gerencial do contrato</span><span class="rl-per">janeiro a ' + mesN + " de " + b.ano + "</span></div>" +
      '<h1>' + (b.descCtt ? esc(b.desc) : esc(b.rotulo.replace("|", " + ")) + " · " + esc(b.desc)) + "</h1>" +
      '<div class="rl-ficha"><span>' + esc(b.neg || "") + "</span><span>Gestor do contrato: <b>" + esc(txtLinha(b.hist && b.hist.gestor, b.gestor)) + "</b></span><span>Gerente: <b>" + esc(txtLinha(b.hist && b.hist.ger, b.ger)) + "</b></span><span>Superintendente: <b>" + esc(txtLinha(b.hist && b.hist.sup, b.sup)) + "</b></span></div>" +
      (b.semAtiv && b.semAtiv.length ? '<p class="rl-nota">Sem atividade (sem faturamento, custo nem efetivo na folha): <b>' + b.semAtiv.map(function (m) { return MES[m]; }).join(", ") + "</b>. Esses meses não são avaliados.</p>" : "") +
      (b.semTrat && b.semTrat.length ? '<p class="rl-nota">Meses sem tratativa (nenhum comentário do responsável nem parecer do Setor de Performance): <b>' + b.semTrat.map(function (m) { return MES[m]; }).join(", ") + "</b>. Foram avaliados pelos números do sistema; não há justificativa nem plano de ação para eles.</p>" : "") +
      "</header>");
    // 1. onde o contrato esta
    function cel(l, v, s, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s + "</span></div>"; }
    var margR = c.FR ? c.resReal / c.FR : null, margE = c.FE ? c.resExec / c.FE : null;
    var nums = '<div class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", mi(c.FR), "executivo " + mi(c.FE) + (c.FE ? " · " + (c.FR >= c.FE ? "+" : "") + fmt((c.FR / c.FE - 1) * 100, 2) + "%" : ""), c.FR >= c.FE ? "ok" : "bad") +
      cel("Resultado", mi(c.resReal), "executivo " + mi(c.resExec), c.resReal >= c.resExec ? "ok" : "bad") +
      cel("Margem", pct(margR), "executivo " + pct(margE), margR >= margE ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Projeção do ano · real até ' + MES[b.mes] + " + FCST até dez</h3>" +
      cel("Faturamento", mi(k.fatAno), "meta " + mi(k.fatMeta), k.fatAno >= k.fatMeta ? "ok" : "bad") +
      cel("Resultado", mi(k.resAno), "meta " + mi(k.resMeta), k.resAno >= k.resMeta ? "ok" : "bad") +
      cel("Margem", pct(k.fatAno ? k.resAno / k.fatAno : null), "meta " + pct(k.fatMeta ? k.resMeta / k.fatMeta : null), (k.fatAno && k.fatMeta && k.resAno / k.fatAno >= k.resMeta / k.fatMeta) ? "ok" : "bad") + "</div></div>";
    var pa = S.proj && S.proj.alerta;
    var projBox = pa ? '<div class="rl-alerta"><b>Atenção à projeção de ' + MES[pa.prox] + '</b>' + esc(pa.problemas.join("; ")) + '. Corrija o EFETIVO PR, o HHT PR e o faturamento projetado; sem isso a comparação do próximo mês fica errada.</div>' : "";
    var tendBox = S.regua ? '<h3 class="rl-sub">Tendência do ano: projeção contra a margem prometida</h3>' + reguaHTML(S.regua) : "";
    if (S.resumo) h.push(resumoHTML(S.resumo, t.cobrar || ""));
    h.push('<section class="rl-cap"><h2><span>1</span>Onde o contrato está</h2>' + nums + par(t.situacao) + projBox + tendBox + "</section>");
    // 2. indicadores mes a mes
    h.push('<section class="rl-cap"><h2><span>2</span>Indicadores mês a mês</h2><div class="rl-tab"><table><thead><tr><th>Indicador</th><th>Situação em ' + MES[b.mes] + '</th><th>Jan → ' + MES[b.mes] + '</th><th>Valores do mês</th></tr></thead><tbody>' +
      b.inds.map(function (x) { return "<tr><td>#" + x.id + " " + esc(x.nome) + '</td><td><span class="bk-pill ' + x.st + '">' + esc(x.pill) + "</span></td><td>" + stripHtml(x.strip) + '</td><td class="rl-cx">' + esc(x.val || "") + "</td></tr>"; }).join("") +
      '</tbody></table><p class="rl-nota">Todos os meses avaliados pelos números do sistema, com ou sem comentário.</p></div></section>');
    // 3. destaques positivos
    h.push('<section class="rl-cap"><h2><span>3</span>Destaques positivos: o que manter</h2>' + cardsPositivos(t.positivos) + "</section>");
    // 4. pontos de atencao
    var p4 = "";
    // 23/11/2026: o diagnostico integrado vem antes de receita e custos (book antigo sem o texto mostra so os quadros)
    var DG = (S.rh && S.rh.efetEx) ? diagEfetivo(S) : null;   // book gravado antes de 23/11 nao tem o efetivo do executivo
    if (DG) p4 += sub("Diagnóstico: efetivo, faturamento e custo, contra o executivo e o FCST anterior") + par(t.diagnostico) + diagHTML(DG, figura, MES[b.mes]);
    var rc = c.receita, r2 = par(t.receita);
    if (rc && c.FR) {
      var perda = rc.perdaRI != null ? rc.perdaRI : rc.perdaPR, pot = c.resReal + (perda || 0) + (rc.sla || 0) + (rc.nf || 0);
      var zerado = !perda && !rc.sla && !rc.nf && !rc.dil && !rc.perdaPR;
      if (zerado) r2 += '<p class="rl-nota rl-nota-caixa">Sem perdas de receita, descontos de SLA, recursos não faturáveis ou diluídos registrados de janeiro a ' + MES[b.mes] + " (Receita Ideal e PR).</p>";
      else r2 += '<div class="rl-duas">' + figura("Resultado potencial: o que o contrato entregaria sem perdas, SLA e não faturáveis", "jan a " + MES[b.mes] + " · margem real " + pct(margR) + " → potencial " + pct(pot / c.FR),
        chPotencial({ res: c.resReal, perda: perda, sla: rc.sla, nf: rc.nf })) + figura("Os efeitos sobre o resultado", "valor de janeiro a " + MES[b.mes] + " e peso sobre o faturamento",
        '<div class="rl-tab rl-tab-txt2"><table><thead><tr><th>Efeito</th><th>Natureza</th><th>Valor</th><th>% do faturamento</th></tr></thead><tbody>' +
        "<tr><td>Perdas de receita" + (rc.perdaRI != null ? " (Receita Ideal)" : " (PR)") + "</td><td>faturamento que não entrou por recurso indisponível</td><td>" + moeda(perda || 0) + "</td><td>" + pf(perda || 0) + "</td></tr>" +
        "<tr><td>Descontos de SLA</td><td>desconto contratual direto no faturamento</td><td>" + moeda(rc.sla || 0) + "</td><td>" + pf(rc.sla || 0) + "</td></tr>" +
        "<tr><td>Recursos não faturáveis</td><td>custo de quem não gera faturamento</td><td>" + moeda(rc.nf || 0) + "</td><td>" + pf(rc.nf || 0) + "</td></tr>" +
        (rc.dil != null ? "<tr><td>Recursos diluídos <i>(informativo)</i></td><td>custo de quem fica diluído nos serviços; não entra no resultado potencial</td><td>" + moeda(rc.dil || 0) + "</td><td>" + pf(rc.dil || 0) + "</td></tr>" : "") +
        "</tbody></table>" + (rc.perdaRI != null ? '<p class="rl-nota">Conferência: perda pela Receita Ideal ' + moeda(rc.perdaRI) + " · pela PR " + moeda(rc.perdaPR) + ".</p>" : "") + "</div>") + "</div>";
    }
    if (S.ri) r2 += figura("De onde vem a perda de receita", "por mês, maiores motivos do período (Receita Ideal)", chMotivos(S.meses, S.ri),
      '<div class="bk-leg">' + S.ri.top.map(function (x, i) { return '<span><i style="background:' + CORES_MOTIVO[i] + '"></i>' + esc(x[0].charAt(0) + x[0].slice(1).toLowerCase()) + " · " + moeda(x[1].reduce(function (a, v) { return a + v; }, 0)) + "</span>"; }).join("") + "</div>");
    if ((S.anos && S.anos.length) || S.assert) r2 += '<div class="rl-duas">' + (S.anos && S.anos.length ? figura("Perda de receita por ano (PR)", "valor e % sobre o faturamento do período", chAnos(S.anos)) : "") +
      (S.assert ? figura("Assertividade do FCST do resultado", "diferença de margem real x FCST do mês anterior (p.p.) e % de meses assertivos no ano", chAssert(S.meses, S.assert)) : "") + "</div>";
    p4 += sub("Receita: o que entrou, o que se perdeu e o que custou sem faturar") + r2;
    if (an) {
      var tab = '<div class="rl-tab"><table><thead><tr><th>Conta</th><th>Real jan–' + MES[b.mes] + '</th><th>Orçado</th><th>Orçado na proporção do faturamento</th><th>Desvio</th></tr></thead><tbody>' +
        an.contas.slice(0, 10).map(function (x) {
          return "<tr><td>" + esc(String(x.conta).replace(/^\d+\s*-\s*/, "")) + "</td><td>" + moeda(Math.abs(x.real)) + "</td><td>" + (!x.exec ? "não orçado" : moeda(Math.abs(x.exec))) + "</td><td>" + moeda(Math.abs(x.prop)) +
            '</td><td class="' + (x.desvio < 0 ? "neg" : "pos") + '">' + moeda(x.desvio) + "</td></tr>";
        }).join("") + "</tbody></table><p class=\"rl-nota\">Orçado na proporção = executivo × (faturamento real ÷ faturamento executivo): o que a conta poderia ter custado com o volume que de fato foi faturado. Desvio negativo = custou mais que a proporção.</p></div>";
      var pr = c.promessa;
      var fPonte = figura("Ponte da margem: do orçado ao realizado", "pontos de margem que cada grupo de custo tirou (vermelho) ou devolveu (verde), jan a " + MES[b.mes], chPonte(an));
      var fProm = pr && pr.meses && pr.meses.length ? figura("O que os FCSTs prometeram e o que foi entregue no ano", "soma, de " + MES[pr.meses[0]] + " a " + MES[pr.meses[pr.meses.length - 1]] + ", do resultado previsto no FCST do mês anterior x o realizado, por grupo", chPromessa(pr)) : "";
      var fo0 = c.folha;
      p4 += sub("Custos e margem: o custo acompanhou o faturamento e o efetivo?") +
        '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.custos) + "</div>" + figura("As contas que mais descolaram do faturamento", "", tab) + "</div>" +
        (fProm ? '<div class="rl-duas">' + fPonte + fProm + "</div>" : fPonte) +
        (fo0 ? figura("Custo provocado por demissão", "por mês · azul = conta de rescisões (aviso indenizado, 13º e férias de rescisão) · laranja = encargos rescisórios (multa de 40% e FGTS de rescisão) · acima, as demissões do mês", chResc(S.meses, fo0, S.rh)) : "") +
        tabelaCoerencia(S, b, figura);
    }
    p4 += sub("Pessoas: quadro, horas, ausências e férias") + par(t.pessoas) +
      '<div class="rl-duas">' + figura("Efetivo e movimentação", "efetivo da folha; admissões e demissões do mês", chMov(S.meses, S.rh)) + figura("Horas e hora extra", "% de HE e HHT realizado (mil h)", chHHT(S.meses, S.rh)) + "</div>" +
      figura("Acúmulo de férias e transferências", "posição de hoje, em pessoas (ativos e em férias)", quadroFerias(S.rh));
    var g5 = (S.sat && (S.sat.length || S.satMeta != null)) ? '<div class="rl-lado">' + figura("Satisfação do cliente por pesquisa", "barra = resultado · traço = meta do ano", chSat(S.sat, S.satMeta, b.ano)) + "</div>" : "";
    p4 += sub("Segurança, cliente e contrato") + '<div class="rl-flex">' + g5 + '<div class="rl-txt">' + par(t.ssma) + "</div></div>";
    h.push('<section class="rl-cap"><h2><span>4</span>Pontos de atenção: o que precisa melhorar</h2>' + p4 + "</section>");
    // 5. planos
    var EF = { "FUNCIONANDO": "ok", "PARCIAL": "na", "AGUARDANDO": "na", "SEM EFEITO": "bad", "PIOROU": "bad", "SEM PLANO": "bad", "NÃO SE APLICA": "na" };
    var pls = t.planos || [];
    h.push('<section class="rl-cap"><h2><span>5</span>Planos de ação: manter, ajustar, trocar ou criar</h2>' + (pls.length ?
      '<p class="rl-nota">O que o responsável informou nos comentários, confrontado com a apuração real dos meses seguintes. A situação do plano é calculada pelo app.</p><div class="rl-tab rl-tab-txt"><table><colgroup><col style="width:13%"><col style="width:24%"><col style="width:10%"><col style="width:31%"><col style="width:22%"></colgroup><thead><tr><th>Indicador</th><th>O que o responsável informou</th><th>Situação</th><th>Evidência</th><th>Decisão</th></tr></thead><tbody>' +
      pls.map(function (q) { var ef = String(q.efeito || "").toUpperCase().trim(); return "<tr><td>" + esc(q.indicador || "") + '</td><td class="rl-cx">' + esc(q.acao || "") + (q.desde ? "<br><i>desde " + esc(q.desde) + "</i>" : "") + '</td><td><span class="bk-pill ' + (EF[ef] || "na") + '">' + esc(ef || "–") + '</span></td><td class="rl-cx">' + rico(q.texto || "") + '</td><td class="rl-cx">' + rico(q.recomendacao || "") + "</td></tr>"; }).join("") + "</tbody></table></div>"
      : '<p class="rl-nota">Todos os indicadores atenderam no ano.</p>') + "</section>");
    // 6. foco
    h.push('<section class="rl-cap"><h2><span>6</span>Foco do próximo mês</h2><ol class="rl-plano">' + (t.plano || []).map(function (p) {
      return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(p.efeito) + "</span>" : "") + (p.acompanhar ? '<em>Acompanhar: ' + esc(p.acompanhar) + "</em>" : "") + "</li>";
    }).join("") + "</ol></section>");
    // 7. orcamento
    h.push('<section class="rl-cap rl-orc"><h2><span>7</span>Para o orçamento · renovação</h2>' + (t.parecerOrcamento ? '<p class="rl-veredito">' + rico(t.parecerOrcamento) + "</p>" : "") +
      '<div class="bk-orcgrid">' + (t.orcamento || []).map(function (o) { return '<div class="bk-orci"><h4>' + esc(o.titulo || "") + "<span>" + esc(o.valor || "") + "</span></h4><p>" + rico(o.texto || "") + "</p></div>"; }).join("") + "</div></section>");
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Fontes: RESULTADOS (contábil real, executivo e FCST por conta; lançamentos da folha no contábil; folha, ponto, cadastro, rescisões, transferências, férias, perdas e satisfação), RECEITA IDEAL (perdas por motivo, não faturáveis, diluídos e SLA) e ATA_COMENTARIO. Números calculados a partir dessas fontes; textos escritos por IA. Gerado em ' +
      esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }
  function renderRelatorioGrupoV3(b) {
    var G = ordenarOSdoGrupo(b.G), t = b.txt || {}, ger = b.nivel === "ger", an = analisarCustos(G), h = [], fig = 0, nc = 0;
    var MN = mapaNomesOS(G.linhasOS);
    function nm(o) { return nomeOS(o.os, o.desc); }
    function xo(txt) { return expandirOSs(txt, MN); }
    function figura(titulo, cap, corpo) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + "</figure>"; }
    function par(txt) { return xo(txt).split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) { return '<p>' + rico(p) + "</p>"; }).join(""); }
    function cap(n, tit, corpo, cls) { return '<section class="rl-cap' + (cls ? " " + cls : "") + '"><h2><span>' + n + "</span>" + tit + "</h2>" + corpo + "</section>"; }
    function sub(tit) { return '<h3 class="rl-sub">' + tit + "</h3>"; }
    function cel(l, v, s2, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s2 + "</span></div>"; }
    var margR = G.FR ? G.resReal / G.FR : null, margE = G.FE ? G.resExec / G.FE : null, k = G.kpi;
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório da ' + (ger ? "Gerência" : "Superintendência") + '</span><span class="rl-per">janeiro a ' + MESF[b.mes] + " de " + b.ano + "</span></div>" +
      "<h1>" + esc(b.nome) + "</h1>" + '<div class="rl-ficha">' + (ger ? "<span>Superintendente: <b>" + esc(b.sup || "–") + "</b></span>" : "") + "<span>OSs elegíveis: <b>" + G.linhasOS.length + "</b></span>" +
      (b.porGer ? "<span>Gerências: <b>" + b.porGer.length + "</b></span>" : "") + (b.semBook && b.semBook.length ? "<span>Sem dados no painel: <b>" + esc(b.semBook.join(", ")) + "</b></span>" : "") + "</div>" +
      (function () { var tr = G.linhasOS.filter(function (o) { return o.trocas && o.trocas.length; }); return tr.length ? '<div class="rl-alerta" style="margin-top:12px"><b>Trocas de responsáveis no ano</b>' + tr.map(function (o) { return esc(o.desc + ": " + o.trocas.join("; ")); }).join("<br>") + "</div>" : ""; })() + "</header>");
    // 1. onde esta
    var nums = '<div class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", moeda(G.FR), "executivo " + moeda(G.FE), G.FR >= G.FE ? "ok" : "bad") + cel("Resultado", moeda(G.resReal), "executivo " + moeda(G.resExec), G.resReal >= G.resExec ? "ok" : "bad") + cel("Margem", pct(margR), "executivo " + pct(margE), margR >= margE ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Projeção do ano · real + projetado até dez</h3>' +
      cel("Faturamento", moeda(k.fatAno), "meta " + moeda(k.fatMeta), k.fatAno >= k.fatMeta ? "ok" : "bad") + cel("Resultado", moeda(k.resAno), "meta " + moeda(k.resMeta), k.resAno >= k.resMeta ? "ok" : "bad") +
      cel("Margem", pct(k.fatAno ? k.resAno / k.fatAno : null), "meta " + pct(k.fatMeta ? k.resMeta / k.fatMeta : null), (k.fatAno && k.fatMeta && k.resAno / k.fatAno >= k.resMeta / k.fatMeta) ? "ok" : "bad") + "</div></div>";
    h.push(cap(++nc, ger ? "Onde a gerência está" : "Onde a superintendência está", nums + '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.situacao) + "</div>" + figura("Resultado do mês, somando as OSs", "barra = realizado (verde acima do executivo, vermelho abaixo) · traço = executivo do mês", chMesGrupo(G.mesAMes)) + "</div>"));
    // 2. quadro
    var tabOS = '<div class="rl-tab"><table><thead><tr><th>OS</th>' + (ger ? "<th>Gestor</th>" : "<th>Gerente</th>") + "<th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Potencial</th></tr></thead><tbody>" +
      G.linhasOS.map(function (o) {
        return "<tr><td>" + esc(nm(o)) + "</td><td class=\"rl-cx\">" + esc(ger ? o.gestor : o.ger) + "</td><td>" + moeda(o.FR) + "</td><td>" + (o.FE ? (o.FR >= o.FE ? "+" : "") + fmt((o.FR / o.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (o.res < o.rex ? "neg" : "pos") + '">' + moeda(o.res) + "</td><td>" + moeda(o.rex) + "</td><td>" + pct(o.FR ? o.res / o.FR : null) + "</td><td>" + moeda(o.perda) + "</td><td>" + moeda(o.pot) + "</td></tr>";
      }).join("") + "</tbody></table></div>";
    if (ger) h.push(cap(++nc, "Quadro dos contratos", par(t.quadro) + figura("Resultado contra o executivo, por OS", "jan a " + MES[b.mes] + " · vermelho = abaixo do executivo", chGap(G.linhasOS)) + figura("As OSs da gerência", "do pior para o melhor resultado contra o executivo", tabOS)));
    else {
      var tabG = '<div class="rl-tab"><table><thead><tr><th>Gerência</th><th>OSs</th><th>Faturamento</th><th>x executivo</th><th>Resultado</th><th>Executivo</th><th>Margem</th><th>Perdas</th><th>Férias 45+</th><th>Alertas de projeção</th></tr></thead><tbody>' +
        (b.porGer || []).map(function (g) { return "<tr><td>" + esc(g.nome) + "</td><td>" + g.n + "</td><td>" + moeda(g.FR) + "</td><td>" + (g.FE ? (g.FR >= g.FE ? "+" : "") + fmt((g.FR / g.FE - 1) * 100, 2) + "%" : "–") + '</td><td class="' + (g.res < g.rex ? "neg" : "pos") + '">' + moeda(g.res) + "</td><td>" + moeda(g.rex) + "</td><td>" + pct(g.FR ? g.res / g.FR : null) + "</td><td>" + moeda(g.perda) + "</td><td>" + fmt(g.f45) + "</td><td class=\"rl-cx\">" + esc(g.alertas.map(function (c) { return MN[c] || c; }).join(", ") || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>";
      h.push(cap(++nc, "Quadro das gerências", par(t.quadro) + figura("As gerências", "da pior para a melhor contra o executivo", tabG) + figura("As OSs que mais pesam", "as 14 piores contra o executivo", chGap(G.linhasOS))));
    }
    // 3. positivos
    h.push(cap(++nc, "Destaques positivos: o que manter", cardsPositivos(t.positivos, xo)));
    // 4. pontos de atencao
    var rc = G.receita, pot = G.resReal + rc.perda + rc.sla + rc.nf, p4 = "";
    // 23/11/2026: diagnostico integrado do grupo (somas das OSs) antes de receita e custos
    if (G.diag || (G.linhasOS || []).some(function (o) { return o.dg; })) {
      var GD = G.diag || somarDiag(G.linhasOS.map(function (o) { return o.dg; }));
      var linD = G.linhasOS.map(function (o) { return { nome: nm(o), d: o.dg }; });
      p4 += sub("Diagnóstico: efetivo, faturamento e custo, contra o executivo e o FCST anterior") + par(t.diagnostico) +
        (GD.n ? '<div class="rl-duas">' + figura("De onde vem a diferença de resultado contra o executivo", "jan a " + MES[b.mes] + " · soma das OSs", chDiag(GD.RE, GD, GD.RR, "Resultado executivo")) +
          (GD.mes && GD.mes.n ? figura("O mês contra o FCST anterior", MESF[b.mes] + " · soma das OSs com FCST", chDiag(GD.mes.rf, { vol: GD.mes.vol, dFat: GD.mes.dFat, dCus: GD.mes.dCus, resto: GD.mes.resto || 0 }, GD.mes.res, "Resultado no FCST")) : "") + "</div>" : "") +
        figura("Por OS: efetivo e as três parcelas da diferença", "jan a " + MES[b.mes] + " contra o executivo; mês contra o FCST anterior", tabelaDiagGrupo(linD, "OS"));
    }
    var fPot = figura("Resultado potencial do grupo", "sem perdas, SLA e não faturáveis · margem real " + pct(margR) + " → potencial " + pct(G.FR ? pot / G.FR : null), chPotencial({ res: G.resReal, perda: rc.perda, sla: rc.sla, nf: rc.nf }));
    p4 += sub("Receita: perdas, SLA e não faturáveis") + '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.receita) + "</div>" + fPot + "</div>";
    var tabC = '<div class="rl-tab"><table><thead><tr><th>Conta</th><th>Custou a mais que a proporção</th><th>OSs que mais contribuíram</th></tr></thead><tbody>' +
      G.contas.filter(function (c) { return c.desvio < 0; }).slice(0, 8).map(function (c) { return "<tr><td>" + esc(String(c.conta).replace(/^\d+\s*-\s*/, "")) + '</td><td class="neg">' + moeda(-c.desvio) + '</td><td class="rl-cx">' + esc(c.oss.filter(function (o) { return o[1] < 0; }).map(function (o) { return (MN[o[0]] || o[0]) + " " + moeda(-o[1]); }).join(" · ")) + "</td></tr>"; }).join("") + "</tbody></table></div>";
    p4 += sub("Custos e margem") + '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.custos) + "</div>" + figura("As contas que mais pesaram", "", tabC) + "</div>" +
      (an ? figura("Ponte da margem do grupo", "pontos percentuais de margem por grupo de custo, somando as OSs", chPonte(an)) : "");
    var tabP = '<div class="rl-tab"><table><thead><tr><th>OS</th><th>Efetivo</th><th>Adm./dem. no ano</th><th>HE no mês</th><th>Absenteísmo do ano</th><th>Demissões (turnover)</th><th>Férias 30+</th><th>Férias 45+</th><th>Projeção</th></tr></thead><tbody>' +
      G.linhasOS.map(function (o) { return "<tr><td>" + esc(nm(o)) + "</td><td>" + fmt(o.efet) + "</td><td>" + o.adm + " / " + o.dem + "</td><td>" + (o.he == null ? "–" : fmt(o.he, 2) + "%") + "</td><td>" + pct(o.abs) + "</td><td>" + o.demTurn + "</td><td>" + fmt(o.f30) + (o.ferTot && o.f30 != null ? " (" + fmt(o.f30 / o.ferTot * 100, 2) + "%)" : "") + '</td><td class="' + ((o.f45 || 0) > 0 ? "neg" : "") + '">' + fmt(o.f45) + (o.ferTot && o.f45 != null ? " (" + fmt(o.f45 / o.ferTot * 100, 2) + "%)" : "") + '</td><td class="' + (o.alerta ? "neg" : "") + '">' + (o.alerta ? "corrigir" : "ok") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    var al = G.linhasOS.filter(function (o) { return o.alerta; });
    p4 += sub("Pessoas, férias e projeção") + (al.length ? '<div class="rl-alerta"><b>Projeção a corrigir em ' + al.length + (al.length > 1 ? " OSs" : " OS") + "</b>" + al.map(function (o) { return esc(nm(o) + ": " + o.alerta[0]); }).join("<br>") + "</div>" : "") + par(t.pessoas) +
      figura("Pessoas por OS", "férias em pessoas: com 30 dias ou mais de saldo (já têm direito) e com 45 dias ou mais (ponto de atenção), entre parênteses o % das pessoas no contrato (ativos e em férias; afastados e demitidos fora)", tabP);
    h.push(cap(++nc, "Pontos de atenção: o que precisa melhorar", p4));
    // 5. planos
    var comPl = G.linhasOS.filter(function (o) { return o.planos; });
    var conta = function (o, ef) { return (o.planos || []).filter(function (q) { return ef.indexOf(q.efeito) >= 0; }).length; };
    var tabPl = comPl.length ? '<div class="rl-tab"><table><thead><tr><th>OS</th><th>Funcionando</th><th>Parcial</th><th>Sem efeito / piorou</th><th>Sem plano</th><th>Indicadores a trocar ou criar o plano</th></tr></thead><tbody>' +
      comPl.map(function (o) { var ruins = (o.planos || []).filter(function (q) { return ["SEM EFEITO", "PIOROU", "SEM PLANO"].indexOf(q.efeito) >= 0; }); return "<tr><td>" + esc(nm(o)) + "</td><td>" + conta(o, ["FUNCIONANDO"]) + "</td><td>" + conta(o, ["PARCIAL"]) + '</td><td class="' + (conta(o, ["SEM EFEITO", "PIOROU"]) ? "neg" : "") + '">' + conta(o, ["SEM EFEITO", "PIOROU"]) + '</td><td class="' + (conta(o, ["SEM PLANO"]) ? "neg" : "") + '">' + conta(o, ["SEM PLANO"]) + '</td><td class="rl-cx">' + esc(ruins.map(function (q) { return q.indicador; }).join(" · ") || "–") + "</td></tr>"; }).join("") + "</tbody></table></div>" : "";
    var semAval = G.linhasOS.filter(function (o) { return !o.planos; }).map(nm);
    h.push(cap(++nc, "Planos de ação: manter, ajustar, trocar ou criar", par(t.planos) + (tabPl ? figura("Planos por OS", "o que o gestor informou nos comentários, cruzado com os números dos meses seguintes (situação calculada pelo app)", tabPl) : "") +
      (semAval.length ? '<p class="rl-nota">Sem book da OS no mês (planos não avaliados): ' + esc(semAval.join(", ")) + ".</p>" : "")));
    // 6. foco
    h.push(cap(++nc, "Foco do próximo mês", '<ol class="rl-plano">' + (t.plano || []).map(function (p) { return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(xo(p.efeito)) + "</span>" : "") + (p.acompanhar || p.oss ? '<em>' + (p.acompanhar ? "Acompanhar: " + esc(xo(p.acompanhar)) : "") + (p.oss ? " · " + esc(xo(p.oss)) : "") + "</em>" : "") + "</li>"; }).join("") + "</ol>"));
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Dados de todas as OSs elegíveis do acompanhamento, direto do painel (RESULTADOS, RECEITA IDEAL e CTT), janeiro a ' + MESF[b.mes] + ". Textos escritos por IA. Gerado em " + esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }

  // ------------------------------------------------------------------ Pauta da reuniao (Gerencia / Superintendencia)
  // 17/11/2026 (usuario): a reuniao mensal e OS a OS; a regional fica no fim. Tudo sem encargos financeiros.
  // Le os books das OSs do MES DO FILTRO. Cobranca so com registro no mes, pela regra de cada indicador; acoes no fim
  // de cada OS, sempre com o dado. Valores: FCST anterior (mes e acumulado = arquivo FCST do mes), realizado projetado
  // (BASE CONSOLIDADA), contrato (CD) e ponte da margem por conta -- vindos do fluxo (linhas T1/T2/T3/K).
  // ponte da margem por grupo de custo: linhas {nivel, sub, conta, desc, r, b} -> realizado (r) x base (b)
  function ponteGrupos(rows) {
    var isFat = function (x) { return /^3\.1\.1\.[15]/.test(x.sub) || x.conta === "31131006" || x.conta === "31131010"; };
    var FR = 0, FB = 0, TR = 0, TB = 0;
    rows.forEach(function (x) { TR += x.r; TB += x.b; if (isFat(x)) { FR += x.r; FB += x.b; } });
    if (!FR || !FB) return { vazio: !FR ? "fat" : "base" };
    var G = {};
    rows.filter(function (x) { return !isFat(x); }).forEach(function (x) {
      var g = /^3\./.test(x.nivel) ? "3.1.1. DEDUCOES DA RECEITA" : x.nivel, o = G[g] = G[g] || { g: g, pp: 0, contas: [] };
      var pp = (x.r / FR - x.b / FB) * 100;
      o.pp += pp; o.contas.push([x.desc, pp, x.r - x.b * FR / FB]);
    });
    var grupos = Object.keys(G).map(function (q) { return G[q]; }).sort(function (a, b) { return Math.abs(b.pp) - Math.abs(a.pp); })
      .map(function (g) { return { g: g.g, pp: g.pp, top: g.contas.filter(function (c) { return Math.abs(c[1]) >= 0.05; }).sort(function (a, b) { return Math.abs(b[1]) - Math.abs(a[1]); }).slice(0, 4) }; });
    return { FR: FR, FB: FB, mR: TR / FR * 100, mB: TB / FB * 100, grupos: grupos };
  }
  function montarPauta(P, custos, mes) {
    if (!P || !P.t1) return null;
    var tp = String(P.t1.c || "");
    // ano: contas do ano inteiro (BASE CONSOLIDADA) x executivo do ano -- o fluxo devolve sempre o ano em K
    var pAno = ponteGrupos(P.k.map(function (x) { return { nivel: x.nivel, sub: x.sub, conta: x.conta, desc: x.desc, r: x.r, b: x.e }; }));
    // mes: contas do mes do filtro, realizado x FCST anterior (consulta de custos do book)
    var pMes = ponteGrupos((custos || []).filter(function (x) { return +x.MesNo === +mes; }).map(function (x) {
      var dsc = String(x["C.Contabil - Descricao"] || ""); return { nivel: String(x["Nível"] || ""), sub: String(x["Sub Nível I"] || ""), conta: dsc.split(" ")[0], desc: dsc, r: +x.r || 0, b: +x.f || 0 }; }));
    return { tp: tp, fatAno: P.t1.r, resAno: P.t1.e, fatFcAc: P.t1.f, resFcAc: P.t1.g,
      ct: P.t2 ? { fatR: P.t2.r, resR: P.t2.e, fatE: P.t2.f, resE: P.t2.g } : null,
      ind: P.t3 ? { mes: P.t3.r, ac: P.t3.e, custo: P.t3.f, meta: P.t3.g } : null,
      ponteMes: pMes, ponteAno: pAno, ponteAnoOk: P.kAno === true };
  }
  var PA_LIM_EXEC = 0.20;
  function paRs(v) { return v == null || !isFinite(v) ? "–" : (Math.round(v) < 0 ? "R$ (" + fmt(Math.abs(v), 0) + ")" : "R$ " + fmt(Math.abs(v), 0)); }
  function paPc(v) { return v == null || !isFinite(v) ? "–" : fmt(v * 100, 2) + "%"; }
  function paPp(v) { return v == null || !isFinite(v) ? "–" : (v >= 0 ? "+" : "−") + fmt(Math.abs(v * 100), 2) + " p.p."; }
  function paMg(r, f) { return f ? r / f : null; }
  function paDif(a, b) { return a == null || b == null ? null : a - b; }
  function paNeg(v) { return /^R\$ \(|^−|^-/.test(v) ? " pa-neg" : ""; }
  function paLista(linhas, cab) {
    var n3 = linhas.some(function (l) { return l.length > 2; });
    return '<table class="pa-std' + (n3 ? " pa-t4" : "") + '"><colgroup><col class="pa-cn"><col class="pa-clab"><col>' + (n3 ? '<col class="pa-c3">' : "") + "</colgroup>" +
      (cab ? "<thead><tr><th></th>" + cab.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead>" : "") + "<tbody>" +
      linhas.map(function (l, i) { return '<tr><td class="pa-num">' + (i + 1) + '</td><td class="pa-lab">' + l[0] + "</td><td>" + l[1] + "</td>" + (n3 ? "<td>" + (l[2] || "") + "</td>" : "") + "</tr>"; }).join("") + "</tbody></table>";
  }
  function paGrade(tit, sub, cab, linhas, gaps) {
    return '<div class="pa-col"><h4>' + tit + '</h4><p class="pa-sub">' + sub + '</p><table class="pa-gr"><thead><tr><th></th>' + cab.map(function (c) { return "<th>" + c + "</th>"; }).join("") + "</tr></thead><tbody>" +
      linhas.map(function (l) { return '<tr><td class="pa-l">' + l[0] + "</td>" + l.slice(1).map(function (v, i) { return '<td class="' + (i === 0 ? "pa-rl" : i === 1 ? "pa-fc" : "pa-ex") + paNeg(v) + '">' + v + "</td>"; }).join("") + "</tr>"; }).join("") +
      '</tbody></table><div class="pa-gap">' + gaps.map(function (g) { return "<div><span>" + g[0] + '</span><b class="' + (g[1] == null ? "" : g[1] < 0 ? "pa-neg" : "pa-pos") + '">' + paPp(g[1]) + "</b></div>"; }).join("") + "</div></div>";
  }
  function paSemAtiv(d) { if (d.semAtiv) return d.semAtiv; var s = []; for (var m = 1; m <= d.mes; m++) if (!mesComAtividade(d.S, m)) s.push(m); return s; }
  function paCartao(d) {
    var f = d.S.fin || {}, k = d.kpi || {}, m = d.mes, X = d.pauta || {}, fcm = (f.fc || []).filter(function (x) { return x.m === m; })[0] || {};
    var fatM = d.S.rh.fat[m - 1], resM = d.S.rh.res[m - 1], arq = "FCST" + (m < 10 ? "0" : "") + m;
    var c1 = paGrade("Resultado do mês · " + MES[m], "FCST anterior = o FCST feito no mês anterior para " + MES[m] + " (base da assertividade)", ["Realizado", "FCST anterior", "Executivo"],
      [["Faturamento", paRs(fatM), paRs(fcm.fatFc), paRs(fcm.fatEx)], ["Resultado", paRs(resM), paRs(fcm.resFc), paRs(fcm.resEx)], ["Margem", paPc(paMg(resM, fatM)), paPc(paMg(fcm.resFc, fcm.fatFc)), paPc(paMg(fcm.resEx, fcm.fatEx))]],
      [["Realizado − FCST anterior", paDif(paMg(resM, fatM), paMg(fcm.resFc, fcm.fatFc))], ["Realizado − executivo", paDif(paMg(resM, fatM), paMg(fcm.resEx, fcm.fatEx))]]);
    var c2 = paGrade("Resultado acumulado · jan–" + MES[m], "FCST anterior = arquivo " + arq + ", de jan a " + MES[m], ["Realizado", "FCST anterior", "Executivo"],
      [["Faturamento", paRs(f.FR), paRs(X.fatFcAc), paRs(f.FE)], ["Resultado", paRs(f.resReal), paRs(X.resFcAc), paRs(f.resExec)], ["Margem", paPc(paMg(f.resReal, f.FR)), paPc(paMg(X.resFcAc, X.fatFcAc)), paPc(paMg(f.resExec, f.FE))]],
      [["Realizado − FCST anterior", paDif(paMg(f.resReal, f.FR), paMg(X.resFcAc, X.fatFcAc))], ["Realizado − executivo", paDif(paMg(f.resReal, f.FR), paMg(f.resExec, f.FE))]]);
    var c3 = paGrade("Projeção do ano" + (d.ano ? " · " + d.ano : ""), "Faturamento Ano e Resultado Ano da BASE CONSOLIDADA (realizado + projetado até dez)", ["Realizado até " + MES[m], "Realizado projetado", "Executivo"],
      [["Faturamento", paRs(f.FR), paRs(X.fatAno), paRs(k.fatMeta)], ["Resultado", paRs(f.resReal), paRs(X.resAno), paRs(k.resMeta)], ["Margem", paPc(paMg(f.resReal, f.FR)), paPc(paMg(X.resAno, X.fatAno)), paPc(paMg(k.resMeta, k.fatMeta))]],
      [["Realizado projetado − executivo", paDif(paMg(X.resAno, X.fatAno), paMg(k.resMeta, k.fatMeta))]]);
    var ct = X.ct, c4 = X.tp === "CD" && ct ? paGrade("Resultado do contrato · início ao fim", "BASE CONSOLIDADA e EXECUTIVO do contrato, sem corte de ano · sem encargos financeiros", ["Realizado projetado", "Executivo", ""],
      [["Faturamento", paRs(ct.fatR), paRs(ct.fatE), ""], ["Resultado", paRs(ct.resR), paRs(ct.resE), ""], ["Margem", paPc(paMg(ct.resR, ct.fatR)), paPc(paMg(ct.resE, ct.fatE)), ""]],
      [["Realizado projetado − executivo", paDif(paMg(ct.resR, ct.fatR), paMg(ct.resE, ct.fatE))]]) : "<div></div>";
    var desv = k.fatMeta && X.fatAno != null ? X.fatAno / k.fatMeta - 1 : null, desat = desv != null && Math.abs(desv) > PA_LIM_EXEC;
    var alerta = desat ? '<div class="pa-alerta"><b>Executivo possivelmente desatualizado:</b> realizado projetado do ano ' + paRs(X.fatAno) + " × executivo " + paRs(k.fatMeta) + " (" + (desv > 0 ? "+" : "−") + paPc(Math.abs(desv)) + "). Se houve aditivo com aumento ou redução de efetivo, a <b>solicitação de revisão do executivo é responsabilidade da Operação responsável pela OS</b>.</div>" : "";
    return { html: (d.pauta ? "" : '<div class="pa-alerta">Este book foi gerado antes da pauta: FCST anterior acumulado, realizado projetado, contrato e ponte da margem aparecem depois de gerar o book da OS de novo.</div>') + alerta +
      '<div class="pa-cartao">' + c1 + c2 + '</div><div class="pa-cartao">' + c3 + c4 + "</div>", desat: desat ? { fcst: X.fatAno, exec: k.fatMeta, desv: desv } : null };
  }
  function paPonteCaixa(P, o) {
    var dm = P.mR - P.mB, dF = P.FR - P.FB, sinal = function (v) { return (v > 0 ? "+" : v < 0 ? "−" : "") + fmt(Math.abs(v), 2) + " p.p."; };
    var semReal = o.semReal || {}, nSR = 0;
    var linhas = P.grupos.filter(function (g) { return Math.abs(g.pp) >= 0.05; }).map(function (g) {
      var sr = semReal[g.g]; if (sr) nSR++;
      return [esc(g.g.replace(/^[\d.]+\s*/, "")) + (sr ? '<br><small class="pa-prov">sem lançamento real no mês · ' + o.baseTxt + " previa " + paRs(-sr) + "</small>" : ""), '<span class="pa-ppv ' + (g.pp < 0 ? "pa-neg" : "pa-pos") + '">' + sinal(g.pp) + "</span>",
        g.top.map(function (c) { return esc(String(c[0]).replace(/^\d+\s*-\s*/, "")) + ' <span class="' + (c[1] < 0 ? "pa-neg" : "pa-pos") + '">' + sinal(c[1]) + "</span> <small>(" + (c[2] < 0 ? paRs(-c[2]) + " acima" : paRs(c[2]) + " abaixo") + " da proporção)</small>"; }).join("<br>")];
    });
    return '<div class="pa-box pa-larga pa-ponte"><h5>' + o.nome + "</h5>" +
      '<p class="pa-esc"><span><b>Período:</b> ' + o.per + '</span><span><b>Comparação:</b> ' + o.cmp + '</span><span>sem encargos financeiros</span></p>' +
      '<p class="pa-ponte-res">' + o.base + ' <b>' + paPc(P.mB / 100) + "</b> → " + o.real + " <b>" + paPc(P.mR / 100) + '</b> = <span class="' + (dm < 0 ? "pa-neg" : "pa-pos") + '">' + sinal(dm) + "</span></p>" +
      '<p class="pa-nota">Faturamento ' + paRs(P.FR) + " × " + o.baseTxt + " " + paRs(P.FB) + " (" + (dF >= 0 ? "+" : "−") + paPc(Math.abs(dF / P.FB)) + "). <b>Pontos de margem</b> = peso do custo no faturamento do " + o.baseTxt + " menos o peso no " + o.real + ": (+) o grupo aumentou a margem, (−) reduziu. <b>R$</b> = quanto o custo ficou acima ou abaixo do que o " + o.baseTxt + " gastaria com o faturamento " + o.real + ".</p>" +
      (nSR ? '<p class="pa-alerta">Há grupo sem nenhum lançamento real no mês (marcado abaixo): confirmar com a OS se o custo ainda vai entrar (lançamento atrasado) ou se de fato não houve gasto. Se o lançamento entrar depois, a margem do mês muda.</p>' : "") +
      (linhas.length ? paLista(linhas, ["Grupo de custo", "Pontos de margem", "Principais contas"]) : '<p class="pa-nota">Nenhum grupo moveu a margem em 0,05 p.p. ou mais.</p>') + "</div>";
  }
  function paPonte(d) {
    var X = d.pauta; if (!X) return "";
    if (!X.ponteMes && !X.ponteAno) return X.ponte ? '<div class="pa-alerta">A explicação da margem por grupo de custo agora é do mês (× FCST anterior) e do ano (× executivo): gere o book desta OS de novo para aparecer.</div>' : "";
    var m = MES[d.mes], h = "";
    var vz = X.ponteMes && X.ponteMes.vazio;
    // grupo sem lancamento real no mes (ex.: deducoes ainda nao lancadas) -- pelas linhas do mes do book
    var semReal = {}, acc = {};
    ((d.S.fin || {}).linhas || []).forEach(function (l) {
      var niv = String(l[0] || ""), sub = String(l[1] || ""); if (/^3\.1\.1\.[15]/.test(sub)) return;
      var g = /^3\./.test(niv) ? "3.1.1. DEDUCOES DA RECEITA" : niv, a = acc[g] = acc[g] || { r: 0, f: 0 }; a.r += +l[4] || 0; a.f += +l[5] || 0; });
    Object.keys(acc).forEach(function (g) { if (Math.abs(acc[g].r) < 1 && acc[g].f <= -1) semReal[g] = acc[g].f; });
    h += X.ponteMes && !vz ? paPonteCaixa(X.ponteMes, { nome: "Margem do mês por grupo de custo · " + m, per: m + " (só o mês)", cmp: "realizado × FCST ANTERIOR (o FCST feito no mês anterior para " + m + ")", base: "FCST anterior", baseTxt: "FCST anterior", real: "realizado", semReal: semReal })
      : '<div class="pa-box pa-larga"><h5>Margem do mês por grupo de custo · ' + m + '</h5><p class="pa-nota">' + (vz === "fat" ? "Sem faturamento realizado em " + m + ": não há margem do mês para explicar." : "Sem FCST anterior por conta para " + m + ": não há com o que comparar.") + "</p></div>";
    if (X.ponteAno && X.ponteAno.vazio) h += '<div class="pa-box pa-larga"><h5>Margem do ano por grupo de custo · ' + (d.ano || "") + '</h5><p class="pa-nota">' + (X.ponteAno.vazio === "fat" ? "Sem faturamento no ano." : "Sem executivo do ano por conta: não há com o que comparar.") + "</p></div>";
    else if (X.ponteAno && X.ponteAnoOk) h += paPonteCaixa(X.ponteAno, { nome: "Margem do ano por grupo de custo · " + (d.ano || ""), per: "ano " + (d.ano || "") + " inteiro, jan a dez (realizado até " + m + " + projetado)", cmp: "realizado projetado × EXECUTIVO do ano", base: "Executivo", baseTxt: "executivo", real: "realizado projetado" });
    else if (X.ponteAno) h += '<div class="pa-alerta">A margem do ano por grupo de custo aparece depois de gerar o book desta OS de novo.</div>';
    return h;
  }
  function paGrafico(d, semAtiv) {
    var f = d.S.fin || {}, m = d.mes, ms = []; for (var i = 1; i <= m; i++) ms.push(i);
    var fcd = function (mm, k) { var x = (f.fc || []).filter(function (z) { return z.m === mm; })[0]; return x ? x[k] : null; };
    var r = ms.map(function (mm) { return semAtiv.indexOf(mm) >= 0 ? null : d.S.rh.res[mm - 1]; }), fc = ms.map(function (mm) { return fcd(mm, "resFc"); }), ex = ms.map(function (mm) { return fcd(mm, "resEx"); });
    var vals = r.concat(fc, ex).filter(function (v) { return v != null; }); var mx = Math.max.apply(null, [0].concat(vals)), mn = Math.min.apply(null, [0].concat(vals)), H = 140, W = 1100, l = 8, bw = (W - l * 2) / ms.length;
    var y = function (v) { return 12 + (mx - v) / ((mx - mn) || 1) * (H - 28); };
    var s = '<line x1="' + l + '" x2="' + (W - l) + '" y1="' + y(0) + '" y2="' + y(0) + '" class="pa-ax"/>';
    ms.forEach(function (mm, i) {
      var x = l + i * bw + bw * 0.3, w = bw * 0.4;
      if (r[i] != null) s += '<rect x="' + x + '" y="' + Math.min(y(r[i]), y(0)) + '" width="' + w + '" height="' + Math.max(1.5, Math.abs(y(r[i]) - y(0))) + '" rx="2" class="' + (r[i] < 0 ? "pa-bneg" : "pa-bpos") + '"><title>' + MES[mm] + ": realizado " + paRs(r[i]) + (fc[i] != null ? " · FCST anterior " + paRs(fc[i]) : "") + (ex[i] != null ? " · executivo " + paRs(ex[i]) : "") + "</title></rect>";
      if (fc[i] != null) s += '<line x1="' + (x - 6) + '" x2="' + (x + w + 6) + '" y1="' + y(fc[i]) + '" y2="' + y(fc[i]) + '" class="pa-mfc"/>';
      if (ex[i] != null) s += '<circle cx="' + (x + w / 2) + '" cy="' + y(ex[i]) + '" r="3.4" class="pa-mex"/>';
      s += '<text x="' + (x + w / 2) + '" y="' + (H - 2) + '" text-anchor="middle" class="pa-tx">' + MES[mm] + (semAtiv.indexOf(mm) >= 0 ? " ·" : "") + "</text>";
    });
    return '<figure class="pa-box pa-larga pa-fig"><h5>Evolução do resultado · jan–' + MES[m] + '</h5><figcaption>Barra = realizado (vermelho = negativo) · traço = FCST anterior · ponto = executivo' + (semAtiv.length ? " · “·” = sem atividade" : "") + '</figcaption><svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none" role="img">' + s + "</svg></figure>";
  }
  var PA_EFP = { "SEM PLANO": "criar plano", "SEM EFEITO": "trocar o plano", "PIOROU": "trocar o plano", "PARCIAL": "ajustar o plano" };
  function paCobranca(d, x) {
    var m = d.mes, i = m - 1, c = (x.strip || "").charAt(i), S = d.S, rh = S.rh, efet = rh.efet[i];
    if (c !== "N") return null;
    var projFut = (S.proj && S.proj.meses) || [], semProj = projFut.length && projFut.every(function (p) { return p.efet == null; });
    var fcm = (S.fin && S.fin.fc || []).filter(function (z) { return z.m === m; })[0] || {}, dd;
    switch (x.id) {
      case 9: dd = "efetivo real " + fmt(efet, 0) + " × projetado " + fmt(rh.efetPR[i], 0) + (semProj ? "; sem projeção de " + MES[projFut[0].m] + " a " + MES[projFut[projFut.length - 1].m] : "");
        return { txt: "Revisar a projeção: " + dd, dado: dd, acao: "revisar a projeção de efetivo" };
      case 10: dd = "HHT real " + fmt(rh.hht[i], 0) + " h × projetado " + fmt(rh.hhtPR[i], 0) + " h"; return { txt: "Revisar a projeção: " + dd, dado: dd, acao: "revisar a projeção de HHT" };
      case 13: { var h = S.qual && S.qual.hex && S.qual.hex[m]; if (!h || !h.acima) return null; var lim = /PARADA/i.test(d.neg || "") ? 60 : 55;
        dd = fmt(h.acima, 0) + (h.acima === 1 ? " funcionário" : " funcionários") + " acima do limite legal de " + lim + " h = " + paPc(efet ? h.acima / efet : null) + " do efetivo (" + fmt(efet, 0) + ")";
        return { txt: dd, acao: "reduzir o número de funcionários acima do limite legal de hora extra" }; }
      case 14: { var q = S.qual && S.qual.fer45 != null ? S.qual.fer45 : rh.fer45; if (!q) return null;
        dd = fmt(q, 0) + (q === 1 ? " pessoa" : " pessoas") + " com mais de 45 dias de férias = " + paPc(efet ? q / efet : null) + " do efetivo (" + fmt(efet, 0) + ")";
        return { txt: dd, acao: "programar a saída de férias de quem passa de 45 dias" }; }
      case 4: { var mr = paMg(rh.res[i], rh.fat[i]), mf = paMg(fcm.resFc, fcm.fatFc); dd = "margem real " + paPc(mr) + " × FCST anterior " + paPc(mf) + " (" + paPp(paDif(mr, mf)) + ")";
        return { txt: dd, acao: "justificar o desvio do FCST de " + MES[m] }; }
      case 11: if (emDesmobilizacao(d.estagio)) return null; dd = "absenteísmo " + paPc(rh.abs[i] != null ? rh.abs[i] / 100 : null) + " × referência " + paPc(d.kpi && d.kpi.absMeta); return { txt: dd, acao: "reduzir o absenteísmo" };
      case 8: { var I = d.pauta && d.pauta.ind; if (!I || I.ac == null) return { txt: String(x.val || ""), acao: "explicar a indenização: " + String(x.val || "") };
        var kp = I.custo ? I.ac / I.custo : null, li = I.custo ? I.meta * I.custo : null;
        dd = "indenização acumulada " + paRs(I.ac) + " = " + paPc(kp) + " do custo de obra (" + paRs(I.custo) + ") × meta " + paPc(I.meta) + " (limite " + paRs(li) + ")" + (I.mes ? "; em " + MES[m] + " " + paRs(I.mes) : "");
        return { txt: dd, acao: "explicar as indenizações" + (I.mes ? " de " + MES[m] + " (" + paRs(I.mes) + ")" : "") + " e trazer o acumulado de " + paPc(kp) + " para a meta de " + paPc(I.meta) + " do custo de obra" }; }
      default: return { txt: String(x.val || ""), acao: String(x.nome || "").toLowerCase() + ": " + String(x.val || "") };
    }
  }
  function paPlanoDe(d, id) { var p = ((d.txt && d.txt.planos) || []).filter(function (q) { return new RegExp("#" + id + "\\b").test(q.indicador); })[0]; return p ? String(p.efeito || "").toUpperCase() : null; }
  function paIndicadores(d, cob, semAtiv) {
    var M = { A: "pa-sa", N: "pa-sn", V: "pa-sv" }, i = d.mes - 1;
    var stDe = function (x) { return String(x.strip || "").split("").map(function (ch, k) { return semAtiv.indexOf(k + 1) >= 0 ? "-" : ch; }).join("").charAt(i); };
    // so entra o que nao atendeu ou ainda nao foi avaliado no mes (ou tem cobranca); o que atendeu sai da lista
    var lista = d.inds.filter(function (x) { var st = stDe(x); return cob[x.id] || (st !== "A" && st !== "-"); });
    var ok = d.inds.filter(function (x) { return stDe(x) === "A" && !cob[x.id]; }), sa = d.inds.filter(function (x) { return stDe(x) === "-" && !cob[x.id]; });
    var rod = '<p class="pa-nota">' + (ok.length ? "Atenderam em " + MES[d.mes] + " e ficaram fora da lista (" + ok.length + "): " + ok.map(function (x) { return "#" + x.id + " " + esc(x.nome); }).join(", ") + "." : "") +
      (sa.length ? (ok.length ? " " : "") + (semAtiv.indexOf(d.mes) >= 0 ? "Sem atividade em " : "Sem apuração em ") + MES[d.mes] + " (" + sa.length + "): " + sa.map(function (x) { return "#" + x.id + " " + esc(x.nome); }).join(", ") + "." : "") + "</p>";
    if (!lista.length) return '<p class="pa-nota">Nenhum indicador fora ou pendente de avaliação em ' + MES[d.mes] + ".</p>" + rod;
    return '<table class="pa-ind"><colgroup><col class="pa-c-ind"><col class="pa-c-strip"><col class="pa-c-sit"><col class="pa-c-val"><col class="pa-c-cob"></colgroup><thead><tr><th>Indicador</th><th>jan → ' + MES[d.mes] + "</th><th>" + MES[d.mes] + "</th><th>Valor do mês</th><th>Cobrança do mês</th></tr></thead><tbody>" +
      lista.map(function (x) {
        var strip = String(x.strip || "").split("").map(function (ch, k) { return semAtiv.indexOf(k + 1) >= 0 ? "-" : ch; }).join(""), st = strip.charAt(i), co = cob[x.id];
        var pill = st === "A" ? '<span class="pa-pill pa-ok">atendeu</span>' : st === "N" ? '<span class="pa-pill pa-bad">não atendeu</span>' : st === "-" ? '<span class="pa-pill pa-x">' + (semAtiv.indexOf(d.mes) >= 0 ? "sem atividade" : "sem apuração") + "</span>" : '<span class="pa-pill pa-na">não avaliado</span>';
        var val = st === "-" ? "–" : String((x.vals && x.vals[i]) || x.val || "");
        return "<tr><td>#" + x.id + " " + esc(x.nome) + '</td><td><span class="pa-strip">' + strip.split("").map(function (ch, k) { return '<i class="' + (M[ch] || "") + '" title="' + MES[k + 1] + '"></i>'; }).join("") + "</span></td><td>" + pill + "</td><td>" + esc(val) + '</td><td class="' + (co ? "pa-cob" : "pa-sem") + '">' + (co ? esc(co.txt) : "–") + "</td></tr>";
      }).join("") + "</tbody></table>" + rod;
  }
  function paBmsi(d) {
    var an = analisarCustos(d.S.fin); var b = an && an.contas.filter(function (c) { return /BMSI/i.test(c.conta); })[0]; var v = b ? b.real : 0;
    var comp = an ? an.contas.filter(function (c) { return /SALARIO|LOCA/i.test(c.conta) && !/BMSI/i.test(c.conta) && c.desvio < 0; }).slice(0, 3) : [];
    return { v: v, comp: comp };
  }
  function paRedutores(d) {
    var ind = function (id) { return d.inds.filter(function (x) { return x.id === id; })[0] || {}; };
    var nN = function (id) { return String(ind(id).strip || "").split("").filter(function (c) { return c === "N"; }).length; };
    var s4 = String(ind(4).strip || "").split(""), aval = s4.filter(function (c) { return c === "A" || c === "N"; }).length, ass = s4.filter(function (c) { return c === "A"; }).length;
    var it = [["SSMA · SAF", nN(15) ? nN(15) + " mês(es) com ocorrência" : "sem ocorrência no ano", nN(15) ? "bad" : "ok"],
      ["SSMA · CAF", nN(16) ? nN(16) + " mês(es) com ocorrência" : "sem ocorrência no ano", nN(16) ? "bad" : "ok"],
      ["Cliente", ind(17).st === "na" || !ind(17).st ? "sem pesquisa no ano" : String(ind(17).val || ""), ind(17).st || "na"],
      ["Boas Práticas", String(ind(20).val || "–"), ind(20).st || "na"],
      ["Assertividade", aval ? ass + " de " + aval + " mês(es) assertivo(s) = " + paPc(ass / aval) : "sem mês com FCST para comparar", aval ? (ass / aval >= 0.5 ? "ok" : "bad") : "na"]];
    return '<div class="pa-box"><h5>Redutores da Meritocracia</h5>' + paLista(it.map(function (x) { return [x[0], '<span class="pa-pill pa-' + x[2] + '">' + (x[2] === "ok" ? "dentro" : x[2] === "bad" ? "em risco" : "sem dado") + "</span> " + esc(x[1])]; })) + '<p class="pa-nota">Faixa de cada redutor pela lista MERITOCRACIA.</p></div>';
  }
  function paBlocoOS(d, n, mesPauta) {
    if (!d) return "";
    var semAtiv = paSemAtiv(d), semTrat = (d.semTrat || []).filter(function (m) { return semAtiv.indexOf(m) < 0; }), t = d.txt || {}, ca = paCartao(d), cob = {};
    d.inds.forEach(function (x) { var dx = Object.assign({}, x, { strip: String(x.strip || "").split("").map(function (ch, k) { return semAtiv.indexOf(k + 1) >= 0 ? "-" : ch; }).join("") }); var c = paCobranca(d, dx); if (c) cob[x.id] = c; });
    var b = paBmsi(d), ac = [];
    if (ca.desat) ac.push(["Executivo", "realizado projetado do ano " + paRs(ca.desat.fcst) + " × executivo " + paRs(ca.desat.exec) + " (" + (ca.desat.desv > 0 ? "+" : "−") + paPc(Math.abs(ca.desat.desv)) + ")", "solicitar a revisão do executivo (responsabilidade da Operação responsável pela OS)"]);
    d.inds.forEach(function (x) { var c = cob[x.id]; if (!c) return; var pl = (x.id === 9 || x.id === 10) ? null : PA_EFP[paPlanoDe(d, x.id)]; ac.push(["#" + x.id + " " + esc(x.nome), esc(c.dado || c.txt), esc(c.acao) + (pl ? " · <em>" + pl + "</em>" : "")]); });
    var coS = (t.coerencia || []).filter(function (c) { return c.mes === MES[d.mes] && c.avaliacao !== "COERENTE"; })[0];
    if (coS) ac.push(["Justificativa de " + MES[d.mes], esc(coS.nota), coS.avaliacao === "INCOERENTE" ? "refazer a justificativa: a atual não explica a variação" : "justificar a variação de faturamento, custo e efetivo do mês"]);
    if (semTrat.indexOf(d.mes) >= 0) ac.push(["Tratativa", "nenhum comentário nem parecer em " + MES[d.mes], "registrar comentários e planos do mês"]);
    var bmsiTxt = !b.v ? "Sem BMSI no período." : b.v < 0 ? "Débito de " + paRs(-b.v) + ": a OS recebeu custo de outras OSs." : "Crédito de " + paRs(b.v) + ": a OS repassou custo para outras OSs.";
    var bmsiComp = b.v && b.comp.length ? (b.v > 0 ? "O crédito pode compensar: " : "Contas acima da proporção (o débito não compensa): ") + b.comp.map(function (c) { return String(c.conta).replace(/^\d+\s*-\s*/, "") + " " + paRs(-c.desvio); }).join(" · ") : "";
    var outroMes = d.mes !== mesPauta ? '<div class="pa-alerta">Book de ' + MES[d.mes] + ", não de " + MES[mesPauta] + ": gere o book desta OS para o mês do filtro.</div>" : "";
    return '<section class="pa-os" id="pa-os-' + esc(d.os) + '"><header><span class="pa-n">' + (n + 1) + "</span><div><h2>" + esc(d.desc || d.os) + "</h2><p>Responsável <b>" + esc(d.gestor || "–") + "</b> · Estágio <b>" + esc(d.estagio || "–") + "</b>" +
      (semAtiv.length ? " · Sem atividade <b>" + semAtiv.map(function (m) { return MES[m]; }).join(", ") + "</b>" : "") + (semTrat.length ? " · Sem tratativa <b>" + semTrat.map(function (m) { return MES[m]; }).join(", ") + "</b>" : "") + "</p></div></header>" +
      outroMes + ca.html + paPonte(d) +
      "<h3>Indicadores do mês · " + MES[d.mes] + " · não atendidos e não avaliados</h3>" + paIndicadores(d, cob, semAtiv) +
      '<div class="pa-box pa-larga"><h5>Pontos fortes a manter</h5>' + ((t.positivos || []).length ? paLista(t.positivos.map(function (p) { return [esc(p.titulo), esc(p.texto)]; })) : '<p class="pa-nota">Sem destaques no book desta OS.</p>') + "</div>" +
      '<div class="pa-duas"><div class="pa-box"><h5>BMSI · custos transferidos entre OSs</h5>' + paLista([["Saldo", esc(bmsiTxt)]].concat(bmsiComp ? [["Compensação", esc(bmsiComp)]] : [])) + "</div>" + paRedutores(d) + "</div>" +
      '<div class="pa-box pa-larga pa-acoes"><h5>O que a OS precisa fazer <span class="pa-cnt">' + ac.length + "</span></h5>" + (ac.length ? paLista(ac, ["Item", "Situação em " + MES[d.mes], "O que fazer"]) : '<p class="pa-nota">Nada a cobrar em ' + MES[d.mes] + ".</p>") + "</div></section>";
  }
  function renderPauta(nivel, nome, oss, mapaOS, mesPauta) {
    var books = oss.map(function (c) { var r = mapaOS[String(c).toUpperCase()]; return r && r.d && r.d.v >= 2 ? r.d : null; });
    var falta = oss.filter(function (c, i) { return !books[i]; });
    var ds = books.filter(Boolean).sort(function (a, b) { return porCodigoOS(a.os, b.os); });
    if (!ds.length) return '<p class="bk-vazio">Ainda não há book das OSs de ' + esc(nome) + ". Use “☁ Gerar pela nuvem”: o agente gera os books das OSs do mês e a pauta fica pronta.</p>";
    var idx = ds.map(function (d, i) { var nc = d.inds.filter(function (x) { return x.strip && x.strip.charAt(d.mes - 1) === "N"; }).length, X = d.pauta || {}, dv = d.kpi && d.kpi.fatMeta && X.fatAno != null ? X.fatAno / d.kpi.fatMeta - 1 : 0;
      return '<a href="#pa-os-' + esc(d.os) + '" onclick="var e=document.getElementById(\'pa-os-' + esc(d.os) + '\');if(e){e.scrollIntoView({block:\'start\'});}return false;"><span class="pa-n">' + (i + 1) + "</span><b>" + esc(d.desc || d.os) + "</b><small>" + nc + " indicador(es) fora em " + MES[d.mes] + (Math.abs(dv) > PA_LIM_EXEC ? " · <em>executivo a revisar</em>" : "") + "</small></a>"; }).join("");
    // regional: soma das OSs (sem encargos financeiros)
    var T = { FR: 0, FE: 0, RR: 0, RE: 0, fa: 0, ra: 0, fm: 0, rm: 0, bm: 0, cr: 0 };
    ds.forEach(function (d) { var f = d.S.fin || {}, X = d.pauta || {}, k = d.kpi || {}; T.FR += f.FR || 0; T.FE += f.FE || 0; T.RR += f.resReal || 0; T.RE += f.resExec || 0; T.fa += X.fatAno || 0; T.ra += X.resAno || 0; T.fm += k.fatMeta || 0; T.rm += k.resMeta || 0; var b = paBmsi(d).v; T.bm += b; if (b > 0) T.cr++; });
    var nreg = nivel === "ger" ? "da regional" : "da superintendência", anoR = ds[0].ano ? " · " + ds[0].ano : "";
    var reg = '<section class="pa-os" id="pa-regional"><header><span class="pa-n">R</span><div><h2>Resultado da ' + (nivel === "ger" ? "regional" : "superintendência") + "</h2><p>" + esc(nome) + " · " + ds.length + " OSs · jan a " + MES[mesPauta] + "</p></div></header>" +
      '<div class="pa-cartao">' + paGrade("Resultado acumulado " + nreg + " · jan–" + MES[mesPauta], "somando as OSs", ["Realizado", "Executivo", ""], [["Faturamento", paRs(T.FR), paRs(T.FE), ""], ["Resultado", paRs(T.RR), paRs(T.RE), ""], ["Margem", paPc(paMg(T.RR, T.FR)), paPc(paMg(T.RE, T.FE)), ""]], [["Realizado − executivo", paDif(paMg(T.RR, T.FR), paMg(T.RE, T.FE))]]) +
      paGrade("Projeção do ano " + nreg + anoR, "realizado projetado somando as OSs", ["Realizado projetado", "Executivo", ""], [["Faturamento", paRs(T.fa), paRs(T.fm), ""], ["Resultado", paRs(T.ra), paRs(T.rm), ""], ["Margem", paPc(paMg(T.ra, T.fa)), paPc(paMg(T.rm, T.fm)), ""]], [["Realizado projetado − executivo", paDif(paMg(T.ra, T.fa), paMg(T.rm, T.fm))]]) + "</div>" +
      '<h3>Resultado por OS</h3><table class="pa-ind pa-reg"><thead><tr><th>OS</th><th>Faturamento</th><th>Resultado</th><th>Margem</th><th>Realizado projetado</th><th>Executivo ano</th><th>BMSI</th></tr></thead><tbody>' +
      ds.map(function (d) { var f = d.S.fin || {}, X = d.pauta || {}, b = paBmsi(d).v; return "<tr><td>" + esc(d.desc || d.os) + "</td><td>" + paRs(f.FR) + '</td><td class="' + (f.resReal < 0 ? "pa-neg" : "") + '">' + paRs(f.resReal) + "</td><td>" + paPc(paMg(f.resReal, f.FR)) + "</td><td>" + paRs(X.fatAno) + "</td><td>" + paRs(d.kpi && d.kpi.fatMeta) + "</td><td>" + (b ? (b < 0 ? "débito " + paRs(-b) : "crédito " + paRs(b)) : "–") + "</td></tr>"; }).join("") + "</tbody></table>" +
      '<div class="pa-box pa-larga"><h5>BMSI ' + nreg + '</h5>' + paLista([["Saldo", (T.bm < 0 ? "Débito de " + paRs(-T.bm) : "Crédito de " + paRs(T.bm)) + (T.bm && !T.cr ? ". Nenhuma OS do grupo tem crédito: a contrapartida está em OSs de outras regionais." : "")]]) + "</div></section>";
    return '<div class="pa"><div class="pa-top"><h1>Pauta da reunião · ' + (nivel === "ger" ? "Gerência " : "Superintendência ") + esc(nome) + "</h1><p>" + MES[mesPauta] + "/" + anoAtivo() + " · " + ds.length + " OSs · começa pelas OSs; o resultado do grupo fica no fim · todos os valores sem encargos financeiros</p>" +
      (falta.length ? '<div class="pa-alerta">Sem book gerado: ' + esc(falta.join(", ")) + ". Use “☁ Gerar pela nuvem” para gerar os books que faltam.</div>" : "") + "</div>" +
      '<nav class="pa-idx">' + idx + '<a href="#pa-regional" onclick="var e=document.getElementById(\'pa-regional\');if(e){e.scrollIntoView({block:\'start\'});}return false;"><span class="pa-n">R</span><b>Resultado do grupo</b><small>consolidado e BMSI</small></a></nav>' +
      ds.map(function (d, i) { return paBlocoOS(d, i, mesPauta); }).join("") + reg + "</div>";
  }
  var PA_CSS = "\n.pa{--pa-ink:#16233F;--pa-mut:#24324D;--pa-line:#E2E7F0;--pa-bg:#F4F6FA;--pa-navy:#14204A;--pa-ok:#0B7A55;--pa-okb:#E3F4EC;--pa-bad:#B4232A;--pa-badb:#FBE7E8;--pa-na:#7A5B00;--pa-nab:#FFF4D6;color:var(--pa-ink);font-size:20.5px;line-height:1.45}" +
    ".pa-top h1{font-size:31px;margin:0 0 2px;color:var(--pa-navy)}.pa-top p{margin:0 0 8px;color:var(--pa-mut)}" +
    ".pa-idx{display:flex;flex-wrap:wrap;gap:8px;margin:8px 0 16px}.pa-idx a{flex:1 1 210px;display:grid;grid-template-columns:42px 1fr;gap:0 8px;background:#fff;border:1px solid var(--pa-line);border-radius:10px;padding:8px 10px;color:var(--pa-ink);text-decoration:none}.pa-idx small{grid-column:2;color:var(--pa-mut)}.pa-idx em{color:var(--pa-navy);font-style:normal;font-weight:700}" +
    ".pa-n{display:inline-grid;place-items:center;width:38px;height:38px;border-radius:50%;background:var(--pa-navy);color:#fff;font-weight:700;font-size:19px}" +
    ".pa-os{background:#fff;border:1px solid var(--pa-line);border-radius:14px;padding:18px 20px;margin-bottom:18px}.pa-os>header{display:flex;gap:12px;align-items:center;margin-bottom:12px}.pa-os h2{margin:0;font-size:27px;color:var(--pa-navy)}.pa-os>header p{margin:1px 0 0;color:var(--pa-mut)}" +
    ".pa-cartao{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.pa-col{border:1px solid var(--pa-line);border-radius:10px;padding:10px 12px;display:flex;flex-direction:column;min-width:0}.pa-col h4{margin:0;font-size:18.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--pa-navy)}.pa-sub{margin:0 0 4px;font-size:17px;color:var(--pa-mut);min-height:38px}" +
    ".pa-gr{width:100%;border-collapse:collapse;table-layout:fixed}.pa-gr th{font-size:15.5px;color:var(--pa-mut);font-weight:600;text-align:right;padding:2px 4px}.pa-gr th:first-child{width:128px}.pa-gr td{padding:5px 4px;border-top:1px dashed var(--pa-line);text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums;font-size:18.5px}.pa-gr td.pa-l{text-align:left;color:var(--pa-mut)}.pa-gr td.pa-rl{font-size:21px;font-weight:700}.pa-gr td.pa-fc{font-weight:600}.pa-gr td.pa-ex{color:var(--pa-mut)}" +
    ".pa-gap{display:flex;gap:8px;margin-top:auto;padding-top:8px}.pa-gap div{flex:1;background:var(--pa-bg);border-radius:8px;padding:5px 8px}.pa-gap span{display:block;font-size:15.5px;color:var(--pa-mut)}.pa-gap b{font-size:29px;font-variant-numeric:tabular-nums}" +
    ".pa-neg,.pa-gr td.pa-neg{color:var(--pa-bad)}.pa-pos{color:var(--pa-ok)}.pa-alerta{background:#FFF1E8;border:1px solid #F5C6A5;color:#7C2D12;border-radius:10px;padding:8px 12px;margin:0 0 10px}" +
    ".pa-fig{margin:12px 0 0;display:block}.pa-fig figcaption{font-size:17.5px;color:var(--pa-mut)}.pa-fig svg{width:100%;height:140px;display:block}.pa-ax{stroke:#AAB4C5}.pa-bpos{fill:#2F8F6B}.pa-bneg{fill:#C2434A}.pa-mfc{stroke:#334155;stroke-width:3}.pa-mex{fill:#fff;stroke:var(--pa-navy);stroke-width:2}.pa-tx{font-size:17px;fill:var(--pa-mut)}" +
    ".pa h3{margin:16px 0 6px;font-size:18.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--pa-navy)}" +
    ".pa-ind{width:100%;border-collapse:collapse;table-layout:fixed;font-size:18.5px}.pa-ind th{text-align:left;color:var(--pa-mut);font-weight:600;border-bottom:1px solid var(--pa-line);padding:4px 6px}.pa-ind td{border-bottom:1px solid var(--pa-line);padding:5px 6px;vertical-align:middle;line-height:1.35}.pa-ind td:nth-child(2),.pa-ind td:nth-child(3){white-space:nowrap}" +
    "col.pa-c-ind{width:17%}col.pa-c-strip{width:170px}col.pa-c-sit{width:150px}col.pa-c-val{width:27%}col.pa-c-cob{width:34%}td.pa-cob{color:var(--pa-bad);font-weight:600}td.pa-sem{color:#475569}.pa-reg{margin-top:12px}.pa-reg{table-layout:auto}.pa-reg td:not(:first-child),.pa-reg th:not(:first-child){text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}" +
    ".pa-strip{display:inline-flex;gap:2px;vertical-align:middle}.pa-strip i{width:14px;height:14px;border-radius:2px;background:#E2E6EE}.pa-strip i.pa-sa{background:#2F8F6B}.pa-strip i.pa-sn{background:#C2434A}.pa-strip i.pa-sv{background:#E3C766}" +
    ".pa-pill{display:inline-block;border-radius:10px;padding:0 7px;font-size:17px;font-weight:700;white-space:nowrap}.pa-ok{background:var(--pa-okb);color:var(--pa-ok)}.pa-bad{background:var(--pa-badb);color:var(--pa-bad)}.pa-na{background:var(--pa-nab);color:var(--pa-na)}.pa-x{background:#EEF1F5;color:#334155}" +
    ".pa-duas{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}.pa-box{border:1px solid var(--pa-line);border-radius:10px;padding:8px 12px;min-width:0}.pa-box.pa-larga{margin-top:12px}.pa-box h5{margin:0 0 4px;font-size:18.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;color:var(--pa-navy)}.pa-esc{display:flex;flex-wrap:wrap;gap:6px;margin:2px 0 8px}.pa-esc span{background:var(--pa-bg);border:1px solid var(--pa-line);border-radius:6px;padding:2px 8px;font-size:17px;color:var(--pa-ink)}.pa-ponte-res{margin:0 0 4px;font-size:21.5px}.pa-prov{color:#7C2D12;font-weight:600}.pa-ponte-res span{font-weight:700}" +
    ".pa-std{width:100%;border-collapse:collapse;table-layout:fixed}.pa-std col.pa-cn{width:48px}.pa-std col.pa-clab{width:340px}.pa-std col.pa-c3{width:34%}.pa-std th{text-align:left;font-size:17px;color:var(--pa-mut);font-weight:600;padding:3px 6px;border-bottom:1px solid var(--pa-line)}.pa-std td{padding:6px;border-top:1px solid var(--pa-line);vertical-align:top;line-height:1.4}.pa-std td.pa-num{color:var(--pa-mut);text-align:right;padding-right:10px}.pa-std td.pa-lab{font-weight:700;color:var(--pa-navy)}" +
    ".pa-acoes em{color:var(--pa-navy);font-style:normal;font-weight:700;text-decoration:underline}.pa-cnt{background:var(--pa-badb);color:var(--pa-bad);border-radius:10px;padding:0 7px;font-size:18px}.pa-nota{font-size:17px;color:var(--pa-mut);margin:4px 0 0}.pa-ponte .pa-std col.pa-c3{width:auto}.pa-ponte .pa-std.pa-t4 col:nth-child(3){width:190px}.pa-ppv{font-size:23px;font-weight:700}.pa-ponte td small{color:var(--pa-mut)}" +
    ".bk-vista{display:inline-flex;border:1px solid #CBD5E1;border-radius:8px;overflow:hidden;margin-left:8px}.bk-vista button{border:0;background:#fff;padding:6px 12px;font-size:18.5px;cursor:pointer;color:#14204A}.bk-vista button.on{background:#14204A;color:#fff}" +
    "@media(max-width:1100px){.pa-cartao,.pa-duas{grid-template-columns:1fr}}";
  (function () { var s = document.createElement("style"); s.id = "paCss"; s.textContent = PA_CSS; document.head.appendChild(s); })();


  // ------------------------------------------------------------------ book da Diretoria (empresa por negócio)
  var NEGOCIOS = ["ROTINA", "PARADA", "LOCACOES", "OFICINA", "OVERHEAD"];
  function montarDiretoria(dir, mes) {
    var N = {};
    NEGOCIOS.forEach(function (k) { N[k] = { neg: k, m: {}, linhas: [], oss: [], enc: null }; });
    norm(dir).forEach(function (x) {
      var n = N[String(x.a || "").toUpperCase()]; if (!n) return;
      var m = parseInt(x.mes, 10) || 0;
      if (x.tipo === "D1") { var a = n.m[m] = n.m[m] || {}; a.fr = +x.r || 0; a.fe = +x.e || 0; a.ff = x.f == null ? null : +x.f; a.pr = +x.g || 0; }
      else if (x.tipo === "D2") { var b2 = n.m[m] = n.m[m] || {}; b2.rr = +x.r || 0; b2.re = +x.e || 0; b2.rf = x.f == null ? null : +x.f; }
      else if (x.tipo === "DG") n.linhas.push([x.b, x.c, +x.r || 0, +x.e || 0]);
      else if (x.tipo === "DO") n.oss.push({ os: x.b, desc: x.c || x.b, fr: +x.r || 0, fe: +x.e || 0, rr: +x.f || 0, re: +x.g || 0 });
      else if (x.tipo === "DE") n.enc = { fr: Math.round(+x.r || 0), rr: Math.round(+x.e || 0), n: parseInt(x.f, 10) || 0 };   // OSs encerradas (ja nos totais)
    });
    return NEGOCIOS.map(function (k) {
      var n = N[k], z = { neg: k, FR: 0, FE: 0, RR: 0, RE: 0, perda: 0, fcRes: 0, fcReal: 0, fcFat: 0, fcFatReal: 0, nFc: 0, fatAno: 0, fatMeta: 0, resAno: 0, resMeta: 0, mm: [] };
      for (var m = 1; m <= 12; m++) {
        var a = n.m[m] || {};
        z.fatAno += a.fr || 0; z.fatMeta += a.fe || 0; z.resAno += a.rr || 0; z.resMeta += a.re || 0;
        if (m > mes) continue;
        z.FR += a.fr || 0; z.FE += a.fe || 0; z.RR += a.rr || 0; z.RE += a.re || 0; z.perda += a.pr || 0;
        if (a.rf != null && a.rf !== 0) { z.fcRes += a.rf; z.fcReal += a.rr || 0; z.nFc++; }
        if (a.ff != null && a.ff !== 0) { z.fcFat += a.ff; z.fcFatReal += a.fr || 0; }
        z.mm.push([m, Math.round(a.fr || 0), Math.round(a.rr || 0), Math.round(a.fe || 0), Math.round(a.re || 0), a.rf == null ? null : Math.round(a.rf)]);
      }
      var g = {}; n.linhas.forEach(function (l) { var gr = grupoDaConta(l[0], l[1]); if (!gr) return; var x = g[gr] = g[gr] || { nome: gr, real: 0, exec: 0 }; x.real += l[2]; x.exec += l[3]; });
      z.grupos = Object.keys(g).map(function (q) { var x = g[q]; return { nome: q, real: Math.round(x.real), exec: Math.round(x.exec), dif: Math.round(x.real - x.exec) }; }).sort(function (p, q) { return p.dif - q.dif; });
      z.ponte = (z.FR && z.FE) ? analisarCustos({ FR: z.FR, FE: z.FE, resReal: z.RR, resExec: z.RE, linhas: n.linhas }) : null;
      var oss = n.oss.filter(function (o) { return o.fr || o.rr || o.re; }).map(function (o) { o.gap = o.rr - o.re; return o; }).sort(function (p, q) { return p.gap - q.gap; });
      z.piores = oss.slice(0, 6).filter(function (o) { return o.gap < 0; }).map(function (o) { return [o.os, o.desc, Math.round(o.fr), Math.round(o.fe), Math.round(o.rr), Math.round(o.re)]; });
      z.melhores = oss.slice(-4).reverse().filter(function (o) { return o.gap > 0; }).map(function (o) { return [o.os, o.desc, Math.round(o.fr), Math.round(o.fe), Math.round(o.rr), Math.round(o.re)]; });
      z.nOS = oss.length;
      z.enc = n.enc;
      ["FR", "FE", "RR", "RE", "perda", "fcRes", "fcReal", "fcFat", "fcFatReal", "fatAno", "fatMeta", "resAno", "resMeta"].forEach(function (q) { z[q] = Math.round(z[q]); });
      if (z.ponte) z.ponteG = z.ponte.grupos.map(function (x) { return [x.nome, Math.round(x.pp * 100) / 100]; });
      delete z.ponte;
      return z;
    });
  }
  function promptDiretoria(ano, mes, D) {
    var L = [], T = { FR: 0, FE: 0, RR: 0, RE: 0, fatAno: 0, fatMeta: 0, resAno: 0, resMeta: 0 };
    D.forEach(function (z) { Object.keys(T).forEach(function (q) { T[q] += z[q] || 0; }); });
    L.push("Você é o controller sênior do Setor de Performance da NPE. Escreva o RELATÓRIO DA DIRETORIA de janeiro a " + MESF[mes] + "/" + ano + ": o resultado da empresa por negócio (ROTINA, PARADA, LOCACOES, OFICINA e OVERHEAD), analisado mês a mês, contra o Executivo e o FCST do mês anterior. Todos os meses do período entram, fechados ou não, avaliados pelos números do sistema; não comente fechamento nem validação.");
    L.push("É estratégico e o mais resumido de todos: mostre onde a empresa ganha e perde resultado, quais negócios e quais OSs (com código e descrição) explicam, e as decisões que cabem à diretoria.");
    L.push("");
    L.push("REGRAS");
    L.push("- Use SOMENTE os números dos DADOS, como estão: R$ 1.500.000 (sem centavos a partir de R$ 1.000), R$ 850,00 abaixo disso, negativos entre parênteses, R$ (647.973); percentuais com duas casas. Nunca abrevie (nada de 'mi' ou 'mil'). Custos sempre positivos.");
    L.push("- Compare com o que houver: se o negócio não tem Executivo, compare com o FCST e diga que não há Executivo; o OVERHEAD é custo (resultado negativo): compare o custo real com o Executivo e o FCST e diga se gastou mais ou menos.");
    L.push("- Ao falar de negócios ou OSs, um por linha: cada linha começa com o nome do negócio ou com o código e a descrição da OS; quebre a linha (\\n) a cada um.");
    L.push("- Pessoas são citadas só pelo nome; nunca presuma gênero. Não invente nada; sem registro, diga que não há registro. Todo valor em R$ que você escrever tem que estar nos DADOS ou ser a soma ou a diferença de valores que você cita no mesmo trecho, com as parcelas escritas (ex.: transporte R$ 121.126 e passagens R$ 75.485, total R$ 196.611). Nunca escreva um total sem as parcelas nem um número que não venha dos DADOS.");
    L.push("- Português do Brasil, tom executivo, frases curtas. **Negrito** só para 1 ou 2 números por texto.");
    L.push("- " + REGRA_DIAG + " Na Diretoria, use o DIAGNÓSTICO INTEGRADO de cada negócio (soma das OSs com book) dentro do texto do negócio, dizendo que cobre só essas OSs.");
    L.push("");
    L.push("SAÍDA: responda SOMENTE com um JSON válido, sem texto antes ou depois, sem ```:");
    L.push('{"sumario":"(2 parágrafos, até 900 caracteres: a empresa no período e no ano)","negocios":{' + NEGOCIOS.map(function (k) { return '"' + k + '":"(até 900 caracteres: o negócio contra o Executivo e o FCST, mês a mês quando relevante; efetivo, faturamento e custo juntos pelo diagnóstico, com as parcelas; e as OSs que explicam)"'; }).join(",") + '},"riscos":"(até 700 caracteres: o que ameaça o resultado do ano)","decisoes":[{"acao":"(até 90 caracteres)","efeito":"(até 200 caracteres)","negocio":"(negócio e OSs)"}] (3 a 5 itens)}');
    L.push("");
    L.push("DADOS");
    L.push("EMPRESA (soma dos 5 negócios), JAN A " + MES[mes].toUpperCase() + ": faturamento " + rs(T.FR) + " x executivo " + rs(T.FE) + " | resultado " + rs(T.RR) + " x executivo " + rs(T.RE) + " | margem " + pct(T.FR ? T.RR / T.FR : null) + " x " + pct(T.FE ? T.RE / T.FE : null) + ".");
    L.push("EMPRESA, ANO (real até o mês + projetado no painel até dezembro): faturamento " + rs(T.fatAno) + " x executivo do ano " + rs(T.fatMeta) + " | resultado " + rs(T.resAno) + " x executivo do ano " + rs(T.resMeta) + ".");
    D.forEach(function (z) {
      L.push("");
      L.push("NEGÓCIO " + z.neg + " (" + z.nOS + " OSs/centros com valor):");
      L.push("  jan a " + MES[mes] + ": faturamento " + rs(z.FR) + " x executivo " + (z.FE ? rs(z.FE) : "sem Executivo") + " | resultado " + rs(z.RR) + " x executivo " + (z.FE || z.RE ? rs(z.RE) : "sem Executivo") + " | margem " + pct(z.FR ? z.RR / z.FR : null) + (z.FE ? " x " + pct(z.RE / z.FE) : "") + " | perdas de receita (PR) " + rs(z.perda) + ".");
      if (z.nFc) L.push("  FCST do mês anterior, somando os meses com FCST: prometeu resultado " + rs(z.fcRes) + " e o realizado foi " + rs(z.fcReal) + " (diferença " + rs(z.fcReal - z.fcRes) + "); faturamento previsto " + rs(z.fcFat) + " x realizado " + rs(z.fcFatReal) + ".");
      L.push("  ano: faturamento " + rs(z.fatAno) + " x executivo " + (z.fatMeta ? rs(z.fatMeta) : "sem Executivo") + " | resultado " + rs(z.resAno) + " x executivo " + (z.resMeta ? rs(z.resMeta) : "sem Executivo") + ".");
      L.push("  mês a mês (resultado real x executivo | FCST anterior): " + z.mm.map(function (t) { return MES[t[0]] + " " + rs(t[2]) + " x " + rs(t[4]) + (t[5] != null && t[5] !== 0 ? " | FCST " + rs(t[5]) : ""); }).join(" · ") + ".");
      if (z.ponteG) L.push("  ponte da margem (p.p.; negativo = custou mais que a proporção do faturamento): " + z.ponteG.map(function (x) { return x[0] + " " + (x[1] > 0 ? "+" : "") + fmt(x[1], 2); }).join("; ") + ".");
      L.push("  grupos de custo, real x executivo (custo positivo): " + z.grupos.slice(0, 8).map(function (x) { return x.nome + " " + cu(x.real) + " x " + cu(x.exec); }).join("; ") + ".");
      if (z.piores.length) L.push("  OSs que mais tiraram resultado (resultado real x executivo): " + z.piores.map(function (o) { return o[1] + " " + rs(o[4]) + " x " + rs(o[5]); }).join("; ") + ".");
      if (z.diag) {
        L.push("  DIAGNÓSTICO INTEGRADO (soma das " + z.diagOS.length + " OSs do acompanhamento com book de " + MES[mes] + "; não cobre o negócio inteiro): " + diagLinhaGrupo("total dessas OSs", z.diag));
        z.diagOS.slice().sort(function (a, b) { return (a.d.RR - a.d.RE) - (b.d.RR - b.d.RE); }).slice(0, 6).forEach(function (x) { L.push("    " + diagLinhaGrupo(x.nome, x.d)); });
      } else L.push("  DIAGNÓSTICO INTEGRADO: sem books de OS deste negócio no mês (OVERHEAD e LOCACOES não têm OSs no acompanhamento).");
      if (z.melhores.length) L.push("  OSs que mais somaram: " + z.melhores.map(function (o) { return o[1] + " " + rs(o[4]) + " x " + rs(o[5]); }).join("; ") + ".");
    });
    return L.join("\n");
  }
  function conferirDiretoria(j) {
    var falta = [];
    if (!j || typeof j !== "object") return ["tudo"];
    if (!j.sumario || String(j.sumario).length < 200) falta.push("sumario");
    if (!j.negocios || NEGOCIOS.some(function (k) { return !j.negocios[k]; })) falta.push("negocios");
    if (!j.riscos) falta.push("riscos");
    if (!Array.isArray(j.decisoes) || j.decisoes.length < 2) falta.push("decisoes");
    return falta;
  }
  async function gerarDiretoria(opts) {
    opts = opts || {};
    var ano = opts.ano || anoAtivo(), mes = opts.mes || mesAtivo() || (A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 0);
    if (!(mes >= 1)) throw new Error("Selecione o mês no Power BI.");
    var tk;
    if (opts.token) tk = { login: opts.login, token: opts.token };
    else if (opts.login && opts.senha) {
      var aa = await A.autenticarAcesso(opts.login, opts.senha);
      if (!aa.ok || String(aa.token || "").length !== 64) throw new Error(aa.erro || "O login do agente nao gerou token.");
      tk = { login: String(opts.login).toLowerCase().trim(), token: aa.token };
    } else tk = await obterToken();
    progresso("Lendo o resultado da empresa por negócio no painel…");
    var dados = await lerDadosFluxo("-", ano, mes, tk, opts.urlFluxo, { diretoria: "1" });
    if (!dados.dir || !dados.dir.length) throw new Error("O painel não devolveu os dados por negócio (perfil sem acesso ou fluxo sem a Consulta Dir).");
    var D = montarDiretoria(dados.dir, mes);
    // 23/11/2026: diagnostico por negocio = soma das OSs com book do mesmo mes (a consulta por negocio no modelo
    // estoura o limite de memoria da capacidade; o book de cada OS ja traz o efetivo do executivo e do PR)
    try {
      progresso("Somando o diagnóstico de efetivo dos books das OSs…");
      var bOS = await lerNivel("os", true), porNeg = {};
      Object.keys(bOS).forEach(function (k) {
        var bk = bOS[k].d; if (!bk || bk.mes !== mes || bk.ano !== ano || !bk.S) return;
        if (!bk.S.rh || !bk.S.rh.efetEx) return;   // book da OS anterior a 23/11: sem efetivo do executivo
        var dg = diagResumo(diagEfetivo(bk.S)); if (!dg) return;
        var ng = String(bk.neg || "").toUpperCase(); (porNeg[ng] = porNeg[ng] || []).push({ nome: nomeOS(bk.os, bk.desc), d: dg });
      });
      D.forEach(function (z) { var l = porNeg[String(z.neg).toUpperCase()] || []; z.diagOS = l; z.diag = l.length ? somarDiag(l.map(function (x) { return x.d; })) : null; });
    } catch (eD) { /* sem books de OS: o relatorio segue sem o diagnostico */ }
    var prompt = promptDiretoria(ano, mes, D);
    progresso("A IA está escrevendo o relatório da Diretoria…");
    var gc = await gerarConferido(prompt, conferirDiretoria), j = gc.j, falta = gc.falta;
    if (falta.length) throw new Error("A IA não completou o relatório (faltou: " + falta.join(", ") + ").");
    var s2 = A.sessaoAcesso ? A.sessaoAcesso() : null;
    var book = { v: 2, nivel: "dir", nome: "EMPRESA", ano: ano, mes: mes, em: new Date().toISOString(), por: s2 ? s2.login : "", D: D,
      txt: { sumario: j.sumario, negocios: j.negocios, riscos: j.riscos, decisoes: j.decisoes.slice(0, 5) } };
    if (opts.gravar === false) return book;
    progresso("Gravando no SharePoint…");
    await gravar("dir", "EMPRESA", book);
    return book;
  }
  function chNegocios(D) {
    var xs = D.map(function (z) { return { os: z.neg, desc: z.neg, gap: z.RR - z.RE }; });
    var max = Math.max.apply(null, xs.map(function (o) { return Math.abs(o.gap); }).concat([1]));
    var lh = 34, f = fr(1100, 20 + xs.length * lh, { l: 160, r: 170, t: 10, b: 10 }), mid = f.m.l + f.iw / 2, sc = function (v) { return Math.abs(v) / max * (f.iw / 2 - 10); };
    var s = '<line x1="' + mid + '" x2="' + mid + '" y1="' + f.m.t + '" y2="' + (f.H - f.m.b) + '" stroke="' + COR.muted + '"/>';
    xs.forEach(function (o, i) {
      var y = f.m.t + i * lh, w = sc(o.gap), neg = o.gap < 0;
      s += '<text x="' + (f.m.l - 10) + '" y="' + (y + 21) + '" text-anchor="end" font-size="18" font-weight="700" fill="' + COR.ink + '">' + esc(o.desc) + "</text>";
      s += '<rect x="' + (neg ? mid - w : mid) + '" y="' + (y + 7) + '" width="' + w + '" height="19" rx="2" fill="' + (neg ? COR.red : COR.teal) + '"/>';
      s += '<text x="' + (f.W - 6) + '" y="' + (y + 21) + '" text-anchor="end" font-size="17.5" font-weight="700" fill="' + (neg ? COR.badfg : COR.okfg) + '">' + moeda(o.gap) + "</text>";
    });
    return svg(f, s, "Resultado contra o executivo por negócio");
  }
  // 13/11/2026 (usuario): a Diretoria soma a empresa toda, inclusive as OSs encerradas, cada uma no seu negocio.
  // So uma nota discreta com o valor delas (jan ate o mes); livros gravados antes nao tem o dado e nao mostram a nota.
  function notaEncerradas(D, mes) {
    var xs = D.filter(function (z) { return z.enc && (z.enc.fr || z.enc.rr); });
    if (!xs.length) return "";
    return '<p class="rl-nota-enc">Os totais incluem as OSs encerradas, cada uma no seu negócio (jan a ' + MES[mes] + "): " +
      xs.map(function (z) { return esc(z.neg) + (z.enc.fr ? " faturamento " + moeda(z.enc.fr) + "," : "") + " resultado " + moeda(z.enc.rr) + (z.enc.n ? " (" + z.enc.n + (z.enc.n === 1 ? " centro de custo)" : " centros de custo)") : ""); }).join("; ") + ".</p>";
  }
  function renderRelatorioDir(b) {
    var D = b.D, t = b.txt || {}, h = [], fig = 0, nc = 0, T = { FR: 0, FE: 0, RR: 0, RE: 0, fatAno: 0, fatMeta: 0, resAno: 0, resMeta: 0 };
    D.forEach(function (z) { Object.keys(T).forEach(function (q) { T[q] += z[q] || 0; }); });
    function figura(titulo, cap, corpo) { fig++; return '<figure class="rl-fig"><figcaption><b>Figura ' + fig + ".</b> " + esc(titulo) + (cap ? '<span>' + esc(cap) + "</span>" : "") + "</figcaption>" + corpo + "</figure>"; }
    function par(txt) { return String(txt || "").split(/\n+/).map(function (p) { return p.trim(); }).filter(Boolean).map(function (p) { return '<p>' + rico(p) + "</p>"; }).join(""); }
    function cap(n, tit, corpo, cls) { return '<section class="rl-cap' + (cls ? " " + cls : "") + '"><h2><span>' + n + "</span>" + tit + "</h2>" + corpo + "</section>"; }
    function cel(l, v, s2, cls) { return '<div class="rl-num ' + (cls || "") + '"><span class="l">' + l + '</span><span class="v">' + v + '</span><span class="s">' + s2 + "</span></div>"; }
    h.push('<header class="rl-capa"><div class="rl-capa-top"><span class="rl-tag">Relatório da Diretoria</span><span class="rl-per">janeiro a ' + MESF[b.mes] + " de " + b.ano + '</span></div><h1>Resultado da empresa por negócio</h1><div class="rl-ficha"><span>ROTINA · PARADA · LOCACOES · OFICINA · OVERHEAD</span></div></header>');
    h.push('<section class="rl-nums"><div class="rl-nums-g"><h3>Jan a ' + MES[b.mes] + " · realizado x executivo</h3>" +
      cel("Faturamento", moeda(T.FR), "executivo " + moeda(T.FE), T.FR >= T.FE ? "ok" : "bad") + cel("Resultado", moeda(T.RR), "executivo " + moeda(T.RE), T.RR >= T.RE ? "ok" : "bad") + cel("Margem", pct(T.FR ? T.RR / T.FR : null), "executivo " + pct(T.FE ? T.RE / T.FE : null), (T.FR && T.FE && T.RR / T.FR >= T.RE / T.FE) ? "ok" : "bad") +
      '</div><div class="rl-nums-g"><h3>Ano · real + projetado até dez</h3>' +
      cel("Faturamento", moeda(T.fatAno), "executivo " + moeda(T.fatMeta), T.fatAno >= T.fatMeta ? "ok" : "bad") + cel("Resultado", moeda(T.resAno), "executivo " + moeda(T.resMeta), T.resAno >= T.resMeta ? "ok" : "bad") + cel("Margem", pct(T.fatAno ? T.resAno / T.fatAno : null), "executivo " + pct(T.fatMeta ? T.resMeta / T.fatMeta : null), "") + "</div></section>");
    var tab = '<div class="rl-tab"><table><thead><tr><th>Negócio</th><th>Faturamento</th><th>Executivo</th><th>Resultado</th><th>Executivo</th><th>FCST anterior</th><th>Margem</th><th>Resultado do ano</th><th>Executivo do ano</th></tr></thead><tbody>' +
      D.map(function (z) { return "<tr><td>" + esc(z.neg) + "</td><td>" + moeda(z.FR) + "</td><td>" + (z.FE ? moeda(z.FE) : "sem Executivo") + '</td><td class="' + (z.RR < z.RE ? "neg" : "pos") + '">' + moeda(z.RR) + "</td><td>" + (z.FE || z.RE ? moeda(z.RE) : "sem Executivo") + "</td><td>" + (z.nFc ? moeda(z.fcRes) + " → " + moeda(z.fcReal) : "–") + "</td><td>" + pct(z.FR ? z.RR / z.FR : null) + "</td><td>" + moeda(z.resAno) + "</td><td>" + (z.resMeta ? moeda(z.resMeta) : "sem Executivo") + "</td></tr>"; }).join("") + "</tbody></table><p class=\"rl-nota\">FCST anterior: soma do resultado previsto no FCST do mês anterior → realizado nos mesmos meses.</p></div>";
    h.push(cap(++nc, "Sumário executivo", '<div class="rl-duas rl-duas-txt"><div class="rl-txt">' + par(t.sumario) + "</div>" + figura("Resultado contra o executivo, por negócio", "jan a " + MES[b.mes] + " · vermelho = abaixo do executivo", chNegocios(D)) + "</div>" + figura("Os negócios", "", tab) + notaEncerradas(D, b.mes)));
    D.forEach(function (z) {
      var tabO = (z.piores.length || z.melhores.length) ? '<div class="rl-tab"><table><thead><tr><th>OS / centro de custo</th><th>Faturamento</th><th>Resultado</th><th>Executivo</th></tr></thead><tbody>' +
        z.piores.concat(z.melhores).map(function (o) { return "<tr><td>" + esc(o[1]) + "</td><td>" + moeda(o[2]) + '</td><td class="' + (o[4] < o[5] ? "neg" : "pos") + '">' + moeda(o[4]) + "</td><td>" + moeda(o[5]) + "</td></tr>"; }).join("") + "</tbody></table></div>" : "";
      var fDg = z.diag && z.diag.n ? '<div class="rl-duas">' + figura("Efetivo, faturamento e custo · " + z.neg, "soma das " + z.diagOS.length + " OSs com book de " + MES[b.mes] + " (não cobre o negócio inteiro)", chDiag(z.diag.RE, z.diag, z.diag.RR, "Resultado executivo")) +
        figura("Por OS: as três parcelas da diferença", "jan a " + MES[b.mes], tabelaDiagGrupo(z.diagOS.slice().sort(function (a, b2) { return (a.d.RR - a.d.RE) - (b2.d.RR - b2.d.RE); }).slice(0, 10), "OS")) + "</div>" : "";
      h.push(cap(++nc, z.neg, par(t.negocios && t.negocios[z.neg]) + figura("Resultado do mês · " + z.neg, "barra = realizado · traço = executivo do mês", chMesGrupo(z.mm)) + fDg + (tabO ? figura("OSs que mais tiraram e mais somaram resultado", "jan a " + MES[b.mes], tabO) : "")));
    });
    h.push(cap(++nc, "Riscos para o ano", par(t.riscos)));
    h.push(cap(++nc, "Decisões", '<ol class="rl-plano">' + (t.decisoes || []).map(function (p) { return "<li><b>" + esc(p.acao || "") + "</b>" + (p.efeito ? "<span>" + rico(p.efeito) + "</span>" : "") + (p.negocio ? "<em>" + esc(p.negocio) + "</em>" : "") + "</li>"; }).join("") + "</ol>"));
    h.push('<div class="bk-fontes">' + NOTA_ENC + 'Resultado da empresa por negócio direto do painel RESULTADOS (realizado, Executivo e FCST do mês anterior). Textos escritos por IA. Gerado em ' + esc(new Date(b.em).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" })) + (b.por ? " por " + esc(b.por) : "") + ".</div>");
    return '<article class="rl">' + h.join("") + "</article>";
  }
  async function renderDir(box) {
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() +
      (master() ? '<span class="bk-acoes">' + (temChaveIA() ? '<button type="button" class="bk-bt sec" data-action="book:gerardir">🤖 Gerar agora (neste navegador)</button>' : "") +
        '<button type="button" class="bk-bt" data-action="book:nuvemdir" title="O agente da nuvem gera e grava o relatório da Diretoria">☁ Gerar pela nuvem</button></span>' : "") +
      '</div><div id="bkProgresso" class="bk-prog" style="display:none"></div><div id="bkConteudo"><p class="bk-vazio">Carregando…</p></div></div>';
    if (_prog) progresso(_prog);
    try {
      var mapa = await lerNivel("dir"), reg = mapa.EMPRESA, c = el("bkConteudo");
      if (c) c.innerHTML = reg && reg.d ? renderRelatorioDir(reg.d) : '<p class="bk-vazio">Ainda não há relatório da Diretoria gravado.</p>';
    } catch (e) { var c2 = el("bkConteudo"); if (c2) c2.innerHTML = '<p class="bk-vazio">Não consegui ler o relatório: ' + esc(e.message || e) + "</p>"; }
  }

  // ------------------------------------------------------------------ tela
  var _prog = "";
  function progresso(t) { _prog = t; var p = el("bkProgresso"); if (p) { p.style.display = t ? "block" : "none"; p.textContent = t; } }
  // 18/11/2026 -- acesso por nivel pelo filtro de seguranca do BiExplorer (parametro PortalOS da medida:
  // OSs liberadas pelo portal, ignorando os filtros da pagina; "*" = sem filtro do portal).
  //   gestor do contrato: so a aba OS (as suas)  |  gerente: OS + Gerencia (a sua)
  //   superintendente: OS + Gerencia + Superintendencia (as suas)  |  Negocio/Diretoria: so Master
  // Um grupo so e liberado quando TODAS as OSs dele estao no portal do usuario.
  function acessoPortal() {
    var p = new URLSearchParams(window.location.search), raw = p.get("PortalOS");
    if (raw === null) raw = p.get("AllowedOSList") || "";   // medida antiga: o que esta visivel
    raw = String(raw || "").trim();
    var set = {}; (raw.toUpperCase().match(/[A-Z]\d{5}/g) || []).forEach(function (c) { set[c] = 1; });
    return { todos: raw === "*", oss: set };
  }
  function cobre(grupo, ac) { var cods = (grupo.oss || []).join(" ").toUpperCase().match(/[A-Z]\d{5}/g) || []; return cods.length > 0 && cods.every(function (c) { return ac.oss[c]; }); }
  function gruposLiberados(nivel) {
    var gs = listarGrupos(nivel); if (master()) return gs;
    var ac = acessoPortal(); if (ac.todos) return gs;
    return gs.filter(function (g) { return cobre(g, ac); });
  }
  function nivelLiberado(nivel) {
    if (nivel === "os") return true;
    if (nivel === "dir") return master();
    return master() || acessoPortal().todos || gruposLiberados(nivel).length > 0;
  }
  function osPermitidas() {
    var lista = [];
    try { lista = A.tab5OSElegiveis() || []; } catch (e) { lista = []; }
    if (master()) return lista;
    var ac = acessoPortal(); if (ac.todos) return lista;
    return lista.filter(function (o) { var cods = (String(o.codigo || "") + " " + String(o.rotulo || "")).toUpperCase().match(/[A-Z]\d{5}/g) || []; return cods.some(function (c) { return ac.oss[c]; }); });
  }
  function abas() {
    return '<div class="bk-tabs"><button type="button" class="' + (st.nivel === "os" ? "on" : "") + '" data-action="book:nivel:os">OS</button>' + (nivelLiberado("ger") ? '<button type="button" class="' + (st.nivel === "ger" ? "on" : "") + '" data-action="book:nivel:ger">Gerência</button>' : "") + (nivelLiberado("sup") ? '<button type="button" class="' + (st.nivel === "sup" ? "on" : "") + '" data-action="book:nivel:sup">Superintendência</button>' : "") + (master() ? '<button type="button" class="' + (st.nivel === "dir" ? "on" : "") + '" data-action="book:nivel:dir">Diretoria</button>' : "") + '</div>';
  }
  async function renderGrupo(box) {
    var nivel = st.nivel, ano = anoAtivo(), mes = A.ultimoMesFechado ? A.ultimoMesFechado(ano) : 0, rot = nivel === "ger" ? "Gerência" : "Superintendência";
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() + '</div><div id="bkConteudo"><p class="bk-vazio">Carregando…</p></div></div>';
    var gs = [], mapa = {};
    try { gs = gruposLiberados(nivel); mapa = await lerNivel(nivel); } catch (e) { var c0 = el("bkConteudo"); if (c0) c0.innerHTML = '<p class="bk-vazio">Não consegui ler os books: ' + esc(e.message || e) + "</p>"; return; }
    // acesso pela hierarquia: Master ve todos; os demais, os grupos das suas OSs
    Object.keys(mapa).forEach(function (k) { if (!gs.some(function (g) { return g.nome === k; }) && (master() || false)) gs.push({ nome: k, oss: [] }); });
    var sel = st.sel[nivel] && gs.some(function (g) { return g.nome === st.sel[nivel]; }) ? st.sel[nivel] : (gs[0] ? gs[0].nome : "");
    st.sel[nivel] = sel;
    // 18/11/2026: rede de seguranca da hierarquia (copia diaria do fluxo NPE-Atualizar-Hierarquia): OS elegivel do painel que nao esta em nenhum grupo
    var avisoHier = "";
    if (master()) {
      var naHier = {}; elegiveis().forEach(function (o) { (String(o.codigo || "") + " " + String(o.rotulo || "")).replace(/[A-Z]\d{5}/g, function (c) { naHier[c] = 1; return c; }); });
      var faltam = [];
      (window.ACTIVE_CONTRACTS_CATALOG || []).forEach(function (c) { var cods = String(c.code || "").match(/[A-Z]\d{5}/g) || []; if (cods.length && !cods.some(function (x) { return naHier[x]; }) && faltam.indexOf(cods[0]) < 0) faltam.push(cods[0]); });
      if (faltam.length) avisoHier = '<div class="bk-prog">OS elegível sem gerência/superintendência na hierarquia: <b>' + esc(faltam.sort(porCodigoOS).join(", ")) + "</b>. A hierarquia é atualizada todo dia às 6h pelo fluxo NPE-Atualizar-Hierarquia; se a OS for nova, ela entra na próxima atualização.</div>";
    }
    var itens = gs.map(function (g) { return '<button type="button" class="bk-dd-it' + (g.nome === sel ? " on" : "") + '" data-action="book:grp:' + esc(g.nome) + '" data-busca="' + esc(g.nome) + '">' + esc(g.nome) + (g.oss.length ? " · " + g.oss.length + " OSs" : "") + "</button>"; }).join("");
    box.innerHTML = '<div class="bk-wrap"><div class="bk-nav"><span class="bk-marca">BOOK</span>' + abas() +
      '<div class="bk-dd"><span class="bk-dd-rot">' + rot + '</span><button type="button" class="bk-dd-btn" data-action="book:dd" aria-haspopup="listbox">' + esc(sel || "Nenhum grupo") + '</button>' +
      '<div class="bk-dd-pan" id="bkDdPan" style="display:none"><input type="text" id="bkDdBusca" placeholder="Buscar…" autocomplete="off"><div class="bk-dd-lista" id="bkDdLista" role="listbox">' + (itens || '<p class="bk-dd-vazio">Nenhum grupo.</p>') + "</div></div></div>" +
      '<span class="bk-vista"><button type="button" class="' + (st.vista === "pauta" ? "on" : "") + '" data-action="book:vista:pauta">Pauta da reunião</button><button type="button" class="' + (st.vista !== "pauta" ? "on" : "") + '" data-action="book:vista:rel">Relatório</button></span>' +
      (master() ? '<span class="bk-acoes">' + (temChaveIA() ? '<button type="button" class="bk-bt sec" data-action="book:gerargrp"' + (sel ? "" : " disabled") + ">🤖 Gerar agora (neste navegador)</button>" : "") +
        '<button type="button" class="bk-bt" data-action="book:nuvemgrp" title="O agente da nuvem gera e grava os relatórios de todas as ' + (nivel === "ger" ? "gerências" : "superintendências") + '">☁ Gerar pela nuvem</button></span>' : "") +
      '</div><div id="bkProgresso" class="bk-prog" style="display:none"></div><div class="bk-dica">O relatório da ' + rot.toLowerCase() + " usa os dados de todas as OSs elegíveis do acompanhamento, direto do painel.</div>" + '<div id="bkConteudo"></div></div>';
    var busca = el("bkDdBusca");
    if (busca) busca.oninput = function () { var q = String(busca.value || "").toUpperCase().trim(); Array.prototype.forEach.call(document.querySelectorAll("#bkDdLista .bk-dd-it"), function (b) { b.style.display = (!q || b.getAttribute("data-busca").indexOf(q) >= 0) ? "" : "none"; }); };
    if (_prog) progresso(_prog);
    var c = el("bkConteudo"); if (!c) return;
    if (avisoHier) { var cxH = el("bkConteudo"); if (cxH) cxH.insertAdjacentHTML("beforebegin", avisoHier); }
    var reg = sel ? mapa[sel] : null;
    if (sel && st.vista === "pauta") {
      // pauta: books das OSs do grupo, no mes do filtro
      c.innerHTML = '<p class="bk-vazio">Montando a pauta…</p>';
      try { var mapaOS = await lerNivel("os"), gr0 = gs.filter(function (g) { return g.nome === sel; })[0] || { oss: [] }; var c3 = el("bkConteudo"); if (c3) c3.innerHTML = renderPauta(nivel, sel, gr0.oss, mapaOS, mesAtivo() || mes); }
      catch (e) { var c4 = el("bkConteudo"); if (c4) c4.innerHTML = '<p class="bk-vazio">Não consegui montar a pauta: ' + esc(e.message || e) + "</p>"; }
      return;
    }
    c.innerHTML = !sel ? '<p class="bk-vazio">Nenhuma OS elegível encontrada.</p>' : (reg && reg.d ? renderRelatorioGrupo(reg.d) : '<p class="bk-vazio">Ainda não há relatório gravado para ' + esc(sel) + ".</p>");
  }
  async function render() {
    var box = el("tabBookContainer"); if (!box) return;
    if (A.garantirHierarquia) { try { await A.garantirHierarquia(); } catch (e) {} }
    if (!nivelLiberado(st.nivel)) st.nivel = "os";
    if (st.nivel === "dir") return renderDir(box);
    if (st.nivel !== "os") return renderGrupo(box);
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
    if (nome === "nivel:os" || nome === "nivel:ger" || nome === "nivel:sup" || nome === "nivel:dir") { st.nivel = nivelLiberado(nome.slice(6)) ? nome.slice(6) : "os"; render(); return; }
    if (nome === "vista:pauta" || nome === "vista:rel") { st.vista = nome === "vista:pauta" ? "pauta" : "rel"; render(); return; }
    if (nome === "gerardir") {
      if (st.carregando) return;
      st.carregando = true;
      try { await gerarDiretoria({}); progresso(""); toast("✅ Relatório gravado."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; render(); }
      return;
    }
    if (nome === "nuvemdir") {
      if (st.carregando) return;
      st.carregando = true;
      try { progresso("Pedindo ao agente da nuvem o relatório da Diretoria…"); await pedirAoAgente("", "aba6d", mesAtivo()); progresso("☁ Pedido enviado. O agente monta e grava o relatório em alguns minutos; depois é só abrir esta aba de novo."); }
      catch (e) { progresso("⚠ " + (e.message || e)); }
      finally { st.carregando = false; }
      return;
    }
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
      var gSel = st.sel[st.nivel], gr = gSel ? listarGrupos(st.nivel).filter(function (x) { return x.nome === String(gSel).toUpperCase(); })[0] : null;
      if (!gr || !gr.oss.length) { progresso("⚠ Escolha a " + (st.nivel === "ger" ? "gerência" : "superintendência") + " na lista antes de pedir ao agente."); st.carregando = false; return; }
      // o agente recebe os CODIGOS das OSs do grupo (o nome tem espaco e o campo os e separado por espaco/virgula):
      // aba6f = book de cada OS que ainda nao tem o book deste mes; depois o relatorio do grupo
      try { progresso("Pedindo ao agente da nuvem o relatório de " + gSel + " (" + MESF[mesAtivo()] + "), gerando antes os books de OS que faltam…"); await pedirAoAgente(gr.oss.join(","), (st.nivel === "ger" ? "aba6f,aba6g" : "aba6f,aba6s"), mesAtivo()); progresso("☁ Pedido enviado. O agente gera os books de OS que faltam e depois o relatório (de 10 a 30 minutos, conforme o número de OSs); depois é só abrir esta aba de novo."); }
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
      try { progresso("Pedindo ao agente da nuvem o book de " + st.sel.os + "…"); await pedirAoAgente(st.sel.os, "aba6", mesAtivo()); progresso("☁ Pedido enviado. O agente gera e grava o book de " + st.sel.os + " em alguns minutos; depois é só abrir esta aba de novo."); }
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

  window.BOOK = { lerGestoresCTT: lerGestoresCTT, render: render, acao: acao, gerarOS: gerarOS, lerNivel: lerNivel, _promptOS: promptOS, _coletarOS: coletarOS, _montarSeries: montarSeries, _renderBookOS: renderBookOS, _renderRelatorioOS: renderRelatorioOS, _analisarCustos: analisarCustos, _montarFin: montarFin, _conferirProjecao: conferirProjecao, gerarGrupo: gerarGrupo, listarGrupos: listarGrupos, gerarDiretoria: gerarDiretoria, _montarDiretoria: montarDiretoria, _renderRelatorioDir: renderRelatorioDir, _agregarGrupo: agregarGrupo, _promptGrupo: promptGrupo, _renderRelatorioGrupo: renderRelatorioGrupo, _renderPauta: renderPauta, _gruposLiberados: gruposLiberados, _nivelLiberado: nivelLiberado, _osPermitidas: osPermitidas, _montarPauta: montarPauta, _resumoRpcoOS: resumoRpcoOS, _resumoLinhas: resumoLinhas, _resumoHTML: resumoHTML };
})();
