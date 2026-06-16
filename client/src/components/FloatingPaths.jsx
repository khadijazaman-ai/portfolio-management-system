import { motion } from 'framer-motion';

export default function FloatingPaths() {
  // Generate two sets of intersecting paths for a rich layered background look
  const paths1 = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M-${200 - i * 10} -${100 + i * 15}C-${200 - i * 10} -${100 + i * 15} -${100 - i * 10} ${200 - i * 15} ${200 - i * 10} ${400 - i * 15}C${500 - i * 10} ${600 - i * 15} ${600 - i * 10} ${800 - i * 15} ${600 - i * 10} ${800 - i * 15}`,
    color: `rgba(14, 165, 233, ${0.05 + i * 0.005})`, // Primary blue glow
    width: 0.5 + i * 0.05,
  }));

  const paths2 = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    d: `M${800 + i * 10} -${50 + i * 15}C${800 + i * 10} -${50 + i * 15} ${600 + i * 10} ${300 - i * 15} ${400 + i * 10} ${500 - i * 15}C${200 + i * 10} ${700 - i * 15} -${100 + i * 10} ${900 - i * 15} -${100 + i * 10} ${900 - i * 15}`,
    color: `rgba(139, 92, 246, ${0.05 + i * 0.005})`, // Secondary purple glow
    width: 0.5 + i * 0.05,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <svg
        className="w-full h-full opacity-70 dark:opacity-50"
        viewBox="0 0 800 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <title>Background Paths</title>
        {paths1.map((path) => (
          <motion.path
            key={`p1-${path.id}`}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0], 
              opacity: [0, 0.8, 0.8, 0] 
            }}
            transition={{
              duration: 6 + path.id * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: path.id * 0.05
            }}
          />
        ))}
        {paths2.map((path) => (
          <motion.path
            key={`p2-${path.id}`}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0], 
              opacity: [0, 0.8, 0.8, 0] 
            }}
            transition={{
              duration: 7 + path.id * 0.15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: path.id * 0.08
            }}
          />
        ))}
      </svg>
    </div>
  );
}
