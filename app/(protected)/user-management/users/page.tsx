import { Metadata } from 'next';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Container } from '@/app/components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@/app/components/common/toolbar';
import UserList from './components/user-list';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'Users',
  description: 'Manage users.',
};

export default async function UsersPage() {
  return (
    <>
      <Container>
        <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarTitle>Users</ToolbarTitle>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>User Management</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </ToolbarHeading>
            <ToolbarActions></ToolbarActions>
          </Toolbar>
          <UserList />
        </Card>
      </Container>
    </>
  );
}
