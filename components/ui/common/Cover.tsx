'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { ImageIcon, X } from 'lucide-react';
import { Id } from '@/convex/_generated/dataModel';
import { api } from '@/convex/_generated/api';
import { useMutation } from 'convex/react';
import { useEdgeStore } from '@/lib/edgestore';
import useCoverImageModal from '@/app/(main)/(editor)/(routes)/documents/[docId]/_components/modals/useCoverImageModal';
import useTapShow from '@/lib/hooks/useTapShow';
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
  const {
    handleClick,
    isMobile,
    ref,
    show: showButtons,
  } = useTapShow();
  const { edgestore } = useEdgeStore();
  const {
    onReplace,
    onOpen,
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
        'h-[284.9px]': !coverImage,
        'bg-muted': coverImage,
      })}
      ref={ref}
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
        <div className={cn('opacity-0 group-hover:opacity-100 focus-within:opacity-100 absolute bottom-5 right-5 flex items-center gap-x-2 z-10', {
          'opacity-100': isMobile && showButtons,
        })}
        >
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={() => handleClick(() => onReplace(coverImage))}
          >
            <ImageIcon className="x-4 w-4 mr-2" />
            Change cover
          </Button>
          <Button
            className="text-muted-foreground text-xs"
            size="sm"
            variant="outline"
            onClick={() => handleClick(onRemove)}
          >
            <X className="x-4 w-4 mr-2" />
            Remove
          </Button>
        </div>
      ) : null}
      <Button
        className={cn('absolute inset-0 w-full h-full', {
          'pointer-events-none': preview,
        })}
        variant="blank"
        tabIndex={-1}
        onClick={() => (!coverImage && !preview ? onOpen() : handleClick())}
      />
    </div>
  );
};

Cover.Skeleton = () => (
  <Skeleton className="w-full h-[12vh]" />
);

export default Cover;
