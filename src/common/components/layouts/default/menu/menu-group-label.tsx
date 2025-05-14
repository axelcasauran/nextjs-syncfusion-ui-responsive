export interface MenuGroupLabelProps {
  label?: string;
}

export const MenuGroupLabel = ({ label }: MenuGroupLabelProps) => {
  const classes = 'text-sm px-2.5 text-sidebar-menu-label';

  return <div className={classes}>{label}</div>;
};
