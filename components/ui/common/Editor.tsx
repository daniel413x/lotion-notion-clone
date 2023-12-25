'use client';

import '@blocknote/core/style.css';
import {
  BlockNoteEditor,
} from '@blocknote/core';
import {
  BlockNoteView,
  useBlockNote,
} from '@blocknote/react';
import { useTheme } from 'next-themes';
import { useEdgeStore } from '@/lib/edgestore';

interface EditorProps {
  content: string;
  onChange: (str: string) => void;
  editable?: boolean;
}

const Editor = ({
  content,
  onChange,
  editable,
}: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { edgestore } = useEdgeStore();
  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });
    return res.url;
  };
  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: content ? JSON.parse(content) : undefined,
    onEditorContentChange: (ctxEditor) => {
      onChange(JSON.stringify(ctxEditor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });
  return (
    <BlockNoteView
      className="mt-4"
      editor={editor}
      theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
    />
  );
};

export default Editor;
