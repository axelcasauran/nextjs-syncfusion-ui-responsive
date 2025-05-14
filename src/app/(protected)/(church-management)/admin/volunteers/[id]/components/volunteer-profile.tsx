 /* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { TextAreaComponent, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Card, CardContent } from '@reui/ui/card';
import { Skeleton } from '@reui/ui/skeleton';
import { User } from '@/src/business-layer/user-management/models/user';
import UserProfileEditDialog from './volunteer-profile-edit-dialog';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { UserProfileSchema, UserProfileSchemaType } from '../forms/volunteer-profile-schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDirective, ColumnsDirective, MultiColumnComboBoxComponent } from '@syncfusion/ej2-react-multicolumn-combobox';

const UserProfile = ({
    user,
    isLoading,
}: {
    user: User;
    isLoading: boolean;
}) => {
    const [isEditDialogOpen, setEditDialogOpen] = useState(false);

    const Loading = () => (
        <Card>
            <CardContent>
                <dl className="grid grid-cols-[auto_1fr] text-muted-foreground gap-3 text-sm mb-5">
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt className="flex md:w-64">
                            <Skeleton className="h-6 w-24" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-36" />
                        </dd>
                    </div>
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt>
                            <Skeleton className="h-5 w-36" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-48" />
                        </dd>
                    </div>
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt>
                            <Skeleton className="h-5 w-20" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-24" />
                        </dd>
                    </div>
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt>
                            <Skeleton className="h-5 w-24" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-20" />
                        </dd>
                    </div>
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt>
                            <Skeleton className="h-5 w-36" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-24" />
                        </dd>
                    </div>
                    <div className="grid grid-cols-subgrid col-span-2 items-baseline">
                        <dt>
                            <Skeleton className="h-5 w-24" />
                        </dt>
                        <dd>
                            <Skeleton className="h-5 w-36" />
                        </dd>
                    </div>
                </dl>
                <Skeleton className="h-9 w-32" />
            </CardContent>
        </Card>
    );

    const [containerHeight, setContainerHeight] = useState("750px");
    const dialog = useRef<DialogComponent>(null);
    const uploaders = useRef<UploaderComponent>(null);
    const checkWindowSize = () => {
        const isMobile = window.innerWidth <= 640;
        setContainerHeight(isMobile ? "635px" : "790px");
        dialog.current?.show(isMobile);
    };

    useEffect(() => {

        checkWindowSize();
        window.addEventListener("resize", checkWindowSize);

        return () => {

            window.removeEventListener("resize", checkWindowSize);
        };
    }, []);


    // +++++++ FORMS
    const form = useForm<UserProfileSchemaType>({
        resolver: zodResolver(UserProfileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            roleId: user?.roleId || '',
            status: user?.status || '',
        },
        mode: 'onSubmit',
    });

    useEffect(() => {
        form.reset({
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            roleId: user?.roleId || '',
            status: user?.status || '',
        });
    }, [user, form]);

    // +++++++ DEPARTMENT
    const [department, setDepartment] = useState([]);
    useEffect(() => {
        fetch('/api/admin/departments')
            .then(res => res.json())
            .then(data => setDepartment(data.result));
    }, []);
    const fields = { text: 'name', value: 'id' };

    const Content = () => {

        return (
            <TabComponent>
                <TabItemsDirective>
                    <TabItemDirective header={{ text: 'Profile' }}
                        content={() => (
                            <div className="pt-5">
                                {/* <h3 className="text-sm font-medium mb-1">Your photo</h3>
                            <div className="flex items-center gap-4 mb-6 sm:mb-5">
                                <span className="e-avatar e-avatar-large e-avatar-circle shrink-0 border border-gray-200 bg-gray-100 dark:border-gray-600 dark:bg-gray-700">
                                    <i className="e-icons e-user text-3xl dark:text-gray-300"></i>
                                </span>
                                <div className="grow">
                                    <a href="#" className="font-medium text-primary-600 dark:text-primary-400" onClick={() => uploaders.current?.element?.click()}>Choose a profile image</a>
                                    <p className="text-xs text-gray-700 dark:text-gray-200 mt-1">Choose a high-quality photo to help teammates recognize you.</p>
                                    <UploaderComponent ref={uploaders} multiple={false} allowedExtensions='image/*' maxFileSize={2000000} selected={(e) => e.cancel = true}></UploaderComponent>
                                </div>
                            </div> */}
                                <form action="#" className="flex flex-col gap-4 sm:gap-3 text-xs font-medium leading-normal text-gray-700 dark:text-gray-200" onSubmit={(e) => e.preventDefault()}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-1">
                                            <label>Department</label>
                                            <MultiColumnComboBoxComponent dataSource={department} fields={fields} allowFiltering={true} filterType={'Contains'}>
                                                <ColumnsDirective>
                                                    <ColumnDirective field='name' header='Name' width={100}></ColumnDirective>
                                                    <ColumnDirective field='description' header='Description' width={140}></ColumnDirective>
                                                    <ColumnDirective field='slug' header='Slug' width={80}></ColumnDirective>
                                                </ColumnsDirective>
                                            </MultiColumnComboBoxComponent>
                                            {/* <TextBoxComponent placeholder="Enter your first name" type="text"></TextBoxComponent> */}
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <label>Volunteer since</label>
                                            <div className="sm:w-44">
                                                <DatePickerComponent placeholder="MM/DD/YYYY"></DatePickerComponent>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 col-span-2">
                                        <label>Remarks</label>
                                        <TextAreaComponent placeholder="Enter your details" width="100%" rows={4} resizeMode="None"></TextAreaComponent>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-2 font-medium">
                                        <div className="flex gap-3 sm:gap-2">
                                            <SwitchComponent cssClass="w-10"></SwitchComponent>
                                            <label className="text-sm font-normal text-gray-900 dark:text-white">Active</label>
                                        </div>                                        
                                    </div>
                                </form>
                            </div>
                        )}
                    ></TabItemDirective>
                    <TabItemDirective header={{ text: 'Assignments' }}
                        content={() => (
                            <div className="flex flex-col gap-3 pt-6">
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Comments</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Get notified when someone comments on your posts or replies to your comments</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0"></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Mentions</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Receive alerts when someone mentions you in a post or comment</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0" checked={true}></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Follows</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Be notified when someone starts following your profile</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0"></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Direct messages</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Get instant notifications for new direct messages</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0" checked={true}></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Newsletter</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Weekly digest of the best content, features, and updates</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0"></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Account updates</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Important notifications about your account, security, and privacy</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0"></SwitchComponent>
                                </div>
                                <div className="flex items-center justify-between gap-3 py-1.5">
                                    <div>
                                        <p className="font-medium mb-0.5">Product updates</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Be the first to know about new features, improvements, and tips</p>
                                    </div>
                                    <SwitchComponent cssClass="w-10 shrink-0"></SwitchComponent>
                                </div>
                            </div>
                        )}
                    ></TabItemDirective>
                    <TabItemDirective header={{ text: 'Events' }}
                        content={() => (
                            <div>
                                <div className="mb-5 pt-4">
                                    <p className="font-medium mb-2">Email Forwarding</p>
                                    <p className="text-xs text-gray-700 dark:text-gray-300">Configure your email preferences and setup your email forwarding to other addresses.</p>
                                </div>
                                <div className="e-card p-3 shadow-none mb-4">
                                    <div className="e-card-header-title !px-1 !py-1">
                                        <p className="font-medium">Primary email</p>
                                    </div>
                                    <div className="e-card-content !px-1 !pb-1 !pt-0">
                                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-3">Your main email address for receiving forwarded message</p>
                                        <TextBoxComponent type="email" value="james@123.com"></TextBoxComponent>
                                    </div>
                                </div>
                                <div className="e-card p-3 shadow-none">
                                    <div className="e-card-header-title !flex !justify-between gap-2 !px-1 !py-1">
                                        <p className="font-medium">Forwarding emails</p>
                                        <span className="e-badge e-badge-pill e-badge-info">2/5</span>
                                    </div>
                                    <div className="e-card-content !px-1 !pb-1 !pt-0">
                                        <p className="text-xs text-gray-700 dark:text-gray-300 mb-4">Add upto 5 email addresses to forwarding</p>
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-3">
                                            <TextBoxComponent className="grow" placeholder="Add forwarding emails" type="email"></TextBoxComponent>
                                            <ButtonComponent cssClass="w-fit" iconCss="e-icons e-plus" type="button">Add</ButtonComponent>
                                        </div>
                                        <div className="border-t border-gray-200 dark:border-gray-600 mt-4 md:mt-3 pt-4 md:pt-3">
                                            <div className="flex gap-3 items-center py-1.5">
                                                <div className="text-gray-900 dark:text-white grow">john.wick&#64;123.com</div>
                                                <ButtonComponent cssClass="e-danger e-flat e-small" iconCss="e-icons e-trash" type="button"></ButtonComponent>
                                            </div>
                                            <div className="flex gap-3 items-center py-1.5">
                                                <div className="text-gray-900 dark:text-white grow">charles.kri&#64;123.com</div>
                                                <ButtonComponent cssClass="e-danger e-flat e-small" iconCss="e-icons e-trash" type="button"></ButtonComponent>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    ></TabItemDirective>
                    <TabItemDirective header={{ text: 'History' }}
                        content={() => (
                            <div>
                                <h2 className="font-medium text-base mt-6 mb-3">Security</h2>
                                <div className="e-card shadow-none px-4 py-2 mb-4">
                                    <div className="e-card-content flex flex-col sm:flex-row gap-3 justify-between sm:items-center !p-0 !py-1">
                                        <div className="flex gap-3 items-center">
                                            <span className="text-base e-icons e-eye text-gray-500 dark:text-gray-300"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">Change password</p>
                                                <p className="text-xs text-wrap text-gray-700 dark:text-gray-300">Update your password regularly to maintain account security</p>
                                            </div>
                                        </div>
                                        <ButtonComponent className="w-fit ml-7 sm:ml-0 mr-1" type="button">Update</ButtonComponent>
                                    </div>
                                </div>
                                <div className="e-card shadow-none px-4 py-2 mb-6">
                                    <div className="e-card-content flex flex-col sm:flex-row gap-3 justify-between sm:items-center !p-0 !py-1">
                                        <div className="flex gap-3 items-center">
                                            <span className="text-base sf-icon-mobile-01 text-gray-500 dark:text-gray-300"></span>
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">Two-Factor Authentication</p>
                                                <p className="text-xs text-wrap text-gray-700 dark:text-gray-300">Add an extra layer of security to your account</p>
                                            </div>
                                        </div>
                                        <ButtonComponent className="w-fit ml-7 sm:ml-0 mr-1" type="button">Enable</ButtonComponent>
                                    </div>
                                </div>
                                <h2 className="font-medium text-base mb-3">Accounts</h2>
                                <div className="e-card shadow-none px-4 py-2 mb-4">
                                    <div className="e-card-content flex items-start sm:items-center !p-0 !py-1">
                                        <img className="w-6 shrink-0 mr-3 mt-2 sm:mt-0" src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/svg/microsoft.svg" alt="microsoft logo" />
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 grow">
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">Microsoft</p>
                                                <p className="text-xs text-wrap text-gray-700 dark:text-gray-300">Access Microsoft services and single sign-on</p>
                                            </div>
                                            <ButtonComponent className="w-fit mr-1" type="button">Disconnect</ButtonComponent>
                                        </div>
                                    </div>
                                </div>
                                <div className="e-card shadow-none px-4 py-2 mb-5">
                                    <div className="e-card-content flex items-start sm:items-center !p-0 !py-1">
                                        <img className="w-6 shrink-0 mr-3 mt-2 sm:mt-0" src="/react/essential-ui-kit/blocks/assets/images/common/brand-logos/svg/twitter.svg" alt="twitter logo" />
                                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 grow">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">Twitter</div>
                                                <div className="text-xs text-wrap text-gray-700 dark:text-gray-300">Connect to share updates and manage social features</div>
                                            </div>
                                            <ButtonComponent className="w-fit mr-1" type="button">Connect</ButtonComponent>
                                        </div>
                                    </div>
                                </div>
                                <ButtonComponent cssClass="e-danger e-outline" type="button">Delete Account</ButtonComponent>
                            </div>
                        )}
                    ></TabItemDirective>
                    <TabItemDirective header={{ text: 'Audit Logs' }}
                        content={() => (
                            <div className="flex flex-col gap-4 pt-6">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium mb-0.5">Theme</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Choose your preferred system theme</p>
                                    </div>
                                    <DropDownButtonComponent className="w-fit" type="button" content="System Theme" beforeOpen={(event) => (event.cancel = true)}></DropDownButtonComponent>
                                </div>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div>
                                        <p className="font-medium mb-0.5">Layout</p>
                                        <p className="text-xs text-gray-700 dark:text-gray-300">Select a layout that suits your preference</p>
                                    </div>
                                    <DropDownButtonComponent className="w-fit" type="button" content="Compact" beforeOpen={(event) => (event.cancel = true)}></DropDownButtonComponent>
                                </div>
                            </div>
                        )}
                    ></TabItemDirective>
                </TabItemsDirective>
            </TabComponent>

        );
    };

    return (
        <>
            {isLoading || !user ? <Loading /> : <Content />}

            <UserProfileEditDialog
                open={isEditDialogOpen}
                closeDialog={() => setEditDialogOpen(false)}
                user={user}
            />
        </>
    );
};

export default UserProfile;
