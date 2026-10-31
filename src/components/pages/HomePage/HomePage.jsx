import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { OfficeSection } from '../../organisms/OfficeSection';
import { ContactSection } from '../../organisms/ContactSection';
import { nav, mobileMenu, hero, about, projects, office, contact } from '../../../content/home';

export function HomePage() {
  return (
    <ImmersiveLandingTemplate nav={nav} mobileMenu={mobileMenu} hero={hero}>
      <AboutSection {...about} />
      <ProjectsSection {...projects} />
      <OfficeSection {...office} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
