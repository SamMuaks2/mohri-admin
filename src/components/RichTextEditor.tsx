// "use client";

// import { useRef, useEffect, useState } from "react";

// interface RichTextEditorProps {
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
// }

// export default function RichTextEditor({
//   value,
//   onChange,
//   placeholder = "Write your content here...",
// }: RichTextEditorProps) {
//   const editorRef = useRef<HTMLDivElement>(null);
//   const [isFocused, setIsFocused] = useState(false);

//   useEffect(() => {
//     if (editorRef.current && editorRef.current.innerHTML !== value) {
//       editorRef.current.innerHTML = value;
//     }
//   }, [value]);

//   const handleInput = () => {
//     if (editorRef.current) {
//       onChange(editorRef.current.innerHTML);
//     }
//   };

//   const execCommand = (command: string, value?: string) => {
//     document.execCommand(command, false, value);
//     editorRef.current?.focus();
//   };

//   const formatBlock = (tag: string) => {
//     document.execCommand("formatBlock", false, tag);
//     editorRef.current?.focus();
//   };

//   const insertLink = () => {
//     const url = prompt("Enter URL:");
//     if (url) {
//       execCommand("createLink", url);
//     }
//   };

//   const insertImage = () => {
//     const url = prompt("Enter image URL:");
//     if (url) {
//       execCommand("insertImage", url);
//     }
//   };

//   const ToolbarButton = ({
//     onClick,
//     icon,
//     title,
//   }: {
//     onClick: () => void;
//     icon: string;
//     title: string;
//   }) => (
//     <button
//       type="button"
//       onClick={onClick}
//       title={title}
//       className="px-3 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
//     >
//       {icon}
//     </button>
//   );

//   const ToolbarSelect = ({
//     onChange,
//     options,
//     defaultValue,
//   }: {
//     onChange: (value: string) => void;
//     options: { value: string; label: string }[];
//     defaultValue: string;
//   }) => (
//     <select
//       onChange={(e) => onChange(e.target.value)}
//       defaultValue={defaultValue}
//       className="px-3 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
//     >
//       {options.map((option) => (
//         <option key={option.value} value={option.value}>
//           {option.label}
//         </option>
//       ))}
//     </select>
//   );

//   return (
//     <div className="border-2 border-gold rounded overflow-hidden">
//       {/* Toolbar */}
//       <div className="bg-black border-b-2 border-gold p-2 flex flex-wrap gap-2">
//         {/* Text Formatting */}
//         <ToolbarSelect
//           onChange={(value) => formatBlock(value)}
//           defaultValue="p"
//           options={[
//             { value: "p", label: "Paragraph" },
//             { value: "h1", label: "Heading 1" },
//             { value: "h2", label: "Heading 2" },
//             { value: "h3", label: "Heading 3" },
//             { value: "h4", label: "Heading 4" },
//           ]}
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Basic Formatting */}
//         <ToolbarButton
//           onClick={() => execCommand("bold")}
//           icon="B"
//           title="Bold"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("italic")}
//           icon="I"
//           title="Italic"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("underline")}
//           icon="U"
//           title="Underline"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("strikeThrough")}
//           icon="S"
//           title="Strikethrough"
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Alignment */}
//         <ToolbarButton
//           onClick={() => execCommand("justifyLeft")}
//           icon="≡"
//           title="Align Left"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("justifyCenter")}
//           icon="≣"
//           title="Align Center"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("justifyRight")}
//           icon="≢"
//           title="Align Right"
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Lists */}
//         <ToolbarButton
//           onClick={() => execCommand("insertUnorderedList")}
//           icon="•"
//           title="Bullet List"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("insertOrderedList")}
//           icon="1."
//           title="Numbered List"
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Insert */}
//         <ToolbarButton
//           onClick={insertLink}
//           icon="🔗"
//           title="Insert Link"
//         />
//         <ToolbarButton
//           onClick={insertImage}
//           icon="🖼️"
//           title="Insert Image"
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Indentation */}
//         <ToolbarButton
//           onClick={() => execCommand("indent")}
//           icon="→"
//           title="Indent"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("outdent")}
//           icon="←"
//           title="Outdent"
//         />

//         <div className="w-px bg-gold"></div>

//         {/* Utilities */}
//         <ToolbarButton
//           onClick={() => execCommand("removeFormat")}
//           icon="✕"
//           title="Clear Formatting"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("undo")}
//           icon="↶"
//           title="Undo"
//         />
//         <ToolbarButton
//           onClick={() => execCommand("redo")}
//           icon="↷"
//           title="Redo"
//         />
//       </div>

//       {/* Editor */}
//       <div
//         ref={editorRef}
//         contentEditable
//         onInput={handleInput}
//         onFocus={() => setIsFocused(true)}
//         onBlur={() => setIsFocused(false)}
//         className={`min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-black text-white focus:outline-none ${
//           isFocused ? "ring-2 ring-gold" : ""
//         }`}
//         style={{
//           wordWrap: "break-word",
//           overflowWrap: "break-word",
//         }}
//         dangerouslySetInnerHTML={{ __html: value || "" }}
//         data-placeholder={placeholder}
//       />

//       <style jsx>{`
//         [contenteditable]:empty:before {
//           content: attr(data-placeholder);
//           color: #c0c0c0;
//           pointer-events: none;
//           display: block;
//         }

//         /* Editor content styling */
//         [contenteditable] h1 {
//           font-size: 2em;
//           font-weight: bold;
//           color: #d4af37;
//           margin: 0.67em 0;
//         }

//         [contenteditable] h2 {
//           font-size: 1.5em;
//           font-weight: bold;
//           color: #d4af37;
//           margin: 0.75em 0;
//         }

//         [contenteditable] h3 {
//           font-size: 1.17em;
//           font-weight: bold;
//           color: #d4af37;
//           margin: 0.83em 0;
//         }

//         [contenteditable] h4 {
//           font-size: 1em;
//           font-weight: bold;
//           color: #d4af37;
//           margin: 1em 0;
//         }

//         [contenteditable] p {
//           margin: 1em 0;
//         }

//         [contenteditable] ul,
//         [contenteditable] ol {
//           margin: 1em 0;
//           padding-left: 2em;
//         }

//         [contenteditable] li {
//           margin: 0.5em 0;
//         }

//         [contenteditable] a {
//           color: #d4af37;
//           text-decoration: underline;
//         }

//         [contenteditable] img {
//           max-width: 100%;
//           height: auto;
//           border-radius: 4px;
//           margin: 1em 0;
//         }

//         [contenteditable] strong {
//           font-weight: bold;
//         }

//         [contenteditable] em {
//           font-style: italic;
//         }

//         [contenteditable] u {
//           text-decoration: underline;
//         }

//         [contenteditable] s {
//           text-decoration: line-through;
//         }
//       `}</style>
//     </div>
//   );
// }



"use client";

import { useRef, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import TurndownService from "turndown";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onMarkdownChange?: (markdown: string) => void; // Optional live markdown
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder = "Write your content here...",
  onMarkdownChange,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const undoStack = useRef<string[]>([]);
  const redoStack = useRef<string[]>([]);
  const turndownService = new TurndownService();

  // Sync value prop with editor content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  // Handle content input
  const handleInput = () => {
    if (!editorRef.current) return;
    const sanitized = DOMPurify.sanitize(editorRef.current.innerHTML);
    undoStack.current.push(sanitized);
    redoStack.current = [];
    onChange(sanitized);

    if (onMarkdownChange) {
      onMarkdownChange(turndownService.turndown(sanitized));
    }
  };

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const formatBlock = (tag: string) => {
    document.execCommand("formatBlock", false, tag);
    editorRef.current?.focus();
    handleInput();
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) execCommand("createLink", url);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) execCommand("insertImage", url);
  };

  const undo = () => {
    if (undoStack.current.length > 0) {
      const last = undoStack.current.pop()!;
      redoStack.current.push(editorRef.current!.innerHTML);
      editorRef.current!.innerHTML = last;
      onChange(last);
      if (onMarkdownChange) onMarkdownChange(turndownService.turndown(last));
    }
  };

  const redo = () => {
    if (redoStack.current.length > 0) {
      const next = redoStack.current.pop()!;
      undoStack.current.push(editorRef.current!.innerHTML);
      editorRef.current!.innerHTML = next;
      onChange(next);
      if (onMarkdownChange) onMarkdownChange(turndownService.turndown(next));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Enter handling for lists
    if (e.key === "Enter") {
      const selection = window.getSelection();
      if (!selection) return;

      const parent = selection.anchorNode?.parentElement;
      if (parent?.tagName === "LI") {
        e.preventDefault();
        document.execCommand("insertHTML", false, "<li><br></li>");
      }
    }

    // Ctrl+Z / Ctrl+Y for undo/redo
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      e.preventDefault();
      undo();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "y") {
      e.preventDefault();
      redo();
    }
  };

  const ToolbarButton = ({
    onClick,
    icon,
    title,
  }: {
    onClick: () => void;
    icon: string;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-3 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
    >
      {icon}
    </button>
  );

  const ToolbarSelect = ({
    onChange,
    options,
    defaultValue,
  }: {
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
    defaultValue: string;
  }) => (
    <select
      onChange={(e) => onChange(e.target.value)}
      defaultValue={defaultValue}
      className="px-3 py-2 bg-black border border-gold text-gold rounded hover:bg-gold hover:text-black transition-colors text-sm font-semibold"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  return (
    <div className="border-2 border-gold rounded overflow-hidden">
      {/* Toolbar */}
      <div className="bg-black border-b-2 border-gold p-2 flex flex-wrap gap-2">
        <ToolbarSelect
          onChange={(v) => formatBlock(v)}
          defaultValue="p"
          options={[
            { value: "p", label: "Paragraph" },
            { value: "h1", label: "Heading 1" },
            { value: "h2", label: "Heading 2" },
            { value: "h3", label: "Heading 3" },
            { value: "h4", label: "Heading 4" },
          ]}
        />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={() => execCommand("bold")} icon="B" title="Bold" />
        <ToolbarButton onClick={() => execCommand("italic")} icon="I" title="Italic" />
        <ToolbarButton onClick={() => execCommand("underline")} icon="U" title="Underline" />
        <ToolbarButton onClick={() => execCommand("strikeThrough")} icon="S" title="Strikethrough" />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={() => execCommand("justifyLeft")} icon="≡" title="Align Left" />
        <ToolbarButton onClick={() => execCommand("justifyCenter")} icon="≣" title="Align Center" />
        <ToolbarButton onClick={() => execCommand("justifyRight")} icon="≢" title="Align Right" />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={() => execCommand("insertUnorderedList")} icon="•" title="Bullet List" />
        <ToolbarButton onClick={() => execCommand("insertOrderedList")} icon="1." title="Numbered List" />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={insertLink} icon="🔗" title="Insert Link" />
        <ToolbarButton onClick={insertImage} icon="🖼️" title="Insert Image" />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={() => execCommand("indent")} icon="→" title="Indent" />
        <ToolbarButton onClick={() => execCommand("outdent")} icon="←" title="Outdent" />
        <div className="w-px bg-gold"></div>
        <ToolbarButton onClick={() => execCommand("removeFormat")} icon="✕" title="Clear Formatting" />
        <ToolbarButton onClick={undo} icon="↶" title="Undo" />
        <ToolbarButton onClick={redo} icon="↷" title="Redo" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
        className={`min-h-[300px] max-h-[500px] overflow-y-auto p-4 bg-black text-white focus:outline-none ${
          isFocused ? "ring-2 ring-gold" : ""
        }`}
        style={{
          wordWrap: "break-word",
          overflowWrap: "break-word",
        }}
        dangerouslySetInnerHTML={{ __html: value || "" }}
        data-placeholder={placeholder}
      />

      <style jsx>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #c0c0c0;
          pointer-events: none;
          display: block;
        }
        [contenteditable] h1 { font-size:2em; font-weight:bold; color:#d4af37; margin:0.67em 0; }
        [contenteditable] h2 { font-size:1.5em; font-weight:bold; color:#d4af37; margin:0.75em 0; }
        [contenteditable] h3 { font-size:1.17em; font-weight:bold; color:#d4af37; margin:0.83em 0; }
        [contenteditable] h4 { font-size:1em; font-weight:bold; color:#d4af37; margin:1em 0; }
        [contenteditable] p { margin:1em 0; }
        [contenteditable] ul, [contenteditable] ol { margin:1em 0; padding-left:2em; }
        [contenteditable] li { margin:0.5em 0; }
        [contenteditable] a { color:#d4af37; text-decoration:underline; }
        [contenteditable] img { max-width:100%; height:auto; border-radius:4px; margin:1em 0; }
        [contenteditable] strong { font-weight:bold; }
        [contenteditable] em { font-style:italic; }
        [contenteditable] u { text-decoration:underline; }
        [contenteditable] s { text-decoration:line-through; }
      `}</style>
    </div>
  );
}
