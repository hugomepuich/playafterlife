'use client';

import { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';

interface QuillWrapperProps {
  value: string;
  onChange: (value: string) => void;
  modules?: any;
  theme?: string;
  className?: string;
}

export default function QuillWrapper({ 
  value, 
  onChange, 
  className = "bg-gray-800 text-white"
}: QuillWrapperProps) {
  const [mounted, setMounted] = useState(false);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Synchroniser la valeur externe avec l'éditeur
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="h-64 bg-gray-800 rounded-md animate-pulse" />;
  }

  return (
    <div className={`tiptap-editor-wrapper ${className}`}>
      <div className="tiptap-toolbar border-b border-medieval-ethereal/30 p-2 flex flex-wrap gap-2">
        <button 
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('bold') ? 'bg-medieval-700' : ''}`}
        >
          <span className="font-bold">B</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('italic') ? 'bg-medieval-700' : ''}`}
        >
          <span className="italic">I</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('heading', { level: 2 }) ? 'bg-medieval-700' : ''}`}
        >
          <span className="font-bold">H2</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('heading', { level: 3 }) ? 'bg-medieval-700' : ''}`}
        >
          <span className="font-bold">H3</span>
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('bulletList') ? 'bg-medieval-700' : ''}`}
        >
          • Liste
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('orderedList') ? 'bg-medieval-700' : ''}`}
        >
          1. Liste
        </button>
        <button 
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-medieval-700 ${editor?.isActive('blockquote') ? 'bg-medieval-700' : ''}`}
        >
          "Quote"
        </button>
      </div>
      
      <EditorContent editor={editor} className="p-4 min-h-[12rem] prose prose-invert max-w-none" />
    </div>
  );
} 