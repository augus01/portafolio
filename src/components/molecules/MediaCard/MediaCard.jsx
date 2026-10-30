// Card de proyecto: imagen (o marco de relleno con nombre accesible) y pie con número y título.
export function MediaCard({ index, title, image, alt }) {
  return (
    <figure className="ap-proj__card">
      {image
        ? <img className="ap-proj__media" src={image} alt={alt} loading="lazy" />
        : <div className="ap-proj__media" role="img" aria-label={alt}><span className="label">Imagen</span></div>}
      <figcaption className="ap-proj__cap"><span>{index}</span><span>{title}</span></figcaption>
    </figure>
  );
}
