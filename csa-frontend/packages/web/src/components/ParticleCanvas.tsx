import { useEffect, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import type { ThemeName } from '@csa/shared';

interface Particle {
  // Common
  x: number; y: number;
  // Sakura
  size?: number; sX?: number; sY?: number; rot?: number; rS?: number;
  op?: number; clr?: string; wb?: number;
  // Ocean
  speed?: number; char?: string; fs?: number;
  // Forest
  sw?: number;
  // Sunset
  h?: number; ph?: number;
}

export default function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();
  const particlesRef = useRef<Particle[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);
  const themeRef = useRef<ThemeName>(theme);

  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const init = (t: ThemeName) => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      const p: Particle[] = [];

      if (t === 'sakura') {
        for (let i = 0; i < 40; i++) p.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          size: Math.random() * 8 + 4,
          sX: (Math.random() - 0.5) * 0.6,
          sY: Math.random() * 1.2 + 0.4,
          rot: Math.random() * Math.PI * 2,
          rS: (Math.random() - 0.5) * 0.02,
          op: Math.random() * 0.4 + 0.2,
          clr: Math.random() > 0.5 ? '#FAD1DD' : '#F08CAE',
          wb: Math.random() * Math.PI * 2,
        });
      } else if (t === 'ocean') {
        const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノ';
        const cols = Math.floor(canvas.width / 18);
        for (let i = 0; i < cols; i++) p.push({
          x: i * 18 + Math.random() * 10,
          y: Math.random() * canvas.height,
          speed: Math.random() * 2 + 1,
          char: chars[Math.floor(Math.random() * chars.length)],
          op: Math.random() * 0.15 + 0.05,
          fs: Math.random() * 6 + 10,
        });
      } else if (t === 'forest') {
        for (let i = 0; i < 30; i++) p.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          size: Math.random() * 10 + 6,
          sX: (Math.random() - 0.5) * 0.5, sY: Math.random() * 0.6 + 0.3,
          rot: Math.random() * Math.PI * 2, rS: (Math.random() - 0.5) * 0.03,
          op: Math.random() * 0.3 + 0.15,
          clr: Math.random() > 0.5 ? '#8CB88A' : '#A8D5A2',
          sw: Math.random() * Math.PI * 2,
        });
      } else if (t === 'sunset') {
        for (let i = 0; i < 20; i++) p.push({
          x: Math.random() * canvas.width, y: Math.random() * canvas.height,
          size: Math.random() * 30 + 15,
          sY: -(Math.random() * 0.3 + 0.1),
          op: Math.random() * 0.12 + 0.04,
          h: Math.random() * 20 + 20,
          ph: Math.random() * Math.PI * 2,
        });
      }
      particlesRef.current = p;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current++;
      const t = themeRef.current;
      const p = particlesRef.current;

      if (t === 'sakura') {
        p.forEach(pp => {
          pp.y! += pp.sY!; pp.x! += pp.sX! + Math.sin(pp.wb!) * 0.3;
          pp.wb! += 0.02; pp.rot! += pp.rS!;
          if (pp.y! > canvas.height + 20) { pp.y = -20; pp.x = Math.random() * canvas.width; }
          ctx.save(); ctx.translate(pp.x!, pp.y!); ctx.rotate(pp.rot!);
          ctx.globalAlpha = pp.op!; ctx.fillStyle = pp.clr!;
          ctx.beginPath(); ctx.ellipse(0, 0, pp.size!, pp.size! * 0.55, 0, 0, Math.PI * 2); ctx.fill();
          ctx.restore();
        });
      } else if (t === 'ocean') {
        p.forEach(pp => {
          pp.y! += pp.speed!;
          if (pp.y! > canvas.height + 20) { pp.y = -20; const c = '01'; pp.char = c[Math.floor(Math.random() * c.length)]; }
          ctx.fillStyle = '#4FC3F7'; ctx.globalAlpha = pp.op!;
          ctx.font = `${pp.fs}px monospace`; ctx.fillText(pp.char!, pp.x!, pp.y!);
        });
        ctx.globalAlpha = 1;
      } else if (t === 'forest') {
        p.forEach(pp => {
          pp.y! += pp.sY!; pp.x! += pp.sX! + Math.sin(pp.sw!) * 0.4;
          pp.sw! += 0.015; pp.rot! += pp.rS!;
          if (pp.y! > canvas.height + 30) { pp.y = -30; pp.x = Math.random() * canvas.width; }
          ctx.save(); ctx.translate(pp.x!, pp.y!); ctx.rotate(pp.rot!);
          ctx.globalAlpha = pp.op!; ctx.fillStyle = pp.clr!;
          ctx.beginPath(); ctx.ellipse(0, 0, pp.size!, pp.size! * 0.35, 0, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = pp.clr!; ctx.beginPath();
          ctx.moveTo(0, -pp.size! * 0.35); ctx.lineTo(pp.size! * 0.8, 0); ctx.lineTo(0, pp.size! * 0.35);
          ctx.closePath(); ctx.fill();
          ctx.restore();
        });
      } else if (t === 'sunset') {
        p.forEach(pp => {
          pp.y! += pp.sY!;
          if (pp.y! < -(pp.size! * 2)) { pp.y = canvas.height + pp.size!; pp.x = Math.random() * canvas.width; }
          const pulse = Math.sin(timeRef.current * 0.001 + pp.ph!) * 0.5 + 0.5;
          const a = pp.op! * (0.7 + pulse * 0.3);
          const g = ctx.createRadialGradient(pp.x!, pp.y!, 0, pp.x!, pp.y!, pp.size!);
          g.addColorStop(0, `hsla(${pp.h},100%,65%,${a * 2})`);
          g.addColorStop(0.5, `hsla(${pp.h},100%,55%,${a})`);
          g.addColorStop(1, 'transparent');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(pp.x!, pp.y!, pp.size!, 0, Math.PI * 2); ctx.fill();
        });
      }
      animRef.current = requestAnimationFrame(animate);
    };

    // 页面不可见时暂停动画，节省 GPU
    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animRef.current);
      } else {
        animRef.current = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    init(theme);
    animate();

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [theme]);

  return <canvas ref={canvasRef} id="particle-canvas" />;
}
