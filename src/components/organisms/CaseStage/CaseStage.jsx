import { Device } from '../../atoms/Device';
import { CaseCaption } from '../../molecules/CaseCaption';

// Escenario a sangre con dispositivos. `tone`: tint (fondo del proyecto), brand, accent o light. Cada bloque:
// laptop, phones (fila de tres; carrusel en teléfono), duo (texto + tablet y teléfono, o + laptop), combo (laptop con
// teléfono encima), split (título y texto en dos columnas) o columns (fichas de texto).
function Copy({ n, title, text }) {
  return (
    <div className="ap-case-duo__copy">
      <span className="ap-case-mono">{n}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

function Block({ block }) {
  switch (block.type) {
    case 'laptop':
      return (
        <figure className="ap-case-stage__item">
          <Device kind="laptop" {...block.shot} />
          {block.caption && <CaseCaption {...block.caption} />}
        </figure>
      );
    case 'phones':
      return (
        <figure className="ap-case-stage__item">
          <div className="ap-case-phones">
            {block.shots.map((s) => <Device key={s.src} kind="phone" {...s} />)}
          </div>
          {block.caption && <CaseCaption {...block.caption} />}
        </figure>
      );
    case 'duo':
      return (
        <div className={`ap-case-stage__item ap-case-duo${block.wide ? ' ap-case-duo--wide' : ''}`}>
          <Copy {...block.copy} />
          {block.laptop ? (
            <Device kind="laptop" {...block.laptop} />
          ) : (
            <div className="ap-case-duo__devices">
              <Device kind="tablet" {...block.tablet} />
              <Device kind="phone" {...block.phone} />
            </div>
          )}
        </div>
      );
    case 'combo':
      return (
        <div className="ap-case-stage__item ap-case-combo">
          <Device kind="laptop" {...block.laptop} />
          <Device kind="phone" {...block.phone} />
        </div>
      );
    case 'split':
      return (
        <div className="ap-case-stage__item ap-case-split ap-case-duo ap-case-duo--wide">
          <Copy n={block.n} title={block.title} />
          <div className="ap-case-duo__copy"><p>{block.text}</p></div>
        </div>
      );
    case 'columns':
      return (
        <ul className="ap-case-stage__item ap-case-cols">
          {block.items.map((c) => (
            <li key={c.n} className="ap-case-col">
              <span className="ap-case-mono">{c.n}</span>
              <h3>{c.title}</h3>
              <p>{c.text}</p>
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export function CaseStage({ tone, label, blocks }) {
  return (
    <section className={`ap-case-stage ap-case-stage--${tone}`} aria-label={label}>
      {blocks.map((b, i) => <Block key={i} block={b} />)}
    </section>
  );
}
