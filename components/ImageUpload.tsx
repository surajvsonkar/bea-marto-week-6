'use client';

import { useState } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  currentUrl?: string | null;
}

export function ImageUpload({ onFileSelect, currentUrl }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const clear = () => {
    setPreview(null);
    onFileSelect(null);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`
        relative rounded-xl border-2 border-dashed transition-all duration-200 overflow-hidden
        ${dragOver ? 'border-brand-400 bg-brand-500/10' : 'border-white/10 hover:border-white/20'}
        ${preview ? 'p-0' : 'p-8'}
      `}
    >
      {preview ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
          <button
            type="button"
            onClick={clear}
            className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center cursor-pointer">
          <div className="w-12 h-12 rounded-xl bg-surface-800/50 flex items-center justify-center mb-3">
            <ImageIcon className="w-6 h-6 text-surface-400" />
          </div>
          <p className="text-sm text-surface-300 mb-1">
            <span className="text-brand-400 font-medium">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-surface-500">PNG, JPG up to 5MB</p>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
}
