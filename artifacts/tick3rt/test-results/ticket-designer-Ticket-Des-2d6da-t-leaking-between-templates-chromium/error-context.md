# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: ticket-designer.spec.ts >> Ticket Designer — end-to-end flow >> step 2 — decorative accents are editable on desktop and mobile without leaking between templates
- Location: e2e/ticket-designer.spec.ts:444:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByLabel('Rotation °')

```

# Page snapshot

```yaml
- generic [ref=f1e2]:
  - region "Notifications (F8)":
    - list
  - region "Notifications alt+T"
  - generic [ref=f1e3]:
    - banner [ref=f1e4]:
      - generic [ref=f1e5]:
        - generic [ref=f1e6]:
          - link [ref=f1e7] [cursor=pointer]:
            - /url: /
            - img "Tick3t" [ref=f1e9]
          - generic [ref=f1e11]: Organizer
        - navigation [ref=f1e12]:
          - link "Dashboard" [ref=f1e13] [cursor=pointer]:
            - /url: /organizer-dashboard
          - link "Create Event" [ref=f1e20] [cursor=pointer]:
            - /url: /create-event
          - link "Profile" [ref=f1e23] [cursor=pointer]:
            - /url: /organizer-dashboard
        - generic [ref=f1e28]:
          - button "Toggle theme" [ref=f1e29]
          - button "TO" [ref=f1e32]
    - main [ref=f1e35]:
      - generic [ref=f1e36]:
        - heading "Create Your Event" [level=1] [ref=f1e37]
        - paragraph [ref=f1e38]: Design unique NFT tickets and bring your vision to life
      - generic [ref=f1e39]:
        - generic [ref=f1e40]:
          - paragraph [ref=f1e45]: Draft restored. We saved your progress from your last session — pick up right where you left off.
          - button "Dismiss" [ref=f1e46]
        - generic [ref=f1e52]:
          - generic [ref=f1e59]:
            - paragraph [ref=f1e60]: Event Details
            - paragraph [ref=f1e61]: Basic event information
          - generic [ref=f1e65]:
            - generic [ref=f1e66]: "2"
            - generic [ref=f1e68]:
              - paragraph [ref=f1e69]: Ticket Design
              - paragraph [ref=f1e70]: Create stunning ticket designs
          - generic [ref=f1e74]:
            - generic [ref=f1e75]: "3"
            - generic [ref=f1e77]:
              - paragraph [ref=f1e78]: Generation Method
              - paragraph [ref=f1e79]: Choose how tickets are created
          - generic [ref=f1e83]:
            - generic [ref=f1e84]: "4"
            - generic [ref=f1e86]:
              - paragraph [ref=f1e87]: Security Features
              - paragraph [ref=f1e88]: Configure advanced security
          - generic [ref=f1e92]:
            - generic [ref=f1e93]: "5"
            - generic [ref=f1e95]:
              - paragraph [ref=f1e96]: Pricing & Payments
              - paragraph [ref=f1e97]: Set pricing and payment options
          - generic [ref=f1e101]:
            - generic [ref=f1e102]: "6"
            - generic [ref=f1e104]:
              - paragraph [ref=f1e105]: Review & Publish
              - paragraph [ref=f1e106]: Final review and launch
        - generic [ref=f1e108]:
          - generic [ref=f1e109]:
            - generic [ref=f1e110]:
              - button "Ticket Design Electric Stage" [ref=f1e111]:
                - generic [ref=f1e117]: Ticket Design
                - generic [ref=f1e118]: Electric Stage
              - generic [ref=f1e121]:
                - generic [ref=f1e122]:
                  - button "Template Gallery" [ref=f1e123]
                  - button "Custom Builder" [ref=f1e124]
                - generic [ref=f1e125]:
                  - textbox "Search templates…" [ref=f1e127]
                  - generic [ref=f1e128]:
                    - button "All" [ref=f1e129]
                    - button "Concert & Music" [ref=f1e130]
                    - button "Sports" [ref=f1e131]
                    - button "Festival" [ref=f1e132]
                    - button "Corporate" [ref=f1e133]
                    - button "Conference" [ref=f1e134]
                    - button "Art & Culture" [ref=f1e135]
                    - button "Charity & Gala" [ref=f1e136]
                    - button "Tech & Gaming" [ref=f1e137]
                  - generic [ref=f1e138]:
                    - generic [ref=f1e139] [cursor=pointer]:
                      - generic [ref=f1e144]:
                        - generic [ref=f1e150]:
                          - generic [ref=f1e151]:
                            - generic [ref=f1e152]: Concert & Music
                            - generic [ref=f1e153]: Electric Stage
                            - generic [ref=f1e154]: Sat, Dec 20 · 8:00 PM
                          - generic [ref=f1e155]:
                            - generic [ref=f1e156]: Venue
                            - generic [ref=f1e157]: City Arena, Main Stage
                        - generic [ref=f1e158]:
                          - generic [ref=f1e169]: "#TK-001"
                          - generic [ref=f1e170]: ADMIT ONE
                      - generic [ref=f1e172]:
                        - generic [ref=f1e173]:
                          - generic [ref=f1e174]: Electric Stage
                          - generic [ref=f1e175]: Neon-glow horizontal with purple stub and scan accents.
                        - generic [ref=f1e176]:
                          - generic [ref=f1e177]: "#music"
                          - generic [ref=f1e178]: "#concert"
                          - generic [ref=f1e179]: "#neon"
                        - button "Selected" [ref=f1e180]
                    - generic [ref=f1e181] [cursor=pointer]:
                      - generic [ref=f1e182]: Premium
                      - generic [ref=f1e186]:
                        - generic [ref=f1e188]:
                          - generic [ref=f1e189]:
                            - generic [ref=f1e190]: Concert & Music
                            - generic [ref=f1e191]: Golden Mic
                            - generic [ref=f1e192]: Dec 20 · 8 PM
                          - generic [ref=f1e193]: City Arena
                        - generic [ref=f1e194]: "#TK-002"
                      - generic [ref=f1e207]:
                        - generic [ref=f1e208]:
                          - generic [ref=f1e209]: Golden Mic
                          - generic [ref=f1e210]: Diagonal gold triangle split on a black base, serif luxury.
                        - generic [ref=f1e211]:
                          - generic [ref=f1e212]: "#music"
                          - generic [ref=f1e213]: "#jazz"
                          - generic [ref=f1e214]: "#gold"
                        - button "Use this template" [ref=f1e215]
                    - generic [ref=f1e216] [cursor=pointer]:
                      - generic [ref=f1e220]:
                        - generic [ref=f1e221]:
                          - generic [ref=f1e222]: Concert & Music
                          - generic [ref=f1e223]: Indie Wave
                          - generic [ref=f1e224]: Dec 20 · 8:00 PM · City Arena
                        - generic [ref=f1e225]:
                          - generic [ref=f1e226]: ADMIT
                          - generic [ref=f1e227]: "1"
                          - generic [ref=f1e228]: ONE
                      - generic [ref=f1e231]:
                        - generic [ref=f1e232]:
                          - generic [ref=f1e233]: Indie Wave
                          - generic [ref=f1e234]: Wavy SVG bottom edge and retro stamp circle — festival poster vibe.
                        - generic [ref=f1e235]:
                          - generic [ref=f1e236]: "#music"
                          - generic [ref=f1e237]: "#indie"
                          - generic [ref=f1e238]: "#retro"
                        - button "Use this template" [ref=f1e239]
                    - generic [ref=f1e240] [cursor=pointer]:
                      - generic [ref=f1e242]:
                        - generic [ref=f1e245]:
                          - generic [ref=f1e246]:
                            - generic [ref=f1e247]: Sports
                            - generic [ref=f1e248]: Game Day
                            - generic [ref=f1e249]: Dec 20 · 8:00 PM
                          - generic [ref=f1e250]: City Arena, Main Stage
                        - generic [ref=f1e251]:
                          - generic [ref=f1e252]: Section
                          - generic [ref=f1e253]: A3
                          - generic [ref=f1e254]: Row 12 · Seat 7
                          - generic [ref=f1e256]: "#TK-003"
                      - generic [ref=f1e257]:
                        - generic [ref=f1e258]:
                          - generic [ref=f1e259]: Game Day
                          - generic [ref=f1e260]: Dark stadium card with section/row/seat scoreboard stub.
                        - generic [ref=f1e261]:
                          - generic [ref=f1e262]: "#sports"
                          - generic [ref=f1e263]: "#match"
                          - generic [ref=f1e264]: "#stadium"
                        - button "Use this template" [ref=f1e265]
                    - generic [ref=f1e266] [cursor=pointer]:
                      - generic [ref=f1e267]: Premium
                      - generic [ref=f1e271]:
                        - generic [ref=f1e274]:
                          - generic [ref=f1e275]:
                            - generic [ref=f1e276]: Sports
                            - generic [ref=f1e277]: Podium
                            - generic [ref=f1e278]: Dec 20 · 8:00 PM
                          - generic [ref=f1e279]: City Arena
                        - generic [ref=f1e280]:
                          - generic [ref=f1e281]: Gate
                          - generic [ref=f1e282]: P1
                          - generic [ref=f1e283]: "#TK-004"
                      - generic [ref=f1e284]:
                        - generic [ref=f1e285]:
                          - generic [ref=f1e286]: Podium
                          - generic [ref=f1e287]: Carbon-fibre weave background slashed by a red racing stripe.
                        - generic [ref=f1e288]:
                          - generic [ref=f1e289]: "#sports"
                          - generic [ref=f1e290]: "#racing"
                          - generic [ref=f1e291]: "#carbon"
                        - button "Use this template" [ref=f1e292]
                    - generic [ref=f1e293] [cursor=pointer]:
                      - generic [ref=f1e295]:
                        - generic [ref=f1e299]:
                          - generic [ref=f1e300]:
                            - generic [ref=f1e301]: Festival
                            - generic [ref=f1e302]: Solstice
                            - generic [ref=f1e303]: Dec 20 · 8:00 PM
                          - generic [ref=f1e304]: City Arena
                        - generic [ref=f1e305]:
                          - generic [ref=f1e306]: ADMIT ONE
                          - generic [ref=f1e307]: "#TK-005"
                      - generic [ref=f1e308]:
                        - generic [ref=f1e309]:
                          - generic [ref=f1e310]: Solstice
                          - generic [ref=f1e311]: Radial rainbow gradient with concentric ring decoration.
                        - generic [ref=f1e312]:
                          - generic [ref=f1e313]: "#festival"
                          - generic [ref=f1e314]: "#outdoor"
                          - generic [ref=f1e315]: "#summer"
                        - button "Use this template" [ref=f1e316]
                    - generic [ref=f1e317] [cursor=pointer]:
                      - generic [ref=f1e318]: Premium
                      - generic [ref=f1e322]:
                        - generic [ref=f1e326]:
                          - generic [ref=f1e327]:
                            - generic [ref=f1e328]: Festival
                            - generic [ref=f1e329]: Neon Carnival
                            - generic [ref=f1e330]: Dec 20 · 20:00
                          - generic [ref=f1e331]: City Arena
                        - generic [ref=f1e332]:
                          - generic [ref=f1e333]: TOKEN
                          - generic [ref=f1e334]: TK-007
                      - generic [ref=f1e352]:
                        - generic [ref=f1e353]:
                          - generic [ref=f1e354]: Neon Carnival
                          - generic [ref=f1e355]: Dark grid + scan-line overlay with a cyan pixel-art stub.
                        - generic [ref=f1e356]:
                          - generic [ref=f1e357]: "#festival"
                          - generic [ref=f1e358]: "#rave"
                          - generic [ref=f1e359]: "#cyber"
                        - button "Use this template" [ref=f1e360]
                    - generic [ref=f1e361] [cursor=pointer]:
                      - generic [ref=f1e363]:
                        - generic [ref=f1e367]:
                          - generic [ref=f1e368]:
                            - generic [ref=f1e369]: Corporate
                            - generic [ref=f1e370]: Slate Pro
                            - generic [ref=f1e371]: Dec 20 · 8:00 PM
                          - generic [ref=f1e372]: City Arena
                        - generic [ref=f1e373]:
                          - generic [ref=f1e384]: "#TK-008"
                          - generic [ref=f1e385]: ADMIT 1
                      - generic [ref=f1e386]:
                        - generic [ref=f1e387]:
                          - generic [ref=f1e388]: Slate Pro
                          - generic [ref=f1e389]: Navy/white split panel with blue accent bar — clean and sharp.
                        - generic [ref=f1e390]:
                          - generic [ref=f1e391]: "#corporate"
                          - generic [ref=f1e392]: "#clean"
                          - generic [ref=f1e393]: "#split"
                        - button "Use this template" [ref=f1e394]
                    - generic [ref=f1e395] [cursor=pointer]:
                      - generic [ref=f1e396]: Premium
                      - generic [ref=f1e400]:
                        - generic [ref=f1e408]:
                          - generic [ref=f1e409]: Corporate · VIP
                          - generic [ref=f1e410]: Executive
                          - generic [ref=f1e411]: Dec 20 · 20:00 · City Arena
                        - generic [ref=f1e412]:
                          - generic [ref=f1e413]: Admit
                          - generic [ref=f1e414]: I
                          - generic [ref=f1e415]: "#TK-009"
                      - generic [ref=f1e416]:
                        - generic [ref=f1e417]:
                          - generic [ref=f1e418]: Executive
                          - generic [ref=f1e419]: Full black with art-deco gold corner ornaments and fine rules.
                        - generic [ref=f1e420]:
                          - generic [ref=f1e421]: "#corporate"
                          - generic [ref=f1e422]: "#luxury"
                          - generic [ref=f1e423]: "#deco"
                        - button "Use this template" [ref=f1e424]
                    - generic [ref=f1e425] [cursor=pointer]:
                      - generic [ref=f1e427]:
                        - generic [ref=f1e430]:
                          - generic [ref=f1e431]:
                            - generic [ref=f1e432]: Conference
                            - generic [ref=f1e433]: Summit
                            - generic [ref=f1e434]: Dec 20 · 8:00 PM
                          - generic [ref=f1e435]: City Arena
                        - generic [ref=f1e436]: "#TK-010"
                      - generic [ref=f1e448]:
                        - generic [ref=f1e449]:
                          - generic [ref=f1e450]: Summit
                          - generic [ref=f1e451]: Purple gradient with translucent circle and diagonal band.
                        - generic [ref=f1e452]:
                          - generic [ref=f1e453]: "#conference"
                          - generic [ref=f1e454]: "#tech"
                          - generic [ref=f1e455]: "#modern"
                        - button "Use this template" [ref=f1e456]
                    - generic [ref=f1e457] [cursor=pointer]:
                      - generic [ref=f1e459]:
                        - generic: "01"
                        - generic [ref=f1e460]:
                          - generic [ref=f1e461]: Conference
                          - generic [ref=f1e463]: 2025 SEASON
                        - generic [ref=f1e464]:
                          - generic [ref=f1e465]:
                            - generic [ref=f1e466]: Keynote
                            - generic [ref=f1e467]: Dec 20 · 8:00 PM
                          - generic [ref=f1e468]: City Arena
                        - generic [ref=f1e469]:
                          - generic [ref=f1e470]: Gate
                          - generic [ref=f1e471]: K
                          - generic [ref=f1e472]: "#TK-011"
                      - generic [ref=f1e473]:
                        - generic [ref=f1e474]:
                          - generic [ref=f1e475]: Keynote
                          - generic [ref=f1e476]: Bold blue with oversized ghost numeral and labelled gate stub.
                        - generic [ref=f1e477]:
                          - generic [ref=f1e478]: "#conference"
                          - generic [ref=f1e479]: "#keynote"
                          - generic [ref=f1e480]: "#bold"
                        - button "Use this template" [ref=f1e481]
                    - generic [ref=f1e482] [cursor=pointer]:
                      - generic [ref=f1e484]:
                        - generic [ref=f1e489]:
                          - generic [ref=f1e490]: Art & Culture
                          - generic [ref=f1e491]: Gallery Opening
                          - generic [ref=f1e492]: Dec 20 · 8:00 PM · City Arena
                        - generic [ref=f1e493]: "#TK-012"
                      - generic [ref=f1e505]:
                        - generic [ref=f1e506]:
                          - generic [ref=f1e507]: Gallery Opening
                          - generic [ref=f1e508]: Bright white with a thick left stripe — gallery card minimalism.
                        - generic [ref=f1e509]:
                          - generic [ref=f1e510]: "#art"
                          - generic [ref=f1e511]: "#gallery"
                          - generic [ref=f1e512]: "#minimal"
                        - button "Use this template" [ref=f1e513]
                    - generic [ref=f1e514] [cursor=pointer]:
                      - generic [ref=f1e515]: Premium
                      - generic [ref=f1e519]:
                        - generic [ref=f1e524]:
                          - generic [ref=f1e525]:
                            - generic [ref=f1e526]: Art & Culture
                            - generic [ref=f1e527]: Aurora
                            - generic [ref=f1e528]: Dec 20 · 8:00 PM
                          - generic [ref=f1e529]: City Arena
                        - generic [ref=f1e530]: "#TK-013"
                      - generic [ref=f1e534]:
                        - generic [ref=f1e535]:
                          - generic [ref=f1e536]: Aurora
                          - generic [ref=f1e537]: Teal-to-purple gradient with flowing SVG curves and glass stub.
                        - generic [ref=f1e538]:
                          - generic [ref=f1e539]: "#art"
                          - generic [ref=f1e540]: "#theatre"
                          - generic [ref=f1e541]: "#flowing"
                        - button "Use this template" [ref=f1e542]
                    - generic [ref=f1e543] [cursor=pointer]:
                      - generic [ref=f1e544]: Premium
                      - generic [ref=f1e548]:
                        - generic [ref=f1e551]:
                          - generic [ref=f1e552]: Charity & Gala
                          - generic [ref=f1e553]: Gala Noir
                          - generic [ref=f1e554]: Dec 20 · 20:00 · City Arena
                        - generic [ref=f1e555]:
                          - generic [ref=f1e556]: Black Tie
                          - generic [ref=f1e558]: Admit 1
                          - generic [ref=f1e559]: "#TK-014"
                      - generic [ref=f1e560]:
                        - generic [ref=f1e561]:
                          - generic [ref=f1e562]: Gala Noir
                          - generic [ref=f1e563]: Black with vertical gold art-deco lines and a double-frame border.
                        - generic [ref=f1e564]:
                          - generic [ref=f1e565]: "#gala"
                          - generic [ref=f1e566]: "#charity"
                          - generic [ref=f1e567]: "#deco"
                        - button "Use this template" [ref=f1e568]
                    - generic [ref=f1e569] [cursor=pointer]:
                      - generic [ref=f1e571]:
                        - generic [ref=f1e578]:
                          - generic [ref=f1e579]:
                            - generic [ref=f1e580]: Charity & Gala
                            - generic [ref=f1e581]: Blossom
                            - generic [ref=f1e582]: Dec 20 · 8:00 PM
                          - generic [ref=f1e583]: City Arena
                        - generic [ref=f1e584]:
                          - generic [ref=f1e585]: "1"
                          - generic [ref=f1e587]: "#TK-015"
                      - generic [ref=f1e588]:
                        - generic [ref=f1e589]:
                          - generic [ref=f1e590]: Blossom
                          - generic [ref=f1e591]: Soft peach gradient with floral circles and wavy SVG hem.
                        - generic [ref=f1e592]:
                          - generic [ref=f1e593]: "#gala"
                          - generic [ref=f1e594]: "#garden"
                          - generic [ref=f1e595]: "#delicate"
                        - button "Use this template" [ref=f1e596]
                    - generic [ref=f1e597] [cursor=pointer]:
                      - generic [ref=f1e599]:
                        - generic [ref=f1e604]:
                          - generic [ref=f1e605]:
                            - generic [ref=f1e606]: Tech & Gaming
                            - generic [ref=f1e607]: Cybercore
                            - generic [ref=f1e608]: 2025.12.20 / 20:00
                          - generic [ref=f1e609]: "> CITY_ARENA"
                        - generic [ref=f1e610]:
                          - generic [ref=f1e611]: ACCESS
                          - generic [ref=f1e628]: "#TK-016"
                      - generic [ref=f1e629]:
                        - generic [ref=f1e630]:
                          - generic [ref=f1e631]: Cybercore
                          - generic [ref=f1e632]: Black with hex dot grid, green scan-line and corner brackets.
                        - generic [ref=f1e633]:
                          - generic [ref=f1e634]: "#gaming"
                          - generic [ref=f1e635]: "#esports"
                          - generic [ref=f1e636]: "#hex"
                        - button "Use this template" [ref=f1e637]
                    - generic [ref=f1e638] [cursor=pointer]:
                      - generic [ref=f1e639]: Premium
                      - generic [ref=f1e643]:
                        - generic [ref=f1e645]:
                          - generic [ref=f1e646]:
                            - generic [ref=f1e647]: Tech & Gaming
                            - generic [ref=f1e648]: Holographic
                            - generic [ref=f1e649]: Dec 20 · 8:00 PM
                          - generic [ref=f1e650]: City Arena, Main Stage
                        - generic [ref=f1e651]: "#TK-017"
                      - generic [ref=f1e663]:
                        - generic [ref=f1e664]:
                          - generic [ref=f1e665]: Holographic
                          - generic [ref=f1e666]: Rainbow iridescent with glassmorphism info card floating above.
                        - generic [ref=f1e667]:
                          - generic [ref=f1e668]: "#tech"
                          - generic [ref=f1e669]: "#rainbow"
                          - generic [ref=f1e670]: "#glass"
                        - button "Use this template" [ref=f1e671]
            - button "Colour & Style" [ref=f1e673]
            - button "Background Image" [ref=f1e685]
            - button "Effects & Patterns" [ref=f1e695]
            - button "Template Objects" [ref=f1e704]
            - button "Layer Editor" [ref=f1e713]
          - generic [ref=f1e722]:
            - generic [ref=f1e723]:
              - generic [ref=f1e724]:
                - generic [ref=f1e725]: Live Preview
                - generic [ref=f1e726]: Electric Stage
              - generic [ref=f1e730]:
                - generic [ref=f1e732]:
                  - generic [ref=f1e738]:
                    - generic [ref=f1e739]:
                      - generic [ref=f1e740]: Concert & Music
                      - generic [ref=f1e741]: Event Title
                      - generic [ref=f1e742]: Event Date
                    - generic [ref=f1e743]:
                      - generic [ref=f1e744]: Venue
                      - generic [ref=f1e745]: Venue
                  - generic [ref=f1e746]:
                    - generic [ref=f1e757]: "#TK-001"
                    - generic [ref=f1e758]: ADMIT ONE
                - generic: Drag an event detail or layer to position it
            - generic [ref=f1e761]:
              - generic [ref=f1e762]:
                - generic [ref=f1e763]: Electric Stage
                - button "Change" [ref=f1e764]
              - paragraph [ref=f1e765]: Neon-glow horizontal with purple stub and scan accents.
              - generic [ref=f1e766]:
                - generic [ref=f1e767]: "#music"
                - generic [ref=f1e768]: "#concert"
                - generic [ref=f1e769]: "#neon"
              - generic [ref=f1e770]:
                - generic "#a855f7" [ref=f1e771]
                - generic "#0f0c29" [ref=f1e772]
                - generic "#a855f7" [ref=f1e773]
                - generic "#ffffff" [ref=f1e774]
                - generic [ref=f1e775]: Current palette
        - generic [ref=f1e776]:
          - generic [ref=f1e777]:
            - button "Previous" [ref=f1e778]
            - button "Start over" [ref=f1e780]
          - button "Next" [ref=f1e782]
    - contentinfo [ref=f1e784]:
      - generic [ref=f1e785]:
        - generic [ref=f1e786]:
          - generic [ref=f1e787]:
            - link [ref=f1e788] [cursor=pointer]:
              - /url: /
              - img "Tick3t" [ref=f1e789]
            - paragraph [ref=f1e791]: Effortless event tickets and digital identities — pay your way, and carry everything in your pocket.
            - generic [ref=f1e792]:
              - generic [ref=f1e793]: Verified organizers
              - generic [ref=f1e797]: Instant delivery
              - generic [ref=f1e800]: Global marketplace
          - generic [ref=f1e804]:
            - generic [ref=f1e805]:
              - heading "Discover" [level=3] [ref=f1e806]
              - list [ref=f1e807]:
                - listitem [ref=f1e808]:
                  - link "Browse Events" [ref=f1e809] [cursor=pointer]:
                    - /url: /events
                - listitem [ref=f1e810]:
                  - link "Marketplace" [ref=f1e811] [cursor=pointer]:
                    - /url: /marketplace
                - listitem [ref=f1e812]:
                  - link "My Tickets" [ref=f1e813] [cursor=pointer]:
                    - /url: /my-tickets
            - generic [ref=f1e814]:
              - heading "Organize" [level=3] [ref=f1e815]
              - list [ref=f1e816]:
                - listitem [ref=f1e817]:
                  - link "Create Event" [ref=f1e818] [cursor=pointer]:
                    - /url: /create-event
                - listitem [ref=f1e819]:
                  - link "Become an Organizer" [ref=f1e820] [cursor=pointer]:
                    - /url: /upgrade-to-organizer
                - listitem [ref=f1e821]:
                  - link "Organizer Dashboard" [ref=f1e822] [cursor=pointer]:
                    - /url: /organizer-dashboard
            - generic [ref=f1e823]:
              - heading "Developers" [level=3] [ref=f1e824]
              - list [ref=f1e825]:
                - listitem [ref=f1e826]:
                  - link "Developer Portal" [ref=f1e827] [cursor=pointer]:
                    - /url: /developers
                - listitem [ref=f1e828]:
                  - link "API & SDKs" [ref=f1e829] [cursor=pointer]:
                    - /url: /developers
                - listitem [ref=f1e830]:
                  - link "Token Gating" [ref=f1e831] [cursor=pointer]:
                    - /url: /developers
            - generic [ref=f1e832]:
              - heading "Support" [level=3] [ref=f1e833]
              - list [ref=f1e834]:
                - listitem [ref=f1e835]:
                  - link "Help Center" [ref=f1e836] [cursor=pointer]:
                    - /url: /create-event
                - listitem [ref=f1e837]:
                  - link "Contact Us" [ref=f1e838] [cursor=pointer]:
                    - /url: /create-event
                - listitem [ref=f1e839]:
                  - link "Privacy" [ref=f1e840] [cursor=pointer]:
                    - /url: /create-event
                - listitem [ref=f1e841]:
                  - link "Terms" [ref=f1e842] [cursor=pointer]:
                    - /url: /create-event
        - generic [ref=f1e843]:
          - paragraph [ref=f1e844]: © 2026 Tick3t. All rights reserved.
          - generic [ref=f1e845]: All systems operational
```

# Test source

```ts
  358 |         .ticketDesign?.contentPositions?.title?.x ?? 0))
  359 |     ).toBeGreaterThan(0);
  360 | 
  361 |     await page.reload();
  362 |     await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
  363 |     await expect.poll(() =>
  364 |       page.getByTestId("ticket-preview-content-title").evaluate((element) => element.style.left)
  365 |     ).toBe(movedLeft);
  366 |   });
  367 | 
  368 |   test("step 2 — template labels and translucent artwork can be edited, scaled, moved, and restored", async ({ page }) => {
  369 |     await page.locator("#title").fill("Field Day");
  370 |     await page.getByRole("button", { name: /next/i }).last().click();
  371 |     await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
  372 | 
  373 |     // Holographic is the final gallery template and contains both a category
  374 |     // label and a native translucent glass panel.
  375 |     await page.getByRole("button", { name: /use this template/i }).last().click();
  376 |     const templateObjectsButton = page.getByRole("button").filter({ hasText: /Template Objects/i });
  377 |     await templateObjectsButton.click();
  378 | 
  379 |     await page.getByRole("button", { name: "Category tag" }).click();
  380 |     await page.getByLabel("Template category text").fill("Outdoor Field Day");
  381 |     const category = page.getByTestId("ticket-preview-template-category");
  382 |     await expect(category).toHaveText("Outdoor Field Day");
  383 | 
  384 |     await page.getByLabel("Object scale").fill("1.5");
  385 |     await expect(category).toHaveCSS("transform", /matrix\(1\.5/);
  386 |     await page.getByLabel("Template object colour hex").fill("#112233");
  387 |     await expect(category).toHaveCSS("color", "rgb(17, 34, 51)");
  388 | 
  389 |     await templateObjectsButton.click();
  390 |     await category.click();
  391 |     await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
  392 | 
  393 |     await page.getByRole("button", { name: "Translucent layer" }).click();
  394 |     const overlay = page.getByTestId("ticket-preview-template-overlay");
  395 |     await expect(overlay).toBeVisible();
  396 |     await page.getByLabel("Width scale").fill("1.2");
  397 |     await page.getByLabel("Height scale").fill("0.8");
  398 |     await page.getByLabel("Template object colour hex").fill("#334455");
  399 |     await page.getByLabel("Template overlay corner radius").fill("20");
  400 |     await expect(overlay).toHaveCSS("background-color", "rgb(51, 68, 85)");
  401 |     await expect(overlay).toHaveCSS("border-radius", "20px");
  402 |     await expect(overlay).toHaveCSS("transform", /matrix\(1\.2, 0, 0, 0\.8/);
  403 | 
  404 |     const opacity = page.getByLabel("Template object opacity");
  405 |     const opacityBox = await opacity.boundingBox();
  406 |     expect(opacityBox).not.toBeNull();
  407 |     await page.mouse.click(opacityBox!.x + opacityBox!.width * 0.75, opacityBox!.y + opacityBox!.height / 2);
  408 |     await expect.poll(() => overlay.evaluate((element) => Number(getComputedStyle(element).opacity))).toBeLessThan(1);
  409 | 
  410 |     const overlayBox = await overlay.boundingBox();
  411 |     expect(overlayBox).not.toBeNull();
  412 |     await page.mouse.move(overlayBox!.x + overlayBox!.width * 0.9, overlayBox!.y + overlayBox!.height * 0.5);
  413 |     await page.mouse.down();
  414 |     await page.mouse.move(overlayBox!.x + overlayBox!.width * 0.9 + 18, overlayBox!.y + overlayBox!.height * 0.5 + 8);
  415 |     await page.mouse.up();
  416 |     await expect(page.getByLabel("Object X %")).not.toHaveValue("0");
  417 | 
  418 |     await expect.poll(() =>
  419 |       page.evaluate(() => JSON.parse(localStorage.getItem("tick3rt_create_event_draft") || "{}")
  420 |         .ticketDesign?.templateObjectsByTemplate?.holographic?.category?.content)
  421 |     ).toBe("Outdoor Field Day");
  422 | 
  423 |     await page.reload();
  424 |     await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
  425 |     await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Outdoor Field Day");
  426 |     await expect(page.getByTestId("ticket-preview-template-overlay")).toHaveCSS("border-radius", "20px");
  427 | 
  428 |     // Per-template edits must not leak into another design, and should return
  429 |     // when the organiser switches back.
  430 |     await page.getByRole("button", { name: "Change" }).click();
  431 |     await page.getByRole("button", { name: /use this template/i }).first().click();
  432 |     await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Concert & Music");
  433 |     await page.getByRole("button", { name: "Change" }).click();
  434 |     await page.getByRole("button", { name: /use this template/i }).last().click();
  435 |     await expect(page.getByTestId("ticket-preview-template-category")).toHaveText("Outdoor Field Day");
  436 | 
  437 |     await page.setViewportSize({ width: 390, height: 844 });
  438 |     await page.getByRole("button").filter({ hasText: /Template Objects/i }).click();
  439 |     await page.getByRole("button", { name: "Translucent layer" }).click();
  440 |     await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
  441 |     await expect(page.getByTestId("ticket-preview-template-overlay")).toBeVisible();
  442 |   });
  443 | 
  444 |   test("step 2 — decorative accents are editable on desktop and mobile without leaking between templates", async ({ page }) => {
  445 |     await page.getByRole("button", { name: /next/i }).last().click();
  446 |     await expect(page.getByText("LIVE PREVIEW")).toBeVisible({ timeout: 10_000 });
  447 | 
  448 |     await page.getByRole("button", { name: /use this template/i }).first().click();
  449 |     const objectsButton = page.getByRole("button").filter({ hasText: /Template Objects/i });
  450 |     await objectsButton.click();
  451 |     await page.getByRole("button", { name: "Glow orb" }).click();
  452 | 
  453 |     const glowOrb = page.getByTestId("ticket-preview-template-glow-orb");
  454 |     await expect(glowOrb).toBeVisible();
  455 |     await expect(glowOrb).toHaveCSS("opacity", "0.3");
  456 |     await page.getByLabel("Object X %").fill("12");
  457 |     await page.getByLabel("Object scale").fill("1.4");
> 458 |     await page.getByLabel("Rotation °").fill("18");
      |                                         ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  459 |     await page.getByLabel("Template object colour hex").fill("#123456");
  460 |     await expect(glowOrb).toHaveCSS("background-color", "rgb(18, 52, 86)");
  461 |     await expect(glowOrb).toHaveCSS("transform", /matrix/);
  462 | 
  463 |     await objectsButton.click();
  464 |     await glowOrb.click();
  465 |     await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
  466 |     await expect(page.getByLabel("Object X %")).toHaveValue("12");
  467 | 
  468 |     await page.getByRole("button", { name: "Change" }).click();
  469 |     await page.getByPlaceholder("Search templates…").fill("Cybercore");
  470 |     await page.getByRole("button", { name: /use this template/i }).click();
  471 |     await expect(page.getByTestId("ticket-preview-template-glow-orb")).toHaveCount(0);
  472 | 
  473 |     await page.setViewportSize({ width: 390, height: 844 });
  474 |     await page.getByRole("button").filter({ hasText: /Template Objects/i }).click();
  475 |     await page.getByRole("button", { name: "Scan bar" }).click();
  476 |     const scanBar = page.getByTestId("ticket-preview-template-scan-bar");
  477 |     await expect(scanBar).toBeVisible();
  478 |     await page.getByLabel("Object Y %").fill("10");
  479 |     await page.getByLabel("Object scale").fill("1.2");
  480 |     await page.getByLabel("Rotation °").fill("-8");
  481 |     await page.getByLabel("Template object colour hex").fill("#ff00aa");
  482 |     await expect(scanBar).toHaveCSS("background-color", "rgb(255, 0, 170)");
  483 |     await expect(page.getByTestId("selected-template-object-properties")).toBeVisible();
  484 | 
  485 |     await expect.poll(() =>
  486 |       page.evaluate(() => JSON.parse(localStorage.getItem("tick3rt_create_event_draft") || "{}")
  487 |         .ticketDesign?.templateObjectsByTemplate?.cybercore?.["scan-bar"]?.rotation)
  488 |     ).toBe(-8);
  489 |   });
  490 | });
  491 | 
```