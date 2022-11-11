import { Link } from "react-router-dom";
import { useState } from "react";
import cn from 'classnames';
import { useNewAcctContext } from "./new";
import ExpInput from './expInput';
import CardInput from './creditCardInput';
import Sigil from "../sigil";

const validate = (ccNum, exp, cvv, setError) => {
    setError(false);
    let errors = {
        ccNum: undefined,
        exp: undefined,
        cvv: undefined,
    };
    let foundError = false;
    if (ccNum.length !== 16) {
        errors.ccNum = "Invalid card number";
        foundError = true;
    }
    if (exp.length !== 5) {
        errors.exp = "Invalid expiration";
        foundError = true;
    }
    if (cvv.length !== 3) {
        errors.cvv = "Invalid CVV";
        foundError = true;
    }
    if (foundError) {
        setError(errors);
        return false;
    } else {
        return true
    }
}

const formatCardDetails = credit => {
    const { number, exp, cvv } = credit;
    const [_expMonth, _expYear] = exp.split('/');
    const expMonth = parseInt(_expMonth, 10);
    const expYear = parseInt(`20${_expYear}`, 10);
    return ({number, expMonth, expYear, cvv});
}

export default function PayScreen() {
    const { planet, credit, setCredit } = useNewAcctContext();
    const [number, setNumber] = useState("");
    const [exp, setExp] = useState("");
    const [cvv, setCvv] = useState("");
    const [error, setError] = useState(false);

    return <div className="grow flex justify-center items-center text-white">
        <div className="flex space-x-12">
            <div className="flex flex-col space-y-8 items-center">
                <div className="rounded-xl overflow-hidden">
                    <Sigil patp={planet || "~zod"} color="#6184FF" />
                </div>
                <p>{planet}</p>
            </div>
            <div className="flex-col space-y-4">
                <p>Credit card number</p>
                <CardInput
                    className={cn("w-full p-3 border-b bg-transparent monospace",
                        {"border-red-500": !!error?.ccNum}
                    )}
                    placeholder="0000 0000 0000 0000"
                    onChange={setNumber}
                />
                <div className="flex space-x-4">
                    <div className="flex-col space-y-4">
                        <p>Expiration</p>
                        <ExpInput
                            className={cn("w-full max-w-[6rem] p-3 border-b bg-transparent monospace",
                                {"border-red-500": !!error?.exp}
                            )}
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
                            className={cn("w-full p-3 border-b bg-transparent",
                                {"border-red-500": !!error?.cvv}
                            )}
                            placeholder="212"
                            maxLength="3"
                            value={cvv}
                            onChange={(e) => setCvv(e.target.value)}
                        />
                    </div>
                </div>
                {error && <p className="text-red-600">Please ensure all fields are correct.</p>}
                <Link to="/new/confirm" onClick={(e) => {
                    validate(number, exp, cvv, setError)
                        ? setCredit(formatCardDetails({ number, exp, cvv }))
                        : e.preventDefault()
                }}
                className="mt-8 block rounded-full px-4 py-2 bg-[rgba(217,217,217,0.2)] text-white hover:brightness-110 text-xl text-center"
                >
                    Continue
                </Link>
            </div>
        </div>
    </div>
}
