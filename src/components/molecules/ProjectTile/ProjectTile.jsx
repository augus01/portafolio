import { Tag } from '../../atoms/Tag';

// Card de la galería de proyectos: el logo del proyecto sobre una superficie blanca con número, y debajo
// nombre, descripción y rol (con el premio como Tag propio, si lo hay). Las filas del pie usan subgrid para alinearse con la card vecina.
// `logo.image` es un logotipo completo; `logo.symbol` + `logo.wordmark` compone símbolo y nombre en la
// fuente de la marca (`logo.brand`). El logo es decorativo: el nombre del proyecto va en el h3.
function Logo({ brand, image, width, height, symbol, symbolWidth, symbolHeight, wordmark }) {
  if (image) {
    return <img className={`ap-gal__logo ap-gal__logo--${brand}`} src={image} width={width} height={height} alt="" decoding="async" loading="lazy" />;
  }
  return (
    <span className={`ap-gal__lockup ap-gal__lockup--${brand}`} aria-hidden="true">
      <img className="ap-gal__symbol" src={symbol} width={symbolWidth} height={symbolHeight} alt="" decoding="async" loading="lazy" />
      <span className="ap-gal__wordmark">{wordmark}</span>
    </span>
  );
}

export function ProjectTile({ index, name, description, role, award, logo, className }) {
  return (
    <article className={['ap-gal__item', className].filter(Boolean).join(' ')}>
      <div className="ap-gal__tile">
        <span className="ap-gal__num meta" aria-hidden="true">{index}</span>
        <Logo {...logo} />
      </div>
      <h3 className="ap-gal__name subheading">{name}</h3>
      <p className="ap-gal__desc lead">{description}</p>
      <div className="ap-gal__foot">
        <p className="ap-gal__role meta">{role}</p>
        {award && <Tag>{award}</Tag>}
      </div>
    </article>
  );
}
