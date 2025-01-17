// db/seed.ts
import { db, checkDatabaseConnection } from '.';
import { sql } from 'drizzle-orm';

const questionsSeedData = [
  {
    text: "What's your primary reason for seeking high yields?",
    type: 'single',
    order: 1,
    options: [
      {
        id: '1a',
        text: 'Generate steady income right away',
        tags: ['income_focused', 'current_income', 'distributions'],
        weight: 1.0
      },
      {
        id: '1b',
        text: 'Grow my investment balance over time',
        tags: ['growth_focused', 'long_term', 'appreciation'],
        weight: 1.0
      },
      {
        id: '1c',
        text: 'Both: I want income and long-term growth',
        tags: ['balanced', 'income_focused', 'growth_focused'],
        weight: 1.0
      }
    ]
  },
  {
    text: 'What is your preferred investing timeframe?',
    type: 'single',
    order: 2,
    options: [
      {
        id: '2a',
        text: 'Less than 1 year',
        tags: ['short_term', 'high_liquidity', 'current_income'],
        weight: 1.0
      },
      {
        id: '2b',
        text: '1–3 years',
        tags: ['medium_term', 'moderate_liquidity'],
        weight: 1.0
      },
      {
        id: '2c',
        text: '3–5 years',
        tags: ['longer_term', 'lower_liquidity'],
        weight: 1.0
      },
      {
        id: '2d',
        text: '5+ years',
        tags: ['long_term', 'illiquid_okay'],
        weight: 1.2
      }
    ]
  },
  {
    text: 'How important is regular income from your investments?',
    type: 'single',
    order: 3,
    options: [
      {
        id: '3a',
        text: 'Extremely important—I\'d like frequent distributions',
        tags: ['distributions', 'income_focused', 'current_income'],
        weight: 1.0
      },
      {
        id: '3b',
        text: 'Somewhat important—but I\'m okay reinvesting if needed',
        tags: ['balanced', 'flexible_income'],
        weight: 1.0
      },
      {
        id: '3c',
        text: 'Not important—my focus is on long-term growth',
        tags: ['growth_focused', 'appreciation'],
        weight: 1.0
      }
    ]
  },
  {
    text: 'What level of liquidity do you need?',
    type: 'single',
    order: 4,
    options: [
      {
        id: '4a',
        text: 'I need to be able to access my money at any time',
        tags: ['high_liquidity', 'public_markets'],
        weight: 1.0
      },
      {
        id: '4b',
        text: 'I can lock up my money for a few years',
        tags: ['moderate_liquidity', 'private_markets'],
        weight: 1.0
      },
      {
        id: '4c',
        text: 'I\'m comfortable with long-term or less liquid investments',
        tags: ['illiquid_okay', 'private_markets'],
        weight: 1.0
      }
    ]
  },
  {
    text: 'Are you an accredited investor?',
    type: 'single',
    order: 5,
    options: [
      {
        id: '5a',
        text: 'Yes',
        tags: ['accredited', 'private_markets'],
        weight: 1.0
      },
      {
        id: '5b',
        text: 'No',
        tags: ['non_accredited', 'public_markets'],
        weight: 1.0
      },
      {
        id: '5c',
        text: 'Not sure',
        tags: ['public_markets'],
        weight: 0.8
      }
    ]
  }
];

const investmentOptionsSeedData = [
  {
    title: 'High-Yield ETF Portfolio',
    description: 'A diversified portfolio of ETFs focusing on dividend-paying stocks, REITs, and high-yield bonds. Offers monthly distributions with high liquidity.',
    link: '/investments/high-yield-etf',
    tags: ['income_focused', 'high_liquidity', 'public_markets', 'current_income', 'distributions'],
    priority: 1
  },
  {
    title: 'Growth & Income Fund',
    description: 'Balanced portfolio targeting both capital appreciation and regular income through a mix of dividend growth stocks and bonds.',
    link: '/investments/growth-and-income',
    tags: ['balanced', 'high_liquidity', 'public_markets', 'flexible_income'],
    priority: 2
  },
  {
    title: 'Private Real Estate Income Fund',
    description: 'Private fund investing in income-producing real estate properties. Quarterly distributions with 3-5 year commitment.',
    link: '/investments/private-real-estate',
    tags: ['income_focused', 'private_markets', 'accredited', 'lower_liquidity', 'distributions'],
    priority: 3
  },
  {
    title: 'Public Market Yield Portfolio',
    description: 'Actively managed portfolio of high-yield bonds, preferred stocks, and MLPs available through public markets.',
    link: '/investments/public-yield',
    tags: ['income_focused', 'high_liquidity', 'public_markets', 'current_income'],
    priority: 4
  },
  {
    title: 'Private Credit Fund',
    description: 'Direct lending fund providing high yields through private market loans. Limited liquidity with quarterly distributions.',
    link: '/investments/private-credit',
    tags: ['income_focused', 'private_markets', 'accredited', 'moderate_liquidity', 'distributions'],
    priority: 5
  },
  {
    title: 'Long-Term Growth Portfolio',
    description: 'Focus on capital appreciation through a diversified mix of growth stocks and alternative investments.',
    link: '/investments/growth-portfolio',
    tags: ['growth_focused', 'high_liquidity', 'public_markets', 'appreciation'],
    priority: 6
  },
  {
    title: 'Private Equity Growth Fund',
    description: 'Long-term private equity fund focusing on business acquisition and growth. 5+ year investment horizon.',
    link: '/investments/private-equity',
    tags: ['growth_focused', 'private_markets', 'accredited', 'illiquid_okay', 'long_term'],
    priority: 7
  },
  {
    title: 'Short-Term Income Fund',
    description: 'Conservative fund focusing on short-duration bonds and money market instruments for immediate income.',
    link: '/investments/short-term-income',
    tags: ['income_focused', 'high_liquidity', 'public_markets', 'short_term', 'current_income'],
    priority: 8
  }
];

export async function seed() {
  try {
    // First verify database connection
    console.log('Verifying database connection...');
    const connectionCheck = await checkDatabaseConnection();
    if (!connectionCheck.ok) {
      throw new Error('Failed to connect to database');
    }
    console.log('Database connection verified');

    // Clear existing data
    console.log('Clearing existing data...');
    await db.execute(sql`TRUNCATE questions, investment_options CASCADE`);
    console.log('Existing data cleared');

    // Insert questions
    console.log('Inserting questions...');
    for (const question of questionsSeedData) {
      await db.execute(sql`
        INSERT INTO questions (text, type, "order", options)
        VALUES (
          ${question.text},
          ${question.type},
          ${question.order},
          ${JSON.stringify(question.options)}
        )
      `);
    }
    console.log('Questions inserted');

    // Insert investment options
    console.log('Inserting investment options...');
    for (const option of investmentOptionsSeedData) {
      await db.execute(sql`
        INSERT INTO investment_options (title, description, link, tags, priority)
        VALUES (
          ${option.title},
          ${option.description},
          ${option.link},
          ${JSON.stringify(option.tags)},
          ${option.priority}
        )
      `);
    }
    console.log('Investment options inserted');

    console.log('Seed completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  console.log('Starting seed process...');
  seed()
    .then(() => {
      console.log('Seed process completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seed process failed:', error);
      process.exit(1);
    });
}