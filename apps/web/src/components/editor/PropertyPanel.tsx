import { Box, Paper, Typography, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { ComponentType } from './components';
import { useEditorStore } from '@/store/editorStore';

interface BaseProperty {
  name: string;
  type: string;
  label: string;
}

interface TextProperty extends BaseProperty {
  type: 'text' | 'number';
}

interface SelectProperty extends BaseProperty {
  type: 'select';
  options: string[];
}

type Property = TextProperty | SelectProperty;

const buttonProperties: Property[] = [
  { name: 'text', type: 'text', label: 'Текст кнопки' },
  { 
    name: 'variant', 
    type: 'select', 
    label: 'Вариант',
    options: ['contained', 'outlined', 'text']
  },
  {
    name: 'color',
    type: 'select',
    label: 'Цвет',
    options: ['primary', 'secondary', 'error', 'warning', 'info', 'success']
  }
];

const textProperties: Property[] = [
  { name: 'content', type: 'text', label: 'Содержимое' },
  {
    name: 'variant',
    type: 'select',
    label: 'Вариант',
    options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'subtitle2', 'body1', 'body2']
  },
  { name: 'color', type: 'text', label: 'Цвет' }
];

const imageProperties: Property[] = [
  { name: 'src', type: 'text', label: 'URL изображения' },
  { name: 'alt', type: 'text', label: 'Alt текст' },
  { name: 'width', type: 'number', label: 'Ширина' },
  { name: 'height', type: 'number', label: 'Высота' }
];

const listProperties: Property[] = [
  { name: 'items', type: 'text', label: 'Элементы (через запятую)' }
];

const dividerProperties: Property[] = [
  {
    name: 'orientation',
    type: 'select',
    label: 'Ориентация',
    options: ['horizontal', 'vertical']
  },
  {
    name: 'variant',
    type: 'select',
    label: 'Вариант',
    options: ['fullWidth', 'inset', 'middle']
  },
  { name: 'color', type: 'text', label: 'Цвет' }
];

const containerProperties: Property[] = [
  {
    name: 'maxWidth',
    type: 'select',
    label: 'Макс. ширина',
    options: ['xs', 'sm', 'md', 'lg', 'xl']
  },
  { name: 'padding', type: 'number', label: 'Отступ' },
  { name: 'backgroundColor', type: 'text', label: 'Цвет фона' }
];

const propertyMap: Record<ComponentType, Property[]> = {
  button: buttonProperties,
  text: textProperties,
  image: imageProperties,
  list: listProperties,
  divider: dividerProperties,
  container: containerProperties
};

export function PropertyPanel() {
  const { selectedId, components, actions } = useEditorStore((state) => ({
    selectedId: state.selectedId,
    components: state.components,
    actions: state.actions,
  }));

  const selectedComponent = selectedId ? components.find(c => c.id === selectedId) : null;

  if (!selectedComponent) {
    return (
      <Paper
        sx={{
          width: 300,
          height: '100%',
          borderLeft: 1,
          borderColor: 'divider',
          p: 2,
        }}
      />
    );
  }

  const properties = propertyMap[selectedComponent.type];

  const handlePropertyChange = (name: string, value: any) => {
    actions.updateComponent(selectedComponent.id, { [name]: value });
  };

  return (
    <Paper
      sx={{
        width: 300,
        height: '100%',
        borderLeft: 1,
        borderColor: 'divider',
        p: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Свойства
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {properties.map((prop) => (
          <Box key={prop.name}>
            {prop.type === 'select' ? (
              <FormControl fullWidth size="small">
                <InputLabel>{prop.label}</InputLabel>
                <Select
                  value={selectedComponent.props[prop.name] || ''}
                  label={prop.label}
                  onChange={(e) => handlePropertyChange(prop.name, e.target.value)}
                >
                  {prop.options.map((option: string) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <TextField
                fullWidth
                size="small"
                label={prop.label}
                type={prop.type}
                value={
                  prop.name === 'items' 
                    ? (selectedComponent.props[prop.name] || []).join(', ')
                    : (selectedComponent.props[prop.name] || '')
                }
                onChange={(e) => {
                  const value = prop.name === 'items' 
                    ? e.target.value.split(',').map(item => item.trim())
                    : e.target.value;
                  handlePropertyChange(prop.name, value);
                }}
              />
            )}
          </Box>
        ))}
      </Box>
    </Paper>
  );
} 