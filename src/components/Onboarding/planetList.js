import { useState, useEffect } from 'react';
import { Link, useOutletContext } from "react-router-dom";
import Sigil from '../sigil';
import Spinner from '../Spinner';
import { tirrelServer } from '../../lib/constants';

export default function PlanetList() {
    const { planet, setPlanet } = useOutletContext();

    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState([]);

    useEffect(() => {
        fetch(`${tirrelServer}/third/inventory`, {
            method: 'GET',
            credentials: 'include',
        }).then(res => res.json())
        .then(res => setInventory(res.ships))
        .then(() => setLoading(false))
    }, []);

    return (
    <div className="grow flex flex-col space-y-12 items-center justify-center antialiased font-inter">
        <h2 className="text-5xl text-white font-light">Choose your planet.</h2>
        <h2 className="text-5xl text-white font-light">Hosting for just $20/month.</h2>
        {loading ? <Spinner /> : (
            <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                {inventory.slice(10).map(patp => (
                    <div
                        key={patp}
                        onClick={() => setPlanet(patp)}
                        className="bg-[#6184FF] flex flex-col p-4 rounded-xl text-white items-center justify-center space-y-4 cursor-pointer hover:brightness-110">
                        <Sigil patp={patp} color="#6184FF" />
                        <p className="font-inter pb-2">{patp}</p>
                    </div>
                ))}
            </div>
        )}
        <Link to="detail" className={[
                'rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)]',
                'text-white hover:brightness-110 text-xl',
                !planet ? 'hidden pointer-events-none' : ''
            ].join(' ')}>
            Continue
        </Link>
    </div>
    )
}
