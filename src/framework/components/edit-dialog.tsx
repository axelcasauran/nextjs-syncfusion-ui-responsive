import * as React from 'react';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@reui/ui/dialog';
import { Button } from '@reui/ui/button';
import { Form } from '@reui/ui/form';
import { ConfirmDismissDialog } from '@components/common/confirm-dismiss-dialog';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { Save } from 'lucide-react';
import { Spinner } from '@reui/ui/spinners';

interface EditDialogProps<T extends FieldValues> {
  open: boolean;
  closeDialog: () => void;
  initialValues: T;
  schema: z.ZodSchema;
  onSubmit: (values: T) => Promise<void>;
  title: string;
  formFields: (form: ReturnType<typeof useForm>) => React.ReactNode;
  successMessage?: string;
  table?: string[];
}

const EditDialog = <T extends FieldValues>({
  open,
  closeDialog,
  initialValues,
  schema,
  onSubmit,
  title,
  formFields,
  successMessage,
  table,
}: EditDialogProps<T>) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialValues as DefaultValues<T>,
  });

  useEffect(() => {
    if (open) {
      form.reset(initialValues);
    }
  }, [open, initialValues, form]);

  const handleSubmit = async (values: T) => {
    try {
      setIsSubmitting(true);
      await onSubmit(values);

      queryClient.invalidateQueries({ queryKey: table });
      closeDialog();

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{successMessage}</AlertTitle>
        </Alert>
      ));
    } catch (error) {
      console.error('Submit error:', error);
      toast.custom(() => (
        <Alert variant="mono" icon="destructive">
          <AlertIcon>
            <RiErrorWarningFill />
          </AlertIcon>
          <AlertTitle>error</AlertTitle>
        </Alert>
      ));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDialogClose = () => {
    if (form.formState.isDirty) {
      setShowConfirmDialog(true);
    } else {
      closeDialog();
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              {formFields(form)}
              <DialogFooter>
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting || !form.formState.isDirty}>
                  {isSubmitting && <Spinner className="animate-spin" />}
                  <Save /> Save
                </Button>                
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <ConfirmDismissDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        onConfirm={() => {
          form.reset();
          setShowConfirmDialog(false);
          closeDialog();
        }}
        onCancel={() => setShowConfirmDialog(false)}
      />
    </>
  );
};

export default EditDialog;