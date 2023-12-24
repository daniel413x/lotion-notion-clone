'use client';

import Toolbar from '@/components/ui/common/Toolbar';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import Cover from '@/components/ui/common/Cover';
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
  if (document === undefined) {
    return (
      <div>
        Loading...
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
        <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
          <Toolbar document={document} />
        </div>
      </div>
    </>
  );
};

export default DocumentIdPageContent;
