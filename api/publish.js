/**
 * POST /api/publish   (PREVIEW-FIRST: commits to a branch + opens a PR, never to main directly)
 * Body (JSON): { pages: [{ slug, condoData, name? }], name, area }   // one or more pages, one PR
 *              (legacy single-page body { slug, condoData, name, area } is still accepted)
 * Header: x-admin-password
 * Returns: { branch, prUrl, slugs }  — Vercel auto-builds a preview for the PR; merge it to go live.
 *
 * Requires env: GITHUB_TOKEN, GITHUB_REPO (e.g. "karenwong-png/harbourview"), ADMIN_PASSWORD
 * GITHUB_TOKEN = fine-grained PAT on this repo with Contents: read & write + Pull requests: read & write.
 */
const API = 'https://api.github.com';

function gh(token, path, method, body) {
  return fetch(API + path, {
    method: method || 'GET',
    headers: {
      'Authorization': 'Bearer ' + token,
      'Accept': 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'belive-condo-tool',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  });
}
const b64 = (s) => Buffer.from(s, 'utf8').toString('base64');
const unb64 = (s) => Buffer.from(s, 'base64').toString('utf8');

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if ((req.headers['x-admin-password'] || '') !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Unauthorized' });

  const token = process.env.GITHUB_TOKEN, repo = process.env.GITHUB_REPO;
  if (!token || !repo) return res.status(500).json({ error: 'GITHUB_TOKEN / GITHUB_REPO not configured' });

  try {
    const body = req.body || {};
    const { name, area } = body;
    // Accept either { pages:[...] } or a legacy single { slug, condoData }.
    let pages = Array.isArray(body.pages) && body.pages.length
      ? body.pages
      : (body.slug && body.condoData ? [{ slug: body.slug, condoData: body.condoData, name }] : null);
    if (!pages) return res.status(400).json({ error: 'pages (or slug + condoData) required' });
    for (const p of pages) {
      if (!p.slug || !p.condoData) return res.status(400).json({ error: 'each page needs slug + condoData' });
    }
    const primarySlug = pages[0].slug;
    const branch = 'add-' + primarySlug;
    const today = new Date().toISOString().slice(0, 10);

    // 1) base sha from main
    let r = await gh(token, `/repos/${repo}/git/refs/heads/main`);
    if (!r.ok) return res.status(502).json({ error: 'Cannot read main ref', detail: await r.text() });
    const baseSha = (await r.json()).object.sha;

    // 2) create branch (ignore "already exists")
    r = await gh(token, `/repos/${repo}/git/refs`, 'POST', { ref: `refs/heads/${branch}`, sha: baseSha });
    if (!r.ok && r.status !== 422) return res.status(502).json({ error: 'Cannot create branch', detail: await r.text() });

    // 3) write each data/<slug>.js on the branch (update if it already exists)
    for (const p of pages) {
      const filePath = `data/${p.slug}.js`;
      let existingSha;
      r = await gh(token, `/repos/${repo}/contents/${filePath}?ref=${branch}`);
      if (r.ok) existingSha = (await r.json()).sha;
      r = await gh(token, `/repos/${repo}/contents/${filePath}`, 'PUT', {
        message: `Add/update ${p.name || name || p.slug} condo data`, content: b64(p.condoData), branch, sha: existingSha,
      });
      if (!r.ok) return res.status(502).json({ error: `Cannot write ${filePath}`, detail: await r.text() });
    }

    // 4) register every page in data/index.json on the branch (single read + write)
    r = await gh(token, `/repos/${repo}/contents/data/index.json?ref=${branch}`);
    if (r.ok) {
      const reg = await r.json();
      let json; try { json = JSON.parse(unb64(reg.content.replace(/\n/g, ''))); } catch { json = { condos: [] }; }
      const slugs = pages.map((p) => p.slug);
      json.condos = (json.condos || []).filter((c) => !slugs.includes(c.slug));
      pages.forEach((p) => json.condos.push({ slug: p.slug, name: p.name || name || p.slug, area: area || '', published: today }));
      await gh(token, `/repos/${repo}/contents/data/index.json`, 'PUT', {
        message: `Register ${slugs.join(', ')} in directory`, content: b64(JSON.stringify(json, null, 2)), branch, sha: reg.sha,
      });
    }

    // 5) open a PR (ignore "already exists")
    const previewList = pages.map((p) => `- \`/${p.slug}\``).join('\n');
    const title = pages.length > 1
      ? `New condo: ${name || primarySlug} (${pages.length} pages)`
      : `New condo: ${name || primarySlug}`;
    let prUrl = null;
    r = await gh(token, `/repos/${repo}/pulls`, 'POST', {
      title, head: branch, base: 'main',
      body: `Preview on the PR's Vercel deployment:\n${previewList}\n\nReview the numbers, then merge to publish.`,
    });
    if (r.ok) prUrl = (await r.json()).html_url;
    else if (r.status === 422) prUrl = `https://github.com/${repo}/pulls`; // PR already open

    return res.status(200).json({ branch, prUrl, slugs: pages.map((p) => p.slug) });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
