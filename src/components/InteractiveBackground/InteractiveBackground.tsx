import { useEffect, useRef } from "react";
import "./InteractiveBackground.css";

type Particle = {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  phase: number;
  speed: number;
  radius: number;
};

function createParticles(width: number, height: number): Particle[] {
  const count = Math.min(
    64,
    Math.max(28, Math.round((width * height) / 23000))
  );

  return Array.from({ length: count }, () => {
    const x = Math.random() * width;
    const y = Math.random() * height;

    return {
      x,
      y,
      baseX: x,
      baseY: y,
      phase: Math.random() * Math.PI * 2,
      speed: 0.6 + Math.random() * 0.8,
      radius: 0.8 + Math.random() * 1.7,
    };
  });
}

function InteractiveBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!container || !canvas || !context) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    const simplifiedEffectQuery = window.matchMedia(
      "(max-width: 700px), (pointer: coarse)"
    );

    let stopAnimation: (() => void) | undefined;

    const startAnimation = (): (() => void) => {
      let width = 0;
      let height = 0;
      let pixelRatio = 1;
      let particles: Particle[] = [];
      let pointerX = 0;
      let pointerY = 0;
      let targetX = 0;
      let targetY = 0;
      let pointerOpacity = 0;
      let hasPointer = false;
      let lastFrame = 0;
      let animationFrame = 0;

      const resizeCanvas = () => {
        const bounds = container.getBoundingClientRect();
        width = Math.max(1, bounds.width);
        height = Math.max(1, bounds.height);
        pixelRatio = Math.min(window.devicePixelRatio || 1, 1.6);

        canvas.width = Math.round(width * pixelRatio);
        canvas.height = Math.round(height * pixelRatio);
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        particles = createParticles(width, height);
        pointerX = width / 2;
        pointerY = height / 2;
        targetX = pointerX;
        targetY = pointerY;
      };

      const updatePointer = (event: PointerEvent) => {
        if (event.pointerType !== "mouse") return;

        const bounds = container.getBoundingClientRect();
        const isInside =
          event.clientX >= bounds.left &&
          event.clientX <= bounds.right &&
          event.clientY >= bounds.top &&
          event.clientY <= bounds.bottom;

        hasPointer = isInside;

        if (isInside) {
          targetX = event.clientX - bounds.left;
          targetY = event.clientY - bounds.top;
        }
      };

      const clearPointer = () => {
        hasPointer = false;
      };

      const draw = (timestamp: number) => {
        const frameScale = lastFrame
          ? Math.min((timestamp - lastFrame) / 16.67, 2.4)
          : 1;
        const easing = 1 - Math.pow(0.91, frameScale);
        lastFrame = timestamp;

        pointerOpacity +=
          ((hasPointer ? 1 : 0) - pointerOpacity) * easing;
        pointerX += (targetX - pointerX) * easing;
        pointerY += (targetY - pointerY) * easing;

        context.clearRect(0, 0, width, height);

        if (pointerOpacity > 0.005) {
          const glowRadius = 250;
          const glow = context.createRadialGradient(
            pointerX,
            pointerY,
            0,
            pointerX,
            pointerY,
            glowRadius
          );
          glow.addColorStop(
            0,
            `rgba(220, 38, 38, ${0.14 * pointerOpacity})`
          );
          glow.addColorStop(
            0.45,
            `rgba(185, 28, 28, ${0.055 * pointerOpacity})`
          );
          glow.addColorStop(1, "rgba(127, 29, 29, 0)");
          context.fillStyle = glow;
          context.fillRect(0, 0, width, height);
        }

        const time = timestamp * 0.00045;
        const repulsionRadiusSquared = 210 * 210;

        for (const particle of particles) {
          const driftX = Math.cos(time * particle.speed + particle.phase) * 5;
          const driftY = Math.sin(time * particle.speed + particle.phase) * 5;
          let nextX = particle.baseX + driftX;
          let nextY = particle.baseY + driftY;

          if (pointerOpacity > 0.005) {
            const dx = particle.x - pointerX;
            const dy = particle.y - pointerY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < repulsionRadiusSquared) {
              const distance = Math.sqrt(distanceSquared) || 1;
              const influence = Math.exp(
                -distanceSquared / (2 * repulsionRadiusSquared)
              );
              const displacement = influence * 38 * pointerOpacity;
              nextX += (dx / distance) * displacement;
              nextY += (dy / distance) * displacement;
            }
          }

          particle.x += (nextX - particle.x) * easing;
          particle.y += (nextY - particle.y) * easing;

          const pulse =
            0.38 + (Math.sin(time * particle.speed + particle.phase) + 1) * 0.2;
          context.beginPath();
          context.arc(
            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2
          );
          context.fillStyle = `rgba(248, 55, 55, ${pulse})`;
          context.fill();
        }

        for (let first = 0; first < particles.length; first += 1) {
          for (
            let second = first + 1;
            second < particles.length;
            second += 1
          ) {
            const particle = particles[first];
            const neighbor = particles[second];
            const dx = particle.x - neighbor.x;
            const dy = particle.y - neighbor.y;
            const distanceSquared = dx * dx + dy * dy;
            const connectionDistance = 112;

            if (distanceSquared < connectionDistance * connectionDistance) {
              const opacity =
                (1 - Math.sqrt(distanceSquared) / connectionDistance) * 0.11;
              context.beginPath();
              context.moveTo(particle.x, particle.y);
              context.lineTo(neighbor.x, neighbor.y);
              context.strokeStyle = `rgba(220, 38, 38, ${opacity})`;
              context.lineWidth = 0.7;
              context.stroke();
            }
          }
        }

        animationFrame = window.requestAnimationFrame(draw);
      };

      resizeCanvas();
      window.addEventListener("resize", resizeCanvas, { passive: true });
      window.addEventListener("pointermove", updatePointer, {
        passive: true,
      });
      window.addEventListener("pointerleave", clearPointer);
      animationFrame = window.requestAnimationFrame(draw);

      return () => {
        window.cancelAnimationFrame(animationFrame);
        window.removeEventListener("resize", resizeCanvas);
        window.removeEventListener("pointermove", updatePointer);
        window.removeEventListener("pointerleave", clearPointer);
      };
    };

    const updateEffect = () => {
      stopAnimation?.();
      stopAnimation = undefined;

      if (reducedMotionQuery.matches || simplifiedEffectQuery.matches) {
        return;
      }

      stopAnimation = startAnimation();
    };

    reducedMotionQuery.addEventListener("change", updateEffect);
    simplifiedEffectQuery.addEventListener("change", updateEffect);
    updateEffect();

    return () => {
      stopAnimation?.();
      reducedMotionQuery.removeEventListener("change", updateEffect);
      simplifiedEffectQuery.removeEventListener("change", updateEffect);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="interactive-background"
      aria-hidden="true"
    >
      <canvas ref={canvasRef} />
    </div>
  );
}

export default InteractiveBackground;
