import { useState, useReducer, useEffect } from 'react';
import { scryCharges } from '@urbit/api';
import { api } from './state/api';
import { useHarkStore } from './state/hark';
import { chargeSubscription } from './state/subscriptions';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import Notifications from './components/Notifications';
import chargeReducer from './state/charges';
import Launchpad from './components/Screen/Launchpad';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);
  const [launchOpen, setLaunchOpen] = useState(false);
  const [showNotifs, setShowNotifs] = useState(true);

  useEffect(() => {
    async function init() {
      const charges = (await api.scry(scryCharges));
      setApps(charges);
      chargeSubscription(setApps);
    }

    init();
  }, []);

  useEffect(() => {
    useHarkStore.getState().initialize(api);
  }, []);

  const focusByCharge = charge => {
    setWindows(prev => (!prev.includes(charge)
      ? [...prev, charge]
      : prev
    ));
    setSelectedWindow(prev => ([charge, ...prev.filter(i => i !== charge)]));
    setHiddenWindow(prev => prev.filter(i => i !== charge));
  }

  return (
    <div className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute">
      <HeaderBar
        selectedWindow={selectedWindow}
        toggleNotifs={() => setShowNotifs(a => !a)}
      />
      <Screen
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
      >
        {launchOpen && <Launchpad
          apps={apps}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          focusByCharge={focusByCharge}
        />}
      </Screen>
      <Notifications
        visible={showNotifs}
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
