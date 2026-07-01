/**
 * BeLive × Condo - Investment Proposal
 * Interactive scripts — data-driven from /js/condo-data.js (window.CONDO)
 */

(function () {
  'use strict';

  var CONDO = window.CONDO || {};
  var THEME = (CONDO.meta && CONDO.meta.themeColor) || '#c64a2c';
  var NAME = CONDO.name || 'the property';
  var SHORT = CONDO.shortName || NAME;

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

  // Haversine straight-line distance in km (fallback when no brochure band given)
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
  // Label shown on a pin / popup — prefer the brochure band, else computed
  function distLabel(p, subjectCoords) {
    if (p.dist) return p.dist;
    return fmtKm(distanceKm(subjectCoords, p.coords));
  }

  // ============ Catchment Map ============
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

  function popupHtml(p, subjectCoords) {
    const dist = distLabel(p, subjectCoords);
    let html =
      '<strong>' + p.name + '</strong>' +
      '<div class="meta">' + p.type + '</div>' +
      '<div class="dist">' + dist + ' from ' + SHORT + '</div>' +
      '<div style="margin-top:6px;">' + (p.note || '') + '</div>';
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
    if (!mapEl || typeof L === 'undefined' || !CONDO.map) return;

    const M = CONDO.map;
    const SUBJECT = M.subject.coords;

    if (L.Icon && L.Icon.Default) {
      L.Icon.Default.imagePath = '/vendor/leaflet/images/';
    }
    const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    const map = L.map(mapEl, {
      center: SUBJECT, zoom: 14, scrollWheelZoom: false,
      dragging: !isTouch, tap: false, touchZoom: true,
      doubleClickZoom: true, boxZoom: false, zoomControl: true
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19, subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    }).addTo(map);

    // Dashed catchment rings (from config)
    (M.rings || []).forEach((ring) => {
      L.circle(SUBJECT, {
        radius: ring.radius, color: THEME, weight: 1.5, dashArray: '6 7',
        fill: true, fillColor: '#f58524', fillOpacity: ring.opacity, interactive: false
      }).addTo(map);
      const labelLat = SUBJECT[0] + ring.radius / 111320;
      L.marker([labelLat, SUBJECT[1]], {
        interactive: false,
        icon: L.divIcon({ className: 'ring-label-wrap', html: '<span class="ring-label">' + ring.label + '</span>', iconSize: [44, 18], iconAnchor: [22, 9] })
      }).addTo(map);
    });

    // Mobile / touch tap-to-activate overlay
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
      overlay.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); } });
    } else if (overlay) {
      overlay.classList.remove('visible');
    }

    // Subject marker
    const subjectIcon = makePin('subject', true);
    if (subjectIcon) {
      let subjectRates = '';
      if (M.subject.rates && M.subject.rates.length) {
        subjectRates = '<div class="rates">' + M.subject.rates.map((r) =>
          '<div class="rate-row"><span>' + r[0] + '</span><span class="rate-val">' + r[1] + '</span></div>'
        ).join('') + '</div>';
      }
      L.marker(SUBJECT, { icon: subjectIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindTooltip('★ ' + SHORT, { permanent: true, direction: 'right', offset: [16, 0], className: 'subject-label' })
        .bindPopup(
          '<strong>' + M.subject.name + '</strong>' +
          '<div class="meta">' + (M.subject.meta || '') + '</div>' +
          '<div>' + (M.subject.blurb || '') + '</div>' + subjectRates
        );
    }

    // Category markers
    const layersByCat = {};
    (M.places || []).forEach((p) => {
      const icon = makePin(p.category, false);
      if (!icon) return;
      const marker = L.marker(p.coords, { icon: icon })
        .bindPopup(popupHtml(p, SUBJECT))
        .bindTooltip(distLabel(p, SUBJECT), { permanent: true, direction: 'top', offset: [0, -12], className: 'poi-dist' });
      if (!layersByCat[p.category]) layersByCat[p.category] = L.layerGroup();
      layersByCat[p.category].addLayer(marker);
    });
    Object.keys(layersByCat).forEach((cat) => layersByCat[cat].addTo(map));

    // Filter logic
    const cards = document.querySelectorAll('.cat-card');
    const showAll = document.getElementById('show-all-toggle');
    function applyFilter() {
      const allOn = showAll && showAll.checked;
      const activeCard = document.querySelector('.cat-card.active');
      const activeCat = activeCard ? activeCard.dataset.cat : 'condo';
      Object.keys(layersByCat).forEach((c) => {
        const layer = layersByCat[c];
        const shouldShow = allOn || c === activeCat;
        if (shouldShow) { if (!map.hasLayer(layer)) map.addLayer(layer); }
        else { if (map.hasLayer(layer)) map.removeLayer(layer); }
      });
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
    if (showAll) showAll.addEventListener('change', applyFilter);
    applyFilter();

    const fitR = M.fitRadiusM || 10000;
    const ringBounds = L.latLng(SUBJECT[0], SUBJECT[1]).toBounds(fitR * 2);
    map.fitBounds(ringBounds, { padding: [10, 10] });
    setTimeout(() => { map.invalidateSize(); map.fitBounds(ringBounds, { padding: [10, 10] }); }, 250);
  }

  // ============ ROI Calculator ============
  const roiFmt = (n) => Math.round(n).toLocaleString("en-US");

  function initRoiCalculator() {
    const root = document.getElementById('roi-calculator');
    if (!root || !CONDO.roi) return;

    const RC = CONDO.roi;
    const TYPES = RC.types;
    const KEYS = Object.keys(TYPES);
    const WA = RC.waLink || '#';
    const GRADE_A = RC.gradeAThreshold || 5.8;
    const slider = RC.priceSlider || { min: 400000, max: 1200000, step: 5000 };
    const condoLogo = (CONDO.assets && CONDO.assets.condoLogo) || '';

    let type = RC.defaultType || KEYS[0];
    let price = TYPES[type].defaultPrice;
    let occ = 100;
    let mode = 'optimized';

    const segButtons = KEYS.map((k) =>
      '<button id="arb-btn-' + k.toLowerCase() + '"' + (k === type ? ' class="on"' : '') + '>' +
      TYPES[k].label.split('·')[0].trim() + '<small>' + (TYPES[k].spec || '') + '</small></button>'
    ).join('');

    root.className = 'arb-roi';
    root.innerHTML =
      '<div class="arb-head">' +
        '<span class="arb-eyebrow"><span class="arb-dot"></span>Smart Renovation · Rental Projection & Live ROI</span>' +
        '<h2 class="arb-h1">Model your <em>' + NAME + '</em> returns in real time.</h2>' +
        '<p class="arb-lede">Pick a floor plan, adjust your purchase price and occupancy, then choose how you want to let the unit. Annual income and ROI recalculate instantly — based on BeLive’s optimized co-living rental data for ' + NAME + '.</p>' +
      '</div>' +
      '<div class="arb-grid">' +
        '<div class="arb-panel">' +
          '<div class="arb-panel-title">Your Unit</div>' +
          '<div class="arb-panel-sub">Configure the asset you’re modelling.</div>' +
          '<div class="arb-seg" id="arb-seg" style="grid-template-columns:repeat(' + KEYS.length + ',1fr)">' + segButtons + '</div>' +
          '<div class="arb-floorplan"><img id="arb-floorplan-img" src="" alt="' + NAME + ' floor plan" /></div>' +
          '<div class="arb-field">' +
            '<div class="arb-field-row"><label>SPA Purchase Price</label><span class="arb-val" id="arb-price-val">RM 0</span></div>' +
            '<input type="range" id="arb-price-range" min="' + slider.min + '" max="' + slider.max + '" step="' + slider.step + '" />' +
            '<div class="arb-field-row arb-ticks"><span class="arb-hint">RM ' + Math.round(slider.min/1000) + 'k</span><span class="arb-hint" id="arb-spahint">Est. SPA</span><span class="arb-hint">RM ' + (slider.max/1000000).toFixed(2).replace(/0$/,'') + 'm</span></div>' +
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
          '<div class="arb-lockup"><img src="/beLive_Logo_F_fit.png" alt="BeLive" /><span>×</span><img src="' + condoLogo + '" alt="' + NAME + '" /></div>' +
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
          '<p class="arb-disclaimer">Indicative figures based on BeLive co-living rental data for ' + NAME + '. Excludes maintenance fees, electrical appliances &amp; air-conditioning. Partition installation is at the owner’s discretion. For reference only — not financial advice.</p>' +
        '</div>' +
      '</div>';

    const el = (sel) => root.querySelector(sel);
    const priceRange = el('#arb-price-range');
    const occRange = el('#arb-occ-range');
    const ringProg = el('#arb-ring-prog');
    const CIRC = 2 * Math.PI * 31;
    ringProg.setAttribute('stroke-dasharray', CIRC);

    const tweens = {}; const rafs = {};
    function tween(name, to, render) {
      const from = (name in tweens) ? tweens[name] : to;
      const startT = performance.now();
      cancelAnimationFrame(rafs[name]);
      const step = (t) => {
        const k = Math.min(1, (t - startT) / 520);
        const e = 1 - Math.pow(1 - k, 3);
        render(from + (to - from) * e);
        if (k < 1) rafs[name] = requestAnimationFrame(step); else tweens[name] = to;
      };
      rafs[name] = requestAnimationFrame(step);
    }

    function renderFloorplan() {
      const img = el('#arb-floorplan-img');
      img.src = TYPES[type].floorplan || '';
      img.alt = NAME + ' ' + TYPES[type].label + ' floor plan';
    }
    function modeLabel() {
      return mode === 'whole' ? 'Whole Unit' : mode === 'optimized' ? 'Maximized Rental Yield' : 'Co-Living';
    }
    function lineItems(m) {
      const d = TYPES[type];
      if (m === 'whole') return [{ name: 'Whole-unit rental', lo: d.wholeLo, hi: d.wholeHi }];
      const items = d.rooms.map((r) => ({ name: r.name, lo: r.lo, hi: r.hi }));
      (d.extras || []).forEach((e) => {
        if (e.id === 'parking' || m === 'optimized') items.push({ name: e.name, lo: e.lo, hi: e.hi });
      });
      const roomNo = (n) => { const x = n.match(/Room\s+(\d+)/); return x ? +x[1] : 999; };
      items.sort((a, b) => roomNo(a.name) - roomNo(b.name));
      return items;
    }
    function modeLines() { return lineItems(mode); }
    function monthlyRange(m) { let lo = 0, hi = 0; lineItems(m).forEach((i) => { lo += i.lo; hi += i.hi; }); return { lo: lo, hi: hi }; }
    function fmtRange(lo, hi) { return 'RM ' + roiFmt(lo) + ' – ' + roiFmt(hi); }

    function update(animateNums) {
      if (animateNums === undefined) animateNums = true;
      const o = occ / 100;
      const lines = modeLines();
      const mRange = monthlyRange(mode);
      const annualLo = mRange.lo * 12 * o;
      const annualHi = mRange.hi * 12 * o;
      const annualMid = (annualLo + annualHi) / 2;
      const roiLo = price > 0 ? (annualLo / price) * 100 : 0;
      const roiHi = price > 0 ? (annualHi / price) * 100 : 0;
      const roiMid = (roiLo + roiHi) / 2;

      const wholeR = monthlyRange('whole');
      const coR = monthlyRange('coliving');
      const optR = monthlyRange('optimized');
      const wholeRoiMid = price > 0 ? (((wholeR.lo + wholeR.hi) / 2) * 12 * o / price) * 100 : 0;
      const coRoiMid = price > 0 ? (((coR.lo + coR.hi) / 2) * 12 * o / price) * 100 : 0;
      const optRoiMid = price > 0 ? (((optR.lo + optR.hi) / 2) * 12 * o / price) * 100 : 0;

      el('#arb-price-val').textContent = 'RM ' + roiFmt(price);
      el('#arb-occ-val').textContent = occ + '%';
      priceRange.style.setProperty('--p', ((price - slider.min) / (slider.max - slider.min) * 100) + '%');
      occRange.style.setProperty('--p', ((occ - 80) / (100 - 80) * 100) + '%');
      el('#arb-spahint').textContent = 'Est. SPA for ' + TYPES[type].label.split('·')[0].trim();
      el('#arb-occmode').textContent = occ + '% occupancy · ' + modeLabel();

      el('#arb-breakdown').innerHTML =
        lines.map((l) => '<div class="arb-brow"><span class="arb-bn">' + l.name + '</span><span class="arb-bv">' + fmtRange(l.lo, l.hi) + '</span></div>').join('') +
        '<div class="arb-brow tot"><span class="arb-bn">Monthly total (gross)</span><span class="arb-bv">' + fmtRange(mRange.lo, mRange.hi) + '</span></div>';

      const gradeA = roiMid >= GRADE_A;
      const tag = el('#arb-grade-tag');
      tag.textContent = gradeA ? 'Grade A' : 'Grade B';
      tag.className = 'arb-tag ' + (gradeA ? 'a' : 'b');
      el('#arb-grade-label').textContent = modeLabel();

      const frac = Math.max(0, Math.min(1, roiMid / 10));
      ringProg.style.strokeDashoffset = CIRC * (1 - frac);
      el('#arb-delta').textContent = '+' + Math.max(0, optRoiMid - wholeRoiMid).toFixed(1) + '% vs Whole';

      el('#arb-cmp-whole-rm').textContent = fmtRange(wholeR.lo, wholeR.hi);
      el('#arb-cmp-co-rm').textContent = fmtRange(coR.lo, coR.hi);
      el('#arb-cmp-opt-rm').textContent = fmtRange(optR.lo, optR.hi);

      root.querySelectorAll('.arb-compare .arb-cmp').forEach((node) => {
        node.classList.toggle('win', node.dataset.cmp === mode);
      });

      const monthlyMidVal = (mRange.lo + mRange.hi) / 2;
      const roiRangeText = roiLo.toFixed(1) + '% – ' + roiHi.toFixed(1) + '%';

      if (animateNums) {
        tween('monthly', monthlyMidVal, (v) => { el('#arb-monthly').textContent = roiFmt(v); });
        tween('annual', annualMid, (v) => { el('#arb-annual').textContent = roiFmt(v); });
        tween('roi', roiMid, (v) => { el('#arb-roi-pct').textContent = v.toFixed(1) + '%'; });
        tween('whole', wholeRoiMid, (v) => { el('#arb-cmp-whole').textContent = v.toFixed(1) + '%'; });
        tween('cor', coRoiMid, (v) => { el('#arb-cmp-co').textContent = v.toFixed(1) + '%'; });
        tween('optr', optRoiMid, (v) => { el('#arb-cmp-opt').textContent = v.toFixed(1) + '%'; });
      } else {
        el('#arb-monthly').textContent = roiFmt(monthlyMidVal);
        el('#arb-annual').textContent = roiFmt(annualMid);
        el('#arb-roi-pct').textContent = roiMid.toFixed(1) + '%';
        el('#arb-cmp-whole').textContent = wholeRoiMid.toFixed(1) + '%';
        el('#arb-cmp-co').textContent = coRoiMid.toFixed(1) + '%';
        el('#arb-cmp-opt').textContent = optRoiMid.toFixed(1) + '%';
        tweens.monthly = monthlyMidVal; tweens.annual = annualMid; tweens.roi = roiMid; tweens.whole = wholeRoiMid; tweens.cor = coRoiMid; tweens.optr = optRoiMid;
      }
      el('#arb-monthly-range').textContent = fmtRange(mRange.lo, mRange.hi);
      el('#arb-roi-range').textContent = roiRangeText;
    }

    function switchType(t) {
      type = t;
      price = TYPES[t].defaultPrice;
      KEYS.forEach((k) => { const btn = el('#arb-btn-' + k.toLowerCase()); if (btn) btn.className = (k === t ? 'on' : ''); });
      priceRange.value = price;
      renderFloorplan();
      update();
    }
    function switchMode(m) {
      mode = m;
      el('#arb-mode').querySelectorAll('button').forEach((b) => { b.classList.toggle('on', b.dataset.mode === m); });
      update();
    }

    KEYS.forEach((k) => { const btn = el('#arb-btn-' + k.toLowerCase()); if (btn) btn.addEventListener('click', () => switchType(k)); });
    el('#arb-mode').querySelectorAll('button').forEach((b) => { b.addEventListener('click', () => switchMode(b.dataset.mode)); });
    priceRange.addEventListener('input', (e) => { price = +e.target.value; update(); });
    occRange.addEventListener('input', (e) => { occ = +e.target.value; update(); });

    priceRange.value = price;
    occRange.value = occ;
    renderFloorplan();
    update(false);
  }

  // ============ Data-driven content: hero / suitability / scoring ============
  // These render the page chrome from window.CONDO so the whole site updates
  // from condo-data.js alone. Each is defensive: if a hook or data is missing,
  // it leaves the existing HTML (a no-JS fallback) untouched.
  function dq(sel) { return document.querySelector(sel); }
  function setText(sel, val) { var e = dq(sel); if (e && val != null) e.textContent = val; }
  function setHTML(sel, html) { var e = dq(sel); if (e && html != null) e.innerHTML = html; }

  function renderTemplate() {
    var t = (CONDO.template === 'developer') ? 'developer' : 'owner';
    document.body.setAttribute('data-template', t);
    // CTA label swap (optional, data-driven)
    if (CONDO.cta && CONDO.cta.label) {
      [].forEach.call(document.querySelectorAll('[data-cta-label]'), function (el) { el.textContent = CONDO.cta.label; });
    }
    renderPartnership();
    if (t === 'developer') renderDevEconomics();
  }
  function renderPartnership() {
    var P = CONDO.partnerModel; var host = dq('#partnership-grid');
    if (!host) return;
    if (!P || !P.items) { return; }
    setText('#partner-eyebrow', P.eyebrow);
    setText('#partner-title', P.title);
    setText('#partner-lead', P.lead);
    host.innerHTML = P.items.map(function (it) {
      return '<div class="partner-card"><div class="partner-ico">' + (it.icon || '◆') + '</div>' +
             '<h3>' + it.head + '</h3><p>' + it.body + '</p></div>';
    }).join('');
  }
  function renderDevEconomics() {
    var host = dq('#dev-econ-grid'); if (!host) return;
    var R = CONDO.roi; if (!R || !R.types) return;
    var key = R.defaultType || Object.keys(R.types)[0];
    var t = R.types[key]; if (!t) return;
    function sum(arr) { return (arr || []).reduce(function (a, x) { return [a[0] + (x.lo || 0), a[1] + (x.hi || 0)]; }, [0, 0]); }
    function f(n) { return Number(n || 0).toLocaleString('en-US'); }
    var rooms = sum(t.rooms);
    var parking = sum((t.extras || []).filter(function (e) { return e.id === 'parking'; }));
    var part = sum((t.extras || []).filter(function (e) { return e.id !== 'parking'; }));
    var whole = [t.wholeLo || 0, t.wholeHi || 0];
    var co = [rooms[0] + parking[0], rooms[1] + parking[1]];
    var opt = [co[0] + part[0], co[1] + part[1]];
    var price = t.defaultPrice || 0;
    function yld(m) { return price ? (m * 12 / price * 100).toFixed(1) : null; }
    var scen = [
      { name: 'Whole Unit', m: whole, note: 'Rented as-is' },
      { name: 'Co-Living', m: co, note: 'Room-by-room + parking' },
      { name: 'Optimized', m: opt, note: '+ partition room', hot: true }
    ];
    host.innerHTML = scen.map(function (s) {
      var yl = price ? (' · ' + yld(s.m[0]) + '–' + yld(s.m[1]) + '% gross') : '';
      return '<div class="econ-card' + (s.hot ? ' econ-hot' : '') + '">' +
        '<div class="econ-name">' + s.name + '</div>' +
        '<div class="econ-amt">RM ' + f(s.m[0]) + ' – ' + f(s.m[1]) + '<span>/mo</span></div>' +
        '<div class="econ-note">' + s.note + yl + '</div></div>';
    }).join('');
    setText('#dev-econ-type', 'Based on Type ' + key + (t.spec ? ' · ' + t.spec : ''));
  }

  function renderMeta() {
    if (!CONDO.meta) return;
    if (CONDO.meta.title) document.title = CONDO.meta.title;
    var md = dq('meta[name="description"]');
    if (md && CONDO.meta.description) md.setAttribute('content', CONDO.meta.description);
  }

  function renderHero() {
    var H = CONDO.hero; if (!H) return;
    setText('#hero-eyebrow', H.eyebrow);
    setText('#hero-sub', H.sub);
    var meta = dq('#hero-meta');
    if (meta && H.stats) {
      meta.innerHTML = H.stats.map(function (s) {
        return '<div><strong>' + s.value + '</strong><span>' + s.label + '</span></div>';
      }).join('');
    }
  }

  function renderSuitability() {
    var S = CONDO.suitability; if (!S) return;
    setText('#suit-eyebrow', S.eyebrow);
    if (S.titleLead || S.titleAccent) {
      setHTML('#suit-title', (S.titleLead || '') + ' <span class="accent-orange">' + (S.titleAccent || '') + '</span>');
    }
    setText('#suit-lead', S.lead);
    setText('#suit-pop', S.pop);
    var wrap = dq('#suit-stats');
    if (wrap && S.stats) {
      var nums = wrap.querySelectorAll('.stat-number');
      var labs = wrap.querySelectorAll('.stat-label');
      S.stats.forEach(function (st, i) {
        if (nums[i]) nums[i].textContent = st.value;
        if (labs[i]) labs[i].textContent = st.label;
      });
    }
  }

  function renderScoring() {
    var SC = CONDO.scoring; if (!SC || !SC.rows) return;
    setText('#score-eyebrow', SC.eyebrow);
    if (SC.recommended) {
      setHTML('#score-title', NAME + ' is <span class="accent-orange">recommended for co-living</span>.');
    }
    var total = SC.rows.reduce(function (a, r) { return a + (r.score || 0); }, 0);
    var grid = dq('#score-grid');
    if (grid) {
      grid.innerHTML = SC.rows.map(function (r) {
        var w = Math.max(0, Math.min(100, (r.score || 0) * 10));
        return '<div class="score-row"><div class="score-criteria">' + r.label + '</div>' +
          '<div class="score-assessment">' + (r.note || '') + '</div>' +
          '<div class="score-bar"><div class="score-bar-track"><div class="score-bar-fill" style="width:' + w + '%"></div></div>' +
          '<div class="score-value">' + r.score + '/10</div></div></div>';
      }).join('');
    }
    setHTML('#score-lead', 'Scoring <strong>' + total + '/100</strong> in BeLive\u2019s co-living suitability assessment.');
    var big = dq('#score-total');
    if (big) big.innerHTML = total + '<span style="opacity:0.6; font-size:0.5em;">/100</span>';
  }

  // ============ Init on DOM ready ============
  function initAll() {
    renderTemplate();
    renderMeta();
    renderHero();
    renderSuitability();
    renderScoring();
    initTypeTabs();
    initScrollReveal();
    initMap();
    initRoiCalculator();
  }
  // ============ Multi-condo bootstrap ============
  // The condo to show comes from the URL: path (/harbour-view) or ?c=harbour-view.
  // Defaults to harbour-view. Adding a condo = add /data/<slug>.js — no code change.
  function condoSlug() {
    var path = location.pathname.replace(/^\/+|\/+$/g, '');
    var q = (new URLSearchParams(location.search)).get('c');
    var slug = (path || q || 'harbour-view').toLowerCase().replace(/[^a-z0-9-]/g, '');
    return slug || 'harbour-view';
  }
  function loadCondoData(slug, cb) {
    var s = document.createElement('script');
    s.src = '/data/' + slug + '.js?v=' + Date.now();
    s.onload = function () { cb(!!window.CONDO); };
    s.onerror = function () { cb(false); };
    document.head.appendChild(s);
  }
  function showNotFound(slug) {
    document.title = 'Condo not found';
    var sub = document.querySelector('#hero-sub');
    if (sub) sub.textContent = 'We couldn\u2019t find “' + slug + '”. Check the link or pick a condo from the directory.';
    var meta = document.querySelector('#hero-meta'); if (meta) meta.innerHTML = '';
  }
  function boot() {
    var slug = condoSlug();
    loadCondoData(slug, function (ok) {
      if (!ok) { showNotFound(slug); return; }
      // re-bind the closure vars now that the condo data is loaded
      CONDO = window.CONDO;
      THEME = (CONDO.meta && CONDO.meta.themeColor) || '#c64a2c';
      NAME = CONDO.name || 'the property';
      SHORT = CONDO.shortName || NAME;
      initAll();
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
