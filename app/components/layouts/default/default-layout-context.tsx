'use client';

import {
  createContext,
  useContext,
  useState,
  type PropsWithChildren,
} from 'react';

export interface IDefaultLayoutProviderProps {
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
}

const initalLayoutProps: IDefaultLayoutProviderProps = {
  mobileSidebarOpen: false,
  setMobileSidebarOpen: (open: boolean) => {
    console.log(`${open}`);
  },
};

const DefaultLayoutContext =
  createContext<IDefaultLayoutProviderProps>(initalLayoutProps);

export const useDefaultLayout = () => useContext(DefaultLayoutContext);

export const DefaultLayoutProvider = ({ children }: PropsWithChildren) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <DefaultLayoutContext.Provider
      value={{
        mobileSidebarOpen,
        setMobileSidebarOpen,
      }}
    >
      {children}
    </DefaultLayoutContext.Provider>
  );
};
