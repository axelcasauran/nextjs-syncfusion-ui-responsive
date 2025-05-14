import Image from 'next/image';

const ScreenLoader = () => {
  return (
    <div className="flex flex-col items-center gap-3.5 justify-center fixed inset-0 z-50 bg-background transition-opacity duration-700 ease-in-out">
      <Image
        height={30}
        width={30}
        src={'/brand/logo-icon-light.svg'}
        alt="Kids Church"
        className="dark:hidden"
      />
      <Image
        height={30}
        width={30}
        src={'/brand/logo-icon-dark.svg'}
        alt="Kids Church"
        className="hidden dark:block"
      />
      <div className="text-muted-foreground font-medium text-sm">
        Loading...
      </div>
    </div>
  );
};

export { ScreenLoader };
