import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "bg-brand-red text-white",
        new: "bg-brand-black text-white",
        sale: "bg-brand-red text-white",
        hot: "bg-brand-gold text-black",
        eco: "bg-emerald-600 text-white",
        outline: "border border-current text-brand-red bg-brand-red/5",
        soft: "bg-neutral-100 text-neutral-700",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
