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
- [x] open and drag windows
- [x] closable windows
- [ ] set selected window on focussing an iframe
- [ ] display notifications and set selected window based on notification source
- [ ] construct hosting onboarding flow
- [ ] store hosting flow url + code on disk
- [ ] boot to desktop from a hosted account

Stretch:

- [ ] Customisation (set bg img, colors)
- [ ] Dark mode