import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import { useQuery } from "./lib/hooks";

const { ipcRenderer } = require("electron");

export default function Onboarding() {
    const navigate = useNavigate();
    const query = useQuery();
    const token = query.get("token");

    useEffect(() => {
        ipcRenderer.on('deepLink', (event, url) => {
            navigate(url.slice(8));
        })
    }, [navigate]);

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