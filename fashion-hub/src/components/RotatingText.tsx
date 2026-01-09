import React, { useEffect, useRef } from 'react';
import OwlIcon from './OwlIcon';

export default function RotatingText({ onClick }) {
  const textRef = useRef(null);
  
  useEffect(() => {
    const text = "REQUEST • CONNECT • COLLABORATE • ";
    const element = textRef.current;
    
    if (element) {
      element.innerHTML = '';
      
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement('span');
        span.textContent = text[i];
        span.style.position = 'absolute';
        span.style.left = '50%';
        span.style.fontSize = '10px';
        span.style.letterSpacing = '2px';
        span.style.fontWeight = '400';
        span.style.color = '#6B7280';
        span.style.textTransform = 'uppercase';
        span.style.transformOrigin = '0 70px';
        span.style.transform = `rotate(${i * (360 / text.length)}deg)`;
        element.appendChild(span);
      }
    }
  }, []);
  
  return (
    <div 
      onClick={onClick}
      className="relative w-[140px] h-[140px] cursor-pointer hover:opacity-70 transition-opacity" 
    >
      <div 
        ref={textRef} 
        className="absolute top-0 left-0 w-full h-full animate-spin"
        style={{ animationDuration: '15s' }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <OwlIcon className="w-14 h-14" />
      </div>
    </div>
  );
}