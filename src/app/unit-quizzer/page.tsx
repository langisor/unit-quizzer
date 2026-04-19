import { quizService } from "@/quizzers/services/quiz.services";
import { UnitQuizzer } from "@/quizzers/components/unit-quizzer";
 
export default async function Home() {
  const quizzes = await quizService.getAll();
 console.log("question 1: ", quizzes[0]);
  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0f0e0b]">
      <h1 className="text-4xl">Unit Quizzer</h1>
      <UnitQuizzer quiz={quizzes} />
    </main>
  );
}
 