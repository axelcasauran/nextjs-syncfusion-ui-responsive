import {
  NestedMenuItem,
  NestedMenuItemProps,
} from '../../../common/nested-menu';

export function MenuSubItem({ children, ...props }: NestedMenuItemProps) {
  return (
    <NestedMenuItem className="flex flex-col  grow" {...props}>
      {children}
    </NestedMenuItem>
  );
}
