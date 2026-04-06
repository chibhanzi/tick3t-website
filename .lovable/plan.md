

## Plan

### Bug Fix: Drawer Dashboard Link

The Header component has redundant "Dashboard" links for organizers — one from `navigationItems` (which already includes `/organizer-dashboard`) and a separate one at line 115 using `dashboardLink`. The fix is to remove the separate Dashboard link from the drawer when the user is an organizer (since it's already in `navigationItems`), and ensure the fallback always points correctly.

**File: `src/components/Header.tsx`**
- Remove the duplicate Dashboard link in the mobile drawer for organizers (the `navigationItems` array already contains it)
- Keep the standalone Dashboard link only for regular users

---

### Platform Discussion: Tick3rt in Zimbabwe

**Current Zimbabwean Ticket Platforms:**
- **Webtickets Zimbabwe** — basic, clunky UI, limited mobile experience
- **TicketBox.co.zw** — functional but dated design, no resale marketplace
- **Eventbrite** — used by some organizers but not localized, no local payment methods
- **Social media / WhatsApp** — still the dominant "platform" for most events, zero buyer protection

**What makes Tick3rt competitive in Zimbabwe:**
1. **Paynow integration** — this is the killer feature. EcoCash and OneMoney dominate payments. Most competitors force USD card payments or bank transfers
2. **Resale marketplace** — Zimbabwe has a massive informal ticket resale culture (WhatsApp groups). Formalizing this with verified tickets eliminates scams
3. **Mobile-first design** — ~90% of Zimbabwean internet users are on mobile. The current responsive design is strong
4. **TON/NFT angle** — not the selling point for most users, but positions the platform as future-proof and appeals to tech-savvy early adopters

**Feasibility:**
- Very feasible. The market is underserved. The main barrier is trust and adoption, not technology
- Event organizers currently lose significant revenue to counterfeit tickets — Tick3rt's QR verification via Vouch solves this directly
- Partnership with Zimbabwean event promoters (Jibilika, Shoko Festival, etc.) would accelerate adoption

**UI Improvements to Stand Out:**

1. **Homepage — Location awareness**: Add a city selector (Harare, Bulawayo, Mutare) at the top. Zimbabwean users want to see events near them immediately
2. **Social proof on event cards**: Show "X people going" or "Trending in Harare" badges. Social validation drives ticket purchases heavily in Zimbabwe
3. **Event card improvements**: Add countdown timers for upcoming events, show price range prominently (people price-compare immediately)
4. **WhatsApp share button**: WhatsApp is THE social platform in Zimbabwe. Add prominent WhatsApp sharing on every event, not just generic social share
5. **Trust indicators**: Add "Verified Organizer" badges, refund policy visibility, and "Secure Payment via Paynow" badges on checkout
6. **Explore page**: Add a map view option for events — people want to know distance/location
7. **Dark mode polish**: The current dark mode is good but could use more contrast on cards for outdoor/bright-screen readability (common use case in Zimbabwe)
8. **Language**: Consider adding Shona greetings/copy options — even small touches like "Mhoro! Find your next event" create connection

**Priority order for maximum impact:**
1. WhatsApp share integration (highest ROI feature for Zimbabwe)
2. City/location selector on homepage
3. "Trending" and social proof badges on event cards
4. Trust badges on checkout (Paynow verified, refund policy)
5. Countdown timers on event cards

