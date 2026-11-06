// Logo completo de un proyecto: imagen (Inkvibe) o símbolo + nombre en la tipografía de la marca (Rumbo a Casa, Zam).
// Lo usan la portada del caso y "Otros proyectos".
export function CaseLockup({ brand, image, width, height, alt, symbol, symbolWidth, symbolHeight, wordmark, lazy }) {
  const load = lazy ? { loading: 'lazy', decoding: 'async' } : {};
  if (image) return <img className={`ap-case-cover__logo ap-case-cover__logo--${brand}`} src={image} width={width} height={height} alt={alt} {...load} />;
  return (
    <span className={`ap-case-lockup ap-case-lockup--${brand}`} role="img" aria-label={wordmark}>
      <img className="ap-case-lockup__symbol" src={symbol} width={symbolWidth} height={symbolHeight} alt="" {...load} />
      <span className="ap-case-lockup__word" aria-hidden="true">{wordmark}</span>
    </span>
  );
}
