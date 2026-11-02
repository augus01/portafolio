import { Logo } from '../../atoms/Logo';
import { Link } from '../../atoms/Link';

// Pie oscuro (design-system/components/Footer): logo blanco, enlaces y nota final con el año.
export function Footer({ links = [], note, year = String(new Date().getFullYear()), className }) {
  return (
    <footer className={['ap-footer', className].filter(Boolean).join(' ')}>
      <div className="ap-footer__inner">
        <Logo tone="light" height={28} />
        {links.length > 0 && (
          <ul className="ap-social">
            {links.map((link) => (
              <li key={link.label}><Link href={link.href} external={link.external} onDark>{link.label}</Link></li>
            ))}
          </ul>
        )}
        <p className="ap-footer__note label">{note} · {year}</p>
      </div>
    </footer>
  );
}
