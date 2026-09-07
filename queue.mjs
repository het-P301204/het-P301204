/* Handles a visitor-submitted issue and writes it into README.md.
   Called by .github/workflows/queue.yml.

   SECURITY NOTES — this is the one place untrusted input reaches the repo.
   1. The issue title arrives via process.env, never interpolated into a shell
      command. Putting ${{ github.event.issue.title }} inside a `run:` block is
      a script-injection hole; this deliberately avoids it.
   2. Input is allowlisted to a safe charset, so no markdown, HTML, pipes or
      backticks can survive into the table.
   3. Length and queue depth are capped so the README cannot be flooded.
   4. Everything is a normal commit, so anything unwanted is one revert away.

   Run locally:  TITLE="teardown|s3 bucket policy" ACTOR=someone node queue.mjs */
import fs from 'fs';

const MAX_LEN = 80;
const MAX_ROWS = 8;

const title = (process.env.TITLE || '').trim();
const actor = (process.env.ACTOR || '').replace(/[^A-Za-z0-9-]/g, '').slice(0, 39);
const number = (process.env.ISSUE_NUMBER || '').replace(/[^0-9]/g, '');

/* keep only characters that cannot mean anything to markdown or HTML */
const clean = s => s
  .replace(/[^A-Za-z0-9 ._/+#:-]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()
  .slice(0, MAX_LEN);

const [kind, ...rest] = title.split('|');
const subject = clean(rest.join(' '));

if (kind.trim().toLowerCase() !== 'teardown') {
  console.log('not a teardown request; ignoring');
  process.exit(0);
}
if (!subject || subject.length < 3) {
  console.log('empty or too-short subject after sanitising; ignoring');
  process.exit(0);
}

const REGION = 'QUEUE';
const md = fs.readFileSync('README.md', 'utf8');
const open = `<!--${REGION}:START-->`;
const close = `<!--${REGION}:END-->`;
const a = md.indexOf(open);
const b = md.indexOf(close);
if (a < 0 || b < 0) { console.error(`markers ${open}/${close} not found`); process.exit(1); }

const inner = md.slice(a + open.length, b);
const existing = inner
  .split('\n')
  .filter(l => /^\| /.test(l) && !/^\| *:?-/.test(l) && !/Requested/i.test(l))
  .map(l => l.split('|').map(c => c.trim()).filter(Boolean));

/* de-duplicate on the sanitised subject, newest last, capped */
const rows = existing
  .filter(r => r[0].toLowerCase() !== subject.toLowerCase())
  .concat([[subject, actor ? `[@${actor}](https://github.com/${actor})` : '—', number ? `[#${number}](../../issues/${number})` : '—']])
  .slice(-MAX_ROWS);

const table = [
  '',
  '| In the queue | Requested by | Issue |',
  '| :-- | :-- | :-- |',
  ...rows.map(r => `| ${r[0]} | ${r[1] || '—'} | ${r[2] || '—'} |`),
  '',
].join('\n');

fs.writeFileSync('README.md', md.slice(0, a + open.length) + table + md.slice(b));
console.log(`queued: "${subject}" by ${actor || 'unknown'} (${rows.length} row(s) in queue)`);
