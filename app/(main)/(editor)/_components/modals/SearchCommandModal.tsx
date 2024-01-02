'use client';

import { api } from '@/convex/_generated/api';
import useHasMounted from '@/lib/hooks/useHasMounted';
import { useUser } from '@clerk/clerk-react';
import { useQuery } from 'convex/react';
import { useRouter } from 'next/navigation';
import { File } from 'lucide-react';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import { useEffect } from 'react';
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '@/components/ui/common/shadcn/command';
import useSearchModal from '../../_hooks/useSearchModal';

const SearchCommandModal = () => {
  const { user } = useUser();
  const router = useRouter();
  const documents = useQuery(api.documents.getSearch);
  const { isOpen, onClose, toggle } = useSearchModal();
  const onSelect = (id: string) => {
    router.push(`/${DOCUMENTS_ROUTE}/${id}`);
    onClose();
  };
  useEffect(() => {
    const kDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };
    document.addEventListener('keydown', kDown);
    return () => document.removeEventListener('keydown', kDown);
  }, [toggle]);
  if (!useHasMounted()) return null;
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput
        placeholder={`Search ${user?.fullName}'s Lotion`}
      />
      <CommandList>
        <CommandEmpty>
          No results found.
        </CommandEmpty>
        <CommandGroup heading="Documents">
          {documents?.map((d) => (
            <CommandItem
              key={d._id}
              value={`${d._id}-${d.title}`}
              title={d.title}
              onSelect={onSelect}
            >
              {d.icon ? (
                <p className="mr-2 text-[18px]">
                  {d.icon}
                </p>
              ) : (
                <File className="mr-2 h-4 w-4" />
              )}
              {d.title}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};

export default SearchCommandModal;
