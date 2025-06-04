import { List as MuiList, ListItem, ListItemText } from '@mui/material';

interface ListProps {
  items?: string[];
}

export function List({ items = ['Item 1', 'Item 2', 'Item 3'] }: ListProps) {
  return (
    <MuiList>
      {items.map((item, index) => (
        <ListItem key={index}>
          <ListItemText primary={item} />
        </ListItem>
      ))}
    </MuiList>
  );
} 