import cn from "classnames";
import LaunchpadTile from './LaunchpadTile';
import { useContext, useRef } from "react";
import { useOutsideAlerter } from "../../lib/hooks";
import { WindowContext } from "../../App";

export default function Launchpad({
  apps,
  children,
  focusByCharge,
}) {

  const { launchOpen } = useContext(WindowContext);

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, () => launchOpen.set(false));
  return (
    <div
      className={cn(
        "bg-[rgba(0,0,0,0.7)] shadow-md shadow-[rgba(0,0,0,0.1)] w-full h-full max-w-[1024px] max-h-[80vh] z-[1000] rounded-xl m-4 flex flex-col items-center justify-center backdrop-blur-sm transition-all ease-in-out p-6 grow",
        { "opacity-0 fade-in": launchOpen.value, invisible: !launchOpen.value }
      )}
      ref={wrapperRef}
    >
      {children}
      <div className="grow overflow-y-auto grid md:grid-cols-3 xl:grid-cols-4 gap-8">
        {Object.entries(apps?.charges || {})
          .sort((a, b) =>
            a[1].title.toLowerCase().localeCompare(b[1].title.toLowerCase())
          )
          .filter((e) => e[0] !== "garden")
          .map(([desk, charge]) => (
            <LaunchpadTile
              desk={desk}
              charge={charge}
              focusByCharge={focusByCharge}
              launchOpen={launchOpen}
              key={desk}
            />
          ))}
      </div>
    </div>
  );
}
