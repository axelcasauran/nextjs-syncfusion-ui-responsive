'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { Button } from '@reui/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@reui/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@reui/ui/form';
import { Input } from '@reui/ui/input';
import { Spinner } from '@reui/ui/spinners';
import { ConfirmDismissDialog } from '@components/common/confirm-dismiss-dialog';
import { FormSchema, FormSchemaType } from '../forms/forms';
import { Department } from '@/src/business-layer/church-management/models/department';

const DepartmentEditDialog = ({
  open,
  closeDialog,
  department,
}: {
  open: boolean;
  closeDialog: () => void;
  department?: Department | null;
}) => {
  const queryClient = useQueryClient();

  // State to manage the confirm dialog
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Form initialization
  const form = useForm<FormSchemaType>({
    resolver: zodResolver(FormSchema),
    defaultValues: { name: '', slug: '', description: '' },
    mode: 'onSubmit',
  });

  // Reset form values when dialog is opened
  useEffect(() => {
    if (open) {
      form.reset({
        name: department?.name || '',
        slug: department?.slug || '',
        description: department?.description ?? ''
      });
    }
  }, [open, department, form]);

  // Mutation for creating/updating department
  const mutation = useMutation({
    mutationFn: async (values: FormSchemaType) => {
      const isEdit = !!department?.id;
      const url = isEdit ? `/api/admin/departments/${department.id}` : '/api/admin/departments';
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
    },
    onSuccess: () => {
      const message = department
        ? 'Department updated successfully'
        : 'Department added successfully';

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ));

      queryClient.invalidateQueries({ queryKey: ['departments'] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast.custom(() => (
        <Alert variant="mono" icon="destructive">
          <AlertIcon>
            <RiErrorWarningFill />
          </AlertIcon>
          <AlertTitle>{error.message}</AlertTitle>
        </Alert>
      ));
    },
  });

  // Derive the loading state from the mutation status
  const isLoading = mutation.status === 'pending';

  // Handle form submission
  const handleSubmit = (values: FormSchemaType) => {
    mutation.mutate(values);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      closeDialog();
    }
  };

  // Handle confirmation to discard changes
  const handleConfirmDiscard = () => {
    form.reset();
    setShowConfirmDialog(false);
    closeDialog();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent close={false}>
          <DialogHeader>
            <DialogTitle>
              {department ? 'Edit Department' : 'Add Department'}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
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
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
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
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDialogClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !form.formState.isDirty}
                >
                  {isLoading && <Spinner className="animate-spin" />}
                  {department ? 'Update Department' : 'Add Department'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      <ConfirmDismissDialog
        open={showConfirmDialog}
        onOpenChange={() => setShowConfirmDialog(false)}
        onConfirm={handleConfirmDiscard}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
};

export default DepartmentEditDialog;
