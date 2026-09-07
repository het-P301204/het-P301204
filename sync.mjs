/* Pulls live data from the GitHub API and rewrites the generated parts of
   record.json and README.md. Run by .github/workflows/refresh.yml daily, so
   nothing on the profile can drift from reality.

   You classify a repository once in record.json "map"; everything after that
   — dates, ordering, language mix, freshness, activity, test totals — is
   derived.

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

const get = async (path, raw = false) => {
  const r = await fetch(API + path, { headers });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${r.statusText}`);
  return raw ? r.text() : r.json();
};
const tryGet = async (path, raw) => { try { return await get(path, raw); } catch { return null; } };

const R = JSON.parse(fs.readFileSync('record.json', 'utf8'));
const map = R.map || {};
const shortOf = R.short || {};
const exclude = new Set(R.exclude || []);

const repos = (await get(`/users/${USER}/repos?per_page=100&sort=created`))
  .filter(r => !r.fork && !exclude.has(r.name));
const classified = repos
  .filter(r => map[r.name])
  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

const d = iso => {
  const t = new Date(iso);
  return `${String(t.getUTCDate()).padStart(2, '0')}.${String(t.getUTCMonth() + 1).padStart(2, '0')}.${t.getUTCFullYear()}`;
};
const ago = iso => {
  const h = Math.floor((Date.now() - new Date(iso)) / 36e5);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const dd = Math.floor(h / 24);
  return dd === 1 ? 'yesterday' : `${dd}d ago`;
};

/* ── language mix, weighted by bytes ─────────────────────────────── */
const bytes = {};
for (const r of classified) {
  const langs = await tryGet(`/repos/${USER}/${r.name}/languages`);
  if (langs) for (const [k, v] of Object.entries(langs)) bytes[k] = (bytes[k] || 0) + v;
}
const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
const stack = Object.entries(bytes).sort((a, b) => b[1] - a[1]).slice(0, 5)
  .map(([name, n]) => ({ name, pct: +(100 * n / total).toFixed(1) }));

/* ── aggregate test count, read off each repo's own README ───────── */
/* Only counts what it can actually find. A repo with no stated test count is
   omitted rather than guessed at, so the total is never inflated.           */
const tests = [];
for (const r of classified) {
  const readme = await tryGet(`/repos/${USER}/${r.name}/readme`);
  if (!readme?.content) continue;
  const text = Buffer.from(readme.content, 'base64').toString('utf8');
  const m = text.match(/tests?-(\d[\d,_]*)[-_ ]?passing/i)
        || text.match(/(\d[\d,_]{1,6})\s+tests?\b/i);
  if (m) tests.push({ repo: shortOf[r.name] || r.name, n: +m[1].replace(/[,_]/g, '') });
}
const testTotal = tests.reduce((a, b) => a + b.n, 0);

/* ── recent commits across the lab ──────────────────────────────── */
let commits = [];
for (const r of classified) {
  const cs = await tryGet(`/repos/${USER}/${r.name}/commits?per_page=5`);
  if (!Array.isArray(cs)) continue;
  for (const c of cs) {
    commits.push({
      repo: shortOf[r.name] || r.name,
      full: r.name,
      sha: c.sha.slice(0, 7),
      when: c.commit.author.date,
      msg: (c.commit.message || '').split('\n')[0].slice(0, 72),
    });
  }
}
commits = commits.sort((a, b) => new Date(b.when) - new Date(a.when)).slice(0, 5);

/* ── write record.json ──────────────────────────────────────────── */
const entries = classified.map(r => ({
  date: d(r.created_at), short: shortOf[r.name] || r.name, repo: r.name, domains: map[r.name],
}));
if (R.open !== false) entries.push({ date: d(new Date().toISOString()), short: '', domains: [], open: true });

const latest = classified.reduce((a, b) => (new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b), classified[0]);

fs.writeFileSync('record.json', JSON.stringify({
  ...R,
  entries,
  stack,
  tests,
  testTotal,
  slots: Math.max(R.slots || 5, entries.length + 1),
  lastPush: latest ? { repo: shortOf[latest.name] || latest.name, date: d(latest.pushed_at) } : null,
  synced: new Date().toISOString().slice(0, 10),
}, null, 2) + '\n');

/* ── write the generated regions of README.md ───────────────────── */
const region = (md, name, body) => {
  const o = `<!--${name}:START-->`, c = `<!--${name}:END-->`;
  const a = md.indexOf(o), b = md.indexOf(c);
  if (a < 0 || b < 0) { console.log(`  (no ${name} markers; skipped)`); return md; }
  return md.slice(0, a + o.length) + body + md.slice(b);
};

const esc = s => s.replace(/([|`<>*_[\]])/g, '\\$1');

const activityBody = commits.length
  ? '\n' + commits.map(c =>
      `- \`${c.sha}\` **[${c.repo}](https://github.com/${USER}/${c.full})** — ${esc(c.msg)} <sub>${ago(c.when)}</sub>`
    ).join('\n') + '\n'
  : '\n_no recent commits_\n';

const testsBody = testTotal
  ? `\n**${testTotal.toLocaleString('en-US')} tests** across the lab — ${tests.map(t => `${t.repo} ${t.n}`).join(', ')}. Counted from each repository's own README, not asserted here.\n`
  : '\n_test totals unavailable_\n';

let md = fs.readFileSync('README.md', 'utf8');
md = region(md, 'ACTIVITY', activityBody);
md = region(md, 'TESTS', testsBody);
fs.writeFileSync('README.md', md);

/* ── report ─────────────────────────────────────────────────────── */
const unmapped = repos.filter(r => !map[r.name]).map(r => r.name);
console.log(`repositories:  ${repos.length} (${classified.length} classified)`);
console.log(`entries:       ${entries.length}`);
console.log(`stack:         ${stack.map(s => `${s.name} ${s.pct}%`).join('  ')}`);
console.log(`tests:         ${testTotal} total  [${tests.map(t => t.repo + ' ' + t.n).join(', ') || 'none found'}]`);
console.log(`commits:       ${commits.length} shown`);
console.log(`last push:     ${latest ? (shortOf[latest.name] || latest.name) + ' ' + d(latest.pushed_at) : '-'}`);
if (unmapped.length) console.log(`UNCLASSIFIED:  ${unmapped.join(', ')}  <- add to "map" in record.json`);
