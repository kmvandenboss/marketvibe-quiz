import { Question, InvestmentOption } from '@/types/quiz';

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

  // Process each answered question
  Object.entries(answers).forEach(([questionId, answerId]) => {
    const question = questions.find(q => q.id === questionId);
    if (!question) return;

    const selectedOption = question.options.find(opt => opt.id === answerId) as QuestionOption;
    if (!selectedOption) return;

    // Add up scores for each tag, weighted by the option's weight
    selectedOption.tags.forEach(tag => {
      if (!scores[tag]) {
        scores[tag] = 0;
      }
      scores[tag] += selectedOption.weight;
    });
  });

  // Normalize scores to percentages
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);
  if (totalScore > 0) {
    Object.keys(scores).forEach(tag => {
      scores[tag] = (scores[tag] / totalScore) * 100;
    });
  }

  return scores;
};

export const findMatchingInvestments = (
  scores: TagScores,
  options: InvestmentOption[],
  maxResults: number = 3
): InvestmentOption[] => {
  return options
    .map(option => {
      // Calculate match score based on matching tags
      let matchScore = option.tags.reduce((score, tag) => {
        return score + (scores[tag] || 0);
      }, 0);

      // Normalize by number of tags to not unfairly favor options with more tags
      matchScore = matchScore / option.tags.length;

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
    .slice(0, maxResults);
};

export const getQuizProgress = (
  currentQuestionIndex: number,
  totalQuestions: number
): number => {
  return Math.round((currentQuestionIndex / totalQuestions) * 100);
};