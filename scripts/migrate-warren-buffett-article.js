// scripts/migrate-warren-buffett-article.js
// Run this script after setting up Sanity to migrate your existing article

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

// Debug: Check if environment variables are loaded
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
console.log('API Token:', process.env.SANITY_API_TOKEN ? 'Present' : 'Missing');

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error('Error: NEXT_PUBLIC_SANITY_PROJECT_ID not found in environment variables');
  console.error('Make sure your .env.local file exists and contains the correct values');
  process.exit(1);
}

if (!process.env.SANITY_API_TOKEN) {
  console.error('Error: SANITY_API_TOKEN not found in environment variables');
  console.error('You need to create an API token in your Sanity project dashboard');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrateWarrenBuffettArticle() {
  try {
    // First, create the quiz reference
    const quizReference = await client.create({
      _type: 'quizReference',
      title: 'High-Yield Investment Quiz',
      slug: 'high-yield-quiz',
      description: 'A quiz to match users with high-yield investment opportunities',
      isActive: true,
    });

    console.log('Created quiz reference:', quizReference._id);

    // Create the article with portable text content
    const article = await client.create({
      _type: 'article',
      title: "Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You Die",
      slug: {
        _type: 'slug',
        current: 'warren-buffett-earn-while-you-sleep',
      },
      excerpt: "Learn how to build passive income streams and make your money work for you 24/7 with high-yield investment strategies used by the wealthy.",
      publishedAt: new Date().toISOString(),
      content: [
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Warren Buffett famously said, ',
            },
            {
              _type: 'span',
              text: '"If you don\'t find a way to make money while you sleep, you will work until you die."',
              marks: ['strong'],
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Let that sink in for a second.',
            },
          ],
        },
        {
          _type: 'callToAction',
          title: 'Want to find out how to make your money work for you 24/7?',
          description: 'Take this 60-second quiz to get personalized high-yield investment ideas that can help you build passive income.',
          buttonText: 'Take the Quiz',
          buttonAction: 'scrollToQuiz',
          style: 'primary',
          backgroundColor: 'lightGreen',
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "It's not just a catchy quote—it's a warning. If your money isn't working for you 24/7, life becomes a grind of never-ending work. Clock in. Clock out. Repeat.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "But there's another path. It's the one wealthy people know well. A simple concept that most people overlook:",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Passive income.',
              marks: ['strong'],
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The kind of income that flows into your account day and night, whether you're watching Netflix, lying on a beach, or fast asleep. It's how fortunes are made. And here's the good news—",
            },
            {
              _type: 'span',
              text: "it's easier to get started than you think.",
              marks: ['strong'],
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: 'Why Most People Never Get Rich',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Most people think wealth is built by working harder, saving more, and waiting patiently for retirement.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Wrong.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "The truth is, wealth isn't about how much money you have saved. It's about owning assets. Money can buy things, but then what? Once you spend it, it's gone.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'While most people hustle endlessly, hoping to retire in comfort, the wealthy quietly invest in opportunities that generate passive cash flow—monthly income that keeps stacking up without lifting a finger.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "It's not luck. It's a strategy. A system. And once you unlock it, it changes everything.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: 'Suddenly, life gets lighter. You stop worrying about money because you know your money is working for you. Even while you sleep.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'h2',
          children: [
            {
              _type: 'span',
              text: "Here's How You Start—In 60 Seconds",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "We've built a tool that takes the guesswork out of it.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "It's a quick 5-question quiz that matches you with high-yield investment ideas",
              marks: ['strong'],
            },
            {
              _type: 'span',
              text: '—the kind that can create passive income streams and start putting your money to work immediately.',
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "Think about it. In less than a minute, you'll have a customized plan to grow your wealth while you sleep. No boring spreadsheets. No hours of research. Just a few questions and you're on your way.",
            },
          ],
        },
        {
          _type: 'block',
          style: 'normal',
          children: [
            {
              _type: 'span',
              text: "It's simple, it's fast, and it could change your life.",
              marks: ['strong'],
            },
          ],
        },
        {
          _type: 'quizEmbed',
          quiz: {
            _type: 'reference',
            _ref: quizReference._id,
          },
          title: 'Get Your Personalized Investment Strategy',
          description: 'Take our quick 5-question quiz to get matched with high-yield investment ideas that can create passive income streams.',
          ctaText: 'Take the Quiz',
          showScrollButton: true,
        },
      ],
      seo: {
        metaTitle: "Warren Buffett Says You Need To 'Find A Way To Make Money While You Sleep' Or You'll Work Until You Die",
        metaDescription: "Learn how to build passive income streams and make your money work for you 24/7 with high-yield investment strategies used by the wealthy.",
        noIndex: false,
      },
    });

    console.log('Article created successfully:', article._id);
    console.log('You can now view it at: /article/warren-buffett-earn-while-you-sleep');
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateWarrenBuffettArticle();