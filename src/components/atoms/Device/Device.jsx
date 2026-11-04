// Marco de dispositivo para una captura real: laptop (tapa, mentón y base), teléfono o tablet. Los radios van en
// porcentaje para que escalen con el ancho que le dé su contenedor.
// Tamaño real de las capturas de cada dispositivo (los artboards del artefacto).
const SIZE = { laptop: { width: 1508, height: 784 }, phone: { width: 387, height: 784 }, tablet: { width: 813, height: 1150 } };

export function Device({ kind = 'phone', src, alt, eager = false, className }) {
  const { width, height } = SIZE[kind];
  const img = <img src={src} alt={alt} width={width} height={height} decoding="async" loading={eager ? 'eager' : 'lazy'} />;
  if (kind === 'laptop') {
    return (
      <div className={['ap-dev-laptop', className].filter(Boolean).join(' ')}>
        <div className="ap-dev-laptop__lid"><div className="ap-dev-laptop__screen">{img}</div></div>
        <div className="ap-dev-laptop__chin" />
        <div className="ap-dev-laptop__base" />
      </div>
    );
  }
  return <div className={[`ap-dev-${kind}`, className].filter(Boolean).join(' ')}>{img}</div>;
}
