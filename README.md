# ARA BLOC × BeLive — Co-Living Investment Proposal

A polished single-page investment proposal site for the ARA BLOC × BeLive co-living partnership in Ara Damansara, Petaling Jaya, Malaysia.

Static HTML/CSS/JS — no build step, no framework. Deploy in under a minute.

---

## 🚀 Quick Deploy to Vercel

### Option 1 — One-click GitHub deploy

1. Push this repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Click **Deploy** — Vercel auto-detects this as a static site

No environment variables, no build command, no settings needed.

### Option 2 — Vercel CLI

```bash
npm install -g vercel
vercel
```

Follow the prompts. The site is live at the URL Vercel gives you.

### Option 3 — Drag and drop

1. Open [vercel.com/new](https://vercel.com/new)
2. Drag the project folder into the browser
3. Done

---

## 📁 Project Structure

```
arabloc-belive/
├── index.html          # Main page
├── css/
│   └── styles.css      # All styles
├── js/
│   └── main.js         # Tab switching + scroll animations
├── vercel.json         # Vercel config (caching headers, security)
├── package.json        # Project metadata
├── .gitignore
└── README.md
```

---

## 💻 Local Development

No build tools required. Pick whichever works for you:

```bash
# Option A — npm (uses npx serve)
npm run dev

# Option B — Python
python3 -m http.server 3000

# Option C — Node http-server
npx http-server -p 3000

# Option D — VS Code "Live Server" extension
# Right-click index.html → Open with Live Server
```

Then visit `http://localhost:3000`.

---

## 🛠 Customizing

### Colors

All brand colors live as CSS variables at the top of `css/styles.css`:

```css
:root {
  --cream: #fff4e1;
  --orange: #f58524;
  --rust: #c64a2c;
  --teal: #2bbcb4;
  /* ... */
}
```

Change them once and the whole site updates.

### Typography

Fonts are loaded from Google Fonts in `index.html`:
- **Fraunces** (serif) — display headings
- **Plus Jakarta Sans** (sans) — body text

To swap, update the `<link>` tag in `<head>` and the `font-family` rules in `styles.css`.

### Content

All copy lives directly in `index.html`. No CMS, no JSON — just edit the HTML.

### Adding Real Images

The project currently uses inline SVG illustrations and icons. To swap in real photos:

1. Create an `images/` folder at the project root
2. Add your images (use `.webp` for best performance)
3. Replace the relevant `<svg>` blocks in `index.html` with `<img src="/images/your-image.webp" alt="...">`

---

## 🌐 Custom Domain

After deploying to Vercel:

1. Go to your project → **Settings** → **Domains**
2. Add your domain (e.g. `osk-areca.belive.asia`)
3. Update DNS records as Vercel instructs
4. SSL is automatic

---

## 📦 Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, grid, flexbox, no preprocessor
- **Vanilla JavaScript** — tab switching, scroll-reveal animations (~60 lines)
- **Google Fonts** — Fraunces + Plus Jakarta Sans

No frameworks. No bundler. ~30 KB total page weight (excluding fonts).

---

## ✨ Features

- Fully responsive (mobile-first breakpoint at 900px)
- Interactive Type A / Type B rental projection tabs
- Scroll-reveal animations via IntersectionObserver
- Click-to-call, click-to-email, click-to-WhatsApp links
- SEO meta tags + Open Graph
- Long-cache headers for CSS/JS via `vercel.json`
- Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy)

---

## 📄 License

Proprietary — © BeLive Ventures Sdn Bhd. All rights reserved.

---

## 🙋 Support

- **Website:** [belive.asia](https://www.belive.asia)
- **Email:** info@belive.asia
- **Phone:** +603-9212 4632
- **WhatsApp:** +6011-5698 5313
