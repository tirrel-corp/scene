import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuth } from '../../lib/auth';

export default function DebugMenu() {
  const navigate = useNavigate();
  const [ship, setShip] = useState('');
  const [url, setUrl] = useState('');
  const [code, setCode] = useState('');

  const respawn = () => {
    setAuth({ ship, url, code });
    navigate('/app');
  }

  return (
    <div className="flex flex-col space-y-5 text-white rounded-lg p-5 bg-[#000A]">
      <div className="flex flex-row">
        <button className="px-4" onClick={() => navigate(-1)}>
          &#10094;&nbsp;Back
        </button>
      </div>
      <p>To sign in to your ship, please provide the following details.</p>
      <form className="flex flex-col space-y-4">
        <p>Ship name (without the leading ~)</p>
        <input
            type="text"
            className="bg-transparent border-b p-2"
            placeholder="sidfus-tirlyx"
            value={ship}
            onChange={(e) => setShip(e.target.value)}
        />
        <p>URL</p>
        <input
            type="text"
            className="bg-transparent border-b p-2"
            placeholder="https://sidfus-tirlyx.arvo.planet.one"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
        />
        <p>Access Key (+code)</p>
        <input
            type="text"
            className="bg-transparent border-b p-2"
            placeholder="lidlut-tabwed-pillex-ridrup"
            value={code}
            onChange={(e) => setCode(e.target.value)}
        />
        <button onClick={() => respawn()}>Relaunch</button>
      </form>
    </div>
  )
}
