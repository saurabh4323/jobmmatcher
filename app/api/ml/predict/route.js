import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    
    // Proxy request to FastAPI server running on port 8000
    const response = await fetch("http://localhost:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.detail || "FastAPI Server Error" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Connection to FastAPI failed:", error);
    return NextResponse.json(
      { error: "Could not connect to FastAPI server. Make sure it is running on port 8000." },
      { status: 503 }
    );
  }
}
