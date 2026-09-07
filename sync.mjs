/* Pulls live repository data from the GitHub API and rewrites the generated
   half of record.json. Run by .github/workflows/refresh.yml on a schedule,
   so the chart cannot drift from reality.

   You classify a repository once in record.json "map"; everything after that
   — dates, ordering, language mix, freshness — is derived.

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

const get = async path => {
  const r = await fetch(API + path, { headers });
  if (!r.ok) throw new Error(`${path} -> ${r.status} ${r.statusText}`);
  return r.json();
};

const R = JSON.parse(fs.readFileSync('record.json', 'utf8'));
const map = R.map || {};
const shortOf = R.short || {};
const exclude = new Set(R.exclude || []);

const repos = (await get(`/users/${USER}/repos?per_page=100&sort=created`))
  .filter(r => !r.fork && !exclude.has(r.name));

/* language mix, weighted by bytes, across the classified repositories only */
const bytes = {};
for (const r of repos) {
  if (!map[r.name]) continue;
  try {
    const langs = await get(`/repos/${USER}/${r.name}/languages`);
    for (const [k, v] of Object.entries(langs)) bytes[k] = (bytes[k] || 0) + v;
  } catch { /* language endpoint can 404 on doc-only repos; skip */ }
}
const total = Object.values(bytes).reduce((a, b) => a + b, 0);
const stack = Object.entries(bytes)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 5)
  .map(([name, n]) => ({ name, pct: +(100 * n / total).toFixed(1) }));

const d = iso => {
  const t = new Date(iso);
  return `${String(t.getUTCDate()).padStart(2, '0')}.${String(t.getUTCMonth() + 1).padStart(2, '0')}.${t.getUTCFullYear()}`;
};

const classified = repos
  .filter(r => map[r.name])
  .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

const entries = classified.map(r => ({
  date: d(r.created_at),
  short: shortOf[r.name] || r.name,
  repo: r.name,
  domains: map[r.name],
}));

if (R.open !== false) entries.push({ date: d(new Date().toISOString()), short: '', domains: [], open: true });

const unmapped = repos.filter(r => !map[r.name]).map(r => r.name);
const latest = classified.reduce((a, b) => (new Date(a.pushed_at) > new Date(b.pushed_at) ? a : b), classified[0]);

const next = {
  ...R,
  entries,
  stack,
  slots: Math.max(R.slots || 5, entries.length + 1),
  lastPush: latest ? { repo: shortOf[latest.name] || latest.name, date: d(latest.pushed_at) } : null,
  synced: new Date().toISOString().slice(0, 10),
};

const before = fs.readFileSync('record.json', 'utf8');
const after = JSON.stringify(next, null, 2) + '\n';
fs.writeFileSync('record.json', after);

console.log(`repositories:  ${repos.length} (${classified.length} classified)`);
console.log(`entries:       ${entries.length}`);
console.log(`stack:         ${stack.map(s => `${s.name} ${s.pct}%`).join('  ')}`);
console.log(`last push:     ${next.lastPush ? next.lastPush.repo + ' ' + next.lastPush.date : '-'}`);
if (unmapped.length) console.log(`UNCLASSIFIED:  ${unmapped.join(', ')}  <- add to "map" in record.json`);
console.log(before === after ? 'record.json unchanged' : 'record.json updated');
