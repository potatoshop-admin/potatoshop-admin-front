import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default: 'bg-gray-700 text-gray-100 hover:text-gray-200 hover:bg-gray-900',
        destructive:
          'bg-negative-400 text-white shadow-xs hover:bg-negative-500 hover:text-negative-200',
        outline: 'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground ',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost: 'hover:bg-primary-200',
        link: 'text-primary underline-offset-4 hover:underline',
        roundOutline:
          'font-12-bold border border-primary-400 bg-primary-50 text-primary-400 hover:bg-primary-300 active:bg-primary-300 active:text-primary-50 rounded-3xl',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        roundedDefault: 'px-4 py-2',
        sm: 'h-6 rounded-md px-2 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        table: 'h-9 px-0 py-2',
        fullWidth: 'w-full px-2 py-2',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
