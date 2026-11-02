// Card de proyecto: marco con la captura entera (o marco de relleno con nombre accesible) y pie con número y título.
// `width`/`height` son las medidas reales de la captura y reservan su espacio antes de cargar.
// `mobile` ({ image, width, height }) es la captura del mismo paso en teléfono: la usa el carrusel bajo 720px.
export function MediaCard({ index, title, image, alt, width, height, mobile }) {
  return (
    <figure className="ap-proj__card">
      {image ? (
        <div className="ap-proj__media">
          <picture>
            {mobile && <source media="(max-width: 719px)" srcSet={mobile.image} width={mobile.width} height={mobile.height} />}
            <img className="ap-proj__img" src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
          </picture>
        </div>
      ) : (
        <div className="ap-proj__media" role="img" aria-label={alt}><span className="label">Imagen</span></div>
      )}
      <figcaption className="ap-proj__cap"><span>{index}</span><span>{title}</span></figcaption>
    </figure>
  );
}
