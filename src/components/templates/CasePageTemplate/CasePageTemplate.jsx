// Estructura de la página de un proyecto: nav del landing (fuera del main, pegada al tope), botón de volver, cabecera, portada, introducción, escenarios, siguiente y pie.
// `theme` pinta las variables del proyecto (--case-brand, --case-tint…) en la raíz.
export function CasePageTemplate({ theme, nav, back, head, cover, intro, stages, next, footer }) {
  const style = {
    '--case-brand': theme.brand,
    '--case-tint': theme.tint,
    ...(theme.tintInk && { '--case-tint-ink': theme.tintInk }),
    ...(theme.accent && { '--case-accent': theme.accent }),
    ...(theme.cta && { '--case-cta': theme.cta, '--case-on-cta': theme.onCta }),
  };
  return (
    <>
      {nav}
      <main className={`ap-case${theme.dark ? ' ap-case--dark-tint' : ''}`} style={style}>
      {back}
      {head}
      {cover}
      {intro}
      {stages}
      {next}
      </main>
      {footer}
    </>
  );
}
