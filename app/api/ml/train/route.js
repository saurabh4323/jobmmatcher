import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = await fetch("http://localhost:8000/train", {
      method: "POST",
    });

    if (!response.ok) {
        return NextResponse.json({ error: "Training failed" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "FastAPI server unreachable" }, { status: 503 });
  }
}
