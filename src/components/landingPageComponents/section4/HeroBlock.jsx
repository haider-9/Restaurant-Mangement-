import React from "react";
// Assuming testimonialBg is correctly imported and available
import testimonialBg from "../../../assets/images/landing/testimonials/testimonialBg.svg";

const HeroBlock = () => {
  return (
    <div
      className="
        relative
        -mt-28
        lg:-mt-44         
        z-0              
        w-full
        h-[300px]
        sm:h-[400px] 
        md:h-[500px]
        lg:h-[700px]
        xl:h-[1000px]
        bg-cover
        bg-no-repeat
        bg-[70%_center]
        md:bg-[50%_center]
        xl:bg-[110%_center]
        mb-24
      "
      style={{ backgroundImage: `url(${testimonialBg})` }}
    >
      {/* Heading */}
      <h2 className="
        text-2xl
        md:text-4xl
        font-semibold
        text-textPrimary
        pt-11
        sm:pt-20
        md:pt-32 
        lg:pt-40
        xl:pt-50
        text-center
        px-4                
      ">
        What people say about us
      </h2>

      <div className="
        absolute
        -bottom-24         
        sm:-bottom-16       
        md:-bottom-20
        left-1/2
        transform -translate-x-1/2
        bg-white
        p-4 
        sm:p-6 
        shadow-lg
        rounded-lg
        w-11/12 
        sm:w-10/12 
        md:w-7/12
        lg:w-6/12
        xl:w-5/12
        text-center
      ">
        <p className="
          mt-2 
          sm:mt-4
          text-textSecondary
          text-[11px]  
          sm:text-[12px] 
          lg:text-[16px]
        ">
          “This software has revolutionized the way we run our restaurants. It’s efficient, reliable, and extremely user-friendly.”
        </p>
        <div className="mt-2 text-sm md:text-lg text-textPrimary font-bold">Reserv'O</div>
      </div>
    </div>
  );
};

export default HeroBlock;