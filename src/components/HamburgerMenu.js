import { useState, useContext } from 'react';
import { set, whiteOrBlack } from '../lib/background';
import { ThemeContext } from "../App"

const HamburgerMenu = props => {
  const { nativeNotifs, setBgImage, visible } = props;

  return (
    <div
      id="hamburger"
      className={`w-full bg-[rgba(0,0,0,0.3)] p-2 rounded-xl max-w-[350px] z-[9999] absolute top-12 right-2 ${visible.value ? 'visible fade-in' : 'hidden'}`}
    >
      <section className="flex flex-col gap-2">
        <NotificationsToggle value={nativeNotifs.value} set={nativeNotifs.set} />
        <BackgroundInput setBgImage={setBgImage} onSave={() => visible.set(false)} />
      </section>
    </div>
  );
};

function isValidUrl(input) {
  try {
    new URL(input);
  } catch (err) {
    return false;
  }
  return true;
}

function isImage(input) {
  return /\.(jpe?g|tiff?|png|webp|bmp|gif|svg)$/i.test(input);
}

const BackgroundInput = props => {
  const { onSave, setBgImage } = props;
  const [value, setValue] = useState('');
  const validity = value === '' ? true : isValidUrl(value) && isImage(value);
  const palette = useContext(ThemeContext);
  const header = `rgb(${palette?.["Muted"]?.join(",") || "0,0,0"})`;
  const content = `rgb(${palette?.["DarkMuted"]?.join(",") || "0,0,0"})`;
  const text = whiteOrBlack(content);

  return (
    <div className="rounded overflow-hidden"
      style={{
        backgroundColor: content,
        color: text
      }}
    >
      <header className="text-xs p-2"
        style={{
          backgroundColor: header
        }}
      >
        Background Image
      </header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex space-x-2">
          <input
            type="url"
            id="background-input"
            className={`block grow rounded p-2 text-xs text-black border-2 ${!!value && !validity ? 'border-red-400' : 'border-transparent'
              }`}
            placeholder="https://image.host/image.jpg"
            onChange={ev => setValue(ev.target.value)}
            value={value}
          />
          <button disabled={!validity} onClick={() => {
            set(value, setBgImage)
            onSave()
          }}
            style={{
              backgroundColor: header,
              borderColor: 'transparent'
            }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
};

const NotificationsToggle = props => {
  const { value, set } = props;
  const palette = useContext(ThemeContext);
  const header = `rgb(${palette?.["Muted"]?.join(",") || "0,0,0"})`;
  const content = `rgb(${palette?.["DarkMuted"]?.join(",") || "0,0,0"})`;
  const text = whiteOrBlack(content);

  const toggle = () => set(!value);
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
        Native Notifications
      </header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex gap-1 items-center">
          <div className="grow">
            <p>
              Native notifications are&nbsp;
              <span className="underline">
                {value ? 'enabled' : 'disabled'}
              </span>
            </p>
          </div>
          <button
            onClick={toggle}
            style={{
              backgroundColor: header,
              borderColor: 'transparent'
            }}>
            {!value ? 'Enable' : 'Disable'}
          </button>
        </div>
      </div>
    </div>
  )
};

export default HamburgerMenu;
