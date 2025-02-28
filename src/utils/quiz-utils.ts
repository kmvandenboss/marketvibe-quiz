import { Question, InvestmentOption, PersonalityResult, PersonalityTypeResult } from '@/types/quiz';

interface TagScores {
  [key: string]: number;
}

interface QuestionOption {
  id: string;
  tags: string[];
  text: string;
  weight: number;
}

export const calculateQuizScore = (
  questions: Question[],
  answers: Record<string, string>
): TagScores => {
  const scores: TagScores = {};
  
  console.log('\n=== Quiz Score Calculation Start ===');
  console.log('Answers received:', answers);

  // Process each answered question
  Object.entries(answers).forEach(([questionId, answerId]) => {
    console.log(`\nProcessing Question ID: ${questionId}`);
    
    const question = questions.find(q => q.id === questionId);
    if (!question) {
      console.log(`Warning: Question ${questionId} not found in questions array`);
      return;
    }

    const selectedOption = question.options.find(opt => opt.id === answerId) as QuestionOption;
    if (!selectedOption) {
      console.log(`Warning: Answer ${answerId} not found in question options`);
      return;
    }

    console.log('Selected option:', {
      text: selectedOption.text,
      weight: selectedOption.weight,
      tags: selectedOption.tags
    });

    // Add up scores for each tag, weighted by the option's weight
    selectedOption.tags.forEach(tag => {
      if (!scores[tag]) {
        scores[tag] = 0;
      }
      const previousScore = scores[tag];
      scores[tag] += selectedOption.weight;
      console.log(`Tag "${tag}": ${previousScore} + ${selectedOption.weight} = ${scores[tag]}`);
    });
  });

  console.log('\nPre-normalized scores:', { ...scores });

  // Normalize scores to percentages
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  console.log('Total score before normalization:', totalScore);
  
  if (totalScore > 0) {
    Object.keys(scores).forEach(tag => {
      const originalScore = scores[tag];
      scores[tag] = (scores[tag] / totalScore) * 100;
      console.log(`Normalizing "${tag}": ${originalScore} → ${scores[tag].toFixed(2)}%`);
    });
  }

  console.log('\nFinal normalized scores:', scores);
  console.log('=== Quiz Score Calculation End ===\n');

  return scores;
};

export const findMatchingInvestments = (
  scores: TagScores,
  options: InvestmentOption[],
  maxResults: number = 3,
  quizSlug?: string // Add quiz slug parameter
): InvestmentOption[] => {
  console.log('\n=== Investment Matching Start ===');
  console.log('Input scores:', scores);
  console.log('Available options:', options.length);
  console.log('Quiz slug:', quizSlug);
  
  return options
    .map(option => {
      console.log(`\nEvaluating option: ${option.title}`);
      
      // Get quiz-specific tags using the quiz slug if available
      const quizTags = quizSlug && option.quizTags && option.quizTags[quizSlug] 
        ? option.quizTags[quizSlug] as string[] 
        : option.tags;
      console.log('Option tags:', quizTags);
      
      // Calculate match score based on matching tags
      let matchScore = quizTags.reduce((score, tag) => {
        const tagScore = scores[tag] || 0;
        console.log(`Tag "${tag}" score: ${tagScore}`);
        return score + tagScore;
      }, 0);

      // Normalize by number of tags to not unfairly favor options with more tags
      const rawScore = matchScore;
      matchScore = matchScore / quizTags.length;
      console.log(`Raw score: ${rawScore}, Normalized by ${quizTags.length} tags = ${matchScore.toFixed(2)}`);

      return {
        ...option,
        matchScore
      };
    })
    .sort((a, b) => {
      // Sort by match score, then by priority if scores are equal
      if (b.matchScore === a.matchScore) {
        return b.priority - a.priority;
      }
      return b.matchScore - a.matchScore;
    })
    .slice(0, maxResults)
    .map(option => {
      console.log(`\nSelected match: ${option.title}`);
      console.log(`Final match score: ${option.matchScore.toFixed(2)}`);
      console.log(`Priority: ${option.priority}`);
      // Remove matchScore property before returning
      const { matchScore, ...cleanOption } = option;
      return cleanOption;
    });
};

export const getQuizProgress = (
  currentQuestionIndex: number,
  totalQuestions: number
): number => {
  return Math.round((currentQuestionIndex / totalQuestions) * 100);
};

export const determinePersonalityType = (
  scores: TagScores,
  personalityResults: PersonalityResult[]
): PersonalityTypeResult | undefined => {
  // Get available personality types (lowercase for case-insensitive comparison)
  const availableTypes = personalityResults.map(result => result.type.toLowerCase());
  
  // Find the highest scoring tag among available personality types only
  const highestScoringTag = Object.entries(scores).reduce(
    (highest, [tag, score]) => {
      // Only consider tags that are valid personality types (case-insensitive)
      if (availableTypes.includes(tag.toLowerCase()) && score > highest.score) {
        return { tag, score };
      }
      return highest;
    },
    { tag: '', score: -1 }
  );

  // Find the personality result that matches the highest scoring tag
  const matchedPersonality = personalityResults.find(result => 
    result.type.toLowerCase() === highestScoringTag.tag.toLowerCase()
  );
  
  return matchedPersonality ? {
    personalityResult: matchedPersonality,
    resultsConfig: {
      layout: 'personality',
      personalityResults
    }
  } : undefined;
};
