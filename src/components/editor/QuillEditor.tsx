'use client';

import QuillWrapper from './QuillWrapper';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  return (
    <div className="bg-gray-800 rounded-md">
      <QuillWrapper
        value={value}
        onChange={onChange}
        className="bg-gray-800 text-white"
      />
    </div>
  );
} 