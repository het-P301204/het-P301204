# Design notes

**The profile is a chart of what has been built, and an index into it.**

There is no metaphor. There is one chart: security domains down the side,
successive entries across the bottom, and a mark wherever a repository exists.
Everything else on the page is axis, grid and label.

The governing rule is a visual one:

> **Repositories are the only bright marks. The interface is literally the axes.**

That is why the chart works as a hero *and* as navigation *and* as the R&D log
*and* as the honesty mechanism — it is one picture of one true thing. Empty rows
are not a design flaw; they are the most credible element on the page. Nobody
writes "APPSEC — empty" unless the rest is real.

## Tokens

Read off [hetpatel-lemon.vercel.app](https://hetpatel-lemon.vercel.app).

| Token | Dark | Light | Role |
| :-- | :-- | :-- | :-- |
| `--paper` | `#0b0b0b` | `#f7f6f3` | canvas |
| `--ink` | `#f2f0ec` | `#0b0b0b` | primary type |
| `--grey` / `--soft` | `#9c988f` / `#837f76` | `#5c5a54` / `#6f6d66` | secondary / axis |
| `--rule` | `#f2f0ec` @24% | `#0b0b0b` @22% | hairline |
| `--faint` | `#f2f0ec` @11% | `#0b0b0b` @11% | grid, unwritten columns |
| `--sig` | `#3157ff` | `#2447e0` | **a repository exists here** |
| `--live` | `#ff6a1a` | `#cc4d0a` | **the entry still open** |

Both accents are the portfolio's own — `#3157ff` is its light-mode signal,
`#ff6a1a` its dark-mode signal. Here each has exactly one job. Orange appears
twice on the whole page: the open entry's marker and its column. Two marks is
what makes it read as *now* rather than as decoration.

## Type

**Archivo 800** display at `-0.045em`. **IBM Plex Mono 400** everything else,
`+0.18em` on uppercase labels. Subsets in `.fonts/` are embedded as base64
WOFF2 in every asset with text — an `<img>`-rendered SVG cannot fetch external
fonts, but `data:` URIs are inline data and work anywhere.

Subsets exclude `·`, `—`, `→`. Use `/` and `-`, as the site does.

## Assets

Four. Anything that did not make the chart or the index more useful was cut —
including a topology diagram, which with three repositories was padding.

| File | Size | Role |
| :-- | :-- | :-- |
| `record.svg` | 1236×704 | the chart: domain × entry, marks are repositories |
| `record-mobile.svg` | 412×auto | same record as a vertical index, served under 620px |
| `divider.svg` | 1236×14 | hairline |
| `social-preview.svg` | 1280×640 | per-repo preview, export to PNG |

Mobile is a **different layout, not a smaller one** — `<picture>` with
`media="(max-width: 620px)"`, which GitHub preserves. A scatter plot does not
survive a 380px viewport; a grouped list does, and it is arguably the better
read.

Nothing critical lives only in an SVG. The chart carries the impression; the
markdown index below carries the information, so a screen reader or a narrow
viewport loses nothing.

Assets degrade safely: static state equals finished animated state, and
`prefers-reduced-motion` disables motion outright.

## The interaction

Each domain chip links to an `<a id>` **inside** a collapsed `<details>`. Per
the HTML spec, fragment navigation to a descendant of a closed `<details>`
opens it — verified in Chrome 148: the targeted section expanded, the control
stayed shut. Where unsupported it degrades to plain anchor scrolling.

GitHub rewrites `id` to `user-content-id` and its own script handles the
mapping. Do not remove the bare `<a id="d-*">` tags — they are the targets.

Do **not** put a bare `<img>` inside a `<summary>`: GitHub auto-wraps it in a
link to the image file, which breaks the toggle.

## Maintenance — the chart maintains itself

`.github/workflows/refresh.yml` runs twice daily (05:17 and 17:17 UTC), on
demand, and on any push touching the build inputs. It runs `sync.mjs` — which
pulls repositories, topics, dates, language mix, test counts and commits from
the GitHub API — then `build.mjs`, then commits only if something changed.

**Shipping a repository requires no edit here at all.** Tag it on GitHub and
`record.json` `topicMap` classifies it into domains. It appears on the chart
and gets a generated index entry within hours.

Precedence is `map` → topics → unclassified:

- **`map`** is an explicit override, used for the four repositories that
  predate the tagging habit and have no topics.
- **`topicMap`** maps a GitHub topic to a domain. A repository scores against
  every domain its topics touch, keeps the strongest (up to
  `maxDomainsPerRepo`), and needs `minTopicScore` to pick up a second.
- Anything matching nothing is **left off and reported**, never guessed. The
  Action opens a labelled issue naming the repo and its topics, and closes it
  once resolved.

The only optional step is a `notes` entry — `tag`, `readFirst`, `why`, `runs`.
That is judgement a generator cannot produce, and it is the difference between
a repository that reads as a bare API description and one worth opening.

`exclude` keeps non-security repositories (the portfolio, this profile repo)
out of the record.

`sync.mjs` **aborts before writing** if any required API call fails. It once
published `Rust 94.9%` as the language mix because rate limiting made the
`/languages` calls fail silently and the percentages were computed from the one
repository that survived. Wrong numbers are worse than no update.

## Repository previews

Edit the `FIELD` lines in `social-preview.svg`, export 1280×640 PNG, upload at
repo → Settings → General → Social preview. Field 4 carries the evidence
(stack, test count) because that is what makes someone open the link.

## Scaling

The chart is built to survive a repository a day. Three things adapt on their
own, so nothing needs tuning as the record grows:

| Repos | What the chart does |
| :-- | :-- |
| up to ~19 | every mark is labelled, staggered so neighbours cannot collide |
| ~20 and up | mark labels drop; the caption above the plot names the newest four |
| ~28 and up | the view windows to the most recent columns, with `+N earlier` stated |
| any | domain counts sit in the left gutter and never degrade |

Squares are sized from whatever column pitch is left, with a 5px floor.
Date ticks thin out to roughly five rather than one per column.

`record.json` exposes two knobs, neither of which normally needs touching:

- `window` (default 28) — how many columns the desktop chart shows
- `mobilePerDomain` (default 3) — repositories listed per domain on mobile

Mobile has the opposite failure mode: it grows downward. It caps the listing
per domain and states the remainder, so its height flattens at about 2.9×
its width no matter how many repositories exist. The count per domain is
always exact; only the listing is capped.

Stress-tested from 10 to 300 repositories: no label collisions, no unreadable
squares, no state where nothing on the chart has a name.
