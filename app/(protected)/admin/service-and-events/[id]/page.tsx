'use client';

// import { Metadata } from 'next';
import { Container } from '@/app/components/common/container';
import RecordPage from './components/record';
// import { BreadcrumbComponent, BreadcrumbItemDirective, BreadcrumbItemsDirective } from '@syncfusion/ej2-react-navigations';
// import { Toolbar, ToolbarActions } from '@/app/components/common/toolbar';
// import Link from 'next/link';
// import { Button } from '@/components/ui/button';
// import { MoveLeft } from 'lucide-react';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';

export default function Page() {
  const isLoading = false; // Define isLoading with an initial value

  return (
    <>
      <Container>
        {/* <Card className="w-full h-full p-4 mt-4 bg-white dark:bg-gray-800 shadow-md rounded-lg"> */}
          {/* {params.id != 'new' ? <BreadcrumbComponent enableNavigation={false} className='mb-4'>
            <BreadcrumbItemsDirective>
              <BreadcrumbItemDirective iconCss="e-icons e-home" />
              <BreadcrumbItemDirective text="Admin" />
              <BreadcrumbItemDirective text="Service and Events" />
            </BreadcrumbItemsDirective>
          </BreadcrumbComponent> : */}
          
            {/* <Toolbar>
              {params.id == 'new' ? <ButtonComponent cssClass='e-primary' iconCss='e-icons e-save'>Save Changes</ButtonComponent> : null }
              {params.id != 'new' ? <ButtonComponent cssClass='e-primary' iconCss='e-icons e-save'>Delete</ButtonComponent> : null }
              <ButtonComponent cssClass='e-warning' iconCss='e-icons e-repeat'>Discard</ButtonComponent>
              <div className="flex w-full justify-between items-center"></div>
              <ToolbarActions>
              <ButtonComponent iconCss='e-icons e-arrow-left'>Back to service</ButtonComponent>              
              </ToolbarActions>
            </Toolbar> */}
          {/* } */}
          
        {/* </Card> */}
        <RecordPage
            id={'new'}
            isLoading={isLoading}
          />
      </Container>
    </>
  );
}
