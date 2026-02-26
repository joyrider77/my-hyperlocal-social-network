import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TileCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'elevated' | 'neon';
  onClick?: () => void;
  disabled?: boolean;
}

export default function TileCard({ 
  children, 
  className = '', 
  variant = 'default',
  onClick,
  disabled = false
}: TileCardProps) {
  const variantClasses = {
    default: 'tile-3d',
    glass: 'glass tile-3d border-white/20 shadow-modern hover:shadow-modern-lg',
    elevated: 'tile-3d-elevated',
    neon: 'tile-3d-neon hover:shadow-neon'
  };

  return (
    <Card 
      className={`${variantClasses[variant]} ${onClick && !disabled ? 'cursor-pointer' : ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick && !disabled ? onClick : undefined}
    >
      {children}
    </Card>
  );
}
