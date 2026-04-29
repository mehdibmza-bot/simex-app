import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-bold uppercase tracking-wide transition-all disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-brand-red text-white shadow-red hover:bg-brand-red2 hover:-translate-y-0.5 hover:shadow-[0_14px_50px_rgba(225,37,42,0.5)]",
        ghost:
          "border-[1.5px] border-white text-white bg-transparent hover:bg-white hover:text-brand-black",
        outline:
          "border-[1.5px] border-brand-black text-brand-black bg-transparent hover:bg-brand-black hover:text-white",
        secondary:
          "bg-brand-black text-white hover:bg-brand-red",
        link: "underline-offset-4 hover:underline text-brand-red",
        soft: "bg-neutral-100 text-brand-black hover:bg-neutral-200",
      },
      size: {
        default: "h-12 px-7 py-3",
        sm: "h-10 px-5 text-xs",
        lg: "h-14 px-9 text-base",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
