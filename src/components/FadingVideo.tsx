import React, { useRef, useState, useEffect } from 'react';

interface FadingVideoProps {
  src: string | string[];
  className?: string;
  style?: React.CSSProperties;
  loop?: boolean;
  playWhenInView?: boolean;
}

export const FadingVideo: React.FC<FadingVideoProps> = ({
  src,
  className,
  style,
  loop = false,
  playWhenInView = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [hasStarted, setHasStarted] = useState(!playWhenInView);
  const fadeAnimRef = useRef<number | null>(null);
  const isFadingOutRef = useRef(false);

  const sources = Array.isArray(src) ? src : [src];
  const currentSrc = sources[currentIndex % sources.length];

  const animateOpacity = (from: number, to: number, duration: number, onComplete?: () => void) => {
    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
    }
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = from + (to - from) * progress;
      setOpacity(currentVal);

      if (progress < 1) {
        fadeAnimRef.current = requestAnimationFrame(tick);
      } else {
        if (onComplete) onComplete();
      }
    };

    fadeAnimRef.current = requestAnimationFrame(tick);
  };

  const startPlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    video.play().then(() => {
      animateOpacity(0, 1, 500);
    }).catch(() => {
      // Fallback if browser requires user gesture
      animateOpacity(0, 1, 500);
    });
  };

  const handleLoadedData = () => {
    if (!playWhenInView) {
      startPlayback();
    }
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration || isFadingOutRef.current) return;

    // Only fade out near the end if loop is enabled
    if (loop) {
      const remaining = video.duration - video.currentTime;
      if (remaining <= 0.55 && remaining > 0) {
        isFadingOutRef.current = true;
        animateOpacity(1, 0, 550);
      }
    }
  };

  const handleEnded = () => {
    const video = videoRef.current;
    if (!video) return;

    if (loop) {
      if (sources.length === 1) {
        video.currentTime = 0;
        video.play().catch(() => {});
        isFadingOutRef.current = false;
        animateOpacity(0, 1, 500);
      } else {
        setCurrentIndex((prev) => (prev + 1) % sources.length);
      }
    }
    // If loop is false, video stops at the end, holding its final frame at opacity 1
  };

  // Scroll in-view trigger
  useEffect(() => {
    if (!playWhenInView) return;

    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
          startPlayback();
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(videoEl);

    return () => observer.disconnect();
  }, [playWhenInView, hasStarted]);

  useEffect(() => {
    return () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      key={currentSrc}
      src={currentSrc}
      muted
      playsInline
      preload="auto"
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
      className={className}
      style={{
        ...style,
        opacity,
        transition: 'none',
      }}
    />
  );
};
