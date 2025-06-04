import { Box } from '@mui/material';

interface ContainerProps {
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export function Container({ maxWidth = 'lg', padding = 2, backgroundColor, children }: ContainerProps) {
  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: (theme) => theme.breakpoints.values[maxWidth],
        mx: 'auto',
        p: padding,
        backgroundColor,
        borderRadius: 1,
        border: '1px dashed',
        borderColor: 'divider',
      }}
    >
      {children || (
        <Box
          sx={{
            height: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'text.secondary',
          }}
        >
          Контейнер
        </Box>
      )}
    </Box>
  );
} 