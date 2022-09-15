import { Rnd } from 'react-rnd';
import { useState } from 'react';
import cn from 'classnames';
import CloseIcon from '../icons/close';
import MinimizeIcon from '../icons/minimize';
import RefreshIcon from '../icons/refresh';

export const Window = ({ win, index, windows, selectedWindow, launchOpen, hiddenWindow }) => {
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
                <div className="pl-2 flex space-x-2 items-center">
                    <a
                        className="text-black cursor-pointer hover:opacity-80"
                        onClick={() => setKey(key + 1)}
                    >
                        <RefreshIcon />
                    </a>
                    <a
                        className="text-black cursor-pointer hover:opacity-80"
                        onClick={() => hiddenWindow.set([...hiddenWindow.value, win])}>
                        <MinimizeIcon />
                    </a>
                    <a
                        className="text-black bg-white overflow-hidden rounded-[100px] cursor-pointer hover:opacity-80"
                        onClick={() => {
                            windows.set(windows.value.filter((e) => e !== win));
                            selectedWindow.set(selectedWindow.value.filter((e) => e !== win))
                        }}
                    >
                        <CloseIcon />
                    </a>
                </div>
            </div>
            <div className="w-full h-full"
                onClickCapture={() => {
                    selectedWindow.set([win, ...selectedWindow.value.filter((e) => e !== win)]);
                }}
                onClick={() => launchOpen.set(false)}
            >
                <Frame
                    selectedWindow={selectedWindow}
                    win={win}
                    launchOpen={launchOpen}
                    href={href}
                    title={win.title}
                    keyName={key}
                />
            </div>
        </div>
    </Rnd>
}

const Frame = ({ selectedWindow, launchOpen, win, href, title, keyName }) => {
    return <iframe
        className={cn(
            "w-full h-full bg-white min-h-0",
            {
                "pointer-events-none": selectedWindow.value?.[0]?.title !== win.title || launchOpen.value === true
            })}
        src={href}
        title={title}
        key={keyName}
    />
}

export default Window;