import React from "react";
import MainButton from "../../common/buttons/MainButton";
import { motion } from "framer-motion";


const textAnimation = {
    hidden: {
        opacity: 0,
        y: 50,
    },
    visible: {
        opacity: 1,
        y: 0, 
        transition: {
            duration: 1,
            ease: "easeOut",
        },
    },
};

const TextBlock = () => {
    return (
        <motion.div
            className="max-w-lg font-inter text-left "
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={textAnimation}
        > 
        {/* className="max-w-lg font-inter "> */}
            <h1 className="text-lg md:text-xl font-semibold text-textPrimary mb-4 lg:text-3xl">
                All-in-One Solution for Modern Restaurants
            </h1>
            <p className="text-[11px] md:text-xs text-textSecondary mb-6 lg:text-lg">
                Simplify your operations, reduce no-shows, and manage every branch from a single, smart dashboard.
            </p>
            <MainButton
                className="font-light text-[10px] md:text-[14px] px-6 py-1.5 lg:text-[16px]"
            >
                <a href="#pricing">See All Plans</a>
            </MainButton>
        </motion.div>
    );
};

export default TextBlock;
