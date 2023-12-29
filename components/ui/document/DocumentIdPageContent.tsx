'use client';

import Toolbar from '@/components/ui/common/Toolbar';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import Cover from '@/components/ui/common/Cover';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import CoverImageModal from '@/app/(main)/(editor)/(routes)/documents/[docId]/_components/modals/CoverImageModal';
import { useDocumentTitle } from 'usehooks-ts';

interface DocumentIdPageContentProps {
  params: {
    docId: Id<'documents'>;
  };
  preview?: boolean;
}

const DocumentIdPageContent = ({
  params,
  preview,
}: DocumentIdPageContentProps) => {
  const Editor = useMemo(() => dynamic(() => import('@/components/ui/common/Editor'), { ssr: false }), []);
  const doc = useQuery(api.documents.getById, {
    docId: params.docId,
  });
  // update document title and icon dynamically if changed in the editor
  useDocumentTitle(doc?.title || 'Untitled');
  useEffect(() => {
    const favicon = document.querySelector('link[rel~=\'icon\']') as HTMLLinkElement;
    if (favicon && doc?.iconUrl && doc.iconUrl !== favicon.href) {
      favicon.href = doc.iconUrl;
    }
  }, [doc?.iconUrl]);
  const update = useMutation(api.documents.update);
  const wrapperStyle = cn('relative md:max-w-3xl lg:max-w-4xl mx-auto', {
    'bottom-14': doc?.icon,
    'top-2': !doc?.icon,
  });
  if (doc === undefined) {
    return (
      <div>
        <Cover.Skeleton />
        <div className={cn(wrapperStyle, 'mt-10')}>
          <div className="space-y-4 pl-8 pt-4">
            <Skeleton className="h-14 w-[50%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-[40%]" />
            <Skeleton className="h-4 w-[60%]" />
          </div>
        </div>
      </div>
    );
  }
  if (doc === null) {
    return (
      <div>
        Not found
      </div>
    );
  }
  const onChange = (content: string) => {
    update({
      id: params.docId,
      content,
    });
  };
  return (
    <>
      <CoverImageModal />
      <div className="h-full pb-40 dark:bg-[#1f1f1f]">
        <Cover
          coverImage={doc.coverImage}
          params={params}
          preview={preview}
        />
        <div className={wrapperStyle}>
          <Toolbar doc={doc} preview={preview} />
          <Editor
            onChange={onChange}
            content={doc.content || ''}
            editable={!preview}
          />
        </div>
      </div>
    </>
  );
};

export default DocumentIdPageContent;
