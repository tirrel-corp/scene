import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useQuery } from "./lib/hooks";

const { ipcRenderer } = require("electron");

export default function Onboarding() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get("token");

    // We receive a "deepLink" event from electron.js when the OS sends us a scene:// link.
    // The scene:// link looks like `scene://?token=34232rfwefwefw` or etc.
    // We hand the ?token= param to the react-router as is, and navigate to it.
    useEffect(() => {
        ipcRenderer.on('deepLink', (event, url) => {
            navigate(url.slice(8));
        })
    }, [navigate]);

    // Because we are simultaneously listening to the token param in the useQuery() hook,
    // when it arrives, we can then instantiate the session.
    useEffect(() => {
        if (token) {
            //TODO instantiate session, get cookie
            console.log(token);
        }
    }, [token]);

    return <div className="h-screen w-screen bg-cover flex flex-col items-center justify-center" style={{ backgroundImage: "url('/moon.png')" }}>
        <Outlet />
    </div>;
}