'use client';
// import { Metadata } from 'next';
import { Container } from '@/app/components/common/container';
import SearchPage from './components/search';
// import { Card } from '@/components/ui/card';
// import { BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbItemsDirective } from '@syncfusion/ej2-react-navigations';

// export const metadata: Metadata = {
//   title: 'Service and Events',
//   description: 'Kids Church - Service and Events',
// };

export default function Page() {
  return (
    <>
      <Container>
        {/* <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg">
          <BreadcrumbComponent enableNavigation={false} className='mb-4'>
            <BreadcrumbItemsDirective>
              <BreadcrumbItemDirective iconCss="e-icons e-home" />
              <BreadcrumbItemDirective text="Admin" />
              <BreadcrumbItemDirective text="Service and Events" />
            </BreadcrumbItemsDirective>
          </BreadcrumbComponent>
          <SearchPage />
        </Card> */}
        <SearchPage />
      </Container>
    </>
  );
}
