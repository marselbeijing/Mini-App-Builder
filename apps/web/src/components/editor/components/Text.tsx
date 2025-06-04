import { Typography } from '@mui/material';

interface TextProps {
  content?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'subtitle1' | 'subtitle2' | 'body1' | 'body2';
  color?: string;
}

export function Text({ content = 'Text', variant = 'body1', color }: TextProps) {
  return (
    <Typography variant={variant} color={color}>
      {content}
    </Typography>
  );
} 