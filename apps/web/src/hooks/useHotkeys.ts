import { useEffect } from 'react';
import { useEditorStore } from '@/store/editorStore';

interface HotkeyAction {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
}

export function useHotkeys() {
  const actions = useEditorStore((state) => state.actions);

  const hotkeys: HotkeyAction[] = [
    { key: 'z', ctrl: true, action: actions.undo },
    { key: 'z', ctrl: true, shift: true, action: actions.redo },
    { key: 'y', ctrl: true, action: actions.redo },
    { key: 's', ctrl: true, action: actions.save },
    { key: 'Delete', action: () => {
      const selectedId = useEditorStore.getState().selectedId;
      if (selectedId) {
        actions.removeComponent(selectedId);
      }
    }},
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Игнорируем нажатия в полях ввода
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const matchingHotkey = hotkeys.find(
        (hotkey) =>
          hotkey.key.toLowerCase() === e.key.toLowerCase() &&
          !!hotkey.ctrl === e.ctrlKey &&
          !!hotkey.shift === e.shiftKey &&
          !!hotkey.alt === e.altKey
      );

      if (matchingHotkey) {
        e.preventDefault();
        matchingHotkey.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hotkeys]);
} 