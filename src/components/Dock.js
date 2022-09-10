import { normalizeUrbitColor } from '../state/charges';
import Tippy from '@tippyjs/react';

export default function Dock({ apps, windows, setWindows, selectedWindow, setSelectedWindow }) {
    return <div className="bg-[rgba(0,0,0,0.2)] text-white w-fit self-center p-2 flex rounded-xl mb-1">
        {Object.entries(apps?.charges || {}).map(([desk, charge]) => {
            return <Tippy key={desk} content={charge.title}>
                <div
                    className="h-12 w-12 rounded-xl overflow-hidden mx-2 cursor-pointer hover:brightness-110"
                    style={{ backgroundColor: normalizeUrbitColor(charge.color) }}
                    key={desk}
                    onClick={() => {
                        setWindows([...windows, charge]);
                        setSelectedWindow([charge, ...selectedWindow.filter((e) => e !== charge)])
                    }}
                >
                    {charge?.image && <img className="h-12 w-12" src={charge.image} />}
                </div>
            </Tippy>
        })}
    </div>
}