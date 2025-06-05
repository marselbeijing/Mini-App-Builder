'use client';

import { Box, Paper, Typography } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
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

  return (
    <Box
      sx={{
        width: { xs: '40px', sm: '50px' },
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
        position: 'fixed',
        left: 0,
        top: 0,
        backgroundColor: 'background.paper',
        zIndex: 1200,
      }}
    >
      <Droppable droppableId="components" isDropDisabled>
        {(provided) => (
          <Box
            ref={provided.innerRef}
            {...provided.droppableProps}
            sx={{ 
              p: 1,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '4px'
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                borderRadius: '2px'
              }
            }}
          >
            {COMPONENTS.map((component, index) => {
              const Icon = component.icon;
              return (
                <Draggable
                  key={component.type}
                  draggableId={component.type}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <Paper
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      sx={{
                        p: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        cursor: 'grab',
                        width: '40px',
                        height: '40px',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        opacity: snapshot.isDragging ? 0.5 : 1,
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => {
                        const id = generateId();
                        addComponent({
                          id,
                          type: component.type,
                          props: {},
                          parentId: null,
                          children: [],
                        });
                      }}
                    >
                      <Icon sx={{ fontSize: '1.2rem' }} />
                      <Typography 
                        variant="caption" 
                        noWrap 
                        sx={{ 
                          fontSize: '0.6rem',
                          maxWidth: '100%',
                          textAlign: 'center'
                        }}
                      >
                        {component.label}
                      </Typography>
                    </Paper>
                  )}
                </Draggable>
              );
            })}
            {provided.placeholder}
          </Box>
        )}
      </Droppable>
    </Box>
  );
} 