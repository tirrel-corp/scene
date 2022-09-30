import { useState } from "react";
import { Link } from "react-router-dom";
import { tirrelServer } from "../../lib/constants";
import { useSessionContext } from "../../Onboarding";

export default function Welcome() {
    const [email, setEmail] = useState("");
    const [sent, setSent] = useState(false);
    const { session, setSession } = useSessionContext();

    const sendEmail = () => {
        setSent(true);
        console.log('submitEmail');
        fetch(`${tirrelServer}/third/session/${session.id || ""}`, {
            method: 'POST',
            headers: {
                'Content-type': 'text/json',
            },
            credentials: 'include',
            body: `email=${encodeURIComponent(email)}`,
        }).then((res) => res.json())
            .then((res) => {
                console.log('frame', res)
                setSession({
                    stage: res.grate,
                    id: session.id
                });
            })
    }

    return <div className="mt-auto self-start pb-28 pl-28 flex space-y-8 flex-col items-center justify-center font-inter antialiased">
        <p className="text-xl  text-white">Welcome to Planet One</p>
        <div className="flex flex-col space-y-4 items-center">
            <p className="text-white">To sign up or log in, enter your email to receive a sign-in link.</p>
            {!sent ? <div className="flex min-w-0 w-full space-x-4 items-center">
                <input className="text-white bg-transparent border-b grow p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button className="bg-white hover:bg-transparent hover:text-white hover:!opacity-100 text-[#6184FF] p-2" onClick={() => sendEmail()}>Send</button>
            </div> : <p className="text-white">Check your email for a login link.</p>}
        </div>
    </div>
}