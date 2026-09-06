/* Profile asset build.
   The chart plots what has actually been built, by domain, over successive
   entries. Repositories are the only bright marks; everything else is axis.
   Palette + type from hetpatel-lemon.vercel.app.
   Run: node build.mjs        Daily edit: record.json                        */
import fs from 'fs';

const AR = fs.readFileSync('.fonts/archivo.b64', 'utf8');
const PX = fs.readFileSync('.fonts/plex.b64', 'utf8');
const R = JSON.parse(fs.readFileSync('record.json', 'utf8'));

const DOM = R.domains;
const rowOf = id => DOM.findIndex(d => d.id === id);
const shipped = R.entries.filter(e => !e.open);
const filled = new Set(shipped.flatMap(e => e.domains));
const openEntry = R.entries.find(e => e.open);
const reposIn = id => shipped.filter(e => e.domains.includes(id)).map(e => e.short);

const S = (noFont) => `<style>${noFont ? '' : `
@font-face{font-family:"AR";src:url(data:font/woff2;base64,${AR}) format("woff2");font-weight:800;font-style:normal}
@font-face{font-family:"PX";src:url(data:font/woff2;base64,${PX}) format("woff2");font-weight:400;font-style:normal}`}
svg{
  --paper:#0b0b0b; --ink:#f2f0ec; --grey:#9c988f; --soft:#837f76;
  --rule:rgba(242,240,236,.24); --faint:rgba(242,240,236,.11);
  --sig:#3157ff; --live:#ff6a1a;
}
@media (prefers-color-scheme: light){
  svg{
    --paper:#f7f6f3; --ink:#0b0b0b; --grey:#5c5a54; --soft:#6f6d66;
    --rule:rgba(11,11,11,.22); --faint:rgba(11,11,11,.11);
    --sig:#2447e0; --live:#cc4d0a;
  }
}
.paper{fill:var(--paper)}
.d{font-family:"AR","Helvetica Neue",Helvetica,"Segoe UI",Roboto,Arial,sans-serif;font-weight:800}
.m{font-family:"PX",ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;font-weight:400}
.ink{fill:var(--ink)} .grey{fill:var(--grey)} .soft{fill:var(--soft)}
.sig{fill:var(--sig)} .live{fill:var(--live)}
.r{stroke:var(--rule);stroke-width:1.7;fill:none}
.axis{stroke:var(--rule);stroke-width:1.4;fill:none}
.grid{stroke:var(--faint);stroke-width:1.4;fill:none;stroke-dasharray:2 7}
.ghost{stroke:var(--faint);stroke-width:1.4;fill:none;stroke-dasharray:3 8}
.trace{stroke:var(--sig);stroke-width:2.2;fill:none;stroke-linejoin:round}
.pen{stroke:var(--live);stroke-width:1.8;fill:none}
@keyframes bl{0%,55%{opacity:1}56%,100%{opacity:0}}
.blink{animation:bl 1.2s steps(1) infinite}
@keyframes breathe{0%,100%{opacity:1}50%{opacity:.32}}
.breathe{animation:breathe 2.4s ease-in-out infinite}
@keyframes rise{from{opacity:0;transform:translateY(9px)}to{opacity:1;transform:translateY(0)}}
.u{opacity:0;animation:rise .7s cubic-bezier(.16,1,.3,1) forwards}
@media (prefers-reduced-motion: reduce){*{animation:none!important}.u{opacity:1}}
</style>`;

const W = (f, s) => {
  fs.writeFileSync('assets/' + f, s.trim() + '\n');
  console.log(f.padEnd(22), fs.statSync('assets/' + f).size, 'bytes');
};

/* ══ RECORD — the hero chart ═══════════════════════════════════════ */
{
  const X0 = 210, X1 = 1200, TOP = 274, BOT = 590;
  const rowY = i => 300 + i * 52;
  const colX = i => 300 + i * ((1150 - 300) / (R.slots - 1));

  let yAxis = '', grid = '';
  DOM.forEach((d, i) => {
    const on = filled.has(d.id);
    yAxis += `<text class="m ${on ? 'ink' : 'soft'}" x="190" y="${rowY(i) + 4}" font-size="12" letter-spacing="1.9" text-anchor="end">${d.name}</text>`;
    grid += `<line class="grid" x1="${X0}" y1="${rowY(i)}" x2="${X1}" y2="${rowY(i)}"/>`;
  });

  let ghosts = '', ticks = '';
  for (let i = 0; i < R.slots; i++) {
    const e = R.entries[i];
    if (!e || e.open) ghosts += `<line class="ghost" x1="${colX(i)}" y1="${TOP}" x2="${colX(i)}" y2="${BOT}"/>`;
    if (e) ticks += `<text class="m ${e.open ? 'live' : 'soft'}" x="${colX(i)}" y="${BOT + 28}" font-size="11" letter-spacing="1.1" text-anchor="middle">${e.open ? 'building now' : e.date}</text>`;
  }

  let marks = '', pts = [];
  shipped.forEach((e, k) => {
    const x = colX(R.entries.indexOf(e));
    const rs = e.domains.map(rowOf).sort((a, b) => a - b);
    const yTop = rowY(rs[0]) - 5, yBot = rowY(rs[rs.length - 1]) + 5;
    pts.push([x, (rowY(rs[0]) + rowY(rs[rs.length - 1])) / 2]);
    marks += `<g class="u" style="animation-delay:${(1.1 + k * 0.14).toFixed(2)}s">
<rect class="sig" x="${x - 5}" y="${yTop}" width="10" height="${yBot - yTop}"/>
<text class="m ink" x="${x}" y="${yTop - 12}" font-size="12.5" text-anchor="middle">${e.short}</text></g>`;
  });

  const trace = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  const penX = colX(R.entries.indexOf(openEntry));

  W('record.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 0 1236 704" width="1236" height="704" role="img" aria-label="Record of work: repositories plotted by security domain across successive entries">
<title>Het Patel - record of work</title>${S()}
<rect class="paper" x="-18" y="0" width="1236" height="704"/>

<rect class="sig" x="0" y="19" width="9" height="9"/>
<text class="m ink" x="20" y="28" font-size="12" letter-spacing="2.2">RECORD OF WORK</text>
<text class="m soft" x="1200" y="28" font-size="12" letter-spacing="2.2" text-anchor="end">SECURITY ENGINEERING / GITHUB</text>
<line class="r" x1="-18" y1="46" x2="1218" y2="46"/>

<text class="d ink" x="-4" y="142" font-size="82" letter-spacing="-3.7">HET PATEL</text>
<text class="m grey" x="2" y="178" font-size="13.5">security engineering</text>
<text class="m soft" x="2" y="200" font-size="13.5">cloud security / security architecture</text>
<text class="m soft" x="1200" y="178" font-size="12" letter-spacing="1.6" text-anchor="end">${shipped.length} REPOSITORIES / ${filled.size} OF ${DOM.length} DOMAINS</text>
<text class="m live" x="1200" y="200" font-size="12" letter-spacing="1.6" text-anchor="end">BUILDING NOW</text>
<line class="r" x1="-18" y1="224" x2="1218" y2="224"/>

<text class="m soft" x="0" y="258" font-size="10.5" letter-spacing="2.2">DOMAIN</text>
<text class="m soft" x="1200" y="258" font-size="10.5" letter-spacing="2.2" text-anchor="end">EACH MARK IS A REPOSITORY</text>

${grid}
${ghosts}
${yAxis}
<line class="axis" x1="${X0}" y1="${TOP}" x2="${X0}" y2="${BOT}"/>
<line class="axis" x1="${X0}" y1="${BOT}" x2="${X1}" y2="${BOT}"/>
${ticks}
<text class="m soft" x="190" y="${BOT + 28}" font-size="10.5" letter-spacing="1.9" text-anchor="end">TIMELINE</text>

<path class="trace" d="${trace}" stroke-dasharray="1400">
  <animate attributeName="stroke-dashoffset" from="1400" to="0" dur="1.15s" begin=".25s" fill="freeze"/>
</path>
${marks}

<g class="u" style="animation-delay:1.6s">
  <line class="pen" x1="${penX}" y1="${TOP}" x2="${penX}" y2="${BOT}" stroke-dasharray="3 5"/>
  <rect class="live breathe" x="${penX - 5}" y="${TOP - 5}" width="10" height="10"/>
</g>

<line class="r" x1="-18" y1="668" x2="1218" y2="668"/>
<text class="m soft" x="0" y="690" font-size="11" letter-spacing="2.2">EMPTY ROWS ARE HONEST / NOTHING SHIPPED THERE YET</text>
<text class="m sig" x="1200" y="690" font-size="11" letter-spacing="2.2" text-anchor="end">OPEN A DOMAIN BELOW</text>
</svg>`);
}

/* ══ RECORD (mobile) — the same record as a vertical index ═════════ */
{
  let y = 300, rows = '';
  DOM.forEach((d, i) => {
    const rp = reposIn(d.id), on = rp.length > 0;
    rows += `<line class="grid" x1="-16" y1="${y - 24}" x2="396" y2="${y - 24}"/>
<text class="m ${on ? 'ink' : 'soft'}" x="0" y="${y}" font-size="13" letter-spacing="1.9">${d.name}</text>
<text class="m ${on ? 'sig' : 'soft'}" x="380" y="${y}" font-size="13" text-anchor="end">${rp.length}</text>`;
    if (on) { rp.forEach(n => { y += 24; rows += `<rect class="sig" x="0" y="${y - 11}" width="4" height="13"/><text class="m ink" x="14" y="${y}" font-size="12.5">${n}</text>`; }); }
    y += 40;
  });

  W('record-mobile.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-16 0 412 ${y + 74}" width="412" height="${y + 74}" role="img" aria-label="Record of work by security domain">
<title>Het Patel - record of work</title>${S()}
<rect class="paper" x="-16" y="0" width="412" height="${y + 74}"/>
<rect class="sig" x="0" y="17" width="8" height="8"/>
<text class="m ink" x="16" y="25" font-size="11" letter-spacing="2">RECORD OF WORK</text>
<line class="r" x1="-16" y1="42" x2="396" y2="42"/>
<text class="d ink" x="-3" y="108" font-size="56" letter-spacing="-2.5">HET</text>
<text class="d ink" x="-3" y="162" font-size="56" letter-spacing="-2.5">PATEL</text>
<text class="m grey" x="0" y="196" font-size="12">security engineering</text>
<text class="m soft" x="0" y="214" font-size="12">cloud security / architecture</text>
<text class="m soft" x="0" y="248" font-size="10" letter-spacing="1.9">DOMAIN</text>
<text class="m soft" x="380" y="248" font-size="10" letter-spacing="1.9" text-anchor="end">REPOS</text>
${rows}
<line class="r" x1="-16" y1="${y + 6}" x2="396" y2="${y + 6}"/>
<rect class="live blink" x="0" y="${y + 24}" width="8" height="8"/>
<text class="m live" x="16" y="${y + 32}" font-size="11" letter-spacing="1.6">BUILDING NOW</text>
<text class="m soft" x="0" y="${y + 58}" font-size="10" letter-spacing="1.6">EMPTY ROWS ARE HONEST</text>
</svg>`);
}

/* ══ DIVIDER ═══════════════════════════════════════════════════════ */
W('divider.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-18 0 1236 14" width="1236" height="14" role="presentation" aria-hidden="true">${S(1)}
<line class="r" x1="-18" y1="7" x2="1218" y2="7"/>
<rect class="sig" x="0" y="3.5" width="7" height="7"/>
<rect class="sig" x="-18" y="5.5" width="30" height="3" opacity=".5">
  <animate attributeName="x" values="-18;1188;-18" keyTimes="0;0.5;1" dur="18s" repeatCount="indefinite"/>
</rect>
</svg>`);

/* ══ SOCIAL PREVIEW ════════════════════════════════════════════════ */
W('social-preview.svg', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 640" width="1280" height="640" role="img" aria-label="Repository preview">
<!-- TEMPLATE. Edit the FIELD lines, export 1280x640 PNG,
     upload at repo > Settings > General > Social preview. -->${S()}
<rect class="paper" width="1280" height="640"/>
<g transform="translate(72,64)">
  <rect class="sig" x="0" y="0" width="11" height="11"/>
  <text class="m ink" x="24" y="10" font-size="14" letter-spacing="2.6">HET PATEL</text>
  <text class="m soft" x="1136" y="10" font-size="14" letter-spacing="2.6" text-anchor="end">GITHUB.COM/HET-P301204</text>
  <line class="r" x1="0" y1="34" x2="1136" y2="34"/>

  <!-- FIELD 1 - domain -->
  <text class="m sig" x="0" y="116" font-size="18" letter-spacing="2.6">ASSURANCE / ENGINEERING</text>

  <!-- FIELD 2 - repository name -->
  <text class="d ink" x="-4" y="238" font-size="98" letter-spacing="-4.4">AEGISLENS</text>
  <line class="r" x1="0" y1="270" x2="1136" y2="270"/>
  <rect class="sig" x="0" y="268" width="220" height="5"/>

  <!-- FIELD 3 - what it is -->
  <text class="d ink" x="0" y="326" font-size="26" letter-spacing="-1.17">SECURITY EVIDENCE &amp; RISK WORKBENCH</text>
  <!-- FIELD 4 - stack and evidence -->
  <text class="m grey" x="0" y="366" font-size="17" letter-spacing="1.4">PYTHON / FASTAPI / REACT / DOCKER / 108 TESTS</text>

  <line class="r" x1="0" y1="452" x2="1136" y2="452"/>
  <text class="m soft" x="0" y="480" font-size="14" letter-spacing="2.6">06.09.2026</text>
  <text class="m soft" x="1136" y="480" font-size="14" letter-spacing="2.6" text-anchor="end">SYNTHETIC DATA ONLY</text>
</g>
</svg>`);
