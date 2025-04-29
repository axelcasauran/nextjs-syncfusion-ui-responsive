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

interface GroupDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  entityIds: string[];
  entityName?: string; // Optional name for the entity (e.g., "Departments")
  deleteEndpoint: string; // API endpoint for deletion
  onSuccess?: () => void; // Optional callback for success
  onError?: (error: unknown) => void; // Optional callback for error
}

const GroupDeleteDialog = ({
  open,
  closeDialog,
  entityIds,
  entityName = 'Department',
  deleteEndpoint = '/api/admin/departments/delete',
  onSuccess,
  onError,
}: GroupDeleteDialogProps) => {
  const queryClient = useQueryClient();

  // Define the mutation for deleting entities
  const mutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(deleteEndpoint, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ entityIds }),
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to delete entities');
      }

      return response.json();
    },
    onSuccess: () => {
      const message = `${entityName} deleted successfully.`;

      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );

      queryClient.invalidateQueries(); // Refetch queries to update the UI
      closeDialog(); // Close the dialog
      onSuccess?.(); // Call the success callback
    },
    onError: (error: Error) => {
      const message = error.message || 'An error occurred while deleting.';
      console.error('Error deleting entities:', error); // Debugging log

      toast.custom(
        () => (
          <Alert variant="mono" icon="destructive">
            <AlertIcon>
              <RiErrorWarningFill />
            </AlertIcon>
            <AlertTitle>{message}</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );

      onError?.(error); // Call the error callback
    },
  });

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the selected {entityName.toLowerCase()}?
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

export default GroupDeleteDialog;

// import GroupDeleteDialog from './delete-group-dialog';
// import { GroupDeleteDialogProps as BaseGroupDeleteDialogProps } from './delete-group-dialog-props';

// interface GroupDeleteDialogProps extends BaseGroupDeleteDialogProps {
//   entityIds: string[];
//   entityName: string;
//   deleteEndpoint: string;
// }

// interface GroupDeleteDialogProps {
//   open: boolean;
//   closeDialog: () => void;
//   selectedIds: string[];
//   onSuccess?: () => void;
//   onError?: (error: unknown) => void;
// }

// const GroupDeleteDialogWrapper = ({
//   open,
//   closeDialog,
//   selectedIds,
// }: GroupDeleteDialogProps) => {
//   return (
//     <GroupDeleteDialog
//       open={open}
//       closeDialog={closeDialog}
//       entityIds={selectedIds}
//       entityName="Departments"
//       deleteEndpoint="/api/admin/departments/delete"
//       onSuccess={() => console.log('Departments deleted successfully')}
//       onError={(error: unknown) => console.error('Error deleting departments:', error)} selectedIds={[]}    />
//   );
// };

// export default GroupDeleteDialogWrapper;