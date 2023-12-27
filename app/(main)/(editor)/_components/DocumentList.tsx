import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useQuery } from 'convex/react';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import Item from './Item';

interface DocumentListProps {
  parentDocumentId?: Id<'documents'>;
  level?: number;
}

const DocumentList = ({
  parentDocumentId,
  level,
}: DocumentListProps) => {
  const params = useParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const onExpand = (docId: string) => {
    setExpanded((prev) => ({
      ...prev,
      [docId]: !prev[docId],
    }));
  };
  const documents = useQuery(api.documents.getSidebar, {
    parentDocument: parentDocumentId,
  });
  if (documents === undefined) {
    return (
      <>
        <Item.Skeleton level={level} />
        {level === 0 ? (
          <>
            <Item.Skeleton level={level} />
            <Item.Skeleton level={level} />
          </>
        ) : null}
      </>
    );
  }
  const onRedirect = (docId: string) => {
    router.push(`/${DOCUMENTS_ROUTE}/${docId}`);
  };
  return (
    <>
      <p
        className={cn(
          'hidden text-sm font-medium text-muted-foreground/80',
          {
            'last:block': expanded,
            hidden: level === 0,
          },
        )}
        style={{ paddingLeft: level ? `${(level * 12) + 25}px` : undefined }}
      >
        No pages inside
      </p>
      {documents.map((d) => (
        <div key={d._id}>
          <Item
            id={d._id}
            onClick={() => onRedirect(d._id)}
            label={d.title}
            icon={FileIcon}
            documentIcon={d.icon}
            active={params.docId === d._id}
            level={level}
            onExpand={() => onExpand(d._id)}
            expanded={expanded[d._id]}
          />
          {!expanded[d._id] ? null : (
            <DocumentList
              parentDocumentId={d._id}
              level={(level || 0) + 1}
            />
          )}
        </div>
      ))}
    </>
  );
};

export default DocumentList;
