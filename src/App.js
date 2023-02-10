import { useCallback, useState, useReducer, useEffect, useRef } from 'react';
import { useLoaderData } from 'react-router-dom';
import { scryCharges, scryAllies } from '@urbit/api';
import { api } from './state/api';
import { useHarkStore } from './state/hark';
import { chargeSubscription, allySubscription } from './state/subscriptions';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import Notifications from './components/Notifications';
import chargeReducer from './state/charges';
import allyReducer from "./state/allies";
import { treatyReducer } from './state/treaties';
import Launchpad from './components/Screen/Launchpad';
import Search from './components/Screen/Search';
import HamburgerMenu from './components/HamburgerMenu';
import PlanetMenu from './components/PlanetMenu';
import { useClickOutside } from './lib/hooks';
import { setAuth } from './lib/auth';
import { setBackgroundImage } from './lib/background';
import { incomingLinkToWindow } from "./lib/window";
const { ipcRenderer } = require("electron");

function App() {
  const { bg } = useLoaderData();
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [allies, setAllies] = useReducer(allyReducer, {});
  const [treaties, setTreaties] = useReducer(treatyReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showNativeNotifs, setShowNativeNotifs] = useState(false);
  const [showHamburger, setShowHamburger] = useState(false);
  const [showPlanetMenu, setShowPlanetMenu] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState();
  const [appVersion, setAppVersion] = useState();
  const [bgImage, setBgImage] = useState(bg);

  useEffect(() => {
    async function init() {
      await api.connect();
      const charges = (await api.scry(scryCharges));
      const allies = (await api.scry(scryAllies));
      setApps(charges);
      setAllies(allies);
      chargeSubscription(setApps);
      allySubscription(setAllies);

      useHarkStore.getState().initialize(api);

      const nativeNotifsSetting = window.localStorage.getItem('nativeNotifs');
      if (!!nativeNotifsSetting) {
        setShowNativeNotifs(JSON.parse(nativeNotifsSetting))
      } else {
        window.localStorage.setItem('nativeNotifs', JSON.stringify(true));
        setShowNativeNotifs(true);
      }

      window.scene.handleUpdateDownloaded(() => setUpdateAvailable(true));

      const version = await window.scene.queryVersion();
      setAppVersion(version);
    }

    init();
    migrateLocalStorageBg(setBgImage);
  }, []);

  useEffect(() => {
    const deepLinkListener = (event, url) => {
      const params = new URL(url).searchParams;
      if (!params.has('patp') || !params.has('code') || !params.has('url')) {
        // TODO alert if the url is malformed?
        return;
      }
      const newAuth = {
        ship: params.get('patp'),
        code: params.get('code'),
        url: params.get('url'),
      }
      setAuth(newAuth);
    }
    ipcRenderer.on('deepLink', deepLinkListener);
    return () => ipcRenderer.removeListener('deepLink', deepLinkListener);
  }, []);

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

  useClickOutside([
    { current: document.getElementById('notifications') },
    { current: document.getElementById('notifications-toggle') },
  ], () => setShowNotifs(false));
  useClickOutside([
    { current: document.getElementById('hamburger') },
    { current: document.getElementById('hamburger-toggle') },
  ], () => setShowHamburger(false));
  useClickOutside(
    [
      { current: document.getElementById('planet-menu') },
      { current: document.getElementById('planet-menu-toggle') },
    ],
    () => setShowPlanetMenu(false)
  );

  const focusByCharge = useCallback(charge => {
    setWindows(prev => (!prev.includes(charge)
      ? [...prev, charge]
      : prev
    ));
    setSelectedWindow(prev => ([charge, ...prev.filter(i => i !== charge)]));
    setHiddenWindow(prev => prev.filter(i => i !== charge));
  }, []);

  return (
    <div
      className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute overflow-hidden"
      style={{
        backgroundImage: `url(${bgImage.startsWith('hallstatt') ? '' : 'file://'}${encodeURI(bgImage)})`,
        backgroundSize: 'cover',
      }}>
      <HeaderBar
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
        toggleNotifs={() => setShowNotifs(a => !a)}
        toggleHamburger={() => setShowHamburger(a => !a)}
        togglePlanetMenu={() => setShowPlanetMenu(a => !a)}
        updateAvailable={updateAvailable}
      >
        <PlanetMenu
          visible={{ value: showPlanetMenu, set: setShowPlanetMenu }}
          updateAvailable={updateAvailable}
          appVersion={appVersion}
      />
        <HamburgerMenu
          visible={{ value: showHamburger, set: setShowHamburger }}
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
          visible={{ value: showNotifs, set: setShowNotifs }}
          charges={apps.charges}
          focusByCharge={focusByCharge}
        />
      </HeaderBar>
      <Screen
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        launchOpen={{ value: launchOpen, set: setLaunchOpen }}
        windows={{ value: windows, set: setWindows }}
      >
        <Launchpad
          apps={apps}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          focusByCharge={focusByCharge}>
          <Search
            allies={{ value: allies, set: setAllies }}
            treaties={{ value: treaties, set: setTreaties }}
            apps={apps}
          />
        </Launchpad>
        <Dock
          apps={apps}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          windows={{ value: windows, set: setWindows }}
          focusByCharge={focusByCharge}
        />
      </Screen>
    </div>
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
