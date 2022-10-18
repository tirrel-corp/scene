import Sigil from './sigil';

export default function Spinner(props) {
  const { patp = "~tirrel", color = "#3045B1" } = props;
  return (
    <div className="spinner overflow-hidden rounded-xl">
      <Sigil patp={patp} color={color} />
    </div>
  )
}
