import { NestedMenuSub, NestedMenuSubProps } from '../../../common/nested-menu';

export function MenuSub({ children, ...props }: NestedMenuSubProps) {
  return (
    <NestedMenuSub
      className="flex flex-col items-stretch grow gap-0.5 ps-7"
      {...props}
    >
      {children}
    </NestedMenuSub>
  );
}
