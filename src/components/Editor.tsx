"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useRef } from "react";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: () => void;
  imageToInsert?: string | null;
  onImageInserted?: () => void;
}

export interface EditorRef {
  insertImage: (url: string) => void;
}

export default function Editor({
  content,
  onChange,
  onImageUpload,
  imageToInsert,
  onImageInserted,
}: EditorProps) {
  const hasInsertedRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-accent-primary underline hover:text-accent-primary-hover",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing your post...",
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4",
      },
    },
  });

  useEffect(() => {
    if (imageToInsert && editor && !hasInsertedRef.current) {
      hasInsertedRef.current = true;
      editor.chain().focus().setImage({ src: imageToInsert }).run();
      onImageInserted?.();
    }
    if (!imageToInsert) {
      hasInsertedRef.current = false;
    }
  }, [imageToInsert, editor, onImageInserted]);

  const addImage = useCallback(() => {
    if (onImageUpload) {
      onImageUpload();
    }
  }, [onImageUpload]);

  const setLink = useCallback(() => {
    if (!editor) return;

    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;

    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-border-secondary rounded-lg overflow-hidden">
      <div className="border-b border-border-secondary bg-bg-secondary px-3 py-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bold")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("italic")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 1 })
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 2 })
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("heading", { level: 3 })
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("bulletList")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Bullet List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("orderedList")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Numbered List
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("blockquote")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Quote
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`px-2 py-1 rounded text-sm ${
            editor.isActive("link")
              ? "bg-active-bg text-text-primary"
              : "text-text-muted hover:bg-hover-bg"
          }`}
        >
          Link
        </button>
        <button
          type="button"
          onClick={addImage}
          className="px-2 py-1 rounded text-sm text-text-muted hover:bg-hover-bg"
        >
          Image
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="px-2 py-1 rounded text-sm text-text-muted hover:bg-hover-bg"
        >
          HR
        </button>
      </div>
      <EditorContent editor={editor} className="tiptap" />
    </div>
  );
}
