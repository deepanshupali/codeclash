"use client";
// components/CodeEditor.tsx
import Editor, { OnMount } from "@monaco-editor/react";
import { useRef, useState } from "react";
import prettier from "prettier";
import pluginJava from "prettier-plugin-java";
import LanguageSelector from "./LanguageSelector";
import { FaMagic } from "react-icons/fa";

interface CodeEditorProps {
  initialCode: string;
  onCodeChange: (value: string) => void;
  onLanguageChange: (language: string) => void;
}

export default function CodeEditor({
  initialCode,
  onCodeChange,
  onLanguageChange,
}: CodeEditorProps) {
  const [language, setLanguage] = useState<string>("java");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor;

    // ✅ Auto format when the editor loads
    setTimeout(() => {
      formatCode();
    }, 200);
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onLanguageChange(newLanguage);
  };

  const formatCode = async () => {
    if (!editorRef.current) return;
    const unformattedCode = editorRef.current.getValue();

    try {
      let formatted = unformattedCode;

      if (language === "java") {
        formatted = await prettier.format(unformattedCode, {
          parser: "java",
          plugins: [pluginJava],
        });
      }

      // ✅ Safely update editor content
      editorRef.current.executeEdits("", [
        {
          range: editorRef.current.getModel().getFullModelRange(),
          text: formatted,
          forceMoveMarkers: true,
        },
      ]);
    } catch (error) {
      console.error("Formatting failed:", error);
      alert("Java formatting failed. Check your syntax.");
    }
  };

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-2">
        <LanguageSelector onLanguageChange={handleLanguageChange} />
        <button
          onClick={formatCode}
          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center"
          title="Format Code"
        >
          <FaMagic size={18} />
        </button>
      </div>

      <Editor
        theme="vs-dark"
        language={language}
        value={initialCode}
        onChange={(value) => onCodeChange(value || "")}
        onMount={handleEditorDidMount}
        width="100%"
        height="100%"
      />
    </div>
  );
}
