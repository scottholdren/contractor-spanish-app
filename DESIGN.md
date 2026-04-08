# Design System — The Painting Deck

## Product Context
- **What this is:** Mobile-first PWA flashcard app for construction trade vocabulary (English<>Spanish)
- **Who it's for:** Foremen and crew members on mixed-language construction sites
- **Space/industry:** Language learning x construction trades
- **Project type:** Mobile-first web app (PWA), used outdoors on job sites

## Aesthetic Direction
- **Direction:** Industrial/Utilitarian — function-first, no decoration. Like a well-organized tool chest.
- **Decoration level:** Minimal — typography and spacing do all the work. Photos of real tools are the only visual interest.
- **Mood:** Practical, trustworthy, readable. Not playful (not Duolingo), not clinical (not Anki). Approachable enough that a crew member uses it voluntarily during lunch.
- **Anti-patterns:** No gamification (no XP, streaks, confetti, cartoon mascots). No purple gradients, no 3-column icon grids, no decorative blobs.

## Typography
- **Display/Hero:** DM Sans Bold — geometric, clean, highly legible at large sizes. Open letterforms for outdoor readability.
- **Body:** DM Sans Regular — same family, excellent x-height, great at small sizes in sunlight.
- **UI/Labels:** DM Sans Semibold — uppercase with 1px letter-spacing for category chips and section headers.
- **Data/Tables:** DM Sans Medium — supports tabular-nums for progress stats and counts.
- **Code:** Not applicable (no code display in this product).
- **Loading:** Google Fonts CDN — `https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap`
- **Scale:**
  - Hero: 48px / 700
  - H1: 28px / 700
  - H2: 22px / 700
  - H3: 18px / 600
  - Body: 16px / 400
  - Body small: 14px / 400
  - Caption: 12px / 500
  - Label: 11px / 600 uppercase

## Color
- **Approach:** Restrained — 1 accent + warm neutrals. Color is rare and meaningful.
- **Primary accent:** #D97706 (amber) — warm, visible in sunlight, reads "construction." Used for active states, CTAs, Spanish terms, audio buttons.
- **Accent light:** #FEF3C7 — hover/active backgrounds for accent elements.
- **Background:** #FFFFFF (pure white) — maximum sunlight readability.
- **Surface:** #F5F3F0 (warm off-white) — cards, flashcard backgrounds, input backgrounds.
- **Surface hover:** #ECEAE6 — interactive surface states.
- **Primary text:** #1C1917 (warm black) — all body text, headings.
- **Secondary text:** #78716C (warm gray) — labels, captions, metadata.
- **Muted text:** #A8A29E — placeholders, disabled states.
- **Border:** #E7E5E4 — card borders, dividers, input borders.
- **Semantic:**
  - Success: #16A34A / light: #DCFCE7 — "Know It" button, mastered words
  - Warning: #D97706 / light: #FEF3C7 — "Still Learning" button, review reminders
  - Error: #DC2626 / light: #FEE2E2 — errors only
  - Info: #2563EB / light: #DBEAFE — regional variant notes, tips
- **Dark mode strategy:** Invert surfaces (bg: #1C1917, surface: #292524), reduce accent saturation 10%, keep semantic colors. Dark mode is a nice-to-have, not a v1 requirement.

## Spacing
- **Base unit:** 8px
- **Density:** Comfortable — generous spacing for outdoor readability and gloved hands.
- **Scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64
- **Tap targets:** 48px minimum height for all interactive elements. 72px for primary actions (Know It, Still Learning). 16px minimum gap between adjacent tap targets.
- **No swipe gestures** — gloves make swiping unreliable. Tap only.

## Layout
- **Approach:** Grid-disciplined — strict alignment, predictable patterns. No surprises.
- **Grid:** Single column on mobile (the only viewport that matters for v1).
- **Max content width:** 480px (phone-optimized).
- **Border radius:**
  - sm: 4px (small elements, spacing blocks)
  - md: 8px (buttons, inputs, thumbnails, chips)
  - lg: 12px (cards, flashcards, alerts)
  - full: 9999px (audio button, category chips, pill badges)

## Motion
- **Approach:** Minimal-functional — only transitions that aid comprehension.
- **Easing:** enter(ease-out) exit(ease-in) move(ease-in-out)
- **Duration:**
  - micro: 50-100ms (button press feedback, hover)
  - short: 150-250ms (card flip reveal, slide between cards)
  - medium: 250-400ms (screen transitions)
- **No bouncing, no spring physics, no parallax.** These users want answers, not animation.

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-08 | Industrial/utilitarian aesthetic | Users are construction workers on job sites, not students. Field tool, not game. |
| 2026-04-08 | Amber accent (#D97706) | Reads "construction" without being cliche yellow. Stands out vs. blue/green used by every language app. Visible in sunlight. |
| 2026-04-08 | DM Sans (single family) | Excellent x-height and open apertures for outdoor readability. Free on Google Fonts. One family = fast load for PWA. |
| 2026-04-08 | No gamification | Construction workers don't want cartoon owls or streak guilt. Just "23 of 50 learned." Respect their time. |
| 2026-04-08 | 72px primary tap targets | Research shows gloved hands need 60-72px minimum. Standard 44px fails on construction sites. |
| 2026-04-08 | Pure white background | 7:1+ contrast ratio for direct sunlight readability. Off-white and grays wash out outdoors. |
