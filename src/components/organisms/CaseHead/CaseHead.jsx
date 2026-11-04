// Cabecera del proyecto: número y categoría, el nombre gigante y la fila de datos (rol, reconocimiento, lugar).
export function CaseHead({ index, eyebrow, name, meta }) {
  return (
    <section className="ap-case-wrap ap-case-head">
      <div className="ap-case-head__inner">
        <p className="ap-case-eyebrow ap-case-mono">{index} · {eyebrow}</p>
        <h1 className="ap-case-title">{name}</h1>
        <dl className="ap-case-meta">
          {meta.map((m) => (
            <div key={m.label}><dt className="ap-case-mono">{m.label}</dt><dd>{m.value}</dd></div>
          ))}
        </dl>
      </div>
    </section>
  );
}
