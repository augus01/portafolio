import { ImmersiveLandingTemplate } from '../../templates/ImmersiveLandingTemplate';
import { AboutSection } from '../../organisms/AboutSection';
import { ProjectsSection } from '../../organisms/ProjectsSection';
import { ContactSection } from '../../organisms/ContactSection';
import { nav, hero, about, projects, contact } from '../../../content/home';

export function HomePage() {
  return (
    <ImmersiveLandingTemplate nav={nav} hero={hero}>
      <AboutSection {...about} />
      <ProjectsSection {...projects} />
      <ContactSection {...contact} />
    </ImmersiveLandingTemplate>
  );
}
