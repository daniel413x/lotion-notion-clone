'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import useScrollTop from '@/lib/hooks/useScrollTop';
import { cn } from '@/lib/utils';
import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import { ModeToggle } from '@/components/ui/common/ModeToggle';
import Logo from './Logo';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();
  return (
    <div className={cn('z-50 bg-background dark:bg-[#1f1f1f] fixed top-0 flex items-center w-full p-6', scrolled && 'border-b shadow-sm')}>
      <Logo />
      <div className="md:ml-auto md:justify-end justify-between w-full flex items-center gap-x-2">
        <ModeToggle />
        {!isAuthenticated && !isLoading ? (
          <>
            <SignInButton mode="modal">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button size="sm">
                Get Lotion free
              </Button>
            </SignInButton>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
