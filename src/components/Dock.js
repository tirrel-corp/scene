import { normalizeUrbitColor } from '../state/charges';
import Tippy from '@tippyjs/react';

export default function Dock({ apps, windows, selectedWindow, hiddenWindow }) {
    return <div className="bg-[rgba(0,0,0,0.1)] text-white w-fit self-center p-2 flex rounded-t-md shadow-sm shadow-[rgba(0,0,0,0.15)] border border-[rgba(0,0,0,0.15)]">
        {Object.entries(apps?.charges || {}).map(([desk, charge]) => {
            return <Tippy key={desk} content={charge.title}>
                <div
                    className="h-14 w-14 rounded-xl overflow-hidden mx-2 cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: normalizeUrbitColor(charge.color) }}
                    key={desk}
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
    </div>
}