"use client";
import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import CodeEditor from "./CodeEditor";
import CodeOutput from "./CodeOutput";
import { Button } from "../ui/button";
import { Sparkles } from "lucide-react";

export interface Question {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  input?: string | null;
  output?: string | null;
  expectedOutput?: string | null;
  starterCode?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface ResizableCodeProps {
  question?: Question;
}

export function ResizableCode({ question }: ResizableCodeProps) {
  const [code, setCode] = useState<string>(question?.starterCode || "");
  const [hint, setHint] = useState<string>("");

  // Placeholder AI hint function
  const getHint = () => {
    setHint(
      "✨ Think about handling edge cases first before coding the solution!"
    );
  };

  return (
    <div className="h-[90vh]">
      <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
        <ResizablePanel defaultSize={50}>
          <div className="h-screen overflow-y-auto bg-white dark:bg-[#0f0f0f] text-gray-900 dark:text-gray-200 p-6">
            {question ? (
              <div className="max-w-2xl mx-auto">
                {/* Title */}
                <h1 className="text-2xl font-bold mb-2">{question.title}</h1>

                {/* Difficulty */}
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

                {/* Get Hint Button */}
                <div className="mt-6">
                  <Button
                    onClick={getHint}
                    className="relative overflow-hidden group bg-gradient-to-r from-purple-600 via-pink-500 to-indigo-500 text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-500"
                  >
                    <span className="absolute inset-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.4),transparent_60%)] opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
                    <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                    Reveal AI Hint
                  </Button>
                </div>

                {/* AI Hint Reveal */}
                {hint && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/30 text-purple-100 shadow-lg animate-in fade-in slide-in-from-top-2 duration-700">
                    <p className="text-sm">{hint}</p>
                  </div>
                )}
                {/* Description */}
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-1">Description</h2>
                  <p className="leading-relaxed">{question.description}</p>
                </div>

                {/* Example Input/Output */}
                {(question.input || question.output) && (
                  <div className="mt-6 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-4">
                    <h3 className="font-semibold text-md mb-2">Example</h3>
                    {question.input && (
                      <p className="mb-2">
                        <span className="font-bold">Input:</span>{" "}
                        {question.input}
                      </p>
                    )}
                    {question.output && (
                      <p>
                        <span className="font-bold">Output:</span>{" "}
                        {question.output}
                      </p>
                    )}
                  </div>
                )}

                {/* Expected Output */}
                {question.expectedOutput && (
                  <div className="mt-4 bg-gray-100 dark:bg-[#1a1a1a] border border-gray-300 dark:border-gray-700 rounded p-4">
                    <h3 className="font-semibold text-md mb-2">
                      Expected Output
                    </h3>
                    <p>{question.expectedOutput}</p>
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
        <ResizablePanel defaultSize={75}>
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel defaultSize={80}>
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
