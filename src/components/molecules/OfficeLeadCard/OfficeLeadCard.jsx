// Ficha del recado que arma recepción: nombre, qué necesita, correo y lo que preguntó, con enviar y corregir.
export function OfficeLeadCard({ card, labels, note, onSend, onFix }) {
  return (
    <div className="ap-ofd__card">
      <p className="ap-ofd__cardk label">{labels.title}</p>
      <dl className="ap-ofd__dl body-sm">
        <dt>{labels.name}</dt><dd>{card.name}</dd>
        <dt>{labels.need}</dt><dd>{card.need}</dd>
        <dt>{labels.email}</dt><dd>{card.email}</dd>
        <dt>{labels.topics}</dt><dd>{card.topics}</dd>
      </dl>
      <div className="ap-ofd__chips">
        <button type="button" className="ap-ofd__chip ap-ofd__chip--main body-sm" onClick={onSend}>{labels.send}</button>
        <button type="button" className="ap-ofd__chip body-sm" onClick={onFix}>{labels.fix}</button>
      </div>
      <p className="ap-ofd__note label">{note}</p>
    </div>
  );
}
