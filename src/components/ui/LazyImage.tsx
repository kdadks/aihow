import React from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height
}) => {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      width={width}
      height={height}
      decoding="async"
    />
  );
};
