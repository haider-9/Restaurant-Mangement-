import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/effect-fade"; 

import TestimonialCard from "./TestimonialCard";
import "./testimonialStyle.css";
import { testimonials } from "."; 

const TestimonialSlider = () => {
  return (
    <div className="relative w-full py-16 px-4 md:px-20 overflow-hidden">
      <Swiper
        modules={[Navigation]}
        spaceBetween={60}
        slidesPerView="auto"
        centeredSlides
        grabCursor
        loop 
        className="testimonial-swiper"
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="testimonial-slide">
            <TestimonialCard {...testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>

    </div>
  );
};

export default TestimonialSlider;