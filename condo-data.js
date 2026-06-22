/**
 * ============================================================================
 *  CONDO DATA — single source of truth for the BeLive proposal template.
 *  Duplicate the site, edit ONLY this file, and the whole page + map + ROI
 *  calculator update to the new condo.
 *
 *  Currently populated for: HARBOUR VIEW RESIDENCE × BeLive (OSK Property)
 *
 *  Flags:
 *    ✅ confirmed (official site / your brochure)
 *    🟡 CONFIRM  — BeLive commercial figure or asset you supply/approve
 *    🔎 estimate — derived from area comparables; BeLive to finalise
 * ============================================================================
 */
window.CONDO = {

  // ---- IDENTITY ----------------------------------------------------------
  name:        "Harbour View Residence",   // ✅
  shortName:   "Harbour View",             // ✅ used in body copy
  developer:   "OSK Property",             // ✅
  partnership: "Harbour View Residence × BeLive Partnership 2026", // footer line

  // ---- IMAGE ASSETS (drop these files into the repo root) -----------------
  assets: {
    favicon:      "/favicon.png",                    // (keep BeLive favicon)
    heroRender:   "/HarbourViewResidence-condo.png",     // 🟡 building render (official gallery has 7 perspectives)
    developerLogo:"/osk_logo.png",                   // 🟡 OSK Property wordmark (replaces simedarby_logo.png)
    condoLogo:    "/harbourview_logo.png",           // 🟡 condo logo for the location section
  },

  // ---- META / SEO --------------------------------------------------------
  meta: {
    title:       "Harbour View Residence × BeLive — Co-Living Investment Proposal",
    description: "Harbour View Residence × BeLive — A fully integrated co-living investment ecosystem at Harbour Place, Butterworth, Penang. Freehold, from 950 sq.ft. Fully managed rental solution.",
    ogTitle:     "Harbour View Residence × BeLive — Co-Living Investment Proposal",
    ogDescription:"Convert your Harbour View unit into a high-yield co-living asset. Fully managed, transparent ROI.",
    themeColor:  "#c64a2c",   // 🟡 CONFIRM — keep BeLive orange or match OSK brand
  },

  // ---- HERO --------------------------------------------------------------
  hero: {
    eyebrow: "A Strategic Co-Living Partnership",
    sub:     "A fully integrated co-living investment ecosystem at Harbour Place, Butterworth, Penang — converting your unit into a high-yield, hassle-free rental asset.",
    stats: [
      { value: "TBC% – TBC%", label: "Target ROI" },          // 🟡 CONFIRM
      { value: "TBC/100",     label: "Grade ? Co-Living" },   // 🟡 ties to scoring total below
      { value: "RM TBC",      label: "Annual Income Est." },  // 🟡 = ROI × entry price
    ],
  },

  // ---- PROPERTY FACTS (official) -----------------------------------------
  facts: {
    tenure:      "Freehold",        // ✅
    totalUnits:  373,               // ✅
    type:        "Serviced Apartment", // ✅ (approved as "Apartment")
    builtUpFrom: "950 sq.ft.",      // ✅
    layouts:     ["Type A", "Type A1", "Type B"], // ✅
    carParks:    "2 to 4",          // ✅
    priceMin:    250000,            // ✅
    priceMax:    557000,            // ✅
    completion:  "Nov 2027",        // ✅
    facilities:  "Level 6 & 7",     // ✅
    authority:   "Majlis Bandaraya Seberang Perai (MBSP)", // ✅
  },

  // ---- SUITABILITY SECTION ----------------------------------------------
  suitability: {
    eyebrow: "Is Harbour View Residence suitable for Co-Living?",
    titleLead: "Maturing mainland township.",
    titleAccent: "Strong industrial, professional & student catchment.",
    lead: "Located at Jalan Chain Ferry, Butterworth — with direct access to the Butterworth Outer Ring Road, Butterworth–Kulim Expressway, the North–South Expressway and Penang Bridge, plus the Penang Sentral transport hub and the upcoming LRT Mutiara Line. Surrounded by malls, schools, hospitals and major industrial zones.",
    stats: [
      { value: "TBC+", label: "Students at Penang Int'l Dental College, UiTM Permatang Pauh & nearby schools" }, // 🟡 count
      { value: "TBC+", label: "Workers across the Prai & Bagan Ajam industrial zones" },                          // 🟡 count
      { value: "2 km", label: "To Penang Sentral hub & upcoming LRT Mutiara Line" },                              // ✅
    ],
    pop: "Seberang Perai population of 946,000+",  // 🔎 confirm figure
  },

  // ---- CATCHMENT MAP -----------------------------------------------------
  // distance bands are ✅ from your brochure and shown verbatim on the map.
  // coords are 🟡 APPROXIMATE (for pin placement only) — refine later; the
  // labels use the brochure band, not the computed distance, so they stay exact.
  map: {
    subject: {
      name: "Harbour View Residence",
      meta: "★ Subject Property · OSK Property",
      blurb: "373 freehold units · from 950 sq.ft · Harbour Place, Jalan Chain Ferry, 12100 Butterworth.",
      coords: [5.3876, 100.3686],   // 🟡 approximate
      rates: [  // 🔎 BeLive co-living estimate — confirm
        ["Master Room",   "RM 750 – 950"],
        ["Single / Queen","RM 600 – 750"],
        ["Balcony Room",  "RM 500 – 650"],
      ],
    },
    rings: [   // brochure uses 3 km & 6 km rings (ARA BLOC used 5/10)
      { radius: 3000, label: "3 km", opacity: 0.06 },
      { radius: 6000, label: "6 km", opacity: 0.04 },
    ],
    fitRadiusM: 7000,  // zoom to ~6 km ring
    places: [
      // --- Condo comparables: Harbour View's own Harbour Place siblings ---
      // whole-unit rents ✅ from listings; per-room 🔎 BeLive estimate.
      { name: "Luminari Residence Suites", category: "condo", type: "Serviced Suite", coords: [5.3868, 100.3702], dist: "<1 km",
        note: "Same township (PJD Eastern Land). 947–1,335 sq.ft, completed 2019. Whole unit ~RM1,600–1,800.",
        rates: [["Master Room","RM 700 – 900"],["Single / Queen","RM 550 – 700"],["Balcony Room","RM 450 – 600"]] },
      { name: "Ocean View Residences", category: "condo", type: "Condominium", coords: [5.3852, 100.3668], dist: "<1 km",
        note: "Harbour Place, 938–1,100 sq.ft, 3B2B. Whole unit ~RM1,600.",
        rates: [["Master Room","RM 700 – 850"],["Single / Queen","RM 550 – 680"],["Balcony Room","RM 450 – 580"]] },
      { name: "Woodsbury Suites", category: "condo", type: "Serviced Suite", coords: [5.3890, 100.3710], dist: "<1 km",
        note: "Harbour Place, 550–2,270 sq.ft. Whole unit ~RM1,690–1,890.",
        rates: [["Master Room","RM 700 – 900"],["Single / Queen","RM 550 – 700"],["Balcony Room","RM 450 – 600"]] },
      { name: "Sea View Tower", category: "condo", type: "Condominium", coords: [5.3845, 100.3695], dist: "<1 km",
        note: "Harbour Place, ~1,000 sq.ft 3B2B. Whole unit ~RM1,500.",
        rates: [["Master Room","RM 680 – 850"],["Single / Queen","RM 520 – 680"],["Balcony Room","RM 430 – 560"]] },
      { name: "Wellesley Residence", category: "condo", type: "Serviced Suite", coords: [5.3862, 100.3718], dist: "<1 km",
        note: "Harbour Place, 401 units from 650 sq.ft, freehold.",
        rates: [["Master Room","RM 650 – 800"],["Single / Queen","RM 500 – 650"],["Balcony Room","RM 420 – 540"]] },

      // --- Education ---
      { name: "SK Convent Butterworth", category: "education", type: "Primary School", coords: [5.4010, 100.3660], dist: "<1 km", note: "National primary school." },
      { name: "SMK Convent Butterworth", category: "education", type: "Secondary School", coords: [5.4005, 100.3665], dist: "<2 km", note: "National secondary school." },
      { name: "SJK (C) Chung Hwa 1", category: "education", type: "Primary School", coords: [5.3980, 100.3690], dist: "<3 km", note: "Chinese primary school." },
      { name: "SJK (C) Kwang Hwa Butterworth", category: "education", type: "Primary School", coords: [5.3950, 100.3720], dist: "<4 km", note: "Chinese primary school." },
      { name: "SMJK Chung Ling Butterworth", category: "education", type: "Secondary School", coords: [5.3900, 100.3780], dist: "<6 km", note: "Chinese secondary school." },
      { name: "Penang International Dental College", category: "education", type: "Tertiary", coords: [5.3700, 100.4050], dist: "<6 km", note: "Tertiary dental institution." },
      { name: "UiTM Permatang Pauh", category: "education", type: "University", coords: [5.3780, 100.4340], dist: "<8 km", note: "Public university campus." },

      // --- Healthcare ---
      { name: "Seberang Jaya Hospital", category: "healthcare", type: "Government Hospital", coords: [5.3915, 100.4000], dist: "<6 km", note: "Government general hospital." },
      { name: "Penang Sentral Hospital (Future)", category: "healthcare", type: "Private Hospital", coords: [5.3925, 100.3650], dist: "<2 km", note: "Upcoming private hospital." },
      { name: "Bagan Specialist Centre", category: "healthcare", type: "Private Hospital", coords: [5.4080, 100.3780], dist: "<5 km", note: "Private specialist centre." },
      { name: "Sunway Medical Centre (Future)", category: "healthcare", type: "Private Hospital", coords: [5.3905, 100.3905], dist: "<5 km", note: "Upcoming private hospital." },

      // --- Commercial ---
      { name: "Penang Sentral Mall", category: "commercial", type: "Shopping Mall", coords: [5.3930, 100.3645], dist: "<2 km", note: "Integrated transit-linked mall." },
      { name: "Sunway Carnival Mall", category: "commercial", type: "Shopping Mall", coords: [5.3980, 100.3920], dist: "<2 km", note: "Major regional mall, Seberang Jaya." },
      { name: "GEM Megamall (Future)", category: "commercial", type: "Shopping Mall", coords: [5.3850, 100.3950], dist: "<5 km", note: "Upcoming mega-mall." },
      { name: "Megamall", category: "commercial", type: "Shopping Mall", coords: [5.3640, 100.3940], dist: "<6 km", note: "Penang Megamall, Prai." },
      { name: "Econsave", category: "commercial", type: "Hypermarket", coords: [5.3960, 100.3680], dist: "<2 km", note: "Value hypermarket." },
      { name: "Lotus's", category: "commercial", type: "Hypermarket", coords: [5.3880, 100.3900], dist: "<5 km", note: "Hypermarket & retail." },

      // --- Transport ---
      { name: "Penang Sentral", category: "transport", type: "KTM · Ferry · Bus Hub", coords: [5.3935, 100.3640], dist: "<2 km", note: "Integrated transport terminal." },
      { name: "Penang Sentral LRT (Mutiara Line, upcoming)", category: "transport", type: "LRT · Mutiara Line", coords: [5.3938, 100.3648], dist: "<2 km", note: "Future LRT terminus at Penang Sentral." },
      { name: "Butterworth Outer Ring Road (LLLB)", category: "transport", type: "Highway", coords: [5.3960, 100.3720], dist: "<2 km", note: "Direct mainland connector." },
      { name: "Butterworth–Kulim Expressway", category: "transport", type: "Highway", coords: [5.3850, 100.4100], dist: "<5 km", note: "Links to Kulim / Kedah." },
      { name: "North–South Expressway", category: "transport", type: "Highway", coords: [5.3640, 100.4200], dist: "<5 km", note: "National expressway access." },
      { name: "Penang Bridge", category: "transport", type: "Bridge", coords: [5.3560, 100.3580], dist: "<9 km", note: "Link to Penang Island." },
    ],
  },

  // ---- CATCHMENT FILTER CARDS (summary lines under the map) --------------
  catchmentCards: {
    title: "Catchment Map · Butterworth",
    sub: "The catchment around Harbour View Residence with 3 km and 6 km rings — sibling condos, schools, hospitals, malls and transit, each labelled with its distance from Harbour View.",
    condo:     { items: "Harbour View (★) · Luminari · Ocean View · Woodsbury · Sea View Tower · Wellesley", summary: "Subject + 5 Harbour Place comparables" },
    education: { items: "SK/SMK Convent · Chung Hwa · Kwang Hwa · Chung Ling · Dental College · UiTM Permatang Pauh", summary: "Schools + tertiary within 8 km" },
    healthcare:{ items: "Seberang Jaya Hospital · Penang Sentral Hospital* · Bagan Specialist · Sunway Medical*", summary: "Govt + private hospitals (* future)" },
    commercial:{ items: "Penang Sentral Mall · Sunway Carnival · GEM Megamall* · Megamall · Econsave · Lotus's", summary: "Malls & hypermarkets within 6 km" },
    transport: { items: "Penang Sentral · LRT Mutiara Line* · Outer Ring Road · B–Kulim Expy · N–S Expy · Penang Bridge", summary: "2 km to Penang Sentral hub" },
  },

  // ---- BeLive CO-LIVING SCORING GRID (🟡 DRAFT — your numbers) -----------
  // Grade thresholds: >80 Grade A · 60–79 Grade B · <59 not suitable.
  scoring: {
    eyebrow: "BeLive Co-Living Scoring Grid",
    recommended: true,
    rows: [
      { label: "Location Connectivity",      note: "Outer Ring Road, B–Kulim, N–S Expressway & Penang Bridge access", score: 8 },
      { label: "Tenant Demand Strength",     note: "Prai/Bagan Ajam industrial workforce + professional & student pool", score: 8 },
      { label: "Public Transport Access",    note: "2 km to Penang Sentral; upcoming LRT Mutiara Line", score: 8 },
      { label: "Rental Yield Potential",     note: "Low entry price lifts % yield under co-living strategy", score: 8 },
      { label: "Facilities & Lifestyle Appeal", note: "Level 6–7 facilities; malls & hubs within 2 km", score: 7 },
      { label: "Co-Living Compatibility",    note: "950 sq.ft+ layouts — confirm wall hackability", score: 7 },
      { label: "Market Affordability Match", note: "Entry from RM250k aligns with mainland market", score: 9 },
      { label: "Supply & Competition Risk",  note: "Moderate mainland supply within Harbour Place & vicinity", score: 7 },
      { label: "Operational Scalability",    note: "373 freehold units — concentrated, manageable portfolio", score: 8 },
      { label: "Long-Term Growth Potential", note: "Freehold OSK township; LRT catalyst + mainland growth", score: 8 },
    ],
    // total auto-sums to 78 → currently Grade B border. Raise scores to cross 80 for Grade A.
    grade: "TBC",  // 🟡 CONFIRM
  },

  // ---- PROOF / TRACK RECORD ----------------------------------------------
  proof: {
    referenceCondo: "Vivo (Penang)",   // 🟡 a BeLive-managed mainland property; Vivo is in Simpang Ampat (same region)
    occupancyImage: "/HarbourView_Proof_Rate.png", // 🟡 supply occupancy chart for the chosen reference
    asOfDate: "TBC",                   // 🟡
    // NOTE: ARA BLOC also had 2 area-demand images (lead volume + area occupancy).
    // Supply Penang/Seberang Perai equivalents, or we drop those two blocks.
  },

  // ---- ROI CALCULATOR (🟡 DRAFT — needs floor-plan + BeLive rates) -------
  // Harbour View layouts: Type A / A1 / B, from 950 sq.ft, price RM250k–557k.
  // Room configs + per-room rates below are ESTIMATES pending the floor plans.
  roi: {
    waLink: "https://wa.link/yxfq39",   // 🟡 (currently the official OSK enquiry link; swap for BeLive's)
    priceSlider: { min: 200000, max: 650000, step: 5000 },
    gradeAThreshold: 6.0,               // 🟡 net-yield % for "Grade A" (ARA BLOC used 5.8)
    types: {
      A:  { label: "Type A · ~950 sq ft · 3R2B",  spec: "~950 sq ft · 3R2B",  floorplan: "/HarbourView_TypeA.jpg",  defaultPrice: 350000, wholeLo: 1500, wholeHi: 1800,
            rooms:  [ { id:"r2", name:"Room 2 (Queen Room)", lo:600, hi:750 }, { id:"r3", name:"Room 3 (Queen Room · Master)", lo:750, hi:950 } ],
            extras: [ { id:"balcony", name:"Room 1 (Queen Room)", lo:500, hi:650 }, { id:"parking", name:"Parking Bay", lo:150, hi:150 } ] },
      A1: { label: "Type A1 · ~1,050 sq ft · 3R2B", spec: "~1,050 sq ft · 3R2B", floorplan: "/HarbourView_TypeA1.jpg", defaultPrice: 430000, wholeLo: 1700, wholeHi: 2000,
            rooms:  [ { id:"r2", name:"Room 2 (Queen Room)", lo:600, hi:780 }, { id:"r3", name:"Room 3 (Queen Room · Master)", lo:780, hi:980 } ],
            extras: [ { id:"balcony", name:"Room 1 (Queen Room)", lo:520, hi:680 }, { id:"parking", name:"Parking Bay", lo:150, hi:150 } ] },
      B:  { label: "Type B · ~1,200 sq ft · 3+1R", spec: "~1,200 sq ft · 3+1R", floorplan: "/HarbourView_TypeB.jpg",  defaultPrice: 520000, wholeLo: 1900, wholeHi: 2300,
            rooms:  [ { id:"r2", name:"Room 2 (Queen Room)", lo:620, hi:800 }, { id:"r3", name:"Room 3 (Queen Room)", lo:620, hi:800 }, { id:"r4", name:"Room 4 (Queen Room · Master)", lo:800, hi:1000 } ],
            extras: [ { id:"balcony", name:"Room 1 (Queen Room)", lo:520, hi:700 }, { id:"parking", name:"Parking Bay", lo:150, hi:150 } ] },
    },
    defaultType: "A",
  },

  // ---- RENOVATION SECTION & CONTACT --------------------------------------
  renoFreeTag: "FREE for Harbour View owners",   // ✅ (string swap)
  // Contact block (HQ/Penang office, phone, email, WhatsApp) is BeLive's own
  // and stays identical across every condo — no change needed.
};
