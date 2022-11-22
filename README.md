# @tirrel-corp/scene

[Install Scene Here](https://planet.one/scene/)

## Development

```bash
cp .env.example .env ## set it to your ship and +code
yarn install
# Make sure that you aren't already running Scene.
yarn dev ## spawns react + electron dev servers
```

## Distribution

```bash
npm run electron:package:mac
npm run electron:package:win
npm run electron:package:linux
```

The result will be in `./dist`, for example:

```bash
open ./dist/Scene-0.0.12-arm64.dmg
```

## Debug builds

Debug builds let you pass any ship in, instead of just hosted ships. To create one, set `REACT_APP_DEBUG` to true in your .env file.

