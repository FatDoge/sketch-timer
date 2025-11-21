import React, { useEffect, useRef } from 'react';
import { Season, Particle } from '../types';

interface SeasonalBackgroundProps {
  season: Season;
}

export const SeasonalBackground: React.FC<SeasonalBackgroundProps> = ({ season }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  
  // Season Colors and Settings
  const getSeasonConfig = (s: Season) => {
    switch (s) {
      case Season.Spring:
        return {
          bg: 'bg-pink-50',
          particleColors: ['#ffb7b2', '#ffdac1', '#ff9aa2'],
          type: 'petal' as const,
          count: 40,
          speedMulti: 1
        };
      case Season.Summer:
        return {
          bg: 'bg-green-50',
          particleColors: ['#b5ead7', '#a0e8af', '#76c893'],
          type: 'leaf' as const,
          count: 30,
          speedMulti: 1.2
        };
      case Season.Autumn:
        return {
          bg: 'bg-orange-50',
          particleColors: ['#ff9aa2', '#e2f0cb', '#ffcc80', '#d35d6e'],
          type: 'leaf' as const,
          count: 35,
          speedMulti: 0.9
        };
      case Season.Winter:
        return {
          bg: 'bg-slate-100',
          particleColors: ['#ffffff', '#eef2f3'],
          type: 'circle' as const,
          count: 60,
          speedMulti: 0.7
        };
    }
  };

  const config = getSeasonConfig(season);

  const initParticles = (width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.count; i++) {
      particles.push(createParticle(width, height, true));
    }
    return particles;
  };

  const createParticle = (w: number, h: number, randomY: boolean = false): Particle => {
    return {
      x: Math.random() * w,
      y: randomY ? Math.random() * h : -20,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() * 1 + 0.5) * config.speedMulti,
      size: Math.random() * 5 + 5,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 2,
      color: config.particleColors[Math.floor(Math.random() * config.particleColors.length)],
      type: config.type
    };
  };

  const drawPetal = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Simple oval petal shape
    ctx.ellipse(0, 0, p.size, p.size / 2, 0, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  };

  const drawLeaf = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate((p.rotation * Math.PI) / 180);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    // Leaf shape: 2 quadratic curves
    ctx.moveTo(0, -p.size);
    ctx.quadraticCurveTo(p.size, 0, 0, p.size);
    ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
    ctx.fill();
    ctx.restore();
  };

  const drawCircle = (ctx: CanvasRenderingContext2D, p: Particle) => {
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particlesRef.current.forEach((p, index) => {
      // Move
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      // Oscillate x slightly for wind effect
      p.x += Math.sin(p.y * 0.02) * 0.2;

      // Draw
      if (p.type === 'petal') drawPetal(ctx, p);
      else if (p.type === 'leaf') drawLeaf(ctx, p);
      else drawCircle(ctx, p);

      // Reset if out of bounds
      if (p.y > canvas.height + 20) {
        particlesRef.current[index] = createParticle(canvas.width, canvas.height);
      }
    });

    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      if(canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
      particlesRef.current = initParticles(canvas.width, canvas.height);
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Start Animation
    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(requestRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [season]); // Re-init on season change

  return (
    <div className={`absolute inset-0 -z-10 transition-colors duration-1000 ${config.bg}`}>
        <canvas ref={canvasRef} className="block w-full h-full opacity-80" />
    </div>
  );
};