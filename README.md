# MarketVibe Quiz App

A Next.js application for creating and managing investment-focused quizzes with personality matching and investment recommendations.

## System Architecture

### Core Components

1. **Quiz Engine**
   - Located in `src/components/quiz/base/QuizContainer.tsx`
   - Manages quiz state, question flow, and user responses
   - Handles analytics tracking for each quiz interaction
   - Features:
     - Progressive question display
     - Back navigation (configurable)
     - Progress tracking
     - Email capture
     - Results calculation and display

2. **Data Processing**
   - Core utilities in `src/utils/quiz-utils.ts`
   - Key functions:
     - `calculateQuizScore`: Processes answers to generate tag-based scores
     - `findMatchingInvestments`: Matches user profiles with investment options
     - `determinePersonalityType`: Maps quiz results to personality profiles
     - `getQuizProgress`: Calculates completion percentage

3. **Database Schema** (`src/db/schema.ts`)
   - Tables:
     - `quizzes`: Quiz configurations and metadata
     - `questions`: Quiz questions with type and position
     - `question_options`: Answer options with tags and weights
     - `investment_options`: Available investment products/strategies
     - `leads`: User responses and quiz results
     - `analytics_events`: Detailed interaction tracking
     - `analytics_metrics`: Aggregated performance data
     - `users`: Admin user management
     - `sessions`: Authentication session tracking

### Data Flow

1. **Quiz Initialization**
   - Quiz loaded via `/api/quiz/[slug]/route.ts`
   - Questions and options fetched from database
   - Quiz configuration determines UI elements and navigation

2. **Quiz Progression**
   - User answers tracked in client-side state
   - Analytics events logged for:
     - Quiz starts
     - Question answers
     - Email submissions
     - Result generation

3. **Results Processing**
   - Answer processing:
     - Tag-based scoring system
     - Personality type matching (if configured)
     - Investment option matching
   - Email capture required for full results
   - Results stored in leads table with:
     - User responses
     - Calculated scores
     - Matched investments
     - Personality type (if applicable)

4. **Dashboard Analytics**
   - Real-time metrics via:
     - `/api/dashboard/overview/route.ts`: Quiz-level statistics
     - `/api/dashboard/metrics/route.ts`: Detailed performance data
   - Protected by authentication middleware
   - Tracks:
     - Completion rates
     - User engagement
     - Investment matches
     - Email captures

### Key Features

1. **Quiz Types**
   - Standard investment matching
   - Personality-based profiling
   - Configurable navigation and UI elements

2. **Investment Matching**
   - Tag-based scoring system
   - Priority-weighted recommendations
   - Configurable matching algorithms

3. **User Tracking & Analytics**
   - Detailed analytics events:
     - Quiz starts and completions
     - Question-by-question progression
     - Email submissions and errors
     - Investment recommendation generation
   - Link click tracking:
     - Limited to 3 clicks per lead
     - Timestamps for each click
     - Association with investment options
   - Session-based user flow tracking:
     - User agent and IP tracking
     - Session persistence
     - Funnel analysis capabilities
   - Conversion analytics:
     - Completion rates by question
     - Email capture success rates
     - Investment option click-through rates
     - Accredited investor tracking

4. **Admin Dashboard**
   - Quiz performance metrics
   - User engagement analytics
   - Lead management
   - Quiz configuration

### Security & Authentication

1. **Admin Access**
   - Token-based authentication
   - Session management
   - Role-based access control

2. **API Protection**
   - Auth middleware on sensitive routes
   - Request validation using Zod
   - Error handling and logging

### File Structure Quick Reference

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   │   ├── analytics/     # Analytics endpoints
│   │   ├── auth/         # Authentication
│   │   ├── dashboard/    # Admin dashboard data
│   │   └── quiz/         # Quiz data and submission
│   └── dashboard/        # Dashboard pages
├── components/
│   ├── dashboard/        # Dashboard UI components
│   ├── quiz/            # Quiz UI components
│   └── ui/              # Shared UI components
├── db/
│   ├── schema.ts        # Database schema
│   └── queries.ts       # Database operations
├── lib/
│   ├── auth.ts          # Authentication utilities
│   └── quiz-data.ts     # Quiz data handling
├── types/               # TypeScript definitions
└── utils/               # Utility functions
```

## Common Operations

### Troubleshooting

1. **Quiz Flow Issues**
   - Check `QuizContainer.tsx` for state management
   - Verify analytics events in `analytics_events` table
   - Review quiz configuration in database

2. **Results Problems**
   - Examine `quiz-utils.ts` for scoring logic:
     - Tag-based scoring calculation
     - Investment matching algorithms
     - Personality type determination
   - Check investment matching in `findMatchingInvestments`:
     - Tag matching logic
     - Priority weighting
     - Quiz-specific tag overrides
   - Verify lead data in database:
     - Response records
     - Score calculations
     - Click tracking
     - Personality matches

3. **Dashboard Issues**
   - Check authentication in `auth.ts`
   - Verify metrics queries in `queries.ts`
   - Review API responses in browser console

### Adding Features

1. **New Quiz Type**
   - Extend quiz schema
   - Add type definitions
   - Implement scoring logic
   - Create UI components

2. **Custom Analytics**
   - Add event types
   - Create tracking functions
   - Implement dashboard displays

3. **New Investment Options**
   - Add to investment_options table
   - Update matching logic
   - Configure display components

## Development Guidelines

1. **Analytics Implementation**
   - Always track:
     - User interactions
     - State changes
     - Error conditions
   - Use consistent event naming

2. **Error Handling**
   - Implement try-catch blocks
   - Log errors with context
   - Provide user feedback
   - Track in analytics

3. **State Management**
   - Client-side state:
     - Current question tracking
     - Answer collection
     - Progress calculation
     - Email capture state
   - Server-side state:
     - Quiz configurations
     - User responses
     - Analytics events
     - Lead tracking
   - Database persistence:
     - Normalized quiz data
     - User responses
     - Analytics events
     - Click tracking
   - Performance optimization:
     - Quiz data caching
     - Analytics batch processing
     - Optimistic UI updates

4. **Security Considerations**
   - Validate all inputs
   - Authenticate sensitive routes
   - Sanitize database queries
   - Log security events
