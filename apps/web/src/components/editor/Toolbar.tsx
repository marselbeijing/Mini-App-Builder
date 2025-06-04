import { Box, Button, Divider, IconButton, Tooltip, Menu, MenuItem } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import PreviewIcon from '@mui/icons-material/Preview';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import PublishIcon from '@mui/icons-material/Publish';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useEditorStore } from '@/store/editorStore';
import { useState } from 'react';
import { PreviewDialog } from './PreviewDialog';
import { useHotkeys } from '@/hooks/useHotkeys';

export function Toolbar() {
  const { history, actions } = useEditorStore((state) => ({
    history: state.history,
    actions: state.actions,
  }));

  useHotkeys();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const open = Boolean(anchorEl);

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    actions.save();
    handleMenuClose();
  };

  const handleLoad = () => {
    actions.load();
    handleMenuClose();
  };

  const handleExport = () => {
    const data = actions.exportToJson();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'layout.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    handleMenuClose();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result;
          if (typeof content === 'string') {
            actions.importFromJson(content);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
    handleMenuClose();
  };

  const handlePreviewOpen = () => {
    setPreviewOpen(true);
  };

  const handlePreviewClose = () => {
    setPreviewOpen(false);
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Tooltip title="Save (Ctrl+S)">
          <IconButton size="small" onClick={handleSave}>
            <SaveIcon />
          </IconButton>
        </Tooltip>
        
        <Tooltip title="Preview">
          <IconButton size="small" onClick={handlePreviewOpen}>
            <PreviewIcon />
          </IconButton>
        </Tooltip>
        
        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />
        
        <Tooltip title="Undo (Ctrl+Z)">
          <span>
            <IconButton 
              size="small" 
              onClick={actions.undo}
              disabled={!canUndo}
            >
              <UndoIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <Tooltip title="Redo (Ctrl+Shift+Z or Ctrl+Y)">
          <span>
            <IconButton 
              size="small" 
              onClick={actions.redo}
              disabled={!canRedo}
            >
              <RedoIcon />
            </IconButton>
          </span>
        </Tooltip>
        
        <Box sx={{ flex: 1 }} />

        <Tooltip title="More">
          <IconButton
            size="small"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleLoad}>Load</MenuItem>
          <MenuItem onClick={handleExport}>Export</MenuItem>
          <MenuItem onClick={handleImport}>Import</MenuItem>
        </Menu>
        
        <Button
          variant="contained"
          size="small"
          startIcon={<PublishIcon />}
        >
          Publish
        </Button>
      </Box>

      <PreviewDialog
        open={previewOpen}
        onClose={handlePreviewClose}
      />
    </>
  );
} 