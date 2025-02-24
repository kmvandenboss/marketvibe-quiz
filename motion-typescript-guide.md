# Motion Component TypeScript Troubleshooting Guide

## The Problem

When using Framer Motion components with TypeScript, developers commonly encounter this error:

```typescript
Type '{ className: string; ... }' is not assignable to type 'IntrinsicAttributes & HTMLAttributesWithoutMotionProps<unknown, unknown> & MotionProps & RefAttributes<unknown>'.
  Property 'className' does not exist on type 'IntrinsicAttributes & HTMLAttributesWithoutMotionProps<unknown, unknown> & MotionProps & RefAttributes<unknown>'.
```

This error occurs because:
1. Motion components need proper type definitions that combine both HTML element props and Framer Motion props
2. The default type inference doesn't handle the combination of these prop types correctly
3. The `as React.FC<>` cast is needed but must be done with the correct prop types

## The Solution Pattern

Always follow this exact pattern when creating motion components:

```typescript
// 1. Import the necessary types
import { motion, MotionProps } from 'framer-motion';

// 2. Define the combined prop type
type MotionElementProps = MotionProps & React.ComponentProps<'element_type'>;
// For example:
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;

// 3. Create the motion component with proper typing
const MotionElement = motion.element as React.FC<MotionElementProps>;
// For example:
const MotionDiv = motion.div as React.FC<MotionDivProps>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;
```

## Examples

### For a div:
```typescript
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
const MotionDiv = motion.div as React.FC<MotionDivProps>;

// Usage
<MotionDiv
  className="my-class"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
>
  Content
</MotionDiv>
```

### For a button:
```typescript
type MotionButtonProps = MotionProps & React.ComponentProps<'button'>;
const MotionButton = motion.button as React.FC<MotionButtonProps>;

// Usage
<MotionButton
  className="my-button"
  whileTap={{ scale: 0.98 }}
  onClick={() => {}}
>
  Click me
</MotionButton>
```

## Common Mistakes to Avoid

1. **Incorrect Type Composition**
```typescript
// ❌ Wrong
const MotionDiv = motion.div as MotionProps;

// ✅ Right
const MotionDiv = motion.div as React.FC<MotionDivProps>;
```

2. **Missing Component Props**
```typescript
// ❌ Wrong
type MotionDivProps = MotionProps;

// ✅ Right
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
```

3. **Using HTMLAttributes Instead of ComponentProps**
```typescript
// ❌ Wrong
type MotionDivProps = MotionProps & React.HTMLAttributes<HTMLDivElement>;

// ✅ Right
type MotionDivProps = MotionProps & React.ComponentProps<'div'>;
```

## Best Practices

1. Define types at the top of your component file
2. Keep the pattern consistent across all motion components
3. Use the most specific element type possible (e.g., 'button' for buttons)
4. Include proper JSDoc comments for better IDE support
5. Export types if they'll be used across multiple files

## Integration with Custom Components

When creating motion variants of custom components:

```typescript
interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

// Create motion version
type MotionCustomButtonProps = MotionProps & CustomButtonProps;
const MotionCustomButton = motion.button as React.FC<MotionCustomButtonProps>;
```

## Type Checking Helper

Use this TypeScript helper function to verify motion component types:

```typescript
function assertMotionComponent<T extends MotionProps & React.ComponentProps<any>>(
  component: React.FC<T>
): void {
  // Type checking only, function does nothing at runtime
}

// Usage
assertMotionComponent(MotionDiv); // Will show type errors if incorrectly typed
```

Remember: Always use this exact pattern when creating motion components to avoid TypeScript errors and ensure proper type checking.