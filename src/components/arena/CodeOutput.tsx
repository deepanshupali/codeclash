"use client";

import { useState } from "react";
import { fetchOutput } from "handlers/fetchOutput";
import { submitCode } from "handlers/submitCode";
import { MoonLoader } from "react-spinners";

interface CodeOutputProps {
  ans: string;
  code: string;
}

export default function CodeOutput({ ans, code }: CodeOutputProps) {
  const [status, setStatus] = useState<string | null>(null);
  const [output, setOutput] = useState<string>("");
  const [resultMessage, setResultMessage] = useState<string | null>(null);
  const [hasRun, setHasRun] = useState<boolean>(false);

  async function handleRun() {
    try {
      setStatus("Running");
      setOutput("");
      setResultMessage(null);
      setHasRun(false);

      const token = await submitCode(code);
      const result = await fetchOutput(token);

      setOutput(result);
      setStatus("Finished");
      setHasRun(true);
    } catch (error) {
      setStatus("Error");
      setOutput("⚠️ Something went wrong while running the code.");
      setHasRun(false);
    }
  }

  async function handleSubmit() {
    setResultMessage(null);

    if (output.trim() === ans.trim()) {
      setResultMessage("✅ Accepted");
    } else {
      setResultMessage("❌ Wrong Answer");
    }
  }

  return (
    <div className="bg-[#1e1e1e] h-full flex flex-col p-4 rounded-md border border-gray-700 text-white">
      {/* Buttons */}
      <div className="flex gap-3 mb-4">
        <button
          onClick={handleRun}
          className="bg-[#2b8efb] hover:bg-[#1f6ec9] transition px-4 py-2 rounded-md font-semibold"
        >
          Run Code
        </button>
        <button
          onClick={handleSubmit}
          disabled={!hasRun}
          className={`px-4 py-2 rounded-md font-semibold transition ${
            hasRun
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-600 cursor-not-allowed"
          }`}
        >
          Submit
        </button>
      </div>

      {/* Output Section */}
      <div className="bg-[#151515] flex-1 p-4 rounded-md border border-gray-700">
        <h2 className="text-sm font-bold text-gray-300 mb-2">Output</h2>

        {status === "Running" ? (
          <div className="flex items-center gap-3">
            <MoonLoader size={20} />
            <span>Running...</span>
          </div>
        ) : (
          <pre className="text-sm whitespace-pre-wrap">
            {output || "➡ Click 'Run Code' to see output here..."}
          </pre>
        )}

        {resultMessage && (
          <div
            className={`mt-4 px-4 py-2 rounded-md text-sm font-bold ${
              resultMessage === "✅ Accepted"
                ? "bg-green-800 text-green-300"
                : "bg-red-800 text-red-300"
            }`}
          >
            {resultMessage}
          </div>
        )}
      </div>
    </div>
  );
}
