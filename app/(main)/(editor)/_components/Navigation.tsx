'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { cn } from '@/lib/utils';
import {
  ChevronsLeft, Plus, PlusCircle, Search, Settings, Trash,
} from 'lucide-react';
import { useParams, usePathname, useRouter } from 'next/navigation';
import {
  MouseEvent, useEffect, useRef, useState,
} from 'react';
import { useMediaQuery, useWindowSize, useEventListener } from 'usehooks-ts';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/common/shadcn/popover';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import useTrackRefDimensions from '@/lib/hooks/useTrackRefDimensions';
import useSearchModal from '../_hooks/useSearchModal';
import UserItem from './UserItem';
import Item from './Item';
import DocumentList from './DocumentList';
import TrashBin from './TrashBin';
import useSettingsModal from '../_hooks/useSettingsModal';
import Navbar from './Navbar';
import MenuButton from './MenuButton';

const Navigation = () => {
  const { width: bodyWidth } = useWindowSize();
  const router = useRouter();
  const create = useMutation(api.documents.create);
  const pathname = usePathname();
  const params = useParams();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isResizingRef = useRef(false);
  const {
    ref: sidebarRef,
    width: sidebarW,
  } = useTrackRefDimensions();
  const {
    ref: navbarRef,
  } = useTrackRefDimensions();
  const handleResize = () => {
    if (navbarRef.current) {
      navbarRef.current.style.setProperty('width', `${bodyWidth - sidebarW}px`);
    }
  };
  useEventListener('resize', handleResize);
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const handleResizerMouseMove = (e: MouseEvent) => {
    if (!isResizingRef.current) {
      return;
    }
    if (!isMobile && sidebarRef.current && navbarRef.current) {
      let newWidth = e.clientX;
      if (newWidth < 240) {
        newWidth = 240;
      }
      if (newWidth > 480) {
        newWidth = 480;
      }
      sidebarRef.current.style.setProperty('width', `${newWidth}px`);
      navbarRef.current.style.setProperty('left', `${newWidth}px`);
      navbarRef.current.style.setProperty('width', `${bodyWidth - newWidth}px`);
    }
  };
  const handleResizerMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener('mousemove', handleResizerMouseMove as any);
    document.removeEventListener('mouseup', handleResizerMouseUp);
  };
  const handleResizerMouseDown = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    e.preventDefault();
    isResizingRef.current = true;
    document.addEventListener('mousemove', handleResizerMouseMove as any);
    document.addEventListener('mouseup', handleResizerMouseUp);
  };
  const resetWidth = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(false);
      setIsResetting(true);
      sidebarRef.current.style.setProperty('width', isMobile ? '100%' : '240px');
      navbarRef.current.style.setProperty('width', isMobile ? '0' : 'calc(100% - 240px)');
      navbarRef.current.style.setProperty('left', isMobile ? '100%' : '240px');
      setTimeout(() => setIsResetting(false), 300);
    }
  };
  const collapse = () => {
    if (sidebarRef.current && navbarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);
      sidebarRef.current.style.setProperty('width', '0');
      navbarRef.current.style.setProperty('width', '100%');
      navbarRef.current.style.setProperty('left', '0');
      setTimeout(() => setIsResetting(false), 300);
    }
  };
  const { onOpen: onOpenSearch } = useSearchModal();
  const { onOpen: onOpenSettings } = useSettingsModal();
  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);
  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  const handleCreate = () => {
    const promise = create({
      title: 'Untitled',
    })
      .then((docId) => router.push(`/${DOCUMENTS_ROUTE}/${docId}`));
    toast.promise(promise, {
      loading: 'Creating a new note...',
      success: 'New note created!',
      error: 'Failed to create a new note.',
    });
  };
  return (
    <>
      <aside
        ref={sidebarRef}
        className={cn('group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[9999]', {
          'transition-all ease-in-out duration-300': isResetting,
          'w-0': isMobile,
        })}
      >
        <Button
          className={cn('text-muted-foreground rounded-sm hover:bg-neutral-300 focus:hover:bg-neutral-300 focus:bg-neutral-300 dark:hover:bg-neutral-600 dark:focus:bg-neutral-600 absolute top-3 right-2 opacity-0  group-hover/sidebar:opacity-100 group-focus/sidebar:opacity-100 focus:opacity-100 transition h-6 w-6', {
            'opacity-100': isMobile,
          })}
          variant="ghost"
          size="icon"
          onClick={collapse}
        >
          <ChevronsLeft
            className="h-6 w-6"
          />
        </Button>
        <div>
          <UserItem />
          <Item
            onClick={onOpenSearch}
            label="Search"
            icon={Search}
            isSearch
          />
          <Item
            onClick={onOpenSettings}
            label="Settings"
            icon={Settings}
          />
          <Item
            onClick={handleCreate}
            label="New page"
            icon={PlusCircle}
          />
        </div>
        <div className="mt-4">
          <DocumentList />
          <Item
            onClick={handleCreate}
            label="Add a page"
            icon={Plus}
          />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} isTrash />
            </PopoverTrigger>
            <PopoverContent
              side={isMobile ? 'bottom' : 'right'}
              className="p-0 w-72"
            >
              <TrashBin />
            </PopoverContent>
          </Popover>
        </div>
        <Button
          onMouseDown={handleResizerMouseDown}
          onClick={resetWidth}
          className="p-0 opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 hover:bg-primary/10 right-0 top-0"
          tabIndex={-1}
        />
      </aside>
      <div
        className={cn(
          'absolute top-0 z-[99999] left-60 w-[calc(100%-240px)]',
          {
            'transition-all ease-in-out duration-300': isResetting,
            'left-0 w-full': isMobile,
          },
        )}
        ref={navbarRef}
      >
        {params.docId ? (
          <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        ) : (
          <nav className="bg-transparent px-3 py-2 w-full">
            <MenuButton onResetWidth={resetWidth} isCollapsed={isCollapsed} />
          </nav>
        )}
      </div>
    </>
  );
};

export default Navigation;
