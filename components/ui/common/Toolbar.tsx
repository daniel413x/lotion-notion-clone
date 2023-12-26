'use client';

import { Doc } from '@/convex/_generated/dataModel';
import { ImageIcon, Smile, X } from 'lucide-react';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ChangeEvent, useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';
import useCoverImageModal from '@/app/(main)/(editor)/(routes)/documents/[documentId]/_components/modals/useCoverImageModal';
import { Button } from './shadcn/button';
import IconPicker from './IconPicker';

interface ToolbarProps {
  document: Doc<'documents'>;
  preview?: boolean;
}

const Toolbar = ({
  document,
  preview,
}: ToolbarProps) => {
  const {
    onOpen,
  } = useCoverImageModal();
  const [title, setTitle] = useState<string>(document.title);
  const update = useMutation(api.documents.update);
  const removeIcon = useMutation(api.documents.removeIcon);
  const onInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setTitle(e.target.value);
    update({
      id: document._id,
      title: e.target.value || 'Untitled',
    });
  };
  const onIconSelect = (icon: string) => {
    update({
      id: document._id,
      icon,
    });
  };
  const onRemoveIcon = () => {
    removeIcon({
      id: document._id,
    });
  };
  return (
    <div
      className="pl-[54px] group relative"
    >
      {/* document owner view */}
      {(document.icon && !preview) ? (
        <div className="flex items-center gap-x-2 group/icon pt-6">
          <IconPicker
            onChange={onIconSelect}
          >
            <p className="text-6xl hover:opacity-75 transition">
              {document.icon}
            </p>
          </IconPicker>
          <Button
            className="rounded-full opacity-0 group-hover/icon:opacity-100 transition text-muted-foreground text-xs group-focus-within:opacity-100"
            onClick={onRemoveIcon}
            variant="outline"
            size="icon"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : null}
      {/* guest view */}
      {(document.icon && preview) ? (
        <p className="text-6xl pt-6">
          {document.icon}
        </p>
      ) : null}
      <div className="absolute -top-12 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 flex items-center gap-x-1 py-4">
        {(!document.icon && !preview) ? (
          <IconPicker
            onChange={onIconSelect}
            asChild
          >
            <Button
              variant="outline"
              size="sm"
              className="text-muted-foreground text-xs"
            >
              <Smile className="h-4 w-4 mr-2" />
              Add icon
            </Button>
          </IconPicker>
        ) : null}
        {(!document.coverImage && !preview) ? (
          <Button
            onClick={onOpen}
            className="text-muted-foreground text-xs"
            variant="outline"
            size="sm"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Add cover image
          </Button>
        ) : null}
      </div>
      <TextareaAutosize
        value={title}
        onChange={onInput}
        className="mt-4 text-5xl bg-transparent font-bold break-words outline-none text-[#3f3f3f] dark:text-[#cfcfcf] resize-none"
        readOnly={preview}
      />
    </div>
  );
};

export default Toolbar;
