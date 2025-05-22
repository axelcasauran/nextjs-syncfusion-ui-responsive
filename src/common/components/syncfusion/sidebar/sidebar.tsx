'use client';

import { useEffect, useRef } from 'react';
import { SidebarComponent, AccordionComponent, AccordionItemsDirective, AccordionItemDirective } from '@syncfusion/ej2-react-navigations';

export default function Sidebar() {

    const sidebar = useRef<SidebarComponent | null>(null);
    const accordion = useRef<AccordionComponent | null>(null);


    useEffect(() => {

    }, []);

    
    return (
        <section className="bg-white dark:bg-gray-950">
            <div style={{ height: '710px' }}>
                <SidebarComponent key={"sidebar-1-tw"} className="bg-gray-50 dark:bg-gray-900 !border-r !border-gray-200 dark:!border-gray-700" width="256px" ref={sidebar} isOpen={true} style={{ display: 'block' }}>
                    <div className="h-screen">
                        <div className="flex items-center py-4 px-3">
                            <img src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/svg/vector.svg" width={32} height={32} alt="company logo" />
                            <span className="text-lg font-bold text-gray-900 dark:text-white ml-3">Company Name</span>
                        </div>
                        <hr className="border-gray-200 dark:border-gray-700 m-4" />
                        <AccordionComponent className="bg-transparent !border-0" ref={accordion} expandMode="Single">
                            <AccordionItemsDirective>
                                <AccordionItemDirective iconCss="e-icons e-notes e-medium" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">News</div>}></AccordionItemDirective>
                                <AccordionItemDirective iconCss="e-icons sf-icon-announcement-01 text-base" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">Events</div>}></AccordionItemDirective>
                                <AccordionItemDirective iconCss="e-icons e-user e-medium" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">People</div>} content={() => <div></div>}></AccordionItemDirective>
                                <AccordionItemDirective iconCss="e-icons e-people e-medium" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">Groups</div>} content={() => <div></div>}></AccordionItemDirective>
                                <AccordionItemDirective expanded={true} iconCss="e-icons sf-icon-sandglass text-base" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">Resources</div>} content={() => (
                                    <div>
                                        <ul>
                                            <li className="text-base pb-3 pl-8">Cards</li>
                                            <li className="text-base pb-3 pl-8">Widgets</li>
                                            <li className="text-base pl-8">Components</li>
                                        </ul>
                                    </div>)}
                                ></AccordionItemDirective>
                                <AccordionItemDirective iconCss="e-icons sf-icon-laptop-01 text-base" cssClass="!border-0" header={() => <div className="text-base font-normal pl-2">Office</div>} content={() => <div></div>}></AccordionItemDirective>
                            </AccordionItemsDirective>
                        </AccordionComponent>
                    </div>
                </SidebarComponent>
            </div>

        </section>
    );
}