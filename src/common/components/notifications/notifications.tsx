import { ReactNode } from 'react';
import { useQuery } from '@tanstack/react-query';
import { VariantProps } from 'class-variance-authority';
import { getInitials, timeAgo } from '@lib/utils';
import { Alert } from '@reui/ui/alert';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  AvatarIndicator,
  AvatarStatus,
  avatarStatusVariants,
} from '@reui/ui/avatar';
import { Badge } from '@reui/ui/badge';
import { Button } from '@reui/ui/button';
import { ScrollArea, ScrollBar } from '@reui/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@reui/ui/sheet';
import { ContentLoader } from '@components/common/content-loader';
import { SystemNotification } from '@/src/business-layer/user-management/models/system';

export const Notifications = ({ trigger }: { trigger: ReactNode }) => {
  const fetchData = async (): Promise<SystemNotification[]> => {
    const response = await fetch(`/api/account/notifications/latest`);
    if (!response.ok) {
      throw new Error('Failed to fetch notifications');
    }
    const result = await response.json();
    if (!result || !result.data) {
      throw new Error('Unexpected API response format');
    }
    return result.data; // Ensure this matches the expected data structure
  };

  const { data = [], isLoading } = useQuery({
    queryKey: ['account-notifications-latest'],
    queryFn: fetchData,
    staleTime: Infinity,
  });

  const getRandomStatus = (): VariantProps<
    typeof avatarStatusVariants
  >['variant'] => {
    const statuses = ['busy', 'online', 'away', 'offline'] as const;
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent
        className="space-y-0 gap-0 p-0 w-[375px] [&_[data-sheet-close]]:top-[1.3rem]"
        forceMount={true}
        side="right"
      >
        <SheetHeader className="px-5 py-4 border-b border-border">
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription className="sr-only">
            Your latest notifications
          </SheetDescription>
        </SheetHeader>
        <ScrollArea className="my-1 h-[calc(100%-75px)] divider-y">
          {isLoading && <ContentLoader />}

          {!isLoading && data.length === 0 && (
            <Alert close={false}>No notifications to show</Alert>
          )}

          {!isLoading && data.length > 0 && (
            <div className="divide-y divide-border">
              {data.map((item, index) => (
                <div
                  key={item.id}
                  className="px-4 py-3 flex gap-2.5 justify-start"
                >
                  <Avatar className="size-8 mt-1">
                    {item.user && item.user.avatar && (
                      <AvatarImage src={item.user.avatar} alt="" />
                    )}
                    <AvatarFallback className="text-xs">
                      {getInitials(item.user?.firstName || 'S')}
                    </AvatarFallback>
                    <AvatarIndicator className="-end-2 -bottom-2">
                      <AvatarStatus
                        variant={getRandomStatus()}
                        className="size-2.5"
                      />
                    </AvatarIndicator>
                  </Avatar>
                  <div className="text-sm py-0.5">
                    <div className="space-x-1 text-ellipsis">
                      <span className="font-semibold">
                        {item.user?.firstName || 'System'}
                      </span>
                      <span className="text-muted-foreground lowercase">
                        {item.subject}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-1">
                      <span className="text-xs text-muted-foreground">
                        {timeAgo(new Date(item.createdAt))}
                      </span>
                      {index === 2 && (
                        <Badge
                          variant="destructive"
                          appearance="outline"
                          size="sm"
                        >
                          System
                        </Badge>
                      )}
                      {index === 5 && (
                        <Badge variant="info" appearance="outline" size="sm">
                          Action
                        </Badge>
                      )}
                    </div>
                    {index === 8 && (
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <Button variant="outline" size="xs">
                          Decline
                        </Button>
                        <Button variant="mono" size="xs">
                          Accept
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <ScrollBar />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
