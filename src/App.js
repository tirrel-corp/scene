import { useState, useReducer, useEffect } from 'react';
import { scryCharges } from '@urbit/api';
import { api } from './state/api';
import HeaderBar from './components/HeaderBar';
import { chargeReducer } from './state/charges';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [windows, setWindows] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState({});

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
    <div className="bg-gray-300 h-screen w-screen flex flex-col">
      <HeaderBar />
    </div>
  );
}

export default App;
