import { useState } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import DeleteDialog from './delete-dialog';
// import EditDialog from './edit-dialog';

interface ActionsCellProps<T> {
  row: Row<T>;
  deleteEndpoint: (id: string) => string;
  EditDialogComponent: React.ComponentType<{
    open: boolean;
    closeDialog: () => void;
    data: T;
  }>;
}

export const ActionsCell = <T extends { id: string }>({
  row,
  deleteEndpoint,
  EditDialogComponent,
}: ActionsCellProps<T>) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { copyToClipboard } = useCopyToClipboard();

  const handleCopyId = () => {
    copyToClipboard(row.original.id);
    toast.custom(() => (
      <Alert variant="mono" icon="success">
        <AlertIcon><RiCheckboxCircleFill /></AlertIcon>
        <AlertTitle>ID copied to clipboard</AlertTitle>
      </Alert>
    ));
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="h-7 w-7" mode="icon" variant="ghost">
            <Ellipsis />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem onClick={() => setEditDialogOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyId}>
            Copy ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditDialogComponent
        open={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        data={row.original}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        closeDialog={() => setDeleteDialogOpen(false)}
        entity={row.original}
        entityName="Record"
        getId={(record) => record.id}
        deleteEndpoint={deleteEndpoint}
      />
    </>
  );
};

// import { useState } from 'react';
// import { RiCheckboxCircleFill } from '@remixicon/react';
// import { Row } from '@tanstack/react-table';
// import { Ellipsis } from 'lucide-react';
// import { toast } from 'sonner';
// import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
// import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
// import { Button } from '@/components/ui/button';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from '@/components/ui/dropdown-menu';
// import DeleteDialog from './delete-dialog';
// import EditDialog from './edit-dialog';
// import { z } from 'zod';

// interface ActionsCellProps<T extends Record<string, unknown>> {
//   row: Row<T>;
//   onEdit?: (record: T) => void;
//   onDelete?: (record: T) => void;
//   getId?: (record: T) => string; // Optional function to get the ID
//   deleteEndpoint: (id: string) => string; // Function to generate the delete endpoint
//   Component: React.FC<T>; // Component to render
//   componentProps: T; // Props to pass to the component
//   editDialogProps: {
//     schema: z.ZodSchema; // Zod schema for validation
//     onSubmit: (values: T) => Promise<void>; // Submit handler
//     title: string; // Title for the edit dialog
//     formFields: (form: Record<string, unknown>) => React.ReactNode; // Function to render form fields
//   };
// }

// export const ActionsCell = <T extends { id: string }>({
//   row,
//   onEdit,
//   onDelete,
//   getId = (record: { id: string }) => record.id, // Default to `id` property
//   deleteEndpoint,
//   editDialogProps,
//   Component, 
//   componentProps,
// }: ActionsCellProps<T>) => {
//   const [editDialogOpen, setEditDialogOpen] = useState(false);
//   const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
//   const [editRecord, setEditRecord] = useState<T | null>(null);
//   const [deleteRecord, setDeleteRecord] = useState<T | null>(null);

//   const { copyToClipboard } = useCopyToClipboard();

//   const handleCopyId = () => {
//     const id = getId(row.original);
//     copyToClipboard(id);

//     toast.custom((t) => (
//       <Alert
//         variant="mono"
//         icon="success"
//         close={false}
//         onClose={() => toast.dismiss(t)}
//       >
//         <AlertIcon>
//           <RiCheckboxCircleFill />
//         </AlertIcon>
//         <AlertTitle>ID copied to clipboard</AlertTitle>
//       </Alert>
//     ));
//   };

//   return (
//     <>
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button className="h-7 w-7" mode="icon" variant="ghost">
//             <Ellipsis />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent side="bottom" align="start">
//           <DropdownMenuItem
//             onClick={() => {
//               setEditRecord(row.original);
//               setEditDialogOpen(true);
//               onEdit?.(row.original);
//             }}
//           >
//             Edit
//           </DropdownMenuItem>
//           <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
//           <DropdownMenuSeparator />
//           <DropdownMenuItem
//             variant="destructive"
//             onClick={() => {
//               setDeleteRecord(row.original);
//               setDeleteDialogOpen(true);
//               onDelete?.(row.original);
//             }}
//           >
//             Delete
//           </DropdownMenuItem>
//         </DropdownMenuContent>
//       </DropdownMenu>

//       {/* Edit Dialog */}
//       {editRecord && (
//         <EditDialog
//           open={editDialogOpen}
//           closeDialog={() => setEditDialogOpen(false)}
//           initialValues={editRecord}
//           schema={editDialogProps.schema}
//           onSubmit={editDialogProps.onSubmit}
//           title={editDialogProps.title}
//           formFields={editDialogProps.formFields}
//           componentProps={componentProps}
//           component={Component}
//         />
//       )}

//       {/* Delete Dialog */}
//       {deleteRecord && (
//         <DeleteDialog
//           open={deleteDialogOpen}
//           closeDialog={() => setDeleteDialogOpen(false)}
//           entity={deleteRecord}
//           entityName="Record"
//           getId={getId}
//           deleteEndpoint={deleteEndpoint}
//           onSuccess={() => console.log('Record deleted successfully')}
//           onError={(error) => console.error('Error deleting record:', error)}
//         />
//       )}
//     </>
//   );
// };