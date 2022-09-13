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
          hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
          windows={{ value: windows, set: setWindows }}
        />}
      </Screen>
      <Notifications
        visible={showNotifs}
        charges={apps.charges}
      />
      <Dock
        apps={apps}
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        launchOpen={{ value: launchOpen, set: setLaunchOpen }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
      />
    </div>
  );
}

export default App;
