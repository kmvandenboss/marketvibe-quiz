// src/components/ui/skeleton.tsx
import React from 'react';
import { motion, MotionProps } from 'framer-motion';
import { skeletonVariants } from '@/components/ui/animations';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rectangular' | 'circular' | 'question';
  width?: string | number;
  height?: string | number;
  repeat?: number;
}

interface MotionDivProps extends MotionProps {
  className?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
  custom?: number;
}

const MotionDiv = motion.div as React.FC<MotionDivProps>;

export function Skeleton({
  className = '',
  variant = 'text',
  width,
  height,
  repeat = 1
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 animate-pulse rounded';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-3/4';
      case 'rectangular':
        return 'h-full w-full';
      case 'circular':
        return 'rounded-full';
      case 'question':
        return '';
      default:
        return '';
    }
  };

  const getQuestionSkeleton = () => (
    <div className="space-y-4">
      <MotionDiv 
        className="h-8 w-3/4 bg-gray-200 rounded-md"
        variants={skeletonVariants}
        initial="initial"
        animate="animate"
      />
      {[1, 2, 3, 4].map((index) => (
        <MotionDiv
          key={index}
          className="h-14 w-full bg-gray-200 rounded-lg"
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          custom={index}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );

  if (variant === 'question') {
    return getQuestionSkeleton();
  }

  return (
    <div className="space-y-2">
      {[...Array(repeat)].map((_, index) => (
        <MotionDiv
          key={index}
          className={`${baseClasses} ${getVariantClasses()} ${className}`}
          style={{ width, height }}
          variants={skeletonVariants}
          initial="initial"
          animate="animate"
          custom={index}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.1
          }}
        />
      ))}
    </div>
  );
}