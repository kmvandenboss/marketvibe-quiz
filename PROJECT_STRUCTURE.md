# MarketVibe Quiz App Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

- `.env` - Environment variables
- `.gitignore` - Git ignore configuration
- `drizzle.config.ts` - Drizzle ORM configuration
- `eslint.config.mjs` - ESLint configuration
- `global.d.ts` - Global TypeScript declarations
- `next.config.js` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `postcss.config.js/mjs` - PostCSS configuration
- `README.md` - Project documentation
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Source Code (`/src`)

### App Directory (`/src/app`)
Next.js 13+ app directory structure:
- `favicon.ico` - Website favicon
- `layout.tsx` - Root layout component
- `page.tsx` - Home page component
- `globals.css` - Global styles
- `/quiz` - Quiz page route
  - `page.tsx` - Quiz page component
- `/high-yield-quiz` - High Yield Investment Quiz route
  - `page.tsx` - High Yield Quiz page component
- `/dashboard` - Admin Dashboard route
  - `page.tsx` - Dashboard page component

### API Routes (`/src/app/api`)
- `/investment-options` - Investment options API endpoint
  - `route.ts` - API route handler
- `/questions` - Quiz questions API endpoint
  - `route.ts` - API route handler
- `/submit` - Quiz submission endpoint
  - `route.ts` - API route handler
- `/track-click` - Click tracking endpoint
  - `route.ts` - API route handler

### Components (`/src/components`)
- `/dashboard` - Dashboard components
  - `DashboardMetrics.tsx` - Dashboard metrics display
  - `LeadsTable.tsx` - Table for displaying leads
- `/quiz` - Quiz-specific components
  - `AnswerOption.tsx` - Individual answer option component
  - `EmailCaptureForm.tsx` - Email collection form
  - `LoadingSpinner.tsx` - Loading indicator
  - `ProgressIndicator.tsx` - Quiz progress bar
  - `QuestionCard.tsx` - Question display component
  - `QuizContainer.tsx` - Main quiz container
  - `ResultsCard.tsx` - Quiz results display
- `/ui` - Shared UI components
  - `button.tsx` - Reusable button component
  - `card.tsx` - Card component
  - `table.tsx` - Table component

### Database (`/src/db`)
- `config.ts` - Database configuration
- `index.ts` - Database connection setup
- `migrate.ts` - Database migration utility
- `queries.ts` - Database queries
- `schema.ts` - Database schema definitions
- `/migrations` - Database migration files
  - `0000_smiling_rhodey.sql` - Initial migration
  - `0001_add_accredited_column.sql` - Add accredited investor column
  - `0001_superb_karma.sql` - Additional schema changes
  - `0002_add_is_accredited.sql` - Add is_accredited flag
  - `/meta` - Migration metadata
    - `_journal.json` - Migration history
    - `0000_snapshot.json` - Initial schema snapshot
    - `0001_snapshot.json` - Updated schema snapshot

### Library (`/src/lib`)
- `db.ts` - Database utility functions

### Types (`/src/types`)
- `quiz.ts` - Quiz-related TypeScript types
- `dashboard.ts` - Dashboard-related TypeScript types

### Utils (`/src/utils`)
- `quiz-utils.ts` - Quiz helper functions

## Public Assets (`/public`)
Static files served directly:
- `/images` - Image assets
  - `MarketVibe-logo.png` - Company logo
- `file.svg` - File icon
- `globe.svg` - Globe icon
- `next.svg` - Next.js logo
- `vercel.svg` - Vercel logo
- `window.svg` - Window icon

## Scripts (`/scripts`)
Custom scripts and utilities for project maintenance.
