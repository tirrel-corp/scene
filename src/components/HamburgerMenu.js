import { useState } from 'react';

const HamburgerMenu = props => {
  const { visible } = props;

  return (
    <div
      id="hamburger"
      className={`${visible.value ? 'shown' : ''}`}>
      <section className="flex flex-col gap-2">
        <BackgroundInput />
      </section>
    </div>
  );
};

const BackgroundInput = props => {
  const [value, setValue] = useState('');

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
            className={`block grow rounded p-1 text-small`}
            placeholder="https://image.host/image.jpg"
            onChange={ev => setValue(ev.target.value)}
          />
          <button>
            Save
          </button>
        </div>
      </div>
    </div>
  )
};

export default HamburgerMenu;
