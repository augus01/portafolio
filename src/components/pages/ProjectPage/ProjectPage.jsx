import { useEffect, useRef } from 'react';
import { CasePageTemplate } from '../../templates/CasePageTemplate';
import { CaseTopBar } from '../../molecules/CaseTopBar';
import { CaseHead } from '../../organisms/CaseHead';
import { CaseCover } from '../../organisms/CaseCover';
import { CaseIntro } from '../../organisms/CaseIntro';
import { CaseStage } from '../../organisms/CaseStage';
import { CaseNext } from '../../organisms/CaseNext';
import { CaseFooter } from '../../organisms/CaseFooter';
import { useCaseParallax } from '../../../hooks/useCaseParallax';
import { casePage, getCase } from '../../../content/projects';

// Página dedicada de un proyecto (/proyectos/<slug>/). Si el slug no existe, vuelve a la galería.
export function ProjectPage({ slug }) {
  const data = getCase(slug);
  const rootRef = useRef(null);
  useCaseParallax(rootRef);

  useEffect(() => {
    if (!data) { window.location.replace(casePage.back.href); return; }
    document.title = casePage.documentTitle(data.name);
  }, [data]);

  if (!data) return null;
  return (
    <div ref={rootRef}>
      <CasePageTemplate
        theme={data.theme}
        top={<CaseTopBar home={casePage.home} nav={casePage.nav} back={casePage.back} />}
        head={<CaseHead index={data.index} eyebrow={data.eyebrow} name={data.name} meta={data.meta} />}
        cover={<CaseCover label={casePage.coverLabel} cta={data.cta} {...data.cover} />}
        intro={<CaseIntro labels={{ project: casePage.projectLabel, links: casePage.linksLabel, stack: casePage.stackLabel }} {...data.intro} facts={data.facts} />}
        stages={data.stages.map((s) => <CaseStage key={s.label} {...s} />)}
        next={<CaseNext labels={casePage.next} next={data.next} />}
        footer={<CaseFooter items={casePage.footer} />}
      />
    </div>
  );
}
