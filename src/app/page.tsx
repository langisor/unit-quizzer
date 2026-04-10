import UnitQuiz from "@/data/unit-1-test.json";
import UnitQuizzer from "@/components/unit-quizzer/unit-quizzer";

export default function Home() {
  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0f0e0b]">
      <UnitQuizzer quiz={UnitQuiz.quiz} unitTitle="الوحدة الأولى" />
    </main>
  );
}
