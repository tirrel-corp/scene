import { useState } from 'react';
import { set } from '../lib/background';

const HamburgerMenu = props => {
  const { nativeNotifs, setBgImage, visible } = props;

  return (
    <div
      id="hamburger"
      className={`${visible.value ? 'shown' : ''}`}>
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

  return (
    <div className="rounded bg-neutral-500 text-white overflow-hidden">
      <header className="bg-neutral-600 text-xs px-2 py-1">
        Background Image
      </header>
      <div className="flex flex-col gap-1 p-2">
        <div className="flex gap-1">
          <input
            type="url"
            id="background-input"
            className={`block grow rounded p-1 text-small text-black border-2 ${!!value && !validity ? 'border-red-400' : 'border-transparent'
              }`}
            placeholder="https://image.host/image.jpg"
            onChange={ev => setValue(ev.target.value)}
            value={value}
          />
          <button disabled={!validity} onClick={() => {
            set(value, setBgImage)
            onSave()
          }}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
};

const NotificationsToggle = props => {
  const { value, set } = props;
  const toggle = () => set(!value);
  return (
    <div className="rounded bg-neutral-500 text-white overflow-hidden">
      <header className="bg-neutral-600 text-xs px-2 py-1">
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
          <button onClick={toggle}>
            {!value ? 'Enable' : 'Disable'}
          </button>
        </div>
      </div>
    </div>
  )
};

export default HamburgerMenu;
