// Card de proyecto: imagen (o marco de relleno con nombre accesible) y pie con número y título.
// `width` y `height` son las medidas reales de la imagen: fijan su proporción en la fila (--card-ratio)
// y reservan su espacio antes de cargar. Sin imagen, la card es cuadrada.
export function MediaCard({ index, title, image, alt, width, height }) {
  const style = width && height ? { '--card-ratio': width / height } : undefined;
  return (
    <figure className="ap-proj__card" style={style}>
      {image
        ? <img className="ap-proj__media" src={image} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
        : <div className="ap-proj__media" role="img" aria-label={alt}><span className="label">Imagen</span></div>}
      <figcaption className="ap-proj__cap"><span>{index}</span><span>{title}</span></figcaption>
    </figure>
  );
}
