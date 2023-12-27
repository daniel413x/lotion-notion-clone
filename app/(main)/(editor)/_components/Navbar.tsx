import { Skeleton } from '@/components/ui/common/shadcn/skeleton';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import MenuButton from './MenuButton';
import Title from './Title';
import Banner from './Banner';
import CommandsMenu from './CommandsMenu';
import Publish from './Publish';

interface NavbarProps {
  isCollapsed: boolean;
  onResetWidth: () => void;
}

const Navbar = ({
  isCollapsed,
  onResetWidth,
}: NavbarProps) => {
  const params = useParams();
  const doc = useQuery(api.documents.getById, {
    docId: params.docId as Id<'documents'>,
  });
  const navbarStyling = 'bg-background dark:bg-[#1f1f1f] py-2 px-3 w-full flex items-center justify-between';
  if (doc === undefined) {
    return (
      <nav className={cn(navbarStyling, 'justify-between')}>
        <Title.Skeleton />
        <CommandsMenu.Skeleton />
      </nav>
    );
  }
  if (doc === null) {
    return null;
  }
  return (
    <>
      <nav className={cn(navbarStyling, 'gap-x-4 transition')}>
        <MenuButton isCollapsed={isCollapsed} onResetWidth={onResetWidth} />
        <div className="flex items-center justify-between w-full">
          <Title doc={doc} />
          <div className="flex items-center gap-x-2">
            <Publish doc={doc} />
            <CommandsMenu docId={doc._id} />
          </div>
        </div>
      </nav>
      {doc.isArchived ? (
        <Banner docId={doc._id} />
      ) : null}
    </>
  );
};

Navbar.Skeleton = () => (
  <div
    className="flex items-center gap-x-2 pt-2"
  >
    <Skeleton className="h-4 w-4 bg-neutral-300" />
    <Skeleton className="h-4 w-[30%] bg-neutral-300" />
  </div>
);

export default Navbar;
