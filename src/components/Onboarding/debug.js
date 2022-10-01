import { useState } from 'react';

const ipc = require('electron').ipcRenderer;

export default function DebugMenu() {
    const [ship, setShip] = useState('');
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');

    const respawn = () => {
        window.localStorage.setItem("tirrel-desktop-auth", JSON.stringify({
            ship,
            url,
            code
        }));
        ipc.send('respawn');
    }
    return <div className="flex flex-col space-y-4 text-white">
        <p>To enter your own ship into storage for desktop usage, enter the following details.</p>
        <p>Ship name</p>
        <input type="text" className="bg-transparent border-b p-2" placeholder="haddef-sigwen" value={ship} onChange={(e) => setShip(e.target.value)} />
        <p>URL</p>
        <input type="text" className="bg-transparent border-b p-2" placeholder="https://haddef-sigwen.arvo.network" value={url} onChange={(e) => setUrl(e.target.value)} />
        <p>+code</p>
        <input type="text" className="bg-transparent border-b p-2" placeholder="nicetry-feds-sampel-harlet" value={code} onChange={(e) => setCode(e.target.value)} />
        <button onClick={() => respawn()}>Set</button>
    </div>
}