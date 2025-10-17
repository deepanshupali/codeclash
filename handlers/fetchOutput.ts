import { decodeBase64 } from "./base64";

export interface Judge0Response {
  stdout?: string | null;
  stderr?: string | null;
  compile_output?: string | null;
  message?: string | null;
  status: {
    id: number;
    description: string;
  };
}

export const fetchOutput = async (submissionToken: string): Promise<string> => {
  const pollJudge0 = async (): Promise<Judge0Response> => {
    const response = await fetch("/api/code/getResult", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: submissionToken }),
    });

    if (!response.ok) throw new Error("Failed to fetch output");

    const data = (await response.json()) as Judge0Response;

    // Keep polling while status is "In Queue" or "Processing"
    if (data.status?.id === 1 || data.status?.id === 2) {
      await new Promise((r) => setTimeout(r, 1000)); // wait 1 sec
      return await pollJudge0();
    }

    return data;
  };

  const result = await pollJudge0();

  // Handle output types
  if (result.stdout) return decodeBase64(result.stdout);
  if (result.stderr) return decodeBase64(result.stderr);
  if (result.compile_output) return decodeBase64(result.compile_output);
  if (result.message) return decodeBase64(result.message);

  return "No output";
};
