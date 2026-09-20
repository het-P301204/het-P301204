/* Prints the issue body listing repositories that could not classify
   themselves. Called by .github/workflows/refresh.yml.

   This lived inline as `node -e '...'` inside a bash $(...) substitution,
   which nests three quoting contexts and is not worth the risk. It is a file
   now.                                                                      */
import fs from 'fs';

const rows = fs.readFileSync('unclassified.txt', 'utf8')
  .trim().split('\n').filter(Boolean)
  .map(l => l.split('|'));

const out = [];
out.push('These repositories are missing from the profile because nothing in');
out.push('`record.json` `topicMap` matched their topics.\n');
for (const [name, topics] of rows) {
  out.push(`- **${name}** — topics: ${topics ? topics.split(',').map(t => `\`${t}\``).join(' ') : '_none set_'}`);
}
out.push('\nEither fix works:\n');
out.push('1. **Add a recognised topic on GitHub** — preferred, because it then classifies itself and every future repository with that topic does too.');
out.push('2. **Add it to `map` in `record.json`** — an explicit override, for repositories that will never carry topics.\n');
out.push('The chart leaves them off rather than guessing, so nothing on the profile is wrong in the meantime.\n');
out.push('This issue closes itself once every repository classifies.');

console.log(out.join('\n'));
