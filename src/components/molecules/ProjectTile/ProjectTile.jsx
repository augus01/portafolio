import { Tag } from '../../atoms/Tag';

// Proyecto de la galería: una portada a sangre en el color de la app (estilo Josephmark), con el logo en blanco
// a gran tamaño y, si hay capturas reales, un collage de tres pantallas alrededor que se abre al pasar el mouse.
// Debajo van nombre, descripción y rol (con el premio como Tag propio, si lo hay); las filas del pie usan subgrid
// para alinearse con el proyecto vecino. `logo.image` es un logotipo completo; `logo.symbol` + `logo.wordmark`
// compone símbolo y nombre en la fuente de la marca (`logo.brand`). Logo y capturas son decorativos: el nombre
// del proyecto va en el h3.
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

export function ProjectTile({ index, name, description, role, award, logo, shots = [], className }) {
  return (
    <article className={['ap-gal__item', `ap-gal__item--${logo.brand}`, className].filter(Boolean).join(' ')}>
      <div className="ap-gal__tile">
        <span className="ap-gal__num meta" aria-hidden="true">{index}</span>
        {shots.map(({ src, width, height }, i) => (
          <img key={src} className={`ap-gal__shot ap-gal__shot--${i + 1}`} src={src} width={width} height={height} alt="" decoding="async" loading="lazy" />
        ))}
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
