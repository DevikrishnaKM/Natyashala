import { cn } from '../../lib/utils'
import { HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  type?: 'rect' | 'circle';
  width?: string;
  height?: string;
}

function Skeleton({
  className,
  type = 'rect', 
  width = 'w-full', 
  height = 'h-8', 
  ...props
}:SkeletonProps) {


  const skeletonClass = type === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <div
      className={cn(
        "animate-pulse",
        skeletonClass,
        "bg-primary/10",
        className,
        width,
        height
      )}
      {...props}
    />
  );
}

export default Skeleton;