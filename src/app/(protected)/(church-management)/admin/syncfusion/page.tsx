import { Metadata } from 'next';
import { Container } from '@components/common/container';
import {
  Toolbar,
  ToolbarActions,
  ToolbarHeading,
} from '@components/common/toolbar';
import SearchPage from './components/search';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@reui/ui/breadcrumb';
import { Card } from '@reui/ui/card';

export const metadata: Metadata = {
  title: 'Departments',
  description: 'Kids Church - Departments',
};

export default async function Page() {
  return (
    <>
      <Container>
        <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <Toolbar>
            <ToolbarHeading>
              {/* <ToolbarTitle>Syncfusion</ToolbarTitle> */}
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Admin</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Syncfusion</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </ToolbarHeading>
            <ToolbarActions></ToolbarActions>
          </Toolbar>
          <SearchPage />
        </Card>
      </Container>
    </>
  );
}
