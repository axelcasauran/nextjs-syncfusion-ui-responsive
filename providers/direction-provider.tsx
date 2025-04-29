'use client';

import { DirectionProvider as RadixDirectionProvider } from '@radix-ui/react-direction';
import { useLanguage } from './i18n-provider';

const DirectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { language } = useLanguage();

  return (
    <RadixDirectionProvider dir={language.direction}>
      {children}
    </RadixDirectionProvider>
  );
};

export { DirectionProvider };
