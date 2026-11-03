import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { SkillsSection } from '../../organisms/SkillsSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { ContactSection } from '../../organisms/ContactSection';
import { nav, mobileMenu, hero, about, skills, projects, contact, footer } from '../../../content/home';

export function HomePage() {
  return (
    <ImmersiveLandingTemplate nav={nav} mobileMenu={mobileMenu} hero={hero} footer={footer}>
      <AboutSection {...about} />
      <SkillsSection {...skills} />
      <ProjectsSection {...projects} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
