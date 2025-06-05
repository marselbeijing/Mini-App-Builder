import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface PhonePreviewProps {
  children: ReactNode;
}

export function PhonePreview({ children }: PhonePreviewProps) {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        p: 2,
        overflow: 'auto'
      }}
    >
      <Box
        className="phone-container"
        sx={{
          position: 'relative',
          width: 375,
          height: 667,
          backgroundColor: 'background.paper',
          borderRadius: '36px',
          border: '14px solid #1a1f2c',
          overflow: 'auto',
          '&::-webkit-scrollbar': {
            width: '4px'
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: '2px'
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
} 