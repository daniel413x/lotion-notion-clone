'use client';

import { useConvexAuth } from 'convex/react';
import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import LoadingSpinner from '../../components/ui/common/LoadingSpinner';
import Navigation from './_components/Navigation';
import SearchCommandModal from './_components/modals/SearchCommandModal';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({
  children,
}: MainLayoutProps) => {
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
      <main className="flex-1 h-full overflow-y-auto">
        <SearchCommandModal />
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
