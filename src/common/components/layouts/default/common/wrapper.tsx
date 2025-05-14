/* eslint-disable @typescript-eslint/no-wrapper-object-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
// import { useResponsive } from '@/hooks/use-responsive';
import { Footer } from '.';
// import { Sidebar } from '../sidebar';
// import Sidebar from '@syncfusion/sidebar/sidebar';
// import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
// import { MenuComponent } from '@syncfusion/ej2-react-navigations';
import { redirect } from 'next/navigation';
// import Header from '@syncfusion/header/header';
import { AppBarComponent, SidebarComponent, TreeViewComponent } from '@syncfusion/ej2-react-navigations';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { TextBoxComponent } from '@syncfusion/ej2-react-inputs';

const Wrapper = ({ children }: { children: ReactNode }) => {
  // const isMobile = useResponsive('down', 'lg');
  // const isDesktop = useResponsive('up', 'lg');

  const resourcesDropdown = useRef<DropDownButtonComponent | null>(null);
  const brandDropdown = useRef<DropDownButtonComponent | null>(null);

  const handleResize = (): void => {
    if (resourcesDropdown.current && brandDropdown.current) {
      closeDropdown(resourcesDropdown.current);
      closeDropdown(brandDropdown.current);
    }
  };

  const closeDropdown = (dropDown: DropDownButtonComponent): void => {
    if (dropDown && dropDown.element.classList.contains('e-active')) {
      dropDown.toggle();
    }
  };

  useEffect(() => {

    window.addEventListener('resize', handleResize);

    return () => {

      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  // const menuClick = (args: any): void => {
  //     console.log(args);
  //     if (args.item) {             
  //       if (args.item.text == 'Kids') { 
  //         console.log('Kids clicked');
  //         redirect(`/parents/kids`);
  //       }
  //       else if (args.item.text == 'Volunteers') { 
  //         redirect(`/admin/volunteers`);
  //       }
  //       else if (args.item.text == 'Services') { 
  //         redirect(`/admin/service-and-events`);
  //       }
  //       else if (args.item.text == 'Syncfusion') { 
  //         redirect(`/admin/syncfusion`);
  //       }
  //       else if (args.item.text == 'Users') { 
  //         redirect(`/user-management/users`);
  //       }
  //       else if (args.item.text == 'Roles') { 
  //         redirect(`/user-management/roles`);
  //       }
  //       else if (args.item.text == 'Permissions') { 
  //         redirect(`/user-management/permissions`);
  //       }
  //     }
  // };

  const menuClick = (node: any): void => {
    console.log(node);
    if (node.node.textContent == 'Services') {
      redirect(`/admin/service-and-events`);
    }
    else if (node.node.textContent == 'Syncfusion') {
      redirect(`/admin/syncfusion`);
    }
    else if (node.node.textContent == 'Volunteers') {
      redirect(`/admin/volunteers`);
    }
  };


  const [isOpen, setIsOpen] = useState<boolean>(true);
  const sidebarRef = useRef<SidebarComponent>(null);
  const data: { [key: string]: Object }[] = [
    {
      nodeId: '01', nodeText: 'Services',
    },
    {
      nodeId: '02', nodeText: 'Syncfusion',
    },
    {
      nodeId: '03', nodeText: 'Volunteers',
    }
  ];
  const width: string = '220px';
  const target: string = '.main-sidebar-content';
  const mediaQuery: string = '(min-width: 600px)';
  const fields: object = { dataSource: data, id: 'nodeId', text: 'nodeText', child: 'nodeChild' };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  }

  return (
    <div className="flex grow">
      {/* {isMobile && <Header />} */}

      {/* <div className="flex flex-col lg:flex-row grow pt-(--mobile-header-height) lg:pt-0"> */}
      <div className="flex flex-col lg:flex-row grow">
        {/* {isDesktop && <Sidebar />} */}

        {/* flex flex-col grow lg:rounded-l-xl bg-content border border-border lg:ms-(--sidebar-width) */}
        <div className="flex flex-col grow bg-content border-border">
          {/* <Header/> */}
          <section className="bg-gray-50 dark:bg-gray-950">

            <div>
              <AppBarComponent>
                <ButtonComponent cssClass="e-inherit" iconCss="e-icons e-menu" onClick={toggleSidebar}></ButtonComponent>
                <div className="e-folder">
                  <div className="e-folder-name">UI/UX Prototype 1.0.1</div>
                </div>
              </AppBarComponent>
            </div>
            <SidebarComponent id="sideTree" className="sidebar-treeview" ref={sidebarRef} width={width} target={target} mediaQuery={mediaQuery} isOpen={isOpen}>
              <div className='res-main-menu'>
                <div className="table-content">
                  <TextBoxComponent id="resSearch" placeholder="Search..."></TextBoxComponent>
                  <p className="main-menu-header">Admin</p>
                </div>
                <div>
                  <TreeViewComponent id='mainTree' cssClass="main-treeview" fields={fields} nodeClicked={menuClick} expandOn='Click' />
                </div>
              </div>
            </SidebarComponent>
            {/* <div className="border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700">
                <div className="flex items-center justify-between ms-6 me-2.5 lg:me-6 py-2">
                  <div className="flex items-center">
                    <img className="mr-3 h-7" src="/brand/logo.svg" width={35} height={35} alt="kids church" />
                    <span className="text-lg font-semibold text-gray-900 dark:text-white">Kids Church</span>
                    <div className="flex pl-4 hidden lg:block">
                      <ButtonComponent className="py-2 mr-1.5" cssClass="e-flat" iconCss='e-icons e-home' type="button">Home</ButtonComponent>
                      <DropDownButtonComponent select={menuClick} ref={resourcesDropdown} iconCss='e-icons e-user' className="py-2 mr-1.5" cssClass="e-flat" items={[{ text: "Dashboard" }, { text: "Kids" }, { text: "Lessons" }]} type="button">Parents</DropDownButtonComponent>
                      <DropDownButtonComponent select={menuClick} ref={resourcesDropdown} iconCss='e-icons e-month-agenda' className="py-2 mr-1.5" cssClass="e-flat" items={[{ text: "Dashboard" }, { text: "Volunteers" }, { text: "Services" }, { text: "Syncfusion" }]} type="button">Admin</DropDownButtonComponent>
                      <DropDownButtonComponent select={menuClick} ref={resourcesDropdown} iconCss='e-icons e-lock' className="py-2 mr-1.5" cssClass="e-flat" items={[{ text: "Users" }, { text: "Roles" }, { text: "Permissions" }]} type="button">Security</DropDownButtonComponent>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ButtonComponent className="sf-icon-notification-bell-02 leading-3 text-base hidden sm:block mr-2" cssClass="e-flat" type="button"></ButtonComponent>
                    <div className="border border-r border-gray-200 dark:border-gray-600 hidden lg:block mr-2 h-7"></div>
                    {!isMobile && (<DropDownButtonComponent ref={brandDropdown} className="me-2 hidden lg:block" cssClass="e-flat" items={[{ text: "React" }, { text: "Vue.js" }, { text: "Angular" }]} type="button">Axel Casauran</DropDownButtonComponent>)}
                    <div className="border border-r border-gray-200 dark:border-gray-600 hidden sm:block h-7"></div>
                    <span className="e-avatar e-avatar-small e-avatar-circle ml-4">
                      <img src="/media/avatars/1.png" width={32} height={32} alt="profile picture" />
                    </span>
                    <div className="border border-r border-gray-200 dark:border-gray-600 h-7 block lg:hidden ms-3"></div>
                    <span className="block lg:hidden">
                      <MenuComponent hamburgerMode={true} title="" showItemOnClick={true} items={[{ text: 'Home' }, { text: 'Products' }, { text: 'Company' }, { text: 'Resources', items: [{ text: 'Dashboard' }, { text: 'Earnings' }, { text: 'Support' }] }, { text: 'Contact' }]}></MenuComponent>
                    </span>
                  </div>
                </div>
              </div> */}

          </section>
          <div className="flex flex-col grow overflow-y-auto pt-3 main-sidebar-content">
            <div className="sidebar-content flex flex-col min-h-full">
              <main className="flex-1" role="content">
                {children}
              </main>
              <Footer />
            </div>
          </div>
          {/* <div className="flex flex-col grow overflow-y-auto pt-3" style={{backgroundColor: '#e7e7e7'}}>
            <main className="grow" role="content">
              {children}
            </main>
            <Footer />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export { Wrapper };
