"use client";
import { useState, useEffect } from "react";

export default function QuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [bulkInput, setBulkInput] = useState("");

  useEffect(() => {
    fetch("/api/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }, []);

  // Parse single question block
  function parseBlock(block) {
    const lines = block.trim().split("\n");
    let data = {
      title: "",
      description: "",
      difficulty: "easy",
      input: "",
      output: "",
      expectedOutput: "",
      starterCode: "",
    };
    let codeMode = false;

    lines.forEach((line) => {
      if (line.startsWith("Title:"))
        data.title = line.replace("Title:", "").trim();
      else if (line.startsWith("Description:"))
        data.description = line.replace("Description:", "").trim();
      else if (line.startsWith("Difficulty:"))
        data.difficulty = line.replace("Difficulty:", "").trim();
      else if (line.startsWith("Input:"))
        data.input = line.replace("Input:", "").trim();
      else if (line.startsWith("Output:"))
        data.output = line.replace("Output:", "").trim();
      else if (line.startsWith("ExpectedOutput:"))
        data.expectedOutput = line.replace("ExpectedOutput:", "").trim();
      else if (line.startsWith("StarterCode:")) codeMode = true;
      else if (codeMode) data.starterCode += line + "\n";
    });
    return data;
  }

  async function handleBulkImport() {
    const blocks = bulkInput.split("---"); // support multiple
    for (const block of blocks) {
      const q = parseBlock(block);
      if (!q.title) continue;
      await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(q),
      });
    }
    alert("✅ Bulk import done!");
    setBulkInput("");
    fetch("/api/questions")
      .then((res) => res.json())
      .then(setQuestions);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Bulk Import Questions</h1>

      <textarea
        className="w-full border p-2 rounded"
        rows={10}
        placeholder="Paste multiple questions here separated by ---"
        value={bulkInput}
        onChange={(e) => setBulkInput(e.target.value)}
      ></textarea>

      <button
        onClick={handleBulkImport}
        className="bg-black text-white px-4 py-2 rounded"
      >
        ⚡ Import Questions
      </button>

      <h2 className="text-xl font-bold">All Questions</h2>
      <ul className="space-y-3">
        {questions.map((q) => (
          <li key={q.id} className="p-4 border rounded bg-white shadow">
            <strong>{q.title}</strong>{" "}
            <em className="text-sm">({q.difficulty})</em>
          </li>
        ))}
      </ul>
    </div>
  );
}
