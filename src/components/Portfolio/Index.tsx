import PortfolioLayout from './PortfolioLayout';
import AboutSection from './AboutSection';
import ProjectsSection from './ProjectsSection';
import SkillsSection from './SkillsSection';
import ExperienceSection from './ExperienceSection';
import ContactSection from './ContactSection';
import type { SectionId } from '../../three/sections';

interface PortfolioProps {
  isVisible?: boolean;
  onActiveSectionChange?: (id: SectionId) => void;
}

export default function Portfolio({ isVisible = false, onActiveSectionChange }: PortfolioProps) {
  return (
    <PortfolioLayout isVisible={isVisible} onActiveSectionChange={onActiveSectionChange}>
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