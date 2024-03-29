import { useCallback, useState, useReducer, useEffect, createContext } from 'react';
import { useLoaderData } from 'react-router-dom';
import { scryCharges, scryAllies } from '@urbit/api';
import { chargeSubscription, allySubscription } from './state/subscriptions';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import Notifications from "./components/Notifications"
import useHarkState from "./state/hark";
import chargeReducer from './state/charges';
import allyReducer from "./state/allies";
import { treatyReducer } from './state/treaties';
import Launchpad from './components/Screen/Launchpad';
import Search from './components/Screen/Search';
import HamburgerMenu from './components/HamburgerMenu';
import PlanetMenu from './components/PlanetMenu';
import { setAuth } from './lib/auth';
import { setBackgroundImage, getColors } from './lib/background';
import { incomingLinkToWindow } from "./lib/window";
const { ipcRenderer } = require("electron");

export const ThemeContext = createContext();
export const WindowContext = createContext();


function App() {
  const { bg, pal, api } = useLoaderData();
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [allies, setAllies] = useReducer(allyReducer, {});
  const [treaties, setTreaties] = useReducer(treatyReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [showNativeNotifs, setShowNativeNotifs] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState();
  const [bgImage, setBgImage] = useState(bg);
  const [palette, setPalette] = useState(pal);

  // Initialize all subscriptions and scries
  useEffect(() => {
    async function init() {
      await api.connect();
      const charges = (await api.scry(scryCharges));
      const allies = (await api.scry(scryAllies));
      setApps(charges);
      setAllies(allies);
      chargeSubscription(setApps);
      allySubscription(setAllies);

      useHarkState.getState().start();
      const nativeNotifsSetting = window.localStorage.getItem('nativeNotifs');
      if (!!nativeNotifsSetting) {
        setShowNativeNotifs(JSON.parse(nativeNotifsSetting))
      } else {
        window.localStorage.setItem('nativeNotifs', JSON.stringify(true));
        setShowNativeNotifs(true);
      }

      window.scene.handleUpdateDownloaded(() => setUpdateAvailable(true));

    }
    init();
    migrateLocalStorageBg(setBgImage);
  }, []);

  // Derive theme engine palette again when background changes.
  useEffect(() => {
    async function refetchPalette() {
      const pal = await getColors(`${bgImage.startsWith('hallstatt') ? '' : 'file://'}${encodeURI(bgImage)}`);
      return setPalette(pal)
    }
    refetchPalette()
  }, [bgImage])

  useEffect(() => {
    const deepLinkListener = (event, url) => {
      const params = new URL(url).searchParams;
      if (!params.has('patp') || !params.has('code') || !params.has('url')) {
        // TODO alert if the url is malformed?
        return;
      }
      const newAuth = {
        code: params.get('code'),
        url: params.get('url'),
      }
      setAuth(newAuth);
    }
    ipcRenderer.on('deepLink', deepLinkListener);
    return () => ipcRenderer.removeListener('deepLink', deepLinkListener);
  }, []);

  // If a link inside one of our windows has target=_blank to another app, 
  // Electron's window handler will send it back here. We have a handler in this app
  // to then set our window state to change or spawn the window necessary.

  useEffect(() => {
    window.scene.linkToWindow = (link) => incomingLinkToWindow(link, {
      apps: {
        value: apps
      },
      windows: {
        set: setWindows,
        value: windows
      },
      selectedWindow: {
        set: setSelectedWindow,
        value: selectedWindow
      }
    })

  }, [apps, windows, setWindows, selectedWindow, setSelectedWindow])

  // Focus or spawn a window, shuffling our state
  // based on whether a notification or a tile is clicked related to the app.
  const focusByCharge = useCallback((charge, channel) => {
    const href = 'glob' in charge.chad
      ? {
        href: {
          glob: {
            base: channel
          }
        }
      }
      : {
        href: {
          site: channel
        }
      }
    const newCharge = channel ? { ...charge, ...href } : charge
    setWindows(prev => (!prev.some((win) => win.desk === charge.desk)
      ? [newCharge, ...prev]
      : [newCharge, ...prev.filter((e) => e.desk !== charge.desk)]
    ));
    setSelectedWindow(prev => ([newCharge, ...prev.filter(i => i.desk !== charge.desk)]));
    setHiddenWindow(prev => prev.filter(i => i !== charge));
  }, []);

  return (
    <ThemeContext.Provider value={palette}>
      <WindowContext.Provider value={{
        selectedWindow: {
          value: selectedWindow,
          set: setSelectedWindow
        },
        windows: {
          value: windows,
          set: setWindows
        },
        hiddenWindow: {
          value: hiddenWindow,
          set: setHiddenWindow
        },
        launchOpen: {
          value: launchOpen,
          set: setLaunchOpen
        }
      }}>
        <div
          className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute overflow-hidden"
          style={{
            backgroundImage: `url(${bgImage.startsWith('hallstatt') ? '' : 'file://'}${encodeURI(bgImage)})`,
            backgroundSize: 'cover',
          }}>
          <HeaderBar updateAvailable={updateAvailable}>
            <PlanetMenu updateAvailable={updateAvailable} />
            <HamburgerMenu
              setBgImage={setBgImage}
              nativeNotifs={{
                value: showNativeNotifs,
                set: next => {
                  setShowNativeNotifs(next);
                  window.localStorage.setItem('nativeNotifs', JSON.stringify(next))
                }
              }}
            />
            <Notifications
              charges={apps.charges}
              focusByCharge={focusByCharge}
            />
          </HeaderBar>
          <Screen>
            <Launchpad
              apps={apps}
              focusByCharge={focusByCharge}>
              <Search
                allies={{ value: allies, set: setAllies }}
                treaties={{ value: treaties, set: setTreaties }}
                apps={apps}
              />
            </Launchpad>
            <Dock apps={apps} />
          </Screen>
        </div>
      </WindowContext.Provider>
    </ThemeContext.Provider>
  );
}

// migrate to new bg state, remove after 0.1.13
function migrateLocalStorageBg(callback) {
  const storedbg = window.localStorage.getItem('tirrel-desktop-background');
  if (storedbg) {
    window.localStorage.removeItem('tirrel-desktop-background');
    return setBackgroundImage(storedbg, callback);
  }
}

export default App;
