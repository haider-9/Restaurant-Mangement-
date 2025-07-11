import React from "react";
import TextBlock from "./TextBlock";
import Image from "./Image";
import heroMobile from "../../../assets/images/landing/landingHeroMobile.svg"
import heroTablet from "../../../assets/images/landing/landingHeroTablet.svg"
import heroLaptop from "../../../assets/images/landing/landingHeroLaptop.svg"
import heroDesktop from "../../../assets/images/landing/landingHeroDesktop.svg"

import useResponsiveImage from "./index";

const SectionOne = () => {

  const heroImages = {
    mobile: heroMobile,
    tablet: heroTablet,
    laptop: heroLaptop,
    desktop: heroDesktop,
  };

  // Use the hook to get the appropriate hero image
  const selectedHeroImage = useResponsiveImage(heroImages);

  return (
    <section className="w-full py-16 bg-white flex flex-col md:flex-row sm:gap- items-center justify-between px-6 md:px-1 lg:pt-20">
      {
        selectedHeroImage &&
        <img src={selectedHeroImage} alt="" className="z- 0 absolute top-0 right-0 h-72 md:h-[22rem] lg:h-[28rem]" />
      }
      <div className="w-full md:w-1/3 mb-8 md:mb-0 z-10">
        <TextBlock />
      </div>
      <div className="w-full md:w-2/3 flex justify-center z-10">
        <Image />
      </div>
    </section>
  );
};

export default SectionOne;
