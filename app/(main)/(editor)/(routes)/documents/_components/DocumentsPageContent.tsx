'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { api } from '@/convex/_generated/api';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { PlusCircle } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const DocumentsPageContent = () => {
  const router = useRouter();
  const { user } = useUser();
  const create = useMutation(api.documents.create);
  const onCreate = () => {
    const promise = create({ title: 'Untitled' })
      .then((documentId) => router.push(`${DOCUMENTS_ROUTE}/${documentId}`));
    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-4">
      <Image
        src="/empty.png"
        height={300}
        width={300}
        alt="Empty"
        className="dark:hidden"
      />
      <Image
        src="/empty-dark.png"
        height={300}
        width={300}
        alt="Empty"
        className="hidden dark:block"
      />
      <h2 className="text-lg font-medium">
        Welcome to
        {' '}
        {user?.firstName}
        &apos;s Lotion
      </h2>
      <Button onClick={onCreate}>
        <PlusCircle
          className="h-4 w-4 mr-2"
        />
        Create a note
      </Button>
    </div>
  );
};

export default DocumentsPageContent;