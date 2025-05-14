import { formatDate, getInitials } from '@lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@reui/ui/avatar';
import { Badge, BadgeDot, BadgeProps } from '@reui/ui/badge';
import { List, ListItem } from '@reui/ui/list';
import { getUserStatusProps } from '@user-management-app/users/constants/status';
import { User, UserStatus } from '@/src/business-layer/user-management/models/user';
import { comingSoonToast } from '../common/coming-soon-toast';
import { useSearch } from './search-context';

export default function SearchCustomers() {
  const { data } = useSearch();
  const users = data?.customers || [];

  return (
    <List>
      {users.map((user: User) => {
        const status = user.status as UserStatus;
        const statusProps = getUserStatusProps(status);
        return (
          <ListItem value={user.id} key={user.id} asChild>
            <div
              key={user.id}
              onClick={comingSoonToast}
              className="group flex grow items-center justify-between text-sm rounded-lg hover:bg-accent/50 cursor-pointer p-2 gap-1"
            >
              <div className="inline-flex items-center gap-2.5">
                <div className="inline-flex items-center gap-2.5 w-[200px] truncate">
                  <Avatar className="h-6 w-6">
                    {user.avatar && <AvatarImage src={user.avatar} alt="" />}
                    <AvatarFallback className="text-xs">
                      {getInitials(user.firstName || user.email)}
                    </AvatarFallback>
                  </Avatar>
                  <span>{user.firstName || user.email}</span>
                </div>
                <Badge
                  className="hidden group-hover:inline-flex gap-1"
                  variant="info"
                  appearance="outline"
                >
                  <span className="opacity-80">Joined:</span>
                  {formatDate(new Date(user.createdAt))}
                </Badge>
              </div>
              <div className="inline-flex items-center gap-5">
                <div className="shrink-0 w-28">
                  <Badge
                    variant={statusProps.variant as keyof BadgeProps['variant']}
                    appearance="ghost"
                  >
                    <BadgeDot /> {statusProps.label}
                  </Badge>
                </div>
              </div>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}
