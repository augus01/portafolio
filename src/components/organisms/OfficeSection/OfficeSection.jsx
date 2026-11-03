import { Office } from '../Office';
import { OfficeThemeSwitcher } from '../../molecules/OfficeThemeSwitcher';
import { useOfficeSwap } from '../../../hooks/useOfficeSwap';

// "Visita mi oficina": título y pista visible a la izquierda, selector de serie a la derecha y la maqueta 3D
// de los agentes debajo. Elegir una serie tapa la maqueta con cuadrados y la redecora.
export function OfficeSection({ id, title, subtitle, themes, office }) {
  const swap = useOfficeSwap(themes.items[0].id);
  const target = themes.items.find((t) => t.id === swap.target) || null;
  return (
    <section id={id} className="ap-section ap-section--continued ap-office">
      <div className="ap-office__top ap-reveal">
        <header className="ap-office__head">
          <h3 className="ap-office__title subheading">{title}</h3>
          <p className="ap-office__subtitle subheading">{subtitle}</p>
        </header>
        <OfficeThemeSwitcher
          label={themes.label}
          nowLabel={themes.nowLabel}
          items={themes.items}
          current={swap.theme}
          selected={swap.target || swap.theme}
          busy={swap.busy}
          onPick={swap.go}
        />
      </div>
      <Office
        {...office}
        theme={swap.theme}
        curtain={{
          overlayRef: swap.overlayRef, phase: swap.phase, cells: swap.cells, cols: swap.cols, rows: swap.rows,
          progress: swap.progress, item: target, loadingLabel: themes.loadingLabel,
        }}
        className="ap-reveal"
      />
    </section>
  );
}
