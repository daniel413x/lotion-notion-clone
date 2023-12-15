'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { SignInButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';

const Navbar = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div>
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
  );
};

export default Navbar;
