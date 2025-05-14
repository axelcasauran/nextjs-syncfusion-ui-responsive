import { z } from 'zod';
import { Service } from '@/src/business-layer/church-management/models/service';
import EditDialog from '@framework/components/edit-dialog';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@reui/ui/form';
import { Input } from '@reui/ui/input';
import { Textarea } from '@reui/ui/textarea';

const ServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
});

interface ServiceEditDialogProps {
  open: boolean;
  closeDialog: () => void;
  data: Service;
}

export const ServiceEditDialog = ({ open, closeDialog, data }: ServiceEditDialogProps) => {
  const isEdit = !!data?.id;
  
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
      schema={ServiceSchema}
      onSubmit={handleSubmit}
      title={isEdit ? 'Edit Service' : 'Add Service'}
      successMessage='Service updated successfully'
      table={["departments"]}
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