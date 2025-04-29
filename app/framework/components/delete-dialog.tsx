'use client';

import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinners';

interface DeleteDialogProps<T> {
  open: boolean;
  closeDialog: () => void;
  entity: T;
  entityName?: string; // Optional name for the entity (e.g., "Department")
  getId: (entity: T) => string; // Function to extract the ID from the entity
  deleteEndpoint: (id: string) => string; // Function to generate the API endpoint
  onSuccess?: () => void; // Optional callback for success
  onError?: (error: Error) => void; // Optional callback for error
}

const DeleteDialog = <T,>({
  open,
  closeDialog,
  entity,
  entityName = 'Item',
  getId,
  deleteEndpoint,
  onSuccess,
  onError,
}: DeleteDialogProps<T>) => {
  const queryClient = useQueryClient();

  // Define the mutation for deleting the entity
  const mutation = useMutation({
    mutationFn: async () => {
      const id = getId(entity);
      const response = await fetch(deleteEndpoint(id), {
        method: 'DELETE',
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: () => {
      const message = `${entityName} deleted successfully`;

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ));

      queryClient.invalidateQueries(); // Optionally refetch queries
      closeDialog();
      onSuccess?.();
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
      onError?.(error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="md:w-[450px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this {entityName.toLowerCase()}?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutation.mutate()}
            disabled={mutation.status === 'pending'}
          >
            {mutation.status === 'pending' && (
              <Spinner className="animate-spin" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;