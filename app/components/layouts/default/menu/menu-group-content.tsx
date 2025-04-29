import { ReactNode } from 'react';

export interface MenuGroupContentProps {
  children: ReactNode;
}

export function MenuGroupContent({
  children,
  ...props
}: MenuGroupContentProps) {
  const classes = 'flex flex-col gap-0.5';

  return (
    <div {...props} className={classes}>
      {children}
    </div>
  );
}
