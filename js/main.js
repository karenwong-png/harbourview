/**
 * Harbour View × BeLive - Investment Proposal
 * Interactive scripts
 */

(function () {
  'use strict';

  // ============ Rental Projection Type Tabs ============
  function initTypeTabs() {
    const tabs = document.querySelectorAll('.type-tab');
    const cards = document.querySelectorAll('.projection-card');

    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        tabs.forEach((t) => t.classList.remove('active'));
        cards.forEach((c) => c.classList.remove('active'));
        tab.classList.add('active');
        const targetCard = document.getElementById('card-' + target);
        if (targetCard) targetCard.classList.add('active');
      });
    });
  }

  // ============ Scroll-Reveal Animation ============
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;

    const animatable = document.querySelectorAll(
      '.pillar, .step, .stat-card, .property-card, .feat-card, .score-row, .why-pillar'
    );

    animatable.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animatable.forEach((el) => observer.observe(el));
  }

  // ============ Catchment Map ============
  // Harbour View Residence — Harbour Place, Jalan Chain Ferry, 12100 Butterworth, Penang
  const HVR = [5.3985, 100.3733];

  // Distances are computed live (haversine / straight-line) from the coords below,
  // matching Google Maps' "Measure distance" tool and staying consistent with the rings.
  const PLACES = [
    // Condos (rental comparables — full pricing in popup)
    { name: "Luminari", category: "condo", type: "Serviced Suites", coords: [5.3970, 100.3729], note: "Waterfront serviced suites within Harbour Place.",
      rates: [["Master Room", "RM 850 – 1,100"], ["Single / Queen", "RM 600 – 850"], ["Balcony Room", "RM 550 – 750"]] },
    { name: "Ocean View Residences", category: "condo", type: "Condominium", coords: [5.3950, 100.3724], note: "Sea-fronting condominium near Harbour Place.",
      rates: [["Master Room", "RM 850 – 1,100"], ["Single / Queen", "RM 600 – 850"], ["Balcony Room", "RM 550 – 750"]] },
    { name: "Woodsbury Suites", category: "condo", type: "Serviced Suites", coords: [5.3992, 100.3756], note: "Established Bagan Ajam serviced suites with strong rental demand.",
      rates: [["Master Room", "RM 900 – 1,200"], ["Single / Queen", "RM 650 – 900"], ["Balcony Room", "RM 600 – 800"]] },
    { name: "Sea View Tower", category: "condo", type: "Apartment", coords: [5.3952, 100.3715], note: "Waterfront apartment block near the ferry terminal.",
      rates: [["Master Room", "RM 800 – 1,050"], ["Single / Queen", "RM 580 – 820"], ["Balcony Room", "RM 520 – 720"]] },
    { name: "Wellesley Residences", category: "condo", type: "Serviced Residence", coords: [5.3970, 100.3725], note: "Integrated serviced residence within Harbour Place.",
      rates: [["Master Room", "RM 900 – 1,150"], ["Single / Queen", "RM 650 – 900"], ["Balcony Room", "RM 600 – 780"]] },

    // Education
    { name: "SMK Convent Butterworth", category: "education", type: "Secondary School", coords: [5.3964, 100.3682], note: "Established secondary school, ~0.6 km away." },
    { name: "Kwang Hwa Primary School", category: "education", type: "Primary School", coords: [5.4103, 100.3806], note: "Popular Chinese primary school in Butterworth." },
    { name: "Chung Ling Butterworth", category: "education", type: "Secondary School", coords: [5.4339, 100.3931], note: "Renowned secondary school in Seberang Perai." },
    { name: "Penang Int'l Dental College", category: "education", type: "Tertiary College", coords: [5.4033, 100.3656], note: "Dental college on Jalan Bagan Luar, Butterworth." },
    { name: "UiTM Permatang Pauh", category: "education", type: "University", coords: [5.3821, 100.4172], note: "UiTM Penang branch campus, ~10,000 student capacity." },

    // Healthcare
    { name: "Hospital Seberang Jaya", category: "healthcare", type: "Government Hospital", coords: [5.3819, 100.3989], note: "Major government hospital serving Seberang Perai." },
    { name: "Bagan Specialist Centre", category: "healthcare", type: "Private Hospital", coords: [5.4098, 100.3865], note: "Private specialist hospital in Taman Bagan." },
    { name: "Sunway Medical Centre Penang", category: "healthcare", type: "Private Hospital", coords: [5.3987, 100.4009], note: "Private medical centre at Seberang Jaya." },

    // Commercial / Retail
    { name: "Penang Sentral Mall", category: "commercial", type: "Retail / Transit Mall", coords: [5.3958, 100.3655], note: "Retail within the Penang Sentral hub." },
    { name: "Sunway Carnival Mall", category: "commercial", type: "Shopping Mall", coords: [5.3988, 100.3980], note: "Major regional mall at Seberang Jaya." },
    { name: "Megamall Penang (Prai)", category: "commercial", type: "Shopping Mall", coords: [5.3770, 100.3999], note: "Established mall beside the North–South Expressway." },
    { name: "GEM Megamall", category: "commercial", type: "Mall (upcoming)", coords: [5.3806, 100.3965], note: "Upcoming mega-mall in Seberang Perai." },
    { name: "Econsave Butterworth", category: "commercial", type: "Hypermarket", coords: [5.3992, 100.3765], note: "Hypermarket next to Harbour Place on Jalan Chain Ferry." },
    { name: "Lotus's Bagan Ajam", category: "commercial", type: "Hypermarket", coords: [5.4105, 100.3795], note: "Hypermarket at Bagan Ajam, Butterworth." },

    // Transport
    { name: "Penang Sentral", category: "transport", type: "Integrated Transport Hub", coords: [5.3955, 100.3651], note: "KTM/ETS, ferry & bus hub; planned LRT Mutiara Line terminus." },
    { name: "Butterworth KTM", category: "transport", type: "KTM / ETS Station", coords: [5.3934, 100.3666], note: "Intercity & ETS rail station at Penang Sentral." },
    { name: "Sultan Abdul Halim Ferry Terminal", category: "transport", type: "Ferry Terminal", coords: [5.3947, 100.3644], note: "Pedestrian ferry to George Town (10–15 min)." },
    { name: "Penang Bridge (mainland)", category: "transport", type: "Expressway Bridge", coords: [5.3634, 100.3987], note: "Mainland on-ramp to Penang Island via Perai." }
  ];

  // Haversine straight-line distance in km
  function distanceKm(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLng = (b[1] - a[1]) * Math.PI / 180;
    const lat1 = a[0] * Math.PI / 180;
    const lat2 = b[0] * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.sin(dLng / 2) ** 2 * Math.cos(lat1) * Math.cos(lat2);
    return 2 * R * Math.asin(Math.sqrt(h));
  }
  function fmtKm(km) {
    return km < 1 ? Math.round(km * 1000) + ' m' : km.toFixed(1) + ' km';
  }

  function makePin(category, isSubject) {
    if (typeof L === 'undefined') return null;
    const html = isSubject
      ? '<div class="map-pin subject">★</div>'
      : '<div class="map-pin ' + category + '"></div>';
    const size = isSubject ? 42 : 28;
    return L.divIcon({
      className: 'map-pin-wrapper',
      html: html,
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
      popupAnchor: [0, -size / 2]
    });
  }

  function popupHtml(p) {
    const dist = fmtKm(distanceKm(HVR, p.coords));
    let html =
      '<strong>' + p.name + '</strong>' +
      '<div class="meta">' + p.type + '</div>' +
      '<div class="dist">' + dist + ' from Harbour View</div>' +
      '<div style="margin-top:6px;">' + p.note + '</div>';
    if (p.rates && p.rates.length) {
      html += '<div class="rates">';
      p.rates.forEach((r) => {
        html += '<div class="rate-row"><span>' + r[0] + '</span><span class="rate-val">' + r[1] + '</span></div>';
      });
      html += '</div>';
    }
    return html;
  }

  function initMap() {
    const mapEl = document.getElementById('arabloc-map');
    if (!mapEl || typeof L === 'undefined') return;

    if (L.Icon && L.Icon.Default) {
      L.Icon.Default.imagePath = '/vendor/leaflet/images/';
    }

    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const map = L.map(mapEl, {
      center: HVR,
      zoom: 14,
      scrollWheelZoom: false,
      dragging: !isTouch,
      tap: false,
      touchZoom: true,
      doubleClickZoom: true,
      boxZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Dashed catchment rings (3 km & 6 km)
    const rings = [
      { radius: 3000, label: '3 km', opacity: 0.06 },
      { radius: 6000, label: '6 km', opacity: 0.04 }
    ];
    rings.forEach((ring) => {
      L.circle(HVR, {
        radius: ring.radius,
        color: '#c64a2c',
        weight: 1.5,
        dashArray: '6 7',
        fill: true,
        fillColor: '#f58524',
        fillOpacity: ring.opacity,
        interactive: false
      }).addTo(map);
      // Ring label at the north edge of each ring
      const labelLat = HVR[0] + ring.radius / 111320;
      L.marker([labelLat, HVR[1]], {
        interactive: false,
        icon: L.divIcon({
          className: 'ring-label-wrap',
          html: '<span class="ring-label">' + ring.label + '</span>',
          iconSize: [44, 18],
          iconAnchor: [22, 9]
        })
      }).addTo(map);
    });

    // Mobile / touch: show tap-to-activate overlay so the page can scroll past the map
    const overlay = document.querySelector('.map-activate');
    if (overlay && isTouch) {
      overlay.classList.add('visible');
      const activate = () => {
        map.dragging.enable();
        overlay.classList.add('fading');
        setTimeout(() => overlay.classList.remove('visible', 'fading'), 280);
      };
      overlay.addEventListener('click', activate, { once: true });
      overlay.addEventListener('touchend', (e) => { e.preventDefault(); activate(); }, { once: true });
      overlay.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
      });
    } else if (overlay) {
      overlay.classList.remove('visible');
    }

    // Subject marker with permanent label
    const subjectIcon = makePin('subject', true);
    if (subjectIcon) {
      const subjectRates =
        '<div class="rates">' +
        '<div class="rate-row"><span>Master Room</span><span class="rate-val">RM 900 – 1,200</span></div>' +
        '<div class="rate-row"><span>Single / Queen</span><span class="rate-val">RM 650 – 900</span></div>' +
        '<div class="rate-row"><span>Balcony Room</span><span class="rate-val">RM 600 – 800</span></div>' +
        '</div>';
      L.marker(HVR, { icon: subjectIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindTooltip('★ Harbour View', {
          permanent: true,
          direction: 'right',
          offset: [16, 0],
          className: 'subject-label'
        })
        .bindPopup(
          '<strong>Harbour View Residence</strong>' +
          '<div class="meta">★ Subject Property · OSK Property</div>' +
          '<div>373 freehold units · 32 storeys · 2.04 acres. Jalan Chain Ferry, Harbour Place, 12100 Butterworth, Penang.</div>' +
          subjectRates
        );
    }

    // Category markers grouped by layer, each with a distance label
    const layersByCat = {};
    PLACES.forEach((p) => {
      const icon = makePin(p.category, false);
      if (!icon) return;
      const dist = fmtKm(distanceKm(HVR, p.coords));
      const marker = L.marker(p.coords, { icon: icon })
        .bindPopup(popupHtml(p))
        .bindTooltip(dist, {
          permanent: true,
          direction: 'top',
          offset: [0, -12],
          className: 'poi-dist'
        });
      if (!layersByCat[p.category]) layersByCat[p.category] = L.layerGroup();
      layersByCat[p.category].addLayer(marker);
    });
    Object.keys(layersByCat).forEach((cat) => layersByCat[cat].addTo(map));

    // ---- Filter logic ----
    const cards = document.querySelectorAll('.cat-card');
    const showAll = document.getElementById('show-all-toggle');

    function applyFilter() {
      const allOn = showAll && showAll.checked;
      const activeCard = document.querySelector('.cat-card.active');
      const activeCat = activeCard ? activeCard.dataset.cat : 'condo';

      Object.keys(layersByCat).forEach((c) => {
        const layer = layersByCat[c];
        const shouldShow = allOn || c === activeCat;
        if (shouldShow) {
          if (!map.hasLayer(layer)) map.addLayer(layer);
        } else {
          if (map.hasLayer(layer)) map.removeLayer(layer);
        }
      });
      // Distance labels are tidy for a single category, cluttered for "show all"
      mapEl.classList.toggle('show-dist-labels', !allOn);
    }

    cards.forEach((card) => {
      card.addEventListener('click', () => {
        cards.forEach((c) => c.classList.remove('active'));
        card.classList.add('active');
        if (showAll) showAll.checked = false;
        applyFilter();
      });
    });

    if (showAll) {
      showAll.addEventListener('change', applyFilter);
    }

    applyFilter();

    // Zoom out to fit both the 3 km and 6 km rings (6 km radius => ~14 km square)
    const ringBounds = L.latLng(HVR[0], HVR[1]).toBounds(14000);
    map.fitBounds(ringBounds, { padding: [10, 10] });

    // Re-render once visible (handles initial sizing inside hidden flex containers)
    setTimeout(() => {
      map.invalidateSize();
      map.fitBounds(ringBounds, { padding: [10, 10] });
    }, 250);
  }

  // ============ ROI Calculator ============
  const ROI_DATA = {
    A: {
      label: "Type A · 950 sq ft · 3R2B",
      spec: "950 sq ft · 3R2B",
      floorplan: "/HBV_FloorplanA.png",
      defaultPrice: 350000,
      wholeLo: 1500, wholeHi: 1800,
      rooms: [
        { id: "r2", name: "Room 2 (Queen Room)",          lo: 600, hi: 750 },
        { id: "r3", name: "Room 3 (Queen Room · Master)", lo: 750, hi: 950 },
        { id: "r4", name: "Room 4 (Queen Room)",          lo: 600, hi: 750 }
      ],
      extras: [
        { id: "balcony", name: "Room 1 (Queen Room · Optimized)", lo: 500, hi: 650 },
        { id: "parking", name: "Parking Bay",                     lo: 150, hi: 150 }
      ]
    },
    A1: {
      label: "Type A1 · 1,126 sq ft · 3R2B",
      spec: "1,126 sq ft · 3R2B",
      floorplan: "/HBV_FloorplanA1.png",
      defaultPrice: 430000,
      wholeLo: 1700, wholeHi: 2000,
      rooms: [
        { id: "r2", name: "Room 2 (Queen Room)",          lo: 600, hi: 780 },
        { id: "r3", name: "Room 3 (Queen Room · Master)", lo: 780, hi: 980 },
        { id: "r4", name: "Room 4 (Queen Room)",          lo: 600, hi: 780 }
      ],
      extras: [
        { id: "balcony", name: "Room 1 (Queen Room · Optimized)", lo: 520, hi: 680 },
        { id: "parking", name: "Parking Bay",                     lo: 150, hi: 150 }
      ]
    },
    B: {
      label: "Type B · 950 sq ft · 3B2R",
      spec: "950 sq ft · 3B2R",
      floorplan: "/HBV_FloorplanB.png",
      defaultPrice: 520000,
      wholeLo: 1900, wholeHi: 2300,
      rooms: [
        { id: "r2", name: "Room 2 (Queen Room)",          lo: 620, hi:  800 },
        { id: "r3", name: "Room 3 (Queen Room · Master)", lo: 800, hi: 1000 },
        { id: "r4", name: "Room 4 (Queen Room)",          lo: 620, hi:  800 }
      ],
      extras: [
        { id: "balcony", name: "Room 1 (Queen Room · Optimized)", lo: 520, hi: 700 },
        { id: "parking", name: "Parking Bay",                     lo: 150, hi: 150 }
      ]
    }
  };
  const roiFmt = (n) => Math.round(n).toLocaleString("en-US");
  // Balcony rooms start unselected by default (still toggleable)
  function initRoiCalculator() {
    const root = document.getElementById('roi-calculator');
    if (!root) return;

    const WA = 'https://wa.link/yxfq39';
    let type = 'A';
    let price = ROI_DATA.A.defaultPrice;
    let occ = 100;
    let mode = 'optimized';

    root.className = 'arb-roi';
    root.innerHTML =
      '<div class="arb-head">' +
        '<span class="arb-eyebrow"><span class="arb-dot"></span>Smart Renovation · Rental Projection & Live ROI</span>' +
        '<h2 class="arb-h1">Model your <em>Harbour View</em> returns in real time.</h2>' +
        '<p class="arb-lede">Pick a floor plan, adjust your purchase price and occupancy, then choose how you want to let the unit. Annual income and ROI recalculate instantly — based on BeLive’s optimized co-living rental data for Harbour View.</p>' +
      '</div>' +
      '<div class="arb-grid">' +
        '<div class="arb-panel">' +
          '<div class="arb-panel-title">Your Unit</div>' +
          '<div class="arb-panel-sub">Configure the asset you’re modelling.</div>' +
          '<div class="arb-seg arb-seg-3" id="arb-seg">' +
            '<button id="arb-btn-a" class="on">Type A<small>950 sq ft · 3R2B</small></button>' +
            '<button id="arb-btn-a1">Type A1<small>1,126 sq ft · 3R2B</small></button>' +
            '<button id="arb-btn-b">Type B<small>950 sq ft · 3B2R</small></button>' +
          '</div>' +
          '<div class="arb-floorplan"><img id="arb-floorplan-img" src="" alt="Harbour View floor plan" /></div>' +
          '<div class="arb-field">' +
            '<div class="arb-field-row"><label>SPA Purchase Price</label><span class="arb-val" id="arb-price-val">RM 0</span></div>' +
            '<input type="range" id="arb-price-range" min="200000" max="650000" step="5000" />' +
            '<div class="arb-field-row arb-ticks"><span class="arb-hint">RM 200k</span><span class="arb-hint" id="arb-spahint">Est. SPA</span><span class="arb-hint">RM 650k</span></div>' +
          '</div>' +
          '<div class="arb-field">' +
            '<div class="arb-field-row"><label>Average Occupancy</label><span class="arb-val" id="arb-occ-val">0%</span></div>' +
            '<input type="range" id="arb-occ-range" min="80" max="100" step="1" />' +
            '<div class="arb-field-row arb-ticks"><span class="arb-hint">80%</span><span class="arb-hint">Co-living avg: 90–95%</span><span class="arb-hint">100%</span></div>' +
          '</div>' +
          '<div class="arb-field arb-field-last">' +
            '<div class="arb-field-row"><label>How is the unit let?</label></div>' +
            '<div class="arb-mode" id="arb-mode">' +
              '<button data-mode="whole">Whole Unit<small>Rent the whole unit</small></button>' +
              '<button data-mode="coliving">Co-Living<small>Per-room rental</small></button>' +
              '<button data-mode="optimized" class="on">Maximized Rental Yield<small>Smarter Space, Better Yield</small></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="arb-panel arb-result">' +
          '<div class="arb-lockup"><img src="/beLive_Logo_F_fit.png" alt="BeLive" /><span>×</span><img src="/hblogo_brown.png" alt="Harbour View" /></div>' +
          '<div class="arb-rc-label">Estimated Monthly Income</div>' +
          '<div class="arb-rc-hero"><span class="arb-unit">RM</span><span class="arb-num" id="arb-monthly">0</span><span class="arb-per">/ mo</span></div>' +
          '<div class="arb-rc-sub"><span class="arb-rc-range" id="arb-monthly-range">RM 0 – RM 0</span><span class="arb-rc-meta">≈ RM <span id="arb-annual">0</span>/yr · <span id="arb-occmode"></span></span></div>' +
          '<div class="arb-roi-strip">' +
            '<div class="arb-ring">' +
              '<svg width="74" height="74" viewBox="0 0 74 74">' +
                '<circle cx="37" cy="37" r="31" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="7"></circle>' +
                '<circle id="arb-ring-prog" cx="37" cy="37" r="31" fill="none" stroke="url(#arbg)" stroke-width="7" stroke-linecap="round" transform="rotate(-90 37 37)" style="transition:stroke-dashoffset .5s cubic-bezier(.65,0,.35,1)"></circle>' +
                '<defs><linearGradient id="arbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffd0a0"></stop><stop offset="1" stop-color="#f58524"></stop></linearGradient></defs>' +
              '</svg>' +
              '<div class="arb-pct"><b id="arb-roi-pct">0%</b><span>ROI</span></div>' +
            '</div>' +
            '<div class="arb-meta">' +
              '<div class="arb-t">Net rental yield · <span id="arb-roi-range">0% – 0%</span></div>' +
              '<div class="arb-grade"><span id="arb-grade-label">Maximized Rental Yield</span><span class="arb-tag a" id="arb-grade-tag">Grade A</span></div>' +
            '</div>' +
          '</div>' +
          '<div class="arb-breakdown" id="arb-breakdown"></div>' +
          '<div class="arb-compare arb-compare-3">' +
            '<div class="arb-cmp" data-cmp="whole"><div class="arb-ct">Whole Unit</div><div class="arb-cv" id="arb-cmp-whole-rm">RM 0</div><div class="arb-cs" id="arb-cmp-whole">0%</div></div>' +
            '<div class="arb-cmp" data-cmp="coliving"><div class="arb-ct">Co-Living</div><div class="arb-cv" id="arb-cmp-co-rm">RM 0</div><div class="arb-cs" id="arb-cmp-co">0%</div></div>' +
            '<div class="arb-cmp" data-cmp="optimized"><div class="arb-ct">Maximized</div><div class="arb-cv" id="arb-cmp-opt-rm">RM 0</div><div class="arb-cs" id="arb-cmp-opt">0%</div><div class="arb-delta" id="arb-delta">+0% vs Whole</div></div>' +
          '</div>' +
          '<a class="arb-cta" href="' + WA + '" target="_blank" rel="noopener noreferrer">Get my free unit assessment' +
            '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>' +
          '</a>' +
          '<p class="arb-disclaimer">Indicative figures based on BeLive co-living rental data for Harbour View. Excludes maintenance fees, electrical appliances &amp; air-conditioning. Partition installation is at the owner’s discretion. For reference only — not financial advice.</p>' +
        '</div>' +
      '</div>';

    const el = (sel) => root.querySelector(sel);
    const priceRange = el('#arb-price-range');
    const occRange = el('#arb-occ-range');
    const ringProg = el('#arb-ring-prog');
    const CIRC = 2 * Math.PI * 31;
    ringProg.setAttribute('stroke-dasharray', CIRC);

    const tweens = {};
    const rafs = {};
    function tween(name, to, render) {
      const from = (name in tweens) ? tweens[name] : to;
      const startT = performance.now();
      cancelAnimationFrame(rafs[name]);
      const step = (t) => {
        const k = Math.min(1, (t - startT) / 520);
        const e = 1 - Math.pow(1 - k, 3);
        render(from + (to - from) * e);
        if (k < 1) rafs[name] = requestAnimationFrame(step);
        else tweens[name] = to;
      };
      rafs[name] = requestAnimationFrame(step);
    }

    function renderFloorplan() {
      const img = el('#arb-floorplan-img');
      img.src = ROI_DATA[type].floorplan;
      img.alt = 'Harbour View ' + ROI_DATA[type].label + ' floor plan';
    }

    function modeLabel() {
      return mode === 'whole' ? 'Whole Unit'
        : mode === 'optimized' ? 'Maximized Rental Yield'
        : 'Co-Living';
    }

    function lineItems(m) {
      const d = ROI_DATA[type];
      if (m === 'whole') return [{ name: 'Whole-unit rental', lo: d.wholeLo, hi: d.wholeHi }];
      const items = d.rooms.map((r) => ({ name: r.name, lo: r.lo, hi: r.hi }));
      (d.extras || []).forEach((e) => {
        // Parking is part of both Co-Living and Optimized; Balcony Room is Optimized-only.
        if (e.id === 'parking' || m === 'optimized') items.push({ name: e.name, lo: e.lo, hi: e.hi });
      });
      // Order numerically by "Room N"; non-room items (e.g. Parking Bay) go last.
      const roomNo = (n) => { const x = n.match(/Room\s+(\d+)/); return x ? +x[1] : 999; };
      items.sort((a, b) => roomNo(a.name) - roomNo(b.name));
      return items;
    }

    function modeLines() { return lineItems(mode); }

    function monthlyRange(m) {
      let lo = 0, hi = 0;
      lineItems(m).forEach((i) => { lo += i.lo; hi += i.hi; });
      return { lo: lo, hi: hi };
    }

    function fmtRange(lo, hi) {
      return 'RM ' + roiFmt(lo) + ' – ' + roiFmt(hi);
    }

    function update(animateNums) {
      if (animateNums === undefined) animateNums = true;
      const o = occ / 100;
      const lines = modeLines();
      const mRange = monthlyRange(mode);
      const monthlyMid = (mRange.lo + mRange.hi) / 2;
      const annualLo = mRange.lo * 12 * o;
      const annualHi = mRange.hi * 12 * o;
      const annualMid = (annualLo + annualHi) / 2;
      const roiLo = price > 0 ? (annualLo / price) * 100 : 0;
      const roiHi = price > 0 ? (annualHi / price) * 100 : 0;
      const roiMid = (roiLo + roiHi) / 2;

      const wholeR = monthlyRange('whole');
      const coR    = monthlyRange('coliving');
      const optR   = monthlyRange('optimized');
      const wholeRoiMid = price > 0 ? (((wholeR.lo + wholeR.hi) / 2) * 12 * o / price) * 100 : 0;
      const coRoiMid    = price > 0 ? (((coR.lo    + coR.hi   ) / 2) * 12 * o / price) * 100 : 0;
      const optRoiMid   = price > 0 ? (((optR.lo   + optR.hi  ) / 2) * 12 * o / price) * 100 : 0;

      el('#arb-price-val').textContent = 'RM ' + roiFmt(price);
      el('#arb-occ-val').textContent = occ + '%';
      priceRange.style.setProperty('--p', ((price - 200000) / (650000 - 200000) * 100) + '%');
      occRange.style.setProperty('--p', ((occ - 80) / (100 - 80) * 100) + '%');
      el('#arb-spahint').textContent = 'Est. SPA for Type ' + type;
      el('#arb-occmode').textContent = occ + '% occupancy · ' + modeLabel();

      el('#arb-breakdown').innerHTML =
        lines.map((l) => '<div class="arb-brow"><span class="arb-bn">' + l.name + '</span><span class="arb-bv">' + fmtRange(l.lo, l.hi) + '</span></div>').join('') +
        '<div class="arb-brow tot"><span class="arb-bn">Monthly total (gross)</span><span class="arb-bv">' + fmtRange(mRange.lo, mRange.hi) + '</span></div>';

      const gradeA = roiMid >= 6.0;
      const tag = el('#arb-grade-tag');
      tag.textContent = gradeA ? 'Grade A' : 'Grade B';
      tag.className = 'arb-tag ' + (gradeA ? 'a' : 'b');
      el('#arb-grade-label').textContent = modeLabel();

      const frac = Math.max(0, Math.min(1, roiMid / 10));
      ringProg.style.strokeDashoffset = CIRC * (1 - frac);
      el('#arb-delta').textContent = '+' + Math.max(0, optRoiMid - wholeRoiMid).toFixed(1) + '% vs Whole';

      el('#arb-cmp-whole-rm').textContent = fmtRange(wholeR.lo, wholeR.hi);
      el('#arb-cmp-co-rm').textContent    = fmtRange(coR.lo,    coR.hi);
      el('#arb-cmp-opt-rm').textContent   = fmtRange(optR.lo,   optR.hi);

      root.querySelectorAll('.arb-compare .arb-cmp').forEach((node) => {
        node.classList.toggle('win', node.dataset.cmp === mode);
      });

      const monthlyMidVal = (mRange.lo + mRange.hi) / 2;
      const monthlyRangeText = fmtRange(mRange.lo, mRange.hi);
      const roiRangeText = roiLo.toFixed(1) + '% – ' + roiHi.toFixed(1) + '%';

      if (animateNums) {
        tween('monthly', monthlyMidVal, (v) => { el('#arb-monthly').textContent = roiFmt(v); });
        tween('annual', annualMid, (v) => { el('#arb-annual').textContent = roiFmt(v); });
        tween('roi',    roiMid,    (v) => { el('#arb-roi-pct').textContent = v.toFixed(1) + '%'; });
        tween('whole',  wholeRoiMid, (v) => { el('#arb-cmp-whole').textContent = v.toFixed(1) + '%'; });
        tween('cor',    coRoiMid,    (v) => { el('#arb-cmp-co').textContent    = v.toFixed(1) + '%'; });
        tween('optr',   optRoiMid,   (v) => { el('#arb-cmp-opt').textContent   = v.toFixed(1) + '%'; });
      } else {
        el('#arb-monthly').textContent = roiFmt(monthlyMidVal);
        el('#arb-annual').textContent = roiFmt(annualMid);
        el('#arb-roi-pct').textContent = roiMid.toFixed(1) + '%';
        el('#arb-cmp-whole').textContent = wholeRoiMid.toFixed(1) + '%';
        el('#arb-cmp-co').textContent    = coRoiMid.toFixed(1) + '%';
        el('#arb-cmp-opt').textContent   = optRoiMid.toFixed(1) + '%';
        tweens.monthly = monthlyMidVal; tweens.annual = annualMid; tweens.roi = roiMid; tweens.whole = wholeRoiMid; tweens.cor = coRoiMid; tweens.optr = optRoiMid;
      }
      el('#arb-monthly-range').textContent = monthlyRangeText;
      el('#arb-roi-range').textContent = roiRangeText;
    }

    function switchType(t) {
      type = t;
      price = ROI_DATA[t].defaultPrice;
      ['A', 'A1', 'B'].forEach((k) => {
        const btn = el('#arb-btn-' + k.toLowerCase());
        if (btn) btn.className = (k === t ? 'on' : '');
      });
      priceRange.value = price;
      renderFloorplan();
      update();
    }

    function switchMode(m) {
      mode = m;
      el('#arb-mode').querySelectorAll('button').forEach((b) => {
        b.classList.toggle('on', b.dataset.mode === m);
      });
      update();
    }

    ['A', 'A1', 'B'].forEach((k) => {
      const btn = el('#arb-btn-' + k.toLowerCase());
      if (btn) btn.addEventListener('click', () => switchType(k));
    });
    el('#arb-mode').querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => switchMode(b.dataset.mode));
    });
    priceRange.addEventListener('input', (e) => { price = +e.target.value; update(); });
    occRange.addEventListener('input', (e) => { occ = +e.target.value; update(); });

    priceRange.value = price;
    occRange.value = occ;
    renderFloorplan();
    update(false);
  }

  // ============ Init on DOM ready ============
  function initAll() {
    initTypeTabs();
    initScrollReveal();
    initMap();
    initRoiCalculator();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
