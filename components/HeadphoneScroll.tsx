
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, AnimatePresence } from 'framer-motion';

const FRAME_COUNT = 120;
const PAGE_HEIGHT = '400vh';

const WaveformLoading: React.FC<{ progress: number }> = ({ progress }) => {
  const bars = Array.from({ length: 12 });
  
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Waveform Animation */}
      <div className="flex items-end space-x-1.5 h-16 mb-8">
        {bars.map((_, i) => (
          <motion.div
            key={i}
            className="w-1 bg-white rounded-full"
            initial={{ height: 4 }}
            animate={{ 
              height: [8, 48, 12, 32, 8],
            }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.1,
            }}
          />
        ))}
      </div>
      
      {/* Brand & Progress */}
      <div className="text-center">
        <motion.div 
          className="text-2xl font-bold tracking-[0.3em] uppercase mb-2 text-white"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Frizzy <span className="text-white/30 font-light">Music</span>
        </motion.div>
        
        <div className="relative w-48 h-[1px] bg-white/10 mx-auto overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-white"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", bounce: 0, duration: 0.5 }}
          />
        </div>
        
        <motion.p 
          className="mt-4 text-[10px] uppercase tracking-[0.4em] text-white/40 font-medium"
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Calibrating Audio Engine — {progress}%
        </motion.p>
      </div>
    </div>
  );
};

const HeadphoneScroll: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // Scroll tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map 0-1 scroll progress to 0-119 frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, FRAME_COUNT - 1]);

  // Preload images
  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 0; i < FRAME_COUNT; i++) {
        const img = new Image();
        // Using a seeded picsum for deterministic image sequence simulation
        img.src = `https://picsum.photos/seed/${i + 200}/1920/1080?grayscale`; 

        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
          if (loadedCount === FRAME_COUNT) {
            // Add a small artificial delay for a smoother transition after 100%
            setTimeout(() => {
              setImages(loadedImages);
              setIsLoading(false);
            }, 800);
          }
        };
        loadedImages[i] = img;
      }
    };

    preloadImages();
  }, []);

  // Drawing logic
  const renderCanvas = (index: number) => {
    if (canvasRef.current && images[index]) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (!context) return;

      const img = images[index];
      
      const canvasWidth = window.innerWidth;
      const canvasHeight = window.innerHeight;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      const imgRatio = img.width / img.height;
      const canvasRatio = canvasWidth / canvasHeight;
      
      let drawWidth, drawHeight, offsetX, offsetY;

      if (imgRatio > canvasRatio) {
        drawWidth = canvasWidth;
        drawHeight = canvasWidth / imgRatio;
        offsetX = 0;
        offsetY = (canvasHeight - drawHeight) / 2;
      } else {
        drawWidth = canvasHeight * imgRatio;
        drawHeight = canvasHeight;
        offsetX = (canvasWidth - drawWidth) / 2;
        offsetY = 0;
      }

      context.clearRect(0, 0, canvasWidth, canvasHeight);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
    }
  };

  // Sync scroll to canvas draw
  useMotionValueEvent(frameIndex, "change", (latest) => {
    renderCanvas(Math.floor(latest));
  });

  // Initial render when loading finishes
  useEffect(() => {
    if (!isLoading && images.length > 0) {
      renderCanvas(0);
    }
  }, [isLoading, images]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const currentFrame = Math.floor(frameIndex.get());
      renderCanvas(currentFrame);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [images, frameIndex]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: PAGE_HEIGHT }}>
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            key="loader"
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050505]"
            exit={{ opacity: 0, filter: "blur(20px)" }}
            transition={{ duration: 1, ease: "circOut" }}
          >
            <WaveformLoading progress={loadingProgress} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Canvas Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full block object-contain pointer-events-none"
        />

        {/* Text Story Overlays */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          
          {/* Section 1: 0-20% */}
          <Section progress={scrollYProgress} range={[0, 0.2]} align="center">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4">
              Frizzy Music
            </h1>
            <p className="text-lg md:text-xl text-white/60 tracking-widest uppercase">
              Pure Sound. Zero Noise.
            </p>
          </Section>

          {/* Section 2: 25-45% */}
          <Section progress={scrollYProgress} range={[0.25, 0.5]} align="left">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-lg">
              Precision <br /> Engineering.
            </h2>
            <p className="text-white/60 max-w-sm leading-relaxed">
              Every curve is designed to direct sound with surgical precision. 
              The carbon-fiber reinforced structure ensures durability without the weight.
            </p>
          </Section>

          {/* Section 3: 55-75% */}
          <Section progress={scrollYProgress} range={[0.55, 0.8]} align="right">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 max-w-lg">
              Titanium <br /> Drivers.
            </h2>
            <p className="text-white/60 max-w-sm leading-relaxed ml-auto">
              Custom-tuned 50mm titanium diaphragms deliver crisp highs and resonant lows. 
              Experience the internal anatomy of sound.
            </p>
          </Section>

          {/* Section 4: 85-100% */}
          <Section progress={scrollYProgress} range={[0.85, 1]} align="center">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8">
              Hear Everything.
            </h2>
            <motion.button 
              className="px-10 py-4 bg-white text-black font-bold rounded-full text-sm uppercase tracking-widest hover:scale-105 transition-transform pointer-events-auto shadow-2xl shadow-white/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Now — $549
            </motion.button>
          </Section>
        </div>
      </div>
    </div>
  );
};

interface SectionProps {
  progress: any;
  range: [number, number];
  align: 'left' | 'right' | 'center';
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ progress, range, align, children }) => {
  // Main section opacity
  const opacity = useTransform(progress, [range[0], range[0] + 0.05, range[1] - 0.05, range[1]], [0, 1, 1, 0]);
  
  // Parallax: The text moves from 120px to -120px relative to its center as we scroll the range.
  // This creates a sense that it's "floating" and moving at a different speed than the sticky background.
  const y = useTransform(progress, [range[0], range[1]], [120, -120]);
  
  // Subtle secondary parallax for an even deeper effect
  const subY = useTransform(progress, [range[0], range[1]], [40, -40]);

  const alignmentClasses = {
    left: 'items-start text-left pl-[10%]',
    right: 'items-end text-right pr-[10%]',
    center: 'items-center text-center'
  };

  return (
    <motion.div 
      style={{ opacity, y }}
      className={`absolute inset-0 flex flex-col justify-center px-6 ${alignmentClasses[align]}`}
    >
      <div className="flex flex-col">
        {React.Children.map(children, (child, index) => (
          <motion.div
            key={index}
            style={{ y: index > 0 ? subY : 0 }}
            className={index > 0 ? "mt-2" : ""}
          >
            {child}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default HeadphoneScroll;
