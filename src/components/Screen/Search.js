import { allyShip, deSig, docketInstall } from '@urbit/api';
import { useEffect, useState } from 'react';
import ob from 'urbit-ob';
import { api } from '../../state/api';
import { getTreaties } from "../../state/treaties";

export default function Search({ allies, treaties, apps }) {
    const [query, setQuery] = useState("");
    const [promptOpen, setPromptOpen] = useState(false);
    const [currentApp, setCurrentApp] = useState({});
    const siggedAlly = `~${deSig(query)}`;

    // useEffect(() => {
    //     if (allies.value?.[siggedAlly]?.length > 0 && !treaties?.[allies.value?.[siggedAlly][0]]) {
    //         searchFetch(treaties, getTreaties(siggedAlly));
    //     }
    // }, [allies, siggedAlly, treaties]);

    return <div className="relative w-full max-w-md flex items-center justify-center"><input
        type="text"
        placeholder="Search for providers..."
        className="rounded-xl my-4 py-1 px-2 bg-[rgba(0,0,0,0.1)] text-white"
        autoCorrect={"false"}
        onFocus={() => setPromptOpen(true)}
        onBlur={() => {
            if (query === "") {
                setPromptOpen(false);
            }
        }}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                if (ob.isValidPatp(siggedAlly)) {
                    if (allies.value?.[siggedAlly]) {
                        searchFetch(treaties, getTreaties(siggedAlly));
                    } else {
                        api.poke(allyShip(siggedAlly)).then(() => {
                            setTimeout(() => {
                                searchFetch(treaties, getTreaties(siggedAlly));
                            }, 5000)
                        });
                    }
                }
            }
        }}
        value={query}
    />
        {promptOpen && <Prompt
            allies={allies}
            apps={apps}
            siggedAlly={siggedAlly}
            treaties={treaties}
            setPromptOpen={setPromptOpen}
            currentApp={{ value: currentApp, set: setCurrentApp }}
            query={query}
        />}
    </div >
}

const Prompt = ({ allies, apps, siggedAlly, treaties, setPromptOpen, currentApp, query }) => {
    return <div className="bg-black text-white absolute top-14 self-center w-full rounded-xl shadow-md shadow-[rgba(0,0,0,0.1)] p-4 flex justify-center items-center min-h-[200px] max-h-[500px] overflow-y-auto">
        {query === ""
            ? <p className=" text-xs p-4">Please enter a valid <code>@p</code> to search for applications.</p>
            : <div className='flex flex-col space-y-2 w-full min-h-0 h-full self-start'>
                {currentApp.value?.desk && <AppInfo apps={apps} currentApp={currentApp} setPromptOpen={setPromptOpen} />}
                {!currentApp.value?.desk && ob.isValidPatp(siggedAlly) && Object.values(allies.value?.[siggedAlly] || {})?.map((charge) => {
                    if (treaties.value?.[charge]) {
                        const app = treaties?.value?.[charge];
                        return <div
                            className="p-2 hover:bg-[rgba(255,255,255,0.1)] rounded-xl flex justify-between w-full items-center cursor-pointer"
                            key={app.desk}
                            onClick={() => {
                                setPromptOpen(true);
                                currentApp.set(app);
                            }}>
                            <div className='flex space-x-4'>
                                <div
                                    className="h-14 w-14 rounded-xl overflow-hidden mx-2"
                                    style={{ backgroundColor: app.color }}
                                    key={app.title}
                                >
                                    {app?.image?.startsWith("http")
                                        ? <img className="h-14 w-14" src={app.image} />
                                        : null}
                                </div>
                                <div className="flex flex-col space-y-1">
                                    <p>{app.title || app.desk}</p>
                                    {app.info !== '' && <p className="truncate w-full">{app.info}</p>}
                                </div>
                            </div>
                        </div>
                    } else return null
                })}
            </div>}
    </div>
}

const AppInfo = ({ currentApp, apps, setPromptOpen }) => {
    const app = currentApp.value;
    return <div className="min-h-0 min-w-0 w-full h-full flex flex-col space-y-2">
        <a
            className="cursor-pointer font-bold"
            onClick={() => currentApp.set({})}
        >
            ← Back
        </a>
        <div className="flex items-center space-x-4 p-2">
            <div
                className="h-16 w-16 rounded-xl overflow-hidden mx-2"
                style={{ backgroundColor: app.color }}
                key={app.title}
            >
                {app?.image?.startsWith("http")
                    ? <img className="h-16 w-16" src={app.image} />
                    : null}
            </div>
            <div className='flex flex-col space-y-1'>
                <p>{app.title || app.desk}</p>
                {app.info !== '' && <p className="truncate w-full">{app.info}</p>}
            </div>
        </div>
        {!apps.charges?.[app.desk] && <button
            className="bg-blue-500 text-white"
            onClick={() => {
                api.poke(docketInstall(app.ship, app.desk))
                setPromptOpen(false)
            }}
        >
            Install app
        </button>}
        <div className="flex justify-between">
            <p className="font-bold">Version</p>
            <p>{app.version}</p>
        </div>
        <div className="flex justify-between">
            <p className="font-bold">Latest hash</p>
            <p className="font-mono">{app.hash.split(".").slice(-1)}</p>
        </div>
        <div className="flex justify-between">
            <p className="font-bold">License</p>
            <p>{app.license}</p>
        </div>
        <div className="flex justify-between">
            <p className="font-bold">Host</p>
            <p className="font-mono">{app.ship}</p>
        </div>
        <div className="flex justify-between">
            <p className="font-bold">Website</p>
            <a className="min-w-0 truncate block border-b" href={app.website} target="_blank">{app.website}</a>
        </div>
    </div>
}

async function searchFetch(reducer, action) {
    const fetchedItem = await action;
    return reducer.set(fetchedItem)
}
