import { Button as MuiButton } from '@mui/material';

interface ButtonProps {
  text?: string;
  variant?: 'text' | 'contained' | 'outlined';
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
}

export function Button({ text = 'Button', variant = 'contained', color = 'primary' }: ButtonProps) {
  return (
    <MuiButton variant={variant} color={color}>
      {text}
    </MuiButton>
  );
} 