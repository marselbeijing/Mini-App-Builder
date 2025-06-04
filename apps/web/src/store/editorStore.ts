import { create } from 'zustand';
import { produce } from 'immer';
import { ComponentData, isContainer } from '@/components/editor/components';
import { saveLayout, loadLayout, exportLayout, importLayout } from '@/utils/storage';

interface HistoryState {
  past: ComponentData[][];
  future: ComponentData[][];
}

interface ClipboardData {
  component: ComponentData;
  children: ComponentData[];
}

interface EditorState {
  components: ComponentData[];
  selectedId: string | null;
  history: HistoryState;
  clipboard: ClipboardData | null;
  actions: {
    addComponent: (component: ComponentData, parentId?: string | null) => void;
    updateComponent: (id: string, props: Record<string, any>) => void;
    removeComponent: (id: string) => void;
    reorderComponents: (startIndex: number, endIndex: number, parentId: string | null) => void;
    setSelectedId: (id: string | null) => void;
    moveComponent: (id: string, targetParentId: string | null, index: number) => void;
    copyComponent: (id: string) => void;
    cutComponent: (id: string) => void;
    pasteComponent: (parentId: string | null) => void;
    duplicateComponent: (id: string) => void;
    undo: () => void;
    redo: () => void;
    save: () => void;
    load: () => void;
    exportToJson: () => string;
    importFromJson: (data: string) => void;
  };
}

const MAX_HISTORY_LENGTH = 50;

const initialState: EditorState = {
  components: [],
  selectedId: null,
  clipboard: null,
  history: {
    past: [],
    future: [],
  },
  actions: {
    addComponent: () => {},
    updateComponent: () => {},
    removeComponent: () => {},
    reorderComponents: () => {},
    setSelectedId: () => {},
    moveComponent: () => {},
    copyComponent: () => {},
    cutComponent: () => {},
    pasteComponent: () => {},
    duplicateComponent: () => {},
    undo: () => {},
    redo: () => {},
    save: () => {},
    load: () => {},
    exportToJson: () => '',
    importFromJson: () => {},
  },
};

const findComponentById = (components: ComponentData[], id: string): ComponentData | undefined => {
  return components.find(c => c.id === id);
};

const getComponentsWithParent = (components: ComponentData[], parentId: string | null): ComponentData[] => {
  return components.filter(c => c.parentId === parentId);
};

const removeComponentAndChildren = (components: ComponentData[], id: string): ComponentData[] => {
  const component = findComponentById(components, id);
  if (!component) return components;

  // Рекурсивно удаляем все дочерние компоненты
  const childrenToRemove = [...component.children];
  while (childrenToRemove.length > 0) {
    const childId = childrenToRemove.pop()!;
    const child = findComponentById(components, childId);
    if (child) {
      childrenToRemove.push(...child.children);
    }
  }

  // Удаляем компонент и все его дочерние элементы
  return components.filter(c => c.id !== id && !component.children.includes(c.id));
};

const getComponentWithChildren = (components: ComponentData[], id: string): ClipboardData | null => {
  const component = findComponentById(components, id);
  if (!component) return null;

  const children: ComponentData[] = [];
  const queue = [...component.children];

  while (queue.length > 0) {
    const childId = queue.shift()!;
    const child = findComponentById(components, childId);
    if (child) {
      children.push(child);
      queue.push(...child.children);
    }
  }

  return {
    component: { ...component, parentId: null, children: [] },
    children: children.map(child => ({ ...child, parentId: null, children: [] })),
  };
};

const generateNewIds = (data: ClipboardData): ClipboardData => {
  const idMap = new Map<string, string>();
  const timestamp = Date.now();

  const newComponent = {
    ...data.component,
    id: `${data.component.id}-copy-${timestamp}`,
  };
  idMap.set(data.component.id, newComponent.id);

  const newChildren = data.children.map((child, index) => {
    const newId = `${child.id}-copy-${timestamp}-${index}`;
    idMap.set(child.id, newId);
    return { ...child, id: newId };
  });

  // Обновляем ссылки на родителей и детей
  newChildren.forEach(child => {
    if (child.parentId) {
      child.parentId = idMap.get(child.parentId) || null;
    }
    child.children = child.children.map(id => idMap.get(id) || id);
  });

  newComponent.children = newComponent.children.map(id => idMap.get(id) || id);

  return {
    component: newComponent,
    children: newChildren,
  };
};

export const useEditorStore = create<EditorState>((set, get) => ({
  ...initialState,
  actions: {
    addComponent: (component, parentId = null) =>
      set(
        produce((state: EditorState) => {
          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }

          const newComponent = {
            ...component,
            parentId,
            children: [],
          };

          state.components.push(newComponent);

          if (parentId) {
            const parent = findComponentById(state.components, parentId);
            if (parent) {
              parent.children.push(newComponent.id);
            }
          }
        })
      ),

    updateComponent: (id, props) =>
      set(
        produce((state: EditorState) => {
          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }
          const component = findComponentById(state.components, id);
          if (component) {
            component.props = { ...component.props, ...props };
          }
        })
      ),

    removeComponent: (id) =>
      set(
        produce((state: EditorState) => {
          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }

          const component = findComponentById(state.components, id);
          if (component) {
            // Удаляем компонент из списка детей родителя
            if (component.parentId) {
              const parent = findComponentById(state.components, component.parentId);
              if (parent) {
                parent.children = parent.children.filter(childId => childId !== id);
              }
            }

            // Удаляем компонент и все его дочерние элементы
            state.components = removeComponentAndChildren(state.components, id);

            if (state.selectedId === id) {
              state.selectedId = null;
            }
          }
        })
      ),

    reorderComponents: (startIndex, endIndex, parentId) =>
      set(
        produce((state: EditorState) => {
          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }

          const componentsWithParent = getComponentsWithParent(state.components, parentId);
          const [removed] = componentsWithParent.splice(startIndex, 1);
          componentsWithParent.splice(endIndex, 0, removed);

          if (parentId) {
            const parent = findComponentById(state.components, parentId);
            if (parent) {
              parent.children = componentsWithParent.map(c => c.id);
            }
          }
        })
      ),

    setSelectedId: (id) =>
      set(
        produce((state: EditorState) => {
          state.selectedId = id;
        })
      ),

    moveComponent: (id, targetParentId, index) =>
      set(
        produce((state: EditorState) => {
          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }

          const component = findComponentById(state.components, id);
          if (!component) return;

          // Если компонент уже находится в целевом контейнере, просто меняем его позицию
          if (component.parentId === targetParentId) {
            const parent = targetParentId ? findComponentById(state.components, targetParentId) : null;
            if (parent) {
              const currentIndex = parent.children.indexOf(id);
              if (currentIndex !== -1) {
                parent.children.splice(currentIndex, 1);
                parent.children.splice(index, 0, id);
              }
            }
          } else {
            // Удаляем компонент из старого родителя
            if (component.parentId) {
              const oldParent = findComponentById(state.components, component.parentId);
              if (oldParent) {
                oldParent.children = oldParent.children.filter(childId => childId !== id);
              }
            }

            // Добавляем компонент к новому родителю
            component.parentId = targetParentId;
            if (targetParentId) {
              const newParent = findComponentById(state.components, targetParentId);
              if (newParent) {
                newParent.children.splice(index, 0, id);
              }
            }
          }
        })
      ),

    undo: () =>
      set(
        produce((state: EditorState) => {
          const previous = state.history.past.pop();
          if (previous) {
            state.history.future.push([...state.components]);
            state.components = previous;
          }
        })
      ),

    redo: () =>
      set(
        produce((state: EditorState) => {
          const next = state.history.future.pop();
          if (next) {
            state.history.past.push([...state.components]);
            state.components = next;
          }
        })
      ),

    save: () =>
      set(
        produce((state: EditorState) => {
          saveLayout(state.components);
        })
      ),

    load: () =>
      set(
        produce((state: EditorState) => {
          const components = loadLayout();
          if (components) {
            state.components = components;
            state.selectedId = null;
            state.history = {
              past: [],
              future: [],
            };
          }
        })
      ),

    exportToJson: () => {
      const state = get();
      return exportLayout(state.components);
    },

    importFromJson: (data: string) =>
      set(
        produce((state: EditorState) => {
          const components = importLayout(data);
          if (components) {
            state.components = components;
            state.selectedId = null;
            state.history = {
              past: [],
              future: [],
            };
          }
        })
      ),

    copyComponent: (id) =>
      set(
        produce((state: EditorState) => {
          const data = getComponentWithChildren(state.components, id);
          if (data) {
            state.clipboard = data;
          }
        })
      ),

    cutComponent: (id) =>
      set(
        produce((state: EditorState) => {
          const data = getComponentWithChildren(state.components, id);
          if (data) {
            state.clipboard = data;
            state.history.past.push([...state.components]);
            state.history.future = [];
            if (state.history.past.length > MAX_HISTORY_LENGTH) {
              state.history.past.shift();
            }
            state.components = removeComponentAndChildren(state.components, id);
            if (state.selectedId === id) {
              state.selectedId = null;
            }
          }
        })
      ),

    pasteComponent: (parentId) =>
      set(
        produce((state: EditorState) => {
          if (!state.clipboard) return;

          state.history.past.push([...state.components]);
          state.history.future = [];
          if (state.history.past.length > MAX_HISTORY_LENGTH) {
            state.history.past.shift();
          }

          const newData = generateNewIds(state.clipboard);
          newData.component.parentId = parentId;

          state.components.push(newData.component);
          state.components.push(...newData.children);

          if (parentId) {
            const parent = findComponentById(state.components, parentId);
            if (parent) {
              parent.children.push(newData.component.id);
            }
          }
        })
      ),

    duplicateComponent: (id) =>
      set(
        produce((state: EditorState) => {
          const data = getComponentWithChildren(state.components, id);
          if (data) {
            state.history.past.push([...state.components]);
            state.history.future = [];
            if (state.history.past.length > MAX_HISTORY_LENGTH) {
              state.history.past.shift();
            }

            const component = findComponentById(state.components, id);
            if (!component) return;

            const newData = generateNewIds(data);
            newData.component.parentId = component.parentId;

            state.components.push(newData.component);
            state.components.push(...newData.children);

            if (component.parentId) {
              const parent = findComponentById(state.components, component.parentId);
              if (parent) {
                const index = parent.children.indexOf(id);
                parent.children.splice(index + 1, 0, newData.component.id);
              }
            }
          }
        })
      ),
  },
})); 