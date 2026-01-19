
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';

const FRAME_COUNT = 120;
const PAGE_HEIGHT = '400vh';

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
        // Fallback to high-quality placeholders if real sequence isn't found
        // In a real build, we'd use the provided naming convention: `frame_${i}_delay-0.04s.webp`
        // Since we don't have the assets, we'll simulate the look.
        img.src = `https://picsum.photos/seed/${i + 100}/1920/1080?grayscale`; 
        
        // Note: For a real demo, you'd replace the above with the actual local assets path:
        // img.src = `/assets/sequence/frame_${i.toString().padStart(3, '0')}_delay-0.04s.webp`;

        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.floor((loadedCount / FRAME_COUNT) * 100));
          if (loadedCount === FRAME_COUNT) {
            setImages(loadedImages);
            setIsLoading(false);
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
      
      // Handle responsiveness / Object-fit contain logic
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
      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505] transition-opacity duration-1000">
          <div className="w-64 h-[2px] bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div 
              className="h-full bg-white" 
              initial={{ width: 0 }}
              animate={{ width: `${loadingProgress}%` }}
            />
          </div>
          <p className="text-white/40 text-xs uppercase tracking-widest font-medium">
            Calibrating Zenith X... {loadingProgress}%
          </p>
        </div>
      )}

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
              Zenith X
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
  const opacity = useTransform(progress, [range[0], range[0] + 0.05, range[1] - 0.05, range[1]], [0, 1, 1, 0]);
  const y = useTransform(progress, [range[0], range[1]], [50, -50]);

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
      {children}
    </motion.div>
  );
};

export default HeadphoneScroll;
