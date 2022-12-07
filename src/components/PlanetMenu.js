import cn from "classnames";
import { getAuth, clearAuth } from "../lib/auth";

export default function PlanetMenu(props) {
  const { visible, updateAvailable, appVersion } = props;
  const { ship } = getAuth();
  return (
    <div
      id="planet-menu"
      className={cn("text-white", { shown: !!visible.value })}
    >
      <section className="flex flex-col gap-2">
        {updateAvailable && <UpdatePrompt />}
        <LogOut ship={ship} handleLogout={() => clearAuth()} />
        <div className="px-2 py-1 text-xs text-center">
          {!!appVersion && <p className="font-bold">Scene v{appVersion}</p>}
          <p>
            To file a bug report, or for other support concerns, email&nbsp;
            <a
              href="mailto:support@tirrel.io"
              rel="noopener noreferrer"
              target="_blank"
              className="underline"
            >
              support@tirrel.io
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}

const LogOut = (props) => {
  const { ship, handleLogout } = props;
  return (
    <div className="rounded bg-neutral-500 overflow-hidden">
      <header className="bg-neutral-600 text-xs px-2 py-1">Log Out</header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex gap-1 items-center">
          <div className="grow">
            <p>
              Log out of <code>~{ship}</code>
            </p>
          </div>
          <button onClick={handleLogout}>Log Out</button>
        </div>
      </div>
    </div>
  );
}

const UpdatePrompt = () => (
  <div className="rounded bg-neutral-500 text-white overflow-hidden">
    <header className="bg-neutral-600 text-xs px-2 py-1">
      Update Available
    </header>
    <div className="p-2">
      <div className="flex gap-1 items-center">
        <div>
          <p>
            An update for Scene has been downloaded and is ready to install.
          </p>
        </div>
        <button onClick={() => window.scene.respawn()} style={{flexBasis: '12ch'}}>
          Quit &amp; Install
        </button>
      </div>
    </div>
  </div>
)
