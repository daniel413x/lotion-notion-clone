import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { type ClassValue, clsx } from 'clsx';
import { ConvexHttpClient } from 'convex/browser';
import { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateDocumentPageMetadata: (docId: Id<'documents'>) => Promise<Metadata> = async (docId: Id<'documents'>) => {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const doc = await convex.query(api.documents.getById, {
    docId,
    metadata: true,
  });
  const metadata: Metadata = {
    title: doc?.title || 'Untitiled',
  };
  if (doc?.iconUrl) {
    metadata.icons = {
      icon: doc.iconUrl,
    };
  }
  return metadata;
};
