# Condo Tool — Setup (keys & deploy)

The self-serve tool lives at **`/admin`**. A colleague uploads the Infopack + floor plans, clicks Generate (Claude reads them + pulls live comps), reviews the numbers, and clicks **Publish to preview** — which commits to a branch and opens a PR. Nothing goes live until **you merge the PR**.

## 1. The keys you need (4) and where to get them

| Secret | What it's for | Where to get it |
|---|---|---|
| **`ANTHROPIC_API_KEY`** | Powers Generate (Claude reads the plans + pulls comps) | **console.anthropic.com** → sign in → **Settings → API Keys → Create Key**. This is the **Developer Platform**, separate from your claude.ai Pro plan, and it's **pay-as-you-go** — add a payment method / credits under **Billing**. |
| **`GITHUB_TOKEN`** | Powers Publish (commits the data file, opens the PR) | **github.com → Settings → Developer settings → Personal access tokens → Fine-grained tokens → Generate new token.** Repository access: **only `karenwong-png/harbourview`**. Permissions: **Contents = Read and write**, **Pull requests = Read and write**. Copy the token (shown once). |
| **`GITHUB_REPO`** | Tells the tool which repo | Just the text: `karenwong-png/harbourview` |
| **`ADMIN_PASSWORD`** | Gates the tool so only your team can use it | **You invent it.** Share it with the colleagues who onboard condos. |

Optional: **`GEN_MODEL`** = `claude-sonnet-4-6` (default, cheaper/faster) or `claude-opus-4-8` (more accurate read).

## 2. Where the keys go (Vercel)
Vercel → your project → **Settings → Environment Variables**. Add each of the four (and optional GEN_MODEL) for **Production** *and* **Preview**. Then **redeploy** so they take effect.

> Keep these secret. They live only in Vercel's server env — never in the page, never in GitHub.

## 3. Files to deploy (on top of the multi-condo foundation)
```
admin.html              ← the tool UI  (served at /admin)
vercel.json             ← REPLACE with this one (adds /api routing + function timeouts)
api/_prompt.js          ← bundled skill instructions
api/generate.js         ← calls Claude → returns the condo-data.js
api/publish.js          ← commits to a preview branch + opens a PR
```
Plus the Part-1 foundation must already be in place: `index.html`, `js/main.js`, `data/` folder. Push everything; Vercel auto-detects the `api/` functions — no build config needed.

## 4. Using it
1. Go to **`yoursite.com/admin`**, enter the team password.
2. Type name + area + prices + parking, attach the **Infopack PDF** and **floor plan images**, click **Generate** (~30–90s).
3. **Review** the summary (ROI, per-type scenario totals) and the file. Edit if needed.
4. **Publish to preview** → it opens a PR; Vercel builds a preview deployment.
5. Open the PR, check the preview page at `/<slug>`, and **Merge** to go live.

## 5. Honest caveats
- **Cost:** roughly **USD $0.10–0.50 per Generate**, mostly the live web searches. Set a billing limit in the Anthropic console.
- **Timeout:** Generate can take 30–90s. `maxDuration: 300` in `vercel.json` needs **Vercel Pro**; on **Hobby** functions cap near 60s and Generate may time out → upgrade to Pro, or it'll occasionally need a retry.
- **Upload size:** serverless bodies cap around **4.5 MB**. Keep the Infopack + plans modest (compress a big PDF). Bigger files would need a direct-upload upgrade later.
- **Untested live:** the two `api/` functions are written against the documented Anthropic + GitHub APIs but I could not run them against your real keys. **Test on a Vercel preview deployment first** — generate one known condo and confirm the file + PR come out right before the team relies on it.
- **Security:** the password gates the API. For stronger protection, add Vercel **Deployment Protection** (Pro) on `/admin`.
- **Quality:** auto-generated numbers can be off (floor-plan reads, optimistic comps). The **review + merge step is the safeguard** — keep it.
