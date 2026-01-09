import React from 'react';

export default function OwlIcon({ className = "w-12 h-12" }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      className={className}
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Owl Body */}
      <path 
        d="M50 85 C30 85 20 70 20 55 C20 35 30 20 50 20 C70 20 80 35 80 55 C80 70 70 85 50 85Z" 
        fill="#3D3935"
      />
      
      {/* Left Eye Circle */}
      <circle cx="38" cy="48" r="12" fill="#e8e4d8" />
      <circle cx="38" cy="48" r="7" fill="#3D3935" />
      <circle cx="36" cy="46" r="3" fill="#e8e4d8" />
      
      {/* Right Eye Circle */}
      <circle cx="62" cy="48" r="12" fill="#e8e4d8" />
      <circle cx="62" cy="48" r="7" fill="#3D3935" />
      <circle cx="60" cy="46" r="3" fill="#e8e4d8" />
      
      {/* Beak */}
      <path 
        d="M50 55 L45 65 L55 65 Z" 
        fill="#c4a576"
      />
      
      {/* Left Ear Tuft */}
      <path 
        d="M32 25 L28 15 L35 22 Z" 
        fill="#3D3935"
      />
      
      {/* Right Ear Tuft */}
      <path 
        d="M68 25 L72 15 L65 22 Z" 
        fill="#3D3935"
      />
      
      {/* Wing Detail Left */}
      <path 
        d="M25 60 C25 60 22 50 25 45" 
        stroke="#2a2724" 
        strokeWidth="2" 
        fill="none"
      />
      
      {/* Wing Detail Right */}
      <path 
        d="M75 60 C75 60 78 50 75 45" 
        stroke="#2a2724" 
        strokeWidth="2" 
        fill="none"
      />
    </svg>
  );
}