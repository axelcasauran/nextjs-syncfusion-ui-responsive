import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const Container = ({
  children,
  width = 'fixed',
  className = '',
}: {
  children?: ReactNode;
  width?: 'fixed' | 'fluid';
  className?: string;
}) => {
  return (
    <div
      className={cn(
        'grow w-full px-3',
        width === 'fixed' ? 'mx-auto' : '',
        // width === 'fixed' ? 'mx-auto max-w-(--breakpoint-xl)' : '',
        className,
      )}
    >
      {children}
    </div>
  );
};

export { Container };
