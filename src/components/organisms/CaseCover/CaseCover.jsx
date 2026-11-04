import { Device } from '../../atoms/Device';
import { Icon } from '../../atoms/Icon';

// Portada: banda 16:9 (4:5 en teléfono) en el color de la marca, con el logo en blanco, tres teléfonos que asoman
// desde abajo y el círculo del enlace principal montado sobre el borde. Logo y teléfonos se mueven en parallax suave
// (`data-par`, hook useCaseParallax). Si el proyecto no tiene sitio público, no hay círculo.
function Lockup({ brand, image, width, height, alt, symbol, symbolWidth, symbolHeight, wordmark }) {
  if (image) return <img className={`ap-case-cover__logo ap-case-cover__logo--${brand}`} src={image} width={width} height={height} alt={alt} />;
  return (
    <span className={`ap-case-lockup ap-case-lockup--${brand}`} role="img" aria-label={wordmark}>
      <img className="ap-case-lockup__symbol" src={symbol} width={symbolWidth} height={symbolHeight} alt="" />
      <span className="ap-case-lockup__word" aria-hidden="true">{wordmark}</span>
    </span>
  );
}

export function CaseCover({ label, cta, badge, logo, phones }) {
  return (
    <section className={`ap-case-cover${phones.length ? '' : ' ap-case-cover--solo'}`} aria-label={label}>
      {cta && (
        <a className="ap-case-cta" href={cta.href} target="_blank" rel="noopener noreferrer">
          {cta.label} <Icon name="arrow-up-right" size="sm" />
        </a>
      )}
      <div className="ap-case-cover__band">
        {badge && <span className="ap-case-cover__badge ap-case-mono">{badge}</span>}
        <div className="ap-case-cover__brand" data-par="0.06"><Lockup {...logo} /></div>
        {phones.length > 0 && (
          <div className="ap-case-cover__phones" data-par="-0.07">
            {phones.map((p) => <Device key={p.src} kind="phone" src={p.src} alt={p.alt} eager />)}
          </div>
        )}
      </div>
    </section>
  );
}
