
import React from "react";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const fadeInFrom = (direction = "right") => {
  return {
    hidden: {
      opacity: 0,
      x: direction === "right" ? 100 : -100,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 1,
        ease: "easeOut",
      },
    },
  };
};

const FeatureBlock = ({ title, description, image, features, reverse }) => {
  return (
    <motion.div
      className={`flex flex-col md:flex-row ${reverse ? "md:flex-row-reverse" : ""} items-center gap-10 lg:gap-20 my-20`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInFrom(reverse ? "left" : "right")}
    >
      <motion.div className="md:w-1/2" whileHover={{ scale: 1.02, rotate: reverse ? -3 : 3}}>
        <img src={image} alt={title} className="w-full rounded-xl shadow-lg" />
      </motion.div>

      <div className="md:w-1/2">
        <h3 className="text-xl md:text-2xl text-left font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-textPrimary md:text-xl text-justify mb-4">{description}</p>
        <ul className="space-y-2">
          {features.map((f, index) => (
            <li key={index} className="flex items-start text-left gap-2 text-sm md:text-lg text-textSecondary">
              <CheckCircle className="text-primary w-5 h-5 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

export default FeatureBlock;

