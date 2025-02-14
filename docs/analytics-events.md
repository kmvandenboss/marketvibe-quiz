# Analytics Events Documentation

This document outlines the standardized event types used throughout the quiz application for analytics tracking.

## Quiz Flow Events

### Quiz Start
- Event Type: `QUIZ_START`
- Triggered: When user answers their first question
- Additional Data:
  - quizSlug: string

### Question Answer
- Event Type: `QUESTION_ANSWERED`
- Triggered: When user selects an answer
- Additional Data:
  - questionId: string
  - questionIndex: number
  - answer: string
  - quizSlug: string

### Email Submission Events
- Event Types: 
  - `EMAIL_SUBMISSION` (legacy) - Initial form submission attempt
  - `EMAIL_SUBMITTED` - Successful email submission
  - `EMAIL_SUBMISSION_ERROR` - Failed submission
- Note: Both `EMAIL_SUBMISSION` and `EMAIL_SUBMITTED` are counted in completion metrics for backward compatibility

### Results Events
- Event Type: `RECOMMENDATIONS_GENERATED`
- Triggered: When investment options are calculated
- Additional Data:
  - matchedOptionsCount: number
  - quizSlug: string

- Event Type: `RECOMMENDATIONS_ERROR`
- Triggered: When investment options calculation fails
- Additional Data:
  - error: string
  - quizSlug: string

## Future Development Guidelines

1. Event Naming Convention:
   - Use UPPERCASE with underscores
   - Use past tense for completed actions (e.g., `EMAIL_SUBMITTED` vs `EMAIL_SUBMIT`)
   - Use `_ERROR` suffix for error events

2. Required Data:
   - All events should include `quizId` and `quizSlug`
   - Error events should include error details
   - Include relevant counts and IDs where applicable

3. Event Flow:
   - Track both attempts and successes separately
   - Always track errors for debugging
   - Consider the analytics dashboard when adding new events

4. Backward Compatibility:
   - Maintain support for legacy event types when updating metrics calculations
   - Document any deprecated event types
   - Plan migration strategies for major changes
