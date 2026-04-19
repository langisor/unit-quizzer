import { nounsService } from "@/quizzers/services/nouns.services";
import { UnitQuizzer } from "@/quizzers/components/unit-quizzer";

export default async function NounsQuizPage() {
  const quizzes = await nounsService.getAll(50);

  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0f0e0b]">
      <UnitQuizzer quiz={quizzes} unitTitle="اختبار الأسماء" />
    </main>
  );
}