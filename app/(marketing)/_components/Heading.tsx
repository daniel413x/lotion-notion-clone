'use client';

import { Button } from '@/components/ui/common/shadcn/button';
import { useConvexAuth } from 'convex/react';
import { ArrowRight } from 'lucide-react';
import { SignInButton } from '@clerk/clerk-react';
import Link from 'next/link';
import { DOCUMENTS_ROUTE } from '@/lib/data/routes';
import LoadingSpinner from './LoadingSpinner';

const Heading = () => {
  const { isAuthenticated, isLoading } = useConvexAuth();
  return (
    <div className="max-w-3xl space-y-4">
      <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold">
        Your Ideas, Documents & Plans. Unified. Welcome to
        {' '}
        <span className="underline">
          Lotion
        </span>
      </h1>
      <h3 className="text-base sm:text-xl md:text-2xl">
        Lotion is the connected workspace where
        {' '}
        <br />
        {' '}
        better, faster work happens.
      </h3>
      {isLoading ? (
        <LoadingSpinner
          size="lg"
          center
        />
      ) : null}
      {isAuthenticated && !isLoading && (
      <Button asChild>
        <Link
          href={`/${DOCUMENTS_ROUTE}`}
        >
          Enter Lotion
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
      )}
      {!isAuthenticated && !isLoading && (
        <SignInButton mode="modal">
          <Button>
            Get Lotion free
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </SignInButton>
      )}
    </div>
  );
};

export default Heading;
