import React from 'react';
import { useScreenSize } from '../../../hooks/useScreenSize';
import { logos } from '.';


const TrustedBy = () => {
  const screenWidth = useScreenSize();

  const duration = screenWidth < 640
    ? '10s'       // mobile
    : screenWidth < 1024
    ? '15s'       // tablet
    : '20s';      // laptop & up

  return (
    <section className="w-full py-16 bg-white overflow-hidden">
      <h2 className="text-center text-2xl md:text-3xl font-semibold mb-10">
        They trust us
      </h2>

      <div className="relative w-full">
        <div className="overflow-hidden">
          <div
            className="flex whitespace-nowrap gap-12"
            style={{
              animation: `scroll-left ${duration} linear infinite`
            }}
            onMouseEnter={(e) => (e.currentTarget.style.animationPlayState = 'paused')}
            onMouseLeave={(e) => (e.currentTarget.style.animationPlayState = 'running')}
          >
            {[...logos, ...logos].map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Company logo ${index}`}
                className="h-10 md:h-14 lg:h-20 w-auto object-contain"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
