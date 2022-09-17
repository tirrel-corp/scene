import { useNewAcctContext } from "./new";
import Sigil from "../sigil";
const ipc = require('electron').ipcRenderer;

export default function ConfirmScreen() {
    const { planet, credit } = useNewAcctContext();

    // Set our auth and respawn the app to instantiate the desktop
    const respawn = () => {
        window.localStorage.setItem("tirrel-desktop-auth", JSON.stringify({
            ship: '',
            url: '',
            code: ''
        }));
        ipc.send('respawn');
    }

    return <div className="grow flex justify-center items-center text-white">
        <div className="flex space-x-12">
            <div className="flex flex-col space-y-8 items-center">
                <p>Reserved for 15 minutes</p>
                <div className="rounded-xl overflow-hidden">
                    <Sigil patp={planet || "~zod"} color="#6184FF" />
                </div>
                <p>{planet}</p>
            </div>
            <div className="flex flex-col space-y-4">
                <h2 className="border-b-2 pb-2 border-[#6184FF]">Summary</h2>
                <div className="flex flex-col space-y-1">
                    <div className="flex justify-between">
                        <p>Planet</p>
                        <p>$25.00 USD</p>
                    </div>
                    <p>{planet || "~zod"}</p>
                    <p>Onboarding Session</p>
                    <p>Technical Support</p>
                </div>
                <div className="flex flex-col space-y-1">
                    <div className="flex justify-between">
                        <p>Hosting</p>
                        <p>$20.00 USD</p>
                    </div>
                    <p>Monthly renewal</p>
                </div>
                <div className="flex justify-between border-t-2 pt-2 border-[#6184FF]">
                    <p>Total</p>
                    <p>$45.00 USD</p>
                </div>
                <p>Card ending {credit?.ccNum?.slice(-4)} will be charged.</p>
                {/* On click -> grab ship details from API, then call respawn() */}
                <a className="mt-8 block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl text-center">Confirm and pay</a>
            </div>
        </div>
    </div>
}