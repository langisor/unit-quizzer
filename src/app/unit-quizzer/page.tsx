 import { JSONProvider } from "@/unit-quizzer/json-provider/json.provider";
import { QuizQuestion } from "@/unit-quizzer/types/quiz.types";
export default async function Home() {
  console.log("Home page");
 
  const quiz = await JSONProvider.load<QuizQuestion[]>("unit-1-test.json");
  console.log("Quiz:", quiz);
  return (
    <main className="min-h-screen min-h-[100dvh] bg-[#0f0e0b]">
      <h1 className="text-4xl">Unit Quizzer</h1>
    </main>
  );
}
 