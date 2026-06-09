# Tribe — Marketing Site

Single-page site with tab navigation. Site files live in `docs/` for GitHub Pages hosting.

## Project structure

```
tribe/
├── docs/
│   ├── index.html      # The entire site (Home, Send, Spend, Receive, About, Contact)
│   ├── css/style.css   # All styles
│   ├── js/main.js      # Tab navigation + interactions
│   └── assets/         # Images and fonts
├── package.json
└── serve.sh
```

There is only **one HTML file** — `docs/index.html`. The Home tab is the default view when you open it. Nav tabs switch sections instantly without reloading.

## Run locally

**Option 1 — open directly**

Double-click `docs/index.html` or open it in your browser.

**Option 2 — local server (optional)**

```bash
./serve.sh
# or
npm run dev
```

Then open http://localhost:8080
