import { useCallback, useState, useReducer, useEffect } from 'react';
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

const { ipcRenderer } = require("electron");

function App() {
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

  useClickOutside(
    ['launchpad', 'dock'],
    () => setLaunchOpen(false)
  );
  useClickOutside(
    ['notifications', 'notifications-toggle'],
    () => setShowNotifs(false)
  );
  useClickOutside(
    ['hamburger', 'hamburger-toggle'],
    () => setShowHamburger(false)
  );
  useClickOutside(
    ['planet-menu', 'planet-menu-toggle'],
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

  const bgImage = window.localStorage.getItem('tirrel-desktop-background');

  return (
    <div
      className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute overflow-hidden"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : "url('hallstatt.jpg')",
        backgroundSize: 'cover',
      }}>
      <HeaderBar
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
        toggleNotifs={() => setShowNotifs(a => !a)}
        toggleHamburger={() => setShowHamburger(a => !a)}
        togglePlanetMenu={() => setShowPlanetMenu(a => !a)}
        updateAvailable={updateAvailable}
      />
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
      <PlanetMenu
        visible={{ value: showPlanetMenu, set: setShowPlanetMenu }}
        updateAvailable={updateAvailable}
        appVersion={appVersion}
      />
      <HamburgerMenu
        visible={{ value: showHamburger, set: setShowHamburger }}
        nativeNotifs={{
          value: showNativeNotifs,
          set: next => {
            setShowNativeNotifs(next);
            window.localStorage.setItem('nativeNotifs', JSON.stringify(next));
          },
        }}
      />
      <Notifications
        visible={{ value: showNotifs, set: setShowNotifs }}
        charges={apps.charges}
        focusByCharge={focusByCharge}
      />
    </div>
  );
}

export default App;
