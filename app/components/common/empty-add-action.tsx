import { ReactNode } from 'react';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import Balancer from 'react-wrap-balancer';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const EmptyAddAction = ({
  title,
  description,
  buttonLabel,
  illustrationPath,
  backgroundDecorationPath,
  onClick,
  href,
}: {
  title: ReactNode; // The title displayed in the block
  description: ReactNode; // A brief description of the action
  buttonLabel: string; // The label for the action button
  illustrationPath: string; // Path to the main illustration
  backgroundDecorationPath?: string; // Optional background decoration image path
  onClick?: () => void; // Optional callback function for handling clicks
  href?: string; // Optional href for the button
}) => {
  return (
    <div
      className={cn(
        `focus:outline-hidden
         group relative flex flex-col gap-5 items-center justify-center grow 
         border border-dashed border-input rounded-xl py-36 hover:border-primary`,
      )}
    >
      {/* Main Illustration */}
      <img alt="" src={illustrationPath} className="bg-background z-1 h-max" />

      {/* Optional Background Decoration */}
      {backgroundDecorationPath && (
        <img
          alt="Background decoration"
          src={backgroundDecorationPath}
          className="absolute left-0 top-0 bottom-0 hidden lg:block"
        />
      )}

      {/* Text Content */}
      <div className="text-center">
        <h2 className="text-lg font-semibold mb-2 text-foreground">{title}</h2>
        <p className="text-sm mb-4 text-muted-foreground">
          <Balancer>{description}</Balancer>
        </p>

        {/* Button or Link */}
        {href ? (
          <Button asChild>
            <Link
              href={href}
              className="px-4 py-2 bg-primary text-white rounded-md text-sm hover:bg-primary-dark focus:outline-hidden"
            >
              {buttonLabel}
            </Link>
          </Button>
        ) : (
          <Button size="sm" onClick={onClick}>
            <Plus /> {buttonLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyAddAction;
