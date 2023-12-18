'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useMutation } from 'convex/react';
import {
  ChevronDown, ChevronUp, LucideIcon, Plus,
} from 'lucide-react';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  expanded?: boolean;
  level?: number;
  isSearch?: boolean;
  active?: boolean;
  onExpand?: () => void;
  onClick: () => void;
  icon: LucideIcon;
  label: string;
}

const Item = ({
  id,
  onClick,
  icon: Icon,
  label,
  active,
  onExpand,
  documentIcon,
  isSearch,
  expanded,
  level,
}: ItemProps) => {
  console.log(active);
  const ChevronIcon = expanded ? ChevronDown : ChevronUp;
  const handleExpand = (e: MouseEvent) => {
    e.stopPropagation();
    onExpand?.();
  };
  const create = useMutation(api.documents.create);
  const onCreate = (e: MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      return;
    }
    const promise = create({ title: 'Untitled', parentDocument: id })
      .then(() => {
        if (!expanded) {
          onExpand?.();
        }
        toast.promise(promise, {
          loading: 'Creating a new note...',
          success: 'New note created!',
          error: 'Failed to create a new note.',
        });
      });
  };
  return (
    <div
      style={{ paddingLeft: `${level ? (level * 12) + 12 : '12'}px` }}
      className="relative bg-transparent group min-h-[27px] text-sm pr-3 py-1 w-full hover:bg-primary/5 flex text-muted-foreground font-medium justify-start items-center"
    >
      <Button
        variant="blank"
        className="inset-0 absolute w-full h-full"
        onClick={onClick}
      />
      {!!id && (
      <Button
        className="p-0 z-10 w-4 h-4"
        variant="ghost"
        onClick={handleExpand}
      >
        <ChevronIcon />
      </Button>
      )}
      {documentIcon ? (
        <div className="shrink-0 mr-2 text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon
          className="shrink-0 h-[18px] mr-2 text-muted-foreground"
        />
      )}
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
        >
          <span
            className="text-xs pt-0.5"
          >
            &#8984;
          </span>
          <span>
            K
          </span>
        </kbd>
      )}
      {!id ? null : (
        <div className="ml-auto flex items-center gap-x-2">
          <Button
            className="p-0 opacity-0 group-hover:opacity-100 h-4 w-4 ml-auto rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 z-10"
            variant="ghost"
            onClick={onCreate}
          >
            <Plus
              className="h-4 w-4 text-muted-foreground"
            />
          </Button>
        </div>
      )}
    </div>
  );
};

Item.Skeleton = ({
  level,
}: Pick<ItemProps, 'level'>) => (
  <div
    style={{ paddingLeft: `${level ? (level * 12) + 25 : '12'}px` }}
    className="flex items-center gap-x-2 pt-2"
  >
    <Skeleton className="h-4 w-4 bg-neutral-300" />
    <Skeleton className="h-4 w-[30%] bg-neutral-300" />
  </div>
);

export default Item;
