'use client';

import { Loader } from 'lucide-react';
import { VariantProps, cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const spinnerVariants = cva(
  'text-muted-foreground animate-spin',
  {
    variants: {
      size: {
        default: 'h-4 w-4',
        sm: 'h-2 w-2',
        lg: 'h-6 w-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
);

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  center?: boolean;
  className?: string;
}

const LoadingSpinner = ({
  size,
  className,
  center,
}: SpinnerProps) => (
  <div className={cn(className, {
    'w-full h-full flex items-center justify-center': center,
  })}
  >
    <Loader className={cn(className, spinnerVariants({ size }))} />
  </div>
);

export default LoadingSpinner;
