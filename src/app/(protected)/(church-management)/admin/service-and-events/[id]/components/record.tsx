/* eslint-disable react/display-name */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
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
import { GridComponent } from '@syncfusion/ej2-react-grids';
import { toast } from 'sonner';

const RecordPage = ({ id, isLoading }: { id: string; isLoading: boolean; }) => {

    // DECLARE VARIABLES
    const router = useRouter();
    let IDs: string[] = [];
    const [selectedRecords, setSelectedRecords] = useState<string[]>([]);
    const [page, setPage] = useState(1);
    
    // Memoize the Loading component to prevent unnecessary re-renders
    const Loading = useMemo(() => () => (
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
    ), []);

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
    const [formPage, setFormPage] = useState<any[]>([]);
    
    // Load record data when ID changes
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
    const gridRef = useRef<GridComponent>(null);
    const [formDetailPage, setFormDetailPage] = useState<{ result: any[], count: number }>({
        result: [],
        count: 0
    });

    // CONTROL HANDLERS
    // USER COMBOBOX DATA
    const [user, setUser] = useState<any[]>([]);
    const fields = { text: 'fullName', value: 'id' };
    
    // Fetch user data only once on mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('/api/church-management/admin/volunteers');
                const data = await response.json();
                setUser(data.result || []);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        fetchUsers();
    }, []);
    
    // Memoize the userSelection component for better performance
    const userSelection = useCallback((data: any) => {
        return (
            <MultiColumnComboBoxComponent 
                dataSource={user} 
                value={data.userId} 
                popupWidth={400} 
                popupHeight={200} 
                fields={fields} 
                allowFiltering={true} 
                filterType={'Contains'}
                change={(e: any) => {
                    if (e.itemData && gridRef.current) {
                        try {
                            setTimeout(() => {
                                if (!gridRef.current) return;
                                
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

                                // Update directly using updateCell
                                gridRef.current.updateCell(rowIndex, 'user.firstName', e.item.firstName);
                                gridRef.current.updateCell(rowIndex, 'user.lastName', e.item.lastName);
                                gridRef.current.updateCell(rowIndex, 'user.id', e.item.id);
                                gridRef.current.updateCell(rowIndex, 'userId', updatedData.userId);
                                // Manual update
                                const dataSource = gridRef.current.dataSource;
                                if (dataSource && 'result' in dataSource && Array.isArray(dataSource.result)) {
                                    const row = dataSource.result[rowIndex] as { user?: { firstName: string, lastName: string, id: string } };
                                    if (row && row.user) {
                                        row.user.firstName = e.item.firstName;
                                        row.user.lastName = e.item.lastName;
                                        row.user.id = e.item.id;
                                    }
                                    else {
                                        dataSource.result[rowIndex] = {
                                            ...dataSource.result[rowIndex],
                                            user: {
                                                firstName: e.item.firstName,
                                                lastName: e.item.lastName,
                                                id: e.item.id
                                            }
                                        };
                                    }
                                }
                                gridRef.current.saveCell();
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
        );
    }, [user]);
    
    // Memoize the firstNameLastName component
    const firstNameLastName = useCallback((data: any) => {
        if (data?.user == null) return <span></span>;
        return (
            <span>{data.user.firstName} {data.user.lastName}</span>
        );
    }, []);

    // Memoize the roles array
    const roles = useMemo(() => [
        { role: 'Preacher' },
        { role: 'Host' },
        { role: 'Tech' },
        { role: 'Registration' },
        { role: 'Door keeper' },
        { role: 'Volunteer' }
    ], []);

    // CRUD OPERATIONS
    const loadRecord = useCallback(async (index: number) => {
        // Fetch record data using the ID        
        await fetchRecord(IDs[index] || selectedRecords[index]);
    }, [IDs, selectedRecords]);
    
    const fetchRecord = useCallback(async (id: string) => {
        try {
            const response = await fetch(`${API.service.get}/${id}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch record: ${response.statusText}`);
            }
            const data = await response.json();
            bindData(data);
        } catch (error) {
            console.error('Error fetching record:', error);
        }
    }, []);
    
    const bindData = useCallback(async (data: any) => {
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
            const updatedData = data.serviceDetail;
            // const updatedData = data.serviceDetail.map((detail: any) => ({
            //     ...detail,
            //     // Preserve any local changes to the user data
            //     user: currentData.find((d: any) => d.id === detail.id)?.user || detail.user
            // }));

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
    }, [form, formDetailPage.result]);
    
    const updateRecords = useCallback(async () => {
        if (gridRef.current) {
            saveChanges(gridRef, setFormDetailPage, API.service.get, API.service.update, API.service.title);
        }
    }, []);
    
    const onSave = useCallback(async () => {
        try {
            // IMPORTANT: First capture the grid changes before any validation or state changes
            const gridChanges = gridRef.current?.getBatchChanges() || { 
                addedRecords: [], 
                changedRecords: [], 
                deletedRecords: [] 
            };

            // Type cast the gridChanges for type safety
            const typedGridChanges = gridChanges as {
                addedRecords: any[];
                changedRecords: any[];
                deletedRecords: any[];
            };

            // Now that we've safely captured the grid changes, trigger form validation
            const isValid = await form.trigger();
            if (!isValid) {
                console.error('Form validation failed');
                return;
            }

            /// Get form data and prepare save payload
            const formData = form.getValues();
            const isNewRecord = id === 'new' || formData.id == null;
            
            // For new records, we don't include ID
            if (isNewRecord) {
                delete formData.id;
            }

            // Prepare master record data
            const masterData = isNewRecord 
                ? { addedRecords: [formData] }
                : { changedRecords: [formData] };
            
            // Clean up detail records for submission
            // For new records, don't include any serviceId or user objects
            if (typedGridChanges.addedRecords.length > 0) {
                typedGridChanges.addedRecords = typedGridChanges.addedRecords.map(item => {
                    const cleanItem = { ...item };
                    delete cleanItem.id; // Remove any temporary IDs
                    delete cleanItem.user; // Remove user object as we only need userId
                    delete cleanItem.serviceId; // Let the server set this
                    return cleanItem;
                });
            }

            if (typedGridChanges.changedRecords.length > 0) {
                typedGridChanges.changedRecords = typedGridChanges.changedRecords.map(item => {
                    const cleanItem = { ...item };
                    delete cleanItem.user; // Remove user object as we only need userId
                    return cleanItem;
                });
            }

            // Log exactly what's being sent to help diagnose issues
            console.log('Saving data:', {
                masterData,
                details: typedGridChanges,
                isNewRecord
            });

            // Prepare the final save data with both master and detail records
            const saveData = {
                ...masterData,
                details: typedGridChanges
            };

            // Send the data to the server
            const response = await fetch(`${API.service.update}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(saveData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`Failed to save data: ${errorData.error || response.statusText}`);
            }
            
            const responseData = await response.json();
            
            // If it was a new record, update the URL with the new ID
            if (isNewRecord && responseData.result?.id) {
                const encodedIds = btoa(JSON.stringify(responseData.result.id));
                const urlSafeIds = encodeURIComponent(encodedIds);

                window.history.replaceState(null, '', urlSafeIds);
            }
            
            // Bind the data returned from the server to update the form and grid
            bindData(responseData.result);
            
            // Show success message
            toast.success('Record saved successfully');

        } catch (error) {
            console.error('Save failed:', error);
            toast.error(`Failed to save record: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }, [bindData, form, id]);

    // EVENT HANDLER
    const actionBegin = useCallback(async (args: ActionEventArgs) => {
        await gridAction({
            args,
            apiEndpoint: API.service.get,
            gridRef,
            setData: setFormPage
        });
    }, []);
    
    const toolbarClick = useCallback(async (args: any) => {
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
            if (gridRef.current) {
                gridRef.current.addRecord(newRecord);
            }
        }
    }, []);
    
    const handlePageChange = useCallback(async (page: number) => {
        try {
            await loadRecord(page - 1);
            setPage(page);
        } catch (error) {
            console.error('Error fetching page:', error);
        }
    }, [loadRecord]);

    // ++++++++++++++ CONTENT ++++++++++++++

    // FORM CONTENT - Memoize form rows to prevent unnecessary re-renders
    const formRows: FormRowProps<FormSchemaData>[] = useMemo(() => [
        {
            columns: { xs: 1, sm: 2, md: 3, lg: 5 },
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
                    colSpan: { xs: 1, sm: 2, md: 2, lg: 1 }
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
    ], [form.control]);

    // GRID CONTENT - Memoize grid columns to prevent unnecessary re-renders
    const detailGridColumns = useMemo(() => [
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
        { field: 'isAccepted', headerText: 'Accepted', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
        { field: 'isRequired', headerText: 'Required', width: 25, type: 'boolean', displayAsCheckBox: true, editType: 'booleanedit', textAlign: 'Center', hideAtMedia: true },
    ], [firstNameLastName, roles, userSelection]);

    // Memoize Content component to prevent unnecessary re-renders
    const Content = useCallback(() => {
        return (
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
                                                gridRef={gridRef as any}
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
                                content={() => (<></>)}
                            ></TabItemDirective>
                        </TabItemsDirective>
                    </TabComponent>
                </div>
            </div>
        );
    }, [actionBegin, detailGridColumns, formDetailPage, formRows, form.control, form.formState.errors, handlePageChange, onSave, page, router, selectedRecords, toolbarClick, updateRecords]);

    return (
        <>
            {isLoading || !id ? <Loading /> : <Content />}
        </>
    );
};

export default RecordPage;
