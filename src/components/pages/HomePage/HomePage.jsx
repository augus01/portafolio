import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { ContactSection } from '../../organisms/ContactSection';
import { nav, mobileMenu, hero, about, projects, contact } from '../../../content/home';

export function HomePage() {
  return (
    <ImmersiveLandingTemplate nav={nav} mobileMenu={mobileMenu} hero={hero}>
      <AboutSection {...about} />
      <ProjectsSection {...projects} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
