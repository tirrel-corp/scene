import Tippy from "@tippyjs/react";
import LaunchpadIcon from "./icons/launchpad";

export default function Dock({ windows, focusByCharge, launchOpen }) {
  return (
    <div
      id="dock"
      className="bg-[rgba(0,0,0,0.7)] backdrop-blur-sm text-white w-fit self-center items-center p-2 flex rounded-t-md shadow-sm shadow-[rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)] z-[1000]"
    >
      {windows.value.map((charge) => {
        return (
          <Tippy key={charge.title} content={charge.title}>
            <div
              className="h-14 w-14 rounded-xl overflow-hidden mx-2 cursor-pointer hover:brightness-110"
              style={{ backgroundColor: charge.color }}
              key={charge.title}
              onClick={() => {
                launchOpen.set(false);
                focusByCharge(charge);
              }}
            >
              {charge?.image && (
                <img className="h-14 w-14" src={charge.image} />
              )}
            </div>
          </Tippy>
        );
      })}
      <Tippy key="launch" content="Launchpad">
        <a
          className="cursor-pointer hover:brightness-110 px-[11px] py-[13px]"
          onClick={() => launchOpen.set(prev => !prev)}
        >
          <LaunchpadIcon />
        </a>
      </Tippy>
    </div>
  );
}
