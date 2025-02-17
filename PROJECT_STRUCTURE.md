# MarketVibe Quiz App Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

- `.env` - Environment variables
- `.gitignore` - Git ignore configuration
- `backup_before_cleanup_2025_02_13.sql` - Database backup file
- `drizzle.config.ts` - Drizzle ORM configuration
- `eslint.config.mjs` - ESLint configuration
- `global.d.ts` - Global TypeScript declarations
- `hash-password.ts` - Password hashing utility
- `next.config.js` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `postcss.config.js/mjs` - PostCSS configuration
- `README.md` - Project documentation
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

## Source Code (`/src`)

- `middleware.ts` - Next.js middleware for authentication and routing

### App Directory (`/src/app`)
Next.js 13+ app directory structure:
- `favicon.ico` - Website favicon
- `layout.tsx` - Root layout component
- `page.tsx` - Home page component
- `globals.css` - Global styles
- `/article` - Article routes
  - `/warren-buffett-earn-while-you-sleep` - Article page
    - `layout.tsx` - Article layout component
    - `page.tsx` - Article content component
- `/contact` - Contact page route
  - `page.tsx` - Contact page component
- `/dashboard` - Admin Dashboard routes
  - `layout.tsx` - Dashboard layout component
  - `page.tsx` - Dashboard overview page
  - `/[quizId]` - Quiz-specific dashboard
    - `page.tsx` - Individual quiz dashboard
  - `/users` - User management route
    - `page.tsx` - Users page component
- `/error` - Error handling route
  - `page.tsx` - Error page component
- `/high-yield-quiz` - High Yield Investment Quiz route
  - `page.tsx` - High Yield Quiz page component
- `/login` - Authentication route
  - `page.tsx` - Login page component
- `/privacy-policy` - Privacy Policy route
  - `page.tsx` - Privacy Policy page component
- `/quiz` - Quiz routes
  - `page.tsx` - Quiz landing page
  - `/[slug]` - Dynamic quiz routes
    - `page.tsx` - Dynamic quiz page component
- `/unsubscribe` - Email unsubscribe routes
  - `/success` - Unsubscribe confirmation
    - `page.tsx` - Success page component

### API Routes (`/src/app/api`)
- `/analytics` - Analytics tracking endpoints
  - `/track` - Analytics tracking endpoint
    - `route.ts` - API route handler
- `/auth` - Authentication endpoints
  - `/login` - Login endpoint
    - `route.ts` - API route handler
  - `/logout` - Logout endpoint
    - `route.ts` - API route handler
- `/dashboard` - Dashboard data endpoints
  - `/overview` - Dashboard overview data
    - `route.ts` - Overview data handler
  - `/metrics` - Dashboard metrics
    - `route.ts` - Metrics data handler
  - `/leads` - Leads data endpoint
    - `route.ts` - API route handler
- `/investment-options` - Investment options API endpoint
  - `route.ts` - API route handler
- `/meta-conversion` - Meta Pixel conversion tracking endpoint
  - `route.ts` - API route handler
- `/questions` - Questions management endpoint
  - `route.ts` - API route handler
- `/quiz` - Quiz API endpoints
  - `/[slug]` - Dynamic quiz routes
    - `route.ts` - Quiz data API handler
    - `/submit` - Quiz submission endpoint
      - `route.ts` - Submission handler
- `/redirect` - URL redirection endpoint
  - `route.ts` - API route handler
- `/submit` - General submission endpoint
  - `route.ts` - Submission handler
- `/track-click` - Click tracking endpoint
  - `route.ts` - API route handler
- `/unsubscribe` - Email unsubscribe endpoint
  - `route.ts` - API route handler
- `/users` - User management endpoint
  - `route.ts` - API route handler

### Components (`/src/components`)
- `Footer.tsx` - Global footer component
- `MetaPixel.tsx` - Meta Pixel integration component
- `/dashboard` - Dashboard components
  - `DashboardContent.tsx` - Main dashboard content wrapper
  - `DashboardMetrics.tsx` - Dashboard metrics display
  - `DashboardNav.tsx` - Dashboard navigation component
  - `LeadsTable.tsx` - Leads data table component
  - `QuizSelector.tsx` - Quiz selection component
  - `QuizOverview.tsx` - Quiz overview display
- `/quiz` - Quiz-specific components
  - `/base` - Core quiz components
    - `QuizContainer.tsx` - Main quiz container component
    - `EmailCaptureForm.tsx` - Email collection form
    - `QuestionCard.tsx` - Question display component
    - `ResultsCard.tsx` - Quiz results display
    - `ResultsCardContainer.tsx` - Container for results display
    - `PersonalityResultsCard.tsx` - Personality quiz results display
    - `AnswerOption.tsx` - Individual answer option component
    - `LoadingSpinner.tsx` - Loading indicator
    - `ProgressIndicator.tsx` - Quiz progress bar
  - `/Layouts` - Quiz layout components
    - `StandardLayout.tsx` - Standard quiz layout component
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

### Documentation (`/docs`)
- `analytics-events.md` - Documentation for analytics event tracking
- `case-conventions.md` - Documentation for case convention standards

### Library (`/src/lib`)
- `auth.ts` - Authentication utilities and middleware
- `db.ts` - Database utility functions
- `quiz-data.ts` - Quiz data and configuration
- `/quiz` - Quiz-specific utilities
  - `types.ts` - Quiz-specific type definitions

### Types (`/src/types`)
- `quiz.ts` - Shared quiz type definitions
- `dashboard.ts` - Dashboard-related TypeScript types

### Utils (`/src/utils`)
- `email.ts` - Email utility functions
- `meta-pixel.ts` - Meta Pixel tracking utilities
- `case-transform.ts` - Case transformation utilities
- `quiz-utils.ts` - Quiz helper functions

## Public Assets (`/public`)
Static files served directly:
- `/images` - Image assets
  - `MarketVibe-logo.png` - Company logo
  - `alpine-notes.jpg` - Alpine Notes investment image
  - `arrived-pcf.jpg` - Arrived PCF investment image
  - `arrived-sfr-fund.jpg` - Arrived SFR Fund image
  - `ascent-income-fund.jpg` - Ascent Income Fund image
  - `buffett-dividends.png` - Warren Buffett dividends article image
  - `globalx.jpg` - GlobalX investment image
  - `groundfloor.jpg` - Groundfloor investment image
  - `ishares.jpg` - iShares investment image
  - `nada.jpg` - NADA investment image
  - `vti.png` - VTI investment image
- `file.svg` - File icon
- `globe.svg` - Globe icon
- `next.svg` - Next.js logo
- `vercel.svg` - Vercel logo
- `window.svg` - Window icon

## Scripts (`/scripts`)
Custom scripts and utilities for project maintenance:
- `cleanup_old_data.sql` - Database cleanup script
