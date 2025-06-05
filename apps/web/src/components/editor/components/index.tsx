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

export const isContainer = (type: ComponentType): boolean => type === 'container';

interface BaseComponentProps {
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  sx?: any;
}

interface ButtonProps extends BaseComponentProps {
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  children?: React.ReactNode;
}

interface TextProps extends BaseComponentProps {
  variant?: 'body1' | 'body2' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  color?: string;
  children?: React.ReactNode;
}

interface ImageProps extends BaseComponentProps {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ListProps extends BaseComponentProps {
  items?: string[];
}

interface DividerProps extends BaseComponentProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'fullWidth' | 'inset' | 'middle';
  color?: string;
}

interface ContainerProps extends BaseComponentProps {
  maxWidth?: Breakpoint;
  padding?: number;
  backgroundColor?: string;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'contained', 
  color = 'primary', 
  children = 'Кнопка',
  onClick,
  className = 'component',
  ...props 
}, ref) => (
  <MuiButton
    ref={ref}
    variant={variant}
    color={color}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
    {...props}
  >
    {children}
  </MuiButton>
));
Button.displayName = 'Button';

export const Text = React.forwardRef<HTMLDivElement, TextProps>(({
  variant = 'body1',
  color = 'text.primary',
  children = 'Текст',
  onClick,
  className = 'component',
  ...props
}, ref) => (
  <Typography
    ref={ref}
    variant={variant}
    color={color}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
    {...props}
  >
    {children}
  </Typography>
));
Text.displayName = 'Text';

export const CustomImage = React.forwardRef<HTMLDivElement, ImageProps>(({
  src = '',
  alt = '',
  width = 200,
  height = 200,
  onClick,
  className = 'component',
  ...props
}, ref) => (
  <Box
    ref={ref}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
    sx={{
      position: 'relative',
      width,
      height,
      overflow: 'hidden',
      borderRadius: 1,
      ...props.sx
    }}
  >
    {src ? (
      <NextImage
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
      />
    ) : (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'action.hover',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        Изображение
      </Box>
    )}
  </Box>
));
CustomImage.displayName = 'CustomImage';

export const List = React.forwardRef<HTMLUListElement, ListProps>(({
  items = ['Элемент 1', 'Элемент 2', 'Элемент 3'],
  onClick,
  className = 'component',
  ...props
}, ref) => (
  <MuiList
    ref={ref}
    onClick={(e: React.MouseEvent) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
    {...props}
  >
    {items.map((item, index) => (
      <ListItem key={index}>{item}</ListItem>
    ))}
  </MuiList>
));
List.displayName = 'List';

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(({
  orientation = 'horizontal',
  variant = 'fullWidth',
  color,
  onClick,
  className = 'component',
  ...props
}, ref) => (
  <Box
    ref={ref}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
  >
    <MuiDivider
      orientation={orientation}
      variant={variant}
      sx={{ bgcolor: color }}
      {...props}
    />
  </Box>
));
Divider.displayName = 'Divider';

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  maxWidth = 'lg',
  padding = 2,
  backgroundColor,
  children,
  onClick,
  className = 'component',
  ...props
}, ref) => (
  <Box
    ref={ref}
    onClick={(e) => {
      e.stopPropagation();
      if (onClick) onClick(e);
    }}
    className={className}
    sx={{
      width: '100%',
      maxWidth: (theme) => theme.breakpoints.values[maxWidth],
      mx: 'auto',
      p: padding,
      backgroundColor,
      borderRadius: 1,
      border: '1px dashed',
      borderColor: 'divider',
      ...props.sx
    }}
  >
    {children || (
      <Box
        sx={{
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'text.secondary',
        }}
      >
        Контейнер
      </Box>
    )}
  </Box>
));
Container.displayName = 'Container'; 