import { useState } from 'react';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { redirect } from 'next/navigation';
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
import VolunteerEditDialog from './volunteer-edit-dialog';
import { User } from '@/src/business-layer/user-management/models/user';

export const VolunteerActionsCell = ({
  row,
}: {
  row: Row<User>;
}) => {
  // Form state management
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editVolunteer, setEditVolunteer] = useState<User | null>(
    null,
  );

  const handleRowClick = (row: User) => {
    if(!row) return;
    const userId = row.id;
    redirect(`/admin/volunteers/${userId}`);
  };

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
        <AlertTitle>Volunteer id copied to clipboard</AlertTitle>
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
              handleRowClick(row.original)
            }}
          >
            Open
          </DropdownMenuItem>         
          <DropdownMenuItem
            onClick={() => {
              setEditVolunteer(row.original);
              setEditDialogOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleCopyId}>Copy ID</DropdownMenuItem>          
        </DropdownMenuContent>
      </DropdownMenu>

      <VolunteerEditDialog
        open={editDialogOpen}
        closeDialog={() => setEditDialogOpen(false)}
        user={editVolunteer}
      />
    </>
  );
};
