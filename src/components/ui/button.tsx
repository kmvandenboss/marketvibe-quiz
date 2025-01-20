import * as React from "react"
import { motion, MotionProps } from "framer-motion"

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'back';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", size = "md", isLoading, children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variants = {
      primary: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      back: "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4 py-2",
      lg: "h-12 px-8"
    }
    
    const variantStyles = variants[variant]
    const sizeStyles = sizes[size]

    return (
      <button
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
        ref={ref}
        {...props}
      >
        {variant === 'back' && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <path d="m15 18-6-6 6-6"/>
          </svg>
        )}
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

const MotionButtonRoot = motion.button as React.FC<MotionButtonProps>;

export const MotionButton: React.FC<MotionButtonProps & ButtonProps> = ({ 
  className = "", 
  variant = "primary", 
  size = "md", 
  children,
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    back: "bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-12 px-8"
  }
  
  const variantStyles = variants[variant]
  const sizeStyles = sizes[size]

  return (
    <MotionButtonRoot
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      {...props}
    >
      {variant === 'back' && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2"
        >
          <path d="m15 18-6-6 6-6"/>
        </svg>
      )}
      {children}
    </MotionButtonRoot>
  )
}

export default Button