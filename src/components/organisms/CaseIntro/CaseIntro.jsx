// Introducción: a un lado los enlaces y el stack, al otro qué es el proyecto; debajo, cuatro cifras.
export function CaseIntro({ labels, links, stack, lead, body, facts }) {
  return (
    <section className="ap-case-wrap ap-case-intro">
      <div className="ap-case-intro__grid">
        <div className="ap-case-intro__side">
          <p className="ap-case-label ap-case-mono">{labels.project}</p>
          {links.length > 0 && (
            <nav className="ap-case-links" aria-label={labels.links}>
              {links.map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer">{l.label} <span aria-hidden="true">↗</span></a>
              ))}
            </nav>
          )}
          <div className="ap-case-stack">
            <p className="ap-case-label ap-case-mono">{labels.stack}</p>
            <ul className="ap-case-chips">
              {stack.map((s) => <li key={s} className="ap-case-chip ap-case-mono">{s}</li>)}
            </ul>
          </div>
        </div>
        <div>
          <p className="ap-case-lead">{lead}</p>
          <p className="ap-case-body">{body}</p>
        </div>
      </div>
      <div className="ap-case-facts">
        {facts.map((f) => (
          <div key={f.l} className="ap-case-fact"><p className="ap-case-fact__n">{f.n}</p><p className="ap-case-fact__l">{f.l}</p></div>
        ))}
      </div>
    </section>
  );
}
