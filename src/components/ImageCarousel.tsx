import React, { useState, useEffect } from "react";

interface ImageCarouselProps {
  images: string[];
  interval: number;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, interval }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden rounded-lg">
      {images.map((image, index) => (
        <a
          key={index}
          href="https://google.com"
          target="_blank"
          rel="noopener noreferrer"
          className={`absolute top-0 left-0 w-full h-full transition-transform duration-500 ease-in-out ${
            index === currentIndex ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <img
            src={image}
            alt={`Carousel image ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </a>
      ))}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-3 h-3 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-400"
            } transition-colors duration-300`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
