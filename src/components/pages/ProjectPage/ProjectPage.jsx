import { useEffect, useId, useRef } from 'react';
import { CasePageTemplate } from '../../templates/CasePageTemplate';
import { NavBar } from '../../molecules/NavBar';
import { MobileNavBar } from '../../molecules/MobileNavBar';
import { MobileMenu } from '../../organisms/MobileMenu';
import { CaseHead } from '../../organisms/CaseHead';
import { CaseCover } from '../../organisms/CaseCover';
import { CaseIntro } from '../../organisms/CaseIntro';
import { CaseStage } from '../../organisms/CaseStage';
import { CaseNext } from '../../organisms/CaseNext';
import { Footer } from '../../organisms/Footer';
import { useCaseParallax } from '../../../hooks/useCaseParallax';
import { useMobileMenu } from '../../../hooks/useMobileMenu';
import * as es from '../../../content/projects';
import * as en from '../../../content/en/projects';
import { langToggle as esToggle } from '../../../content/home';
import { langToggle as enToggle } from '../../../content/en/home';
import { useLang } from '../../../hooks/useLang';
import { pickLang } from '../../../lib/lang';

// Página dedicada de un proyecto (/proyectos/<slug>/), con la misma nav del landing (sin el paso del hero: siempre
// visible y clara). Si el slug no existe, vuelve a la galería.
export function ProjectPage({ slug }) {
  const { lang, toggle } = useLang();
  const { casePage, getCase } = pickLang(lang, { en, es });
  const langToggle = { ...pickLang(lang, { en: enToggle, es: esToggle }), onSelect: toggle };
  const data = getCase(slug);
  const rootRef = useRef(null);
  const motionRef = useRef({ lenis: null, jump: false });
  const menuId = useId();
  const menu = useMobileMenu(motionRef);
  useCaseParallax(rootRef);

  useEffect(() => {
    if (!data) { window.location.replace(casePage.back.href); return; }
    document.title = casePage.documentTitle(data.name);
  }, [data, casePage]);

  if (!data) return null;
  const { nav, mobileMenu } = casePage;
  return (
    <div ref={rootRef} className="ap-page ap-page--case">
      <CasePageTemplate
        theme={data.theme}
        nav={(
          <div className="ap-navwrap is-static">
            <NavBar items={nav.items} actions={nav.actions} brand={nav.brand} labels={nav.labels} langToggle={langToggle} tone="light" />
            <MobileNavBar tone="light" brand={nav.brand} openLabel={nav.labels?.openMenu} langToggle={langToggle} open={menu.open} menuId={menuId} onOpen={menu.openMenu} buttonRef={menu.openRef} />
            <MobileMenu id={menuId} open={menu.open} {...mobileMenu} onClose={menu.closeMenu} onNavigate={menu.navigate} closeRef={menu.closeRef} />
          </div>
        )}
        head={<CaseHead index={data.index} eyebrow={data.eyebrow} name={data.name} meta={data.meta} />}
        cover={<CaseCover label={casePage.coverLabel} cta={data.cta} building={data.building} {...data.cover} />}
        intro={<CaseIntro labels={{ project: casePage.projectLabel, links: casePage.linksLabel, stack: casePage.stackLabel }} {...data.intro} facts={data.facts} />}
        stages={data.stages.map((s) => <CaseStage key={s.label} {...s} />)}
        next={<CaseNext labels={casePage.next} others={data.others} />}
        footer={<Footer {...casePage.footer} />}
      />
    </div>
  );
}
