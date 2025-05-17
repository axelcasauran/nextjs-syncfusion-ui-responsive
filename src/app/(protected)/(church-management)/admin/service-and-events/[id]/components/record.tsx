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
        resolver: zodResolver(FormSchema),
        defaultValues: {
            id: (id === 'new') ? null : id,
            name: "",
            location: "",
            type: "",
            startDate: new Date(),
            endDate: null,
            description: "",
            isActive: false,
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

                                const row = gridRef.current.getRowByIndex(gridRef.current.getRowIndexByPrimaryKey(data.id));
                                if (!row) {
                                    // console.error('Row not found');
                                    return;
                                }

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

                                console.log('updatedData', updatedData);

                                // // Update directly using updateCell
                                gridRef.current.updateCell(gridRef.current.getRowIndexByPrimaryKey(data.id), 'user.firstName', e.item.firstName);
                                gridRef.current.updateCell(gridRef.current.getRowIndexByPrimaryKey(data.id), 'user.lastName', e.item.lastName);
                                gridRef.current.updateCell(gridRef.current.getRowIndexByPrimaryKey(data.id), 'user.id', e.item.id);
                                gridRef.current.updateCell(gridRef.current.getRowIndexByPrimaryKey(data.id), 'userId', updatedData.userId);
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
        console.log('data', data);
        if (data.user == null) return <span></span>;
        return (
            <span>{data.user.firstName} {data.user.lastName}</span>
        );
    });

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
            isActive: data.isActive
        });

        // Set detail records if any
        if (data.serviceDetail && data.serviceDetail.length > 0) {
            setFormDetailPage({
                result: data.serviceDetail || [], // The array of records
                count: data.serviceDetail?.length // Total count of records
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

            // Trigger form submission if form is valid
            const isValid = await form.trigger();
            if (!isValid) {
                console.error('Form validation failed');
                return;
            }

            /// Get form data and prepare save payload
            const formData = form.getValues();
            if (formData.id == null) delete formData.id;
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
            width: 80,
            editType: 'dropdownedit',
            editTemplate: userSelection
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
