import { useState } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Row } from '@tanstack/react-table';
import { Ellipsis } from 'lucide-react';
import { toast } from 'sonner';
import { useCopyToClipboard } from '@hooks/use-copy-to-clipboard';
import { Alert, AlertIcon, AlertTitle } from '@reui/ui/alert';
import { Button } from '@reui/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@reui/ui/dropdown-menu';
import KidDeleteDialog from './kid-delete-dialog';
import KidEditDialog from './kid-edit-dialog';
import { Kid } from '@/src/business-layer/church-management/models/kid';

export const KidActionsCell = ({
  row,
}: {
  row: Row<Kid>;
}) => {
  // Form state management
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editKid, setEditKid] = useState<Kid | null>(
    null,
  );
  const [deleteKid, setDeleteKid] =
    useState<Kid | null>(null);

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
        <AlertTitle>Kid id copied to clipboard</AlertTitle>
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
              setEditKid(row.original);
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
              setDeleteKid(row.original);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <KidEditDialog
        open={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        kid={editKid}
      />

      {deleteKid && (
        <KidDeleteDialog
          open={deleteDialogOpen}
          closeDialog={() => setDeleteDialogOpen(false)}
          kid={deleteKid}
        />
      )}
    </>
  );
};
