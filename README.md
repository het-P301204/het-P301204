<!--
  het-P301204 — profile README
  This is an index to the repositories, not a homepage. The chart plots what
  has actually been built. Repositories are the only bright marks on it.
  Repo must be named exactly: het-P301204 (public, README.md at root)
  Regenerate assets: node build.mjs      Daily edit: record.json
-->

<div align="center">

<picture>
  <source media="(max-width: 620px)" srcset="assets/record-mobile.svg">
  <img src="assets/record.svg" width="100%" alt="Record of work — repositories plotted by security domain across successive entries">
</picture>

<a href="#d-assurance"><kbd> ASSURANCE </kbd></a>
<a href="#d-engineering"><kbd> ENGINEERING </kbd></a>
<a href="#d-detection"><kbd> DETECTION </kbd></a>
<a href="#d-appsec"><kbd> APPSEC </kbd></a>
<a href="#d-cloud"><kbd> CLOUD </kbd></a>
<a href="#d-offensive"><kbd> OFFENSIVE </kbd></a>

<img src="assets/divider.svg" width="100%" alt="">

</div>

## Index

Six domains, three repositories, one entry still open. Every mark on the chart
above is a repository below — open a domain and go read the code.

<details id="domain-assurance">
<summary><b>ASSURANCE</b> &nbsp;<sub>iso 27001 / isms / controls / evidence &nbsp;—&nbsp; 2 repositories</sub></summary>
<a id="d-assurance"></a>

| | |
| :-- | :-- |
| **[SecureBridge-ISMS-360](https://github.com/het-P301204/SecureBridge-ISMS-360)** | Ten interconnected GRC projects wired into a single ISMS — governance, risk, controls, policy, audit, evidence, management review, certification readiness.<br><sub>The whole management system, end to end, for one fictional company.</sub> |
| **[AegisLens](https://github.com/het-P301204/AegisLens-security-workbench)** | The tooling half of the same problem: evidence in, risk scored, findings tracked, report out.<br><sub>`Python` `FastAPI` `React` `Docker` — 108 tests, CI, a worked example in `docs/`</sub> |

<sub>What I am actually chasing here: the smallest honest evidence set that proves a control operates.</sub>

</details>

<details id="domain-engineering">
<summary><b>ENGINEERING</b> &nbsp;<sub>tooling / automation / risk scoring &nbsp;—&nbsp; 1 repository</sub></summary>
<a id="d-engineering"></a>

| | |
| :-- | :-- |
| **[AegisLens](https://github.com/het-P301204/AegisLens-security-workbench)** | Read as software rather than as GRC: a FastAPI service, a React client, a scoring model, a test suite and a container.<br><sub>Start at `backend/tests` if you want to know whether I can actually build.</sub> |

<sub>AegisLens sits in two rows on the chart because it genuinely spans both. That crossover is the work I find most interesting.</sub>

</details>

<details id="domain-detection">
<summary><b>DETECTION</b> &nbsp;<sub>telemetry / signals / triage &nbsp;—&nbsp; 1 repository</sub></summary>
<a id="d-detection"></a>

| | |
| :-- | :-- |
| **[PingMaster](https://github.com/het-P301204/PingMaster)** | Ping with a graph. Cross-platform network latency you can actually read.<br><sub>`Rust` — the first half of every detection story is seeing the traffic at all.</sub> |

</details>

<details id="domain-appsec">
<summary><b>APPSEC</b> &nbsp;<sub>secure sdlc / code review / api surface &nbsp;—&nbsp; empty</sub></summary>
<a id="d-appsec"></a>

Empty, and I would rather show an empty row than pin a tutorial.

Currently working through authorisation bugs that survive code review,
dependency trust, and what a useful API threat model looks like when the API
is small. When something ships, it appears on the chart.

</details>

<details id="domain-cloud">
<summary><b>CLOUD</b> &nbsp;<sub>identity / posture / logging / iac &nbsp;—&nbsp; empty</sub></summary>
<a id="d-cloud"></a>

Empty. This is the row I most want to fill, and the direction I am heading.

The question I keep coming back to: the gap between what a cloud provider
promises, what a control framework asks for, and what the logs can actually
prove.

</details>

<details id="domain-offensive">
<summary><b>OFFENSIVE</b> &nbsp;<sub>attack paths / control validation &nbsp;—&nbsp; empty</sub></summary>
<a id="d-offensive"></a>

Empty, and honestly so. Offence here exists to validate the assurance and
detection work above — not as a separate hobby, and not something I will claim
before there is code behind it.

</details>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""></div>

## Entries

One security project at a time, dated and left in public — including the ones
that did not work.

| Entry | Date | Repository | Domain |
| :-- | :-- | :-- | :-- |
| `00` | 19.10.2025 | **[PingMaster](https://github.com/het-P301204/PingMaster)** | Detection |
| `01` | 05.09.2026 | **[SecureBridge-ISMS-360](https://github.com/het-P301204/SecureBridge-ISMS-360)** | Assurance |
| `02` | 06.09.2026 | **[AegisLens](https://github.com/het-P301204/AegisLens-security-workbench)** | Assurance · Engineering |
| `03` | 07.09.2026 | *open* | — |

<div align="center"><img src="assets/divider.svg" width="100%" alt=""></div>

<div align="center">

<sub>This is the workshop. The <b><a href="https://hetpatel-lemon.vercel.app">portfolio</a></b> is where the story is.</sub>

<br><br>

<a href="https://hetpatel-lemon.vercel.app"><kbd> hetpatel-lemon.vercel.app </kbd></a>
<a href="https://www.linkedin.com/in/het-patel-913017345/"><kbd> LINKEDIN </kbd></a>
<a href="mailto:phb_hetpatel@outlook.com"><kbd> EMAIL </kbd></a>

<br>

<sub>Every project here uses synthetic data.</sub>

</div>
