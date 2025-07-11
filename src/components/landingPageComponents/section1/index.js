import { useState, useEffect } from 'react';

// Define your breakpoints
const breakpoints = {
  mobile: 0,
  tablet: 768,   // md breakpoint
  laptop: 1024,  // lg breakpoint
  desktop: 1440, // xl breakpoint (or whatever you define as your largest)
};

/**
 * Custom hook to select an image based on the current window width.
 * @param {object} images - An object where keys are breakpoint names (e.g., 'mobile', 'tablet')
 * and values are the corresponding image paths.
 * @returns {string} The URL of the image best suited for the current screen size.
 */
const useResponsiveImage = (images) => {
  const [currentImage, setCurrentImage] = useState(null);

  useEffect(() => {
    const updateImage = () => {
      const width = window.innerWidth;
      let selectedImage = images.mobile; // Default to mobile

      if (width >= breakpoints.desktop && images.desktop) {
        selectedImage = images.desktop;
      } else if (width >= breakpoints.laptop && images.laptop) {
        selectedImage = images.laptop;
      } else if (width >= breakpoints.tablet && images.tablet) {
        selectedImage = images.tablet;
      } else if (images.mobile) {
        selectedImage = images.mobile;
      }
      setCurrentImage(selectedImage);
    };

    // Set initial image
    updateImage();

    // Add event listener for window resize
    window.addEventListener('resize', updateImage);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', updateImage);
    };
  }, [images]); // Re-run effect if the 'images' prop changes

  return currentImage;
};

export default useResponsiveImage;