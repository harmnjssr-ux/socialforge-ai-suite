import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);
  const mouse = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });

  useEffect(() => {
    // Hide on touch devices
    if ("ontouchstart" in window) return;

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const interactive = target.closest("button, a, [role='button'], input, textarea, select, label, [data-interactive]");
      setHovering(!!interactive);
    };

    let raf: number;
    const animateRing = () => {
      ringPos.current.x += (mouse.current.x - ringPos.current.x) * 0.1;
      ringPos.current.y += (mouse.current.y - ringPos.current.y) * 0.1;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringPos.current.x}px, ${ringPos.current.y}px)`;
      }
      raf = requestAnimationFrame(animateRing);
    };
    animateRing();

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== "undefined" && "ontouchstart" in window) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: hovering ? 12 : 6,
          height: hovering ? 12 : 6,
          marginLeft: hovering ? -6 : -3,
          marginTop: hovering ? -6 : -3,
          background: "hsl(37 45% 93%)",
          borderRadius: "50%",
          zIndex: 99999,
          mixBlendMode: "screen",
          transition: "width 200ms, height 200ms, margin 200ms",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: hovering ? 48 : 34,
          height: hovering ? 48 : 34,
          marginLeft: hovering ? -24 : -17,
          marginTop: hovering ? -24 : -17,
          border: "1px solid hsl(37 45% 93% / 0.5)",
          borderRadius: "50%",
          zIndex: 99998,
          mixBlendMode: "screen",
          transition: "width 200ms, height 200ms, margin 200ms",
        }}
      />
    </>
  );
};

export default CustomCursor;
