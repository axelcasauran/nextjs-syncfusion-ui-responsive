'use client';

// Ensure this component runs on the client side
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // ✅ Use usePathname instead of useRouter

import { Menu } from 'lucide-react';
import { Button } from '@reui/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@reui/ui/sheet';
import { Container } from '@components/common/container';
import { Sidebar } from '../sidebar';

const Header = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname(); // Get the current route

  // Close sheet on route change
  useEffect(() => {
    setOpen(false); // Close sheet when route changes
  }, [pathname]); // Depend on pathname to trigger updates

  return (
    <header className="flex lg:hidden items-center fixed z-10 top-0 start-0 end-0 shrink-0 bg-page h-(--mobile-header-height)">
      <Container className="flex items-center justify-between flex-wrap gap-3">
        <Link href="/">
          <Image
            src={'/brand/logo-icon-dark.svg'}
            height={0}
            width={35}
            alt=""
          />
        </Link>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              mode="icon"
              className="size-8 bg-transparent text-white hover:bg-sidebar-button"
            >
              <Menu className="size-5!" />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="border-0 p-0 w-[225px]"
            forceMount={true}
            side="left"
            close={false}
          >
            <SheetHeader className="sr-only">
              <SheetTitle>Mobile Menu</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>
            <Sidebar />
          </SheetContent>
        </Sheet>
      </Container>
    </header>
  );
};

export { Header };
