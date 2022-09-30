import { Outlet, useNavigate } from "react-router";

const { ipcRenderer } = require("electron");

export default function Onboarding() {
    const navigate = useNavigate();
    ipcRenderer.on('deepLink', (event, url) => {
        console.log(url)
    })

    return <div className="h-screen w-screen bg-cover flex flex-col items-center justify-center" style={{ backgroundImage: "url('/moon.png')" }}>
        <Outlet />
    </div>;
}