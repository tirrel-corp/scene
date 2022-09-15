import { useState, useReducer, useEffect } from 'react';
import { scryCharges, scryAllies } from '@urbit/api';
import { api } from './state/api';
import { chargeSubscription, allySubscription } from './state/subscriptions';
import HeaderBar from './components/HeaderBar';
import Screen from './components/Screen';
import Dock from './components/Dock';
import chargeReducer from './state/charges';
import allyReducer from "./state/allies";
import { treatyReducer } from './state/treaties';
import Launchpad from './components/Screen/Launchpad';
import Search from './components/Screen/Search';

function App() {
  const [apps, setApps] = useReducer(chargeReducer, {});
  const [allies, setAllies] = useReducer(allyReducer, {});
  const [treaties, setTreaties] = useReducer(treatyReducer, {});
  const [windows, setWindows] = useState([]);
  const [hiddenWindow, setHiddenWindow] = useState([]);
  const [selectedWindow, setSelectedWindow] = useState([]);
  const [launchOpen, setLaunchOpen] = useState(false);

  useEffect(() => {
    async function init() {
      const charges = (await api.scry(scryCharges));
      const allies = (await api.scry(scryAllies));
      setApps(charges);
      setAllies(allies);
      chargeSubscription(setApps);
      allySubscription(setAllies);
    }

    init();
  }, []);

  return (
    <div className="bg-[#e4e4e4] h-screen w-screen flex flex-col absolute" style={{ backgroundImage: "url('https://s3.us-east-1.amazonaws.com/haddefsigwen1/haddef-sigwen/2021.1.22..17.43.27-AA5EB02C-2559-47F1-9869-85867A42336F.jpeg')", backgroundSize: 'cover' }}>
      <HeaderBar selectedWindow={selectedWindow} />
      <Screen
        hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
        selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
        launchOpen={{ value: launchOpen, set: setLaunchOpen }}
        windows={{ value: windows, set: setWindows }}
      >
        {launchOpen && <Launchpad
          apps={apps}
          hiddenWindow={{ value: hiddenWindow, set: setHiddenWindow }}
          launchOpen={{ value: launchOpen, set: setLaunchOpen }}
          selectedWindow={{ value: selectedWindow, set: setSelectedWindow }}
          windows={{ value: windows, set: setWindows }}
        >
          <Search
            allies={{ value: allies, set: setAllies }}
            treaties={{ value: treaties, set: setTreaties }}
          />
        </Launchpad>}
      </Screen>
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
