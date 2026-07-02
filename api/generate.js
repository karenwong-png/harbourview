/**
 * POST /api/generate
 * Body (JSON): { name, area, prices, parking, infopackBase64?, infopackImages?: [{mediaType,data}], floorplans?: [{mediaType,data}] }
 * Header: x-admin-password
 * Returns: { slug, condoData }  — the generated /data/<slug>.js content (window.CONDO = {...})
 *
 * Requires env: ANTHROPIC_API_KEY, ADMIN_PASSWORD
 */
const { SYSTEM } = require('./_prompt.js');

const MODEL = process.env.GEN_MODEL || 'claude-sonnet-4-6';

function slugify(s) {
  return String(s || '').toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 50) || 'condo';
}
function extractCondo(text) {
  if (!text) return null;
  let t = text.replace(/```[a-z]*\n?|```/gi, '').trim();        // strip any code fences
  const i = t.indexOf('window.CONDO');
  if (i === -1) return null;
  t = t.slice(i);
  const open = t.indexOf('{');
  if (open === -1) return null;
  // Walk the object and stop at the matching close brace (ignoring braces inside strings).
  let depth = 0, inStr = false, quote = '', esc = false, endIdx = -1;
  for (let k = open; k < t.length; k++) {
    const ch = t[k];
    if (esc) { esc = false; continue; }
    if (inStr) {
      if (ch === '\\') esc = true;
      else if (ch === quote) inStr = false;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { inStr = true; quote = ch; continue; }
    if (ch === '{') depth++;
    else if (ch === '}') { depth--; if (depth === 0) { endIdx = k; break; } }
  }
  if (endIdx === -1) return null;                              // truncated / unbalanced
  return 'window.CONDO = ' + t.slice(open, endIdx + 1) + ';';
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if ((req.headers['x-admin-password'] || '') !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Unauthorized' });

  try {
    const { name, area, prices, parking, infopackBase64, infopackImages, floorplans } = req.body || {};
    if (!name || !area) return res.status(400).json({ error: 'name and area are required' });

    const content = [];
    if (infopackImages && infopackImages.length) {
      // Brochure rasterised to page images client-side (keeps the upload small).
      infopackImages.forEach((im) => {
        content.push({ type: 'image', source: { type: 'base64', media_type: im.mediaType || 'image/jpeg', data: im.data } });
      });
    } else if (infopackBase64) {
      content.push({ type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: infopackBase64 } });
    }
    (floorplans || []).forEach((f) => {
      content.push({ type: 'image', source: { type: 'base64', media_type: f.mediaType || 'image/png', data: f.data } });
    });
    content.push({ type: 'text', text:
      `Condo: ${name}\nArea/place: ${area}\nSelling price(s): ${prices || 'see Infopack'}\nParking: ${parking || 'see Infopack'}\n` +
      `Produce the complete window.CONDO file per your rules. Pull live ${area} room-rental comps. Output ONLY the JavaScript.` });

    let messages = [{ role: 'user', content }];
    let acc = '';                 // accumulated text across continuation turns
    let finalText = null;
    let lastStop = null;

    for (let i = 0; i < 24; i++) {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 16000,
          system: SYSTEM,
          tools: [{ type: 'web_search_20250305', name: 'web_search', max_uses: 8 }],
          messages,
        }),
      });
      const data = await r.json();
      if (data.type === 'error' || data.error) return res.status(502).json({ error: data.error || data });
      lastStop = data.stop_reason;
      const text = (data.content || []).filter((b) => b.type === 'text').map((b) => b.text).join('');

      if (data.stop_reason === 'pause_turn') {           // web search in progress — resume the turn
        messages.push({ role: 'assistant', content: data.content });
        continue;
      }
      acc += text;
      if (data.stop_reason === 'max_tokens') {            // output truncated — ask it to continue
        messages.push({ role: 'assistant', content: data.content });
        messages.push({ role: 'user', content: 'Continue the JavaScript exactly where you left off. Do not repeat anything already written and do not add any explanation — output only the remaining code.' });
        continue;
      }
      finalText = acc;                                   // end_turn / stop_sequence
      break;
    }
    if (finalText === null) finalText = acc;             // ran out of turns — try what we have

    const condoData = extractCondo(finalText);
    if (!condoData) return res.status(502).json({
      error: 'Could not parse condo-data from model output',
      stopReason: lastStop, length: (finalText || '').length, raw: (finalText || '').slice(-1500),
    });

    return res.status(200).json({ slug: slugify(name), condoData });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
