import { Link } from "react-router-dom";

export default function Welcome() {
    return <div className="mt-auto self-start pb-28 pl-28 flex space-y-8 flex-col items-center justify-center font-inter antialiased">
        <p className="text-xl  text-white">Welcome to Planet One</p>
        <div className="flex space-x-4 items-center">
            <Link to="login">
                <a className="rounded-full bg-[rgba(217,217,217,0.2)] px-4 py-2 text-white hover:brightness-110 cursor-pointer">Log in</a>
            </Link>
            <a className="rounded-full bg-[rgba(217,217,217,0.2)] px-4 py-2 text-white hover:brightness-110 cursor-pointer">New Account</a>
        </div>
    </div>
}