'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Input } from '@/components/ui/common/shadcn/input';
import useInlineEditing from '@/lib/hooks/useInlineEditing';
import { ChangeEvent, useEffect, useState } from 'react';
import { useMediaQuery } from 'usehooks-ts';
import { cn } from '@/lib/utils';

interface TitleProps {
  doc: Doc<'documents'>;
}

const Title = ({
  doc,
}: TitleProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const {
    inputRef,
    isEditing,
    enableEditing,
    disableEditing,
  } = useInlineEditing();
  const update = useMutation(api.documents.update);
  const [title, setTitle] = useState<string>(doc.title);
  const onChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    setTitle(e.target.value);
    update({
      id: doc._id,
      title: e.target.value || 'Untitled',
    });
  };
  useEffect(() => {
    setTitle(doc.title);
  }, [doc.title]);
  return (
    <div className="flex items-center gap-x-1">
      {doc.icon ? <p>{doc.icon}</p> : null}
      {isEditing ? (
        <Input
          ref={inputRef}
          onClick={enableEditing}
          onBlur={disableEditing}
          value={title}
          onChange={onChange}
          className="h-7 pe-2 focus-visible:ring-transparent border-0 ps-[0.25rem] bg-transparent focus-visible:ring-offset-transparent"
        />
      ) : (
        <Button
          className="font-normal h-auto p-1"
          onClick={enableEditing}
          variant="ghost"
          size="sm"
        >
          <span className={cn('truncate', {
            'max-w-[30vw]': isMobile,
            'max-w-[206px]': !isMobile,
          })}
          >
            {doc.title}
          </span>
        </Button>
      )}
    </div>
  );
};

Title.Skeleton = () => (
  <Skeleton className="h-9 w-20 rounded-md" />
);

export default Title;
