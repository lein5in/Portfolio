import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Lang = 'en' | 'fr';

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  t: (en: string, fr: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: 'en',
  toggle: () => {},
  t: (en) => en,
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>('en');
  const toggle = () => setLang(l => l === 'en' ? 'fr' : 'en');
  const t = (en: string, fr: string) => lang === 'en' ? en : fr;

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);