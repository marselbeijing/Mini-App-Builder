import { ComponentData } from '@/components/editor/components';

const STORAGE_KEY = 'editor_layout';

export interface LayoutData {
  components: ComponentData[];
  version: string;
}

export const saveLayout = (components: ComponentData[]): void => {
  const layout: LayoutData = {
    components,
    version: '1.0.0',
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(layout));
};

export const loadLayout = (): ComponentData[] | null => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return null;

  try {
    const layout: LayoutData = JSON.parse(data);
    return layout.components;
  } catch (error) {
    console.error('Failed to load layout:', error);
    return null;
  }
};

export const exportLayout = (components: ComponentData[]): string => {
  const layout: LayoutData = {
    components,
    version: '1.0.0',
  };
  return JSON.stringify(layout, null, 2);
};

export const importLayout = (data: string): ComponentData[] | null => {
  try {
    const layout: LayoutData = JSON.parse(data);
    return layout.components;
  } catch (error) {
    console.error('Failed to import layout:', error);
    return null;
  }
}; 