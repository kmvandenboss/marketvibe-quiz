# MarketVibe Quiz Project Structure

## Root Directory
- Configuration files for the project setup
  - `next.config.ts` - Next.js configuration
  - `package.json` - Project dependencies and scripts
  - `tailwind.config.ts` - Tailwind CSS configuration
  - `tsconfig.json` - TypeScript configuration
  - `tsconfig.seed.json` - TypeScript configuration for seeding scripts
  - `postcss.config.mjs` - PostCSS configuration
  - `eslint.config.mjs` - ESLint configuration
  - `.gitignore` - Git ignore rules

## /db
Database-related files and configurations
- `config.ts` - Database configuration
- `index.ts` - Database connection and setup
- `schema.ts` - Database schema definitions
- `migrations.ts` - Database migration configurations
- `seed.ts` & `seed.mjs` - Database seeding scripts
- `/migrations` - Migration files
  - `0002_analytics_tables.ts` - Analytics tables migration

## /emails
Email template components
- `admin-notification.tsx` - Admin notification email template
- `user-autoresponder.tsx` - User autoresponder email template

## /public
Static assets
- `file.svg`
- `globe.svg`
- `next.svg`
- `vercel.svg`
- `window.svg`

## /src
Main source code directory

### /app
Next.js 13+ app directory structure
- `layout.tsx` - Root layout component
- `page.tsx` - Root page component
- `globals.css` - Global styles
- `/api` - API routes
  - `/analytics` - Analytics-related endpoints
    - `/metrics/route.ts` - Analytics metrics API
    - `/track/route.ts` - Analytics tracking API
  - `/questions/route.ts` - Quiz questions API
  - `/results/route.ts` - Quiz results API
  - `/submit/route.ts` - Quiz submission API
  - `/track-click/route.ts` - Click tracking API
- `/dashboard` - Analytics dashboard pages
  - `layout.tsx` - Dashboard layout
  - `page.tsx` - Dashboard main page
- `/email-test` - Email testing page
  - `page.tsx` - Email test page component

### /components
React components organized by feature
- `/analytics/dashboard` - Dashboard components
  - `ConversionChart.tsx` - Conversion metrics chart
  - `DropoffChart.tsx` - User dropoff visualization
  - `TrendsChart.tsx` - Trends visualization
  - `OverviewCards.tsx` - Dashboard overview cards
  - `index.tsx` - Main dashboard component
- `/quiz` - Quiz-related components
  - `AnswerOption.tsx` - Quiz answer option component
  - `EmailCapture.tsx` - Email collection form
  - `ErrorBoundary.tsx` - Error handling component
  - `LinkTracker.tsx` - Link tracking component
  - `LoadingSpinner.tsx` - Loading indicator
  - `ProgressIndicator.tsx` - Quiz progress bar
  - `QuestionCard.tsx` - Question display component
  - `QuizContainer.tsx` - Main quiz container
  - `ResultsCard.tsx` - Quiz results display
- `/ui` - Reusable UI components
  - `alert.tsx` - Alert component
  - `animations.tsx` - Animation utilities and components
  - `button.tsx` - Button component
  - `card.tsx` - Card component
  - `progress.tsx` - Progress bar component
  - `skeleton.tsx` - Loading skeleton components
- `EmailTemplateTest.tsx` - Email template testing component

### /hooks
Custom React hooks
- `useClickTracking.tsx` - Click tracking hook
- `useQuizSubmission.tsx` - Quiz submission hook

### /lib
Utility libraries
- `analytics.ts` - Analytics utility functions

### /scripts
Utility scripts
- `seed-analytics.ts` - Analytics data seeding
- `setup-analytics.ts` - Analytics setup script

### /types
TypeScript type definitions
- `quiz.ts` - Quiz-related type definitions

### /utils
Utility functions
- `quiz-utils.ts` - Quiz-related utility functions
