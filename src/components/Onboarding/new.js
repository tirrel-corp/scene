import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";

export default function NewAccount() {
    // pull session id from parent Onboarding context
    const { session, accountState, updateAccountState } = useOutletContext();
    const [planet, setPlanet] = useState("");
    const [credit, setCredit] = useState({})
    const [billing, setBilling] = useState({});

    return (
        <>
            <Outlet
                context={{
                    planet,
                    setPlanet,
                    credit,
                    setCredit,
                    billing,
                    setBilling,
                    session,
                    accountState,
                    updateAccountState,
                }}
            />
            <div className="flex justify-between text-white w-full p-12">
                <div className="flex space-x-4 items-center">
                    <a className="cursor-pointer">Pricing</a>
                    <a className="cursor-pointer">Privacy Policy</a>
                    <a className="cursor-pointer">Terms of Service</a>
                </div>
                <a className="border-b cursor-pointer">support@planet.one</a>
            </div>
        </>
    )
}

export function useNewAcctContext() {
    return useOutletContext();
}
