import { useState, useReducer, useEffect } from 'react';
import { scryCharges } from '@urbit/api';
import { api } from './state/api';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import chargeReducer from './state/charges';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);

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
    <div className="bg-[#e4e4e4] h-screen w-screen flex flex-col">
      <HeaderBar selectedWindow={selectedWindow} />
      <Screen
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
      />
      <Dock
        apps={apps}
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        windows={{ value: windows, set: setWindows }}
      />
    </div>
  );
}

export default App;
