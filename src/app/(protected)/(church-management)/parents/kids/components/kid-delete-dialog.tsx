'use client';

import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { Button } from '@reui/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@reui/ui/dialog';
import { Spinner } from '@reui/ui/spinners';
import { Kid } from '@/src/business-layer/church-management/models/kid';

const KidDeleteDialog = ({
  open,
  closeDialog,
  kid,
}: {
  open: boolean;
  closeDialog: () => void;
  kid: Kid;
}) => {
  const queryClient = useQueryClient();

  // Define the mutation for deleting the kid
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/parents/kids/${kid.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message);
      }

      return response.json();
    },
    onSuccess: () => {
      const message = 'Kid deleted successfully';

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>{message}</AlertTitle>
        </Alert>
      ));

      queryClient.invalidateQueries({ queryKey: ['kids'] }); // Refetch kids list
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

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="md:w-[450px]">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this kid?
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

export default KidDeleteDialog;
