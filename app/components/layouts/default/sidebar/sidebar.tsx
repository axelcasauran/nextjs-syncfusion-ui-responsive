'use client';

import { useEffect, useRef } from 'react';
import { useResponsive, useViewport } from '@/hooks';
import { getHeight } from '@/lib/dom';
import { SidebarFooter, SidebarHeader, SidebarMenu } from '.';

export const Sidebar = () => {
  const isDesktop = useResponsive('up', 'lg');
  const headerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const [viewportHeight] = useViewport();
  const scrollableOffset = 0;

  useEffect(() => {
    let availableHeight = viewportHeight - scrollableOffset;

    if (headerRef.current) {
      availableHeight = availableHeight - getHeight(headerRef.current);
    }

    if (footerRef.current) {
      availableHeight = availableHeight - getHeight(footerRef.current);
    }

    if (contentRef.current) {
      contentRef.current.style.height = `${availableHeight}px`;
    }
  }, [viewportHeight, headerRef, footerRef, contentRef]);

  return (
    <div className="bg-page flex flex-col shrink-0 grow pt-5 lg:pt-0 lg:grow-0 lg:fixed lg:top-0 lg:bottom-0 lg:z-20 lg:w-(--sidebar-width)">
      {isDesktop && <SidebarHeader ref={headerRef} />}
      <SidebarMenu ref={contentRef} />
      <SidebarFooter ref={footerRef} />
    </div>
  );
};
