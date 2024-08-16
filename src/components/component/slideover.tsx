import React, { useState, useRef } from 'react';

interface SlideoverProps {
    originalContent: React.ReactNode;
    coverContent: React.ReactNode;
    delay?: number; // Delay in milliseconds before sliding back to 0%
    className?: string;
    onConfirm?: () => void
}

const Slideover: React.FC<SlideoverProps> = ({ originalContent, coverContent, delay = 500, className, onConfirm }) => {
  const [dragPosition, setDragPosition] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const startXRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startXRef.current = e.type === 'mousedown' 
      ? (e as React.MouseEvent).clientX 
      : (e as React.TouchEvent).touches[0].clientX;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout
    }
  };

  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault();
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const containerWidth = container.offsetWidth;
      const clientX = e.type === 'mousemove' 
        ? (e as React.MouseEvent).clientX 
        : (e as React.TouchEvent).touches[0].clientX;
      const dragDistance = clientX - containerRect.left;
      const newPosition = Math.min(Math.max(dragDistance, 0), containerWidth);

      // Calculate 5% of the container's width
      const threshold = containerWidth * 0.05;

      // Snap to the start or end if within the threshold
      if (newPosition <= threshold) {
        setDragPosition(0);
      } else if (newPosition >= containerWidth - threshold) {
        setDragPosition(containerWidth);
        // Set a timeout to slide back to 0% after the delay
        timeoutRef.current = setTimeout(() => {
          setDragPosition(0);
          onConfirm?.call({})
        }, delay);
      } else {
        setDragPosition(newPosition);
      }
    }
  };

  const handleEnd = () => {
    if (containerRef.current && dragPosition !== containerRef.current.offsetWidth) {
      setDragPosition(0); // Ease back to 0% if not fully covered
    }
    setIsDragging(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear timeout if dragging ends early
    }
  };

  return (
    <div
      ref={containerRef}
      className={"overflow-hidden " + className}
      onMouseMove={handleMove}
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchMove={handleMove}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
    >
      <div className="relative w-full h-full cursor-ew-resize">
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center z-10">
          {originalContent}
        </div>
        <div className="absolute top-0 left-0 h-full flex justify-center items-center z-20 transition-width duration-500 ease-in-out" style={{ width: dragPosition }}>
          {coverContent}
        </div>
      </div>
    </div>
  );
};

export default Slideover;
