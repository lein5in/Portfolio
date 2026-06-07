import PortfolioLayout from './PortfolioLayout';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';
import type { SectionId } from './GlobePortfolio';

interface PortfolioProps {
  isVisible?: boolean;
}

export default function Portfolio({ isVisible = false }: PortfolioProps) {
  return (
    <PortfolioLayout isVisible={isVisible}>
      {(_: SectionId, setRef: (id: SectionId) => (el: HTMLElement | null) => void) => (
        <>
          <AboutSection      setRef={setRef} />
          <ProjectsSection   setRef={setRef} />
          <SkillsSection     setRef={setRef} />
          <ExperienceSection setRef={setRef} />
          <ContactSection    setRef={setRef} />
        </>
      )}
    </PortfolioLayout>
  );
}