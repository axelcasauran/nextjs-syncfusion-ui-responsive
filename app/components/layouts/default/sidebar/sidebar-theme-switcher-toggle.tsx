import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Switch, SwitchIndicator, SwitchWrapper } from '@/components/ui/switch';

export const SidebarThemeSwitcherToggle = () => {
  const { theme, setTheme } = useTheme();

  const handleThemeChange = (isChecked: boolean) => {
    setTheme(isChecked ? 'dark' : 'light');
  };

  return (
    <SwitchWrapper permanent={true}>
      <Switch
        size="lg"
        className="rounded-lg data-[state=checkeck]:bg-sidebar-button data-[state=unchecked]:bg-sidebar-button"
        thumbClassName="bg-white/10 rounded-lg"
        defaultChecked={theme === 'dark' ? true : false}
        onCheckedChange={(isChecked) => handleThemeChange(isChecked)}
      />
      <SwitchIndicator state="on">
        <Sun className="me-[2px] size-4 text-white" />
      </SwitchIndicator>
      <SwitchIndicator state="off">
        <Moon className="ms-[2px] size-4 text-white" />
      </SwitchIndicator>
    </SwitchWrapper>
  );
};
