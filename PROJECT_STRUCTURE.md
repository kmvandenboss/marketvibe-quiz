# MarketVibe Quiz App Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

- `.gitignore` - Git ignore configuration
- `drizzle.config.ts` - Drizzle ORM configuration
- `eslint.config.mjs` - ESLint configuration
- `global.d.ts` - Global TypeScript declarations
- `next.config.js` - Next.js configuration
- `postcss.config.js/mjs` - PostCSS configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Source Code (`/src`)

### App Directory (`/src/app`)
Next.js 13+ app directory structure:
- `layout.tsx` - Root layout component
- `page.tsx` - Home page component
- `globals.css` - Global styles
- `/quiz` - Quiz page route
  - `page.tsx` - Quiz page component

### API Routes (`/src/app/api`)
- `/investment-options` - Investment options API endpoint
- `/questions` - Quiz questions API endpoint
- `/submit` - Quiz submission endpoint
- `/track-click` - Click tracking endpoint

### Components (`/src/components`)
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

### Database (`/src/db`)
- `config.ts` - Database configuration
- `index.ts` - Database connection setup
- `migrate.ts` - Database migration utility
- `queries.ts` - Database queries
- `schema.ts` - Database schema definitions
- `/migrations` - Database migration files
  - `0000_noisy_wraith.sql` - Initial migration
  - `/meta` - Migration metadata

### Library (`/src/lib`)
- `db.ts` - Database utility functions

### Types (`/src/types`)
- `quiz.ts` - Quiz-related TypeScript types

### Utils (`/src/utils`)
- `quiz-utils.ts` - Quiz helper functions

## Public Assets (`/public`)
Static files served directly:
- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

## Scripts (`/scripts`)
Custom scripts and utilities for project maintenance.
