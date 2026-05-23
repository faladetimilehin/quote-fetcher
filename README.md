# Quote Fetcher

![Complete Screenshot](complete.png)

A small React + Vite app that fetches a random quote and provides a Twitter share button.

**Important files**
- `src/components/Quote.jsx` — main quote component (fetch logic, CORS fallback, fallback quote, author display).
- `src/App.jsx` — app root that renders the `Quote` component.
- `vite.config.js` — Vite config (add a dev proxy here for local CORS bypass if desired).

## Features
- Fetches quotes from the public `type.fit` API (random selection client-side).
- CORS fallback retry via a public proxy for development convenience.
- Local fallback quote when the API fails.
- Share quotes on Twitter with a single click.

## Quick start

Install dependencies:

```bash
npm install
```

Run the dev server:

```bash
npm run dev
# open http://127.0.0.1:5173/
```

Build for production:

```bash
npm run build
npm run preview
```

## CORS note (important)

`https://type.fit/api/quotes` does not set CORS headers, so browsers will block direct frontend requests. The app includes a development fallback that retries via `https://api.allorigins.win/raw?url=` but this is unreliable and not recommended for production.

Production-safe options:

1. Add a server-side proxy or serverless function that fetches `type.fit` and returns the JSON with an `Access-Control-Allow-Origin` header (recommended).
2. Host quotes on your own backend or include them in your build.

Example Express proxy (deploy as server or serverless function):

```js
// server.js
import express from 'express'
import fetch from 'node-fetch'
const app = express()

app.get('/api/quotes', async (req, res) => {
	const r = await fetch('https://type.fit/api/quotes')
	const json = await r.json()
	res.set('Access-Control-Allow-Origin', '*')
	res.json(json)
})

app.listen(process.env.PORT || 3000)
```

## Customization
- To change the quote source, edit `src/components/Quote.jsx` and update the `baseUrl` variable inside `getQuote()`.
- To avoid public proxy usage in dev, add a Vite dev proxy in `vite.config.js` that forwards `/api/quotes` to `https://type.fit`.

## Screenshot
- The project root `complete.png` is used above as a full screenshot preview.
