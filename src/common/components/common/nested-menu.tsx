'use client';

import React, {
  Children,
  cloneElement,
  createContext,
  ElementType,
  isValidElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@lib/utils';
import { Collapsible, CollapsibleContent } from '@reui/ui/collapsible';

interface NestedMenuProps {
  className?: string;
  children: React.ReactNode;
  multipleExpand?: boolean;
  matchPath?: (path: string) => boolean;
  ref?: React.Ref<HTMLDivElement>;
}

interface NestedMenuButtonProps {
  children?: ReactNode;
  href?: string;
  className?: string;
  asChild?: boolean;
  slots?: { link?: ElementType };
  onClick?: () => void;
}

interface NestedMenuContextProps {
  multipleExpand: boolean;
  setOpenItem: (parent: string, id: string, forceOpen?: boolean) => void;
  isOpenItem: (parent: string, id: string) => boolean;
  matchPath: (path: string) => boolean;
}

interface NestedMenuProviderProps {
  children: ReactNode;
  multipleExpand?: boolean;
  matchPath?: (path: string) => boolean;
}

interface NestedMenuItemProps {
  children?: ReactNode;
  open?: boolean;
  here?: boolean;
  active?: boolean;
  className?: string;
  parent?: string;
  toggle?: boolean;
  value?: string;
}
interface NestedMenuItemContext {
  id?: string;
  parent?: string;
  toggle: boolean;
  isOpen: boolean;
  isHere: boolean;
  handleToggle: () => void;
  className?: string;
}

interface NestedMenuItemProviderProps {
  children: ReactNode;
  value: NestedMenuItemContext;
}

interface NestedMenuSubProps {
  children?: ReactNode;
  className?: string;
}

const NestedMenuContext = createContext<NestedMenuContextProps | undefined>(
  undefined,
);
const NestedMenuItemContext = createContext<NestedMenuItemContext | undefined>(
  undefined,
);

function NestedMenu({
  className,
  children,
  matchPath,
  multipleExpand = false,
}: NestedMenuProps) {
  return (
    <NestedMenuProvider multipleExpand={multipleExpand} matchPath={matchPath}>
      <div className={cn(className)}>{children}</div>
    </NestedMenuProvider>
  );
}

function useNestedMenu() {
  const context = useContext(NestedMenuContext);
  if (!context) {
    throw new Error('useNestedMenu must be used within a NestedMenuProvider');
  }
  return context;
}

function NestedMenuProvider({
  children,
  multipleExpand = false,
  matchPath = () => false,
}: NestedMenuProviderProps) {
  const [openItems, setOpenItems] = useState<{
    [parent: string]: { [id: string]: boolean };
  }>({});

  const setOpenItem = (parent: string, value: string, forceOpen?: boolean) => {
    setOpenItems((prevState) => {
      const isCurrentlyOpen = prevState[parent]?.[value];
      const shouldOpen = forceOpen !== undefined ? forceOpen : !isCurrentlyOpen;

      if (multipleExpand) {
        return {
          ...prevState,
          [parent]: {
            ...prevState[parent],
            [value]: shouldOpen,
          },
        };
      } else {
        return {
          ...prevState,
          [parent]: { [value]: shouldOpen },
        };
      }
    });
  };

  const isOpenItem = (parent: string, id: string) => !!openItems[parent]?.[id];

  const providerValue = {
    multipleExpand,
    setOpenItem,
    isOpenItem,
    matchPath,
  };

  return (
    <NestedMenuContext.Provider value={providerValue}>
      {children}
    </NestedMenuContext.Provider>
  );
}

function NestedMenuButton({
  children,
  href,
  className,
  slots = {},
  onClick,
}: NestedMenuButtonProps) {
  const { matchPath } = useNestedMenu();
  const { isOpen, isHere, toggle, handleToggle, id } = useNestedMenuItem();

  const Comp = slots.link || 'button';
  const isActive = href && matchPath ? matchPath(href) : false;

  const handleClick = () => {
    if (onClick) onClick();
    if (toggle) handleToggle();
  };

  return (
    <Comp
      {...(href ? { href: href } : {})}
      {...(isActive ? { 'data-active': true } : {})}
      {...(isOpen ? { 'data-open': true } : {})}
      {...(isHere ? { 'data-here': true } : {})}
      className={cn(className)}
      onClick={handleClick}
      role="button"
      aria-haspopup={toggle ? 'true' : undefined}
      aria-expanded={isOpen}
      aria-controls={id}
    >
      {children}
    </Comp>
  );
}

function NestedMenuItem({
  children,
  toggle = false,
  open = false,
  here,
  className,
  parent,
  value,
}: NestedMenuItemProps) {
  const { matchPath, isOpenItem, setOpenItem, multipleExpand } =
    useNestedMenu();

  const hasHrefOrChildren = (
    props: unknown,
  ): props is { href?: string; children?: ReactNode } => {
    return (
      typeof props === 'object' &&
      props !== null &&
      ('href' in props || 'children' in props)
    );
  };

  const checkActiveChild = (nodes: ReactNode): boolean => {
    for (const child of Children.toArray(nodes)) {
      if (isValidElement(child) && hasHrefOrChildren(child.props)) {
        if (child.props.href && matchPath(child.props.href)) return true;

        if (child.type === NestedMenuSub || child.type === NestedMenuItem) {
          if (checkActiveChild(child.props.children)) return true;
        }

        if (child.props.children) {
          if (checkActiveChild(child.props.children)) return true;
        }
      }
    }
    return false;
  };

  const hasActiveChild = checkActiveChild(children);
  const [isHere, setIsHere] = useState(here || hasActiveChild);
  const [defaultOpen, setDefaultOpen] = useState(open || hasActiveChild);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    setIsHere(hasActiveChild);
    if (hasActiveChild) setDefaultOpen(true);
  }, [hasActiveChild]);

  useEffect(() => {
    if (multipleExpand === false && value && parent) {
      setIsOpen(isOpenItem(parent, value) || defaultOpen);
    }
  }, [multipleExpand, isOpenItem, defaultOpen, parent, value]);

  const handleToggle = () => {
    if (multipleExpand || !value || !parent) {
      setIsOpen(!isOpen);
    } else {
      setOpenItem(parent, value, !isOpen);
      setIsOpen(!isOpen);
    }
    setDefaultOpen(false);
  };

  let triggerContent: ReactNode = null;
  let submenuContent: ReactNode = null;

  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === NestedMenuSub) {
      submenuContent = child;
    } else if (isValidElement(child) && child.type === NestedMenuButton) {
      triggerContent = child;
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const triggerWithClick = isValidElement(triggerContent)
    ? cloneElement(triggerContent, {
        value,
        onClick: handleToggle,
        role: 'button',
        'aria-haspopup': submenuContent ? 'true' : undefined,
        'aria-expanded': isOpen,
        'aria-controls': value,
      })
    : triggerContent;

  const contextValue = {
    value,
    parent, // Exposing parent in the context
    isOpen,
    isHere,
    toggle,
    handleToggle,
    className,
  };

  return (
    <NestedMenuItemProvider value={contextValue}>
      <div
        className={cn(className)}
        data-open={isOpen ? 'true' : 'false'}
        data-here={isHere ? 'true' : undefined}
      >
        {children}
      </div>
    </NestedMenuItemProvider>
  );
}

function useNestedMenuItem(): NestedMenuItemContext {
  const context = useContext(NestedMenuItemContext);
  if (!context)
    throw new Error(
      'useNestedMenuItemContext must be used within a NestedMenuItemProvider',
    );
  return context;
}

function NestedMenuItemProvider({
  children,
  value,
}: NestedMenuItemProviderProps) {
  return (
    <NestedMenuItemContext.Provider value={value}>
      {children}
    </NestedMenuItemContext.Provider>
  );
}

function NestedMenuSub({ children, className }: NestedMenuSubProps) {
  const { isOpen } = useNestedMenuItem();

  return (
    <Collapsible open={isOpen} className={cn(className)}>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

export {
  NestedMenu,
  NestedMenuButton,
  NestedMenuItem,
  NestedMenuSub,
  useNestedMenu,
  useNestedMenuItem,
  type NestedMenuButtonProps,
  type NestedMenuItemProps,
  type NestedMenuProps,
  type NestedMenuSubProps,
};
