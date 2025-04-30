/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState } from 'react';
import { ButtonComponent, SwitchComponent } from '@syncfusion/ej2-react-buttons';
import { DatePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownButtonComponent } from '@syncfusion/ej2-react-splitbuttons';
import { TextAreaComponent, TextBoxComponent, UploaderComponent } from '@syncfusion/ej2-react-inputs';
import { TabComponent, TabItemDirective, TabItemsDirective } from '@syncfusion/ej2-react-navigations';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { User } from '@/app/models/user';
import { DialogComponent } from '@syncfusion/ej2-react-popups';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ColumnDirective, ColumnsDirective, MultiColumnComboBoxComponent } from '@syncfusion/ej2-react-multicolumn-combobox';
import { FormRowProps, SyncfusionForm } from '@/app/components/syncfusion/form/form';
import { SyncfusionGrid } from '@/app/components/syncfusion/grid/grid';
import { saveChanges } from '@/app/framework/components/save-changes';
import { gridAction } from '@/app/framework/components/grid-actions';
import { ActionEventArgs } from '@syncfusion/ej2-react-grids';
import { API } from '@/app/framework/helper/api';
import { FormSchema, FormSchemaData } from '../../forms/forms';
import { Toolbar } from '@/app/components/syncfusion/toolbar/toolbar';

const RecordPage = ({
    id,
    isLoading,
}: {
    id: string;
    isLoading: boolean;
}) => {

    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    let ID: string[] = [];
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

    const form = useForm<FormSchemaData>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            location: "",
            type: "",
            startDate: new Date(),
            endDate: null,
            description: "",
            isActive: false,
        },
    });

    // Add this after your initial state declarations
    useEffect(() => {
        console.log('RECORD TO LOAD -> ', id);
        if (id && id !== 'new') {
            const encoded = id;
            const decoded = decodeURIComponent(encoded);
            const _ID = decoded.split(",");
            ID = _ID;
            setSelectedRecords(_ID);
            loadRecord(0);
        }
    }, [id, form]);

    const loadRecord = async (index: number) => {
        // Fetch record data using the ID
        fetch(`${API.service.get}/${ID[index] || selectedRecords[index]}`)
            .then(res => res.json())
            .then(data => {
                // Set form values with fetched data
                form.reset({
                    name: data.name,
                    location: data.location,
                    type: data.type,
                    startDate: new Date(data.startDate),
                    endDate: data.endDate ? new Date(data.endDate) : null,
                    description: data.description,
                    isActive: data.isActive
                });

                // Set detail records if any
                if (data.details) {
                    setFormDetailPage({
                        result: data.result || [], // The array of records
                        count: data.count || data.result?.length // Total count of records
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching record:', error);
            });
    }

    // +++++++ DEPARTMENT
    const [department, setDepartment] = useState([]);
    const fields = { text: 'name', value: 'id' };
    useEffect(() => {
        fetch('/api/admin/departments')
            .then(res => res.json())
            .then(data => setDepartment(data.result));
    }, []);

    const toolbarOptionsDetails = ['Add', 'Delete', 'Update', 'Cancel', 'Search'];
    const gridRef = useRef<any>(null);
    const [formDetailPage, setFormDetailPage] = useState<{ result: any[], count: number }>({
        result: [],
        count: 0
    });
    const formRef = useRef<HTMLFormElement>(null);
    const [formPage, setFormPage] = useState([])

    const userSelection = ((data: any) => {
        console.log(data);
        return (
            <>
                <MultiColumnComboBoxComponent dataSource={department} popupWidth={400} popupHeight={200} fields={fields} allowFiltering={true} filterType={'Contains'}>
                    <ColumnsDirective>
                        <ColumnDirective field='name' header='Name' width={100}></ColumnDirective>
                        <ColumnDirective field='description' header='Description' width={140}></ColumnDirective>
                        <ColumnDirective field='slug' header='Slug' width={80}></ColumnDirective>
                    </ColumnsDirective>
                </MultiColumnComboBoxComponent>
            </>
        )
    });

    const detailGridColumns = [
        { field: 'name', headerText: 'Name', width: 50 },
        {
            field: 'role',
            headerText: 'Role',
            width: 80,
            editType: 'dropdownedit',
            editTemplate: userSelection
        },
        { field: 'description', headerText: 'Description', width: 50 },
    ];

    const updateRecords = async () => {
        saveChanges(gridRef, setFormDetailPage, API.service.get, API.service.update, API.service.title);
    };

    const actionBegin = async (args: ActionEventArgs) => {
        await gridAction({
            args,
            apiEndpoint: API.service.get,
            gridRef,
            setData: setFormPage
        });
    };


    const formRows: FormRowProps<FormSchemaData>[] = [
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 }, // Responsive columns
            fields: [
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

    const onSubmit = async (data: FormSchemaData) => {
        console.log('Form submitted:', data);
        try {
            const response = await fetch(API.service.post, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                // Refresh grid data
                const refreshResponse = await fetch(API.service.get);
                const newData = await refreshResponse.json();
                setFormPage(newData.result);

                form.reset();
            }
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     console.log('Form submitted:', form.getValues());
    //     e.preventDefault();
    //     form.handleSubmit(onSubmit, (errors) => {
    //         console.log('Form errors:', errors);
    //     })();
    // };

    const handlePageChange = async (page: number) => {
        try {
            console.log('Page changed:', page);
            await loadRecord(page-1);
            setPage(page);
        } catch (error) {
            console.error('Error fetching page:', error);
        }
    };

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
                // formRef={formRef}
                // onSave={onSave}
                />
                <div className="flex-1 overflow-auto">
                    <TabComponent>
                        <TabItemsDirective>
                            <TabItemDirective header={{ text: 'Details' }}
                                content={() => (
                                    <div className="pt-5">

                                        <form id="serviceForm" onSubmit={form.handleSubmit(onSubmit)} ref={formRef}>

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
