import { Link } from "react-router-dom";
import Septagon from '../icons/planet-one-septagon';

export default function Welcome() {
  return (
    <div className="flex space-y-8 flex-col items-stretch justify-center rounded-lg text-white p-20">
      <p className="text-xl text-center p-5">Welcome to Scene</p>
      <a href="https://planet.one/" target="_blank" rel="noreferrer">
        <button className="w-full">
          Sign in via Planet.One&nbsp;&nbsp;
          <div className="inline-flex flex-col justify-center">
            <Septagon />
          </div>
        </button>
      </a>
      <Link to="/debug">
        <button className="w-full">
          Sign in with URL
        </button>
      </Link>
    </div>
  );
};
