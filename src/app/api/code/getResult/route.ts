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
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json(
        { message: "Submission token is required" },
        { status: 400 }
      );
    }

    const url = `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=true&fields=*`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch submission result");
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Error fetching submission result:", error);
    return NextResponse.json(
      { message: "Error fetching submission result" },
      { status: 500 }
    );
  }
}
