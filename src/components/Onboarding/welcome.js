import { useState } from "react";
import { Link } from "react-router-dom";
import { tirrelServer } from "../../lib/constants";
import { useSessionContext } from "../../Onboarding";

export default function Welcome() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const { setSession } = useSessionContext();

  const sendEmail = () => {
    setSent(true);
    console.log('submitEmail');
    fetch(`${tirrelServer}/third/session/`, {
      method: 'POST',
      headers: {
        'Content-type': 'text/json',
      },
      credentials: 'include',
      body: `email=${encodeURIComponent(email)}`,
    }).then((res) => res.json())
    .then((res) => {
      console.log('frame', res);
      setSession(p => ({...p, stage: res.grate }));
    })
  }

  return (
    <div className="mt-auto self-start pb-28 pl-28 flex space-y-8 flex-col items-center justify-center font-inter antialiased bg-[#0005] rounded-lg pt-4 pr-4">
      <p className="text-xl text-white">Welcome to Scene, by ~tirrel</p>
      <div className="flex flex-col space-y-4 items-center">
        <p className="text-white">To sign up or log in, enter your email to receive a sign-in link.</p>
        {!sent ? (
          <form className="flex min-w-0 w-full space-x-4 items-center">
            <input className="text-white bg-transparent border-b grow p-2" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button
              className="hover:bg-gray-600 bg-transparent text-white p-2"
              onClick={sendEmail}>
                Send
            </button>
          </form>
        ) : (
          <p className="text-white">Check your email for a login link.</p>
        )}
      </div>
      <Link to="/debug">
        <button className="text-white">
          Sign in with a non-Tirrel ship
        </button>
      </Link>
    </div>
  );
};
