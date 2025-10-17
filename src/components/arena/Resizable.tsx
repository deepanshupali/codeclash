"use client";
// components/ResizableCode.tsx
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "./CodeEditor";

import CodeOutput from "./CodeOutput";
// import { useCodeExecution } from "@/hooks/useCodeExecution";
// import CodeEditor from "./CodeEditor";
// import CodeOutput from "./CodeOutput";
export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  input?: string | null;
  output?: string | null;
  expectedOutput?: string | null;
  starterCode?: string | null;
  createdAt: Date; // ✅ Fix
  updatedAt: Date; // ✅ Fix
}

interface ResizableCodeProps {
  question?: Question;
}

export function ResizableCode({ question }: ResizableCodeProps) {
  const [code, setCode] = useState<string>(question?.starterCode || "");
  // const { status, output, executeCode } = useCodeExecution(question);

  return (
    <div className="h-[94%]">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        {/* <ResizablePanel defaultSize={50}>
          <div className="flex h-screen items-center justify-center p-6 bg-gray-900">
            <div className="bg-gray-800 shadow-md rounded-lg p-6 max-w-lg w-full">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">
                Question
              </h2>
              <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 mb-4">
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  Difficulty:{" "}
                  <span className="font-normal">{question?.difficulty}</span>
                </p>
                <p className="text-lg font-semibold text-gray-300 mb-2">
                  Description:
                </p>
                <p className="text-base text-gray-200 mb-4">
                  {question?.description}
                </p>
                <div className="bg-gray-600 p-4 rounded-lg border border-gray-500">
                  <p className="text-base font-semibold text-gray-300 mb-2">
                    Example Input:
                  </p>
                  <p className="text-base text-gray-200 mb-4">
                    {question?.input}
                  </p>
                  <p className="text-base font-semibold text-gray-300">
                    Example Output:
                  </p>
                  <p className="text-base text-gray-200">{question?.output}</p>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel> */}
        <ResizablePanel defaultSize={50}>
          <div className="h-screen overflow-y-auto bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-200 p-6">
            {question ? (
              <div className="max-w-2xl mx-auto">
                {/* TITLE */}
                <h1 className="text-2xl font-bold mb-2">{question.title}</h1>

                {/* DIFFICULTY TAG */}
                <span
                  className={`text-sm px-2 py-1 rounded ${
                    question.difficulty === "easy"
                      ? "bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300"
                      : question.difficulty === "medium"
                        ? "bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                        : "bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300"
                  }`}
                >
                  {question.difficulty.toUpperCase()}
                </span>

                {/* DESCRIPTION */}
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-1">Description</h2>
                  <p className="leading-relaxed text-gray-800 dark:text-gray-300">
                    {question.description}
                  </p>
                </div>

                {/* EXAMPLE INPUT/OUTPUT */}
                {(question.input || question.output) && (
                  <div className="mt-6 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-4">
                    <h3 className="font-semibold text-md mb-2">Example</h3>
                    {question.input && (
                      <p className="mb-2">
                        <span className="font-bold">Input:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">
                          {question.input}
                        </span>
                      </p>
                    )}
                    {question.output && (
                      <p>
                        <span className="font-bold">Output:</span>{" "}
                        <span className="text-gray-700 dark:text-gray-300">
                          {question.output}
                        </span>
                      </p>
                    )}
                  </div>
                )}

                {/* EXPECTED OUTPUT */}
                {question.expectedOutput && (
                  <div className="mt-4 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-4">
                    <h3 className="font-semibold text-md mb-2">
                      Expected Output
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">
                      {question.expectedOutput}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 mt-10">
                Loading question...
              </p>
            )}
          </div>
        </ResizablePanel>

        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={25}>
              <CodeEditor
                initialCode={question?.starterCode || ""}
                onCodeChange={setCode}
                onLanguageChange={() => {}}
              />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <CodeOutput ans={question?.output || ""} code={code} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
