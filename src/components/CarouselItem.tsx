
import React from 'react';
import { cn } from '@/lib/utils';

interface CarouselItemProps {
  item: {
    id: number;
    image: string;
    title: string;
    description?: string;
  };
  isActive: boolean;
}

const CarouselItem: React.FC<CarouselItemProps> = ({ item, isActive }) => {
  return (
    <div className="min-w-full h-full relative">
      <img
        src={item.image}
        alt={item.title}
        className="w-full h-full object-cover"
      />
      <div 
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-8 text-white",
          "transition-opacity duration-500",
          isActive ? "opacity-100" : "opacity-0"
        )}
      >
        <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
        {item.description && (
          <p className="text-sm md:text-base text-white/90">{item.description}</p>
        )}
      </div>
    </div>
  );
};

export default CarouselItem;
