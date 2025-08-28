import { useState, useEffect } from 'react';
import { UserCheck } from 'lucide-react';

const images = [
  {
    src: "/1.jpg",
    alt: "Happy couple representing second chance love"
  },
  {
    src: "/2.jpg",
    alt: "Mature couple enjoying life together"
  },
  {
    src: "/3.jpg",
    alt: "Professional woman looking for love"
  },
  
];

export default function HeroSlideshow() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="relative overflow-hidden rounded-2xl shadow-2xl">
        {images.map((image, index) => (
          <img
            key={index}
            src={image.src}
            alt={image.alt}
            className={`w-full h-auto transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'
            }`}
            data-testid={`hero-slide-${index}`}
          />
        ))}
      </div>
      
      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            onClick={() => setCurrentImageIndex(index)}
            data-testid={`slide-indicator-${index}`}
          />
        ))}
      </div>

      {/* Verified Profiles Badge */}
      <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <UserCheck className="text-green-600 h-6 w-6" />
          </div>
          <div>
            <p className="font-semibold text-charcoal" data-testid="text-verified-badge">
              Verified Profiles
            </p>
            <p className="text-sm text-gray-600">100% Authentic</p>
          </div>
        </div>
      </div>
    </div>
  );
}
