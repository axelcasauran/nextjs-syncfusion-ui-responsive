/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Card, CardContent } from '@reui/ui/card';
import { Skeleton } from '@reui/ui/skeleton';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDirective, ColumnsDirective, MultiColumnComboBoxComponent } from '@syncfusion/ej2-react-multicolumn-combobox';
import { FormRowProps, SyncfusionForm } from '@syncfusion/form/form';
import { SyncfusionGrid } from '@syncfusion/grid/grid';
import { saveChanges } from '@framework/components/save-changes';
import { gridAction } from '@framework/components/grid-actions';
import { ActionEventArgs } from '@syncfusion/ej2-react-grids';
import { API } from '@framework/helper/api';
import { FormSchema, FormSchemaData } from '../../forms/forms';
import { Toolbar } from '@syncfusion/toolbar/toolbar';
import { useRouter } from 'next/navigation';

const RecordPage = ({ id, isLoading }: { id: string; isLoading: boolean; }) => {

    // DECLARE VARIABLES
    const router = useRouter();
    let IDs: string[] = [];
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [page, setPage] = useState(1);
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

    // FORM CONFIGURATION
    const form = useForm<FormSchemaData>({
        resolver: zodResolver(FormSchema) as any,
        defaultValues: {
            id: (id === 'new') ? null : id,
            name: "",
            location: "",
            type: "",
            startDate: new Date(),
            endDate: null,
            description: "",
            isActive: false as boolean | null,
        },
    });
    const formRef = useRef<HTMLFormElement>(null!);
    const [formPage, setFormPage] = useState([]);
    useEffect(() => {
        if (id && id !== 'new') {
            try {
                const urlDecoded = decodeURIComponent(id);
                const base64Decoded = atob(urlDecoded);
                const ids = JSON.parse(base64Decoded);

                IDs = ids;
                setSelectedRecords(ids);
                loadRecord(0);
            } catch (error) {
                console.error('Error decoding IDs:', error);
            }
        }
    }, [id]);

    // GRID CONFIGURATION
    const toolbarOptionsDetails = ['Add', 'Delete', 'Cancel', 'Search'];
    const gridRef = useRef<any>(null);
    const [formDetailPage, setFormDetailPage] = useState<{ result: any[], count: number }>({
        result: [],
        count: 0
    });

    // CONTROL HANDLERS
    // DEPARTMENT COMBOBOX
    const [user, setUser] = useState([]);
    const fields = { text: 'fullName', value: 'id' };
    useEffect(() => {
        fetch('/api/church-management/admin/volunteers')
            .then(res => res.json())
            .then(data => setUser(data.result));
    }, []);
    // USER COMBOBOX
    const userSelection = ((data: any) => {
        return (
            <MultiColumnComboBoxComponent dataSource={user} value={data.userId} popupWidth={400} popupHeight={200} fields={fields} allowFiltering={true} filterType={'Contains'}
                change={(e: any) => {
                    if (e.itemData && gridRef.current) {
                        try {
                            setTimeout(() => {
                                const rowIndex = gridRef.current.selectedRowIndex;
                                data.user.firstName = e.item.firstName;
                                data.user.lastName = e.item.lastName;
                                data.user.id = e.itemData.value;

                                const updatedData = {
                                    userId: e.itemData.value,
                                    user: {
                                        firstName: e.item.firstName,
                                        lastName: e.item.lastName,
                                        id: e.itemData.value
                                    }
                                };

                                // // Update directly using updateCell
                                gridRef.current.updateCell(rowIndex, 'user.firstName', e.item.firstName);
                                gridRef.current.updateCell(rowIndex, 'user.lastName', e.item.lastName);
                                gridRef.current.updateCell(rowIndex, 'user.id', e.item.id);
                                gridRef.current.updateCell(rowIndex, 'userId', updatedData.userId);
                                gridRef.current.saveCell();

                                // formDetailPage.result.forEach((item: any) => {
                                //     if (item.id === data.id) {
                                //         item.user = updatedData.user;
                                //         item.userId = updatedData.userId;
                                //         return;
                                //     }
                                // });
                            }, 0);
                        } catch (error) {
                            console.error('Error updating grid row:', error);
                        }
                    }
                }}>
                <ColumnsDirective>
                    <ColumnDirective field='firstName' header='First Name' width={120}></ColumnDirective>
                    <ColumnDirective field='lastName' header='Last Name' width={140}></ColumnDirective>
                </ColumnsDirective>
            </MultiColumnComboBoxComponent>
        )
    });
    const firstNameLastName = ((data: any) => {
        if (data?.user == null) return <span></span>;
        return (
            <span>{data.user.firstName} {data.user.lastName}</span>
        );
    });
    // ROLE COMBOBOX
    // const roleFields = { text: 'role', value: 'role' };
    // const roles = [{ "role": 'Preacher' }, { "role": 'Host' }, { "role": 'Tech' }, { "role": 'Registration' }, { "role": 'Door keeper' }, { "role": 'Volunteer' }];
    // const roleSelection = ((data: any) => {
    //     console.log('roleSelection data', data);
    //     return (
    //         <MultiColumnComboBoxComponent dataSource={roles} value={data.role} popupWidth={400} popupHeight={200} fields={roleFields} allowFiltering={true} filterType={'Contains'}
    //             change={(e: any) => {
    //                 if (e.itemData && gridRef.current) {
    //                     try {
    //                         setTimeout(() => {
    //                             const row = gridRef.current.getRowByIndex(gridRef.current.getRowIndexByPrimaryKey(data.id));
    //                             let rowIndex = gridRef.current.getRowIndexByPrimaryKey(data.id);
    //                             if (!row) {
    //                                 rowIndex = 0;
    //                             }
    //                             gridRef.current.updateCell(rowIndex, 'role', e.value);
    //                             // gridRef.current.saveCell();
    //                             // formDetailPage.result.forEach((item: any) => {
    //                             //     if (item.id === data.id) {
    //                             //         item.role = e.itemData.role;
    //                             //         return;
    //                             //     }
    //                             // });
    //                         }, 0);
    //                     } catch (error) {
    //                         console.error('Error updating grid row:', error);
    //                     }
    //                 }
    //             }}
    //             >
    //             <ColumnsDirective>
    //                 <ColumnDirective field='role' header='Role' width={120}></ColumnDirective>
    //             </ColumnsDirective>
    //         </MultiColumnComboBoxComponent>
    //     )
    // });
    const roles = [
        { role: 'Preacher' },
        { role: 'Host' },
        { role: 'Tech' },
        { role: 'Registration' },
        { role: 'Door keeper' },
        { role: 'Volunteer' }
    ];
    // const roleSelection = ((data: any) => {
    //     return (
    //         <ComboBoxComponent
    //             dataSource={roles}
    //             value={data.role}
    //             allowFiltering={true}
    //             filterType='Contains'
    //             change={(e: any) => {
    //                 if (e.value && gridRef.current) {
    //                     // Defer the update to next tick to avoid DOM manipulation during blur
    //                     requestAnimationFrame(() => {
    //                         try {
    //                             // Get current row data
    //                             const currentData = gridRef.current.getCurrentViewRecords();
    //                             const rowData = currentData.find((r: any) => r.id === data.id);

    //                             if (rowData) {
    //                                 // Update data model first
    //                                 rowData.role = e.value;

    //                                 // Then update grid cell
    //                                 const rowIndex = gridRef.current.getRowIndexByPrimaryKey(data.id);
    //                                 if (rowIndex !== undefined) {
    //                                     gridRef.current.setCellValue(data.id, 'role', e.value);
    //                                     formDetailPage.result.forEach((item: any) => {
    //                                         if (item.id === data.id) {
    //                                             item.role = e.value;
    //                                             return;
    //                                         }
    //                                     });
    //                                 }
    //                             }
    //                         } catch (error) {
    //                             console.error('Error updating grid row:', error);
    //                         }
    //                     });
    //                 }
    //             }}
    //         />
    //     );
    // });




    // CRUD OPERATIONS
    const loadRecord = async (index: number) => {
        // Fetch record data using the ID        
        await fetchRecord(IDs[index] || selectedRecords[index]);
    }
    const fetchRecord = async (id: string) => {
        // Fetch record data using the ID
        fetch(`${API.service.get}/${id}`)
            .then(res => res.json())
            .then(data => {
                // Set form values with fetched data
                bindData(data);
            })
            .catch(error => {
                console.error('Error fetching record:', error);
            });
    }
    const bindData = async (data: any) => {
        form.reset({
            id: data.id,
            name: data.name,
            location: data.location,
            type: data.type,
            startDate: new Date(data.startDate),
            endDate: data.endDate ? new Date(data.endDate) : null,
            description: data.description,
            isActive: data.isActive !== undefined ? data.isActive : null
        });

        // Update grid data without full reset if data exists
        if (data.serviceDetail && data.serviceDetail.length > 0) {
            const currentData = formDetailPage.result;
            const updatedData = data.serviceDetail.map((detail: any) => ({
                ...detail,
                // Preserve any local changes to the user data
                user: currentData.find((d: any) => d.id === detail.id)?.user || detail.user
            }));

            setFormDetailPage({
                result: updatedData,
                count: data.serviceDetail.length
            });
        }
        else {
            setFormDetailPage({
                result: [],
                count: 0
            });
        }
    };
    const updateRecords = async () => {
        saveChanges(gridRef, setFormDetailPage, API.service.get, API.service.update, API.service.title);
    };
    const onSave = async () => {
        try {
            // Store grid changes before validation
            const gridChanges = gridRef.current?.getBatchChanges() || [];


            console.log('gridChanges >>> ', gridChanges);

            // gridChanges.changedRecords.forEach((item: any) => {
            //     formDetailPage.result.forEach((item2: any) => {
            //         if (item2.id === item.id) {
            //             item2 = item;
            //             return;
            //         }
            //     });
            // });

            // gridChanges.deletedRecords.forEach((item: any) => {
            //     const index = formDetailPage.result.findIndex((item2: any) => item2.id === item.id);
            //     if (index !== -1) {
            //         formDetailPage.result.splice(index, 1);
            //     }
            // });

            // gridChanges.addedRecords.forEach((item: any) => {
            //     formDetailPage.result.push(item);
            // });

            // Create new array instead of modifying existing one
            const updatedResults = formDetailPage.result.reduce((acc: any[], item: any) => {
                // Skip deleted records
                if (gridChanges.deletedRecords.some((deleted: any) => deleted.id === item.id)) {
                    return acc;
                }

                // Update changed records
                const changedRecord = gridChanges.changedRecords.find((changed: any) => changed.id === item.id);
                if (changedRecord) {
                    acc.push({ ...item, ...changedRecord });
                } else {
                    acc.push(item);
                }

                return acc;
            }, []);

            // Add new records
            if (gridChanges.addedRecords.length > 0) {
                updatedResults.push(...gridChanges.addedRecords);
            }

            // Update state once with all changes
            setFormDetailPage({
                result: updatedResults,
                count: updatedResults.length
            });

            // Trigger form submission if form is valid
            const isValid = await form.trigger();
            if (!isValid) {
                console.error('Form validation failed');
                return;
            }

            /// Get form data and prepare save payload
            const formData = form.getValues();
            if (formData.id == null) delete formData.id;

            if (gridChanges.addedRecords.length > 0) {
                gridChanges.addedRecords.forEach((item: any) => {
                    delete item.id;
                    delete item.user;
                    item.serviceId = formData.id;
                });
            }

            const saveData = {
                ...(formData.id === undefined
                    ? { addedRecords: [formData] }
                    : { changedRecords: [formData] }
                ),
                details: gridChanges || []
            };

            const response = await fetch(`${API.service.update}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            if (!response.ok) {
                throw new Error('Failed to save data');
            }
            console.log('save >>>> ', formDetailPage);
            const responseData = await response.json();
            if (id === 'new' && responseData.result?.id) {
                const encodedIds = btoa(JSON.stringify(responseData.result.id));
                const urlSafeIds = encodeURIComponent(encodedIds);

                window.history.replaceState(null, '', urlSafeIds);
                bindData(responseData.result);
            }
            else {
                bindData(responseData.result);
            }

        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    // EVENT HANDLER
    const actionBegin = async (args: ActionEventArgs) => {
        await gridAction({
            args,
            apiEndpoint: API.service.get,
            gridRef,
            setData: setFormPage
        });
    };
    const toolbarClick = async (args: any) => {
        console.log('toolbarClick >>> ', args);
        if (args?.text === 'Add' || args?.item?.text === 'Add') {
            args.cancel = true;
            const newRecord = {
                role: '',
                description: '',
                notes: '',
                minutes: null,
                userId: null,
                isAccepted: false,
                isRequired: true,
                user: {
                    firstName: '',
                    lastName: '',
                    id: null
                }
            };
            gridRef.current.addRecord(newRecord);
        }
    }
    const handlePageChange = async (page: number) => {
        try {
            await loadRecord(page - 1);
            setPage(page);
        } catch (error) {
            console.error('Error fetching page:', error);
        }
    };


    // ++++++++++++++ CONTENT ++++++++++++++

    // FORM CONTENT
    const formRows: FormRowProps<FormSchemaData>[] = [
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 }, // Responsive columns
            fields: [
                {
                    name: 'id',
                    hidden: true
                },
                {
                    name: 'name',
                    label: 'Name',
                    type: "text" as const,
                    required: true,
                    placeholder: 'Enter a name',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 1 } // Responsive column span
                },
                {
                    name: 'description',
                    label: 'Description',
                    type: "text" as const,
                    placeholder: 'Provide a brief overview of the service/events',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 3 }
                },
                {
                    name: 'isActive',
                    label: 'Active Status',
                    type: "checkbox" as const,
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                }
            ]
        },
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 },
            fields: [
                {
                    name: 'type',
                    label: 'Type',
                    type: "combo" as const,
                    required: true,
                    options: ['Events', 'Services'],
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                },
                {
                    name: 'location',
                    label: 'Location',
                    type: 'text' as const,
                    required: true,
                    placeholder: 'Enter location',
                    control: form.control,
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 2 }
                },
                {
                    name: 'startDate',
                    label: 'Start Date',
                    type: "datetime" as const,
                    required: true,
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                },
                {
                    name: 'endDate',
                    label: 'End Date',
                    type: 'datetime',
                    control: form.control,
                    colSpan: { xs: 1, sm: 1, md: 1, lg: 1 }
                }
            ]
        }
    ];

    // GRID CONTENT
    const detailGridColumns = [
        { type: 'checkbox', width: 10, allowResizing: false, textAlign: 'Center' },
        { field: 'id', isPrimaryKey: true, visible: false },
        { field: 'serviceId', visible: false },
        { field: 'userId', visible: false },
        {
            field: 'user',
            template: firstNameLastName,
            headerText: 'Name',
            width: 55,
            editType: 'dropdownedit',
            editTemplate: userSelection
        },
        {
            field: 'role',
            headerText: 'Role',
            width: 40,
            editType: 'dropdownedit',
            // editTemplate: roleSelection            
            // template: roleSelection
            edit: {
                params: {
                    dataSource: roles,
                    fields: { text: 'role', value: 'role' },
                    allowFiltering: true,
                    filterType: 'Contains'
                }
            },
            template: (args: any) => {
                if (args == null) return <span></span>;
                if (args?.role?.length == null) return <span></span>;
                return <div>{args?.role}</div>;
            }
        },
        { field: 'description', headerText: 'Description', width: 50, hideAtMedia: true },
        { field: 'notes', headerText: 'Notes', width: 50, hideAtMedia: true },
        { field: 'minutes', headerText: 'Minutes', width: 25, type: 'number', hideAtMedia: true },
        { field: 'isAccepted', headerText: 'Accepted', width: 25, type: 'boolean', displayAsCheckBox: true, textAlign: 'Center', hideAtMedia: true },
        { field: 'isRequired', headerText: 'Required', width: 25, type: 'boolean', displayAsCheckBox: true, textAlign: 'Center', hideAtMedia: true },
    ];

    // ++++++++++++ END CONTENT ++++++++++++


    const Content = () => {
        return (
            // <>
            <div className="flex flex-col h-full">
                <Toolbar
                    showSave
                    showAddNew
                    showPager
                    title='Service and Events'
                    totalRecords={selectedRecords.length || 1}
                    currentPage={page}
                    selectedRecords={selectedRecords}
                    onPageChange={handlePageChange}
                    formRef={formRef}
                    onSave={onSave}
                    onAddNew={() => {
                        router.push('/admin/service-and-events/new');
                    }}
                />
                <div className="flex-1 overflow-auto">
                    <TabComponent>
                        <TabItemsDirective>
                            <TabItemDirective header={{ text: 'Details' }}
                                content={() => (
                                    <div className="pt-5">

                                        <form id="serviceForm" ref={formRef}>

                                            <SyncfusionForm
                                                rows={formRows}
                                                control={form.control}
                                                errors={form.formState.errors}
                                            />
                                            <br />
                                            <SyncfusionGrid
                                                columns={detailGridColumns}
                                                dataSource={formDetailPage}
                                                allowPaging={false}
                                                height={200}
                                                gridRef={gridRef}
                                                allowEdit={true}
                                                toolbarItems={toolbarOptionsDetails}
                                                onBatchSave={updateRecords}
                                                onActionBegin={actionBegin}
                                                onToolbarClick={toolbarClick}
                                            />


                                        </form>
                                    </div>
                                )}
                            ></TabItemDirective>
                            <TabItemDirective header={{ text: 'History' }}
                                content={() => (
                                    // <SyncfusionGrid
                                    //             columns={detailGridColumns}
                                    //             dataSource={formDetailPage}
                                    //             height={200}
                                    //             gridRef={gridRef}
                                    //             allowEdit={true}
                                    //             toolbarItems={toolbarOptionsDetails}
                                    //             onBatchSave={updateRecords}
                                    //             onActionBegin={actionBegin}
                                    //         />
                                    <></>
                                )}
                            ></TabItemDirective>
                        </TabItemsDirective>
                    </TabComponent>
                </div></div>
            // </>
        );
    };

    return (
        <>
            {isLoading || !id ? <Loading /> : <Content />}
        </>
    );
};

export default RecordPage;
