import React from "react";
import "./Loader.scss";
import { motion } from "framer-motion";

const Loader = () => {
  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        delay: 0.2, // Add a delay to the animation
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };
  return (
    <motion.div
      variants={loaderVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="h-screen w-full bg-bg_light_var flex justify-center items-center"
    >
      <p className="loader">
        <span className="z-20 text-[1.4rem] font-black text-zinc-200">
          <span className="pt-8">T</span>
        </span>
      </p>
    </motion.div>
  );
};

export default Loader;
