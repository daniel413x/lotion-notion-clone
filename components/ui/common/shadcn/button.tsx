'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import useHasMounted from '@/lib/hooks/useHasMounted';

const destructive = 'bg-destructive text-destructive-foreground hover:bg-destructive/90';
const destructiveDark = `${destructive} bg-red-600`;
const secondary = 'bg-secondary text-secondary-foreground hover:bg-secondary/80';
const secondaryDark = secondary;
const ghost = 'hover:bg-accent hover:text-accent-foreground';
const ghostDark = ghost;
const link = 'hover:bg-accent hover:text-accent-foreground';
const linkDark = link;
const outline = 'border border-input bg-background hover:bg-accent hover:text-accent-foreground';
const outlineDark = outline;
const defaultStyle = 'bg-primary text-primary-foreground hover:bg-primary/90';
const defaultStyleDark = defaultStyle;
const blank = '[all: unset]';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        defaultStyle,
        defaultStyleDark,
        destructive,
        destructiveDark,
        outline,
        outlineDark,
        secondary,
        secondaryDark,
        ghost,
        ghostDark,
        link,
        linkDark,
        blank,
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
        blank: '',
      },
    },
    defaultVariants: {
      variant: 'defaultStyle',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    className, variant: argVariant, size: argSize, asChild = false, ...props
  }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    let size = argSize;
    let variant = argVariant || 'defaultStyle';
    // automatically construct a dark style variant selector string if the theme is dark: destructiveDark, outlineDark, etc.
    if (isDark && !variant.endsWith('Dark') && variant !== 'blank') {
    // ts can't evaluate the runtime conditionality; type as any
      variant = `${variant}Dark` as any;
    }
    if (!size && variant === 'blank') {
      size = 'blank';
    }
    if (!useHasMounted()) return null;
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
