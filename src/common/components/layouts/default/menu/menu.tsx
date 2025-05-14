import { NestedMenu, NestedMenuProps } from '../../../common/nested-menu';

export function Menu({ children, ...props }: NestedMenuProps) {
  return (
    <NestedMenu {...props} className="flex flex-col gap-5">
      {children}
    </NestedMenu>
  );
}
