import { useState, useEffect } from 'react';
import Modal from './Modal';
import { getBackgroundImage, setBackgroundImage } from '../lib/background';

function isValidUrl(input) {
  try {
    new URL(input);
  } catch (err) {
    return false;
  }
  return true;
}

const BackgroundModal = props => {
  const {className, onSave, ...rest} = props;

  const [value, setValue] = useState();
  useEffect(() => {
    async function getPrev() {
      const got = await getBackgroundImage();
      setValue(got);
    }
    getPrev();
  }, []);
  const validity = isValidUrl(value);

  const [error, setError] = useState();
  const [saving, setSaving] = useState(false);
  const handleSave = () => {
    setSaving(true);
    setBackgroundImage(value)
      .catch(err => setError(err.message))
      .finally(() => setSaving(false));
    onSave();
  };

  return (
    <Modal title="Change Desktop Background" {...rest}>
      <form className="min-h-[30vh] min-w-[60ch] w-100 flex flex-col space-y-2">
        <label className="block" htmlFor="next-bg">
          New Background Image
        </label>
        <div className="flex space-x-2">
          <input
            type="url"
            name="next-bg"
            className={`block grow rounded p-1 text-small text-black border-2 ${!!value && !validity ? 'border-red-400' : 'border-transparent'
              }`}
            placeholder="https://image.host/image.jpg"
            onChange={ev => setValue(ev.target.value)}
            value={value}
          />
          <button disabled={!validity} onClick={handleSave}>
            Save
          </button>
        </div>
      </form>
    </Modal>
  )
};

export default BackgroundModal;
