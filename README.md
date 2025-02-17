# MarketVibe Quiz App

A Next.js application for creating and managing investment-focused quizzes with personality matching, investment recommendations, and integrated content marketing features.

## System Architecture

### Core Components

1. **Quiz Engine**
   - Core Files:
     - `src/components/quiz/base/QuizContainer.tsx`: Main quiz logic and state management
     - `src/components/quiz/base/QuestionCard.tsx`: Question display and interaction
     - `src/components/quiz/base/ResultsCard.tsx`: Standard results display
     - `src/components/quiz/base/PersonalityResultsCard.tsx`: Personality quiz results
     - `src/components/quiz/Layouts/StandardLayout.tsx`: Quiz layout and navigation
   - Features:
     - Progressive question display
     - Configurable navigation:
       - Back navigation toggle
       - Progress bar display
       - Question count indicator
     - Email capture with customizable messaging
     - Results calculation and display
     - Personality type matching with JSON-based results
     - Investment recommendations
     - SEO metadata management

2. **Data Processing**
   - Core Files:
     - `src/utils/quiz-utils.ts`: Quiz processing utilities
       - `calculateQuizScore`: Score calculation logic
       - `findMatchingInvestments`: Investment matching algorithm
       - `determinePersonalityType`: Personality quiz logic
     - `src/utils/case-transform.ts`: Data transformation utilities
     - `src/lib/quiz-data.ts`: Quiz data management
     - `src/types/quiz.ts`: TypeScript definitions

3. **Database Layer**
   - Core Files:
     - `src/db/schema.ts`: Database schema definitions
     - `src/db/queries.ts`: Database operations
     - `src/db/config.ts`: Database configuration
     - `src/db/migrate.ts`: Migration utilities
   - Key Tables:
     - `quizzes`: Quiz configurations and metadata
     - `questions`: Quiz questions with type and position
     - `question_options`: Answer options with tags and weights
     - `investment_options`: Available investment products/strategies
     - `leads`: User responses and quiz results
     - `analytics_events`: Detailed interaction tracking
     - `analytics_metrics`: Aggregated performance data
     - `users`: Admin user management
     - `sessions`: Authentication session tracking
     - `articles`: Content marketing materials
     - `meta_conversions`: Meta Pixel conversion tracking

### API Routes

1. **Quiz Management**
   - `src/app/api/quiz/[slug]/route.ts`: Quiz data retrieval
   - `src/app/api/quiz/[slug]/submit/route.ts`: Quiz submission
   - `src/app/api/questions/route.ts`: Question management
   - `src/app/api/investment-options/route.ts`: Investment options

2. **Analytics & Tracking**
   - `src/app/api/analytics/track/route.ts`: Event tracking
   - `src/app/api/track-click/route.ts`: Click tracking
   - `src/app/api/dashboard/metrics/route.ts`: Metrics aggregation
   - `src/app/api/dashboard/leads/route.ts`: Lead management

3. **Authentication**
   - `src/app/api/auth/login/route.ts`: User authentication
   - `src/lib/auth.ts`: Authentication utilities
   - `src/middleware.ts`: Route protection

### Key Features

1. **Quiz Types**
   - Implementation Files:
     - `src/components/quiz/base/QuizContainer.tsx`: Core quiz logic
     - `src/components/quiz/base/PersonalityResultsCard.tsx`: Personality results
     - `src/app/high-yield-quiz/page.tsx`: High-yield quiz implementation

2. **Investment Matching**
   - Core Files:
     - `src/utils/quiz-utils.ts`: Matching algorithms
       - `calculateQuizScore`: Tag-based scoring
       - `findMatchingInvestments`: Recommendation logic
     - `src/db/queries.ts`: Investment data queries
     - `src/types/quiz.ts`: Investment type definitions
   - Features:
     - Tag-based scoring system:
       - Question-specific tags and weights
       - Quiz-specific tag overrides
       - Cumulative score calculation
     - Priority-weighted recommendations:
       - Configurable priority levels
       - Quiz-specific targeting
       - Dynamic sorting and filtering
     - Investment details:
       - Company information and branding
       - Return metrics and minimums
       - Key features and benefits
       - Click tracking and analytics
     - Accredited investor tracking:
       - Status tracking per lead
       - Specialized recommendations
       - Compliance tracking

3. **Content Marketing**
   - Implementation Files:
     - `src/app/article/[slug]/page.tsx`: Article pages
     - `src/app/article/[slug]/layout.tsx`: Article layouts
     - Example: `src/app/article/warren-buffett-earn-while-you-sleep/page.tsx`

4. **Analytics System**
   - Core Files:
     - `src/app/api/analytics/track/route.ts`: Event tracking
     - `src/app/api/dashboard/metrics/route.ts`: Metrics processing
     - `docs/analytics-events.md`: Event documentation
   - Event Types:
     - `QUIZ_START`: Initial engagement
     - `QUESTION_ANSWERED`: Response tracking
     - `EMAIL_SUBMITTED`: Capture success
     - `RECOMMENDATIONS_GENERATED`: Results delivery

5. **Email Automation System**
   - Core Files:
     - `src/utils/email.ts`: Main email functionality
       - `sendQuizResults`: Sends personalized recommendations
       - `addContactToAudience`: Manages Resend audience
       - `generateUnsubscribeToken`: Creates secure tokens
     - `src/app/api/unsubscribe/route.ts`: Handles unsubscribe requests
     - `src/app/unsubscribe/success/page.tsx`: Confirmation page
   - Email Templates:
     - Investment recommendations template in `sendQuizResults` function
       - Responsive HTML design
       - Dynamic investment details
       - Branded styling
       - Unsubscribe link generation
   - Resend API Integration:
     - Two-token system:
       - `RESEND_API_KEY`: Send-only operations
       - `RESEND_FULL_ACCESS_API_KEY`: Audience management
     - Audience Management:
       - General audience ID: `GENERAL_AUDIENCE_ID`
       - Contact creation and updates
       - Unsubscribe handling
   - Security Features:
     - Secure token generation for unsubscribe links
     - Token verification on unsubscribe
     - List-Unsubscribe header support
   - Lead Processing:
     - Triggered from `src/app/api/quiz/[slug]/submit/route.ts`
     - Lead data stored via `src/db/queries.ts:submitQuizResponse`
     - Click tracking in `src/db/queries.ts:trackLinkClick`

6. **Admin Dashboard**
   - Core Files:
     - `src/app/dashboard/page.tsx`: Main dashboard
     - `src/app/dashboard/layout.tsx`: Dashboard layout
     - `src/components/dashboard/QuizOverview.tsx`: Quiz metrics
     - `src/components/dashboard/LeadsTable.tsx`: Lead management

### Security & Authentication

1. **Admin Access**
   - Implementation Files:
     - `src/lib/auth.ts`: Authentication logic
     - `src/middleware.ts`: Route protection
     - `src/app/api/auth/login/route.ts`: Login handling

2. **API Protection**
   - Core Files:
     - `src/middleware.ts`: Request validation
     - `src/lib/auth.ts`: Token verification
     - `src/utils/email.ts`: Secure token generation

### Development Guidelines

1. **Case Conventions**
   - Reference: `docs/case-conventions.md`
   - Implementation: `src/utils/case-transform.ts`

2. **Analytics Implementation**
   - Reference: `docs/analytics-events.md`
   - Implementation: `src/app/api/analytics/track/route.ts`

3. **Error Handling**
   - Implementation across all API routes
   - Centralized logging in API handlers

4. **State Management**
   - Client State: `src/components/quiz/base/QuizContainer.tsx`
   - Server State: `src/db/queries.ts`

## Changelog

### 2025-02-14
- Implemented Resend API integration for email automation
- Added Meta Pixel integration for conversion tracking
- Implemented standardized case transformation utilities
- Enhanced analytics event tracking system
- Added article content system with custom layouts
- Improved unsubscribe functionality
- Updated API response formats for consistency

### 2025-02-06
- Fixed personality quiz scoring system:
  - Restored personality type calculation
  - Added proper quiz data fetching
  - Improved error handling
  - Enhanced results display

### 2025-01-30
- Implemented high-yield investment quiz
- Added accredited investor tracking
- Enhanced dashboard metrics
- Improved lead management system

## File Structure

```
src/
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── article/           # Article pages
│   ├── dashboard/         # Admin interface
│   ├── quiz/             # Quiz pages
│   └── unsubscribe/      # Email management
├── components/
│   ├── dashboard/        # Admin components
│   ├── quiz/             # Quiz components
│   └── ui/               # Shared components
├── db/                   # Database layer
├── lib/                  # Core utilities
├── types/               # TypeScript definitions
└── utils/               # Helper functions
```

## Documentation

- [Analytics Events](docs/analytics-events.md)
- [Case Conventions](docs/case-conventions.md)
- [Project Structure](PROJECT_STRUCTURE.md)
