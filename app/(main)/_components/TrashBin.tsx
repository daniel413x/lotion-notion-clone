'use client';

import ConfirmModal from '@/components/modals/ConfirmModal';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import { Button } from '@/components/ui/common/shadcn/button';
import { Input } from '@/components/ui/common/shadcn/input';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useMutation, useQuery } from 'convex/react';
import { Search, Trash, Undo } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { toast } from 'sonner';

const TrashBin = () => {
  const router = useRouter();
  const params = useParams();
  const documents = useQuery(api.documents.getArchived);
  const restore = useMutation(api.documents.restore);
  const remove = useMutation(api.documents.remove);
  const [search, setSearch] = useState('');
  const filteredDocuments = documents?.filter((d) => d.title.toLowerCase().includes(search.toLowerCase()));
  const onClick = (documentId: string) => {
    router.push(`/${DOCUMENTS_ROUTE}/${documentId}`);
  };
  const onRestore = (
    e: MouseEvent,
    documentId: Id<'documents'>,
  ) => {
    e.stopPropagation();
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Failed to restore note.',
    });
  };
  const onRemove = (
    documentId: Id<'documents'>,
  ) => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: 'Deleting note...',
      success: 'Note Deleted!',
      error: 'Failed to delete note.',
    });
    if (params.documentId === documentId) {
      router.push(`/${DOCUMENTS_ROUTE}`);
    }
  };
  if (documents === undefined) {
    return (
      <LoadingSpinner size="lg" center />
    );
  }
  return (
    <div className="text-sm">
      <div className="flex items-center gap-x-1 p-2">
        <Search className="h-4 w-4" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-7 px-2 focus-visible:ring-transparent bg-secondary"
          placeholder="Filter by page title..."
        />
      </div>
      <ul className="mt-2 px-1 pb-1">
        <p className="hidden last:block text-xs text-center text-muted-foreground pb-2">
          No documents found.
        </p>
        {filteredDocuments?.map((d) => (
          <li key={d._id}>
            <div
              className="relative p-0 text-sm rounded-sm w-full hover:bg-primary/5 flex items-center text-primary justify-between h-max"
            >
              <Button
                className="absolute w-full h-full inset-0"
                variant="blank"
                onClick={() => onClick(d._id)}
              />
              <span className="truncate pl-2">
                {d.title}
              </span>
              <div className="flex items-center">
                <Button
                  className="rounded-sm p-2 hover:bg-neutral-200 z-10"
                  onClick={(e) => onRestore(e, d._id)}
                  variant="blank"
                >
                  <Undo className="h-4 w-4 text-muted-foreground" />
                </Button>
                <ConfirmModal
                  onConfirm={() => onRemove(d._id)}
                >
                  <Button
                    className="rounded-sm p-2 hover:bg-neutral-200 z-10"
                    variant="blank"
                  >
                    <Trash className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </ConfirmModal>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TrashBin;
