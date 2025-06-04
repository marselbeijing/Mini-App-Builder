'use client';

import { Box, Container, Paper } from '@mui/material';
import { Toolbar } from '@/components/editor/Toolbar';
import { Canvas } from '@/components/editor/Canvas';
import { ComponentPanel } from '@/components/editor/ComponentPanel';
import { PropertyPanel } from '@/components/editor/PropertyPanel';

export function EditorPage() {
  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="lg" sx={{ flex: 1, py: 2, display: 'flex', flexDirection: 'column' }}>
        <Paper 
          sx={{ 
            flex: 1, 
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          <Toolbar />
          <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <ComponentPanel />
            <Canvas />
            <PropertyPanel />
          </Box>
        </Paper>
      </Container>
    </Box>
  );
} 