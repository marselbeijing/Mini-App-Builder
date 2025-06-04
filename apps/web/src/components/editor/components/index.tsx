import React from 'react';
import { Box, Button as MuiButton, Typography, List as MuiList, ListItem, Divider as MuiDivider, Container as MuiContainer } from '@mui/material';
import { Breakpoint } from '@mui/material/styles';
import NextImage from 'next/image';

export interface ComponentData {
  id: string;
  type: ComponentType;
  props: Record<string, any>;
  parentId: string | null;
  children: string[];
}

export type ComponentType = 'button' | 'text' | 'image' | 'list' | 'divider' | 'container';

export const isContainer = (type: ComponentType): boolean => {
  return type === 'container';
};

export const Button = ({ variant = 'contained', color = 'primary', children = 'Кнопка', ...props }) => (
  <MuiButton
    variant={variant as 'contained' | 'outlined' | 'text'}
    color={color as 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
    {...props}
    sx={{
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      ...props.sx,
    }}
  >
    {children}
  </MuiButton>
);

export const Text = ({ variant = 'body1', color = 'text.primary', children = 'Текст', ...props }) => (
  <Typography
    variant={variant as 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'}
    color={color}
    {...props}
    sx={{
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      ...props.sx,
    }}
  >
    {children}
  </Typography>
);

export const List = ({ items = ['Элемент 1', 'Элемент 2', 'Элемент 3'], ...props }) => (
  <MuiList
    {...props}
    sx={{
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      ...props.sx,
    }}
  >
    {items.map((item, index) => (
      <ListItem key={index}>{item}</ListItem>
    ))}
  </MuiList>
);

export const Container = ({ children, maxWidth = 'sm', ...props }) => (
  <MuiContainer
    maxWidth={maxWidth as Breakpoint}
    {...props}
    sx={{
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      backgroundColor: 'background.default',
      borderRadius: 1,
      p: 2,
      ...props.sx,
    }}
  >
    {children}
  </MuiContainer>
);

export const Divider = (props) => (
  <Box
    sx={{
      transition: 'all 0.2s',
      '&:hover': {
        transform: 'scale(1.02)',
      },
      py: 1,
    }}
  >
    <MuiDivider {...props} />
  </Box>
);

export const CustomImage = ({ src = '', alt = 'image', width = '100%', height = 'auto', style = {}, ...props }) => (
  <img
    src={src}
    alt={alt}
    width={width}
    height={height}
    style={{ display: 'block', maxWidth: '100%', height: 'auto', ...style }}
    {...props}
  />
); 