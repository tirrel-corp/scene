import { normalizeUrbitColor } from '../state/charges';

export default function Dock({ apps, windows, setWindows, setSelectedWindow }) {
    return <div className="bg-[rgba(0,0,0,0.2)] text-white w-fit self-center p-2 flex rounded-xl mb-1">
        {Object.entries(apps?.charges || {}).map(([desk, charge]) => {
            return <div
                className="h-12 w-12 rounded-xl overflow-hidden mx-2 cursor-pointer hover:brightness-110"
                style={{ backgroundColor: normalizeUrbitColor(charge.color) }}
                key={desk}
                onClick={() => {
                    setWindows([...windows, charge]);
                    setSelectedWindow(charge)
                }}
            >
                {charge?.image && <img className="h-12 w-12" src={charge.image} />}
            </div>
        })}
    </div>
}