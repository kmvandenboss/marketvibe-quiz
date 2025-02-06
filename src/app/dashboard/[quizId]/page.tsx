// /src/app/dashboard/[quizId]/page.tsx
import { DashboardContent } from '@/components/dashboard/DashboardContent';

export default function QuizDashboardPage({ params }: { params: { quizId: string } }) {
  return <DashboardContent quizId={params.quizId} />;
}