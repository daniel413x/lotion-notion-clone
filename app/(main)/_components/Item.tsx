'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/common/shadcn/dropdown-menu';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { cn } from '@/lib/utils';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import {
  ChevronDown, ChevronRight, LucideIcon, MoreHorizontal, Plus, Trash,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { MouseEvent } from 'react';
import { toast } from 'sonner';

interface ItemProps {
  id?: Id<'documents'>;
  documentIcon?: string;
  expanded?: boolean;
  level?: number;
  isSearch?: boolean;
  isTrash?: boolean;
  active?: boolean;
  onExpand?: () => void;
  onClick?: () => void;
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
  isTrash,
  expanded,
  level,
}: ItemProps) => {
  const router = useRouter();
  const { user } = useUser();
  const ChevronIcon = expanded ? ChevronDown : ChevronRight;
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
      .then((documentId) => {
        if (!expanded) {
          onExpand?.();
        }
        router.push(`/${DOCUMENTS_ROUTE}/${documentId}`);
        toast.promise(promise, {
          loading: 'Creating a new note...',
          success: 'New note created!',
          error: 'Failed to create a new note.',
        });
      });
  };
  const archive = useMutation(api.documents.archive);
  const onArchive = (e: MouseEvent) => {
    e.stopPropagation();
    if (!id) {
      return;
    }
    const promise = archive({ id })
      .then(() => {
        router.push(`/${DOCUMENTS_ROUTE}`);
      });
    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    });
  };
  return (
    <div
      style={{ paddingLeft: `${level ? (level * 12) + 12 : '12'}px` }}
      className={cn('relative bg-transparent group min-h-[27px] text-sm pr-3 py-1 w-full hover:bg-primary/5 flex text-muted-foreground font-medium justify-start items-center', {
        'bg-primary/5 text-primary': active,
      })}
    >
      {isTrash ? null : (
        <Button
          variant="blank"
          className="inset-0 absolute w-full h-full"
          onClick={onClick}
        />
      )}
      {!!id && (
      <Button
        className="p-0 z-10 w-4 h-4 hover:bg-neutral-300 dark:hover:bg-neutral-600"
        variant="ghost"
        onClick={handleExpand}
      >
        <ChevronIcon />
      </Button>
      )}
      {documentIcon ? (
        <div className="shrink-0 ps-0.5 mr-2 h-[18px] w-[24px] text-[18px]">
          {documentIcon}
        </div>
      ) : (
        <Icon
          className={cn('shrink-0 h-[18px] mr-2 text-muted-foreground', {
            'h-5': isSearch,
          })}
        />
      )}
      <span className="truncate">
        {label}
      </span>
      {isSearch && (
        <kbd
          className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border dark:border-white/5 bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100"
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
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => e.stopPropagation()}
            >
              <Button
                className="p-0 opacity-0 group-hover:opacity-100 h-full ml-auto rounded-sm bg-transparent hover:bg-neutral-300 dark:hover:bg-neutral-600 z-10"
              >
                <MoreHorizontal
                  className="h-4 w-4 text-muted-foreground"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60" align="start" side="right" forceMount>
              <DropdownMenuItem onClick={onArchive}>
                <Trash
                  className="h-4 w-4 mr-2"
                />
                Delete
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <div className="text-xs text-muted-foreground p-2">
                Last edited by:
                {' '}
                {user?.fullName}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
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
