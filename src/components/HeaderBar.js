import { useHarkStore } from '../state/hark.js';

export default function HeaderBar({ selectedWindow, toggleNotifs }) {
  const { unseen } = useHarkStore();
  const hasUnseen = Boolean(Object.keys(unseen).length);

    return (
    <div className="text-white w-full bg-[rgba(0,0,0,0.5)] flex justify-between items-center h-9 px-4 cursor-default border-b border-[rgba(0,0,0,0.15)] z-[9999]">
      <p className="p-1 rounded-lg hover:bg-[rgba(255,255,255,0.1)]">{selectedWindow?.[0]?.title || " "}</p>
      <button
        id="notifications-toggle"
        className={`text-white flex ${hasUnseen ? 'bg-rose-400' : ''}`}
        onClick={toggleNotifs}>
        <svg width="15" height="18" className="icon inline">
          <use href="/icons.svg#bell" />
        </svg>
      </button>
    </div>
  )
}
