import { useState, useRef, useEffect } from 'react';
import { Smartphone, Tablet, Monitor, RotateCw, Loader2, ExternalLink } from 'lucide-react';

export default function PreviewFrame({ url }) {
  const [device, setDevice] = useState('mobile'); // 'mobile', 'tablet', 'desktop'
  const [loading, setLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [zoom, setZoom] = useState(1.0); // Manual size adjustment slider
  
  const iframeRef = useRef(null);
  const containerRef = useRef(null);

  const reloadIframe = () => {
    setLoading(true);
    if (iframeRef.current) {
      const src = iframeRef.current.src;
      iframeRef.current.src = '';
      iframeRef.current.src = src;
    }
  };

  useEffect(() => {
    setLoading(true);
  }, [url]);

  // Reset zoom on device switch
  useEffect(() => {
    setZoom(1.0);
  }, [device]);

  useEffect(() => {
    const handleForward = (event) => {
      if (event.data && event.data.type && event.data.type.startsWith('PREVIEW_')) {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(event.data, '*');
        }
      }
    };

    window.addEventListener('message', handleForward);
    return () => window.removeEventListener('message', handleForward);
  }, []);

  // Handle iframe load event
  const handleLoad = () => {
    setLoading(false);
  };

  // Calculate appropriate scale to fit within parent container
  useEffect(() => {
    if (!containerRef.current) return;
    
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      const targetWidth = device === 'mobile' ? 375 : device === 'tablet' ? 768 : 1280;
      const targetHeight = device === 'mobile' ? 667 : device === 'tablet' ? 1024 : 800;

      // Allow appropriate padding around the device frame (smaller padding for desktop)
      const padding = device === 'desktop' ? 16 : 32;
      const maxW = Math.max(width - padding, 100);
      const maxH = Math.max(height - padding, 100);

      const scaleW = maxW / targetWidth;
      const scaleH = maxH / targetHeight;

      // Select the smaller scale to ensure it fits both width and height, capped at 1
      const fitScale = Math.min(scaleW, scaleH, 1);
      setScale(fitScale);
    };

    // Use ResizeObserver for accurate sizing updates
    const observer = new ResizeObserver(() => {
      handleResize();
    });

    observer.observe(containerRef.current);
    handleResize(); // Initial calculation

    return () => observer.disconnect();
  }, [device]);

  const getWidthClass = () => {
    switch (device) {
      case 'mobile':
        return 'rounded-[36px] border-[12px] border-slate-950 shadow-2xl relative bg-slate-950 ring-[3px] ring-slate-900/50';
      case 'tablet':
        return 'rounded-[24px] border-[10px] border-slate-950 shadow-2xl relative bg-slate-950 ring-[3px] ring-slate-900/50';
      case 'desktop':
      default:
        return 'rounded-[16px] border-[12px] border-slate-950 border-b-[36px] shadow-2xl relative bg-slate-950 ring-[3px] ring-slate-900/50';
    }
  };

  const getDeviceStyle = () => {
    const targetWidth = device === 'mobile' ? 375 : device === 'tablet' ? 768 : 1280;
    const targetHeight = device === 'mobile' ? 667 : device === 'tablet' ? 1024 : 800;
    const finalScale = scale * zoom;

    return {
      width: `${targetWidth}px`,
      height: `${targetHeight}px`,
      transform: `translate(-50%, -50%) scale(${finalScale})`,
      transformOrigin: 'center center',
      position: 'absolute',
      top: '50%',
      left: '50%',
      flexShrink: 0,
      transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1), width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    };
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 rounded-2xl overflow-hidden border border-slate-800/80 shadow-2xl animate-fade-in">
      {/* Viewport Control Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800/60">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/20"></span>
          <span className="h-3 w-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/20"></span>
          <span className="h-3 w-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/20"></span>
        </div>

        {/* Device selectors & Zoom Control */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800/60">
            <button
              onClick={() => setDevice('mobile')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                device === 'mobile'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Viewport"
            >
              <Smartphone className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDevice('tablet')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                device === 'tablet'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Tablet Viewport"
            >
              <Tablet className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setDevice('desktop')}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                device === 'desktop'
                  ? 'bg-primary text-white shadow-md shadow-primary/20 scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Desktop Viewport"
            >
              <Monitor className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Manual Zoom/Size Adjustment Slider */}
          <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800/60 text-[10px] text-slate-400 font-bold select-none">
            <span>Size:</span>
            <input
              type="range"
              min="0.5"
              max="1.5"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-16 h-1 rounded-lg bg-slate-800 accent-primary cursor-pointer"
            />
            <span className="w-8 text-right text-primary">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={reloadIframe}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            title="Reload Frame"
          >
            <RotateCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin text-primary' : ''}`} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            title="Open Site in New Tab"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div 
        ref={containerRef}
        className="flex-1 overflow-hidden bg-slate-900/40 p-4 flex justify-center items-center relative"
      >
        {/* Soft background glow for a premium glassmorphic vibe */}
        <div className="absolute w-[80%] h-[80%] rounded-full bg-gradient-to-tr from-primary/10 to-secondary/10 blur-3xl opacity-60 pointer-events-none z-0"></div>

        {loading && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-sm gap-3 transition-opacity duration-300">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <span className="text-xs font-semibold text-slate-400 tracking-wider">Syncing Live Preview...</span>
          </div>
        )}

        <div 
          className={`overflow-hidden transition-all duration-300 ${getWidthClass()}`}
          style={getDeviceStyle()}
        >
          {/* Subtle glossy glass reflection and inner depth shadows */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-white/[0.08] pointer-events-none z-10 rounded-[12px]"></div>
          <div className="absolute inset-0 shadow-[inset_0_0_12px_rgba(0,0,0,0.85)] pointer-events-none z-10 rounded-[12px]"></div>

          {/* Simulated Speaker / Camera notches for devices */}
          {device === 'mobile' && (
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-950 rounded-full z-25 flex items-center justify-between px-3.5 shadow-md border border-slate-900/60">
              <span className="h-2 w-2 rounded-full bg-slate-900 border border-indigo-950/40 relative">
                <span className="absolute top-0.5 left-0.5 h-1 w-1 rounded-full bg-blue-500/25"></span>
              </span>
              <span className="h-1 w-8 bg-slate-900 rounded-full"></span>
            </div>
          )}

          {device === 'tablet' && (
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-4.5 h-4.5 bg-slate-950 rounded-full z-25 flex items-center justify-center border border-slate-900/40 shadow-inner">
              <span className="h-1.5 w-1.5 bg-slate-900 rounded-full relative">
                <span className="absolute top-0.5 left-0.5 h-0.5 w-0.5 rounded-full bg-blue-500/30"></span>
              </span>
            </div>
          )}

          {device === 'desktop' && (
            <>
              {/* Webcam */}
              <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-slate-950 rounded-full z-25 flex items-center justify-center shadow-inner">
                <span className="h-1 w-1 bg-slate-900 rounded-full relative">
                  <span className="absolute top-0.5 left-0.5 h-0.5 w-0.5 rounded-full bg-blue-500/40"></span>
                </span>
              </div>
              {/* Sleek pulsing power LED in the center of the bottom bezel */}
              <div className="absolute bottom-[-24px] left-1/2 -translate-x-1/2 h-2.5 w-2.5 rounded-full bg-slate-800 border border-slate-700/60 shadow-inner flex items-center justify-center z-25">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse"></span>
              </div>
            </>
          )}

          <iframe
            ref={iframeRef}
            src={url}
            title="Portfolio Live Preview"
            className="absolute inset-0 w-full h-full border-none bg-slate-950 rounded-xl"
            onLoad={handleLoad}
          />

          {/* Simulated iOS home gesture bar */}
          {device === 'mobile' && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700/80 rounded-full z-20 shadow-sm"></div>
          )}
          {device === 'tablet' && (
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-40 h-1 bg-slate-700/80 rounded-full z-20 shadow-sm"></div>
          )}
        </div>
      </div>
    </div>
  );
}
