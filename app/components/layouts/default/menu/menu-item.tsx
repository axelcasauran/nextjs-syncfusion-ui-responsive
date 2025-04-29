import {
  NestedMenuItem,
  NestedMenuItemProps,
} from '../../../common/nested-menu';

export function MenuItem({ children, ...props }: NestedMenuItemProps) {
  return (
    <NestedMenuItem
      className="flex flex-col items-stretch justify-start grow"
      {...props}
    >
      {children}
    </NestedMenuItem>
  );
}
