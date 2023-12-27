'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import { Input } from '@/components/ui/common/shadcn/input';
import useInlineEditing from '@/lib/hooks/useInlineEditing';
import { ChangeEvent, useState } from 'react';

interface TitleProps {
  doc: Doc<'documents'>;
}

const Title = ({
  doc,
}: TitleProps) => {
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
          className="h-7 pe-2 focus-visible:ring-transparent border-0 ps-[0.25rem]"
        />
      ) : (
        <Button
          className="font-normal h-auto p-1"
          onClick={enableEditing}
          variant="ghost"
          size="sm"
        >
          <span className="truncate">
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
