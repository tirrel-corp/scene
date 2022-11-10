import SceneLogoStroke from './icons/scene-logo-stroke';
export default function PulsingLogo({className: cn = '', ...rest}) {
  return (
    <div className={`animate-pulse ${cn}`} {...rest}>
      <SceneLogoStroke />
    </div>
  )
}
