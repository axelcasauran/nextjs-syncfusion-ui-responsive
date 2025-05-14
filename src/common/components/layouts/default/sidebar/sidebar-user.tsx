import Link from 'next/link';
import { languages } from '@i18n/config';
import {
  AudioLines,
  Bell,
  Check,
  Globe,
  LogOut,
  SquareChartGantt,
} from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';
import { getInitials } from '@lib/utils';
import { useLanguage } from '@providers/i18n-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@reui/ui/avatar';
import { Badge } from '@reui/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@reui/ui/dropdown-menu';

export const SidebarUser = () => {
  const { data: session } = useSession();
  const { changeLanguage, language } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="cursor-pointer">
        <Avatar className="size-9">
          {session?.user.avatar && (
            <AvatarImage src={session?.user.avatar} alt="user" />
          )}
          <AvatarFallback className="text-sm bg-sidebar-button text-white border-0">
            {getInitials(session?.user.firstName || session?.user.email)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 pb-2"
        side="right"
        align="end"
        alignOffset={40}
      >
        <DropdownMenuLabel className="flex items-center gap-2.5">
          <Avatar className="size-10">
            {session?.user.avatar && (
              <AvatarImage src={session?.user.avatar} alt="admin" />
            )}
            <AvatarFallback className="text-sm">
              {getInitials(session?.user.firstName || session?.user.email)}
            </AvatarFallback>
          </Avatar>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="text-foreground truncate font-semibold">
              {session?.user.firstName} {session?.user.lastName}
            </span>
            <span className="truncate font-normal text-xs text-muted-foreground">
              {session?.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem asChild>
          <Link href="/account">
            <SquareChartGantt />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/notifications">
            <Bell />
            <span>Notifications</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/logs">
            <AudioLines />
            <span>Activity Logs</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Globe />
            <span className="flex grow items-center justify-between">
              <span>Language</span>
              <Badge
                appearance="outline"
                className="flex items-center gap-1.5 px-1.5"
              >
                <span className="text-[0.65rem] text-muted-foreground">
                  {language?.shortName}
                </span>
                <img
                  src={language?.flag}
                  alt="language flag"
                  className="size-3 rounded-full"
                />
              </Badge>
            </span>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent className="w-44" alignOffset={-130}>
              {languages.map((each) => (
                <DropdownMenuItem
                  key={each.code}
                  onSelect={() => changeLanguage(each.code)}
                  className=""
                >
                  <span className="flex grow items-center justify-between gap-2.5">
                    <img
                      src={each.flag}
                      alt={`${each.name} flag`}
                      className="size-4 rounded-full"
                    />
                    <span className="grow">{each.name}</span>
                    {language.code === each.code && (
                      <Check className="text-primary size-3.5!" />
                    )}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator className="my-2" />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
