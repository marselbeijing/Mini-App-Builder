import { Divider as MuiDivider } from '@mui/material';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  color?: string;
}

export function Divider({ orientation = 'horizontal', variant = 'fullWidth', color }: DividerProps) {
  return (
    <MuiDivider
      orientation={orientation}
      variant={variant}
      sx={{
        my: 2,
        borderColor: color,
      }}
    />
  );
} 