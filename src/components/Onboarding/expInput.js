import { useRef } from 'react';

const ExpirationInput = ({ onChange, ...rest }) => {
  const mask = useRef('');

  const handleChange = (evt) => {
    // test whether the input is like `dd/`; if so, delete the trailing slash
    const prev = mask.current;
    const next = evt.target.value;
    if (prev.length === 2 && next.length === 3) {
      mask.current = next.replace(/^(\d{2})(\d{1,2})$/, "$1/$2");
    } else if (prev.length === 4 && next.length === 3) {
      mask.current = next.replace(/^(\d{2}).*$/, "$1");
    } else {
      mask.current = next;
    }
    onChange(mask.current);
  };

  return (
    <input
      type="text"
      autoComplete="cc-exp"
      inputMode="numeric"
      onChange={handleChange}
      value={mask.current}
      {...rest}
    />
  );
};

export default ExpirationInput;
