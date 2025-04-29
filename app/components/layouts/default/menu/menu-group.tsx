import { ReactNode } from 'react';

export interface MenuGroupProps {
  children: ReactNode;
}

export function MenuGroup({ children, ...props }: MenuGroupProps) {
  const classes = 'flex flex-col gap-2.5 grow';

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}
