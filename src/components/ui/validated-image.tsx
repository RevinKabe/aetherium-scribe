import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
interface ValidatedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}
export const ValidatedImage: React.FC<ValidatedImageProps> = ({ src, alt, className, containerClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const handleError = () => {
    // As per client request, throw a runtime error to make the issue explicit.
    // This will be caught by the nearest React Error Boundary.
    throw new Error(`Image failed to load from source: ${src}`);
  };
  return (
    <div className={cn("relative", containerClassName)}>
      {!isLoaded && <Skeleton className="absolute inset-0 h-full w-full" />}
      <img
        src={src}
        alt={alt}
        className={cn(
          "transition-opacity duration-500",
          isLoaded ? "opacity-100" : "opacity-0",
          className
        )}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        {...props}
      />
    </div>
  );
};