'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useMutation } from 'convex/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ConfirmModal from './modals/ConfirmModal';

interface BannerProps {
  documentId: Id<'documents'>;
}

const Banner = ({
  documentId,
}: BannerProps) => {
  const router = useRouter();
  const restore = useMutation(api.documents.restore);
  const onRestore = () => {
    const promise = restore({ id: documentId });
    toast.promise(promise, {
      loading: 'Restoring note...',
      success: 'Note restored!',
      error: 'Could not restore note',
    });
  };
  const remove = useMutation(api.documents.remove);
  const onRemove = () => {
    const promise = remove({ id: documentId });
    toast.promise(promise, {
      loading: 'Deleted note...',
      success: 'Note deleted!',
      error: 'Could not delete note',
    });
    router.push(`/${DOCUMENTS_ROUTE}`);
  };
  return (
    <div className="w-full bg-rose-500 text-center text-sm p-2 text-white flex items-center gap-x-2 justify-center">
      <p>
        This page is in the trash.
      </p>
      <Button
        className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
        size="sm"
        variant="outline"
        onClick={onRestore}
      >
        Restore page
      </Button>
      <ConfirmModal
        onConfirm={onRemove}
      >
        <Button
          className="border-white bg-transparent hover:bg-primary/5 text-white hover:text-white p-1 px-2 h-auto font-normal"
          size="sm"
          variant="outline"
        >
          Delete forever
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default Banner;
