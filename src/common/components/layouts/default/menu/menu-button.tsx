import { ChevronDown, type LucideIcon } from 'lucide-react';
import {
  NestedMenuButton,
  NestedMenuButtonProps,
} from '../../../common/nested-menu';

export interface IMenuButtonProps extends NestedMenuButtonProps {
  title?: string;
  icon?: LucideIcon;
  arrow?: boolean;
}

export function MenuButton({ ...props }: IMenuButtonProps) {
  const { title, icon: Icon, arrow, ...rest } = props;

  const rootClass = `
		cursor-pointer rounded-md flex grow items-center gap-2.5 p-2.5 
		${!arrow && `hover:bg-sidebar-menu-button-highlight`}
		data-[active=true]:bg-sidebar-menu-button-highlight
	`;

  const iconClass = `
		size-4 
		text-sidebar-menu-button-icon 
		[[data-active=true]>&]:text-sidebar-menu-button-icon-highlight
		[[data-here=true]>&]:text-sidebar-menu-button-icon-highlight
	`;

  const titleClass = `
		grow text-sm font-medium text-start 
		text-sidebar-menu-button-title 
		[[data-active=true]>&]:text-sidebar-menu-button-title-highlight
		[[data-here=true]>&]:text-sidebar-menu-button-title-highlight
	`;

  const arrowClass = `
		size-3.5 
		text-sidebar-menu-button-icon 
		[[data-active=true]>&]:text-sidebar-menu-button-icon-highlight
		[[data-here=true]>&]:text-sidebar-menu-button-icon-highlight
		[[data-open=true]>&]:-rotate-180
	`;

  return (
    <NestedMenuButton {...rest} className={rootClass}>
      {Icon && <Icon className={iconClass} />}

      <span className={titleClass}>{title}</span>

      {arrow && <ChevronDown className={arrowClass} />}
    </NestedMenuButton>
  );
}
