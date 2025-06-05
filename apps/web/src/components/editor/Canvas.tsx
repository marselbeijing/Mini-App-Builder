import { Box, Menu, MenuItem, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DragDropContext, Droppable, DroppableProvided, DropResult, Draggable } from 'react-beautiful-dnd';
import { Button, Text, CustomImage, List, Divider, Container, ComponentType, isContainer } from './components';
import { useEditorStore } from '@/store/editorStore';
import { useState, useCallback, useEffect, ReactNode, memo } from 'react';
import { PhonePreview } from './PhonePreview';

interface ComponentProps {
  children?: ReactNode;
  [key: string]: any;
}

const componentMap: Record<ComponentType, React.ComponentType<any>> = {
  button: Button,
  text: Text,
  image: CustomImage,
  list: List,
  divider: Divider,
  container: Container,
};

interface ComponentListProps {
  components: string[];
  parentId: string | null;
  level: number;
}

const ComponentList = memo(({ 
  components = [], 
  parentId = null, 
  level = 0 
}: ComponentListProps) => {
  const { selectedId, actions, allComponents } = useEditorStore((state) => ({
    selectedId: state.selectedId,
    actions: state.actions,
    allComponents: state.components,
  }));

  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
    componentId: string;
  } | null>(null);

  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleContextMenu = (event: React.MouseEvent, componentId: string) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      mouseX: event.clientX,
      mouseY: event.clientY,
      componentId,
    });
  };

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const handleCopy = () => {
    if (contextMenu) {
      actions.copyComponent(contextMenu.componentId);
      handleCloseContextMenu();
    }
  };

  const handleCut = () => {
    if (contextMenu) {
      actions.cutComponent(contextMenu.componentId);
      handleCloseContextMenu();
    }
  };

  const handlePaste = () => {
    if (contextMenu) {
      actions.pasteComponent(contextMenu.componentId);
      handleCloseContextMenu();
    }
  };

  const handleDuplicate = () => {
    if (contextMenu) {
      actions.duplicateComponent(contextMenu.componentId);
      handleCloseContextMenu();
    }
  };

  const handleDelete = (componentId: string) => {
    actions.removeComponent(componentId);
    if (contextMenu?.componentId === componentId) {
      handleCloseContextMenu();
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedId) return;

    if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      actions.removeComponent(selectedId);
    } else if (e.metaKey || e.ctrlKey) {
      if (e.key === 'c') {
        e.preventDefault();
        actions.copyComponent(selectedId);
      } else if (e.key === 'x') {
        e.preventDefault();
        actions.cutComponent(selectedId);
      } else if (e.key === 'v') {
        e.preventDefault();
        const component = allComponents.find(c => c.id === selectedId);
        if (component && isContainer(component.type)) {
          actions.pasteComponent(selectedId);
        } else if (component) {
          actions.pasteComponent(component.parentId);
        }
      } else if (e.key === 'd') {
        e.preventDefault();
        actions.duplicateComponent(selectedId);
      }
    }
  }, [selectedId, actions, allComponents]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleComponentClick = (e: React.MouseEvent, componentId: string) => {
    e.stopPropagation();
    actions.setSelectedId(componentId);
  };

  const handleDragStart = (componentId: string) => {
    setDraggingId(componentId);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  const renderComponent = (
    Component: React.ComponentType<any>,
    props: any,
    children?: React.ReactNode
  ) => {
    if (children) {
      return <Component {...props}>{children}</Component>;
    }
    return <Component {...props} />;
  };

  return (
    <Droppable droppableId={parentId ? `container-${parentId}` : 'canvas'}>
      {(provided: DroppableProvided) => (
        <Box
          ref={provided.innerRef}
          {...provided.droppableProps}
          sx={{
            minHeight: level === 0 ? '100%' : 'auto',
            backgroundColor: 'background.paper',
            borderRadius: 1,
            p: 2,
          }}
        >
          {components.map((componentId, index) => {
            const component = allComponents.find(c => c.id === componentId);
            if (!component) return null;

            const Component = componentMap[component.type];
            const isContainerType = isContainer(component.type);

            return (
              <Draggable key={component.id} draggableId={component.id} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={(e) => handleComponentClick(e, component.id)}
                    onContextMenu={(e) => handleContextMenu(e, component.id)}
                    onDragStart={() => handleDragStart(component.id)}
                    onDragEnd={handleDragEnd}
                    sx={{
                      mb: 2,
                      cursor: 'move',
                      outline: selectedId === component.id ? '2px solid' : 'none',
                      outlineColor: 'primary.main',
                      borderRadius: 1,
                      p: 1,
                      position: 'relative',
                      '&:hover .delete-button': {
                        opacity: 1,
                      },
                    }}
                  >
                    {selectedId === component.id && (
                      <IconButton
                        className="delete-button"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(component.id);
                        }}
                        sx={{
                          position: 'absolute',
                          top: -16,
                          right: -16,
                          opacity: 0,
                          transition: 'opacity 0.2s',
                          backgroundColor: 'error.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'error.dark',
                          },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                    {isContainerType ? (
                      <Box sx={{ width: '100%' }}>
                        {renderComponent(Component, component.props, 
                          <ComponentList
                            components={component.children}
                            parentId={component.id}
                            level={level + 1}
                          />
                        )}
                      </Box>
                    ) : (
                      renderComponent(Component, component.props)
                    )}
                  </Box>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
          <Menu
            open={contextMenu !== null}
            onClose={handleCloseContextMenu}
            anchorReference="anchorPosition"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <MenuItem onClick={handleCopy}>Копировать</MenuItem>
            <MenuItem onClick={handleCut}>Вырезать</MenuItem>
            <MenuItem onClick={handlePaste}>Вставить</MenuItem>
            <MenuItem onClick={handleDuplicate}>Дублировать</MenuItem>
            <MenuItem onClick={() => contextMenu && handleDelete(contextMenu.componentId)}>Удалить</MenuItem>
          </Menu>
        </Box>
      )}
    </Droppable>
  );
});

export function Canvas() {
  const { components, actions } = useEditorStore((state) => ({
    components: state.components,
    actions: state.actions,
  }));

  const rootComponents = components.filter(c => c.parentId === null).map(c => c.id);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination, draggableId } = result;

    if (source.droppableId === 'components') {
      const targetParentId = destination.droppableId === 'canvas' ? null : destination.droppableId.replace('container-', '');

      const newComponent = {
        id: `${draggableId}-${Date.now()}`,
        type: draggableId as ComponentType,
        props: {},
        parentId: null,
        children: [],
      };

      actions.addComponent(newComponent, targetParentId);
    } else {
      const sourceParentId = source.droppableId === 'canvas' ? null : source.droppableId.replace('container-', '');
      const targetParentId = destination.droppableId === 'canvas' ? null : destination.droppableId.replace('container-', '');

      if (sourceParentId === targetParentId) {
        actions.reorderComponents(source.index, destination.index, targetParentId);
      } else {
        actions.moveComponent(draggableId, targetParentId, destination.index);
      }
    }
  };

  const handleCanvasClick = () => {
    actions.setSelectedId(null);
  };

  return (
    <Box 
      sx={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }} 
      onClick={handleCanvasClick}
    >
      <DragDropContext onDragEnd={handleDragEnd}>
        <PhonePreview>
          <ComponentList components={rootComponents} parentId={null} level={0} />
        </PhonePreview>
      </DragDropContext>
    </Box>
  );
} 