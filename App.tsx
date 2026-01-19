
import React from 'react';
import HeadphoneScroll from './components/HeadphoneScroll';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  return (
    <div className="relative bg-[#050505] text-white selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <HeadphoneScroll />
        
        {/* Additional static sections to provide more context and depth */}
        <section className="min-h-screen flex items-center justify-center px-6 py-24 bg-[#050505] relative z-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter text-white/90">
              Redefining the <br /> <span className="text-white/40 italic">Aural Landscape.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
              Every curve, every component, every signal path has been meticulously optimized. 
              Frizzy Music isn't just a pair of headphones; it's a statement of engineering purity.
            </p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 min-h-[80vh] bg-[#050505]">
          <div className="bg-[#0a0a0a] rounded-3xl p-12 flex flex-col justify-end border border-white/5 hover:border-white/10 transition-colors group">
             <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Battery</span>
             <h3 className="text-3xl font-bold mb-4">40 Hours of Pure Bliss</h3>
             <p className="text-white/60">Fast charge 10 minutes for 3 hours of playback. Never stop the music.</p>
          </div>
          <div className="bg-[#0a0a0a] rounded-3xl p-12 flex flex-col justify-end border border-white/5 hover:border-white/10 transition-colors group">
             <span className="text-xs uppercase tracking-[0.2em] text-white/40 mb-2">Connectivity</span>
             <h3 className="text-3xl font-bold mb-4">Ultra-Low Latency</h3>
             <p className="text-white/60">Bluetooth 5.3 with LE Audio. Seamless switching between devices.</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default App;
