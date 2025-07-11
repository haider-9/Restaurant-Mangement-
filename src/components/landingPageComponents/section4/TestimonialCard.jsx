import React from "react";
import { CircleUserRound, Quote } from "lucide-react";


const TestimonialCard = ({ comment, name, company, image }) => (
    <div className="

      bg-white
      rounded-xl
      shadow-md
      mb-6
      p-4
      sm:p-6
      space-y-4
    ">
        <div className="relative">
            <Quote className="
              text-gray-300
              w-8 h-8
              sm:w-10 sm:h-10   
              absolute
              left-0
            " />
            <p className="
              text-justify
              text-textPrimary
              text-[10px]
              sm:text-[12px]
              italic
              pl-10               
              sm:pl-14
            ">
                "{comment}"
            </p>
        </div>
        <div className="
          pl-10
          sm:pl-14
        ">
            <div className="flex items-center gap-4 mt-4">

                <CircleUserRound className="stroke-2 text-textPrimary w-7 h-7 md:w-10 md:h-10" />

                <div className="flex flex-col items-start">
                    <h4 className="text-xs md:text-sm font-semibold text-gray-800">{name}</h4>
                    <p className="text-[10px] md:text-xs text-gray-500">{company}</p>
                </div>
            </div>
        </div>
    </div>
);

export default TestimonialCard;
