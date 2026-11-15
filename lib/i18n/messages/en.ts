// English source strings. Every other locale is a Partial of this map, so a
// missing translation falls back to English rather than showing a key.
// Add new keys here and run: node scripts/check-i18n.mjs

export const en = {
  "language.label": "Language",
  "language.select": "Choose a language",

  // ——— shared ———
  "common.backToEstimator": "Back to the estimator",
  "common.methodology": "Methodology",
  "common.sources": "Sources",
  "common.actText": "Act text",
  "common.scheduleText": "Schedule text",
  "common.act": "Act",
  "common.schedule": "Schedule",
  "common.readProvision": "Read the provision",
  "common.readAct": "Read the Act text",
  "common.notYetSourced": "Not yet sourced",
  "common.notStored": "Not stored",
  "common.yes": "Yes",
  "common.no": "No",
  "common.open": "open",
  "common.close": "close",
  "common.skipToDocket": "Skip to the docket",
  "common.resetToExample": "Reset to the example",
  "common.errorBuild": "The estimate did not build.",
  "common.legalAid": "Legal aid",
  "common.referenceOnly": "Reference only.",
  "common.feeTable": "Fee table",
  "common.rbiRelease": "RBI release",
  "common.pibRelease": "PIB release",
  "common.nalsaPage": "NALSA legal-aid page",
  "common.actPdf": "Act PDF",
  "common.rules": "Rules",

  // ——— official documents (kept in English) ———
  "doc.englishOnly": "Official documents are issued in English.",

  // ——— masthead ———
  "masthead.tagline": "A cost statement for the queue",
  "masthead.primaryNav": "Primary",
  "masthead.dataDate": "Data: 6 Nov 2026",
  "masthead.mode.partner":
    "Partner mode. Per-case eCourtsIndia lookup is configured. Estimates still show the aggregate fallback.",
  "masthead.mode.aggregate":
    "Aggregate mode. Per-case eCourtsIndia lookup is not configured; estimates use NJDG aggregates only.",
  "masthead.njdgLive": "NJDG live",
  "masthead.njdgSnapshot": "NJDG snapshot",
  "masthead.pending": "{source}: {count} pending",
  "masthead.pendingFallback": "NJDG dated snapshot: 5,21,19,188 pending",

  // ——— hero ———
  "hero.kicker": "For a first-time litigant in India",
  "hero.statement": "A {claim} {kind} in {state} waits {months}.",
  "hero.statementReference":
    "A {claim} {kind} in {state} waits {months} on the civil-court reference queue.",
  "hero.waitCosts": "The wait alone costs:",
  "hero.outOf": "out of {total} the case will cost you",
  "hero.readingQueue": "Reading the queue…",
  "hero.deck":
    "CaseTime prices the queue: the court fee, the appearances, the wages you lose and the money locked up in the claim. The figures below show the forums that cost less and the free legal help you may already qualify for.",
  "hero.context":
    "Against a national backlog of {pending} cases in the district courts, fetched from NJDG on 6 November 2026. Every rupee below carries a sourced Act, schedule or rate.",
  "hero.building": "Building the example statement…",
  "hero.figureTitle": "{caseType} · {state} · {amount}",
  "hero.figureSub": "The dot is filing. The band is the money spent along the queue.",
  "hero.totalAtEnd": "Total at the end of the queue: {total}",
  "hero.thisState": "this State",
  "hero.kind.family": "family dispute",
  "hero.kind.property": "property dispute",
  "hero.kind.money": "money claim",
  "hero.kind.commercial": "commercial claim",
  "hero.kind.consumer": "consumer complaint",
  "hero.kind.cheque": "cheque complaint",
  "hero.kind.criminal": "criminal complaint",

  // ——— case types ———
  "caseType.family": "Family or matrimonial",
  "caseType.property": "Property or land",
  "caseType.money": "Money recovery",
  "caseType.commercial": "Commercial dispute",
  "caseType.consumer": "Consumer complaint",
  "caseType.cheque": "Cheque bounce (s.138)",
  "caseType.criminal": "Other criminal complaint",
  "caseType.hint.family":
    "Maintenance, custody, matrimonial property. Divorce itself cannot go to a Lok Adalat.",
  "caseType.hint.property":
    "Possession, title, partition, boundary. Valued differently from a money suit.",
  "caseType.hint.money":
    "Recovery of a debt, damages or compensation. The fee schedule below is for a money suit.",
  "caseType.hint.commercial":
    "A dispute under s.2(1)(c) of the Commercial Courts Act, 2015, of specified value.",
  "caseType.hint.consumer":
    "The Consumer Commission, not a civil court. The fee follows the consideration paid.",
  "caseType.hint.cheque":
    "A criminal complaint before a Magistrate under s.138 of the Negotiable Instruments Act.",
  "caseType.hint.criminal":
    "A private criminal complaint or trial. Legal aid is available; a demand notice is not the route.",

  // ——— docket form ———
  "docket.title": "Your docket",
  "docket.intro":
    "Start with the case you are weighing. The example is a ₹5,00,000 money recovery in Delhi; change any field and rebuild.",
  "docket.caseType": "Case type",
  "docket.state": "State",
  "state.other": "Another State (fee not yet sourced)",
  "docket.stateHint":
    "Fee schedules are sourced for Delhi, Maharashtra, Karnataka and Tamil Nadu. Any other State is marked not yet sourced; no default fee is added.",
  "docket.claim": "Claim / amount at stake (₹)",
  "docket.claimConsumer": "Value of goods or services paid (₹)",
  "docket.claimCheque": "Cheque amount (₹)",
  "docket.claimHint":
    "For a money suit, the fee follows the amount claimed. Other reliefs are valued differently.",
  "docket.claimHintConsumer":
    "The consumer fee follows the consideration paid, not the compensation claimed.",
  "docket.claimHintCheque":
    "The Delhi fee for a s.138 complaint is calculated on the value of the instrument.",
  "docket.aidSummary": "Free legal aid under s.12",
  "docket.aidIntro":
    "If you meet a criterion, the advocate line drops to ₹0 and the DLSA route appears in the statement. A woman or child qualifies under s.12(c) irrespective of income.",
  "docket.income": "Annual household income (₹, optional)",
  "docket.incomePlaceholder": "Not entered",
  "docket.incomeHint":
    "The State ceiling is applied only if you enter a figure. It is not assumed.",
  "docket.categoriesLegend": "Which of these apply?",
  "docket.aidFootnote":
    "Eligibility still depends on the Authority being satisfied there is a prima facie case (s.13(1)). An affidavit of income is generally sufficient (s.13(2)).",
  "docket.assumptions": "Adjust the assumptions",
  "docket.advocate": "Advocate per appearance (₹)",
  "docket.advocateHint":
    "Default ₹9,000 is the DSLSA panel rate, not a market rate. Enter your quote.",
  "docket.wage": "Your daily income (₹)",
  "docket.wageHint": "Default ₹327.40 is the VB-G RAM G national average.",
  "docket.hearings": "Hearings per month",
  "docket.hearingsHint": "NJDG does not publish hearings per case. This is yours.",
  "docket.days": "Days lost per hearing",
  "docket.repo": "Cost-of-money rate (% per year)",
  "docket.repoHint": "Default 5.50% is the RBI repo rate, 7 Oct 2026.",
  "docket.courtLevel": "Court level",
  "docket.courtDistrict": "District court",
  "docket.courtHigh": "High Court",
  "docket.courtLevelHint":
    "The NJDG snapshot covers district courts; the High Court view is labelled as the district baseline.",
  "docket.submit": "Build my cost statement",
  "docket.building": "Building the statement…",
  "docket.privacy":
    "No login. The estimate is computed on the server from the inputs above; the database stores only the anonymised estimate row.",
  "docket.buildingAria": "Building the estimate",

  // ——— result ———
  "result.heading": "What the queue costs",
  "result.tagCohort": "Disposed-case cohort",
  "result.tagQueue": "Queue-based lower bound",
  "result.headline": "{delay} of the {total} is the wait.",
  "result.sub":
    "The fee and appearances are {litigation}. The lost wages and the money tied up are {delay}. The time figure is {months} of {basis} — read it as a floor, not a schedule.",
  "result.basisReference": "a reference queue",
  "result.basisCivil": "the civil queue",
  "result.legalAidNote":
    "The advocate line is ₹0 because you may qualify under s.12. That removes {saving} from the statement.",
  "result.building":
    "Building the example statement from the NJDG snapshot and the sourced schedules…",
  "result.failed": "The statement did not build.",
  "result.failedHint": "Check the claim amount and try again.",
  "result.dirty": "The statement below uses the previous inputs.",
  "result.rebuild": "Rebuild it now to see the change",

  // ——— cost ledger ———
  "ledger.courtFeeMissingTitle": "The court fee is not in this total.",
  "ledger.line": "Line",
  "ledger.amount": "Amount",
  "ledger.courtFee": "Court fee",
  "ledger.courtFeeBasisUnavailable": "Not yet sourced for this State or forum",
  "ledger.openAct": "Open the Act text",
  "ledger.advocate": "Advocate",
  "ledger.waived":
    "{amount} set to ₹0 under s.12, Legal Services Authorities Act, 1987",
  "ledger.dslsa": "DSLSA panel-fee schedule",
  "ledger.lostWages": "Lost wages",
  "ledger.lostWagesBasis": "{hearings} hearings × {perHearing} lost per hearing.",
  "ledger.wageNotification": "VB-G RAM G wage notification",
  "ledger.costOfMoney": "Cost of money",
  "ledger.costOfMoneyBasis":
    "Claim × RBI repo rate × time. The rate is a risk-free lower bound, not the interest a court may award.",
  "ledger.rbi": "RBI Monetary Policy Statement, 7 Oct 2026",
  "ledger.litigationCost": "Litigation cost (fee + advocate)",
  "ledger.waitingCost": "Cost of waiting (wages + money)",
  "ledger.total": "Total planning cost",
  "ledger.perMonth": "Per month in the queue",
  "ledger.share": "Share of the claim",
  "ledger.hearings": "Hearings counted",
  "ledger.note":
    "The total is a planning estimate, not a quote. It uses {hearings} hearings at {rate} per month and the inputs you entered. Change any input and rebuild the statement.",
  "ledger.howComputed": "How each line is computed",
  "ledger.limitation":
    "This is a queue-based lower bound, not your case's disposal time. NJDG publishes the age of cases still pending, not how long disposed cases took. Cases that settle or dispose early leave the pending pool, so the age bands carry survivorship bias; we show them as the age of the waiting stock and do not use them as disposal times. A disposed-case cohort needs the eCourtsIndia partner key. Without it, read the time figure as an order-of-magnitude floor, not a schedule.",
  "ledger.formula.queue": "Queue clearance",
  "ledger.formula.hearings": "Hearings counted",
  "ledger.formula.courtFee": "Court fee",
  "ledger.formula.advocate": "Advocate",
  "ledger.formula.wages": "Lost wages",
  "ledger.formula.money": "Cost of money",
  "ledger.formula.total": "Total",
  "ledger.formula.source.njdg": "NJDG, dated snapshot",
  "ledger.formula.source.hearings": "Your input; NJDG does not publish hearings per case",
  "ledger.formula.source.noState": "No source for this State",
  "ledger.formula.source.legalAid": "s.12, Legal Services Authorities Act, 1987",
  "ledger.formula.source.quote": "Your quote; ₹9,000 default is the DSLSA panel rate",
  "ledger.formula.source.stateWage": "State notified wage",
  "ledger.formula.source.nationalWage": "VB-G RAM G national average",
  "ledger.formula.source.rbi": "RBI repo rate, 7 Oct 2026",
  "ledger.formula.source.excludesFee": "Excludes court fee (not yet sourced)",
  "ledger.formula.source.sum": "Sum of the lines above",
  "ledger.formula.source.zeroAid": "Set to ₹0 — legal aid",
  "ledger.courtFeeNoteCheque":
    "The court fee for a s.138 complaint in {state} is not yet sourced in this app. The total below excludes it. Ask the court's filing counter or the DLSA before you file.",
  "ledger.courtFeeNoteState":
    "The court-fee schedule for this State is not yet sourced in this app. The total below excludes the court fee. The parent Act is the Court Fees Act, 1870; check your State's schedule with the court's filing counter or the DLSA.",

  // ——— legal aid panel ———
  "aid.kicker": "Section 12, Legal Services Authorities Act, 1987",
  "aid.eligible": "You may qualify for free legal aid.",
  "aid.notEligible": "Not eligible on the income you entered.",
  "aid.unknown": "Legal-aid eligibility not assessed.",
  "aid.saving": "The advocate line drops by {amount}.",
  "aid.category.scst": "Member of a Scheduled Caste or Scheduled Tribe",
  "aid.category.trafficking": "Victim of trafficking in human beings or begar",
  "aid.category.woman-child": "Woman or child (no income test)",
  "aid.category.disability": "Person with disability",
  "aid.category.disaster":
    "Victim of a mass disaster, ethnic violence, caste atrocity, flood, drought, earthquake or industrial disaster",
  "aid.category.workman": "Industrial workman",
  "aid.category.custody":
    "Person in custody (protective home, juvenile home, psychiatric hospital or nursing home)",
  "aid.category.senior":
    "Senior citizen (60+) with annual income below ₹4,00,000",
  "aid.category.transgender":
    "Transgender person with annual income below ₹4,00,000",
  "aid.category.acid": "Acid-attack victim",
  "aid.category.hiv": "Person infected or affected by HIV",
  "aid.list.woman": "Woman or child — no income test.",
  "aid.list.scst": "Member of a Scheduled Caste or Scheduled Tribe",
  "aid.list.disability": "Person with disability",
  "aid.list.workman": "Industrial workman",
  "aid.matched.income":
    "Annual income below the {state} ceiling of {amount}",
  "aid.courtFeeTitle": "Court fee is separate.",
  "aid.order33": "Order XXXIII CPC",
  "aid.incomeCeiling": "The State income ceiling used here is {amount} per year.",
  "aid.incomeCeilingWithSource":
    "The State income ceiling used here is {amount} per year. Source: {source}.",
  "aid.noIncome":
    "No income ceiling is stored for this State. Ask the DLSA for the current figure.",
  "aid.whereApply": "Where to apply",
  "aid.findDlsa": "Find your DLSA",
  "aid.applyNalsa": "Apply through NALSA",
  "aid.carry":
    "Carry proof of the category and, if income is the route, an affidavit. The Authority decides whether there is a prima facie case. {note}",

  // ——— alternatives ———
  "alt.heading": "Where to go instead",
  "alt.intro":
    "Four statutory routes out of the queue. The right one depends on facts a template cannot see; use this table to ask a legal-aid lawyer the right question.",
  "alt.name.lok-adalat": "Lok Adalat",
  "alt.name.pims": "Pre-institution mediation (commercial)",
  "alt.name.mediation": "Mediation under the Mediation Act, 2023",
  "alt.name.compounding": "Compounding a cheque-bounce complaint",
  "alt.recommended": "Recommended for this case",
  "alt.unavailable": "Not available",
  "alt.feeNotFixed": "Fee not fixed",
  "alt.link.lok-adalat": "NALSA: how Lok Adalats work",
  "alt.link.pims": "NALSA: pre-institution mediation",
  "alt.link.mediation": "Mediation Act, 2023 (PDF)",
  "alt.link.compounding": "NI Act, s.147",
  "alt.footnote":
    "A Lok Adalat cannot take a non-compoundable offence. A mediated settlement is enforceable as a decree (Mediation Act, 2023, s.27; Lok Adalat award, LSA 1987, s.21). The s.12A route is mandatory for a commercial suit that does not contemplate urgent interim relief. None of this is a recommendation for your specific case.",

  // ——— places ———
  "places.heading": "Nearest help",
  "places.intro":
    "Courthouse locations are a cached OpenStreetMap snapshot. The DLSA is the free-help route; call before you travel.",
  "places.around": "Courthouses around {city}",
  "places.courthouses": "Courthouses",
  "places.osmType": "OSM {type}",
  "places.metres": "{distance} m",
  "places.kilometres": "{distance} km",
  "places.openOsm": "Open in OSM",
  "places.empty":
    "No cached OpenStreetMap locations for {state}. The DLSA link below is the free-help route.",
  "places.snapshot": "Snapshot fetched {date}.",
  "places.licence": "OpenStreetMap licence",
  "places.note":
    "Cached snapshot of courthouses around four city centres. Not exhaustive: OSM coverage varies. Coordinates are copied verbatim from OSM; no location is inferred.",
  "places.help": "Free legal help",
  "places.helpBody":
    "The DLSA can assign a panel advocate, draft the plaint or complaint, and explain the court-fee position. If you meet a s.12 criterion, the advocate is free.",

  // ——— time-cost band ———
  "band.summary":
    "Time-cost band for {months}. The total is {total}, of which {delay} is the cost of waiting.",
  "band.youFile": "you file",
  "band.monthTitle":
    "Month {month}: {total} ({litigation} litigation + {delay} delay)",
  "band.file": "file",
  "band.queueClears": "queue clears",
  "band.monthsShort": "{months} mo",
  "band.legendLit": "Court fee and appearances",
  "band.legendDelay": "Lost wages and the money locked up",
  "band.totalAtEnd": "{total} at the end of the queue",
  "band.caption":
    "Each column is a month of the queue. The blue block is the court fee plus the appearances you fund; the red block is the wage you lose and the cost of money tied up in the claim. The dot is the day you file. Hover or focus a column for the running total.",
  "band.ageIntro": "Age of cases still pending, not disposal time:",
  "band.p50": "P50 {value}",
  "band.p75": "P75 {value}",
  "band.p90": "P90 {value}",
  "band.stock":
    "The stock that feeds those figures, by age, so you can see why they are not disposal times:",
  "band.tableCaption":
    "NJDG age bands for pending cases. Survivorship bias: cases that finish early leave the pool, so the share still waiting after ten years is not the share that took ten years.",
  "band.ageAtCount": "Age at the count",
  "band.casesPending": "Cases still pending",
  "band.share": "Share",
  "band.poolLegend":
    "Read it as the age of the waiting room, not the length of the stay: a case finished in eight months never appears in the “5–10 years” band, so that band cannot tell you what eight months looked like. These counts never enter the cost calculation — the money figures use the queue horizon above.",
  "band.referenceConsumer":
    "NJDG covers district civil courts, not Consumer Commissions. The queue above is the civil-court reference; no consumer-commission disposal series is published in NJDG.",
  "band.referenceCriminal":
    "NJDG's criminal pendency covers all criminal cases, not s.138 complaints specifically. The queue above is a broad criminal-court reference.",
  "band.age.lessThan1": "<1 year",
  "band.age.1to3": "1-3 years",
  "band.age.3to5": "3-5 years",
  "band.age.5to10": "5-10 years",
  "band.age.moreThan10": ">10 years",

  // ——— floating statement ———
  "float.aria": "Running total",
  "float.dirty": "Total changes — rebuild to update",
  "float.total": "Total planning cost",
  "float.courtFee": "Court fee",
  "float.advocate": "Advocate",
  "float.waived": "₹0 · legal aid",
  "float.wages": "Lost wages",
  "float.money": "Cost of money",
  "float.litigation": "Litigation cost",
  "float.waiting": "Cost of waiting",
  "float.foot": "{months} in the queue · {perMonth} a month",
  "float.rebuild": "Rebuild with your new inputs",

  // ——— notice ———
  "notice.heading": "The notice you can send",
  "notice.intro":
    "A generated draft with bracketed fields. It is a starting point for a DLSA panel lawyer, not a filing-ready document.",
  "notice.readProvision": "Read the provision",
  "notice.draftAria": "Draft notice text",
  "notice.copy": "Copy notice",
  "notice.copied": "Copied",
  "notice.download": "Download .txt",
  "notice.copyFailed": "Copy failed. Select the text and copy it manually.",
  "notice.replace":
    "Replace every bracketed field. Do not send a notice with a placeholder left in it. Keep proof of dispatch and a copy.",
  "notice.before": "Before you send it",
  "notice.callout":
    "A notice is a legal step with consequences. Have a DLSA panel lawyer read it, especially the limitation date and the demand.",

  // ——— statement toolbar ———
  "statement.toolbarTitle": "Case cost statement",
  "statement.printNote": "One page, A4. Print or save as PDF.",
  "statement.print": "Print / save as PDF",

  // ——— home methodology note ———
  "homeMethod.heading": "What this estimate is, and is not",
  "homeMethod.lowerBound":
    "It is a queue-based lower bound. The time figure is pendency ÷ monthly disposals: how long today's backlog would take to clear at today's throughput if no new cases arrived. It is not a prediction for your case.",
  "homeMethod.ageBands":
    "It does not use age bands as disposal times. NJDG publishes the age of cases still pending, not how long disposed cases took. Cases that settle or dispose early leave the pending pool, so the age bands carry survivorship bias. We show them as the age of the waiting stock and keep them out of the cost calculation.",
  "homeMethod.sourced":
    "Every rupee has a source or a formula. Court fees come from the State Act schedules (Delhi, Maharashtra, Karnataka, Tamil Nadu); a State without a sourced schedule is marked not yet sourced and excluded from the total. The wage is the VB-G RAM G national average. The cost of money is the RBI repo rate. The advocate fee is your input, anchored to the DSLSA panel rate.",
  "homeMethod.cohort":
    "A cohort would be better. With an eCourtsIndia partner key, the app can use filing-to-decision durations from disposed cases. Without the key, it says so on this screen and uses the labelled floor.",
  "homeMethod.link": "Read the methodology",

  // ——— footer ———
  "footer.about":
    "CaseTime · Code for a Billion (Code for India) — Timely Justice. Built with Next.js, node:sqlite and the NJDG dated snapshot.",
  "footer.disclaimer":
    "This is a planning estimate, not legal advice, not a prediction, and not a quote. For advice on your case, go to the DLSA or an advocate.",
  "footer.dataNote":
    "Data accessed 6 November 2026. Court-fee Acts and the RBI rate are cited per row on the sources page.",

  // ——— methodology page ———
  "methodPage.kicker": "Methodology",
  "methodPage.title": "The number is a floor, and we say so on the screen.",
  "methodPage.deck":
    "CaseTime turns a court queue into a cost statement. This page shows the derivation, the source, and the limit of every number. If a figure is not sourced, the app says so and leaves it out of the total.",
  "methodPage.correctionTitle": "The correction.",
  "methodPage.correctionBody":
    "The first version presented NJDG pending-pool age bands as if they were disposal times. That is survivorship bias: cases that settle or dispose early leave the pending pool, so the remaining stock is older than a random case. This version separates the two. Queue clearance is a system lower bound. Age bands are the age of the waiting stock. Neither is presented as a prediction for your case.",
  "methodPage.s1.title": "1. Time: queue clearance, not a case duration",
  "methodPage.s1.p1":
    "The time figure is a queue calculation, not a model of your case. It answers a narrow question: at the throughput NJDG recorded last month, how long would today's backlog take to clear if no new cases arrived?",
  "methodPage.s1.formula1": "queueClearMonths = pendency ÷ disposals in the last month",
  "methodPage.s1.formula2": "monthsUsed = min(queueClearMonths, 120)",
  "methodPage.s1.formula3": "hearings = round(monthsUsed × hearings per month you enter)",
  "methodPage.s1.p2":
    "The 120-month cap is a presentation choice for the hearing count. It is shown on the statement. It does not mean the queue ends at 120 months.",
  "methodPage.s1.colBucket": "Bucket",
  "methodPage.s1.colPending": "Pending",
  "methodPage.s1.colDisposed": "Disposed last month",
  "methodPage.s1.colQueue": "Queue",
  "methodPage.s1.civil": "Civil",
  "methodPage.s1.criminal": "Criminal",
  "methodPage.s1.total": "Total",
  "methodPage.s1.source":
    "Source: NJDG dated snapshot, fetched {fetchedAt}. The live dashboard is parsed server-side at njdg.ecourts.gov.in and cached for an hour; if the fetch fails, the dated snapshot is used and the banner says so.",
  "methodPage.worked.title": "Worked example",
  "methodPage.worked.intro":
    "A ₹5,00,000 money recovery in Delhi, one hearing a month, one day lost per hearing, the default advocate and wage inputs, and the RBI repo rate:",
  "methodPage.worked.colLine": "Line",
  "methodPage.worked.colDerivation": "Derivation",
  "methodPage.worked.colValue": "Value",
  "methodPage.worked.queue": "Queue",
  "methodPage.worked.hearings": "Hearings",
  "methodPage.worked.courtFee": "Court fee",
  "methodPage.worked.courtFeeDerivation": "Delhi Schedule I, Article 1: 3% of ₹5,00,000",
  "methodPage.worked.advocate": "Advocate",
  "methodPage.worked.wages": "Lost wages",
  "methodPage.worked.money": "Cost of money",
  "methodPage.worked.total": "Total",
  "methodPage.worked.totalDerivation": "{litigation} litigation + {delay} delay",
  "methodPage.worked.caption":
    "The total is {share} of the claim. The advocate line is the largest line, and it is the one legal aid can remove. That is why the legal-aid check is part of the model, not a footnote.",
  "methodPage.njdg.title": "What NJDG does not publish",
  "methodPage.njdg.body":
    "NJDG publishes counts and age bands for cases still pending. It does not publish how long disposed cases took. The P50/P75/P90 values on the home page are percentiles of the age of the pending stock, computed from the band midpoints (0.5, 2, 4, 7.5 and 12 years). They are labelled as such and are not used in the cost calculation. A case that settled in six months is not in the pool at all; using the pool as a disposal-time distribution would overstate the wait for routine matters and understate it for the tail.",
  "methodPage.coverage.title": "Forum coverage",
  "methodPage.coverage.colCaseType": "Case type",
  "methodPage.coverage.colForum": "Forum",
  "methodPage.coverage.colCoverage": "NJDG coverage",
  "methodPage.coverage.colApp": "What the app does",
  "methodPage.coverage.civilCase": "Family, property, money, commercial",
  "methodPage.coverage.civilForum": "District civil court",
  "methodPage.coverage.civilBucket": "Civil bucket",
  "methodPage.coverage.civilApp": "Uses the civil queue; labels the court level.",
  "methodPage.coverage.consumer": "Consumer",
  "methodPage.coverage.consumerForum": "Consumer Commission",
  "methodPage.coverage.notCovered": "Not covered",
  "methodPage.coverage.consumerApp":
    "Shows the civil queue as a reference and says it is not a consumer-commission estimate.",
  "methodPage.coverage.cheque": "Cheque bounce (s.138)",
  "methodPage.coverage.magistrate": "Magistrate",
  "methodPage.coverage.criminalNotSpecific": "Criminal bucket, not s.138-specific",
  "methodPage.coverage.chequeApp":
    "Shows the criminal queue as a broad reference and says so.",
  "methodPage.coverage.criminal": "Other criminal",
  "methodPage.coverage.criminalForum": "Magistrate / criminal court",
  "methodPage.coverage.criminalBucket": "Criminal bucket",
  "methodPage.coverage.criminalApp":
    "Uses the criminal queue; no demand notice is generated.",
  "methodPage.cohort.title": "Cohort mode",
  "methodPage.cohort.body":
    "If ECI_KEY is set, the estimate route asks the eCourtsIndia partner adapter for disposed cases and computes filing-to-decision durations from fields the response actually contains. It needs at least five dated disposed rows; if the response shape does not contain them, it returns nothing and the app falls back to the labelled queue floor. It never fills a missing date. The cohort is a third-party dataset, not a government source, and the statement says so when it is used.",
  "methodPage.s2.title": "2. Cost: every line",
  "methodPage.courtFee.title": "Court fee",
  "methodPage.courtFee.body1":
    "Court fees are a State subject (Entry 3, State List). The parent Act is the Court Fees Act, 1870. The app uses the State's own schedule for a money suit. It does not use a secondary calculator and it does not reuse a default for a State it has not sourced.",
  "methodPage.courtFee.colState": "State",
  "methodPage.courtFee.colAct": "Act and section",
  "methodPage.courtFee.colRule": "Money-suit rule",
  "methodPage.courtFee.colAccess": "Access",
  "methodPage.courtFee.body2":
    "Any other State is shown as not yet sourced. The court fee is then excluded from the total, with a visible note, rather than filled with a default. The same applies to a s.138 complaint outside Delhi: the app only has the Delhi Article 3 rule, so it does not guess the other States' criminal-complaint fee.",
  "methodPage.consumer.title": "Consumer fee",
  "methodPage.consumer.body":
    "A consumer complaint is not a civil suit. The fee follows rule 7(2) of the Consumer Protection (Consumer Disputes Redressal Commissions) Rules, 2020, as amended in 2023, and it is based on the value of the goods or services paid as consideration, not the compensation claimed. Up to ₹5,00,000 the fee is nil. The app uses that table and labels the forum as the Consumer Commission.",
  "methodPage.consumer.source":
    "Source: {act}, {section}. Accessed {accessed}.",
  "methodPage.advocate.title": "Advocate",
  "methodPage.advocate.body":
    "There is no statutory advocate-fee schedule. The app does not invent a market rate. It starts at ₹9,000 per appearance, the Delhi State Legal Services Authority panel rate, and lets you replace it with your own quote. If you qualify for legal aid, the line is set to ₹0: NALSA's legal-aid FAQ says the fees of panel lawyers are borne by the legal services institutions. The panel rate is an anchor, not a quote for your case.",
  "methodPage.wages.title": "Lost wages",
  "methodPage.wages.body":
    "Opportunity cost = daily income × hearings × days lost per hearing. The default daily income is the VB-G RAM G national average of {average} per day (floor {floor}). It is a rural employment-guarantee wage, so it is a floor for many urban and informal incomes; the input is editable and the fallback is labelled. Source: {source}, accessed {accessed}.",
  "methodPage.money.title": "Cost of money",
  "methodPage.money.body":
    "Money tied up in a claim is not free. The app uses the RBI policy repo rate as the risk-free anchor: claim × repo rate × years in the queue. This is a lower bound on the cost of capital; borrowing costs and a claimant's own opportunity cost are usually higher. It is not the interest a court may award at the end. The rate is editable.",
  "methodPage.money.source":
    "Rate: {rate}% as of {asOf}. {source}, accessed {accessed}.",
  "methodPage.hearings.title": "Hearings",
  "methodPage.hearings.body":
    "NJDG does not publish hearings per case. The app derives hearings from the time figure and the hearings-per-month you enter. Both are visible. If your advocate charges a lump sum instead of a per-appearance fee, set the per-appearance fee to the lump sum and hearings to 1, or adjust the hearings-per-month to match the real listing pattern.",
  "methodPage.s3.title": "3. Legal aid changes the total",
  "methodPage.s3.p1":
    "Section 12 of the Legal Services Authorities Act, 1987 lists who is entitled to legal services. Section 13(1) makes it subject to the Authority being satisfied that there is a prima facie case. Section 13(2) says an affidavit of income is generally sufficient. A woman or child qualifies under s.12(c) irrespective of income.",
  "methodPage.s3.colCriterion": "Criterion",
  "methodPage.s3.colCite": "Cite",
  "methodPage.s3.colIncome": "Income test?",
  "methodPage.s3.incomeCeiling": "Annual income below the State ceiling",
  "methodPage.s3.p2":
    "The income ceilings used are the NALSA compilation: Delhi ₹3,00,000; Maharashtra ₹3,00,000; Karnataka ₹3,00,000; Tamil Nadu ₹3,00,000. Delhi adds ₹4,00,000 for senior citizens and transgender persons, and no income test for acid-attack victims and persons affected by HIV. The Karnataka figure is disputed by the KSLSA FAQ, which still prints ₹1,00,000; the app uses the NALSA table and tells you to confirm with the DLSA.",
  "methodPage.s3.p3":
    "Legal aid sets the advocate line to ₹0. It does not automatically waive the court fee. If you cannot pay the fee, ask the DLSA about filing as an indigent person under Order XXXIII of the Code of Civil Procedure, 1908.",
  "methodPage.s4.title": "4. Alternatives",
  "methodPage.s4.p1":
    "The alternatives panel is a set of statutory routes, not a recommendation. Each row states its basis, its statutory time limit, its cost, and a link. The app highlights a route based on the case type and value, but the final choice depends on facts a template cannot see.",
  "methodPage.s4.colForum": "Forum",
  "methodPage.s4.colBasis": "Statutory basis",
  "methodPage.s4.colTime": "Time",
  "methodPage.s4.colCost": "Cost",
  "methodPage.s4.lokName": "Lok Adalat",
  "methodPage.s4.lokBasis": "Legal Services Authorities Act, 1987, ss.19–21",
  "methodPage.s4.lokTime": "One sitting; no statutory outer limit",
  "methodPage.s4.lokCost": "No court fee; refund where a pending case is referred (s.21(1))",
  "methodPage.s4.pimsName": "Pre-institution mediation",
  "methodPage.s4.pimsBasis":
    "Commercial Courts Act, 2015, s.12A; PIMS Rules, 2018",
  "methodPage.s4.pimsTime": "3 months + 2 months with consent",
  "methodPage.s4.pimsCost": "₹1,000 application + Schedule II fee, shared equally",
  "methodPage.s4.mediationName": "Mediation Act, 2023",
  "methodPage.s4.mediationBasis": "ss.5, 18, 27",
  "methodPage.s4.mediationTime": "120 days + 60 days by agreement",
  "methodPage.s4.mediationCost":
    "No statutory fee; a DLSA/court-annexed centre may be free",
  "methodPage.s4.compoundName": "Compounding a s.138 complaint",
  "methodPage.s4.compoundBasis":
    "Negotiable Instruments Act, 1881, s.147; s.143A",
  "methodPage.s4.compoundTime": "At any stage with court permission",
  "methodPage.s4.compoundCost":
    "No statutory compounding fee; the settlement is the cheque amount",
  "methodPage.s5.title": "5. What this cannot tell you",
  "methodPage.s5.li1":
    "Your case's disposal time. The queue is a system lower bound. A routine matter can dispose far sooner; a contested tail can run far longer.",
  "methodPage.s5.li2":
    "Whether you will win. The model prices time and cost, not merits. The cost of a loss (costs awarded against you, the claim itself) is not in the total.",
  "methodPage.s5.li3":
    "Consumer-commission or s.138-specific time. NJDG does not publish either series. The app shows the nearest bucket and labels it a reference.",
  "methodPage.s5.li4":
    "A State's court fee outside the four sourced States. It is marked not yet sourced and excluded from the total.",
  "methodPage.s5.li5":
    "Whether legal aid will be granted. Section 12 is an entitlement, but s.13(1) requires the Authority to be satisfied there is a prima facie case. Take the documents and ask.",
  "methodPage.s5.li6":
    "Market advocate fees. The ₹9,000 default is the Delhi panel rate. Your quote is the real input.",
  "methodPage.s6.title": "6. Data modes and access dates",
  "methodPage.s6.li1":
    "NJDG: live HTML parsed server-side, cached for an hour, with a dated snapshot fallback. The estimate uses the dated snapshot so the arithmetic is reproducible; the banner shows whether the live fetch succeeded.",
  "methodPage.s6.li2":
    "eCourtsIndia: third-party, paid, key-gated. Without ECI_KEY the app runs in aggregate mode with a banner. It never scrapes services.ecourts.gov.in and never invents a CNR. With the key, cohort mode is attempted; if the response has no dated disposed rows, the app says so and uses the queue floor.",
  "methodPage.s6.li3":
    "OpenStreetMap: a cached snapshot of amenity=courthouse around four city centres, fetched through the Overpass API with mirror retries. Coordinates are copied from OSM; no location is inferred. The snapshot is not exhaustive.",
  "methodPage.s6.li4":
    "BharatCode: the adapter remains in lib/bharatcode.ts, but the decision flow does not paraphrase the numbers through a language model. The statement is deterministic. A model-written summary cannot introduce a rupee or a month that is not in the table.",
  "methodPage.s6.footer":
    "Every source with its URL and access date is on the sources page.",

  // ——— sources page ———
  "sourcesPage.kicker": "Sources",
  "sourcesPage.title": "Every rupee and every month, with a link.",
  "sourcesPage.deck":
    "This page is the audit trail. Each row names the instrument, the section, the URL and the access date. Where a State or a forum is not sourced, the row says so; the app does not fill the gap with a default.",
  "sourcesPage.time.title": "Time and pendency",
  "sourcesPage.colFigure": "Figure",
  "sourcesPage.colValue": "Value",
  "sourcesPage.colSource": "Source",
  "sourcesPage.colAccess": "Access",
  "sourcesPage.colState": "State",
  "sourcesPage.colAct": "Act and section",
  "sourcesPage.colRule": "Money-suit rule (as read from the Act)",
  "sourcesPage.colLink": "Link",
  "sourcesPage.pending": "Pending, civil / criminal / total",
  "sourcesPage.njdgParsed": "NJDG dashboard, parsed live server-side.",
  "sourcesPage.njdgSourceNote":
    "NJDG serves an HTML dashboard (no public JSON). Figures below were parsed from the live page HTML on the fetch date and cross-checked against the embedded fetchYearData('...','4771130~2666765~1462529~1547867~804739') age-band string.",
  "sourcesPage.dataGovNote":
    "data.gov.in hosts NJDG-derived datasets such as 'Civil Pendency 5-10 years' (api.data.gov.in). The live catalog search endpoint returned HTML (JS app) on 2026-11-06, so dataset-level verification is linked, not embedded. See sources page.",
  "sourcesPage.disposed": "Disposed last month, civil / criminal",
  "sourcesPage.sameDashboard": "Same NJDG dashboard.",
  "sourcesPage.ageBands": "Age bands (civil)",
  "sourcesPage.ageBandsSource":
    "Same dashboard, fetchYearData band string. These are ages of cases still pending, not disposal times.",
  "sourcesPage.dataGov": "data.gov.in NJDG datasets",
  "sourcesPage.catalogLinked": "Catalog linked, not embedded",
  "sourcesPage.fees.title": "Court fees: the Act, the section, the rule",
  "sourcesPage.otherState": "Any other State",
  "sourcesPage.otherStateRule":
    "The app shows “not yet sourced” and excludes the court fee from the total. It does not reuse the central schedule as a default.",
  "sourcesPage.consumer.title": "Consumer Commission fee",
  "sourcesPage.consumer.body":
    "{act}, {section}. The fee follows the value of the goods or services paid as consideration, not the compensation claimed. Accessed {accessed}.",
  "sourcesPage.consumer.colValue": "Value of goods or services paid as consideration",
  "sourcesPage.consumer.colFee": "Fee",
  "sourcesPage.consumer.above": "Above ₹10,00,00,000",
  "sourcesPage.consumer.upTo": "Up to {amount}",
  "sourcesPage.consumer.nil": "Nil",
  "sourcesPage.consumer.note":
    "The fee follows the value of the goods or services paid as consideration, not the compensation claimed. Up to ₹5,00,000 the prescribed fee is nil. Filing is through the Consumer Commission or the e-Daakhil portal.",
  "sourcesPage.legalAid.title": "Legal aid",
  "sourcesPage.legalAid.body": "{act}, {section}. Accessed 2026-11-06.",
  "sourcesPage.legalAid.colCriterion": "Criterion",
  "sourcesPage.legalAid.colCite": "Cite",
  "sourcesPage.legalAid.incomeCeiling": "Annual income below the State ceiling",
  "sourcesPage.legalAid.colIncomeState": "State",
  "sourcesPage.legalAid.colIncomeLimit": "Income ceiling",
  "sourcesPage.legalAid.delhiExtras": "Delhi extras",
  "sourcesPage.legalAid.delhiExtrasValue":
    "₹4,00,000 for senior citizens and transgender persons",
  "sourcesPage.legalAid.otherStates": "Other States",
  "sourcesPage.legalAid.otherStatesRule":
    "The app says “no income ceiling stored for this State” and routes you to the DLSA.",
  "sourcesPage.wages.title": "Wages, advocate and interest",
  "sourcesPage.wages.daily": "Daily wage, national average",
  "sourcesPage.wages.dailyValue": "{average}/day (floor {floor})",
  "sourcesPage.wages.stateWage": "{state} wage",
  "sourcesPage.wages.bandOnly": "Band only",
  "sourcesPage.wages.advocateDefault": "Advocate, default anchor",
  "sourcesPage.wages.perUnit": "{amount} per {unit}",
  "sourcesPage.wages.perAppearance": "{amount} per appearance",
  "sourcesPage.wages.advocateCover": "Advocate, legal-aid cover",
  "sourcesPage.wages.advocateCoverValue":
    "Panel lawyer fee borne by the legal services institution",
  "sourcesPage.wages.repo": "RBI policy repo rate",
  "sourcesPage.wages.rbiNote":
    "The repo rate is the risk-free anchor for the cost of money tied up in a case. It is not the interest a court may award. Borrowing costs and the claimant's own cost of capital are usually higher; the input can be overridden.",
  "sourcesPage.alternatives.title": "Alternatives",
  "sourcesPage.alternatives.colForum": "Forum",
  "sourcesPage.alternatives.colBasis": "Statutory basis",
  "sourcesPage.alternatives.colTime": "Time",
  "sourcesPage.alternatives.colLink": "Link",
  "sourcesPage.alternatives.lokName": "Lok Adalat",
  "sourcesPage.alternatives.lokBasis":
    "Legal Services Authorities Act, 1987, ss.19–21",
  "sourcesPage.alternatives.lokTime": "One sitting; no statutory outer limit",
  "sourcesPage.alternatives.pimsName": "Pre-institution mediation",
  "sourcesPage.alternatives.pimsBasis":
    "Commercial Courts Act, 2015, s.12A; Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018, rr.3, 11 and Sch. II",
  "sourcesPage.alternatives.pimsTime": "3 months + 2 months with consent",
  "sourcesPage.alternatives.mediationName": "Mediation Act, 2023",
  "sourcesPage.alternatives.mediationBasis": "ss.5, 18, 27",
  "sourcesPage.alternatives.mediationTime": "120 days + 60 days by agreement",
  "sourcesPage.alternatives.compoundName": "Compounding a s.138 complaint",
  "sourcesPage.alternatives.compoundBasis":
    "Negotiable Instruments Act, 1881, s.147; s.143A",
  "sourcesPage.alternatives.compoundTime": "At any stage with court permission",
  "sourcesPage.places.title": "Places",
  "sourcesPage.places.body":
    "Courthouse locations are a cached OpenStreetMap snapshot fetched through the Overpass API on {date}. The fetch script tries three mirrors and keeps the previous cache for a city if every mirror fails. Coordinates are copied from OSM; no location is inferred. The snapshot covers four city centres and is not exhaustive.",
  "sourcesPage.adapters.title": "Partner and model adapters",
  "sourcesPage.adapters.eci":
    "eCourtsIndia partner API — third-party, paid, key-gated. GET /api/partner/v2/search, GET /api/partner/case/{cnr}. Without ECI_KEY the app runs in aggregate mode with a banner. CNRs come from search results only; the app never invents a CNR and never scrapes services.ecourts.gov.in.",
  "sourcesPage.adapters.bharatcode":
    "BharatCode — the adapter remains in lib/bharatcode.ts for optional plain-language summaries, but the decision flow does not paraphrase the numbers through a model. The statement is deterministic.",
  "sourcesPage.footer":
    "All sources were accessed on 6 November 2026 unless the row states a different date. The NJDG snapshot was fetched on {date}. Act texts can be amended; check the current text before filing.",

  // ——— methodology worked example (remaining derivations) ———
  "methodPage.worked.hearingsDerivation": "{months} × 1 per month",
  "methodPage.worked.wagesDerivation": "{wage} × {hearings} × 1",
  "methodPage.worked.moneyDerivation": "₹5,00,000 × {rate}% × {years} years",

  // ——— legal aid panel (generated notes and authority help) ———
  "aid.note.eligible":
    "You meet at least one s.12 criterion on the information entered. The Authority must still be satisfied that there is a prima facie case to prosecute or defend (s.13(1)). Take proof of the category and, where income is the route, an affidavit of income — s.13(2) says an affidavit is generally sufficient.",
  "aid.note.notEligible":
    "On the income you entered, you are above the {state} ceiling of {limit}. The category routes in s.12(a)–(g) do not depend on income — if any of them apply, select them above. If your circumstances change, the DLSA can reassess.",
  "aid.note.unknown":
    "No s.12 category is selected and no annual income is entered, so eligibility is not assessed. A woman or child qualifies under s.12(c) irrespective of income. If none of the categories apply, enter your annual income to test the s.12(h) route.",
  "aid.courtFeeNote":
    "Legal aid does not automatically waive the court fee. If you cannot pay it, ask the DLSA about filing as an indigent person under Order XXXIII of the Code of Civil Procedure, 1908. The Authority can also tell you whether the State has a fee-refund or exemption notification for your case.",
  "aid.authority.delhi":
    "DLSA offices sit in the district court complexes. Apply at the DLSA for your district or the High Court Legal Services Committee.",
  "aid.authority.maharashtra":
    "Apply at the District Legal Services Authority for your district; legal-aid clinics also sit in the court complex.",
  "aid.authority.karnataka":
    "Apply at the District Legal Services Authority for your district; the DLSA is in the district court complex.",
  "aid.authority.tamilNadu":
    "Apply at the District Legal Services Authority for your district; the DLSA is in the district court complex.",
  "aid.authority.nalsa":
    "Use the NALSA legal-aid page to find the State and District Legal Services Authority for your district.",
  "aid.legalAidMetaNote":
    "Section 12 lists who is entitled to legal services. Section 13(1) makes entitlement subject to the Authority being satisfied that the person has a prima facie case. Section 13(2) says an affidavit of income is generally sufficient. A woman or child qualifies under s.12(c) irrespective of income. The income ceiling in s.12(h) is ₹9,000 in the Act but every State has prescribed a higher amount; the NALSA table below is the national compilation.",

  // ——— cost ledger (advocate basis) ———
  "ledger.advocateBasis":
    "{amount} × {hearings} hearings. The ₹9,000 figure is the Delhi legal-aid panel rate, not a market rate. District-court quotes vary widely by lawyer, city and case. Enter the quote you actually have.",

  // ——— alternatives (detail copy) ———
  "alt.basis.lok-adalat":
    "Legal Services Authorities Act, 1987, ss.19–21. The award is deemed to be a decree of a civil court and is final; no appeal lies (s.21(2)).",
  "alt.basis.pims":
    "Commercial Courts Act, 2015, s.12A; Commercial Courts (Pre-Institution Mediation and Settlement) Rules, 2018, rr.3 and 11 and Sch. II. A suit that does not contemplate urgent interim relief cannot be instituted without exhausting this route.",
  "alt.basis.mediation":
    "Mediation Act, 2023, ss.5, 18 and 27. A mediated settlement agreement is final, binding and enforceable in the same manner as a judgment or decree (s.27).",
  "alt.basis.compounding":
    "Negotiable Instruments Act, 1881, s.147: every offence punishable under the Act is compoundable. Section 143A lets the court order interim compensation of up to 20% of the cheque amount.",
  "alt.time.lok-adalat": "One sitting. No statutory outer limit (s.19).",
  "alt.time.pims":
    "3 months from the application, extendable by 2 months with the consent of the parties (s.12A(3)).",
  "alt.time.mediation":
    "120 days from the date fixed for the first appearance, extendable by up to 60 days by agreement (s.18).",
  "alt.time.compounding":
    "At any stage with the court's permission (s.147). No statutory outer limit.",
  "alt.timeBasis.lok-adalat":
    "The Act sets no deadline; the forum is organised by the DLSA/SLSA. This is forum design, not a prediction for your case.",
  "alt.timeBasis.pims":
    "Statutory outer limit. The limitation clock is excluded while mediation runs (s.12A(3), second proviso).",
  "alt.timeBasis.mediation": "Statutory outer limit. The Act does not fix a fee.",
  "alt.timeBasis.compounding":
    "The s.138 notice must be sent within 30 days of the bank's return memo and gives the drawer 15 days to pay. Compounding itself has no statutory deadline.",
  "alt.cost.lok-adalat":
    "₹0 court fee. Where a pending case is referred under s.20(1), the court fee already paid is refunded (s.21(1)).",
  "alt.cost.pims":
    "₹1,000 application fee + {share} share of the {total} Schedule II fee (shared equally) = {applicant}. No court fee because no suit is filed.",
  "alt.cost.pimsUnavailable": "Not available below ₹3,00,000 specified value.",
  "alt.cost.mediationAid":
    "No statutory fee. Through a DLSA or court-annexed mediation centre, legal-aid mediation can be free.",
  "alt.cost.mediationPaid":
    "No statutory fee. A private mediator or mediation service provider sets the fee; the Act does not fix it.",
  "alt.cost.compounding":
    "No statutory compounding fee. The settlement amount is the cheque amount or as agreed; that is money you recover, not a forum cost.",
  "alt.costNote.advocateFree":
    "A legal-aid panel advocate is free (s.12, Legal Services Authorities Act, 1987).",
  "alt.costNote.advocatePaid":
    "If you use a private advocate for one appearance, add about {amount} (your input; the ₹9,000 default is the Delhi panel rate).",
  "alt.costNote.mediationAid":
    "The DLSA can nominate a mediator and a panel advocate.",
  "alt.costNote.mediationPaid":
    "Ask the mediator or centre for the fee in writing before the first session. A DLSA/court-annexed centre may be cheaper or free.",
  "alt.costNote.compounding":
    "Court fee already paid on the complaint is not automatically refunded. Interim compensation under s.143A is a recovery, not a cost.",
  "alt.reason.lok-adalat":
    "A Lok Adalat cannot take a non-compoundable offence (s.19(5) proviso). If your offence is compoundable, ask the DLSA whether it can be referred.",
  "alt.reason.pimsNotCommercial":
    "Only for a commercial dispute under s.2(1)(c) of the Commercial Courts Act, 2015.",
  "alt.reason.pimsBelow":
    "The specified value is below ₹3,00,000, so s.12A does not apply.",
  "alt.reason.mediation":
    "Criminal matters are outside the Mediation Act, 2023, except where a court refers a compoundable offence.",
  "alt.reason.compounding":
    "Only for a complaint under s.138 of the Negotiable Instruments Act, 1881.",
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;
export type LocaleMessages = Partial<Messages>;
