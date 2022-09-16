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
import { useClickOutside } from './lib/hooks';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [allies, setAllies] = useReducer(allyReducer, {});
  const [treaties, setTreaties] = useReducer(treatyReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    async function init() {
      const charges = (await api.scry(scryCharges));
      const allies = (await api.scry(scryAllies));
      setApps(charges);
      setAllies(allies);
      chargeSubscription(setApps);
      allySubscription(setAllies);

      useHarkStore.getState().initialize(api);
    }

    init();
  }, []);

  useClickOutside([
    { current: document.getElementById('notifications') },
    { current: document.getElementById('notifications-toggle') },
  ], () => setShowNotifs(false));
  useClickOutside([
    { current: document.getElementById('hamburger') },
    { current: document.getElementById('hamburger-toggle') },
  ], () => setShowMenu(false));

  const focusByCharge = useCallback(charge => {
    setWindows(prev => (!prev.includes(charge)
      ? [...prev, charge]
      : prev
    ));
    setSelectedWindow(prev => ([charge, ...prev.filter(i => i !== charge)]));
    setHiddenWindow(prev => prev.filter(i => i !== charge));
  }, [setWindows, setSelectedWindow, setHiddenWindow]);

  return (
    <div className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute" style={{ backgroundImage: "url('https://s3.us-east-1.amazonaws.com/haddefsigwen1/haddef-sigwen/2021.1.22..17.43.27-AA5EB02C-2559-47F1-9869-85867A42336F.jpeg')", backgroundSize: 'cover' }}>
      <HeaderBar
        selectedWindow={selectedWindow}
        toggleNotifs={() => setShowNotifs(a => !a)}
        toggleMenu={() => setShowMenu(a => !a)}
      />
      <Screen
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        launchOpen={{ value: launchOpen, set: setLaunchOpen }}
        windows={{ value: windows, set: setWindows }}
      >
        {launchOpen && <Launchpad
          apps={apps}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          focusByCharge={focusByCharge}>
          <Search
            allies={{ value: allies, set: setAllies }}
            treaties={{ value: treaties, set: setTreaties }}
            apps={apps}
          />
        </Launchpad>}
      </Screen>
      <HamburgerMenu
        visible={{ value: showMenu, set: setShowMenu }}
      />
      <Notifications
        visible={{ value: showNotifs, set: setShowNotifs }}
        charges={apps.charges}
        focusByCharge={focusByCharge}
      />
      <Dock
        apps={apps}
        launchOpen={{ value: launchOpen, set: setLaunchOpen }}
        windows={{ value: windows, set: setWindows }}
        focusByCharge={focusByCharge}
      />
    </div>
  );
}

export default App;
