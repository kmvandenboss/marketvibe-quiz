# Case Conventions in MarketVibe Quiz App

This document outlines the case conventions used across different layers of the application and provides guidelines for maintaining consistency.

## Database Layer (schema.ts)

The database layer strictly uses `snake_case` for all column names and table names.

### Examples:
- Table names: `question_options`, `analytics_events`
- Column names:
  - `heading_text`
  - `email_capture_message`
  - `created_at`
  - `question_text`

## Database Queries Layer (queries.ts)

The queries layer serves as a transformation layer between database and application code:

- Database references maintain `snake_case`
- Function parameters and variables use `camelCase`
- Data transformations occur when returning results:
  ```typescript
  // Example transformation in getInvestmentOptions:
  return {
    id: option.id,
    logoUrl: option.logo_url,    // transformed
    companyName: option.company_name,  // transformed
    created_at: option.created_at  // maintained snake_case
  }
  ```

## TypeScript Types Layer (types/quiz.ts)

The types layer shows some inconsistency in conventions:

### Predominant Use of camelCase:
```typescript
interface QuizState {
  currentQuestionIndex: number;
  isComplete: boolean;
}

interface InvestmentOption {
  logoUrl: string;
  companyName: string;
}
```

### Some Types Maintain snake_case from DB:
```typescript
interface Question {
  id: string;
  text: string;
  created_at?: string;  // maintains snake_case
  updated_at?: string;  // maintains snake_case
}
```

## API Layer (route.ts files)

The API layer handles the final transformation to ensure consistent camelCase in API responses:

```typescript
// Example from investment-options/route.ts
const transformedOptions = dbOptions.map(option => ({
  id: option.id,
  logoUrl: option.logo_url,
  companyName: option.company_name,
  // ... other transformations
}));
```

## Known Issues

1. Inconsistent API Transformations:
   - `/api/investment-options/route.ts` properly transforms snake_case to camelCase
   - `/api/questions/route.ts` doesn't transform the data at all, passing through snake_case
   - Some APIs partially transform data, leading to mixed conventions

2. Component Property Inconsistencies:
   - `QuizContainer.tsx` accepts and uses snake_case props (e.g., `heading_text`)
   - Email capture form uses mixed conventions (`emailCaptureMessage` vs `heading_text`)
   - Inconsistent prop naming creates confusion in component interfaces

3. Type Definition Mismatches:
   - `Question` interface in types/quiz.ts maintains `created_at` and `updated_at` in snake_case
   - Some interfaces fully transform to camelCase while others don't
   - No consistent pattern for handling timestamp fields

4. Query Layer Issues:
   - Drizzle ORM maintains snake_case in database operations
   - Inconsistent transformation patterns across different queries
   - Some queries return mixed case properties
   - No standardized transformation utility being used

## Guidelines for Future Development

1. Database Layer:
   - Always use `snake_case` for table and column names
   - Follow PostgreSQL naming conventions

2. Query Layer:
   - Transform all database fields to `camelCase` when returning to application code
   - Exception: If maintaining certain fields in `snake_case` is required for external integrations

3. TypeScript Types:
   - Use `camelCase` for all interface and type properties
   - Update existing interfaces to maintain consistency
   - Document any necessary exceptions

4. API Layer:
   - Always return `camelCase` properties in responses
   - Validate incoming data assumes `camelCase`

## Recommended Implementation

Create a utility function for consistent case transformation:

```typescript
// Proposed utility in src/utils/case-transform.ts
export function transformDatabaseResponse<T>(data: Record<string, any>): T {
  // Transform snake_case to camelCase
  // Handle nested objects and arrays
  // Return typed result
}
```

## Migration Plan

1. Immediate Fixes Needed:
   - Update `/api/questions/route.ts` to transform responses to camelCase
   - Fix `QuizContainer.tsx` to use camelCase props consistently
   - Create and implement a standardized transformation utility

2. Type System Updates:
   - Update `Question` interface to use camelCase for all properties
   - Create consistent patterns for timestamp field naming
   - Add JSDoc comments to document casing expectations

3. Query Layer Standardization:
   - Implement transformation utility in `src/utils/case-transform.ts`
   - Update all query functions to use this utility
   - Add tests to verify case transformations

4. API Layer Consistency:
   - Audit all API routes for case consistency
   - Implement standardized response transformation
   - Add middleware for automatic case conversion

5. Frontend Alignment:
   - Update all component props to use camelCase
   - Fix prop drilling to maintain consistent casing
   - Update form handling to match API expectations

6. Documentation and Testing:
   - Add case convention tests to CI pipeline
   - Update component documentation with prop casing requirements
   - Create migration guide for existing code

## References

- [Database Schema](../src/db/schema.ts)
- [TypeScript Types](../src/types/quiz.ts)
- [Database Queries](../src/db/queries.ts)
