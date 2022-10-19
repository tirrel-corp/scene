import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router';
import Sigil from './components/sigil';
import { makeShipUrl } from './lib/utils';
const ipc = require('electron').ipcRenderer;

const Dashboard = props => {
  const { session, accountState, updateAccountState } = useOutletContext();

  const respawn = () => {
      window.localStorage.setItem("tirrel-desktop-auth", JSON.stringify({
          ship: accountState.ships.patp,
          url: makeShipUrl(accountState.ships.patp),
          code: accountState.ships.code,
      }));
      ipc.send('respawn');
  }

  // poll for updates every few seconds while ship is being booted
  useEffect(() => {
    // this is called ships, but currently only supports one ship, so it's an
    // object, not an array. current as of 19 oct '22
    const ships = accountState?.ships
    if (ships?.shipStatus === 'running') { return; }
    const shipStatusPoll = setInterval(() => updateAccountState(), 5000)
    return () => clearInterval(shipStatusPoll);
  }, [accountState?.ships]);

  return (
    <div className="grow flex flex-col space-y-12 items-center justify-center antialiased font-inter text-white">
      <div className="flex flex-col items-center gap-4">
        {accountState?.ships?.patp && (<>
          <div className={`overflow-hidden rounded-xl ${accountState?.ships?.shipStatus !== 'running' ? 'spinner' : ''}`}>
            <Sigil patp={accountState.ships.patp} color="#6184FF" />
          </div>
          <p className="mt-4 text-xl">{accountState.ships.patp}</p>
        </>)}
        {accountState?.ships?.shipStatus !== 'running' && (
          <div className="block rounded-lg px-8 py-4 bg-[rgba(217,217,217,0.2)] text-white text-center">
            <p>Getting your ship ready.</p>
            <p>This may take up to ten minutes.</p>
          </div>
        )}
        {accountState?.ships?.shipStatus === 'running' && (
          <button onClick={respawn} className="block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white text-xl text-center cursor-not-allowed">
            Launch
          </button>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
