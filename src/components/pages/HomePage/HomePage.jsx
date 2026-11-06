import { useEffect } from 'react';
import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { SkillsSection } from '../../organisms/SkillsSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { ContactSection } from '../../organisms/ContactSection';
import * as es from '../../../content/home';
import * as en from '../../../content/en/home';
import { useLang } from '../../../hooks/useLang';
import { pickLang } from '../../../lib/lang';

// Portada en el idioma elegido (inglés por defecto); la píldora de idioma de la nav cambia todo sin recargar.
export function HomePage() {
  const { lang, toggle } = useLang();
  const { nav, mobileMenu, hero, about, skills, projects, contact, footer, langToggle, meta } = pickLang(lang, { en, es });
  useEffect(() => { document.title = meta.documentTitle; }, [meta]);
  return (
    <ImmersiveLandingTemplate nav={nav} mobileMenu={mobileMenu} hero={hero} footer={footer} langToggle={{ ...langToggle, onSelect: toggle }}>
      <AboutSection {...about} />
      <SkillsSection {...skills} />
      <ProjectsSection {...projects} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
