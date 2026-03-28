import { motion } from 'framer-motion';

const CelestialBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#020617]">
      {/* Advanced Dynamic Background - Orbs */}
      <motion.div 
        animate={{ 
          x: [0, 80, -40, 0],
          y: [0, -80, 40, 0],
          scale: [1, 1.15, 0.9, 1],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 left-0 w-[60vw] h-[60vw] bg-indigo-600/10 blur-[150px] rounded-full"
      />
      <motion.div 
        animate={{ 
          x: [0, -60, 80, 0],
          y: [0, 60, -80, 0],
          scale: [1.1, 0.85, 1.1, 1],
          opacity: [0.2, 0.4, 0.2]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 right-0 w-[50vw] h-[50vw] bg-purple-600/10 blur-[150px] rounded-full"
      />

      {/* Starfield & Intelligence Particles */}
      <svg className="absolute inset-0 w-full h-full opacity-60">
        <defs>
          <radialGradient id="starGlow">
            <stop offset="0%" stopColor="white" />
            <stop offset="30%" stopColor="rgba(255,255,255,0.4)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>
        {[...Array(150)].map((_, i) => (
          <motion.circle
            key={i}
            cx={`${Math.random() * 100}%`}
            cy={`${Math.random() * 100}%`}
            r={Math.random() * 1}
            fill="url(#starGlow)"
            animate={{ 
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.5, 1] 
            }}
            transition={{ 
              duration: Math.random() * 4 + 3, 
              repeat: Infinity,
              delay: Math.random() * 10
            }}
          />
        ))}
      </svg>

      {/* Fine-Grained Texture Overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.02] mix-blend-overlay pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-transparent to-[#020617] opacity-80" />
    </div>
  );
};

export default CelestialBackground;
