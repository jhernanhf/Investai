# Making InvestAI installable as a mobile "app" (PWA)

This turns your existing site into an installable Progressive Web App —
real home-screen icon, full-screen (no browser address bar), works on both
iOS and Android. It's genuinely a home-screen "app" experience, just not
something published through the App Store or Play Store (that would need
Xcode, Android Studio, developer accounts, and app review — a much bigger,
separate undertaking).

## What to add to your GitHub repo

1. Add these new files/folders to the repo root (same level as your existing
   `index.html`):
   - `manifest.json`
   - `sw.js`
   - `icons/` (the whole folder — 6 PNG files)

2. Open your existing `investai_multiuser.html` and paste this into the
   `<head>`, right after the `<title>` tag:

```html
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#060911" />
<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
<meta name="apple-mobile-web-app-title" content="InvestAI" />
<link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152.png" />
```

Also update your existing viewport meta tag to add `viewport-fit=cover`
(makes the app use the full screen on notched iPhones):

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

3. Right before the closing `</script>` tag near the end of the file
   (after wherever `init()` is called), add:

```html
if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  });
}
```

4. Commit and push — Vercel redeploys automatically.

## How people actually "install" it

**iOS (Safari — must be Safari, not Chrome, for this to work):**
Open the link → tap the Share icon (square with an arrow) → **"Add to Home
Screen"** → confirm. An InvestAI icon appears on their home screen and opens
full-screen, no browser bar.

**Android (Chrome):**
Open the link → Chrome will usually show an **"Add to Home screen"** /
**"Install app"** banner automatically, or open the ⋮ menu → **"Add to Home
screen"** / **"Install app"**.

## What this does and doesn't do

✅ Home screen icon, full-screen standalone window, works offline for
whatever's already been loaded once, feels like a native app to use.

❌ Not in the App Store or Play Store — people have to visit the link once
in their browser and manually "add to home screen." No push notifications
(that requires more setup and, on iOS, has historically had extra
restrictions). Not a substitute for a true native app if you need
App-Store distribution specifically.

## If `manifest.json` points somewhere that doesn't match your setup

I set `start_url` in `manifest.json` to `/investai_multiuser.html`, matching
where your dashboard currently lives. If you ever consolidate to a single
`index.html` (e.g. if you switch to the backend-wired version we built
earlier), update that one line in `manifest.json` to match.
