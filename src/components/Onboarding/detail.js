import { useState } from "react"
import { Link, useOutletContext } from "react-router-dom";
import Sigil from "../sigil";

const validate = (fullName, line1, city, state, postal, email, setError) => {
    if (!(/(?:(\w+-?\w+)) (?:(\w+))(?: (\w+))?$/.test(fullName) && line1 && city && state && postal && email)) {
        setError(true);
        return false;
    } else {
        return true
    }
}

export default function PayDetailScreen() {
    const { planet, credit, setCredit } = useOutletContext();
    const [fullName, setFullname] = useState("");
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [city, setCity] = useState("");
    const [state, setSt] = useState("");
    const [postal, setPostal] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState(false);

    return <div className="grow flex justify-center items-center text-white">
        <div className="flex space-x-12">
            <div className="flex flex-col space-y-8 items-center">
                <p>Reserved for 15 minutes</p>
                <div className="rounded-xl overflow-hidden">
                    <Sigil patp={planet || "~zod"} color="#6184FF" />
                </div>
                <p>{planet}</p>
            </div>
            <div className="flex-col space-y-4">
                <p>Full name</p>
                <input
                    className="w-full p-3 border-b bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    type="text"
                    placeholder="John Smith"
                    autoComplete="cc-given-name"
                    id="name"
                    pattern="(?:(\w+-?\w+)) (?:(\w+))(?: (\w+))?$"
                    required="true"
                    onChange={(e) => setFullname(e.target.value)}
                    value={fullName}
                />
                <p>Billing address</p>
                <input
                    className="w-full p-3 border-b  bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    type="text"
                    placeholder="200 Cherry Ln"
                    autoComplete="address-level1"
                    id="address1"
                    required="true"
                    onChange={(e) => setLine1(e.target.value)}
                    value={line1}
                />
                <input
                    className="w-full p-3 border-b   bg-transparent"
                    type="text"
                    autoComplete="address-level2"
                    id="address2"
                    onChange={(e) => setLine2(e.target.value)}
                    value={line2}
                />
                <p>City</p>
                <input
                    className="w-full p-3 border-b   bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    type="text"
                    placeholder="Verduria"
                    id="city"
                    required="true"
                    onChange={(e) => setCity(e.target.value)}
                    value={city}
                />
                <div className="flex justify-between">
                    <div className="flex flex-col space-y-2">
                        <p>State</p>
                        <input
                            className="w-full p-3 border-b max-w-[4rem] bg-transparent  invalid:border-red-500 placeholder-shown:!border-white"
                            type="text"
                            placeholder="MN"
                            autoComplete="address-level1"
                            id="state"
                            maxLength={2}
                            required="true"
                            onChange={(e) => setSt(e.target.value)}
                            value={state}
                        />
                    </div>
                    <div className="flex flex-col space-y-2">
                        <p>Postal code</p>
                        <input
                            className="w-full p-3 border-b bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                            type="text"
                            placeholder="88888"
                            autoComplete="postal-code"
                            id="postal"
                            minLength={5}
                            maxLength={5}
                            required="true"
                            onChange={(e) => setPostal(e.target.value)}
                            value={postal}
                        />
                    </div>
                </div>
                <p>Email address</p>
                <input
                    className="w-full p-3 border-b   bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    type="text"
                    placeholder="john@apple.seed"
                    id="email"
                    required="true"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <p>Confirm email address</p>
                <input
                    className="w-full p-3 border-b bg-transparent invalid:border-red-500 placeholder-shown:!border-white"
                    placeholder="john@apple.seed"
                    required="true"
                    type="text"
                    pattern={email}
                />
                <Link
                    to="/new/pay"
                    onClick={(e) => {
                        return validate(fullName, line1, city, state, postal, email, setError)
                            ? setCredit({ fullName, line1, line2, city, state, postal, email })
                            : e.preventDefault()
                    }}>
                    <a className="mt-8 cursor-pointer block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl text-center">Continue</a>
                </Link>
                {error && <p className="text-red-600">Please ensure all fields are correct.</p>}
            </div>
        </div>
    </div>
}