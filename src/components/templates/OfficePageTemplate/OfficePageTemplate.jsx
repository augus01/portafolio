// Estructura de la página de la oficina: a pantalla completa, cabecera arriba y la maqueta llenando el resto.
export function OfficePageTemplate({ header, children }) {
  return (
    <div className="ap-ofp">
      {header}
      <main className="ap-ofp__main">{children}</main>
    </div>
  );
}
