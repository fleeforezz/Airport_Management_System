import React, { useState, useEffect, useRef } from 'react';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  fallbackSrc?: string;
  rootMargin?: string;
  threshold?: number;
  priority?: boolean;
  onClick?: () => void;
  crossOrigin?: 'anonymous' | 'use-credentials';
}

const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=800&q=75';

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  containerClassName = 'w-full h-full overflow-hidden bg-[#F5F5F5] relative',
  aspectRatio,
  fallbackSrc = DEFAULT_FALLBACK,
  rootMargin = '200px',
  threshold = 0.01,
  priority = false,
  onClick,
  crossOrigin,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(priority);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>(src);

  // Synchronize internal state when src prop updates
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // IntersectionObserver to defer loading until near viewport
  useEffect(() => {
    if (priority || isVisible) return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [priority, isVisible, rootMargin, threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(true);
    } else {
      setHasError(true);
      setIsLoaded(true);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`relative select-none ${containerClassName}`}
      style={aspectRatio ? { aspectRatio } : undefined}
      onClick={onClick}
    >
      {/* Swiss Modernism 2.0 Skeleton & Hatch Placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 hatch-pattern flex items-center justify-center bg-[#F5F5F5] z-0">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-[#E5E7EB] font-mono text-[9px] font-bold text-[#4B5563] tracking-widest uppercase">
            <span className="w-1.5 h-1.5 bg-[#000000] swiss-beacon" />
            <span>BUFFERING FRAME</span>
          </div>
        </div>
      )}

      {/* Actual Image Rendered When Visible */}
      {isVisible && (
        <img
          src={currentSrc}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          crossOrigin={crossOrigin}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      {/* Resilient Error Indicator (if fallback also failed) */}
      {hasError && currentSrc === fallbackSrc && !isLoaded && (
        <div className="absolute inset-0 bg-[#EEEEEE] flex flex-col items-center justify-center p-3 text-center z-10 border border-[#E5E7EB]">
          <span className="material-symbols-outlined text-[#DC2626] text-xl mb-1">image_not_supported</span>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#4B5563]">
            [ MEDIA OFFLINE ]
          </span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
