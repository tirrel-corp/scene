import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { tirrelServer } from "./lib/constants";

const { ipcRenderer } = require("electron");

const SID_KEY = 'scene__session-id';

const getAccountState = () =>
    fetch(`${tirrelServer}/third/details`, {
        method: 'GET',
        credentials: 'include',
    }).then(res => res.json())

export default function Onboarding() {
    const navigate = useNavigate();

    const auth = useLoaderData();
    useEffect(() => {
        if (auth.ship) {
            navigate("/app")
        }
    }, [auth.ship])

    const [query, setQuery] = useSearchParams();
    const token = query.get("token");
    useEffect(() => {
        const dl_ship = query.get("patp");
        const dl_code = query.get("code");
        const dl_url = query.get("url");
        if (!auth?.ship && !!dl_ship && !!dl_code && !!dl_url) {
            const auth = {
                ship: dl_ship.replace('~', ''),
                code: dl_code,
                url: `https://${dl_url}`
            };
            window.localStorage.setItem('tirrel-desktop-auth', JSON.stringify(auth));
            window.location.reload();
        }
    }, [auth, query]);

    const [session, setSession] = useState({
        stage: undefined,
        id: window.sessionStorage.getItem(SID_KEY) || undefined,
    });
    const [accountState, setAccountState] = useState();

    const updateAccountState = useCallback(() =>
        getAccountState().then(res => setAccountState(res)),
    [setAccountState])

    // We receive a "deepLink" event from electron.js when the OS sends us a scene:// link.
    // The scene:// link looks like `scene://?token=34232rfwefwefw` or etc.
    // We hand the ?token= param to the react-router as is, and navigate to it.
    useEffect(() => {
        ipcRenderer.once('deepLink', (event, url) => {
            navigate(url.slice(8));
        })
    }, [navigate]);

    // store session id in sessionStorage in case things get out of hand
    useEffect(() => {
        const prev = window.sessionStorage.getItem(SID_KEY);
        if (!prev && !!session?.id) {
            window.sessionStorage.setItem(SID_KEY, session.id);
        }
    }, [session?.id]);

    // Because we are simultaneously listening to the token param in the useQuery() hook,
    // when it arrives, we can then instantiate the session.
    useEffect(() => {
        if (!token) { return; }
        if (session?.id) { return; }
        if (session?.stage === 'logged in') { return; }
        console.log('token submit');
        // dispatch the token from the email; the response sets the auth cookie
        fetch(`${tirrelServer}/third/session/${session.id || ""}`, {
            method: 'POST',
            headers: {
                'Content-type': 'text/json',
                'action': 'login',
            },
            credentials: 'include',
            body: atob(token),
        }).then(res => res.json())
        .then(res => setSession(p => ({...p, stage: res.grate})))
        // make another request to /third/session/ with the auth cookie, this
        // will yield our sesision id
        .then(() => fetch(`${tirrelServer}/third/session/`, {
            method: 'GET',
            credentials: 'include',
        })).then(res => res.json())
        .then(res => setSession(p => ({...p, id: res.session })))

    }, [session.id, session.stage, token]);

    // fetch account details once session id is available
    useEffect(() => {
        if (!session?.id) { return; }
        updateAccountState();
    }, [session?.id]);

    // if no ships are attached to the account, start the new account flow
    useEffect(() => {
        if (!session?.id) { return; }
        if (!!accountState?.ships?.length) {
            navigate("/dashboard");
            return;
        }
        navigate("/new");
    }, [session?.id, accountState?.ships]);

    return (
    <div className="h-screen w-screen bg-cover flex flex-col items-center justify-center bg-[#2c2c2c]">
        <Outlet context={{
            session,
            setSession,
            accountState,
            updateAccountState,
        }} />
    </div>
    );
}

export const useSessionContext = useOutletContext;
