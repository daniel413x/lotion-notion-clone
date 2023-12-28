'use client';

import { useConvexAuth } from 'convex/react';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '@/components/ui/common/LoadingSpinner';
import SettingsModal from './_components/modals/SettingsModal';
import SearchCommandModal from './_components/modals/SearchCommandModal';
import Navigation from './_components/Navigation';

interface EditorLayoutProps {
  children: ReactNode;
}

const EditorLayout = ({
  children,
}: EditorLayoutProps) => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  if (isLoading) {
    return (
      <LoadingSpinner size="lg" center />
    );
  }
  if (!isAuthenticated) {
    return redirect('/');
  }
  return (
    <div className="h-full flex dark:bg-[#1f1f1f]">
      <Navigation />
      <main className="flex-1 h-full overflow-y-auto" tabIndex={-1}>
        <SearchCommandModal />
        <SettingsModal />
        {children}
      </main>
    </div>
  );
};

export default EditorLayout;
