# Programmatic SEO — Phase 2 target list

_Prepared from search-demand research (Google "people also ask" / ranking-content signals,
2026-06) + the Phase 0 system already live. This is a planning doc for the team + reviewing
attorney — not legal content itself._

## Where we are

**Live pilot (reviewed, indexed-pending):** 3-day notice to pay/quit guide · LA tenant-harassment
checklist · security-deposit demand letter · notice-deadline calculator — all in en/es/zh.

**Goal of Phase 2:** expand to a focused set of high-demand, statewide-CA pages (plus a few
city-ordinance pages where the law genuinely differs), one reviewed batch at a time, re-measuring
indexing/ranking in Search Console between batches. **Do not build all 30 at once** — each page costs
trilingual attorney review.

## ⚠️ Fix before expanding (found during research)

- **Unlawful-detainer response deadline is now 10 court days, not 5.** `data/rules/notice-periods.yaml`
  has `summons-unlawful-detainer: days: 5`, but California extended the UD Answer deadline to **10 court
  days** for personal service (AB 2347, effective Jan 1 2025; ~15 days if served by post-and-mail). The
  calculator is live and reviewed — **please have the attorney confirm and correct this number.** A
  wrong deadline here is exactly the kind of error that harms a renter.
- **AB 1482 / rent-cap numbers change annually** (5% + regional CPI). Any rent-increase page or
  calculator needs the same "annual maintenance + fail-safe" treatment as the court-holiday table.

## Prioritization

Ranked by **search demand × intent (closer to "I have a problem now" = higher) × low legal-risk ×
fits the existing system**. City pages only where a local ordinance changes the law.

---

### Tier 1 — statewide, highest demand, build first (8)

| # | Page | Type | Jurisdiction | Primary query | Notes |
|---|------|------|----|----|----|
| 1 | Rent increases & the AB 1482 cap | guide | CA | "how much can a landlord raise rent in California" | Very high volume. Pairs with #8 calculator. Annual CPI maintenance. |
| 2 | Security deposit return: your rights & 21-day rule | guide | CA | "california security deposit law" | Complements the live demand letter; cross-link them. AB 12 (1-month cap). |
| 3 | 30-day & 60-day notice to vacate | guide | CA | "30 day notice to vacate california" | Calculator already supports these notice types — embed it. |
| 4 | How to respond to an eviction (unlawful detainer) | guide | CA | "how to respond to eviction california" | High intent. UD-105 Answer, **10 court-day** deadline (see fix above). |
| 5 | Repairs & habitability: repair-and-deduct & withholding | guide | CA | "california repair and deduct" | Repair-and-deduct limits, retaliation (Civ §1942.5). |
| 6 | Illegal lockout or utility shutoff | guide | CA | "landlord locked me out california" | Urgent, high-intent; Civ §789.3 penalties. |
| 7 | 3-day notice to perform covenants or quit | guide | CA | "3 day notice to perform or quit" | Sibling of the live pay-or-quit guide; reuses its structure. |
| 8 | Rent-increase cap calculator | tool | CA | "california rent increase calculator" | AB 1482 5% + CPI, ≤10%; data-driven like the deadline calculator. |

### Tier 2 — statewide letters & checklists (8)

| # | Page | Type | Jurisdiction | Primary query | Notes |
|---|------|------|----|----|----|
| 9 | Repair / habitability demand letter | letter | CA | "repair request letter to landlord" | Counsel-gated (UPL), like the deposit letter. |
| 10 | Notice of intent to vacate (tenant's 30-day) | letter | CA | "30 day notice to landlord template" | Low risk; very common. |
| 11 | Rent-increase / AB 1482 dispute letter | letter | CA | "dispute rent increase letter california" | Counsel-gated. |
| 12 | Cease-harassment letter | letter | CA | "landlord harassment letter" | Counsel-gated; pairs with harassment checklists. |
| 13 | Move-out checklist (protect your deposit) | checklist | CA | "move out checklist california renter" | Pairs with #2 + the deposit letter. |
| 14 | Eviction response checklist | checklist | CA | "eviction answer checklist california" | Pairs with #4. |
| 15 | Habitability evidence checklist | checklist | CA | "document apartment problems landlord" | Pairs with #5, #9. |
| 16 | Move-in inspection checklist | checklist | CA | "apartment move in checklist" | Top-of-funnel; deposit protection. |

### Tier 3 — city-ordinance pages, only where law differs (≈8; LA already live)

City pages **only** for the `hasOrdinance` cities. Security-deposit / notice rules are mostly statewide
— don't duplicate those per city; build city pages for **just-cause, rent control, relocation, and
harassment**, which genuinely differ.

| # | Page | Type | Jurisdiction | Primary query | Notes |
|---|------|------|----|----|----|
| 17 | San Francisco tenant rights & just cause | guide | SF | "san francisco just cause eviction" | 15 just-causes; pre-1979 coverage. |
| 18 | SF no-fault eviction & relocation pay | guide | SF | "owner move in eviction san francisco" | Ellis Act, OMI, relocation. |
| 19 | Oakland just cause & rent adjustment | guide | Oakland | "oakland just cause for eviction" | Relocation varies by household. |
| 20 | San Jose Apartment Rent Ordinance (ARO/TPO) | guide | San Jose | "san jose rent control rules" | |
| 21 | San Diego Tenant Protection Ordinance | guide | San Diego | "san diego tenant protection ordinance" | Note 2026 county rent cap. |
| 22 | SF tenant harassment checklist | checklist | SF | "san francisco tenant harassment" | Mirror of the live LA checklist. |
| 23 | Oakland tenant harassment checklist | checklist | Oakland | "oakland tenant harassment" | Mirror of LA checklist. |
| 24 | (City just-cause checklists as demand shows) | checklist | per-city | — | Add reactively from GSC data. |

### Tier 4 — backlog / long-tail (build only if Tiers 1–3 index & rank)

Renting after an eviction / sealing a UD record · roommate & subletting disputes · breaking a lease
early (DV, military/SCRA, uninhabitable) · landlord selling / new owner / foreclosure · mold & pest
infestations · Section 8 / housing-voucher tenant rights.

---

## Build & measurement loop

1. **Fix the UD-deadline data** (above) first.
2. **Batch 1 = Tier 1.** Claude drafts all 8 in en/es/zh as `status: draft` → attorney reviews →
   flip to `reviewed`. Ship.
3. **Cross-link** each new page to the related pilot pages (e.g. deposit guide ↔ deposit letter ↔
   move-out checklist) and add the strongest ones into `/programs/` Housing, the way the pilot pages
   now are.
4. **Re-measure in GSC** ~2 weeks after each batch: are prior URLs *Indexed*? Which queries get
   impressions? Use that to reorder the remaining tiers (and to confirm the model works before
   investing in Tiers 3–4).
5. **Request indexing** in GSC for each new URL on publish (manual; the API can't do it).

## Notes
- Every page is trilingual (en/es/zh) and needs **legal-translation review**, not just English review.
- Letters and the rent-cap calculator are **counsel-gated** (UPL / annually-changing numbers).
- Keep faceting to **issue × jurisdiction**; never the full state×city×notice cross-product.
