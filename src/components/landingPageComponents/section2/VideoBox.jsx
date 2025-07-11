import React from "react";

const VideoBox = ({ label }) => {
  return (
    <div className="bg-primary rounded-xl h-60 md:h-72 flex items-center justify-center font-semibold text-sm shadow-inner">
      {label}
    </div>
  );
};

export default VideoBox;
