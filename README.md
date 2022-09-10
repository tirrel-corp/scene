# @tirrel-corp/desktop

## Development

```bash
cp .env.example .env ## set it to your ship and +code
npm i
npm run dev ## spawns react + electron dev servers
```

## Distribution

```
npm run electron:package:mac
npm run electron:package:win
npm run electron:package:linux
```

## Roadmap

- [x] dock
    - [x] tooltips over icons
- [x] open and drag windows
- [x] closable windows
- [x] status panel at top
- [x] minimizable windows
- [ ] refreshable window contents
- [ ] set selected window on focussing an iframe
- [ ] only show open windows in the dock
- [x] clicking icon in dock focuses window, doesn't spawn another window
- [ ] "Overview" for apps, searching for apps/treaties, installing apps, seeing app information, deleting apps
- [ ] display notifications and set selected window based on notification source
- [ ] construct hosting onboarding flow
    - [ ] should convey what they are buying
    - [ ] should allow entering credit card to begin subscription
    - [ ] should allow for promo codes
    - [ ] should ask thirdearth api to spawn planet, transfer code to electron and login automatically
    - [ ] store hosting flow url + code on disk
    - [ ] boot to desktop from a hosted account


Stretch:

- [x] Resizable windows
- [ ] Settings and customisation (set bg img, colors)
- [ ] See hosting details ("About" menu?)
- [ ] Dark mode