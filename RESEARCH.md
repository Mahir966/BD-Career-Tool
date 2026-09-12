# RESEARCH.md — Bangladesh Career & Government Service Calculators
**Last verification date for all primary sources: 2026-09-11** (Asia/Dhaka).
Researcher roles: policy research, legal/regulatory information analysis, data QA.
Every dataset row carries its own `sourceId` + `verifiedDate`; this document explains the hierarchy, findings and — importantly — the unresolved uncertainties.

---

## 0. Source hierarchy (policy actually enforced)

1. **Primary law text** — `bdlaws.minlaw.gov.bd` (Ministry of Law), the Constitution.
2. **Official gazettes / ordinances** referenced through press full-text quotes when the gazette scan is unavailable — marked and flagged.
3. **Official institutional portals** — BPSC, Bangladesh Police (police.gov.bd / Sardah), `join.army.mil.bd`, `joinnavy.navy.mil.bd`, `baf.mil.bd` / `joinairforce.baf.mil.bd`, `bgb.gov.bd`, `ansar.gov.bd`, NTRCA.
4. **Reliable Bangladeshi press** (Prothom Alo, Daily Star, Dhaka Tribune, bdnews24, Jugoantor, Pratidin…) used for circulars where the PDF itself is not machine-readable.
5. **Secondary aggregators** (e.g. bdservicerules.info, students.bd) — **used only for discovery/contrast, never as sole proof for a HIGH-confidence rule.**

Rules implemented in code (`src/data/__tests__/dataIntegrity.test.ts` enforces):
- Any rule with **HIGH confidence must point at a primary-type source** (LAW / GAZETTE / GOVERNMENT_CIRCULAR / RECRUITMENT_CIRCULAR / OFFICIAL_WEBSITE).
- **LOW-confidence** rules force an on-screen warning and never gate a definite eligibility result.
- Where the primary source is unclear → the rule is `MANUAL_VERIFICATION` and **the calculator refuses to produce a date** (spec requirement honoured).

---

## 1. Retirement — the core legal research

### 1.1 Verified baseline (primary text captured verbatim)
**সরকারি চাকরি আইন, ২০১৮ (Government Service Act, 2018 — Act No. 57 of 2018)**, effective 01-Oct-2019 via SRO 305-Law/2019.
Official text: <https://bdlaws.minlaw.gov.bd/act-print-1271.html>

> **ধারা ৪৩। (১)** এই আইনের অন্যান্য বিধান সাপেক্ষে,-
> (ক) একজন সরকারি কর্মচারী তাহার বয়স **৫৯ (ঊনষাট) বৎসর পূর্তিতে**, এবং
> (খ) একজন **মুক্তিযোদ্ধা** সরকারি কর্মচারী তাহার বয়স **৬০ (ষাট) বৎসর পূর্তিতে**, অবসর গ্রহণ করিবেন।

Also captured from the same Act:
- **s.1(3)**: the Act does **not** generally apply to: constitutional posts, **judicial service**, **defence service**, **public universities**, Jatiya Sangsad Secretariat, Supreme Court, EC Secretariat, autonomous bodies & SOEs, LGIs, project/donor jobs, apprentices/contract/ad-hoc/temporary/part-time employment.
- **s.1(4k)** (inserted by amendment): **s.15, 41, 42, 43, 44, 45 DO apply** to employees of **autonomous bodies, state-owned enterprises and local-government institutions** — i.e. the 59/60 retirement rule reaches them too.
- **s.43(2)**: the government may verify the freedom-fighter certificate; FFs appointed as FFs are exempt from re-verification.
- **s.44 Voluntary Retirement**: allowed any time after **25 years** of service, with ≥30 days' notice; irrevocable.
- **s.45**: Government may retire any employee after 25 years in public interest.
- **s.46**: invalidity retirement via medical board. **s.47**: PRL up to 1 year. **s.48/49**: re-employment bars + President's contract re-engagement.
- **s.3**: where another law/rule contains a *special provision* for a service or class, that special provision prevails.

Historical context confirming the numbers (multiple press sources + Supreme Court text): retirement was 57y under the Public Servants (Retirement) Act 1974; raised to **59y** (2011 ordinance, effective 2010-era amendments) and freedom fighters to **60y** (2012–2013 amendments); the 61y High Court suggestion (2018) was stayed/reversed in favour of the legislature's 60y. (AD CP No. 1187 of 2018; Dhaka Tribune 2018-05-07.)

**“Retirement day” convention:** per Bangladesh Service Rules Part-1 **r.79** practice (secondary quote: bdservicerules.info), the day the 59th/60th year is completed is treated as the retirement day (a non-working day) — i.e. **retirement date = date-of-birth + N years exactly**, not month-end. The engine implements exactly this; UI notes the convention.

### 1.2 Category matrix — which rule applies to whom

| Sector | Rule found | Confidence | Notes |
|---|---|---|---|
| All civil govt service (BCS cadres incl. Admin/Police/Foreign/Health/Education/Agri/Fisheries/Livestock/Forest/Engineering/Information/Statistics/Tax/Customs, Audit & Accounts), non-cadre, technical govt staff | 59 / FF 60 — GSA s.43 | **HIGH** | Cadre service regulations mainly affect pay/promotion; retirement follows the Act (no special retirement clause found for these cadres) |
| Autonomous bodies, SOEs, LGIs (e.g. City Corporations, BRTC, NBR-affiliated bodies, banks via their establishment rules) | 59 / FF 60 via s.1(4k) | HIGH (statute) / MEDIUM (per-institute nuance) | Some institutions argue their own rules; s.3 lets a *special provision* prevail → UI keeps the “verify” note where institute-specific |
| **Police** — gazetted officers (ASP+), GSO/SI cadre | 59 / FF 60 — police are Republic employees; MHA retirement orders for police are literally issued “under s.43(1)(a)/45 GSA 2018” (e.g. IGP Benazir Ahmed retirement order; Aug 2026 forced-retirement orders of 56 police officers under s.45) | HIGH/MEDIUM | |
| Police enlisted (Constable→Sergeant) | general rule 59 estimated; some historical practice of lower force caps | **MEDIUM (needs verification)** | Explicit warning shown; users told to check MHA/force orders |
| **Education** — govt primary/secondary/college teachers | GSA 59 / FF 60 | HIGH (cadre teachers) | Contract/project teachers excluded by s.1(3)(ঞ),(ট) → CONTRACT_SPECIFIC “no statutory retirement” |
| Non-govt **MPO** teachers | MPO policy retirement at 59 (employment is with the governing body, not the Republic) | MEDIUM | FF-60 not applicable |
| **Public university teachers** | **65** — Public University Teachers (Retirement) (Special Provision) Act, 2012 (passed 08-Jul-2012; previously 60/62 mixed incl. BUET 60) | MEDIUM-HIGH (press-verified statute; gazette text to re-cite) | Public universities are **outside** GSA (s.1(3)(ঘ)); FF uplift **not** applied by this tool |
| **Judiciary** — SC judges | **67** (Constitution art. 95(1)) | HIGH | |
| District Judges | **65** (Constitution art. 116A) | HIGH | |
| Judicial Service Cadet Officers / addl. judges | 65 in current practice, historically 60-era orders | **LOW → verification required** | Marked estimate |
| **Bangladesh Railway, NBR(Customs/VAT), Health directorates (DGHS hospital staff, nurses, MOs), Fire Service civil staff** | GSA 59/60 (civil departments) | HIGH | |
| **Army / Navy / Air Force** | **NOT 59.** Retirement/release by rank-level service caps and age caps under force regulations; defence services explicitly excluded from GSA (s.1(3)(গ)) | structure HIGH / numbers **LOW** | See §1.3 |
| **BGB, Ansar & VDP, Fire Service (uniformed members), Coast Guard** | force-level rules (56y-era practice for soldiers of BGB reported; multiple 2021–2024 press reports of proposals to raise uniformed-member retirement) — no current consolidated gazette captured | **LOW → MANUAL_VERIFICATION** | Tool refuses to date-estimate; shows the mandated “verify officially” state |
| Contract/project/outside-of-regular appointments | terms of contract; s.49 re-engagement is by President’s order | HIGH (statute) | |

### 1.3 Armed-forces retirement (why the calculator will not show an Army=59 date)
Requirement respected: *never* apply 59/60 to defence. Research status:
- A full official **rank-cap table** (like India’s defence regulations) is **not published on an authoritative Bangladesh portal page** retrievable in Sep-2026.
- Public references (bdservicerules.info, Apr-2026, secondary) report e.g.: commissioned officers up to Major — 23y service / 48y age; Lt Col 27y/52; Col 25y/50; Brig Gen 28y/53; Maj Gen 30y/55; Lt Gen 32y/57; General only for COAS (appointment-based); Soldier 21y, LC 22, Cpl 23, Sgt 24; WO 27, SWO 29, MWO 33.
- Corroboration of the *mechanism*: the 03-Jul-2026 MoD gazette reporting (Prothom Alo English: “normal retirement … by deeming their service valid until they reached the age limit” for 150 tri-service officers) shows retirement is “age limit of rank”, not the civil 59.
- **Decision encoded in data:** Army rule = `RANK_BASED` with those caps at confidence **LOW** (always flagged; date = earlier of (DOB+age cap) and (commission+service cap), both inputs required). Navy/Air-Force = `MANUAL_VERIFICATION` → the exact Bangla message of the brief is shown, no date is invented.

### 1.4 2024–2026 change attempts (so nothing stale creeps in)
- Oct-2024: press reports that the interim govt was **considering** raising entry age to 32 and retirement to 61 (CPD/Dhaka Tribune/BASA demands) — **proposal only**.
- 05-Sep-2024 onward: BASA letter demanding 65y retirement — no enactment.
- 2026 reports (Amader Samoy etc.) of a “nearly final” +1y retirement-age decision (59→60) — **no gazette/SRO captured as of 2026-09-11**; multiple 2026 MHA retirement orders still cite GSA s.43/45 with the existing rules. **Therefore the law remains 59/60**, and RESEARCH flags the pending proposal prominently in the UI (“সর্বশেষ বিধান যাচাই করুন” warning in the rules page notes).
- The **voluntary-retirement 25y** rule is unchanged (s.44); proposals to cut it to 15y remain unimplemented.

---

## 2. Recruitment entry age (the “30 vs 32” story) — the newest, most important update

**Timeline established from multiple full-text news quotes of the ordinances + April-2026 parliamentary passage:**
1. **18-Nov-2024** — President’s Ordinance (interim govt): *“…সর্বোচ্চ বয়সসীমা নির্ধারণ অধ্যাদেশ, ২০২৪”*: maximum entry age **32 for ALL BCS cadres and all non-BCS government posts**; where an existing rule said 30 or ≤32, it is replaced by 32. Effect: the former extra uplifts (FF children 32, doctors 34, PWD 32, women-in-some-cadres 32, IT posts 35 capped back to 32, etc.) were **subsumed/abolished** for covered bodies. Defence services & law-enforcement keep their own rules — expressly preserved in the ordinance text.
2. **22-Dec-2025** — Amendment ordinance: posts whose service rules **already prescribe >32** (e.g. Programmer 35, Computer Supervisor 35, Maintenance Engineer 35) **keep the higher limit**.
3. **05-Apr-2026** — Jatiya Sangsad passed the Bill replacing the 2024/2025 ordinances, giving permanent statutory force (BD Pratidin/Bhorerkagoj/Jugantor coverage). As of 2026-09-11 the gazetted Act text was not yet machine-verified; recorded as **HIGH for the 32-cap** (two ordinances + bill passage, unanimous press) with a verification note.

**Consequences used by the calculators:**
- General govt job & **BCS**: upper 32 (uniform across quotas) — the students.bd “+2 for FF children” table is **out of date for covered government posts** (still true for police/forces' own circulars, which we model per-entry).
- BCS 50th (26-Nov-2025 circular): age **21–32 as on 01-Nov-2025** (Prothom Alo English, matching multiple circular summaries). Attempts: press/blog sources disagree (3 vs 4) — **no claim made**; note directs to the circular PDF. (This is exactly the “do not blindly copy students.bd” instruction applied.)
- Minimum age varies 18–21+ by post (kept as separate per-post fields).

### 2.1 Force/police entry ages found (each tied to a named circular)
| Entry | Age | Source & date | Confidence |
|---|---|---|---|
| Army — Soldier 2026 (Trade notices) | **17–22** (as-on per notice) | join.army.mil.bd ecosystem (Naya Diganta notice 02-Mar-2026; press mirrors) | MEDIUM |
| Army — 97th BMA Long Course | **16½–21 as on 01-Jul-2027**, unmarried | official notice via join.army.mil.bd (published 05-Jan-2026) | MEDIUM |
| Army — DSSC(AFNS) female graduate entries | ~18–22/23 per course | press mirrors of course notices | LOW-MED |
| Navy — Sailor (A-2026) | **17–20** as on 11-Jan-2026; MODC **17–22**; serving-force relaxation 18–23 | joinnavy.navy.mil.bd (press circular mirrors) | MEDIUM |
| Navy — Officer (university cadet entry 2026) | 16½–21 as on 01-Jan-2027 | joinnavy portal mirrors (bdgovt.info 05-Aug-2026) | MEDIUM |
| **Air Force — Officer Cadet Regular/GD(P)** | **16½–22**; **Direct Entry 20–30** | **baf.mil.bd official AFO page (primary)** | HIGH |
| Air Force — Airmen | 16–21 typical (Musical ≤26; Provost height 68") | joinairforce.baf.mil.bd trade pages (primary) + 2025 notice mirrors | HIGH/MEDIUM |
| BGB — Sipahi (105th batch 2026) | **18–23 as on 19-Jul-2026**; SSC 3.00 + HSC 2.50 | bgb.gov.bd circular (press mirrors 17-Mar-2026) | MEDIUM |
| Ansar & VDP — embodied 2026 | **18–22 as on 19-Jul-2026** | DG Ansar circular mirrors | LOW-MED |
| Police — Constable | **18–20** (as-on 07-Feb-2024 / 2026 notice similar), height 5′6″ (5′4″ FF/ethnic), vision 6/6, chest 30–31 | police.gov.bd/Sardah circular via press | MEDIUM |
| Police — Cadet SI (unarmed) | **19–27** (as-on last application date), **32 for FF children**, graduate, height M 5′6″/F 5′4″, chest 32–34, 6/6 | 2024/25 circular (Deshrupantor/Daily Campus full quotes) | MEDIUM |
| Police — Sergeant | 18–25 per notice; **height M 5′8″ / F 5′4″** under amended PRB rules | Police HQ/press (StudyOnlineBD summary) | MEDIUM |
| Coast Guard | no stable public table captured | — | REQUIRES_VERIFICATION (tool refuses to guess) |

### 2.2 Other sectors
- **NTRCA / MPO teacher recruitment**: max age **35** counted **on the circular publication date** (MPO policy “Rule 5”); registration certificate required; courts have occasionally ordered relaxations for stalled cohorts (TBS News 2024) → data carries a “check circular” flag.
- **Banking**: state-owned-bank circulars moved with the national rule; several 2026 PSB notices still print their own caps (18–30 typical for lower grades, 22–30 officers). Private banks: **employer-specific**, commonly MTO 22–28/30, PO ≤30, senior lateral ≤35–40 — stored as *market practice*, explicitly **not** law (per spec).
- **Bangladesh Bank** own rules (Senior Officer 25–32 in past cycles) → verification-required entry.
- **Judiciary recruitment (BJS/BCS-Judicial)**: 22–32 in recent cycles per PSC practice (cadre posts under uniform 32); district-bar direct appointments set practice years instead → verification flag.
- **Research bodies (BCSIR/BARI…) & university lecturer posts**: institution-specific 30–35 → flag.
- **Transport (BRTC etc.)**: circular-bound (often 30 for drivers in their own gazettes) → flag.
- **NGO/development sector**: no legal cap; 18 minimum norm → market practice.

---

## 3. Physical standards (defence recruitment) — what was captured

Primary-source: **BAF official pages** (officer AFO + Join BAF trade pages) — height min 64″ male (162.56 cm), chest 32″ with 2″ expansion, **6/6 both eyes**, Bangladeshi-by-birth, refractive-surgery-before-19 bar (Legal entry page); Airmen: 62–68″ trade-specific, “age 16–21 (Musical 26)”, swimming not required, colour vision normal, disqualified if withdrawn from any govt service.
Press-quoted circulars: Army soldier 2026 — male 1.65 m (ethnic 1.63), female 1.55 m, chest 30–32″, min weight 49.90/47 kg, vision 6/6; Navy — seamen 5′6″/regulating 5′8″ (M), females 5′2–3″, weight ≥50/46 kg, 6/6 + swimming compulsory, unmarried (not divorced); BGB — M 5′6″ F 5′2″ (2025 batch).
**Weight**: none of the services publish a BMI cut-off in the collected notices — they require weight “proportionate to age & height” decided by their medical boards. Hence the app separates *health screening* (BMI/BMR) from *official eligibility* and words comparisons as “based on the published standard stored in this tool … falls within/outside the referenced range”, never “guarantees selection”.

---

## 4. Fitness calculation standards (international, documented)

| Item | Standard used | Source |
|---|---|---|
| BMI formula | kg / m² | WHO/CDC definition |
| BMI bands | <16 severe thinness; 16–17 moderate; 17–18.5 mild; 18.5–24.9 normal; 25–29.9 pre-obese; 30–34.9 I; 35–39.9 II; ≥40 III | WHO obesity/overweight fact sheet & 2004 consultation |
| Regional risk | ≥23 overweight / ≥27.5 high risk (Asia-Pacific) | WHO IASO/WHO SEARO guidance — displayed as secondary note |
| BMR | **Mifflin–St Jeor** (1990 Am J Clin Nutr 52:353-63): M 10W+6.25H−5A+5; F 10W+6.25H−5A−161 | primary paper (PubMed 2377215) |
| Comparison BMR | Revised Harris–Benedict (Roza & Shizgal 1984) | secondary comparison only |
| TDEE multipliers | 1.2 / 1.375 / 1.55 / 1.725 / 1.9 | standard activity-factor set |
| Body-fat | **Deurenberg 1991**: 1.20·BMI+0.23·age−10.8·(M=1)−5.4; **US-DoD tape method** log10 formulae | Deurenberg et al. (Br J Nutr 65:105), DoD 1308 policy formulae |
| Ideal weight | healthy-BMI range × height²; Devine (1974) clinical reference | Devine formula (dosing convention) |
| Unit conversion | 1 in = 2.54 cm exactly; 1 ft = 30.48 cm; 1 lb = 0.45359237 kg | international yard-and-pound definitions |

Every fitness result renders: *what it means / recommended interpretation / important note* — and never frames a screening number as a diagnosis or selection outcome.

---

## 5. students.bd study (inspiration only — no copying)

Studied: `students.bd/`, `students.bd/calculator`, `students.bd/calculator/job-age`, `students.bd/calculator/bcs-age` (public pages, 11-Sep-2026).
**What was learned from them (information architecture only):**
- Hub-and-group calculator catalogue (School / University / Age & Career / Result), strong top-nav mega menu, per-tool page = *form card → instant result card → long explanatory guide with tables → FAQ*, mobile-first single-column forms, sticky CTAs, related-tools rows, grouped footer.
- Their job-age page pattern: DOB-OR-age toggle, quota dropdown, result legend 🟢🔴, comparison tables.
**What was deliberately NOT taken:** no code, CSS, branding, copy, review-widgets; and **their content errors were avoided**:
- “Maximum 3 attempts” vs “4 attempts” (their two pages contradict each other; official 50th circular not re-verified) → we make **no attempt-count claim**.
- “FF children get 32 (general 30)” — **out of date** since the uniform-32 ordinance; we encode the current law.
- Their “Doctors/PWD 34” claim conflicts with the 2024 ordinance subsuming those uplifts (higher limits only survive where a *service rule* already had >32) → we surface nuance per rule, with verification notes.
**Removed from scope** per the brief: result checkers, news/exam-result portals, unrelated education content.

## 6. Bangladesh government visual-language study
Reviewed `bangladesh.gov.bd` and several ministry portals (national emblem header blocks, green/red restrained accents, dense institutional info tables, grid backgrounds). Implemented an **original** design: Bangladesh-green identity (#006a4e family), subtle CSS grid backdrop, document-like card blocks, serif-free Bengali-first typography (Hind Siliguri/Inter), no state emblems, explicit “not an official site” strips in header & hero.

---

## 7. Uncertainties & “requires verification” ledger (authoritative list)

| # | Item | Status | Where visible |
|---|---|---|---|
| U1 | Police **enlisted** retirement age (56/57-era vs general 59) | MEDIUM, estimated 59 + warning | Retirement result warning + rules table |
| U2 | **BGB/Ansar/Fire Service (uniformed)** retirement ages | unresolved → MANUAL_VERIFICATION (no date) | Defence retirement selection |
| U3 | **Navy/BAF rank caps** | unresolved → MANUAL_VERIFICATION (spec-mandated message) | Defence selection |
| U4 | Army rank-cap numbers | public references only → LOW | shown + forced warn |
| U5 | BCS **attempt cap** (3 vs 4 vs none) | conflicting secondary sources → no claim | BCS card note |
| U6 | Final gazetted **text of the 2026 Act** (making 32 permanent) | press-verified, gazette text pending | note32 + rules table |
| U7 | **Retirement 59→60/62** 2026 proposals | not enacted as of 2026-09-11 | Rules page “keep it fresh” note |
| U8 | Feb-29 completion-day convention | tool convention (28 Feb) + note; cadres may differ | Feb-29 warning |
| U9 | Public-university 65 Act — exact title/section | 2012 passage verified via press; section-level cite pending | about/methods |
| U10 | Coast Guard entry ages | no captured authoritative circular → verification flag | job-age card ⚪ |
| U11 | PSB bank caps post-32-rule (financial corporations nuance) | ordinance covers *non-financial* PNFCs; banks vary → MEDIUM | bank card note |
| U12 | NTRCA special recruitments (court relaxations) | event-based → verification flag | NTRCA note |

**Design outcome:** uncertainty is a first-class UI state (⚪ RULE REQUIRES VERIFICATION), never a silently rounded guess.

## 8. Assumptions made (and why)
1. **Retirement day = completion birthday** (s.43 “বয়স … পূর্তিতে”; BSR r.79 practice). Month-end conventions are *not* applied because they belong to service-rules not to the statutory age point.
2. Feb-29 → 28-Feb in non-leap target years (day-before convention), flagged.
3. The countdown measures to 00:00 local of the retirement date (inclusive of remaining days up to that instant).
4. `currentAge` at “today” uses local calendar date (no timezone drift because all math is civil-date arithmetic — see `dateUtils`).
5. Service progress % is purely elapsed/projected; label states it cannot imply entitlement.
6. Numbers are Latin digits in both languages (matching mainstream Bangladeshi government/information sites; Bangla digits would break tabular alignment).
7. Private-sector “limits” are *typical market practice* with the exact wording of §28 of the brief.
8. Where a user selects “Other”, 59 is used as **generic fallback estimate** with the exact Bangla disclaimer of the brief; FF 60 applied only through the general rule (never overrides special statutes), per instruction 16.

## 9. Maintenance playbook
- Changing a rule = edit **one record** in `src/data/*.ts` and bump its `verifiedDate`; no component knows legal numbers (enforced by code review + data tests).
- New category = add a `RetirementRule`/`JobAgeRule` row + source entry; tests auto-cover integrity (source exists, confidence type, sanity ranges).
- Re-verification cycle proposed: quarterly BPSC/force-portal pass; before each major recruitment season (BCS/NSI/forces batches).
