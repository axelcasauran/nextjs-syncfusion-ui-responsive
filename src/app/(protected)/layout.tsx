'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { ScreenLoader } from '@components/common/screen-loader';
import { DefaultLayout } from '@components/layouts/default';

import { initializeSyncfusion } from '@common/utils/syncfusion-license';
if (typeof window !== 'undefined') {
  initializeSyncfusion();
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <ScreenLoader />;
  }

  return session ? <DefaultLayout>{children}</DefaultLayout> : null;
}
