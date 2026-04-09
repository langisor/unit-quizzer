import { NextRequest, NextResponse } from "next/server";
import { quizService } from "@/lib/services/quiz-service";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get("filename") || "unit-1-test.json";
  const shuffle = searchParams.get("shuffle") === "true";

  const result = await quizService.getQuiz(filename, shuffle);

  if (!result.success) {
    return NextResponse.json({ error: result.error }, { status: 404 });
  }

  return NextResponse.json(result.data);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, data } = body;

    if (!filename || !data) {
      return NextResponse.json(
        { error: "Missing filename or data" },
        { status: 400 }
      );
    }

    const result = await quizService.saveQuiz(filename, data);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
