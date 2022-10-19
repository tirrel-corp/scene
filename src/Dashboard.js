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
  }, [accountState.ships]);

  return (
    <div className="grow flex flex-col space-y-12 items-center justify-center antialiased font-inter">
      <div className="flex flex-col gap-4">
        {accountState?.ships?.patp && (<>
          <div className="spinner">
            <Sigil patp={accountState.ships.patp} color="#6184FF" />
          </div>
          <p>{accountState.ships.patp}</p>
        </>)}
        {accountState?.ships?.shipStatus !== 'running' && (
          <button disabled className="block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white text-xl text-center cursor-not-allowed">
            Getting Ready...
          </button>
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
