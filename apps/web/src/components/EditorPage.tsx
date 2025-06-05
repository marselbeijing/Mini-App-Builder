'use client';

import { FC } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { Close, MoreVert } from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { Canvas } from './editor/Canvas';
import { ComponentPanel } from './editor/ComponentPanel';
import { Toolbar } from './editor/Toolbar';

interface Tool {
  id: string;
  label: string;
  icon: string;
}

const TOOLS: Tool[] = [
  { id: 'button', label: 'Button', icon: '⬜' },
  { id: 'text', label: 'Text', icon: 'Tt' },
  { id: 'image', label: 'Image', icon: '🖼' },
  { id: 'list', label: 'List', icon: '≡' },
  { id: 'divider', label: 'Divider', icon: '—' },
  { id: 'container', label: 'Container', icon: '□' },
];

export const EditorPage: FC = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <Box 
      component="main"
      sx={{ 
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5'
      }}
    >
      {/* Header */}
      <Box
        component="header" 
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          bgcolor: '#1a1f2c'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton 
            onClick={handleBack}
            sx={{ color: 'white' }}
            aria-label="Назад"
          >
            <Close />
          </IconButton>
          <Box>
            <Typography variant="h6" sx={{ color: 'white' }}>
              Mini App Builder
            </Typography>
            <Typography variant="caption" sx={{ color: 'gray' }}>
              мини-приложение
            </Typography>
          </Box>
        </Box>
        <IconButton 
          sx={{ color: 'white' }}
          aria-label="Меню"
        >
          <MoreVert />
        </IconButton>
      </Box>

      <Toolbar />
      
      <Box sx={{ 
        display: 'flex',
        flex: 1,
        overflow: 'hidden'
      }}>
        <ComponentPanel />
        <Canvas />
      </Box>
    </Box>
  );
}; 