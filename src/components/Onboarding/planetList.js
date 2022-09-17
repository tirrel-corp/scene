import { Link, useOutletContext } from "react-router-dom";
import Sigil from "../sigil";

export default function PlanetList() {
    const { planet, setPlanet } = useOutletContext();
    console.log(planet)
    //TODO fetch available planets from api
    return <div className="grow flex flex-col space-y-12 items-center justify-center antialiased font-inter">
        <h2 className="text-5xl text-white font-light">Choose your planet.</h2>
        <h2 className="text-5xl text-white font-light">Hosting for just $20/month.</h2>
        <div className="flex flex-col space-y-8 items-center justify-center">
            <div className="flex space-x-4">
                {new Array(6).fill(
                    <div
                        onClick={() => setPlanet("~haddef-sigwen")}
                        className="bg-[#6184FF] flex flex-col p-4 rounded-xl text-white items-center justify-center space-y-4 cursor-pointer hover:brightness-110">
                        <Sigil patp="~haddef-sigwen" color="#6184FF" />
                        <p className="font-inter pb-2">~haddef-sigwen</p>
                    </div>)}
            </div>
            <Link to="detail">
                <a className="rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl">Continue</a>
            </Link>
        </div>
    </div>
}