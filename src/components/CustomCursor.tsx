import { useEffect, useRef, useState } from 'react';

export const CustomCursor = () => {
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);

  const mousePosition = useRef({ x: 0, y: 0 });
  const requestRef = useRef<number>();

  useEffect(() => {
    let isPointerState = false;

    const updateCursor = (e: MouseEvent) => {
      mousePosition.current = { x: e.clientX, y: e.clientY };

      // Check if hovering over clickable element
      const target = e.target as HTMLElement;
      const isClickable =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('cursor-pointer') ||
        target.closest('[class*="cursor-pointer"]') ||
        target.closest('div[class*="group"]') ||
        target.closest('[data-clickable]') ||
        target.style.cursor === 'pointer' ||
        window.getComputedStyle(target).cursor === 'pointer';

      const newPointerState = !!isClickable;
      if (newPointerState !== isPointerState) {
        isPointerState = newPointerState;
        setIsPointer(newPointerState);
      }
    };

    const animate = () => {
      const { x, y } = mousePosition.current;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%) scale(${
          isClicking ? 0.8 : 1
        })`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    window.addEventListener('mousemove', updateCursor, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', updateCursor);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);

      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isClicking]);

  return (
    <>
      {/* Main cursor dot */}
      <div
        ref={dotRef}
        className="custom-cursor-dot"
        style={{
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
      />

      {/* Cursor ring */}
      <div
        ref={ringRef}
        className={`custom-cursor-ring ${isPointer ? 'pointer' : ''}`}
        style={{
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
      />

      {/* Trailing effect */}
      <div
        ref={trailRef}
        className="custom-cursor-trail"
        style={{
          left: 0,
          top: 0,
          willChange: 'transform',
        }}
      />
    </>
  );
};
