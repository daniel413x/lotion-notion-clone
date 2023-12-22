'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/common/shadcn/dropdown-menu';
import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useUser } from '@clerk/clerk-react';
import { useMutation } from 'convex/react';
import { MoreHorizontal, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface CommandsMenuProps {
  documentId: Id<'documents'>;
}

const CommandsMenu = ({
  documentId,
}: CommandsMenuProps) => {
  const router = useRouter();
  const { user } = useUser();
  const archive = useMutation(api.documents.archive);
  const onArchive = () => {
    const promise = archive({ id: documentId });
    toast.promise(promise, {
      loading: 'Moving to trash...',
      success: 'Note moved to trash!',
      error: 'Failed to archive note.',
    });
    router.push(`/${DOCUMENTS_ROUTE}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-60"
        align="end"
        alignOffset={8}
        forceMount
      >
        <DropdownMenuItem onClick={onArchive}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
          <DropdownMenuSeparator />
        </DropdownMenuItem>
        <div className="text-xs text-muted-foreground p-2">
          Last edited by:
          {' '}
          {user?.fullName}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

CommandsMenu.Skeleton = () => (
  <Skeleton className="h-10 w-10 rounded-md" />
);

export default CommandsMenu;
