# MarketVibe Quiz App Project Structure

```
marketvibe-quiz-app/
├── .env                      # Environment variables configuration
├── src/                      # Source code directory
│   ├── app/                  # Next.js app directory
│   │   ├── api/             # API routes
│   │   │   ├── questions/   # Questions API endpoint
│   │   │   │   └── route.ts
│   │   │   └── submit/      # Submit API endpoint
│   │   │       └── route.ts
│   │   ├── quiz/           # Quiz page
│   │   │   └── page.tsx
│   │   ├── globals.css     # Global styles
│   │   └── layout.tsx      # Root layout component
│   ├── components/         # React components
│   │   └── quiz/          # Quiz-specific components
│   │       ├── AnswerOption.tsx
│   │       ├── EmailCaptureForm.tsx
│   │       ├── ProgressIndicator.tsx
│   │       ├── QuestionCard.tsx
│   │       └── QuizContainer.tsx
│   ├── db/                # Database related files
│   │   ├── queries.ts     # Database queries
│   │   └── schema.ts      # Database schema definitions
│   └── types/            # TypeScript type definitions
│       └── quiz.ts       # Quiz-related types
├── scripts/             # Utility scripts
│   └── test-db.ts      # Database testing script
├── drizzle.config.ts   # Drizzle ORM configuration
├── global.d.ts         # Global TypeScript declarations
├── next.config.js      # Next.js configuration
├── package.json        # Project dependencies and scripts
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## Directory Overview

### `/src`
The main source code directory containing all application code.

#### `/src/app`
Next.js 13+ app directory structure with file-based routing.
- `/api`: API routes for handling backend functionality
- `/quiz`: Main quiz page implementation
- `globals.css`: Global styles
- `layout.tsx`: Root layout component

#### `/src/components`
Reusable React components.
- `/quiz`: Components specific to the quiz functionality
  - `AnswerOption.tsx`: Individual answer option component
  - `EmailCaptureForm.tsx`: Form for collecting user emails
  - `ProgressIndicator.tsx`: Quiz progress visualization
  - `QuestionCard.tsx`: Question display component
  - `QuizContainer.tsx`: Main quiz container component

#### `/src/db`
Database-related code using Drizzle ORM.
- `queries.ts`: Database query implementations
- `schema.ts`: Database schema definitions

#### `/src/types`
TypeScript type definitions.
- `quiz.ts`: Quiz-related type definitions

### Configuration Files
- `.env`: Environment variables
- `drizzle.config.ts`: Drizzle ORM configuration
- `global.d.ts`: Global TypeScript declarations
- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `tsconfig.json`: TypeScript configuration

### Scripts
- `/scripts/test-db.ts`: Database testing utility script
