import React from 'react';
import { LucideIcon } from 'lucide-react';

interface AnimatedIconProps {
  icon: LucideIcon;
  className?: string;
  animation?: 'bounce' | 'pulse' | 'spin' | 'float' | 'glow' | 'bounce-3d' | 'pulse-3d' | 'spin-3d' | 'ic-animate-float' | 'ic-animate-glow' | 'ic-animate-bounce-3d' | 'ic-animate-pulse-3d' | 'ic-animate-spin-3d';
  size?: number;
  style?: React.CSSProperties;
}

export default function AnimatedIcon({ 
  icon: Icon, 
  className = '', 
  animation = 'ic-animate-float',
  size = 24,
  style
}: AnimatedIconProps) {
  const animationClasses = {
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    spin: 'animate-spin',
    float: 'animate-float',
    glow: 'animate-glow',
    'bounce-3d': 'animate-bounce-3d',
    'pulse-3d': 'animate-pulse-3d',
    'spin-3d': 'animate-spin-3d',
    'ic-animate-float': 'ic-animate-float',
    'ic-animate-glow': 'ic-animate-glow',
    'ic-animate-bounce-3d': 'ic-animate-bounce-3d',
    'ic-animate-pulse-3d': 'ic-animate-pulse-3d',
    'ic-animate-spin-3d': 'ic-animate-spin-3d'
  };

  return (
    <Icon 
      size={size} 
      className={`${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}
