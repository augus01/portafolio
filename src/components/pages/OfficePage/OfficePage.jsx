import { useEffect, useRef } from 'react';
import { PageWipe } from '../../atoms/PageWipe';
import { OfficeHeader } from '../../organisms/OfficeHeader';
import { Office } from '../../organisms/Office';
import { OfficePageTemplate } from '../../templates/OfficePageTemplate';
import { useThemeSwap } from '../../../hooks/useThemeSwap';
import { usePageWipe } from '../../../hooks/usePageWipe';
import { officePage, themes, stage, agents, chat, leadEmail } from '../../../content/office';

// "Visita mi oficina" en su propia página (/oficina/): recepción te trae desde Contacto y te devuelve allá.
export function OfficePage() {
  const stageRef = useRef(null);
  const swap = useThemeSwap(stageRef, themes.items[0].id);
  const wipe = usePageWipe();
  const target = themes.items.find((t) => t.id === swap.target) || null;

  useEffect(() => { document.title = officePage.documentTitle; }, []);

  const onBack = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    wipe.leave(officePage.back.href);
  };

  return (
    <>
      <OfficePageTemplate
        header={<OfficeHeader {...officePage} onBack={onBack} />}
      >
        <Office
          stageRef={stageRef}
          themeId={swap.current}
          themes={themes}
          swap={swap}
          swapLabel={themes.swapLabel}
          swapTarget={target}
          stage={stage}
          chat={chat}
          agents={agents}
          leadEmail={leadEmail}
        />
      </OfficePageTemplate>
      <PageWipe phase={wipe.phase} />
    </>
  );
}
