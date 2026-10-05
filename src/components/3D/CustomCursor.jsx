import React, { useEffect, useState } from 'react';

export const CustomCursor = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isPointer, setIsPointer] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPos({ x: e.clientX, y: e.clientY });

      const target = e.target;
      const isInteractive = target && target.closest('a, button, [style*="cursor: pointer"], .clickable');
      setIsPointer(!!isInteractive);
    };

    const handlePointerLockChange = () => {
      setIsLocked(!!document.pointerLockElement);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
  if (isLocked || isMobile) return null;
  return (
    <div
      style={{
        position: 'fixed',
        top: `${pos.y}px`,
        left: `${pos.x}px`,
        width: isPointer ? '42px' : '30px',
        height: isPointer ? '42px' : '30px',
        border: `2px solid ${isPointer ? '#ff0055' : '#00f0ff'}`,
        borderRadius: '10%',
        boxShadow: isPointer 
          ? '0 0 12px #ff0055, inset 0 0 8px #ff0055' 
          : '0 0 12px #00f0ff, inset 0 0 8px #00f0ff',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 9999999,
        transition: 'width 0.15s ease-out, height 0.15s ease-out, border-color 0.15s ease-out, box-shadow 0.15s ease-out',
      }}
    />
  );
};