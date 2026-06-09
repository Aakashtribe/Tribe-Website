# Tribe — Marketing Site

Single-page site with tab navigation. Open `index.html` directly in your browser — no server required.

## Project structure

```
tribe/
├── index.html      # The entire site (Home, Send, Spend, Receive, About, Contact)
├── css/style.css   # All styles
├── js/main.js      # Tab navigation + interactions
└── assets/         # Images and fonts
```

There is only **one HTML file** — `index.html`. The Home tab is the default view when you open it. Nav tabs switch sections instantly without reloading.

## Run locally

**Option 1 — open directly**

Double-click `index.html` or open it in your browser.

**Option 2 — local server (optional)**

```bash
./serve.sh
# or
npm run dev
```

Then open http://localhost:8080
