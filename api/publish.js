/**
 * POST /api/publish   (PREVIEW-FIRST: commits to a branch + opens a PR, never to main directly)
 * Body (JSON): { slug, condoData, name, area }
 * Header: x-admin-password
 * Returns: { branch, prUrl }  — Vercel auto-builds a preview for the PR; merge it to go live.
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
    const { slug, condoData, name, area } = req.body || {};
    if (!slug || !condoData) return res.status(400).json({ error: 'slug and condoData required' });
    const branch = 'add-' + slug;

    // 1) base sha from main
    let r = await gh(token, `/repos/${repo}/git/refs/heads/main`);
    if (!r.ok) return res.status(502).json({ error: 'Cannot read main ref', detail: await r.text() });
    const baseSha = (await r.json()).object.sha;

    // 2) create branch (ignore "already exists")
    r = await gh(token, `/repos/${repo}/git/refs`, 'POST', { ref: `refs/heads/${branch}`, sha: baseSha });
    if (!r.ok && r.status !== 422) return res.status(502).json({ error: 'Cannot create branch', detail: await r.text() });

    // 3) write data/<slug>.js on the branch (update if it already exists on the branch)
    const filePath = `data/${slug}.js`;
    let existingSha;
    r = await gh(token, `/repos/${repo}/contents/${filePath}?ref=${branch}`);
    if (r.ok) existingSha = (await r.json()).sha;
    r = await gh(token, `/repos/${repo}/contents/${filePath}`, 'PUT', {
      message: `Add/update ${name || slug} condo data`, content: b64(condoData), branch, sha: existingSha,
    });
    if (!r.ok) return res.status(502).json({ error: 'Cannot write data file', detail: await r.text() });

    // 4) append to data/index.json on the branch
    r = await gh(token, `/repos/${repo}/contents/data/index.json?ref=${branch}`);
    if (r.ok) {
      const reg = await r.json();
      let json; try { json = JSON.parse(unb64(reg.content.replace(/\n/g, ''))); } catch { json = { condos: [] }; }
      json.condos = (json.condos || []).filter((c) => c.slug !== slug);
      json.condos.push({ slug, name: name || slug, area: area || '', published: new Date().toISOString().slice(0, 10) });
      await gh(token, `/repos/${repo}/contents/data/index.json`, 'PUT', {
        message: `Register ${slug} in directory`, content: b64(JSON.stringify(json, null, 2)), branch, sha: reg.sha,
      });
    }

    // 5) open a PR (ignore "already exists")
    let prUrl = null;
    r = await gh(token, `/repos/${repo}/pulls`, 'POST', {
      title: `New condo: ${name || slug}`, head: branch, base: 'main',
      body: `Preview this condo at \`/${slug}\` on the PR's Vercel deployment. Review the numbers, then merge to publish.`,
    });
    if (r.ok) prUrl = (await r.json()).html_url;
    else if (r.status === 422) prUrl = `https://github.com/${repo}/pulls`; // PR already open

    return res.status(200).json({ branch, prUrl, slug });
  } catch (e) {
    return res.status(500).json({ error: String(e && e.message || e) });
  }
};
