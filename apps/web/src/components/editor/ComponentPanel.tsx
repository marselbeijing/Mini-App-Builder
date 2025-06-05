'use client';

import { Box, Paper, Typography } from '@mui/material';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import SmartButtonIcon from '@mui/icons-material/SmartButton';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import ImageIcon from '@mui/icons-material/Image';
import ViewListIcon from '@mui/icons-material/ViewList';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { useMemo } from 'react';
import { useEditorStore } from '@/store/editorStore';
import { ComponentType } from './components';
import { generateId } from '@/utils/id';

export const COMPONENT_TYPES = {
  BUTTON: 'button',
  TEXT: 'text',
  IMAGE: 'image',
  LIST: 'list',
  DIVIDER: 'divider',
  CONTAINER: 'container',
} as const;

const COMPONENTS = [
  { type: COMPONENT_TYPES.BUTTON as ComponentType, icon: SmartButtonIcon, label: 'Button' },
  { type: COMPONENT_TYPES.TEXT as ComponentType, icon: TextFieldsIcon, label: 'Text' },
  { type: COMPONENT_TYPES.IMAGE as ComponentType, icon: ImageIcon, label: 'Image' },
  { type: COMPONENT_TYPES.LIST as ComponentType, icon: ViewListIcon, label: 'List' },
  { type: COMPONENT_TYPES.DIVIDER as ComponentType, icon: RemoveIcon, label: 'Divider' },
  { type: COMPONENT_TYPES.CONTAINER as ComponentType, icon: CheckBoxOutlineBlankIcon, label: 'Container' },
];

export function ComponentPanel() {
  const addComponent = useEditorStore((state) => state.actions.addComponent);

  const componentList = useMemo(() => {
    return (
      <Box sx={{ 
        p: 2,
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 2
      }}>
        {COMPONENTS.map((component, index) => {
          const Icon = component.icon;
          return (
            <Paper
              key={component.type}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                flex: '1 1 auto',
                minWidth: '100px',
                justifyContent: 'center',
                '&:hover': {
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => addComponent({
                id: generateId(),
                type: component.type,
                props: {},
                parentId: null,
                children: []
              })}
            >
              <Icon sx={{ mr: 1 }} />
              <Typography>{component.label}</Typography>
            </Paper>
          );
        })}
      </Box>
    );
  }, [addComponent]);

  return (
    <Box
      sx={{
        width: '100%',
        borderRight: 1,
        borderColor: 'divider',
        overflow: 'auto',
      }}
    >
      <Typography variant="h6" sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
        Компоненты
      </Typography>
      {componentList}
    </Box>
  );
} 