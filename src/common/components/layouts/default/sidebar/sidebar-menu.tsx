'use client';

import { forwardRef, HTMLAttributes } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  FolderTree,
  Home,
  // Settings,
  ShoppingCart,
  SquareChartGantt,
  Users,
} from 'lucide-react';
import { ScrollArea, ScrollBar } from '@reui/ui/scroll-area';
import {
  Menu,
  MenuButton,
  MenuGroup,
  MenuGroupContent,
  MenuGroupLabel,
  MenuItem,
  MenuSub,
  MenuSubButton,
  MenuSubItem,
} from '../menu';

export const SidebarMenu = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  const pathname = usePathname();

  const matchPath = (path: string) =>
    path === pathname || (path.length > 1 && pathname.startsWith(path));

  return (
    <div ref={ref}>
      <ScrollArea className="h-full grow my-2 ps-5 pe-3 me-2 [&>[data-orientation]>[data-state]]:bg-gray-600">
        <Menu multipleExpand={false} matchPath={matchPath}>
          <MenuGroup>
            <MenuGroupLabel label="Parent" />
            <MenuGroupContent>            
              <MenuItem value="item-store-7" parent="root">
                <MenuButton
                  title="Kids"
                  icon={FolderTree}
                  href="/parents/kids"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-7" parent="root">
                <MenuButton
                  title="Events"
                  icon={FolderTree}
                  href="/parents/events"
                  slots={{ link: Link }}
                />
              </MenuItem>
            </MenuGroupContent>
          </MenuGroup>
          <MenuGroup>
            <MenuGroupLabel label="Kids Church" />
            <MenuGroupContent>
              <MenuItem value="item-store-1" parent="root">
                <MenuButton
                  title="Dashboard"
                  icon={Home}
                  href="/admin/dashboard"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-1" parent="root">
                <MenuButton
                  title="Volunteers"
                  icon={ShoppingCart}
                  href="/admin/volunteers"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-2" parent="root">
                <MenuButton
                  title="Departments"
                  icon={ShoppingCart}
                  href="/admin/departments"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-5" parent="root">
                <MenuButton
                  title="Services"
                  icon={Users}
                  href="/admin/service-and-events"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-6" parent="root">
                <MenuButton
                  title="Syncfusion"
                  icon={SquareChartGantt}
                  href="/admin/syncfusion"
                  slots={{ link: Link }}
                />
              </MenuItem>
              <MenuItem value="item-store-7" parent="root">
                <MenuButton
                  title="Kids and Parents"
                  icon={FolderTree}
                  href="/admin/syncfusion"
                  slots={{ link: Link }}
                />
              </MenuItem>
            </MenuGroupContent>
          </MenuGroup>
          <MenuGroup>
            <MenuGroupLabel label="Admin" />
            <MenuGroupContent>
              <MenuItem value="item-system-1" parent="root" toggle>
                <MenuButton title="User Management" icon={Users} arrow />
                <MenuSub>
                  <MenuSubItem>
                    <MenuSubButton
                      title="Users"
                      href="/user-management/users"
                      slots={{ link: Link }}
                    />
                  </MenuSubItem>
                  <MenuSubItem>
                    <MenuSubButton
                      title="Roles"
                      href="/user-management/roles"
                      slots={{ link: Link }}
                    />
                  </MenuSubItem>
                  <MenuSubItem>
                    <MenuSubButton
                      title="Permissions"
                      href="/user-management/permissions"
                      slots={{ link: Link }}
                    />
                  </MenuSubItem>
                </MenuSub>
              </MenuItem>
              <MenuItem>
                <MenuButton
                  title="Activity Logs"
                  icon={Activity}
                  href="/logs"
                  slots={{ link: Link }}
                />
              </MenuItem>
              {/* <MenuItem>
                <MenuButton
                  title="Settings"
                  icon={Settings}
                  href="/settings"
                  slots={{ link: Link }}
                />
              </MenuItem> */}
            </MenuGroupContent>
          </MenuGroup>
        </Menu>
        <ScrollBar />
      </ScrollArea>
    </div>
  );
});

SidebarMenu.displayName = 'SidebarMenu';
