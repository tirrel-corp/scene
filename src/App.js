import { useState, useReducer, useEffect } from 'react';
import { scryCharges } from '@urbit/api';
import { api } from './state/api';
import { useHarkStore } from './state/hark';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import Notifications from './components/Notifications';
import chargeReducer from './state/charges';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [windows, setWindows] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState({});
  const [showNotifs, setShowNotifs] = useState(false);

  const harkStore = useHarkStore();
  const { seen, unseen } = harkStore;
  useEffect(() => {
    harkStore.initialize(api);
  }, []);

  useEffect(() => {
    async function init() {
      const charges = (await api.scry(scryCharges));
      setApps(charges);

      api.subscribe({
        app: 'docket',
        path: '/charges',
        event: (data) => setApps(data)
      });
    }

    init();
  }, []);

  return (
    <div className="bg-gray-300 h-screen w-screen flex flex-col relative">
      <HeaderBar
        selectedWindow={selectedWindow}
        toggleNotifs={() => setShowNotifs(p => !p)}
      />
      <Screen
        selectedWindow={selectedWindow}
        setSelectedWindow={setSelectedWindow}
        windows={windows}
        setWindows={setWindows}
      />
      <Notifications visible={showNotifs} />
      <Dock apps={apps} windows={windows} setWindows={setWindows} setSelectedWindow={setSelectedWindow} />
    </div>
  );
}

export default App;
