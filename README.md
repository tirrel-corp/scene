# @tirrel-corp/desktop

## Development

```bash
cp .env.example .env ## set it to your ship and +code
npm i --force ## so that sigil-js installs
npm run dev ## spawns react + electron dev servers
```

## Distribution

```
npm run electron:package:mac
npm run electron:package:win
npm run electron:package:linux
```

## Debug builds

Debug builds let you pass any ship in, instead of just hosted ships. To create one, set `REACT_APP_DEBUG` to true in your .env file.

## Roadmap

- [x] dock
    - [x] tooltips over icons
- [x] open and drag windows
- [x] closable windows
- [x] status panel at top
- [x] minimizable windows
- [x] refreshable window contents
- [x] set selected window on focussing an iframe
- [x] only show open windows in the dock
- [x] clicking icon in dock focuses window, doesn't spawn another window
- [x] "Overview" for apps, searching for apps/treaties, installing apps, seeing app information, deleting apps
- [x] display notifications and set selected window based on notification source
- [ ] construct hosting onboarding flow
    - [x] should convey what they are buying
    - [x] should allow entering credit card to begin subscription
    - [ ] should allow for promo codes
    - [ ] should ask thirdearth api to spawn planet, transfer code to electron and login automatically
    - [x] store hosting flow url + code on disk
    - [x] boot to desktop from a hosted account


Stretch:

- [x] Resizable windows
- [x] Settings and customisation (set bg img, colors)
- [ ] See hosting details ("About" menu?)
- [ ] Dark mode