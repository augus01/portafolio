// Card de proyecto: la foto (o marco de relleno con nombre accesible) y pie con número y título.
// La card toma el tamaño de su foto: `width`/`height` son sus medidas reales y fijan la proporción (--card-ratio).
// `mobile` ({ image, width, height }) es la captura del mismo paso en teléfono: la usa el carrusel bajo 720px.
export function MediaCard({ index, title, image, alt, width, height, mobile }) {
  const style = {};
  if (width && height) style['--card-ratio'] = width / height;
  if (mobile?.width && mobile?.height) style['--card-ratio-m'] = mobile.width / mobile.height;
  return (
    <figure className="ap-proj__card" style={style}>
      {image ? (
        <picture>
          {mobile && <source media="(max-width: 719px)" srcSet={mobile.image} width={mobile.width} height={mobile.height} />}
          <img className="ap-proj__media" src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        </picture>
      ) : (
        <div className="ap-proj__media" role="img" aria-label={alt}><span className="label">Imagen</span></div>
      )}
      <figcaption className="ap-proj__cap"><span>{index}</span><span>{title}</span></figcaption>
    </figure>
  );
}
