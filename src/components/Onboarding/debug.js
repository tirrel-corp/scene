import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { setAuth } from '../../lib/auth';
import ob from 'urbit-ob';


export default function DebugMenu() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, setError } = useForm({
    mode: 'onBlur',
  });

  console.debug(errors);

  const testCreds = async ({ship, code, url}) => {
    try {

      if (!url.startsWith('https://')) {
        throw new Error(`Url must be on https`);
      }

      const auth = await fetch(`${url}/~/login`, {
        method: 'POST',
        credentials: 'include',
        body: new URLSearchParams({
          'password': code,
        })
      });
      if (!auth.ok) {
        throw new Error(`Could not log in as ~${ship} with code ${code}`);
      }

      setAuth({ship, code, url})
    } catch (err) {
      setError('url', {type: 'custom', message: err?.message || err});
    }
  }

  return (
    <div className="flex flex-col space-y-5 text-white rounded-lg p-20 max-w-[60ch]">
      <div className="flex flex-row">
        <button className="px-4" onClick={() => navigate(-1)}>
          &#10094;&nbsp;Back
        </button>
      </div>
      <p>To sign in to your ship, please provide the following details.</p>
      <form
        onSubmit={handleSubmit(testCreds)}
        className="flex flex-col space-y-4">
        <p>Ship name</p>
        <input
          type="text"
          className={`bg-transparent border-b p-2 ${errors?.code ? 'border-red-600' : ''}`}
          placeholder="sidfus-tirlyx"
          {...register('ship', {
            required: true,
            validate: v => ob.isValidPatp(v) || ob.isValidPatp(`~${v}`),
          })}
        />
        <p>URL</p>
        <input
          type="url"
          className={`bg-transparent border-b p-2 ${errors?.url ? 'border-red-600' : ''}`}
          placeholder="https://sidfus-tirlyx.arvo.planet.one"
          {...register('url', {
            required: true,
            validate: v => {
              try {
                new URL(v);
                return true;
              } catch (err) {
                return false;
              }
            }
          })}
        />
        <p>Access Key (+code)</p>
        <input
          type="text"
          className={`bg-transparent border-b p-2 ${errors?.code ? 'border-red-600' : ''}`}
          placeholder="lidlut-tabwed-pillex-ridrup"
          {...register('code', {
            required: true,
            minLength: 27,
            validate: v => ob.isValidPatq(v) || ob.isValidPatq(`~${v}`),
          })}
        />
        <button>Connect</button>
      </form>
      {Object.entries(errors)
          .filter(([, err]) => err.type === 'custom')
          .map(([key, err]) => (
            <p className="border rounded-lg p-2 border-red-600" key={key}>
              Error: {err?.message}
            </p>
          )
      )}
    </div>
  )
}
