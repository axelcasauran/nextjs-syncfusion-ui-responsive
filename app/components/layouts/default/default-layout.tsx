'use client';

import { ReactNode } from 'react';
import useBodyClasses from '@/hooks/use-body-classes';
import { SearchProvider } from '../../search';
import { Wrapper } from './common';

interface IDefaultLayoutProps {
  children: ReactNode;
}

const DefaultLayout = ({ children }: IDefaultLayoutProps) => {
  useBodyClasses('bg-page lg:overflow-hidden!');

  return (
    <SearchProvider>
      <Wrapper>{children}</Wrapper>
    </SearchProvider>
  );
};

export { DefaultLayout };
