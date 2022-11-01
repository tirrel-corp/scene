import { Link } from "react-router-dom";
import Septagon from '../icons/planet-one-septagon';

export default function Welcome() {
  return (
    <div className="mt-auto self-start pb-28 pl-28 flex space-y-8 flex-col items-stretch justify-center bg-[#000A] rounded-lg pt-4 pr-4 text-white">
      <p className="text-xl text-center p-5">Welcome to Scene, by ~tirrel</p>
      <a href="https://planet.one/" target="_blank" rel="noreferrer">
        <button className="w-full">
          Sign in via Planet.One&nbsp;&nbsp;
          <div className="inline-flex flex-col justify-center">
            <Septagon/>
          </div>
        </button>
      </a>
      <Link to="/debug">
        <button className="w-full">
          Sign in Manually
        </button>
      </Link>
    </div>
  );
};
