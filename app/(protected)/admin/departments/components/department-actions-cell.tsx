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
import DepartmentDeleteDialog from './department-delete-dialog';
import DepartmentEditDialog from './department-edit-dialog';
import { Department } from '@/app/models/department';

export const DepartmentActionsCell = ({
  row,
}: {
  row: Row<Department>;
}) => {
  // Form state management
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDepartment, setEditDepartment] = useState<Department | null>(
    null,
  );
  const [deleteDepartment, setDeleteDepartment] =
    useState<Department | null>(null);

  const { copyToClipboard } = useCopyToClipboard();
  const handleCopyId = () => {
    copyToClipboard(row.original.id);

    toast.custom((t) => (
      <Alert
        variant="mono"
        icon="success"
        close={false}
        onClose={() => toast.dismiss(t)}
      >
        <AlertIcon>
          <RiCheckboxCircleFill />
        </AlertIcon>
        <AlertTitle>Department id copied to clipboard</AlertTitle>
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
          <DropdownMenuItem
            onClick={() => {
              setEditDepartment(row.original);
              setEditDialogOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            onClick={() => {
              setDeleteDepartment(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DepartmentEditDialog
        open={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        department={editDepartment}
      />

      {deleteDepartment && (
        <DepartmentDeleteDialog
          open={deleteDialogOpen}
          closeDialog={() => setDeleteDialogOpen(false)}
          department={deleteDepartment}
        />
      )}
    </>
  );
};
