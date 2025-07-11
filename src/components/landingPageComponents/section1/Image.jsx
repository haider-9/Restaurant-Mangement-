import React from "react";
import dashboardImage from "../../../assets/images/dashboard-mockup.png"

const Image = () => {
  return (
    <div className="relative w-80 md:w-96 h-auto animate-float lg:w-[32rem] xl:w-[35rem]">
      <img
        src={dashboardImage}
        alt="Dashboard Animation"
        className="w-full h-auto object-contain"
      />
    </div>
  );
};

export default Image;
