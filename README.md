# Eventora – Responsive Event Management Website

Browse upcoming events, view details and register for the ones you like. Built with plain **HTML5, CSS3 and JavaScript**, with no frameworks or build step.

**Live site:** _add your Netlify / Vercel / GitHub Pages link_
**Repository:** _add your GitHub link_

## Features
- Hero section with a live countdown to the next event
- Event cards showing image, date, venue, category and short description
- Search by name, venue or topic, plus category filter chips
- Event detail dialog with a registration form (name, email, phone, event)
- JavaScript validation: name format, email pattern, 10-digit Indian mobile number, duplicate-registration check
- Confirmation message after successful registration
- **Bonus:** dark/light mode (remembers your choice), countdown timers, animations, and a "My tickets" list saved in Local Storage (with cancel)
- Responsive across mobile, tablet and desktop; keyboard accessible; respects reduced-motion

## Project structure
```
index.html   page structure and semantic markup
style.css    design tokens, layout (CSS Grid/Flexbox), dark theme, animations
script.js    event data, rendering, filtering, validation, timers, Local Storage
```

## How it works
1. `EVENTS` in `script.js` holds all event data. Add a new object to add a new event; cards, filters and the form's dropdown update automatically.
2. `render()` filters by the active category and search text, then rebuilds the card grid.
3. Clicking a card opens a native `<dialog>` with the full details and form.
4. On submit, each field is validated. Valid registrations are stored in `localStorage` under `eventora_regs`.
5. CSS custom properties switch between light and dark themes via `data-theme` on `<html>`.

## Run locally
Open `index.html` in a browser, or run `npx serve`.

## Deploy
- **GitHub Pages:** Settings → Pages → deploy from `main` branch, root folder.
- **Netlify / Vercel:** import the repo; no build command, publish directory `/`.

## Git workflow
```
git init
git add .
git commit -m "Add Eventora event management site"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

## Future improvements
Real event images, a backend for registrations, email confirmation, and calendar export.
