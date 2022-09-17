import { useHarkStore } from '../state/hark.js';
import { useState, useRef } from 'react';
import { api } from "../state/api";
import { useOutsideAlerter } from '../lib/hooks';
import { docketUninstall } from '@urbit/api';

export default function HeaderBar({ selectedWindow, windows, toggleMenu, toggleNotifs }) {
  const { unseen } = useHarkStore();
  const hasUnseen = Boolean(Object.keys(unseen).length);
  const [windowMenu, setWindowMenu] = useState(false);
  const windowMenuRef = useRef(null);
  useOutsideAlerter(windowMenuRef, () => setWindowMenu(false));

  return (
    <div className="text-white w-full bg-[rgba(0,0,0,0.5)] flex justify-between items-center h-9 px-4 cursor-default border-b border-[rgba(0,0,0,0.15)] z-[9999]">
      <p
        className="p-1 relative rounded-lg hover:bg-[rgba(255,255,255,0.1)]"
        onClick={() => setWindowMenu(!windowMenu)}
      >
        {selectedWindow.value?.[0]?.title || " "}
      </p>
      <div ref={windowMenuRef}>

        {windowMenu && (
          <div className="absolute top-10 left-1 w-full max-w-xs bg-white text-black rounded-xl p-4 flex flex-col space-y-2 shadow-sm shadow-[rgba(0,0,0,0.1)]">
            <a
              onClick={() => {
                windows.set(windows.value.filter((e) => e !== selectedWindow.value?.[0]));
                selectedWindow.set(selectedWindow.value.filter((e) => e !== selectedWindow.value?.[0]));
                setWindowMenu(false);
              }}
              className="block py-1 hover:bg-[rgba(0,0,0,0.1)]">Close app</a>
            <a
              onClick={() => {
                windows.set(windows.value.filter((e) => e !== selectedWindow.value?.[0]));
                selectedWindow.set(selectedWindow.value.filter((e) => e !== selectedWindow.value?.[0]));
                api.poke(docketUninstall(selectedWindow.value?.[0].desk));
                setWindowMenu(false);
              }}
              className="block py-1 hover:bg-[rgba(0,0,0,0.1)]">Uninstall app</a>
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <button
          id="hamburger-toggle"
          className="text-white flex-1 flex flex-column justify-center items-center"
          onClick={toggleMenu}>
          <svg width="15" height="13" className="icon inline">
            <use href="/icons.svg#hamburger" />
          </svg>
        </button>
        <button
          id="notifications-toggle"
          className={`text-white flex-1 flex flex-column justify-center items-center ${hasUnseen ? 'bg-rose-400' : ''}`}
          onClick={toggleNotifs}>
          <svg width="15" height="18" className="icon inline">
            <use href="/icons.svg#bell" />
          </svg>
        </button>
      </div>
    </div>
  )
}
