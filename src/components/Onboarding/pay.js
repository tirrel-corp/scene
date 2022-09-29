import { Link } from "react-router-dom";
import { useState } from "react";
import cn from 'classnames';
import { useNewAcctContext } from "./new";
import ExpInput from './expInput';
import CardInput from './creditCardInput';
import Sigil from "../sigil";

const validate = (ccNum, exp, cvv, setError) => {
    if (!(ccNum && exp && cvv)) {
        setError(true);
        return false;
    } else {
        return true
    }
}

export default function PayScreen() {
    const { planet, credit, setCredit } = useNewAcctContext();
    const [ccNum, setCcNum] = useState("");
    const [exp, setExp] = useState("");
    const [cvv, setCvv] = useState("");
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
                <p>Credit card number</p>
                <CardInput
                    className="w-full p-3 border-b bg-transparent monospace"
                    placeholder="0000 0000 0000 0000"
                    onChange={setCcNum}
                />
                <div className="flex space-x-4">
                    <div className="flex-col space-y-4">
                        <p>Expiration</p>
                        <ExpInput
                            className="w-full max-w-[6rem] p-3 border-b bg-transparent monospace"
                            placeholder="01/99"
                            onChange={setExp}
                        />
                    </div>
                    <div className="flex-col space-y-4">
                        <p>CVV</p>
                        <input
                            type="text"
                            autoComplete="cc-csc"
                            inputMode="numeric"
                            className="w-full p-3 border-b bg-transparent"
                            placeholder="212"
                            maxLength="3"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                    </div>
                </div>
                <Link to="/new/confirm" onClick={(e) => {
                    validate(ccNum, exp, cvv, setError)
                        ? setCredit({ ...credit, ccNum, exp, cvv })
                        : e.preventDefault()
                }}>
                    <a className="mt-8 block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl text-center">Continue</a>
                    {error && <p className="text-red-600">Please ensure all fields are correct.</p>}
                </Link>
            </div>
        </div>
    </div>
}
