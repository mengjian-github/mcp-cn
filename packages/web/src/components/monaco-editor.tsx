'use client';

import dynamic from 'next/dynamic';
import { FC } from 'react';
import { type EditorProps } from '@monaco-editor/react';

const MonacoEditor = dynamic(
  () => {
    if (typeof window === 'undefined') {
      return Promise.resolve(() => null);
    }
    return import('@monaco-editor/react').then((mod) => {
      const { default: Editor } = mod;
      return (props: EditorProps) => (
        <Editor
          {...props}
          loading={
            <div className="w-full h-full flex items-center justify-center bg-gray-50">
              <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
            </div>
          }
        />
      );
    });
  },
  {
    ssr: false,
  }
);

export const ClientMonacoEditor: FC<EditorProps> = (props) => {
  return <MonacoEditor {...props} />;
}; 