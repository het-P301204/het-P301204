/* Pulls everything from the GitHub API and regenerates the profile.
   Run by .github/workflows/refresh.yml on a schedule.

   Adding a repository requires NO edit here. Tag it with topics and it
   classifies itself, appears on the chart and gets an index entry. The only
   optional step is a prose note in record.json "notes" — judgement a
   generator cannot produce.

   Precedence for domains:  record.json "map"  >  GitHub topics  >  unclassified
   Anything still unclassified is reported loudly and left off, never guessed.

   Run: node sync.mjs                                                        */
import fs from 'fs';

const USER = 'het-P301204';
const API = 'https://api.github.com';
const token = process.env.GITHUB_TOKEN;
const headers = {
  accept: 'application/vnd.github+json',
  'user-agent': 'het-P301204-profile-sync',
  ...(token ? { authorization: `Bearer ${token}` } : {}),
};
const get = async p => { const r = await fetch(API + p, { headers }); if (!r.ok) throw new Error(`${p} -> ${r.status}`); return r.json(); };
let degraded = 0;
const tryGet = async (p, optional = false) => {
  try { return await get(p); }
  catch (e) {
    if (optional && /-> 404/.test(e.message)) return null;   // genuinely absent, fine
    degraded++; console.error(`  FETCH FAILED ${p} — ${e.message}`);
    return null;
  }
};

const R = JSON.parse(fs.readFileSync('record.json', 'utf8'));
const DOM = R.domains, topicMap = R.topicMap || {}, override = R.map || {};
const notes = R.notes || {}, exclude = new Set(R.exclude || []);
const MAXD = R.maxDomainsPerRepo || 3, MINS = R.minTopicScore || 2;

/* topic -> domain lookup */
const topicIndex = {};
for (const [dom, list] of Object.entries(topicMap)) for (const t of list) (topicIndex[t] ||= []).push(dom);

const domainsFor = repo => {
  if (override[repo.name]) return override[repo.name];
  const score = {};
  for (const t of repo.topics || []) for (const dom of topicIndex[t] || []) score[dom] = (score[dom] || 0) + 1;
  const ranked = Object.entries(score).sort((a, b) => b[1] - a[1]);
  if (!ranked.length) return [];
  const keep = ranked.filter(([, n], i) => i === 0 || n >= MINS).slice(0, MAXD).map(([d]) => d);
  return DOM.map(d => d.id).filter(id => keep.includes(id));   // canonical row order
};

const shortFor = n => R.short?.[n]
  || (n.length <= 16 ? n : n.split(/[-_]/)[0]);
const slug = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');

const d = iso => { const t = new Date(iso); return `${String(t.getUTCDate()).padStart(2,'0')}.${String(t.getUTCMonth()+1).padStart(2,'0')}.${t.getUTCFullYear()}`; };
const ago = iso => { const h = Math.floor((Date.now() - new Date(iso)) / 36e5);
  if (h < 1) return 'just now'; if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24); return dd === 1 ? 'yesterday' : `${dd}d ago`; };
const esc = s => String(s).replace(/([|`<>*_[\]])/g, '\\$1');

/* ── gather ──────────────────────────────────────────────────────── */
const all = (await get(`/users/${USER}/repos?per_page=100&sort=created`))
  .filter(r => !r.fork && !r.archived && !exclude.has(r.name));

const repos = [];
for (const r of all) {
  const doms = domainsFor(r);
  const langs = await tryGet(`/repos/${USER}/${r.name}/languages`) || {};
  const readmeMeta = await tryGet(`/repos/${USER}/${r.name}/readme`, true);
  const readme = readmeMeta?.content ? Buffer.from(readmeMeta.content, 'base64').toString('utf8') : '';
  const tm = readme.match(/tests?-(\d[\d,_]*)[-_ ]?passing/i) || readme.match(/(\d[\d,_]{1,6})\s+tests?\b/i);
  repos.push({
    name: r.name, short: shortFor(r.name), slug: slug(shortFor(r.name)),
    desc: (r.description || '').trim(), domains: doms, topics: r.topics || [],
    created: r.created_at, pushed: r.pushed_at,
    langs: Object.keys(langs).slice(0, 3), langBytes: langs,
    tests: tm ? +tm[1].replace(/[,_]/g, '') : null,
    ci: /actions\/workflows|workflow.*badge\.svg/i.test(readme),
  });
}

const classified = repos.filter(r => r.domains.length).sort((a, b) => new Date(a.created) - new Date(b.created));
const unclassified = repos.filter(r => !r.domains.length);

/* ── language mix ────────────────────────────────────────────────── */
const bytes = {};
for (const r of classified) {
  const l = await tryGet(`/repos/${USER}/${r.name}/languages`) || {};
  for (const [k, v] of Object.entries(l)) bytes[k] = (bytes[k] || 0) + v;
}
const totalBytes = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
const stack = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 5)
  .map(([name, n]) => ({ name, pct: +(100 * n / totalBytes).toFixed(1) }));

/* ── tests + activity ────────────────────────────────────────────── */
const tests = classified.filter(r => r.tests).map(r => ({ repo: r.short, n: r.tests }));
const testTotal = tests.reduce((a, b) => a + b.n, 0);

let commits = [];
for (const r of classified) {
  const cs = await tryGet(`/repos/${USER}/${r.name}/commits?per_page=5`);
  if (Array.isArray(cs)) for (const c of cs) commits.push({
    repo: r.short, full: r.name, sha: c.sha.slice(0, 7),
    when: c.commit.author.date, msg: (c.commit.message || '').split('\n')[0].slice(0, 72),
  });
}
commits = commits.sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 5);

if (degraded) {
  console.error(`
ABORTING: ${degraded} API call(s) failed. Publishing now would put wrong`);
  console.error(`numbers on the profile. Re-run with GITHUB_TOKEN set (rate limits) or when`);
  console.error(`the API recovers. Nothing was written.`);
  process.exit(1);
}

/* ── record.json ─────────────────────────────────────────────────── */
const entries = classified.map(r => ({ date: d(r.created), short: r.short, repo: r.name, domains: r.domains }));
if (R.open !== false) entries.push({ date: d(new Date().toISOString()), short: '', domains: [], open: true });
const latest = classified.reduce((a, b) => (new Date(a.pushed) > new Date(b.pushed) ? a : b), classified[0]);

fs.writeFileSync('record.json', JSON.stringify({
  ...R, entries, stack, tests, testTotal,
  slots: Math.max(entries.length + 1, 5),
  lastPush: latest ? { repo: latest.short, date: d(latest.pushed) } : null,
  synced: new Date().toISOString().slice(0, 10),
}, null, 2) + '\n');

/* ── index, generated per domain ─────────────────────────────────── */
const anchorFor = (r, dom) => (r.domains[0] === dom ? `r-${r.slug}` : `r-${r.slug}-${dom}`);
const url = n => `https://github.com/${USER}/${n}`;

const repoBlock = (r, dom) => {
  const n = notes[r.name] || {};
  const rows = [];
  if (r.langs.length) rows.push(['Stack', r.langs.map(l => `\`${l}\``).join(' ')]);
  const ev = [r.tests ? `${r.tests} tests` : null, r.ci ? 'CI' : null].filter(Boolean).join(', ');
  if (ev) rows.push(['Evidence', ev]);
  if (n.runs) rows.push(['Runs', n.runs]);
  if (n.readFirst) rows.push(['Read first', n.readFirst]);
  const others = r.domains.filter(x => x !== dom);
  if (others.length) rows.push(['Also in', others
    .map(o => `[${DOM.find(x => x.id === o).name}](#user-content-${anchorFor(r, o)})`).join(' · ')]);

  return `<details id="repo-${r.slug}-${dom}">
<summary>&nbsp;<b><a href="${url(r.name)}">${r.short}</a></b>${n.tag ? ` &nbsp;<sub>${n.tag}</sub>` : ''}</summary>
<a id="${anchorFor(r, dom)}"></a>

${esc(r.desc) || n.why || ''}
${rows.length ? '\n| | |\n| :-- | :-- |\n' + rows.map(([k, v]) => `| **${k}** | ${v} |`).join('\n') + '\n' : ''}
</details>`;
};

const indexBody = '\n' + DOM.map(dom => {
  const mine = classified.filter(r => r.domains.includes(dom.id));
  const count = mine.length ? `${mine.length} ${mine.length === 1 ? 'repository' : 'repositories'}` : 'empty';
  const inner = mine.length
    ? mine.map(r => repoBlock(r, dom.id)).join('\n\n') + (dom.chasing ? `\n\n<sub>${dom.chasing}</sub>` : '')
    : dom.empty || 'Nothing here yet.';
  return `<details id="domain-${dom.id}">
<summary><b>${dom.name}</b> &nbsp;<sub>${dom.note} &nbsp;—&nbsp; ${count}</sub></summary>
<a id="d-${dom.id}"></a>

${inner}

</details>`;
}).join('\n\n') + '\n';

/* ── write README regions ────────────────────────────────────────── */
const region = (md, name, body) => {
  const o = `<!--${name}:START-->`, c = `<!--${name}:END-->`;
  const a = md.indexOf(o), b = md.indexOf(c);
  if (a < 0 || b < 0) { console.log(`  (no ${name} markers; skipped)`); return md; }
  return md.slice(0, a + o.length) + body + md.slice(b);
};

const filled = new Set(classified.flatMap(r => r.domains));
let md = fs.readFileSync('README.md', 'utf8');
md = region(md, 'INDEX', indexBody);
md = region(md, 'SUMMARY', `\n${classified.length} repositories across ${filled.size} of ${DOM.length} domains. Open a domain, then open a repository — the second level is where the evidence is. Repository names link straight to the code.\n`);
md = region(md, 'ACTIVITY', commits.length
  ? '\n' + commits.map(c => `- \`${c.sha}\` **[${c.repo}](${url(c.full)})** — ${esc(c.msg)} <sub>${ago(c.when)}</sub>`).join('\n') + '\n'
  : '\n_no recent commits_\n');
md = region(md, 'TESTS', testTotal
  ? `\n**${testTotal.toLocaleString('en-US')} tests** across the lab — ${tests.map(t => `${t.repo} ${t.n}`).join(', ')}. Counted from each repository's own README, not asserted here.\n`
  : '\n_test totals unavailable_\n');
fs.writeFileSync('README.md', md);

/* ── report + flag anything unplaced ─────────────────────────────── */
console.log(`repositories:  ${repos.length} (${classified.length} classified)`);
for (const r of classified) console.log(`  ${r.short.padEnd(14)} ${r.domains.join(', ')}${override[r.name] ? '   (manual override)' : ''}`);
console.log(`domains:       ${filled.size}/${DOM.length} filled`);
console.log(`stack:         ${stack.map(s => `${s.name} ${s.pct}%`).join('  ')}`);
console.log(`tests:         ${testTotal}`);
if (unclassified.length) {
  console.log(`\nUNCLASSIFIED (left off the profile):`);
  for (const r of unclassified) console.log(`  ${r.name} — topics: ${r.topics.join(', ') || 'none'}`);
  fs.writeFileSync('unclassified.txt', unclassified.map(r => `${r.name}|${r.topics.join(',')}`).join('\n'));
} else if (fs.existsSync('unclassified.txt')) fs.unlinkSync('unclassified.txt');
