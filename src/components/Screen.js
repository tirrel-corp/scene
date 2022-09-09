import { Rnd } from 'react-rnd';

export default function Screen({ windows, setWindows, selectedWindow, setSelectedWindow }) {
    return <div className="grow">
        {windows.map((win, index) => {
            const href = 'glob' in win.chad ? `${process.env.REACT_APP_URL}/apps/${win.href.glob.base}` : `${process.env.REACT_APP_URL}${win.href.site}`
            return <Rnd
                key={win.title}
                className="rounded-xl overflow-hidden"
                style={{
                    zIndex: win === selectedWindow ? 20 : index + 2
                }}
                default={{
                    x: (index + 1) * 100,
                    y: (index + 1) * 100,
                    width: 640,
                    height: 480,
                }}
                onClick={() => setSelectedWindow(win)}
            >
                <div className="w-full h-full p-2 flex flex-col bg-black cursor-default">
                    <div className="h-8 bg-black text-white w-full flex justify-between px-1"><p>{win.title}</p><a className="text-white" onClick={() => setWindows(windows.filter((e) => e !== win))}>x</a></div>
                    <iframe className="w-full h-full bg-white min-h-0" src={href} title={win.title} />
                </div>
            </Rnd>
        })}
    </div>
}