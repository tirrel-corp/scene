import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate, useOutletContext } from "react-router";
import { useLoaderData, useSearchParams } from "react-router-dom";
import { tirrelServer } from "./lib/constants";
import { setAuth } from "./lib/auth";

const { ipcRenderer } = require("electron");

const SID_KEY = 'scene__session-id';

const getAccountState = () =>
    fetch(`${tirrelServer}/third/details`, {
        method: 'GET',
        credentials: 'include',
    }).then(res => res.json())

export default function Onboarding() {
    const navigate = useNavigate();

    const { auth } = useLoaderData();
    useEffect(() => {
        if (auth?.url) {
            navigate("/app")
        }
    }, [auth?.url])

    const [query, setQuery] = useSearchParams();
    const token = query.get("token");
    useEffect(() => {
        const dl_code = query.get("code");
        const dl_url = query.get("url");
        if (!!dl_code && !!dl_url) {
            setAuth({
                code: dl_code,
                url: dl_url,
            });
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
        const deepLinkListener = (event, url) => {
            navigate(url.slice(8));
        }
        ipcRenderer.on('deepLink', deepLinkListener);
        return () => ipcRenderer.removeListener('deepLink', deepLinkListener);
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
            .then(res => setSession(p => ({ ...p, stage: res.grate })))
            // make another request to /third/session/ with the auth cookie, this
            // will yield our sesision id
            .then(() => fetch(`${tirrelServer}/third/session/`, {
                method: 'GET',
                credentials: 'include',
            })).then(res => res.json())
            .then(res => setSession(p => ({ ...p, id: res.session })))

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
        <div className="h-screen w-screen bg-cover flex justify-start items-center font-inter antialiased"
            style={{
                backgroundColor: 'black',
                backgroundImage: "linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('tirrel-mark.svg'), url('scene-large-stroke.svg')",
                backgroundSize: 'cover, auto, calc(max(25vw, 340px))',
                backgroundPosition: 'center, bottom 2vh center, center',
                backgroundRepeat: 'no-repeat',
            }}
        >
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
