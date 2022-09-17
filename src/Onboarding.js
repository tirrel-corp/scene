import { Outlet } from "react-router";

export default function Onboarding() {
    return <div className="h-screen w-screen bg-cover flex flex-col items-center justify-center" style={{ backgroundImage: "url('/moon.png')" }}>
        <Outlet />
    </div>;
}