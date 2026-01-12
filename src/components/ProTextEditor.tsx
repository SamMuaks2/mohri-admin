"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function QuillEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
}: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (!editorRef.current || quillRef.current) return;

    // Initialize Quill
    const quill = new Quill(editorRef.current, {
      theme: "snow",
      placeholder,
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    // Set initial content
    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    // Listen for changes
    quill.on("text-change", () => {
      const html = quill.root.innerHTML;
      onChange(html);
    });

    quillRef.current = quill;

    return () => {
      quillRef.current = null;
    };
  }, []);

  // Update content when value prop changes externally
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      const selection = quillRef.current.getSelection();
      quillRef.current.clipboard.dangerouslyPasteHTML(value);
      if (selection) {
        quillRef.current.setSelection(selection);
      }
    }
  }, [value]);

  return (
    <div className="quill-wrapper">
      <div ref={editorRef} />
      <style jsx global>{`
        .quill-wrapper {
          border: 2px solid #d4af37;
          border-radius: 4px;
          overflow: hidden;
        }

        .ql-toolbar.ql-snow {
          background: #000;
          border: none;
          border-bottom: 2px solid #d4af37;
        }

        .ql-container.ql-snow {
          background: #000;
          border: none;
          min-height: 300px;
          max-height: 500px;
          overflow-y: auto;
        }

        .ql-editor {
          color: #fff;
          min-height: 300px;
        }

        .ql-editor.ql-blank::before {
          color: #c0c0c0;
          font-style: normal;
        }

        /* Toolbar button styles */
        .ql-snow .ql-stroke {
          stroke: #d4af37;
        }

        .ql-snow .ql-fill {
          fill: #d4af37;
        }

        .ql-snow .ql-picker-label {
          color: #d4af37;
        }

        .ql-snow .ql-picker-options {
          background: #000;
          border: 1px solid #d4af37;
        }

        .ql-snow .ql-picker-item {
          color: #d4af37;
        }

        .ql-snow .ql-picker-item:hover {
          background: #d4af37;
          color: #000;
        }

        .ql-snow.ql-toolbar button:hover,
        .ql-snow .ql-toolbar button:hover {
          background: #d4af37;
        }

        .ql-snow.ql-toolbar button:hover .ql-stroke,
        .ql-snow .ql-toolbar button:hover .ql-stroke {
          stroke: #000;
        }

        .ql-snow.ql-toolbar button:hover .ql-fill,
        .ql-snow .ql-toolbar button:hover .ql-fill {
          fill: #000;
        }

        .ql-snow.ql-toolbar button.ql-active,
        .ql-snow .ql-toolbar button.ql-active {
          background: #d4af37;
        }

        .ql-snow.ql-toolbar button.ql-active .ql-stroke,
        .ql-snow .ql-toolbar button.ql-active .ql-stroke {
          stroke: #000;
        }

        .ql-snow.ql-toolbar button.ql-active .ql-fill,
        .ql-snow .ql-toolbar button.ql-active .ql-fill {
          fill: #000;
        }

        /* Content styles */
        .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          color: #d4af37;
          margin: 0.67em 0;
        }

        .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          color: #d4af37;
          margin: 0.75em 0;
        }

        .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          color: #d4af37;
          margin: 0.83em 0;
        }

        .ql-editor h4 {
          font-size: 1em;
          font-weight: bold;
          color: #d4af37;
          margin: 1em 0;
        }

        .ql-editor p {
          color: #fff;
          margin: 1em 0;
        }

        .ql-editor ul,
        .ql-editor ol {
          color: #fff;
          margin: 1em 0;
          padding-left: 2em;
        }

        .ql-editor li {
          margin: 0.5em 0;
        }

        .ql-editor a {
          color: #d4af37;
          text-decoration: underline;
        }

        .ql-editor img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
          margin: 1em 0;
        }

        .ql-editor strong {
          font-weight: bold;
        }

        .ql-editor em {
          font-style: italic;
        }

        .ql-editor u {
          text-decoration: underline;
        }

        .ql-editor s {
          text-decoration: line-through;
        }

        .ql-editor blockquote {
          border-left: 4px solid #d4af37;
          padding-left: 1em;
          margin: 1em 0;
          color: #c0c0c0;
        }

        .ql-editor code {
          background-color: #1a1a1a;
          color: #d4af37;
          padding: 0.2em 0.4em;
          border-radius: 3px;
        }

        .ql-editor pre {
          background-color: #1a1a1a;
          color: #fff;
          padding: 1em;
          border-radius: 4px;
          overflow-x: auto;
        }
      `}</style>
    </div>
  );
}