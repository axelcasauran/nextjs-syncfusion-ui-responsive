'use client';

import { forwardRef, HTMLAttributes } from 'react';

export const SidebarHeader = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div ref={ref} className="hidden lg:flex flex-col gap-7 p-5" {...props}>
      {/* <div className="flex flex-col gap-2.5 pt-2.5">
        <Link href="/" className="text-white">
          <Image
            src={'/brand/logo.svg'}
            height={0}
            width={40}
            alt=""
          />
        </Link>
      </div> */}
      {/* <div className="flex items-center gap-1.5">
        <SidebarAddNew />
        <SearchDialog
          trigger={
            <Button
              mode="icon"
              size="sm"
              className="text-white bg-sidebar-button hover:bg-sidebar-button-highlight data-[state=open]:bg-sidebar-button-highlight"
            >
              <Search />
            </Button>
          }
        />
      </div> */}
    </div>
  );
});

SidebarHeader.displayName = 'SidebarHeader';
