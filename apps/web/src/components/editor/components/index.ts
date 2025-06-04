export { Button } from './Button';
export { Text } from './Text';
export { Image } from './Image';
export { List } from './List';
export { Divider } from './Divider';
export { Container } from './Container';

export type ComponentType = 'button' | 'text' | 'image' | 'list' | 'divider' | 'container';

export interface ComponentData {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  parentId: string | null;
  children: string[];
}

export const isContainer = (type: ComponentType): boolean => {
  return type === 'container';
}; 