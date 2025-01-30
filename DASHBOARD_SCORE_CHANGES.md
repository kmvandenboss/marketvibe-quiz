# Dashboard Score Implementation Changes

## Overview
Added a new lead quality scoring system to the dashboard that provides a meaningful 0-100 score based on quiz responses. This score helps identify high-quality leads based on their investment preferences and accredited status, without affecting the original investment matching functionality.

## Files Changed

### 1. src/types/dashboard.ts
- Added `responses: Record<string, string>` to the `Lead` interface to support quality score calculation
- No database schema changes were required as responses were already being stored

### 2. src/db/queries.ts
- Updated `getLeadsList()` function to include the `responses` field in the returned lead object
- Added type casting: `responses: lead.responses as Record<string, string>`
- No changes to database queries or data storage

### 3. src/components/dashboard/LeadsTable.tsx
- Removed the original `calculateTotalScore` function that was summing tag-based scores
- Added new `calculateLeadQualityScore` function that evaluates quiz responses
- Implemented color-coded score display:
  * Green (≥80): High-quality leads
  * Blue (≥60): Good leads
  * Yellow (≥40): Moderate leads
  * Red (<40): Lower-quality leads
- Removed unused name column from the table display

## Scoring System Details

The new quality score (0-100) is calculated based on five categories, each worth 20 points:

1. Investment Goal (Q1)
   - Growth focused (20 pts)
   - Both growth and income (18 pts)
   - Income focused (10 pts)

2. Investment Timeframe (Q2)
   - 5+ years (20 pts)
   - 3-5 years (15 pts)
   - 1-3 years (10 pts)
   - Less than 1 year (5 pts)

3. Income Importance (Q3)
   - Focus on growth (20 pts)
   - Flexible on income (12 pts)
   - Need frequent distributions (5 pts)

4. Liquidity Needs (Q4)
   - Comfortable with illiquidity (20 pts)
   - Few years lockup okay (12 pts)
   - Need frequent access (5 pts)

5. Accredited Status (Q5)
   - Yes (20 pts)
   - No (5 pts)
   - Not sure (3 pts)

## Important Notes

- The original score system used for investment matching remains unchanged
- No database migrations were required
- The quality score is calculated on-the-fly in the dashboard
- All existing functionality for quiz results and investment matching is preserved
- The score is not stored in the database, it's computed from stored quiz responses

## Testing

To verify the scoring:
1. Complete the quiz selecting different combinations of answers
2. Check the dashboard to ensure scores reflect the intended weighting:
   - Highest scores (80-100) for accredited investors focused on long-term growth
   - Lower scores (0-39) for non-accredited investors needing short-term liquidity
3. Verify that investment recommendations in the quiz results remain unchanged
