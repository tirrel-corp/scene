import { useRef } from 'react';

function createMask(string){
  if (string.length < 5) {
    return string.replace(/^(\d{4})$/, "$1");
  } else if (string.length < 9) {
    return string.replace(/^(\d{4})(\d{1,4})$/, "$1 $2");
  } else if (string.length < 13) {
    return string.replace(/^(\d{4})?(\d{4})(\d{1,4})$/, "$1 $2 $3");
  } else {
    return string.replace(/^(\d{4})?(\d{4})?(\d{4})?(\d{1,4})$/,"$1 $2 $3 $4");
  }
}

function destroyMask(string){
  return string.replace(/\D/g,'').substring(0, 16);
}

const CreditCardInput = ({ onChange, ...rest }) => {
  const mask = useRef('');
  const num = useRef('');

  const handleChange = (evt) => {
    num.current = destroyMask(evt.target.value);
    mask.current = createMask(num.current);
    onChange(num.current);
  };

  return (
    <input
      type="text"
      autoComplete="cc-number"
      inputMode="numeric"
      onChange={handleChange}
      value={mask.current}
      {...rest}
    />
  );
};

export default CreditCardInput;
