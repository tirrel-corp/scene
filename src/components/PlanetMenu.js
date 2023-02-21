import cn from "classnames";
import { getAuth, clearAuth } from "../lib/auth";
import { useContext } from 'react';
import { whiteOrBlack } from '../lib/background';
import { ThemeContext } from "../App"

export default function PlanetMenu(props) {
  const { visible, updateAvailable, appVersion } = props;
  const ship = window.ship;
  return (
    <div
      id="planet-menu"
      className={cn("w-full max-w-[350px] z-[9999] absolute top-12 left-2 bg-[rgba(0,0,0,0.3)] p-2 rounded-xl ", { "shown fade-in": !!visible.value, "hidden": !Boolean(visible.value) })}
    >
      <section className="flex flex-col gap-2">
        {updateAvailable && <UpdatePrompt />}
        <LogOut ship={ship} handleLogout={() => clearAuth()} />
        <div className="px-2 py-1 text-xs text-center text-white">
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
  const palette = useContext(ThemeContext);
  const header = `rgb(${palette?.["Muted"]?.join(",") || "0,0,0"})`;
  const content = `rgb(${palette?.["DarkMuted"]?.join(",") || "0,0,0"})`;
  const text = whiteOrBlack(content);

  return (
    <div className="rounded overflow-hidden"
      style={{
        backgroundColor: content,
        color: text
      }}>
      <header className="text-xs p-2"
        style={{
          backgroundColor: header
        }}>
        Log Out
      </header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex gap-1 items-center">
          <div className="grow">
            <p className="text-xs">
              Log out of <code>~{ship}</code>
            </p>
          </div>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: header,
              borderColor: 'transparent'
            }}
          >
            Log Out
          </button>
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
        <button onClick={() => window.scene.respawn()} style={{ flexBasis: '12ch' }}>
          Quit &amp; Install
        </button>
      </div>
    </div>
  </div>
)
