import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Box } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingShapeProps {
  position: [number, number, number];
  color: string;
  speed: number;
  shape: 'sphere' | 'box';
}

function FloatingShape({ position, color, speed, shape }: FloatingShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * 0.01;
      meshRef.current.rotation.y += speed * 0.01;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.2;
    }
  });

  const ShapeComponent = shape === 'sphere' ? Sphere : Box;

  return (
    <ShapeComponent
      ref={meshRef}
      position={position}
      args={shape === 'sphere' ? [0.3] : [0.4, 0.4, 0.4]}
    >
      <meshStandardMaterial color={color} transparent opacity={0.6} />
    </ShapeComponent>
  );
}

interface ThreeBackgroundProps {
  theme?: string;
}

export default function ThreeBackground({ theme = 'tokyo' }: ThreeBackgroundProps) {
  const shapes = useMemo(() => {
    const colors = {
      tokyo: ['#ff6b9d', '#c44569', '#f8b500', '#feca57'],
      'royal-blue': ['#3742fa', '#2f3542', '#70a1ff', '#5352ed'],
      'cyber-bunker': ['#00ff88', '#00d4aa', '#ff3838', '#ff9ff3']
    };
    
    const themeColors = colors[theme as keyof typeof colors] || colors.tokyo;
    
    return Array.from({ length: 8 }, (_, i) => ({
      position: [
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 4
      ] as [number, number, number],
      color: themeColors[i % themeColors.length],
      speed: 0.5 + Math.random() * 1.5,
      shape: Math.random() > 0.5 ? 'sphere' : 'box' as 'sphere' | 'box'
    }));
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 opacity-30">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        {shapes.map((shape, index) => (
          <FloatingShape key={index} {...shape} />
        ))}
      </Canvas>
    </div>
  );
}
