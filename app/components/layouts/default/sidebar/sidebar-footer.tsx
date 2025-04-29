'use client';

import React, { forwardRef, HTMLAttributes } from 'react';
import { BellDot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Notifications } from '@/app/components/notifications';
import { SidebarThemeSwitcherToggle, SidebarUser } from '.';

const SidebarFooter = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="flex items-center justify-between gap-1.5 shrink-0 p-5"
      {...props}
    >
      <SidebarUser />
      <div className="flex items-center gap-2.5">
        <SidebarThemeSwitcherToggle />
        <Notifications
          trigger={
            <Button
              mode="icon"
              size="sm"
              className="bg-transparent text-white data-[state=open]:bg-sidebar-button-highlight hover:bg-sidebar-button-highlight relative"
            >
              <BellDot />
              <span className="absolute bg-success flex size-2.5 border-2 border-page rounded-full -top-0.5 -end-0.5 animate-pulse"></span>
            </Button>
          }
        />
      </div>
    </div>
  );
});

SidebarFooter.displayName = 'SidebarFooter';

export { SidebarFooter };
