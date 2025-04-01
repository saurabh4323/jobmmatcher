"use client";
import { motion } from "framer-motion";

const CircularLoopBackground = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* Loop of Circles */}
      <motion.div
        className="relative w-[300px] h-[300px] flex justify-center items-center"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {[...Array(8)].map((_, index) => {
          const size = index % 2 === 0 ? 20 : 40; // Alternating sizes
          const angle = (index / 8) * Math.PI * 2; // Evenly spaced
          const x = Math.cos(angle) * 120; // Radius
          const y = Math.sin(angle) * 120;

          return (
            <motion.div
              key={index}
              className="absolute bg-white opacity-20 rounded-full"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `calc(50% + ${y}px)`,
                left: `calc(50% + ${x}px)`,
                transform: "translate(-50%, -50%)",
              }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3, // Staggered animation
              }}
            />
          );
        })}
      </motion.div>
    </div>
  );
};

export default CircularLoopBackground;
