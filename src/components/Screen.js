import Window from './Screen/Window';

export default function Screen({ windows, selectedWindow, hiddenWindow, children }) {
    return <div className="grow">
        {children}
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