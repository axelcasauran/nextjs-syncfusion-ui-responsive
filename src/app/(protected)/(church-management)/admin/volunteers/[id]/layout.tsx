'use client';

import React, { use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { MoveLeft } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@reui/ui/breadcrumb';
import { Button } from '@reui/ui/button';
import { Container } from '@components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@components/common/toolbar';
import { UserProvider } from './components/volunteer-context';
import UserHero from './components/volunteer-hero';
import { Card } from '@reui/ui/card';

export default function UserLayout({
  params,
  children,
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) {
  // 1) Unwrap the params Promise
  const { id } = use(params);
  const router = useRouter();


  const { data: user, isLoading } = useQuery({
    queryKey: ['user-user', id],
    queryFn: async () => {
      const response = await fetch(`/api/user-management/users/${id}`);

      if (response.status == 404) {
        router.push('/admin/volunteers');
      }

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // 60 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });

  return (
    <UserProvider user={user} isLoading={isLoading}>
      <Container>
        <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
        <Toolbar>
          <ToolbarHeading>
            <ToolbarTitle>Volunteers</ToolbarTitle>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Kids Church</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Volunteers</BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/admin/volunteers">User</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </ToolbarHeading>
          <ToolbarActions>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/volunteers">
                <MoveLeft /> Back to volunteers
              </Link>
            </Button>
          </ToolbarActions>
        </Toolbar>
        <UserHero user={user} isLoading={isLoading} />
        {children}
        </Card>
      </Container>
    </UserProvider>
  );
}
