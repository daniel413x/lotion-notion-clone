'use client';

import Toolbar from '@/components/ui/common/Toolbar';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';

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
    <div className="pb-40">
      <div className="h-[35vh]" />
      <div className="md:max-w-3xl lg:max-w-4xl mx-auto">
        <Toolbar document={document} />
      </div>
    </div>
  );
};

export default DocumentIdPageContent;
