import React, { useState } from 'react';
import LazyImage from '../common/LazyImage';

interface GalleryProps {
  images: string[];
  title?: string;
}

export const Gallery: React.FC<GalleryProps> = ({ images, title }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="h-64 bg-[#EEEEEE] border border-[#E5E7EB] flex items-center justify-center font-mono text-xs text-[#9CA3AF]">
        [ NO MEDIA FRAMES AVAILABLE ]
      </div>
    );
  }

  return (
    <div className="space-y-2 select-none">
      {/* Featured Primary Image */}
      <div className="relative h-72 sm:h-96 w-full bg-black border border-black overflow-hidden">
        <LazyImage
          src={images[activeIndex]}
          alt={title || `Media frame ${activeIndex + 1}`}
          className="w-full h-full object-cover transition-none"
          containerClassName="w-full h-full"
          priority={true}
        />
        {/* Index counter watermark */}
        <div className="absolute bottom-3 right-3 z-10 bg-black/90 text-white px-2.5 py-1 font-mono text-[10px] font-bold tracking-wider">
          FRAME {String(activeIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
        </div>
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {images.map((img, idx) => {
            const isActive = idx === activeIndex;
            return (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                className={`h-16 border overflow-hidden relative transition-none cursor-pointer ${
                  isActive
                    ? 'border-2 border-black'
                    : 'border-[#E5E7EB] opacity-60 hover:opacity-100 hover:border-black'
                }`}
              >
                <LazyImage
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                  containerClassName="w-full h-full"
                />
                {isActive && (
                  <span className="absolute top-1 left-1 z-10 w-1.5 h-1.5 bg-[#DC2626]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Gallery;
