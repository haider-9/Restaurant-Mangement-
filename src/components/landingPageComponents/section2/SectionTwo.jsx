import React from "react";
import VideoBox from "./VideoBox";
import { motion } from "framer-motion";


const SectionTwo = () => {
    return (
        <section id="overview" className="w-full px-3 md:px-16 py-5 bg-white">
            {/* First Row */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInFrom("left")}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 mb-3"
            >
                <div className="col-span-1 md:col-span-1 lg:col-span-7 xl:col-span-9">
                    <VideoBox />
                </div>
                <div className="hidden md:grid col-span-1 md:col-span-1 lg:col-span-5 xl:col-span-3">
                    <VideoBox />
                </div>
            </motion.div>

            {/* Second Row */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fadeInFrom("right")} 
                className="grid grid-cols-2 gap-3 md:grid-cols-8 lg:grid-cols-12">
                <div className="col-span-1 md:col-span-3 lg:col-span-4">
                    <VideoBox />
                </div>
                <div className="col-span-1 md:col-span-5 lg:col-span-8">
                    <VideoBox />
                </div>
            </motion.div>
        </section>
    );
};

export default SectionTwo;



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