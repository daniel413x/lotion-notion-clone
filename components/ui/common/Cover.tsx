'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEdgeStore } from '@/lib/edgestore';
import useCoverImageModal from '@/app/(main)/(editor)/(routes)/documents/[docId]/_components/modals/useCoverImageModal';
import { Button } from './shadcn/button';
import { Skeleton } from './shadcn/skeleton';

interface CoverProps {
  coverImage?: string;
  preview?: boolean;
  params: {
    docId: Id<'documents'>,
  }
}

const Cover = ({
  coverImage,
  preview,
  params,
}: CoverProps) => {
  const { edgestore } = useEdgeStore();
  const {
    onReplace,
  } = useCoverImageModal();
  const removeCoverImage = useMutation(api.documents.removeCoverImage);
  const onRemove = () => {
    if (params?.docId && coverImage) {
      removeCoverImage({
        id: params.docId,
      });
      edgestore.publicFiles.delete({
        url: coverImage,
      });
    }
  };
  return (
    <div
      className={cn('relative w-full h-[35vh] group', {
        'h-[12vh]': !coverImage,
        'bg-muted': coverImage,
      })}
    >
      {coverImage ? (
        <Image
          src={coverImage}
          fill
          alt="Cover"
          className="object-cover"
        />
      ) : null}
      {coverImage && !preview ? (
        <div className="opacity-0 group-hover:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 z-10">
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={() => onReplace(coverImage)}
          >
            <ImageIcon className="x-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={onRemove}
          >
            <X className="x-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      ) : null}
    </div>
  );
};

Cover.Skeleton = () => (
  <Skeleton className="w-full h-[12vh]" />
);

export default Cover;
