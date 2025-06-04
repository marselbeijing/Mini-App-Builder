import { Dialog, DialogTitle, DialogContent, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEditorStore } from '@/store/editorStore';
import { Button, Text, CustomImage, List, Divider, Container, ComponentType, isContainer } from './components';

const componentMap: Record<ComponentType, React.ComponentType<any>> = {
  button: Button,
  text: Text,
  image: CustomImage,
  list: List,
  divider: Divider,
  container: Container,
};

interface PreviewDialogProps {
  open: boolean;
  onClose: () => void;
}

interface ComponentListProps {
  components: string[];
}

function ComponentList({ components }: ComponentListProps) {
  const allComponents = useEditorStore((state) => state.components);

  return (
    <>
      {components.map((componentId) => {
        const component = allComponents.find(c => c.id === componentId);
        if (!component) return null;

        const Component = componentMap[component.type];
        const isContainerType = isContainer(component.type);

        return (
          <Box key={component.id} sx={{ mb: 2 }}>
            {isContainerType ? (
              <Component {...component.props}>
                <ComponentList components={component.children} />
              </Component>
            ) : (
              <Component {...component.props} />
            )}
          </Box>
        );
      })}
    </>
  );
}

export function PreviewDialog({ open, onClose }: PreviewDialogProps) {
  const components = useEditorStore((state) => state.components);
  const rootComponents = components.filter(c => c.parentId === null).map(c => c.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Предпросмотр
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <ComponentList components={rootComponents} />
        </Box>
      </DialogContent>
    </Dialog>
  );
} 