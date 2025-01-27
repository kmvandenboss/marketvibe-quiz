// src/lib/quiz-data.ts
import { Question } from '@/types/quiz';

export const defaultQuizQuestions: Question[] = [
  {
    id: "cc2cea25-7724-404d-bb37-a2937f2b98b2",
    text: "What's your primary reason for seeking high yields?",
    type: "single",
    order: 1,
    options: [
      {
        id: "1a",
        tags: ["income_focused", "current_income", "distributions"],
        text: "Generate steady income right away",
        weight: 1
      },
      {
        id: "1b",
        tags: ["growth_focused", "long_term", "appreciation"],
        text: "Grow my investment balance over time",
        weight: 1
      },
      {
        id: "1c",
        tags: ["balanced", "income_focused", "growth_focused"],
        text: "Both: I want income and long-term growth",
        weight: 1
      }
    ]
  },
  {
    id: "aff99dac-33c7-4049-901a-f1eb468fe0db",
    text: "What is your preferred investing timeframe?",
    type: "single",
    order: 2,
    options: [
      {
        id: "2a",
        tags: ["short_term", "high_liquidity", "current_income"],
        text: "Less than 1 year",
        weight: 1
      },
      {
        id: "2b",
        tags: ["medium_term", "moderate_liquidity"],
        text: "1–3 years",
        weight: 1
      },
      {
        id: "2c",
        tags: ["longer_term", "lower_liquidity"],
        text: "3–5 years",
        weight: 1
      },
      {
        id: "2d",
        tags: ["long_term", "illiquid_okay"],
        text: "5+ years",
        weight: 1.2
      }
    ]
  },
  {
    id: "43d447cb-c9e8-4ef2-b5c6-1a93e968d076",
    text: "How important is regular income from your investments?",
    type: "single",
    order: 3,
    options: [
      {
        id: "3a",
        tags: ["distributions", "income_focused", "current_income"],
        text: "Extremely important—I'd like frequent distributions",
        weight: 1
      },
      {
        id: "3b",
        tags: ["balanced", "flexible_income"],
        text: "Somewhat important—but I'm okay reinvesting if needed",
        weight: 1
      },
      {
        id: "3c",
        tags: ["growth_focused", "appreciation"],
        text: "Not important—my focus is on long-term growth",
        weight: 1
      }
    ]
  },
  {
    id: "224600cd-6f2d-43a8-9add-3195fc3a1ff8",
    text: "What level of liquidity do you need?",
    type: "single",
    order: 4,
    options: [
      {
        id: "4a",
        tags: ["high_liquidity", "public_markets"],
        text: "I need to be able to access my money at any time",
        weight: 1
      },
      {
        id: "4b",
        tags: ["moderate_liquidity", "private_markets"],
        text: "I can lock up my money for a few years",
        weight: 1
      },
      {
        id: "4c",
        tags: ["illiquid_okay", "private_markets"],
        text: "I'm comfortable with long-term or less liquid investments",
        weight: 1
      }
    ]
  },
  {
    id: "a2d065b8-8ba4-4846-b46c-513ec19842c4",
    text: "Are you an accredited investor?",
    type: "single",
    order: 5,
    options: [
      {
        id: "5a",
        tags: ["accredited", "private_markets"],
        text: "Yes",
        weight: 1
      },
      {
        id: "5b",
        tags: ["non_accredited", "public_markets"],
        text: "No",
        weight: 1
      },
      {
        id: "5c",
        tags: ["public_markets"],
        text: "Not sure",
        weight: 0.8
      }
    ]
  }
];