import React from 'react';
import { motion } from 'framer-motion';

const destinations = ['Kashi', 'Prayagraj', 'Gaya', 'Ayodhya', 'Vindhyachal'];

export default function SacredDestinations() {
  const MarqueeContent = () => (
    <div className="flex items-center px-10">
      {destinations.map((dest, i) => (
        <React.Fragment key={`${dest}-${i}`}>
          <div className="group relative flex items-center justify-center">
            {/* Soft Glow / Bloom effect behind text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF7A00] to-[#D4AF37] blur-[40px] opacity-0 group-hover:opacity-30 transition-opacity duration-1000 ease-out pointer-events-none"></div>
            
            <span 
              className="relative font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-[0.03em] font-medium transition-all duration-700 cursor-default select-none group-hover:brightness-110"
              style={{
                backgroundImage: 'linear-gradient(135deg, #FF7A00, #D4AF37)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                filter: 'drop-shadow(0px 8px 16px rgba(43, 29, 14, 0.08))'
              }}
            >
              {dest}
            </span>
          </div>
          <span className="text-[#D4AF37] opacity-40 mx-6 sm:mx-10 md:mx-16 font-light tracking-[0.5em] text-lg sm:text-xl md:text-2xl select-none flex items-center">
            ———
          </span>
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <section className="relative w-full py-10 md:py-16 overflow-hidden flex flex-col items-center justify-center bg-[#F8F5EE]">
      {/* Background Spiritual Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
        <div className="w-[120%] max-w-[1000px] h-[60%] rounded-[100%] bg-gradient-to-r from-[#FF7A00]/5 to-[#D4AF37]/10 blur-[100px] md:blur-[150px]"></div>
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        {/* Top Label */}
        <div className="mb-6 md:mb-10 inline-flex items-center justify-center opacity-80">
          <span className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]"></span>
          <span className="px-6 font-sans text-xs sm:text-sm font-semibold tracking-[0.4em] uppercase text-[#D4AF37]">
            Divine Pilgrimages
          </span>
          <span className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]"></span>
        </div>

        <div 
          className="relative w-full flex overflow-hidden py-4" 
          style={{ 
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', 
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' 
          }}
        >
          <motion.div 
            className="flex flex-shrink-0 items-center will-change-transform"
            animate={{ x: [0, "-100%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
          >
            <MarqueeContent />
          </motion.div>
          
          <motion.div 
            className="flex flex-shrink-0 items-center will-change-transform"
            animate={{ x: [0, "-100%"] }}
            transition={{ duration: 45, ease: "linear", repeat: Infinity }}
          >
            <MarqueeContent />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
