'use client';

import { FC } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { Close, MoreVert } from '@mui/icons-material';
import { useRouter } from 'next/navigation';

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

      {/* Toolbar */}
      <Box 
        component="nav"
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          p: 1,
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0'
        }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ ml: 'auto' }}
        >
          PUBLISH
        </Button>
      </Box>

      {/* Components Toolbar */}
      <Box 
        component="nav"
        sx={{ 
          display: 'flex',
          gap: 1,
          p: 1,
          bgcolor: 'white',
          borderBottom: '1px solid #e0e0e0',
          overflowX: 'auto'
        }}
      >
        {TOOLS.map((tool) => (
          <Box
            key={tool.id}
            component="button"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              p: 1,
              minWidth: 80,
              cursor: 'pointer',
              border: 'none',
              bgcolor: 'transparent',
              '&:hover': {
                bgcolor: '#f5f5f5'
              }
            }}
          >
            <Typography variant="body2">{tool.icon}</Typography>
            <Typography variant="caption">{tool.label}</Typography>
          </Box>
        ))}
      </Box>

      {/* Canvas */}
      <Box 
        component="main"
        sx={{ 
          flex: 1,
          p: 2,
          bgcolor: 'white',
          borderRadius: 2,
          m: 2,
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        {/* Canvas content will go here */}
      </Box>
    </Box>
  );
}; 