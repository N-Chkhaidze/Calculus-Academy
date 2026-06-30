import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
}

export function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ['#f43f5e', '#3b82f6', '#10b981', '#eab308', '#a855f7', '#ec4899', '#06b6d4'];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Create initial explosion particles
    for (let i = 0; i < 150; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 50,
        y: canvas.height / 2 + (Math.random() - 0.5) * 50,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedX: (Math.random() - 0.5) * 15,
        speedY: (Math.random() - 0.8) * 18 - 5, // shoot upwards
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let alive = false;
      particles.forEach((p) => {
        // Apply gravity and drag
        p.speedY += 0.25; // gravity
        p.speedX *= 0.98; // minor friction
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        // Draw particle
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();

        // Keep updating as long as particles are on screen or falling
        if (p.y < canvas.height + 20) {
          alive = true;
        }
      });

      if (alive) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animate();

    // Automatically clean up after 5 seconds to reduce memory / cpu load
    const timeout = setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      if (canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }, 5500);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="confetti-canvas"
      className="fixed inset-0 pointer-events-none z-50 w-full h-full"
    />
  );
}
