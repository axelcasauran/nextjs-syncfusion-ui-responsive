import { Service } from '@/src/business-layer/church-management/models/service';
import EditDialog from '@framework/components/edit-dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@reui/ui/form';
import { Input } from '@reui/ui/input';
import { Textarea } from '@reui/ui/textarea';
import { FormSchema } from '../forms/forms';

interface PageEditDialogProps {
  open: boolean;
  closeDialog: () => void;
  data: Service;
}

export const PageEditDialog = ({ open, closeDialog, data }: PageEditDialogProps) => {
  const isEdit = !!data?.id;
  const title = 'Department';
  const query = ["departments"];
  
  const handleSubmit = async (values: Service) => {    
    const url = isEdit ? `/api/admin/departments/${data.id}` : '/api/admin/departments';
    const method = isEdit ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });

    if (!response.ok) {
      const { message } = await response.json();
      throw new Error(message);
    }

    return response.json();
  };

  return (
    <EditDialog
      open={open}
      closeDialog={closeDialog}
      initialValues={data}
      schema={FormSchema}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit ' + title : 'Add ' + title}
      successMessage= {title + ' updated successfully'}
      table={query}
      formFields={() => (
        <>
          <FormField
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Enter slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    />
  );
};