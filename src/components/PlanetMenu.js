import cn from 'classnames';
import { getAuth, clearAuth } from '../lib/auth';

export default function PlanetMenu(props) {
  const { visible } = props;
  const { ship } = getAuth();
  return (
    <div id="planet-menu" className={cn({shown: !!visible.value})}>
      <section className="flex flex-col gap-2">
        <LogOut ship={ship} handleLogout={() => clearAuth()} />
      </section>
    </div>
  )
}

const LogOut = props => {
  const { ship, handleLogout } = props;
  return (
    <div className="rounded bg-neutral-500 text-white overflow-hidden">
      <header className="bg-neutral-600 text-xs px-2 py-1">
        Log Out
      </header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex gap-1 items-center">
          <div className="grow">
            <p>
              Log out of <code>~{ship}</code>
            </p>
          </div>
          <button onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
