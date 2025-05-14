import { Metadata } from 'next';
import { Container } from '@components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
  ToolbarTitle,
} from '@components/common/toolbar';
import KidList from './components/kid-list';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@reui/ui/breadcrumb';
import { Card } from '@reui/ui/card';

export const metadata: Metadata = {
  title: 'Kids',
  description: 'Parent Management - Kids',
};

export default async function Page() {
  return (
    <>
      <Container>
        <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <Toolbar>
            <ToolbarHeading>
              <ToolbarTitle>Kids</ToolbarTitle>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Parent</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Kids</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </ToolbarHeading>
            <ToolbarActions></ToolbarActions>
          </Toolbar>
          <KidList />
        </Card>
      </Container>
    </>
  );
}
