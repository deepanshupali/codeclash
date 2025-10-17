import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = process.env.RAPIDAPI_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "RAPIDAPI_KEY is not set" },
      { status: 500 }
    );
  }

  try {
    const { source_code, language_id = 91 } = await request.json();

    const response = await fetch(
      "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*",
      {
        method: "POST",
        headers: {
          "x-rapidapi-key": apiKey,
          "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language_id,
          source_code: Buffer.from(source_code).toString("base64"),
          stdin: "SnVkZ2Uw",
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to submit code");
    }

    const result = await response.json();
    return NextResponse.json({ token: result.token }, { status: 200 });
  } catch (error) {
    console.error("Error submitting code:", error);
    return NextResponse.json(
      { message: "Error submitting code" },
      { status: 500 }
    );
  }
}
