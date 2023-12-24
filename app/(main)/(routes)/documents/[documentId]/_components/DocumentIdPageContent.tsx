'use client';

import Toolbar from '@/components/ui/common/Toolbar';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import Cover from '@/components/ui/common/Cover';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import CoverImageModal from './modals/CoverImageModal';

interface DocumentIdPageContentProps {
  params: {
    documentId: Id<'documents'>;
  };
}

const DocumentIdPageContent = ({
  params,
}: DocumentIdPageContentProps) => {
  const document = useQuery(api.documents.getById, {
    documentId: params.documentId,
  });
  const wrapperStyle = 'md:max-w-3xl lg:max-w-4xl mx-auto';
  if (document === undefined) {
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
  if (document === null) {
    return (
      <div>
        Not found
      </div>
    );
  }
  return (
    <>
      <CoverImageModal />
      <div className="pb-40">
        <Cover
          coverImage={document.coverImage}
          params={params}
          preview={false}
        />
        <div className={wrapperStyle}>
          <Toolbar document={document} />
        </div>
      </div>
    </>
  );
};

export default DocumentIdPageContent;
