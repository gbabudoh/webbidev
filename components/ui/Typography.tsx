import React from 'react';
import { cn } from '@/lib/utils';

export interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'black';
  color?: 'default' | 'muted' | 'primary' | 'secondary' | 'error' | 'success';
  align?: 'left' | 'center' | 'right' | 'justify';
  children: React.ReactNode;
}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  (
    {
      variant = 'p',
      size = 'base',
      weight = 'normal',
      color = 'default',
      align = 'left',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    };

    const weightClasses = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      black: 'font-black',
    };

    const colorClasses = {
      default: 'text-foreground',
      muted: 'text-zinc-600 dark:text-zinc-400',
      primary: 'text-foreground',
      secondary: 'text-zinc-500 dark:text-zinc-500',
      error: 'text-red-600 dark:text-red-400',
      success: 'text-green-600 dark:text-green-400',
    };

    const alignClasses = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    // Default size based on variant if size not specified
    const defaultSizes = {
      h1: '4xl',
      h2: '3xl',
      h3: '2xl',
      h4: 'xl',
      h5: 'lg',
      h6: 'base',
      p: 'base',
      span: 'base',
      label: 'sm',
    };

    const finalSize = size === 'base' ? defaultSizes[variant] : size;

    const classes = cn(
      sizeClasses[finalSize as keyof typeof sizeClasses],
      weightClasses[weight],
      colorClasses[color],
      alignClasses[align],
      className
    );

    const Component = variant;

    return (
      <Component ref={ref as React.Ref<never>} className={classes} {...props}>
        {children}
      </Component>
    );
  }
);

Typography.displayName = 'Typography';

// Convenience components
export const H1 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h1" {...props} />);
H1.displayName = 'H1';

export const H2 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h2" {...props} />);
H2.displayName = 'H2';

export const H3 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h3" {...props} />);
H3.displayName = 'H3';

export const H4 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h4" {...props} />);
H4.displayName = 'H4';

export const H5 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h5" {...props} />);
H5.displayName = 'H5';

export const H6 = React.forwardRef<
  HTMLHeadingElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="h6" {...props} />);
H6.displayName = 'H6';

export const P = React.forwardRef<
  HTMLParagraphElement,
  Omit<TypographyProps, 'variant'>
>((props, ref) => <Typography ref={ref} variant="p" {...props} />);
P.displayName = 'P';

export default Typography;

