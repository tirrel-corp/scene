import { normalizeUrbitColor } from '../state/charges';
import Tippy from '@tippyjs/react';
import LaunchpadIcon from "./icons/launchpad"

export default function Dock({ windows, selectedWindow, hiddenWindow, launchOpen }) {
    return <div className="bg-[rgba(0,0,0,0.5)] text-white w-fit self-center items-center p-2 flex rounded-t-md shadow-sm shadow-[rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)]">
        {windows.value.map((charge) => {
            return <Tippy key={charge.title} content={charge.title}>
                <div
                    className="h-14 w-14 rounded-xl overflow-hidden mx-2 cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: normalizeUrbitColor(charge.color) }}
                    key={charge.title}
                    onClick={() => {
                        if (!windows.value.includes(charge)) {
                            windows.set([...windows.value, charge]);
                        }
                        selectedWindow.set([charge, ...selectedWindow.value.filter((e) => e !== charge)])
                        hiddenWindow.set(hiddenWindow.value.filter((e) => e !== charge))
                    }}
                >
                    {charge?.image && <img className="h-14 w-14" src={charge.image} />}
                </div>
            </Tippy>
        })}
        <Tippy key="launch" content="Launchpad">
            <a
                className="cursor-pointer hover:brightness-110"
                onClick={() => launchOpen.set(!launchOpen.value)}
            >
                <LaunchpadIcon />
            </a>
        </Tippy>
    </div>
}