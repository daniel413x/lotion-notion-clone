'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/common/shadcn/popover';
import { api } from '@/convex/_generated/api';
import { Doc } from '@/convex/_generated/dataModel';
import { PREVIEW_ROUTE } from '@/lib/data/routes';
import useOrigin from '@/lib/hooks/useOrigin';
import { useMutation } from 'convex/react';
import { Check, Copy, Globe } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface PublishProps {
  doc: Doc<'documents'>;
}

const Publish = ({
  doc,
}: PublishProps) => {
  const origin = useOrigin();
  const update = useMutation(api.documents.update);
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const url = `${origin}/${PREVIEW_ROUTE}/${doc._id}`;
  const onPublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: doc._id,
      isPublished: true,
    })
      .finally(() => setIsSubmitting(false));
    toast.promise(promise, {
      loading: 'Publishing...',
      success: 'Note published!',
      error: 'Failed to publish note.',
    });
  };
  const onUnpublish = () => {
    setIsSubmitting(true);
    const promise = update({
      id: doc._id,
      isPublished: false,
    })
      .finally(() => setIsSubmitting(false));
    toast.promise(promise, {
      loading: 'Unpublishing...',
      success: 'Note unpublished!',
      error: 'Failed to unpublish note.',
    });
  };
  const onCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost">
          Publish
          {`${doc.isPublished ? 'ed' : ' '}`}
          {doc.isPublished ? (
            <Globe
              className="text-sky-500 w-4 h-4 ml-2"
            />
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-72"
        align="end"
        alignOffset={8}
        forceMount
      >
        {doc.isPublished ? (
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <Globe className="text-sky-500 animate-pulse h-4 w-4" />
              <p className="text-xs font-medium text-sky-500">
                This note is live on the web.
              </p>
            </div>
            <div className="flex items-center">
              <input
                className="flex-1 px-2 text-xs border rounded-l-md h-8 bg-muted truncate focus:outline-none"
                value={url}
                readOnly
              />
              <Button
                onClick={onCopy}
                className="h-8 rounded-l-none"
                disabled={copied}
              >
                {copied ? (
                  <Check
                    className="h-4 w-4"
                  />
                ) : (
                  <Copy
                    className="h-4 w-4"
                  />
                )}
              </Button>
            </div>
            <Button
              className="w-full text-xs"
              size="sm"
              disabled={isSubmitting}
              onClick={onUnpublish}
            >
              Unpublish
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <Globe
              className="h-8 w-8 text-muted-foreground mb-2"
            />
            <p className="text-sm font-medium mb-2">
              Publish this note
            </p>
            <span className="text-xs text-muted-foreground mb-4">
              Share your work with others.
            </span>
            <Button
              className="w-full text-xs"
              size="sm"
              onClick={onPublish}
            >
              Publish
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default Publish;
