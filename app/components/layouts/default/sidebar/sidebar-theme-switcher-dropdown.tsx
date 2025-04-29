import { MonitorCog, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const SidebarThemeSwitcherDropdown = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (newTheme: 'dark' | 'light' | 'system') => {
    setTheme(newTheme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          mode="icon"
          size="sm"
          className="
            bg-transparent 
            text-white
            data-[state=open]:bg-sidebar-button-highlight 
            hover:bg-sidebar-button-highlight
          "
        >
          {theme === 'light' && <Sun />}
          {theme === 'dark' && <Moon />}
          {theme === 'system' && <MonitorCog />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent side="bottom" align="start" sideOffset={5}>
        <DropdownMenuItem onSelect={() => handleThemeChange('light')}>
          <Sun />
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleThemeChange('dark')}>
          <Moon />
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => handleThemeChange('system')}>
          <MonitorCog />
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
