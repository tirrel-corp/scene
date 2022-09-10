import { Rnd } from 'react-rnd';
import { useState } from 'react';
import cn from 'classnames';

export default function Screen({ windows, selectedWindow, hiddenWindow }) {
    return <div className="grow">
        {windows.value.map((win, index) => <Window
            key={win.title}
            win={win}
            index={index}
            windows={windows}
            selectedWindow={selectedWindow}
            hiddenWindow={hiddenWindow}
        />)
        }
    </div>
}

const Window = ({ win, index, windows, selectedWindow, hiddenWindow }) => {
    const [key, setKey] = useState(0);
    const href = 'glob' in win.chad ? `${process.env.REACT_APP_URL}/apps/${win.href.glob.base}` : `${process.env.REACT_APP_URL}${win.href.site}`;
    return <Rnd
        className="rounded-xl overflow-hidden shadow-md shadow-[rgba(0,0,0,0.1]"
        style={{
            zIndex: ([...selectedWindow.value].reverse().indexOf(win) + 1) * 10,
            visibility: hiddenWindow.value.includes(win) ? "hidden" : "visible"
        }}
        default={{
            x: (index + 1) * 100,
            y: (index + 1) * 100,
            width: 640,
            height: 480,
        }}
    >
        <div className="w-full h-full flex flex-col bg-[#cecece] cursor-default">
            <div
                className="h-8 bg-transparent text-white w-full flex justify-between items-center px-1"
                onMouseDown={() => selectedWindow.set([win, ...selectedWindow.value.filter((e) => e !== win)])}
            >
                <div className="flex space-x-2 items-center">
                    <a
                        className="text-black"
                        onClick={() => setKey(key + 1)}
                    >
                        refresh
                    </a>
                    <a
                        className="text-black"
                        onClick={() => hiddenWindow.set([...hiddenWindow.value, win])}>
                        _
                    </a>
                    <a
                        className="text-black"
                        onClick={() => windows.set(windows.value.filter((e) => e !== win))}
                    >
                        x
                    </a>
                </div>
            </div>
            <div className="w-full h-full"
                onClickCapture={() => selectedWindow.set([win, ...selectedWindow.value.filter((e) => e !== win)])}
            >
                <Frame selectedWindow={selectedWindow} win={win} href={href} title={win.title} keyName={key} />
            </div>
        </div>
    </Rnd>
}

const Frame = ({ selectedWindow, win, href, title, keyName }) => {
    return <iframe
        className={cn(
            "w-full h-full bg-white min-h-0",
            {
                "pointer-events-none": selectedWindow.value?.[0]?.title !== win.title
            })}
        src={href}
        title={title}
        key={keyName}
    />
}