import Link from 'next/link';
import {
  FolderTree,
  Plus,
  ShieldCheck,
  SquareChartGantt,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { comingSoonToast } from '@/app/components/common/coming-soon-toast';

export const SidebarAddNew = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          className="grow text-white bg-sidebar-button hover:bg-sidebar-button-highlight data-[state=open]:bg-sidebar-button-highlight"
        >
          <Plus />
          Add new
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48" side="right" align="start">
        <DropdownMenuLabel>Quick Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild onClick={() => comingSoonToast()}>
          <span>
            <SquareChartGantt />
            <span>Add Product</span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/categories">
            <FolderTree />
            <span>Add Category</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/user-management/users/">
            <User />
            <span>Add User</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/user-management/roles/">
            <ShieldCheck />
            <span>Add Role</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
