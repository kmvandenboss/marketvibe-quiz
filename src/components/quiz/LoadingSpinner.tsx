import React from 'react';
import { motion, MotionProps } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: number;
  color?: string;
  className?: string;
}

type MotionSVGProps = MotionProps & React.ComponentProps<'svg'>;
const MotionSVG = motion.svg as React.FC<MotionSVGProps>;

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 40,
  color = '#2563EB',
  className = ''
}) => {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <MotionSVG
        width={size}
        height={size}
        viewBox="0 0 50 50"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray="80, 125"
        />
      </MotionSVG>
    </div>
  );
};

export default LoadingSpinner;