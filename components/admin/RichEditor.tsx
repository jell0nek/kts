"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { useEffect } from "react"
import { cn } from "@/lib/utils"

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
  className?: string
}

function ToolBtn({
  active, onClick, title, children,
}: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "px-2 py-1 text-xs rounded font-medium transition-colors",
        active ? "bg-navy-900 text-white" : "text-neutral-600 hover:bg-neutral-200"
      )}
    >
      {children}
    </button>
  )
}

export function RichEditor({ content, onChange, placeholder, className }: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [StarterKit],
    content,
    onUpdate({ editor }) {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "outline-none min-h-32 px-3 py-2.5 text-sm text-neutral-800 leading-relaxed",
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  return (
    <div className={cn("border border-neutral-300 rounded-lg overflow-hidden bg-white", className)}>
      {editor && (
        <div className="flex flex-wrap items-center gap-0.5 border-b border-neutral-200 px-2 py-1.5 bg-neutral-50">
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Pogrubienie">
            <strong>B</strong>
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Kursywa">
            <em>I</em>
          </ToolBtn>
          <div className="w-px h-4 bg-neutral-300 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Nagłówek H2">
            H2
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive("heading", { level: 3 })} title="Nagłówek H3">
            H3
          </ToolBtn>
          <div className="w-px h-4 bg-neutral-300 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Lista">
            • Lista
          </ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Lista numerowana">
            1. Lista
          </ToolBtn>
          <div className="w-px h-4 bg-neutral-300 mx-1" />
          <ToolBtn onClick={() => editor.chain().focus().setParagraph().run()} active={editor.isActive("paragraph")} title="Akapit">
            ¶
          </ToolBtn>
        </div>
      )}
      <EditorContent editor={editor} placeholder={placeholder} />
    </div>
  )
}
