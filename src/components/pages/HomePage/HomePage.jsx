import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { SkillsSection } from '../../organisms/SkillsSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { OfficeSection } from '../../organisms/OfficeSection';
import { ContactSection } from '../../organisms/ContactSection';
import { nav, mobileMenu, hero, about, skills, projects, office, contact, footer } from '../../../content/home';

export function HomePage() {
  return (
    <ImmersiveLandingTemplate nav={nav} mobileMenu={mobileMenu} hero={hero} footer={footer}>
      <AboutSection {...about} />
      <SkillsSection {...skills} />
      <ProjectsSection {...projects} />
      <OfficeSection {...office} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
