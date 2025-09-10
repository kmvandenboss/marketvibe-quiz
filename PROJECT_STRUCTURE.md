# MarketVibe Quiz App Project Structure

This document provides an overview of the project structure and organization.

## Root Directory

- `.env` - Environment variables
- `.gitignore` - Git ignore configuration
- `.npmrc` - NPM configuration
- `backup_before_cleanup_2025_02_13.sql` - Database backup file
- `drizzle.config.ts` - Drizzle ORM configuration
- `eslint.config.mjs` - ESLint configuration
- `fix-api-routes.js` - API routes fix script
- `global.d.ts` - Global TypeScript declarations
- `motion-typescript-guide.md` - Motion TypeScript guide
- `next.config.js` - Next.js configuration
- `package.json` - Project dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `postcss.config.js/mjs` - PostCSS configuration
- `README.md` - Project documentation
- `sanity.config.ts` - Sanity CMS configuration
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

#### Sanity-Powered Article System (`/src/app/article`)
- `/[slug]` - Dynamic article routes powered by Sanity CMS
  - `ArticleContent.tsx` - Article content component that renders Sanity data
  - `layout.tsx` - Article layout component
  - `page.tsx` - Dynamic article page component that fetches from Sanity

#### Other App Routes
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
- `/investment-spotlight` - Investment spotlight page
  - `page.tsx` - Investment spotlight page component
- `/login` - Authentication route
  - `page.tsx` - Login page component
- `/privacy-policy` - Privacy Policy route
  - `page.tsx` - Privacy Policy page component
- `/quiz` - Quiz routes
  - `page.tsx` - Quiz landing page
  - `/[slug]` - Dynamic quiz routes
    - `page.tsx` - Dynamic quiz page component
- `/studio` - Sanity Studio routes
  - `/[[...tool]]` - Sanity Studio catch-all route
    - `layout.tsx` - Studio layout component
    - `page.tsx` - Studio page component
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
  - `/leads` - Leads data endpoint
    - `route.ts` - API route handler
  - `/metrics` - Dashboard metrics
    - `route.ts` - Metrics data handler
  - `/overview` - Dashboard overview data
    - `route.ts` - Overview data handler
- `/email-redirect` - Email redirect endpoint
  - `route.ts` - API route handler
- `/investment-options` - Investment options API endpoint
  - `route.ts` - API route handler
- `/investment-spotlight` - Investment spotlight endpoints
  - `route.ts` - Main investment spotlight API handler
  - `/analytics` - Investment spotlight analytics
    - `route.ts` - Analytics tracking handler
  - `/track-click` - Click tracking for investment spotlight
    - `route.ts` - Click tracking handler
- `/meta-conversion` - Meta Pixel conversion tracking endpoint
  - `route.ts` - API route handler
- `/questions` - Questions management endpoint
  - `route.ts` - API route handler
- `/quiz` - Quiz API endpoints
  - `/[slug]` - Dynamic quiz routes
- `/redirect` - URL redirection endpoint
  - `route.ts` - API route handler
- `/submit` - General submission endpoint
  - `route.ts` - Submission handler
- `/track-click` - Click tracking endpoint
  - `route.ts` - API route handler
- `/unsubscribe` - Email unsubscribe endpoint
  - `route.ts` - API route handler
  - `src.lnk` - Shortcut link
- `/users` - User management endpoint
  - `route.ts` - API route handler

### Components (`/src/components`)
- `Footer.tsx` - Global footer component
- `MetaPixel.tsx` - Meta Pixel integration component
- `TaboolaPixel.tsx` - Taboola Pixel integration component
- `TwitterPixel.tsx` - Twitter Pixel integration component

#### Dashboard Components (`/src/components/dashboard`)
- `DashboardContent.tsx` - Main dashboard content wrapper
- `DashboardMetrics.tsx` - Dashboard metrics display
- `DashboardNav.tsx` - Dashboard navigation component
- `LeadsTable.tsx` - Leads data table component
- `QuizOverview.tsx` - Quiz overview display
- `QuizSelector.tsx` - Quiz selection component

#### Quiz Components (`/src/components/quiz`)
- `/base` - Core quiz components
  - `AnswerOption.tsx` - Individual answer option component
  - `EmailCaptureForm.tsx` - Email collection form
  - `LoadingSpinner.tsx` - Loading indicator
  - `PersonalityResultsCard.tsx` - Personality quiz results display
  - `ProgressIndicator.tsx` - Quiz progress bar
  - `QuestionCard.tsx` - Question display component
  - `QuizContainer.tsx` - Main quiz container component
  - `ResultsCard.tsx` - Quiz results display
  - `ResultsCardContainer.tsx` - Container for results display
- `/Layouts` - Quiz layout components
  - `StandardLayout.tsx` - Standard quiz layout component

#### Sanity Components (`/src/components/sanity`)
- `PortableTextComponents.tsx` - Portable text rendering components for Sanity

#### UI Components (`/src/components/ui`)
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
- `auth.ts` - Authentication utilities and middleware
- `db.ts` - Database utility functions
- `quiz-data.ts` - Quiz data and configuration
- `sanity.ts` - Sanity CMS client configuration and utilities
- `/quiz` - Quiz-specific utilities
  - `types.ts` - Quiz-specific type definitions

### Sanity CMS (`/src/sanity`)
- `/schemas` - Sanity schema definitions
  - `article.ts` - Article schema definition
  - `index.ts` - Schema index file
  - `quizReference.ts` - Quiz reference schema
  - `/objects` - Sanity object schemas
    - `callToAction.ts` - Call to action object schema
    - `investmentOptions.ts` - Investment options object schema
    - `quizEmbed.ts` - Quiz embed object schema
    - `seoMetadata.ts` - SEO metadata object schema

### Types (`/src/types`)
- `dashboard.ts` - Dashboard-related TypeScript types
- `quiz.ts` - Shared quiz type definitions

### Utils (`/src/utils`)
- `case-transform.ts` - Case transformation utilities
- `email.ts` - Email utility functions
- `meta-pixel.ts` - Meta Pixel tracking utilities
- `quiz-utils.ts` - Quiz helper functions

## Database (`/db`)
Database-related files at root level:
- `/migrations` - Database migration files
  - `/meta` - Migration metadata
    - `_journal.json` - Migration history

## Documentation (`/docs`)
- `analytics-events.md` - Documentation for analytics event tracking
- `case-conventions.md` - Documentation for case convention standards

## Public Assets (`/public`)
Static files served directly:
- `/images` - Image assets
  - `MarketVibe-logo.png` - Company logo
  - `alpine-notes.jpg` - Alpine Notes investment image
  - `arrived-pcf.jpg` - Arrived PCF investment image
  - `arrived-sfr-fund.jpg` - Arrived SFR Fund image
  - `ascent-income-fund.jpg` - Ascent Income Fund image
  - `buffett-dividends.png` - Warren Buffett dividends article image
  - `fundrise.jpg` - Fundrise investment image
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
- `migrate-warren-buffett-article.js` - Article migration script for Sanity CMS

## Key Features and Integrations

### Sanity CMS Integration
- Full headless CMS setup with Sanity Studio accessible at `/studio`
- Complete article management system with dynamic routing (`/article/[slug]`)
- Articles are created and managed entirely through Sanity CMS
- Portable text components for rich content rendering
- SEO metadata and investment options schemas
- Quiz embedding capabilities within articles
- Content is fetched from Sanity and rendered using custom components

### Investment Spotlight System
- Dedicated investment spotlight page
- Analytics tracking for investment spotlight interactions
- Click tracking for investment options
- API endpoints for managing investment spotlight data

### Analytics and Tracking
- Meta Pixel integration for conversion tracking
- Taboola Pixel integration
- Twitter Pixel integration
- Custom analytics tracking system
- Click tracking for various user interactions

### Authentication and Dashboard
- Admin authentication system
- Comprehensive dashboard with metrics
- User management capabilities
- Quiz-specific analytics and overview
- Lead management and tracking

### Quiz System
- Dynamic quiz routing with slug-based URLs
- Multiple quiz layouts and components
- Email capture integration
- Results display with personality-based outcomes
- Progress tracking and loading states
