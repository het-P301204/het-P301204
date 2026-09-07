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

`.github/workflows/refresh.yml` runs daily at 05:17 UTC (and on demand, and on
any push that touches the build inputs). It runs `sync.mjs`, which pulls the
live repository list, creation dates, language mix and last-push time from the
GitHub API, then `build.mjs`, then commits only if something changed.

**Your entire job when you ship a repository is one line:**

```json
"map": { "TrustEdge-AWS-IAM-analyzer": ["cloud", "offensive"] }
```

Add the repo to `map` (and optionally `short` for a display name). Dates,
ordering, column count, domain counts, the language strip and the freshness
readout are all derived. Anything unclassified is listed as `UNCLASSIFIED` in
the Action log and simply left off the chart — it never renders something wrong.

`exclude` keeps non-security repositories (the portfolio, this profile repo)
out of the record.

The index in `README.md` stays hand-written on purpose. It carries judgement —
what to read first, why a project exists, which repositories connect — and that
is the part a generator cannot produce.

The moment worth waiting for is a first repository in `appsec`: the last empty
row lights up, and the profile tells a visibly new story for the cost of one
line of JSON.

## Repository previews

Edit the `FIELD` lines in `social-preview.svg`, export 1280×640 PNG, upload at
repo → Settings → General → Social preview. Field 4 carries the evidence
(stack, test count) because that is what makes someone open the link.
