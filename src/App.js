import { useState, useEffect } from 'react';
import { scryCharges } from '@urbit/api';
import { api } from './state/api';

function App() {
  const [apps, setApps] = useState([]);
  const [windows, setWindows] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState({});

  useEffect(() => {
    async function init() {
      const charges = (await api.scry(scryCharges)).initial;
      setApps(charges);
    }

    init();
  }, []);

  return (
    <div className="bg-gray-300 h-screen w-screen flex flex-col p-2">
      <div className="w-full h-8 bg-black opacity-90 rounded-lg">
        <a href="https://urbit.org" target="_blank">link</a>
      </div>
    </div>
  );
}

export default App;
