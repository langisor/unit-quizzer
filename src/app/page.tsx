import UnitQuiz from "@/data/unit-1-test.json";
import UnitQuizzer from "@/components/unit-quizzer/unit-quizzer";
import Unit100Questions from "@/data/unit-1-100-questions.json";
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* <UnitQuizzer quiz={UnitQuiz.quiz} unitTitle="الوحدة الأولى" /> */}
      <UnitQuizzer quiz={Unit100Questions.quiz} unitTitle="الوحدة الأولى" />
    </div>
  );
}
