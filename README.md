<!--
  het-P301204 — profile README
  An index to the repositories, not a homepage. The chart plots what has
  actually been built; repositories are the only bright marks on it.

  The chart is generated: sync.mjs pulls repos, dates and language mix from
  the GitHub API, build.mjs renders the SVGs, and .github/workflows/refresh.yml
  runs both daily. Classify a new repo once in record.json "map" and the
  chart maintains itself. This index is hand-written on purpose — it holds
  judgement (what to read first, why it exists) that cannot be generated.

  INTERACTION NOTE: chip hrefs must target #user-content-* because GitHub
  prefixes id attributes but leaves hrefs alone. Fragment navigation into a
  closed <details> opens it — and opens every ancestor, so a repo link opens
  its domain too. Do not remove the bare <a id="..."> tags; they are the targets.
-->

<div align="center">

<picture>
  <source media="(max-width: 620px)" srcset="assets/record-mobile.svg">
  <img src="assets/record.svg" width="100%" alt="Record of work — repositories plotted by security domain over time">
</picture>

<a href="#user-content-d-assurance"><kbd> ASSURANCE </kbd></a>
<a href="#user-content-d-engineering"><kbd> ENGINEERING </kbd></a>
<a href="#user-content-d-detection"><kbd> DETECTION </kbd></a>
<a href="#user-content-d-appsec"><kbd> APPSEC </kbd></a>
<a href="#user-content-d-cloud"><kbd> CLOUD </kbd></a>
<a href="#user-content-d-offensive"><kbd> OFFENSIVE </kbd></a>

<br>

<a href="#user-content-r-trustedge"><kbd> ↳ &nbsp;NEW HERE? START WITH TRUSTEDGE &nbsp;</kbd></a>
<a href="https://github.com/het-P301204/het-P301204/issues/new?template=teardown.md&title=teardown%7C%3CYOUR%20TOPIC%3E"><kbd> ⊕ &nbsp;REQUEST A TEARDOWN &nbsp;</kbd></a>

<img src="assets/divider.svg" width="100%" alt="">

</div>

I work on the load-bearing parts of security — how a control is evidenced, how
risk becomes a number someone can act on, and how a system tells you it is
being abused. I am mostly interested in why things fail and what makes them
hold.

<!--TESTS:START-->
**1,561 tests** across the lab — AegisLens 108, TrustEdge 601, Pedigree 198, NullFire 424, BlackOut 230. Counted from each repository's own README, not asserted here.
<!--TESTS:END-->

## Index

<!--SUMMARY:START-->
7 repositories across 6 of 6 domains. Open a domain, then open a repository — the second level is where the evidence is. Repository names link straight to the code.
<!--SUMMARY:END-->

<!--INDEX:START-->
<details id="domain-assurance">
<summary><b>ASSURANCE</b> &nbsp;<sub>iso 27001 / isms / controls / evidence &nbsp;—&nbsp; 2 repositories</sub></summary>
<a id="d-assurance"></a>

<details id="repo-securebridge-assurance">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/SecureBridge-ISMS-360">SecureBridge</a></b> &nbsp;<sub>a whole ISMS, end to end</sub></summary>
<a id="r-securebridge"></a>

An interactive, evidence-driven ISO 27001 Integrated ISMS portfolio for SecureBridge Technologies Pvt. Ltd., connecting governance, risk, controls, policies, audits, evidence, management review, and certification readiness across 10 interconnected GRC projects.

| | |
| :-- | :-- |
| **Read first** | The risk register and the control-to-evidence mapping. |

</details>

<details id="repo-aegislens-assurance">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/AegisLens-security-workbench">AegisLens</a></b> &nbsp;<sub>evidence in, risk scored, report out</sub></summary>
<a id="r-aegislens"></a>

AegisLens is an educational and defensive security assessment workbench using synthetic data. It is not a replacement for a SIEM, GRC platform, vulnerability scanner, or professional security audit.

| | |
| :-- | :-- |
| **Stack** | `TypeScript` `Python` `CSS` |
| **Evidence** | 108 tests, CI |
| **Read first** | `backend/tests` — if you want to know whether I can actually build. |
| **Also in** | [ENGINEERING](#user-content-r-aegislens-engineering) |

</details>

<sub>What I am chasing here: the smallest honest evidence set that proves a control operates.</sub>

</details>

<details id="domain-engineering">
<summary><b>ENGINEERING</b> &nbsp;<sub>tooling / automation / pipelines &nbsp;—&nbsp; 3 repositories</sub></summary>
<a id="d-engineering"></a>

<details id="repo-aegislens-engineering">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/AegisLens-security-workbench">AegisLens</a></b> &nbsp;<sub>evidence in, risk scored, report out</sub></summary>
<a id="r-aegislens-engineering"></a>

AegisLens is an educational and defensive security assessment workbench using synthetic data. It is not a replacement for a SIEM, GRC platform, vulnerability scanner, or professional security audit.

| | |
| :-- | :-- |
| **Stack** | `TypeScript` `Python` `CSS` |
| **Evidence** | 108 tests, CI |
| **Read first** | `backend/tests` — if you want to know whether I can actually build. |
| **Also in** | [ASSURANCE](#user-content-r-aegislens) |

</details>

<details id="repo-trustedge-engineering">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/TrustEdge-AWS-IAM-analyzer">TrustEdge</a></b> &nbsp;<sub>who outside your AWS account can get inside it</sub></summary>
<a id="r-trustedge"></a>

Grades who outside an AWS account can become an identity inside it, ranked by exposure x blast radius. Offline IAM trust-policy analyzer - no credentials, no API calls, zero dependencies.

| | |
| :-- | :-- |
| **Stack** | `Python` `Dockerfile` |
| **Evidence** | 601 tests, CI |
| **Runs** | Offline. No credentials, no API calls, nothing leaves the machine. |
| **Read first** | The trust-policy grading logic — that is where the argument is. |
| **Also in** | [CLOUD](#user-content-r-trustedge-cloud) |

</details>

<details id="repo-pedigree-engineering">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/Pedigree-npm-provenance-gate">Pedigree</a></b> &nbsp;<sub>where did this dependency actually come from</sub></summary>
<a id="r-pedigree"></a>

Consumer-side npm provenance verification and policy enforcement. Verifies each dependency's origin against an expected source, then tells you what would break if you enforced it today. Verifies origin - not the absence of malicious code.

| | |
| :-- | :-- |
| **Stack** | `TypeScript` `JavaScript` |
| **Evidence** | 198 tests, CI |
| **Read first** | The dry-run report — what would break if you enforced the policy today. |
| **Also in** | [APPSEC](#user-content-r-pedigree-appsec) |

</details>

<sub>Security work only counts once it runs unattended. This row is the difference between an opinion and a tool.</sub>

</details>

<details id="domain-detection">
<summary><b>DETECTION</b> &nbsp;<sub>telemetry / signals / triage &nbsp;—&nbsp; 3 repositories</sub></summary>
<a id="d-detection"></a>

<details id="repo-pingmaster-detection">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/PingMaster">PingMaster</a></b> &nbsp;<sub>ping, with a graph</sub></summary>
<a id="r-pingmaster"></a>

Ping, but with a graph. A simple, cross-platform tool for visualizing network latency. 🚀  A lightweight, intuitive, and cross-platform graphical ping for developers and network administrators.

| | |
| :-- | :-- |
| **Stack** | `Rust` `Roff` `Dockerfile` |

</details>

<details id="repo-nullfire-detection">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/NullFire">NullFire</a></b> &nbsp;<sub>the Sigma rules that can never fire</sub></summary>
<a id="r-nullfire"></a>

Detection Matchability Analyzer - finds the Sigma rules that can never match your real post-pipeline data, explains why, and generates the minimal event that would prove each one can fire.

| | |
| :-- | :-- |
| **Stack** | `Python` |
| **Evidence** | 424 tests, CI |
| **Read first** | The matchability analysis — why a rule is dead against your real data. |

</details>

<details id="repo-blackout-detection">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/BlackOut">BlackOut</a></b> &nbsp;<sub>one control failure, followed all the way through</sub></summary>
<a id="r-blackout"></a>

Security control failure & detection lab: an authorization fail-open, its exploit, root cause, fix, detection rule and regression test. Local red/blue lab, synthetic data only.

| | |
| :-- | :-- |
| **Stack** | `Python` `CSS` `JavaScript` |
| **Evidence** | 230 tests, CI |
| **Read first** | The exploit, then the detection rule written against it. |
| **Also in** | [APPSEC](#user-content-r-blackout-appsec) · [OFFENSIVE](#user-content-r-blackout-offensive) |

</details>

<sub>A control you cannot observe failing is a control you are trusting on faith.</sub>

</details>

<details id="domain-appsec">
<summary><b>APPSEC</b> &nbsp;<sub>secure sdlc / code review / supply chain &nbsp;—&nbsp; 2 repositories</sub></summary>
<a id="d-appsec"></a>

<details id="repo-pedigree-appsec">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/Pedigree-npm-provenance-gate">Pedigree</a></b> &nbsp;<sub>where did this dependency actually come from</sub></summary>
<a id="r-pedigree-appsec"></a>

Consumer-side npm provenance verification and policy enforcement. Verifies each dependency's origin against an expected source, then tells you what would break if you enforced it today. Verifies origin - not the absence of malicious code.

| | |
| :-- | :-- |
| **Stack** | `TypeScript` `JavaScript` |
| **Evidence** | 198 tests, CI |
| **Read first** | The dry-run report — what would break if you enforced the policy today. |
| **Also in** | [ENGINEERING](#user-content-r-pedigree) |

</details>

<details id="repo-blackout-appsec">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/BlackOut">BlackOut</a></b> &nbsp;<sub>one control failure, followed all the way through</sub></summary>
<a id="r-blackout-appsec"></a>

Security control failure & detection lab: an authorization fail-open, its exploit, root cause, fix, detection rule and regression test. Local red/blue lab, synthetic data only.

| | |
| :-- | :-- |
| **Stack** | `Python` `CSS` `JavaScript` |
| **Evidence** | 230 tests, CI |
| **Read first** | The exploit, then the detection rule written against it. |
| **Also in** | [DETECTION](#user-content-r-blackout) · [OFFENSIVE](#user-content-r-blackout-offensive) |

</details>

<sub>Most of what breaks applications is authorisation and trust in things you did not write.</sub>

</details>

<details id="domain-cloud">
<summary><b>CLOUD</b> &nbsp;<sub>identity / posture / logging / iac &nbsp;—&nbsp; 1 repository</sub></summary>
<a id="d-cloud"></a>

<details id="repo-trustedge-cloud">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/TrustEdge-AWS-IAM-analyzer">TrustEdge</a></b> &nbsp;<sub>who outside your AWS account can get inside it</sub></summary>
<a id="r-trustedge-cloud"></a>

Grades who outside an AWS account can become an identity inside it, ranked by exposure x blast radius. Offline IAM trust-policy analyzer - no credentials, no API calls, zero dependencies.

| | |
| :-- | :-- |
| **Stack** | `Python` `Dockerfile` |
| **Evidence** | 601 tests, CI |
| **Runs** | Offline. No credentials, no API calls, nothing leaves the machine. |
| **Read first** | The trust-policy grading logic — that is where the argument is. |
| **Also in** | [ENGINEERING](#user-content-r-trustedge) |

</details>

<sub>The gap between what a cloud provider promises, what a framework asks for, and what the policy actually permits.</sub>

</details>

<details id="domain-offensive">
<summary><b>OFFENSIVE</b> &nbsp;<sub>attack paths / control validation &nbsp;—&nbsp; 1 repository</sub></summary>
<a id="d-offensive"></a>

<details id="repo-blackout-offensive">
<summary>&nbsp;<b><a href="https://github.com/het-P301204/BlackOut">BlackOut</a></b> &nbsp;<sub>one control failure, followed all the way through</sub></summary>
<a id="r-blackout-offensive"></a>

Security control failure & detection lab: an authorization fail-open, its exploit, root cause, fix, detection rule and regression test. Local red/blue lab, synthetic data only.

| | |
| :-- | :-- |
| **Stack** | `Python` `CSS` `JavaScript` |
| **Evidence** | 230 tests, CI |
| **Read first** | The exploit, then the detection rule written against it. |
| **Also in** | [DETECTION](#user-content-r-blackout) · [APPSEC](#user-content-r-blackout-appsec) |

</details>

<sub>Offence here exists to validate the defensive work above, not as a separate hobby.</sub>

</details>
<!--INDEX:END-->

<details id="how-they-fit">
<summary><b>HOW THEY FIT TOGETHER</b> &nbsp;<sub>one diagram — click it to zoom</sub></summary>
<a id="d-fit"></a>

```mermaid
flowchart LR
  SB["SecureBridge<br/><i>what must be true</i>"]
  TE["TrustEdge<br/><i>who can get into the account</i>"]
  PD["Pedigree<br/><i>where the dependencies came from</i>"]
  BO["BlackOut<br/><i>a control that failed</i>"]
  PM["PingMaster<br/><i>can I see the traffic</i>"]
  NF["NullFire<br/><i>which rules can never fire</i>"]
  AL["AegisLens<br/><i>evidence into a number</i>"]

  SB -. "what must be true" .-> AL
  TE -. "a finding" .-> AL
  PD -. "a finding" .-> AL
  BO -. "a failure, and a rule for it" .-> NF
  PM -. "a signal" .-> NF
  NF -. "can we actually see it" .-> AL

  click SB "https://github.com/het-P301204/SecureBridge-ISMS-360"
  click TE "https://github.com/het-P301204/TrustEdge-AWS-IAM-analyzer"
  click PD "https://github.com/het-P301204/Pedigree-npm-provenance-gate"
  click BO "https://github.com/het-P301204/BlackOut"
  click PM "https://github.com/het-P301204/PingMaster"
  click NF "https://github.com/het-P301204/NullFire"
  click AL "https://github.com/het-P301204/AegisLens-security-workbench"
```

**The arrows are dashed for a reason.** These are separate tools, not an
integrated platform. The diagram maps how the *questions* relate — governance
says what must be true, the analysers produce findings about what is actually
true, detection asks whether you would notice, and assurance turns all of it
into a number someone can act on.

Wiring them together for real is the interesting problem, and it is not done.

</details>

<details id="the-bench">
<summary><b>ON THE BENCH</b> &nbsp;<sub>what the lab is doing right now — updated by a robot, not by me</sub></summary>
<a id="d-bench"></a>

**Latest commits across every repository**

<!--ACTIVITY:START-->
- `e06d9da` **[BlackOut](https://github.com/het-P301204/BlackOut)** — Show all three states in the README, including the fix <sub>just now</sub>
- `bbfd38d` **[BlackOut](https://github.com/het-P301204/BlackOut)** — Record what CI verified on Linux <sub>just now</sub>
- `116434c` **[BlackOut](https://github.com/het-P301204/BlackOut)** — Rewrite the README as the front door <sub>just now</sub>
- `8f8c8be` **[BlackOut](https://github.com/het-P301204/BlackOut)** — Style the scrollbars, and stop the console flooding its own audit log <sub>just now</sub>
- `d6354ab` **[BlackOut](https://github.com/het-P301204/BlackOut)** — Redesign the console as a substation panel, and fix what the screenshots <sub>1h ago</sub>
<!--ACTIVITY:END-->

**The queue.** Anyone can add to it — the
[`REQUEST A TEARDOWN`](https://github.com/het-P301204/het-P301204/issues/new?template=teardown.md&title=teardown%7C%3CYOUR%20TOPIC%3E)
link opens a prefilled issue, an Action sanitises the title, appends it here
and closes the issue. I work through it in roughly the order it arrives.

<!--QUEUE:START-->
| In the queue | Requested by | Issue |
| :-- | :-- | :-- |
| S3 bucket policy evaluation order | [@het-P301204](https://github.com/het-P301204) | [#1](../../issues/1) |
<!--QUEUE:END-->

<sub>Think a repository is filed under the wrong domain?
<a href="https://github.com/het-P301204/het-P301204/issues/new?template=classify.md&title=classify%7C%3CREPO%3E%7C%3CDOMAIN%3E">Say so</a> —
I would rather be corrected than flattering about my own work.</sub>

</details>

<div align="center"><img src="assets/divider.svg" width="100%" alt=""></div>

<div align="center">

<sub>This is the workshop. The <b><a href="https://hetpatel-lemon.vercel.app">portfolio</a></b> is where the story is.</sub>

<br><br>

<a href="https://hetpatel-lemon.vercel.app"><kbd> hetpatel-lemon.vercel.app </kbd></a>
<a href="https://www.linkedin.com/in/het-patel-913017345/"><kbd> LINKEDIN </kbd></a>
<a href="mailto:phb_hetpatel@outlook.com"><kbd> EMAIL </kbd></a>

<br>

<sub>The chart above rebuilds itself from the GitHub API every day. Every project uses synthetic data.</sub>

</div>
