'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '@reui/ui/alert';
import { Button } from '@reui/ui/button';
import {
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@reui/ui/card';
import { Dialog, DialogContent, DialogFooter } from '@reui/ui/dialog';
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
import {
  AccountEmailSchema,
  AccountEmailSchemaType,
} from '../../forms/account-email-schema';

const ChangeEmailDialog = ({
  open,
  closeDialog,
}: {
  open: boolean;
  closeDialog: () => void;
}) => {
  const queryClient = useQueryClient();

  const form = useForm<AccountEmailSchemaType>({
    resolver: zodResolver(AccountEmailSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (open) {
      form.reset();
    }
  }, [open, form]);

  const mutation = useMutation({
    mutationFn: async (values: AccountEmailSchemaType) => {
      const response = await fetch(
        '/api/user-management/account/change-email',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        },
      );

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success('Email updated successfully', { position: 'top-center' });
      queryClient.invalidateQueries({ queryKey: ['user-account'] });
      closeDialog();
    },
    onError: (error: Error) => {
      toast.error(error.message, { position: 'top-center' });
    },
  });

  const isProcessing = mutation.status === 'pending';

  const handleSubmit = (values: AccountEmailSchemaType) => {
    mutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent close={false}>
        <CardHeader className="py-5">
          <CardHeading>
            <CardTitle>Change Email</CardTitle>
            <CardDescription>Manage profile information</CardDescription>
          </CardHeading>
        </CardHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            {mutation.status === 'error' && (
              <Alert variant="destructive">
                <AlertDescription>{mutation.error.message}</AlertDescription>
              </Alert>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter new email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isDirty || isProcessing}
              >
                {isProcessing && <Spinner className="animate-spin" />}
                Change email
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
