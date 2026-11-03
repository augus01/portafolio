import { Icon } from '../../atoms/Icon';
import { OfficeThemeSwitch } from '../../molecules/OfficeThemeSwitch';

// Cabecera de la página de la oficina: título y pista, selector de serie y el enlace de vuelta a recepción.
export function OfficeHeader({ title, subtitle, back, onBack, themes, swap }) {
  return (
    <header className="ap-ofp__head">
      <div className="ap-ofp__titles">
        <h1 className="ap-office__title subheading">{title}</h1>
        <p className="ap-office__subtitle subheading">{subtitle}</p>
      </div>
      <OfficeThemeSwitch
        className="ap-ofp__switch"
        label={themes.label}
        nowLabel={themes.nowLabel}
        items={themes.items}
        current={swap.current}
        target={swap.target}
        busy={swap.busy}
        onPick={swap.go}
      />
      <a className="ap-ofp__back label" href={back.href} aria-label={back.label} onClick={onBack}>
        <Icon name="arrow-left" size="md" />
        <span className="ap-ofp__backtxt">{back.label}</span>
      </a>
    </header>
  );
}
