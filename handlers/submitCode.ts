export const submitCode = async (source_code: string): Promise<string> => {
  const response = await fetch("/api/code/submitCode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source_code }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit code");
  }

  const data = await response.json();
  return data.token;
};
