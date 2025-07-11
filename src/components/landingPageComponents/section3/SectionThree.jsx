import React from "react";
import FeatureBlock from "./FeatureBlock";
import { features } from ".";



const SectionThree = () => {
  return (
    <section id="features" className="w-full px-3 md:px-8 py-10 font-inter z-20">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-center text-textPrimary mb-8 md:mb-12">
        Track your Restaurant's insights
      </h2>

      {features.map((feature, index) => (
        <FeatureBlock
          key={index}
          {...feature}
          reverse={index % 2 !== 0} 
        />
      ))}
    </section>
  );
};

export default SectionThree;
